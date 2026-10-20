# Skill Registry — Librería TU-CO (repaso_parcial)

**Delegator use only.** El delegador resuelve aquí las reglas compactas y las inyecta en el prompt del sub-agente como `## Project Standards (auto-resolved)`. Los sub-agentes NO leen este archivo ni los `SKILL.md` individuales.

Generado por `skill-registry`. Actualizar con `/skill-registry` tras instalar o quitar skills.

> **Precedencia:** convenciones del proyecto > skill local > skill global. Ante conflicto gana la restricción del proyecto (ver "Conflictos resueltos").

## Project Skills (prioridad)

| Trigger | Skill | Source | Scope | Path |
|---------|-------|--------|-------|------|
| a11y audit, WCAG, teclado, foco, screen reader | `accessibility` | addyosmani/web-quality-skills | project | `.agents/skills/accessibility/SKILL.md` |
| revisar UI, UX, HTML/CSS, "check my site" | `web-design-guidelines` | vercel-labs/agent-skills | project | `.agents/skills/web-design-guidelines/SKILL.md` |
| auditar calidad web, Lighthouse, Core Web Vitals | `web-quality-audit` | addyosmani/web-quality-skills | project | `.agents/skills/web-quality-audit/SKILL.md` |
| code review, calidad, cambio listo para entregar | `code-review-and-quality` | addyosmani/agent-skills | project | `.agents/skills/code-review-and-quality/SKILL.md` |
| diseño visual, paleta, tipografía, layout | `frontend-design` | anthropics/skills | project | `.agents/skills/frontend-design/SKILL.md` |
| HTML/CSS/JS sin framework, página estática, widget | `vanilla-web` | janjaszczak/cursor | project | `.agents/skills/vanilla-web/SKILL.md` |

## Global Skills (GLOBAL — no son skills del equipo del proyecto)

| Trigger | Skill | Scope | Relevancia aquí |
|---------|-------|-------|-----------------|
| desplegar, "deploy", preview | `deploy-to-vercel` | GLOBAL | No aplica: sin build ni deploy (entrega por zip). |
| descubrir/instalar skills | `find-skills` | GLOBAL | Meta-skill; usar solo ante pedido explícito. |
| diseño visual | `frontend-design` | GLOBAL | **Sombreada** por la copia project; usar la local. |
| SEO audit, rankings, indexación | `seo-audit` | GLOBAL | No aplica: sitio local `file://`, sin hosting. |
| shadcn/ui, components.json, presets | `shadcn` | GLOBAL | No aplica: prohibido React/Node. |
| Supabase (DB, Auth, RLS, CLI) | `supabase` | GLOBAL | No aplica: sin backend. |
| Postgres, SQL, migraciones | `supabase-postgres-best-practices` | GLOBAL | No aplica: sin base de datos. |
| costos/performance en Vercel | `vercel-optimize` | GLOBAL | No aplica: sin deploy. |
| React/Next.js performance | `vercel-react-best-practices` | GLOBAL | No aplica: prohibido React/Next. |
| flujo de fundación SDD | `active-orchestrator`, `discovery-research`, `kb-creator`, `roadmap-generator`, `agents-md-generator`, `web-scraper`, `skill-creator` | GLOBAL | Workflow; fuera del alcance de implementación. No cargar al programar. |

## Compact Rules

### accessibility
- Preferir elementos nativos (`<button>`, `<a href>`, `<input>`) antes que `div` con `role`/`tabindex`; nunca añadir keydown manual a un `<button>` (doble disparo).
- Todo control necesita nombre accesible: `<label for>`, `aria-label` o texto visually-hidden; iconos decorativos con `aria-hidden="true"`.
- Nunca `outline: none` sin reemplazo: usar `:focus-visible` con outline 2px y `outline-offset: 2px`; contraste de foco ≥ 3:1.
- Contraste: 4.5:1 texto normal, 3:1 texto grande y componentes; el error no se indica solo con color (texto + `aria-invalid` + `aria-describedby`).
- Errores de formulario: mensaje asociado por campo, `role="alert"`/`aria-live` para lo dinámico, foco al primer error al enviar.
- Targets ≥ 24×24 px (recomendado 44×44); respetar `prefers-reduced-motion`; `<html lang="es">` y navegación consistente entre páginas.
- Checklist manual obligatorio: Tab por toda la página, sin trampas, skip-link, lector de pantalla y zoom 200%.

