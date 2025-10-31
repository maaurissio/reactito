import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { solicitarRecuperacionPassword, verificarCodigoRecuperacion, restablecerPassword } from '../../services/usuariosService';

enum Paso {
  EMAIL = 1,
  CODIGO = 2,
  NUEVA_PASSWORD = 3,
  EXITO = 4
}

export const RecuperarPassword = () => {
  const [paso, setPaso] = useState<Paso>(Paso.EMAIL);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState(''); // Solo para desarrollo
  
  const navigate = useNavigate();

  const handleSolicitarCodigo = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const resultado = solicitarRecuperacionPassword(email);
      
      if (resultado.success) {
        setCodigoGenerado(resultado.codigo || ''); // Solo para desarrollo
        setPaso(Paso.CODIGO);
      } else {
        setError(resultado.mensaje);
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificarCodigo = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const valido = verificarCodigoRecuperacion(email, codigo);
      
      if (valido) {
        setPaso(Paso.NUEVA_PASSWORD);
      } else {
        setError('Código inválido o expirado');
      }
    } catch (err) {
      setError('Error al verificar el código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestablecerPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const exito = restablecerPassword(email, codigo, nuevaPassword);
      
      if (exito) {
        setPaso(Paso.EXITO);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Error al restablecer la contraseña');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasoEmail = () => (
    <form onSubmit={handleSolicitarCodigo}>
      <div className="mb-4">
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

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-lg w-100 mb-3"
        style={{ background: 'var(--green-primary)', color: 'white', border: 'none' }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin me-2"></i>Enviando...
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane me-2"></i>Enviar Código
          </>
        )}
      </button>

      <div className="text-center">
        <Link to="/login" className="text-decoration-none small">
          <i className="fas fa-arrow-left me-1"></i>Volver al inicio de sesión
        </Link>
      </div>
    </form>
  );

  const renderPasoCodigo = () => (
    <form onSubmit={handleVerificarCodigo}>
      <div className="alert mb-4" style={{ background: 'rgba(52, 199, 89, 0.1)', border: '1px solid rgba(52, 199, 89, 0.2)', color: '#1d1d1f' }}>
        <i className="fas fa-info-circle me-2" style={{ color: 'var(--green-primary)' }}></i>
        Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
        {codigoGenerado && (
          <div className="mt-3 p-3 text-center" style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: '2px dashed var(--green-primary)' }}>
            <small style={{ color: '#6e6e73', display: 'block', marginBottom: '8px' }}>
              <strong>Código de desarrollo:</strong>
            </small>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '0.5rem', color: 'var(--green-primary)', fontFamily: 'monospace' }}>
              {codigoGenerado}
            </div>
            <small style={{ color: '#86868b', display: 'block', marginTop: '8px' }}>
              Copia este código para pruebas
            </small>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="input-icon-container">
          <input 
            type="text" 
            className="form-control form-control-lg text-center" 
            placeholder="000000" 
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            required
            disabled={isLoading}
            style={{ 
              letterSpacing: '0.8rem', 
              fontSize: '1.8rem', 
              fontWeight: 'bold',
              fontFamily: 'monospace',
              padding: '1rem',
              background: 'rgba(245, 247, 250, 0.5)',
              border: '2px solid #d1d1d6',
              borderRadius: '12px'
            }}
          />
          <i className="fas fa-shield-alt input-icon" style={{ fontSize: '1.2rem' }}></i>
        </div>
        <small className="text-muted d-block text-center mt-2">
          <i className="fas fa-clock me-1"></i>El código expira en 15 minutos
        </small>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-lg w-100 mb-3"
        style={{ background: 'var(--green-primary)', color: 'white', border: 'none' }}
        disabled={isLoading || codigo.length !== 6}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin me-2"></i>Verificando...
          </>
        ) : (
          <>
            <i className="fas fa-check me-2"></i>Verificar Código
          </>
        )}
      </button>

      <div className="text-center">
        <button 
          type="button"
          onClick={() => {
            setPaso(Paso.EMAIL);
            setCodigo('');
            setError('');
          }}
          className="btn btn-link text-decoration-none small"
        >
          <i className="fas fa-arrow-left me-1"></i>Cambiar correo
        </button>
      </div>
    </form>
  );

  const renderPasoNuevaPassword = () => (
    <form onSubmit={handleRestablecerPassword}>
      <div className="mb-3">
        <div className="input-icon-container">
          <input 
            type="password" 
            className="form-control form-control-lg" 
            placeholder="Nueva Contraseña" 
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
          <i className="fas fa-lock input-icon"></i>
        </div>
        <small className="text-muted">Mínimo 6 caracteres</small>
      </div>

      <div className="mb-4">
        <div className="input-icon-container">
          <input 
            type="password" 
            className="form-control form-control-lg" 
            placeholder="Confirmar Contraseña" 
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={6}
          />
          <i className="fas fa-lock input-icon"></i>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-lg w-100 mb-3"
        style={{ background: 'var(--green-primary)', color: 'white', border: 'none' }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin me-2"></i>Restableciendo...
          </>
        ) : (
          <>
            <i className="fas fa-key me-2"></i>Restablecer Contraseña
          </>
        )}
      </button>
    </form>
  );

  const renderPasoExito = () => (
    <div className="text-center">
      <div className="mb-4">
        <div 
          className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
          style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(52, 199, 89, 0.1)',
            color: 'var(--green-primary)'
          }}
        >
          <i className="fas fa-check-circle" style={{ fontSize: '3rem' }}></i>
        </div>
        <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#1d1d1f' }}>
          ¡Contraseña Restablecida!
        </h3>
        <p className="text-muted mb-4">
          Tu contraseña ha sido actualizada exitosamente.
        </p>
        <p className="text-muted">
          Redirigiendo al inicio de sesión...
        </p>
      </div>
    </div>
  );

  const getTitulo = () => {
    switch (paso) {
      case Paso.EMAIL:
        return '¿Olvidaste tu contraseña?';
      case Paso.CODIGO:
        return 'Verifica tu código';
      case Paso.NUEVA_PASSWORD:
        return 'Nueva contraseña';
      case Paso.EXITO:
        return '¡Listo!';
      default:
        return '';
    }
  };

  const getSubtitulo = () => {
    switch (paso) {
      case Paso.EMAIL:
        return 'Ingresa tu correo electrónico para recibir un código de recuperación';
      case Paso.CODIGO:
        return 'Ingresa el código de 6 dígitos que te enviamos';
      case Paso.NUEVA_PASSWORD:
        return 'Crea una nueva contraseña segura';
      default:
        return '';
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-5">
                {/* Header con iconos de progreso */}
                {paso !== Paso.EXITO && (
                  <div className="mb-4">
                    <div className="d-flex justify-content-center align-items-center mb-4">
                      <div className="d-flex align-items-center">
                        <div 
                          className={`rounded-circle d-flex align-items-center justify-content-center ${paso >= Paso.EMAIL ? 'bg-success text-white' : 'bg-light text-muted'}`}
                          style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}
                        >
                          {paso > Paso.EMAIL ? <i className="fas fa-check"></i> : '1'}
                        </div>
                        <div style={{ width: '60px', height: '2px', background: paso >= Paso.CODIGO ? 'var(--green-primary)' : '#dee2e6' }}></div>
                        <div 
                          className={`rounded-circle d-flex align-items-center justify-content-center ${paso >= Paso.CODIGO ? 'bg-success text-white' : 'bg-light text-muted'}`}
                          style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}
                        >
                          {paso > Paso.CODIGO ? <i className="fas fa-check"></i> : '2'}
                        </div>
                        <div style={{ width: '60px', height: '2px', background: paso >= Paso.NUEVA_PASSWORD ? 'var(--green-primary)' : '#dee2e6' }}></div>
                        <div 
                          className={`rounded-circle d-flex align-items-center justify-content-center ${paso >= Paso.NUEVA_PASSWORD ? 'bg-success text-white' : 'bg-light text-muted'}`}
                          style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}
                        >
                          {paso > Paso.NUEVA_PASSWORD ? <i className="fas fa-check"></i> : '3'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Título */}
                <div className="text-center mb-4">
                  <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#1d1d1f' }} className="mb-2">
                    {getTitulo()}
                  </h2>
                  {getSubtitulo() && (
                    <p className="text-muted">{getSubtitulo()}</p>
                  )}
                </div>

                {/* Renderizar paso actual */}
                {paso === Paso.EMAIL && renderPasoEmail()}
                {paso === Paso.CODIGO && renderPasoCodigo()}
                {paso === Paso.NUEVA_PASSWORD && renderPasoNuevaPassword()}
                {paso === Paso.EXITO && renderPasoExito()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
