/**
 * Cliente API centralizado para comunicación con el backend
 * En desarrollo usa proxy de Vite, en producción usa la URL del backend
 */

// En desarrollo, usar ruta relativa (proxy de Vite)
// En producción, usar la URL completa del backend
const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:3000/api'  // Cambiar por URL de producción
  : '/api';

// ============================================
// UTILIDADES
// ============================================

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('auth_token');
}

function getHeaders(includeAuth: boolean = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// ============================================
// FUNCIONES DE REQUEST
// ============================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData = {};
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json().catch(() => ({}));
    } else {
      const textError = await response.text().catch(() => '');
      console.error('Respuesta no-JSON del servidor:', textError);
      errorData = { mensaje: textError || `Error ${response.status}` };
    }
    
    console.error(`Error HTTP ${response.status}:`, errorData);
    
    throw {
      status: response.status,
      ...errorData,
    };
  }
  return response.json();
}

export async function apiGet<T>(endpoint: string, authenticated: boolean = false): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders(authenticated),
  });
  return handleResponse<T>(response);
}

export async function apiPost<T>(endpoint: string, data: unknown, authenticated: boolean = false): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(authenticated),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function apiPut<T>(endpoint: string, data: unknown, authenticated: boolean = false): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(authenticated),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function apiPatch<T>(endpoint: string, data: unknown, authenticated: boolean = false): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getHeaders(authenticated),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function apiDelete<T>(endpoint: string, data?: unknown, authenticated: boolean = false): Promise<T> {
  const options: RequestInit = {
    method: 'DELETE',
    headers: getHeaders(authenticated),
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return handleResponse<T>(response);
}

export async function apiUpload<T>(endpoint: string, file: File, folder: string = 'productos'): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append('imagen', file);
  formData.append('folder', folder);

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleResponse<T>(response);
}

// ============================================
// TIPOS DE RESPUESTA COMUNES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  mensaje?: string;
  error?: string;
  data?: T;
}

export interface ApiError {
  status: number;
  success: boolean;
  error?: string;
  mensaje?: string;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error;
}
