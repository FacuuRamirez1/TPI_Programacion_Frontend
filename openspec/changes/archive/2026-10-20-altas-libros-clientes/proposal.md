# Proposal

## Why

El catálogo ya se renderiza desde datos locales, pero todavía no existe ninguna forma de incorporar libros ni clientes: las vistas `libros.html` y `clientes.html` muestran formularios sin comportamiento, listados vacíos y selectores sin opciones. El Ejercicio 4 exige altas con validaciones, persistencia local y actualización del DOM sin recargar, que además son la base para componer ventas en el ejercicio siguiente.

## What Changes

- Nuevo `js/validaciones.js` con funciones puras de normalización y validación de libros, clientes y cantidades de venta, sin DOM ni acceso a `localStorage`, expuestas en `TUCO.validaciones`.
- Nuevo `js/libros.js`: intercepta el `submit` con `preventDefault`, lee los campos, valida contra las colecciones locales, genera `lib-N` con `siguienteId`, persiste en `tuco:libros` y vuelve a renderizar el listado sin recargar.
- `libros.html` se completa con el resumen de errores, los mensajes por campo y el `aria-describedby` correspondiente; los `select` de editorial, género y autores se pueblan desde los datos locales, con «Sin clasificar» (`value=""`) en género y selección múltiple de autores.
- Nuevo `js/clientes.js`: intercepta el `submit`, valida nombre y email, genera `cli-N`, persiste en `tuco:clientes` y vuelve a renderizar el listado sin recargar.
- `clientes.html` se completa con el resumen de errores, los mensajes por campo y el `aria-describedby` correspondiente.
- Feedback de alta: error por campo con texto, resumen al inicio del formulario, `aria-invalid`, mensaje de éxito y limpieza del formulario tras un alta válida.
- Un alta persiste en `localStorage`; el listado de la misma vista se actualiza sin recarga y las demás vistas (catálogo de `index.html` y selectores de `ventas.html`) toman los datos nuevos cuando se cargan.
- `libros.html` y `clientes.html` cargan los scripts compartidos y el de su vista con `defer`, en el orden de dependencia indicado por la arquitectura.

## Capabilities

### New Capabilities

- `registro-libros`: alta de libros con validación de título, ISBN normalizado y único, precio, editorial existente, autores existentes y género opcional existente; generación de `lib-N`, persistencia y re-render del listado y de los selectores sin recargar.
- `registro-clientes`: alta de clientes con validación de nombre completo, formato de email y unicidad normalizada; generación de `cli-N`, persistencia y re-render del listado sin recargar.

### Modified Capabilities

<!-- Ninguna: el render del catálogo y el modelo local no cambian sus requisitos; las altas agregan comportamiento nuevo. -->

## Non-Goals

- Stock, disponibilidad, facturación, impuestos ni ningún cálculo contable.
- ABM completo: no se editan ni se eliminan libros o clientes desde la interfaz.
- Backend, autenticación, `fetch`/XHR, frameworks, librerías, CDN, npm o build.
- Composición, confirmación e historial de ventas (C-05); en C-04 solo se deja la validación pura de cantidad reutilizable.
- Mensaje visible ante falla de `localStorage` (C-06); en C-04 la falla se registra en consola, según el adaptador de C-03.
- Sincronización en vivo entre pestañas o documentos distintos: cada vista lee `localStorage` al cargarse.
- Pruebas automatizadas, `package.json` o un test runner.

## Impact

- Archivos nuevos: `js/validaciones.js`, `js/libros.js`, `js/clientes.js`.
- Archivos modificados: `libros.html` y `clientes.html` (contenedores de error, `aria-describedby`, `select` de autores sin opción placeholder deshabilitada y etiquetas `<script defer>`); no se modifican `css/estilos.css`, `index.html`, `ventas.html` ni los módulos de C-03.
- Claves de `localStorage` afectadas: `tuco:libros` y `tuco:clientes` (lectura y escritura completa de la colección).
- Sin dependencias, sin build, sin peticiones de red; ejecutable con doble clic desde `file://`.
- Verificación mediante `node --check` y casos manuales en el navegador; no se agregan pruebas automatizadas.
