/**
 * ═══════════════════════════════════════════════════════════
 * NATURALFOOD - Model Layer
 * Agricultural Management Platform
 * 
 * Manages all data (simulated with localStorage + mock data).
 * In production, these would connect to a REST API / database.
 * ═══════════════════════════════════════════════════════════
 */

// ── Base API Configuration ──
const BASE_API_URL = 'http://localhost:10000/api';

// ── User Model ──
export class UserModel {
  static ROLES = {
    ADMIN: 'Administrador',
    ENGINEER: 'Ingeniero',
    RRHH: 'RRHH',
    CARGA: 'Carga',
    SUBADMIN: 'Sub-Admin'
  };

  static CACHE = [
    { id: 1, name: 'Admin Natural', email: 'admin@naturalfood.com', password: 'admin', role: 'Administrador', active: true, registeredAt: '2025-01-01' },
    { id: 2, name: 'Sub Admin', email: 'subadmin@naturalfood.com', password: 'N4tur4lf00d$00', role: 'Sub-Admin', active: true, registeredAt: '2025-01-05' },
    { id: 3, name: 'Visualizador', email: 'v@naturalfood.com', password: 'v', role: 'Visualizador', active: true, registeredAt: '2025-02-10' },
    { id: 4, name: 'Ingeniero Laura', email: 'laura@naturalfood.com', password: 'laura', role: 'Ingeniero', active: true, registeredAt: '2025-02-15' }
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/users?includePending=true`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) {
      console.warn('Sync users failed.', e);
    }
  }

  static async authenticate(email, password) {
    try {
      const resp = await fetch(`${BASE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await resp.json();
      if (data.success) {
        localStorage.setItem('nf_session', JSON.stringify(data.user));
        return data.user;
      }
      if (data.pending) return { pending: true };
      return null;
    } catch (e) {
      console.warn('Backend reach error, using static fallback:', e);
      const user = this.CACHE.find(u => u.email === email && u.password === password);
      if (user) {
        if (!user.active) return { pending: true };
        const session = { ...user };
        delete session.password;
        localStorage.setItem('nf_session', JSON.stringify(session));
        return session;
      }
      return null;
    }
  }

  static getCurrentUser() {
    const session = localStorage.getItem('nf_session');
    return session ? JSON.parse(session) : null;
  }

  static logout() {
    localStorage.removeItem('nf_session');
  }

  static async getAll(options = {}) {
    try {
      let url = `${BASE_API_URL}/users`;
      if (options.includePending) url += '?includePending=true';
      const resp = await fetch(url);
      return await resp.json();
    } catch (e) {
      console.warn('Backend reach error, using static fallback:', e);
      let users = [...this.CACHE];
      if (!options.includePending) {
        users = users.filter(u => !u.pending && u.active);
      }
      return users.map(u => {
        const { password, ...user } = u;
        return user;
      });
    }
  }

  static add(userData) {
    const newId = Math.max(...this.CACHE.map(u => u.id)) + 1;
    const avatar = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newUser = { id: newId, ...userData, avatar, active: userData.active !== undefined ? userData.active : true };
    this.CACHE.push(newUser);
    return newUser;
  }

