# Design

## Context

El proyecto ya tiene implementados C-01 a C-05. El módulo `js/almacenamiento.js` (v1) expone `leerColeccion` / `escribirColeccion` y genera IDs, pero carece de: versión de esquema, semántica de seed-una-vez, inicialización vacía de colecciones faltantes con esquema existente, y manejo de fallas visible al usuario con recuperación selectiva. Los specs `catalogo-local` (requisito 2) y `persistencia-local` (nuevo) definen el comportamiento objetivo.

Stack: HTML5 + CSS3 + JS nativo (scripts clásicos, namespace `window.TUCO`, `defer`), `localStorage` con claves `tuco:*`, sin build, sin dependencias. Arquitectura multipágina: 6 vistas HTML comparten `js/almacenamiento.js`.

## Goals / Non-Goals

**Goals:**
- `js/almacenamiento.js` v2 con versión de esquema (`tuco:esquema = "1"`), seed solo en primer inicio, colecciones faltantes → vacías, escritura atómica por colección.
- Manejo de fallas: cuota agotada → mensaje visible + no confirmar; JSON corrupto → mensaje visible + opción reinicio selectivo; localStorage no disponible → modo memoria + aviso visible.
- `README.md` de entrega completo: integrantes, pasos apertura, navegación, funcionalidades, estructura seed, claves/límites localStorage, procedencia imágenes, tabla casos manuales con resultado **observado real**.
- Verificación final: sin librerías/frameworks/CDN/fetch, recursos locales, sin dependencias ni build.

**Non-Goals:**
- Cambiar la API pública de `almacenamiento.js` (mantener `leerColeccion`, `escribirColeccion`, `siguienteId`).
- Migrar a IndexedDB, cookies, u otra persistencia.
- Añadir tests automatizados (el TPI usa casos manuales).
- Implementar sincronización multi-pestaña o broadcast channel.

## Decisions

| Decisión | Alternativas consideradas | Rationale |
|----------|---------------------------|-----------|
| **Versión de esquema en `tuco:esquema` (string "1")** | Usar número, usar fecha, usar objeto con metadatos | String simple es robusto a parsing, extensible a futuro ("2"), y coincide con patrón de claves `tuco:*`. |
| **Seed solo en primer inicio (falta de `tuco:esquema`)** | Verificar si alguna colección existe, comparar checksum del seed | La ausencia de `tuco:esquema` es señal inequívoca de "nunca inicializado"; evita falsos positivos si el usuario borra una colección a mano. |
| **Colección faltante con esquema → vacía (no seed)** | Re-aplicar seed solo a esa colección, lanzar error | Si el esquema ya existe, el usuario ya tuvo datos; re-seedear una colección borraría sus datos reales. Vacía es seguro y predecible. |
| **Escritura atómica: `setItem` reemplaza toda la colección** | Merge parcial, patch JSON (RFC 6902) | `localStorage` no soporta transacciones; reemplazo completo es atómico a nivel de clave y evita estados intermedios corruptos. |
| **Mensajes visibles al usuario (no solo consola)** | Solo `console.warn`, `alert()`, toast custom | Reglas duras exigen errores con texto (no solo color) y accesibilidad. Un contenedor `role="status"`/`aria-live="polite"` en cada vista cubre todos los casos sin `alert()`. |
| **Reinicio selectivo por colección (no global)** | Botón "Reiniciar todo", borrado automático silencioso | Reinicio selectivo respeta datos del usuario en otras colecciones; borrado automático viola principio de menor sorpresa. |
| **README.md en raíz del proyecto (no en docs/)** | Carpeta `docs/`, `ENTREGA.md` | Consigna del TPI pide README en la raíz para apertura directa. |
| **Casos manuales con resultado observado real** | Declarar aprobados sin ejecutar | Regla dura: "NUNCA declarar un caso manual como aprobado sin ejecutarlo". |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| **JSON corrupto en una colección bloquea toda la app** | Try/catch por colección; fallback a seed/vacía solo esa colección; resto sigue funcional. |
| **Cuota agotada en medio de una venta** | `escribirColeccion` valida cuota antes (try/catch), muestra mensaje, no confirma; venta queda en memoria para reintentar tras liberar espacio. |
| **Usuario borra `tuco:esquema` a mano → re-seed completo** | Documentar en README que `tuco:esquema` controla el seed; bajo riesgo (usuario técnico). |
| **Modo privado (Safari) bloquea localStorage** | Detectar `SecurityError` en init, activar modo memoria + aviso persistente en header; app usable en sesión. |
| **README se desactualiza respecto al código** | Checklist en tasks: actualizar README como último paso tras verificar casos manuales. |

## Migration Plan

1. **Backup**: `git commit -am "pre-C06"` (ramas no requeridas, pero commit previo).
2. **Reemplazar** `js/almacenamiento.js` v1 → v2 (misma API pública).
3. **Actualizar** `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `venta-detalle.html`: agregar contenedor de mensajes globales (`<div id="tuco-mensajes" role="status" aria-live="polite"></div>`) para errores de persistencia.
4. **Crear** `README.md` en raíz con todas las secciones requeridas.
5. **Ejecutar** todos los casos manuales de cierre (recarga sin duplicar seed, inmutabilidad precios, teclado, 320/1280px) y registrar resultados en README.
6. **Verificar** restricciones finales: grep por `fetch`/`import`/`CDN`/`node_modules` → cero resultados.
7. **Commit** final: `git commit -am "C-06: persistencia, verificación, documentación"`.

Rollback: `git checkout HEAD~1 -- js/almacenamiento.js` + borrar `README.md` + quitar contenedores de mensajes.

## Open Questions

- **Nombres de los integrantes** para README (IN-01): pendiente de confirmación del usuario antes de archivar C-06.
- **Procedencia de imágenes** en `assets/portadas/` (IN-03): pendiente; placeholders actuales tienen `alt` descriptivo.
- **Formato exacto del identificador de venta** (numérico `ven-N` vs `V-001`) y si fecha incluye hora: C-05 ya usa `ven-N` + `new Date().toISOString()`; mantener consistencia.