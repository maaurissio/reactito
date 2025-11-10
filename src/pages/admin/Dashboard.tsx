import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useProductsStore } from '../../store/productsStore';
import { Navigate } from 'react-router-dom';
import { obtenerTodosLosUsuarios, actualizarUsuario as actualizarUsuarioService, registrarUsuario } from '../../services/usuarios.service';
import { obtenerTodosLosPedidos, actualizarEstadoPedido, type IPedido } from '../../services/pedidos.service';
import { obtenerConfiguracionEnvio, guardarConfiguracionEnvio } from '../../services/shippingConfig.service';
import { agregarProducto } from '../../services/productos.service';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SelectModerno } from '../../components/ui';
import type { IProducto, IUsuario } from '../../types';
import { Estado, RolUsuario } from '../../types/models';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Dashboard = () => {
  const { isAdmin, user, logout } = useAuthStore();
  const { productos, cargarProductos, actualizarProducto, actualizarStock } = useProductsStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  
  // Estados para modales de productos
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<IProducto | null>(null);
  const [nuevoStock, setNuevoStock] = useState(0);
  
  // Estados para modales de usuarios
  const [showUserViewModal, setShowUserViewModal] = useState(false);
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [showUserAddModal, setShowUserAddModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<IUsuario | null>(null);
  const [formEditUser, setFormEditUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: ''
  });
  const [formAddUser, setFormAddUser] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    email: '',
    password: '',
    telefono: '',
    direccion: '',
    rol: 'cliente'
  });

  // Estados para filtros
  const [filtroEstadoPedido, setFiltroEstadoPedido] = useState('');

  // Estados para modales de pedidos
  const [showPedidoViewModal, setShowPedidoViewModal] = useState(false);
  const [showPedidoEditModal, setShowPedidoEditModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedido | null>(null);
  const [nuevoEstadoPedido, setNuevoEstadoPedido] = useState<IPedido['estado']>('confirmado');

  // Estados para configuración de envío
  const [costoEnvioBase, setCostoEnvioBase] = useState(5000);
  const [envioGratisDesde, setEnvioGratisDesde] = useState(50000);
  const [envioGratisHabilitado, setEnvioGratisHabilitado] = useState(true);

  // Estados para notificación toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Estados para el formulario de edición de productos
  const [formEdit, setFormEdit] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagen: ''
  });

  // Estados para el formulario de agregar producto
  const [formAdd, setFormAdd] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: 'Frutas Frescas',
    imagen: ''
  });
  const [imagenPreview, setImagenPreview] = useState('');

  // Estados para categorías personalizadas
  const [categorias, setCategorias] = useState<Array<{value: string, label: string, codigo: string}>>([
    { value: 'Frutas Frescas', label: 'Frutas Frescas', codigo: 'FR' },
    { value: 'Verduras Orgánicas', label: 'Verduras Orgánicas', codigo: 'VR' },
    { value: 'Productos Orgánicos', label: 'Productos Orgánicos', codigo: 'PO' },
    { value: 'Productos Lácteos', label: 'Productos Lácteos', codigo: 'LO' },
  ]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre: '',
    codigo: ''
  });

  // Estadísticas dinámicas
  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const totalPedidos = pedidos.length;
  const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);

  // Stock total de todos los productos
  const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);

  useEffect(() => {
    // Cargar productos
    cargarProductos();

    // Cargar usuarios
    const users = obtenerTodosLosUsuarios();
    setUsuarios(users);

    // Cargar pedidos
    const orders = obtenerTodosLosPedidos();
    setPedidos(orders);

    // Cargar configuración de envío
    const config = obtenerConfiguracionEnvio();
    setCostoEnvioBase(config.costoEnvioBase);
    setEnvioGratisDesde(config.envioGratisDesde);
    setEnvioGratisHabilitado(config.envioGratisHabilitado);

    // Cargar categorías personalizadas desde localStorage
    const categoriasGuardadas = localStorage.getItem('categorias_productos_custom');
    if (categoriasGuardadas) {
      try {
        const categoriasParseadas = JSON.parse(categoriasGuardadas);
        setCategorias(categoriasParseadas);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    }
  }, [cargarProductos]);

  // Bloquear scroll del body cuando se abren modales
  useEffect(() => {
    if (showAddModal || showEditModal || showCategoryModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal, showEditModal, showCategoryModal]);

  // Redirigir si no es admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Calcular ventas por mes basándose en los pedidos
  const calcularVentasPorMes = () => {
    const ventasMensuales = new Array(12).fill(0); // 12 meses
    const añoActual = new Date().getFullYear();

    pedidos.forEach((pedido) => {
      if (pedido.estado !== 'cancelado') { // No contar pedidos cancelados
        const fechaPedido = new Date(pedido.fecha);
        if (fechaPedido.getFullYear() === añoActual) {
          const mes = fechaPedido.getMonth(); // 0-11
          ventasMensuales[mes] += pedido.total;
        }
      }
    });

    return ventasMensuales;
  };

  const ventasMensuales = calcularVentasPorMes();
  const mesesDelAño = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  // Datos para el gráfico con ventas reales
  const salesData = {
    labels: mesesDelAño,
    datasets: [
      {
        label: 'Ventas (CLP)',
        data: ventasMensuales,
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1000, // Incrementos de 1000
          callback: function(value: any) {
            return '$' + value.toLocaleString('es-CL');
          }
        }
      }
    }
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
            <div className="card-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {(() => {
                // Crear un array de actividades
                const actividades: Array<{
                  tipo: 'pedido' | 'usuario' | 'stock';
                  fecha: string;
                  descripcion: string;
                  detalle: string;
                  icono: string;
                  color: string;
                }> = [];

                // Agregar últimos pedidos (últimos 5)
                pedidos.slice(-5).forEach(pedido => {
                  actividades.push({
                    tipo: 'pedido',
                    fecha: pedido.fecha,
                    descripcion: `Pedido #${pedido.id} - ${pedido.estado}`,
                    detalle: `${pedido.contacto.nombre} - $${pedido.total.toLocaleString('es-CL')}`,
                    icono: 'fa-shopping-cart',
                    color: pedido.estado === 'entregado' ? 'success' : pedido.estado === 'cancelado' ? 'danger' : 'info'
                  });
                });

                // Agregar últimos usuarios (últimos 3)
                usuarios.slice(-3).forEach(usuario => {
                  if (usuario.fechaRegistro) {
                    actividades.push({
                      tipo: 'usuario',
                      fecha: usuario.fechaRegistro,
                      descripcion: 'Nuevo usuario registrado',
                      detalle: `${usuario.nombre} ${usuario.apellido}`,
                      icono: 'fa-user-plus',
                      color: 'primary'
                    });
                  }
                });

                // Agregar productos con stock bajo
                productos.filter(p => p.stock < 10).slice(0, 3).forEach(producto => {
                  actividades.push({
                    tipo: 'stock',
                    fecha: new Date().toISOString(),
                    descripcion: '⚠️ Stock bajo',
                    detalle: `${producto.nombre} - ${producto.stock} unidades`,
                    icono: 'fa-exclamation-triangle',
                    color: 'warning'
                  });
                });

                // Ordenar por fecha descendente (más reciente primero)
                actividades.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

                // Tomar solo las últimas 8 actividades
                const actividadesRecientes = actividades.slice(0, 8);

                if (actividadesRecientes.length === 0) {
                  return (
                    <div className="text-center py-5">
                      <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No hay actividad reciente</p>
                      <small className="text-muted">
                        La actividad aparecerá aquí cuando se realicen pedidos, registros o cambios en el sistema
                      </small>
                    </div>
                  );
                }

                const formatearTiempo = (fecha: string) => {
                  const ahora = new Date();
                  const fechaEvento = new Date(fecha);
                  const diferencia = ahora.getTime() - fechaEvento.getTime();
                  
                  const minutos = Math.floor(diferencia / 60000);
                  const horas = Math.floor(diferencia / 3600000);
                  const dias = Math.floor(diferencia / 86400000);

                  if (minutos < 1) return 'Hace un momento';
                  if (minutos < 60) return `Hace ${minutos} min`;
                  if (horas < 24) return `Hace ${horas}h`;
                  if (dias < 7) return `Hace ${dias}d`;
                  return fechaEvento.toLocaleDateString('es-CL');
                };

                return (
                  <div className="list-group list-group-flush">
                    {actividadesRecientes.map((actividad, index) => (
                      <div key={index} className="list-group-item border-0 px-0 py-2">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0">
                            <div className={`rounded-circle bg-${actividad.color} bg-opacity-10 p-2`}>
                              <i className={`fas ${actividad.icono} text-${actividad.color}`}></i>
                            </div>
                          </div>
                          <div className="flex-grow-1 ms-3">
                            <p className="mb-0 small fw-semibold">{actividad.descripcion}</p>
                            <small className="text-muted d-block">{actividad.detalle}</small>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              <i className="far fa-clock me-1"></i>
                              {formatearTiempo(actividad.fecha)}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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

  // Funciones para gestión de productos
  const toggleEstadoProducto = (producto: IProducto) => {
    const nuevoEstado = producto.isActivo === Estado.activo ? Estado.inactivo : Estado.activo;
    actualizarProducto(producto.id, { isActivo: nuevoEstado });
  };

  const abrirModalEditar = (producto: IProducto) => {
    setProductoSeleccionado(producto);
    setFormEdit({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      imagen: producto.imagen
    });
    setShowEditModal(true);
  };

  const guardarEdicion = () => {
    if (productoSeleccionado) {
      actualizarProducto(productoSeleccionado.id, {
        nombre: formEdit.nombre,
        descripcion: formEdit.descripcion,
        precio: formEdit.precio,
        stock: formEdit.stock,
        categoria: formEdit.categoria,
        imagen: formEdit.imagen
      });
      setShowEditModal(false);
      setProductoSeleccionado(null);
    }
  };

  const abrirModalStock = (producto: IProducto) => {
    setProductoSeleccionado(producto);
    setNuevoStock(producto.stock);
    setShowStockModal(true);
  };

  const guardarStock = () => {
    if (productoSeleccionado) {
      actualizarStock(productoSeleccionado.id, nuevoStock);
      setShowStockModal(false);
      setProductoSeleccionado(null);
    }
  };

  const abrirModalAgregar = () => {
    setFormAdd({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: 'Frutas Frescas',
      imagen: ''
    });
    setImagenPreview('');
    setShowAddModal(true);
  };

  const guardarNuevoProducto = () => {
    // Validaciones
    if (!formAdd.nombre.trim()) {
      mostrarToast('El nombre del producto es obligatorio', 'error');
      return;
    }
    if (!formAdd.descripcion.trim()) {
      mostrarToast('La descripción del producto es obligatoria', 'error');
      return;
    }
    if (formAdd.precio <= 0) {
      mostrarToast('El precio debe ser mayor a 0', 'error');
      return;
    }
    if (formAdd.stock < 0) {
      mostrarToast('El stock no puede ser negativo', 'error');
      return;
    }
    if (!formAdd.imagen.trim()) {
      mostrarToast('La URL de la imagen es obligatoria', 'error');
      return;
    }

    try {
      console.log('Datos del producto a agregar:', {
        nombre: formAdd.nombre,
        descripcion: formAdd.descripcion,
        precio: formAdd.precio,
        stock: formAdd.stock,
        categoria: formAdd.categoria,
        imagen: formAdd.imagen,
        isActivo: Estado.activo
      });
      
      const nuevoProducto = agregarProducto({
        nombre: formAdd.nombre,
        descripcion: formAdd.descripcion,
        precio: formAdd.precio,
        stock: formAdd.stock,
        categoria: formAdd.categoria as any,
        imagen: formAdd.imagen,
        isActivo: Estado.activo
      });
      
      console.log('Producto agregado:', nuevoProducto);
      console.log('Imagen del producto agregado:', nuevoProducto.imagen);
      
      // Forzar recarga completa de productos
      setTimeout(() => {
        cargarProductos();
      }, 100);
      
      setShowAddModal(false);
      
      // Resetear formulario
      setFormAdd({
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
        categoria: 'Frutas Frescas',
        imagen: ''
      });
      setImagenPreview('');
      
      mostrarToast('Producto agregado exitosamente', 'success');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      mostrarToast('Error al agregar el producto', 'error');
    }
  };

  const handleImagenChange = (url: string) => {
    setFormAdd({ ...formAdd, imagen: url });
    setImagenPreview(url);
  };

  // Funciones para manejar categorías personalizadas
  const agregarCategoria = () => {
    // Validaciones
    if (!nuevaCategoria.nombre.trim()) {
      mostrarToast('El nombre de la categoría es obligatorio', 'error');
      return;
    }

    if (!nuevaCategoria.codigo.trim()) {
      mostrarToast('El código de la categoría es obligatorio', 'error');
      return;
    }

    // Validar que el código tenga 2-3 caracteres
    if (nuevaCategoria.codigo.length < 2 || nuevaCategoria.codigo.length > 3) {
      mostrarToast('El código debe tener 2 o 3 caracteres', 'error');
      return;
    }

    // Validar que no exista una categoría con el mismo nombre o código
    const existeNombre = categorias.some(cat => cat.value.toLowerCase() === nuevaCategoria.nombre.trim().toLowerCase());
    const existeCodigo = categorias.some(cat => cat.codigo.toUpperCase() === nuevaCategoria.codigo.trim().toUpperCase());

    if (existeNombre) {
      mostrarToast('Ya existe una categoría con ese nombre', 'error');
      return;
    }

    if (existeCodigo) {
      mostrarToast('Ya existe una categoría con ese código', 'error');
      return;
    }

    // Crear nueva categoría
    const nuevaCat = {
      value: nuevaCategoria.nombre.trim(),
      label: nuevaCategoria.nombre.trim(),
      codigo: nuevaCategoria.codigo.trim().toUpperCase()
    };

    const categoriasActualizadas = [...categorias, nuevaCat];
    setCategorias(categoriasActualizadas);

    // Guardar en localStorage
    localStorage.setItem('categorias_productos_custom', JSON.stringify(categoriasActualizadas));

    // Limpiar formulario y cerrar modal
    setNuevaCategoria({ nombre: '', codigo: '' });
    setShowCategoryModal(false);
    mostrarToast('Categoría agregada exitosamente', 'success');
  };

  const eliminarCategoria = (categoriaValue: string) => {
    // No permitir eliminar si hay productos con esa categoría
    const productosConCategoria = productos.filter(p => p.categoria === categoriaValue);
    
    if (productosConCategoria.length > 0) {
      mostrarToast(`No puedes eliminar esta categoría porque hay ${productosConCategoria.length} producto(s) asignado(s)`, 'error');
      return;
    }

    const categoriasActualizadas = categorias.filter(cat => cat.value !== categoriaValue);
    setCategorias(categoriasActualizadas);
    localStorage.setItem('categorias_productos_custom', JSON.stringify(categoriasActualizadas));
    mostrarToast('Categoría eliminada', 'success');
  };

  const handleArchivoImagen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      mostrarToast('Por favor selecciona un archivo de imagen válido', 'error');
      return;
    }

    // Validar tamaño (máximo 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      mostrarToast('La imagen es muy grande. Máximo 2MB', 'error');
      return;
    }

    // Convertir a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormAdd({ ...formAdd, imagen: base64String });
      setImagenPreview(base64String);
      mostrarToast('Imagen cargada correctamente', 'success');
    };
    reader.onerror = () => {
      mostrarToast('Error al cargar la imagen', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Funciones para gestión de usuarios
  const abrirModalVerUsuario = (usuario: IUsuario) => {
    setUsuarioSeleccionado(usuario);
    setShowUserViewModal(true);
  };

  const abrirModalEditarUsuario = (usuario: IUsuario) => {
    setUsuarioSeleccionado(usuario);
    setFormEditUser({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || '',
      direccion: usuario.direccion || '',
      rol: usuario.rol
    });
    setShowUserEditModal(true);
  };

  const guardarEdicionUsuario = () => {
    if (usuarioSeleccionado) {
      actualizarUsuarioService(usuarioSeleccionado.id, {
        nombre: formEditUser.nombre,
        apellido: formEditUser.apellido,
        email: formEditUser.email,
        telefono: formEditUser.telefono,
        direccion: formEditUser.direccion,
        rol: formEditUser.rol as any
      });
      setShowUserEditModal(false);
      setUsuarioSeleccionado(null);
      // Recargar lista de usuarios
      setUsuarios(obtenerTodosLosUsuarios());
    }
  };

  const abrirModalEliminarUsuario = (usuario: IUsuario) => {
    // No permitir que un usuario se desactive a sí mismo
    if (user && usuario.id === user.id) {
      alert('No puedes desactivar tu propia cuenta.');
      return;
    }
    setUsuarioSeleccionado(usuario);
    setShowUserDeleteModal(true);
  };

  const confirmarEliminarUsuario = () => {
    if (usuarioSeleccionado) {
      actualizarUsuarioService(usuarioSeleccionado.id, { isActivo: Estado.inactivo });
      setShowUserDeleteModal(false);
      setUsuarioSeleccionado(null);
      // Recargar lista de usuarios
      setUsuarios(obtenerTodosLosUsuarios());
    }
  };

  const activarUsuario = (usuario: IUsuario) => {
    actualizarUsuarioService(usuario.id, { isActivo: Estado.activo });
    // Recargar lista de usuarios
    setUsuarios(obtenerTodosLosUsuarios());
  };

  // Funciones para agregar usuario
  const abrirModalAgregarUsuario = () => {
    setFormAddUser({
      nombre: '',
      apellido: '',
      usuario: '',
      email: '',
      password: '',
      telefono: '',
      direccion: '',
      rol: 'cliente'
    });
    setShowUserAddModal(true);
  };

  const guardarNuevoUsuario = () => {
    // Validaciones
    if (!formAddUser.nombre.trim()) {
      mostrarToast('El nombre es obligatorio', 'error');
      return;
    }
    if (!formAddUser.apellido.trim()) {
      mostrarToast('El apellido es obligatorio', 'error');
      return;
    }
    if (!formAddUser.usuario.trim()) {
      mostrarToast('El nombre de usuario es obligatorio', 'error');
      return;
    }
    if (!formAddUser.email.trim() || !formAddUser.email.includes('@')) {
      mostrarToast('Ingrese un email válido', 'error');
      return;
    }
    if (!formAddUser.password || formAddUser.password.length < 6) {
      mostrarToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    try {
      const nuevoUsuario = registrarUsuario({
        nombre: formAddUser.nombre,
        apellido: formAddUser.apellido,
        usuario: formAddUser.usuario,
        email: formAddUser.email,
        password: formAddUser.password,
        telefono: formAddUser.telefono,
        direccion: formAddUser.direccion,
        rol: formAddUser.rol === 'administrador' ? RolUsuario.administrador : RolUsuario.cliente,
        isActivo: Estado.activo,
      });

      if (nuevoUsuario) {
        // Recargar lista de usuarios
        setUsuarios(obtenerTodosLosUsuarios());
        setShowUserAddModal(false);
        
        // Resetear formulario
        setFormAddUser({
          nombre: '',
          apellido: '',
          usuario: '',
          email: '',
          password: '',
          telefono: '',
          direccion: '',
          rol: 'cliente'
        });
        
        mostrarToast(`Usuario ${nuevoUsuario.nombre} creado exitosamente. Ya puede iniciar sesión.`, 'success');
      } else {
        mostrarToast('El email o nombre de usuario ya están en uso', 'error');
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      mostrarToast('Error al crear el usuario', 'error');
    }
  };

  // Función para mostrar notificación toast
  const mostrarToast = (mensaje: string, tipo: 'success' | 'error' = 'success') => {
    setToastMessage(mensaje);
    setToastType(tipo);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Funciones para gestión de pedidos
  const abrirModalVerPedido = (pedido: IPedido) => {
    setPedidoSeleccionado(pedido);
    setShowPedidoViewModal(true);
  };

  const abrirModalEditarPedido = (pedido: IPedido) => {
    setPedidoSeleccionado(pedido);
    setNuevoEstadoPedido(pedido.estado);
    setShowPedidoEditModal(true);
  };

  const guardarEstadoPedido = () => {
    if (pedidoSeleccionado) {
      const resultado = actualizarEstadoPedido(pedidoSeleccionado.id, nuevoEstadoPedido);
      if (resultado.success) {
        const pedidosActualizados = obtenerTodosLosPedidos();
        setPedidos(pedidosActualizados);
        
        setShowPedidoEditModal(false);
        setPedidoSeleccionado(null);
      }
    }
  };

  const renderProducts = () => (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Productos</h2>
        <button className="btn btn-success" onClick={abrirModalAgregar}>
          <i className="fas fa-plus me-2"></i>Agregar Producto
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td><strong>{producto.codigo}</strong></td>
                    <td>
                      <img 
                        src={
                          producto.imagen.startsWith('data:') 
                            ? producto.imagen 
                            : producto.imagen.startsWith('img/') 
                              ? `/${producto.imagen}` 
                              : producto.imagen
                        } 
                        alt={producto.nombre} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => { e.currentTarget.src = '/img/default.jpg'; }}
                      />
                    </td>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio.toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`badge ${producto.stock > 20 ? 'bg-success' : producto.stock > 10 ? 'bg-warning' : 'bg-danger'}`}>
                        {producto.stock}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">{producto.categoria}</span>
                    </td>
                    <td>
                      <span className={`badge ${producto.isActivo === Estado.activo ? 'bg-success' : 'bg-secondary'}`}>
                        {producto.isActivo === Estado.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-primary me-1" 
                        title="Editar producto"
                        onClick={() => abrirModalEditar(producto)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-info me-1" 
                        title="Agregar stock"
                        onClick={() => abrirModalStock(producto)}
                      >
                        <i className="fas fa-box"></i>
                      </button>
                      <button 
                        className={`btn btn-sm ${producto.isActivo === Estado.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        title={producto.isActivo === Estado.activo ? 'Desactivar' : 'Activar'}
                        onClick={() => toggleEstadoProducto(producto)}
                      >
                        <i className={`fas fa-${producto.isActivo === Estado.activo ? 'times-circle' : 'check-circle'}`}></i>
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
        <button 
          className="btn btn-success"
          onClick={abrirModalAgregarUsuario}
        >
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
                      <button 
                        className="btn btn-sm btn-outline-info me-1"
                        title="Ver usuario"
                        onClick={() => abrirModalVerUsuario(usuario)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        title="Editar usuario"
                        onClick={() => abrirModalEditarUsuario(usuario)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {usuario.isActivo === Estado.activo ? (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          title="Desactivar usuario"
                          onClick={() => abrirModalEliminarUsuario(usuario)}
                          disabled={user?.id === usuario.id}
                        >
                          <i className="fas fa-user-times"></i>
                        </button>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-success"
                          title="Activar usuario"
                          onClick={() => activarUsuario(usuario)}
                        >
                          <i className="fas fa-user-check"></i>
                        </button>
                      )}
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

  const renderOrders = () => {
    const pedidosFiltrados = filtroEstadoPedido 
      ? pedidos.filter(p => p.estado === filtroEstadoPedido)
      : pedidos;

    const formatearFecha = (fecha: string) => {
      return new Date(fecha).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getEstadoBadgeClass = (estado: string) => {
      const clases: { [key: string]: string } = {
        'confirmado': 'bg-success',
        'en-preparacion': 'bg-info',
        'enviado': 'bg-primary',
        'entregado': 'bg-dark',
        'cancelado': 'bg-danger'
      };
      return clases[estado] || 'bg-secondary';
    };

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Pedidos ({pedidos.length})</h2>
          <div style={{ minWidth: '250px' }}>
            <SelectModerno
              label=""
              value={filtroEstadoPedido}
              onChange={(value) => setFiltroEstadoPedido(value)}
              options={[
                { value: '', label: 'Todos los estados' },
                { value: 'confirmado', label: 'Confirmado' },
                { value: 'en-preparacion', label: 'En Preparación' },
                { value: 'enviado', label: 'Enviado' },
                { value: 'entregado', label: 'Entregado' },
                { value: 'cancelado', label: 'Cancelado' }
              ]}
              placeholder="Filtrar por estado"
              icon="fas fa-filter"
            />
          </div>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="alert alert-info mb-0">
                <i className="fas fa-info-circle me-2"></i>
                {filtroEstadoPedido 
                  ? `No hay pedidos con estado "${filtroEstadoPedido}".`
                  : 'No hay pedidos registrados en el sistema actualmente.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID Pedido</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map((pedido) => (
                      <tr key={pedido.id}>
                        <td><strong>{pedido.id}</strong></td>
                        <td>{formatearFecha(pedido.fecha)}</td>
                        <td>
                          {pedido.contacto.nombre} {pedido.contacto.apellido}
                          <br />
                          <small className="text-muted">{pedido.contacto.email}</small>
                        </td>
                        <td><strong>${pedido.total.toLocaleString('es-CL')}</strong></td>
                        <td>
                          <span className={`badge ${getEstadoBadgeClass(pedido.estado)}`}>
                            {pedido.estado}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-info me-1"
                            title="Ver detalles del pedido"
                            onClick={() => abrirModalVerPedido(pedido)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            title="Cambiar estado"
                            onClick={() => abrirModalEditarPedido(pedido)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

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
              <form onSubmit={(e) => {
                e.preventDefault();
                guardarConfiguracionEnvio({
                  costoEnvioBase,
                  envioGratisDesde,
                  envioGratisHabilitado
                });
                mostrarToast('Configuración de envío guardada correctamente');
              }}>
                <div className="mb-3">
                  <label className="form-label">Costo de Envío Base</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={costoEnvioBase}
                    onChange={(e) => setCostoEnvioBase(Number(e.target.value))}
                    min="0" 
                  />
                  <small className="text-muted">Costo estándar de envío en pesos chilenos</small>
                </div>
                <div className="mb-3">
                  <label className="form-label">Envío Gratis Desde</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={envioGratisDesde}
                    onChange={(e) => setEnvioGratisDesde(Number(e.target.value))}
                    min="0"
                    disabled={!envioGratisHabilitado}
                  />
                  <small className="text-muted">Monto mínimo para envío gratuito</small>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={envioGratisHabilitado}
                      onChange={(e) => setEnvioGratisHabilitado(e.target.checked)}
                      id="enableFreeShipping" 
                    />
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
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
          overflowX: 'hidden'
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
                {/* Usuario logueado */}
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

      {/* Modal para agregar/editar stock */}
      {showStockModal && productoSeleccionado && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowStockModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-box text-info me-2"></i>
                  Actualizar Stock - {productoSeleccionado.nombre}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowStockModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Stock Actual</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={productoSeleccionado.stock} 
                    disabled 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nuevo Stock</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={nuevoStock}
                    onChange={(e) => setNuevoStock(Number(e.target.value))}
                    min="0"
                  />
                  <small className="text-muted">
                    Diferencia: {nuevoStock - productoSeleccionado.stock > 0 ? '+' : ''}{nuevoStock - productoSeleccionado.stock}
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowStockModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={guardarStock}
                >
                  <i className="fas fa-save me-2"></i>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar producto */}
      {showAddModal && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'auto' }}
          onClick={() => setShowAddModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus-circle text-success me-2"></i>
                  Agregar Nuevo Producto
                </h5>
                <div className="d-flex gap-2 align-items-center">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-success"
                    onClick={() => setShowCategoryModal(true)}
                    title="Gestionar categorías"
                  >
                    <i className="fas fa-tags me-1"></i>
                    Gestionar Categorías
                  </button>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formAdd.nombre}
                      onChange={(e) => setFormAdd({...formAdd, nombre: e.target.value})}
                      placeholder="Ej: Tomates Cherry"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Precio *</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={formAdd.precio}
                        onChange={(e) => setFormAdd({...formAdd, precio: Number(e.target.value)})}
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock Inicial *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formAdd.stock}
                      onChange={(e) => setFormAdd({...formAdd, stock: Number(e.target.value)})}
                      min="0"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Categoría *</label>
                    <SelectModerno
                      label=""
                      value={formAdd.categoria}
                      onChange={(value) => setFormAdd({...formAdd, categoria: value})}
                      options={categorias.map(cat => ({
                        value: cat.value,
                        label: cat.label
                      }))}
                      placeholder="Seleccionar categoría"
                      icon="fas fa-tags"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción *</label>
                    <textarea 
                      className="form-control" 
                      rows={3}
                      value={formAdd.descripcion}
                      onChange={(e) => setFormAdd({...formAdd, descripcion: e.target.value})}
                      placeholder="Describe el producto..."
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Imagen del Producto *</label>
                    
                    {/* Pestañas para elegir método */}
                    <ul className="nav nav-tabs mb-3" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button 
                          className="nav-link active" 
                          id="url-tab" 
                          data-bs-toggle="tab" 
                          data-bs-target="#url-panel" 
                          type="button"
                        >
                          <i className="fas fa-link me-2"></i>URL
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button 
                          className="nav-link" 
                          id="upload-tab" 
                          data-bs-toggle="tab" 
                          data-bs-target="#upload-panel" 
                          type="button"
                        >
                          <i className="fas fa-upload me-2"></i>Subir Archivo
                        </button>
                      </li>
                    </ul>

                    {/* Contenido de las pestañas */}
                    <div className="tab-content">
                      {/* Panel URL */}
                      <div className="tab-pane fade show active" id="url-panel">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formAdd.imagen.startsWith('data:') ? '' : formAdd.imagen}
                          onChange={(e) => handleImagenChange(e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        <small className="text-muted">
                          Pega la URL de una imagen pública
                        </small>
                      </div>

                      {/* Panel Subir Archivo */}
                      <div className="tab-pane fade" id="upload-panel">
                        <input 
                          type="file" 
                          className="form-control" 
                          accept="image/*"
                          onChange={handleArchivoImagen}
                        />
                        <small className="text-muted">
                          Selecciona una imagen de tu computadora (máx. 2MB)
                        </small>
                      </div>
                    </div>
                  </div>
                  {imagenPreview && (
                    <div className="col-12">
                      <label className="form-label">Vista Previa</label>
                      <div className="text-center">
                        <img 
                          src={
                            imagenPreview.startsWith('data:') 
                              ? imagenPreview 
                              : imagenPreview.startsWith('img/') 
                                ? `/${imagenPreview}` 
                                : imagenPreview
                          } 
                          alt="Preview" 
                          style={{ 
                            maxWidth: '200px', 
                            maxHeight: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid #dee2e6'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/200?text=Error+al+cargar';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={guardarNuevoProducto}
                >
                  <i className="fas fa-save me-2"></i>
                  Agregar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar producto */}
      {showEditModal && productoSeleccionado && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'auto' }}
          onClick={() => setShowEditModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit text-primary me-2"></i>
                  Editar Producto - ID: {productoSeleccionado.id}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formEdit.nombre}
                      onChange={(e) => setFormEdit({...formEdit, nombre: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Precio *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formEdit.precio}
                      onChange={(e) => setFormEdit({...formEdit, precio: Number(e.target.value)})}
                      min="0"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Stock *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formEdit.stock}
                      onChange={(e) => setFormEdit({...formEdit, stock: Number(e.target.value)})}
                      min="0"
                    />
                  </div>
                  <div className="col-md-6">
                    <SelectModerno
                      label="Categoría"
                      value={formEdit.categoria}
                      onChange={(value) => setFormEdit({...formEdit, categoria: value})}
                      options={categorias.map(cat => ({
                        value: cat.value,
                        label: cat.label
                      }))}
                      placeholder="Seleccionar categoría"
                      icon="fas fa-tags"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Descripción *</label>
                    <textarea 
                      className="form-control" 
                      rows={3}
                      value={formEdit.descripcion}
                      onChange={(e) => setFormEdit({...formEdit, descripcion: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">URL de Imagen *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formEdit.imagen}
                      onChange={(e) => setFormEdit({...formEdit, imagen: e.target.value})}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formEdit.imagen && (
                      <div className="mt-2">
                        <img 
                          src={
                            formEdit.imagen.startsWith('data:') 
                              ? formEdit.imagen 
                              : formEdit.imagen.startsWith('img/') 
                                ? `/${formEdit.imagen}` 
                                : formEdit.imagen
                          } 
                          alt="Preview" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/100';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={guardarEdicion}
                >
                  <i className="fas fa-save me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Usuario */}
      {showUserViewModal && usuarioSeleccionado && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  Información del Usuario
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowUserViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <p><strong>ID:</strong> {usuarioSeleccionado.id}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Usuario:</strong> {usuarioSeleccionado.usuario}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Teléfono:</strong> {usuarioSeleccionado.telefono || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Dirección:</strong> {usuarioSeleccionado.direccion || 'N/A'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Rol:</strong> 
                      <span className={`badge ms-2 ${usuarioSeleccionado.rol === 'administrador' ? 'bg-danger' : 'bg-primary'}`}>
                        {usuarioSeleccionado.rol}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Estado:</strong> 
                      <span className={`badge ms-2 ${usuarioSeleccionado.isActivo === Estado.activo ? 'bg-success' : 'bg-secondary'}`}>
                        {usuarioSeleccionado.isActivo === Estado.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                  </div>
                  <div className="col-12">
                    <p><strong>Fecha de Registro:</strong> {usuarioSeleccionado.fechaRegistro || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowUserViewModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {showUserEditModal && usuarioSeleccionado && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Editar Usuario
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowUserEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formEditUser.nombre}
                      onChange={(e) => setFormEditUser({...formEditUser, nombre: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellido *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formEditUser.apellido}
                      onChange={(e) => setFormEditUser({...formEditUser, apellido: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={formEditUser.email}
                      onChange={(e) => setFormEditUser({...formEditUser, email: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      value={formEditUser.telefono}
                      onChange={(e) => setFormEditUser({...formEditUser, telefono: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formEditUser.direccion}
                      onChange={(e) => setFormEditUser({...formEditUser, direccion: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Rol *</label>
                    <select 
                      className="form-select"
                      value={formEditUser.rol}
                      onChange={(e) => setFormEditUser({...formEditUser, rol: e.target.value})}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowUserEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={guardarEdicionUsuario}
                >
                  <i className="fas fa-save me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar Usuario */}
      {showUserDeleteModal && usuarioSeleccionado && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-white border-bottom">
                <h5 className="modal-title text-dark">
                  <i className="fas fa-exclamation-triangle me-2 text-warning"></i>
                  Confirmar Desactivación
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowUserDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center py-3">
                  <i className="fas fa-user-times fa-4x text-danger mb-3"></i>
                  <h5 className="text-dark">¿Estás seguro de desactivar este usuario?</h5>
                  <p className="text-muted mb-0">
                    <strong>{usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</strong>
                  </p>
                  <p className="text-muted">
                    {usuarioSeleccionado.email}
                  </p>
                  <div className="alert alert-warning mt-3" role="alert">
                    <i className="fas fa-info-circle me-2"></i>
                    El usuario será desactivado y no podrá iniciar sesión.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowUserDeleteModal(false)}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmarEliminarUsuario}
                >
                  <i className="fas fa-user-times me-2"></i>
                  Sí, Desactivar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Pedido */}
      {showPedidoViewModal && pedidoSeleccionado && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Detalles del Pedido #{pedidoSeleccionado.id}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPedidoViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2 mb-3">Información del Cliente</h6>
                    <p><strong>Nombre:</strong> {pedidoSeleccionado.contacto.nombre} {pedidoSeleccionado.contacto.apellido}</p>
                    <p><strong>Email:</strong> {pedidoSeleccionado.contacto.email}</p>
                    <p><strong>Teléfono:</strong> {pedidoSeleccionado.contacto.telefono}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2 mb-3">Información de Envío</h6>
                    <p><strong>Dirección:</strong> {pedidoSeleccionado.envio.direccion}</p>
                    <p><strong>Ciudad:</strong> {pedidoSeleccionado.envio.ciudad}</p>
                    <p><strong>Región:</strong> {pedidoSeleccionado.envio.region}</p>
                    {pedidoSeleccionado.envio.codigoPostal && (
                      <p><strong>Código Postal:</strong> {pedidoSeleccionado.envio.codigoPostal}</p>
                    )}
                    {pedidoSeleccionado.envio.notas && (
                      <p><strong>Notas:</strong> {pedidoSeleccionado.envio.notas}</p>
                    )}
                  </div>
                  <div className="col-12">
                    <h6 className="border-bottom pb-2 mb-3">Productos del Pedido</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedidoSeleccionado.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.nombre}</td>
                              <td>${item.precio.toLocaleString('es-CL')}</td>
                              <td>{item.cantidad}</td>
                              <td>${item.subtotal.toLocaleString('es-CL')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="alert alert-light">
                      <div className="d-flex justify-content-between">
                        <span>Subtotal:</span>
                        <strong>${pedidoSeleccionado.subtotal.toLocaleString('es-CL')}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Costo de Envío:</span>
                        <strong>
                          {pedidoSeleccionado.envio.esGratis 
                            ? 'GRATIS' 
                            : `$${pedidoSeleccionado.costoEnvio.toLocaleString('es-CL')}`
                          }
                        </strong>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="h5">Total:</span>
                        <span className="h5 text-success">${pedidoSeleccionado.total.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Estado:</strong> 
                      <span className={`badge ms-2 ${
                        pedidoSeleccionado.estado === 'confirmado' ? 'bg-success' :
                        pedidoSeleccionado.estado === 'en-preparacion' ? 'bg-info' :
                        pedidoSeleccionado.estado === 'enviado' ? 'bg-primary' :
                        pedidoSeleccionado.estado === 'entregado' ? 'bg-dark' :
                        'bg-danger'
                      }`}>
                        {pedidoSeleccionado.estado}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Fecha:</strong> {new Date(pedidoSeleccionado.fecha).toLocaleString('es-CL')}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowPedidoViewModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Estado del Pedido */}
      {showPedidoEditModal && pedidoSeleccionado && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>
                  Cambiar Estado del Pedido
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPedidoEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Pedido:</strong> {pedidoSeleccionado.id}</p>
                <p><strong>Cliente:</strong> {pedidoSeleccionado.contacto.nombre} {pedidoSeleccionado.contacto.apellido}</p>
                <hr />
                <div className="mb-3">
                  <label className="form-label">Estado Actual:</label>
                  <div>
                    <span className={`badge ${
                      pedidoSeleccionado.estado === 'confirmado' ? 'bg-success' :
                      pedidoSeleccionado.estado === 'en-preparacion' ? 'bg-info' :
                      pedidoSeleccionado.estado === 'enviado' ? 'bg-primary' :
                      pedidoSeleccionado.estado === 'entregado' ? 'bg-dark' :
                      'bg-danger'
                    }`}>
                      {pedidoSeleccionado.estado}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nuevo Estado:</label>
                  <select 
                    className="form-select"
                    value={nuevoEstadoPedido}
                    onChange={(e) => setNuevoEstadoPedido(e.target.value as IPedido['estado'])}
                  >
                    <option value="confirmado">Confirmado</option>
                    <option value="en-preparacion">En Preparación</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowPedidoEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={guardarEstadoPedido}
                >
                  <i className="fas fa-save me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Usuario */}
      {showUserAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title text-white">
                  <i className="fas fa-user-plus me-2"></i>
                  Agregar Nuevo Usuario
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowUserAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-user me-1 text-success"></i>Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formAddUser.nombre}
                      onChange={(e) => setFormAddUser({ ...formAddUser, nombre: e.target.value })}
                      placeholder="Ej: Juan"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-user me-1 text-success"></i>Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formAddUser.apellido}
                      onChange={(e) => setFormAddUser({ ...formAddUser, apellido: e.target.value })}
                      placeholder="Ej: Pérez"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-id-badge me-1 text-info"></i>Usuario <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formAddUser.usuario}
                      onChange={(e) => setFormAddUser({ ...formAddUser, usuario: e.target.value })}
                      placeholder="Ej: juanp (sin espacios)"
                      required
                    />
                    <small className="text-muted">Será usado para iniciar sesión</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-envelope me-1 text-primary"></i>Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      value={formAddUser.email}
                      onChange={(e) => setFormAddUser({ ...formAddUser, email: e.target.value })}
                      placeholder="Ej: juan@ejemplo.com"
                      required
                    />
                    <small className="text-muted">También puede usarlo para iniciar sesión</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-lock me-1 text-warning"></i>Contraseña <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={formAddUser.password}
                      onChange={(e) => setFormAddUser({ ...formAddUser, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-user-shield me-1 text-danger"></i>Rol <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formAddUser.rol}
                      onChange={(e) => setFormAddUser({ ...formAddUser, rol: e.target.value })}
                      required
                    >
                      <option value="cliente">Cliente</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-phone me-1 text-info"></i>Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formAddUser.telefono}
                      onChange={(e) => setFormAddUser({ ...formAddUser, telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="fas fa-map-marker-alt me-1 text-success"></i>Dirección
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formAddUser.direccion}
                      onChange={(e) => setFormAddUser({ ...formAddUser, direccion: e.target.value })}
                      placeholder="Calle, número, comuna"
                    />
                  </div>
                </div>
                <div className="alert alert-info mt-3 mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Importante:</strong> El usuario podrá iniciar sesión con el <strong>nombre de usuario</strong> o el <strong>email</strong> que ingreses aquí.
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowUserAddModal(false)}
                >
                  <i className="fas fa-times me-1"></i>Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={guardarNuevoUsuario}
                >
                  <i className="fas fa-save me-1"></i>Crear Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación Toast */}
      {showToast && (
        <div 
          style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            zIndex: 9999, 
            minWidth: '300px', 
            maxWidth: '400px', 
            animation: 'slideInRight 0.3s ease-out' 
          }}
        >
          <div className={`card shadow-lg border-0 border-start border-${toastType === 'error' ? 'danger' : 'success'} border-4`}>
            <div className="card-body p-3 d-flex align-items-center">
              <i className={`fas fa-${toastType === 'error' ? 'exclamation-circle text-danger' : 'check-circle text-success'} me-3`} style={{ fontSize: '2rem' }}></i>
              <div className="flex-grow-1">
                <h6 className="mb-0">{toastMessage}</h6>
              </div>
              <button 
                className="btn-close ms-2" 
                onClick={() => setShowToast(false)}
                aria-label="Cerrar"
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar Categoría */}
      {showCategoryModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title text-white">
                  <i className="fas fa-plus-circle me-2"></i>
                  Nueva Categoría de Producto
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNuevaCategoria({ nombre: '', codigo: '' });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => { e.preventDefault(); agregarCategoria(); }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-tag me-2 text-success"></i>
                        Nombre de la Categoría *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={nuevaCategoria.nombre}
                        onChange={(e) => setNuevaCategoria({...nuevaCategoria, nombre: e.target.value})}
                        placeholder="Ej: Bebidas, Snacks, Congelados..."
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        <i className="fas fa-code me-2 text-success"></i>
                        Código (2-3 letras) *
                      </label>
                      <input
                        type="text"
                        className="form-control text-uppercase"
                        value={nuevaCategoria.codigo}
                        onChange={(e) => setNuevaCategoria({...nuevaCategoria, codigo: e.target.value.toUpperCase()})}
                        placeholder="Ej: BE, SN, CO"
                        maxLength={3}
                        pattern="[A-Za-z]{2,3}"
                        required
                      />
                      <small className="text-muted">
                        Este código se usará para generar los códigos de productos (Ej: BE001, BE002...)
                      </small>
                    </div>

                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        <strong>Vista previa:</strong> {nuevaCategoria.nombre || 'Nombre de categoría'} ({nuevaCategoria.codigo || 'XX'}001)
                      </div>
                    </div>
                  </div>
                </form>

                {/* Lista de categorías existentes */}
                <div className="mt-4">
                  <h6 className="border-bottom pb-2">
                    <i className="fas fa-list me-2"></i>
                    Categorías Existentes
                  </h6>
                  <div className="list-group" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {categorias.map((cat) => (
                      <div key={cat.value} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                          <strong>{cat.label}</strong>
                          <span className="badge bg-secondary ms-2">{cat.codigo}</span>
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarCategoria(cat.value)}
                          title="Eliminar categoría"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNuevaCategoria({ nombre: '', codigo: '' });
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={agregarCategoria}
                >
                  <i className="fas fa-plus me-2"></i>
                  Agregar Categoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Estilo para hacer el SelectModerno más pequeño en el Dashboard */
        .select-categoria-dashboard .select-moderno-trigger {
          min-height: 38px !important;
          height: 38px !important;
          padding: 0.4rem 1rem !important;
        }
      `}</style>
    </div>
  );
};
