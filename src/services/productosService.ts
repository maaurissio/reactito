import { CategoriaProducto, Estado } from '../types';
import type { IDataProductos, IProducto } from '../types';
import { productosIniciales } from './datosIniciales';

const CLAVE_DATOS_PRODUCTOS = 'productos_huertohogar_data';

// ============================================
// FUNCIONES DE NORMALIZACIÓN
// ============================================

function normalizarEstado(valor: unknown): Estado {
  if (valor === Estado.activo || valor === Estado.inactivo) {
    return valor;
  }
  if (typeof valor === 'string') {
    const lower = valor.toLowerCase();
    if (lower === Estado.activo.toLowerCase()) return Estado.activo;
    if (lower === Estado.inactivo.toLowerCase()) return Estado.inactivo;
  }
  return Estado.activo;
}

function limpiarPrecio(valor: unknown): number {
  if (typeof valor === 'number' && !Number.isNaN(valor)) {
    return valor;
  }
  if (typeof valor === 'string') {
    const limpio = valor
      .replace(/[^0-9,.-]/g, '')
      .replace(/,(?=.*\d{3}\b)/g, '')
      .replace(',', '.');
    const numero = Number.parseFloat(limpio);
    if (!Number.isNaN(numero)) {
      return numero;
    }
  }
  return 0;
}

function limpiarStock(valor: unknown): number {
  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return Math.max(0, Math.trunc(valor));
  }
  if (typeof valor === 'string') {
    const numero = Number.parseInt(valor, 10);
    if (!Number.isNaN(numero)) {
      return Math.max(0, numero);
    }
  }
  return 0;
}

function normalizarProducto(producto: Partial<IProducto>): IProducto {
  const estadoNormalizado = normalizarEstado(producto.isActivo ?? producto.estado);
  return {
    id: producto.id ?? 0,
    codigo: producto.codigo ?? `PR${Date.now()}`,
    nombre: producto.nombre ?? 'Producto sin nombre',
    descripcion: producto.descripcion ?? '',
    precio: limpiarPrecio(producto.precio),
    stock: limpiarStock(producto.stock),
    imagen: producto.imagen ?? '/img/default.jpg',
    categoria: producto.categoria ?? CategoriaProducto.frutas,
    isActivo: estadoNormalizado,
    estado: estadoNormalizado,
    peso: producto.peso ?? '1kg',
    fechaCreacion: producto.fechaCreacion,
    fechaActualizacion: producto.fechaActualizacion,
  };
}

function normalizarDatos(data: IDataProductos): IDataProductos {
  return {
    productos: data.productos.map((producto) => normalizarProducto(producto)),
    configuracion: {
      ...data.configuracion,
      categorias:
        data.configuracion.categorias?.length
          ? data.configuracion.categorias
          : Object.values(CategoriaProducto),
      ultimaActualizacion: data.configuracion.ultimaActualizacion ?? new Date().toISOString(),
    },
  };
}

function crearDatosIniciales(): IDataProductos {
  const configuracion = {
    proximoId: Math.max(...productosIniciales.map((p) => p.id)) + 1,
    version: '1.0',
    ultimaActualizacion: new Date().toISOString(),
    categorias: Object.values(CategoriaProducto),
  };
  return { productos: [...productosIniciales], configuracion };
}

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

export function obtenerDatosProductos(): IDataProductos {
  try {
    const datosAlmacenados = localStorage.getItem(CLAVE_DATOS_PRODUCTOS);
    if (datosAlmacenados) {
      const datos: IDataProductos = JSON.parse(datosAlmacenados);
      return normalizarDatos(datos);
    }
  } catch (error) {
    console.error('Error al leer productos de localStorage:', error);
  }

  const datosIniciales = crearDatosIniciales();
  guardarDatosProductos(datosIniciales);
  return datosIniciales;
}

export function guardarDatosProductos(datos: IDataProductos): void {
  try {
    const datosNormalizados = normalizarDatos(datos);
    localStorage.setItem(CLAVE_DATOS_PRODUCTOS, JSON.stringify(datosNormalizados));
  } catch (error) {
    console.error('Error al guardar productos en localStorage:', error);
  }
}

export function actualizarDatosProductos(
  transformer: (datos: IDataProductos) => IDataProductos
): IDataProductos {
  const actual = obtenerDatosProductos();
  const actualizado = transformer(actual);
  guardarDatosProductos(actualizado);
  return actualizado;
}

export function obtenerProductoPorId(id: number): IProducto | undefined {
  const datos = obtenerDatosProductos();
  return datos.productos.find((p) => p.id === id);
}

export function obtenerProductosPorCategoria(categoria: CategoriaProducto | string): IProducto[] {
  const datos = obtenerDatosProductos();
  return datos.productos.filter((p) => p.categoria === categoria && p.isActivo === Estado.activo);
}

export function buscarProductos(termino: string): IProducto[] {
  const datos = obtenerDatosProductos();
  const terminoLower = termino.toLowerCase();
  return datos.productos.filter(
    (p) =>
      p.isActivo === Estado.activo &&
      (p.nombre.toLowerCase().includes(terminoLower) ||
        p.descripcion.toLowerCase().includes(terminoLower) ||
        p.codigo.toLowerCase().includes(terminoLower))
  );
}

export function agregarProducto(producto: Omit<IProducto, 'id' | 'codigo'>): IProducto {
  const datosActualizados = actualizarDatosProductos((datos) => {
    const nuevoId = datos.configuracion.proximoId;
    const nuevoCodigo = `PR${String(nuevoId).padStart(4, '0')}`;
    const nuevoProducto = normalizarProducto({
      ...producto,
      id: nuevoId,
      codigo: nuevoCodigo,
      fechaCreacion: new Date().toISOString(),
    });
    datos.productos.push(nuevoProducto);
    datos.configuracion.proximoId = nuevoId + 1;
    datos.configuracion.ultimaActualizacion = new Date().toISOString();
    return datos;
  });
  return datosActualizados.productos[datosActualizados.productos.length - 1];
}

export function actualizarProducto(id: number, cambios: Partial<IProducto>): IProducto | undefined {
  let productoActualizado: IProducto | undefined;
  actualizarDatosProductos((datos) => {
    const indice = datos.productos.findIndex((p) => p.id === id);
    if (indice >= 0) {
      datos.productos[indice] = normalizarProducto({
        ...datos.productos[indice],
        ...cambios,
        id,
        fechaActualizacion: new Date().toISOString(),
      });
      productoActualizado = datos.productos[indice];
      datos.configuracion.ultimaActualizacion = new Date().toISOString();
    }
    return datos;
  });
  return productoActualizado;
}

export function eliminarProducto(id: number): boolean {
  let eliminado = false;
  actualizarDatosProductos((datos) => {
    const indice = datos.productos.findIndex((p) => p.id === id);
    if (indice >= 0) {
      datos.productos.splice(indice, 1);
      eliminado = true;
      datos.configuracion.ultimaActualizacion = new Date().toISOString();
    }
    return datos;
  });
  return eliminado;
}

export function resetearProductos(): void {
  localStorage.removeItem(CLAVE_DATOS_PRODUCTOS);
}
