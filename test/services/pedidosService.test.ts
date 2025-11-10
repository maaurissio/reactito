import { describe, expect, test, beforeEach } from 'vitest';
import {
  crearPedido,
  obtenerPedido,
  obtenerPedidosUsuario,
  obtenerTodosLosPedidos,
  marcarPedidosComoLeidos,
  actualizarEstadoPedido,
  type IPedido
} from '../../src/services/pedidos.service';

describe('Prueba del servicio de pedidos (pedidosService)', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });

  const datosContactoPrueba = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@test.com',
    telefono: '+56 9 1234 5678'
  };

  const datosEnvioPrueba = {
    direccion: 'Av. Siempre Viva 123',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    codigoPostal: '8320000',
    notas: 'Dejar en portería',
    costo: 3000,
    esGratis: false
  };

  const itemsPrueba = [
    {
      id: 1,
      nombre: 'Manzana Fuji',
      precio: 2500,
      cantidad: 2,
      subtotal: 5000
    },
    {
      id: 2,
      nombre: 'Pera',
      precio: 3000,
      cantidad: 1,
      subtotal: 3000
    }
  ];

  test('debe crear un pedido correctamente', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    expect(resultado.success).toBe(true);
    expect(resultado.pedido).not.toBeUndefined();
    expect(resultado.pedido?.contacto.email).toBe('juan@test.com');
    expect(resultado.pedido?.total).toBe(11000);
  });

  test('debe obtener un pedido por ID correctamente', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    const pedidoId = resultado.pedido?.id || '';
    const pedidoObtenido = obtenerPedido(pedidoId);

    expect(pedidoObtenido).not.toBeNull();
    expect(pedidoObtenido?.id).toBe(pedidoId);
  });

  test('debe obtener todos los pedidos existentes', () => {
    crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);
    crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);
    crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);

    const todosPedidos = obtenerTodosLosPedidos();
    
    expect(todosPedidos.length).toBe(3);
  });

  test('debe actualizar el estado de un pedido correctamente', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    const pedidoId = resultado.pedido?.id || '';
    const resultadoActualizacion = actualizarEstadoPedido(pedidoId, 'enviado');

    expect(resultadoActualizacion.success).toBe(true);

    const pedidoActualizado = obtenerPedido(pedidoId);
    expect(pedidoActualizado?.estado).toBe('enviado');
  });

  test('debe calcular correctamente el total del pedido', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000, // subtotal
      3000, // costo envío
      11000 // total
    );

    expect(resultado.pedido?.subtotal).toBe(8000);
    expect(resultado.pedido?.costoEnvio).toBe(3000);
    expect(resultado.pedido?.total).toBe(11000);
  });

  test('debe almacenar correctamente los items del pedido', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    expect(resultado.pedido?.items.length).toBe(2);
    expect(resultado.pedido?.items[0].nombre).toBe('Manzana Fuji');
    expect(resultado.pedido?.items[1].nombre).toBe('Pera');
  });

  test('debe retornar array vacío si no hay pedidos para un usuario', () => {
    const pedidos = obtenerPedidosUsuario('noexiste@test.com');
    
    expect(pedidos).toEqual([]);
  });
});
