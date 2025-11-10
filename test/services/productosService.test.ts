import { describe, expect, test, beforeEach } from 'vitest';
import {
  obtenerDatosProductos,
  obtenerProductoPorId,
  obtenerProductosPorCategoria,
  buscarProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  resetearProductos
} from '../../src/services/productos.service';
import { Estado } from '../../src/types';

describe('Prueba del servicio de productos (productosService)', () => {
  
  beforeEach(() => {
    resetearProductos();
  });

  test('debe agregar un nuevo producto correctamente', () => {
    const datosAntes = obtenerDatosProductos();
    const cantidadAntes = datosAntes.productos.length;
    
    const nuevoProducto = agregarProducto({
      nombre: 'Producto Test',
      descripcion: 'Descripción de prueba',
      precio: 5000,
      stock: 20,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    expect(nuevoProducto).toBeDefined();
    expect(nuevoProducto.nombre).toBe('Producto Test');
    
    const datosDespues = obtenerDatosProductos();
    expect(datosDespues.productos.length).toBe(cantidadAntes + 1);
  });

  test('debe generar ID único al agregar producto', () => {
    const producto1 = agregarProducto({
      nombre: 'Producto 1',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    const producto2 = agregarProducto({
      nombre: 'Producto 2',
      descripcion: 'Test',
      precio: 2000,
      stock: 20,
      categoria: 'Verduras',
      imagen: 'test2.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    expect(producto1.id).not.toBe(producto2.id);
  });

  test('debe actualizar un producto existente correctamente', () => {
    const datos = obtenerDatosProductos();
    const productoOriginal = datos.productos[0];
    
    const productoActualizado = actualizarProducto(productoOriginal.id, {
      nombre: 'Nombre Actualizado',
      precio: 99999
    });
    
    expect(productoActualizado).not.toBeUndefined();
    expect(productoActualizado?.nombre).toBe('Nombre Actualizado');
    expect(productoActualizado?.precio).toBe(99999);
  });

  test('debe eliminar un producto correctamente', () => {
    const datos = obtenerDatosProductos();
    const productoId = datos.productos[0].id;
    const cantidadAntes = datos.productos.length;
    
    const eliminado = eliminarProducto(productoId);
    
    expect(eliminado).toBe(true);
    
    const datosDespues = obtenerDatosProductos();
    expect(datosDespues.productos.length).toBe(cantidadAntes - 1);
    expect(obtenerProductoPorId(productoId)).toBeUndefined();
  });
});
