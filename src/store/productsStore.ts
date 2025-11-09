import { create } from 'zustand';
import type { IProducto } from '../types';
import {
  obtenerDatosProductos,
  obtenerProductoPorId,
  agregarProducto as addProductService,
  actualizarProducto as updateProductService,
  eliminarProducto as deleteProductService,
} from '../services/productos.service';

interface ProductsState {
  productos: IProducto[];
  isLoading: boolean;
  error: string | null;
  
  cargarProductos: () => void;
  obtenerProducto: (id: number) => IProducto | undefined;
  agregarProducto: (producto: Omit<IProducto, 'id' | 'codigo'>) => void;
  actualizarProducto: (id: number, cambios: Partial<IProducto>) => void;
  actualizarStock: (id: number, nuevoStock: number) => void;
  eliminarProducto: (id: number) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  productos: [],
  isLoading: false,
  error: null,

  cargarProductos: () => {
    set({ isLoading: true, error: null });
    try {
      const datos = obtenerDatosProductos();
      set({
        productos: datos.productos,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Error al cargar productos',
        isLoading: false,
      });
    }
  },

  obtenerProducto: (id: number) => {
    return obtenerProductoPorId(id);
  },

  agregarProducto: (producto: Omit<IProducto, 'id' | 'codigo'>) => {
    addProductService(producto);
    get().cargarProductos();
  },

  actualizarProducto: (id: number, cambios: Partial<IProducto>) => {
    updateProductService(id, cambios);
    get().cargarProductos();
  },

  actualizarStock: (id: number, nuevoStock: number) => {
    const producto = obtenerProductoPorId(id);
    if (producto) {
      updateProductService(id, { ...producto, stock: nuevoStock });
      get().cargarProductos();
    }
  },

  eliminarProducto: (id: number) => {
    deleteProductService(id);
    get().cargarProductos();
  },
}));
