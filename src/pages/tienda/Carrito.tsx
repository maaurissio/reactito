import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store';

export const Carrito = () => {
  const navigate = useNavigate();
  const { items, total, cantidadItems, eliminarItem, actualizarCantidad, limpiarCarrito } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
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
            Proceder al Pago
          </button>

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
