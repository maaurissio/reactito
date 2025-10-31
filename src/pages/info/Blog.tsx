import { Link } from 'react-router-dom';

export const Blog = () => {
  return (
    <main className="blog-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="mb-3">
                <span className="badge rounded-pill px-4 py-2" style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--green-primary)', fontSize: '0.9rem', fontWeight: '500' }}>
                  <i className="fas fa-seedling me-2"></i>Vida Saludable
                </span>
              </div>
              <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#1d1d1f', letterSpacing: '-0.02em' }}>
                Blog
              </h1>
              <p className="lead mb-4" style={{ color: '#6e6e73', fontSize: '1.25rem', lineHeight: '1.6' }}>
                Descubre los beneficios de una alimentación saludable y orgánica
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Articles Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="position-sticky" style={{ top: '100px' }}>
                <div className="card" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <div className="card-body p-4">
                    <h5 className="mb-4" style={{ fontWeight: '600', color: '#1d1d1f', fontSize: '1.1rem' }}>
                      <i className="fas fa-list me-2" style={{ color: 'var(--green-primary)' }}></i>Categorías
                    </h5>
                    <div className="d-flex flex-column gap-2">
                      <a href="#frutas-frescas" className="text-decoration-none d-flex align-items-center p-3 rounded-3" style={{ color: '#1d1d1f', transition: 'all 0.3s ease', background: 'transparent' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(52, 199, 89, 0.1)';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                        <i className="fas fa-apple-alt me-3" style={{ color: 'var(--green-primary)', fontSize: '1.1rem' }}></i>
                        <span style={{ fontWeight: '500' }}>Frutas Frescas</span>
                      </a>
                      <a href="#verduras-organicas" className="text-decoration-none d-flex align-items-center p-3 rounded-3" style={{ color: '#1d1d1f', transition: 'all 0.3s ease', background: 'transparent' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(52, 199, 89, 0.1)';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                        <i className="fas fa-carrot me-3" style={{ color: 'var(--green-primary)', fontSize: '1.1rem' }}></i>
                        <span style={{ fontWeight: '500' }}>Verduras Orgánicas</span>
                      </a>
                      <a href="#productos-organicos" className="text-decoration-none d-flex align-items-center p-3 rounded-3" style={{ color: '#1d1d1f', transition: 'all 0.3s ease', background: 'transparent' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(52, 199, 89, 0.1)';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                        <i className="fas fa-seedling me-3" style={{ color: 'var(--green-primary)', fontSize: '1.1rem' }}></i>
                        <span style={{ fontWeight: '500' }}>Productos Orgánicos</span>
                      </a>
                      <a href="#productos-lacteos" className="text-decoration-none d-flex align-items-center p-3 rounded-3" style={{ color: '#1d1d1f', transition: 'all 0.3s ease', background: 'transparent' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(52, 199, 89, 0.1)';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}>
                        <i className="fas fa-cheese me-3" style={{ color: 'var(--green-primary)', fontSize: '1.1rem' }}></i>
                        <span style={{ fontWeight: '500' }}>Productos Lácteos</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              {/* Artículo 1: Frutas Frescas */}
              <article id="frutas-frescas" className="card mb-4" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div className="row g-0">
                  <div className="col-md-5">
                    <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                      <img src="/img/manzanas.webp" className="w-100 h-100" alt="Frutas Frescas" style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <span className="badge rounded-pill me-2 px-3 py-2" style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--green-primary)', fontSize: '0.85rem', fontWeight: '500' }}>
                          <i className="fas fa-apple-alt me-1"></i>Frutas Frescas
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                      </div>
                      <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: '700', color: '#1d1d1f' }}>
                        Beneficios de las Frutas Frescas
                      </h2>
                      <p className="mb-3" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria.
                      </p>
                      <p className="mb-4" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies. Cada fruta seleccionada garantiza el máximo sabor y valor nutricional para toda la familia.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: '#86868b' }}>
                          <i className="fas fa-eye me-1"></i>1,234 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-sm rounded-pill px-4" style={{ background: 'var(--green-primary)', color: 'white', border: 'none', fontWeight: '500', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(52, 199, 89, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <i className="fas fa-shopping-basket me-2"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Artículo 2: Verduras Orgánicas */}
              <article id="verduras-organicas" className="card mb-4" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div className="row g-0">
                  <div className="col-md-5">
                    <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                      <img src="/img/vegetales1.webp" className="w-100 h-100" alt="Verduras Orgánicas" style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <span className="badge rounded-pill me-2 px-3 py-2" style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--green-primary)', fontSize: '0.85rem', fontWeight: '500' }}>
                          <i className="fas fa-carrot me-1"></i>Verduras Orgánicas
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                      </div>
                      <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: '700', color: '#1d1d1f' }}>
                        Verduras 100% Orgánicas
                      </h2>
                      <p className="mb-3" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra.
                      </p>
                      <p className="mb-4" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible. El compromiso con la agricultura orgánica no solo beneficia tu salud, sino también el medio ambiente.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: '#86868b' }}>
                          <i className="fas fa-eye me-1"></i>987 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-sm rounded-pill px-4" style={{ background: 'var(--green-primary)', color: 'white', border: 'none', fontWeight: '500', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(52, 199, 89, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <i className="fas fa-shopping-basket me-2"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Artículo 3: Productos Orgánicos */}
              <article id="productos-organicos" className="card mb-4" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div className="row g-0">
                  <div className="col-md-5">
                    <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                      <img src="/img/miel1.webp" className="w-100 h-100" alt="Productos Orgánicos" style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <span className="badge rounded-pill me-2 px-3 py-2" style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--green-primary)', fontSize: '0.85rem', fontWeight: '500' }}>
                          <i className="fas fa-seedling me-1"></i>Productos Orgánicos
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                      </div>
                      <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: '700', color: '#1d1d1f' }}>
                        Productos Naturales y Orgánicos
                      </h2>
                      <p className="mb-3" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente.
                      </p>
                      <p className="mb-4" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad. Cada producto ha sido cuidadosamente seleccionado por su pureza y origen responsable.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: '#86868b' }}>
                          <i className="fas fa-eye me-1"></i>1,456 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-sm rounded-pill px-4" style={{ background: 'var(--green-primary)', color: 'white', border: 'none', fontWeight: '500', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(52, 199, 89, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <i className="fas fa-shopping-basket me-2"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Artículo 4: Productos Lácteos */}
              <article id="productos-lacteos" className="card mb-4" style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <div className="row g-0">
                  <div className="col-md-5">
                    <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
                      <img src="/img/alimentos.webp" className="w-100 h-100" alt="Productos Lácteos" style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                    </div>
                  </div>
                  <div className="col-md-7">
                    <div className="card-body p-4">
                      <div className="mb-3">
                        <span className="badge rounded-pill me-2 px-3 py-2" style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--green-primary)', fontSize: '0.85rem', fontWeight: '500' }}>
                          <i className="fas fa-cheese me-1"></i>Productos Lácteos
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                      </div>
                      <h2 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: '700', color: '#1d1d1f' }}>
                        Lácteos Frescos de Granja
                      </h2>
                      <p className="mb-3" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico.
                      </p>
                      <p className="mb-4" style={{ color: '#6e6e73', lineHeight: '1.7', fontSize: '1rem' }}>
                        Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia. Cada producto mantiene los más altos estándares de calidad y frescura.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: '#86868b' }}>
                          <i className="fas fa-eye me-1"></i>823 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-sm rounded-pill px-4" style={{ background: 'var(--green-primary)', color: 'white', border: 'none', fontWeight: '500', transition: 'all 0.3s ease' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(52, 199, 89, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <i className="fas fa-shopping-basket me-2"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Call to Action */}
              <div className="card" style={{ background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.1) 0%, rgba(52, 199, 89, 0.05) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(52, 199, 89, 0.2)', overflow: 'hidden' }}>
                <div className="card-body text-center py-5 px-4">
                  <div className="mb-3">
                    <i className="fas fa-leaf" style={{ fontSize: '3rem', color: 'var(--green-primary)', opacity: '0.8' }}></i>
                  </div>
                  <h3 className="mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: '700', color: '#1d1d1f' }}>
                    ¿Listo para una alimentación más saludable?
                  </h3>
                  <p className="mb-4" style={{ color: '#6e6e73', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Explora nuestro catálogo completo y descubre todos los productos frescos y orgánicos que tenemos para ti.
                  </p>
                  <Link to="/catalogo" className="btn btn-lg rounded-pill px-5 py-3" style={{ background: 'var(--green-primary)', color: 'white', border: 'none', fontWeight: '600', fontSize: '1.1rem', transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(52, 199, 89, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                    <i className="fas fa-shopping-basket me-2"></i>Ver Catálogo Completo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
