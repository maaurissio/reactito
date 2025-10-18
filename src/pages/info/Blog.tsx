import { Link } from 'react-router-dom';

export const Blog = () => {
  return (
    <main>
      {/* Hero Section */}
      <section 
        className="hero-section position-relative overflow-hidden" 
        style={{
          backgroundImage: 'url(\'/img/huerto.webp\')'
        }}
      >
        <div className="container text-center text-white">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3 text-white" style={{ fontFamily: "'Playfair Display', serif", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                Blog
              </h1>
              <p className="lead mb-4 text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Descubre los beneficios de una alimentación saludable y orgánica
              </p>
              <span className="badge bg-white text-success rounded-pill px-4 py-2 fs-6 fw-medium">
                <i className="fas fa-seedling me-2"></i>Vida Saludable
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Articles Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="sticky-top" style={{ top: '20px' }}>
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-list me-2"></i>Categorías
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      <a href="#frutas-frescas" className="list-group-item list-group-item-action">
                        <i className="fas fa-apple-alt text-success me-2"></i>Frutas Frescas
                      </a>
                      <a href="#verduras-organicas" className="list-group-item list-group-item-action">
                        <i className="fas fa-carrot text-success me-2"></i>Verduras Orgánicas
                      </a>
                      <a href="#productos-organicos" className="list-group-item list-group-item-action">
                        <i className="fas fa-seedling text-success me-2"></i>Productos Orgánicos
                      </a>
                      <a href="#productos-lacteos" className="list-group-item list-group-item-action">
                        <i className="fas fa-glass-milk text-success me-2"></i>Productos Lácteos
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              {/* Artículo 1: Frutas Frescas */}
              <article id="frutas-frescas" className="card border-0 shadow-sm mb-5">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src="/img/manzanas.webp" className="img-fluid w-100 h-100" alt="Frutas Frescas" style={{ objectFit: 'cover', minHeight: '250px' }} />
                  </div>
                  <div className="col-md-8">
                    <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                      <h2 className="text-white mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <i className="fas fa-apple-alt me-2"></i>Frutas Frescas
                      </h2>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <span className="badge bg-success rounded-pill me-2">
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                        <span className="badge bg-info rounded-pill">
                          <i className="fas fa-user me-1"></i>HuertoHogar
                        </span>
                      </div>
                      <p className="card-text text-muted lh-lg">
                        Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria.
                      </p>
                      <p className="card-text text-muted lh-lg">
                        Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies. Cada fruta seleccionada garantiza el máximo sabor y valor nutricional para toda la familia.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-eye me-1"></i>1,234 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-outline-success btn-sm rounded-pill">
                          <i className="fas fa-shopping-basket me-1"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Artículo 2: Verduras Orgánicas */}
              <article id="verduras-organicas" className="card border-0 shadow-sm mb-5">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src="/img/vegetales1.webp" className="img-fluid w-100 h-100" alt="Verduras Orgánicas" style={{ objectFit: 'cover', minHeight: '250px' }} />
                  </div>
                  <div className="col-md-8">
                    <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                      <h2 className="text-white mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <i className="fas fa-carrot me-2"></i>Verduras Orgánicas
                      </h2>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <span className="badge bg-success rounded-pill me-2">
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                        <span className="badge bg-info rounded-pill">
                          <i className="fas fa-user me-1"></i>HuertoHogar
                        </span>
                      </div>
                      <p className="card-text text-muted lh-lg">
                        Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ofreciendo una excelente fuente de vitaminas, minerales y fibra.
                      </p>
                      <p className="card-text text-muted lh-lg">
                        Ideales para ensaladas, guisos y platos saludables, nuestras verduras orgánicas promueven una alimentación consciente y sostenible. El compromiso con la agricultura orgánica no solo beneficia tu salud, sino también el medio ambiente.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-eye me-1"></i>987 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-outline-success btn-sm rounded-pill">
                          <i className="fas fa-shopping-basket me-1"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Artículo 3: Productos Orgánicos */}
              <article id="productos-organicos" className="card border-0 shadow-sm mb-5">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src="/img/miel1.webp" className="img-fluid w-100 h-100" alt="Productos Orgánicos" style={{ objectFit: 'cover', minHeight: '250px' }} />
                  </div>
                  <div className="col-md-8">
                    <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                      <h2 className="text-white mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <i className="fas fa-seedling me-2"></i>Productos Orgánicos
                      </h2>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <span className="badge bg-success rounded-pill me-2">
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                        <span className="badge bg-info rounded-pill">
                          <i className="fas fa-user me-1"></i>HuertoHogar
                        </span>
                      </div>
                      <p className="card-text text-muted lh-lg">
                        Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección que apoya un estilo de vida saludable y respetuoso con el medio ambiente.
                      </p>
                      <p className="card-text text-muted lh-lg">
                        Estos productos son perfectos para quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad. Cada producto ha sido cuidadosamente seleccionado por su pureza y origen responsable.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-eye me-1"></i>1,456 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-outline-success btn-sm rounded-pill">
                          <i className="fas fa-shopping-basket me-1"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Artículo 4: Productos Lácteos */}
              <article id="productos-lacteos" className="card border-0 shadow-sm mb-5">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src="/img/alimentos.webp" className="img-fluid w-100 h-100" alt="Productos Lácteos" style={{ objectFit: 'cover', minHeight: '250px' }} />
                  </div>
                  <div className="col-md-8">
                    <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                      <h2 className="text-white mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <i className="fas fa-glass-milk me-2"></i>Productos Lácteos
                      </h2>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <span className="badge bg-success rounded-pill me-2">
                          <i className="fas fa-calendar me-1"></i>17 Sep 2025
                        </span>
                        <span className="badge bg-info rounded-pill">
                          <i className="fas fa-user me-1"></i>HuertoHogar
                        </span>
                      </div>
                      <p className="card-text text-muted lh-lg">
                        Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico.
                      </p>
                      <p className="card-text text-muted lh-lg">
                        Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, proporcionando el mejor sabor y nutrición para toda la familia. Cada producto mantiene los más altos estándares de calidad y frescura.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-eye me-1"></i>823 lecturas
                        </small>
                        <Link to="/catalogo" className="btn btn-outline-success btn-sm rounded-pill">
                          <i className="fas fa-shopping-basket me-1"></i>Ver Productos
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              {/* Call to Action */}
              <div className="card border-0 shadow-sm bg-gradient" style={{ background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' }}>
                <div className="card-body text-center py-5">
                  <h3 className="text-success mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ¿Listo para una alimentación más saludable?
                  </h3>
                  <p className="text-muted mb-4">
                    Explora nuestro catálogo completo y descubre todos los productos frescos y orgánicos que tenemos para ti.
                  </p>
                  <Link to="/catalogo" className="btn btn-success btn-lg rounded-pill px-5">
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
