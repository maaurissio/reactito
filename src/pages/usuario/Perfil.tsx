import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { actualizarUsuario, cambiarPassword, obtenerUsuarioPorId, eliminarCuentaConConfirmacion } from '../../services/usuarios.service';
import { Navigate, useNavigate } from 'react-router-dom';
import { obtenerPedidosUsuario, type IPedido } from '../../services/pedidos.service';

export const Perfil = () => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'pedidos' | 'seguridad'>('info');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    avatar: '',
  });
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedido | null>(null);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmText: '',
  });

  useEffect(() => {
    if (user) {
      const usuarioCompleto = obtenerUsuarioPorId(user.id);
      if (usuarioCompleto) {
        setFormData({
          nombre: usuarioCompleto.nombre,
          apellido: usuarioCompleto.apellido || '',
          email: usuarioCompleto.email,
          telefono: usuarioCompleto.telefono || '',
          direccion: usuarioCompleto.direccion || '',
          avatar: usuarioCompleto.avatar || '',
        });
        setAvatarPreview(usuarioCompleto.avatar || '');
      }
      
      // Cargar pedidos del usuario
      const pedidosUsuario = obtenerPedidosUsuario(user.email);
      setPedidos(pedidosUsuario.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validación especial para teléfono chileno
    if (name === 'telefono') {
      // Remover todo excepto números
      const numeros = value.replace(/\D/g, '');
      
      // Si empieza con 56, lo removemos (asumimos que siempre es +56)
      const numerosSin56 = numeros.startsWith('56') ? numeros.substring(2) : numeros;
      
      // Limitar a 9 dígitos
      const numerosLimitados = numerosSin56.substring(0, 9);
      
      // Formatear el número
      let numeroFormateado = '';
      if (numerosLimitados.length > 0) {
        numeroFormateado = '+56';
        if (numerosLimitados.length > 0) {
          numeroFormateado += ' ' + numerosLimitados.substring(0, 1);
        }
        if (numerosLimitados.length > 1) {
          numeroFormateado += ' ' + numerosLimitados.substring(1, 5);
        }
        if (numerosLimitados.length > 5) {
          numeroFormateado += ' ' + numerosLimitados.substring(5, 9);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: numeroFormateado
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const resultado = actualizarUsuario(user.id, {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      direccion: formData.direccion,
    });

    if (resultado) {
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      setEditMode(false);
      checkAuth(); // Actualizar datos en el store
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (passwordData.passwordNueva !== passwordData.confirmarPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordData.passwordNueva.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    const exito = cambiarPassword(user.id, passwordData.passwordActual, passwordData.passwordNueva);

    if (exito) {
      setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
      setShowPasswordChange(false);
      setPasswordData({ passwordActual: '', passwordNueva: '', confirmarPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: 'La contraseña actual es incorrecta' });
    }
  };

  const getEstadoBadgeClass = (estado: IPedido['estado']) => {
    switch (estado) {
      case 'confirmado':
        return 'bg-info';
      case 'en-preparacion':
        return 'bg-warning';
      case 'enviado':
        return 'bg-primary';
      case 'entregado':
        return 'bg-success';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  const getEstadoTexto = (estado: IPedido['estado']) => {
    switch (estado) {
      case 'confirmado':
        return 'Confirmado';
      case 'en-preparacion':
        return 'En Preparación';
      case 'enviado':
        return 'Enviado';
      case 'entregado':
        return 'Entregado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const getEstadoIcono = (estado: IPedido['estado']) => {
    switch (estado) {
      case 'confirmado':
        return 'fa-check-circle';
      case 'en-preparacion':
        return 'fa-clock';
      case 'enviado':
        return 'fa-shipping-fast';
      case 'entregado':
        return 'fa-check-double';
      case 'cancelado':
        return 'fa-times-circle';
      default:
        return 'fa-question-circle';
    }
  };

  const abrirDetallesPedido = (pedido: IPedido) => {
    setPedidoSeleccionado(pedido);
    setShowPedidoModal(true);
  };

  const verBoleta = (pedidoId: string) => {
    navigate(`/boleta/${pedidoId}`);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo de imagen válido' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Validar tamaño (máximo 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'La imagen es muy grande. Máximo 2MB' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Convertir a Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Error al cargar la imagen' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };
    reader.readAsDataURL(file);
  };

  const guardarAvatar = () => {
    if (!user || !avatarPreview) return;

    const resultado = actualizarUsuario(user.id, {
      avatar: avatarPreview,
    });

    if (resultado) {
      setFormData({ ...formData, avatar: avatarPreview });
      setMessage({ type: 'success', text: 'Foto de perfil actualizada correctamente' });
      setShowAvatarModal(false);
      checkAuth();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: 'Error al actualizar la foto de perfil' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const eliminarAvatar = () => {
    if (!user) return;

    const resultado = actualizarUsuario(user.id, {
      avatar: '',
    });

    if (resultado) {
      setFormData({ ...formData, avatar: '' });
      setAvatarPreview('');
      setMessage({ type: 'success', text: 'Foto de perfil eliminada' });
      setShowAvatarModal(false);
      checkAuth();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    // Validar que escribió "Confirmo"
    if (deleteData.confirmText !== 'Confirmo') {
      setMessage({ type: 'error', text: 'Debes escribir "Confirmo" para eliminar tu cuenta' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Validar que la contraseña no esté vacía
    if (!deleteData.password) {
      setMessage({ type: 'error', text: 'Debes ingresar tu contraseña' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Intentar eliminar la cuenta
    const exito = eliminarCuentaConConfirmacion(user.id, deleteData.password);

    if (exito) {
      setMessage({ type: 'success', text: 'Tu cuenta ha sido eliminada exitosamente' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setMessage({ type: 'error', text: 'Contraseña incorrecta. No se pudo eliminar la cuenta' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="perfil-page py-5" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Header */}
            <div className="text-center mb-4 position-relative">
              <div className="position-relative d-inline-block mb-3">
                {formData.avatar || user?.avatar ? (
                  <img 
                    src={formData.avatar || user?.avatar || ''} 
                    alt="Avatar" 
                    className="rounded-circle border border-3 border-success"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowAvatarModal(true)}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center border border-3 border-success"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      fontSize: '3rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowAvatarModal(true)}
                  >
                    {user?.nombre?.charAt(0).toUpperCase()}
                  </div>
                )}
                <button 
                  className="btn btn-success btn-sm rounded-circle position-absolute"
                  style={{ bottom: '0', right: '0', width: '40px', height: '40px' }}
                  onClick={() => setShowAvatarModal(true)}
                  title="Cambiar foto"
                >
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <h2>{user?.nombre} {user?.apellido}</h2>
              <p className="text-muted">{user?.email}</p>
              <span className={`badge ${user?.rol === 'administrador' ? 'bg-danger' : 'bg-primary'}`}>
                {user?.rol}
              </span>
            </div>

            {/* Mensajes Toast Mejorados */}
            {message.text && (
              <div 
                className="position-fixed top-0 end-0 p-3" 
                style={{ zIndex: 9999, marginTop: '80px' }}
              >
                <div 
                  className={`toast show align-items-center border-0 shadow-lg`}
                  style={{ 
                    minWidth: '350px',
                    backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                    borderLeft: `4px solid ${message.type === 'success' ? '#28a745' : '#dc3545'}`
                  }}
                >
                  <div className="d-flex">
                    <div className="toast-body d-flex align-items-center">
                      <i 
                        className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} fa-2x me-3`}
                        style={{ color: message.type === 'success' ? '#28a745' : '#dc3545' }}
                      ></i>
                      <div className="flex-grow-1">
                        <strong className={message.type === 'success' ? 'text-success' : 'text-danger'}>
                          {message.type === 'success' ? '¡Éxito!' : 'Error'}
                        </strong>
                        <p className="mb-0 mt-1" style={{ color: '#333' }}>{message.text}</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn-close me-2 m-auto" 
                      onClick={() => setMessage({ type: '', text: '' })}
                    ></button>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs de Navegación */}
            <ul className="nav nav-pills nav-fill mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'info' ? 'active bg-success' : 'text-dark'}`}
                  onClick={() => setActiveTab('info')}
                  style={activeTab !== 'info' ? { backgroundColor: '#f8f9fa' } : {}}
                >
                  <i className="fas fa-user me-2"></i>Información Personal
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'pedidos' ? 'active bg-success' : 'text-dark'}`}
                  onClick={() => setActiveTab('pedidos')}
                  style={activeTab !== 'pedidos' ? { backgroundColor: '#f8f9fa' } : {}}
                >
                  <i className="fas fa-shopping-bag me-2"></i>Mis Pedidos
                  {pedidos.length > 0 && (
                    <span className="badge bg-danger ms-2">{pedidos.length}</span>
                  )}
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'seguridad' ? 'active bg-success' : 'text-dark'}`}
                  onClick={() => setActiveTab('seguridad')}
                  style={activeTab !== 'seguridad' ? { backgroundColor: '#f8f9fa' } : {}}
                >
                  <i className="fas fa-lock me-2"></i>Seguridad
                </button>
              </li>
            </ul>

            {/* Tab: Información Personal */}
            {activeTab === 'info' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-user me-2 text-success"></i>
                    Información Personal
                  </h5>
                  {!editMode && (
                    <button 
                      onClick={() => setEditMode(true)} 
                      className="btn btn-sm btn-outline-success"
                    >
                      <i className="fas fa-edit me-1"></i>Editar
                    </button>
                  )}
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-user me-1 text-success"></i>Nombre
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          className="form-control"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-user me-1 text-success"></i>Apellido
                        </label>
                        <input
                          type="text"
                          name="apellido"
                          className="form-control"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          disabled={!editMode}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          <i className="fas fa-envelope me-1 text-success"></i>Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          disabled
                        />
                        <small className="text-muted">El email no se puede modificar</small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-phone me-1 text-success"></i>Teléfono
                        </label>
                        <input
                          type="tel"
                          name="telefono"
                          className="form-control"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="+56 9 1234 5678"
                          maxLength={17}
                        />
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Formato chileno: +56 9 XXXX XXXX (máximo 9 dígitos)
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="fas fa-calendar me-1 text-success"></i>Miembro desde
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={user?.fechaLogin ? new Date(user.fechaLogin).toLocaleDateString('es-CL') : 'N/A'}
                          disabled
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">
                          <i className="fas fa-map-marker-alt me-1 text-success"></i>Dirección
                        </label>
                        <textarea
                          name="direccion"
                          className="form-control"
                          rows={2}
                          value={formData.direccion}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="Calle, número, comuna, región"
                        />
                      </div>
                    </div>

                    {editMode && (
                      <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-success">
                          <i className="fas fa-save me-1"></i>Guardar Cambios
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setEditMode(false)} 
                          className="btn btn-secondary"
                        >
                          <i className="fas fa-times me-1"></i>Cancelar
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* Tab: Mis Pedidos */}
            {activeTab === 'pedidos' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">
                    <i className="fas fa-shopping-bag me-2 text-success"></i>
                    Mis Pedidos ({pedidos.length})
                  </h5>
                </div>
                <div className="card-body">
                  {pedidos.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                      <h5 className="text-muted">No tienes pedidos aún</h5>
                      <p className="text-muted mb-4">
                        Cuando realices una compra, podrás ver tus pedidos aquí
                      </p>
                      <button 
                        onClick={() => navigate('/catalogo')} 
                        className="btn btn-success"
                      >
                        <i className="fas fa-shopping-cart me-2"></i>Ir al Catálogo
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>ID Pedido</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Artículos</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedidos.map((pedido) => (
                            <tr key={pedido.id}>
                              <td>
                                <strong className="text-primary">{pedido.id}</strong>
                              </td>
                              <td>
                                <i className="fas fa-calendar-alt me-2 text-muted"></i>
                                {new Date(pedido.fecha).toLocaleDateString('es-CL', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td>
                                <strong className="text-success">
                                  ${pedido.total.toLocaleString('es-CL')}
                                </strong>
                              </td>
                              <td>
                                <span className={`badge ${getEstadoBadgeClass(pedido.estado)}`}>
                                  <i className={`fas ${getEstadoIcono(pedido.estado)} me-1`}></i>
                                  {getEstadoTexto(pedido.estado)}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-secondary">
                                  {pedido.items.reduce((sum, item) => sum + item.cantidad, 0)} items
                                </span>
                              </td>
                              <td className="text-center">
                                <button 
                                  onClick={() => abrirDetallesPedido(pedido)}
                                  className="btn btn-sm btn-outline-info me-2"
                                  title="Ver detalles"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Seguridad */}
            {activeTab === 'seguridad' && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="fas fa-lock me-2 text-warning"></i>
                    Seguridad
                  </h5>
                  {!showPasswordChange && (
                    <button 
                      onClick={() => setShowPasswordChange(true)} 
                      className="btn btn-sm btn-outline-warning"
                    >
                      <i className="fas fa-key me-1"></i>Cambiar Contraseña
                    </button>
                  )}
                </div>
                {showPasswordChange ? (
                  <div className="card-body">
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Contraseña Actual</label>
                          <input
                            type="password"
                            name="passwordActual"
                            className="form-control"
                            value={passwordData.passwordActual}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Nueva Contraseña</label>
                          <input
                            type="password"
                            name="passwordNueva"
                            className="form-control"
                            value={passwordData.passwordNueva}
                            onChange={handlePasswordChange}
                            required
                            minLength={6}
                          />
                          <small className="text-muted">Mínimo 6 caracteres</small>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Confirmar Nueva Contraseña</label>
                          <input
                            type="password"
                            name="confirmarPassword"
                            className="form-control"
                            value={passwordData.confirmarPassword}
                            onChange={handlePasswordChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <button type="submit" className="btn btn-warning">
                          <i className="fas fa-save me-1"></i>Cambiar Contraseña
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordData({ passwordActual: '', passwordNueva: '', confirmarPassword: '' });
                          }} 
                          className="btn btn-secondary"
                        >
                          <i className="fas fa-times me-1"></i>Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="card-body">
                    <div className="alert alert-info mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Haz clic en "Cambiar Contraseña" para actualizar tu contraseña de acceso.
                    </div>

                    {/* Zona de peligro - Eliminar cuenta */}
                    <div className="border border-danger rounded p-3 mt-4">
                      <h6 className="text-danger mb-3">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Zona de Peligro
                      </h6>
                      <p className="text-muted small mb-3">
                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de esto.
                      </p>
                      <button 
                        className="btn btn-danger"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        <i className="fas fa-trash-alt me-2"></i>
                        Eliminar mi cuenta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles del Pedido */}
      {showPedidoModal && pedidoSeleccionado && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Detalles del Pedido
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowPedidoModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Información General */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong><i className="fas fa-hashtag me-2 text-primary"></i>ID:</strong> 
                      <span className="ms-2">{pedidoSeleccionado.id}</span>
                    </p>
                    <p className="mb-2">
                      <strong><i className="fas fa-calendar me-2 text-info"></i>Fecha:</strong> 
                      <span className="ms-2">
                        {new Date(pedidoSeleccionado.fecha).toLocaleString('es-CL')}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong><i className="fas fa-clipboard-check me-2 text-warning"></i>Estado:</strong> 
                      <span className={`badge ${getEstadoBadgeClass(pedidoSeleccionado.estado)} ms-2`}>
                        <i className={`fas ${getEstadoIcono(pedidoSeleccionado.estado)} me-1`}></i>
                        {getEstadoTexto(pedidoSeleccionado.estado)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Productos */}
                <h6 className="border-bottom pb-2 mb-3">
                  <i className="fas fa-box me-2 text-success"></i>Productos
                </h6>
                <div className="table-responsive mb-4">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-end">Precio Unit.</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidoSeleccionado.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nombre}</td>
                          <td className="text-center">
                            <span className="badge bg-secondary">{item.cantidad}</span>
                          </td>
                          <td className="text-end">${item.precio.toLocaleString('es-CL')}</td>
                          <td className="text-end">
                            <strong>${item.subtotal.toLocaleString('es-CL')}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Información de Envío */}
                <h6 className="border-bottom pb-2 mb-3">
                  <i className="fas fa-shipping-fast me-2 text-primary"></i>Información de Envío
                </h6>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Dirección:</strong><br />
                      {pedidoSeleccionado.envio.direccion}
                    </p>
                    <p className="mb-2">
                      <strong>Ciudad:</strong> {pedidoSeleccionado.envio.ciudad}
                    </p>
                    <p className="mb-2">
                      <strong>Región:</strong> {pedidoSeleccionado.envio.region}
                    </p>
                  </div>
                  <div className="col-md-6">
                    {pedidoSeleccionado.envio.notas && (
                      <p className="mb-2">
                        <strong>Notas:</strong><br />
                        <span className="text-muted">{pedidoSeleccionado.envio.notas}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Totales */}
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>${pedidoSeleccionado.subtotal.toLocaleString('es-CL')}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Costo de Envío:</span>
                    {pedidoSeleccionado.envio.esGratis ? (
                      <span className="text-success">
                        <strong>¡GRATIS!</strong>
                      </span>
                    ) : (
                      <strong>${pedidoSeleccionado.costoEnvio.toLocaleString('es-CL')}</strong>
                    )}
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2 mt-2">
                    <h5 className="mb-0">Total:</h5>
                    <h5 className="mb-0 text-success">
                      ${pedidoSeleccionado.total.toLocaleString('es-CL')}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  onClick={() => verBoleta(pedidoSeleccionado.id)}
                  className="btn btn-success"
                >
                  <i className="fas fa-receipt me-2"></i>Ver Boleta
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowPedidoModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cambiar Foto de Perfil */}
      {showAvatarModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title text-white">
                  <i className="fas fa-camera me-2"></i>
                  Foto de Perfil
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowAvatarModal(false);
                    setAvatarPreview(formData.avatar);
                  }}
                ></button>
              </div>
              <div className="modal-body text-center">
                {/* Preview de la foto */}
                <div className="mb-4">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Preview" 
                      className="rounded-circle border border-3 border-success mb-3"
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-secondary text-white d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        fontSize: '4rem'
                      }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>

                {/* Botón para subir archivo */}
                <div className="mb-3">
                  <label htmlFor="avatar-upload" className="btn btn-success w-100">
                    <i className="fas fa-upload me-2"></i>
                    Seleccionar Foto
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleAvatarFile}
                  />
                  <small className="text-muted d-block mt-2">
                    <i className="fas fa-info-circle me-1"></i>
                    Tamaño máximo: 2MB. Formatos: JPG, PNG, GIF
                  </small>
                </div>

                {/* Botón para eliminar foto */}
                {avatarPreview && (
                  <button 
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={eliminarAvatar}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Eliminar Foto
                  </button>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowAvatarModal(false);
                    setAvatarPreview(formData.avatar);
                  }}
                >
                  Cancelar
                </button>
                {avatarPreview && avatarPreview !== formData.avatar && (
                  <button 
                    type="button" 
                    className="btn btn-success" 
                    onClick={guardarAvatar}
                  >
                    <i className="fas fa-save me-2"></i>
                    Guardar Foto
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Eliminar Cuenta */}
      {showDeleteModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title text-white">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Eliminar Cuenta
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteData({ password: '', confirmText: '' });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-danger" role="alert">
                  <h6 className="alert-heading">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    ¡Advertencia! Esta acción es irreversible
                  </h6>
                  <hr />
                  <p className="mb-0">
                    Al eliminar tu cuenta:
                  </p>
                  <ul className="mt-2 mb-0">
                    <li>Perderás acceso a todos tus datos</li>
                    <li>Se eliminarán tus pedidos históricos</li>
                    <li>No podrás recuperar tu información</li>
                  </ul>
                </div>

                <form onSubmit={handleDeleteAccount}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="fas fa-lock me-2 text-danger"></i>
                      Ingresa tu contraseña *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={deleteData.password}
                      onChange={(e) => setDeleteData({ ...deleteData, password: e.target.value })}
                      placeholder="Tu contraseña actual"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="fas fa-keyboard me-2 text-danger"></i>
                      Escribe "Confirmo" para continuar *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={deleteData.confirmText}
                      onChange={(e) => setDeleteData({ ...deleteData, confirmText: e.target.value })}
                      placeholder="Confirmo"
                      required
                    />
                    <small className="text-muted">
                      Debes escribir exactamente: <strong>Confirmo</strong>
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-danger"
                      disabled={deleteData.confirmText !== 'Confirmo' || !deleteData.password}
                    >
                      <i className="fas fa-trash-alt me-2"></i>
                      Sí, eliminar mi cuenta permanentemente
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteData({ password: '', confirmText: '' });
                      }}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
