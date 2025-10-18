# Dashboard Administrativo - HuertoHogar 🌱

## 📋 Descripción

El Dashboard Administrativo es un panel de control completo para gestionar la plataforma de e-commerce HuertoHogar. Permite a los administradores monitorear ventas, gestionar productos, usuarios y pedidos desde una interfaz moderna y responsiva.

## 🔐 Acceso al Dashboard

### Credenciales de Administrador

Para acceder al Dashboard, inicia sesión con una de estas cuentas de administrador:

1. **Admin Principal**
   - **Usuario:** `admin` o `admin@huertohogar.com`
   - **Contraseña:** `admin123`

2. **Mauricio (Admin)**
   - **Usuario:** `maurisio` o `mauri@huertohogar.com`
   - **Contraseña:** `mauri123`

3. **Vicente (Admin)**
   - **Usuario:** `minipekka` o `vixo@huertohogar.com`
   - **Contraseña:** `vixo123`

### ¿Dónde está el botón de Dashboard?

Una vez que inicies sesión con una cuenta de **administrador**, verás el botón de **Dashboard** en el menú de usuario (dropdown en la esquina superior derecha):

```
[Usuario] ▼
  ├─ Mi Perfil
  ├─ Dashboard  ← Aquí aparece solo para admins
  └─ Cerrar Sesión
```

## 🎯 Funcionalidades

### 1. **Dashboard Overview**
- **Métricas en tiempo real:**
  - Ventas Totales: $2,847,320 (+12.5%)
  - Pedidos: 1,247 (+8.3%)
  - Usuarios Activos: Contador dinámico
  - Productos: Contador dinámico del catálogo
  
- **Gráfico de Ventas Mensuales:**
  - Visualización de ventas de los últimos 6 meses
  - Implementado con Chart.js

- **Feed de Actividad Reciente:**
  - Nuevas ventas
  - Registros de usuarios
  - Alertas de stock bajo
  - Pedidos entregados

- **Acciones Rápidas:**
  - Agregar Producto
  - Ver Pedidos
  - Gestionar Usuarios

### 2. **Gestión de Productos**
- Listado completo de productos con:
  - ID, Imagen, Nombre, Precio, Stock, Categoría
- Badges de stock con colores:
  - 🟢 Verde: Stock alto (>20)
  - 🟡 Amarillo: Stock medio (10-20)
  - 🔴 Rojo: Stock bajo (<10)
- Acciones disponibles:
  - ✏️ Editar producto
  - 🗑️ Eliminar producto

### 3. **Gestión de Usuarios**
- Listado completo de usuarios con:
  - ID, Nombre completo, Email, Teléfono, Rol, Estado
- Badges de rol:
  - 🔴 Rojo: Administrador
  - 🔵 Azul: Cliente
- Badges de estado:
  - 🟢 Verde: Activo
  - ⚫ Gris: Inactivo
- Acciones disponibles:
  - 👁️ Ver detalles
  - ✏️ Editar usuario
  - 🗑️ Eliminar usuario

### 4. **Gestión de Pedidos**
- Filtros por estado:
  - Todos
  - Pendiente
  - Procesando
  - Enviado
  - Entregado
  - Cancelado
- Vista de pedidos (próximamente con datos reales)

### 5. **Configuración del Sistema**

#### Configuración General:
- Nombre del Sitio: "Huerto Hogar"
- Email de Contacto: contacto@huertohogar.com
- Teléfono: +56 9 1234 5678

#### Configuración de Envío:
- Costo de Envío Base: $2,990 CLP
- Envío Gratis Desde: $30,000 CLP
- Toggle para habilitar/deshabilitar envío gratis

## 🎨 Características de la Interfaz

### Sidebar (Menú Lateral)
- **Colapsible:** Click en el botón hamburguesa para contraer/expandir
- **Navegación rápida** entre secciones
- **Indicador visual** de la sección activa (botón verde)
- **Sticky positioning:** Se mantiene fijo al hacer scroll

### Top Bar (Barra Superior)
- Título dinámico según la sección activa
- Link rápido "Ir a Huerto Hogar" para volver al sitio
- Notificaciones (badge con contador)
- Avatar del usuario con inicial
- Nombre del usuario
- Botón de cerrar sesión

### Diseño Responsivo
- **Desktop:** Sidebar fijo a la izquierda (250px)
- **Mobile:** Sidebar colapsado por defecto (80px)
- **Tablets:** Adaptación automática de tarjetas y tablas

