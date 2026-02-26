/**
 * ═══════════════════════════════════════════════════════════
 * NATURALFOOD - Model Layer
 * Agricultural Management Platform
 * 
 * Manages all data (simulated with localStorage + mock data).
 * In production, these would connect to a REST API / database.
 * ═══════════════════════════════════════════════════════════
 */

// ── User Model ──
export class UserModel {
  static ROLES = {
    ADMIN: 'Administrador',
    ENGINEER: 'Ingeniero',
    RRHH: 'RRHH',
    CARGA: 'Carga',
    SUBADMIN: 'Sub-Admin'
  };

  static USERS = [
    { id: 1, name: 'Carlos Mendoza', email: 'admin@naturalfood.com', password: 'admin123', role: 'Administrador', avatar: 'CM', active: true },
    { id: 2, name: 'Laura Vásquez', email: 'ingeniero@naturalfood.com', password: 'ing123', role: 'Ingeniero', avatar: 'LV', active: true },
    { id: 3, name: 'María García', email: 'rrhh@naturalfood.com', password: 'rrhh123', role: 'RRHH', avatar: 'MG', active: true },
    { id: 4, name: 'Juan Pérez', email: 'carga@naturalfood.com', password: 'carga123', role: 'Carga', avatar: 'JP', active: true },
    { id: 5, name: 'Roberto Díaz', email: 'subadmin@naturalfood.com', password: 'sub123', role: 'Sub-Admin', avatar: 'RD', active: true },
    { id: 6, name: 'Ana Martínez', email: 'ana@naturalfood.com', password: 'ana123', role: 'Carga', avatar: 'AM', active: true },
  ];

  static authenticate(email, password) {
    const user = this.USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const session = { ...user };
      delete session.password;
      localStorage.setItem('nf_session', JSON.stringify(session));
      return session;
    }
    return null;
  }

  static getCurrentUser() {
    const session = localStorage.getItem('nf_session');
    return session ? JSON.parse(session) : null;
  }

  static logout() {
    localStorage.removeItem('nf_session');
  }

  static getAll() {
    return this.USERS.map(u => {
      const { password, ...user } = u;
      return user;
    });
  }

  static add(userData) {
    const newId = Math.max(...this.USERS.map(u => u.id)) + 1;
    const avatar = userData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const newUser = { id: newId, ...userData, avatar, active: true };
    this.USERS.push(newUser);
    return newUser;
  }

  static update(id, userData) {
    const idx = this.USERS.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.USERS[idx] = { ...this.USERS[idx], ...userData };
      return this.USERS[idx];
    }
    return null;
  }

  static delete(id) {
    const idx = this.USERS.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.USERS[idx].active = false;
      return true;
    }
    return false;
  }
}

// ── Finca (Farm) Model ──
export class FincaModel {
  static FINCAS = [
    { id: 1, name: 'Finca La Esperanza', location: 'San Martín, Mendoza', hectares: 120, predios: 8, status: 'active', manager: 'Carlos Mendoza' },
    { id: 2, name: 'Finca El Sol', location: 'Junín, Mendoza', hectares: 85, predios: 5, status: 'active', manager: 'Laura Vásquez' },
    { id: 3, name: 'Finca Las Viñas', location: 'Rivadavia, San Juan', hectares: 200, predios: 12, status: 'active', manager: 'Carlos Mendoza' },
    { id: 4, name: 'Finca San Pedro', location: 'San Rafael, Mendoza', hectares: 65, predios: 4, status: 'inactive', manager: 'Roberto Díaz' },
    { id: 5, name: 'Finca Valle Grande', location: 'Caucete, San Juan', hectares: 150, predios: 9, status: 'active', manager: 'Laura Vásquez' },
  ];

  static getAll() {
    return [...this.FINCAS];
  }

  static getById(id) {
    return this.FINCAS.find(f => f.id === id);
  }

  static getActive() {
    return this.FINCAS.filter(f => f.status === 'active');
  }

  static getTotalHectares() {
    return this.FINCAS.filter(f => f.status === 'active').reduce((sum, f) => sum + f.hectares, 0);
  }

  static add(fincaData) {
    const newId = Math.max(...this.FINCAS.map(f => f.id)) + 1;
    const newFinca = { id: newId, ...fincaData, status: 'active' };
    this.FINCAS.push(newFinca);
    return newFinca;
  }

  static update(id, fincaData) {
    const idx = this.FINCAS.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.FINCAS[idx] = { ...this.FINCAS[idx], ...fincaData };
      return this.FINCAS[idx];
    }
    return null;
  }

  static delete(id) {
    const idx = this.FINCAS.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.FINCAS[idx].status = 'inactive';
      return true;
    }
    return false;
  }
}

