# Design

## Context

El catálogo de `index.html` ya cuenta con la maqueta de C-01 y los estilos de C-02: buscador `#buscador-titulo`, listado `#listado-catalogo`, mensajes `#mensaje-catalogo-vacio` y `#mensaje-sin-resultados`, y la plantilla inerte `#plantilla-tarjeta-libro`. No existe todavía ningún archivo en `js/` ni lógica de datos.

Las restricciones del proyecto condicionan todo el diseño: la entrega se abre con doble clic desde `file://`, sin npm ni servidor, por lo que no se pueden usar módulos ES; no se admiten frameworks, CDNs, `fetch` ni build; la persistencia es solo `localStorage` con claves `tuco:*`. Ver `proposal.md` para la motivación y `specs/catalogo-local/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**

- Publicar el seed exacto de la KB en `TUCO.datosIniciales` y centralizar el acceso a `localStorage` en un único módulo.
- Renderizar el catálogo desde los datos locales sin datos hardcodeados en el HTML, insertando valores con `textContent`.
- Ofrecer el filtro por título en vivo con `trim`, comparación sin distinguir mayúsculas y coincidencia parcial.
- Cubrir los estados de catálogo vacío y búsqueda sin coincidencias con los contenedores existentes.
- Mantener la maqueta y los estilos intactos: el único cambio en HTML son cuatro etiquetas `<script defer>`.

**Non-Goals:**

- Altas de libros y clientes, validaciones de formularios y actualización del DOM tras un alta (C-04).
- Ventas, historial y snapshot histórico (C-05).
- Semántica completa de `tuco:esquema`, seed único en el primer inicio y mensajes visibles ante fallas de almacenamiento (C-06).
- Plegado de acentos en la búsqueda: el filtro es estándar (`trim` + minúsculas), sin normalización diacrítica.
- Portadas reales: se conserva el placeholder local de la plantilla.
- Pruebas automatizadas o test runners (DD-06).

## Decisions

### 1. Cuatro módulos IIFE que publican en `window.TUCO`

Se crean `js/datos-iniciales.js`, `js/almacenamiento.js`, `js/formato.js` y `js/catalogo.js`, cada uno con el patrón `(function (global) { ... })(window)` y `'use strict'`, publicando su API en `TUCO`. Se descartan los módulos ES porque `file://` bloquea los imports por CORS, y un único `app.js` porque perdería la separación por dominio acordada en la KB.

Orden de carga con `defer`, que respeta las dependencias:

```html
<script src="js/datos-iniciales.js" defer></script>
<script src="js/almacenamiento.js" defer></script>
<script src="js/formato.js" defer></script>
<script src="js/catalogo.js" defer></script>
```

`datos-iniciales.js` debe ejecutarse antes que `almacenamiento.js` porque este último usa `TUCO.datosIniciales` para el seed. `catalogo.js` resuelve `TUCO.almacenamiento` y `TUCO.formato` en tiempo de llamada, dentro de `inicializar`.

### 2. Seed exacto y copia profunda

`js/datos-iniciales.js` solo contiene datos: publica `TUCO.datosIniciales` con las colecciones `editoriales`, `generos`, `autores`, `libros` y `clientes` del seed de `knowledge-base/04_modelo_de_datos.md` (2, 2, 3, 6 y 3 registros). No incluye funciones ni lógica.

Toda entrega del seed se hace con `JSON.parse(JSON.stringify(...))` para que los consumidores no muten el objeto original compartido. Se descartó `structuredClone` por simplicidad y compatibilidad, y devolver la referencia directa porque un cambio accidental en el catálogo contaminaría el seed en memoria.

### 3. `almacenamiento.js` v1: adaptador real con fallback

Es la única capa que conoce las claves `tuco:editoriales`, `tuco:generos`, `tuco:autores`, `tuco:libros`, `tuco:clientes`, `tuco:ventas` y `tuco:esquema`. API pública:

- `leerColeccion(nombre)`: lee y parsea la clave; si la clave falta o el JSON es inválido, devuelve una copia del seed de esa colección y la persiste.
- `escribirColeccion(nombre, coleccion)`: serializa la colección completa y la escribe.
- `siguienteId(prefijo, coleccion)`: calcula el mayor sufijo numérico existente más uno y devuelve `prefijo-N`.
- `obtenerPorId(nombre, id)`: busca un registro por ID en una colección ya cargada o leída.

Decisión confirmada: se usa `localStorage` real con fallback al seed desde C-03. La lectura y la escritura se envuelven en `try/catch`; ante una falla se registra `console.warn` y se devuelve la copia del seed para no dejar el catálogo vacío. La semántica de `tuco:esquema` (versión `"1"`, seed solo en el primer inicio, colección faltante vacía) y los mensajes visibles de falla se completan en C-06; en C-03 alcanza con lectura/escritura y seed perezoso por colección.

Alternativas descartadas: sembrar todo desde `catalogo.js` (rompe la separación de responsabilidades) y usar una sola clave con todo el estado (impide la comprobación aislada de `tuco:libros` que exige C-06).

### 4. `formato.js`: `Intl` y fecha determinista

`formatearMoneda(valor)` usa una única instancia de `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })`, con salida esperada `$ 12.500,00`. Se descartó formatear a mano porque la KB exige `Intl` y porque el separador de miles y la coma decimal deben ser consistentes.

`formatearFecha(iso)` devuelve `dd/mm/aaaa` tomando los componentes de la parte de fecha del ISO (`aaaa-mm-dd`) y reordenándolos, en lugar de construir un `Date` local. Así se evita que la zona horaria desplace el día mostrado.

