/**
 * Servicio de Usuarios - Consume API Backend
 */

import { apiGet, apiPut, apiDelete, isApiError } from './api';
import type { IUsuario, ISesionActiva } from '../types';
import { obtenerSesionActiva, guardarSesionActiva } from './auth.service';

// ============================================
// TIPOS DE RESPUESTA
// ============================================

interface UsuariosResponse {
  success: boolean;
  usuarios: IUsuario[];
}

interface UsuarioResponse {
  success: boolean;
  usuario: IUsuario;
}

interface MensajeResponse {
  success: boolean;
  mensaje: string;
}

// ============================================
// FUNCIONES DE USUARIOS
// ============================================

export async function obtenerTodosLosUsuarios(): Promise<IUsuario[]> {
  try {
    const response = await apiGet<UsuariosResponse>('/usuarios', true);
    return response.usuarios || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}

export async function obtenerUsuarioPorId(id: number): Promise<IUsuario | null> {
  try {
    const response = await apiGet<UsuarioResponse>(`/usuarios/${id}`, true);
    return response.usuario || null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

export async function actualizarUsuario(
  id: number,
  cambios: Partial<IUsuario>
): Promise<{ success: boolean; usuario?: IUsuario; error?: string }> {
  try {
    const response = await apiPut<UsuarioResponse>(`/usuarios/${id}`, cambios, true);
    
    if (response.success && response.usuario) {
      // Si el usuario actualizado es el mismo que está logueado, actualizar sesión
      const sesionActual = obtenerSesionActiva();
      if (sesionActual && sesionActual.id === id) {
        const nuevaSesion: ISesionActiva = {
          ...sesionActual,
          nombre: response.usuario.nombre,
          apellido: response.usuario.apellido,
          telefono: response.usuario.telefono,
          direccion: response.usuario.direccion,
          avatar: response.usuario.avatar,
        };
        guardarSesionActiva(nuevaSesion);
      }
      
      return { success: true, usuario: response.usuario };
    }
    
    return { success: false, error: 'Error al actualizar usuario' };
  } catch (error) {
    if (isApiError(error)) {
      const apiError = error as { error?: string };
      return { success: false, error: apiError.error || 'Error al actualizar' };
    }
    console.error('Error al actualizar usuario:', error);
    return { success: false, error: 'Error al actualizar usuario' };
  }
}

export async function eliminarUsuario(
  id: number,
  password?: string
): Promise<{ success: boolean; mensaje?: string; error?: string }> {
  try {
    const body = password ? { password } : undefined;
    const response = await apiDelete<MensajeResponse>(`/usuarios/${id}`, body, true);
    
    return { success: response.success, mensaje: response.mensaje };
  } catch (error) {
    if (isApiError(error)) {
      return { success: false, error: 'Contraseña incorrecta' };
    }
    console.error('Error al eliminar usuario:', error);
    return { success: false, error: 'Error al eliminar usuario' };
  }
}

export async function cambiarPassword(
  userId: number,
  passwordActual: string,
  passwordNueva: string
): Promise<{ success: boolean; mensaje?: string; error?: string }> {
  try {
    const response = await apiPut<MensajeResponse>(
      `/usuarios/${userId}/cambiar-password`,
      { passwordActual, passwordNueva },
      true
    );
    
    return { success: response.success, mensaje: response.mensaje };
  } catch (error) {
    if (isApiError(error)) {
      return { success: false, error: 'Contraseña actual incorrecta' };
    }
    console.error('Error al cambiar contraseña:', error);
    return { success: false, error: 'Error al cambiar contraseña' };
  }
}

export async function eliminarCuentaConConfirmacion(
  userId: number,
  password: string
): Promise<boolean> {
  try {
    const resultado = await eliminarUsuario(userId, password);
    return resultado.success;
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    return false;
  }
}

// Re-exportar funciones de auth.service que son comunes
export {
  obtenerSesionActiva,
  guardarSesionActiva,
  estaAutenticado,
  esAdministrador,
  cerrarSesion,
} from './auth.service';
