import { Link } from 'react-router-dom';
import { useAuthStore } from '../store';

export const Home = () => {
  const { user, isAdmin } = useAuthStore();

  return (
    <div className="home-page">
      {/* Hero Section con imagen de fondo */}
      <section className="hero-header position-relative overflow-hidden">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <h1 className="display-3 fw-bold mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
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
            <div className="col-lg-6 order-lg-2">
              <div className="pe-lg-4">
                <h2 className="h3 mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
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
                          <i className="fas fa-handshake text-success"></i>
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold mb-1">Apoyo Local</div>
                        <small className="text-muted">Productores</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                             style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-recycle text-success"></i>
                        </div>
                      </div>
                      <div>
                        <div className="fw-semibold mb-1">Sostenible</div>
                        <small className="text-muted">Eco-friendly</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="position-relative">
                <img 
                  src="/img/vegetales.webp" 
                  className="img-fluid rounded-3 shadow-lg" 
                  alt="Productos frescos HuertoHogar"
                  style={{ borderRadius: '20px' }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-success bg-opacity-10 rounded-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas de Impacto */}
      <section className="py-5" style={{ backgroundColor: '#fafafa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
              Nuestro Impacto
            </h2>
            <p className="text-muted">Cifras que reflejan nuestro compromiso</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="display-4 fw-bold text-success mb-2">6+</div>
                <h5 className="fw-semibold mb-2">Años de Experiencia</h5>
                <p className="text-muted small">Conectando campo y ciudad</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="display-4 fw-bold text-success mb-2">9</div>
                <h5 className="fw-semibold mb-2">Ciudades</h5>
                <p className="text-muted small">Presencia nacional</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="display-4 fw-bold text-success mb-2">1000+</div>
                <h5 className="fw-semibold mb-2">Familias Satisfechas</h5>
                <p className="text-muted small">Clientes felices</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="display-4 fw-bold text-success mb-2">100%</div>
                <h5 className="fw-semibold mb-2">Productos Orgánicos</h5>
                <p className="text-muted small">Calidad garantizada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestras Ubicaciones - Rediseñadas */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
              Nuestras Ubicaciones
            </h2>
            <p className="text-muted">Presentes en las principales ciudades de Chile</p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 border-0">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-city text-success"></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold mb-0 text-success">Región Metropolitana</h5>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>Santiago</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>Viña del Mar</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>Valparaíso</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 border-0">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-mountain text-success"></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold mb-0 text-success">Región del Biobío</h5>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>Nacimiento</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>Concepción</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 border-0">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-water text-success"></i>
                    </div>
                  </div>
                  <h5 className="fw-semibold mb-0 text-success">Región Sur</h5>
                </div>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>Puerto Montt</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-map-marker-alt text-success me-2"></i>
                    <span>Villarrica</span>
                  </div>
                  <small className="text-muted">
                    <i className="fas fa-plus-circle me-1"></i>
                    Próximamente más ubicaciones
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Llamada a la acción para ubicaciones */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-success bg-opacity-10 p-5 rounded-3 text-center">
                <h4 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
                  ¿Tu ciudad no está en la lista?
                </h4>
                <p className="text-muted mb-4">
                  Estamos expandiéndonos constantemente. Déjanos saber dónde te gustaría que llegáramos.
                </p>
                <Link to="/nosotros" className="btn btn-success">
                  <i className="fas fa-map me-2"></i>
                  Ver Todas las Ubicaciones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios - Mejorados */}
      <section className="py-5" style={{ backgroundColor: '#fafafa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h3" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-muted">Experiencias reales de familias satisfechas</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 border-0">
                <div className="text-warning mb-3">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-muted mb-4 lh-lg">
                  "Los productos llegan súper frescos y la calidad es excelente. 
                  Mis hijos ahora comen más frutas y verduras gracias a HuertoHogar."
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                       style={{ width: '45px', height: '45px' }}>
                    MV
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 fw-semibold">Marcelo Villa</h6>
                    <small className="text-muted">Santiago</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 border-0">
                <div className="text-warning mb-3">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-muted mb-4 lh-lg">
                  "El servicio de entrega es puntual y los productos son de calidad superior. 
                  Definitivamente recomiendo HuertoHogar a todas las familias."
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                       style={{ width: '45px', height: '45px' }}>
                    JI
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 fw-semibold">Jeremy Ignacio</h6>
                    <small className="text-muted">Valparaíso</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 border-0">
                <div className="text-warning mb-3">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="text-muted mb-4 lh-lg">
                  "Me encanta poder apoyar a productores locales mientras recibo 
                  productos frescos en casa. Una experiencia increíble."
                </p>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold"
                       style={{ width: '45px', height: '45px' }}>
                    JP
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 fw-semibold">Jean Pavez</h6>
                    <small className="text-muted">Concepción</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-5 my-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <h2 className="h3 mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#2d3748' }}>
                  ¿Listo para llevar la frescura del campo a tu hogar?
                </h2>
                <p className="text-muted mb-5 lh-lg">
                  Únete a miles de familias que ya disfrutan de productos frescos, 
                  orgánicos y de la más alta calidad directamente en su mesa.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  {user ? (
                    isAdmin ? (
                      <>
                        <Link to="/admin/dashboard" className="btn btn-warning btn-lg px-5 py-3 rounded-3">
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Dashboard Admin
                        </Link>
                        <Link to="/catalogo" className="btn btn-success btn-lg px-5 py-3 rounded-3">
                          <i className="fas fa-shopping-cart me-2"></i>
                          Ver Catálogo
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/catalogo" className="btn btn-success btn-lg px-5 py-3 rounded-3">
                          <i className="fas fa-shopping-cart me-2"></i>
                          Ver Catálogo
                        </Link>
                        <Link to="/perfil" className="btn btn-outline-success btn-lg px-5 py-3 rounded-3">
                          <i className="fas fa-user me-2"></i>
                          Mi Perfil
                        </Link>
                      </>
                    )
                  ) : (
                    <>
                      <Link to="/catalogo" className="btn btn-success btn-lg px-5 py-3 rounded-3">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Hacer mi Primer Pedido
                      </Link>
                      <Link to="/registro" className="btn btn-outline-success btn-lg px-5 py-3 rounded-3">
                        <i className="fas fa-user-plus me-2"></i>
                        Crear Cuenta Gratis
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
