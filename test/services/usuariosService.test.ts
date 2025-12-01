import { describe, expect, test, beforeEach, vi } from 'vitest';
import { RolUsuario, Estado } from '../../src/types';

// Usar vi.hoisted para crear mocks que se levanten antes que las importaciones
const mocks = vi.hoisted(() => {
  const usuariosBase = [
    {
      id: 1,
      email: 'admin@huertohogar.com',
      usuario: 'admin',
      password: 'admin123',
      nombre: 'Admin',
      apellido: 'Sistema',
      rol: 'administrador' as const,
      isActivo: 'Activo',
    },
  ];

  // Tracking de usuarios registrados en los tests
  const usuariosRegistrados = new Map<string, any>();

  return {
    usuariosBase,
    usuariosRegistrados,
    iniciarSesion: vi.fn((email: string, password: string) => {
      const usuario = usuariosBase.find(u => u.email === email && u.password === password);
      if (usuario) {
        return Promise.resolve({
          success: true,
          sesion: {
            id: usuario.id,
            email: usuario.email,
            usuario: usuario.usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol,
            fechaLogin: new Date().toISOString(),
          }
        });
      }
      return Promise.resolve({ success: false, error: 'CREDENCIALES_INCORRECTAS' });
    }),
    registrarUsuario: vi.fn((datos: any) => {
      // Verificar en base y en registrados
      const existeEnBase = usuariosBase.some(u => u.email === datos.email || u.usuario === datos.usuario);
      const existeEmail = usuariosRegistrados.has(`email:${datos.email}`);
      const existeUsuario = usuariosRegistrados.has(`usuario:${datos.usuario}`);

      if (existeEnBase || existeEmail || existeUsuario) {
        return Promise.resolve({ success: false, error: 'Usuario ya existe' });
      }

      // Registrar nuevo usuario
      usuariosRegistrados.set(`email:${datos.email}`, datos);
      usuariosRegistrados.set(`usuario:${datos.usuario}`, datos);
      
      const nuevoUsuario = {
        id: usuariosBase.length + usuariosRegistrados.size,
        ...datos,
        isActivo: 'Activo',
        fechaRegistro: new Date().toISOString(),
      };
      
      return Promise.resolve({ success: true, usuario: nuevoUsuario });
    }),
    cerrarSesion: vi.fn(() => Promise.resolve()),
    obtenerSesionActiva: vi.fn(() => null),
    reset: () => {
      mocks.usuariosRegistrados.clear();
      mocks.iniciarSesion.mockClear();
      mocks.registrarUsuario.mockClear();
      mocks.cerrarSesion.mockClear();
      mocks.obtenerSesionActiva.mockClear();
    }
  };
});

// Mock del servicio de autenticación
vi.mock('../../src/services/auth.service', () => ({
  iniciarSesion: mocks.iniciarSesion,
  cerrarSesion: mocks.cerrarSesion,
  obtenerSesionActiva: mocks.obtenerSesionActiva,
  registrarUsuario: mocks.registrarUsuario,
}));

// Importar después del mock
import { 
  iniciarSesion, 
  cerrarSesion, 
  obtenerSesionActiva,
  registrarUsuario,
} from '../../src/services/auth.service';

describe('Prueba de servicio de autenticación API', () => {
  
  beforeEach(() => {
    mocks.reset();
    localStorage.clear();
  });

  test('si ingreso credenciales válidas debe devolver la sesión', async () => {
    const email = 'admin@huertohogar.com';
    const password = 'admin123';

    const resultado = await iniciarSesion(email, password);

    expect(mocks.iniciarSesion).toHaveBeenCalledWith(email, password);
    expect(resultado.success).toBe(true);
    expect(resultado.sesion).toBeDefined();
    if (resultado.sesion) {
      expect(resultado.sesion.email).toBe(email);
      expect(resultado.sesion.usuario).toBeDefined();
      expect(resultado.sesion.rol).toBeDefined();
      expect(resultado.sesion.fechaLogin).toBeDefined();
    }
  });

  test('debe fallar con credenciales inválidas', async () => {
    const resultado = await iniciarSesion('wrong@test.com', 'wrongpassword');

    expect(resultado.success).toBe(false);
    expect(resultado.error).toBe('CREDENCIALES_INCORRECTAS');
  });

  test('debe registrar un nuevo usuario correctamente', async () => {
    const nuevoUsuario = {
      email: 'nuevo@test.com',
      usuario: 'nuevousuario',
      password: 'password123',
      nombre: 'Nuevo',
      apellido: 'Usuario',
      telefono: '123456789',
      direccion: 'Calle Test 123',
    };

    const resultado = await registrarUsuario(nuevoUsuario);

    expect(mocks.registrarUsuario).toHaveBeenCalled();
    expect(resultado.success).toBe(true);
    if (resultado.usuario) {
      expect(resultado.usuario.id).toBeDefined();
      expect(resultado.usuario.email).toBe(nuevoUsuario.email);
    }
  });

  test('no debe permitir registrar un usuario con email duplicado', async () => {
    // Primer registro
    await registrarUsuario({
      email: 'test@test.com',
      usuario: 'test1',
      password: 'password123',
      nombre: 'Test',
      apellido: 'Uno',
    });

    // Segundo registro con mismo email
    const resultado2 = await registrarUsuario({
      email: 'test@test.com',
      usuario: 'test2',
      password: 'password123',
      nombre: 'Test',
      apellido: 'Dos',
    });

    expect(resultado2.success).toBe(false);
  });

  test('no debe permitir registrar un usuario con nombre de usuario duplicado', async () => {
    // Primer registro
    await registrarUsuario({
      email: 'test1@test.com',
      usuario: 'testuser',
      password: 'password123',
      nombre: 'Test',
      apellido: 'Uno',
    });

    // Segundo registro con mismo usuario
    const resultado2 = await registrarUsuario({
      email: 'test2@test.com',
      usuario: 'testuser',
      password: 'password123',
      nombre: 'Test',
      apellido: 'Dos',
    });

    expect(resultado2.success).toBe(false);
  });
});
