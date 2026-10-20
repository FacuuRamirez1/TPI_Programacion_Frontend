# Librería TU-CO — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

| Capa | Tecnología | Versión / notas |
|---|---|---|
| Estructura | HTML5 semántico | `header`, `nav`, `main`, `section`, `form`, `table` |
| Estilos | CSS3 | Archivos externos, Flexbox y Grid, media queries |
| Comportamiento | JavaScript nativo (ES2020) | Scripts clásicos con namespace global; sin `import`/`export` |
| Persistencia | `localStorage` | Claves con prefijo `tuco:` y versión de esquema |
| Recursos | Imágenes locales | `assets/portadas/` (archivos a incorporar) |
| Dependencias | Ninguna | Sin npm, sin build, sin CDN |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito, alcance y métricas |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actor único y rutas públicas |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, IDs, seed y persistencia |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-XX) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Épicas e historias de usuario |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Módulos, patrones y estructura de directorios |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones (DD) y supuestos (SU) |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | Inconsistencias y preguntas abiertas |

> `IN-01` (integrantes del README) e `IN-03` (portadas y procedencia) son **bloqueos de cierre del change C-06**, no del primer change. `IN-02` ya está resuelto: scripts clásicos con `window.TUCO`.

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Frontend** | Implementación HTML/CSS/JS vanilla | `vanilla-web`, `frontend-design`, `accessibility` |
| **Calidad** | Revisión, auditoría y cierre | `code-review-and-quality`, `web-quality-audit`, `web-design-guidelines` |
| **Orquestación** | SDD / OPSX / KB / roadmap | `active-orchestrator`, `kb-creator`, `roadmap-generator`, `agents-md-generator`, `skill-registry` (GLOBAL) |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 6 changes secuenciales, uno por ejercicio del TPI.
- **Camino crítico**: `C-01 → C-02 → C-03 → C-04 → C-05 → C-06`.
- **Primer change**: `C-01` (`estructura-pantallas-html`), governance BAJO.
- Sin ramas: cada gate desbloquea exactamente un change.

| ID | Change | Ejercicio | Governance |
|---|---|---|---|
| C-01 | `estructura-pantallas-html` | 1 — HTML | BAJO |
| C-02 | `presentacion-css-adaptable` | 2 — CSS | BAJO |
| C-03 | `datos-locales-catalogo-filtro` | 3 — Datos y catálogo | CRITICO |
| C-04 | `altas-libros-clientes` | 4 — Altas | MEDIO |
| C-05 | `venta-simulada-historial` | 5 — Ventas | CRITICO |
| C-06 | `persistencia-verificacion-documentacion` | 6 — Cierre | ALTO |

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras (específicas del proyecto)

> Reglas globales del harness (orquestador, governance, TDD, engram) ya activas en la sesión: el proyecto las hereda y no se repiten acá. Este repo no tiene `~/.claude/CLAUDE.md`, así que se listan también las universales que el harness no cubre.

### A. Stack y entrega
1. **NUNCA** frameworks, librerías, CDNs, npm ni build → solo HTML5 + CSS3 + JS nativo, recursos locales.
2. **NUNCA** `import`/`export` ni `<script type="module">` → scripts clásicos con namespace `window.TUCO`; debe abrir con doble clic en `index.html` (`file://`).
3. **NUNCA** `fetch`/XHR/backend → persistencia solo `localStorage` con claves `tuco:*`.
4. **NUNCA** hardcodear el catálogo o el seed en HTML → render desde `TUCO.datosIniciales`/`localStorage`.
5. **NUNCA** agregar dependencias ni CI → la entrega es la carpeta/zip abrible directamente.

### B. Código y datos
6. **NUNCA** `innerHTML` con datos de usuario → `createElement` + `textContent`; IDs `lib-N`, `cli-N`, `ven-N`, `edi-N`, `gen-N`, `aut-N`.
7. **NUNCA** validar dentro de los handlers → funciones puras en `validaciones.js` (libros, clientes, ventas).
8. **NUNCA** formatear moneda/fecha a mano → `Intl.NumberFormat('es-AR')` y `dd/mm/aaaa`.
9. **NUNCA** editar o borrar ventas confirmadas → snapshot de `titulo`/`precioUnitario`, historial inmutable.

### C. Accesibilidad
10. **NUNCA** `div` clickeable, `outline: none` sin reemplazo, ni error indicado solo por color → controles nativos, `:focus-visible`, texto + `aria-invalid`/`aria-describedby`.
11. **NUNCA** `<img>` sin `alt`, control sin `<label for>` ni tabla sin `th scope="col"` → obligatorio en todas las vistas.

### D. Proceso
12. **NUNCA** commit/push sin pedido explícito.
13. **NUNCA** declarar un caso manual como aprobado sin ejecutarlo → README con resultado observado real.
14. En `C-03` y `C-05` (governance CRÍTICO) → proponer y esperar aprobación antes de escribir; en `C-04` (MEDIO) → implementar con checkpoints.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
