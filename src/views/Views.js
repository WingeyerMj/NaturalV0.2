/**
 * ═══════════════════════════════════════════════════════════
 * NATURALFOOD - Views Layer
 * Renders all HTML templates for the application
 * ═══════════════════════════════════════════════════════════
 */

// ── Landing Page View ──
export function renderLandingPage() {
  return `
    <div class="new-landing-wrapper">
        <header id="mainHeader">
            <a href="https://www.naturalfoodargentina.com">
                <figure>
                    <img src="https://www.naturalfoodargentina.com/wp-content/uploads/2018/02/logo-natural-food-argentina.png"
                        alt="Logo Natural Food Argentina">
                </figure>
            </a>
            <span id="btnMenu">≡</span>
            <nav class="menu-menu-principal-container">
                <ul id="menu-menu-principal" class="menu">
                    <li class="menu-item"><a href="https://www.naturalfoodargentina.com/about-us/">NOSOTROS</a></li>
                    <li class="menu-item"><a href="https://www.naturalfoodargentina.com/our-process/">NUESTRO
                            PROCESO</a></li>
                    <li class="menu-item"><a href="https://www.naturalfoodargentina.com/our-farms/">NUESTRAS
                            FINCAS</a></li>
                    <li class="menu-item"><a href="#">PRODUCTOS</a></li>
                    <li class="menu-item"><a href="https://www.naturalfoodargentina.com/quality/">CALIDAD</a></li>
                    <li class="menu-item"><a href="https://www.naturalfoodargentina.com/contact/">CONTACTO</a></li>
                    <li><button id="btn-login-nav" class="btn-login-custom">INGRESAR</button></li>
                </ul>
            </nav>
        </header>
        <main>
            <section id="sliderPrincipal">
                <div>
                    <video preload autoplay loop muted>
                        <source
                            src="https://www.naturalfoodargentina.com/wp-content/uploads/2017/12/Natural-Food-Argentina-Our-Farms.mp4"
                            type="video/mp4">
                        Tu navegador no soporta HTML5 Video
                    </video>
                </div>
                <span class="triangulo"></span>
            </section>
            <section id="traz-producto">
                <h2>Integración vertical en pasas de uva</h2>
                <figure class="img-vertically-integrated">
                    <img src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/vertically-integrated/1-campo-natural-food-argentina.png"
                        alt="">
                </figure>
                <p class="text-vertically-integrated p-left">Nuestra ventaja competitiva comienza desde el origen,
                </p>
                <p class="text-vertically-integrated p-right">donde seleccionamos las pasas directamente de nuestra
                    red de fincas propias.</p>
                <figure class="img-vertically-integrated">
                    <img src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/vertically-integrated/2-cosecha-natural-food-argentina.png"
                        alt="">
                </figure>
                <p class="text-vertically-integrated p-center">
                    Esta red abarca 300 kilómetros a lo largo de las provincias de San Juan y La Rioja<br>y nos
                    permite rastrear nuestra fruta desde la finca hasta el cliente,
                </p>
                <figure class="img-vertically-integrated img-doble">
                    <img src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/vertically-integrated/4-recoleccion-natural-food-argentina.png"
                        alt="">
                </figure>
                <figure class="img-vertically-integrated">
                    <img src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/vertically-integrated/5-planta-natural-food-argentina.png"
                        alt="">
                </figure>
                <p class="text-vertically-integrated p-center">asegurando la entrega de un producto de la más alta
                    calidad con una eficiencia inigualable.</p>
            </section>
            <section id="machines-modernas">
                <h2>Instalación tecnológicamente avanzada</h2>
                <div class="section-container">
                    <video preload controls>
                        <source
                            src="https://www.naturalfoodargentina.com/wp-content/uploads/2017/11/Natural-Food-Argentina-Our-Process.mp4"
                            type="video/mp4">
                        Tu navegador no soporta HTML5 Video
                    </video>
                </div>
            </section>
            <section id="quality-certif">
                <div class="section-container">
                    <span class="logo-certificado"></span>
                    <span class="logo-certificado"></span>
                    <span class="logo-certificado"></span>
                    <span class="logo-certificado"></span>
                    <span class="logo-certificado"></span>
                    <span class="logo-certificado"></span>
                    <span class="logo-certificado"></span>
                </div>
            </section>
            <footer>
                <div>
                    <h3>ENLACES RÁPIDOS</h3>
                    <nav class="menu-menu-footer-container">
                        <ul id="menu-menu-footer" class="menu">
                            <li class="menu-item"><a
                                    href="https://www.naturalfoodargentina.com/about-us/">NOSOTROS</a></li>
                            <li class="menu-item"><a
                                    href="https://www.naturalfoodargentina.com/our-process/">NUESTRO PROCESO</a>
                            </li>
                            <li class="menu-item"><a href="https://www.naturalfoodargentina.com/our-farms/">NUESTRAS
                                    FINCAS</a></li>
                            <li class="menu-item"><a
                                    href="https://www.naturalfoodargentina.com/raisins/">PRODUCTOS</a></li>
                        </ul>
                    </nav>
                </div>
                <address>
                    <h3>CORPORATIVO</h3>
                    <ul>
                        <li>NATURAL FOOD ARGENTINA</li>
                        <br>
                        <li>BUENOS AIRES. Av. Callao 1234 - Of. 503 Edificio Concord Callao</li>
                        <li>+5493416912585</li>
                        <br>
                        <li>ROSARIO, España 889 - Oficinas: 1 - 4 - 9</li>
                        <li>+5493415302083</li>
                        <br>
                        <li>SAN JUAN , Lavalle S/N La Puntilla Caucete</li>
                        <li>+5493415921275</li>
                        <br>
                        <li>info@naturalfoodargentina.com</li>
                    </ul>
                </address>
                <span>
                    <a href="https://www.instagram.com/naturalfoodargentina/" target="_blank"><img
                            src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/icon-igram.png"
                            alt="Instagram"></a>
                    <a href="https://www.youtube.com/channel/UCanLYzfQvY9ZiWSVlUe6lkA" target="_blank"><img
                            src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/icon-youtube.png"
                            alt="YouTube"></a>
                    <a href="https://www.twitter.com/naturalfoodarg" target="_blank"><img
                            src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/icon-tw.png"
                            alt="Twitter"></a>
                </span>
            </footer>
        </main>
    </div>
  `;
}

