# Design

## Context

Las tres vistas de C-05 ya existen como maqueta, pero no tienen comportamiento ni scripts. `ventas.html` tiene un único `#form-venta` con dos botones `type="submit"` («Agregar renglón» y «Confirmar venta»), un `select` de cliente y otro de libro con solo el placeholder, un `input type="number"` para la cantidad, una tabla de renglones con `caption` y `th scope="col"`, una plantilla `#plantilla-fila-renglon` con cinco celdas y un botón «Quitar renglón», un `output#total-venta` y el mensaje `#mensaje-venta` con `role="status"`. `historial.html` tiene la tabla, la plantilla `#plantilla-fila-venta` con un enlace cuyo `href` está fijo en `ven-N` y el mensaje `#mensaje-historial-vacio`. `venta-detalle.html` tiene un contenedor vacío `#detalle-venta`, un mensaje de error visible por defecto y el enlace fijo «Volver al historial».

C-03 dejó `js/datos-iniciales.js`, `js/almacenamiento.js` (`leerColeccion`, `escribirColeccion`, `siguienteId`, `obtenerPorId`), `js/formato.js` (`formatearMoneda`, `formatearFecha`) y el patrón IIFE con `window.TUCO`, `createElement`/`textContent` y `replaceChildren`. C-04 dejó `js/validaciones.js` con `TUCO.validaciones`, incluyendo `validarCantidad`, pero difirió a C-05 la validación completa de una venta. `datos-iniciales.js` no define ventas; el adaptador devuelve `[]` para `tuco:ventas` hasta que se confirme la primera.

