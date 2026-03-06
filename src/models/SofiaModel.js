/**
 * SofiaModel.js
 * Manages import and processing of Sofia CSV data.
 */

const COLUMNS_MAP = {
    'Fecha': ['Fecha', 'Fecha Inicio Aplica', 'Fecha de Aplicación', 'Date'],
    'Labor': ['Labor', 'Labor Code', 'Faena', 'Tarea'],
    'Producto': ['Nombre Producto', 'Producto', 'Insumo', 'Product'],
    'Cantidad': ['Cantidad', 'Real Aplicado', 'Cantidad Periodo', 'Monto'],
    'Tipo': ['tipo', 'Tipo Registro', 'Tipo'],
    'Cuartel': ['Cuartel / Potrero', 'Cuartel', 'Cod Cuartel', 'Sector'],
    'CodCuartel': ['Cod Cuartel'],
    'Finca': ['Predio', 'Finca', 'Farm'],
    'Clasifica': ['Clasifica', 'Claseifica', 'Clasificacion', 'Sub-Predio'],
    'Dosis': ['Dosis', 'dosis', 'Dose'],
    'Variedad': ['Variedad', 'variedad', 'Variety'],
    'Costo': ['Total Producto', 'Costo', 'Cost', 'Importe'],
    'N': ['Unidades N', 'N', 'Nitrogeno', 'Units N', 'Unid N'],
    'P': ['Unidades P', 'P', 'Unidades P2O5', 'P205', 'P2O5', 'Fosforo', 'Units P', 'Unid P'],
    'K': ['Unidades K', 'K', 'Unidades K2O', 'K20', 'K2O', 'Potasio', 'Units K', 'Unid K'],
    'Has': ['Has Totales', 'Has', 'Hectareas', 'Superficie'],
    'Ca': ['Unidades de Calcio', 'Unidades Ca', 'Calcio', 'Ca', 'CaO', 'Unid Ca'],
    'Estado': ['Estado', 'estado', 'Status']
};

const REQUIRED_KEYS = ['Fecha', 'Labor', 'Producto', 'Cantidad'];

const HERBICIDE_KEYWORDS = ['glifosato', 'gramoxone', 'roundup', 'panzer', 'herbicida', 'tordon', 'afalon', 'atrazina'];

export class SofiaImportModel {
    static REGISTROS = [];

    static importRows(rows) {
        this.REGISTROS.push(...rows);
    }

    static parseCSV(csvText, defaultFinca) {
        if (!csvText) return { error: "Archivo vacío" };
        const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length < 2) return { error: "Archivo sin datos" };

        const header = lines[0].split(';');
        const colMap = {};
        Object.keys(COLUMNS_MAP).forEach(key => {
            const possibleNames = COLUMNS_MAP[key];
            let idx = -1;

            // 1. Priority-based Exact Match
            for (const name of possibleNames) {
                idx = header.findIndex(h => h.trim().toLowerCase() === name.toLowerCase());
                if (idx !== -1) break;
            }

            // 2. Priority-based Partial Match (if exact not found)
            if (idx === -1) {
                for (const name of possibleNames) {
                    idx = header.findIndex(h => h.toLowerCase().includes(name.toLowerCase()));
                    if (idx !== -1) break;
                }
            }

            if (idx !== -1) colMap[key] = idx;
        });

        const missing = REQUIRED_KEYS.filter(k => colMap[k] === undefined);
        if (missing.length > 0) return { error: `Faltan columnas esenciales: ${missing.join(', ')}` };

        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(';');
            if (cols.length < header.length) continue;

            const fecha = colMap['Fecha'] !== undefined ? cols[colMap['Fecha']] : '';
            const labor = colMap['Labor'] !== undefined ? cols[colMap['Labor']] : 'Desconocido';
            let producto = colMap['Producto'] !== undefined ? cols[colMap['Producto']] : '';

