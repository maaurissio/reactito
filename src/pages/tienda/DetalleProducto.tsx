import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProductsStore, useCartStore, useAuthStore } from '../../store';
import type { IProducto, IResena } from '../../types';

export const DetalleProducto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productos = useProductsStore((state) => state.productos);
  const agregarItem = useCartStore((state) => state.agregarItem);
  const user = useAuthStore((state) => state.user);
  
  const [cantidad, setCantidad] = useState(1);
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [resenas, setResenas] = useState<IResena[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  const producto: IProducto | undefined = useMemo(() => {
    return productos.find((p) => p.id === Number(id));
  }, [productos, id]);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
      }),
    []
  );

  useEffect(() => {
    if (!producto) {
      navigate('/catalogo');
      return;
    }
    
    // Cargar reseñas desde localStorage
    const resenasGuardadas = localStorage.getItem(`resenas_producto_${producto.id}`);
    if (resenasGuardadas) {
      setResenas(JSON.parse(resenasGuardadas));
    } else {
      setResenas([]);
    }
  }, [producto, navigate]);

  if (!producto) {
    return null;
  }

  const handleAgregarCarrito = () => {
    if (!producto) return;
    agregarItem(producto, cantidad);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmitResena = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      navigate('/login');
      return;
    }

    if (!producto) return;

    const nuevaResena: IResena = {
      id: `${Date.now()}-${Math.random()}`,
      productoId: producto.id,
      usuarioId: user.id,
      usuarioNombre: `${user.nombre} ${user.apellido}`,
      usuarioAvatar: user.avatar,
      calificacion,
      comentario,
      fecha: new Date().toISOString(),
    };

    const nuevasResenas = [nuevaResena, ...resenas];
    setResenas(nuevasResenas);
    localStorage.setItem(`resenas_producto_${producto.id}`, JSON.stringify(nuevasResenas));
    
    setComentario('');
    setCalificacion(5);
    alert('¡Gracias por tu reseña!');
  };

  const promedioCalificacion = useMemo(() => {
    if (resenas.length === 0) return 0;
    return resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length;
  }, [resenas]);

  const renderStars = (rating: number, interactive = false, onHover?: (value: number) => void, onClick?: (value: number) => void) => {
    const stars = [];
    const displayRating = interactive && hoverStar > 0 ? hoverStar : rating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= displayRating ? 'text-warning' : 'text-muted'}`}
          style={{ 
            cursor: interactive ? 'pointer' : 'default',
            fontSize: interactive ? '1.5rem' : '1rem',
            marginRight: '0.25rem'
          }}
          onMouseEnter={() => interactive && onHover && onHover(i)}
          onMouseLeave={() => interactive && onHover && onHover(0)}
          onClick={() => interactive && onClick && onClick(i)}
        />
      );
    }
    return stars;
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="detalle-producto-page py-5" style={{ background: 'linear-gradient(180deg, #fbfbfd 0%, #f5f5f7 100%)', minHeight: '100vh' }}>
      <div className="container">
        {/* Botón de retroceso */}
        <div className="mb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-outline-success d-inline-flex align-items-center gap-2"
            style={{
              borderRadius: '12px',
              padding: '0.6rem 1.5rem',
              fontWeight: '500',
              border: '1.5px solid var(--green-primary)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-arrow-left"></i>
            Volver
          </button>
        </div>

        {/* Breadcrumb con estilo moderno */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ 
            background: 'rgba(255, 255, 255, 0.7)', 
            backdropFilter: 'blur(20px)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.06)'
          }}>
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: '#2E8B57', textDecoration: 'none', fontWeight: '500' }}>
                Inicio
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/catalogo" style={{ color: '#2E8B57', textDecoration: 'none', fontWeight: '500' }}>
                Catálogo
              </Link>
            </li>
            <li className="breadcrumb-item active" style={{ color: '#6e6e73' }}>{producto?.nombre}</li>
          </ol>
        </nav>

        {/* Detalle del producto */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <div className="product-image-container" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '1rem',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <img
                src={
                  producto?.imagen.startsWith('data:') 
                    ? producto.imagen 
                    : producto?.imagen.startsWith('img/') 
                      ? `/${producto.imagen}` 
                      : producto?.imagen
                }
                alt={producto?.nombre}
                className="img-fluid"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '16px' }}
                onError={(e) => { e.currentTarget.src = '/img/default.jpg'; }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="product-details" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <span className="badge" style={{
                background: 'rgba(34, 197, 94, 0.9)',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                letterSpacing: '0.5px',
                marginBottom: '1rem',
                display: 'inline-block'
              }}>
                {producto?.categoria}
              </span>
              
              <h1 className="display-5 fw-bold mb-3" style={{ color: '#1d1d1f', letterSpacing: '-0.5px' }}>
                {producto?.nombre}
              </h1>
              
              <div className="mb-3">
                <span className="me-2">{renderStars(promedioCalificacion)}</span>
                <span style={{ color: '#6e6e73', fontSize: '0.95rem' }}>
                  {promedioCalificacion.toFixed(1)} ({resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
              
              <p className="lead mb-4" style={{ color: '#6e6e73', fontSize: '1rem', lineHeight: '1.6' }}>
                {producto?.descripcion}
              </p>
              
              <div className="mb-4 p-4" style={{
                background: 'rgba(46, 139, 87, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(46, 139, 87, 0.1)'
              }}>
                <h2 className="mb-0" style={{ fontSize: '2.5rem', color: '#2E8B57', fontWeight: '700', letterSpacing: '-1px' }}>
                  {priceFormatter.format(producto?.precio || 0)}
                </h2>
                <p className="mb-0" style={{ color: '#6e6e73', fontSize: '0.95rem' }}>
                  Por {producto?.peso || 'unidad'}
                </p>
              </div>

              <div className="mb-4" style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(0, 0, 0, 0.06)'
              }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontWeight: '600', color: '#1d1d1f' }}>Disponibilidad:</span>
                  <span className="badge" style={{
                    background: producto && producto.stock > 5 ? 'rgba(34, 197, 94, 0.9)' : producto && producto.stock > 0 ? 'rgba(251, 176, 59, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0.35rem 0.8rem',
                    fontSize: '0.85rem'
                  }}>
                    {producto && producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontWeight: '600', color: '#1d1d1f' }}>Código:</span>
                  <span style={{ color: '#6e6e73' }}>PR{String(producto?.id || 0).padStart(3, '0')}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: '600', color: '#1d1d1f', fontSize: '0.95rem' }}>
                  Cantidad:
                </label>
                <div className="input-group" style={{ maxWidth: '200px' }}>
                  <button 
                    className="btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1.5px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px 0 0 12px',
                      color: '#2E8B57',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1.5px solid rgba(0, 0, 0, 0.1)',
                      borderLeft: 'none',
                      borderRight: 'none',
                      fontWeight: '600',
                      color: '#1d1d1f'
                    }}
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, Math.min(producto?.stock || 1, Number(e.target.value))))}
                    min="1"
                    max={producto?.stock}
                  />
                  <button 
                    className="btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1.5px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '0 12px 12px 0',
                      color: '#2E8B57',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setCantidad(Math.min(producto?.stock || 1, cantidad + 1))}
                    disabled={cantidad >= (producto?.stock || 0)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-lg"
                  style={{
                    background: '#2E8B57',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '0.8rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(46, 139, 87, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={handleAgregarCarrito}
                  disabled={!producto || producto.stock === 0}
                  onMouseOver={(e) => {
                    if (producto && producto.stock > 0) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 139, 87, 0.4)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 139, 87, 0.3)';
                  }}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  {producto && producto.stock === 0 ? 'Producto Agotado' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Reseñas */}
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4" style={{ color: '#1d1d1f', fontWeight: '700', letterSpacing: '-0.5px' }}>
              Reseñas de Clientes
            </h2>
            
            {/* Formulario de nueva reseña */}
            <div className="card mb-4" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}>
              <div className="card-body" style={{ padding: '2rem' }}>
                <h5 className="card-title mb-3" style={{ color: '#1d1d1f', fontWeight: '600' }}>
                  Escribe una reseña
                </h5>
                {user ? (
                  <form onSubmit={handleSubmitResena}>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#1d1d1f' }}>
                        Calificación
                      </label>
                      <div>
                        {renderStars(
                          calificacion, 
                          true,
                          setHoverStar,
                          setCalificacion
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" style={{ fontWeight: '600', color: '#1d1d1f' }}>
                        Comentario
                      </label>
                      <textarea
                        className="form-control"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          border: '1.5px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: '12px',
                          padding: '0.75rem 1rem',
                          fontSize: '0.95rem',
                          transition: 'all 0.3s ease'
                        }}
                        rows={4}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Cuéntanos tu experiencia con este producto..."
                        required
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2E8B57';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(46, 139, 87, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn"
                      style={{
                        background: '#2E8B57',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '0.6rem 1.5rem',
                        fontWeight: '600',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(46, 139, 87, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 139, 87, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 139, 87, 0.2)';
                      }}
                    >
                      <i className="fas fa-paper-plane me-2"></i>
                      Publicar Reseña
                    </button>
                  </form>
                ) : (
                  <div className="alert" style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    padding: '1rem'
                  }}>
                    <i className="fas fa-info-circle me-2" style={{ color: '#3b82f6' }}></i>
                    Debes{' '}
                    <Link 
                      to="/login" 
                      style={{ 
                        color: '#2E8B57', 
                        textDecoration: 'none', 
                        fontWeight: '600',
                        borderBottom: '2px solid #2E8B57'
                      }}
                    >
                      iniciar sesión
                    </Link>
                    {' '}para dejar una reseña.
                  </div>
                )}
              </div>
            </div>

            {/* Lista de reseñas */}
            {resenas.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-comments" style={{ fontSize: '4rem', color: '#d2d2d7', marginBottom: '1rem' }}></i>
                <p style={{ color: '#6e6e73', fontSize: '1.1rem' }}>
                  Aún no hay reseñas. ¡Sé el primero en dejar una!
                </p>
              </div>
            ) : (
              <div className="resenas-list">
                {resenas.map((resena) => (
                  <div 
                    key={resena.id} 
                    className="card mb-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '20px',
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                    }}
                  >
                    <div className="card-body" style={{ padding: '1.5rem' }}>
                      <div className="d-flex align-items-start mb-2">
                        <div className="me-3">
                          {resena.usuarioAvatar ? (
                            <img 
                              src={resena.usuarioAvatar} 
                              alt={resena.usuarioNombre}
                              className="rounded-circle"
                              style={{ width: '50px', height: '50px', objectFit: 'cover', border: '2px solid rgba(46, 139, 87, 0.2)' }}
                            />
                          ) : (
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ 
                                width: '50px', 
                                height: '50px',
                                background: 'linear-gradient(135deg, #2E8B57 0%, #228B22 100%)',
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '1.2rem'
                              }}
                            >
                              <span>{resena.usuarioNombre.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0" style={{ fontWeight: '700', color: '#1d1d1f' }}>
                                {resena.usuarioNombre}
                              </h6>
                              <small style={{ color: '#6e6e73' }}>{formatFecha(resena.fecha)}</small>
                            </div>
                            <div>
                              {renderStars(resena.calificacion)}
                            </div>
                          </div>
                          <p className="mt-2 mb-0" style={{ color: '#1d1d1f', lineHeight: '1.6' }}>
                            {resena.comentario}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '300px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div 
            className="card" 
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden'
            }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <i className="fas fa-check-circle" style={{ fontSize: '2rem', color: '#2E8B57' }}></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1" style={{ fontWeight: '700', color: '#1d1d1f' }}>
                    ¡Agregado al carrito!
                  </h6>
                  <p className="mb-0" style={{ fontSize: '0.9rem', color: '#6e6e73' }}>
                    {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} de {producto?.nombre}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-sm" 
                  onClick={() => setShowToast(false)}
                  style={{ opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .breadcrumb-item + .breadcrumb-item::before {
          color: #6e6e73;
        }

        .breadcrumb-item.active {
          color: #6e6e73;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};
