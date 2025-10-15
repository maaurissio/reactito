import { useEffect, useState } from 'react';
import { useProductsStore, useCartStore } from '../../store';
import { ProductCard } from '../../components/ui';
import { CategoriaProducto } from '../../types';
import type { IProducto } from '../../types';

export const Catalogo = () => {
  const {
    productosFiltrados,
    categoriaSeleccionada,
    terminoBusqueda,
    cargarProductos,
    filtrarPorCategoria,
    buscar,
    limpiarFiltros,
  } = useProductsStore();

  const { agregarItem } = useCartStore();
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleCategoryFilter = (categoria: CategoriaProducto | 'todos') => {
    filtrarPorCategoria(categoria);
    setSearchInput('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    buscar(searchInput);
  };

  const handleAddToCart = (producto: IProducto) => {
    agregarItem(producto, 1);
    // Aquí podrías agregar una notificación
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <div className="catalogo-page">
      <header className="catalogo-header">
        <h1>Catálogo de Productos</h1>
        <p>Descubre nuestros productos frescos y orgánicos</p>
      </header>

      <div className="catalogo-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
        </form>

        <div className="category-filters">
          <button
            className={`category-btn ${categoriaSeleccionada === 'todos' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('todos')}
          >
            Todos
          </button>
          {Object.entries(CategoriaProducto).map(([key, value]) => (
            <button
              key={key}
              className={`category-btn ${categoriaSeleccionada === value ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>

        {(categoriaSeleccionada || terminoBusqueda) && (
          <button onClick={limpiarFiltros} className="btn btn-secondary btn-sm">
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="catalogo-results">
        {terminoBusqueda && (
          <p className="search-results-text">
            Resultados para: <strong>{terminoBusqueda}</strong> ({productosFiltrados.length})
          </p>
        )}

        {productosFiltrados.length === 0 ? (
          <div className="no-results">
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="products-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