            // Product name normalization: remove extra spaces and unify common variants (e.g. 1075M -> 1075 M)
            if (producto) {
                producto = producto.trim().toUpperCase()
                    .replace(/\s+/g, ' ')
                    .replace(/(\d+)\s*([MV])\b/g, '$1 $2') // Standardize space before M/V suffixes
                    .trim();
            }
            // Clean numeric quantity (Strict Spanish: . = thousands, , = decimal)
            let rawCant = colMap['Cantidad'] !== undefined ? cols[colMap['Cantidad']] : '0';
            rawCant = rawCant.replace(/\./g, '').replace(',', '.');
            const cantidad = parseFloat(rawCant) || 0;

            // Clean Cost
            let rawCosto = colMap['Costo'] !== undefined ? cols[colMap['Costo']] : '0';
            // Remove '$' and spaces, handle Spanish format
            rawCosto = rawCosto.replace(/[$\s]/g, '').replace(/\./g, '').replace(',', '.');
            const costo = parseFloat(rawCosto) || 0;

            const cuartel = colMap['Cuartel'] !== undefined ? cols[colMap['Cuartel']] : 'Sin Asignar';
            const codCuartel = colMap['CodCuartel'] !== undefined ? (cols[colMap['CodCuartel']] || '').trim() : '';
            const dosis = colMap['Dosis'] !== undefined ? cols[colMap['Dosis']] : '';

            // Finca logic
            let finca = colMap['Finca'] !== undefined ? cols[colMap['Finca']] : '';
            const fLower = (finca || '').toLowerCase();
            if (fLower.includes('espejo')) {
                finca = 'El Espejo';
            } else if (fLower.includes('viejas') || fLower.includes('camino truncado') || fLower.includes('chimbera') || fLower.includes('puente alto')) {
                finca = 'Fincas Viejas';
            }

            if ((!finca || finca === 'Finca Desconocida') && defaultFinca) {
                finca = defaultFinca;
            } else if (!finca) {
                finca = 'Finca Desconocida';
            }

            if (finca.toLowerCase() === 'el espejo') finca = 'El Espejo';
            if (finca.toLowerCase() === 'fincas viejas') finca = 'Fincas Viejas';

            // Clasifica (Sub-Predio) logic
            let clasifica = colMap['Clasifica'] !== undefined ? cols[colMap['Clasifica']] : '';
            if (!clasifica || clasifica.trim() === '') clasifica = 'General';

            let predioFull = finca;
            if (clasifica && clasifica !== finca && clasifica !== 'General') {
                predioFull = `${finca} - ${clasifica}`;
            }

            // Estado filtering: only keep 'Presupuesto' and 'Confirmada', skip 'Pendiente'
            let estado = colMap['Estado'] !== undefined ? (cols[colMap['Estado']] || '').trim() : '';
            const estadoLower = estado.toLowerCase();
            if (estadoLower === 'pendiente') continue; // Skip "Pendiente" rows entirely

            // Tipo cleaning
            let tipoRaw = colMap['Tipo'] !== undefined ? cols[colMap['Tipo']] : 'Real';
            let tipo = (tipoRaw || '').toLowerCase();
            if (tipo.includes('presupuestado') || tipo.includes('presupuesto') || tipo.includes('ppto')) {
                if (tipo.includes('pos')) tipo = 'Presupuestado-Pos';
                else tipo = 'Presupuestado-Pre';
            } else {
                tipo = 'Real';
            }

