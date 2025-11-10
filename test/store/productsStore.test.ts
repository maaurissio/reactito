import { describe, expect, test, beforeEach } from 'vitest';
import { useProductsStore } from '../../src/store/productsStore';
import { resetearProductos } from '../../src/services/productos.service';

describe('Prueba del store de productos (productsStore)', () => {
  
  beforeEach(() => {
    resetearProductos();
    localStorage.clear();
    // Cargar productos iniciales
    useProductsStore.getState().cargarProductos();
  });

  test('debe cargar los productos iniciales correctamente', () => {
    const { productos, isLoading } = useProductsStore.getState();
    
    expect(productos.length).toBeGreaterThan(0);
    expect(isLoading).toBe(false);
  });

  test('debe obtener un producto por ID correctamente', () => {
    const { obtenerProducto } = useProductsStore.getState();
    
    // El primer producto debe tener ID 1
    const producto = obtenerProducto(1);
    
    expect(producto).not.toBeUndefined();
    expect(producto?.id).toBe(1);
  });

  test('debe agregar un nuevo producto correctamente', () => {
    const { agregarProducto, productos } = useProductsStore.getState();
    const cantidadInicial = productos.length;
    
    agregarProducto({
      nombre: 'Producto de Test',
      descripcion: 'Descripción de test',
      precio: 1000,
      stock: 50,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: 'Activo' as any,
    });
    
    const state = useProductsStore.getState();
    expect(state.productos.length).toBe(cantidadInicial + 1);
  });

  test('debe actualizar un producto existente correctamente', () => {
    const { actualizarProducto, obtenerProducto } = useProductsStore.getState();
    
    const productoOriginal = obtenerProducto(1);
    expect(productoOriginal).not.toBeUndefined();
    
    actualizarProducto(1, {
      nombre: 'Nombre Actualizado',
      precio: 9999,
    });
    
    const productoActualizado = useProductsStore.getState().obtenerProducto(1);
    expect(productoActualizado?.nombre).toBe('Nombre Actualizado');
    expect(productoActualizado?.precio).toBe(9999);
  });

  test('debe actualizar el stock de un producto correctamente', () => {
    const { actualizarStock, obtenerProducto } = useProductsStore.getState();
    
    const producto = obtenerProducto(1);
    const stockOriginal = producto?.stock;
    
    actualizarStock(1, 100);
    
    const productoActualizado = useProductsStore.getState().obtenerProducto(1);
    expect(productoActualizado?.stock).toBe(100);
    expect(productoActualizado?.stock).not.toBe(stockOriginal);
  });

  test('debe permitir actualizar el estado de un producto a inactivo', () => {
    const { actualizarProducto, obtenerProducto } = useProductsStore.getState();
    
    actualizarProducto(1, { isActivo: 'Inactivo' as any });
    
    const producto = useProductsStore.getState().obtenerProducto(1);
    expect(producto?.isActivo).toBe('Inactivo');
  });
});
