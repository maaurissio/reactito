import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProductsStore } from '../../store/productsStore';
import { Navigate } from 'react-router-dom';
import { obtenerTodosLosUsuarios } from '../../services/usuariosService';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Dashboard = () => {
  const { isAdmin, user, logout } = useAuthStore();
  const { productos } = useProductsStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // Estadísticas dinámicas
  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const totalVentas = 0; // TODO: Implementar cuando haya sistema de ventas
  const totalPedidos = 0; // TODO: Implementar cuando haya sistema de pedidos

  // Stock total de todos los productos
  const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);

  useEffect(() => {
    // Cargar usuarios
    const users = obtenerTodosLosUsuarios();
    setUsuarios(users);
  }, []);

  // Redirigir si no es admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Datos para el gráfico (comienzan en 0, se actualizarán con ventas reales)
  const salesData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Ventas (CLP)',
        data: [0, 0, 0, 0, 0, 0], // TODO: Actualizar con datos reales de ventas
        backgroundColor: 'rgba(46, 139, 87, 0.8)',
        borderColor: 'rgba(46, 139, 87, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const renderDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Ventas Totales</p>
                  <h3 className="mb-0 text-success">${totalVentas.toLocaleString('es-CL')}</h3>
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>Próximamente
                  </small>
                </div>
                <div className="text-success">
                  <i className="fas fa-dollar-sign fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Pedidos</p>
                  <h3 className="mb-0 text-info">{totalPedidos}</h3>
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>Próximamente
                  </small>
                </div>
                <div className="text-info">
                  <i className="fas fa-shopping-cart fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Usuarios Registrados</p>
                  <h3 className="mb-0 text-warning">{totalUsuarios}</h3>
                  <small className="text-success">
                    <i className="fas fa-users me-1"></i>{usuarios.filter(u => u.isActivo === 'Activo').length} activos
                  </small>
                </div>
                <div className="text-warning">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1">Productos en Catálogo</p>
                  <h3 className="mb-0 text-primary">{totalProductos}</h3>
                  <small className="text-success">
                    <i className="fas fa-boxes me-1"></i>{stockTotal} unidades totales
                  </small>
                </div>
                <div className="text-primary">
                  <i className="fas fa-box fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Ventas Mensuales</h5>
            </div>
            <div className="card-body" style={{ height: '350px' }}>
              <Bar data={salesData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Actividad Reciente</h5>
            </div>
            <div className="card-body">
              {totalVentas === 0 && totalPedidos === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No hay actividad reciente</p>
                  <small className="text-muted">
                    La actividad aparecerá aquí cuando se realicen ventas, registros o cambios en el sistema
                  </small>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {/* Los productos con stock bajo */}
                  {productos.filter(p => p.stock < 10).slice(0, 3).map((producto) => (
                    <div key={producto.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle bg-warning bg-opacity-10 p-2">
                            <i className="fas fa-exclamation-triangle text-warning"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <p className="mb-0 small">Stock bajo: {producto.nombre}</p>
                          <small className="text-muted">Quedan {producto.stock} unidades</small>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Últimos usuarios registrados */}
                  {usuarios.slice(-2).reverse().map((usuario) => (
                    <div key={usuario.id} className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle bg-info bg-opacity-10 p-2">
                            <i className="fas fa-user-plus text-info"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <p className="mb-0 small">Usuario registrado: {usuario.nombre} {usuario.apellido}</p>
                          <small className="text-muted">{usuario.email}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row g-3 mt-3">
        <div className="col-md-4">
          <button 
            onClick={() => setActiveSection('products')} 
            className="btn btn-outline-success w-100 py-3"
          >
            <i className="fas fa-plus fa-2x mb-2 d-block"></i>
            Agregar Producto
          </button>
        </div>
        <div className="col-md-4">
          <button 
            onClick={() => setActiveSection('orders')} 
            className="btn btn-outline-info w-100 py-3"
          >
            <i className="fas fa-eye fa-2x mb-2 d-block"></i>
            Ver Pedidos
          </button>
        </div>
        <div className="col-md-4">
          <button 
            onClick={() => setActiveSection('users')} 
            className="btn btn-outline-warning w-100 py-3"
          >
            <i className="fas fa-users fa-2x mb-2 d-block"></i>
            Gestionar Usuarios
          </button>
        </div>
      </div>
    </>
  );

  const renderProducts = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        <button className="btn btn-success">
          <i className="fas fa-plus me-2"></i>Agregar Producto
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>
                      <img 
                        src={producto.imagen} 
                        alt={producto.nombre} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${producto.stock > 20 ? 'bg-success' : producto.stock > 10 ? 'bg-warning' : 'bg-danger'}`}>
                        {producto.stock}
                      </span>
                    </td>
                    <td>{producto.categoria}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Usuarios</h2>
        <button className="btn btn-success">
          <i className="fas fa-user-plus me-2"></i>Agregar Usuario
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre} {usuario.apellido}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefono || 'N/A'}</td>
                    <td>
                      <span className={`badge ${usuario.rol === 'administrador' ? 'bg-danger' : 'bg-primary'}`}>
                        {usuario.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${usuario.isActivo === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                        {usuario.isActivo}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-info me-1">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );

  const renderOrders = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Pedidos</h2>
        <select className="form-select w-auto">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="procesando">Procesando</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            No hay pedidos registrados en el sistema actualmente.
          </div>
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <h2 className="mb-4">Configuración del Sistema</h2>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Configuración General</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Nombre del Sitio</label>
                  <input type="text" className="form-control" defaultValue="Huerto Hogar" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email de Contacto</label>
                  <input type="email" className="form-control" defaultValue="contacto@huertohogar.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" className="form-control" defaultValue="+56 9 1234 5678" />
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save me-2"></i>Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Configuración de Envío</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Costo de Envío Base</label>
                  <input type="number" className="form-control" defaultValue="2990" min="0" />
                  <small className="text-muted">Costo estándar de envío en pesos chilenos</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Envío Gratis Desde</label>
                  <input type="number" className="form-control" defaultValue="30000" min="0" />
                  <small className="text-muted">Monto mínimo para envío gratuito</small>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked id="enableFreeShipping" />
                    <label className="form-check-label" htmlFor="enableFreeShipping">
                      Habilitar Envío Gratis
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-save me-2"></i>Guardar Configuración
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-container d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <div 
        className={`sidebar bg-dark text-white ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ 
          width: sidebarCollapsed ? '80px' : '250px', 
          transition: 'width 0.3s',
          minHeight: '100vh',
          position: 'sticky',
          top: 0
        }}
      >
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className={`mb-0 ${sidebarCollapsed ? 'd-none' : ''}`}>Admin Panel</h4>
            <button 
              className="btn btn-sm btn-outline-light"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>

        <ul className="nav flex-column p-3">
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeSection === 'dashboard' ? 'btn-success' : 'btn-link text-white'}`}
              onClick={() => setActiveSection('dashboard')}
            >
              <i className="fas fa-tachometer-alt me-2"></i>
              {!sidebarCollapsed && 'Dashboard'}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeSection === 'products' ? 'btn-success' : 'btn-link text-white'}`}
              onClick={() => setActiveSection('products')}
            >
              <i className="fas fa-box me-2"></i>
              {!sidebarCollapsed && 'Productos'}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeSection === 'users' ? 'btn-success' : 'btn-link text-white'}`}
              onClick={() => setActiveSection('users')}
            >
              <i className="fas fa-users me-2"></i>
              {!sidebarCollapsed && 'Usuarios'}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeSection === 'orders' ? 'btn-success' : 'btn-link text-white'}`}
              onClick={() => setActiveSection('orders')}
            >
              <i className="fas fa-shopping-cart me-2"></i>
              {!sidebarCollapsed && 'Pedidos'}
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${activeSection === 'settings' ? 'btn-success' : 'btn-link text-white'}`}
              onClick={() => setActiveSection('settings')}
            >
              <i className="fas fa-cog me-2"></i>
              {!sidebarCollapsed && 'Configuración'}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-3 mb-4">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-0">
                  {activeSection === 'dashboard' && 'Dashboard Overview'}
                  {activeSection === 'products' && 'Gestión de Productos'}
                  {activeSection === 'users' && 'Gestión de Usuarios'}
                  {activeSection === 'orders' && 'Gestión de Pedidos'}
                  {activeSection === 'settings' && 'Configuración'}
                </h2>
                <a href="/" className="btn btn-sm btn-outline-success mt-2">
                  <i className="fas fa-arrow-left me-1"></i>
                  Volver al Sitio
                </a>
              </div>
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-link position-relative">
                  <i className="fas fa-bell"></i>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </button>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '35px', height: '35px' }}>
                    {user?.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <span className="me-3">{user?.nombre}</span>
                </div>
                <button onClick={logout} className="btn btn-outline-danger btn-sm">
                  <i className="fas fa-sign-out-alt me-1"></i>Salir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container-fluid px-4 pb-4">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'products' && renderProducts()}
          {activeSection === 'users' && renderUsers()}
          {activeSection === 'orders' && renderOrders()}
          {activeSection === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};
