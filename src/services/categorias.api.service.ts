/**
 * Servicio de Categorías - Consume API Backend
 */

import { apiGet, apiPost, apiDelete, isApiError } from './api';

// ============================================
// TIPOS
// ============================================

export interface ICategoria {
  value: string;
  label: string;
  codigo: string;
}

interface CategoriasResponse {
  success: boolean;
  categorias: ICategoria[];
}

interface CategoriaResponse {
  success: boolean;
  categoria: ICategoria;
}

interface MensajeResponse {
  success: boolean;
  mensaje: string;
}

// ============================================
// FUNCIONES DE CATEGORÍAS
// ============================================

export async function obtenerCategorias(): Promise<ICategoria[]> {
  try {
    const response = await apiGet<CategoriasResponse>('/categorias');
    return response.categorias || [];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    // Retornar categorías por defecto en caso de error
    return [
      { value: 'Frutas Frescas', label: 'Frutas Frescas', codigo: 'FR' },
      { value: 'Verduras Orgánicas', label: 'Verduras Orgánicas', codigo: 'VR' },
      { value: 'Productos Orgánicos', label: 'Productos Orgánicos', codigo: 'PO' },
      { value: 'Productos Lácteos', label: 'Productos Lácteos', codigo: 'LO' },
    ];
  }
}

export async function agregarCategoria(
  nombre: string,
  codigo: string
): Promise<{ success: boolean; categoria?: ICategoria; error?: string }> {
  try {
    const response = await apiPost<CategoriaResponse>(
      '/categorias',
      { nombre, codigo },
      true
    );
    
    if (response.success && response.categoria) {
      return { success: true, categoria: response.categoria };
    }
    
    return { success: false, error: 'Error al crear categoría' };
  } catch (error) {
    if (isApiError(error)) {
      const apiError = error as { error?: string };
      return { success: false, error: apiError.error || 'Error al crear categoría' };
    }
    console.error('Error al agregar categoría:', error);
    return { success: false, error: 'Error al crear categoría' };
  }
}

export async function eliminarCategoria(
  value: string
): Promise<{ success: boolean; mensaje?: string; error?: string }> {
  try {
    const response = await apiDelete<MensajeResponse>(
      `/categorias/${encodeURIComponent(value)}`,
      undefined,
      true
    );
    return { success: response.success, mensaje: response.mensaje };
  } catch (error) {
    if (isApiError(error)) {
      const apiError = error as { error?: string; mensaje?: string };
      return { success: false, error: apiError.error || apiError.mensaje || 'No se puede eliminar la categoría' };
    }
    console.error('Error al eliminar categoría:', error);
    return { success: false, error: 'Error al eliminar categoría' };
  }
}
