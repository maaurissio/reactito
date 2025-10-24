import { useEffect, useState } from 'react';
import { useProductsStore, useCartStore } from '../../store';
import type { IProducto } from '../../types';
import { Estado } from '../../types/models';

export const Catalogo = () => {
  const {
    productos,
    cargarProductos,
  } = useProductsStore();

  const { agregarItem } = useCartStore();
  
  const [searchInput, setSearchInput] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos');
  const [productosFiltrados, setProductosFiltrados] = useState<IProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productoAgregado, setProductoAgregado] = useState<IProducto | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await cargarProductos();
      setIsLoading(false);
    };
    loadData();
  }, [cargarProductos]);

  // Aplicar filtros cuando cambien los productos, búsqueda o categoría
  useEffect(() => {
    aplicarFiltros();
  }, [productos, searchInput, categoriaActiva]);

  const aplicarFiltros = () => {
    let filtrados = [...productos];

    // Filtrar solo productos activos
    filtrados = filtrados.filter(producto => producto.isActivo === Estado.activo);

    // Filtrar por categoría
    if (categoriaActiva && categoriaActiva !== 'todos') {
      filtrados = filtrados.filter(producto => 
        producto.categoria === categoriaActiva
      );
    }

    // Filtrar por búsqueda
    if (searchInput.trim()) {
      const busqueda = searchInput.toLowerCase();
      filtrados = filtrados.filter(producto =>
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda) ||
        producto.categoria.toLowerCase().includes(busqueda)
      );
    }

    setProductosFiltrados(filtrados);
  };

  const handleCategoryClick = (categoria: string) => {
    if (categoriaActiva === categoria) {
      setCategoriaActiva('todos');
    } else {
      setCategoriaActiva(categoria);
    }
  };

  const handleAddToCart = (producto: IProducto) => {
    agregarItem(producto, 1);
    setProductoAgregado(producto);
    setShowModal(true);
    
    // Auto-cerrar la notificación después de 3 segundos
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  const getStockClass = (stock: number) => {
    if (stock === 0) return 'stock-low';
    if (stock <= 5) return 'stock-medium';
    return 'stock-high';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Agotado';
    if (stock <= 5) return `Quedan ${stock}`;
    return `${stock} disponibles`;
  };

  return (
    <div className="catalogo-page">
      {/* Header con imagen de fondo */}
      <section 
        className="hero-section position-relative overflow-hidden" 
        style={{
          backgroundImage: 'url(\'/img/manzana.webp\')'
        }}
      >
        <div className="container text-center text-white">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3 text-white" style={{ fontFamily: "'Playfair Display', serif", textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                Productos Frescos
              </h1>
              <p className="lead mb-4 text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Descubre la frescura y calidad de nuestros productos orgánicos, directamente del huerto a tu mesa
              </p>
              <span className="badge bg-white text-success rounded-pill px-4 py-2 fs-6 fw-medium">
                <i className="fas fa-leaf me-2"></i>100% Orgánico
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de búsqueda y categorías */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, #f8fffe 0%, #f0f9f5 100%)' }}>
        <div className="container">
          {/* Barra de búsqueda central */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="position-relative">
                <input 
                  type="text" 
                  className="form-control form-control-lg border-0 shadow-sm rounded-pill ps-5" 
                  placeholder="🔍 Buscar productos frescos..." 
                  style={{ boxShadow: '0 8px 25px rgba(46, 139, 87, 0.15)', height: '60px', fontSize: '1.1rem' }}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <i className="fas fa-search position-absolute start-0 top-50 translate-middle-y ms-4 text-success"></i>
              </div>
            </div>
          </div>
          
          {/* Categorías */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h5 className="text-center text-muted mb-4 fw-medium">Explora por categorías</h5>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button 
                  className={`btn btn-outline-success rounded-pill px-4 py-3 border-2 category-btn ${categoriaActiva === 'Frutas Frescas' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('Frutas Frescas')}
                  style={{ minWidth: '160px' }}
                >
                  <span className="fs-4 me-2">🍎</span>
                  <span className="fw-medium">Frutas Frescas</span>
                </button>
                <button 
                  className={`btn btn-outline-success rounded-pill px-4 py-3 border-2 category-btn ${categoriaActiva === 'Verduras Orgánicas' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('Verduras Orgánicas')}
                  style={{ minWidth: '160px' }}
                >
                  <span className="fs-4 me-2">🥬</span>
                  <span className="fw-medium">Verduras Orgánicas</span>
                </button>
                <button 
                  className={`btn btn-outline-success rounded-pill px-4 py-3 border-2 category-btn ${categoriaActiva === 'Productos Orgánicos' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('Productos Orgánicos')}
                  style={{ minWidth: '160px' }}
                >
                  <span className="fs-4 me-2">🌱</span>
                  <span className="fw-medium">Productos Orgánicos</span>
                </button>
                <button 
                  className={`btn btn-outline-success rounded-pill px-4 py-3 border-2 category-btn ${categoriaActiva === 'Productos Lácteos' ? 'active' : ''}`}
                  onClick={() => handleCategoryClick('Productos Lácteos')}
                  style={{ minWidth: '160px' }}
                >
                  <span className="fs-4 me-2">🥛</span>
                  <span className="fw-medium">Productos Lácteos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <div className="container my-5">
        <h2 className="text-success text-center mb-4">Catálogo de Productos</h2>
        
        <div id="productos-container">
          <div className="row g-4">
            {isLoading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando productos...</span>
                </div>
                <p className="mt-3 text-muted">Cargando productos frescos...</p>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="fas fa-search text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 text-muted">No se encontraron productos</p>
              </div>
            ) : (
              productosFiltrados.map((producto) => (
                <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3 product-col">
                  <div className="card product-card shadow-sm h-100 d-flex flex-column">
                    <img 
                      src={
                        producto.imagen.startsWith('data:') 
                          ? producto.imagen 
                          : producto.imagen.startsWith('img/') 
                            ? `/${producto.imagen}` 
                            : producto.imagen
                      } 
                      className="card-img-top" 
                      alt={producto.nombre}
                      onError={(e) => { e.currentTarget.src = '/img/default.jpg'; }}
                      style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                    />
                    <div className="card-body d-flex flex-column flex-grow-1">
                      <h5 className="card-title">PR{String(producto.id).padStart(3, '0')} - {producto.nombre}</h5>
                      <p className="card-text flex-grow-1" style={{ fontSize: '0.9rem', color: '#6c757d', lineHeight: '1.4' }}>
                        {producto.descripcion}
                      </p>
                      
                      {/* Sección de precio y stock limpia */}
                      <div className="product-info-section mt-auto" style={{ borderTop: '2px solid #e9ecef', paddingTop: '15px', marginTop: '15px' }}>
                        <div className="price-container mb-3" style={{ borderLeft: '3px solid #2f9e44', paddingLeft: '10px' }}>
                          <div className="price-text" style={{ fontSize: '1.2rem', color: '#2f9e44', fontWeight: 600 }}>
                            {formatearPrecio(producto.precio)}
                          </div>
                          <small className="text-muted">por {producto.peso}</small>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <small className="text-muted">Disponibilidad:</small>
                          <span className={`stock-badge ${getStockClass(producto.stock)}`} style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>
                            {getStockText(producto.stock)}
                          </span>
                        </div>
                        
                        {producto.stock <= 5 && producto.stock > 0 && (
                          <div className="text-center mb-2">
                            <small className="text-warning">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              ¡Últimas unidades disponibles!
                            </small>
                          </div>
                        )}
                        
                        <button 
                          className="btn btn-success w-100 add-to-cart-btn" 
                          onClick={() => handleAddToCart(producto)}
                          disabled={producto.stock === 0}
                          style={{ borderRadius: '6px', fontWeight: 500, transition: 'all 0.2s ease' }}
                        >
                          <i className="fas fa-shopping-cart me-1"></i>
                          {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification - Superior Derecha */}
      {showModal && productoAgregado && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div className="card shadow-lg border-0">
            <div className="card-body p-3">
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">¡Agregado al carrito!</h6>
                  <p className="mb-0 text-muted small">
                    {productoAgregado.nombre}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-sm" 
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animación CSS */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
