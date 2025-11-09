interface ShippingConfig {
  costoEnvioBase: number;
  envioGratisDesde: number;
  envioGratisHabilitado: boolean;
}

const STORAGE_KEY = 'huerto_hogar_shipping_config';

const DEFAULT_CONFIG: ShippingConfig = {
  costoEnvioBase: 5000,
  envioGratisDesde: 50000,
  envioGratisHabilitado: true
};

export function obtenerConfiguracionEnvio(): ShippingConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al leer configuración de envío:', error);
  }
  return DEFAULT_CONFIG;
}

export function guardarConfiguracionEnvio(config: ShippingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error al guardar configuración de envío:', error);
  }
}

export function calcularCostoEnvio(subtotal: number): number {
  const config = obtenerConfiguracionEnvio();
  
  // Si el envío gratis está habilitado y el subtotal supera el mínimo
  if (config.envioGratisHabilitado && subtotal >= config.envioGratisDesde) {
    return 0;
  }
  
  return config.costoEnvioBase;
}
