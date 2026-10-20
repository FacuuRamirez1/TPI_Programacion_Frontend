# Design

## Context

Ver `proposal.md` — Why. El punto de partida es el HTML de C-01: seis documentos semánticos, sin `<link>` de estilos, con un bloque común de cabecera `header` que contiene `p.marca` y `nav > ul`, un `main#contenido`, formularios con campos envueltos en `<p>`, tablas dentro de `div.tabla-contenedor`, mensajes con `role="status"` y plantillas inertes para tarjetas y filas. No hay `css/` ni `js/`, y la entrega debe abrirse con doble clic (`file://`).

Las restricciones que condicionan el diseño son: CSS3 local sin frameworks, CDNs, `@import`, fuentes remotas ni build; cero lógica de datos en esta fase; ninguna regresión de la estructura ni de la accesibilidad de C-01; y verificación manual a 320 px y 1280 px. La KB fija `css/estilos.css` como archivo de estilos y `RN-RES`/`RN-UI` como reglas de aceptación.

## Goals / Non-Goals

**Goals:**

- Fijar una identidad visual propia y sobria para Librería TU-CO, reconocible en las seis vistas.
- Entregar un contrato de clases estable (`.tarjeta`, `.formulario`, `.campo`, `.boton`, `.tabla`, `.mensaje`, `.badge`) que C-03 a C-06 reutilicen sin renegociar nombres.
- Resolver con CSS puro la adaptabilidad a 320 px y 1280 px, el foco visible, los estados con texto y el desplazamiento interno de tablas.
- Anclar el diseño al DOM real de C-01, agregando solo los hooks mínimos de presentación.

**Non-Goals:**

- Datos, render, validaciones, persistencia y cálculos (C-03 a C-06).
- Componentes que requieran JavaScript (menú desplegable, modales, filtros visuales, ordenamiento de tablas).
- Tema oscuro automático, impresión, animaciones de entrada y tipografías web.
- Cerrar `IN-03`: no se incorporan portadas reales ni se declara procedencia en este change.

## Decisions

### 1. Capacidad nueva: `presentacion-adaptable`

Se crea una capacidad nueva y plana, `specs/presentacion-adaptable/spec.md`, en lugar de modificar `estructura-pantallas`. C-01 sigue siendo el contrato de estructura, etiquetado y semántica; C-02 agrega un contrato de presentación con tokens, componentes, responsive y estados visuales. La única superposición es el foco: C-01 exigía conservar el foco nativo «en esta fase», y C-02 lo reemplaza por `:focus-visible` sin dejar de cumplir «foco visible». No se elimina ni se contradice ningún requisito estructural.

Alternativa descartada: un delta `MODIFIED` sobre `estructura-pantallas`. Obligaría a copiar requisitos completos de C-01 y mezclaría dos ejercicios evaluables por separado en un mismo spec.

### 2. Concepto visual: mostrador de librería, no «cream + serif + terracota»

La identidad parte de tinta verde bosque, papel verdoso muy claro y un acento ámbar de lomo de libro. Los títulos usan una serif local (Georgia) y el cuerpo una sans del sistema (Segoe UI/system-ui). No se usan gradientes decorativos, tarjetas idénticas sin jerarquía ni tipografías remotas. El único gesto memorable es la banda verde de cabecera con el nombre en serif y el subrayado ámbar de la página actual; el resto queda quieto.

La paleta tiene seis colores base más estados; todos los pares texto/fondo se eligen para superar 4.5:1 en texto normal. No se usa el ámbar como color de texto sobre blanco salvo en su variante oscura `#8A4B00` (≈6.8:1), y nunca como único indicador.

### 3. Tokens en `:root`

Todos los valores viven en un único bloque `:root`; las reglas de componentes consumen variables y no repiten literales. Los breakpoints no pueden ser custom properties en media queries, así que se documentan como literales (`48rem` y `80rem`).

