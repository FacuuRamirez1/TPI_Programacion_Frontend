# Proposal

## Why

Las vistas `ventas.html`, `historial.html` y `venta-detalle.html` existen desde C-01, pero siguen siendo maquetas: los selectores solo tienen el placeholder, los botones no hacen nada y no hay forma de confirmar ni auditar una venta. El Ejercicio 5 exige componer renglones, confirmar una venta con precios históricos inmutables y consultarla después, que es además la base de la comprobación del docente prevista para C-06.

## What Changes

- Nuevo `js/ventas.js`: carga clientes y libros desde `localStorage`, puebla los selectores, mantiene los renglones de la venta en memoria, agrega y quita renglones, edita cantidades y recalcula subtotales y total en vivo.
- Extensión de `js/validaciones.js` con funciones puras para renglones y ventas: `validarRenglon` y `validarVenta`, reutilizando `validarCantidad` y concentrando las reglas de cliente, libro, cantidad, duplicados y snapshot fuera de los handlers.
- Confirmación inmutable: se copian `titulo` y `precioUnitario` a cada renglón y `clienteNombre` y `total` a la venta; se genera `ven-N`, se guarda la fecha ISO y se persiste la colección completa en `tuco:ventas`.
- Nuevo `js/historial.js`: renderiza identificador, fecha `dd/mm/aaaa`, cliente y total formateado, con enlace al detalle y mensaje de historial vacío.
- Nuevo `js/venta-detalle.js`: lee `?id=ven-N`, renderiza los datos de la venta y sus renglones con los valores históricos guardados; si el id falta o no existe, muestra un mensaje y deja disponible el enlace de vuelta al historial.
- Cambio mínimo de HTML en las tres vistas: resumen de errores y errores por campo en ventas, distinción entre «Agregar renglón» y «Confirmar venta», cantidad editable dentro de la fila del renglón, mensaje de detalle oculto por defecto y carga de scripts con `defer`.
- Inmutabilidad explícita: el historial y el detalle no ofrecen acciones de edición ni de borrado de ventas confirmadas.

## Capabilities

### New Capabilities

- `venta-simulada`: composición de la venta en `ventas.html` (carga de clientes y libros, alta, edición y baja de renglones, cálculo en vivo) y confirmación con snapshot histórico, identificador `ven-N`, fecha ISO, persistencia y feedback.
- `historial-ventas`: listado de ventas confirmadas con fecha y total formateados, mensaje de historial vacío, detalle por `?id=ven-N` con valores históricos, manejo de id ausente o inexistente e inmutabilidad de las ventas desde la interfaz.

La separación replica el criterio de C-04: composición/confirmación y consulta son flujos distintos, con entradas, validaciones y pantallas propias; un único spec mezclaría la escritura de ventas con su lectura y dificultaría ubicar los requisitos de cada épica.

### Modified Capabilities

<!-- Ninguna: no cambian requisitos de las capabilities existentes. La extensión de validaciones.js implementa reglas nuevas de venta, no modifica los contratos de registro-libros ni registro-clientes. -->

## Non-Goals

- Stock, disponibilidad, descuentos, impuestos, facturación ni cualquier cálculo contable distinto de `cantidad × precioUnitario`.
- Edición o borrado de ventas ya confirmadas desde la interfaz; el historial es de solo lectura.
- Backend, autenticación, `fetch`/XHR, frameworks, librerías, CDN, npm o build.
- Carrito persistente: los renglones en composición viven en memoria y se descartan al recargar o al confirmar.
- Sincronización en vivo entre pestañas o documentos; cada vista lee `tuco:ventas` al cargarse.
- Mensaje global ante cualquier falla de `localStorage` (C-06); en C-05 solo se verifica la escritura de la venta confirmada.
- Pruebas automatizadas, `package.json` o un test runner.

## Impact

- Archivos nuevos: `js/ventas.js`, `js/historial.js`, `js/venta-detalle.js`.
- Archivos modificados: `js/validaciones.js` (se agregan `validarRenglon` y `validarVenta`, sin duplicar `validarCantidad`), `ventas.html`, `historial.html` y `venta-detalle.html` (contenedores de error, `aria-describedby`, botones, plantilla de renglón, `hidden` del mensaje de detalle y etiquetas `<script defer>`).
- Sin cambios en `css/estilos.css`, `index.html`, `libros.html`, `clientes.html`, `js/almacenamiento.js`, `js/formato.js` ni `js/datos-iniciales.js`.
- Claves de `localStorage` afectadas: `tuco:ventas` (lectura y escritura completa) y lectura de `tuco:clientes` y `tuco:libros`.
- Sin dependencias, sin build, sin peticiones de red; las tres vistas siguen abriéndose con doble clic desde `file://`.
- Verificación mediante `node --check`, inspección estática y casos manuales en el navegador con resultado observado.
