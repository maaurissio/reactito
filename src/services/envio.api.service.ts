/**
 * Servicio de Configuración de Envío - Consume API Backend
 */

import { apiGet, apiPut, isApiError } from './api';

// ============================================
// TIPOS
// ============================================

export interface ShippingConfig {
  costoEnvioBase: number;
  envioGratisDesde: number;
  envioGratisHabilitado: boolean;
}

interface ConfigEnvioResponse {
  success: boolean;
  configuracion: ShippingConfig;
}

// Valores por defecto
const DEFAULT_CONFIG: ShippingConfig = {
  costoEnvioBase: 5000,
  envioGratisDesde: 50000,
  envioGratisHabilitado: true,
};

// ============================================
// FUNCIONES DE CONFIGURACIÓN
// ============================================

export async function obtenerConfiguracionEnvio(): Promise<ShippingConfig> {
  try {
    const response = await apiGet<ConfigEnvioResponse>('/configuracion/envio');
    return response.configuracion || DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error al obtener configuración de envío:', error);
    return DEFAULT_CONFIG;
  }
}

export async function guardarConfiguracionEnvio(
  config: ShippingConfig
): Promise<{ success: boolean; configuracion?: ShippingConfig; error?: string }> {
  try {
    const response = await apiPut<ConfigEnvioResponse>(
      '/configuracion/envio',
      config,
      true
    );
    
    if (response.success && response.configuracion) {
      return { success: true, configuracion: response.configuracion };
    }
    
    return { success: false, error: 'Error al guardar configuración' };
  } catch (error) {
    if (isApiError(error)) {
      return { success: false, error: 'Error al guardar configuración' };
    }
    console.error('Error al guardar configuración:', error);
    return { success: false, error: 'Error al guardar configuración de envío' };
  }
}

export function calcularCostoEnvio(subtotal: number, config: ShippingConfig): number {
  // Si el envío gratis está habilitado y el subtotal supera el mínimo
  if (config.envioGratisHabilitado && subtotal >= config.envioGratisDesde) {
    return 0;
  }
  
  return config.costoEnvioBase;
}