### web-design-guidelines
- Antes de revisar, obtener las reglas vigentes de `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` (WebFetch).
- Leer los archivos indicados (o preguntar cuáles) y contrastar contra TODAS las reglas obtenidas.
- Reportar en formato terso `archivo:línea` + regla incumplida; sin prosa decorativa.
- No inventar reglas que no estén en la fuente; distinguir hallazgo de hipótesis.

### web-quality-audit
- Definir alcance antes de auditar: páginas/estados, mobile y desktop; medir primero si la página corre y separar medición de hipótesis de código.
- Performance: LCP < 2.5 s, INP < 200 ms, CLS < 0.1; imágenes con dimensiones explícitas y formatos comprimidos.
- A11y: alt significativo, contraste AA, teclado, foco visible, labels, `lang`, HTML válido sin IDs duplicados, ARIA solo si es necesario.
- Best practices: `<!DOCTYPE html>`, `<meta charset="UTF-8">` primero en `<head>`, sin APIs deprecadas, consola limpia.
- Severidad: Critical (seguridad/fallo total) → High (CWV/a11y grave) → Medium → Low; cada hallazgo con impacto, evidencia y fix.
- Cerrar re-ejecutando lo automatizado y los flujos manuales afectados; declarar qué quedó verificado y qué no.

### code-review-and-quality
- Revisar en cinco ejes: correctitud, legibilidad/simplicidad, arquitectura, seguridad y performance.
- Verificar casos borde y rutas de error, no solo el happy path; en este proyecto: campos vacíos, duplicados, cantidades inválidas, localStorage corrupto.
- Nombres descriptivos y coherentes con el namespace; sin código muerto, `// removed`, shims ni abstracciones prematuras (regla de tres usos).
- Cambios pequeños y enfocados (~100 líneas ideal, ~300 aceptable, ~1000 dividir); no mezclar refactor con feature.
- Seguridad: no interpolar datos sin escapar en `innerHTML`; validar entrada en el borde; sin secretos en código.
- Cada hallazgo debe proponer el remedio estructural, no solo señalar el problema; veredicto explícito al final.

### frontend-design
- Plan de diseño antes de codificar: 4–6 colores con hex, 1–2 tipografías con roles, concepto de layout (wireframe ASCII) y principios.
- Revisar el plan contra el brief y descartar lo que parezca default genérico (cream + serif + terracotta, cards idénticas, eyebrows en mayúsculas, gradientes decorativos).
- La tipografía define personalidad: escala clara, line-length < 80 caracteres, sin acentos arbitrarios en una sola palabra del título.
- Estructura = información: numeración solo si hay secuencia real; motion solo si responde a una acción o a una revelación orquestada.
- Un solo elemento memorable; el resto quieto y disciplinado. Piso de calidad: responsive, foco visible, reduced motion, contraste.
- Copy desde la perspectiva del usuario: voz activa, verbo concreto en CTAs, mismo nombre de acción en todo el flujo; errores y vacíos orientan.

### vanilla-web
- **Override del proyecto:** IGNORAR la guía ESM de esta skill. Sin `type="module"` ni `import/export`: scripts clásicos con namespace `window.TUCO` (CORS bloquea módulos en `file://`).
- Sin frameworks, librerías, CDNs ni build; todo recurso local y ejecutable con doble clic en `index.html`.
- Separar responsabilidades en archivos: datos, validaciones, formato, persistencia, render y wiring de página.
- Funciones pequeñas y utilidades puras (`validaciones.js`, `formato.js`) verificables desde consola; encapsular el estado, evitar globales mutables fuera de `window.TUCO`.
- HTML semántico y accesible; event delegation para listas dinámicas; manejar explícitamente nodos ausentes, entradas inválidas y fallos de localStorage.
- Entregar archivos completos y ejecutables (sin TODOs ni rutas rotas), con runbook de verificación manual en el README.