| Grupo | Token | Valor | Uso |
|---|---|---|---|
| Color | `--color-fondo` | `#F3F6F2` | Fondo de página (papel verdoso) |
| Color | `--color-superficie` | `#FFFFFF` | Tarjetas, tablas, campos |
| Color | `--color-superficie-alt` | `#E7EEE9` | Encabezados de tabla y zonas suaves |
| Color | `--color-texto` | `#14211F` | Texto principal (≈15:1 sobre fondo) |
| Color | `--color-texto-suave` | `#465A55` | Texto secundario (≈7.3:1 sobre blanco) |
| Color | `--color-borde` | `#B9C8C2` | Bordes decorativos y separadores |
| Color | `--color-primario` | `#0F5C57` | Acciones y enlaces (≈7.8:1 con blanco) |
| Color | `--color-primario-oscuro` | `#0A3F3B` | Cabecera, navegación y títulos de tarjeta |
| Color | `--color-primario-suave` | `#D8E8E4` | Fondo de badge de total y mensajes informativos |
| Color | `--color-acento` | `#8A4B00` | Acento de página actual y badges de género |
| Color | `--color-acento-suave` | `#F6E4CC` | Fondo de badge de género |
| Color | `--color-exito` | `#1E6B3C` | Texto y borde de éxito (≈6.5:1 sobre blanco) |
| Color | `--color-exito-suave` | `#DFF0E4` | Fondo de mensaje de éxito |
| Color | `--color-error` | `#A3231C` | Texto y borde de error (≈7.5:1 sobre blanco) |
| Color | `--color-error-suave` | `#FBE3E1` | Fondo de mensaje de error |
| Color | `--color-foco` | `#0B4F8A` | Anillo de foco en superficies claras (≥7:1) |
| Color | `--color-foco-inverso` | `#FFD166` | Anillo de foco sobre cabecera/nav oscura (≈8:1) |
| Tipografía | `--fuente-titulos` | `Georgia, "Times New Roman", serif` | `h1`–`h3`, marca y títulos de tarjeta |
| Tipografía | `--fuente-cuerpo` | `"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif` | Cuerpo, controles y tablas |
| Tipografía | `--texto-xs` a `--texto-3xl` | `0.75rem`, `0.875rem`, `1rem`, `1.125rem`, `1.375rem`, `1.75rem`, `2.25rem` | Escala tipográfica |
| Tipografía | `--interlinea` | `1.6` | Cuerpo y mensajes |
| Tipografía | `--ancho-lectura` | `80ch` | Límite de línea en prosa |
| Espaciado | `--espacio-1` a `--espacio-8` | `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`, `2rem`, `3rem`, `4rem` | Escala de 4 px |
| Layout | `--ancho-contenido` | `75rem` (1200 px) | Ancho máximo alineado |
| Radios | `--radio-s`, `--radio-m`, `--radio-l`, `--radio-pastilla` | `0.25rem`, `0.5rem`, `1rem`, `999px` | Campos, tarjetas y badges |
| Sombras | `--sombra-1`, `--sombra-2` | sombras suaves en verde tinta con alfa | Tarjetas y elevación al enfocar |
| Foco | `--foco-grosor`, `--foco-offset` | `3px`, `2px` | Anillo visible |

Las cifras de contraste son estimaciones de diseño sobre los valores hex; en el apply se confirman con el medidor del navegador y, si alguna no llega, se ajusta el hex antes de cerrar la tarea.

### 4. Arquitectura CSS: un solo archivo, secciones ordenadas

Se entrega `css/estilos.css` único, enlazado con `<link rel="stylesheet" href="css/estilos.css">` en las seis vistas. Orden interno fijo: tokens → base/reset → utilidades → layout global → componentes → estados e interacción → responsive. Es el archivo que la KB declara y evita tres `<link>` por página y problemas de orden en `file://`. Si el archivo supera ~600 líneas durante el apply, se divide en `base.css`, `componentes.css` y `layout.css`; no se divide preventivamente.

