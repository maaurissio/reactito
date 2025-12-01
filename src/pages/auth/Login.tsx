import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setSuccess(false);

    try {
      const resultado = await login(email, password);
      
      if (resultado.success) {
        setSuccess(true);
        // Redirigir después de un momento
        setTimeout(() => {
          const paginaOrigen = localStorage.getItem('paginaOrigen');
          if (paginaOrigen && paginaOrigen !== '/login') {
            localStorage.removeItem('paginaOrigen');
            navigate(paginaOrigen);
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        // Determinar el mensaje de error según el tipo
        let mensajeError = '';
        switch (resultado.error) {
          case 'CUENTA_INEXISTENTE':
            mensajeError = 'El usuario o correo no existe';
            break;
          case 'CREDENCIALES_INCORRECTAS':
            mensajeError = 'Contraseña incorrecta';
            break;
          case 'CUENTA_INACTIVA':
            mensajeError = 'Tu cuenta está desactivada';
            break;
          default:
            mensajeError = 'Error al iniciar sesión';
        }
        
        setError(mensajeError);
        setIsLoading(false);
        
        // Auto-actualizar el mensaje después de 3 segundos
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      setIsLoading(false);
      
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Imagen izquierda como fondo completo */}
                <div 
                  className="col-md-6 position-relative" 
                  style={{
                    backgroundImage: 'url(\'/img/huerto.webp\')',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '500px'
                  }}
                >
                  {/* Overlay sutil */}
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column p-4" 
                    style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4))' }}
                  >
                    {/* Contenido central */}
                    <div className="d-flex flex-column justify-content-center flex-grow-1 text-center text-white">
                      <h3 className="fw-bold" style={{ fontFamily: "'Playfair Display', serif", textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                        ¡Productos Frescos!
                      </h3>
                      <p className="mb-0" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                        Directo del huerto a tu hogar
                      </p>
                    </div>
                    
                    {/* Botón alineado con el botón del formulario */}
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                      <p className="text-white mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                        ¿No tienes cuenta?
                      </p>
                      <Link 
                        to="/registro" 
                        className="text-white text-decoration-none simple-link"
                        onClick={() => localStorage.setItem('paginaOrigen', window.location.pathname)}
                      >
                        Regístrate aquí
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Formulario derecha */}
                <div className="col-md-6 d-flex align-items-center">
                  <div className="w-100 p-5">
                    <div className="text-center mb-4">
                      <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-success mb-2">
                        Iniciar Sesión
                      </h2>
                      <p className="text-muted">Accede a tu cuenta de Huerto Hogar</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <div className="input-icon-container">
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder="Usuario o Correo Electrónico" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          <i className="fas fa-user input-icon"></i>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="input-icon-container position-relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            className="form-control form-control-lg" 
                            placeholder="Contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            style={{ paddingRight: '80px' }}
                          />
                          <i className="fas fa-lock input-icon"></i>
                          <button
                            type="button"
                            className="btn btn-link position-absolute"
                            style={{
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#6c757d',
                              padding: '0.25rem 0.5rem',
                              zIndex: 10
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                          </button>
                        </div>
                      </div>

                      <div className="mb-3 form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          id="remember"
                          checked={remember}
                          onChange={(e) => setRemember(e.target.checked)}
                          disabled={isLoading}
                        />
                        <label className="form-check-label" htmlFor="remember">
                          Recordar mi sesión
                        </label>
                      </div>

                      <div className="mb-4">
                        <div className="text-center">
                          <Link to="/recuperar-password" className="text-decoration-none small">
                            ¿Olvidaste tu contraseña?
                          </Link>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-lg w-100 mb-3"
                        style={{ 
                          background: error ? '#ff3b30' : success ? 'var(--green-primary)' : 'var(--green-primary)',
                          color: 'white',
                          border: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Iniciando...
                          </>
                        ) : success ? (
                          <>
                            <i className="fas fa-check"></i> ¡Bienvenido!
                          </>
                        ) : error ? (
                          <>
                            <i className="fas fa-times"></i> {error}
                          </>
                        ) : (
                          'Iniciar Sesión'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
