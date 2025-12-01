/**
 * Servicio de Productos - Consume API Backend
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete, isApiError } from './api';
import type { IProducto } from '../types';

// ============================================
// TIPOS DE RESPUESTA
// ============================================

interface ProductosResponse {
  success: boolean;
  productos: IProducto[];
}

interface ProductoResponse {
  success: boolean;
  producto: IProducto;
}

interface MensajeResponse {
  success: boolean;
  mensaje: string;
}

// ============================================
// FUNCIONES DE PRODUCTOS
// ============================================

export async function obtenerTodosLosProductos(params?: {
  categoria?: string;
  buscar?: string;
  activos?: boolean;
}): Promise<IProducto[]> {
  try {
    let endpoint = '/productos';
    const queryParams = new URLSearchParams();
    
    if (params?.categoria) {
      queryParams.append('categoria', params.categoria);
    }
    if (params?.buscar) {
      queryParams.append('buscar', params.buscar);
    }
    if (params?.activos !== undefined) {
      queryParams.append('activos', String(params.activos));
    }
    
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }

    const response = await apiGet<ProductosResponse>(endpoint);
    return response.productos || [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

export async function obtenerProductoPorId(id: number): Promise<IProducto | null> {
  try {
    const response = await apiGet<ProductoResponse>(`/productos/${id}`);
    return response.producto || null;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return null;
  }
}

export async function agregarProducto(
  producto: Omit<IProducto, 'id' | 'codigo' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<{ success: boolean; producto?: IProducto; error?: string }> {
  try {
    const response = await apiPost<ProductoResponse>('/productos', producto, true);
    
    if (response.success && response.producto) {
      return { success: true, producto: response.producto };
    }
    
    return { success: false, error: 'Error al crear producto' };
  } catch (error) {
    if (isApiError(error)) {
      const apiError = error as { error?: string };
      return { success: false, error: apiError.error || 'Error al crear producto' };
    }
    console.error('Error al agregar producto:', error);
    return { success: false, error: 'Error al crear producto' };
  }
}

export async function actualizarProducto(
  id: number,
  cambios: Partial<IProducto>
): Promise<{ success: boolean; producto?: IProducto; error?: string }> {
  try {
    const response = await apiPut<ProductoResponse>(`/productos/${id}`, cambios, true);
    
    if (response.success && response.producto) {
      return { success: true, producto: response.producto };
    }
    
    return { success: false, error: 'Error al actualizar producto' };
  } catch (error) {
    if (isApiError(error)) {
      const apiError = error as { error?: string };
      return { success: false, error: apiError.error || 'Error al actualizar' };
    }
    console.error('Error al actualizar producto:', error);
    return { success: false, error: 'Error al actualizar producto' };
  }
}

export async function actualizarStockProducto(
  id: number,
  stock: number
): Promise<{ success: boolean; producto?: IProducto; error?: string }> {
  try {
    const response = await apiPatch<ProductoResponse>(`/productos/${id}/stock`, { stock }, true);
    
    if (response.success && response.producto) {
      return { success: true, producto: response.producto };
    }
    
    return { success: false, error: 'Error al actualizar stock' };
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    return { success: false, error: 'Error al actualizar stock' };
  }
}

export async function eliminarProducto(
  id: number
): Promise<{ success: boolean; mensaje?: string; error?: string }> {
  try {
    const response = await apiDelete<MensajeResponse>(`/productos/${id}`, undefined, true);
    return { success: response.success, mensaje: response.mensaje };
  } catch (error) {
    if (isApiError(error)) {
      return { success: false, error: 'Error al eliminar producto' };
    }
    console.error('Error al eliminar producto:', error);
    return { success: false, error: 'Error al eliminar producto' };
  }
}

export async function buscarProductos(termino: string): Promise<IProducto[]> {
  return obtenerTodosLosProductos({ buscar: termino, activos: true });
}

export async function obtenerProductosPorCategoria(categoria: string): Promise<IProducto[]> {
  return obtenerTodosLosProductos({ categoria, activos: true });
}
