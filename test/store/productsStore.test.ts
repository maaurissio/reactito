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

  test('debe retornar undefined si el producto no existe', () => {
    const { obtenerProducto } = useProductsStore.getState();
    
    const producto = obtenerProducto(99999);
    
    expect(producto).toBeUndefined();
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

  test('debe eliminar un producto correctamente', () => {
    const { eliminarProducto, productos, obtenerProducto } = useProductsStore.getState();
    const cantidadInicial = productos.length;
    
    eliminarProducto(1);
    
    const state = useProductsStore.getState();
    expect(state.productos.length).toBe(cantidadInicial - 1);
    expect(state.obtenerProducto(1)).toBeUndefined();
  });

  test('debe manejar el estado de carga correctamente', () => {
    const { cargarProductos } = useProductsStore.getState();
    
    // Al iniciar la carga, isLoading debería ser false después de completarse
    cargarProductos();
    
    const { isLoading } = useProductsStore.getState();
    expect(isLoading).toBe(false);
  });

  test('debe iniciar sin errores', () => {
    const { error } = useProductsStore.getState();
    
    expect(error).toBeNull();
  });

  test('debe mantener la integridad de los datos al actualizar parcialmente', () => {
    const { actualizarProducto, obtenerProducto } = useProductsStore.getState();
    
    const productoOriginal = obtenerProducto(1);
    const nombreOriginal = productoOriginal?.nombre;
    const stockOriginal = productoOriginal?.stock;
    
    // Actualizar solo el precio
    actualizarProducto(1, { precio: 5000 });
    
    const productoActualizado = useProductsStore.getState().obtenerProducto(1);
    expect(productoActualizado?.precio).toBe(5000);
    expect(productoActualizado?.nombre).toBe(nombreOriginal); // No debe cambiar
    expect(productoActualizado?.stock).toBe(stockOriginal); // No debe cambiar
  });

  test('debe permitir agregar productos con diferentes categorías', () => {
    const { agregarProducto, productos } = useProductsStore.getState();
    
    agregarProducto({
      nombre: 'Producto Verdura',
      descripcion: 'Test',
      precio: 2000,
      stock: 30,
      categoria: 'Verduras',
      imagen: 'verdura.jpg',
      isActivo: 'Activo' as any,
    });
    
    const state = useProductsStore.getState();
    const productoAgregado = state.productos.find(p => p.nombre === 'Producto Verdura');
    
    expect(productoAgregado).not.toBeUndefined();
    expect(productoAgregado?.categoria).toBe('Verduras');
  });

  test('debe permitir actualizar el estado de un producto a inactivo', () => {
    const { actualizarProducto, obtenerProducto } = useProductsStore.getState();
    
    actualizarProducto(1, { isActivo: 'Inactivo' as any });
    
    const producto = useProductsStore.getState().obtenerProducto(1);
    expect(producto?.isActivo).toBe('Inactivo');
  });
});
