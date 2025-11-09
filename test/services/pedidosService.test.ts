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

  test('debe generar un ID único para cada pedido', () => {
    const resultado1 = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    const resultado2 = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    expect(resultado1.pedido?.id).not.toBe(resultado2.pedido?.id);
  });

  test('debe establecer el estado inicial como "confirmado"', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    expect(resultado.pedido?.estado).toBe('confirmado');
  });

  test('debe marcar el pedido como no leído por defecto', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    expect(resultado.pedido?.leido).toBe(false);
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

  test('debe retornar null si el pedido no existe', () => {
    const pedido = obtenerPedido('ID-INEXISTENTE');
    
    expect(pedido).toBeNull();
  });

  test('debe obtener todos los pedidos de un usuario por email', () => {
    // Crear 2 pedidos para el mismo usuario
    crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);
    crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);

    // Crear 1 pedido para otro usuario
    const otroContacto = { ...datosContactoPrueba, email: 'otro@test.com' };
    crearPedido(null, otroContacto, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);

    const pedidosJuan = obtenerPedidosUsuario('juan@test.com');
    
    expect(pedidosJuan.length).toBe(2);
    pedidosJuan.forEach(pedido => {
      expect(pedido.contacto.email).toBe('juan@test.com');
    });
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

  test('debe retornar error al actualizar estado de pedido inexistente', () => {
    const resultado = actualizarEstadoPedido('ID-INEXISTENTE', 'enviado');
    
    expect(resultado.success).toBe(false);
    expect(resultado.mensaje).toBe('Pedido no encontrado');
  });

  test('debe marcar pedidos como leídos correctamente', () => {
    const resultado1 = crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);
    const resultado2 = crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);

    const id1 = resultado1.pedido?.id || '';
    const id2 = resultado2.pedido?.id || '';

    const resultadoMarcado = marcarPedidosComoLeidos([id1, id2]);
    
    expect(resultadoMarcado.success).toBe(true);

    const pedido1 = obtenerPedido(id1);
    const pedido2 = obtenerPedido(id2);

    expect(pedido1?.leido).toBe(true);
    expect(pedido2?.leido).toBe(true);
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

  test('debe almacenar correctamente los datos de envío', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    expect(resultado.pedido?.envio.direccion).toBe('Av. Siempre Viva 123');
    expect(resultado.pedido?.envio.ciudad).toBe('Santiago');
    expect(resultado.pedido?.envio.region).toBe('Metropolitana');
    expect(resultado.pedido?.envio.notas).toBe('Dejar en portería');
  });

  test('debe almacenar correctamente los datos de contacto', () => {
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      datosEnvioPrueba,
      itemsPrueba,
      8000,
      3000,
      11000
    );

    expect(resultado.pedido?.contacto.nombre).toBe('Juan');
    expect(resultado.pedido?.contacto.apellido).toBe('Pérez');
    expect(resultado.pedido?.contacto.telefono).toBe('+56 9 1234 5678');
  });

  test('debe manejar pedidos con envío gratis correctamente', () => {
    const envioGratis = { ...datosEnvioPrueba, costo: 0, esGratis: true };
    
    const resultado = crearPedido(
      null,
      datosContactoPrueba,
      envioGratis,
      itemsPrueba,
      8000,
      0,
      8000
    );

    expect(resultado.pedido?.envio.esGratis).toBe(true);
    expect(resultado.pedido?.costoEnvio).toBe(0);
  });

  test('debe retornar array vacío si no hay pedidos para un usuario', () => {
    const pedidos = obtenerPedidosUsuario('noexiste@test.com');
    
    expect(pedidos).toEqual([]);
  });

  test('debe actualizar pedido a diferentes estados correctamente', () => {
    const resultado = crearPedido(null, datosContactoPrueba, datosEnvioPrueba, itemsPrueba, 8000, 3000, 11000);
    const pedidoId = resultado.pedido?.id || '';

    actualizarEstadoPedido(pedidoId, 'en-preparacion');
    expect(obtenerPedido(pedidoId)?.estado).toBe('en-preparacion');

    actualizarEstadoPedido(pedidoId, 'enviado');
    expect(obtenerPedido(pedidoId)?.estado).toBe('enviado');

    actualizarEstadoPedido(pedidoId, 'entregado');
    expect(obtenerPedido(pedidoId)?.estado).toBe('entregado');
  });
});