// ── Predio (Plot) Model ──
export class PredioModel {
  static PREDIOS = [
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

  static getAll() { return [...this.PREDIOS]; }
  static getByFinca(fincaId) { return this.PREDIOS.filter(p => p.fincaId === fincaId); }
  static getById(id) { return this.PREDIOS.find(p => p.id === id); }

  static add(predioData) {
    const newId = Math.max(...this.PREDIOS.map(p => p.id)) + 1;
    const newPredio = { id: newId, ...predioData, status: 'active' };
    this.PREDIOS.push(newPredio);
    return newPredio;
  }

  static delete(id) {
    const idx = this.PREDIOS.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.PREDIOS[idx].status = 'inactive';
      return true;
    }
    return false;
  }
}

// ── Variedad (Grape Variety) Model ──
export class VariedadModel {
  static VARIEDADES = [
    { id: 1, name: 'Flame Seedless', type: 'Roja', daysToHarvest: 115, sugarContent: '18-20°Brix', usage: 'Pasa / Mesa', status: 'active' },
    { id: 2, name: 'Superior Seedless', type: 'Verde', daysToHarvest: 120, sugarContent: '16-18°Brix', usage: 'Mesa', status: 'active' },
    { id: 3, name: 'Sultanina', type: 'Verde', daysToHarvest: 110, sugarContent: '20-22°Brix', usage: 'Pasa', status: 'active' },
    { id: 4, name: 'Crimson Seedless', type: 'Roja', daysToHarvest: 130, sugarContent: '17-19°Brix', usage: 'Mesa / Pasa', status: 'active' },
    { id: 5, name: 'Thompson Seedless', type: 'Verde', daysToHarvest: 105, sugarContent: '19-22°Brix', usage: 'Pasa', status: 'active' },
    { id: 6, name: 'Red Globe', type: 'Roja', daysToHarvest: 140, sugarContent: '15-17°Brix', usage: 'Mesa', status: 'inactive' },
  ];

  static getAll() { return [...this.VARIEDADES]; }
  static getActive() { return this.VARIEDADES.filter(v => v.status === 'active'); }

  static add(variedadData) {
    const newId = Math.max(...this.VARIEDADES.map(v => v.id)) + 1;
    const newVariedad = { id: newId, ...variedadData, status: 'active' };
    this.VARIEDADES.push(newVariedad);
    return newVariedad;
  }
}

// ── Empleado (Employee) Model ──
export class EmpleadoModel {
  static EMPLEADOS = [
    { id: 1, legajo: 'EMP-001', name: 'Pedro Sánchez', dni: '30245678', position: 'Capataz', finca: 'Finca La Esperanza', startDate: '2020-03-15', status: 'active', salary: 280000 },
    { id: 2, legajo: 'EMP-002', name: 'Miguel Ángel Torres', dni: '32456789', position: 'Peón Rural', finca: 'Finca La Esperanza', startDate: '2021-06-01', status: 'active', salary: 220000 },
    { id: 3, legajo: 'EMP-003', name: 'Rosa Fernández', dni: '28345612', position: 'Encargada de Poda', finca: 'Finca El Sol', startDate: '2019-11-20', status: 'active', salary: 250000 },
    { id: 4, legajo: 'EMP-004', name: 'Diego López', dni: '35678901', position: 'Peón Rural', finca: 'Finca Las Viñas', startDate: '2022-01-10', status: 'active', salary: 220000 },
    { id: 5, legajo: 'EMP-005', name: 'Lucía Morales', dni: '31098765', position: 'Técnica Agrónoma', finca: 'Finca Valle Grande', startDate: '2020-08-05', status: 'active', salary: 320000 },
    { id: 6, legajo: 'EMP-006', name: 'Fernando Ruiz', dni: '29876543', position: 'Operador de Maquinaria', finca: 'Finca La Esperanza', startDate: '2018-04-22', status: 'inactive', salary: 260000 },
    { id: 7, legajo: 'EMP-007', name: 'Valentina Castro', dni: '33210987', position: 'Peón Rural', finca: 'Finca Las Viñas', startDate: '2023-02-14', status: 'active', salary: 220000 },
    { id: 8, legajo: 'EMP-008', name: 'Ramón Ortega', dni: '27654321', position: 'Capataz', finca: 'Finca El Sol', startDate: '2017-09-30', status: 'active', salary: 290000 },
  ];

  static getAll() { return [...this.EMPLEADOS]; }
  static getActive() { return this.EMPLEADOS.filter(e => e.status === 'active'); }
  static getById(id) { return this.EMPLEADOS.find(e => e.id === id); }
  static getByFinca(finca) { return this.EMPLEADOS.filter(e => e.finca === finca); }

  static add(empleadoData) {
    const newId = Math.max(...this.EMPLEADOS.map(e => e.id)) + 1;
    const legajo = `EMP-${String(newId).padStart(3, '0')}`;
    const newEmpleado = { id: newId, legajo, ...empleadoData, status: 'active' };
    this.EMPLEADOS.push(newEmpleado);
    return newEmpleado;
  }

  static delete(id) {
    const idx = this.EMPLEADOS.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.EMPLEADOS[idx].status = 'inactive';
      return true;
    }
    return false;
  }
}

