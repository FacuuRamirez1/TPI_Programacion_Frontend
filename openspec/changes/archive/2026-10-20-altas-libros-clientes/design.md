# Design

## Context

`libros.html` y `clientes.html` ya tienen la maqueta de C-01 y los estilos de C-02: formularios con `novalidate`, campos con `<label for>`, tablas con `<caption>` y `<th scope="col">`, plantillas inertes (`#plantilla-fila-libro`, `#plantilla-fila-cliente`) y mensajes de lista vacía. C-03 dejó `js/datos-iniciales.js`, `js/almacenamiento.js` (lector/escritor de claves `tuco:*`, `siguienteId`, `obtenerPorId`), `js/formato.js` (`formatearMoneda`, `formatearFecha`) y `js/catalogo.js` con el patrón IIFE, `createElement`/`textContent` y `replaceChildren`.

Las restricciones son las de todo el proyecto: `file://`, sin módulos ES, sin frameworks, sin build y persistencia solo en `localStorage`. Ver `proposal.md` para la motivación y `specs/registro-libros/spec.md` y `specs/registro-clientes/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**

- Concentrar las reglas de alta en funciones puras, reutilizables desde la consola y desde C-05.
- Resolver las altas con el adaptador de C-03, sin acceder a `localStorage` desde los módulos de vista.
- Reutilizar la maqueta existente con el mínimo cambio de HTML y sin tocar `css/estilos.css`.
- Cubrir errores por campo, resumen, éxito, foco y semántica accesible sin depender del color.

**Non-Goals:**

- ABM de libros o clientes: no hay edición ni borrado.
- Ventas: C-04 solo publica `validarCantidad` como primitiva; la composición y confirmación son de C-05.
- Mensaje visible ante falla de `localStorage`: se mantiene el `console.warn` de C-03 y el mensaje al usuario llega en C-06.
- Sincronización en vivo entre pestañas o documentos: cada vista lee la colección al cargarse.
- Cambios en `index.html`, `ventas.html`, `css/estilos.css` o en los módulos de C-03.
- Pruebas automatizadas o dependencias.

## Decisions

### 1. Dos capabilities: `registro-libros` y `registro-clientes`

Se separan los contratos porque son entidades y flujos distintos, con validaciones, IDs y listados propios. Un único spec `altas-libros-clientes` habría mezclado dos dominios y habría obligado a duplicar escenarios de feedback dentro de un nombre acoplado al change. Se sigue el layout plano y kebab-case que ya usan `catalogo-local`, `estructura-pantallas` y `presentacion-adaptable`.

### 2. `validaciones.js` puro, sin DOM ni almacenamiento

Nuevo módulo IIFE que publica `TUCO.validaciones`:

```js
TUCO.validaciones = {
  normalizarIsbn, normalizarEmail,
  validarLibro, validarCliente, validarCantidad
};
```

Firmas:

```js
validarLibro(entrada, contexto) -> { valido, errores, datos }
validarCliente(entrada, contexto) -> { valido, errores, datos }
validarCantidad(cantidad) -> { valido, error }
```

- `entrada` es un objeto plano con los valores crudos del formulario: `{ titulo, isbn, precio, editorialId, generoId, autorIds }` para libro y `{ nombreCompleto, email }` para cliente. `autorIds` es un array de strings.
- `contexto` es `{ libros, editoriales, generos, autores }` o `{ clientes }`, siempre colecciones ya leídas por el módulo de vista. La función no llama a `TUCO.almacenamiento`.
- `errores` es un objeto con las claves exactas de los campos (`titulo`, `isbn`, `precio`, `editorialId`, `generoId`, `autorIds`, `nombreCompleto`, `email`) y un mensaje en español por cada campo inválido. Un campo válido no aparece en el objeto. El handler recorre ese objeto para mostrar los mensajes, sin volver a evaluar reglas.
- `datos` contiene los valores normalizados que se persistirán: `titulo` e `isbn` recortados, `precio` como número o `null`, `editorialId` recortado, `generoId` como ID o `null`, `autorIds` sin vacíos ni duplicados y en orden de selección; `nombreCompleto` recortado y `email` recortado y en minúsculas.
- Ambas funciones son puras: no mutan `entrada` ni `contexto`, no leen el DOM y no tienen efectos secundarios. Devuelven siempre las tres claves, aunque haya errores.

Reglas concretas:

| Campo | Normalización | Regla |
|---|---|---|
| `titulo` | `trim` | No vacío |
| `isbn` | `trim` para guardar; `replace(/[\s-]/g, '').toLowerCase()` para comparar | No vacío y distinto de todos los ISBN normalizados de `contexto.libros` |
| `precio` | `String(valor).trim()` y `Number(...)` | Texto no vacío, finito y `> 0`; si no, `datos.precio = null` |
| `editorialId` | `trim` | No vacío y presente en `contexto.editoriales` |
| `generoId` | `trim`; `''` → `null` | `null` es válido; si tiene valor, presente en `contexto.generos` |
| `autorIds` | Filtrar vacíos y duplicados | Al menos uno y todos presentes en `contexto.autores` |
| `nombreCompleto` | `trim` | No vacío |
| `email` | `trim().toLowerCase()` | No vacío y formato `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |

