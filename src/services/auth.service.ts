/**
 * Servicio de Autenticación - Consume API Backend
 */

import { apiPost, setToken, removeToken, isApiError } from './api';
import type { ISesionActiva, IUsuario } from '../types';
import { RolUsuario } from '../types';

// ============================================
// TIPOS DE RESPUESTA
// ============================================

interface LoginResponse {
  success: boolean;
  token: string;
  usuario: {
    id: number;
    email: string;
    usuario: string;
    nombre: string;
    apellido: string;
    rol: string;
    isActivo: string;
    telefono?: string;
    direccion?: string;
    avatar?: string;
    fechaRegistro: string;
  };
}

interface RegisterResponse {
  success: boolean;
  usuario: IUsuario;
}

interface LogoutResponse {
  success: boolean;
  mensaje: string;
}

interface RecuperarPasswordResponse {
  success: boolean;
  mensaje: string;
}

interface VerificarCodigoResponse {
  success: boolean;
  valido: boolean;
}

interface RestablecerPasswordResponse {
  success: boolean;
  mensaje: string;
}

type LoginError = 'CUENTA_INEXISTENTE' | 'CREDENCIALES_INCORRECTAS' | 'CUENTA_INACTIVA';

// ============================================
// GESTIÓN DE SESIÓN LOCAL
// ============================================

const CLAVE_SESION_ACTIVA = 'sesion_activa_huertohogar';

export function obtenerSesionActiva(): ISesionActiva | null {
  try {
    const sesionAlmacenada = localStorage.getItem(CLAVE_SESION_ACTIVA);
    if (sesionAlmacenada) {
      return JSON.parse(sesionAlmacenada) as ISesionActiva;
    }
  } catch (error) {
    console.error('Error al leer sesión activa:', error);
  }
  return null;
}

export function guardarSesionActiva(sesion: ISesionActiva): void {
  try {
    localStorage.setItem(CLAVE_SESION_ACTIVA, JSON.stringify(sesion));
  } catch (error) {
    console.error('Error al guardar sesión activa:', error);
  }
}

function limpiarSesionActiva(): void {
  localStorage.removeItem(CLAVE_SESION_ACTIVA);
}

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

export async function iniciarSesion(
  emailOUsuario: string,
  password: string
): Promise<{ success: boolean; sesion?: ISesionActiva; error?: LoginError }> {
  try {
    console.log('Intentando login con:', { emailOUsuario, password: '***' });
    const response = await apiPost<LoginResponse>('/auth/login', {
      emailOUsuario,
      password,
    });
    console.log('Respuesta login:', response);

    if (response.success && response.token && response.usuario) {
      // Guardar token
      setToken(response.token);

      // Crear objeto de sesión
      const sesion: ISesionActiva = {
        id: response.usuario.id,
        usuario: response.usuario.usuario,
        email: response.usuario.email,
        nombre: response.usuario.nombre,
        apellido: response.usuario.apellido,
        rol: response.usuario.rol as RolUsuario,
        fechaLogin: new Date().toISOString(),
        telefono: response.usuario.telefono,
        direccion: response.usuario.direccion,
        avatar: response.usuario.avatar,
      };

      // Guardar sesión localmente
      guardarSesionActiva(sesion);

      return { success: true, sesion };
    }

    return { success: false, error: 'CREDENCIALES_INCORRECTAS' };
  } catch (error) {
    console.error('Error en login:', error);
    console.error('Detalles:', JSON.stringify(error, null, 2));
    if (isApiError(error)) {
      const apiError = error as { error?: LoginError; message?: string };
      return { success: false, error: apiError.error || 'CREDENCIALES_INCORRECTAS' };
    }
    return { success: false, error: 'CREDENCIALES_INCORRECTAS' };
  }
}

export async function registrarUsuario(datos: {
  email: string;
  usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  direccion?: string;
}): Promise<{ success: boolean; usuario?: IUsuario; error?: string }> {
  try {
    console.log('Registrando usuario:', { ...datos, password: '***' });
    const response = await apiPost<RegisterResponse>('/auth/register', datos);
    console.log('Respuesta del servidor:', response);

    if (response.success && response.usuario) {
      return { success: true, usuario: response.usuario };
    }

    return { success: false, error: 'Error al registrar usuario' };
  } catch (error) {
    console.error('Error en registro:', error);
    console.error('Detalles del error:', JSON.stringify(error, null, 2));
    if (isApiError(error)) {
      const apiError = error as { error?: string; message?: string; mensaje?: string };
      return { success: false, error: apiError.error || apiError.message || apiError.mensaje || 'Error al registrar' };
    }
    return { success: false, error: 'Error al registrar usuario' };
  }
}

export async function cerrarSesion(): Promise<void> {
  try {
    await apiPost<LogoutResponse>('/auth/logout', {}, true);
  } catch (error) {
    console.warn('Error al cerrar sesión en servidor:', error);
  } finally {
    // Siempre limpiar datos locales
    removeToken();
    limpiarSesionActiva();
  }
}

export async function solicitarRecuperacionPassword(
  email: string
): Promise<{ success: boolean; mensaje: string }> {
  try {
    const response = await apiPost<RecuperarPasswordResponse>('/auth/recuperar-password', { email });
    return { success: response.success, mensaje: response.mensaje };
  } catch (error) {
    if (isApiError(error)) {
      return { success: false, mensaje: 'No existe una cuenta con ese correo electrónico' };
    }
    return { success: false, mensaje: 'Error al procesar la solicitud' };
  }
}

export async function verificarCodigoRecuperacion(
  email: string,
  codigo: string
): Promise<boolean> {
  try {
    const response = await apiPost<VerificarCodigoResponse>('/auth/verificar-codigo', {
      email,
      codigo,
    });
    return response.success && response.valido;
  } catch (error) {
    console.error('Error al verificar código:', error);
    return false;
  }
}

export async function restablecerPassword(
  email: string,
  codigo: string,
  nuevaPassword: string
): Promise<boolean> {
  try {
    const response = await apiPost<RestablecerPasswordResponse>('/auth/restablecer-password', {
      email,
      codigo,
      nuevaPassword,
    });
    return response.success;
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return false;
  }
}

// ============================================
// UTILIDADES
// ============================================

export function estaAutenticado(): boolean {
  return obtenerSesionActiva() !== null;
}

export function esAdministrador(): boolean {
  const sesion = obtenerSesionActiva();
  return sesion?.rol === RolUsuario.administrador;
}
