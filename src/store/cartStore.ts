import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IProducto, IItemCarrito, ICarrito } from '../types';

interface CartState extends ICarrito {
  agregarItem: (producto: IProducto, cantidad?: number) => void;
  eliminarItem: (productoId: number) => void;
  actualizarCantidad: (productoId: number, cantidad: number) => void;
  limpiarCarrito: () => void;
  calcularTotal: () => void;
}

const calcularSubtotal = (precioUnitario: number, cantidad: number): number => {
  return precioUnitario * cantidad;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      cantidadItems: 0,

      agregarItem: (producto: IProducto, cantidad = 1) => {
        const { items } = get();
        const itemExistente = items.find((item) => item.producto.id === producto.id);

        if (itemExistente) {
          // Actualizar cantidad si ya existe
          const nuevaCantidad = itemExistente.cantidad + cantidad;
          set({
            items: items.map((item) =>
              item.producto.id === producto.id
                ? {
                    ...item,
                    cantidad: nuevaCantidad,
                    subtotal: calcularSubtotal(item.precioUnitario, nuevaCantidad),
                  }
                : item
            ),
          });
        } else {
          // Agregar nuevo item
          const nuevoItem: IItemCarrito = {
            id: producto.id,
            producto,
            cantidad,
            precioUnitario: producto.precio,
            subtotal: calcularSubtotal(producto.precio, cantidad),
          };
          set({ items: [...items, nuevoItem] });
        }
        get().calcularTotal();
      },

      eliminarItem: (productoId: number) => {
        set({
          items: get().items.filter((item) => item.producto.id !== productoId),
        });
        get().calcularTotal();
      },

      actualizarCantidad: (productoId: number, cantidad: number) => {
        if (cantidad <= 0) {
          get().eliminarItem(productoId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.producto.id === productoId
              ? {
                  ...item,
                  cantidad,
                  subtotal: calcularSubtotal(item.precioUnitario, cantidad),
                }
              : item
          ),
        });
        get().calcularTotal();
      },

      limpiarCarrito: () => {
        set({
          items: [],
          total: 0,
          cantidadItems: 0,
        });
      },

      calcularTotal: () => {
        const { items } = get();
        const total = items.reduce((sum, item) => sum + item.subtotal, 0);
        const cantidadItems = items.reduce((sum, item) => sum + item.cantidad, 0);
        set({ total, cantidadItems });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
