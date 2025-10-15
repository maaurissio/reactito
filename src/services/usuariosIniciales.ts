import { Estado, RolUsuario } from '../types';
import type { IDataUsuarios, IUsuario } from '../types';

export const usuariosIniciales: IUsuario[] = [
  {
    id: 1,
    email: 'admin@huertohogar.com',
    usuario: 'admin',
    password: 'admin123',
    nombre: 'Administrador',
    apellido: 'Sistema',
    rol: RolUsuario.administrador,
    isActivo: Estado.activo,
    estado: Estado.activo,
    fechaRegistro: '2025-01-01',
    avatar: '/img/avatars/admin.png',
  },
  {
    id: 2,
    email: 'mauri@huertohogar.com',
    usuario: 'maurisio',
    password: 'mauri123',
    nombre: 'Mauricio',
    apellido: 'Gajardo',
    rol: RolUsuario.administrador,
    isActivo: Estado.activo,
    estado: Estado.activo,
    fechaRegistro: '2025-01-01',
  },
  {
    id: 3,
    email: 'vixo@huertohogar.com',
    usuario: 'minipekka',
    password: 'vixo123',
    nombre: 'Vicente',
    apellido: 'Colicheo',
    rol: RolUsuario.administrador,
    isActivo: Estado.activo,
    estado: Estado.activo,
    fechaRegistro: '2025-01-15',
  },
  {
    id: 4,
    email: 'cliente@demo.com',
    usuario: 'cliente',
    password: 'cliente123',
    nombre: 'Cliente',
    apellido: 'Demo',
    rol: RolUsuario.cliente,
    isActivo: Estado.activo,
    estado: Estado.activo,
    fechaRegistro: '2025-02-01',
    telefono: '+56912345678',
    direccion: 'Av. Principal 123, Santiago',
  },
];

export const datosUsuariosIniciales: IDataUsuarios = {
  usuarios: usuariosIniciales,
  configuracion: {
    proximoId: 5,
    version: '1.0',
    ultimaActualizacion: new Date().toISOString(),
  },
};
