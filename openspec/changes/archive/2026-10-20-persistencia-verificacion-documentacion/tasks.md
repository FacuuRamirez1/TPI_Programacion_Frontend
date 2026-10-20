# Tasks

## 1. Preparación y contenedor de mensajes globales

- [x] 1.1 Agregar contenedor de mensajes globales en las 6 vistas HTML (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `venta-detalle.html`): `<div id="tuco-mensajes" role="status" aria-live="polite" class="visualmente-oculto"></div>` y verificar que existe en cada archivo
- [x] 1.2 Agregar estilo `.visualmente-oculto` en `css/estilos.css` (si no existe) y clase `.mensaje--error`, `.mensaje--aviso`, `.mensaje--exito` para mostrar/ocultar el contenedor, y verificar que los mensajes son accesibles (texto + color, foco visible)

## 2. js/almacenamiento.js v2 — Versión de esquema y seed único

- [x] 2.1 Implementar `inicializarEsquema()`: verifica `tuco:esquema`; si no existe, ejecuta seed completo en todas las colecciones y persiste `tuco:esquema = "1"`; si existe, no hace seed. Verificar: abrir `index.html` en navegador limpio (sin localStorage) → seed aplicado + `tuco:esquema = "1"` en DevTools Application
- [x] 2.2 Modificar `leerColeccion(nombre)`: si `tuco:esquema === "1"` y la colección falta → devuelve `[]` y persiste `[]` (no seed); si no hay esquema → comportamiento legacy (seed). Verificar: con esquema existente, borrar `tuco:libros` en DevTools → recargar → catálogo muestra "Catálogo vacío" (no seed)
- [x] 2.3 Modificar `escribirColeccion(nombre, datos)`: `try/catch` en `setItem`; en `QuotaExceededError` → lanza error custom `AlmacenamientoError("CUOTA_AGOTADA", mensajeVisible)`; en éxito → reemplaza toda la colección. Verificar: simular cuota llena (DevTools → Application → Clear storage → set quota baja) → guardar libro → mensaje visible "No hay espacio..." y operación no confirmada

## 3. js/almacenamiento.js v2 — Manejo de fallas visible al usuario

- [x] 3.1 Implementar `leerColeccionSegura(nombre)`: `try/catch` en `JSON.parse`; en `SyntaxError` → muestra mensaje visible via `TUCO.mostrarMensaje("error", "Datos de X corruptos. ¿Reiniciar solo esta colección?", {accion: "reiniciar", coleccion: nombre})`; devuelve `[]` temporal. Verificar: corruptar `tuco:clientes` en DevTools (`tuco:clientes = "{"invalido"`) → recargar `clientes.html` → mensaje visible con opción de reinicio
- [x] 3.2 Implementar detección de `localStorage` no disponible: en init, `try { localStorage.setItem("test", "1"); localStorage.removeItem("test"); } catch { modoMemoria = true; }`. Si `modoMemoria` → muestra aviso persistente en header "El almacenamiento local no está disponible. Los datos no se guardarán al recargar." Verificar: abrir en modo privado Safari / Firefox con `dom.storage.enabled=false` → aviso visible + app funcional en sesión
- [x] 3.3 Agregar `TUCO.mostrarMensaje(tipo, texto, opciones)` y `TUCO.ocultarMensaje()` en `almacenamiento.js` (o `app.js` nuevo) que escribe en `#tuco-mensajes` con clases CSS apropiadas y `role="status"`. Verificar: llamar `TUCO.mostrarMensaje("error", "Prueba")` en consola → mensaje aparece en pantalla, accesible por lector de pantalla

## 4. js/almacenamiento.js v2 — API pública compatible

- [x] 4.1 Mantener firma y comportamiento de `leerColeccion(nombre)`, `escribirColeccion(nombre, datos)`, `siguienteId(prefijo)` para no romper `libros.js`, `clientes.js`, `ventas.js`, `catalogo.js`, `historial.js`, `venta-detalle.js`. Verificar: ejecutar flujo completo C-05 (alta libro, alta cliente, venta, historial, detalle) → todo funciona sin errores
- [x] 4.2 Exportar `TUCO.almacenamiento` con `{ leerColeccion, escribirColeccion, siguienteId, inicializarEsquema, leerColeccionSegura }` en `window.TUCO`. Verificar: `console.log(window.TUCO.almacenamiento)` → objeto con las 5 funciones

## 5. README.md de entrega

- [x] 5.1 Crear `README.md` en raíz con secciones: **Integrantes** (nombres completos), **Cómo abrir** (doble clic `index.html`, sin npm/servidor), **Navegación** (enlaces entre las 6 vistas), **Funcionalidades implementadas** (lista US-001 a US-014), **Funcionalidades pendientes/ausentes** (stock, facturación, login, ABM editoriales/géneros/autores, edición/borrado libros/clientes/ventas), **Estructura del seed** (tablas con editoriales, géneros, autores, libros, clientes y sus IDs), **Claves y límites de localStorage** (`tuco:esquema`, `tuco:editoriales`... `tuco:ventas`, cuota ~5MB, modo privado), **Procedencia de imágenes** (carpeta `assets/portadas/`, origen de cada archivo o "placeholder"), **Casos manuales** (tabla con: Caso, Pasos, Resultado esperado, Resultado observado ✅/❌, Evidencia). Verificar: `README.md` existe en raíz y tiene todas las secciones
- [x] 5.2 Completar tabla de casos manuales de cierre ejecutándolos y registrando resultado **observado real**:
  - Recarga después de altas y venta sin duplicar seed
  - Modificar precio en `tuco:libros` y verificar que `tuco:ventas` conserva precio unitario histórico
  - Navegación por teclado (Tab, Enter, Escape) en todas las vistas
  - Responsive 320px y 1280px sin scroll horizontal global
  Verificar: cada fila de la tabla tiene ✅/❌ real, no declarado sin ejecutar
  > **Nota**: 13/13 casos ejecutados. **13 ✅** (Caso 3 fix verificado: `tabindex="0"` en `crearTarjeta()` de `catalogo.js`)

## 6. Verificación final de restricciones

- [x] 6.1 Buscar en todo el proyecto: `grep -r "fetch\|import\|export\|require\|axios\|cdn\|node_modules" --include="*.js" --include="*.html"` → cero resultados. Verificar: comando no devuelve líneas
- [x] 6.2 Verificar que todos los recursos son locales: `css/estilos.css`, `js/*.js`, `assets/portadas/*` referenciados con rutas relativas. Verificar: DevTools Network → solo `file://` requests, sin red
- [x] 6.3 Verificar que no hay `package.json`, `package-lock.json`, `yarn.lock`, `webpack.config.js`, `vite.config.js`, `.gitignore` con `node_modules`. Verificar: `ls` en raíz → solo archivos del proyecto

## 7. Integración y archivado

- [x] 7.1 Ejecutar suite completa de casos manuales (C-01 a C-06) y confirmar que todos pasan. Verificar: checklist completa en README marcada ✅
  > **Nota**: 13/13 casos de cierre ejecutados. **13 ✅** (Caso 3 fix verificado: `tabindex="0"` en `crearTarjeta()` de `catalogo.js`)
- [x] 7.2 Actualizar `CHANGES.md`: marcar `[x]` en C-06 `persistencia-verificacion-documentacion`. Verificar: `CHANGES.md` muestra `[x]`
- [x] 7.3 Ejecutar `/opsx:archive persistencia-verificacion-documentacion` para sincronizar specs y archivar change. Verificar: change archivado en `openspec/changes/archive/`