  static async register(name, email, password) {
    try {
      const resp = await fetch(`${BASE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      return await resp.json();
    } catch (e) {
      console.warn('Backend reach error, using static fallback:', e);
      const exists = this.CACHE.find(u => u.email === email);
      if (exists) return { error: 'Este correo ya está registrado.' };

      const newUser = this.add({ name, email, password, role: 'Sub-Admin', active: false, pending: true, registeredAt: new Date().toISOString() });

      NotificationModel.add({
        title: 'Nueva solicitud de registro',
        message: `${name} (${email}) solicita acceso como Sub-Administrador.`,
        type: 'info',
        time: 'Ahora',
        read: false,
        actionType: 'approve_user',
        actionUserId: newUser.id
      });

      return { success: true, user: newUser };
    }
  }

  static async approveUser(id) {
    try {
      const resp = await fetch(`${BASE_API_URL}/users/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await resp.json();
      if (data.success) {
        NotificationModel.removeByActionUserId(id);
      }
      return data.success;
    } catch (e) {
      console.warn('Sync fallback for approval', e);
      const user = this.CACHE.find(u => u.id === id);
      if (user) {
        user.active = true;
        user.pending = false;
        NotificationModel.removeByActionUserId(id);
        return true;
      }
      return false;
    }
  }

  static async rejectUser(id) {
    try {
      const resp = await fetch(`${BASE_API_URL}/users/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await resp.json();
      if (data.success) {
        NotificationModel.removeByActionUserId(id);
      }
      return data.success;
    } catch (e) {
      const idx = this.CACHE.findIndex(u => u.id === id);
      if (idx !== -1) {
        this.CACHE.splice(idx, 1);
        NotificationModel.removeByActionUserId(id);
        return true;
      }
      return false;
    }
  }

  static async update(id, userData) {
    try {
      const resp = await fetch(`${BASE_API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await resp.json();
    } catch (e) {
      const idx = this.CACHE.findIndex(u => u.id === id);
      if (idx !== -1) {
        this.CACHE[idx] = { ...this.CACHE[idx], ...userData };
        return this.CACHE[idx];
      }
      return null;
    }
  }

  static async delete(id) {
    return await this.update(id, { active: false });
  }

  static async getPendingUsers() {
    const all = await this.getAll({ includePending: true });
    return all.filter(u => u.pending && !u.active);
  }
}

// ── Finca (Farm) Model ──
export class FincaModel {
  static CACHE = [
    { id: 1, name: 'Finca La Esperanza', location: 'San Martín, Mendoza', hectares: 120, predios: 8, status: 'active', manager: 'Carlos Mendoza' },
    { id: 2, name: 'Finca El Sol', location: 'Junín, Mendoza', hectares: 85, predios: 5, status: 'active', manager: 'Laura Vásquez' },
    { id: 3, name: 'Finca Las Viñas', location: 'Rivadavia, San Juan', hectares: 200, predios: 12, status: 'active', manager: 'Carlos Mendoza' },
    { id: 4, name: 'Finca San Pedro', location: 'San Rafael, Mendoza', hectares: 65, predios: 4, status: 'inactive', manager: 'Roberto Díaz' },
    { id: 5, name: 'Finca Valle Grande', location: 'Caucete, San Juan', hectares: 150, predios: 9, status: 'active', manager: 'Laura Vásquez' },
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/fincas`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) { console.warn('Sync fincas failed, using cache/static.', e); }
  }

  static getAll() { return [...this.CACHE]; }
  static getById(id) { return this.CACHE.find(f => f.id === id); }
  static getActive() { return this.CACHE.filter(f => f.status === 'active'); }
  static getTotalHectares() {
    return this.getActive().reduce((sum, f) => sum + Number(f.hectares), 0);
  }
}

// ── Predio (Plot) Model ──
export class PredioModel {
  static CACHE = [
    { id: 1, fincaId: 1, name: 'Parcela Norte A', hectares: 15, variety: 'Flame Seedless', irrigationType: 'Goteo', soilType: 'Franco-arenoso', status: 'active' },
    { id: 2, fincaId: 1, name: 'Parcela Norte B', hectares: 18, variety: 'Superior Seedless', irrigationType: 'Goteo', soilType: 'Franco', status: 'active' },
    { id: 3, fincaId: 1, name: 'Parcela Sur A', hectares: 12, variety: 'Sultanina', irrigationType: 'Aspersión', soilType: 'Franco-arcilloso', status: 'active' },
    { id: 4, fincaId: 2, name: 'Sector Este 1', hectares: 20, variety: 'Flame Seedless', irrigationType: 'Goteo', soilType: 'Arenoso', status: 'active' },
    { id: 5, fincaId: 2, name: 'Sector Oeste 1', hectares: 22, variety: 'Crimson Seedless', irrigationType: 'Goteo', soilType: 'Franco', status: 'active' },
    { id: 6, fincaId: 3, name: 'Lote 1', hectares: 25, variety: 'Sultanina', irrigationType: 'Surco', soilType: 'Franco-arenoso', status: 'active' },
    { id: 7, fincaId: 3, name: 'Lote 2', hectares: 30, variety: 'Flame Seedless', irrigationType: 'Goteo', soilType: 'Franco', status: 'active' },
    { id: 8, fincaId: 3, name: 'Lote 3', hectares: 28, variety: 'Superior Seedless', irrigationType: 'Goteo', soilType: 'Arcilloso', status: 'pending' },
    { id: 9, fincaId: 5, name: 'Area Central', hectares: 35, variety: 'Crimson Seedless', irrigationType: 'Goteo', soilType: 'Franco-arenoso', status: 'active' },
    { id: 10, fincaId: 5, name: 'Area Sur', hectares: 40, variety: 'Sultanina', irrigationType: 'Aspersión', soilType: 'Franco', status: 'active' },
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/predios`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) { console.warn('Sync predios failed.', e); }
  }

  static getAll() { return [...this.CACHE]; }
  static getByFinca(fincaId) { return this.CACHE.filter(p => p.finca_id === fincaId || p.fincaId === fincaId); }
  static getById(id) { return this.CACHE.find(p => p.id === id); }
}

// ── Variedad (Grape Variety) Model ──
export class VariedadModel {
  static CACHE = [
    { id: 1, name: 'Flame Seedless', type: 'Roja', daysToHarvest: 115, sugarContent: '18-20°Brix', usage: 'Pasa / Mesa', status: 'active' },
    { id: 2, name: 'Superior Seedless', type: 'Verde', daysToHarvest: 120, sugarContent: '16-18°Brix', usage: 'Mesa', status: 'active' },
    { id: 3, name: 'Sultanina', type: 'Verde', daysToHarvest: 110, sugarContent: '20-22°Brix', usage: 'Pasa', status: 'active' },
    { id: 4, name: 'Crimson Seedless', type: 'Roja', daysToHarvest: 130, sugarContent: '17-19°Brix', usage: 'Mesa / Pasa', status: 'active' },
    { id: 5, name: 'Thompson Seedless', type: 'Verde', daysToHarvest: 105, sugarContent: '19-22°Brix', usage: 'Pasa', status: 'active' },
    { id: 6, name: 'Red Globe', type: 'Roja', daysToHarvest: 140, sugarContent: '15-17°Brix', usage: 'Mesa', status: 'inactive' },
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/variedades`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) { console.warn('Sync variedades failed.', e); }
  }

  static getAll() { return [...this.CACHE]; }
  static getActive() { return this.CACHE.filter(v => v.status === 'active'); }
}

// ── Empleado (Employee) Model ──
export class EmpleadoModel {
  static CACHE = [
    { id: 1, legajo: 'EMP-001', name: 'Pedro Sánchez', dni: '30245678', position: 'Capataz', finca: 'Finca La Esperanza', startDate: '2020-03-15', status: 'active', salary: 280000 },
    { id: 2, legajo: 'EMP-002', name: 'Miguel Ángel Torres', dni: '32456789', position: 'Peón Rural', finca: 'Finca La Esperanza', startDate: '2021-06-01', status: 'active', salary: 220000 },
    { id: 3, legajo: 'EMP-003', name: 'Rosa Fernández', dni: '28345612', position: 'Encargada de Poda', finca: 'Finca El Sol', startDate: '2019-11-20', status: 'active', salary: 250000 },
    { id: 4, legajo: 'EMP-004', name: 'Diego López', dni: '35678901', position: 'Peón Rural', finca: 'Finca Las Viñas', startDate: '2022-01-10', status: 'active', salary: 220000 },
    { id: 5, legajo: 'EMP-005', name: 'Lucía Morales', dni: '31098765', position: 'Técnica Agrónoma', finca: 'Finca Valle Grande', startDate: '2020-08-05', status: 'active', salary: 320000 },
    { id: 6, legajo: 'EMP-006', name: 'Fernando Ruiz', dni: '29876543', position: 'Operador de Maquinaria', finca: 'Finca La Esperanza', startDate: '2018-04-22', status: 'inactive', salary: 260000 },
    { id: 7, legajo: 'EMP-007', name: 'Valentina Castro', dni: '33210987', position: 'Peón Rural', finca: 'Finca Las Viñas', startDate: '2023-02-14', status: 'active', salary: 220000 },
    { id: 8, legajo: 'EMP-008', name: 'Ramón Ortega', dni: '27654321', position: 'Capataz', finca: 'Finca El Sol', startDate: '2017-09-30', status: 'active', salary: 290000 },
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/empleados`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) { console.warn('Sync empleados failed.', e); }
  }

  static getAll() { return [...this.CACHE]; }
  static getActive() { return this.CACHE.filter(e => e.status === 'active'); }
  static getById(id) { return this.CACHE.find(e => e.id === id); }
  static getByFinca(finca) { return this.CACHE.filter(e => e.finca === finca); }
}

// ── Labor (Field Work) Model ──
export class LaborModel {
  static CACHE = [
    { id: 1, date: '2026-02-10', type: 'Poda', predio: 'Parcela Norte A', finca: 'Finca La Esperanza', employee: 'Pedro Sánchez', hours: 8, notes: 'Poda de formación completada', status: 'completed' },
    { id: 2, date: '2026-02-10', type: 'Riego', predio: 'Sector Este 1', finca: 'Finca El Sol', employee: 'Rosa Fernández', hours: 6, notes: 'Riego por goteo - turno mañana', status: 'completed' },
    { id: 3, date: '2026-02-09', type: 'Fumigación', predio: 'Lote 1', finca: 'Finca Las Viñas', employee: 'Diego López', hours: 7, notes: 'Aplicación de fungicida preventivo', status: 'completed' },
    { id: 4, date: '2026-02-09', type: 'Cosecha', predio: 'Area Central', finca: 'Finca Valle Grande', employee: 'Lucía Morales', hours: 10, notes: 'Cosecha selectiva Crimson', status: 'completed' },
    { id: 5, date: '2026-02-08', type: 'Desmalezado', predio: 'Parcela Sur A', finca: 'Finca La Esperanza', employee: 'Miguel Ángel Torres', hours: 8, notes: 'Limpieza entre hileras', status: 'completed' },
    { id: 6, date: '2026-02-08', type: 'Fertilización', predio: 'Lote 2', finca: 'Finca Las Viñas', employee: 'Valentina Castro', hours: 5, notes: 'Aplicación de NPK 15-15-15', status: 'completed' },
    { id: 7, date: '2026-02-07', type: 'Poda', predio: 'Sector Oeste 1', finca: 'Finca El Sol', employee: 'Ramón Ortega', hours: 8, notes: 'Poda de producción', status: 'completed' },
    { id: 8, date: '2026-02-07', type: 'Riego', predio: 'Area Sur', finca: 'Finca Valle Grande', employee: 'Lucía Morales', hours: 4, notes: 'Control de humedad en suelo', status: 'completed' },
    { id: 9, date: '2026-02-11', type: 'Cosecha', predio: 'Parcela Norte B', finca: 'Finca La Esperanza', employee: 'Pedro Sánchez', hours: 0, notes: 'Programada para mañana', status: 'pending' },
    { id: 10, date: '2026-02-11', type: 'Fumigación', predio: 'Sector Este 1', finca: 'Finca El Sol', employee: 'Rosa Fernández', hours: 0, notes: 'Aplicación programada', status: 'pending' },
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/labores`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) { console.warn('Sync labores failed.', e); }
  }

  static getAll() { return [...this.CACHE]; }
  static getCompleted() { return this.CACHE.filter(l => l.status === 'completed'); }
  static getPending() { return this.CACHE.filter(l => l.status === 'pending'); }
  static getByFinca(finca) { return this.CACHE.filter(l => l.finca === finca || l.finca_name === finca); }
  static getByEmployee(employee) { return this.CACHE.filter(l => l.employee === employee || l.employee_name === employee); }

  static getByType() {
    const counts = {};
    this.CACHE.forEach(l => {
      counts[l.type] = (counts[l.type] || 0) + 1;
    });
    return counts;
  }

  static getHoursByFinca() {
    const hours = {};
    this.CACHE.filter(l => l.status === 'completed').forEach(l => {
      const fn = l.finca_name || l.finca;
      hours[fn] = (hours[fn] || 0) + Number(l.hours);
    });
    return hours;
  }
}

// ── Presupuesto (Budget) Model ──
export class PresupuestoModel {
  static CACHE = [
    { id: 1, category: 'Mano de Obra', planned: 2500000, executed: 2180000, month: 'Enero 2026' },
    { id: 2, category: 'Insumos Agroquímicos', planned: 1800000, executed: 1950000, month: 'Enero 2026' },
    { id: 3, category: 'Riego y Energía', planned: 800000, executed: 720000, month: 'Enero 2026' },
    { id: 4, category: 'Maquinaria', planned: 1200000, executed: 1100000, month: 'Enero 2026' },
    { id: 5, category: 'Transporte', planned: 600000, executed: 580000, month: 'Enero 2026' },
    { id: 6, category: 'Mano de Obra', planned: 2600000, executed: 2450000, month: 'Febrero 2026' },
    { id: 7, category: 'Insumos Agroquímicos', planned: 2000000, executed: 1750000, month: 'Febrero 2026' },
    { id: 8, category: 'Riego y Energía', planned: 900000, executed: 850000, month: 'Febrero 2026' },
    { id: 9, category: 'Maquinaria', planned: 1000000, executed: 920000, month: 'Febrero 2026' },
    { id: 10, category: 'Transporte', planned: 650000, executed: 600000, month: 'Febrero 2026' },
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/presupuestos`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) { console.warn('Sync presupuestos failed.', e); }
  }