            rows.push({
                fecha_aplicacion: fecha,
                labor_codigo: labor,
                tipo_registro: tipo,
                producto,
                cantidad,
                cuartel,
                cod_cuartel: codCuartel || cuartel,
                dosis,
                costo_total: costo,
                finca: predioFull,
                finca_original: finca,
                clasifica: clasifica,
                estado: estado,
                variedad: (colMap['Variedad'] !== undefined && cols[colMap['Variedad']]) ? cols[colMap['Variedad']] : ((cuartel.split('-')[2] || '').trim() || 'Sin Variedad'),
                categoria: this.classify(labor, producto),
                ciclo: this.getCycle(fecha),
                n_units: colMap['N'] !== undefined ? (parseFloat(cols[colMap['N']].replace(/\./g, '').replace(',', '.')) || 0) : 0,
                k_units: colMap['K'] !== undefined ? (parseFloat(cols[colMap['K']].replace(/\./g, '').replace(',', '.')) || 0) : 0,
                p_units: colMap['P'] !== undefined ? (parseFloat(cols[colMap['P']].replace(/\./g, '').replace(',', '.')) || 0) : 0,
                ca_units: colMap['Ca'] !== undefined ? (parseFloat(cols[colMap['Ca']].replace(/\./g, '').replace(',', '.')) || 0) : 0,
                has_totales: colMap['Has'] !== undefined ? (parseFloat(cols[colMap['Has']].replace(/\./g, '').replace(',', '.')) || 0) : 0
            });
        }
        return { rows };
    }

    static classify(laborCode, producto) {
        const lab = (laborCode || '').toUpperCase().trim();
        const prod = (producto || '').toLowerCase();

        // 1. Foliares: Starts with "AF -" or is "FITOSANITARIO"
        if (lab.startsWith('AF -') || lab === 'AF' || lab.includes('FOLIAR') || lab === 'FITOSANITARIO') return 'Foliares';

        // 2. Herbicidas: Labour matches HERBICIDA or HERB, or product keywords
        if (lab.includes('HERBICIDA') || lab === 'HERB' || HERBICIDE_KEYWORDS.some(k => prod.includes(k))) return 'Herbicidas';

        // 3. Fertilización: Strictly "FERTILIZACION" or close variants
        if (lab.includes('FERTILIZACI') || lab.includes('FERTILIZANTE') || lab === 'FERT' || lab === 'ABONO') return 'Fertilizacion';

        // 4. Dynamic category: Take the name of the labor if not recognized above
        return lab || 'Otros';
    }

    static getCycle(fechaStr) {
        if (!fechaStr) return 'Unknown';
        let parts = fechaStr.split('/');
        let year, month;

        if (parts.length === 3) {
            // dd/mm/yyyy
            month = parseInt(parts[1]);
            year = parseInt(parts[2]);
        } else {
            // Try yyyy-mm-dd
            parts = fechaStr.split('-');
            if (parts.length === 3) {
                year = parseInt(parts[0]);
                month = parseInt(parts[1]);
            } else {
                return 'Unknown';
            }
        }

        if (isNaN(month) || isNaN(year)) return 'Unknown';

        // Ciclo Agrícola: May -> Apr
        if (month >= 5) return `${year}-${year + 1}`;
        return `${year - 1}-${year}`;
    }

    static getAvailableCycles() {
        const requested = ['2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];
        const found = new Set(this.REGISTROS.map(r => r.ciclo).filter(c => c !== 'Unknown'));
        requested.forEach(c => found.add(c));
        return [...found].sort().reverse();
    }

    static getFincas() {
        return ['El Espejo', 'Fincas Viejas'];
    }

    static getPredios(finca) {
        const set = new Set(this.REGISTROS.filter(r => !finca || r.finca_original === finca).map(r => r.clasifica).filter(c => c && c !== 'General'));
        return [...set].sort();
    }

    static getVariedades(finca, predio) {
        const set = new Set(this.REGISTROS.filter(r => (!finca || r.finca_original === finca) && (!predio || r.clasifica === predio)).map(r => r.variedad).filter(v => v));
        return [...set].sort();
    }

    static applyFilters(data, filters = {}) {
        return data.filter(r => {
            if (filters.finca && r.finca_original !== filters.finca) return false;
            if (filters.ciclo && r.ciclo !== filters.ciclo) return false;
            if (filters.predio && r.clasifica !== filters.predio) return false;
            if (filters.variedad && r.variedad !== filters.variedad) return false;
            if (filters.cuartel && r.cuartel !== filters.cuartel) return false;
            return true;
        });
    }

    static getResumen(filters = {}) {
        const all = this.applyFilters(this.REGISTROS, filters);
        const distribution = {};
        const prodCounts = {};

        all.forEach(r => {
            distribution[r.categoria] = (distribution[r.categoria] || 0) + 1;
            const key = `${r.producto}|${r.labor_codigo}`;
            if (!prodCounts[key]) {
                prodCounts[key] = { producto: r.producto, labor: r.labor_codigo, totalCantidad: 0, count: 0, costo: 0 };
            }
            prodCounts[key].totalCantidad += r.cantidad;
            prodCounts[key].costo += (r.costo_total || 0);
            prodCounts[key].count++;
        });

        const topProducts = Object.values(prodCounts)
            .sort((a, b) => b.totalCantidad - a.totalCantidad)
            .slice(0, 10);

        const sumCost = (cat) => all.filter(r => r.categoria === cat).reduce((s, r) => s + (r.costo_total || 0), 0);

        return {
            totalApplications: all.length,
            foliares: { count: all.filter(r => r.categoria === 'Foliares').length, costo: sumCost('Foliares') },
            herbicidas: { count: all.filter(r => r.categoria === 'Herbicidas').length, costo: sumCost('Herbicidas') },
            fertilizacion: { count: all.filter(r => r.categoria === 'Fertilizacion').length, costo: sumCost('Fertilizacion') },
            distribution,
            topProducts
        };
    }

    static getFoliares(filters = {}) {
        return this.applyFilters(this.REGISTROS.filter(r => r.categoria === 'Foliares'), filters);
    }

    static getHerbicidas(filters = {}) {
        return this.applyFilters(this.REGISTROS.filter(r => r.categoria === 'Herbicidas'), filters);
    }

    static getFertilizacionComparativa(filters = {}) {
        const all = this.applyFilters(this.REGISTROS.filter(r => r.categoria === 'Fertilizacion'), filters);
        const groups = {};
        all.forEach(r => {
            const clasifica = r.clasifica || 'Sin Clasifica';
            const key = `${clasifica}|${r.producto}|${r.finca}`;
            if (!groups[key]) groups[key] = { cuartel: clasifica, finca: r.finca, producto: r.producto, clasifica, pre: 0, pos: 0, real: 0 };
            const tipo = (r.tipo_registro || '').toLowerCase();
            if (tipo.includes('pre')) groups[key].pre += r.cantidad;
            else if (tipo.includes('pos')) groups[key].pos += r.cantidad;
            else groups[key].real += r.cantidad;
        });

        return Object.values(groups)
            .filter(g => (g.pre + g.pos) > 0)
            .map(g => ({
                ...g,
                metaAnual: g.pre + g.pos,
                desvio: g.real - (g.pre + g.pos),
                desvioPct: (g.pre + g.pos) > 0 ? Math.round(((g.real - (g.pre + g.pos)) / (g.pre + g.pos)) * 100) : 0,
            }));
    }

    static getProductComparison(filters = {}) {
        const all = this.applyFilters(this.REGISTROS.filter(r => r.categoria === 'Fertilizacion'), filters);
        const groups = {};
        all.forEach(r => {
            const key = `${r.clasifica || 'Sin Clasifica'}|${r.producto}`;
            if (!groups[key]) groups[key] = { producto: r.producto, clasifica: r.clasifica || 'Sin Clasifica', pre: 0, real: 0 };
            const tipo = (r.tipo_registro || '').toLowerCase();
            if (tipo.includes('presupuestado')) groups[key].pre += r.cantidad;
            else if (tipo === 'real') groups[key].real += r.cantidad;
        });
        return Object.values(groups)
            .filter(g => g.pre > 0)
            .sort((a, b) => {
                const clasDiff = a.clasifica.localeCompare(b.clasifica);
                if (clasDiff !== 0) return clasDiff;
                return a.producto.localeCompare(b.producto);
            });
    }

    static getWeeklyEvolution(filters = {}, fincaName = '', productoFilter = '', predioFilter = '') {
        // Only these 3 products
        const ALLOWED = ['NUTRI 1075 M', 'NUTRI 1683 M', 'NUTRI 1684 M'];

        const all = this.applyFilters(
            this.REGISTROS.filter(r =>
                r.categoria === 'Fertilizacion' &&
                ALLOWED.includes((r.producto || '').toUpperCase()) &&
                (!fincaName || r.finca_original === fincaName) &&
                (!productoFilter || (r.producto || '').toUpperCase() === productoFilter.toUpperCase()) &&
                (!predioFilter || r.clasifica === predioFilter)
            ),
            filters
        );

        // ── Fixed projection period: 09/09/2025 → 08/03/2026 ──
        const projStart = new Date(2025, 8, 9);   // Sep 9, 2025
        const projEnd = new Date(2026, 2, 8);   // Mar 8, 2026

        // Helper: get Monday of the ISO week for a given date
        const getMonday = (d) => {
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.getFullYear(), d.getMonth(), diff);
        };

        // Helper: format a date as "DD/MM"
        const fmtShort = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

        // Helper: parse dd/mm/yyyy date string
        const parseDate = (str) => {
            if (!str) return null;
            const parts = str.split('/');
            if (parts.length === 3) return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            const parts2 = str.split('-');
            if (parts2.length === 3) return new Date(parseInt(parts2[0]), parseInt(parts2[1]) - 1, parseInt(parts2[2]));
            return null;
        };

        // ── 1. Generate all weeks in the projection range ──
        const weeks = [];
        const weekMap = {};
        let cursor = getMonday(projStart);
        let weekIdx = 0;
        while (cursor <= projEnd) {
            const weekEnd = new Date(cursor);
            weekEnd.setDate(weekEnd.getDate() + 6);
            const label = `S${weekIdx + 1} (${fmtShort(cursor)})`;
            weeks.push({ start: new Date(cursor), end: weekEnd, label });
            weekMap[weekIdx] = { real: 0 };
            cursor.setDate(cursor.getDate() + 7);
            weekIdx++;
        }
        const totalWeeks = weeks.length;

        // ── 2. Calculate total budget → constant weekly fraction ──
        let totalBudget = 0;
        all.forEach(r => {
            const tipo = (r.tipo_registro || '').toLowerCase();
            if (tipo.includes('presupuestado')) totalBudget += r.cantidad;
        });
        const weeklyBudget = totalWeeks > 0 ? Math.round((totalBudget / totalWeeks) * 100) / 100 : 0;

        // ── 3. Assign real data to each week (NOT cumulative) ──
        all.forEach(r => {
            const tipo = (r.tipo_registro || '').toLowerCase();
            if (tipo.includes('presupuestado')) return;

            const fecha = parseDate(r.fecha_aplicacion);
            if (!fecha) return;

            for (let i = 0; i < weeks.length; i++) {
                if (fecha >= weeks[i].start && fecha <= weeks[i].end) {
                    weekMap[i].real += r.cantidad;
                    break;
                }
            }
        });
        console.log(`[Weekly] ${fincaName || 'All'}: ${all.length} records, budget=${totalBudget}, weeks=${totalWeeks}`);

        // ── 4. Build per-week arrays (NOT cumulative) ──
        const labels = [];
        const pptado = [];
        const real = [];

        for (let i = 0; i < totalWeeks; i++) {
            labels.push(weeks[i].label);
            pptado.push(weeklyBudget);  // constant line
            real.push(Math.round(weekMap[i].real * 100) / 100);
        }

        return { labels, pptado, real };
    }

    static getProductosFertilizacion() {
        return ['NUTRI 1075 M', 'NUTRI 1683 M', 'NUTRI 1684 M'];
    }

    static getFertilizacionUnidades(filters = {}, fincaGroup = 'espejo') {
        const compositions = {
            'NITRATO DE CALCIO': { n: 0.155, k: 0, p: 0 },
            'NUTRI 1075 M': { n: 0.0048868, k: 0.0029810, p: 0 },
            'NUTRI 1683 M': { n: 0.0126, k: 0.0284, p: 0 },
            'NUTRI 1684 M': { n: 0.0062, k: 0.0125, p: 0 },
            'SULFATO DE POTASIO': { n: 0, k: 0.50, p: 0 },
            'UREA': { n: 0.46, k: 0, p: 0 }
        };
        const nutrientDensities = {};
        const budgetStats = {};
        const processedBudgets = new Set();

        // Only consider these products for nutrient charts
        const allowedProducts = ['NUTRI 1075 M', 'NUTRI 1683 M', 'NUTRI 1684 M'];

        // Helper: check if record belongs to requested finca group
        const belongsToGroup = (r) => {
            const finca = (r.finca_original || '').toLowerCase();
            if (fincaGroup === 'espejo') return finca.includes('espejo');
            return !finca.includes('espejo'); // fincasviejas = everything else
        };

        // Helper: determine group key
        // El Espejo → por Cod Cuartel (EEI 1, EEI 2, EEII 1, etc.)
        // Fincas Viejas → por Clasifica (Camino Truncado, La Chimbera, Puente Alto)
        const getGroupKey = (r) => {
            if (fincaGroup === 'espejo') {
                return (r.cod_cuartel || r.cuartel || r.clasifica || 'Otros').trim();
            }
            return r.clasifica || 'Otros';
        };

        // ── 1. Process BUDGET rows ──
        this.REGISTROS.forEach(r => {
            if (!belongsToGroup(r)) return;

            const tipo = (r.tipo_registro || '').toLowerCase();
            const isBudget = tipo.includes('presupuestado') || tipo.includes('presupuesto') || tipo.includes('ppto');
            if (!isBudget) return;

            const prod = (r.producto || '').toUpperCase();
            // Only allowed products
            if (!allowedProducts.includes(prod)) return;
            // Product filter (individual selection)
            if (filters.producto && prod !== filters.producto.toUpperCase()) return;

            if (r.cantidad > 0) {
                const key = getGroupKey(r);
                const uniqueKey = `${r.clasifica}-${r.cod_cuartel}-${r.producto}-${r.variedad}-${r.ciclo}-${tipo}`;

                // Get nutrient units: use explicit columns if available, otherwise derive from composition
                let nUnits = r.n_units || 0;
                let pUnits = r.p_units || 0;
                let kUnits = r.k_units || 0;

                // If no explicit units, calculate from known compositions
                if (nUnits === 0 && pUnits === 0 && kUnits === 0 && compositions[prod]) {
                    const comp = compositions[prod];
                    nUnits = r.cantidad * comp.n;
                    pUnits = r.cantidad * comp.p;
                    kUnits = r.cantidad * comp.k;
                }

                if (nUnits > 0 || pUnits > 0 || kUnits > 0) {
                    const cycleMatch = !filters.ciclo || r.ciclo === filters.ciclo || r.ciclo === 'Unknown';
                    const fincaMatch = !filters.finca || r.finca_original === filters.finca;
                    const predioMatch = !filters.predio || r.clasifica === filters.predio;

                    // Store per-group+product ratio for real calculations
                    const ratioKey = `${key}|${prod}`;
                    if (!nutrientDensities[ratioKey]) {
                        nutrientDensities[ratioKey] = { n: 0, p: 0, k: 0, totalQty: 0 };
                    }
                    nutrientDensities[ratioKey].n += nUnits;
                    nutrientDensities[ratioKey].p += pUnits;
                    nutrientDensities[ratioKey].k += kUnits;
                    nutrientDensities[ratioKey].totalQty += r.cantidad;

                    if (cycleMatch && fincaMatch && predioMatch) {
                        if (!processedBudgets.has(uniqueKey)) {
                            processedBudgets.add(uniqueKey);
                            if (!budgetStats[key]) budgetStats[key] = { n: 0, p: 0, k: 0 };

                            budgetStats[key].n += nUnits;
                            budgetStats[key].p += pUnits;
                            budgetStats[key].k += kUnits;
                        }
                    }
                }
            }
        });

        // ── Compute nutrient ratios per group+product (units per liter) ──
        const groupProductRatios = {};
        Object.entries(nutrientDensities).forEach(([ratioKey, sums]) => {
            if (sums.totalQty > 0) {
                groupProductRatios[ratioKey] = {
                    n: sums.n / sums.totalQty,
                    p: sums.p / sums.totalQty,
                    k: sums.k / sums.totalQty
                };
            }
        });

        // ── 2. Process REAL applied rows ──
        const all = this.applyFilters(
            this.REGISTROS.filter(r => r.categoria === 'Fertilizacion' && r.tipo_registro === 'Real' && belongsToGroup(r)),
            filters
        );
        const realStats = {};

        all.forEach(r => {
            const prod = (r.producto || '').toUpperCase();
            // Only allowed products
            if (!allowedProducts.includes(prod)) return;
            // Product filter (individual selection)
            if (filters.producto && prod !== filters.producto.toUpperCase()) return;

            const key = getGroupKey(r);
            if (!realStats[key]) realStats[key] = { n: 0, p: 0, k: 0 };

            let appliedN = 0, appliedP = 0, appliedK = 0;

            // Use group+product specific ratio first
            const ratioKey = `${key}|${prod}`;
            if (groupProductRatios[ratioKey]) {
                const ratios = groupProductRatios[ratioKey];
                appliedN = r.cantidad * ratios.n;
                appliedP = r.cantidad * ratios.p;
                appliedK = r.cantidad * ratios.k;
            } else {
                // Fallback: average ratio from other groups that have this product
                const prodRatios = Object.entries(groupProductRatios)
                    .filter(([k]) => k.endsWith(`|${prod}`))
                    .map(([, v]) => v);

                if (prodRatios.length > 0) {
                    const avgN = prodRatios.reduce((s, r) => s + r.n, 0) / prodRatios.length;
                    const avgP = prodRatios.reduce((s, r) => s + r.p, 0) / prodRatios.length;
                    const avgK = prodRatios.reduce((s, r) => s + r.k, 0) / prodRatios.length;
                    appliedN = r.cantidad * avgN;
                    appliedP = r.cantidad * avgP;
                    appliedK = r.cantidad * avgK;
                }
                // If no budget data at all, nutrients stay at 0 (don't use hardcoded compositions)
            }

            realStats[key].n += appliedN;
            realStats[key].p += appliedP;
            realStats[key].k += appliedK;
        });

        // ── 3. Merge and return ──
        const allKeys = new Set([...Object.keys(budgetStats), ...Object.keys(realStats)]);

        return Array.from(allKeys).map(name => ({
            name,
            n: { budget: parseFloat((budgetStats[name]?.n || 0).toFixed(2)), real: parseFloat((realStats[name]?.n || 0).toFixed(2)) },
            p: { budget: parseFloat((budgetStats[name]?.p || 0).toFixed(2)), real: parseFloat((realStats[name]?.p || 0).toFixed(2)) },
            k: { budget: parseFloat((budgetStats[name]?.k || 0).toFixed(2)), real: parseFloat((realStats[name]?.k || 0).toFixed(2)) },
        })).sort((a, b) => a.name.localeCompare(b.name));
    }
}
