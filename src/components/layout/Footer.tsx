import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4">
            <h3>
              <i className="fas fa-leaf me-2"></i>
              HuertoHogar
            </h3>
            <p>Productos frescos del campo a tu hogar</p>
            <p className="mb-0">
              <i className="fas fa-award me-2"></i>
              Más de 6 años de experiencia
            </p>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h4>Enlaces Rápidos</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="/">
                  <i className="fas fa-chevron-right me-2"></i>
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/catalogo">
                  <i className="fas fa-chevron-right me-2"></i>
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/nosotros">
                  <i className="fas fa-chevron-right me-2"></i>
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h4>Información</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="/terminos">
                  <i className="fas fa-chevron-right me-2"></i>
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad">
                  <i className="fas fa-chevron-right me-2"></i>
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies">
                  <i className="fas fa-chevron-right me-2"></i>
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h4>Contacto</h4>
            <p>
              <i className="fas fa-envelope me-2"></i>
              info@huertohogar.cl
            </p>
            <p>
              <i className="fas fa-phone me-2"></i>
              +56 9 1234 5678
            </p>
            <p>
              <i className="fas fa-map-marker-alt me-2"></i>
              Santiago, Chile
            </p>
            <div className="mt-3">
              <a href="#" className="text-white me-3">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-white me-3">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="bg-white opacity-25" />

        <div className="row">
          <div className="col-12 text-center py-3">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} HuertoHogar. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
