import { describe, expect, test, beforeEach } from 'vitest';
import { useCartStore } from '../../src/store/cartStore';
import type { IProducto } from '../../src/types';

describe('Prueba del store del carrito (cartStore)', () => {
  
  // Producto de prueba
  const productoTest: IProducto = {
    id: 1,
    nombre: 'Manzana Fuji',
    codigo: 'MANZ-FUJI-001',
    descripcion: 'Manzanas frescas y dulces',
    precio: 2500,
    stock: 10,
    categoria: 'Frutas',
    imagen: 'manzana.jpg',
    isActivo: 'Activo' as any,
    resenas: []
  };

  const productoTest2: IProducto = {
    id: 2,
    nombre: 'Pera',
    codigo: 'PERA-001',
    descripcion: 'Peras frescas',
    precio: 3000,
    stock: 5,
    categoria: 'Frutas',
    imagen: 'pera.jpg',
    isActivo: 'Activo' as any,
    resenas: []
  };

  beforeEach(() => {
    localStorage.clear();
    // Limpiar el carrito antes de cada test
    useCartStore.getState().limpiarCarrito();
  });

  test('debe iniciar con el carrito vacío', () => {
    const { items, total, cantidadItems } = useCartStore.getState();
    
    expect(items).toHaveLength(0);
    expect(total).toBe(0);
    expect(cantidadItems).toBe(0);
  });

  test('debe agregar un producto al carrito correctamente', () => {
    const { agregarItem, items, cantidadItems } = useCartStore.getState();
    
    const resultado = agregarItem(productoTest, 2);
    const state = useCartStore.getState();
    
    expect(resultado).toBe(true);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].producto.id).toBe(productoTest.id);
    expect(state.items[0].cantidad).toBe(2);
    expect(state.cantidadItems).toBe(2);
  });

  test('debe calcular correctamente el subtotal al agregar un producto', () => {
    const { agregarItem } = useCartStore.getState();
    
    agregarItem(productoTest, 3);
    const state = useCartStore.getState();
    
    expect(state.items[0].subtotal).toBe(productoTest.precio * 3); // 2500 * 3 = 7500
  });

  test('debe calcular correctamente el total del carrito', () => {
    const { agregarItem } = useCartStore.getState();
    
    agregarItem(productoTest, 2); // 2500 * 2 = 5000
    agregarItem(productoTest2, 1); // 3000 * 1 = 3000
    
    const state = useCartStore.getState();
    expect(state.total).toBe(8000); // 5000 + 3000
  });

  test('debe incrementar cantidad si se agrega el mismo producto', () => {
    const { agregarItem } = useCartStore.getState();
    
    agregarItem(productoTest, 2);
    agregarItem(productoTest, 3);
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].cantidad).toBe(5);
    expect(state.cantidadItems).toBe(5);
  });

  test('debe validar stock disponible al agregar producto', () => {
    const { agregarItem } = useCartStore.getState();
    
    // Intentar agregar más del stock disponible (stock es 10)
    const resultado = agregarItem(productoTest, 11);
    
    expect(resultado).toBe(false);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  test('debe validar stock acumulado al agregar el mismo producto', () => {
    const { agregarItem } = useCartStore.getState();
    
    // Agregar 8 unidades (ok)
    const resultado1 = agregarItem(productoTest, 8);
    expect(resultado1).toBe(true);
    
    // Intentar agregar 3 más (total sería 11, pero stock es 10)
    const resultado2 = agregarItem(productoTest, 3);
    expect(resultado2).toBe(false);
    
    // La cantidad debe seguir siendo 8
    expect(useCartStore.getState().items[0].cantidad).toBe(8);
  });

  test('debe eliminar un producto del carrito correctamente', () => {
    const { agregarItem, eliminarItem } = useCartStore.getState();
    
    agregarItem(productoTest, 2);
    agregarItem(productoTest2, 1);
    
    expect(useCartStore.getState().items).toHaveLength(2);
    
    eliminarItem(productoTest.id);
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].producto.id).toBe(productoTest2.id);
  });

  test('debe recalcular el total al eliminar un producto', () => {
    const { agregarItem, eliminarItem } = useCartStore.getState();
    
    agregarItem(productoTest, 2); // 5000
    agregarItem(productoTest2, 1); // 3000
    
    expect(useCartStore.getState().total).toBe(8000);
    
    eliminarItem(productoTest.id);
    
    expect(useCartStore.getState().total).toBe(3000);
    expect(useCartStore.getState().cantidadItems).toBe(1);
  });

  test('debe actualizar la cantidad de un producto correctamente', () => {
    const { agregarItem, actualizarCantidad } = useCartStore.getState();
    
    agregarItem(productoTest, 2);
    actualizarCantidad(productoTest.id, 5);
    
    const state = useCartStore.getState();
    expect(state.items[0].cantidad).toBe(5);
    expect(state.items[0].subtotal).toBe(productoTest.precio * 5);
  });

  test('debe eliminar el producto si se actualiza cantidad a 0', () => {
    const { agregarItem, actualizarCantidad } = useCartStore.getState();
    
    agregarItem(productoTest, 2);
    actualizarCantidad(productoTest.id, 0);
    
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  test('debe eliminar el producto si se actualiza cantidad a negativo', () => {
    const { agregarItem, actualizarCantidad } = useCartStore.getState();
    
    agregarItem(productoTest, 2);
    actualizarCantidad(productoTest.id, -1);
    
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  test('debe limpiar el carrito correctamente', () => {
    const { agregarItem, limpiarCarrito } = useCartStore.getState();
    
    agregarItem(productoTest, 2);
    agregarItem(productoTest2, 3);
    
    expect(useCartStore.getState().items).toHaveLength(2);
    
    limpiarCarrito();
    
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.total).toBe(0);
    expect(state.cantidadItems).toBe(0);
  });

  test('debe calcular correctamente cantidadItems con múltiples productos', () => {
    const { agregarItem } = useCartStore.getState();
    
    agregarItem(productoTest, 3);
    agregarItem(productoTest2, 5);
    
    expect(useCartStore.getState().cantidadItems).toBe(8);
  });

  test('debe mantener el precio unitario original al agregar producto', () => {
    const { agregarItem } = useCartStore.getState();
    
    agregarItem(productoTest, 2);
    
    const state = useCartStore.getState();
    expect(state.items[0].precioUnitario).toBe(productoTest.precio);
  });

  test('debe agregar producto con cantidad por defecto de 1', () => {
    const { agregarItem } = useCartStore.getState();
    
    // No especificar cantidad (debe ser 1 por defecto)
    agregarItem(productoTest);
    
    const state = useCartStore.getState();
    expect(state.items[0].cantidad).toBe(1);
    expect(state.cantidadItems).toBe(1);
  });
});
