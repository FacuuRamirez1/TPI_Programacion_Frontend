# Tasks

## 1. Recursos y bloque canónico

- [x] 1.1 Crear `assets/portadas/portada-placeholder.svg` (proporción 2:3, autoría propia, texto «TU-CO / Portada no disponible») y verificar que abre localmente con doble clic sin recursos externos.
- [x] 1.2 Fijar el bloque canónico de `header` con el nombre de la librería, `nav` de cinco enlaces, enlace «Saltar al contenido», `main id="contenido" tabindex="-1"` y `footer` opcional; verificar que el HTML del bloque es idéntico en las seis páginas.
- [x] 1.3 Confirmar que C-01 no crea `css/` ni `js/` y que ningún HTML referencia archivos de esas carpetas; verificar con búsqueda de `css/`, `js/`, `<style>` y `<script>`.

## 2. Catálogo (`index.html`)

- [x] 2.1 Crear `index.html` con `<!DOCTYPE html>`, `lang="es"`, `charset`, `viewport`, `title`, `header`, `nav` con `aria-current="page"` en «Catálogo», `main` y `h1` «Catálogo»; verificar que abre en el navegador y muestra el título correcto.
- [x] 2.2 Agregar el buscador por título con `label for="buscador-titulo"` y el contenedor vacío `#listado-catalogo`; verificar que la etiqueta enfoca el campo al hacer clic.
- [x] 2.3 Agregar `#mensaje-catalogo-vacio` visible con `role="status"` y `#mensaje-sin-resultados` oculto con `hidden` y `aria-live="polite"`; verificar que solo el mensaje de lista vacía es visible.
- [x] 2.4 Definir `#plantilla-tarjeta-libro` con portada (`img` + `alt`), título, ISBN, editorial, género, autores y precio; verificar que la plantilla no se renderiza y que contiene los siete datos requeridos.
- [x] 2.5 Verificar con teclado el recorrido salto → navegación → buscador y que el mensaje de lista vacía es legible; registrar el resultado observado.

## 3. Libros (`libros.html`)

- [x] 3.1 Crear `libros.html` con metadatos, bloque canónico y `aria-current="page"` en «Libros»; verificar que la navegación conserva el mismo orden que `index.html`.
- [x] 3.2 Maquetar `#form-libro` con `#titulo`, `#isbn`, `#precio`, `#editorialId`, `#generoId`, `#autorIds` y botón «Registrar libro»; cada control con `label for` y el `select` de género con la opción «Sin clasificar» (`value=""`); verificar la asociación etiqueta-control con clic y Tab.
- [x] 3.3 Agregar la ayuda de `#autorIds` con `aria-describedby` y agrupar el selector múltiple con `fieldset`/`legend`; verificar que el texto de ayuda se anuncia junto al control.
- [x] 3.4 Agregar `#tabla-libros` con `caption` y `th scope="col"`, el mensaje `#mensaje-libros-vacio` y el contenedor `#mensaje-libro`; verificar que la tabla vacía conserva encabezados y muestra el mensaje.
- [x] 3.5 Definir `#plantilla-fila-libro` con celdas para título, ISBN, editorial, género, autores y precio; verificar que la plantilla es inerte y que la tabla sigue vacía.
- [x] 3.6 Verificar el recorrido por teclado del formulario y de la tabla; registrar el resultado observado.

## 4. Clientes (`clientes.html`)

- [x] 4.1 Crear `clientes.html` con metadatos, bloque canónico y `aria-current="page"` en «Clientes»; verificar la navegación entre esta vista y las anteriores.
- [x] 4.2 Maquetar `#form-cliente` con `#nombreCompleto`, `#email` y botón «Registrar cliente»; cada control con `label for`; verificar la asociación etiqueta-control.
- [x] 4.3 Agregar `#tabla-clientes` con `caption` y `th scope="col"`, `#mensaje-clientes-vacio` y `#mensaje-cliente`; verificar que la tabla vacía conserva encabezados y muestra el mensaje.
- [x] 4.4 Verificar con teclado el formulario y la tabla; registrar el resultado observado.

## 5. Ventas (`ventas.html`)

