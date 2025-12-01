/**
 * Servicio de Pedidos - Consume API Backend
 */

import { apiGet, apiPost, apiPatch, isApiError } from './api';
import type { IUsuario } from '../types';

// ============================================
// TIPOS
// ============================================

export interface IPedido {
  id: string;
  fecha: string;
  estado: 'confirmado' | 'en-preparacion' | 'enviado' | 'entregado' | 'cancelado';
  leido?: boolean;
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

interface PedidosResponse {
  success: boolean;
  pedidos: IPedido[];
}

interface PedidoResponse {
  success: boolean;
  pedido: IPedido;
  mensaje?: string;
}

interface MensajeResponse {
  success: boolean;
  mensaje: string;
}

// ============================================
// FUNCIONES DE PEDIDOS
// ============================================

export async function obtenerTodosLosPedidos(params?: {
  estado?: string;
  email?: string;
}): Promise<IPedido[]> {
  try {
    let endpoint = '/pedidos';
    const queryParams = new URLSearchParams();
    
    if (params?.estado) {
      queryParams.append('estado', params.estado);
    }
    if (params?.email) {
      queryParams.append('email', params.email);
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    console.log('[Pedidos] Consultando endpoint:', endpoint);
    const response = await apiGet<PedidosResponse>(endpoint, true);
    console.log('[Pedidos] Respuesta del servidor:', response);
    return response.pedidos || [];
  } catch (error) {
    console.error('[Pedidos] Error al obtener pedidos:', error);
    return [];
  }
}

export async function obtenerPedido(id: string): Promise<IPedido | null> {
  try {
    const response = await apiGet<PedidoResponse>(`/pedidos/${id}`, true);
    return response.pedido || null;
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    return null;
  }
}

export async function obtenerPedidosUsuario(email: string): Promise<IPedido[]> {
  return obtenerTodosLosPedidos({ email });
}

export async function crearPedido(
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
): Promise<{ success: boolean; pedido?: IPedido; mensaje?: string; error?: string }> {
  try {
    const datos = {
      usuarioId: usuario?.id || null,
      contacto,
      envio,
      items: items.map(item => ({
        id: item.id,
        cantidad: item.cantidad
      })),
      subtotal,
      costoEnvio,
      total
    };

    console.log('[Pedidos] Creando pedido con datos:', datos);

    // Intentar autenticado primero, si falla intentar sin auth
    let response: PedidoResponse;
    const useAuth = usuario !== null;
    
    try {
      response = await apiPost<PedidoResponse>('/pedidos', datos, useAuth);
      console.log('[Pedidos] Respuesta crear pedido:', response);
    } catch (err) {
      console.error('[Pedidos] Error en primer intento:', err);
      // Si falla con auth, intentar sin auth (compra como invitado)
      response = await apiPost<PedidoResponse>('/pedidos', datos, false);
      console.log('[Pedidos] Respuesta crear pedido (sin auth):', response);
    }
    
    if (response.success && response.pedido) {
      return { success: true, pedido: response.pedido, mensaje: response.mensaje };
    }
    
    return { success: false, error: 'Error al crear pedido' };
  } catch (error) {
    console.error('[Pedidos] Error final al crear pedido:', error);
    if (isApiError(error)) {
      const apiError = error as { error?: string; mensaje?: string };
      return { success: false, error: apiError.error || apiError.mensaje || 'Error al crear pedido' };
    }
    return { success: false, error: 'Error al crear pedido' };
  }
}

export async function actualizarEstadoPedido(
  id: string,
  nuevoEstado: IPedido['estado']
): Promise<{ success: boolean; mensaje?: string; error?: string }> {
  try {
    const response = await apiPatch<MensajeResponse>(
      `/pedidos/${id}/estado`,
      { estado: nuevoEstado },
      true
    );
    return { success: response.success, mensaje: response.mensaje };
  } catch (error) {
    if (isApiError(error)) {
      return { success: false, error: 'Error al actualizar estado' };
    }
    console.error('Error al actualizar estado:', error);
    return { success: false, error: 'Error al actualizar estado del pedido' };
  }
}

export async function marcarPedidosComoLeidos(
  ids: string[]
): Promise<{ success: boolean; mensaje?: string; error?: string }> {
  try {
    const response = await apiPatch<MensajeResponse>(
      '/pedidos/marcar-leidos',
      { ids },
      true
    );
    return { success: response.success, mensaje: response.mensaje };
  } catch (error) {
    console.error('Error al marcar pedidos como leídos:', error);
    return { success: false, error: 'Error al marcar pedidos' };
  }
}