// ── Login Page View ──
export function renderLoginPage() {
  return `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <img src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/favicon.png" alt="NaturalFood" class="nf-logo nf-logo--lg">
          <h2>Bienvenido</h2>
          <p>Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <div class="form-error" id="login-error">
          ⚠️ <span>Credenciales incorrectas. Intente nuevamente.</span>
        </div>

        <form id="login-form" autocomplete="off">
          <div class="form-group">
            <label class="form-label" for="login-email">Correo electrónico</label>
            <div class="form-input-wrapper">
              <input 
                type="email" 
                id="login-email" 
                class="form-input" 
                placeholder="usuario@naturalfood.com"
                required
                autocomplete="email"
              />
              <span class="form-input-icon">📧</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Contraseña</label>
            <div class="form-input-wrapper">
              <input 
                type="password" 
                id="login-password" 
                class="form-input" 
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
              <span class="form-input-icon">🔒</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary login-btn" id="btn-login-submit">
            Iniciar Sesión
          </button>
        </form>

        <div class="login-footer">
          <a href="#" id="btn-back-landing">← Volver al inicio</a>
        </div>

        <div style="margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
          <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-bottom: var(--space-3); text-align: center;">Cuentas de demostración:</p>
          <div style="display: grid; gap: var(--space-2); font-size: var(--text-xs); color: var(--text-tertiary);">
            <div style="display: flex; justify-content: space-between;"><span>Admin:</span><code style="color: var(--color-primary-400);">admin@naturalfood.com / admin123</code></div>
            <div style="display: flex; justify-content: space-between;"><span>Ingeniero:</span><code style="color: var(--color-primary-400);">ingeniero@naturalfood.com / ing123</code></div>
            <div style="display: flex; justify-content: space-between;"><span>RRHH:</span><code style="color: var(--color-primary-400);">rrhh@naturalfood.com / rrhh123</code></div>
            <div style="display: flex; justify-content: space-between;"><span>Carga:</span><code style="color: var(--color-primary-400);">carga@naturalfood.com / carga123</code></div>
            <div style="display: flex; justify-content: space-between;"><span>Sub-Admin:</span><code style="color: var(--color-primary-400);">subadmin@naturalfood.com / sub123</code></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Dashboard Layout ──
export function renderDashboardLayout(user, menuItems, activeSection) {
  return `
    <div id="loading-overlay" class="loading-overlay hidden" style="position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
        <div class="loading-content" style="background: var(--bg-secondary); padding: 40px; border-radius: 16px; text-align: center; max-width: 400px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
            <div class="spinner-large" style="width: 50px; height: 50px; border: 4px solid var(--bg-tertiary); border-top: 4px solid var(--color-primary-500); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <h3 style="margin-bottom: 10px; font-family: 'Outfit'; color: var(--text-primary);">Conectando con Sofía...</h3>
            <p id="loading-message" style="color: var(--text-secondary); margin-bottom: 20px; font-size: 0.9em;">Iniciando descarga de datos históricos</p>
            <div class="progress-bar-container" style="width: 100%; height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden;">
                <div class="progress-bar" id="loading-progress" style="width: 0%; height: 100%; background: var(--color-primary-500); transition: width 0.3s ease;"></div>
            </div>
            <div id="loading-details" style="margin-top: 10px; font-size: 0.8em; color: var(--text-tertiary);">0%</div>
        </div>
    </div>
    <div class="dashboard-layout">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <img src="https://www.naturalfoodargentina.com/wp-content/themes/naturalfoodargentina/img/favicon.png" alt="NaturalFood" class="nf-logo">
          <span class="sidebar-title">NATURALFOOD</span>
        </div>
        
        <nav class="sidebar-nav">
          ${renderSidebarMenu(menuItems, activeSection)}
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-user" id="sidebar-user-menu">
            <div class="sidebar-avatar">${user.avatar}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user.name}</div>
              <div class="sidebar-user-role">${user.role}</div>
            </div>
          </div>
          <button class="sidebar-item" id="btn-logout" style="margin-top: var(--space-2); color: var(--color-error);">
            <span class="sidebar-item-icon">🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="main-header">
          <div class="main-header-left">
            <button class="mobile-menu-toggle" id="btn-mobile-menu">☰</button>
            <h1 class="page-title" id="page-title">Dashboard</h1>
          </div>
          <div class="main-header-right">
            <button class="notification-bell" title="Notificaciones">
              🔔
              <span class="notification-count">3</span>
            </button>
          </div>
        </header>

        <div class="page-content" id="page-content">
          <!-- Dynamic content loads here -->
        </div>
      </main>
    </div>

    <div class="toast-container" id="toast-container"></div>

    <!-- Modal Container -->
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal" id="modal">
        <div class="modal-header">
          <h3 id="modal-title">Modal</h3>
          <button class="modal-close" id="modal-close">✕</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer" id="modal-footer"></div>
      </div>
    </div>
  `;
}

function renderSidebarMenu(menuItems, activeSection) {
  let html = '';
  let currentSection = '';

  menuItems.forEach(item => {
    if (item.section !== currentSection) {
      if (currentSection) html += '</div>';
      currentSection = item.section;
      html += `<div class="sidebar-section">
        <div class="sidebar-section-title">${item.section}</div>`;
    }

    if (item.submenu) {
      const isExpanded = item.submenu.some(s => s.id === activeSection) || activeSection === item.id;
      html += `
        <button class="sidebar-item sidebar-dropdown-toggle ${isExpanded ? 'expanded' : ''}" data-toggle="${item.id}">
          <span class="sidebar-item-icon">${item.icon}</span>
          ${item.label}
          <span class="sidebar-chevron">${isExpanded ? '▾' : '▸'}</span>
        </button>
        <div class="sidebar-submenu ${isExpanded ? 'open' : ''}" id="submenu-${item.id}">
          ${item.submenu.map(sub => `
            <button class="sidebar-item sidebar-subitem ${sub.id === activeSection ? 'active' : ''}" data-section="${sub.id}">
              <span class="sidebar-item-icon">${sub.icon}</span>
              ${sub.label}
            </button>
          `).join('')}
        </div>
      `;
    } else {
      const isActive = item.id === activeSection ? 'active' : '';
      html += `
        <button class="sidebar-item ${isActive}" data-section="${item.id}">
          <span class="sidebar-item-icon">${item.icon}</span>
          ${item.label}
        </button>
      `;
    }
  });

  if (currentSection) html += '</div>';
  return html;
}

// ── Dashboard Home Content ──
export function renderDashboardHome(metrics) {
  return `
    <div class="dashboard-grid animate-fade-in">
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon green">🌿</div>
          <div class="metric-badge up">↑ 12%</div>
        </div>
        <div class="metric-value">${metrics.totalHectares}</div>
        <div class="metric-label">Hectáreas Activas</div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon purple">🏘️</div>
          <div class="metric-badge up">↑ 2</div>
        </div>
        <div class="metric-value">${metrics.totalFincas}</div>
        <div class="metric-label">Fincas en Operación</div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon amber">👥</div>
          <div class="metric-badge up">↑ 5%</div>
        </div>
        <div class="metric-value">${metrics.totalEmpleados}</div>
        <div class="metric-label">Empleados Activos</div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon blue">💰</div>
          <div class="metric-badge ${metrics.budgetExecution > 100 ? 'down' : 'up'}">${metrics.budgetExecution}%</div>
        </div>
        <div class="metric-value">${metrics.budgetExecution}%</div>
        <div class="metric-label">Ejecución Presupuestaria</div>
      </div>
    </div>

    <div class="charts-row animate-fade-in animate-delay-1">
      <div class="chart-container">
        <div class="chart-header">
          <span class="chart-title">Ejecución Presupuestaria por Categoría</span>
          <div class="chart-actions">
            <button class="btn btn-sm btn-ghost">Enero</button>
            <button class="btn btn-sm btn-ghost">Febrero</button>
          </div>
        </div>
        <div class="chart-canvas-wrapper">
          <canvas id="chart-budget"></canvas>
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-header">
          <span class="chart-title">Distribución de Labores</span>
        </div>
        <div class="chart-canvas-wrapper">
          <canvas id="chart-labores"></canvas>
        </div>
      </div>
    </div>

    <div class="chart-container animate-fade-in animate-delay-2">
      <div class="chart-header">
        <span class="chart-title">Horas de Trabajo por Finca</span>
      </div>
      <div class="chart-canvas-wrapper">
        <canvas id="chart-hours"></canvas>
      </div>
    </div>

    <div class="data-table-container animate-fade-in animate-delay-3">
      <div class="table-header">
        <h3>Últimas Labores Registradas</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Predio</th>
            <th>Finca</th>
            <th>Empleado</th>
            <th>Horas</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${metrics.recentLabores.map(l => `
            <tr>
              <td>${formatDate(l.date)}</td>
              <td>${l.type}</td>
              <td>${l.predio}</td>
              <td>${l.finca}</td>
              <td>${l.employee}</td>
              <td>${l.hours}h</td>
              <td>
                <span class="status-badge ${l.status === 'completed' ? 'active' : 'pending'}">
                  <span class="status-dot"></span>
                  ${l.status === 'completed' ? 'Completado' : 'Pendiente'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Fincas View ──
export function renderFincasView(fincas) {
  return `
    <div class="data-table-container animate-fade-in">
      <div class="table-header">
        <h3>Gestión de Fincas</h3>
        <div class="table-actions">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" placeholder="Buscar finca..." id="search-fincas" />
          </div>
          <button class="btn btn-primary btn-sm" id="btn-add-finca">+ Nueva Finca</button>
        </div>
      </div>
      <table class="data-table" id="table-fincas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Hectáreas</th>
            <th>Predios</th>
            <th>Encargado</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${fincas.map(f => `
            <tr>
              <td><strong>${f.name}</strong></td>
              <td>${f.location}</td>
              <td>${f.hectares} ha</td>
              <td>${f.predios}</td>
              <td>${f.manager}</td>
              <td>
                <span class="status-badge ${f.status === 'active' ? 'active' : 'inactive'}">
                  <span class="status-dot"></span>
                  ${f.status === 'active' ? 'Activa' : 'Inactiva'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Predios View ──
export function renderPrediosView(predios) {
  return `
    <div class="data-table-container animate-fade-in">
      <div class="table-header">
        <h3>Gestión de Predios</h3>
        <div class="table-actions">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" placeholder="Buscar predio..." id="search-predios" />
          </div>
          <button class="btn btn-primary btn-sm" id="btn-add-predio">+ Nuevo Predio</button>
        </div>
      </div>
      <table class="data-table" id="table-predios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Hectáreas</th>
            <th>Variedad</th>
            <th>Riego</th>
            <th>Tipo de Suelo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${predios.map(p => `
            <tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.hectares} ha</td>
              <td>${p.variety}</td>
              <td>${p.irrigationType}</td>
              <td>${p.soilType}</td>
              <td>
                <span class="status-badge ${p.status === 'active' ? 'active' : 'pending'}">
                  <span class="status-dot"></span>
                  ${p.status === 'active' ? 'Activo' : 'Pendiente'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Variedades View ──
export function renderVariedadesView(variedades) {
  return `
    <div class="data-table-container animate-fade-in">
      <div class="table-header">
        <h3>Variedades de Uva</h3>
        <div class="table-actions">
          <button class="btn btn-primary btn-sm" id="btn-add-variedad">+ Nueva Variedad</button>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Variedad</th>
            <th>Tipo</th>
            <th>Días a Cosecha</th>
            <th>Contenido de Azúcar</th>
            <th>Uso</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${variedades.map(v => `
            <tr>
              <td><strong>${v.name}</strong></td>
              <td>${v.type}</td>
              <td>${v.daysToHarvest} días</td>
              <td>${v.sugarContent}</td>
              <td>${v.usage}</td>
              <td>
                <span class="status-badge ${v.status === 'active' ? 'active' : 'inactive'}">
                  <span class="status-dot"></span>
                  ${v.status === 'active' ? 'Activa' : 'Inactiva'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Empleados View ──
export function renderEmpleadosView(empleados) {
  return `
    <div class="data-table-container animate-fade-in">
      <div class="table-header">
        <h3>Gestión de Personal</h3>
        <div class="table-actions">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" placeholder="Buscar empleado..." id="search-empleados" />
          </div>
          <button class="btn btn-primary btn-sm" id="btn-add-empleado">+ Nuevo Empleado</button>
        </div>
      </div>
      <table class="data-table" id="table-empleados">
        <thead>
          <tr>
            <th>Legajo</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Cargo</th>
            <th>Finca</th>
            <th>Ingreso</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${empleados.map(e => `
            <tr>
              <td><code style="color: var(--color-primary-400)">${e.legajo}</code></td>
              <td><strong>${e.name}</strong></td>
              <td>${e.dni}</td>
              <td>${e.position}</td>
              <td>${e.finca}</td>
              <td>${formatDate(e.startDate)}</td>
              <td>
                <span class="status-badge ${e.status === 'active' ? 'active' : 'inactive'}">
                  <span class="status-dot"></span>
                  ${e.status === 'active' ? 'Activo' : 'Baja'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Labores (Field Work) View ──
export function renderLaboresView(labores) {
  return `
    <div class="tabs" id="labores-tabs">
      <button class="tab-btn active" data-tab="all">Todas</button>
      <button class="tab-btn" data-tab="completed">Completadas</button>
      <button class="tab-btn" data-tab="pending">Pendientes</button>
    </div>

    <div class="data-table-container animate-fade-in">
      <div class="table-header">
        <h3>Registro de Labores de Campo</h3>
        <div class="table-actions">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input type="text" class="search-input" placeholder="Buscar labor..." id="search-labores" />
          </div>
          <button class="btn btn-primary btn-sm" id="btn-add-labor">+ Registrar Labor</button>
        </div>
      </div>
      <table class="data-table" id="table-labores">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Predio</th>
            <th>Finca</th>
            <th>Empleado</th>
            <th>Horas</th>
            <th>Notas</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${labores.map(l => `
            <tr data-status="${l.status}">
              <td>${formatDate(l.date)}</td>
              <td>${l.type}</td>
              <td>${l.predio}</td>
              <td>${l.finca}</td>
              <td>${l.employee}</td>
              <td>${l.hours}h</td>
              <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${l.notes}">${l.notes}</td>
              <td>
                <span class="status-badge ${l.status === 'completed' ? 'active' : 'pending'}">
                  <span class="status-dot"></span>
                  ${l.status === 'completed' ? 'Completado' : 'Pendiente'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Carga (Field Operator) Simplified View ──
export function renderCargaView(labores, fincas, predios, empleados) {
  return `
    <div class="charts-row" style="grid-template-columns: 1fr 1.2fr;">
      <div class="chart-container animate-fade-in">
        <div class="chart-header">
          <span class="chart-title">📝 Registrar Nueva Labor</span>
        </div>
        <form id="form-nueva-labor">
          <div class="form-group">
            <label class="form-label" for="labor-date">Fecha</label>
            <div class="form-input-wrapper">
              <input type="date" id="labor-date" class="form-input" style="padding-left: var(--space-4);" value="${new Date().toISOString().split('T')[0]}" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="labor-type">Tipo de Labor</label>
            <div class="form-input-wrapper">
              <select id="labor-type" class="form-select" style="padding-left: var(--space-4);" required>
                <option value="">Seleccionar...</option>
                <option value="Poda">Poda</option>
                <option value="Riego">Riego</option>
                <option value="Fumigación">Fumigación</option>
                <option value="Cosecha">Cosecha</option>
                <option value="Desmalezado">Desmalezado</option>
                <option value="Fertilización">Fertilización</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="labor-finca">Finca</label>
            <div class="form-input-wrapper">
              <select id="labor-finca" class="form-select" style="padding-left: var(--space-4);" required>
                <option value="">Seleccionar...</option>
                ${fincas.map(f => `<option value="${f.name}">${f.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="labor-predio">Predio</label>
            <div class="form-input-wrapper">
              <select id="labor-predio" class="form-select" style="padding-left: var(--space-4);" required>
                <option value="">Seleccionar finca primero...</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="labor-hours">Horas Trabajadas</label>
            <div class="form-input-wrapper">
              <input type="number" id="labor-hours" class="form-input" style="padding-left: var(--space-4);" min="1" max="24" placeholder="8" required />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="labor-notes">Observaciones</label>
            <div class="form-input-wrapper">
              <textarea id="labor-notes" class="form-input" style="padding-left: var(--space-4); min-height: 80px; resize: vertical;" placeholder="Descripción de la labor realizada..."></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">✅ Registrar Labor</button>
        </form>
      </div>

      <div>
        <div class="data-table-container animate-fade-in animate-delay-1">
          <div class="table-header">
            <h3>Mis Últimas Labores</h3>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Predio</th>
                <th>Horas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${labores.slice(0, 6).map(l => `
                <tr>
                  <td>${formatDate(l.date)}</td>
                  <td>${l.type}</td>
                  <td>${l.predio}</td>
                  <td>${l.hours}h</td>
                  <td>
                    <span class="status-badge ${l.status === 'completed' ? 'active' : 'pending'}">
                      <span class="status-dot"></span>
                      ${l.status === 'completed' ? 'OK' : 'Pendiente'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ── Informes (Reports) View ──
export function renderInformesView() {
  return `
    <div class="tabs" id="informes-tabs">
      <button class="tab-btn active" data-tab="presupuesto">Ejecución Presupuestaria</button>
      <button class="tab-btn" data-tab="labores">Labores de Campo</button>
      <button class="tab-btn" data-tab="parametros">Parámetros</button>
      <button class="tab-btn" data-tab="aplicaciones">📋 Aplicaciones Sofía</button>
    </div>

    <div id="informe-content">
      <!-- Will be filled dynamically -->
    </div>
  `;
}

export function renderInformePresupuesto(budgetData) {
  const categories = Object.keys(budgetData);
  const overBudget = categories.filter(c => budgetData[c].executed > budgetData[c].planned);
  const underBudget = categories.filter(c => budgetData[c].executed <= budgetData[c].planned);

  return `
    <div class="dashboard-grid animate-fade-in">
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon green">💰</div>
        </div>
        <div class="metric-value">$${formatCurrency(Object.values(budgetData).reduce((s, c) => s + c.planned, 0))}</div>
        <div class="metric-label">Total Presupuestado</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon blue">📊</div>
        </div>
        <div class="metric-value">$${formatCurrency(Object.values(budgetData).reduce((s, c) => s + c.executed, 0))}</div>
        <div class="metric-label">Total Ejecutado</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon amber">✅</div>
        </div>
        <div class="metric-value">${underBudget.length}</div>
        <div class="metric-label">Categorías en Presupuesto</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon purple">⚠️</div>
        </div>
        <div class="metric-value">${overBudget.length}</div>
        <div class="metric-label">Categorías Excedidas</div>
      </div>
    </div>

    <div class="chart-container animate-fade-in animate-delay-1">
      <div class="chart-header">
        <span class="chart-title">Comparativa Presupuesto vs Ejecución</span>
      </div>
      <div class="chart-canvas-wrapper" style="height: 350px;">
        <canvas id="chart-budget-report"></canvas>
      </div>
    </div>

    <div class="data-table-container animate-fade-in animate-delay-2">
      <div class="table-header">
        <h3>Detalle por Categoría</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Categoría</th>
            <th>Presupuestado</th>
            <th>Ejecutado</th>
            <th>Diferencia</th>
            <th>% Ejecución</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${categories.map(cat => {
    const diff = budgetData[cat].executed - budgetData[cat].planned;
    const pct = Math.round((budgetData[cat].executed / budgetData[cat].planned) * 100);
    const over = diff > 0;
    return `
              <tr>
                <td><strong>${cat}</strong></td>
                <td>$${formatCurrency(budgetData[cat].planned)}</td>
                <td>$${formatCurrency(budgetData[cat].executed)}</td>
                <td style="color: ${over ? 'var(--color-error)' : 'var(--color-success)'}">
                  ${over ? '+' : ''}$${formatCurrency(diff)}
                </td>
                <td>${pct}%</td>
                <td>
                  <span class="status-badge ${over ? 'inactive' : 'active'}">
                    <span class="status-dot"></span>
                    ${over ? 'Excedido' : 'En presupuesto'}
                  </span>
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function renderSofiaJornalesStats(laborStats, efficiencyStats, currentCycle = '2025-2026') {
  const fmt = (v) => new Intl.NumberFormat('es-AR').format(Math.round(v));
  const fmtDec = (v) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(v);
  const fmtMoney = (v) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(v);

  const totalJornadas = laborStats.reduce((acc, s) => acc + s.totalJornadas, 0);

  const cycles = ['2025-2026', '2024-2025', '2023-2024', '2022-2023', '2021-2022'];

  return `
    <div class="dashboard-grid animate-fade-in" style="margin-bottom: var(--space-6);">
      <!-- Budget Upload Zone -->
      <div class="sofia-upload-zone" id="jornales-budget-upload" style="margin: 0; padding: var(--space-6); background: var(--bg-glass); display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="font-size: 2.5rem; margin-bottom: var(--space-2);">📄</div>
        <h4 style="font-family: 'Outfit'; margin-bottom: var(--space-1);">Presupuesto de Jornales</h4>
        <p style="font-size: var(--text-xs); margin-bottom: var(--space-4);">Carga el CSV de proyección</p>
        <input type="file" id="input-budget-csv" accept=".csv" hidden />
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('input-budget-csv').click()">
          Seleccionar CSV
        </button>
      </div>

      <!-- Chart Container -->
      <div class="data-table-container" style="margin: 0; padding: var(--space-6);">
        <h4 style="font-family: 'Outfit'; margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-2);">
          📊 Distribución de Jornadas
        </h4>
        <div style="height: 200px; position: relative;">
          <canvas id="chart-jornadas-consumidas"></canvas>
        </div>
      </div>
    </div>

    <!-- Eficiencia por Finca Section -->
    <div class="section-divider" style="margin: var(--space-8) 0; height: 1px; background: var(--border-subtle);"></div>
    <h3 style="font-family: 'Outfit'; color: var(--text-primary); margin-bottom: var(--space-6);">🚜 Eficiencia Laboral por Finca</h3>

    <div class="dashboard-grid animate-fade-in animate-delay-1" style="margin-bottom: var(--space-6); grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        ${efficiencyStats.groups.map(g => `
            <div class="metric-card" style="border-left: 4px solid ${g.name === 'Fincas Viejas' ? 'var(--color-primary-500)' : 'var(--color-accent-500)'}; padding: var(--space-6);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
                    <div class="metric-label" style="font-size: 1.1em; color: var(--text-primary);">${g.name}</div>
                    <div style="font-size: 0.8em; color: var(--text-tertiary);">${fmtDec(g.area)} Ha</div>
                </div>
                <div class="metric-value" style="font-size: 2.5em; color: ${g.name === 'Fincas Viejas' ? 'var(--color-primary-600)' : 'var(--color-accent-600)'};">
                    ${fmtDec(g.efficiency)} <small style="font-size: 0.4em; color: var(--text-tertiary);">Jor/Ha</small>
                </div>
                <div style="display: flex; gap: var(--space-4); margin-top: var(--space-4);">
                    <div>
                        <div style="font-size: 0.8em; color: var(--text-tertiary);">Costo Promedio (ARS)</div>
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--text-primary);">${fmtMoney(g.avgCostArs)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.8em; color: var(--text-tertiary);">Costo Promedio (USD)</div>
                        <div style="font-size: 1.2em; font-weight: 600; color: var(--color-success);">$${fmtDec(g.avgCostUsd)}</div>
                    </div>
                </div>
                <p style="color: var(--text-tertiary); font-size: 0.9em; margin-top: var(--space-4); padding-top: var(--space-2); border-top: 1px solid var(--border-subtle);">Total Jornadas: ${fmt(g.jornales)}</p>
                <div style="margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
                    ${efficiencyStats.predios.filter(p => p.group === g.name).map(p => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2); font-size: 0.9em;">
                            <span>${p.name}</span>
                            <span style="font-weight: 600;">${fmtDec(p.efficiency)} <span style="font-size: 0.8em; opacity: 0.7;">J/Ha</span></span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
    </div>

    <!-- Historical Evolution Chart -->
    <div class="section-divider" style="margin: var(--space-8) 0; height: 1px; background: var(--border-subtle);"></div>
    <h3 style="font-family: 'Outfit'; color: var(--text-primary); margin-bottom: var(--space-6);">📅 Evolución Comparativa de Ciclos</h3>
    <div class="data-table-container animate-fade-in animate-delay-2" style="padding: var(--space-6);">
        <div style="height: 300px; position: relative;">
            <canvas id="chart-jornales-historico"></canvas>
        </div>
        <p style="text-align: center; color: var(--text-tertiary); font-size: 0.9em; margin-top: var(--space-4);">
            Comparación de consumo de Jornales mes a mes (May-Abr) entre ciclos productivos desde 2021.
        </p>
    </div>



    <div class="data-table-container animate-fade-in animate-delay-3">
      <div class="table-header" style="justify-content: space-between;">
        <h3 style="display: flex; align-items: center; gap: var(--space-3);">
          💲 Costo Total por Predio (ARS)
          <select id="table-jornales-cycle" class="form-select" style="font-size: 0.8em; padding: 4px 8px; width: auto; background: var(--bg-secondary);">
            ${cycles.map(c => `<option value="${c}" ${c === currentCycle ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </h3>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Predio</th>
            <th>Finca</th>
            <th style="text-align: right;">Costo Total (ARS)</th>
            <th style="text-align: right;">Jornadas</th>
          </tr>
        </thead>
        <tbody>
          ${efficiencyStats.predios.slice().sort((a, b) => b.costoArs - a.costoArs).map(p => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td><span style="font-size: 0.9em; color: var(--text-tertiary);">${p.group}</span></td>
                <td style="text-align: right; color: var(--color-primary-500); font-weight: 600;">${fmtMoney(p.costoArs)}</td>
                <td style="text-align: right;">${fmt(p.jornales)}</td>
              </tr>
            `).join('')}
        </tbody>
        <tfoot style="background: var(--bg-glass); font-weight: 700;">
          <tr>
            <td colspan="2">TOTAL</td>
            <td style="text-align: right; color: var(--color-primary-600);">${fmtMoney(efficiencyStats.predios.reduce((acc, p) => acc + p.costoArs, 0))}</td>
            <td style="text-align: right;">${fmt(efficiencyStats.predios.reduce((acc, p) => acc + p.jornales, 0))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

export function renderHectareasPorPredio(hectareasData) {
  const fmtDec = (v) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 }).format(v);
  const fmtNum = (v) => new Intl.NumberFormat('es-AR').format(v);

  const groupColors = {
    'El Espejo': { accent: 'var(--color-accent-500)', bg: 'rgba(168, 85, 247, 0.1)', gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05))' },
    'Fincas Viejas': { accent: 'var(--color-primary-500)', bg: 'rgba(59, 130, 246, 0.1)', gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))' }
  };

  return `
    <div class="section-divider" style="margin: var(--space-8) 0; height: 1px; background: var(--border-subtle);"></div>
    <h3 style="font-family: 'Outfit'; color: var(--text-primary); margin-bottom: var(--space-6); display: flex; align-items: center; gap: var(--space-3);">
      🗺️ Superficie por Predio (Clasificación)
    </h3>

    <!-- Summary Cards -->
    <div class="dashboard-grid animate-fade-in" style="margin-bottom: var(--space-6); grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
      <div class="metric-card" style="padding: var(--space-5);">
        <div class="metric-card-header"><div class="metric-card-icon green">🌿</div></div>
        <div class="metric-value" style="font-size: 2em;">${fmtDec(hectareasData.grandTotalHa)} <small style="font-size: 0.4em; color: var(--text-tertiary);">Ha</small></div>
        <div class="metric-label">Superficie Total</div>
      </div>
      <div class="metric-card" style="padding: var(--space-5);">
        <div class="metric-card-header"><div class="metric-card-icon blue">📐</div></div>
        <div class="metric-value" style="font-size: 2em;">${fmtNum(hectareasData.grandTotalCuarteles)}</div>
        <div class="metric-label">Cuarteles</div>
      </div>
      <div class="metric-card" style="padding: var(--space-5);">
        <div class="metric-card-header"><div class="metric-card-icon purple">🌱</div></div>
        <div class="metric-value" style="font-size: 2em;">${fmtNum(hectareasData.grandTotalPlantas)}</div>
        <div class="metric-label">Plantas Totales</div>
      </div>
    </div>

    <!-- Detail Table per Finca Group -->
    <div class="dashboard-grid animate-fade-in animate-delay-1" style="grid-template-columns: repeat(auto-fit, minmax(380px, 1fr)); gap: var(--space-6);">
      ${hectareasData.groups.map(g => {
    const colors = groupColors[g.name] || groupColors['El Espejo'];
    return `
        <div class="data-table-container" style="padding: var(--space-6); border-left: 4px solid ${colors.accent};">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-5);">
            <h4 style="font-family: 'Outfit'; color: var(--text-primary); display: flex; align-items: center; gap: var(--space-2);">
              ${g.name === 'El Espejo' ? '🏔️' : '🏡'} ${g.name}
            </h4>
            <div style="background: ${colors.bg}; color: ${colors.accent}; padding: 4px 12px; border-radius: 12px; font-size: 0.8em; font-weight: 600;">
              ${fmtDec(g.totalHa)} Ha
            </div>
          </div>
          <table class="data-table" style="margin: 0;">
            <thead>
              <tr>
                <th>Predio</th>
                <th style="text-align: center;">Cuarteles</th>
                <th style="text-align: right;">Hectáreas</th>
                <th style="text-align: right;">Plantas</th>
                <th style="text-align: center; min-width: 100px;">% Superficie</th>
              </tr>
            </thead>
            <tbody>
              ${g.predios.map(p => {
      const pct = g.totalHa > 0 ? (p.hectareas / g.totalHa * 100) : 0;
      return `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td style="text-align: center;">${fmtNum(p.cuarteles)}</td>
                  <td style="text-align: right; color: ${colors.accent}; font-weight: 600;">${fmtDec(p.hectareas)}</td>
                  <td style="text-align: right;">${fmtNum(p.plantas)}</td>
                  <td style="text-align: center;">
                    <div style="display: flex; align-items: center; gap: var(--space-2); justify-content: center;">
                      <div style="flex: 1; height: 6px; background: var(--bg-glass); border-radius: var(--radius-full); overflow: hidden; max-width: 80px;">
                        <div style="height: 100%; width: ${pct}%; background: ${colors.accent}; border-radius: var(--radius-full); transition: width 0.6s ease;"></div>
                      </div>
                      <span style="font-size: 0.8em; color: var(--text-tertiary); min-width: 36px;">${fmtDec(pct)}%</span>
                    </div>
                  </td>
                </tr>
                `;
    }).join('')}
            </tbody>
            <tfoot style="background: ${colors.bg}; font-weight: 700;">
              <tr>
                <td>Subtotal</td>
                <td style="text-align: center;">${fmtNum(g.totalCuarteles)}</td>
      <td style="text-align: right; color: ${colors.accent};">${fmtDec(g.totalHa)}</td>
                <td style="text-align: right;">${fmtNum(g.totalPlantas)}</td>
                <td style="text-align: center; font-size: 0.85em;">100%</td>
              </tr>
            </tfoot>
           </table>
        </div>
        `;
  }).join('')}
    </div>
  `;
}

export function renderEficienciaChartSection(hectareasData) {
  // Build list of all predios for the filter
  const allPredios = hectareasData.groups.flatMap(g => g.predios.map(p => p.name));

  return `
    <div class="section-divider" style="margin: var(--space-8) 0; height: 1px; background: var(--border-subtle);"></div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4);">
      <h3 style="font-family: 'Outfit'; color: var(--text-primary); display: flex; align-items: center; gap: var(--space-3); margin: 0;">
        📊 Eficiencia de Jornales por Hectárea
      </h3>
      <div style="display: flex; align-items: center; gap: var(--space-3);">
        <label class="form-label" style="margin: 0; white-space: nowrap; font-size: 0.85em;">Clasificación:</label>
        <select class="form-select sofia-filter-select" id="filter-eficiencia-clasificacion" style="min-width: 180px; padding: 6px 12px; font-size: 0.85em;">
          <option value="">Todas</option>
          ${allPredios.map(p => `<option value="${p}">${p}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="data-table-container animate-fade-in" style="padding: var(--space-6);">
        <div style="height: 320px; position: relative;">
            <canvas id="chart-jornales-eficiencia-historico"></canvas>
        </div>
        <p style="text-align: center; color: var(--text-tertiary); font-size: 0.9em; margin-top: var(--space-4);">
            Evolución de Intensidad Laboral (Jornales/Ha) por mes entre ciclos productivos.
            <span id="eficiencia-filter-label" style="font-weight: 600; color: var(--color-accent-400);"></span>
        </p>
    </div>
  `;
}

export function renderInformeParametros(fincas, variedades, aplicaciones) {
  return `
    <div class="dashboard-grid animate-fade-in" style="grid-template-columns: repeat(3, 1fr);">
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon green">🏘️</div>
        </div>
        <div class="metric-value">${fincas.length}</div>
        <div class="metric-label">Fincas Registradas</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon purple">🍇</div>
        </div>
        <div class="metric-value">${variedades.length}</div>
        <div class="metric-label">Variedades de Uva</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon amber">🧪</div>
        </div>
        <div class="metric-value">${aplicaciones.length}</div>
        <div class="metric-label">Aplicaciones Registradas</div>
      </div>
    </div>

    <div class="charts-row animate-fade-in animate-delay-1">
      <div class="data-table-container">
        <div class="table-header">
          <h3>Fincas y Superficie</h3>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Finca</th>
              <th>Hectáreas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${fincas.map(f => `
              <tr>
                <td><strong>${f.name}</strong></td>
                <td>${f.hectares} ha</td>
                <td>
                  <span class="status-badge ${f.status === 'active' ? 'active' : 'inactive'}">
                    <span class="status-dot"></span>
                    ${f.status === 'active' ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="data-table-container">
        <div class="table-header">
          <h3>Últimas Aplicaciones</h3>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Dosis</th>
              <th>Predio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${aplicaciones.map(a => `
              <tr>
                <td><strong>${a.product}</strong></td>
                <td>${a.dose}</td>
                <td>${a.predio}</td>
                <td>
                  <span class="status-badge ${a.status === 'applied' ? 'active' : a.status === 'pending' ? 'pending' : 'inactive'}">
                    <span class="status-dot"></span>
                    ${a.status === 'applied' ? 'Aplicado' : a.status === 'pending' ? 'Pendiente' : 'Programado'}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── Aplicaciones View ──
export function renderAplicacionesView(aplicaciones) {
  return `
    <div class="data-table-container animate-fade-in">
      <div class="table-header">
        <h3>Aplicaciones Fitosanitarias</h3>
        <div class="table-actions">
          <button class="btn btn-primary btn-sm" id="btn-add-aplicacion">+ Nueva Aplicación</button>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Dosis</th>
            <th>Predio</th>
            <th>Fecha</th>
            <th>Ingeniero</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${aplicaciones.map(a => `
            <tr>
              <td><strong>${a.product}</strong></td>
              <td>${a.dose}</td>
              <td>${a.predio}</td>
              <td>${formatDate(a.date)}</td>
              <td>${a.engineer}</td>
              <td>
                <span class="status-badge ${a.status === 'applied' ? 'active' : a.status === 'pending' ? 'pending' : 'inactive'}">
                  <span class="status-dot"></span>
                  ${a.status === 'applied' ? 'Aplicado' : a.status === 'pending' ? 'Pendiente' : 'Programado'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Presupuesto Management View ──
export function renderPresupuestoView(presupuestos) {
  return `
    <div class="chart-container animate-fade-in">
      <div class="chart-header">
        <span class="chart-title">Ejecución Presupuestaria</span>
      </div>
      <div class="chart-canvas-wrapper" style="height: 350px;">
        <canvas id="chart-presupuesto-mgmt"></canvas>
      </div>
    </div>

    <div class="data-table-container animate-fade-in animate-delay-1">
      <div class="table-header">
        <h3>Detalle de Presupuestos</h3>
        <div class="table-actions">
          <button class="btn btn-primary btn-sm" id="btn-add-presupuesto">+ Nuevo Presupuesto</button>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Categoría</th>
            <th>Presupuestado</th>
            <th>Ejecutado</th>
            <th>% Ejecución</th>
          </tr>
        </thead>
        <tbody>
          ${presupuestos.map(p => {
    const pct = Math.round((p.executed / p.planned) * 100);
    return `
              <tr>
                <td>${p.month}</td>
                <td><strong>${p.category}</strong></td>
                <td>$${formatCurrency(p.planned)}</td>
                <td>$${formatCurrency(p.executed)}</td>
                <td>
                  <div style="display: flex; align-items: center; gap: var(--space-3);">
                    <div style="flex: 1; height: 6px; background: var(--bg-glass); border-radius: var(--radius-full); overflow: hidden; max-width: 100px;">
                      <div style="height: 100%; width: ${Math.min(pct, 100)}%; background: ${pct > 100 ? 'var(--color-error)' : 'var(--color-primary-500)'}; border-radius: var(--radius-full);"></div>
                    </div>
                    <span style="font-size: var(--text-xs); color: ${pct > 100 ? 'var(--color-error)' : 'var(--text-secondary)'};">${pct}%</span>
                  </div>
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ── Usuarios View ──
export function renderUsuariosView(usuarios) {
  return `
    <div class="data-table-container animate-fade-in">
      <div class="table-header">
        <h3>Gestión de Usuarios</h3>
        <div class="table-actions">
          <button class="btn btn-primary btn-sm" id="btn-add-usuario">+ Nuevo Usuario</button>
        </div>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${usuarios.map(u => `
            <tr>
              <td>
                <div class="sidebar-avatar" style="width: 32px; height: 32px; font-size: var(--text-xs);">${u.avatar}</div>
              </td>
              <td><strong>${u.name}</strong></td>
              <td style="color: var(--text-secondary);">${u.email}</td>
              <td>
                <span class="status-badge ${u.role === 'Administrador' ? 'active' : 'pending'}" style="background: rgba(168, 85, 247, 0.1); color: var(--color-accent-400);">
                  ${u.role}
                </span>
              </td>
              <td>
                <span class="status-badge ${u.active ? 'active' : 'inactive'}">
                  <span class="status-dot"></span>
                  ${u.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function renderCosechaDashboard(stats) {
  const formatKg = (v) => new Intl.NumberFormat('es-AR').format(Math.round(v));

  return `
    <div class="dashboard-grid animate-fade-in" style="margin-bottom: var(--space-6);">
      <!-- Metric Cards -->
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon purple">🍇</div>
        </div>
        <div class="metric-value">${formatKg(stats.totalKilos)} <small style="font-size: 0.5em; color: var(--text-tertiary);">kg</small></div>
        <div class="metric-label">TOTAL COSECHADO</div>
        <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">Todas las fincas</p>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon blue">📈</div>
        </div>
        <div class="metric-value">${formatKg(stats.rendimientoPromedio)} <small style="font-size: 0.5em; color: var(--text-tertiary);">kg/ha</small></div>
        <div class="metric-label">RENDIMIENTO PROMEDIO</div>
        <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">Por hectárea</p>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon green">🗺️</div>
        </div>
        <div class="metric-value">${stats.cuartelesCosechados}</div>
        <div class="metric-label">CUARTELES COSECHADOS</div>
        <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">Con actividad de cosecha</p>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon amber">🌿</div>
        </div>
        <div class="metric-value">${stats.totalVariedades}</div>
        <div class="metric-label">VARIEDADES</div>
        <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">Tipos de uva cosechados</p>
      </div>
    </div>

    <!-- Lists Row -->
    <div class="dashboard-grid animate-fade-in animate-delay-1" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6);">
      
      <!-- Rendimiento por Finca -->
      <div class="data-table-container" style="padding: var(--space-6);">
        <h4 style="margin-bottom: var(--space-6); font-family: 'Outfit'; display: flex; align-items: center; gap: var(--space-2);">
          🚜 Rendimiento por Finca
        </h4>
        <div class="list-container">
          ${stats.fincas.map(f => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) 0; border-bottom: 1px solid var(--border-subtle);">
              <span style="font-weight: 500;">${f.name}</span>
              <span style="color: var(--color-primary-400); font-weight: 700;">${formatKg(f.kg)} <small style="font-weight: 400; opacity: 0.7;">kg</small></span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Rendimiento por Predio -->
      <div class="data-table-container" style="padding: var(--space-6);">
        <h4 style="margin-bottom: var(--space-6); font-family: 'Outfit'; display: flex; align-items: center; gap: var(--space-2);">
          📍 Rendimiento por Predio
        </h4>
        <div class="list-container">
          ${stats.predios.map(p => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) 0; border-bottom: 1px solid var(--border-subtle);">
              <span style="font-weight: 500;">${p.name}</span>
              <span style="color: var(--color-secondary-400); font-weight: 700;">${formatKg(p.kg)} <small style="font-weight: 400; opacity: 0.7;">kg</small></span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Rendimiento por Cuartel -->
      <div class="data-table-container" style="padding: var(--space-6);">
        <h4 style="margin-bottom: var(--space-6); font-family: 'Outfit'; display: flex; align-items: center; gap: var(--space-2);">
          📖 Rendimiento por Cuartel
        </h4>
        <div class="list-container">
          ${stats.cuarteles.map(c => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) 0; border-bottom: 1px solid var(--border-subtle);">
              <span style="font-weight: 500; font-size: var(--text-sm);">${c.name}</span>
              <span style="color: var(--color-accent-400); font-weight: 700;">${formatKg(c.kg)} <small style="font-weight: 400; opacity: 0.7;">kg</small></span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Rendimiento por Variedad -->
      <div class="data-table-container" style="padding: var(--space-6);">
        <h4 style="margin-bottom: var(--space-6); font-family: 'Outfit'; display: flex; align-items: center; gap: var(--space-2);">
          🍇 Rendimiento por Variedad
        </h4>
        <div class="list-container">
          ${stats.variedades.map(v => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) 0; border-bottom: 1px solid var(--border-subtle);">
              <span style="font-weight: 500;">${v.name}</span>
              <span style="color: var(--color-amber-400); font-weight: 700;">${formatKg(v.kg)} <small style="font-weight: 400; opacity: 0.7;">kg</small></span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>

    <!-- Origen Analysis -->
    <div class="section-divider" style="margin: var(--space-8) 0; height: 1px; background: var(--border-subtle);"></div>
    
    <h4 style="margin-bottom: var(--space-4); font-family: 'Outfit'; color: var(--text-secondary);">📦 Origen de Uva</h4>
    
    <div class="dashboard-grid animate-fade-in animate-delay-2" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6);">
        <div class="metric-card" style="border-left: 4px solid var(--color-primary-500); padding: var(--space-6);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4);">
                <div class="metric-label" style="font-size: 1.1em; color: var(--text-primary);">🏠 Uva Propia</div>
                <div style="background: var(--color-primary-500); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.75em; font-weight: 600;">INTERNO</div>
            </div>
            <div class="metric-value" style="color: var(--color-primary-600); font-size: 2.5em;">${formatKg(stats.origen.propia)} <small style="font-size: 0.4em; color: var(--text-tertiary);">kg</small></div>
            <p style="color: var(--text-tertiary); font-size: 0.9em; margin-top: var(--space-2);">Camino Truncado, EEI-III, La Chimbera, Puente Alto</p>
        </div>
        <div class="metric-card" style="border-left: 4px solid var(--color-accent-500); padding: var(--space-6);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4);">
                <div class="metric-label" style="font-size: 1.1em; color: var(--text-primary);">🤝 Uva Terceros</div>
                <div style="background: var(--color-accent-500); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.75em; font-weight: 600;">EXTERNO</div>
            </div>
            <div class="metric-value" style="color: var(--color-accent-600); font-size: 2.5em;">${formatKg(stats.origen.terceros)} <small style="font-size: 0.4em; color: var(--text-tertiary);">kg</small></div>
            <p style="color: var(--text-tertiary); font-size: 0.9em; margin-top: var(--space-2);">Compra de uva a terceros</p>
        </div>
    </div>
    
    <!-- Historical Harvest Chart -->
    <div class="section-divider" style="margin: var(--space-8) 0; height: 1px; background: var(--border-subtle);"></div>
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
        <h4 style="font-family: 'Outfit'; color: var(--text-secondary); margin: 0;">📅 Evolución Histórica de Cosecha</h4>
        <div class="filter-group" style="margin: 0;">
            <select class="form-select sofia-filter-select" id="filter-cosecha-historico-origen" style="padding: 4px 12px; font-size: 0.9em; min-width: 150px;">
                <option value="">Todo Origen</option>
                <option value="propia">🍇 Propia</option>
                <option value="terceros">🤝 Terceros</option>
            </select>
        </div>
    </div>

    <div class="data-table-container animate-fade-in animate-delay-3" style="padding: var(--space-6);">
        <div style="height: 300px; position: relative;">
            <canvas id="chart-cosecha-historico"></canvas>
        </div>
        <p style="text-align: center; color: var(--text-tertiary); font-size: 0.9em; margin-top: var(--space-4);">
            Total de Kg Cosechados por Ciclo Productivo.
        </p>
    </div>
    `;
}

export function renderCosechaLevantadoTable(clStats) {
  const fmt = (v) => new Intl.NumberFormat('es-AR').format(Math.round(v));
  const passes = [1, 2, 3, 4, 5];
  const groupColors = {
    'El Espejo': { accent: 'var(--color-accent-500)', bg: 'rgba(168, 85, 247, 0.08)' },
    'Fincas Viejas': { accent: 'var(--color-primary-500)', bg: 'rgba(59, 130, 246, 0.08)' }
  };
  const globalFactor = clStats.grandTotalCosecha > 0 ? (clStats.grandTotalLevantado / clStats.grandTotalCosecha) : 0;

  return `
    <div class="section-divider" style="margin: var(--space-8) 0; height: 1px; background: var(--border-subtle);"></div>
    <h3 style="font-family: 'Outfit'; color: var(--text-primary); margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-3);">
      🍇 Cosecha en Fresco vs. Levantado de Pasa
    </h3>
    <p style="color: var(--text-tertiary); font-size: 0.85em; margin-bottom: var(--space-6);">
      Comparación de kilogramos cosechados en fresco (<strong>Cosecha KG</strong>) y kilogramos de pasa levantada de secadero (<strong>Levantado</strong>) por pasada (1-5), agrupado por clasificación.
      El <strong>factor de reducción</strong> indica la proporción de pasa obtenida respecto al peso en fresco.
    </p>

    <div class="dashboard-grid animate-fade-in" style="margin-bottom: var(--space-6); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
      <div class="metric-card" style="padding: var(--space-5); border-left: 4px solid var(--color-primary-500);">
        <div class="metric-card-header"><div class="metric-card-icon green">🍇</div></div>
        <div class="metric-value" style="font-size: 1.8em;">${fmt(clStats.grandTotalCosecha)} <small style="font-size: 0.35em; color: var(--text-tertiary);">kg</small></div>
        <div class="metric-label">Total Cosecha en Fresco</div>
      </div>
      <div class="metric-card" style="padding: var(--space-5); border-left: 4px solid var(--color-accent-500);">
        <div class="metric-card-header"><div class="metric-card-icon purple">🫘</div></div>
        <div class="metric-value" style="font-size: 1.8em;">${fmt(clStats.grandTotalLevantado)} <small style="font-size: 0.35em; color: var(--text-tertiary);">kg</small></div>
        <div class="metric-label">Total Levantado (Pasa)</div>
      </div>
      <div class="metric-card" style="padding: var(--space-5); border-left: 4px solid #f59e0b;">
        <div class="metric-card-header"><div class="metric-card-icon amber">⚖️</div></div>
        <div class="metric-value" style="font-size: 1.8em;">${globalFactor.toFixed(2)}</div>
        <div class="metric-label">Factor de Reducción Global</div>
        <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-1);">${(globalFactor * 100).toFixed(1)}% del peso fresco</p>
      </div>
    </div>

    ${clStats.groups.map(g => {
    const colors = groupColors[g.name] || groupColors['El Espejo'];
    if (g.predios.length === 0) return '';
    const gFactor = g.totalCosecha > 0 ? (g.totalLevantado / g.totalCosecha) : 0;
    return `
      <div class="data-table-container animate-fade-in animate-delay-1" style="padding: var(--space-6); border-left: 4px solid ${colors.accent}; margin-bottom: var(--space-6);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-5); flex-wrap: wrap; gap: var(--space-3);">
          <h4 style="font-family: 'Outfit'; color: var(--text-primary); display: flex; align-items: center; gap: var(--space-2); margin: 0;">
            ${g.name === 'El Espejo' ? '🏔️' : '🏡'} ${g.name}
          </h4>
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 12px; border-radius: 12px; font-size: 0.8em; font-weight: 600;">🍇 ${fmt(g.totalCosecha)} kg</div>
            <div style="background: rgba(168, 85, 247, 0.1); color: var(--color-accent-400); padding: 4px 12px; border-radius: 12px; font-size: 0.8em; font-weight: 600;">🫘 ${fmt(g.totalLevantado)} kg</div>
            <div style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 4px 12px; border-radius: 12px; font-size: 0.8em; font-weight: 600;">⚖️ Factor: ${gFactor.toFixed(2)}</div>
          </div>
        </div>
        <div style="overflow-x: auto;">
          <table class="data-table" style="margin: 0; min-width: 850px;">
            <thead>
              <tr>
                <th style="vertical-align: middle; min-width: 120px;">Predio</th>
                <th style="vertical-align: middle; min-width: 70px;">Tipo</th>
                ${passes.map(n => '<th style="text-align: right; font-size: 0.85em;">' + n + '° Pasada</th>').join('')}
                <th style="text-align: right;">Total</th>
                <th style="text-align: center; min-width: 80px; background: rgba(245, 158, 11, 0.06);">Factor</th>
              </tr>
            </thead>
            <tbody>
              ${g.predios.map(p => {
      const pFactor = p.totalCosecha > 0 ? (p.totalLevantado / p.totalCosecha) : 0;
      return '<tr style="border-bottom: none;">' +
        '<td rowspan="3" style="vertical-align: middle; border-bottom: 2px solid var(--border-subtle);"><strong>' + p.name + '</strong></td>' +
        '<td style="font-size: 0.8em; color: #10b981; font-weight: 600;">🍇 Fresco</td>' +
        p.cosecha.map(v => '<td style="text-align: right; ' + (v > 0 ? 'color: #10b981; font-weight: 600;' : 'color: var(--text-tertiary); opacity: 0.5;') + '">' + (v > 0 ? fmt(v) : '—') + '</td>').join('') +
        '<td style="text-align: right; font-weight: 700; color: #059669;">' + fmt(p.totalCosecha) + '</td>' +
        '<td rowspan="3" style="text-align: center; vertical-align: middle; font-size: 1.3em; font-weight: 800; color: #f59e0b; background: rgba(245, 158, 11, 0.06); border-bottom: 2px solid var(--border-subtle);">' + pFactor.toFixed(2) + '<div style="font-size: 0.5em; font-weight: 400; color: var(--text-tertiary);">' + (pFactor * 100).toFixed(1) + '%</div></td>' +
        '</tr>' +
        '<tr style="border-bottom: none;">' +
        '<td style="font-size: 0.8em; color: var(--color-accent-400); font-weight: 600;">🫘 Pasa</td>' +
        p.levantado.map(v => '<td style="text-align: right; ' + (v > 0 ? 'color: var(--color-accent-400); font-weight: 600;' : 'color: var(--text-tertiary); opacity: 0.5;') + '">' + (v > 0 ? fmt(v) : '—') + '</td>').join('') +
        '<td style="text-align: right; font-weight: 700; color: var(--color-accent-500);">' + fmt(p.totalLevantado) + '</td>' +
        '</tr>' +
        '<tr style="border-bottom: 2px solid var(--border-subtle);">' +
        '<td style="font-size: 0.8em; color: #f59e0b; font-weight: 600;">⚖️ Factor</td>' +
        p.cosecha.map((c, i) => {
          const l = p.levantado[i];
          const f = c > 0 ? (l / c) : 0;
          const hasData = c > 0 && l > 0;
          return '<td style="text-align: right; ' + (hasData ? 'color: #f59e0b; font-weight: 700;' : 'color: var(--text-tertiary); opacity: 0.5;') + '">' + (hasData ? f.toFixed(2) : '—') + '</td>';
        }).join('') +
        '<td style="text-align: right; font-weight: 700; color: #f59e0b;">' + (pFactor > 0 ? pFactor.toFixed(2) : '—') + '</td>' +
        '</tr>';
    }).join('')}
            </tbody>
            <tfoot style="background: ${colors.bg}; font-weight: 700;">
              <tr style="border-bottom: none;">
                <td rowspan="3" style="vertical-align: middle;">Subtotal</td>
                <td style="font-size: 0.8em;">🍇</td>
                ${g.cosechaPasses.map(v => '<td style="text-align: right; color: #10b981;">' + (v > 0 ? fmt(v) : '—') + '</td>').join('')}
                <td style="text-align: right; color: #059669;">${fmt(g.totalCosecha)}</td>
                <td rowspan="3" style="text-align: center; vertical-align: middle; font-size: 1.3em; font-weight: 800; color: #f59e0b;">${gFactor.toFixed(2)}</td>
              </tr>
              <tr style="border-bottom: none;">
                <td style="font-size: 0.8em;">🫘</td>
                ${g.levantadoPasses.map(v => '<td style="text-align: right; color: var(--color-accent-500);">' + (v > 0 ? fmt(v) : '—') + '</td>').join('')}
                <td style="text-align: right; color: var(--color-accent-600);">${fmt(g.totalLevantado)}</td>
              </tr>
              <tr>
                <td style="font-size: 0.8em;">⚖️</td>
                ${g.cosechaPasses.map((c, i) => {
      const l = g.levantadoPasses[i];
      const f = c > 0 ? (l / c) : 0;
      return '<td style="text-align: right; color: #f59e0b;">' + (c > 0 && l > 0 ? f.toFixed(2) : '—') + '</td>';
    }).join('')}
                <td style="text-align: right; color: #f59e0b;">${gFactor > 0 ? gFactor.toFixed(2) : '—'}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>`;
  }).join('')}
  `;
}


// ── Utility Functions ──
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatCurrency(amount) {
  return Math.abs(amount).toLocaleString('es-AR');
}

// ═══════════════════════════════════════════════════════════
// MÓDULO INFORMES DE APLICACIONES (SOFÍA)
// ═══════════════════════════════════════════════════════════

export function renderInformeAplicaciones(cycles, fincas, predios, cuarteles, userRole, filters) {
  const canUpload = userRole === 'Administrador' || userRole === 'Ingeniero';
  return `
  <div id="sofia-module-container">
    <div class="section-header animate-fade-in" style="margin-bottom: var(--space-4);">
        <h2 style="font-family: 'Outfit'; color: var(--text-primary);">🧪 Informe de Aplicaciones</h2>
    </div>

    <div class="sofia-filters animate-fade-in animate-delay-1" id="sofia-filters">
      <div class="filter-group">
        <label class="form-label">Ciclo Producción</label>
        <select class="form-select sofia-filter-select" id="filter-ciclo" style="padding-left:var(--space-4);">
          ${cycles.map(c => `<option value="${c}" ${c === filters.ciclo ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label class="form-label">Finca</label>
        <select class="form-select sofia-filter-select" id="filter-finca" style="padding-left:var(--space-4);">
          <option value="">Todas</option>
          ${fincas.map(f => `<option value="${f}" ${f === filters.finca ? 'selected' : ''}>${f}</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label class="form-label">Clasificación</label>
        <select class="form-select sofia-filter-select" id="filter-predio" style="padding-left:var(--space-4);">
          <option value="">Todos</option>
          ${predios.map(p => `<option value="${p}" ${p === filters.predio ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
      </div>
      <div class="filter-group">
        <label class="form-label">Variedad</label>
        <select class="form-select sofia-filter-select" id="filter-variedad" style="padding-left:var(--space-4);">
          <option value="">Todas</option>
          ${(filters.variedades || []).map(v => `<option value="${v}" ${v === filters.variedad ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="tabs animate-fade-in animate-delay-2" id="sofia-subtabs">
      <button class="tab-btn active" data-subtab="resumen">Resumen</button>
      <button class="tab-btn" data-subtab="foliares">Foliares</button>
      <button class="tab-btn" data-subtab="herbicidas">Herbicidas</button>
      <button class="tab-btn" data-subtab="fertilizacion">Fertilización Comparativa</button>
    </div>

    <div id="sofia-subtab-content" class="animate-fade-in animate-delay-3"></div>
    </div >
  `;
}

export function renderSofiaResumen(resumen) {
  const fmtCost = (v) => '$' + formatCurrency(v);
  const fincas = Object.entries(resumen.fincaBreakdown || {});

  return `
  <!--Global Totals Section-->

    <div class="section-divider"> Consolidado Global </div>
    <div class="dashboard-grid" style="margin-bottom: var(--space-8);">
      <div class="metric-card">
        <div class="metric-card-header">
          <div class="metric-card-icon green">📊</div>
          <span class="metric-badge up">Total</span>
        </div>
        <div class="metric-value">${resumen.totalAplicaciones}</div>
        <div class="metric-label">Aplicaciones Totales</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header"><div class="metric-card-icon blue">🧴</div></div>
        <div class="metric-value">${resumen.foliares.count}</div>
        <div class="metric-label">Foliares · ${fmtCost(resumen.foliares.costo)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header"><div class="metric-card-icon amber">🌿</div></div>
        <div class="metric-value">${resumen.herbicidas.count}</div>
        <div class="metric-label">Herbicidas · ${fmtCost(resumen.herbicidas.costo)}</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header"><div class="metric-card-icon purple">🧪</div></div>
        <div class="metric-value">${resumen.fertilizacion.count}</div>
        <div class="metric-label">Fertilización · ${fmtCost(resumen.fertilizacion.costo)}</div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-container">
        <div class="chart-header"><span class="chart-title">Distribución por Categoría</span></div>
        <div class="chart-canvas-wrapper"><canvas id="chart-sofia-dist"></canvas></div>
      </div>
      <div class="chart-container">
        <div class="chart-header"><span class="chart-title">Costo por Producto (Top 8)</span></div>
        <div class="chart-canvas-wrapper"><canvas id="chart-sofia-cost"></canvas></div>
      </div>
    </div>

    <div class="data-table-container animate-fade-in animate-delay-2" style="margin-top: var(--space-8);">
        <div class="table-header">
            <h3>🧴 Consolidado de Insumos / Productos Aplicados</h3>
            <span style="font-size: var(--text-sm); color: var(--text-tertiary);">Top 10 por Volumen (L/Kg)</span>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Insumo / Producto</th>
                    <th>Labor</th>
                    <th style="text-align: right;">Cant. Aplicaciones</th>
                    <th style="text-align: right;">Total Litros / Kg</th>
                </tr>
            </thead>
            <tbody>
                ${resumen.topProducts.map(p => `
                    <tr>
                        <td style="font-weight: 600;">${p.producto}</td>
                        <td><span class="status-badge" style="background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border-light); font-size: 0.85em;">${p.labor}</span></td>
                        <td style="text-align: right; color: var(--text-tertiary);">${p.count}</td>
                        <td style="text-align: right;">
                            <span class="status-badge active" style="background: var(--bg-tertiary); color: var(--color-blue-400); min-width: 80px; justify-content: flex-end;">
                                ${p.totalCantidad.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L
                            </span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;
}

export function renderSofiaFoliares(data) {
  return `
  <div class="data-table-container">
      <div class="table-header">
        <h3>🧴 Aplicaciones Foliares (AF) — <span style="color:var(--text-tertiary)">Gasto Operativo Curativo</span></h3>
        <div class="table-actions">
          <span class="status-badge active"><span class="status-dot"></span> ${data.length} registros</span>
        </div>
      </div>
      <table class="data-table">
        <thead><tr>
          <th>Predio / Cuartel</th><th>Fecha</th><th>Labor</th><th>Producto</th>
          <th>Cant. (L)</th><th>Dosis</th><th>Costo Unit.</th><th>Costo Total</th>
        </tr></thead>
        <tbody>
          ${data.length === 0 ? '<tr><td colspan="8" style="text-align:center;color:var(--text-tertiary);padding:var(--space-8);">Sin registros</td></tr>' :
      (() => {
        const grouped = data.reduce((acc, r) => {
          const key = r.finca_original || r.finca || 'Otros';
          if (!acc[key]) acc[key] = [];
          acc[key].push(r);
          return acc;
        }, {});

        return Object.entries(grouped).map(([finca, rows]) => `
          <tr class="table-group-header" style="background: rgba(59, 130, 246, 0.05);">
            <td colspan="8" style="font-weight: 700; color: var(--color-blue-400); padding: var(--space-3) var(--space-4);">
              🏡 ${finca}
            </td>
          </tr>
          ${rows.map(r => `
          <tr>
            <td style="padding-left: var(--space-8);">
              <span style="color: var(--text-tertiary); font-size: 0.85em;">${r.clasifica || ''}</span><br/>
              <strong>${r.cuartel}</strong>
            </td>
            <td>${formatDate(r.fecha_aplicacion)}</td>
            <td><span class="status-badge" style="background: var(--bg-secondary); font-size: 0.85em;">${r.labor_codigo}</span></td>
            <td><strong>${r.producto}</strong></td>
            <td>${formatCurrency(r.cantidad)}</td>
            <td>${r.dosis}</td>
            <td>$${formatCurrency(r.costo_unitario)}</td>
            <td style="color:var(--color-primary-400)">$${formatCurrency(r.cantidad * r.costo_unitario)}</td>
          </tr>
          `).join('')}
        `).join('');
      })()}
        </tbody>
      </table>
    </div > `;
}

export function renderSofiaHerbicidas(data) {
  return `
  <div class="data-table-container">
      <div class="table-header">
        <h3>🌿 Herbicidas — <span style="color:var(--text-tertiary)">Gasto Operativo Mantenimiento</span></h3>
        <div class="table-actions">
          <span class="status-badge pending"><span class="status-dot"></span> ${data.length} registros</span>
        </div>
      </div>
      <table class="data-table">
        <thead><tr>
          <th>Predio / Cuartel</th><th>Fecha</th><th>Labor</th><th>Producto</th>
          <th>Cant. (L)</th><th>Dosis</th><th>Costo Unit.</th><th>Costo Total</th>
        </tr></thead>
        <tbody>
          ${data.length === 0 ? '<tr><td colspan="8" style="text-align:center;color:var(--text-tertiary);padding:var(--space-8);">Sin registros</td></tr>' :
      (() => {
        const grouped = data.reduce((acc, r) => {
          const key = r.finca_original || r.finca || 'Otros';
          if (!acc[key]) acc[key] = [];
          acc[key].push(r);
          return acc;
        }, {});

        return Object.entries(grouped).map(([finca, rows]) => `
          <tr class="table-group-header" style="background: rgba(245, 158, 11, 0.05);">
            <td colspan="8" style="font-weight: 700; color: var(--color-amber-400); padding: var(--space-3) var(--space-4);">
              🏡 ${finca}
            </td>
          </tr>
          ${rows.map(r => `
          <tr>
            <td style="padding-left: var(--space-8);">
              <span style="color: var(--text-tertiary); font-size: 0.85em;">${r.clasifica || ''}</span><br/>
              <strong>${r.cuartel}</strong>
            </td>
            <td>${formatDate(r.fecha_aplicacion)}</td>
            <td><span class="status-badge" style="background: var(--bg-secondary); font-size: 0.85em;">${r.labor_codigo}</span></td>
            <td><strong>${r.producto}</strong></td>
            <td>${formatCurrency(r.cantidad)}</td>
            <td>${r.dosis}</td>
            <td>$${formatCurrency(r.costo_unitario)}</td>
            <td style="color:var(--color-secondary-400)">$${formatCurrency(r.cantidad * r.costo_unitario)}</td>
          </tr>
          `).join('')}
        `).join('');
      })()}
        </tbody>
      </table>
    </div > `;
}

export function renderFertilizacionComparativa(data) {
  const totalMeta = data.reduce((s, r) => s + r.metaAnual, 0);
  const totalReal = data.reduce((s, r) => s + r.real, 0);
  const totalDesvio = totalReal - totalMeta;
  const totalPct = totalMeta > 0 ? Math.round((totalDesvio / totalMeta) * 100) : 0;

  return `
  <div class="dashboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
      <div class="metric-card">
        <div class="metric-card-header"><div class="metric-card-icon green">🎯</div></div>
        <div class="metric-value">${formatCurrency(totalMeta)} L</div>
        <div class="metric-label">Total Comprado (Presupuestado)</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header"><div class="metric-card-icon purple">📦</div></div>
        <div class="metric-value">${formatCurrency(totalReal)} L</div>
        <div class="metric-label">Total Real Aplicado</div>
      </div>
      <div class="metric-card">
        <div class="metric-card-header"><div class="metric-card-icon ${totalDesvio > 0 ? 'amber' : 'green'}">📐</div></div>
        <div class="metric-value desvio-value ${totalDesvio > 0 ? 'over' : totalDesvio < 0 ? 'under' : ''}">${totalDesvio > 0 ? '+' : ''}${formatCurrency(totalDesvio)} L</div>
        <div class="metric-label">Desvío Total (${totalPct > 0 ? '+' : ''}${totalPct}%)</div>
      </div>
    </div>

    <!--Charts -->
    <div style="display: flex; flex-direction: column; gap: var(--space-6); margin-bottom: var(--space-8);">
      <div class="chart-container" style="min-height: 500px; padding: var(--space-6);">
          <div class="chart-header" style="color:var(--color-primary-400)"><span class="chart-title">🍇 El Espejo: Comprado vs Real por Producto</span></div>
          <div class="chart-canvas-wrapper" style="height:450px;"><canvas id="chart-fert-prod-espejo"></canvas></div>
      </div>
      <div class="chart-container" style="min-height: 500px; padding: var(--space-6);">
          <div class="chart-header" style="color:var(--color-amber-400)"><span class="chart-title">🌾 Fincas Viejas: Comprado vs Real por Producto</span></div>
          <div class="chart-canvas-wrapper" style="height:450px;"><canvas id="chart-fert-prod-fincasviejas"></canvas></div>
      </div>
      <!-- ═══ EL ESPEJO: Nutrientes por Cod Cuartel ═══ -->
      <div class="section-divider" style="margin: var(--space-6) 0; height: 2px; background: linear-gradient(90deg, transparent, var(--color-primary-500), transparent);"></div>
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
        <h3 style="font-family: 'Outfit'; color: var(--color-primary-400); margin: 0;">
          🍇 El Espejo — <span style="font-size: 0.85em; color: var(--text-tertiary);">Unidades por Cod Cuartel</span>
        </h3>
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <label for="filter-producto-ee" style="font-family: 'Inter'; font-size: 12px; font-weight: 600; color: var(--text-tertiary);">Producto:</label>
          <select id="filter-producto-ee" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 6px 12px; color: var(--text-primary); font-family: 'Inter'; font-size: 12px; font-weight: 500; cursor: pointer; min-width: 180px; outline: none; transition: border-color 0.2s;">
            <option value="" style="color:#000;">Todos los productos</option>
          </select>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6);">
        <div class="chart-container" style="min-height: 380px; padding: var(--space-6);">
            <div class="chart-header" style="color: #34d399;">
              <span class="chart-title">🧪 Nitrógeno (N)</span>
              <span style="font-size: 0.75em; color: var(--text-tertiary); margin-left: var(--space-2);">Unidades</span>
            </div>
            <div class="chart-canvas-wrapper" style="height:320px;"><canvas id="chart-fert-unidades-n-ee"></canvas></div>
        </div>
        <div class="chart-container" style="min-height: 380px; padding: var(--space-6);">
            <div class="chart-header" style="color: #eab308;">
              <span class="chart-title">🔬 Fósforo (P)</span>
              <span style="font-size: 0.75em; color: var(--text-tertiary); margin-left: var(--space-2);">Unidades</span>
            </div>
            <div class="chart-canvas-wrapper" style="height:320px;"><canvas id="chart-fert-unidades-p-ee"></canvas></div>
        </div>
        <div class="chart-container" style="min-height: 380px; padding: var(--space-6);">
            <div class="chart-header" style="color: #a78bfa;">
              <span class="chart-title">⚗️ Potasio (K)</span>
              <span style="font-size: 0.75em; color: var(--text-tertiary); margin-left: var(--space-2);">Unidades</span>
            </div>
            <div class="chart-canvas-wrapper" style="height:320px;"><canvas id="chart-fert-unidades-k-ee"></canvas></div>
        </div>
      </div>

      <!-- ═══ FINCAS VIEJAS: Nutrientes por Clasifica ═══ -->
      <div class="section-divider" style="margin: var(--space-6) 0; height: 2px; background: linear-gradient(90deg, transparent, var(--color-amber-500), transparent);"></div>
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3); margin-bottom: var(--space-4);">
        <h3 style="font-family: 'Outfit'; color: var(--color-amber-400); margin: 0;">
          🌾 Fincas Viejas — <span style="font-size: 0.85em; color: var(--text-tertiary);">Unidades por Clasifica</span>
        </h3>
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <label for="filter-producto-fv" style="font-family: 'Inter'; font-size: 12px; font-weight: 600; color: var(--text-tertiary);">Producto:</label>
          <select id="filter-producto-fv" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 6px 12px; color: var(--text-primary); font-family: 'Inter'; font-size: 12px; font-weight: 500; cursor: pointer; min-width: 180px; outline: none; transition: border-color 0.2s;">
            <option value="" style="color:#000;">Todos los productos</option>
          </select>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6);">
        <div class="chart-container" style="min-height: 380px; padding: var(--space-6);">
            <div class="chart-header" style="color: #34d399;">
              <span class="chart-title">🧪 Nitrógeno (N)</span>
              <span style="font-size: 0.75em; color: var(--text-tertiary); margin-left: var(--space-2);">Unidades</span>
            </div>
            <div class="chart-canvas-wrapper" style="height:320px;"><canvas id="chart-fert-unidades-n-fv"></canvas></div>
        </div>
        <div class="chart-container" style="min-height: 380px; padding: var(--space-6);">
            <div class="chart-header" style="color: #eab308;">
              <span class="chart-title">🔬 Fósforo (P)</span>
              <span style="font-size: 0.75em; color: var(--text-tertiary); margin-left: var(--space-2);">Unidades</span>
            </div>
            <div class="chart-canvas-wrapper" style="height:320px;"><canvas id="chart-fert-unidades-p-fv"></canvas></div>
        </div>
        <div class="chart-container" style="min-height: 380px; padding: var(--space-6);">
            <div class="chart-header" style="color: #a78bfa;">
              <span class="chart-title">⚗️ Potasio (K)</span>
              <span style="font-size: 0.75em; color: var(--text-tertiary); margin-left: var(--space-2);">Unidades</span>
            </div>
            <div class="chart-canvas-wrapper" style="height:320px;"><canvas id="chart-fert-unidades-k-fv"></canvas></div>
        </div>
      </div>

      <div class="chart-container" style="min-height: 400px; padding: var(--space-6); grid-column: 1 / -1;">
          <div class="chart-header" style="color: var(--color-primary-400); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
            <span class="chart-title">📈 🍇 El Espejo — Aplicación Semanal (L)</span>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <label for="filter-weekly-producto-ee" style="font-family: 'Inter'; font-size: 12px; font-weight: 600; color: var(--text-tertiary);">Producto:</label>
              <select id="filter-weekly-producto-ee" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 6px 12px; color: var(--text-primary); font-family: 'Inter'; font-size: 12px; font-weight: 500; cursor: pointer; min-width: 180px; outline: none;">
                <option value="" style="color:#000;">Todos los productos</option>
                <option value="NUTRI 1075 M" style="color:#000;">NUTRI 1075 M</option>
                <option value="NUTRI 1683 M" style="color:#000;">NUTRI 1683 M</option>
                <option value="NUTRI 1684 M" style="color:#000;">NUTRI 1684 M</option>
              </select>
            </div>
          </div>
          <div class="chart-canvas-wrapper" style="height:350px;"><canvas id="chart-fert-weekly-ee"></canvas></div>
      </div>
      <div class="chart-container" style="min-height: 400px; padding: var(--space-6); grid-column: 1 / -1;">
          <div class="chart-header" style="color: var(--color-amber-400); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: var(--space-3);">
            <span class="chart-title">📈 🌾 Fincas Viejas — Aplicación Semanal (L)</span>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <label for="filter-weekly-producto-fv" style="font-family: 'Inter'; font-size: 12px; font-weight: 600; color: var(--text-tertiary);">Producto:</label>
              <select id="filter-weekly-producto-fv" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 6px 12px; color: var(--text-primary); font-family: 'Inter'; font-size: 12px; font-weight: 500; cursor: pointer; min-width: 180px; outline: none;">
                <option value="" style="color:#000;">Todos los productos</option>
                <option value="NUTRI 1075 M" style="color:#000;">NUTRI 1075 M</option>
                <option value="NUTRI 1683 M" style="color:#000;">NUTRI 1683 M</option>
                <option value="NUTRI 1684 M" style="color:#000;">NUTRI 1684 M</option>
              </select>
            </div>
          </div>
          <div class="chart-canvas-wrapper" style="height:350px;"><canvas id="chart-fert-weekly-fv"></canvas></div>
      </div>
    </div>

    <!--Detail Table grouped by Finca-->
  <div class="data-table-container">
    <div class="table-header">
      <h3>🧪 Detalle por Finca y Cuartel</h3>
    </div>
    <table class="data-table">
      <thead><tr>
        <th>Predio / Cuartel</th><th>Producto</th><th>Pre-Cos. (L)</th><th>Pos-Cos. (L)</th>
        <th>Comprado (L)</th><th>Real (L)</th><th>Desvío</th><th>%</th>
      </tr></thead>
      <tbody>
        ${data.length === 0 ? '<tr><td colspan="8" style="text-align:center;color:var(--text-tertiary);padding:var(--space-8);">Sin registros</td></tr>' :
      (() => {
        const grouped = data.reduce((acc, r) => {
          const key = r.finca_original || r.finca || 'Otros';
          if (!acc[key]) acc[key] = [];
          acc[key].push(r);
          return acc;
        }, {});

        return Object.entries(grouped).map(([finca, rows]) => `
          <tr class="table-group-header" style="background: rgba(16, 185, 129, 0.05);">
            <td colspan="8" style="font-weight: 700; color: var(--color-primary-400); padding: var(--space-3) var(--space-4);">
              🏡 ${finca}
            </td>
          </tr>
          ${rows.map(r => `
          <tr>
            <td style="padding-left: var(--space-8);">
              <span style="color: var(--text-tertiary); font-size: 0.85em;">${r.clasifica || ''}</span><br/>
              <strong>${r.cuartel}</strong>
            </td>
            <td><strong>${r.producto}</strong></td>
            <td>${formatCurrency(r.pre)}</td>
            <td>${formatCurrency(r.pos)}</td>
            <td style="font-weight:600;">${formatCurrency(r.metaAnual)}</td>
            <td style="font-weight:600; color:var(--color-accent-400)">${formatCurrency(r.real)}</td>
            <td><span class="desvio-badge ${r.desvio > 0 ? 'over' : r.desvio < 0 ? 'under' : 'on-target'}">${r.desvio > 0 ? '+' : ''}${formatCurrency(r.desvio)}</span></td>
            <td><span class="desvio-badge ${r.desvioPct > 0 ? 'over' : r.desvioPct < 0 ? 'under' : 'on-target'}">${r.desvioPct > 0 ? '+' : ''}${r.desvioPct}%</span></td>
          </tr>
          `).join('')}
        `).join('');
      })()}
      </tbody>
    </table>
  </div>
`;
}

