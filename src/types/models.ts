// ============================================
// ENUMS
// ============================================

export enum CategoriaProducto {
  frutas = 'Frutas Frescas',
  verduras = 'Verduras Orgánicas',
  organicos = 'Productos Orgánicos',
  lacteos = 'Productos Lácteos',
}

export enum RolUsuario {
  administrador = 'administrador',
  cliente = 'cliente',
  vendedor = 'vendedor',
}

export enum Estado {
  activo = 'Activo',
  inactivo = 'Inactivo',
}

export enum EstadoPedido {
  pendiente = 'Pendiente',
  procesando = 'Procesando',
  enviado = 'Enviado',
  entregado = 'Entregado',
  cancelado = 'Cancelado',
}

// ============================================
// INTERFACES - PRODUCTOS
// ============================================

export interface IProducto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: CategoriaProducto | string;
  isActivo: Estado;
  estado?: Estado;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  peso?: string;
}

export interface IProductoConfiguracion {
  proximoId: number;
  version?: string;
  ultimaActualizacion: string;
  categorias: string[];
}

export interface IDataProductos {
  productos: IProducto[];
  configuracion: IProductoConfiguracion;
}

// ============================================
// INTERFACES - USUARIOS
// ============================================

export interface IUsuario {
  id: number;
  email: string;
  usuario: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  isActivo: Estado;
  estado?: Estado;
  telefono?: string;
  direccion?: string;
  fechaRegistro?: string;
  ultimaActualizacion?: string;
  fechaNacimiento?: string;
  avatar?: string;
  favoritos?: IProductoFavorito[];
  pedidos?: IPedido[];
}

export interface IUsuarioConfiguracion {
  proximoId: number;
  version?: string;
  ultimaActualizacion: string;
}

export interface IDataUsuarios {
  usuarios: IUsuario[];
  configuracion: IUsuarioConfiguracion;
}

export interface ISesionActiva {
  id: number;
  usuario: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  fechaLogin: string;
  telefono?: string;
  direccion?: string;
  avatar?: string;
}

// ============================================
// INTERFACES - CARRITO Y PEDIDOS
// ============================================

export interface IItemCarrito {
  id: number;
  producto: IProducto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ICarrito {
  items: IItemCarrito[];
  total: number;
  cantidadItems: number;
}

export interface IPedido {
  id: string | number;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  items: IItemCarrito[];
  usuario?: {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
  };
  envio?: {
    direccion: string;
    comuna: string;
    region: string;
    codigoPostal?: string;
  };
  metodoPago?: string;
}

export interface IProductoFavorito {
  id: string | number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen: string;
}

// ============================================
// TYPES - FORMULARIOS
// ============================================

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  email: string;
  usuario: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
};

export type ProductoFormData = Omit<IProducto, 'id' | 'codigo' | 'fechaCreacion' | 'fechaActualizacion'>;

export type PerfilFormData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  fechaNacimiento?: string;
  avatar?: string;
};

export type CheckoutFormData = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  comuna: string;
  region: string;
  codigoPostal?: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  notas?: string;
};