Reglas de estilo: cero selectores por `id` (los nodos dinámicos de C-03 a C-05 deben heredar estilos por clase), anidamiento máximo de dos niveles, sin `!important` salvo la regla `[hidden]` (ver decisión 11), y transiciones solo en color/foco, nunca en `all`.

Alternativa descartada: múltiples hojas por responsabilidad desde el inicio. Aporta poco en un proyecto de ~400 líneas y multiplica los `<link>` que hay que mantener sincronizados en seis HTML.

### 5. Layout sin envoltorios nuevos

No se agregan `div` contenedores al HTML de C-01. La alineación se resuelve con el propio esqueleto:

- `header` y `footer` usan `padding-inline: max(var(--espacio-4), calc((100% - var(--ancho-contenido)) / 2))`, de modo que su contenido queda alineado al ancho máximo sin wrapper.
- `main` usa `width: min(100% - 2 * var(--espacio-4), var(--ancho-contenido)); margin-inline: auto`.
- A 320 px el padding es 16 px; a 1280 px es 40 px por lado y el contenido mide 1200 px como máximo.

El `nav` vive **dentro** del `header`, después de la marca, y la cabecera es una **fila flex** (`display: flex`, `flex-wrap: wrap`, `align-items: center`, `justify-content: space-between`, `column-gap: var(--espacio-5)`, `row-gap: var(--espacio-2)`) sobre la banda verde: la marca en serif queda a la izquierda y la navegación, a la derecha, ocupando solo el ancho que necesita (`flex: 0 1 auto`) para que su borde derecho coincida con el del contenido de `main`. El padding lateral lo aporta solo el `header`; `.navegacion` no declara `padding-inline` propio para no duplicar la sangría. El borde inferior ámbar de 4 px (`--color-acento-suave`) se declara una única vez, en el `header`, y `header` pasa a `padding-block: var(--espacio-5) var(--espacio-3)` para absorber el padding inferior que antes aportaba la navegación, sin duplicar la línea ni alterar la altura en anchos angostos.

Al envolver (desde la base hasta `48rem`), la navegación baja a su propia fila con `flex: 1 1 100%` y su `ul` sigue alineado a la derecha (`justify-content: flex-end`); a 320 px los cinco enlaces se reparten en dos filas de enlaces sin desbordar. Desde `48rem` la navegación recupera `flex: 0 1 auto`, el `ul` deja de envolver (`flex-wrap: nowrap`) y marca y navegación comparten la misma fila. No se usa un menú hamburguesa porque requeriría JavaScript.

### 6. Responsive mobile-first: base 320 px y escritorio 1280 px

- **Base (320 px, sin media query):** una columna; `h1` 1.75 rem; padding inline 16 px; catálogo de una tarjeta por fila; formularios de una columna; botones de ancho completo; la cabecera envuelve y la navegación ocupa su propia fila al 100 % con los enlaces alineados a la derecha y `flex-wrap`; tablas con scroll interno.
- **`@media (min-width: 48rem)` (768 px):** formularios a dos columnas con `grid-template-columns: repeat(2, minmax(0, 1fr))`; grupos (`fieldset`), tablas, mensajes y botones ocupan `1 / -1`; la grilla del catálogo pasa a `repeat(auto-fill, minmax(min(15rem, 100%), 1fr))`; la navegación pasa a `flex: 0 1 auto` y comparte fila con la marca, con sus enlaces sin envolver; botones de ancho automático.
- **`@media (min-width: 80rem)` (1280 px):** se activa exactamente el ancho de escritorio exigido; `h1` 2.25 rem; espaciado vertical de secciones 3 rem; la grilla del catálogo admite cuatro columnas; la cabecera gana altura y separación.

