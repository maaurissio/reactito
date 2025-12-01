import { describe, expect, test, beforeEach, vi } from 'vitest';
import { Estado } from '../../src/types';

// Usar vi.hoisted para crear mocks que se levanten antes que las importaciones
const mocks = vi.hoisted(() => {
  const productosBase = [
    {
      id: 1,
      codigo: 'FR001',
      nombre: 'Manzanas Fuji',
      descripcion: 'Manzanas frescas y dulces',
      precio: 2500,
      stock: 50,
      imagen: 'https://example.com/manzana.jpg',
      categoria: 'Frutas Frescas',
      isActivo: 'Activo',
      peso: '1kg',
    },
    {
      id: 2,
      codigo: 'VR001',
      nombre: 'Zanahorias Orgánicas',
      descripcion: 'Zanahorias frescas orgánicas',
      precio: 1500,
      stock: 30,
      imagen: 'https://example.com/zanahoria.jpg',
      categoria: 'Verduras',
      isActivo: 'Activo',
      peso: '500g',
    },
  ];

  // Contador para IDs únicos
  let contadorId = productosBase.length;

  return {
    productosBase,
    getContador: () => contadorId,
    obtenerTodosLosProductos: vi.fn(() => Promise.resolve(productosBase)),
    obtenerProductoPorId: vi.fn((id: number) => {
      return Promise.resolve(productosBase.find(p => p.id === id) || null);
    }),
    agregarProducto: vi.fn((producto: any) => {
      contadorId++;
      const nuevoProducto = {
        id: contadorId,
        codigo: `NEW${contadorId}`,
        ...producto,
      };
      return Promise.resolve({ success: true, producto: nuevoProducto });
    }),
    actualizarProducto: vi.fn((id: number, cambios: any) => {
      const producto = productosBase.find(p => p.id === id);
      if (producto) {
        return Promise.resolve({ success: true, producto: { ...producto, ...cambios } });
      }
      return Promise.resolve({ success: false, error: 'Producto no encontrado' });
    }),
    eliminarProducto: vi.fn(() => Promise.resolve({ success: true, mensaje: 'Producto eliminado' })),
    reset: () => {
      contadorId = productosBase.length;
      mocks.obtenerTodosLosProductos.mockClear();
      mocks.obtenerProductoPorId.mockClear();
      mocks.agregarProducto.mockClear();
      mocks.actualizarProducto.mockClear();
      mocks.eliminarProducto.mockClear();
    }
  };
});

// Mock del módulo de API
vi.mock('../../src/services/productos.api.service', () => ({
  obtenerTodosLosProductos: mocks.obtenerTodosLosProductos,
  obtenerProductoPorId: mocks.obtenerProductoPorId,
  agregarProducto: mocks.agregarProducto,
  actualizarProducto: mocks.actualizarProducto,
  eliminarProducto: mocks.eliminarProducto,
  buscarProductos: mocks.obtenerTodosLosProductos,
  obtenerProductosPorCategoria: mocks.obtenerTodosLosProductos,
}));

// Importar después del mock
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
} from '../../src/services/productos.api.service';

describe('Prueba del servicio de productos API (productos.api.service)', () => {
  
  beforeEach(() => {
    mocks.reset();
  });

  test('debe obtener todos los productos correctamente', async () => {
    const productos = await obtenerTodosLosProductos();
    
    expect(mocks.obtenerTodosLosProductos).toHaveBeenCalled();
    expect(productos).toEqual(mocks.productosBase);
    expect(productos.length).toBe(2);
  });

  test('debe obtener un producto por ID correctamente', async () => {
    const producto = await obtenerProductoPorId(1);
    
    expect(mocks.obtenerProductoPorId).toHaveBeenCalledWith(1);
    expect(producto).not.toBeNull();
    expect(producto?.id).toBe(1);
    expect(producto?.nombre).toBe('Manzanas Fuji');
  });

  test('debe retornar null si el producto no existe', async () => {
    mocks.obtenerProductoPorId.mockResolvedValueOnce(null);
    
    const producto = await obtenerProductoPorId(999);
    
    expect(producto).toBeNull();
  });

  test('debe agregar un nuevo producto correctamente', async () => {
    const nuevoProducto = {
      nombre: 'Producto Test',
      descripcion: 'Descripción de prueba',
      precio: 5000,
      stock: 20,
      categoria: 'Frutas Frescas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    };
    
    const resultado = await agregarProducto(nuevoProducto);
    
    expect(mocks.agregarProducto).toHaveBeenCalled();
    expect(resultado.success).toBe(true);
    expect(resultado.producto).toBeDefined();
  });

  test('debe generar ID único al agregar producto', async () => {
    const producto1 = await agregarProducto({
      nombre: 'Producto 1',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas Frescas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
    });
    
    const producto2 = await agregarProducto({
      nombre: 'Producto 2',
      descripcion: 'Test',
      precio: 2000,
      stock: 20,
      categoria: 'Verduras',
      imagen: 'test2.jpg',
      isActivo: Estado.activo,
    });
    
    expect(producto1.producto?.id).not.toBe(producto2.producto?.id);
  });

  test('debe actualizar un producto existente correctamente', async () => {
    const resultado = await actualizarProducto(1, {
      nombre: 'Nombre Actualizado',
      precio: 99999
    });
    
    expect(mocks.actualizarProducto).toHaveBeenCalledWith(1, {
      nombre: 'Nombre Actualizado',
      precio: 99999
    });
    expect(resultado.success).toBe(true);
    expect(resultado.producto?.nombre).toBe('Nombre Actualizado');
    expect(resultado.producto?.precio).toBe(99999);
  });

  test('debe eliminar un producto correctamente', async () => {
    const resultado = await eliminarProducto(1);
    
    expect(mocks.eliminarProducto).toHaveBeenCalledWith(1);
    expect(resultado.success).toBe(true);
  });
});
