import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ISesionActiva } from '../types';
import {
  iniciarSesion as loginService,
  cerrarSesion as logoutService,
  obtenerSesionActiva,
  esAdministrador as checkAdmin,
} from '../services/usuariosService';

interface AuthState {
  user: ISesionActiva | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (emailOUsuario: string, password: string) => Promise<boolean>;
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
        const sesion = loginService(emailOUsuario, password);
        if (sesion) {
          set({
            user: sesion,
            isAuthenticated: true,
            isAdmin: checkAdmin(),
          });
          return true;
        }
        return false;
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