La base cubre 320 px sin necesidad de un `max-width`, y el punto de 1280 px es una media query explícita, tal como pide el enunciado. No se usa `overflow-x: hidden` en `html`/`body` para ocultar desbordes: se previenen con `box-sizing: border-box`, `min-width: 0` en hijos de flex/grid, `max-width: 100%` en imágenes y `overflow-wrap: anywhere` en celdas y párrafos de tarjeta.

### 7. Tablas: scroll dentro del contenedor, no de la página

- `.tabla-contenedor` recibe `max-width: 100%`, `overflow-x: auto`, `overflow-y: hidden`, borde y radio. El contenedor ya existe en el HTML de C-01 para las cuatro tablas.
- `.tabla` ocupa `width: 100%`; las tablas de muchas columnas (`libros`, `renglones`, `historial`) reciben `.tabla--ancha` con `min-width: 44rem`. La tabla de clientes de dos columnas no fuerza ancho mínimo.
- A 320 px, el ancho del documento no cambia porque el contenedor está limitado al 100% del `main`; el desborde ocurre dentro del contenedor y se resuelve con su barra horizontal.
- Cada `.tabla-contenedor` recibe en el HTML `role="region"`, `tabindex="0"` y `aria-label` con el nombre de la tabla (por ejemplo, «Libros registrados, tabla desplazable»). Así el contenedor es alcanzable por teclado y puede desplazarse con flechas sin depender de que el navegador haga focusable el scroller. El foco del contenedor usa el mismo anillo visible.
- La tabla de clientes también recibe el contenedor enfocable por consistencia y para soportar zoom 200 %, aun cuando a 320 px no necesite scroll.

El `caption` visible se conserva; no se oculta con `.visualmente-oculto` porque aporta orientación visual. El `aria-label` del contenedor evita que el lector anuncie solo «región» sin contexto.

### 8. Inventario de componentes y ganchos en el DOM

| Componente | Selector/clase | Dónde se aplica | Hook existente |
|---|---|---|---|
| Tarjeta | `.tarjeta`, `.tarjeta-titulo`, `.tarjeta-isbn`, `.tarjeta-editorial`, `.tarjeta-genero`, `.tarjeta-autores`, `.tarjeta-precio` | `#plantilla-tarjeta-libro` | Sí; solo se agrega `badge` al género |
| Grilla | `.grilla-catalogo` | `#listado-catalogo` | No; se agrega la clase |
| Formulario | `.formulario`, `.formulario--busqueda` | `#form-libro`, `#form-cliente`, `#form-venta`, formulario del buscador | No; se agregan las clases |
| Campo | `.campo`, `.campo--completo` | Cada `<p>` de campo y el `fieldset` de autores | No; se agregan las clases |
| Botón | `.boton`, `.boton--primario`, `.boton--secundario`, `.boton--peligro`, `.boton--pequeno` | Botones de alta, agregar, confirmar, quitar; enlace «Volver al historial» | No; se agregan las clases |
| Tabla | `.tabla`, `.tabla--ancha`, `.tabla-contenedor` | Las cuatro tablas | Parcial: `.tabla-contenedor` ya existe |
| Mensaje | `.mensaje`, `.mensaje--vacio`, `.mensaje--info`, `.mensaje--exito`, `.mensaje--error` | Mensajes de vacío, sin resultados, resultados y detalle inexistente | No; se agrega `.mensaje` y el modificador del estado actual |
| Badge | `.badge`, `.badge--genero`, `.badge--total` | Género de la tarjeta y `<output id="total-venta">` | Parcial: el género ya tiene `.tarjeta-genero`; se suma `badge` |
| Utilidad | `.visualmente-oculto` | Texto del enlace «Ver detalle» y enlace de salto | No; se agrega |

Los formularios conservan la estructura `<p class="campo"><label for>…</label><input></p>`; no se reemplazan los `<p>` por `<div>` para no alterar la estructura validada en C-01. El `fieldset` de autores recibe `.campo` y `.campo--completo` para abarcar las dos columnas.