`normalizarIsbn` y `normalizarEmail` se exponen para verificarlas desde la consola y para que C-05 reutilice la misma normalización. No se valida el dígito verificador del ISBN (RN-LIB-11) ni se impone longitud.

Alternativas descartadas: validar dentro de los handlers (prohibido por la regla 7 y difícil de reutilizar); usar la validación nativa del navegador (no cubre unicidad ni existencia de relaciones y mostraría mensajes inconsistentes, además el formulario ya es `novalidate`); devolver un array de errores sin clave (obligaría al handler a mapear mensajes a campos).

### 3. `validarCantidad` para C-05

Para cumplir el alcance de `js/validaciones.js` sin inventar la composición de ventas, se incluye una única primitiva pura:

```js
validarCantidad(cantidad) -> { valido: true } | { valido: false, error: 'La cantidad debe ser un entero mayor que cero.' }
```

Acepta números o strings numéricos, exige entero mayor que cero y no toca el DOM. La validación completa de una venta (cliente, renglones, duplicados) se agrega en C-05, cuando exista su contrato de UI.

### 4. Un módulo de vista por formulario

Se crean `js/libros.js` y `js/clientes.js`, cada uno con el patrón IIFE de C-03 y una API mínima: `inicializar` y las funciones puras de render que convenga verificar desde la consola (`poblarSelectores`, `renderizarListado`). No se crea un `altas.js` común: los formularios, las tablas y las reglas de cada entidad son distintos, y un módulo compartido terminaría con ramas por página.

Cada módulo resuelve `TUCO.almacenamiento`, `TUCO.validaciones` y `TUCO.formato` en tiempo de llamada, dentro de `inicializar`, igual que `catalogo.js`. `inicializar` se invoca al final del archivo cuando `document` existe; con `defer` el DOM ya está parseado.

### 5. Orden de scripts con `defer`

`libros.html`, antes de `</body>`:

```html
<script src="js/datos-iniciales.js" defer></script>
<script src="js/almacenamiento.js" defer></script>
<script src="js/validaciones.js" defer></script>
<script src="js/formato.js" defer></script>
<script src="js/libros.js" defer></script>
```

`clientes.html`, antes de `</body>`:

```html
<script src="js/datos-iniciales.js" defer></script>
<script src="js/almacenamiento.js" defer></script>
<script src="js/validaciones.js" defer></script>
<script src="js/clientes.js" defer></script>
```

`datos-iniciales.js` debe preceder a `almacenamiento.js` porque este último usa el seed. `formato.js` se carga solo donde se usa (libros), para no sumar un script innecesario a clientes.

### 6. Cambio mínimo de HTML: resumen, errores por campo y `aria-describedby`

En cada formulario se agrega, como primer hijo:

```html
<p id="resumen-errores-libro" class="mensaje mensaje--error" role="alert" hidden></p>
```

y, después de cada control, un contenedor de error:

```html
<div id="error-titulo" class="mensaje mensaje--error" hidden></div>
```

Se usa `<div>` y no `<p>` porque la regla `.campo > p:not(.campo)` de `css/estilos.css` tiene mayor especificidad que `.mensaje--error` y teñiría el error con el color de texto suave. Con `<div>` se reutilizan los estilos de `.mensaje` y `.mensaje--error` sin agregar CSS.

IDs de error: `error-titulo`, `error-isbn`, `error-precio`, `error-editorialId`, `error-generoId`, `error-autorIds`; `error-nombreCompleto` y `error-email`.

