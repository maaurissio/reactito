import { create } from 'zustand';
import type { IProducto, CategoriaProducto } from '../types';
import {
  obtenerDatosProductos,
  obtenerProductoPorId,
  obtenerProductosPorCategoria,
  buscarProductos,
  agregarProducto as addProductService,
  actualizarProducto as updateProductService,
  eliminarProducto as deleteProductService,
} from '../services/productosService';

interface ProductsState {
  productos: IProducto[];
  productosFiltrados: IProducto[];
  categoriaSeleccionada: CategoriaProducto | 'todos' | null;
  terminoBusqueda: string;
  isLoading: boolean;
  error: string | null;
  
  cargarProductos: () => void;
  filtrarPorCategoria: (categoria: CategoriaProducto | 'todos') => void;
  buscar: (termino: string) => void;
  obtenerProducto: (id: number) => IProducto | undefined;
  agregarProducto: (producto: Omit<IProducto, 'id' | 'codigo'>) => void;
  actualizarProducto: (id: number, cambios: Partial<IProducto>) => void;
  actualizarStock: (id: number, nuevoStock: number) => void;
  eliminarProducto: (id: number) => void;
  limpiarFiltros: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  productos: [],
  productosFiltrados: [],
  categoriaSeleccionada: null,
  terminoBusqueda: '',
  isLoading: false,
  error: null,

  cargarProductos: () => {
    set({ isLoading: true, error: null });
    try {
      const datos = obtenerDatosProductos();
      set({
        productos: datos.productos,
        productosFiltrados: datos.productos,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Error al cargar productos',
        isLoading: false,
      });
    }
  },

  filtrarPorCategoria: (categoria: CategoriaProducto | 'todos') => {
    const { productos } = get();
    if (categoria === 'todos') {
      set({
        productosFiltrados: productos,
        categoriaSeleccionada: 'todos',
        terminoBusqueda: '',
      });
    } else {
      const filtrados = obtenerProductosPorCategoria(categoria);
      set({
        productosFiltrados: filtrados,
        categoriaSeleccionada: categoria,
        terminoBusqueda: '',
      });
    }
  },

  buscar: (termino: string) => {
    set({ terminoBusqueda: termino });
    if (!termino.trim()) {
      get().limpiarFiltros();
      return;
    }
    const resultados = buscarProductos(termino);
    set({
      productosFiltrados: resultados,
      categoriaSeleccionada: null,
    });
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

  limpiarFiltros: () => {
    const { productos } = get();
    set({
      productosFiltrados: productos,
      categoriaSeleccionada: null,
      terminoBusqueda: '',
    });
  },
}));