### 9. Ganchos que faltan en el HTML de C-01 y cómo los incluye este change

Sí, el change incluye estos cambios de HTML, limitados a presentación:

1. `<link rel="stylesheet" href="css/estilos.css">` en el `<head>` de las seis vistas.
2. `class="salto-contenido visualmente-oculto"` en el enlace «Saltar al contenido».
3. `class="marca"` en el `<p>` de `header` y `class="navegacion"` en `nav`.
4. `class="formulario"` en los formularios; `class="formulario formulario--busqueda"` en el formulario del buscador.
5. `class="campo"` en cada `<p>` de campo y `class="campo campo--completo"` en el `fieldset` de autores.
6. `class="boton boton--primario"` en «Registrar libro», «Registrar cliente» y «Confirmar venta»; `class="boton boton--secundario"` en «Agregar renglón»; `class="boton boton--peligro boton--pequeno"` en «Quitar renglón»; `class="boton boton--secundario"` en el enlace «Volver al historial».
7. `class="grilla-catalogo"` en `#listado-catalogo`; `class="tarjeta-genero badge"` en el párrafo de género de la plantilla; `class="badge badge--total"` en `#total-venta`.
8. `class="tabla"` en las cuatro tablas; `class="tabla tabla--ancha"` en libros, renglones e historial.
9. `role="region" tabindex="0" aria-label="…"` en los cuatro `.tabla-contenedor`.
10. `class="mensaje mensaje--vacio"` en los mensajes de lista vacía; `class="mensaje mensaje--info"` en «sin resultados» y en `#mensaje-venta`; `class="mensaje mensaje--error"` en `#mensaje-detalle`.
11. `class="tarjeta tarjeta--detalle"` en `#detalle-venta`.
12. `<span class="visualmente-oculto"> de la venta</span>` dentro del enlace «Ver detalle» de la plantilla de fila.
13. En `#mensaje-detalle`, el texto visible pasa a comenzar con «Error:» para cumplir el estado de error textual. Es contenido de presentación del estado existente, no lógica ni dato del seed.
14. El bloque `<nav class="navegacion" aria-label="Navegación principal">` completo se mueve **dentro** del `<header>`, después de `<p class="marca">`, con indentación uniforme (dos espacios por nivel) e idéntica en las seis vistas. No se modifican los `href`, las etiquetas de los enlaces ni el `aria-current="page"` de cada vista, y el enlace «Saltar al contenido» sigue siendo el primer enfocable del `body`, antes del `header`.

No se agregan ni se quitan nodos estructurales: el único movimiento es el `nav` dentro del `header` (ítem 14). No se tocan `assets/`, `js/` ni el contenido de las plantillas más allá de clases y del `span` oculto. C-05 deberá conservar o completar ese `span` con el identificador al renderizar filas.

### 10. Foco, página actual y salto al contenido

- Regla base: `:where(a, button, input, select, textarea, [tabindex]):focus-visible { outline: var(--foco-grosor) solid var(--color-foco); outline-offset: var(--foco-offset); }`. No se declara `outline: none` en ningún selector, así que un navegador sin `:focus-visible` conserva el foco nativo.
- Sobre la cabecera y la navegación oscuras se usa `--color-foco-inverso` (`#FFD166`) porque el azul de foco no contrasta contra el verde profundo; el anillo ámbar supera 3:1 contra ese fondo.
- El enlace de salto usa `.visualmente-oculto` y, bajo `.salto-contenido:focus`, revierte todas las propiedades de recorte con mayor especificidad: se posiciona fijo arriba a la izquierda, con fondo verde oscuro, texto blanco, padding y anillo ámbar. No se usa `display: none`.
- `a[aria-current="page"]` combina tres señales: `font-weight: 700`, fondo claro tipo pastilla y `box-shadow: inset 0 -3px 0 var(--color-acento)`. En escala de grises siguen visibles el peso, el fondo y el subrayado; no depende del tono.
- `main` ya es `tabindex="-1"` desde C-01; al activar el salto recibe foco y se estiliza `main:focus-visible` con el mismo anillo.

