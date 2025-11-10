import { CategoriaProducto, Estado } from '../types';
import type { IDataProductos, IProducto } from '../types';
import { productosIniciales } from './productosIniciales';

const CLAVE_DATOS_PRODUCTOS = 'productos_huertohogar_data';

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
  const estadoNormalizado = normalizarEstado(producto.isActivo);
  
  // Asegurar que la imagen se preserve correctamente (URL o Base64)
  let imagenFinal = '/img/default.jpg';
  
  if (producto.imagen && producto.imagen.trim() !== '') {
    // Si es Base64 o URL válida, usarla directamente
    if (producto.imagen.startsWith('data:') || 
        producto.imagen.startsWith('http://') || 
        producto.imagen.startsWith('https://') ||
        producto.imagen.startsWith('img/') ||
        producto.imagen.startsWith('/')) {
      imagenFinal = producto.imagen;
    } else {
      // Si no tiene protocolo, asumir que es una ruta relativa
      imagenFinal = producto.imagen;
    }
  }
  
  return {
    id: producto.id ?? 0,
    codigo: producto.codigo ?? `PR${Date.now()}`,
    nombre: producto.nombre ?? 'Producto sin nombre',
    descripcion: producto.descripcion ?? '',
    precio: limpiarPrecio(producto.precio),
    stock: limpiarStock(producto.stock),
    imagen: imagenFinal,
    categoria: producto.categoria ?? CategoriaProducto.frutas,
    isActivo: estadoNormalizado,
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

// Función para generar código de producto según categoría
function generarCodigoProducto(categoria: CategoriaProducto | string, datos: IDataProductos): string {
  // Intentar cargar categorías personalizadas
  let prefijos: Record<string, string> = {
    [CategoriaProducto.frutas]: 'FR',
    [CategoriaProducto.verduras]: 'VR',
    [CategoriaProducto.organicos]: 'PO',
    [CategoriaProducto.lacteos]: 'LO',
  };

  // Agregar prefijos de categorías personalizadas
  try {
    const categoriasCustom = localStorage.getItem('categorias_productos_custom');
    if (categoriasCustom) {
      const categorias = JSON.parse(categoriasCustom);
      categorias.forEach((cat: any) => {
        prefijos[cat.value] = cat.codigo;
      });
    }
  } catch (error) {
    console.error('Error al cargar categorías personalizadas:', error);
  }

  const prefijo = prefijos[categoria] || 'PR';
  
  // Contar productos existentes de esta categoría para generar el número consecutivo
  const productosCategoria = datos.productos.filter(p => p.categoria === categoria);
  const numeroConsecutivo = productosCategoria.length + 1;
  
  return `${prefijo}${String(numeroConsecutivo).padStart(3, '0')}`;
}

export function agregarProducto(producto: Omit<IProducto, 'id' | 'codigo'>): IProducto {
  const datosActualizados = actualizarDatosProductos((datos) => {
    const nuevoId = datos.configuracion.proximoId;
    const nuevoCodigo = generarCodigoProducto(producto.categoria, datos);
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

// Función para migrar códigos antiguos a los nuevos
export function migrarCodigosProductos(): void {
  const datos = obtenerDatosProductos();
  
  // Mapeo de categorías a prefijos
  const prefijos: Record<string, string> = {
    'Frutas Frescas': 'FR',
    'Verduras Orgánicas': 'VR',
    'Productos Orgánicos': 'PO',
    'Productos Lácteos': 'LO',
  };

  // Contar productos por categoría para generar códigos consecutivos
  const contadores: Record<string, number> = {
    'Frutas Frescas': 1,
    'Verduras Orgánicas': 1,
    'Productos Orgánicos': 1,
    'Productos Lácteos': 1,
  };

  // Actualizar cada producto
  datos.productos.forEach((producto) => {
    const prefijo = prefijos[producto.categoria] || 'PR';
    const numero = contadores[producto.categoria] || 1;
    producto.codigo = `${prefijo}${String(numero).padStart(3, '0')}`;
    contadores[producto.categoria] = numero + 1;
  });

  // Guardar los datos actualizados
  guardarDatosProductos(datos);
}