### GLOBAL — reglas mínimas (solo si se invocan)
- `frontend-design` global: idéntica a la local; usar la copia project (no duplicar).
- `find-skills`: buscar e instalar solo bajo pedido; no instalar dependencias en este proyecto.
- `deploy-to-vercel`, `vercel-optimize`, `supabase*`, `shadcn`, `vercel-react-best-practices`, `seo-audit`: **no aplican** al stack; no cargarlas ni proponer sus herramientas.
- Skills de orquestación SDD: no cargar durante implementación ni revisión de código.

## Conflictos resueltos

| Conflicto | Resolución |
|-----------|------------|
| `vanilla-web` exige ESM (`type="module"`, imports) vs. apertura `file://` | Gana el proyecto: scripts clásicos + `window.TUCO`. La regla ESM queda explícitamente anulada. |
| `frontend-design` duplicada (project y global) | Se conserva la copia project; la global se marca sombreada. |
| `find-skills` duplicada en `~/.agents/skills` y `~/.config/opencode/skills` | Una sola entrada global. |
| `create-web-form` recomendada en el state | **Excluida**: ya no existe en el repo fuente. |
| Skills React/Supabase/Vercel vs. stack estático | Marcadas como no aplicables; no arrastrar sus reglas. |

## Project Conventions

No existe `AGENTS.md`, `CLAUDE.md`, `.cursorrules` ni `copilot-instructions.md` todavía. Fuentes canónicas actuales:

| File | Path | Notes |
|------|------|-------|
| Roadmap de changes | `CHANGES.md` | 6 changes secuenciales `C-01`..`C-06`; no paralelizar. |
| Knowledge base (índice) | `knowledge-base/README.md` | Índice de los 10 documentos. |
| Visión y alcance | `knowledge-base/01_vision_y_objetivos.md` | Objetivo y criterios de éxito. |
| Modelo de datos | `knowledge-base/04_modelo_de_datos.md` | Entidades libro, cliente, venta, renglón. |
| Reglas de negocio | `knowledge-base/05_reglas_de_negocio.md` | Validaciones y unicidad. |
| Funcionalidades | `knowledge-base/06_funcionalidades.md` | 6 épicas y criterios de aceptación. |
| Arquitectura | `knowledge-base/08_arquitectura_propuesta.md` | Archivos, namespace, persistencia y verificación manual. |
| Decisiones | `knowledge-base/09_decisiones_y_supuestos.md` | DD-06: solo casos manuales, sin test runner. |
| Skills instaladas | `skills-lock.json` | Provenance y hashes de las 6 skills locales. |

### Reglas duras del stack
- Solo HTML5 + CSS3 + JavaScript nativo. **Prohibido**: frameworks, librerías, CDNs, npm, build, backend, `fetch`.
- Multipágina con `index.html` como entrada; se abre con doble clic (`file://`).
- **Sin ES modules**: `<script src="...">` clásicos y namespace `window.TUCO`; nada de `import`/`export`.
- Recursos 100% locales (CSS, JS, imágenes) bajo `assets/` o `public/` (a definir en C-01).
- Persistencia en `localStorage` con seed inicial sin duplicados y claves versionadas.
- Formatos es-AR: moneda `$ 12.500,00` y fecha `dd/mm/aaaa`.
- Autores en alta de libro con `<select multiple>`; ISBN único comparado sin espacios ni guiones.
- Venta: al menos un renglón, sin libro repetido, cantidad entera > 0, precio unitario copiado como valor histórico.
- Historial inmutable: no releer precios del catálogo actual.
- Responsive a 320 px y 1280 px, sin scroll horizontal global; tablas con scroll propio.

### Verificación (manual, sin test runner)
- [ ] Catálogo: filtro por título con trim, case-insensitive, parcial; vacío = todo; sin resultados = mensaje.
- [ ] Alta de libro: campos obligatorios, ISBN duplicado, precio ≤ 0, autores múltiples.
- [ ] Alta de cliente: email inválido y email duplicado (sin distinguir mayúsculas).
- [ ] Venta: sin cliente / sin renglones / cantidad inválida bloquean la confirmación; total correcto.
- [ ] Historial: detalle y precio histórico intacto tras cambiar el catálogo.
- [ ] Persistencia: recargar conserva datos y no duplica el seed.
- [ ] Teclado y foco visible en todas las páginas; errores con texto, no solo color.
- [ ] 320 px y 1280 px sin scroll horizontal global; consola sin errores.
