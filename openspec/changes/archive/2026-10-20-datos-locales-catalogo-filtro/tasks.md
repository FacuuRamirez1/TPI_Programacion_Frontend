# Tasks

## 1. Datos iniciales

- [x] 1.1 Crear `js/datos-iniciales.js` con el patrón IIFE y `'use strict'`, publicando `TUCO.datosIniciales` con las colecciones `editoriales`, `generos`, `autores`, `libros` y `clientes`; verificar que el archivo solo contenga datos y pase `node --check js/datos-iniciales.js`.
- [x] 1.2 Cargar el seed exacto de `knowledge-base/04_modelo_de_datos.md`: 2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes con IDs `edi-N`, `gen-N`, `aut-N`, `lib-N` y `cli-N`; verificar por inspección que los conteos y los IDs coincidan con la tabla de la KB.
- [x] 1.3 Verificar las relaciones del seed: cada `editorialId` y cada `autorIds` existen, `lib-6` tiene `generoId: null` y ningún libro usa un género ficticio; confirmar recorriendo los arrays en el archivo y pasando `node --check` nuevamente.

## 2. Adaptador de almacenamiento

- [x] 2.1 Crear `js/almacenamiento.js` con IIFE y las constantes de claves `tuco:editoriales`, `tuco:generos`, `tuco:autores`, `tuco:libros`, `tuco:clientes`, `tuco:ventas` y `tuco:esquema`; verificar que no haya literales de clave fuera de este archivo y que pase `node --check js/almacenamiento.js`.
- [x] 2.2 Implementar `leerColeccion(nombre)` con `try/catch`, parseo del JSON y copia profunda del seed mediante `JSON.parse(JSON.stringify(...))` cuando la clave falta o el JSON es inválido; verificar que, tras borrar `tuco:libros` en el navegador, el catálogo siga mostrando los 6 libros y que la clave vuelva a existir.
- [x] 2.3 Implementar `escribirColeccion(nombre, coleccion)` con `try/catch` y `console.warn` ante fallas, serializando la colección completa; verificar que una escritura desde la consola reemplace el contenido de la clave y que el fallback al seed no deje la colección vacía.
- [x] 2.4 Implementar `siguienteId(prefijo, coleccion)` calculando el mayor sufijo numérico más uno, y `obtenerPorId(nombre, id)`; verificar desde la consola que `siguienteId('lib', libros)` devuelve `lib-7` con el seed y que `obtenerPorId('libros', 'lib-1')` devuelve el libro correcto.

## 3. Formato

- [x] 3.1 Crear `js/formato.js` con IIFE y `formatearMoneda(valor)` usando una única instancia de `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })`; verificar desde la consola que `TUCO.formato.formatearMoneda(12500)` produce `$ 12.500,00` y que `node --check js/formato.js` pasa.
- [x] 3.2 Implementar `formatearFecha(iso)` para devolver `dd/mm/aaaa` a partir de la parte de fecha del ISO; verificar desde la consola que `TUCO.formato.formatearFecha('2026-10-20T12:00:00.000Z')` devuelve `20/10/2026` sin desplazamiento por zona horaria.

## 4. Catálogo, filtro y estados