  static getAll() { return [...this.CACHE]; }
  static getByMonth(month) { return this.CACHE.filter(p => p.month === month); }
  static getTotalPlanned() { return this.CACHE.reduce((sum, p) => sum + Number(p.planned), 0); }
  static getTotalExecuted() { return this.CACHE.reduce((sum, p) => sum + Number(p.executed), 0); }
  static getExecutionPercentage() {
    const planned = this.getTotalPlanned();
    const executed = this.getTotalExecuted();
    return planned > 0 ? Math.round((executed / planned) * 100) : 0;
  }

  static getByCategory() {
    const result = {};
    this.CACHE.forEach(p => {
      if (!result[p.category]) {
        result[p.category] = { planned: 0, executed: 0 };
      }
      result[p.category].planned += Number(p.planned);
      result[p.category].executed += Number(p.executed);
    });
    return result;
  }
}

// ── Aplicacion (Applications/Treatments) Model ──
export class AplicacionModel {
  static CACHE = [
    { id: 1, product: 'Fungicida Mancozeb', dose: '2.5 kg/ha', predio: 'Parcela Norte A', date: '2026-02-03', status: 'applied', engineer: 'Laura Vásquez' },
    { id: 2, product: 'Insecticida Lambda', dose: '0.8 L/ha', predio: 'Sector Este 1', date: '2026-02-05', status: 'applied', engineer: 'Laura Vásquez' },
    { id: 3, product: 'Fertilizante NPK', dose: '15 kg/ha', predio: 'Lote 1', date: '2026-02-07', status: 'applied', engineer: 'Laura Vásquez' },
    { id: 4, product: 'Herbicida Glifosato', dose: '3 L/ha', predio: 'Area Central', date: '2026-02-10', status: 'pending', engineer: 'Laura Vásquez' },
    { id: 5, product: 'Regulador de Crecimiento', dose: '1.2 L/ha', predio: 'Parcela Norte B', date: '2026-02-12', status: 'scheduled', engineer: 'Laura Vásquez' },
  ];