// ── Labor (Field Work) Model ──
export class LaborModel {
  static LABORES = [
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

  static getAll() { return [...this.LABORES]; }
  static getCompleted() { return this.LABORES.filter(l => l.status === 'completed'); }
  static getPending() { return this.LABORES.filter(l => l.status === 'pending'); }
  static getByFinca(finca) { return this.LABORES.filter(l => l.finca === finca); }
  static getByEmployee(employee) { return this.LABORES.filter(l => l.employee === employee); }

  static getByType() {
    const counts = {};
    this.LABORES.forEach(l => {
      counts[l.type] = (counts[l.type] || 0) + 1;
    });
    return counts;
  }

  static getHoursByFinca() {
    const hours = {};
    this.LABORES.filter(l => l.status === 'completed').forEach(l => {
      hours[l.finca] = (hours[l.finca] || 0) + l.hours;
    });
    return hours;
  }

  static add(laborData) {
    const newId = Math.max(...this.LABORES.map(l => l.id)) + 1;
    const newLabor = { id: newId, ...laborData };
    this.LABORES.unshift(newLabor);
    return newLabor;
  }
}

// ── Presupuesto (Budget) Model ──
export class PresupuestoModel {
  static PRESUPUESTOS = [
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

  static getAll() { return [...this.PRESUPUESTOS]; }

  static getByMonth(month) {
    return this.PRESUPUESTOS.filter(p => p.month === month);
  }

  static getTotalPlanned() {
    return this.PRESUPUESTOS.reduce((sum, p) => sum + p.planned, 0);
  }

  static getTotalExecuted() {
    return this.PRESUPUESTOS.reduce((sum, p) => sum + p.executed, 0);
  }

  static getExecutionPercentage() {
    const planned = this.getTotalPlanned();
    const executed = this.getTotalExecuted();
    return planned > 0 ? Math.round((executed / planned) * 100) : 0;
  }

  static getByCategory() {
    const result = {};
    this.PRESUPUESTOS.forEach(p => {
      if (!result[p.category]) {
        result[p.category] = { planned: 0, executed: 0 };
      }
      result[p.category].planned += p.planned;
      result[p.category].executed += p.executed;
    });
    return result;
  }
}

// ── Aplicaciones (Applications/Treatments) Model ──
export class AplicacionModel {
  static APLICACIONES = [
    { id: 1, product: 'Fungicida Mancozeb', dose: '2.5 kg/ha', predio: 'Parcela Norte A', date: '2026-02-03', status: 'applied', engineer: 'Laura Vásquez' },
    { id: 2, product: 'Insecticida Lambda', dose: '0.8 L/ha', predio: 'Sector Este 1', date: '2026-02-05', status: 'applied', engineer: 'Laura Vásquez' },
    { id: 3, product: 'Fertilizante NPK', dose: '15 kg/ha', predio: 'Lote 1', date: '2026-02-07', status: 'applied', engineer: 'Laura Vásquez' },
    { id: 4, product: 'Herbicida Glifosato', dose: '3 L/ha', predio: 'Area Central', date: '2026-02-10', status: 'pending', engineer: 'Laura Vásquez' },
    { id: 5, product: 'Regulador de Crecimiento', dose: '1.2 L/ha', predio: 'Parcela Norte B', date: '2026-02-12', status: 'scheduled', engineer: 'Laura Vásquez' },
  ];

  static getAll() { return [...this.APLICACIONES]; }
  static getApplied() { return this.APLICACIONES.filter(a => a.status === 'applied'); }
  static getPending() { return this.APLICACIONES.filter(a => a.status !== 'applied'); }

  static add(aplicacionData) {
    const newId = Math.max(...this.APLICACIONES.map(a => a.id)) + 1;
    const newAplicacion = { id: newId, ...aplicacionData };
    this.APLICACIONES.push(newAplicacion);
    return newAplicacion;
  }
}

// ── Notification Model ──
export class NotificationModel {
  static NOTIFICATIONS = [
    { id: 1, title: 'Labor pendiente', message: 'Cosecha programada en Parcela Norte B para mañana', type: 'warning', time: 'Hace 2 horas', read: false },
    { id: 2, title: 'Presupuesto excedido', message: 'Insumos Agroquímicos superó el presupuesto en un 8%', type: 'error', time: 'Hace 5 horas', read: false },
    { id: 3, title: 'Aplicación completada', message: 'Fungicida Mancozeb aplicado en Parcela Norte A', type: 'success', time: 'Ayer', read: false },
    { id: 4, title: 'Nuevo empleado', message: 'Se registró a Valentina Castro como Peón Rural', type: 'info', time: 'Hace 2 días', read: true },
  ];

  static getAll() { return [...this.NOTIFICATIONS]; }
  static getUnread() { return this.NOTIFICATIONS.filter(n => !n.read); }
  static markAsRead(id) {
    const notif = this.NOTIFICATIONS.find(n => n.id === id);
    if (notif) notif.read = true;
  }
  static markAllRead() {
    this.NOTIFICATIONS.forEach(n => n.read = true);
  }
}
