# Descripción General

## Stack tecnológico

| Capa | Tecnología | Versión / notas |
|---|---|---|
| Estructura | HTML5 semántico | Etiquetas `header`, `nav`, `main`, `section`, `form`, `table` |
| Estilos | CSS3 | Archivos externos, Flexbox y Grid, media queries |
| Comportamiento | JavaScript nativo (ES2020) | Scripts clásicos con namespace global; sin `import`/`export` |
| Persistencia | `localStorage` | Claves con prefijo `tuco:` y versión de esquema |
| Recursos | Imágenes locales | Carpeta `assets/portadas/` (archivos a incorporar) |
| Dependencias | Ninguna | Sin npm, sin build, sin CDN |

## Arquitectura general

Aplicación **multipágina estática**. Cada página HTML carga primero los módulos compartidos y después el módulo de su vista. Los módulos se comunican a través de un namespace global (`window.TUCO`) y leen/escriben el estado exclusivamente mediante `almacenamiento.js`.

```
Navegador
├── index.html          → catálogo
├── libros.html         → alta y listado de libros
├── clientes.html       → alta y listado de clientes
├── ventas.html         → composición de venta
├── historial.html      → listado de ventas
├── venta-detalle.html  → detalle de una venta (?id=ven-N)
│
├── css/estilos.css
├── assets/portadas/    → imágenes locales (pendiente de incorporar)
│
└── js/
    ├── datos-iniciales.js  → seed de editoriales, géneros, autores, libros y clientes
    ├── almacenamiento.js   → lectura/escritura de localStorage, IDs y arranque
    ├── validaciones.js     → funciones puras de validación y normalización
    ├── formato.js          → moneda es-AR y fechas
    ├── catalogo.js         → render del catálogo y filtro por título
    ├── libros.js           → alta y listado de libros
    ├── clientes.js         → alta y listado de clientes
    ├── ventas.js           → composición y confirmación de venta
    ├── historial.js        → listado de ventas
    └── venta-detalle.js    → detalle de una venta
```

### Comunicación entre módulos

- `datos-iniciales.js` publica `TUCO.datosIniciales` (arrays de seed).
- `almacenamiento.js` publica `TUCO.almacenamiento` y depende de `TUCO.datosIniciales`.
- `validaciones.js` y `formato.js` son funciones puras sin dependencias.
- Cada módulo de página publica su función de arranque y la ejecuta cuando el DOM está listo (`DOMContentLoaded` o `defer`).
- Las dependencias se resuelven **en tiempo de llamada**, no de carga, para que el orden de los `<script>` sea flexible.

## Integraciones externas

| Servicio | Propósito | Tipo |
|---|---|---|
| Ninguno | La aplicación no realiza peticiones de red | — |

## API REST

No aplica. El sistema no expone ni consume endpoints. Toda la persistencia es local al navegador.
