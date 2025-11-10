import { Estado, RolUsuario } from '../types';
import type { IDataUsuarios, IUsuario, ISesionActiva } from '../types';
import { datosUsuariosIniciales } from './usuariosIniciales';

const CLAVE_DATOS_USUARIOS = 'usuarios_huertohogar_data';
const CLAVE_SESION_ACTIVA = 'sesion_activa_huertohogar';

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function clonarDatos(datos: IDataUsuarios): IDataUsuarios {
  return {
    usuarios: datos.usuarios.map((usuario) => ({ ...usuario })),
    configuracion: { ...datos.configuracion },
  };
}

function crearDatosIniciales(): IDataUsuarios {
  return clonarDatos(datosUsuariosIniciales);
}

// ============================================
// GESTIÓN DE DATOS DE USUARIOS
// ============================================

export function obtenerDatosUsuarios(): IDataUsuarios {
  try {
    const datosAlmacenados = localStorage.getItem(CLAVE_DATOS_USUARIOS);
    if (datosAlmacenados) {
      const datos: IDataUsuarios = JSON.parse(datosAlmacenados);
      return clonarDatos(datos);
    }
  } catch (error) {
    console.error('Error al leer usuarios de localStorage:', error);
  }

  const datosIniciales = crearDatosIniciales();
  guardarDatosUsuarios(datosIniciales);
  return clonarDatos(datosIniciales);
}

export function guardarDatosUsuarios(datos: IDataUsuarios): void {
  try {
    localStorage.setItem(CLAVE_DATOS_USUARIOS, JSON.stringify(datos));
  } catch (error) {
    console.error('Error al guardar usuarios en localStorage:', error);
  }
}

export function actualizarDatosUsuarios(
  transformer: (datos: IDataUsuarios) => IDataUsuarios
): IDataUsuarios {
  const actual = obtenerDatosUsuarios();
  const actualizado = transformer(actual);
  guardarDatosUsuarios(actualizado);
  return actualizado;
}

// ============================================
// GESTIÓN DE USUARIOS
// ============================================

export function obtenerTodosLosUsuarios(): IUsuario[] {
  const datos = obtenerDatosUsuarios();
  return datos.usuarios;
}

export function obtenerUsuarioPorId(id: number): IUsuario | undefined {
  const datos = obtenerDatosUsuarios();
  return datos.usuarios.find((u) => u.id === id);
}

export function obtenerUsuarioPorEmail(email: string): IUsuario | undefined {
  const datos = obtenerDatosUsuarios();
  return datos.usuarios.find((u) => u.email === email);
}

export function obtenerUsuarioPorNombreUsuario(usuario: string): IUsuario | undefined {
  const datos = obtenerDatosUsuarios();
  return datos.usuarios.find((u) => u.usuario === usuario);
}

export function registrarUsuario(nuevoUsuario: Omit<IUsuario, 'id' | 'fechaRegistro'>): IUsuario | null {
  // Verificar si el email ya existe
  if (obtenerUsuarioPorEmail(nuevoUsuario.email)) {
    return null;
  }

  // Verificar si el nombre de usuario ya existe
  if (obtenerUsuarioPorNombreUsuario(nuevoUsuario.usuario)) {
    return null;
  }

  const datosActualizados = actualizarDatosUsuarios((datos) => {
    const nuevoId = datos.configuracion.proximoId;
    const usuario: IUsuario = {
      ...nuevoUsuario,
      id: nuevoId,
      fechaRegistro: new Date().toISOString(),
      isActivo: Estado.activo,
      estado: Estado.activo,
      rol: nuevoUsuario.rol || RolUsuario.cliente,
    };
    datos.usuarios.push(usuario);
    datos.configuracion.proximoId = nuevoId + 1;
    datos.configuracion.ultimaActualizacion = new Date().toISOString();
    return datos;
  });

  return datosActualizados.usuarios[datosActualizados.usuarios.length - 1];
}

export function actualizarUsuario(id: number, cambios: Partial<IUsuario>): IUsuario | undefined {
  let usuarioActualizado: IUsuario | undefined;
  actualizarDatosUsuarios((datos) => {
    const indice = datos.usuarios.findIndex((u) => u.id === id);
    if (indice >= 0) {
      datos.usuarios[indice] = {
        ...datos.usuarios[indice],
        ...cambios,
        id,
        ultimaActualizacion: new Date().toISOString(),
      };
      usuarioActualizado = datos.usuarios[indice];
      datos.configuracion.ultimaActualizacion = new Date().toISOString();
    }
    return datos;
  });
  return usuarioActualizado;
}