  static async sync() {
    try {
      const resp = await fetch(`${BASE_API_URL}/aplicaciones`);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) { console.warn('Sync aplicaciones failed.', e); }
  }

  static getAll() { return [...this.CACHE]; }
  static getApplied() { return this.CACHE.filter(a => a.status === 'applied'); }
  static getPending() { return this.CACHE.filter(a => a.status !== 'applied'); }
}

// ── Notification Model ──
export class NotificationModel {
  static NOTIFICATIONS = [
    { id: 1, title: 'Labor pendiente', message: 'Cosecha programada en Parcela Norte B para mañana', type: 'warning', time: 'Hace 2 horas', read: false },
    { id: 2, title: 'Presupuesto excedido', message: 'Insumos Agroquímicos superó el presupuesto en un 8%', type: 'error', time: 'Hace 5 horas', read: false },
    { id: 3, title: 'Aplicación completada', message: 'Fungicida Mancozeb aplicado en Parcela Norte A', type: 'success', time: 'Ayer', read: false },
    { id: 4, title: 'Nuevo empleado', message: 'Se registró a Valentina Castro como Peón Rural', type: 'info', time: 'Hace 2 días', read: true },
  ];

  static async getAll() { return [...this.NOTIFICATIONS]; }
  static getUnread() { return this.NOTIFICATIONS.filter(n => !n.read); }
  static markAsRead(id) {
    const notif = this.NOTIFICATIONS.find(n => n.id === id);
    if (notif) notif.read = true;
  }
  static markAllRead() {
    this.NOTIFICATIONS.forEach(n => n.read = true);
  }
  static add(notifData) {
    const newId = this.NOTIFICATIONS.length > 0 ? Math.max(...this.NOTIFICATIONS.map(n => n.id)) + 1 : 1;
    const notif = { id: newId, ...notifData };
    this.NOTIFICATIONS.unshift(notif);
    return notif;
  }
  static removeByActionUserId(userId) {
    this.NOTIFICATIONS = this.NOTIFICATIONS.filter(n => n.actionUserId !== userId);
  }
}

