export const Blog = () => {
  const categorias = [
    {
      id: 1,
      titulo: 'Beneficios de las Manzanas',
      descripcion: 'Las manzanas son ricas en fibra, vitamina C y antioxidantes. Ayudan a mejorar la digestión, fortalecer el sistema inmunológico y reducir el riesgo de enfermedades cardiovasculares.',
      imagen: '/img/manzanas.webp',
      enlace: 'https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet',
      colorAccent: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)'
    },
    {
      id: 2,
      titulo: 'Beneficios de las Verduras Orgánicas',
      descripcion: 'Las verduras orgánicas están libres de pesticidas y químicos. Son ricas en fibra, vitaminas A, C y K, minerales esenciales que fortalecen tu sistema inmunológico y mejoran la salud digestiva.',
      imagen: '/img/vegetales1.webp',
      enlace: 'https://www.fao.org/nutrition/education/food-dietary-guidelines/background/es/',
      colorAccent: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)'
    },
    {
      id: 3,
      titulo: 'Beneficios de los Productos Lácteos',
      descripcion: 'Los lácteos naturales son una excelente fuente de calcio, proteínas y vitamina D. Contribuyen al fortalecimiento de huesos y dientes, y son fundamentales para el desarrollo muscular.',
      imagen: '/img/yogurt.webp',
      enlace: 'https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet',
      colorAccent: 'linear-gradient(135deg, #2ecc71 0%, #1e8449 100%)'
    },
    {
      id: 4,
      titulo: 'Beneficios de la Miel Orgánica',
      descripcion: 'La miel pura es un endulzante natural con propiedades antibacterianas y antioxidantes. Aporta energía natural, ayuda a aliviar la tos y fortalece el sistema inmunológico de forma efectiva.',
      imagen: '/img/miel1.webp',
      enlace: 'https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet',
      colorAccent: 'linear-gradient(135deg, #52be80 0%, #27ae60 100%)'
    },
    {
      id: 5,
      titulo: 'Beneficios de Cereales y Granos',
      descripcion: 'Los cereales integrales y granos como la quinoa son fundamentales para una dieta balanceada. Aportan carbohidratos complejos, fibra, proteínas vegetales y te mantienen energizado todo el día.',
      imagen: '/img/quinoa.webp',
      enlace: 'https://www.fao.org/nutrition/education/food-dietary-guidelines/background/es/',
      colorAccent: 'linear-gradient(135deg, #58d68d 0%, #2ecc71 100%)'
    },
    {
      id: 6,
      titulo: 'Beneficios de Hortalizas Frescas',
      descripcion: 'Las hortalizas frescas como espinacas, lechugas y pimientos son bajas en calorías y ricas en nutrientes. Perfectas para ensaladas, jugos verdes y platos saludables que cuidan tu bienestar.',
      imagen: '/img/lechugas.webp',
      enlace: 'https://www.who.int/es/news-room/fact-sheets/detail/healthy-diet',
      colorAccent: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section 
        className="hero-section position-relative overflow-hidden" 
        style={{
          backgroundImage: 'url(/img/lechugas.webp)'
        }}
      >
        <div className="container text-white">
          <div className="row justify-content-center text-center py-5">
            <div className="col-lg-8">
              <div className="mb-4">
                <span 
                  className="badge px-4 py-2" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  <i className="fas fa-leaf me-2"></i>
                  Conocimiento Saludable
                </span>
              </div>
              
              <h1 
                className="display-3 fw-bold mb-3 text-white" 
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Blog de Nutrición
              </h1>
              
              <p 
                className="lead mb-0" 
                style={{ 
                  fontSize: '1.2rem',
                  opacity: 0.95,
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                Descubre los beneficios de cada categoría de alimentos y cómo pueden mejorar tu salud
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías de Productos */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 
              className="fw-bold mb-3" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#2f9e44',
                fontSize: '2.5rem'
              }}
            >
              Nuestros Productos
            </h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              Explora las diferentes categorías de productos orgánicos y naturales que ofrecemos
            </p>
          </div>

          <div className="row g-4">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="col-lg-4 col-md-6">
                <div 
                  className="card border-0 shadow-sm overflow-hidden d-flex flex-column"
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Imagen */}
                  <div 
                    className="position-relative overflow-hidden" 
                    style={{ height: '220px' }}
                  >
                    <img 
                      src={categoria.imagen} 
                      alt={categoria.titulo}
                      className="w-100 h-100"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    
                    {/* Badge de categoría */}
                    <div 
                      className="position-absolute top-0 start-0 m-3"
                    >
                      <span 
                        className="badge px-3 py-2"
                        style={{
                          background: categoria.colorAccent,
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                      >
                        <i className="fas fa-check-circle me-2"></i>
                        Orgánico
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="card-body p-4 d-flex flex-column">
                    <h3 
                      className="fw-bold mb-3" 
                      style={{ 
                        fontFamily: "'Playfair Display', serif",
                        color: '#2f9e44',
                        fontSize: '1.5rem'
                      }}
                    >
                      {categoria.titulo}
                    </h3>
                    
                    <p 
                      className="text-muted mb-4 flex-grow-1" 
                      style={{ 
                        fontSize: '0.95rem',
                        lineHeight: '1.7'
                      }}
                    >
                      {categoria.descripcion}
                    </p>

                    {/* Botón con link */}
                    <a
                      href={categoria.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100 mt-auto"
                      style={{
                        background: categoria.colorAccent,
                        color: 'white',
                        fontWeight: '600',
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(46, 204, 113, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fas fa-book-open me-2"></i>
                      Leer Más Sobre Beneficios
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Compromiso */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="/img/regando.webp" 
                alt="Cultivo orgánico"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="col-lg-6 ps-lg-5">
              <h2 
                className="fw-bold mb-4" 
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  color: '#2f9e44',
                  fontSize: '2.2rem'
                }}
              >
                Nuestro Compromiso con la Salud
              </h2>
              <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                En <strong>Huerto Hogar</strong> nos comprometemos a traerte productos frescos, orgánicos y de la más alta calidad. 
                Trabajamos directamente con productores locales que comparten nuestra visión de una agricultura sostenible y respetuosa con el medio ambiente.
              </p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-start">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                        flexShrink: 0
                      }}
                    >
                      <i className="fas fa-leaf text-white"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">100% Orgánico</h5>
                      <p className="text-muted small mb-0">Sin pesticidas ni químicos</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #52be80 0%, #27ae60 100%)',
                        flexShrink: 0
                      }}
                    >
                      <i className="fas fa-heart text-white"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Frescos</h5>
                      <p className="text-muted small mb-0">Directamente del campo</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #58d68d 0%, #2ecc71 100%)',
                        flexShrink: 0
                      }}
                    >
                      <i className="fas fa-seedling text-white"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Sostenible</h5>
                      <p className="text-muted small mb-0">Agricultura responsable</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-start">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)',
                        flexShrink: 0
                      }}
                    >
                      <i className="fas fa-truck text-white"></i>
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">Entrega Rápida</h5>
                      <p className="text-muted small mb-0">A todo Chile</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
