import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ISesionActiva } from '../types';
import {
  iniciarSesion,
  registrarUsuario,
  cerrarSesion,
  obtenerSesionActiva,
  esAdministrador,
} from '../services/auth.service';
import { RolUsuario } from '../types';

type LoginError = 'CUENTA_INEXISTENTE' | 'CREDENCIALES_INCORRECTAS' | 'CUENTA_INACTIVA';

interface AuthState {
  user: ISesionActiva | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (emailOUsuario: string, password: string) => Promise<{ success: boolean; error?: LoginError }>;
  register: (email: string, password: string, nombreCompleto: string, usuario?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  syncAcrossTabs: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: obtenerSesionActiva(),
      isAuthenticated: obtenerSesionActiva() !== null,
      isAdmin: esAdministrador(),
      isLoading: false,

      login: async (emailOUsuario: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const resultado = await iniciarSesion(emailOUsuario, password);
          
          if (resultado.success && resultado.sesion) {
            set({
              user: resultado.sesion,
              isAuthenticated: true,
              isAdmin: resultado.sesion.rol === RolUsuario.administrador,
              isLoading: false,
            });
            return { success: true };
          }
          
          set({ isLoading: false });
          return { 
            success: false, 
            error: resultado.error 
          };
        } catch (error) {
          set({ isLoading: false });
          console.error('Error en login:', error);
          return { success: false, error: 'CREDENCIALES_INCORRECTAS' as LoginError };
        }
      },

      register: async (email: string, password: string, nombreCompleto: string, usuario?: string) => {
        set({ isLoading: true });
        
        try {
          const [nombre, ...apellidoParts] = nombreCompleto.split(' ');
          const apellido = apellidoParts.join(' ') || '';

          const resultado = await registrarUsuario({
            email,
            usuario: usuario || email.split('@')[0],
            password,
            nombre,
            apellido,
          });

          set({ isLoading: false });
          
          if (resultado.success) {
            return { success: true };
          }
          
          return { success: false, error: resultado.error };
        } catch (error) {
          set({ isLoading: false });
          console.error('Error al registrar usuario:', error);
          return { success: false, error: 'Error al registrar usuario' };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await cerrarSesion();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
          });
        }
      },

      checkAuth: () => {
        const sesion = obtenerSesionActiva();
        set({
          user: sesion,
          isAuthenticated: sesion !== null,
          isAdmin: esAdministrador(),
        });
      },

      // Sincroniza el estado de autenticación entre pestañas
      syncAcrossTabs: () => {
        const handleStorageChange = (event: StorageEvent) => {
          // Escucha cambios en el token o la sesión activa
          if (event.key === 'auth_token' || event.key === 'sesion_activa_huertohogar' || event.key === 'auth-storage') {
            const sesion = obtenerSesionActiva();
            set({
              user: sesion,
              isAuthenticated: sesion !== null,
              isAdmin: esAdministrador(),
            });
          }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Retorna función de limpieza
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