- [x] 5.1 Crear `ventas.html` con metadatos, bloque canónico y `aria-current="page"` en «Ventas»; verificar la navegación entre esta vista y las anteriores.
- [x] 5.2 Maquetar `#form-venta` con `#clienteId`, `#libroId`, `#cantidad`, botón «Agregar renglón», botón «Confirmar venta» y sus `label for`; verificar que ambos selectores tienen una opción inicial no seleccionable y que cantidad es numérica.
- [x] 5.3 Agregar `#tabla-renglones` con `caption` y columnas de libro, cantidad, precio unitario y subtotal, `#total-venta` con valor neutro `0`, `#mensaje-venta` con `role="status"` y un mensaje de venta sin renglones; verificar que el total y el mensaje son visibles.
- [x] 5.4 Definir `#plantilla-fila-renglon` con celdas y control de quitar renglón; verificar que la plantilla es inerte y que la tabla sigue vacía.
- [x] 5.5 Verificar con teclado el recorrido cliente → libro → cantidad → agregar → confirmar y que el foco no queda atrapado; registrar el resultado observado.

## 6. Historial y detalle

- [x] 6.1 Crear `historial.html` con metadatos, bloque canónico y `aria-current="page"` en «Historial»; agregar `#tabla-ventas` con columnas identificador, fecha, cliente, total y detalle, `#mensaje-historial-vacio` y `#plantilla-fila-venta` con enlace «Ver detalle» a `venta-detalle.html?id=ven-N`; verificar que la tabla vacía conserva encabezados y mensaje.
- [x] 6.2 Crear `venta-detalle.html` con metadatos, bloque canónico sin `aria-current`, `h1`, `#detalle-venta`, `#mensaje-detalle` visible para el caso inexistente y enlace «Volver al historial»; verificar que el enlace regresa a `historial.html`.
- [x] 6.3 Verificar la navegación historial → detalle → historial y que la vista de detalle no marca ningún enlace principal como actual; registrar el resultado observado.

## 7. Verificación integrada de C-01

- [x] 7.1 Abrir las seis páginas con doble clic (`file://`) y verificar que cargan sin errores de consola ni peticiones de red; registrar el resultado observado.
- [x] 7.2 Recorrer los cinco enlaces del `nav` desde cada página y verificar que `aria-current="page"` cambia al enlace correcto y que el orden y las etiquetas son idénticos en las seis vistas.
- [x] 7.3 Verificar con Tab el enlace de salto, la navegación, los formularios, las tablas y los botones en cada página; confirmar que el foco es visible y que no hay trampas.
- [x] 7.4 Revisar que toda tabla tiene `caption` y `th scope="col"`, todo control tiene etiqueta asociada y toda imagen informativa tiene `alt`; registrar los hallazgos.
- [x] 7.5 Verificar que no hay `innerHTML`, `import`/`export`, `type="module"`, `fetch`, `outline: none`, `<style>` ni recursos externos en los archivos de C-01.
- [x] 7.6 Verificar que ningún HTML contiene libros, clientes o ventas reales del seed y que los contenedores de datos están vacíos o en plantillas inertes.
- [x] 7.7 Registrar los resultados observados de los casos manuales de C-01 para volcarlos en el `README.md` durante C-06, sin declarar aprobado ningún caso no ejecutado.

## Nota de verificación del apply

- Verificación ejecutada con Edge headless 155 sobre `file://` mediante CDP, sin instalar dependencias ni agregar archivos al repositorio: **505 comprobaciones, 0 fallos**.
- Cubiertos: carga de las seis vistas y del SVG, navegación de los cinco enlaces desde cada vista, `aria-current`, orden de tabulación completo, foco visible (`:focus-visible` y contorno calculado distinto de `none`), asociación etiqueta-control por clic, tablas, mensajes, plantillas inertes, ausencia de errores de consola y de peticiones externas.
- La única aparición de `http://` es el namespace obligatorio `xmlns="http://www.w3.org/2000/svg"` del SVG; no genera petición de red (el registro de red solo contiene los `file://` locales).
- El volcado de estos resultados al `README.md` corresponde a C-06.
