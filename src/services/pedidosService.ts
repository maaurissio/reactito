import type { IUsuario } from '../types/models';

export interface IPedido {
  id: string;
  fecha: string;
  estado: 'confirmado' | 'en-preparacion' | 'enviado' | 'entregado' | 'cancelado';
  leido?: boolean; // Flag para marcar si el admin ya vio el pedido
  usuario?: IUsuario;
  contacto: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  envio: {
    direccion: string;
    ciudad: string;
    region: string;
    codigoPostal?: string;
    notas?: string;
    costo: number;
    esGratis: boolean;
  };
  items: Array<{
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    subtotal: number;
  }>;
  subtotal: number;
  costoEnvio: number;
  total: number;
}

interface DatosPedidos {
  pedidos: IPedido[];
}

const STORAGE_KEY = 'huerto_hogar_pedidos';

function obtenerDatosPedidos(): DatosPedidos {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { pedidos: [] };
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al parsear datos de pedidos:', error);
    return { pedidos: [] };
  }
}

function guardarDatosPedidos(datos: DatosPedidos): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

function generarIdPedido(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

export function crearPedido(
  usuario: IUsuario | null,
  contacto: {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  },
  envio: {
  direccion: string;
  ciudad: string;
  region: string;
  codigoPostal?: string;
  notas?: string;
  costo: number;
  esGratis: boolean;
  },
  items: Array<{
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
  }>,
  subtotal: number,
  costoEnvio: number,
  total: number
): { success: boolean; pedido?: IPedido; mensaje?: string } {
  try {
    const datos = obtenerDatosPedidos();

    const nuevoPedido: IPedido = {
      id: generarIdPedido(),
      fecha: new Date().toISOString(),
      estado: 'confirmado',
      leido: false, // Nuevo pedido no leído por el admin
      usuario: usuario || undefined,
      contacto,
      envio,
      items,
      subtotal,
      costoEnvio,
      total
    };

    datos.pedidos.push(nuevoPedido);
    guardarDatosPedidos(datos);

    return {
      success: true,
      pedido: nuevoPedido,
      mensaje: 'Pedido creado exitosamente'
    };
  } catch (error) {
    console.error('Error al crear pedido:', error);
    return {
      success: false,
      mensaje: 'Error al crear el pedido'
    };
  }
}

export function obtenerPedido(id: string): IPedido | null {
  const datos = obtenerDatosPedidos();
  return datos.pedidos.find(p => p.id === id) || null;
}

export function obtenerPedidosUsuario(email: string): IPedido[] {
  const datos = obtenerDatosPedidos();
  return datos.pedidos.filter(p => p.contacto.email === email);
}

export function obtenerTodosLosPedidos(): IPedido[] {
  const datos = obtenerDatosPedidos();
  return datos.pedidos;
}

export function marcarPedidosComoLeidos(ids: string[]): { success: boolean; mensaje: string } {
  try {
    const datos = obtenerDatosPedidos();

    ids.forEach(id => {
      const pedido = datos.pedidos.find(p => p.id === id);
      if (pedido) {
        pedido.leido = true;
      }
    });

    guardarDatosPedidos(datos);

    return {
      success: true,
      mensaje: 'Pedidos marcados como leídos'
    };
  } catch (error) {
    console.error('Error al marcar pedidos como leídos:', error);
    return {
      success: false,
      mensaje: 'Error al marcar pedidos como leídos'
    };
  }
}

export function actualizarEstadoPedido(
  id: string,
  nuevoEstado: IPedido['estado']
): { success: boolean; mensaje: string } {
  try {
    const datos = obtenerDatosPedidos();
    const index = datos.pedidos.findIndex(p => p.id === id);

    if (index === -1) {
      return {
        success: false,
        mensaje: 'Pedido no encontrado'
      };
    }

    datos.pedidos[index].estado = nuevoEstado;
    guardarDatosPedidos(datos);

    return {
      success: true,
      mensaje: 'Estado del pedido actualizado'
    };
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    return {
      success: false,
      mensaje: 'Error al actualizar el estado del pedido'
    };
  }
}
