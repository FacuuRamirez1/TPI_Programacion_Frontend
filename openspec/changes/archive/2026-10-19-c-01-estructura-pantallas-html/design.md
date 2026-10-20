# Design

## Context

Ver `proposal.md` — Why. El repositorio no contiene todavía HTML, CSS ni JavaScript de la aplicación; `openspec/specs/` está vacío y este es el primer change del roadmap. Las restricciones que condicionan el diseño son: entrega 100 % estática que debe abrirse con doble clic (`file://`), sin frameworks, dependencias, build ni peticiones de red; scripts clásicos con `window.TUCO` para las fases posteriores; y separación estricta entre estructura (C-01), presentación (C-02), datos (C-03), altas (C-04), ventas (C-05) y cierre (C-06).

## Goals / Non-Goals

**Goals:**
- Dejar las seis vistas navegables y semánticamente completas, listas para recibir CSS en C-02 y datos en C-03.
- Fijar una anatomía estable de tarjetas, formularios, tablas y mensajes para que las fases siguientes solo agreguen comportamiento.
- Resolver desde el inicio navegación, etiquetado, encabezados de tabla, estados vacíos y foco por teclado.

**Non-Goals:**
- Estilos visuales, layout responsive, variables CSS y clases de presentación (C-02).
- Datos iniciales, render dinámico, filtro, validaciones, persistencia, cálculo de totales y navegación con `?id=` funcional (C-03 a C-05).
- README de entrega y casos manuales observados (C-06).
- Cualquier archivo dentro de `js/` o `css/`.

## Decisions

### 1. Capacidad de la delta: `estructura-pantallas`

Se usa una única capacidad plana, `estructura-pantallas`, en `specs/estructura-pantallas/spec.md`. Agrupa la estructura común y las seis vistas porque comparten el mismo contrato de navegación y accesibilidad. Alternativa descartada: una capacidad por página (`catalogo`, `libros`, etc.); generar seis deltas para un change de maqueta fragmenta el contrato y duplica requisitos de `header`/`nav`.

### 2. Cero CSS en C-01

C-01 no crea `css/estilos.css` ni bloques `<style>`; se usan solo los estilos por defecto del navegador. C-02 es dueño de la presentación. Consecuencias asumidas: el enlace «Saltar al contenido» se verá como un enlace normal y las tarjetas/tablas se verán sin diseño. Alternativa descartada: un CSS mínimo de andamiaje; invade el alcance de C-02 y obliga a retrabajar selectores.

### 3. Cabecera y navegación duplicadas literalmente

El bloque `header` + `nav` se copia igual en las seis páginas. No se inyecta con JavaScript porque C-01 no carga scripts y porque en `file://` no hay servidor que componga plantillas. Para evitar deriva, el bloque canónico se escribe una vez y se replica con una lista de verificación manual en `tasks.md`.

El `nav` tiene cinco enlaces en orden fijo: `index.html` «Catálogo», `libros.html` «Libros», `clientes.html` «Clientes», `ventas.html` «Ventas», `historial.html` «Historial». Cada página agrega `aria-current="page"` solo a su propio enlace. `venta-detalle.html` no marca ningún enlace del `nav` porque no es una vista principal: se identifica con su `h1` y un enlace «Volver al historial». Alternativa descartada: marcar «Historial» como actual en el detalle; sería inexacto para lectores de pantalla.

### 4. Contenido de maqueta sin datos reales

No se escribe ningún libro, cliente ni venta del seed en el HTML (regla dura 4). Los contenedores de datos (`#listado-catalogo`, `tbody` de las tablas) se entregan vacíos y visibles con su mensaje de estado vacío. La anatomía que C-03/C-04/C-05 van a clonar se declara en elementos `<template>` inertes:

- `#plantilla-tarjeta-libro`: `article.tarjeta`, `img` de portada con `alt`, `h3` de título, `p` de ISBN, editorial, género y autores, y `p` de precio.
- `#plantilla-fila-libro`, `#plantilla-fila-cliente`, `#plantilla-fila-renglon`, `#plantilla-fila-venta`: filas con celdas para las columnas definidas.

Esto cumple «maqueta estática o vacía» sin hardcodear catálogo. Alternativa descartada: filas y tarjetas de ejemplo visibles; se confundirían con datos reales y contradirían la regla dura.

Los `select` dependientes de datos incluyen solo una opción inicial no seleccionable (`disabled`, `value=""`) que comunica que faltan datos: «Seleccioná una editorial», «Seleccioná uno o más autores», «Seleccioná un cliente», «Seleccioná un libro». `generoId` incluye la opción permanente «Sin clasificar» con `value=""`. Las opciones reales se agregan en C-03/C-04. No son datos del catálogo, sino texto de interfaz.

### 5. Estrategia de placeholders de portada

Se crea un único SVG propio, `assets/portadas/portada-placeholder.svg`, de proporción 2:3, con formas simples y el texto «TU-CO / Portada no disponible». Es autoría del proyecto, no requiere licencia externa ni descarga. Las tarjetas usan ese archivo y un `alt` que C-03 reemplazará por el título del libro. No se incorporan portadas reales en C-01; la procedencia de imágenes se cierra en C-06 (`IN-03`).

