import { describe, expect, test, beforeEach } from 'vitest';
import { useAuthStore } from '../../src/store/authStore';
import { resetearUsuarios } from '../../src/services/usuarios.service';

describe('Prueba del store de autenticación (authStore)', () => {
  
  beforeEach(() => {
    resetearUsuarios();
    localStorage.clear();
    // Reset del store
    useAuthStore.getState().logout();
  });

  test('debe iniciar con el usuario no autenticado', () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  test('debe autenticar usuario con credenciales válidas', async () => {
    const { login, isAuthenticated, user } = useAuthStore.getState();
    
    const resultado = await login('admin@huertohogar.com', 'admin123');
    
    expect(resultado.success).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user).not.toBeNull();
    expect(useAuthStore.getState().user?.email).toBe('admin@huertohogar.com');
  });

  test('no debe autenticar usuario con credenciales inválidas', async () => {
    const { login } = useAuthStore.getState();
    
    const resultado = await login('wrong@test.com', 'wrongpassword');
    
    expect(resultado.success).toBe(false);
    expect(resultado.error).toBe('CUENTA_INEXISTENTE');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  test('debe cerrar sesión correctamente', async () => {
    const { login, logout } = useAuthStore.getState();
    
    // Primero iniciar sesión
    await login('admin@huertohogar.com', 'admin123');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    
    // Luego cerrar sesión
    logout();
    
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  test('debe identificar correctamente a un administrador', async () => {
    const { login, isAdmin } = useAuthStore.getState();
    
    await login('admin@huertohogar.com', 'admin123');
    
    expect(useAuthStore.getState().isAdmin).toBe(true);
  });

  test('debe registrar un nuevo usuario correctamente', async () => {
    const { register } = useAuthStore.getState();
    
    const resultado = await register(
      'nuevo@test.com',
      'password123',
      'Juan Pérez'
    );
    
    expect(resultado).toBe(true);
  });

  test('no debe registrar un usuario con email duplicado', async () => {
    const { register } = useAuthStore.getState();
    
    // Primer registro
    const resultado1 = await register(
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
    
    expect(resultado1).toBe(true);
    expect(resultado2).toBe(false);
  });

});
