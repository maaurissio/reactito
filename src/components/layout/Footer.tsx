import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row g-4">
          {/* Información de la empresa */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-seedling text-success me-2 fs-4"></i>
              <h5 className="mb-0 text-success fw-bold">HuertoHogar</h5>
            </div>
            <p className="text-light text-decoration-none footer-link mb-3">
              Conectamos el campo chileno con tu hogar. Productos frescos, naturales y de calidad directamente a tu mesa.
            </p>
            <div className="d-flex gap-3">
              <a href="https://www.facebook.com/huertohogar" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none social-link">
                <img src="/icons/facebook.svg" alt="Facebook" className="social-icon" />
              </a>
              <a href="https://www.instagram.com/huertohogar" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none social-link">
                <img src="/icons/instagram.svg" alt="Instagram" className="social-icon" />
              </a>
              <a href="https://x.com/huertohogar" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none social-link">
                <img src="/icons/twitter-alt.svg" alt="X (Twitter)" className="social-icon" />
              </a>
              <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none social-link">
                <img src="/icons/whatsapp.svg" alt="WhatsApp" className="social-icon" />
              </a>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-success mb-3">
              <i className="fas fa-link me-2"></i>Enlaces Útiles
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/nosotros" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-info-circle me-1 text-success"></i>Nosotros
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-shopping-basket me-1 text-success"></i>Catálogo
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-light text-decoration-none footer-link">
                  <i className="fas fa-blog me-1 text-success"></i>Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-success mb-3">
              <i className="fas fa-phone me-2"></i>Contacto
            </h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <i className="fas fa-envelope me-2 text-success"></i>
                <span className="text-light">info@huertohogar.cl</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="fas fa-phone me-2 text-success"></i>
                <span className="text-light">+56 9 1234 5678</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="fas fa-clock me-2 text-success"></i>
                <span className="text-light">Lun-Vie 9:00-18:00</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <i className="fas fa-map-marker-alt me-2 text-success"></i>
                <span className="text-light">Santiago, Chile</span>
              </li>
            </ul>
          </div>

          {/* Certificaciones y garantías */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-success mb-3">
              <i className="fas fa-certificate me-2"></i>Garantías
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <div className="text-center p-2 bg-secondary bg-opacity-25 rounded">
                  <i className="fas fa-leaf text-success fs-4 mb-1"></i>
                  <div className="small">100% Orgánico</div>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-secondary bg-opacity-25 rounded">
                  <i className="fas fa-shipping-fast text-success fs-4 mb-1"></i>
                  <div className="small">Envío Rápido</div>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-secondary bg-opacity-25 rounded">
                  <i className="fas fa-shield-alt text-success fs-4 mb-1"></i>
                  <div className="small">Compra Segura</div>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center p-2 bg-secondary bg-opacity-25 rounded">
                  <i className="fas fa-award text-success fs-4 mb-1"></i>
                  <div className="small">Calidad Premium</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <hr className="my-4 border-secondary" />

        {/* Copyright y enlaces legales */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-center text-md-start">
              <i className="fas fa-copyright me-1 text-success"></i>
              2025 HuertoHogar - Todos los derechos reservados
            </p>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <Link to="/terminos" className="text-light text-decoration-none footer-link small">
                <i className="fas fa-file-contract me-1 text-success"></i>Términos de Uso
              </Link>
              <Link to="/privacidad" className="text-light text-decoration-none footer-link small">
                <i className="fas fa-user-shield me-1 text-success"></i>Privacidad
              </Link>
              <Link to="/cookies" className="text-light text-decoration-none footer-link small">
                <i className="fas fa-cookie-bite me-1 text-success"></i>Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
