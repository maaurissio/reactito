import type { IProducto } from '../../types';
import { Button } from './Button';

interface ProductCardProps {
  producto: IProducto;
  onAddToCart?: (producto: IProducto) => void;
  onViewDetails?: (producto: IProducto) => void;
}

export const ProductCard = ({ producto, onAddToCart, onViewDetails }: ProductCardProps) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(producto);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(producto);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={producto.imagen} alt={producto.nombre} />
        {producto.stock < 10 && producto.stock > 0 && (
          <span className="badge badge-warning">Pocas unidades</span>
        )}
        {producto.stock === 0 && (
          <span className="badge badge-danger">Agotado</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">{producto.categoria}</span>
        <h3 className="product-title">{producto.nombre}</h3>
        <p className="product-description">{producto.descripcion}</p>
        
        <div className="product-details">
          <span className="product-weight">{producto.peso}</span>
          <span className="product-stock">Stock: {producto.stock}</span>
        </div>

        <div className="product-footer">
          <span className="product-price">
            ${producto.precio.toLocaleString('es-CL')}
          </span>
          
          <div className="product-actions">
            {onViewDetails && (
              <Button variant="secondary" size="sm" onClick={handleViewDetails}>
                Ver más
              </Button>
            )}
            {onAddToCart && (
              <Button
                variant="success"
                size="sm"
                onClick={handleAddToCart}
                disabled={producto.stock === 0}
              >
                Agregar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
