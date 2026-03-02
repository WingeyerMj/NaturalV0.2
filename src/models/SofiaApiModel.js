/**
 * ═══════════════════════════════════════════════════════════
 * NATURALFOOD - Sofia API Model
 * Handles JSON data from Sofia Platform (Jornales & Cosecha)
 * ═══════════════════════════════════════════════════════════
 */

export class SofiaApiModel {
    static DATA_JORNALES = [];
    static DATA_COSECHA = [];

    /**
     * Extracts Hectares and Plants from Sofia's cuartel string
     * e.g. "21 - Ha:2.200, Pl:3584" -> { ha: 2.2, pl: 3584 }
     */
    static parseCuartelInfo(cuartelStr) {
        if (!cuartelStr) return { ha: 0, pl: 0, code: '?', predio: '', variedad: '' };

        const parts = cuartelStr.split('-').map(p => p.trim());
        const code = parts[0] || '?';
        const predio = parts[1] || '';
        const variedad = parts[2] && !parts[2].includes('Ha:') ? parts[2] : '';

        const haMatch = cuartelStr.match(/Ha:([\d.,]+)/);
        const plMatch = cuartelStr.match(/Pl:([\d.,]+)/);

        let ha = 0;
        if (haMatch) {
            ha = parseFloat(haMatch[1].replace(',', '.')) || 0;
        }

        let pl = 0;
        if (plMatch) {
            pl = parseInt(plMatch[1].replace(/[.,]/g, '')) || 0;
        }

        return { code, ha, pl, predio, variedad };
    }

    static API_KEYS = {
        'Fincas Viejas': '12345NC5xQdXAxT6jj8WrPH26krbn2y7sf6tt8mf',
        'El Espejo': '123450S8fgNhWDfKUNxnzFr7xb6DK1us2OqJK2'
    };

    static BASE_URL = '/sofia-api/trabajvsfaenas';

