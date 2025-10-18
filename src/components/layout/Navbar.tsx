import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-leaf me-2"></i>
          HuertoHogar
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="fas fa-home me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/catalogo" className="nav-link">
                <i className="fas fa-store me-1"></i>
                Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/nosotros" className="nav-link">
                <i className="fas fa-info-circle me-1"></i>
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className="nav-link">
                <i className="fas fa-blog me-1"></i>
                Blog
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="userDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user me-1"></i>
                    {user?.nombre}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link to="/perfil" className="dropdown-item">
                        <i className="fas fa-user-circle me-2"></i>
                        Mi Perfil
                      </Link>
                    </li>
                    {user?.rol === 'administrador' && (
                      <li>
                        <Link to="/admin/dashboard" className="dropdown-item">
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button onClick={logout} className="dropdown-item text-danger">
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Iniciar Sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/registro" className="btn btn-success ms-2">
                    <i className="fas fa-user-plus me-1"></i>
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
