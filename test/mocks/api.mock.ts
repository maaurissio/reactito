/**
 * Mocks para los servicios de API
 * Estos mocks simulan las respuestas del backend para testing
 */

import { vi } from 'vitest';
import type { IProducto, IUsuario, ISesionActiva } from '../../src/types';
import { Estado, RolUsuario } from '../../src/types';

// ============================================
// DATOS DE PRUEBA
// ============================================

export const productosMock: IProducto[] = [
  {
    id: 1,
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    descripcion: 'Manzanas frescas y dulces',
    precio: 2500,
    stock: 50,
    imagen: 'https://example.com/manzana.jpg',
    categoria: 'Frutas Frescas',
    isActivo: Estado.activo,
    peso: '1kg',
  },
  {
    id: 2,
    codigo: 'VR001',
    nombre: 'Zanahorias Orgánicas',
    descripcion: 'Zanahorias frescas orgánicas',
    precio: 1500,
    stock: 30,
    imagen: 'https://example.com/zanahoria.jpg',
    categoria: 'Verduras',
    isActivo: Estado.activo,
    peso: '500g',
  },
];

export const usuariosMock: IUsuario[] = [
  {
    id: 1,
    email: 'admin@huertohogar.com',
    usuario: 'admin',
    password: 'admin123',
    nombre: 'Admin',
    apellido: 'Sistema',
    rol: RolUsuario.administrador,
    isActivo: Estado.activo,
    fechaRegistro: '2025-01-01',
  },
  {
    id: 2,
    email: 'cliente@test.com',
    usuario: 'cliente',
    password: 'cliente123',
    nombre: 'Cliente',
    apellido: 'Test',
    rol: RolUsuario.cliente,
    isActivo: Estado.activo,
    fechaRegistro: '2025-01-02',
  },
];

export const sesionMock: ISesionActiva = {
  id: 1,
  email: 'admin@huertohogar.com',
  usuario: 'admin',
  nombre: 'Admin',
  apellido: 'Sistema',
  rol: RolUsuario.administrador,
  fechaLogin: new Date().toISOString(),
};

// ============================================
// MOCK DE PRODUCTOS API SERVICE
// ============================================

// Contador para IDs únicos en productos
let contadorProductos = productosMock.length;

export const mockProductosService = {
  obtenerTodosLosProductos: vi.fn().mockResolvedValue(productosMock),
  obtenerProductoPorId: vi.fn().mockImplementation((id: number) => {
    return Promise.resolve(productosMock.find(p => p.id === id) || null);
  }),
  agregarProducto: vi.fn().mockImplementation((producto: Partial<IProducto>) => {
    contadorProductos++;
    const nuevoProducto = {
      id: contadorProductos,
      codigo: `NEW${contadorProductos}`,
      ...producto,
    } as IProducto;
    return Promise.resolve({ success: true, producto: nuevoProducto });
  }),
  actualizarProducto: vi.fn().mockImplementation((id: number, cambios: Partial<IProducto>) => {
    const producto = productosMock.find(p => p.id === id);
    if (producto) {
      return Promise.resolve({ success: true, producto: { ...producto, ...cambios } });
    }
    return Promise.resolve({ success: false, error: 'Producto no encontrado' });
  }),
  actualizarStockProducto: vi.fn().mockImplementation((id: number, stock: number) => {
    const producto = productosMock.find(p => p.id === id);
    if (producto) {
      return Promise.resolve({ success: true, producto: { ...producto, stock } });
    }
    return Promise.resolve({ success: false, error: 'Producto no encontrado' });
  }),
  eliminarProducto: vi.fn().mockResolvedValue({ success: true, mensaje: 'Producto eliminado' }),
};

// ============================================
// MOCK DE AUTH SERVICE
// ============================================

// Array para tracking de usuarios registrados en tests
let usuariosRegistrados: string[] = [];