// ═══════════════════════════════════════════════════════════
// MÓDULO: Administración Usuarios - Modelo CRUD Genérico
// ═══════════════════════════════════════════════════════════

export class AdminCrudModel {
  constructor(tableName, label) {
    this.tableName = tableName;
    this.label = label;
    this.apiRoute = `${BASE_API_URL}/${tableName.replace(/_/g, '-')}`;
    this.CACHE = [];
  }

  async sync() {
    try {
      const resp = await fetch(this.apiRoute);
      const data = await resp.json();
      if (Array.isArray(data)) this.CACHE = data;
    } catch (e) {
      console.warn(`Sync ${this.tableName} failed.`, e);
    }
  }

  async getAll(includeInactive = false) {
    try {
      const url = includeInactive ? `${this.apiRoute}?all=true` : this.apiRoute;
      const resp = await fetch(url);
      const data = await resp.json();
      if (Array.isArray(data)) {
        this.CACHE = data;
        return data;
      }
      return this.CACHE;
    } catch (e) {
      console.warn(`Fetch ${this.tableName} failed, using cache.`, e);
      return [...this.CACHE];
    }
  }

  async getById(id) {
    try {
      const resp = await fetch(`${this.apiRoute}/${id}`);
      return await resp.json();
    } catch (e) {
      return this.CACHE.find(item => item.id === id) || null;
    }
  }

