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
    avatar: usuario.avatar,
  };

  guardarSesionActiva(sesion);
  return sesion;
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