Las restricciones son las del proyecto: `file://`, sin módulos ES, sin frameworks, sin build, sin red y persistencia solo en `localStorage`. Ver `proposal.md` para la motivación y `specs/venta-simulada/spec.md` y `specs/historial-ventas/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**

- Completar la composición y la confirmación sin duplicar reglas ni `validarCantidad`.
- Mantener el estado de la composición en memoria y persistir únicamente ventas confirmadas.
- Copiar el snapshot histórico en la confirmación, no al agregar el renglón.
- Resolver el HTML mínimo necesario para distinguir acciones, editar cantidades y mostrar errores accesibles.
- Detectar la falla de escritura de `localStorage` sin cambiar la API de C-03.
- Reutilizar las plantillas y los estilos existentes, sin tocar `css/estilos.css`.

**Non-Goals:**

- Stock, reservas, facturación, impuestos o descuentos.
- Edición o borrado de ventas confirmadas.
- Carrito persistente o recuperación de una composición interrumpida.
- Sincronización en vivo entre pestañas.
- Mensaje global de fallas de `localStorage` (C-06).
- Pruebas automatizadas, dependencias o cambios en `almacenamiento.js`.

## Decisions

### 1. Dos capabilities: `venta-simulada` y `historial-ventas`

Se separan la escritura (componer y confirmar) de la lectura (listar y consultar el detalle). Son flujos distintos, con pantallas, estados y reglas propias; un único spec `venta-simulada-historial` habría mezclado la validación del carrito con el render de solo lectura y habría acoplado el contrato al nombre del change. Se mantiene el layout plano y kebab-case de `catalogo-local`, `registro-libros` y `registro-clientes`.

### 2. Extender `validaciones.js` con dos funciones puras

C-04 solo publicó `validarCantidad` porque todavía no existía el contrato de UI de ventas. C-05 agrega a `TUCO.validaciones`:

```js
validarRenglon(entrada, contexto) -> { valido, errores, datos }
validarVenta(entrada, contexto)  -> { valido, errores, datos }
```

Firmas y contenido:

- `validarRenglon({ libroId, cantidad }, { libros, renglones })`
  - `errores.libroId`: falta el libro, no existe en `contexto.libros` o ya está en `contexto.renglones`.
  - `errores.cantidad`: `validarCantidad(cantidad)` devuelve `valido: false`; se reutiliza su mensaje, sin duplicar la regla.
  - `datos`: `{ libroId, cantidad }` con la cantidad convertida a número cuando es válida; `null` cuando no lo es.
- `validarVenta({ clienteId, renglones }, { clientes, libros })`
  - `errores.clienteId`: falta el cliente o no existe en `contexto.clientes`.
  - `errores.renglones`: no hay renglones, hay un libro inexistente, una cantidad inválida o un libro repetido.
  - `datos` (solo se usa cuando `valido` es `true`): `{ clienteId, clienteNombre, renglones, total }`, donde cada renglón es `{ libroId, titulo, cantidad, precioUnitario, subtotal }` copiado del catálogo en ese momento.
- `validarRenglon` se usa al agregar; la edición de una fila existente usa directamente `validarCantidad`, porque el libro ya está en el carrito y `validarRenglon` lo marcaría como duplicado contra sí mismo.
- `validarVenta` vuelve a comprobar todo el carrito contra el catálogo vigente; es la barrera defensiva ante una edición manual de `localStorage` o un libro que desapareció.
- Se agregan a `MENSAJES` los textos `libroId`, `libroDuplicado`, `clienteId` y `renglones`. Los mensajes siguen viviendo en `validaciones.js`, no en los handlers.
- Ambas funciones son puras: no leen el DOM, no acceden a `localStorage`, no mutan la entrada ni el contexto y devuelven siempre las tres claves.

Alternativas descartadas: validar dentro de los handlers (prohibido por la regla 7 de `AGENTS.md`); duplicar la regla de cantidad en `ventas.js` (prohibido por el alcance y propenso a divergir); crear una función por campo (`validarClienteDeVenta`, `validarLibroDeVenta`, etc.) que fragmentaría una misma operación.

### 3. Estructura del carrito y de la venta confirmada

El carrito vive solo en memoria, en una variable de módulo de `ventas.js`:

```js
var renglones = [{ libroId: 'lib-1', cantidad: 2 }];
```

No se crea una clave `tuco:carrito` ni se persiste la composición. Al recargar la página se descarta; solo se guarda lo confirmado. La venta confirmada tiene esta forma exacta:

```js
{
  id: 'ven-1',
  fecha: '2026-10-20T14:03:00.000Z',
  clienteId: 'cli-1',
  clienteNombre: 'Ana Gómez',
  renglones: [
    {
      libroId: 'lib-1',
      titulo: 'El jardín de las horas',
      cantidad: 2,
      precioUnitario: 1500,
      subtotal: 3000
    }
  ],
  total: 3000
}
```

El carrito guarda solo `libroId` y `cantidad`; el título y el precio se leen del catálogo para mostrar la fila y se copian a la venta al confirmar. Alternativa descartada: persistir el carrito en `localStorage` (agrega una clave, lógica de limpieza y recuperación que la consigna no pide).

### 4. Snapshot al confirmar, no al agregar

Al agregar un renglón solo se guarda `libroId` y `cantidad`. La tabla muestra el título y el precio actuales del catálogo. Al confirmar, `validarVenta` relee `tuco:libros` y copia `titulo` y `precioUnitario` a cada renglón; también copia `clienteNombre` y calcula `total`. Si un libro dejó de existir, la confirmación falla y no se guarda una venta incompleta.

Alternativas descartadas: copiar título y precio al agregar (la fila quedaría con un precio viejo si el catálogo cambia durante la composición y el snapshot no sería el del momento de confirmar); copiar en ambos momentos (duplica la lógica sin beneficio).

### 5. Cambio mínimo de `ventas.html`

- Se agrega como primer hijo de `#form-venta` el resumen `<p id="resumen-errores-venta" class="mensaje mensaje--error" role="alert" hidden></p>`.
- Se agregan, debajo de cada control, `<div id="error-clienteId" class="mensaje mensaje--error" hidden></div>`, `#error-libroId` y `#error-cantidad`. Se usa `<div>` y no `<p>` por la misma razón que en C-04: la regla `.campo > p:not(.campo)` tiene mayor especificidad que `.mensaje--error` y teñiría el texto.
- `#clienteId`, `#libroId` y `#cantidad` reciben `aria-describedby` apuntando a su error.
- «Agregar renglón» sigue siendo `type="submit"`: el `submit` del formulario agrega el renglón y la tecla Enter dentro de la cantidad también agrega. «Confirmar venta» pasa a `type="button" id="boton-confirmar"`: la confirmación es una acción explícita y no debe disparar el alta de un renglón.
- La plantilla `#plantilla-fila-renglon` agrega un `input type="number"` en la celda de cantidad, con `class="cantidad-renglon"`, `min="1"`, `step="1"` e `inputmode="numeric"`. El botón de la última celda conserva su texto y recibe `data-accion="quitar"` para la delegación de eventos.
- Al clonar la fila, `ventas.js` setea `data-libro-id` en el `<tr>`, `aria-label` del input («Cantidad de <título>»), `aria-describedby="mensaje-venta"` y `aria-label` del botón («Quitar renglón de <título>»).

