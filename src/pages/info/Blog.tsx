import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');

  const categories = [
    { id: 'todas', label: 'Todas', icon: 'fa-th' },
    { id: 'frutas', label: 'Frutas', icon: 'fa-apple-alt' },
    { id: 'verduras', label: 'Verduras', icon: 'fa-carrot' },
    { id: 'organicos', label: 'Orgánicos', icon: 'fa-seedling' },
    { id: 'lacteos', label: 'Lácteos', icon: 'fa-cheese' },
  ];

  const articles = [
    {
      id: 'frutas-frescas',
      category: 'frutas',
      image: '/img/manzanas.webp',
      date: '17 Sep 2025',
      title: 'Beneficios de las Frutas Frescas',
      excerpt: 'Descubre cómo las frutas de temporada aportan vitaminas y nutrientes esenciales para una vida más saludable.',
      readTime: '5 min',
      views: '1.2K'
    },
    {
      id: 'verduras-organicas',
      category: 'verduras',
      image: '/img/vegetales1.webp',
      date: '15 Sep 2025',
      title: 'Verduras 100% Orgánicas',
      excerpt: 'Cultivadas sin pesticidas ni químicos, nuestras verduras garantizan sabor auténtico y máximo valor nutricional.',
      readTime: '4 min',
      views: '987'
    },
    {
      id: 'productos-organicos',
      category: 'organicos',
      image: '/img/miel1.webp',
      date: '12 Sep 2025',
      title: 'Productos Naturales y Orgánicos',
      excerpt: 'Aceites, miel, granos y semillas elaborados con ingredientes naturales para un estilo de vida consciente.',
      readTime: '6 min',
      views: '1.5K'
    },
    {
      id: 'productos-lacteos',
      category: 'lacteos',
      image: '/img/alimentos.webp',
      date: '10 Sep 2025',
      title: 'Lácteos Frescos de Granja',
      excerpt: 'De granjas locales responsables, ricos en calcio y nutrientes esenciales para toda la familia.',
      readTime: '4 min',
      views: '823'
    },
  ];

  const filteredArticles = selectedCategory === 'todas' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <main className="blog-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden py-5" style={{ 
        background: 'linear-gradient(135deg, #2f9e44 0%, #51cf66 100%)'
      }}>
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="mb-3">
                <span className="badge rounded-pill px-3 py-2" style={{ 
                  background: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  fontSize: '0.85rem', 
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)'
                }}>
                  <i className="fas fa-seedling me-2"></i>Vida Saludable
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-3 text-white" style={{ 
                fontFamily: "'Playfair Display', serif", 
                letterSpacing: '-0.02em' 
              }}>
                Blog
              </h1>
              <p className="lead mb-0 text-white" style={{ 
                fontSize: '1.1rem', 
                lineHeight: '1.6',
                opacity: '0.95'
              }}>
                Descubre los beneficios de una alimentación saludable y orgánica
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-4" style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="btn rounded-pill px-4 py-2"
                style={{
                  background: selectedCategory === cat.id ? 'var(--green-primary)' : 'white',
                  color: selectedCategory === cat.id ? 'white' : '#495057',
                  border: selectedCategory === cat.id ? 'none' : '1px solid #dee2e6',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(47, 158, 68, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.currentTarget.style.borderColor = 'var(--green-primary)';
                    e.currentTarget.style.color = 'var(--green-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat.id) {
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.color = '#495057';
                  }
                }}
              >
                <i className={`fas ${cat.icon} me-2`}></i>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="row g-4">
            {filteredArticles.map((article) => (
              <div key={article.id} className="col-lg-6">
                <article className="card h-100 border-0 shadow-sm" style={{ 
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}>
                  {/* Image */}
                  <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                    <img 
                      src={article.image} 
                      className="w-100 h-100" 
                      alt={article.title} 
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)'
                    }}></div>
                  </div>

                  {/* Content */}
                  <div className="card-body p-4">
                    {/* Meta info */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                        <i className="fas fa-calendar-alt me-1"></i>
                        {article.date}
                      </small>
                      <div className="d-flex align-items-center gap-3">
                        <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                          <i className="fas fa-clock me-1"></i>
                          {article.readTime}
                        </small>
                        <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                          <i className="fas fa-eye me-1"></i>
                          {article.views}
                        </small>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3" style={{ 
                      fontFamily: "'Playfair Display', serif", 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: '#1d1d1f',
                      lineHeight: '1.3'
                    }}>
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mb-4" style={{ 
                      color: '#6e6e73', 
                      lineHeight: '1.6', 
                      fontSize: '0.95rem' 
                    }}>
                      {article.excerpt}
                    </p>

                    {/* Action */}
                    <Link 
                      to="/catalogo" 
                      className="btn btn-success rounded-pill px-4 py-2"
                      style={{ 
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      Ver Productos
                      <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm" style={{ 
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #2f9e44 0%, #51cf66 100%)',
                overflow: 'hidden'
              }}>
                <div className="card-body text-center py-5 px-4">
                  <div className="mb-3">
                    <i className="fas fa-envelope-open-text" style={{ 
                      fontSize: '3rem', 
                      color: 'white', 
                      opacity: '0.9' 
                    }}></i>
                  </div>
                  <h3 className="mb-3 text-white" style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: '2rem', 
                    fontWeight: '700'
                  }}>
                    Suscríbete a Nuestro Newsletter
                  </h3>
                  <p className="mb-4 text-white" style={{ 
                    fontSize: '1.05rem', 
                    maxWidth: '600px', 
                    margin: '0 auto 2rem',
                    opacity: '0.95'
                  }}>
                    Recibe las últimas novedades, recetas saludables y ofertas exclusivas directamente en tu correo.
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-lg-6">
                      <div className="input-group input-group-lg">
                        <input 
                          type="email" 
                          className="form-control" 
                          placeholder="Tu correo electrónico"
                          style={{ 
                            borderRadius: '50px 0 0 50px',
                            border: 'none',
                            padding: '12px 24px'
                          }}
                        />
                        <button 
                          className="btn btn-dark px-4"
                          style={{ 
                            borderRadius: '0 50px 50px 0',
                            fontWeight: '600',
                            background: '#1d1d1f',
                            border: 'none'
                          }}
                        >
                          Suscribirme
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="text-center py-4">
                <p className="text-muted mb-3" style={{ fontSize: '1rem' }}>
                  ¿Listo para una alimentación más saludable?
                </p>
                <Link 
                  to="/catalogo" 
                  className="btn btn-success btn-lg rounded-pill px-5 py-3"
                  style={{ 
                    fontWeight: '600', 
                    fontSize: '1.05rem',
                    boxShadow: '0 6px 20px rgba(47, 158, 68, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(47, 158, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(47, 158, 68, 0.3)';
                  }}
                >
                  <i className="fas fa-shopping-basket me-2"></i>
                  Ver Catálogo Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