export const mockAuthService = {
  iniciarSesion: vi.fn().mockImplementation((email: string, password: string) => {
    const usuario = usuariosMock.find(u => u.email === email && u.password === password);
    if (usuario) {
      const sesion: ISesionActiva = {
        id: usuario.id,
        email: usuario.email,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        fechaLogin: new Date().toISOString(),
      };
      return Promise.resolve({ success: true, sesion });
    }
    return Promise.resolve({ success: false, error: 'CREDENCIALES_INCORRECTAS' });
  }),
  registrarUsuario: vi.fn().mockImplementation((datos: Partial<IUsuario>) => {
    const existeEnMock = usuariosMock.some(u => u.email === datos.email || u.usuario === datos.usuario);
    const existeRegistrado = usuariosRegistrados.includes(datos.email || '') || usuariosRegistrados.includes(datos.usuario || '');
    if (existeEnMock || existeRegistrado) {
      return Promise.resolve({ success: false, error: 'Usuario ya existe' });
    }
    // Agregar al tracking
    if (datos.email) usuariosRegistrados.push(datos.email);
    if (datos.usuario) usuariosRegistrados.push(datos.usuario);
    const nuevoUsuario = {
      id: usuariosMock.length + usuariosRegistrados.length,
      ...datos,
      rol: RolUsuario.cliente,
      isActivo: Estado.activo,
      fechaRegistro: new Date().toISOString(),
    } as IUsuario;
    return Promise.resolve({ success: true, usuario: nuevoUsuario });
  }),
  cerrarSesion: vi.fn().mockResolvedValue(undefined),
  obtenerSesionActiva: vi.fn().mockReturnValue(null),
  guardarSesionActiva: vi.fn(),
  esAdministrador: vi.fn().mockReturnValue(false),
};

// ============================================
// MOCK DE USUARIOS API SERVICE
// ============================================

export const mockUsuariosService = {
  obtenerTodosLosUsuarios: vi.fn().mockResolvedValue(usuariosMock),
  obtenerUsuarioPorId: vi.fn().mockImplementation((id: number) => {
    return Promise.resolve(usuariosMock.find(u => u.id === id) || null);
  }),
  actualizarUsuario: vi.fn().mockImplementation((id: number, cambios: Partial<IUsuario>) => {
    const usuario = usuariosMock.find(u => u.id === id);
    if (usuario) {
      return Promise.resolve({ success: true, usuario: { ...usuario, ...cambios } });
    }
    return Promise.resolve({ success: false, error: 'Usuario no encontrado' });
  }),
};

// ============================================
// MOCK DE PEDIDOS API SERVICE
// ============================================

export const pedidosMock: any[] = [];

export const mockPedidosService = {
  crearPedido: vi.fn().mockImplementation((datos: any) => {
    const nuevoPedido = {
      id: `PED-${Date.now()}`,
      ...datos,
      fecha: new Date().toISOString(),
      estado: 'confirmado',
    };
    pedidosMock.push(nuevoPedido);
    return Promise.resolve({ success: true, pedido: nuevoPedido });
  }),
  obtenerPedidoPorId: vi.fn().mockImplementation((id: string) => {
    return Promise.resolve(pedidosMock.find(p => p.id === id) || null);
  }),
  obtenerTodosLosPedidos: vi.fn().mockResolvedValue(pedidosMock),
  obtenerPedidosUsuario: vi.fn().mockImplementation((usuarioId: number) => {
    return Promise.resolve(pedidosMock.filter(p => p.usuarioId === usuarioId));
  }),
  actualizarEstadoPedido: vi.fn().mockImplementation((id: string, estado: string) => {
    const pedido = pedidosMock.find(p => p.id === id);
    if (pedido) {
      pedido.estado = estado;
      return Promise.resolve({ success: true, pedido });
    }
    return Promise.resolve({ success: false, error: 'Pedido no encontrado' });
  }),
};

// ============================================
// FUNCIÓN PARA RESETEAR MOCKS
// ============================================

export function resetearMocks() {
  vi.clearAllMocks();
  pedidosMock.length = 0;
  usuariosRegistrados = [];
  contadorProductos = productosMock.length;
}
