import { describe, expect, test, beforeEach, vi } from 'vitest';
import { useProductsStore } from '../../src/store/productsStore';
import { productosMock, mockProductosService, resetearMocks } from '../mocks/api.mock';
import { Estado } from '../../src/types';

// Mock del servicio de productos
vi.mock('../../src/services/productos.api.service', () => ({
  obtenerTodosLosProductos: () => mockProductosService.obtenerTodosLosProductos(),
  obtenerProductoPorId: (id: number) => mockProductosService.obtenerProductoPorId(id),
  agregarProducto: (producto: any) => mockProductosService.agregarProducto(producto),
  actualizarProducto: (id: number, cambios: any) => mockProductosService.actualizarProducto(id, cambios),
  actualizarStockProducto: (id: number, stock: number) => mockProductosService.actualizarStockProducto(id, stock),
  eliminarProducto: (id: number) => mockProductosService.eliminarProducto(id),
}));

describe('Prueba del store de productos (productsStore)', () => {
  
  beforeEach(() => {
    resetearMocks();
    localStorage.clear();
    // Reset del store
    useProductsStore.setState({ productos: [], isLoading: false, error: null });
  });

  test('debe cargar los productos correctamente desde la API', async () => {
    const { cargarProductos } = useProductsStore.getState();
    
    await cargarProductos();
    
    const { productos, isLoading } = useProductsStore.getState();
    
    expect(mockProductosService.obtenerTodosLosProductos).toHaveBeenCalled();
    expect(productos.length).toBe(productosMock.length);
    expect(isLoading).toBe(false);
  });

  test('debe obtener un producto por ID correctamente', async () => {
    const { cargarProductos, obtenerProducto } = useProductsStore.getState();
    
    await cargarProductos();
    const producto = await obtenerProducto(1);
    
    expect(mockProductosService.obtenerProductoPorId).toHaveBeenCalledWith(1);
    expect(producto).not.toBeNull();
    expect(producto?.id).toBe(1);
  });

  test('debe agregar un nuevo producto correctamente', async () => {
    const { cargarProductos, agregarProducto } = useProductsStore.getState();
    
    await cargarProductos();
    
    const resultado = await agregarProducto({
      nombre: 'Producto de Test',
      descripcion: 'Descripción de test',
      precio: 1000,
      stock: 50,
      categoria: 'Frutas Frescas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
    });
    
    expect(mockProductosService.agregarProducto).toHaveBeenCalled();
    expect(resultado.success).toBe(true);
  });

  test('debe actualizar un producto existente correctamente', async () => {
    const { cargarProductos, actualizarProducto } = useProductsStore.getState();
    
    await cargarProductos();
    
    const resultado = await actualizarProducto(1, {
      nombre: 'Nombre Actualizado',
      precio: 9999,
    });
    
    expect(mockProductosService.actualizarProducto).toHaveBeenCalledWith(1, {
      nombre: 'Nombre Actualizado',
      precio: 9999,
    });
    expect(resultado.success).toBe(true);
  });

  test('debe actualizar el stock de un producto correctamente', async () => {
    const { cargarProductos, actualizarStock } = useProductsStore.getState();
    
    await cargarProductos();
    
    const resultado = await actualizarStock(1, 100);
    
    expect(mockProductosService.actualizarStockProducto).toHaveBeenCalledWith(1, 100);
    expect(resultado.success).toBe(true);
  });

  test('debe permitir actualizar el estado de un producto a inactivo', async () => {
    const { cargarProductos, actualizarProducto } = useProductsStore.getState();
    
    await cargarProductos();
    
    const resultado = await actualizarProducto(1, { isActivo: Estado.inactivo });
    
    expect(mockProductosService.actualizarProducto).toHaveBeenCalledWith(1, { isActivo: Estado.inactivo });
    expect(resultado.success).toBe(true);
  });

  test('debe manejar errores cuando el producto no existe', async () => {
    mockProductosService.obtenerProductoPorId.mockResolvedValueOnce(null);
    
    const { obtenerProducto } = useProductsStore.getState();
    const producto = await obtenerProducto(999);
    
    expect(producto).toBeNull();
  });
});