- [x] 4.1 Crear `js/catalogo.js` con IIFE, `inicializar`, `construirIndices` y las referencias a `#buscador-titulo`, `#listado-catalogo`, `#mensaje-catalogo-vacio`, `#mensaje-sin-resultados` y `#plantilla-tarjeta-libro`; verificar que `node --check js/catalogo.js` pase y que la consola no registre errores al abrir `index.html`.
- [x] 4.2 Implementar `normalizarTexto(texto)` con `trim` y `toLowerCase` y `filtrarPorTitulo(libros, consulta)` como función pura expuesta en `TUCO.catalogo`; verificar desde la consola que `TUCO.catalogo.filtrarPorTitulo(libros, '  MEMORIA ')` devuelve solo «La memoria del agua» y que una consulta vacía devuelve los 6 libros.
- [x] 4.3 Implementar `crearTarjeta(libro)` clonando la plantilla con `content.cloneNode(true)` y asignando `.tarjeta-titulo`, `.tarjeta-isbn`, `.tarjeta-editorial`, `.tarjeta-genero`, `.tarjeta-autores` y `.tarjeta-precio` con `textContent`; verificar que `lib-6` muestre «Sin clasificar» y que `lib-3` muestre «Elena Marchetti, Lucía Benítez».
- [x] 4.4 Implementar `renderizar` acumulando las tarjetas en un `DocumentFragment` e insertándolas con `listado.replaceChildren(fragmento)`; verificar en el navegador que las 6 tarjetas se generen desde el seed y que el HTML de `index.html` no contenga títulos hardcodeados.
- [x] 4.5 Implementar `actualizarMensajes` alternando `#mensaje-catalogo-vacio` y `#mensaje-sin-resultados` solo con el atributo `hidden`; verificar que una búsqueda inexistente muestre el mensaje de sin resultados y que una búsqueda vacía lo oculte.
- [x] 4.6 Registrar el evento `input` en `#buscador-titulo` para re-renderizar en vivo y el `submit` del formulario con `preventDefault()`; verificar que al presionar Enter no se recargue la página ni aparezca `?titulo=` en la barra de direcciones.

## 5. Carga de scripts en la vista

- [x] 5.1 Agregar en `index.html`, inmediatamente antes de `</body>`, exactamente estas cuatro líneas en orden: `js/datos-iniciales.js`, `js/almacenamiento.js`, `js/formato.js` y `js/catalogo.js`, todas con `defer`; verificar que la vista siga abriendo con doble clic y que el catálogo se renderice.
- [x] 5.2 Confirmar que no se modificaron `css/estilos.css`, las demás vistas HTML, la plantilla de tarjeta, los IDs ni los textos de los mensajes; verificar con `git diff --stat` que solo aparezcan `index.html` y los archivos nuevos de `js/`.

## 6. Verificación de integración y casos manuales

- [x] 6.1 Ejecutar `node --check` sobre los cuatro archivos (`js/datos-iniciales.js`, `js/almacenamiento.js`, `js/formato.js`, `js/catalogo.js`) y confirmar que los cuatro terminan sin errores de sintaxis.
- [x] 6.2 Revisar los archivos JS y `index.html` para confirmar que no existan `innerHTML`, `fetch`, XHR, `import`, `export`, `type="module"`, frameworks, CDNs ni URLs externas.
- [x] 6.3 Ejecutar el caso manual «búsqueda parcial en mayúsculas»: escribir `MEMORIA` en el buscador y verificar que queda visible «La memoria del agua» y que las demás tarjetas se filtran.
- [x] 6.4 Ejecutar el caso manual «búsqueda vacía»: borrar el contenido del buscador y verificar que se muestran los 6 libros del seed y que el mensaje de sin resultados queda oculto.
- [x] 6.5 Ejecutar el caso manual «texto inexistente»: escribir `zzz` y verificar que no hay tarjetas y que aparece el mensaje de búsqueda sin resultados, distinto del mensaje de catálogo vacío.
- [x] 6.6 Ejecutar el caso manual «libro sin género»: localizar la tarjeta de `lib-6` y verificar que el campo de género muestre «Sin clasificar».
- [x] 6.7 Ejecutar el caso manual «catálogo poblado desde el seed sin hardcodeo»: abrir `index.html` con `localStorage` vacío, verificar que aparezcan los 6 libros y que el HTML entregado no contenga títulos del seed escritos a mano.
- [x] 6.8 Confirmar que no se crearon archivos de test, no se agregó `package.json` ni dependencias, y que la entrega sigue funcionando sin npm, sin servidor y sin conexión.

## Workflow follow-up

- Archivar el change con `/opsx:archive datos-locales-catalogo-filtro` después de que la implementación y los casos manuales estén verificados.
- Marcar `[C-03]` en `CHANGES.md` como completado al cerrar el change.