### 11. Estados sin depender del color

El color acompaña, pero nunca es la única señal:

- **Vacío:** `.mensaje--vacio` con borde discontinuo y texto en cursiva sobre fondo transparente. Se distingue de un error por la forma del borde y el texto.
- **Sin resultados:** `.mensaje--info` con barra izquierda de 4 px y fondo verde suave; el texto existente explica la ausencia de coincidencias.
- **Error:** `.mensaje--error` con borde izquierdo de 6 px, borde completo de 1 px, peso 600 y texto que empieza con «Error:». Además, `[aria-invalid="true"]` en un control aumenta el borde a 3 px. Para el caso real disponible en C-02 se usa `#mensaje-detalle` («Error: la venta solicitada no existe…»).
- **Éxito:** `.mensaje--exito` con barra superior de 4 px, borde completo de 1 px, peso 600 y texto que empieza con «Listo:». El estado aún no se produce porque no hay altas funcionales; el contrato queda definido para C-04/C-05 y se verifica visualmente en el apply con el inspector, sin agregar marcado de demostración.
- **Campo inválido:** además del borde de 3 px, C-04 deberá asociar el mensaje con `aria-describedby` y mantener el texto; C-02 solo define la apariencia.

Regla técnica: `[hidden] { display: none !important; }` en la base. Es el único `!important` del archivo y es necesario porque un componente con `display: flex` o `inline-flex` podría ganarle al `display: none` del user agent y mostrar mensajes que el HTML marca como ocultos. Se documenta como excepción deliberada.

### 12. Utilidad `.visualmente-oculto`

Implementación estándar de recorte accesible: `position: absolute`, `width: 1px`, `height: 1px`, `margin: -1px`, `overflow: hidden`, `clip-path: inset(50%)` y `white-space: nowrap`. No usa `display: none`, `visibility: hidden` ni `hidden`, por lo que el texto permanece en el árbol de accesibilidad. El enlace de salto la combina con `.salto-contenido`, que la revierte al enfocarse. El `<span>` del enlace «Ver detalle» la usa para aportar contexto sin cambiar la línea visual de la celda.

### 13. Tipografía, contraste y movimiento

- Cuerpo a 16 px como mínimo, interlineado 1.6, máximo 80 caracteres por línea en mensajes y prosa; sin `text-align: justify`.
- Títulos en serif local con escala 1.75 rem a 2.25 rem; marca en 1.5 rem. No se usan mayúsculas sostenidas como recurso decorativo.
- Estados y enlaces usan los pares de color de la tabla de tokens; el apply verifica contraste real con el medidor del navegador.
- Las únicas transiciones son de color/fondo en `.boton` y `.navegacion a`, de 150 ms. `@media (prefers-reduced-motion: reduce)` las anula. No hay animaciones de entrada ni `scroll-behavior: smooth`.
- Las imágenes conservan `width`/`height` de C-01 y usan `max-width: 100%`, `height: auto`, `aspect-ratio: 2 / 3` y `object-fit: cover` para evitar saltos de layout.

### 14. Verificación manual prevista