Por qué no se toca `css/estilos.css`: el input de cantidad es un control nativo dentro de la tabla, la tabla ya está dentro de `.tabla-contenedor` con desplazamiento propio y el error de cantidad se comunica con texto en `#mensaje-venta`, `aria-invalid` y `aria-describedby`; el borde rojo es un refuerzo opcional, no el único indicador.

Alternativas descartadas: dos formularios separados (el HTML actual tiene uno solo y separarlos obligaría a duplicar el cliente y los renglones); un `submit` con un `input hidden` que indique la intención (frágil y fácil de romper con Enter); un botón «Editar» por fila que abra `window.prompt` o un modal (más estados, peor accesibilidad y más código).

### 6. Render de renglones con plantilla, `DocumentFragment` y `replaceChildren`

`crearFilaRenglon(renglon, libro)` clona `#plantilla-fila-renglon` con `content.cloneNode(true)` y completa las cinco celdas:

1. Título del libro.
2. Input de cantidad con el valor actual y su etiqueta accesible.
3. Precio unitario formateado con `TUCO.formato.formatearMoneda`.
4. Subtotal formateado.
5. Botón «Quitar renglón» con etiqueta accesible.

`renderizarRenglones()` arma un `DocumentFragment` con todas las filas y lo inserta con `tbody.replaceChildren(fragmento)`. Después actualiza `#total-venta` con `formatearMoneda(total)`. La tabla no usa `innerHTML`.

La delegación de eventos se registra una sola vez en el `tbody`: `change` para los inputs de cantidad y `click` para los botones de quitar. Cada evento resuelve la fila con `event.target.closest('tr')` y lee `dataset.libroId`; así los listeners sobreviven a cada `replaceChildren`.

Tras una edición válida se vuelve a renderizar y se restaura el foco en el input de la misma fila, buscándolo por `data-libro-id`. Alternativa descartada: actualizar celdas sueltas sin re-renderizar (menos código de render, pero dos caminos de actualización y riesgo de que el subtotal y el total queden desincronizados).

### 7. Edición de cantidad en la fila

El input de cantidad es la interfaz de edición; no hay un botón «Editar» separado. En el evento `change`:

1. Se lee el valor y se valida con `TUCO.validaciones.validarCantidad`.
2. Si es inválido, se revierte el input a la cantidad anterior, se marca `aria-invalid="true"` y se muestra el mensaje en `#mensaje-venta` con `mensaje--error`.
3. Si es válido, se actualiza la cantidad en el carrito, se re-renderiza y se restaura el foco.
4. Al escribir de nuevo (`input`), se limpia `aria-invalid` y el mensaje de error anterior.

El libro del renglón ya fue validado al agregarlo; `validarVenta` vuelve a comprobar su existencia al confirmar. Alternativas descartadas: un botón «Editar» que convierta la celda en un formulario (dos estados por fila y más controles); `window.prompt` (no es accesible ni consistente con el resto de la interfaz); sumar automáticamente al agregar un duplicado (rompe la regla de informar el duplicado y sorprende al operador).

### 8. Duplicados: informar, no sumar

Si el libro ya está en el carrito, `validarRenglon` devuelve `errores.libroId` con el texto «El libro ya está en la venta. Modificá la cantidad del renglón existente.». No se crea otra fila ni se suma la cantidad. El operador puede editar la cantidad en la fila existente o quitarla y volver a agregarla. Es la opción explícita que permite RN-VEN-05 y evita un total inesperado.

### 9. Subtotal, total y redondeo

`validarVenta` calcula `subtotal = redondear2(cantidad × precioUnitario)` y `total = redondear2(suma de subtotales)` con un helper interno:

```js
function redondear2(valor) {
  return Math.round((Number(valor) + Number.EPSILON) * 100) / 100;
}
```

Los valores se guardan como números y se muestran con `TUCO.formato.formatearMoneda`. El redondeo evita los artefactos binarios de sumar precios con decimales (por ejemplo, `0.1 + 0.2`). Alternativas descartadas: exigir precios enteros (C-04 ya admite decimales con punto); usar `toFixed(2)` para guardar (devuelve string y no resuelve todos los casos de redondeo).

