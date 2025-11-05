import { describe, expect, test, beforeEach } from 'vitest';
import { 
  iniciarSesion, 
  cerrarSesion, 
  obtenerSesionActiva,
  registrarUsuario,
  obtenerUsuarioPorEmail,
  resetearUsuarios
} from '../../src/services/usuariosService';

describe('Prueba de servicio de autenticación', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    resetearUsuarios();
  });

  test('si ingreso credenciales válidas debe devolver la sesión', () => {
    // Arrange (Preparar)
    const email = 'admin@huertohogar.com';
    const password = 'admin123';

    // Act (Actuar)
    const sesion = iniciarSesion(email, password);

    // Assert (Verificar)
    expect(sesion).not.toBeNull();
    if (sesion) {
      expect(sesion.email).toBe(email);
      expect(sesion.usuario).toBeDefined();
      expect(sesion.rol).toBeDefined();
      expect(sesion.fechaLogin).toBeDefined();
    }
  });

  test('si ingreso credenciales inválidas debe devolver null', () => {
    const email = 'inexistente@test.com';
    const password = 'wrongpassword';

    const sesion = iniciarSesion(email, password);

    expect(sesion).toBeNull();
  });

  test('debe permitir iniciar sesión con usuario en lugar de email', () => {
    const usuario = 'admin';
    const password = 'admin123';

    const sesion = iniciarSesion(usuario, password);

    expect(sesion).not.toBeNull();
    if (sesion) {
      expect(sesion.usuario).toBe(usuario);
    }
  });

  test('debe guardar la sesión activa en localStorage', () => {
    const email = 'admin@huertohogar.com';
    const password = 'admin123';

    iniciarSesion(email, password);
    const sesionGuardada = obtenerSesionActiva();

    expect(sesionGuardada).not.toBeNull();
    expect(sesionGuardada?.email).toBe(email);
  });

  test('cerrar sesión debe eliminar la sesión activa', () => {
    const email = 'admin@huertohogar.com';
    const password = 'admin123';

    iniciarSesion(email, password);
    cerrarSesion();
    const sesion = obtenerSesionActiva();

    expect(sesion).toBeNull();
  });

  test('debe registrar un nuevo usuario correctamente', () => {
    const nuevoUsuario = {
      email: 'nuevo@test.com',
      usuario: 'nuevousuario',
      password: 'password123',
      nombre: 'Nuevo',
      apellido: 'Usuario',
      telefono: '123456789',
      direccion: 'Calle Test 123',
      rol: 'Cliente' as any,
      isActivo: 'Activo' as any,
    };

    const resultado = registrarUsuario(nuevoUsuario);

    expect(resultado).not.toBeNull();
    if (resultado) {
      expect(resultado.id).toBeDefined();
      expect(resultado.email).toBe(nuevoUsuario.email);
      expect(resultado.fechaRegistro).toBeDefined();
    }
  });

  test('no debe permitir registrar un usuario con email duplicado', () => {
    const usuario1 = {
      email: 'test@test.com',
      usuario: 'test1',
      password: 'password123',
      nombre: 'Test',
      apellido: 'Uno',
      telefono: '',
      direccion: '',
      rol: 'Cliente' as any,
      isActivo: 'Activo' as any,
    };

    const usuario2 = {
      ...usuario1,
      usuario: 'test2',
    };

    const resultado1 = registrarUsuario(usuario1);
    const resultado2 = registrarUsuario(usuario2);

    expect(resultado1).not.toBeNull();
    expect(resultado2).toBeNull();
  });

  test('no debe permitir registrar un usuario con nombre de usuario duplicado', () => {
    const usuario1 = {
      email: 'test1@test.com',
      usuario: 'testuser',
      password: 'password123',
      nombre: 'Test',
      apellido: 'Uno',
      telefono: '',
      direccion: '',
      rol: 'Cliente' as any,
      isActivo: 'Activo' as any,
    };

    const usuario2 = {
      ...usuario1,
      email: 'test2@test.com',
    };

    const resultado1 = registrarUsuario(usuario1);
    const resultado2 = registrarUsuario(usuario2);

    expect(resultado1).not.toBeNull();
    expect(resultado2).toBeNull();
  });
});