Cada control recibe `aria-describedby` apuntando a su error, y el selector de autores conserva la ayuda existente: `aria-describedby="ayuda-autorIds error-autorIds"`. El resumen y los errores por campo se vinculan con texto; no se depende del borde rojo.

En el `select multiple` de autores se quita el atributo `selected` de la opción deshabilitada «Seleccioná uno o más autores». En un `multiple`, esa opción queda visible como instrucción pero no seleccionada, de modo que `selectedOptions` arranca vacío y `form.reset()` no deja una selección fantasma.

Alternativas descartadas: crear los nodos de error desde JavaScript (menos explícito para revisar el HTML y más código de DOM); usar `setCustomValidity` (mezcla la validación nativa con la propia y no permite resumen); agregar una clase CSS nueva (no hace falta).

### 7. Poblado de selectores desde los datos

`libros.js` reconstruye las opciones con `document.createElement('option')` y `textContent`, y las inserta con `replaceChildren`, para que una reinicialización no duplique opciones:

- Editorial: opción inicial `value=""`, texto «Seleccioná una editorial», `disabled` y `selected`; luego una opción por editorial con `value = id` y `textContent = nombre`.
- Género: opción `value=""`, texto «Sin clasificar» (habilitada y seleccionada por defecto); luego una opción por género.
- Autores: opción inicial `value=""`, texto «Seleccioná uno o más autores», `disabled` (sin `selected`); luego una opción por autor con `value = id` y `textContent = nombre + ' ' + apellido`.

No se usan listas hardcodeadas ni `innerHTML`.

### 8. Render de listados con plantilla y `textContent`

`renderizarListado` lee la colección completa, construye índices `Map` de editoriales, géneros y autores (mismo criterio que `catalogo.js`) y arma un `DocumentFragment`.

- Libros: clona `#plantilla-fila-libro` con `content.cloneNode(true)` y llena los seis `<td>` en orden posicional (título, ISBN, editorial, género, autores, precio). El precio se delega a `TUCO.formato.formatearMoneda`. El género usa «Sin clasificar» si `generoId` es `null`. Los autores se resuelven como `nombre + ' ' + apellido`, unidos por `, ` en el orden de `autorIds`.
- Clientes: clona `#plantilla-fila-cliente` y llena los dos `<td>` con `nombreCompleto` y `email`.
- El `tbody` se reemplaza con `replaceChildren(fragmento)`.
- `#mensaje-libros-vacio` y `#mensaje-clientes-vacio` se alternan solo con `element.hidden`, según la cantidad de registros.

Se mantiene la plantilla sin clases en las celdas y se usa el orden posicional porque el HTML ya existe y no se quiere ampliar el cambio. Alternativa descartada: `innerHTML` con los datos (prohibido por RN-CAT-08 y por seguridad).

### 9. Flujo de alta y persistencia

Handler de `libros.js`:

1. `evento.preventDefault()`.
2. Ocultar el mensaje de éxito anterior y limpiar errores previos (`aria-invalid` y textos).
3. Leer los campos y `Array.from(selectAutores.selectedOptions).map(o => o.value)`.
4. Leer `libros`, `editoriales`, `generos` y `autores` con `leerColeccion`.
5. Llamar a `validarLibro(entrada, contexto)`.
6. Si `!valido`: mostrar errores por campo, armar el resumen con `textContent`, enfocar el primer campo inválido y terminar sin persistir.
7. Si `valido`: volver a leer `libros`, generar `id = siguienteId('lib', libros)`, construir el registro con `datos` y `id`, llamar a `escribirColeccion('libros', libros.concat(registro))`, re-renderizar el listado, ocultar el mensaje de vacío, `form.reset()`, mostrar «Libro registrado correctamente.» en `#mensaje-libro` con `mensaje--exito` y enfocar `#titulo`.

Handler de `clientes.js`: mismo flujo con `validarCliente`, `siguienteId('cli', clientes)`, `escribirColeccion('clientes', ...)`, «Cliente registrado correctamente.» y foco en `#nombreCompleto`.

La colección se relee justo antes de generar el ID para no pisar altas hechas en la misma sesión. No se accede a `localStorage` directamente: todo pasa por `TUCO.almacenamiento`. El adaptador sigue devolviendo `void` en `escribirColeccion`, por lo que en C-04 una falla de escritura solo se informa por consola; el mensaje visible y la semántica de `tuco:esquema` son de C-06.