### 10. Flujo de alta de renglón

1. `preventDefault()` en el `submit` de `#form-venta`.
2. Ocultar el mensaje de éxito anterior y limpiar errores previos.
3. Leer `#libroId` y `#cantidad`; el cliente no se exige para agregar.
4. Leer `libros` y el carrito actual con `leerColeccion`.
5. Llamar a `validarRenglon({ libroId, cantidad }, { libros, renglones })`.
6. Si hay errores, mostrarlos por campo, armar el resumen, enfocar el primer campo inválido y terminar sin modificar el carrito.
7. Si es válido, agregar `{ libroId, cantidad }` al carrito, limpiar `#libroId` y `#cantidad`, re-renderizar, actualizar el total y mostrar «Renglón agregado.» en `#mensaje-venta` con `mensaje--info`.
8. Enfocar `#libroId` para la siguiente carga.

### 11. Flujo de confirmación, doble submit y verificación de escritura

1. Limpiar errores y el mensaje anterior.
2. Leer `#clienteId` y el carrito.
3. Llamar a `validarVenta({ clienteId, renglones }, { clientes, libros })`.
4. Si hay errores, mostrarlos; si el error es de renglones, el resumen explica que se agregue al menos uno o que se revisen los renglones, y se enfoca `#clienteId` o `#libroId` según corresponda. No se persiste.
5. Si es válido, activar el guard `confirmando = true` y deshabilitar `#boton-confirmar` (con `aria-busy="true"`).
6. Releer `tuco:ventas`, generar `id = siguienteId('ven', ventas)` y `fecha = new Date().toISOString()`.
7. Construir la venta con `datos.clienteId`, `datos.clienteNombre`, `datos.renglones` y `datos.total`.
8. `escribirColeccion('ventas', ventas.concat(venta))`.
9. Releer `tuco:ventas` y buscar el `id` nuevo. Si no aparece (porque `localStorage` no está disponible o la escritura falló en silencio), mostrar un mensaje de error, conservar el carrito y el cliente, rehabilitar el botón y terminar sin mostrar éxito.
10. Si aparece, vaciar el carrito, `form.reset()`, actualizar el total a `$ 0,00`, mostrar «Venta ven-N confirmada por $ X.» con `mensaje--exito`, enfocar `#clienteId` y rehabilitar el botón.

La relectura es necesaria porque `escribirColeccion` devuelve `void` y atrapa la excepción con `console.warn`; es la única forma de detectar la falla sin modificar el adaptador de C-03 (que pertenece a C-06). El guard `confirmando` evita que un doble clic genere dos ventas aunque la escritura sea sincrónica.

Alternativas descartadas: cambiar `escribirColeccion` para que devuelva `boolean` (toca un módulo compartido y su contrato, fuera del alcance de C-05); confiar en el adaptador (se mostraría un éxito falso cuando `localStorage` falla); confirmar con un `submit` (se mezclaría con el alta de renglón).

### 12. Historial: render, orden y enlace

`historial.js` lee `tuco:ventas`, copia el arreglo con `slice()` y lo ordena de la venta más reciente a la más antigua por el sufijo numérico de `ven-N` (`Number(id.slice(4))`, con `0` como fallback para un id malformado), porque el arreglo se agrega al final y el historial de auditoría se lee mejor con lo último arriba. Es una decisión de presentación asumida; no cambia el modelo de datos.

Cada fila clona `#plantilla-fila-venta` y completa las celdas con `textContent`: identificador, `TUCO.formato.formatearFecha(venta.fecha)`, `clienteNombre` y `TUCO.formato.formatearMoneda(total)`. El enlace de la última celda recibe `href = 'venta-detalle.html?id=' + encodeURIComponent(venta.id)` y su `<span class="visualmente-oculto">` se completa con « de la venta ven-N» para dar contexto al lector de pantalla. El `tbody` se reemplaza con `replaceChildren` y `#mensaje-historial-vacio.hidden` se alterna según la cantidad de ventas.

Alternativas descartadas: ordenar por fecha (los IDs ya son crecientes y la fecha ISO no siempre está disponible en registros viejos); construir el enlace con `innerHTML` (prohibido por seguridad).

