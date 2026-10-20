# Proposal

## Why

El TPI arranca con el Ejercicio 1: entregar una maqueta navegable de la Librería TU-CO en HTML semántico. Sin esta base común de páginas, navegación y formularios, los ejercicios siguientes (CSS, datos, altas y ventas) no tienen dónde apoyarse. Este change fija la estructura y la accesibilidad mínima antes de incorporar estilos y lógica.

## What Changes

- Se crean las seis vistas estáticas del sistema: `index.html` (catálogo), `libros.html`, `clientes.html`, `ventas.html`, `historial.html` y `venta-detalle.html`.
- Se replica en cada vista una cabecera con el nombre de la librería, una navegación con los cinco enlaces principales y `aria-current="page"` en el enlace activo, un `main` propio y un `footer` opcional.
- Se maquetan los formularios, tablas y contenedores de mensajes requeridos por cada vista, sin persistencia ni cálculo de datos.
- Se agrega `assets/portadas/` con placeholders locales y texto alternativo descriptivo.
- Se completan los estados vacíos y los mensajes de «sin resultados» como contenido estático visible.
- **Fuera de alcance**: estilos de presentación (C-02), datos iniciales, render dinámico, validaciones, persistencia y lógica de ventas (C-03 a C-06). No se agregan frameworks, dependencias, build ni peticiones de red.

## Capabilities

### New Capabilities

- `estructura-pantallas`: estructura semántica y navegable de las seis vistas, con formularios etiquetados, tablas con encabezados, mensajes de estado y placeholders de portadas.

### Modified Capabilities

- Ninguna: no existen specs previas en `openspec/specs/`.

## Impact

- Archivos nuevos: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `venta-detalle.html`, `assets/portadas/` y sus placeholders.
- No se tocan `css/` ni `js/` en este change; quedan reservados para C-02 en adelante.
- Sin dependencias externas, sin backend, sin cambios de configuración ni de esquema de datos.
- Riesgo principal: que el HTML estático se confunda con la implementación funcional. Se mitiga dejando explícito que C-01 solo entrega estructura y contenido de ejemplo.
