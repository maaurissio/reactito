/**
 * Servicio de Reseñas - Consume API del backend
 */

import { apiGet, apiPost, apiPut, apiDelete } from './api';

// ============================================
// INTERFACES
// ============================================

export interface IResenaAPI {
  id: number;
  productoId: number;
  usuarioId: number;
  nombreUsuario: string;
  puntuacion: number;
  comentario: string;
  fechaCreacion: string;
  verificado: boolean;
}

export interface IResenaConProducto extends IResenaAPI {
  productoNombre: string;
  productoImagen: string;
}

export interface IResumenResenas {
  productoId: number;
  promedioCalificacion: number;
  totalResenas: number;
  distribucion: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface IPaginacion<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ICrearResenaDTO {
  puntuacion: number;
  comentario: string;
}

export interface IReportarResenaDTO {
  motivo: 'spam' | 'inapropiado' | 'falso' | 'otro';
  descripcion?: string;
}

// ============================================
// FUNCIONES DEL SERVICIO
// ============================================

/**
 * Obtener reseñas de un producto (público)
 */
export async function obtenerResenasProducto(
  productoId: number,
  page: number = 0,
  size: number = 10,
  sort: string = 'fecha,desc'
): Promise<IPaginacion<IResenaAPI>> {
  return apiGet<IPaginacion<IResenaAPI>>(
    `/productos/${productoId}/resenas?page=${page}&size=${size}&sort=${sort}`
  );
}

/**
 * Obtener resumen/estadísticas de reseñas de un producto (público)
 */
export async function obtenerResumenResenas(productoId: number): Promise<IResumenResenas> {
  return apiGet<IResumenResenas>(`/productos/${productoId}/resenas/resumen`);
}

/**
 * Crear una reseña (requiere autenticación + haber comprado el producto)
 */
export async function crearResena(
  productoId: number,
  data: ICrearResenaDTO
): Promise<IResenaAPI> {
  return apiPost<IResenaAPI>(`/productos/${productoId}/resenas`, data, true);
}

/**
 * Actualizar mi reseña
 */
export async function actualizarResena(
  productoId: number,
  resenaId: number,
  data: ICrearResenaDTO
): Promise<IResenaAPI> {
  return apiPut<IResenaAPI>(`/productos/${productoId}/resenas/${resenaId}`, data, true);
}

/**
 * Eliminar mi reseña
 */
export async function eliminarResena(
  productoId: number,
  resenaId: number
): Promise<void> {
  return apiDelete<void>(`/productos/${productoId}/resenas/${resenaId}`, undefined, true);
}

/**
 * Reportar una reseña
 */
export async function reportarResena(
  productoId: number,
  resenaId: number,
  data: IReportarResenaDTO
): Promise<{ mensaje: string; reporteId: number }> {
  return apiPost<{ mensaje: string; reporteId: number }>(
    `/productos/${productoId}/resenas/${resenaId}/reportar`,
    data,
    true
  );
}

/**
 * Obtener mis reseñas (requiere autenticación)
 */
export async function obtenerMisResenas(
  usuarioId: number,
  page: number = 0,
  size: number = 10
): Promise<IPaginacion<IResenaConProducto>> {
  return apiGet<IPaginacion<IResenaConProducto>>(
    `/usuarios/${usuarioId}/resenas?page=${page}&size=${size}`,
    true
  );
}