### 13. Detalle: lectura del id y render histórico

`venta-detalle.js` obtiene el id con `new URLSearchParams(window.location.search).get('id')`, lo recorta y exige el formato `/^ven-\d+$/`. Busca la venta con `TUCO.almacenamiento.obtenerPorId('ventas', id)`. Si el id falta, no cumple el formato, no existe la venta o `venta.renglones` no es un arreglo, limpia `#detalle-venta` con `replaceChildren()`, muestra `#mensaje-detalle` y deja el enlace «Volver al historial» que ya está en el HTML.

Si la venta existe, oculta el mensaje y construye el contenido con `createElement` y `textContent`:

- Un `<dl>` con identificador, fecha (`formatearFecha`), cliente (`clienteNombre` del snapshot) y total (`formatearMoneda`).
- Un `.tabla-contenedor` con `role="region"`, `tabindex="0"` y `aria-label`, que envuelve una `<table class="tabla tabla--ancha">` con `caption` «Renglones de la venta ven-N» y encabezados `th scope="col"` para Libro, Cantidad, Precio unitario y Subtotal.
- Una fila por renglón con los valores guardados (`titulo`, `cantidad`, `precioUnitario`, `subtotal`); nunca se lee `tuco:libros`.

Se usa `createElement` en lugar de una plantilla nueva porque la tabla del detalle no existe en el HTML y agregar una plantilla para cinco celdas no reduce código. Alternativa descartada: reutilizar la plantilla de renglones de ventas (está pensada para inputs y botones de edición, que el detalle no debe tener).

### 14. Fecha ISO almacenada y formatos de presentación

La venta guarda `fecha` con `new Date().toISOString()`. El historial y el detalle la muestran con `TUCO.formato.formatearFecha`, que toma los primeros diez caracteres y devuelve `dd/mm/aaaa`; no se usa `toLocaleDateString` sobre un `Date`, porque la zona horaria podría correr el día. Los importes se muestran con `formatearMoneda`, ya usado por C-03/C-04. En el detalle se muestra solo la fecha, aunque DD-13 permite la hora; se evita un formato adicional que la consigna no exige.

### 15. Accesibilidad de la composición, el historial y el detalle

- Cada campo tiene `<label for>`; no se agregan controles sin etiqueta.
- El resumen de `ventas.html` usa `role="alert"` y se muestra solo cuando hay errores; `#mensaje-venta` conserva `role="status"` para las actualizaciones informativas y de éxito.
- `aria-invalid="true"` se aplica solo a los campos con error y se quita al iniciar una nueva acción o al corregir.
- Cada control inválido queda vinculado a su texto con `aria-describedby`.
- El input de cantidad de cada fila tiene `aria-label` con el título del libro y `aria-describedby="mensaje-venta"`; el botón de quitar tiene `aria-label` con el título. No se depende del color.
- Tras un error de alta se enfoca el primer campo inválido; tras un error de confirmación se enfoca el cliente o el libro, según el caso; tras un éxito se enfoca el primer control limpio.
- La tabla de renglones conserva `caption` y `th scope="col"`; la tabla del detalle se crea con la misma semántica y un contenedor desplazable.
- El historial usa una tabla con `caption` y encabezados; el enlace tiene texto visible «Ver detalle» y un `span` oculto con el identificador.
- No se usa `outline: none`, `div` clickeable ni un error indicado solo por color.

### 16. Orden de scripts con `defer`

`ventas.html`, antes de `</body>`:

```html
<script src="js/datos-iniciales.js" defer></script>
<script src="js/almacenamiento.js" defer></script>
<script src="js/validaciones.js" defer></script>
<script src="js/formato.js" defer></script>
<script src="js/ventas.js" defer></script>
```

`historial.html`:

```html
<script src="js/datos-iniciales.js" defer></script>
<script src="js/almacenamiento.js" defer></script>
<script src="js/formato.js" defer></script>
<script src="js/historial.js" defer></script>
```

`venta-detalle.html`:

```html
<script src="js/datos-iniciales.js" defer></script>
<script src="js/almacenamiento.js" defer></script>
<script src="js/formato.js" defer></script>
<script src="js/venta-detalle.js" defer></script>
```