### 6. Anatomía por página e IDs estables

| Página | `h1` | Contenedores y controles principales |
|---|---|---|
| `index.html` | Catálogo | `#buscador-titulo` + `label`, `#listado-catalogo`, `#mensaje-catalogo-vacio`, `#mensaje-sin-resultados`, `#plantilla-tarjeta-libro` |
| `libros.html` | Libros | `#form-libro` con `#titulo`, `#isbn`, `#precio`, `#editorialId`, `#generoId`, `#autorIds`, botón «Registrar libro»; `#tabla-libros`, `#mensaje-libros-vacio`, `#mensaje-libro` |
| `clientes.html` | Clientes | `#form-cliente` con `#nombreCompleto`, `#email`, botón «Registrar cliente»; `#tabla-clientes`, `#mensaje-clientes-vacio`, `#mensaje-cliente` |
| `ventas.html` | Ventas | `#form-venta` con `#clienteId`, `#libroId`, `#cantidad`, botón «Agregar renglón», `#tabla-renglones`, `#total-venta`, botón «Confirmar venta», `#mensaje-venta` |
| `historial.html` | Historial | `#tabla-ventas`, `#mensaje-historial-vacio`, enlaces «Ver detalle» en la plantilla de fila |
| `venta-detalle.html` | Detalle de venta | `#detalle-venta`, `#mensaje-detalle`, enlace «Volver al historial» |

Los IDs de entidades (`lib-N`, `cli-N`, `ven-N`, `edi-N`, `gen-N`, `aut-N`) no se usan en C-01; quedan reservados para las fases de datos.

Cada tabla lleva `<caption>` y `<th scope="col">`, y se envuelve en `div.tabla-contenedor` para que C-02 aplique el scroll propio sin tocar el HTML. El `main` usa `id="contenido"` y `tabindex="-1"` para que el enlace de salto mueva el foco de forma confiable.

### 7. Comportamiento sin JavaScript

Los formularios usan `method="get"` sin `action`, por lo que un envío accidental recarga la página actual sin guardar nada. Los botones se dejan como `type="submit"` para que C-04 pueda interceptar `submit` con `preventDefault` sin cambiar el HTML. No se agregan atributos `required` ni validaciones nativas: la validación es responsabilidad de `validaciones.js` en C-04/C-05. Los mensajes que no corresponden al estado inicial se ocultan con el atributo `hidden`; los visibles usan `role="status"` (o `aria-live="polite"`).

El total de venta se entrega como `<output id="total-venta">0</output>` sin símbolo de moneda. C-05 lo formateará con `Intl.NumberFormat('es-AR')`; así C-01 no introduce formato manual de moneda.

### 8. Accesibilidad desde la estructura

- Todo control tiene `<label for>` y `id`; el selector múltiple de autores se agrupa con `fieldset`/`legend` y se asocia a una ayuda con `aria-describedby`.
- El enlace «Saltar al contenido» es el primer elemento enfocable de cada página.
- No se elimina el foco: sin CSS no hay `outline: none`, y se confía en el indicador nativo hasta que C-02 lo reemplace con `:focus-visible`.
- Los mensajes de error futuros tendrán texto, `aria-invalid` y `aria-describedby`; C-01 deja los contenedores y la estructura, no la lógica.
- `<html lang="es">` y navegación idéntica en todas las páginas.

## Risks / Trade-offs

- [Las vistas vacías pueden parecer incompletas] → Mitigación: mensajes de estado vacío visibles y plantillas inertes con la anatomía completa; C-03 las pobla.
- [Duplicar el `header`/`nav` permite que las páginas se desincronicen] → Mitigación: bloque canónico único, copia literal y verificación manual de los seis archivos en `tasks.md`.
- [Sin CSS, el enlace de salto y los formularios se ven rudimentarios] → Mitigación: es una entrega estructural; C-02 aplica la identidad visual y el estilo de foco sin cambiar el HTML.
- [El detalle no marca `aria-current`] → Mitigación: no es un ítem del `nav`; se identifica con `h1` y enlace de vuelta, y se documenta para que no se lea como omisión.
- [Enviar un formulario en C-01 recarga la página] → Mitigación: no hay persistencia ni datos que perder; C-04 intercepta el envío. Se documenta en el README de C-06.
- [Placeholders propios pueden no coincidir con el estilo final] → Mitigación: son SVG neutros y reemplazables; la procedencia queda declarada en C-06.

## Migration Plan

Change aditivo: no modifica archivos existentes. Se crean seis HTML, `assets/portadas/portada-placeholder.svg` y la carpeta. Rollback: eliminar esos archivos; no hay estado persistido ni migraciones. El archive de C-01 copiará la delta a `openspec/specs/estructura-pantallas/spec.md`.

## Open Questions

Ninguna que bloquee C-01. La procedencia de las portadas definitivas y los nombres de los integrantes siguen diferidos a C-06 (`IN-01`, `IN-03`).