export function eliminarUsuario(id: number): boolean {
  let eliminado = false;
  actualizarDatosUsuarios((datos) => {
    const indice = datos.usuarios.findIndex((u) => u.id === id);
    if (indice >= 0) {
      datos.usuarios.splice(indice, 1);
      eliminado = true;
      datos.configuracion.ultimaActualizacion = new Date().toISOString();
    }
    return datos;
  });
  return eliminado;
}

// ============================================
// AUTENTICACIÓN
// ============================================

export function iniciarSesion(emailOUsuario: string, password: string): ISesionActiva | null {
  const datos = obtenerDatosUsuarios();
  const usuario = datos.usuarios.find(
    (u) =>
      (u.email === emailOUsuario || u.usuario === emailOUsuario) &&
      u.password === password &&
      u.isActivo === Estado.activo
  );

  if (!usuario) {
    return null;
  }

  // Normalizar ruta del avatar (agregar / si no lo tiene)
  let avatarNormalizado = usuario.avatar;
  if (avatarNormalizado && !avatarNormalizado.startsWith('/') && !avatarNormalizado.startsWith('http')) {
    avatarNormalizado = '/' + avatarNormalizado;
  }

  const sesion: ISesionActiva = {
    id: usuario.id,
    usuario: usuario.usuario,
    email: usuario.email,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    rol: usuario.rol,
    fechaLogin: new Date().toISOString(),
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    avatar: avatarNormalizado,
  };

  guardarSesionActiva(sesion);
  return sesion;
}

// Nueva función para obtener información detallada del login
export function intentarIniciarSesion(emailOUsuario: string, password: string): {
  success: boolean;
  sesion?: ISesionActiva;
  error?: 'CUENTA_INEXISTENTE' | 'CREDENCIALES_INCORRECTAS' | 'CUENTA_INACTIVA';
} {
  const datos = obtenerDatosUsuarios();
  
  // Buscar si existe un usuario con ese email o nombre de usuario
  const usuarioExistente = datos.usuarios.find(
    (u) => u.email === emailOUsuario || u.usuario === emailOUsuario
  );

  // Si no existe el usuario
  if (!usuarioExistente) {
    return {
      success: false,
      error: 'CUENTA_INEXISTENTE'
    };
  }

  // Si existe pero está inactivo
  if (usuarioExistente.isActivo !== Estado.activo) {
    return {
      success: false,
      error: 'CUENTA_INACTIVA'
    };
  }

  // Si existe pero la contraseña es incorrecta
  if (usuarioExistente.password !== password) {
    return {
      success: false,
      error: 'CREDENCIALES_INCORRECTAS'
    };
  }

  // Si todo está correcto, crear la sesión
  let avatarNormalizado = usuarioExistente.avatar;
  if (avatarNormalizado && !avatarNormalizado.startsWith('/') && !avatarNormalizado.startsWith('http')) {
    avatarNormalizado = '/' + avatarNormalizado;
  }

  const sesion: ISesionActiva = {
    id: usuarioExistente.id,
    usuario: usuarioExistente.usuario,
    email: usuarioExistente.email,
    nombre: usuarioExistente.nombre,
    apellido: usuarioExistente.apellido,
    rol: usuarioExistente.rol,
    fechaLogin: new Date().toISOString(),
    telefono: usuarioExistente.telefono,
    direccion: usuarioExistente.direccion,
    avatar: avatarNormalizado,
  };

  guardarSesionActiva(sesion);
  
  return {
    success: true,
    sesion
  };
}

export function cerrarSesion(): void {
  localStorage.removeItem(CLAVE_SESION_ACTIVA);
}

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

export function estaAutenticado(): boolean {
  return obtenerSesionActiva() !== null;
}

export function esAdministrador(): boolean {
  const sesion = obtenerSesionActiva();
  return sesion?.rol === RolUsuario.administrador;
}

// ============================================
// UTILIDADES
// ============================================

export function resetearUsuarios(): void {
  localStorage.removeItem(CLAVE_DATOS_USUARIOS);
  cerrarSesion();
}

