import { create } from 'zustand';
import type { IProducto } from '../types';
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  agregarProducto as addProductService,
  actualizarProducto as updateProductService,
  actualizarStockProducto,
  eliminarProducto as deleteProductService,
} from '../services/productos.api.service';

interface ProductsState {
  productos: IProducto[];
  isLoading: boolean;
  error: string | null;
  
  cargarProductos: () => Promise<void>;
  obtenerProducto: (id: number) => Promise<IProducto | null>;
  agregarProducto: (producto: Omit<IProducto, 'id' | 'codigo'>) => Promise<{ success: boolean; error?: string }>;
  actualizarProducto: (id: number, cambios: Partial<IProducto>) => Promise<{ success: boolean; error?: string }>;
  actualizarStock: (id: number, nuevoStock: number) => Promise<{ success: boolean; error?: string }>;
  eliminarProducto: (id: number) => Promise<{ success: boolean; error?: string }>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  productos: [],
  isLoading: false,
  error: null,

  cargarProductos: async () => {
    set({ isLoading: true, error: null });
    try {
      const productos = await obtenerTodosLosProductos();
      console.log('🏪 Store - Productos recibidos:', productos);
      set({
        productos,
        isLoading: false,
      });
    } catch (error) {
      console.error('🏪 Store - Error:', error);
      set({
        error: 'Error al cargar productos',
        isLoading: false,
      });
    }
  },

  obtenerProducto: async (id: number) => {
    return obtenerProductoPorId(id);
  },

  agregarProducto: async (producto: Omit<IProducto, 'id' | 'codigo'>) => {
    set({ isLoading: true });
    const resultado = await addProductService(producto);
    if (resultado.success) {
      await get().cargarProductos();
    }
    set({ isLoading: false });
    return resultado;
  },

  actualizarProducto: async (id: number, cambios: Partial<IProducto>) => {
    set({ isLoading: true });
    const resultado = await updateProductService(id, cambios);
    if (resultado.success) {
      await get().cargarProductos();
    }
    set({ isLoading: false });
    return resultado;
  },

  actualizarStock: async (id: number, nuevoStock: number) => {
    set({ isLoading: true });
    const resultado = await actualizarStockProducto(id, nuevoStock);
    if (resultado.success) {
      await get().cargarProductos();
    }
    set({ isLoading: false });
    return resultado;
  },

  eliminarProducto: async (id: number) => {
    set({ isLoading: true });
    const resultado = await deleteProductService(id);
    if (resultado.success) {
      await get().cargarProductos();
    }
    set({ isLoading: false });
    return resultado;
  },
}));
