import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

export const Registro = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [buttonClass, setButtonClass] = useState('btn-secondary');
  const [isFilling, setIsFilling] = useState(false);
  
  const { register } = useAuthStore();
  const navigate = useNavigate();

  // Validar checkbox y animar botón
  useEffect(() => {
    if (acceptPolicies) {
      setIsFilling(true);
      
      // Después de la animación, habilitar el botón
      setTimeout(() => {
        setButtonClass('btn-success');
        setIsFilling(false);
      }, 500);
    } else {
      setButtonClass('btn-secondary');
      setIsFilling(false);
    }
  }, [acceptPolicies]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setSuccess(false);

    // Validar que se acepten las políticas
    if (!acceptPolicies) {
      setError('Debes aceptar los términos y condiciones para crear una cuenta.');
      setIsLoading(false);
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    try {
      const resultado = await register(email, password, fullName);
      
      if (resultado) {
        setSuccess(true);
        // Redirigir después de un momento
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Error al crear la cuenta. El correo ya está registrado.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Formulario izquierda */}
                <div className="col-md-6 d-flex align-items-center">
                  <div className="w-100 p-5">
                    <div className="text-center mb-4">
                      <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-success mb-2">
                        Crear Cuenta
                      </h2>
                      <p className="text-muted">Únete a la comunidad de Huerto Hogar</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={() => setError('')}
                          aria-label="Close"
                        ></button>
                      </div>
                    )}

                    {success && (
                      <div className="alert alert-success" role="alert">
                        <i className="fas fa-check-circle me-2"></i>
                        ¡Cuenta creada exitosamente! Redirigiendo...
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <div className="input-icon-container">
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder="Nombre Completo" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          <i className="fas fa-user input-icon"></i>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="input-icon-container">
                          <input 
                            type="email" 
                            className="form-control form-control-lg" 
                            placeholder="Correo Electrónico" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          <i className="fas fa-envelope input-icon"></i>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="input-icon-container">
                          <input 
                            type="password" 
                            className="form-control form-control-lg" 
                            placeholder="Contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          <i className="fas fa-lock input-icon"></i>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="input-icon-container">
                          <input 
                            type="password" 
                            className="form-control form-control-lg" 
                            placeholder="Confirmar Contraseña" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                          />
                          <i className="fas fa-lock input-icon"></i>
                        </div>
                      </div>

                      <div className="mb-3 form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          id="acceptPolicies"
                          checked={acceptPolicies}
                          onChange={(e) => setAcceptPolicies(e.target.checked)}
                          required
                          disabled={isLoading}
                        />
                        <label className="form-check-label" htmlFor="acceptPolicies">
                          Acepto los{' '}
                          <Link to="/terminos" className="text-success text-decoration-none">
                            términos y condiciones
                          </Link>
                          {' '}y las{' '}
                          <Link to="/privacidad" className="text-success text-decoration-none">
                            políticas de privacidad
                          </Link>
                        </label>
                      </div>

                      <button 
                        type="submit" 
                        className={`btn btn-lg w-100 mb-3 ${buttonClass} ${isFilling ? 'filling' : ''}`}
                        disabled={!acceptPolicies || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Creando cuenta...
                          </>
                        ) : success ? (
                          <>
                            <i className="fas fa-check"></i> ¡Cuenta creada!
                          </>
                        ) : (
                          <span className="btn-text">Crear Cuenta</span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Imagen derecha como fondo completo */}
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
                        ¡Únete Hoy!
                      </h3>
                      <p className="mb-0" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                        Productos frescos y naturales
                      </p>
                    </div>
                    
                    {/* Botón alineado con el botón del formulario */}
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                      <p className="text-white mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                        ¿Ya tienes cuenta?
                      </p>
                      <Link to="/login" className="text-white text-decoration-none simple-link">
                        Inicia sesión
                      </Link>
                    </div>
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
