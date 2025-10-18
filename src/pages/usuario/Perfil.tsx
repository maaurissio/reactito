import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { actualizarUsuario, cambiarPassword, obtenerUsuarioPorId } from '../../services/usuariosService';
import { Navigate } from 'react-router-dom';

export const Perfil = () => {
  const { user, isAuthenticated, checkAuth } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
  });
  const [passwordData, setPasswordData] = useState({
    passwordActual: '',
    passwordNueva: '',
    confirmarPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordChange, setShowPasswordChange] = useState(false);

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
        });
      }
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
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

  return (
    <div className="perfil-page py-5" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
                {user?.nombre?.charAt(0).toUpperCase()}
              </div>
              <h2>{user?.nombre} {user?.apellido}</h2>
              <p className="text-muted">{user?.email}</p>
              <span className={`badge ${user?.rol === 'administrador' ? 'bg-danger' : 'bg-primary'}`}>
                {user?.rol}
              </span>
            </div>

            {/* Mensajes */}
            {message.text && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
                <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
              </div>
            )}

            {/* Información Personal */}
            <div className="card border-0 shadow-sm mb-4">
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
                      />
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

            {/* Cambiar Contraseña */}
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
              {showPasswordChange && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
