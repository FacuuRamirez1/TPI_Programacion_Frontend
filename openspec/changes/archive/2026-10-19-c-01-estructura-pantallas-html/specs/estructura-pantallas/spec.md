# Spec Delta

## Purpose

Define la estructura semántica, navegable y accesible de las seis pantallas de la Librería TU-CO, de modo que el resto de los ejercicios puedan incorporar estilos, datos y comportamiento sobre una base HTML estable.

## ADDED Requirements

### Requirement: Vistas y navegación común

El sistema SHALL ofrecer las vistas `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` y `venta-detalle.html`. Todas SHALL compartir un `header` con el nombre de la librería y un `nav` con exactamente los cinco enlaces principales: Catálogo, Libros, Clientes, Ventas e Historial. El enlace correspondiente a la vista actual SHALL llevar `aria-current="page"`.

#### Scenario: Navegación entre las vistas principales
- **WHEN** una persona activa cualquiera de los cinco enlaces de la navegación
- **THEN** el navegador abre la vista correspondiente y la navegación vuelve a estar disponible con el mismo orden y etiquetas

#### Scenario: Indicación de la página actual
- **WHEN** se abre `libros.html`
- **THEN** el enlace «Libros» del `nav` expone `aria-current="page"` y los demás enlaces no lo exponen

#### Scenario: Vista de detalle fuera de la navegación principal
- **WHEN** se abre `venta-detalle.html?id=ven-N`
- **THEN** la página muestra su título propio y un enlace visible para volver al historial, sin marcar un enlace del `nav` como página actual

### Requirement: Estructura semántica de cada página

Cada vista SHALL declarar `<!DOCTYPE html>`, `<html lang="es">`, `<meta charset="UTF-8">`, `<meta name="viewport">` y un `<title>` descriptivo. El contenido SHALL organizarse con `header`, `nav`, `main` con `id="contenido"`, secciones con encabezados jerárquicos y un `footer` opcional. Cada página SHALL incluir un enlace «Saltar al contenido» como primer elemento enfocable, apuntando a `#contenido`.

#### Scenario: Documento válido y contenido principal identificable
- **WHEN** se inspecciona cualquier vista
- **THEN** existe un único `main` con `id="contenido"`, un `h1` que identifica la vista y el enlace de salto precede a la navegación

#### Scenario: Salto al contenido con teclado
- **WHEN** una persona presiona Tab en la primera posición de la página y activa el enlace «Saltar al contenido»
- **THEN** el foco se desplaza al contenido principal sin recorrer toda la navegación

### Requirement: Catálogo con buscador y estados

`index.html` SHALL incluir un buscador por título con su etiqueta asociada, un contenedor para el listado de libros, un mensaje visible de lista vacía y un mensaje de «sin resultados» preparado para mostrarse cuando corresponda. La anatomía de cada tarjeta SHALL contemplar título, ISBN, editorial, género, autores, precio e imagen de portada.

#### Scenario: Catálogo sin datos
- **WHEN** se abre `index.html` sin libros cargados
- **THEN** se muestra el mensaje de lista vacía y el contenedor del listado permanece sin tarjetas

#### Scenario: Búsqueda sin coincidencias
- **WHEN** el contenedor de mensajes de búsqueda está visible
- **THEN** el texto explica que no se encontraron libros para el título buscado, sin dejar el listado vacío sin explicación

#### Scenario: Anatomía completa de la tarjeta
- **WHEN** se revisa la estructura de tarjeta definida para el catálogo
- **THEN** incluye nodos para título, ISBN, editorial, género, autores, precio y portada con texto alternativo

### Requirement: Vista de libros

`libros.html` SHALL incluir un formulario de alta con los controles `titulo`, `isbn`, `precio`, `editorialId` (`select`), `generoId` (`select` con la opción «Sin clasificar»), `autorIds` (`select multiple`) y un botón «Registrar libro». También SHALL incluir una tabla de libros con encabezados y un mensaje de lista vacía.

#### Scenario: Controles del formulario de libros
- **WHEN** se recorre el formulario de `libros.html`
- **THEN** cada control tiene una etiqueta asociada y el selector de género ofrece «Sin clasificar» como opción inicial

#### Scenario: Listado de libros vacío
- **WHEN** se abre `libros.html` sin libros
- **THEN** la tabla muestra sus encabezados y el mensaje de lista vacía es visible

### Requirement: Vista de clientes

`clientes.html` SHALL incluir un formulario de alta con los controles `nombreCompleto` y `email`, y un botón «Registrar cliente». También SHALL incluir una tabla de clientes con encabezados y un mensaje de lista vacía.

#### Scenario: Controles del formulario de clientes
- **WHEN** se recorre el formulario de `clientes.html`
- **THEN** los campos de nombre completo y email tienen etiquetas asociadas y el botón describe su acción

#### Scenario: Listado de clientes vacío
- **WHEN** se abre `clientes.html` sin clientes
- **THEN** la tabla muestra sus encabezados y el mensaje de lista vacía es visible

### Requirement: Composición de venta

`ventas.html` SHALL incluir un `select` de cliente, un `select` de libro, un `input` de cantidad, un botón «Agregar renglón», una tabla de renglones, un total y un botón «Confirmar venta». SHALL incluir contenedores de mensajes para resultados y errores.

#### Scenario: Controles de composición
- **WHEN** se abre `ventas.html`
- **THEN** cliente, libro y cantidad tienen etiquetas asociadas y los botones «Agregar renglón» y «Confirmar venta» son identificables

