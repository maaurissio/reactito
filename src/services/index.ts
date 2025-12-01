// Re-exportar servicios de API (nuevos - para uso en producción)
export * from './api';
export * from './auth.service';
export * from './usuarios.api.service';
export * from './productos.api.service';
export * from './categorias.api.service';
export * from './pedidos.api.service';
export * from './envio.api.service';
export * from './upload.api.service';
export * from './resenas.api.service';

// Datos iniciales (para desarrollo/testing)
export * from './productosIniciales';
export * from './usuariosIniciales';

// NOTA: Los servicios legacy (productos.service, usuarios.service) 
// se mantienen pero NO se re-exportan aquí para evitar conflictos.
// Si necesitas usarlos, impórtalos directamente:
// import { ... } from './services/productos.service';
// import { ... } from './services/usuarios.service';
