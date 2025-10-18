import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Link } from 'react-router-dom';

export const CarritoFlotante = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, cantidadItems, total, actualizarCantidad, eliminarItem, limpiarCarrito } = useCartStore();

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Bloquear scroll
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const handleCheckout = () => {
    closeCart();
    // La navegación se maneja con el Link
  };

  return (
    <>
      {/* Botón Flotante */}
      <button
        onClick={openCart}
        className="floating-cart-btn"
        aria-label="Abrir carrito"
      >
        <div className="cart-icon">
          <i className="fas fa-shopping-basket"></i>
          {cantidadItems > 0 && (
            <span className="cart-badge">
              {cantidadItems > 99 ? '99+' : cantidadItems}
            </span>
          )}
        </div>
      </button>

      {/* Overlay */}
      <div 
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'active' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
            <h5 className="mb-0 fw-bold text-success">
              <i className="fas fa-shopping-cart me-2"></i>
              Mi Carrito
            </h5>
            <button 
              className="btn btn-link text-muted p-0" 
              onClick={closeCart}
              aria-label="Cerrar carrito"
            >
              <i className="fas fa-times fs-4"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
              <p className="text-muted">Tu carrito está vacío</p>
              <Link 
                to="/catalogo" 
                className="btn btn-success"
                onClick={closeCart}
              >
                <i className="fas fa-store me-2"></i>
                Ver Productos
              </Link>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="cart-item mb-3 p-3 border rounded">
                  <div className="d-flex gap-3">
                    {/* Imagen del producto */}
                    <img 
                      src={item.producto.imagen} 
                      alt={item.producto.nombre}
                      className="cart-item-image"
                    />

                    {/* Información del producto */}
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.producto.nombre}</h6>
                      <p className="text-success fw-bold mb-2">
                        ${item.producto.precio.toLocaleString('es-CL')}
                      </p>

                      {/* Controles de cantidad */}
                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
                          className="btn btn-sm btn-outline-secondary"
                          disabled={item.cantidad <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="fw-bold">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
                          className="btn btn-sm btn-outline-secondary"
                          disabled={item.cantidad >= item.producto.stock}
                        >
                          <i className="fas fa-plus"></i>
                        </button>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => eliminarItem(item.producto.id)}
                          className="btn btn-sm btn-outline-danger ms-auto"
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>

                      {/* Stock disponible */}
                      {item.cantidad >= item.producto.stock && (
                        <small className="text-danger d-block mt-1">
                          Stock máximo alcanzado
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-end mt-2 pt-2 border-top">
                    <small className="text-muted">Subtotal: </small>
                    <span className="fw-bold text-success">
                      ${item.subtotal.toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              ))}

              {/* Botón vaciar carrito */}
              {items.length > 0 && (
                <button
                  onClick={limpiarCarrito}
                  className="btn btn-outline-danger btn-sm w-100 mt-2"
                >
                  <i className="fas fa-trash-alt me-2"></i>
                  Vaciar Carrito
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            {/* Total */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold">Total:</span>
              <span className="h4 mb-0 text-success fw-bold">
                ${total.toLocaleString('es-CL')}
              </span>
            </div>

            {/* Botón finalizar compra */}
            <Link
              to="/checkout"
              className="btn btn-success w-100 mb-2"
              onClick={handleCheckout}
            >
              <i className="fas fa-credit-card me-2"></i>
              Finalizar Compra
            </Link>

            {/* Botón seguir comprando */}
            <Link
              to="/catalogo"
              className="btn btn-outline-success w-100"
              onClick={closeCart}
            >
              <i className="fas fa-store me-2"></i>
              Seguir Comprando
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