  async create(data) {
    try {
      const resp = await fetch(this.apiRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await resp.json();
      if (result.success) await this.sync();
      return result;
    } catch (e) {
      console.error(`Create ${this.tableName} error:`, e);
      return { success: false, message: 'Error de conexión' };
    }
  }

  async update(id, data) {
    try {
      const resp = await fetch(`${this.apiRoute}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await resp.json();
      if (result.success) await this.sync();
      return result;
    } catch (e) {
      console.error(`Update ${this.tableName} error:`, e);
      return { success: false, message: 'Error de conexión' };
    }
  }

  async delete(id) {
    try {
      const resp = await fetch(`${this.apiRoute}/${id}`, { method: 'DELETE' });
      const result = await resp.json();
      if (result.success) await this.sync();
      return result;
    } catch (e) {
      console.error(`Delete ${this.tableName} error:`, e);
      return { success: false, message: 'Error de conexión' };
    }
  }
}

// ── Instancias de los modelos de Administración ──
export const AdminFincasModel = new AdminCrudModel('admin_fincas', 'Fincas');
export const AdminPrediosModel = new AdminCrudModel('admin_predios', 'Predios');
export const AdminCuartelesModel = new AdminCrudModel('admin_cuarteles', 'Cuarteles/Parcelas');
export const AdminFaenasModel = new AdminCrudModel('admin_faenas', 'Faenas');
export const AdminLaborModel = new AdminCrudModel('admin_labor', 'Labor');
export const AdminPersonalModel = new AdminCrudModel('empleados', 'Personal');
export const AdminBodegasModel = new AdminCrudModel('admin_bodegas', 'Bodegas');
export const AdminProductosModel = new AdminCrudModel('admin_productos', 'Productos');
export const AdminInstitucionalModel = new AdminCrudModel('admin_institucional', 'Institucional');
export const AdminZonasRiegoModel = new AdminCrudModel('admin_zonas_riego', 'Zonas de Riego');
export const AdminSistemaRiegoModel = new AdminCrudModel('admin_sistema_riego', 'Sistema de Riego');
export const AdminPlanificacionModel = new AdminCrudModel('admin_planificacion', 'Planificación');
export const AdminContratosModel = new AdminCrudModel('admin_contratos', 'Contratos');

// Mapa para acceso rápido por ID de sección
export const ADMIN_MODELS = {
  'admin-fincas': AdminFincasModel,
  'admin-predios': AdminPrediosModel,
  'admin-cuarteles': AdminCuartelesModel,
  'admin-faenas': AdminFaenasModel,
  'admin-labor': AdminLaborModel,
  'admin-personal': AdminPersonalModel,
  'admin-bodegas': AdminBodegasModel,
  'admin-productos': AdminProductosModel,
  'admin-institucional': AdminInstitucionalModel,
  'admin-zonas-riego': AdminZonasRiegoModel,
  'admin-sistema-riego': AdminSistemaRiegoModel,
  'admin-planificacion': AdminPlanificacionModel,
  'admin-contratos': AdminContratosModel,
  'admin-carga-trabajo': new AdminCrudModel('trabajo_campo_logs', 'Carga Trabajo'),
};

// Configuración de columnas para cada tabla (para renderizar tablas/formularios genéricos)
export const ADMIN_TABLE_CONFIG = {
  'admin-fincas': {
    title: 'Gestión de Fincas',
    icon: '🏡',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'ubicacion', label: 'Ubicación', type: 'text' },
      { key: 'hectareas', label: 'Hectáreas', type: 'number' },
      { key: 'encargado', label: 'Encargado', type: 'text' },
      { key: 'telefono', label: 'Teléfono', type: 'text' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-predios': {
    title: 'Gestión de Predios',
    icon: '📍',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'finca_id', label: 'Finca (ID)', type: 'number' },
      { key: 'superficie', label: 'Superficie (ha)', type: 'number' },
      { key: 'variedad', label: 'Variedad', type: 'text' },
      { key: 'tipo_suelo', label: 'Tipo de Suelo', type: 'text' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-cuarteles': {
    title: 'Gestión de Cuarteles/Parcelas',
    icon: '🗺️',
    columns: [
      { key: 'numero', label: 'Nº de Cuartel', type: 'number', required: true },
      { key: 'predio_id', label: 'Predio (ID)', type: 'number' },
      { key: 'superficie', label: 'Superficie (ha)', type: 'number' },
      { key: 'variedad', label: 'Variedad', type: 'text' },
      { key: 'hileras', label: 'Hileras', type: 'number' },
      { key: 'plantas_por_hilera', label: 'Plantas/Hilera', type: 'number' },
      { key: 'sistema_conduccion', label: 'Sistema Conducción', type: 'text' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-faenas': {
    title: 'Gestión de Faenas',
    icon: '📋',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'categoria', label: 'Categoría', type: 'text' },
      { key: 'duracion_estimada', label: 'Duración Estimada', type: 'text' },
      { key: 'costo_estimado', label: 'Costo Estimado', type: 'number' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-labor': {
    title: 'Gestión de Labor',
    icon: '🔨',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'faena_id', label: 'Faena (ID)', type: 'number' },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'unidad_medida', label: 'Unidad de Medida', type: 'text' },
      { key: 'costo_unitario', label: 'Costo Unitario', type: 'number' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-personal': {
    title: 'Gestión de Personal',
    icon: '👷',
    columns: [
      { key: 'legajo', label: 'Legajo', type: 'text', required: true },
      { key: 'name', label: 'Nombre Completo', type: 'text', required: true },
      { key: 'dni', label: 'DNI', type: 'text' },
      { key: 'position', label: 'Cargo/Puesto', type: 'text' },
      { key: 'finca', label: 'Finca', type: 'text' },
      { key: 'start_date', label: 'Fecha de Ingreso', type: 'date' },
      { key: 'salary', label: 'Salario (Base)', type: 'number' },
    ]
  },
  'admin-bodegas': {
    title: 'Gestión de Bodegas',
    icon: '🏭',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'finca_id', label: 'Finca (ID)', type: 'number' },
      { key: 'ubicacion', label: 'Ubicación', type: 'text' },
      { key: 'capacidad', label: 'Capacidad', type: 'text' },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { key: 'encargado', label: 'Encargado', type: 'text' },
      { key: 'telefono', label: 'Teléfono', type: 'text' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-productos': {
    title: 'Gestión de Productos e Insumos',
    icon: '📦',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'categoria', label: 'Categoría', type: 'select', options: ['Insumo', 'Herramienta', 'Otro'] },
      { key: 'bodega_id', label: 'Bodega (ID)', type: 'number' },
      { key: 'unidad', label: 'Unidad', type: 'text' },
      { key: 'stock', label: 'Stock Actual', type: 'number' },
      { key: 'proveedor', label: 'Proveedor', type: 'text' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-institucional': {
    title: 'Gestión Institucional',
    icon: '🏛️',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { key: 'direccion', label: 'Dirección', type: 'text' },
      { key: 'telefono', label: 'Teléfono', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'contacto', label: 'Contacto', type: 'text' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-zonas-riego': {
    title: 'Gestión de Zonas de Riego',
    icon: '💧',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'finca_id', label: 'Finca (ID)', type: 'number' },
      { key: 'superficie', label: 'Superficie (ha)', type: 'number' },
      { key: 'tipo_riego', label: 'Tipo de Riego', type: 'text' },
      { key: 'caudal', label: 'Caudal', type: 'text' },
      { key: 'frecuencia', label: 'Frecuencia', type: 'text' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-sistema-riego': {
    title: 'Gestión de Sistemas de Riego',
    icon: '🚿',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { key: 'marca', label: 'Marca', type: 'text' },
      { key: 'modelo', label: 'Modelo', type: 'text' },
      { key: 'capacidad', label: 'Capacidad', type: 'text' },
      { key: 'zona_riego_id', label: 'Zona Riego (ID)', type: 'number' },
      { key: 'fecha_instalacion', label: 'Fecha Instalación', type: 'date' },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-planificacion': {
    title: 'Gestión de Planificación',
    icon: '📅',
    columns: [
      { key: 'titulo', label: 'Título', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea' },
      { key: 'tipo', label: 'Tipo', type: 'text' },
      { key: 'fecha_inicio', label: 'Fecha Inicio', type: 'date' },
      { key: 'fecha_fin', label: 'Fecha Fin', type: 'date' },
      { key: 'responsable', label: 'Responsable', type: 'text' },
      { key: 'prioridad', label: 'Prioridad', type: 'select', options: ['alta', 'media', 'baja'] },
      { key: 'estado', label: 'Estado', type: 'select', options: ['pendiente', 'en_progreso', 'completado', 'cancelado'] },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-contratos': {
    title: 'Gestión de Contratos',
    icon: '📄',
    columns: [
      { key: 'empleado_id', label: 'Empleado (ID)', type: 'number', required: true },
      { key: 'numero_contrato', label: 'Nº Contrato', type: 'text' },
      { key: 'tipo_contrato', label: 'Tipo', type: 'text' },
      { key: 'fecha_inicio', label: 'Inicio', type: 'date', required: true },
      { key: 'fecha_fin', label: 'Fin (Opcional)', type: 'date' },
      { key: 'salario_acordado', label: 'Salario Acordado', type: 'number' },
      { key: 'estado', label: 'Estado', type: 'select', options: ['activo', 'vencido', 'cancelado'] },
      { key: 'notas', label: 'Notas', type: 'textarea' },
    ]
  },
  'admin-carga-trabajo': {
    title: 'Carga de Trabajo de Campo',
    icon: '📝',
    columns: [
      { key: 'fecha', label: 'Fecha', type: 'date', required: true },
      { key: 'empleado_id', label: 'ID Empleado', type: 'number', required: true },
      { key: 'finca_id', label: 'ID Finca', type: 'number', required: true },
      { key: 'predio_id', label: 'ID Predio', type: 'number', required: true },
      { key: 'cuartel_id', label: 'ID Cuartel/Parcela', type: 'number', required: true },
      { key: 'faena_id', label: 'ID Faena (Tarea)', type: 'number', required: true },
      { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
      { key: 'unidad', label: 'Unidad (horas/surcos/etc)', type: 'text' },
      { key: 'notas', label: 'Observaciones', type: 'textarea' },
    ]
  }
};