`datos-iniciales.js` precede a `almacenamiento.js` porque este último usa el seed; `formato.js` se carga solo donde se usa. Cada módulo resuelve `TUCO.almacenamiento`, `TUCO.validaciones` y `TUCO.formato` dentro de `inicializar`, igual que `libros.js` y `clientes.js`, y llama a `inicializar` al final cuando `document` existe.

### 17. Verificación sin herramientas del proyecto

Sin `package.json` ni test runner (DD-06):

- `node --check` sobre `js/validaciones.js`, `js/ventas.js`, `js/historial.js` y `js/venta-detalle.js`.
- Inspección estática de ausencia de `innerHTML`, `fetch`, XHR, `import`, `export`, `type="module"` y claves `tuco:*` fuera de `almacenamiento.js`.
- Verificación desde la consola de `validarRenglon` y `validarVenta` con casos puros: renglón válido, libro inexistente, cantidad `0`/`1.5`, libro duplicado, venta sin cliente, venta sin renglones y snapshot con `2 × 1500 + 1 × 2000`.
- Casos manuales en el navegador con resultado observado, registrados en el README de C-06.

## Risks / Trade-offs

- [La edición de cantidad no revalida que el libro siga existiendo] → Se revalida en `validarVenta` al confirmar; si el libro desapareció, la venta se rechaza y no se guarda un renglón huérfano.
- [El input de cantidad no hereda los estilos de `.campo`] → Es un control nativo dentro de la tabla, la tabla ya se desplaza en su contenedor y el error se comunica con texto, `aria-invalid` y `aria-describedby`; no se agrega CSS.
- [La edición de cantidad con `type="number"` puede devolver vacío ante una coma decimal] → Se valida como cantidad inválida y se muestra el mensaje; la consigna exige enteros, así que el separador decimal no aplica a la cantidad.
- [El adaptador no informa fallas de escritura] → Se relee `tuco:ventas` después de escribir y se verifica el id; si no está, se informa el error y se conserva la composición. La solución global llega en C-06.
- [Dos pestañas pueden pisar `tuco:ventas`] → Limitación conocida de `localStorage` sin backend (SU-05); cada confirmación relee la colección antes de generar el id.
- [Re-renderizar la tabla puede perder el foco] → Se restaura el foco en el input de la misma fila usando `data-libro-id`.
- [El orden del historial es una decisión de presentación] → Se elige de la más reciente a la más antigua; si la cátedra espera el orden de confirmación, se cambia el `sort` sin tocar los datos.
- [El caso `2 × 1500 + 1 × 2000` no existe en el seed] → Para ejecutarlo se dan de alta dos libros con precios `1500` y `2000` desde `libros.html` o se ajustan en `tuco:libros` desde las herramientas del navegador; queda documentado en las tareas.
- [Los registros de `tuco:ventas` escritos a mano podrían estar malformados] → El historial usa los campos con `textContent` y el detalle trata `renglones` no arreglado como venta no disponible; la interfaz no genera esos registros.

## Migration Plan

1. Extender `js/validaciones.js` con `validarRenglon`, `validarVenta`, los mensajes nuevos y el helper de redondeo, sin tocar las funciones existentes.
2. Editar `ventas.html`: resumen, errores por campo, `aria-describedby`, botón de confirmación como `type="button"`, input de cantidad en la plantilla y scripts con `defer`.
3. Crear `js/ventas.js` sobre `TUCO.almacenamiento` y `TUCO.validaciones`.
4. Editar `historial.html` con los scripts y crear `js/historial.js`.
5. Editar `venta-detalle.html` para ocultar el mensaje por defecto y cargar los scripts; crear `js/venta-detalle.js`.
6. Verificar sintaxis con `node --check` y ejecutar los casos manuales en el navegador.
7. Rollback: quitar las etiquetas `<script>` y los bloques agregados en los tres HTML, eliminar los tres módulos nuevos y revertir la extensión de `validaciones.js`. Las ventas de prueba se pueden borrar desde las herramientas del navegador (`tuco:ventas`).

## Open Questions

Ninguna bloqueante. Quedan registradas como supuestos para confirmar: el historial se ordena de la más reciente a la más antigua; la edición de cantidad se hace con un input en la fila y no con un botón «Editar»; el detalle muestra solo la fecha, sin hora; el caso de `1500`/`2000` requiere crear esos libros antes de la prueba manual; no se modifica `css/estilos.css`.