### 5. Render con plantilla, `DocumentFragment` y `textContent`

`catalogo.js` expone `inicializar` y también `filtrarPorTitulo` en `TUCO.catalogo` para poder verificarla desde la consola. Flujo de render:

1. `leerColeccion('libros')` y las colecciones relacionadas (`editoriales`, `generos`, `autores`).
2. `construirIndices` crea un `Map` `id → entidad` por colección para resolver relaciones sin búsquedas repetidas.
3. `crearTarjeta(libro)` clona `#plantilla-tarjeta-libro` con `content.cloneNode(true)` y rellena `.tarjeta-titulo`, `.tarjeta-isbn`, `.tarjeta-editorial`, `.tarjeta-genero`, `.tarjeta-autores` y `.tarjeta-precio` con `textContent`.
4. Los autores se resuelven desde `autorIds` como `nombre + ' ' + apellido` y se unen con `, `.
5. El género usa el nombre del índice o `«Sin clasificar»` cuando `generoId` es `null`.
6. El precio se delega a `TUCO.formato.formatearMoneda`.
7. Las tarjetas se acumulan en un `DocumentFragment` y se insertan con `listado.replaceChildren(fragmento)`.

Decisión confirmada: la tarjeta muestra los valores directos en cada nodo, respetando la plantilla actual y sin agregar prefijos nuevos (por ejemplo, sin `ISBN:` ni `Autores:`). Se descartó `innerHTML` por la regla RN-CAT-08 y por seguridad ante datos de `localStorage`.

### 6. Filtro puro y en vivo

`normalizarTexto(texto)` aplica `trim()` y `toLowerCase()`. `filtrarPorTitulo(libros, consulta)` es una función pura que devuelve los libros cuyo título normalizado incluye la consulta normalizada; si la consulta queda vacía, devuelve la lista completa. Decisión confirmada: filtro estándar, sin plegar acentos.

El evento `input` sobre `#buscador-titulo` vuelve a renderizar en vivo (DD-15). El `submit` del formulario se intercepta con `preventDefault()` para evitar que el navegador recargue `index.html?titulo=...` y pierda el estado. Se descartó un botón de búsqueda porque la KB pide filtrado en vivo.

### 7. Estados con el atributo `hidden`

`actualizarMensajes(libros, visibles)` decide:

- Si `libros.length === 0`: muestra `#mensaje-catalogo-vacio` y oculta `#mensaje-sin-resultados`.
- Si hay libros pero `visibles.length === 0`: oculta el mensaje de vacío y muestra el de sin resultados.
- En caso contrario: oculta ambos.

La visibilidad se controla solo con `element.hidden`, apoyándose en la regla `[hidden] { display: none }` ya presente en `css/estilos.css`. No se agregan clases, estilos ni cambios de copy.

### 8. Cambio mínimo en `index.html`

Se agregan únicamente las cuatro etiquetas `<script defer>` antes de `</body>`, en el orden indicado. No se modifica `css/estilos.css` ni ninguna otra vista, y no se toca la estructura de la plantilla, los IDs ni los mensajes existentes.

### 9. Verificación sin herramientas del proyecto

No se agregan tests ni dependencias (DD-06). La verificación combina:

- `node --check` sobre cada archivo JS, solo como chequeo de sintaxis con el Node disponible en el entorno; no es una dependencia de la entrega.
- Revisión estática de que no existan `innerHTML`, `fetch`, `import`, `export` ni `type="module"`.
- Cinco casos manuales en el navegador: búsqueda parcial en mayúsculas, búsqueda vacía, texto inexistente, `lib-6` sin género mostrando «Sin clasificar» y catálogo poblado desde el seed sin hardcodeo.

## Risks / Trade-offs

- [El formato de `Intl` puede incluir un espacio no separable entre `$` y el número] → Se valida visualmente el resultado `$ 12.500,00`; el formato se delega a `Intl` y no se compara la cadena carácter por carácter.
- [`localStorage` bloqueado o con cuota agotada] → Lectura y escritura con `try/catch`; el catálogo funciona con el seed en memoria y se advierte por consola. El mensaje visible al usuario llega en C-06.
- [El seed perezoso puede volver a sembrar una colección que el usuario borró a mano] → Comportamiento transitorio aceptado en C-03; C-06 implementa `tuco:esquema` y la regla de colección faltante vacía.
- [Dos pestañas abiertas pisan datos] → Limitación conocida de `localStorage` sin backend (SU-05); se documentará en el README de C-06.
- [La búsqueda no encuentra variantes con acentos] → Decisión explícita: se usa `toLowerCase` sin plegado diacrítico; el alcance no lo exige.
- [Re-render en cada tecla] → Volumen de datos pequeño (6 libros), sin impacto perceptible.

## Migration Plan

1. Crear los cuatro archivos JS en orden de dependencia.
2. Agregar las cuatro etiquetas `<script defer>` a `index.html`.
3. Abrir `index.html` con doble clic y ejecutar los casos manuales.
4. Rollback: quitar las cuatro etiquetas y eliminar los archivos nuevos; las claves `tuco:*` creadas pueden borrarse desde las herramientas del navegador.

## Open Questions

Ninguna pendiente: las tres decisiones de producto (persistencia real con fallback, filtro estándar sin acentos y copy de tarjeta sin prefijos) fueron confirmadas antes de escribir este diseño.
