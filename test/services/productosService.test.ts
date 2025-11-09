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

  test('debe cargar datos iniciales de productos', () => {
    const datos = obtenerDatosProductos();
    
    expect(datos.productos.length).toBeGreaterThan(0);
    expect(datos.configuracion).toBeDefined();
  });

  test('debe tener configuración válida en datos iniciales', () => {
    const datos = obtenerDatosProductos();
    
    expect(datos.configuracion.proximoId).toBeGreaterThan(0);
    expect(datos.configuracion.version).toBeDefined();
    expect(datos.configuracion.categorias.length).toBeGreaterThan(0);
  });

  test('debe obtener un producto por ID correctamente', () => {
    const datos = obtenerDatosProductos();
    const primerProductoId = datos.productos[0].id;
    
    const producto = obtenerProductoPorId(primerProductoId);
    
    expect(producto).not.toBeUndefined();
    expect(producto?.id).toBe(primerProductoId);
  });

  test('debe retornar undefined si el producto no existe', () => {
    const producto = obtenerProductoPorId(99999);
    
    expect(producto).toBeUndefined();
  });

  test('debe filtrar productos por categoría', () => {
    const datos = obtenerDatosProductos();
    const primeraCategoria = datos.productos[0].categoria;
    
    const productosFiltrados = obtenerProductosPorCategoria(primeraCategoria);
    
    expect(productosFiltrados.length).toBeGreaterThan(0);
    productosFiltrados.forEach(p => {
      expect(p.categoria).toBe(primeraCategoria);
      expect(p.isActivo).toBe(Estado.activo);
    });
  });

  test('debe buscar productos por nombre', () => {
    const datos = obtenerDatosProductos();
    const nombreBuscar = datos.productos[0].nombre.substring(0, 5);
    
    const resultados = buscarProductos(nombreBuscar);
    
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados[0].nombre.toLowerCase()).toContain(nombreBuscar.toLowerCase());
  });

  test('debe buscar productos por código', () => {
    const datos = obtenerDatosProductos();
    const codigoBuscar = datos.productos[0].codigo.substring(0, 4);
    
    const resultados = buscarProductos(codigoBuscar);
    
    expect(resultados.length).toBeGreaterThan(0);
  });

  test('debe buscar productos por descripción', () => {
    const datos = obtenerDatosProductos();
    const primerProducto = datos.productos.find(p => p.descripcion && p.descripcion.length > 5);
    
    if (primerProducto) {
      const palabraBuscar = primerProducto.descripcion.split(' ')[0];
      const resultados = buscarProductos(palabraBuscar);
      
      expect(resultados.length).toBeGreaterThan(0);
    }
  });

  test('debe ser case-insensitive en la búsqueda', () => {
    const datos = obtenerDatosProductos();
    const nombreProducto = datos.productos[0].nombre;
    
    const resultadosMinuscula = buscarProductos(nombreProducto.toLowerCase());
    const resultadosMayuscula = buscarProductos(nombreProducto.toUpperCase());
    
    expect(resultadosMinuscula.length).toBeGreaterThan(0);
    expect(resultadosMayuscula.length).toBeGreaterThan(0);
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

  test('debe generar código automático al agregar producto', () => {
    const nuevoProducto = agregarProducto({
      nombre: 'Producto Test',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    expect(nuevoProducto.codigo).toBeDefined();
    expect(nuevoProducto.codigo).toContain('PR');
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

  test('debe retornar undefined al actualizar producto inexistente', () => {
    const resultado = actualizarProducto(99999, { nombre: 'Test' });
    
    expect(resultado).toBeUndefined();
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

  test('debe retornar false al eliminar producto inexistente', () => {
    const eliminado = eliminarProducto(99999);
    
    expect(eliminado).toBe(false);
  });

  test('debe normalizar precio correctamente', () => {
    const producto = agregarProducto({
      nombre: 'Test',
      descripcion: 'Test',
      precio: 1500.50,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    expect(typeof producto.precio).toBe('number');
    expect(producto.precio).toBe(1500.50);
  });

  test('debe normalizar stock correctamente (solo enteros)', () => {
    const producto = agregarProducto({
      nombre: 'Test',
      descripcion: 'Test',
      precio: 1000,
      stock: 15.7, // Debe convertirse a 15
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    expect(typeof producto.stock).toBe('number');
    expect(Number.isInteger(producto.stock)).toBe(true);
  });

  test('debe establecer fechaCreacion al agregar producto', () => {
    const producto = agregarProducto({
      nombre: 'Test',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    expect(producto.fechaCreacion).toBeDefined();
  });

  test('debe establecer fechaActualizacion al actualizar producto', () => {
    const datos = obtenerDatosProductos();
    const productoId = datos.productos[0].id;
    
    const productoActualizado = actualizarProducto(productoId, { precio: 5000 });
    
    expect(productoActualizado?.fechaActualizacion).toBeDefined();
  });

  test('debe solo retornar productos activos en búsquedas', () => {
    // Agregar producto inactivo
    const productoInactivo = agregarProducto({
      nombre: 'Producto Inactivo UNIQUE123',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.inactivo,
      peso: '1kg'
    });
    
    const resultados = buscarProductos('UNIQUE123');
    
    expect(resultados.length).toBe(0); // No debe encontrar productos inactivos
  });

  test('debe persistir datos en localStorage', () => {
    agregarProducto({
      nombre: 'Test Persistencia',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'test.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    // Obtener datos nuevamente (simula recarga)
    const datosRecargados = obtenerDatosProductos();
    const productoEncontrado = datosRecargados.productos.find(p => p.nombre === 'Test Persistencia');
    
    expect(productoEncontrado).toBeDefined();
  });

  test('debe manejar imágenes con diferentes formatos', () => {
    const producto1 = agregarProducto({
      nombre: 'Test URL',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'https://ejemplo.com/imagen.jpg',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    const producto2 = agregarProducto({
      nombre: 'Test Base64',
      descripcion: 'Test',
      precio: 1000,
      stock: 10,
      categoria: 'Frutas',
      imagen: 'data:image/jpeg;base64,/9j/4AAQ',
      isActivo: Estado.activo,
      peso: '1kg'
    });
    
    expect(producto1.imagen).toContain('https://');
    expect(producto2.imagen).toContain('data:image');
  });
});
