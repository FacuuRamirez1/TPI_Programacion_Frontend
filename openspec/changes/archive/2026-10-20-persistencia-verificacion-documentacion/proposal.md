# Proposal

## Why

Cierre del TPI: completar la semántica de persistencia (versión de esquema, seed único, manejo de fallas robusto), documentar la entrega en `README.md` con casos manuales observados y verificar que no hay dependencias externas. Es el último change (C-06) que bloquea la entrega completa del trabajo práctico.

## What Changes

- **Nueva capacidad**: `persistencia-local` — capa de almacenamiento robusta con versión de esquema, inicialización de seed solo en primer arranque, creación de colecciones vacías cuando el esquema ya existe, escritura atómica por colección, y manejo de fallas visible al usuario (sin cuota, JSON corrupto) con opción de reinicio selectivo.
- **Capacidad modificada**: `catalogo-local` — el requisito 2 (carga desde localStorage) cambia: ahora se usa `tuco:esquema = "1"` para distinguir primer inicio, seed solo una vez, colecciones faltantes con esquema creado se inicializan vacías (no con seed), y errores de cuota/corrupción muestran mensaje visible + opción de reiniciar solo la colección afectada (no borrado automático).
- **Documentación**: `README.md` de entrega con integrantes, pasos de apertura, navegación, funcionalidades, estructura del seed, claves y límites de `localStorage`, procedencia de imágenes, tabla de casos manuales con resultado **observado real**.
- **Verificación final**: confirmar ausencia de librerías/frameworks/CDN/fetch, recursos locales, entrega sin dependencias ni build.

## Capabilities

### New Capabilities
- `persistencia-local`: Capa de almacenamiento versionada con seed-una-vez, manejo de fallas visible y reinicio selectivo de colecciones.

### Modified Capabilities
- `catalogo-local`: El requisito 2 (carga e inicialización de colecciones) cambia para usar versión de esquema, semántica de seed único y manejo de errores visible al usuario con recuperación selectiva.

## Impact

- **Archivos nuevos**: `openspec/specs/persistencia-local/spec.md`, `README.md` (raíz del proyecto)
- **Archivos modificados**: `js/almacenamiento.js` (v2), `openspec/specs/catalogo-local/spec.md` (delta)
- **Tests/verificación**: casos manuales de recarga sin duplicar seed, inmutabilidad de precios en ventas, navegación teclado, responsive 320/1280px
- **Governance**: ALTO — requiere aprobación antes de escribir código