#### Scenario: Venta sin renglones
- **WHEN** la tabla de renglones está vacía
- **THEN** se muestra un mensaje que indica que todavía no se agregaron renglones y el total se presenta como cero

### Requirement: Historial de ventas

`historial.html` SHALL incluir una tabla con las columnas identificador, fecha, cliente y total, una columna o celda con el enlace «Ver detalle» por venta y un mensaje de historial vacío.

#### Scenario: Historial sin ventas
- **WHEN** se abre `historial.html` sin ventas confirmadas
- **THEN** la tabla conserva sus encabezados y el mensaje de historial vacío es visible

#### Scenario: Acceso al detalle
- **WHEN** existe una fila de venta en el historial
- **THEN** la fila ofrece un enlace «Ver detalle» que apunta a `venta-detalle.html?id=ven-N`

### Requirement: Detalle de venta

`venta-detalle.html` SHALL incluir un contenedor para el detalle de la venta, un mensaje para el caso de venta inexistente y un enlace visible de vuelta al historial.

#### Scenario: Venta inexistente
- **WHEN** se abre el detalle sin un identificador válido o con un identificador que no existe
- **THEN** se muestra el mensaje de venta inexistente y el enlace de vuelta al historial sigue disponible

### Requirement: Portadas locales con texto alternativo

El proyecto SHALL incluir la carpeta `assets/portadas/` con al menos un placeholder local de portada. Las imágenes informativas SHALL tener un atributo `alt` descriptivo y las decorativas SHALL usar `alt=""`.

#### Scenario: Placeholder disponible sin red
- **WHEN** se abre una vista que referencia una portada
- **THEN** la imagen se carga desde `assets/portadas/` sin peticiones externas

#### Scenario: Texto alternativo presente
- **WHEN** se inspecciona una imagen informativa de portada
- **THEN** la imagen tiene un `alt` que describe su contenido o su carácter de placeholder

### Requirement: Etiquetado y semántica de controles

Todo control de formulario SHALL tener un nombre accesible mediante `<label for>` asociado a su `id`, `aria-label` o texto visualmente oculto. Los controles SHALL ser elementos HTML nativos; no se SHALL usar un `div` clickeable ni agregar manejo manual de teclado a un `button`. Los campos relacionados SHALL agruparse con `fieldset` y `legend` cuando corresponda.

#### Scenario: Asociación etiqueta-control
- **WHEN** se activa la etiqueta de un campo de texto o de un selector
- **THEN** el foco se mueve al control asociado

#### Scenario: Selector múltiple de autores
- **WHEN** se revisa el selector de autores
- **THEN** tiene etiqueta asociada y una ayuda textual que indica cómo seleccionar más de un autor

### Requirement: Tablas accesibles

Toda tabla SHALL incluir un `caption` o un título asociado y encabezados `<th scope="col">`. Las tablas SHALL envolverse en un contenedor propio para permitir desplazamiento horizontal sin afectar a toda la página.

#### Scenario: Encabezados de columna
- **WHEN** se revisa una tabla de libros, clientes, renglones o historial
- **THEN** cada columna tiene un `<th scope="col">` con texto descriptivo

### Requirement: Mensajes y estados vacíos

Las vistas SHALL mostrar mensajes con texto para listas vacías, búsquedas sin resultados y resultados de operaciones. Los contenedores de mensajes dinámicos SHALL usar `role="status"` o `aria-live="polite"`; los errores SHALL incluir texto y no depender únicamente del color. Los mensajes no visibles SHALL ocultarse con el atributo `hidden`, no solo visualmente.

#### Scenario: Mensaje de lista vacía anunciado
- **WHEN** una lista no tiene elementos
- **THEN** el mensaje correspondiente está visible y su contenedor expone `role="status"` o `aria-live="polite"`

#### Scenario: Mensaje de resultado preparado
- **WHEN** se revisa el formulario de libros, clientes o ventas
- **THEN** existe un contenedor de mensajes listo para anunciar éxito o error con texto

### Requirement: Foco visible y recorrido por teclado

Todos los controles SHALL conservar un foco visible con los estilos nativos del navegador en esta fase. No se SHALL aplicar `outline: none` ni se SHALL eliminar el foco sin un reemplazo visible. El recorrido por teclado SHALL seguir el orden del documento y no SHALL contener trampas de foco.

#### Scenario: Recorrido completo con Tab
- **WHEN** una persona recorre una vista con la tecla Tab
- **THEN** puede alcanzar el enlace de salto, la navegación, los controles del formulario, los enlaces de las tablas y los botones, y el foco siempre resulta visible

#### Scenario: Sin estilos que anulen el foco
- **WHEN** se revisa el HTML de C-01
- **THEN** no existen estilos en línea ni atributos que eliminen el contorno de foco

### Requirement: Sin lógica de datos en esta fase

Las vistas SHALL ser una maqueta estructural: no SHALL incluir datos reales del catálogo ni del seed escritos en el HTML, no SHALL cargar scripts de datos y no SHALL persistir, calcular ni validar información. Los contenedores de datos SHALL entregarse vacíos o mediante plantillas inertes.

#### Scenario: Sin catálogo hardcodeado
- **WHEN** se inspecciona el HTML de `index.html`
- **THEN** no hay tarjetas con libros reales ni datos del seed; solo estructura y mensajes de estado

#### Scenario: Sin scripts de lógica
- **WHEN** se inspecciona cualquier vista de C-01
- **THEN** no se referencia ningún archivo de `js/` ni se ejecuta lógica de datos