### 10. Actualización de otras vistas

El catálogo de `index.html` y los selectores de `ventas.html` leen sus colecciones al cargarse, así que un alta en `libros.html` o `clientes.html` se refleja al abrir o recargar esas vistas. No se agregan listeners de `storage` ni se comparte DOM entre documentos: no hay sincronización en vivo entre pestañas (SU-05). En C-04 `ventas.html` todavía no tiene módulo; cuando C-05 implemente `ventas.js`, poblará sus selectores desde `tuco:clientes` y `tuco:libros` y verá las altas persistidas.

### 11. Estrategia de accesibilidad

- Cada campo ya tiene `<label for>`; no se agregan controles sin etiqueta.
- `aria-invalid="true"` solo en campos con error y se quita al corregir o al iniciar un nuevo envío.
- Cada campo inválido queda vinculado a su texto mediante `aria-describedby`.
- El resumen usa `role="alert"` y se muestra al enviar con errores; el mensaje de éxito usa el `role="status"` que ya tiene `#mensaje-libro`/`#mensaje-cliente`.
- Los errores se expresan con texto; el borde de `.mensaje--error` y `[aria-invalid="true"]` es un refuerzo visual, no el único indicador.
- Tras un envío inválido se enfoca el primer campo con error; tras un alta válida se enfoca el primer campo del formulario limpio.
- No se usa `outline: none` ni se altera la navegación por teclado.

### 12. Verificación sin herramientas del proyecto

Sin test runner ni `package.json` (DD-06):

- `node --check` sobre los tres archivos JS nuevos, como chequeo de sintaxis con el Node del entorno (no es dependencia de la entrega).
- Revisión estática de ausencia de `innerHTML`, `fetch`, XHR, `import`, `export`, `type="module"` y claves `tuco:*` fuera de `almacenamiento.js`.
- Verificación desde la consola de `TUCO.validaciones` con casos puros (ISBN normalizado, email normalizado, precio inválido, sin autores).
- Siete casos manuales en el navegador, con el resultado observado registrado en el README de C-06.

## Risks / Trade-offs

- [El precio usa `type="number"`; un usuario podría escribir coma decimal y el navegador devolver un valor vacío] → Se valida como no numérico y se muestra el error; se documenta que el separador decimal esperado es el punto. Los precios del seed son enteros.
- [El adaptador no informa fallas de escritura al llamador] → En C-04 la falla solo queda en consola y el mensaje visible se implementa en C-06; se acepta como limitación transitoria coherente con C-03.
- [Dos pestañas pueden pisar la colección completa] → Limitación conocida de `localStorage` sin backend (SU-05); cada submit relee la colección para reducir la ventana de pérdida.
- [El `select multiple` es incómodo en teclado y en móvil] → Se conserva el control nativo que exige la consigna y la ayuda visible `#ayuda-autorIds`; no se reemplaza por checkboxes.
- [El catálogo no se actualiza en vivo en otra pestaña] → Se refleja al recargar `index.html`; el alcance pide actualización sin recarga del listado de la misma vista y disponibilidad para las demás al cargarse.
- [Cambios futuros en el orden de las celdas de las plantillas romperían el render posicional] → El template y el render viven en el mismo change; si C-06 u otro change agrega columnas, se actualizan ambos.
- [Los mensajes de error podrían quedar obsoletos si el usuario corrige sin reenviar] → Se limpian al inicio de cada envío; no se valida en vivo para no adelantar reglas ni generar ruido.

## Migration Plan

1. Crear `js/validaciones.js`.
2. Crear `js/libros.js` y `js/clientes.js` sobre la API de C-03.
3. Editar `libros.html` y `clientes.html`: resumen, errores por campo, `aria-describedby`, ajuste del `select multiple` y etiquetas `<script defer>`.
4. Verificar sintaxis con `node --check` y ejecutar los siete casos manuales en el navegador.
5. Rollback: quitar las etiquetas `<script>` y los bloques de error agregados, y eliminar los tres archivos nuevos. Las claves `tuco:libros` y `tuco:clientes` pueden quedar con altas de prueba y borrarse desde las herramientas del navegador.

## Open Questions

Ninguna bloqueante. Quedan registradas como supuestos para confirmar: el precio admite decimales con punto y no con coma; la opción deshabilitada del selector múltiple se conserva como instrucción pero sin `selected`; la validación completa de ventas se completa en C-05.
