import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProductsStore, useCartStore, useAuthStore } from '../../store';
import type { IProducto } from '../../types';
import { 
  obtenerResenasProducto, 
  obtenerResumenResenas, 
  crearResena,
  type IResenaAPI,
  type IResumenResenas 
} from '../../services/resenas.api.service';

export const DetalleProducto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productos = useProductsStore((state) => state.productos);
  const agregarItem = useCartStore((state) => state.agregarItem);
  const itemsCarrito = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  
  const [cantidad, setCantidad] = useState(1);
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [resenas, setResenas] = useState<IResenaAPI[]>([]);
  const [resumen, setResumen] = useState<IResumenResenas | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showResenaToast, setShowResenaToast] = useState(false);
  const [showStockError, setShowStockError] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [loadingResenas, setLoadingResenas] = useState(true);
  const [errorResena, setErrorResena] = useState<string | null>(null);
  const [enviandoResena, setEnviandoResena] = useState(false);

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

  // Cargar reseñas desde la API
  const cargarResenas = useCallback(async () => {
    if (!producto) return;
    
    setLoadingResenas(true);
    try {
      const [resenasData, resumenData] = await Promise.all([
        obtenerResenasProducto(producto.id),
        obtenerResumenResenas(producto.id)
      ]);
      setResenas(resenasData.content);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      // Si falla, mantener arrays vacíos
      setResenas([]);
      setResumen(null);
    } finally {
      setLoadingResenas(false);
    }
  }, [producto]);

  useEffect(() => {
    if (!producto) {
      navigate('/catalogo');
      return;
    }
    
    // Cargar reseñas desde la API
    cargarResenas();
  }, [producto, navigate, cargarResenas]);

  if (!producto) {
    return null;
  }

  const handleAgregarCarrito = () => {
    if (!producto) return;
    const agregado = agregarItem(producto, cantidad);
    if (agregado) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
      // Mostrar error de stock
      setShowStockError(true);
      setTimeout(() => setShowStockError(false), 4000);
    }
  };

  const handleSubmitResena = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Debes iniciar sesión para dejar una reseña');
      navigate('/login');
      return;
    }

    if (!producto) return;

    // Validar comentario
    if (comentario.trim().length < 10) {
      setErrorResena('El comentario debe tener al menos 10 caracteres.');
      return;
    }

    setEnviandoResena(true);
    setErrorResena(null);

    try {
      await crearResena(producto.id, {
        puntuacion: calificacion,
        comentario: comentario.trim()
      });

      // Recargar reseñas desde la API
      await cargarResenas();
      
      setComentario('');
      setCalificacion(5);
      setShowResenaToast(true);
      setTimeout(() => setShowResenaToast(false), 4000);
    } catch (error: unknown) {
      console.error('Error al crear reseña:', error);
      
      // Manejar errores específicos
      const err = error as { status?: number; error?: string; mensaje?: string };
      if (err.status === 403) {
        setErrorResena('Solo puedes reseñar productos que hayas comprado y recibido. Verifica que tu pedido esté en estado "Entregado".');
      } else if (err.status === 409) {
        setErrorResena('Ya has dejado una reseña para este producto.');
      } else if (err.status === 401) {
        setErrorResena('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setErrorResena(err.error || err.mensaje || 'Error al publicar la reseña. Intenta nuevamente.');
      }
    } finally {
      setEnviandoResena(false);
    }
  };

  const getAvatarColor = (nombre: string) => {
    const inicial = nombre.charAt(0).toUpperCase();
    const colores: { [key: string]: string } = {
      'A': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'B': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'C': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'D': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'E': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'F': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'G': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'H': 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)',
      'I': 'linear-gradient(135deg, #f2709c 0%, #ff835b 100%)',
      'J': 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
      'K': 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'L': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      'M': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'N': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'O': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'P': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Q': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'R': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'S': 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)',
      'T': 'linear-gradient(135deg, #f2709c 0%, #ff835b 100%)',
      'U': 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
      'V': 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'W': 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      'X': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Y': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Z': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    };
    return colores[inicial] || 'linear-gradient(135deg, #2E8B57 0%, #228B22 100%)';
  };

  const promedioCalificacion = useMemo(() => {
    if (resumen) {
      return resumen.promedioCalificacion;
    }
    if (resenas.length === 0) return 0;
    return resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length;
  }, [resumen, resenas]);

  const totalResenas = resumen?.totalResenas ?? resenas.length;

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
                  {promedioCalificacion.toFixed(1)} ({totalResenas} {totalResenas === 1 ? 'reseña' : 'reseñas'})
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
                  <span style={{ color: '#6e6e73' }}>{producto.codigo}</span>
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
                    {errorResena && (
                      <div className="alert alert-danger mb-3" style={{ borderRadius: '12px' }}>
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {errorResena}
                      </div>
                    )}
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
                        Comentario <small className="text-muted">(mínimo 10 caracteres)</small>
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
                        minLength={10}
                        maxLength={500}
                        disabled={enviandoResena}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#2E8B57';
                          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(46, 139, 87, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      />
                      <small className="text-muted">{comentario.length}/500 caracteres</small>
                    </div>
                    <button 
                      type="submit" 
                      className="btn"
                      disabled={enviandoResena || comentario.trim().length < 10}
                      style={{
                        background: '#2E8B57',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '0.6rem 1.5rem',
                        fontWeight: '600',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(46, 139, 87, 0.2)',
                        transition: 'all 0.3s ease',
                        opacity: enviandoResena || comentario.trim().length < 10 ? 0.7 : 1
                      }}
                      onMouseOver={(e) => {
                        if (!enviandoResena && comentario.trim().length >= 10) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(46, 139, 87, 0.3)';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 139, 87, 0.2)';
                      }}
                    >
                      {enviandoResena ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Publicando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Publicar Reseña
                        </>
                      )}
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
            {loadingResenas ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Cargando reseñas...</span>
                </div>
                <p className="mt-3 text-muted">Cargando reseñas...</p>
              </div>
            ) : resenas.length === 0 ? (
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
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '50px', 
                              height: '50px',
                              background: getAvatarColor(resena.nombreUsuario),
                              color: '#fff',
                              fontWeight: '700',
                              fontSize: '1.2rem',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                            }}
                          >
                            <span>{resena.nombreUsuario.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0" style={{ fontWeight: '700', color: '#1d1d1f' }}>
                                {resena.nombreUsuario}
                                {resena.verificado && (
                                  <span 
                                    className="badge ms-2" 
                                    style={{ 
                                      background: 'rgba(34, 197, 94, 0.15)', 
                                      color: '#16a34a',
                                      fontSize: '0.7rem',
                                      fontWeight: '600',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '6px'
                                    }}
                                  >
                                    <i className="fas fa-check-circle me-1"></i>
                                    Compra verificada
                                  </span>
                                )}
                              </h6>
                              <small style={{ color: '#6e6e73' }}>{formatFecha(resena.fechaCreacion)}</small>
                            </div>
                            <div>
                              {renderStars(resena.puntuacion)}
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

      {/* Toast Notification para Reseñas */}
      {showResenaToast && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '350px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div 
            className="card" 
            style={{
              background: 'linear-gradient(135deg, rgba(46, 139, 87, 0.95) 0%, rgba(34, 139, 34, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 12px 40px rgba(46, 139, 87, 0.4)',
              overflow: 'hidden'
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <i className="fas fa-check-circle" style={{ fontSize: '2rem', color: '#fff' }}></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="mb-2" style={{ fontWeight: '700', color: '#fff', fontSize: '1.1rem' }}>
                    ¡Gracias por tu reseña!
                  </h5>
                  <p className="mb-0" style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                    Tu opinión ayuda a otros clientes a tomar mejores decisiones de compra.
                  </p>
                  <div className="mt-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-warning">
                        {[...Array(calificacion)].map((_, i) => (
                          <i key={i} className="fas fa-star" style={{ fontSize: '0.9rem' }}></i>
                        ))}
                      </div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
                        {calificacion} estrella{calificacion !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white btn-sm" 
                  onClick={() => setShowResenaToast(false)}
                  style={{ opacity: 0.8 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast de Error de Stock */}
      {showStockError && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            minWidth: '350px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div 
            className="card" 
            style={{
              background: 'linear-gradient(135deg, rgba(220, 53, 69, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 12px 40px rgba(220, 53, 69, 0.4)',
              overflow: 'hidden'
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#fff' }}></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <h5 className="mb-2" style={{ fontWeight: '700', color: '#fff', fontSize: '1.1rem' }}>
                    Stock insuficiente
                  </h5>
                  <p className="mb-0" style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}>
                    No hay suficiente stock disponible. Solo quedan <strong>{producto?.stock || 0}</strong> unidades{itemsCarrito.find(item => item.producto.id === producto?.id) && ` (ya tienes ${itemsCarrito.find(item => item.producto.id === producto?.id)?.cantidad} en el carrito)`}.
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white btn-sm" 
                  onClick={() => setShowStockError(false)}
                  style={{ opacity: 0.8 }}
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
