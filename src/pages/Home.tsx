import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section con imagen de fondo */}
      <section className="hero-header position-relative overflow-hidden">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <h1 className="display-3 fw-bold mb-4 text-white">
                Descubre la frescura del campo
              </h1>
              <p className="lead fs-4 mb-4 text-white">
                Productos orgánicos y frescos, directamente desde el productor hasta tu hogar
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link 
                  to="/catalogo" 
                  className="btn btn-success btn-lg px-4 py-3 rounded-3"
                >
                  <i className="fas fa-shopping-basket me-2"></i>
                  Explorar Productos
                </Link>
                <Link 
                  to="/nosotros" 
                  className="btn btn-outline-light btn-lg px-4 py-3 rounded-3"
                >
                  <i className="fas fa-leaf me-2"></i>
                  Nuestra Historia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué es HuertoHogar? */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <img 
                src="/img/vegetales.webp" 
                alt="Vegetales frescos" 
                className="img-fluid rounded-3 shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="h3 mb-4">
                ¿Qué es HuertoHogar?
              </h2>
              <p className="text-muted mb-4 lh-lg">
                Somos una tienda online que conecta directamente el campo chileno con tu hogar. 
                Con más de 6 años de experiencia, operamos en 9 ciudades clave del país.
              </p>
              <p className="text-muted mb-5 lh-lg">
                Nuestra misión es promover un estilo de vida saludable y sostenible, 
                apoyando a productores locales y ofreciendo productos de la más alta calidad.
              </p>
              
              {/* Características destacadas */}
              <div className="row g-4">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '50px', height: '50px' }}>
                        <i className="fas fa-leaf text-success"></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-semibold mb-1">100% Orgánico</div>
                      <small className="text-muted">Sin químicos</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '50px', height: '50px' }}>
                        <i className="fas fa-shipping-fast text-success"></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-semibold mb-1">Entrega Directa</div>
                      <small className="text-muted">A tu domicilio</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '50px', height: '50px' }}>
                        <i className="fas fa-seedling text-success"></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-semibold mb-1">Sostenible</div>
                      <small className="text-muted">Eco-friendly</small>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                           style={{ width: '50px', height: '50px' }}>
                        <i className="fas fa-medal text-success"></i>
                      </div>
                    </div>
                    <div>
                      <div className="fw-semibold mb-1">Calidad</div>
                      <small className="text-muted">Garantizada</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3">Nuestras Categorías</h2>
            <p className="text-muted">Encuentra productos frescos en cada categoría</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-apple-alt text-success fa-3x"></i>
                  </div>
                  <h5 className="card-title">Frutas Frescas</h5>
                  <p className="card-text text-muted">Frutas frescas y dulces</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-carrot text-success fa-3x"></i>
                  </div>
                  <h5 className="card-title">Verduras Orgánicas</h5>
                  <p className="card-text text-muted">Verduras frescas y crujientes</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-leaf text-success fa-3x"></i>
                  </div>
                  <h5 className="card-title">Productos Orgánicos</h5>
                  <p className="card-text text-muted">100% naturales</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="fas fa-cheese text-success fa-3x"></i>
                  </div>
                  <h5 className="card-title">Lácteos</h5>
                  <p className="card-text text-muted">Productos lácteos frescos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Presencia Nacional */}
      <section className="locations py-5 my-5">
        <div className="container">
          <h2 className="text-center mb-3">Presencia Nacional</h2>
          <p className="text-center text-muted mb-4">
            Operamos en más de 9 puntos a lo largo de Chile:
          </p>
          <div className="locations-list">
            <span className="location-badge">
              <i className="fas fa-map-marker-alt me-2"></i>
              Santiago
            </span>
            <span className="location-badge">
              <i className="fas fa-map-marker-alt me-2"></i>
              Puerto Montt
            </span>
            <span className="location-badge">
              <i className="fas fa-map-marker-alt me-2"></i>
              Villarrica
            </span>
            <span className="location-badge">
              <i className="fas fa-map-marker-alt me-2"></i>
              Nacimiento
            </span>
            <span className="location-badge">
              <i className="fas fa-map-marker-alt me-2"></i>
              Viña del Mar
            </span>
            <span className="location-badge">
              <i className="fas fa-map-marker-alt me-2"></i>
              Valparaíso
            </span>
            <span className="location-badge">
              <i className="fas fa-map-marker-alt me-2"></i>
              Concepción
            </span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <h2 className="text-center mb-4">¡Comienza tu vida saludable hoy!</h2>
          <div className="text-center">
            <Link to="/catalogo" className="btn btn-light btn-lg px-5">
              <i className="fas fa-shopping-basket me-2"></i>
              Explorar Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
