import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, useAuthStore } from '../../store';

export const Carrito = () => {
  const navigate = useNavigate();
  const { items, total, cantidadItems, eliminarItem, actualizarCantidad, limpiarCarrito } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    if (!isAuthenticated) {
      // Guardar la página de destino para después del login
      localStorage.setItem('paginaOrigen', '/checkout');
      navigate('/login');
      return;
    }
    
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="carrito-vacio">
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega productos para comenzar tu compra!</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <header className="carrito-header">
        <h1>🛒 Mi Carrito</h1>
        <p>{cantidadItems} producto(s)</p>
      </header>

      <div className="carrito-content">
        <div className="carrito-items">
          {items.map((item) => (
            <div key={item.id} className="carrito-item">
              <img
                src={item.producto.imagen}
                alt={item.producto.nombre}
                loading="lazy"
                decoding="async"
              />
              
              <div className="item-info">
                <h3>{item.producto.nombre}</h3>
                <p className="item-category">{item.producto.categoria}</p>
                <p className="item-price">
                  ${item.precioUnitario.toLocaleString('es-CL')} / {item.producto.peso}
                </p>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{item.cantidad}</span>
                <button
                  onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                  className="qty-btn"
                  disabled={item.cantidad >= item.producto.stock}
                >
                  +
                </button>
              </div>

              <div className="item-subtotal">
                <p className="subtotal-label">Subtotal:</p>
                <p className="subtotal-value">
                  ${item.subtotal.toLocaleString('es-CL')}
                </p>
              </div>

              <button
                onClick={() => eliminarItem(item.producto.id)}
                className="item-remove"
                aria-label="Eliminar producto"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="carrito-summary">
          <h2>Resumen del Pedido</h2>
          
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${total.toLocaleString('es-CL')}</span>
          </div>
          
          <div className="summary-row">
            <span>Envío:</span>
            <span>Por calcular</span>
          </div>
          
          <div className="summary-total">
            <span>Total:</span>
            <span>${total.toLocaleString('es-CL')}</span>
          </div>

          <button
            type="button"
            className="btn btn-success btn-lg btn-full-width"
            onClick={handleCheckout}
          >
            {isAuthenticated ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar'}
          </button>

          {!isAuthenticated && (
            <p className="text-center mt-2 mb-0" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
              <i className="fas fa-info-circle me-1"></i>
              Debes iniciar sesión para realizar tu compra
            </p>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-full-width"
            onClick={limpiarCarrito}
          >
            Vaciar Carrito
          </button>

          <Link to="/catalogo" className="continue-shopping">
            ← Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};
