import { describe, expect, test, beforeEach, vi } from 'vitest';
import { RolUsuario } from '../../src/types';

// Usar vi.hoisted para crear mocks que se levanten antes que las importaciones
const mocks = vi.hoisted(() => {
  const sesion = {
    id: 1,
    email: 'admin@huertohogar.com',
    nombre: 'Admin',
    apellido: 'Sistema',
    rol: 'administrador' as const,
    usuario: 'admin',
    fechaLogin: new Date().toISOString(),
  };

  const usuarios: Map<string, any> = new Map();

  return {
    sesion,
    usuarios,
    iniciarSesion: vi.fn((email: string, password: string) => {
      if (email === 'admin@huertohogar.com' && password === 'admin123') {
        return Promise.resolve({ success: true, sesion: { ...sesion } });
      }
      return Promise.resolve({ success: false, error: 'CREDENCIALES_INCORRECTAS' as const });
    }),
    registrarUsuario: vi.fn((datos: any) => {
      if (usuarios.has(datos.email)) {
        return Promise.resolve({ success: false, error: 'EMAIL_DUPLICADO' });
      }
      usuarios.set(datos.email, datos);
      return Promise.resolve({ success: true, usuario: { id: usuarios.size, ...datos } });
    }),
    cerrarSesion: vi.fn(() => Promise.resolve()),
    guardarSesionActiva: vi.fn(),
    obtenerSesionActiva: vi.fn(() => null),
    esAdministrador: vi.fn(() => false),
    reset: () => {
      usuarios.clear();
      mocks.iniciarSesion.mockClear();
      mocks.registrarUsuario.mockClear();
      mocks.cerrarSesion.mockClear();
      mocks.guardarSesionActiva.mockClear();
      mocks.obtenerSesionActiva.mockClear();
      mocks.esAdministrador.mockClear();
    }
  };
});

// Mock del servicio de autenticación 
vi.mock('../../src/services/auth.service', () => ({
  iniciarSesion: mocks.iniciarSesion,
  registrarUsuario: mocks.registrarUsuario,
  cerrarSesion: mocks.cerrarSesion,
  obtenerSesionActiva: mocks.obtenerSesionActiva,
  guardarSesionActiva: mocks.guardarSesionActiva,
  esAdministrador: mocks.esAdministrador,
}));

// Importar el store DESPUÉS del mock
import { useAuthStore } from '../../src/store/authStore';

describe('Prueba del store de autenticación (authStore)', () => {
  
  beforeEach(() => {
    mocks.reset();
    localStorage.clear();
    // Reset del store
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      isAdmin: false,
      isLoading: false,
      error: null 
    });
  });

  test('debe iniciar con el usuario no autenticado', () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  test('debe autenticar usuario con credenciales válidas', async () => {
    const { login } = useAuthStore.getState();
    
    const resultado = await login('admin@huertohogar.com', 'admin123');
    
    expect(resultado.success).toBe(true);
    expect(mocks.iniciarSesion).toHaveBeenCalledWith('admin@huertohogar.com', 'admin123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).not.toBeNull();
  });

  test('no debe autenticar usuario con credenciales inválidas', async () => {
    const { login } = useAuthStore.getState();
    
    const resultado = await login('wrong@test.com', 'wrongpassword');
    
    expect(resultado.success).toBe(false);
    expect(resultado.error).toBe('CREDENCIALES_INCORRECTAS');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  test('debe cerrar sesión correctamente', async () => {
    const { login, logout } = useAuthStore.getState();
    
    // Primero iniciar sesión
    await login('admin@huertohogar.com', 'admin123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    
    // Luego cerrar sesión
    await logout();
    
    expect(mocks.cerrarSesion).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  test('debe identificar correctamente a un administrador', async () => {
    const { login } = useAuthStore.getState();
    
    await login('admin@huertohogar.com', 'admin123');
    
    expect(useAuthStore.getState().isAdmin).toBe(true);
  });

  test('debe registrar un nuevo usuario correctamente', async () => {
    const { register } = useAuthStore.getState();
    
    const resultado = await register(
      'nuevo@test.com',
      'password123',
      'Nuevo Usuario'
    );
    
    expect(resultado.success).toBe(true);
    expect(mocks.registrarUsuario).toHaveBeenCalled();
  });

  test('no debe registrar un usuario con email duplicado', async () => {
    const { register } = useAuthStore.getState();
    
    // Primer registro
    await register(
      'test@test.com',
      'password123',
      'Usuario Uno'
    );
    
    // Segundo registro con mismo email
    const resultado2 = await register(
      'test@test.com',
      'password456',
      'Usuario Dos'
    );
    
    expect(resultado2.success).toBe(false);
  });
});
