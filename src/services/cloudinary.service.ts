/**
 * Servicio de Cloudinary para subir imágenes
 */

const CLOUD_NAME = 'dcpufkkbl';
const UPLOAD_PRESET = 'huerto_hogar'; // Preset sin firma (unsigned)

// URL de upload de Cloudinary
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Sube una imagen a Cloudinary
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta donde guardar (ej: 'productos', 'avatars')
 * @returns URL de la imagen subida
 */
export async function subirImagenCloudinary(
  file: File,
  folder: string = 'productos'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `huerto_hogar/${folder}`);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error Cloudinary:', error);
      return { success: false, error: error.error?.message || 'Error al subir imagen' };
    }

    const data: CloudinaryResponse = await response.json();
    
    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    return { success: false, error: 'Error de conexión al subir imagen' };
  }
}

/**
 * Sube una imagen desde base64
 * @param base64 - String base64 de la imagen
 * @param folder - Carpeta donde guardar
 */
export async function subirImagenBase64Cloudinary(
  base64: string,
  folder: string = 'productos'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', base64);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `huerto_hogar/${folder}`);

    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error Cloudinary:', error);
      return { success: false, error: error.error?.message || 'Error al subir imagen' };
    }

    const data: CloudinaryResponse = await response.json();
    
    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error);
    return { success: false, error: 'Error de conexión al subir imagen' };
  }
}

/**
 * Genera URL optimizada de Cloudinary
 * @param url - URL original de Cloudinary
 * @param width - Ancho deseado
 * @param height - Alto deseado
 */
export function optimizarUrlCloudinary(
  url: string,
  width?: number,
  height?: number
): string {
  if (!url.includes('cloudinary.com')) return url;
  
  // Insertar transformaciones después de /upload/
  const transformations = ['q_auto', 'f_auto'];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push('c_fill');
  
  return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
}
