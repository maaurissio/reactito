/**
 * Servicio de Upload de Imágenes - Consume API Backend
 */

import { apiUpload } from './api';

// ============================================
// TIPOS
// ============================================

interface UploadResponse {
  success: boolean;
  url: string;
  publicId: string;
}

// ============================================
// FUNCIONES DE UPLOAD
// ============================================

export async function subirImagen(
  file: File,
  folder: 'productos' | 'avatars' = 'productos'
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' };
    }

    // Validar tamaño (máximo 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'La imagen no debe superar los 2MB' };
    }

    // Validar formatos permitidos
    const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!formatosPermitidos.includes(file.type)) {
      return { success: false, error: 'Formato no permitido. Use JPG, PNG o WebP' };
    }

    const response = await apiUpload<UploadResponse>('/upload/imagen', file, folder);
    
    if (response.success && response.url) {
      return { success: true, url: response.url, publicId: response.publicId };
    }
    
    return { success: false, error: 'Error al subir imagen' };
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return { success: false, error: 'Error al subir imagen' };
  }
}

export async function subirImagenProducto(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return subirImagen(file, 'productos');
}

export async function subirAvatar(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  return subirImagen(file, 'avatars');
}