    static getCycleRanges(ciclo) {
        // Ciclo Agrícola: 1 Mayo -> 30 Abril
        const [startYear] = ciclo.split('-').map(Number);
        const ranges = [];

        let current = new Date(startYear, 4, 1); // May 1st
        const end = new Date();
        const cycleEnd = new Date(startYear + 1, 3, 30); // Apr 30th Next Year
        const limit = end < cycleEnd ? end : cycleEnd;

        while (current <= limit) {
            const rangeStart = current.toISOString().split('T')[0];
            const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0); // Last day of month
            const rangeEnd = nextMonth.toISOString().split('T')[0];

            ranges.push({ desde: rangeStart, hasta: rangeEnd });

            current = new Date(current.getFullYear(), current.getMonth() + 1, 1); // Next month 1st
        }
        return ranges;
    }

    /**
     * Universal fetcher from Sofia API
     */
    static async fetchFromSofia(finca, desde, hasta) {
        const key = this.API_KEYS[finca];
        if (!key) return [];

        const url = `${this.BASE_URL}?nombre_usuario=NATURALFOOD&key_usuario=${key}&fecha_inicial=${desde}&fecha_final=${hasta}`;

        try {
            // Note: If CORS fails, we would need a proxy or the user to allow it.
            // Using a CORS proxy as a fallback if this were a production app.
            const response = await fetch(url);
            if (!response.ok) return [];
            const data = await response.json();
            return Array.isArray(data) ? data.map(r => ({ ...r, finca })) : [];
        } catch (e) {
            console.warn(`Error fetching Sofia for ${finca} (${desde} to ${hasta}):`, e);
            return [];
        }
    }

    /**
     * Connects to the Sofia API and fetches ALL data for a cycle
     */
    /**
     * Connects to the Sofia API and fetches ALL data for a cycle
     * Implements caching to avoid redundant network requests.
     */
    static _cyclesCache = new Map();

    static async fetchCycleData(ciclo, forceRefresh = false) {
        if (this._cyclesCache.has(ciclo) && !forceRefresh) {
            return this._cyclesCache.get(ciclo);
        }

        const ranges = this.getCycleRanges(ciclo);
        let allJornales = []; // Consolidate results here

        const fincas = Object.keys(this.API_KEYS);

        // Fetch all ranges
        for (const finca of fincas) {
            for (const range of ranges) {
                try {
                    const results = await this.fetchFromSofia(finca, range.desde, range.hasta);
                    if (Array.isArray(results)) {
                        allJornales = allJornales.concat(results);
                    }
                } catch (e) {
                    console.error(`Error fetching ${finca} ${range.desde}:`, e);
                }
            }
        }

        // Deduplicate records (using composite signature)
        // This is necessary because API calls with overlapping ranges or multiple calls for same cycle can return duplicate data
        const uniqueRecords = new Map();
        allJornales.forEach(r => {
            const signature = `${r.finca}-${r.fecha}-${r.labor || ''}-${r.cuartel || ''}-${r.persona || ''}-${r.rendimiento || 0}-${r.jornada || 0}`;
            if (!uniqueRecords.has(signature)) {
                uniqueRecords.set(signature, r);
            }
        });

        const cycleStartYear = parseInt(ciclo.split('-')[0]);

        // Add normalized fields and clean up previous cycle's "Levantado" tails
        const processedData = Array.from(uniqueRecords.values()).map(r => {
            const rendition = parseFloat(r.rendimiento) || 0;
            // User sample shows "jornada" as the field name for jornadas
            const jornadas = parseFloat(r.jornada) || parseFloat(r.totalJornadas) || 0;
            const costo = parseFloat(r.valor_total_jornada) || 0;
            const isCosecha = r.labor && r.labor.toLowerCase().includes('cosecha kg');

            // Extract Ha for this record from cuartel string
            const info = this.parseCuartelInfo(r.cuartel);

            return {
                ...r,
                ciclo,
                rendimiento_val: rendition,
                totalJornadas: jornadas,
                costo_ars: costo,
                hectareas: info.ha,
                clasifica: r.clasifica || r.clasificacion || r.Clasificacion || r.Clasifica || info.predio,
                variedad: r.variedad || r.variedades || r.Variedad || r.Variedades || info.variedad,
                isCosecha,
                labor_normalized: (r.finca === 'El Espejo' && (r.labor === 'Poda' || r.labor === 'Poda dov')) ? 'Poda' : r.labor,
                fecha: r.fecha || r.Fecha || r.date || r.Date // Normalized date field
            };
        }).filter(r => {
            // EXCLUSION RULE:
            // If the labor is 'cosecha' or 'levantado' and it happens in May/June of the START year,
            // it's actually the tail from the PREVIOUS cycle. We exclude it so it doesn't inflate this cycle.
            // But we keep 'Poda' or other labres so the hectares of those cuarteles get counted correctly.
            const laborStr = r.labor ? r.labor.toLowerCase() : '';
            const isHarvestOrLevantado = laborStr.includes('cosecha') || laborStr.includes('levantado');

            if (isHarvestOrLevantado && r.fecha) {
                const dateObj = new Date(r.fecha);
                const yr = dateObj.getFullYear();
                const mo = dateObj.getMonth(); // 0-indexed (4=May, 5=Jun)
                if (yr === cycleStartYear && (mo === 4 || mo === 5)) {
                    return false;
                }
            }
            return true;
        });

        // Store in Cache
        this._cyclesCache.set(ciclo, processedData);
        return processedData;
    }

    /**
     * Interface for Jornales (using cached cycle data or fetching)
     */
    static async fetchJornales(filters = {}) {
        const ciclo = filters.ciclo || '2025-2026';
        this.DATA_JORNALES = await this.fetchCycleData(ciclo);
        return this.applyFilters(this.DATA_JORNALES, filters);
    }

    /**
     * Interface for Cosecha
     */
    static async fetchCosecha(filters = {}) {
        const ciclo = filters.ciclo || '2025-2026';
        const cycleData = await this.fetchCycleData(ciclo);

        // Filter only harvest tasks
        this.DATA_COSECHA = cycleData.filter(r => r.isCosecha);
        return this.applyFilters(this.DATA_COSECHA, filters);
    }

    static applyFilters(data, filters) {
        return data.filter(r => {
            if (filters.finca && r.finca !== filters.finca) return false;
            if (filters.predio && r.clasifica !== filters.predio) return false;
            if (filters.variedad && r.variedad !== filters.variedad) return false;
            if (filters.desde && new Date(r.fecha) < new Date(filters.desde)) return false;
            if (filters.hasta && new Date(r.fecha) > new Date(filters.hasta)) return false;

            if (filters.origen) {
                const PROPIA_KEYWORDS = ['Camino Truncado', 'EEI', 'EEII', 'EEIII', 'La Chimbera', 'Puente Alto'];
                const clasif = (r.clasifica || '').toUpperCase();
                const isPropia = PROPIA_KEYWORDS.some(k => clasif.includes(k.toUpperCase()));

                if (filters.origen === 'propia' && !isPropia) return false;
                if (filters.origen === 'terceros' && isPropia) return false;
            }

            return true;
        });
    }

    /**
     * Groups Jornales by Labor and calculates Ha stats
     */
    static getJornalesStats(data) {
        const stats = {};
        data.forEach(r => {
            const lab = r.labor_normalized || r.labor;
            if (!stats[lab]) {
                stats[lab] = {
                    labor: lab,
                    totalJornadas: 0,
                    totalCosto: 0,
                    totalHa: 0,
                    cuarteles: new Set()
                };
            }
            stats[lab].totalJornadas += r.totalJornadas;
            stats[lab].totalCosto += r.costo_ars;

            if (!stats[lab].cuarteles.has(r.cuartel)) {
                stats[lab].cuarteles.add(r.cuartel);
                // Skip "Gral" cuarteles from El Espejo for hectares count
                const isGralEspejo = r.finca === 'El Espejo' && r.cuartel && r.cuartel.toLowerCase().includes('gral');
                if (!isGralEspejo) {
                    stats[lab].totalHa += r.hectareas;
                }
            }
        });
        return Object.values(stats).sort((a, b) => b.totalJornadas - a.totalJornadas);
    }

    /**
     * Helper to estimate USD rate based on cycle
     * Uses approximate market rates for simplicity
     */
    static getApproximateUsdRate(cycle) {
        switch (cycle) {
            case '2021-2022': return 210; // Avg Blue 2021-22
            case '2022-2023': return 390; // Avg Blue 2022-23
            case '2023-2024': return 850; // Avg Blue 2023-24 (Devaluation)
            case '2024-2025': return 1150; // Avg Blue 2024-25
            case '2025-2026': return 1250; // Current/Projected
            default: return 1250;
        }
    }

    /**
     * Calculates Efficiency (Jornales/Ha) grouped by Finca and Predio
     * Also calculates Average Cost per Jornal (ARS & estimated USD)
     */
    static getEfficiencyStats(data) {
        // Configuration: Mapping Predio Keywords to (Group, DisplayName)
        const PREDIO_CONFIG = [
            { keyword: 'Camino Truncado', group: 'Fincas Viejas', name: 'Camino Truncado' },
            { keyword: 'La Chimbera', group: 'Fincas Viejas', name: 'La Chimbera' },
            { keyword: 'Puente Alto', group: 'Fincas Viejas', name: 'Puente Alto' },
            { keyword: 'EEIII', group: 'El Espejo', name: 'El Espejo 3' },
            { keyword: 'EEII', group: 'El Espejo', name: 'El Espejo 2' },
            { keyword: 'EEI', group: 'El Espejo', name: 'El Espejo 1' }
        ];

        const uniqueCuarteles = new Map(); // Key: CuartelCode, Value: { ha, predioDisplayName }
        const groupStats = {
            'Fincas Viejas': { jornales: 0, area: 0, costoArs: 0, name: 'Fincas Viejas' },
            'El Espejo': { jornales: 0, area: 0, costoArs: 0, name: 'El Espejo' }
        };
        const predioStats = {};

        // Determine cycle from first record or default
        const currentCycle = data.length > 0 ? (data[0].ciclo || '2025-2026') : '2025-2026';
        const usdRate = this.getApproximateUsdRate(currentCycle);

        data.forEach(r => {
            const rawPredio = r.clasifica || '';
            const costo = r.costo_ars || 0;
            const jornales = r.totalJornadas || 0;

            // 1. Identify if this record belongs to a tracked Predio
            const config = PREDIO_CONFIG.find(c => rawPredio.includes(c.keyword));
            if (!config) return; // Skip if not in our whitelist

            const predioName = config.name;
            const groupName = config.group;

            // 2. Track Unique Physical Area (Denominator)
            // Use Cuartel as unique identifier for area
            if (r.cuartel && !uniqueCuarteles.has(r.cuartel)) {
                uniqueCuarteles.set(r.cuartel, { ha: r.hectareas, predio: predioName });

                // Skip "Gral" cuarteles from El Espejo for hectares count
                const isGralEspejo = groupName === 'El Espejo' && r.cuartel.toLowerCase().includes('gral');
                if (!isGralEspejo) {
                    // Add to Aggregates
                    if (groupStats[groupName]) groupStats[groupName].area += r.hectareas;

                    if (!predioStats[predioName]) predioStats[predioName] = { jornales: 0, area: 0, costoArs: 0, name: predioName, group: groupName };
                    predioStats[predioName].area += r.hectareas;
                }
            }

            // 3. Sum Jornales and Cost (Numerator)
            if (groupStats[groupName]) {
                groupStats[groupName].jornales += jornales;
                groupStats[groupName].costoArs += costo;
            }

            if (!predioStats[predioName]) predioStats[predioName] = { jornales: 0, area: 0, costoArs: 0, name: predioName, group: groupName };
            predioStats[predioName].jornales += jornales;
            predioStats[predioName].costoArs += costo;
        });

        // Compute Ratios and Averages
        const compute = (obj) => ({
            ...obj,
            efficiency: obj.area > 0 ? obj.jornales / obj.area : 0,
            avgCostArs: obj.jornales > 0 ? obj.costoArs / obj.jornales : 0,
            avgCostUsd: obj.jornales > 0 ? (obj.costoArs / obj.jornales) / usdRate : 0
        });

        return {
            groups: Object.values(groupStats).map(compute),
            predios: Object.values(predioStats).map(compute).sort((a, b) => b.efficiency - a.efficiency)
        };
    }

    /**
     * Extracts Hectares per Predio (Clasificación) grouped by Finca.
     * Uses unique cuarteles to avoid double-counting area.
     * Returns: { groups: [ { name, predios: [{ name, hectareas, cuarteles, plantas }], totalHa, totalCuarteles, totalPlantas } ], grandTotalHa, grandTotalCuarteles, grandTotalPlantas }
     */
    static getHectareasPorPredio(data) {
        const PREDIO_CONFIG = [
            { keyword: 'Camino Truncado', group: 'Fincas Viejas', name: 'Camino Truncado' },
            { keyword: 'La Chimbera', group: 'Fincas Viejas', name: 'La Chimbera' },
            { keyword: 'Puente Alto', group: 'Fincas Viejas', name: 'Puente Alto' },
            { keyword: 'EEIII', group: 'El Espejo', name: 'El Espejo 3' },
            { keyword: 'EEII', group: 'El Espejo', name: 'El Espejo 2' },
            { keyword: 'EEI', group: 'El Espejo', name: 'El Espejo 1' }
        ];

        const uniqueCuarteles = new Set();
        const predioMap = {};  // predioName -> { ha, cuarteles, plantas, group }

        data.forEach(r => {
            const rawPredio = r.clasifica || '';
            const config = PREDIO_CONFIG.find(c => rawPredio.includes(c.keyword));
            if (!config) return;

            if (r.cuartel && !uniqueCuarteles.has(r.cuartel)) {
                uniqueCuarteles.add(r.cuartel);

                // Skip "Gral" (General) cuarteles for El Espejo — they are overhead, not physical area
                const cuartelLower = r.cuartel.toLowerCase();
                if (config.group === 'El Espejo' && cuartelLower.includes('gral')) return;

                const info = this.parseCuartelInfo(r.cuartel);

                if (!predioMap[config.name]) {
                    predioMap[config.name] = { name: config.name, group: config.group, hectareas: 0, cuarteles: 0, plantas: 0 };
                }
                predioMap[config.name].hectareas += r.hectareas || info.ha;
                predioMap[config.name].cuarteles += 1;
                predioMap[config.name].plantas += info.pl;
            }
        });

        // Group by finca
        const groupOrder = ['El Espejo', 'Fincas Viejas'];
        const groups = groupOrder.map(groupName => {
            const predios = Object.values(predioMap)
                .filter(p => p.group === groupName)
                .sort((a, b) => b.hectareas - a.hectareas);

            return {
                name: groupName,
                predios,
                totalHa: predios.reduce((s, p) => s + p.hectareas, 0),
                totalCuarteles: predios.reduce((s, p) => s + p.cuarteles, 0),
                totalPlantas: predios.reduce((s, p) => s + p.plantas, 0)
            };
        });

        return {
            groups,
            grandTotalHa: groups.reduce((s, g) => s + g.totalHa, 0),
            grandTotalCuarteles: groups.reduce((s, g) => s + g.totalCuarteles, 0),
            grandTotalPlantas: groups.reduce((s, g) => s + g.totalPlantas, 0)
        };
    }

    /**
     * Calculates detailed Yield statistics for the dashboard
     */
    static getCosechaDashboardStats(data) {
        let totalKilos = 0;
        let totalHa = 0;
        const fincas = {};
        const predios = {};
        const cuarteles = {};
        const variedades = {};

        data.forEach(r => {
            const kilos = r.rendimiento_val || 0;
            totalKilos += kilos;

            // Fincas
            if (!fincas[r.finca]) fincas[r.finca] = 0;
            fincas[r.finca] += kilos;

            // Predios
            const predioKey = r.clasifica || 'Sin Clasificar';
            if (!predios[predioKey]) predios[predioKey] = 0;
            predios[predioKey] += kilos;

            // Cuarteles
            if (!cuarteles[r.cuartel]) {
                cuarteles[r.cuartel] = 0;
                const isGralEspejo = r.finca === 'El Espejo' && r.cuartel && r.cuartel.toLowerCase().includes('gral');
                if (!isGralEspejo) {
                    const info = this.parseCuartelInfo(r.cuartel);
                    totalHa += info.ha;
                }
            }
            cuarteles[r.cuartel] += kilos;

            // Variedades
            if (!variedades[r.variedad]) variedades[r.variedad] = 0;
            variedades[r.variedad] += kilos;
        });

        const PROPIA_KEYWORDS = ['Camino Truncado', 'EEI', 'EEII', 'EEIII', 'La Chimbera', 'Puente Alto'];
        const origen = { propia: 0, terceros: 0, propiaHa: 0, promedioPropia: 0 };
        const cuartelesPropios = new Set();

        data.forEach(r => {
            const kilos = r.rendimiento_val || 0;
            const clasif = (r.clasifica || '').toUpperCase();

            const isPropia = PROPIA_KEYWORDS.some(k => clasif.includes(k.toUpperCase()));
            if (isPropia) {
                origen.propia += kilos;
                if (r.cuartel && !cuartelesPropios.has(r.cuartel)) {
                    cuartelesPropios.add(r.cuartel);
                    const isGralEspejo = r.finca === 'El Espejo' && r.cuartel.toLowerCase().includes('gral');
                    if (!isGralEspejo) {
                        const info = SofiaApiModel.parseCuartelInfo(r.cuartel);
                        origen.propiaHa += info.ha;
                    }
                }
            } else {
                origen.terceros += kilos;
            }
        });

        origen.promedioPropia = origen.propiaHa > 0 ? (origen.propia / origen.propiaHa) : 0;

        const sortObj = (obj) => Object.entries(obj)
            .map(([name, kg]) => ({ name, kg }))
            .sort((a, b) => b.kg - a.kg);

        return {
            totalKilos,
            rendimientoPromedio: totalHa > 0 ? totalKilos / totalHa : 0,
            cuartelesCosechados: Object.keys(cuarteles).length,
            totalVariedades: Object.keys(variedades).length,
            fincas: sortObj(fincas),
            predios: sortObj(predios),
            cuarteles: sortObj(cuarteles),
            variedades: sortObj(variedades),
            origen
        };
    }

    /**
     * Calculates Yield (Kg/Ha) per Predio for chart visualization
     */
    static getRendimientoPredioStats(data) {
        const predioMap = {}; // name -> { kg: 0, ha: 0, cuarteles: Set }

        data.forEach(r => {
            const predioName = r.clasifica || 'Sin Clasificar';
            if (!predioMap[predioName]) {
                predioMap[predioName] = { kg: 0, ha: 0, cuarteles: new Set() };
            }

            // 1. Sum Kilos only if it's a harvest record
            if (r.isCosecha) {
                predioMap[predioName].kg += r.rendimiento_val || 0;
            }

            // 2. Track Hectares once per Cuartel to get the TOTAL area of the predio
            if (r.cuartel && !predioMap[predioName].cuarteles.has(r.cuartel)) {
                predioMap[predioName].cuarteles.add(r.cuartel);

                // Skip Gral area for El Espejo
                const isGralEspejo = r.finca === 'El Espejo' && r.cuartel.toLowerCase().includes('gral');
                if (!isGralEspejo) {
                    const info = this.parseCuartelInfo(r.cuartel);
                    predioMap[predioName].ha += info.ha;
                }
            }
        });

        const stats = Object.entries(predioMap)
            .map(([name, s]) => ({
                name,
                kg: s.kg,
                ha: s.ha,
                rendimiento: s.ha > 0 ? (s.kg / s.ha) : 0
            }))
            .filter(s => s.rendimiento > 0) // Only show predios with yield
            .sort((a, b) => b.rendimiento - a.rendimiento);

        const colors = [
            'rgba(34, 197, 94, 0.6)',  // Green
            'rgba(59, 130, 246, 0.6)',  // Blue
            'rgba(168, 85, 247, 0.6)', // Purple
            'rgba(245, 158, 11, 0.6)',  // Amber
            'rgba(239, 68, 68, 0.6)',   // Red
            'rgba(6, 182, 212, 0.6)',   // Cyan
            'rgba(244, 63, 94, 0.6)',   // Rose
            'rgba(139, 92, 246, 0.6)'   // Violet
        ];

        return {
            labels: stats.map(s => s.name),
            datasets: [{
                label: 'Rendimiento (Kg/Ha)',
                data: stats.map(s => Math.round(s.rendimiento)),
                backgroundColor: colors.slice(0, stats.length),
                borderColor: colors.map(c => c.replace('0.6', '1')).slice(0, stats.length),
                borderWidth: 1,
                borderRadius: 6
            }]
        };
    }

    /**
     * Gets Cosecha KG (fresh grape) and Levantado (raisin) stats per predio, by pass number (1-5).
     * Requires full cycle data (not just cosecha-filtered data).
     * Returns: { predios: [ { name, group, cosecha: [kg1..kg5], levantado: [kg1..kg5], totalCosecha, totalLevantado } ] }
     */
    static getCosechaLevantadoStats(fullCycleData) {
        const PREDIO_CONFIG = [
            { keyword: 'Camino Truncado', group: 'Fincas Viejas', name: 'Camino Truncado' },
            { keyword: 'La Chimbera', group: 'Fincas Viejas', name: 'La Chimbera' },
            { keyword: 'Puente Alto', group: 'Fincas Viejas', name: 'Puente Alto' },
            { keyword: 'EEIII', group: 'El Espejo', name: 'El Espejo 3' },
            { keyword: 'EEII', group: 'El Espejo', name: 'El Espejo 2' },
            { keyword: 'EEI', group: 'El Espejo', name: 'El Espejo 1' }
        ];

        const predioMap = {};

        fullCycleData.forEach(r => {
            const labor = (r.labor || '').toLowerCase().trim();
            const rawPredio = r.clasifica || '';
            const config = PREDIO_CONFIG.find(c => rawPredio.includes(c.keyword));
            if (!config) return;

            // Detect labor type and pass number
            let type = null;
            let passNum = 0;

            if (labor.includes('cosecha kg')) {
                type = 'cosecha';
                const match = labor.match(/cosecha\s*kg\s*(\d+)/i);
                passNum = match ? parseInt(match[1]) : 1;
            } else if (labor.includes('levantado')) {
                type = 'levantado';
                const match = labor.match(/levantado\s*(\d+)/i);
                passNum = match ? parseInt(match[1]) : 1;
            }

            if (!type || passNum < 1 || passNum > 5) return;

            const kg = r.rendimiento_val || 0;
            const predioName = config.name;

            if (!predioMap[predioName]) {
                predioMap[predioName] = {
                    name: predioName,
                    group: config.group,
                    cosecha: [0, 0, 0, 0, 0],   // pass 1-5
                    levantado: [0, 0, 0, 0, 0],  // pass 1-5
                    totalCosecha: 0,
                    totalLevantado: 0
                };
            }

            const idx = passNum - 1; // 0-indexed
            if (type === 'cosecha') {
                predioMap[predioName].cosecha[idx] += kg;
                predioMap[predioName].totalCosecha += kg;
            } else {
                predioMap[predioName].levantado[idx] += kg;
                predioMap[predioName].totalLevantado += kg;
            }
        });

        // Group by finca
        const groupOrder = ['El Espejo', 'Fincas Viejas'];
        const groups = groupOrder.map(groupName => {
            const predios = Object.values(predioMap)
                .filter(p => p.group === groupName)
                .sort((a, b) => a.name.localeCompare(b.name));

            return {
                name: groupName,
                predios,
                totalCosecha: predios.reduce((s, p) => s + p.totalCosecha, 0),
                totalLevantado: predios.reduce((s, p) => s + p.totalLevantado, 0),
                cosechaPasses: [0, 1, 2, 3, 4].map(i => predios.reduce((s, p) => s + p.cosecha[i], 0)),
                levantadoPasses: [0, 1, 2, 3, 4].map(i => predios.reduce((s, p) => s + p.levantado[i], 0))
            };
        });

        return {
            groups,
            grandTotalCosecha: groups.reduce((s, g) => s + g.totalCosecha, 0),
            grandTotalLevantado: groups.reduce((s, g) => s + g.totalLevantado, 0)
        };
    }

    /**
     * Fetches and aggregates data for multiple cycles for comparison
     * Returns Chart.js compatible partial data structure
     */
    static async getHistoricalComparison(baseFilters = {}) {
        const cycles = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];
        const monthNames = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'];

        // Helper to convert date to cycle-relative month index (0-11)
        const getRelativeMonth = (dateStr) => {
            if (!dateStr) return -1;

            let d = new Date(dateStr);

            // Try parsing manually if standard parsing fails or looks suspicious
            if (isNaN(d.getTime())) {
                // Try YYYY-MM-DD
                let parts = dateStr.split('-');
                if (parts.length === 3) {
                    if (parseInt(parts[0]) > 2000) {
                        // YYYY-MM-DD
                        d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    } else if (parseInt(parts[2]) > 2000) {
                        // DD-MM-YYYY
                        d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                    }
                }

                // Try DD/MM/YYYY
                if (isNaN(d.getTime())) {
                    parts = dateStr.split('/');
                    if (parts.length === 3) {
                        // Assume DD/MM/YYYY
                        d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                    }
                }
            }

            if (isNaN(d.getTime())) {
                console.warn(`[Historical] Invalid date: ${dateStr}`);
                return -1;
            }

            const m = d.getMonth(); // 0=Jan, 4=May
            // May(4) -> 0, Dec(11) -> 7, Jan(0) -> 8, Apr(3) -> 11
            return m >= 4 ? m - 4 : m + 8;
        };

        // Data for each cycle
        const datasets = [];

        // Parallel fetching is good but might cause too many requests?
        // Let's do it sequentially for now
        for (const c of cycles) {
            console.log(`[Historical] Fetching cycle ${c}...`);
            let cycleData = await this.fetchCycleData(c);
            console.log(`[Historical] Cycle ${c} raw rows: ${cycleData.length}`);

            if (cycleData.length > 0 && cycleData[0].fecha) {
                console.log(`[Historical] Sample date for ${c}: ${cycleData[0].fecha}`);
            }

            // Apply Filters (Finca, Predio, etc) - BUT ignore Cycle filter
            const filtered = cycleData.filter(r => {
                if (baseFilters.finca && r.finca !== baseFilters.finca) return false;
                if (baseFilters.predio && r.clasifica !== baseFilters.predio) return false;
                if (baseFilters.variedad && r.variedad !== baseFilters.variedad) return false;
                return true;
            });
            console.log(`[Historical] Cycle ${c} filtered rows: ${filtered.length}`);

            // Aggregate by month
            const monthlySum = new Array(12).fill(0);
            filtered.forEach(r => {
                const idx = getRelativeMonth(r.fecha); // Make sure r.fecha exists
                if (idx >= 0 && idx < 12) {
                    monthlySum[idx] += r.totalJornadas;
                }
            });

            datasets.push({
                label: `Ciclo ${c}`,
                data: monthlySum,
                tension: 0.4,
                fill: false
            });
        }

        const colors = [
            '#94a3b8', // 2021 (Gray)
            '#60a5fa', // 2022 (Blue)
            '#34d399', // 2023 (Green)
            '#fbbf24', // 2024 (Amber)
            '#8b5cf6'  // 2025 (Purple - Current)
        ];

        return {
            labels: monthNames,
            datasets: datasets.map((d, i) => ({
                ...d,
                borderColor: colors[i % colors.length],
                pointBackgroundColor: colors[i % colors.length],
                borderWidth: i === datasets.length - 1 ? 3 : 2
            }))
        };
    }

    /**
     * Similar to getHistoricalComparison but returns normalized Jornales/Ha
     */
    static async getHistoricalEfficiencyComparison(baseFilters = {}) {
        const cycles = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];
        const monthNames = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'];

        const getRelativeMonth = (dateStr) => {
            if (!dateStr) return -1;
            let d = new Date(dateStr);
            if (isNaN(d.getTime())) {
                let parts = dateStr.split('-');
                if (parts.length === 3) {
                    if (parseInt(parts[0]) > 2000) d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                    else if (parseInt(parts[2]) > 2000) d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
                if (isNaN(d.getTime())) {
                    parts = dateStr.split('/');
                    if (parts.length === 3) d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
            }
            if (isNaN(d.getTime())) return -1;
            const m = d.getMonth();
            return m >= 4 ? m - 4 : m + 8;
        };

        const datasets = [];

        for (const c of cycles) {
            let cycleData = await this.fetchCycleData(c);

            const filtered = cycleData.filter(r => {
                if (baseFilters.finca && r.finca !== baseFilters.finca) return false;
                if (baseFilters.predio && r.clasifica !== baseFilters.predio) return false;
                if (baseFilters.variedad && r.variedad !== baseFilters.variedad) return false;
                return true;
            });

            // Calculate Total Area for this filtered dataset (Total Unique Hectares worked in the cycle)
            const uniqueCuarteles = new Map();
            let totalHa = 0;

            filtered.forEach(r => {
                if (r.cuartel && !uniqueCuarteles.has(r.cuartel)) {
                    // Skip "Gral" cuarteles from El Espejo for hectares count
                    const isGralEspejo = r.finca === 'El Espejo' && r.cuartel.toLowerCase().includes('gral');
                    // Only count if Ha is > 0 and not a Gral cuartel
                    if (r.hectares > 0 && !isGralEspejo) {
                        uniqueCuarteles.set(r.cuartel, r.hectares);
                        totalHa += r.hectares;
                    }
                }
            });

            // Prevent division by zero
            if (totalHa === 0) totalHa = 1;

            const monthlySum = new Array(12).fill(0);
            filtered.forEach(r => {
                const idx = getRelativeMonth(r.fecha);
                if (idx >= 0 && idx < 12) {
                    monthlySum[idx] += r.totalJornadas;
                }
            });

            // Normalize by Area
            const monthlyEfficiency = monthlySum.map(j => parseFloat((j / totalHa).toFixed(2)));

            datasets.push({
                label: `Ciclo ${c}`,
                data: monthlyEfficiency,
                rawTotals: monthlySum,
                totalHa: totalHa, // Helpful for debugging tooltip
                tension: 0.4,
                fill: false
            });
        }

        const colors = ['#94a3b8', '#60a5fa', '#34d399', '#fbbf24', '#8b5cf6'];

        return {
            labels: monthNames,
            datasets: datasets.map((d, i) => ({
                ...d,
                borderColor: colors[i % colors.length],
                pointBackgroundColor: colors[i % colors.length],
                borderWidth: i === datasets.length - 1 ? 3 : 2
            }))
        };
    }

    /**
     * Fetches annual harvest yields for comparison
     */
    static async getHistoricalCosechaStats(baseFilters = {}) {
        const cycles = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];
        const dataPoints = [];

        for (const c of cycles) {
            let data = await this.fetchCycleData(c);
            // Filter only harvest rows
            const harvestData = data.filter(r => r.isCosecha);

            // Apply other filters (Finca, Predio, etc.), ignoring the cycle filter itself
            const filtered = this.applyFilters(harvestData, { ...baseFilters, ciclo: undefined });

            const totalkg = filtered.reduce((acc, r) => acc + (r.rendimiento_val || 0), 0);
            dataPoints.push(totalkg);
        }

        let bgColor = 'rgba(74, 222, 128, 0.6)'; // Green (Default)
        let borderColor = 'rgba(74, 222, 128, 1)';

        if (baseFilters.origen === 'propia') {
            bgColor = 'rgba(59, 130, 246, 0.6)'; // Blue (Primary)
            borderColor = 'rgba(59, 130, 246, 1)';
        } else if (baseFilters.origen === 'terceros') {
            bgColor = 'rgba(168, 85, 247, 0.6)'; // Purple (Accent)
            borderColor = 'rgba(168, 85, 247, 1)';
        }

        return {
            labels: cycles,
            datasets: [{
                label: 'Producción Total (Kg)',
                data: dataPoints,
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 1,
                borderRadius: 6
            }]
        };
    }

    /**
     * Fetches historical Kg/Ha yield per predio for comparison across cycles.
     */
    static async getHistoricalYieldEvolution(baseFilters = {}) {
        const cycles = ['2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];

        // We will collect yield stats for each predio over all cycles
        const predioHistory = {};

        for (let i = 0; i < cycles.length; i++) {
            const c = cycles[i];
            let data = await this.fetchCycleData(c);

            // Filter only harvest rows
            const harvestData = data.filter(r => r.isCosecha);
            const filtered = this.applyFilters(harvestData, { ...baseFilters, ciclo: undefined });

            // Calculate yield for this cycle
            const dashboardStats = this.getCosechaDashboardStats(filtered);

            // Populate predioHistory mapping
            dashboardStats.predios.forEach(predio => {
                const predioName = predio.name;
                if (!predioHistory[predioName]) {
                    predioHistory[predioName] = new Array(cycles.length).fill(null);
                }
                predioHistory[predioName][i] = predio.kg;
            });
        }

        const colors = [
            '#22c55e', // Green
            '#3b82f6', // Blue
            '#a855f7', // Purple
            '#f59e0b', // Amber
            '#ef4444', // Red
            '#06b6d4', // Cyan
            '#f43f5e', // Rose
            '#8b5cf6'  // Violet
        ];

        let colorIndex = 0;
        const datasets = Object.keys(predioHistory).map(predioName => {
            const ds = {
                label: predioName,
                data: predioHistory[predioName],
                borderColor: colors[colorIndex % colors.length],
                pointBackgroundColor: colors[colorIndex % colors.length],
                tension: 0.3,
                fill: false,
                borderWidth: 2
            };
            colorIndex++;
            return ds;
        });

        // Filter out any predios that have all nulls
        const validDatasets = datasets.filter(ds => ds.data.some(v => v !== null && v > 0));

        return {
            labels: cycles,
            datasets: validDatasets
        };
    }
}
