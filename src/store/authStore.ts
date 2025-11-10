import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ISesionActiva } from '../types';
import {
  intentarIniciarSesion,
  cerrarSesion as logoutService,
  obtenerSesionActiva,
  esAdministrador as checkAdmin,
  registrarUsuario,
} from '../services/usuarios.service';
import { RolUsuario } from '../types';

interface AuthState {
  user: ISesionActiva | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (emailOUsuario: string, password: string) => Promise<{ success: boolean; error?: 'CUENTA_INEXISTENTE' | 'CREDENCIALES_INCORRECTAS' | 'CUENTA_INACTIVA' }>;
  register: (email: string, password: string, nombreCompleto: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: obtenerSesionActiva(),
      isAuthenticated: obtenerSesionActiva() !== null,
      isAdmin: checkAdmin(),

      login: async (emailOUsuario: string, password: string) => {
        const resultado = intentarIniciarSesion(emailOUsuario, password);
        
        if (resultado.success && resultado.sesion) {
          set({
            user: resultado.sesion,
            isAuthenticated: true,
            isAdmin: checkAdmin(),
          });
          return { success: true };
        }
        
        return { 
          success: false, 
          error: resultado.error 
        };
      },

      register: async (email: string, password: string, nombreCompleto: string) => {
        try {
          const [nombre, ...apellidoParts] = nombreCompleto.split(' ');
          const apellido = apellidoParts.join(' ') || '';

          const nuevoUsuario = registrarUsuario({
            email,
            usuario: email.split('@')[0], // Usar parte del email como usuario
            password,
            nombre,
            apellido,
            telefono: '',
            direccion: '',
            rol: RolUsuario.cliente,
            isActivo: 'Activo' as any,
          });

          return nuevoUsuario !== null;
        } catch (error) {
          console.error('Error al registrar usuario:', error);
          return false;
        }
      },

      logout: () => {
        logoutService();
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      checkAuth: () => {
        const sesion = obtenerSesionActiva();
        set({
          user: sesion,
          isAuthenticated: sesion !== null,
          isAdmin: checkAdmin(),
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
