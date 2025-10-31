# Select Moderno - Estilo Apple

## ✨ Características

### Diseño Premium
- **Glassmorphism**: Fondo semi-transparente con efecto blur
- **Animaciones suaves**: Transiciones tipo Apple con cubic-bezier
- **Búsqueda integrada**: Filtra opciones en tiempo real
- **Estados visuales**: Hover, active, disabled, selected
- **Responsive**: Adaptado para mobile y desktop

### Funcionalidades
- ✅ Búsqueda en tiempo real (searchable)
- ✅ Detección de click fuera para cerrar
- ✅ Scroll customizado estilo macOS
- ✅ Iconos indicadores de estado
- ✅ Placeholder dinámico
- ✅ Estado disabled
- ✅ Checkmark en opción seleccionada

## 🎨 Estilos Aplicados

### Colores
- Background: `rgba(255, 255, 255, 0.8)` con backdrop-blur
- Border: `rgba(0, 0, 0, 0.06)` ultra sutil
- Hover: `#E8F5E9` (verde claro)
- Selected: Verde primario `#2E8B57`

### Sombras
- Normal: `0 4px 12px rgba(0, 0, 0, 0.08)`
- Dropdown: `0 8px 30px rgba(0, 0, 0, 0.12)`
- Active: `0 0 0 4px rgba(46, 139, 87, 0.1)` (ring verde)

### Animaciones
- Dropdown: slideDown con ease-out
- Icon: rotación 180° en apertura
- Options: translateX en hover

## 🚀 Uso en Checkout

```tsx
// Región con búsqueda
<SelectModerno
  label="Región"
  value={region}
  onChange={setRegion}
  options={regionesOptions}
  placeholder="Seleccionar región"
  required
  searchable
/>

// Ciudad dependiente de región
<SelectModerno
  label="Ciudad"
  value={ciudad}
  onChange={setCiudad}
  options={ciudadesOptions}
  placeholder="Selecciona tu ciudad"
  disabled={!region}
  required
  searchable
/>
```

## 📱 Ventajas sobre Select Nativo

| Característica | Select Nativo | SelectModerno |
|---------------|---------------|---------------|
| Búsqueda | ❌ | ✅ |
| Glassmorphism | ❌ | ✅ |
| Animaciones suaves | ❌ | ✅ |
| Custom styling | Limitado | Total |
| Iconos | ❌ | ✅ |
| Indicador selected | Browser default | Checkmark |
| Scroll personalizado | Browser default | Custom macOS |
| Responsive | Browser default | Optimizado |

## 🎯 Comparación Visual

### Antes (Select Bootstrap):
```
┌─────────────────────────┐
│ Región              ▼   │  <- Estilo browser nativo
└─────────────────────────┘
```

### Ahora (SelectModerno):
```
╔═════════════════════════╗
║ 🔍 Buscar región    ↓   ║  <- Glassmorphism
╠═════════════════════════╣
║ Región Metropolitana    ║
║ Valparaíso          ✓   ║  <- Checkmark
║ Bio-Bío                 ║
╚═════════════════════════╝
```

## 🎨 Estados Visuales

1. **Normal**: Fondo translúcido, border sutil
2. **Hover**: Border gris, fondo más opaco
3. **Active/Open**: Border verde, ring verde suave
4. **Disabled**: Opacidad 60%, cursor not-allowed
5. **Option Hover**: Fondo verde claro, slide a la derecha
6. **Option Selected**: Fondo verde, checkmark visible

## 💡 Tips de Uso

- **Con búsqueda**: Ideal para listas largas (regiones, países)
- **Sin búsqueda**: Para listas cortas (3-5 opciones)
- **Disabled**: Cuando depende de otra selección
- **Required**: Muestra asterisco rojo automáticamente

## 🔧 Personalización Futura

Puedes agregar:
- Multi-select
- Grupos de opciones
- Badges en opciones
- Imágenes/iconos por opción
- Loading state
- Infinite scroll para listas muy largas