export function cambiarPassword(userId: number, passwordActual: string, passwordNueva: string): boolean {
  const usuario = obtenerUsuarioPorId(userId);
  if (!usuario || usuario.password !== passwordActual) {
    return false;
  }

  actualizarUsuario(userId, { password: passwordNueva });
  return true;
}

export function eliminarCuentaConConfirmacion(userId: number, password: string): boolean {
  const usuario = obtenerUsuarioPorId(userId);
  
  // Verificar que el usuario existe y la contraseña es correcta
  if (!usuario || usuario.password !== password) {
    return false;
  }

  // Eliminar el usuario
  const eliminado = eliminarUsuario(userId);
  
  // Si se eliminó correctamente, cerrar la sesión
  if (eliminado) {
    cerrarSesion();
  }
  
  return eliminado;
}

// ============================================
// RECUPERACIÓN DE CONTRASEÑA
// ============================================

const CLAVE_CODIGOS_RECUPERACION = 'codigos_recuperacion_huertohogar';

interface CodigoRecuperacion {
  email: string;
  codigo: string;
  expiracion: string;
}

function generarCodigoRecuperacion(): string {
  // Genera un código de 6 dígitos
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function solicitarRecuperacionPassword(email: string): { success: boolean; codigo?: string; mensaje: string } {
  const usuario = obtenerUsuarioPorEmail(email);
  
  if (!usuario) {
    return { success: false, mensaje: 'No existe una cuenta con ese correo electrónico' };
  }

  const codigo = generarCodigoRecuperacion();
  const expiracion = new Date();
  expiracion.setMinutes(expiracion.getMinutes() + 15); // Código válido por 15 minutos

  const codigoRecuperacion: CodigoRecuperacion = {
    email,
    codigo,
    expiracion: expiracion.toISOString(),
  };

  try {
    // Obtener códigos existentes
    const codigosExistentes = localStorage.getItem(CLAVE_CODIGOS_RECUPERACION);
    let codigos: CodigoRecuperacion[] = codigosExistentes ? JSON.parse(codigosExistentes) : [];
    
    // Eliminar códigos expirados y del mismo email
    codigos = codigos.filter(c => 
      new Date(c.expiracion) > new Date() && c.email !== email
    );
    
    // Agregar el nuevo código
    codigos.push(codigoRecuperacion);
    
    localStorage.setItem(CLAVE_CODIGOS_RECUPERACION, JSON.stringify(codigos));
    
    // En producción, aquí enviarías un email real
    console.log(`Código de recuperación para ${email}: ${codigo}`);
    
    return { 
      success: true, 
      codigo, // En producción, NO devolver el código en la respuesta
      mensaje: 'Código de recuperación enviado. Revisa tu correo electrónico.' 
    };
  } catch (error) {
    console.error('Error al generar código de recuperación:', error);
    return { success: false, mensaje: 'Error al procesar la solicitud' };
  }
}

export function verificarCodigoRecuperacion(email: string, codigo: string): boolean {
  try {
    const codigosExistentes = localStorage.getItem(CLAVE_CODIGOS_RECUPERACION);
    if (!codigosExistentes) return false;
    
    const codigos: CodigoRecuperacion[] = JSON.parse(codigosExistentes);
    
    const codigoValido = codigos.find(c => 
      c.email === email && 
      c.codigo === codigo && 
      new Date(c.expiracion) > new Date()
    );
    
    return !!codigoValido;
  } catch (error) {
    console.error('Error al verificar código:', error);
    return false;
  }
}

export function restablecerPassword(email: string, codigo: string, nuevaPassword: string): boolean {
  if (!verificarCodigoRecuperacion(email, codigo)) {
    return false;
  }

  const usuario = obtenerUsuarioPorEmail(email);
  if (!usuario) return false;

  // Actualizar la contraseña
  actualizarUsuario(usuario.id, { password: nuevaPassword });

  // Eliminar el código usado
  try {
    const codigosExistentes = localStorage.getItem(CLAVE_CODIGOS_RECUPERACION);
    if (codigosExistentes) {
      let codigos: CodigoRecuperacion[] = JSON.parse(codigosExistentes);
      codigos = codigos.filter(c => !(c.email === email && c.codigo === codigo));
      localStorage.setItem(CLAVE_CODIGOS_RECUPERACION, JSON.stringify(codigos));
    }
  } catch (error) {
    console.error('Error al eliminar código usado:', error);
  }

  return true;
}
