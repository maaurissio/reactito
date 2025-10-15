import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    emailOUsuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(formData.emailOUsuario, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="login-page min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <div className="card login-card shadow-lg">
              <div className="row g-0">
                {/* Lado izquierdo con imagen */}
                <div className="col-lg-6 d-none d-lg-block">
                  <div className="login-image-side h-100 position-relative">
                    <div className="login-image-overlay">
                      <div className="text-white text-center p-4">
                        <i className="fas fa-leaf fa-4x mb-3"></i>
                        <h2 className="fw-bold">HuertoHogar</h2>
                        <p className="lead">
                          Productos frescos del campo a tu hogar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lado derecho con formulario */}
                <div className="col-lg-6">
                  <div className="card-body p-5">
                    <div className="text-center mb-4">
                      <h3 className="fw-bold text-success">Iniciar Sesión</h3>
                      <p className="text-muted">Bienvenido de vuelta</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          <i className="fas fa-exclamation-circle me-2"></i>
                          {error}
                        </div>
                      )}

                      <div className="mb-3">
                        <label htmlFor="emailOUsuario" className="form-label">
                          Email o Usuario
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fas fa-user"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            id="emailOUsuario"
                            name="emailOUsuario"
                            value={formData.emailOUsuario}
                            onChange={handleChange}
                            placeholder="tu@email.com o usuario"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="password" className="form-label">
                          Contraseña
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="fas fa-lock"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>

                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className="btn btn-success btn-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Iniciando sesión...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-sign-in-alt me-2"></i>
                              Iniciar Sesión
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center">
                        <p className="text-muted mb-0">
                          ¿No tienes cuenta?{' '}
                          <Link to="/auth/registro" className="text-success fw-semibold">
                            Regístrate aquí
                          </Link>
                        </p>
                      </div>
                    </form>

                    {/* Credenciales de prueba */}
                    <div className="demo-credentials mt-4">
                      <p className="demo-title text-center">
                        <i className="fas fa-info-circle me-2"></i>
                        Credenciales de prueba:
                      </p>
                      <hr />
                      <p className="mb-1">
                        <strong>Admin:</strong> admin@huertohogar.com / admin123
                      </p>
                      <p className="mb-0">
                        <strong>Cliente:</strong> cliente@demo.com / cliente123
                      </p>
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
