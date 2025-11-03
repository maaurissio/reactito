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

  const producto = useMemo(() => {
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
    <div className="detalle-producto-page py-5">
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/catalogo">Catálogo</Link></li>
            <li className="breadcrumb-item active">{producto.nombre}</li>
          </ol>
        </nav>

        {/* Detalle del producto */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4">
            <div className="product-image-container">
              <img
                src={
                  producto.imagen.startsWith('data:') 
                    ? producto.imagen 
                    : producto.imagen.startsWith('img/') 
                      ? `/${producto.imagen}` 
                      : producto.imagen
                }
                alt={producto.nombre}
                className="img-fluid rounded shadow"
                style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                onError={(e) => { e.currentTarget.src = '/img/default.jpg'; }}
              />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="product-details">
              <span className="badge bg-success mb-2">{producto.categoria}</span>
              <h1 className="display-5 fw-bold mb-3">{producto.nombre}</h1>
              <div className="mb-3">
                <span className="me-2">{renderStars(promedioCalificacion)}</span>
                <span className="text-muted">
                  {promedioCalificacion.toFixed(1)} ({resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
              
              <p className="lead text-muted mb-4">{producto.descripcion}</p>
              
              <div className="mb-4 p-4 bg-light rounded">
                <h2 className="text-success mb-0" style={{ fontSize: '2.5rem' }}>
                  {priceFormatter.format(producto.precio)}
                </h2>
                <p className="text-muted mb-0">Por {producto.peso || 'unidad'}</p>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium">Disponibilidad:</span>
                  <span className={`badge ${producto.stock > 5 ? 'bg-success' : producto.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                    {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Código:</span>
                  <span className="text-muted">PR{String(producto.id).padStart(3, '0')}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Cantidad:</label>
                <div className="input-group" style={{ maxWidth: '200px' }}>
                  <button 
                    className="btn btn-outline-success" 
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={cantidad <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    value={cantidad}
                    onChange={(e) => setCantidad(Math.max(1, Math.min(producto.stock, Number(e.target.value))))}
                    min="1"
                    max={producto.stock}
                  />
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                    disabled={cantidad >= producto.stock}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={handleAgregarCarrito}
                  disabled={producto.stock === 0}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  {producto.stock === 0 ? 'Producto Agotado' : 'Agregar al Carrito'}
                </button>
                <Link to="/catalogo" className="btn btn-outline-success">
                  <i className="fas fa-arrow-left me-2"></i>
                  Volver al Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Reseñas */}
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Reseñas de Clientes</h2>
            
            {/* Formulario de nueva reseña */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Escribe una reseña</h5>
                {user ? (
                  <form onSubmit={handleSubmitResena}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Calificación</label>
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
                      <label className="form-label fw-medium">Comentario</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Cuéntanos tu experiencia con este producto..."
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success">
                      <i className="fas fa-paper-plane me-2"></i>
                      Publicar Reseña
                    </button>
                  </form>
                ) : (
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Debes <Link to="/login">iniciar sesión</Link> para dejar una reseña.
                  </div>
                )}
              </div>
            </div>

            {/* Lista de reseñas */}
            {resenas.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-comments text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted mt-3">Aún no hay reseñas. ¡Sé el primero en dejar una!</p>
              </div>
            ) : (
              <div className="resenas-list">
                {resenas.map((resena) => (
                  <div key={resena.id} className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-start mb-2">
                        <div className="me-3">
                          {resena.usuarioAvatar ? (
                            <img 
                              src={resena.usuarioAvatar} 
                              alt={resena.usuarioNombre}
                              className="rounded-circle"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div 
                              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                              style={{ width: '50px', height: '50px' }}
                            >
                              <span className="fw-bold">{resena.usuarioNombre.charAt(0).toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0 fw-bold">{resena.usuarioNombre}</h6>
                              <small className="text-muted">{formatFecha(resena.fecha)}</small>
                            </div>
                            <div>
                              {renderStars(resena.calificacion)}
                            </div>
                          </div>
                          <p className="mt-2 mb-0">{resena.comentario}</p>
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
          <div className="card shadow-lg border-0">
            <div className="card-body p-3">
              <div className="d-flex align-items-start">
                <div className="me-3">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">¡Agregado al carrito!</h6>
                  <p className="mb-0 text-muted small">
                    {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} de {producto.nombre}
                  </p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-sm" 
                  onClick={() => setShowToast(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
