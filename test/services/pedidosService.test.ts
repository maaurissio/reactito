import { describe, expect, test, beforeEach, vi } from 'vitest';
import type { IUsuario } from '../../src/types';
import { Estado, RolUsuario } from '../../src/types';

// Usar vi.hoisted para crear mocks que se levanten antes que las importaciones
const mocks = vi.hoisted(() => {
  const pedidosCreados: any[] = [];

  return {
    pedidosCreados,
    crearPedido: vi.fn((...args: any[]) => {
      const nuevoPedido = {
        id: `PED-${Date.now()}-${pedidosCreados.length}`,
        fecha: new Date().toISOString(),
        estado: 'confirmado' as const,
        contacto: args[1],
        envio: args[2],
        items: args[3],
        subtotal: args[4],
        costoEnvio: args[5],
        total: args[6],
        usuarioId: args[0]?.id || null,
      };
      pedidosCreados.push(nuevoPedido);
      return Promise.resolve({ success: true, pedido: nuevoPedido });
    }),
    obtenerPedido: vi.fn((id: string) => {
      return Promise.resolve(pedidosCreados.find(p => p.id === id) || null);
    }),
    obtenerTodosLosPedidos: vi.fn(() => {
      return Promise.resolve(pedidosCreados);
    }),
    obtenerPedidosUsuario: vi.fn((email: string) => {
      return Promise.resolve(pedidosCreados.filter(p => p.contacto?.email === email));
    }),
    actualizarEstadoPedido: vi.fn((id: string, estado: string) => {
      const pedido = pedidosCreados.find(p => p.id === id);
      if (pedido) {
        pedido.estado = estado;
        return Promise.resolve({ success: true, mensaje: 'Estado actualizado' });
      }
      return Promise.resolve({ success: false, error: 'Pedido no encontrado' });
    }),
    reset: () => {
      pedidosCreados.length = 0;
      mocks.crearPedido.mockClear();
      mocks.obtenerPedido.mockClear();
      mocks.obtenerTodosLosPedidos.mockClear();
      mocks.obtenerPedidosUsuario.mockClear();
      mocks.actualizarEstadoPedido.mockClear();
    }
  };
});

// Mock del servicio de pedidos
vi.mock('../../src/services/pedidos.api.service', () => ({
  crearPedido: mocks.crearPedido,
  obtenerPedido: mocks.obtenerPedido,
  obtenerTodosLosPedidos: mocks.obtenerTodosLosPedidos,
  obtenerPedidosUsuario: mocks.obtenerPedidosUsuario,
  actualizarEstadoPedido: mocks.actualizarEstadoPedido,
}));

// Importar después del mock
import {
  crearPedido,
  obtenerPedido,
  obtenerTodosLosPedidos,
  actualizarEstadoPedido,
  obtenerPedidosUsuario,
} from '../../src/services/pedidos.api.service';