### Temas y Colores
- Fondo principal: `#f8f9fa` (gris claro)
- Sidebar: Gradiente oscuro `#1a1a1a` → `#2d2d2d`
- Accent color: `#2E8B57` (verde HuertoHogar)
- Cards: Blanco con sombras sutiles

## 🔒 Seguridad

### Control de Acceso
- **Route Guard:** Solo usuarios con rol `administrador` pueden acceder
- **Redirección automática:** Los no-admin son redirigidos a Home
- **Verificación en tiempo real** del estado de autenticación

### Protección de Datos
- Los datos se almacenan en `localStorage`
- Las sesiones se validan en cada carga
- Las contraseñas se almacenan (en producción deberían estar encriptadas)

## 🚀 Tecnologías Utilizadas

- **React 19.1.1** - Librería UI
- **TypeScript 5.9.3** - Type safety
- **React Router v6** - Navegación
- **Zustand** - State management
- **Chart.js 4.4.7** - Gráficos
- **react-chartjs-2 5.3.0** - Wrapper de Chart.js para React
- **Bootstrap 5.3.2** - Framework CSS
- **Font Awesome 6** - Iconos

## 📝 Notas de Desarrollo

### Próximas Mejoras
1. **Gestión Completa de Productos:**
   - Modal para agregar nuevos productos
   - Modal para editar productos existentes
   - Reponer stock con actualizaciones automáticas

2. **Gestión Completa de Usuarios:**
   - Modal para crear nuevos usuarios
   - Modal para editar usuarios
   - Vista detallada de cada usuario
   - Eliminar usuarios con confirmación

3. **Sistema de Pedidos:**
   - Integración con sistema de compras
   - Actualización de estados de pedidos
   - Historial de pedidos por usuario
   - Generación de facturas/boletas

4. **Analytics Avanzados:**
   - Gráficos de productos más vendidos
   - Análisis de usuarios por región
   - Reportes de ventas por período
   - Exportación de datos a Excel/PDF

5. **Notificaciones:**
   - Sistema de notificaciones en tiempo real
   - Alertas de stock bajo
   - Notificaciones de nuevos pedidos
   - Mensajes del sistema

### Estructura de Archivos
```
src/
├── pages/
│   ├── admin/
│   │   └── Dashboard.tsx         # Componente principal del dashboard
│   └── usuario/
│       └── Perfil.tsx            # Página de perfil de usuario
├── services/
│   ├── usuariosService.ts        # Servicios de gestión de usuarios
│   └── usuariosIniciales.ts      # Datos iniciales de usuarios
├── store/
│   ├── authStore.ts              # Store de autenticación
│   └── productsStore.ts          # Store de productos
└── styles.css                     # Estilos globales + Dashboard

```

## 🎓 Guía de Uso

### 1. Iniciar el Proyecto
```bash
npm run dev
```

### 2. Iniciar Sesión como Admin
- Ve a http://localhost:5174/login
- Ingresa las credenciales de admin (ver arriba)
- Serás redirigido al Home

### 3. Acceder al Dashboard
- Click en tu nombre de usuario (esquina superior derecha)
- Click en "Dashboard"
- Serás redirigido a `/admin/dashboard`

### 4. Navegar por las Secciones
- Usa el menú lateral para cambiar entre secciones
- Click en las tarjetas de acciones rápidas
- Las tablas son scrolleables y responsivas

### 5. Gestionar Datos
- Click en los botones de acciones (👁️ Ver, ✏️ Editar, 🗑️ Eliminar)
- Los formularios incluyen validación
- Los cambios se guardan en `localStorage`

## 🐛 Troubleshooting

### El botón de Dashboard no aparece
- ✅ Verifica que hayas iniciado sesión con una cuenta de **administrador**
- ✅ Los usuarios con rol `cliente` NO ven el botón de Dashboard
- ✅ Refresca la página después de iniciar sesión

### Error al cargar el Dashboard
- ✅ Asegúrate de que `chart.js` y `react-chartjs-2` estén instalados
- ✅ Limpia el caché del navegador (Ctrl + F5)
- ✅ Revisa la consola del navegador para errores

### Los datos no se guardan
- ✅ Verifica que `localStorage` esté habilitado en tu navegador
- ✅ Los datos se almacenan localmente y persisten entre sesiones
- ✅ Para resetear, usa `localStorage.clear()` en la consola

## 📞 Soporte

Para preguntas o problemas, contacta con el equipo de desarrollo:
- Mauricio Gajardo - mauri@huertohogar.com
- Vicente Colicheo - vixo@huertohogar.com

---

**Versión:** 1.0.0  
**Última Actualización:** Octubre 2025  
**Estado:** ✅ Funcional - En desarrollo