- **320 px:** en cada vista, `document.documentElement.scrollWidth <= document.documentElement.clientWidth` y lo mismo para `body`; sin elementos cortados; navegación en dos filas como máximo.
- **1280 px:** contenido centrado con ancho máximo de 1200 px, catálogo en varias columnas y formularios a dos columnas. En la cabecera, `header > .navegacion` existe, el borde izquierdo de `.marca` coincide con el de `main`, el borde derecho de `.navegacion` coincide con el de `main` y la navegación arranca después del borde derecho de la marca.
- **Tablas:** en `libros.html` a 320 px, `tabla-contenedor.scrollWidth > clientWidth` y el documento sin scroll horizontal; Tab alcanza el contenedor y las flechas lo desplazan.
- **Teclado:** recorrido completo desde el enlace de salto hasta el último control, foco visible sobre fondo claro y oscuro, sin trampas; Shift+Tab recorre en sentido inverso.
- **Errores sin color:** `venta-detalle.html` muestra «Error:», barra gruesa y peso 600; se comprueba además en escala de grises. Los estilos de campo inválido y de éxito se inspeccionan con el inspector hasta que C-04/C-05 los produzcan.
- **Contraste:** se miden los pares principales con el medidor de contraste; se registra el resultado observado para el README de C-06.
- **Movimiento reducido:** con la emulación activa, los cambios de estado no animan.

## Risks / Trade-offs

- [Los atributos agregados al HTML podrían romper verificaciones estrictas de C-01] → Se limitan a `class`, `role`, `tabindex`, `aria-label` y un `span`; no se eliminan nodos y el único movimiento es el `nav` dentro del `header`, que C-01 admite porque solo exige un `header` con el nombre y un `nav` con los cinco enlaces. Se vuelve a ejecutar la verificación estructural de C-01 en tasks.
- [C-05 puede reemplazar el contenido del enlace «Ver detalle» y borrar el `span` oculto] → Se deja documentado en tasks y en el design; C-05 debe conservar o completar ese texto accesible con el identificador.
- [Todos los contenedores de tabla se vuelven tab stops aunque no desborden] → Se acepta para garantizar acceso al scroll con zoom y teclado; el costo es un Tab extra por tabla.
- [Un solo archivo CSS puede crecer demasiado] → Se ordena por secciones y se divide solo si supera ~600 líneas.
- [Las fuentes del sistema varían entre Windows, macOS y Linux] → La pila es local y con fallbacks; la métrica puede variar, pero no hay peticiones ni parpadeo de fuentes web.
- [Sin `overflow-x: hidden`, un hijo ancho imprevisto puede desbordar] → Se aplican `min-width: 0`, `max-width: 100%` y contenedores de tabla; el caso 320 px se recorre en cada vista y se mide con `scrollWidth`.
- [`:focus-visible`, `aspect-ratio` y `clamp()` requieren navegador moderno] → Si el navegador no soporta `:focus-visible`, conserva el foco nativo porque no se elimina el outline; `aspect-ratio` es una mejora y las imágenes ya tienen dimensiones.
- [`[hidden] { display: none !important; }` es una excepción a la regla de no usar `!important`] → Se documenta y se limita a esa única utilidad; evita mensajes ocultos que reaparezcan por un `display` de componente.
- [El estado de éxito no se puede ver en una operación real durante C-02] → Se valida el contrato visual con el inspector y se difiere la comprobación funcional a C-04/C-05, sin declarar aprobado un caso no ejecutado.

## Migration Plan

Change aditivo sobre C-01. Se agrega `css/estilos.css`, se enlaza en las seis vistas, se incorporan clases/atributos de presentación y se mueve el `nav` dentro del `header`. No hay datos persistidos, configuración ni migración. Rollback: eliminar la hoja, quitar los `<link>` y las clases agregadas y devolver el `nav` a su posición de C-01; el HTML vuelve al estado de C-01. Al archivar, la delta pasa a `openspec/specs/presentacion-adaptable/spec.md`.

## Open Questions

- ¿Qué navegador usará la cátedra para corregir? Se asume un navegador moderno con soporte de `:focus-visible`, Grid y `aspect-ratio`; si fuera uno antiguo, el foco nativo sigue visible y el layout cae a una columna sin romperse.
- ¿Se incorporarán portadas reales antes del cierre? `IN-03` sigue abierto; C-02 no agrega imágenes ni declara procedencia.
- ¿C-05 conservará el `span` de texto oculto del enlace «Ver detalle»? Es una coordinación de implementación, no un cambio de alcance; queda anotada en tasks.