describe('Prueba del servicio de pedidos API (pedidos.api.service)', () => {
  
  beforeEach(() => {
    mocks.reset();
    localStorage.clear();
  });

  // Datos de prueba con la estructura correcta del servicio
  const usuarioPrueba: IUsuario = {
    id: 1,
    email: 'juan@test.com',
    usuario: 'juanperez',
    password: 'password123',
    nombre: 'Juan',
    apellido: 'Pérez',
    rol: RolUsuario.cliente,
    isActivo: Estado.activo,
    fechaRegistro: '2025-01-01',
  };
  
  const contactoPrueba = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@test.com',
    telefono: '+56 9 1234 5678'
  };

  const envioPrueba = {
    direccion: 'Av. Siempre Viva 123',
    ciudad: 'Santiago',
    region: 'Metropolitana',
    codigoPostal: '8320000',
    notas: 'Dejar en portería',
    costo: 3000,
    esGratis: false
  };

  const itemsPrueba = [
    { id: 1, nombre: 'Manzana Fuji', precio: 2500, cantidad: 2, subtotal: 5000 },
    { id: 2, nombre: 'Pera', precio: 3000, cantidad: 1, subtotal: 3000 }
  ];

  const subtotalPrueba = 8000;
  const costoEnvioPrueba = 3000;
  const totalPrueba = 11000;

  test('debe crear un pedido correctamente', async () => {
    const resultado = await crearPedido(
      usuarioPrueba,
      contactoPrueba,
      envioPrueba,
      itemsPrueba,
      subtotalPrueba,
      costoEnvioPrueba,
      totalPrueba
    );

    expect(mocks.crearPedido).toHaveBeenCalled();
    expect(resultado.success).toBe(true);
    expect(resultado.pedido).toBeDefined();
    expect(resultado.pedido?.id).toBeDefined();
    expect(resultado.pedido?.estado).toBe('confirmado');
  });

  test('debe obtener un pedido por ID correctamente', async () => {
    // Primero crear un pedido
    const resultadoCrear = await crearPedido(
      usuarioPrueba,
      contactoPrueba,
      envioPrueba,
      itemsPrueba,
      subtotalPrueba,
      costoEnvioPrueba,
      totalPrueba
    );
    const pedidoId = resultadoCrear.pedido?.id || '';
    
    // Luego obtenerlo
    const pedidoObtenido = await obtenerPedido(pedidoId);

    expect(mocks.obtenerPedido).toHaveBeenCalledWith(pedidoId);
    expect(pedidoObtenido).not.toBeNull();
    expect(pedidoObtenido?.id).toBe(pedidoId);
  });

  test('debe obtener todos los pedidos existentes', async () => {
    // Crear varios pedidos
    await crearPedido(usuarioPrueba, contactoPrueba, envioPrueba, itemsPrueba, subtotalPrueba, costoEnvioPrueba, totalPrueba);
    await crearPedido(usuarioPrueba, contactoPrueba, envioPrueba, itemsPrueba, subtotalPrueba, costoEnvioPrueba, totalPrueba);
    await crearPedido(usuarioPrueba, contactoPrueba, envioPrueba, itemsPrueba, subtotalPrueba, costoEnvioPrueba, totalPrueba);

    const todosPedidos = await obtenerTodosLosPedidos();
    
    expect(mocks.obtenerTodosLosPedidos).toHaveBeenCalled();
    expect(todosPedidos.length).toBe(3);
  });

  test('debe actualizar el estado de un pedido correctamente', async () => {
    // Crear pedido
    const resultadoCrear = await crearPedido(
      usuarioPrueba,
      contactoPrueba,
      envioPrueba,
      itemsPrueba,
      subtotalPrueba,
      costoEnvioPrueba,
      totalPrueba
    );
    const pedidoId = resultadoCrear.pedido?.id || '';
    
    // Actualizar estado
    const resultadoActualizacion = await actualizarEstadoPedido(pedidoId, 'enviado');

    expect(mocks.actualizarEstadoPedido).toHaveBeenCalledWith(pedidoId, 'enviado');
    expect(resultadoActualizacion.success).toBe(true);
  });

  test('debe retornar array vacío si no hay pedidos para un usuario', async () => {
    const pedidos = await obtenerPedidosUsuario('inexistente@test.com');
    
    expect(pedidos).toEqual([]);
  });

  test('debe filtrar pedidos por email de usuario correctamente', async () => {
    // Crear pedidos para diferentes emails
    const contacto1 = { ...contactoPrueba, email: 'usuario1@test.com' };
    const contacto2 = { ...contactoPrueba, email: 'usuario2@test.com' };
    
    await crearPedido(usuarioPrueba, contacto1, envioPrueba, itemsPrueba, subtotalPrueba, costoEnvioPrueba, totalPrueba);
    await crearPedido(usuarioPrueba, contacto1, envioPrueba, itemsPrueba, subtotalPrueba, costoEnvioPrueba, totalPrueba);
    await crearPedido(usuarioPrueba, contacto2, envioPrueba, itemsPrueba, subtotalPrueba, costoEnvioPrueba, totalPrueba);

    const pedidosUsuario1 = await obtenerPedidosUsuario('usuario1@test.com');
    
    expect(pedidosUsuario1.length).toBe(2);
  });
});
