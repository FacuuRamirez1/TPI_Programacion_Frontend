# presentacion-adaptable Specification

## Purpose
Define la capa de presentación de las seis vistas de la Librería TU-CO: identidad visual con tokens, componentes reutilizables, layout adaptable a 320 px y 1280 px, tablas con desplazamiento propio y estados accesibles que no dependan del color.

## Requirements

### Requirement: Hoja de estilos local y sin dependencias

El sistema SHALL cargar todos los estilos de presentación desde `css/estilos.css`, enlazado con `<link rel="stylesheet">` en las seis vistas. La hoja MUST NOT usar `@import`, fuentes remotas, CDNs, frameworks, librerías, preprocesadores ni peticiones de red, y MUST aplicarse al abrir `index.html` con doble clic mediante `file://`.

#### Scenario: Carga local de la hoja

- **WHEN** se abre cualquiera de las seis vistas con doble clic
- **THEN** la hoja `css/estilos.css` se carga localmente y la página no realiza peticiones de red

#### Scenario: Sin recursos de estilo externos

- **WHEN** se inspecciona `css/estilos.css` y los seis documentos HTML
- **THEN** no existe `@import`, ni `@font-face` con origen remoto, ni referencias a CDNs o frameworks

### Requirement: Sistema de tokens de presentación

El sistema SHALL definir variables CSS en `:root` para color, tipografía, espaciado, radios, sombras y foco. Las reglas de los componentes MUST consumir esas variables en lugar de repetir valores literales de color, espaciado o tipografía.

#### Scenario: Ajuste global desde un token

- **WHEN** se modifica un token de color o de espaciado en `:root`
- **THEN** todas las vistas y componentes que lo consumen reflejan el cambio sin editar reglas individuales

#### Scenario: Tokens declarados una sola vez

- **WHEN** se revisan las declaraciones de variables
- **THEN** los tokens se declaran en un único bloque `:root` y no se redefinen por página

### Requirement: Componentes reutilizables

Las seis vistas SHALL compartir los componentes `.tarjeta`, `.formulario`, `.campo`, `.boton`, `.tabla`, `.mensaje` y `.badge`. Cada componente MUST conservar la misma apariencia base en todas las vistas y MUST admitir modificadores para sus variantes de jerarquía o estado.

#### Scenario: Coherencia de componentes entre vistas

- **WHEN** se comparan los botones, campos, tablas y mensajes de las seis vistas
- **THEN** cada tipo de componente conserva tipografía, espaciado, radio y comportamiento visual equivalentes

#### Scenario: Variantes de componente

- **WHEN** un componente recibe un modificador de variante, como botón primario, secundario o de peligro, o mensaje de éxito o error
- **THEN** la variante cambia su presentación sin alterar la estructura ni el etiquetado accesible del componente

### Requirement: Layout con Flexbox y Grid

La interfaz SHALL organizar `header`, `nav`, `main` y `footer` con Flexbox o Grid. El catálogo SHALL distribuir las tarjetas en una grilla que pase de una columna en pantallas angostas a varias columnas en escritorio. Los formularios SHALL usar una columna en móvil y dos columnas en escritorio, con los campos de grupo y las acciones ocupando el ancho completo cuando corresponda. El contenido MUST respetar un ancho máximo y márgenes laterales sin desbordar la ventana.

#### Scenario: Grilla del catálogo

- **WHEN** se abre `index.html` en escritorio con varias tarjetas renderizadas
- **THEN** las tarjetas se distribuyen en varias columnas de ancho uniforme dentro del ancho máximo de contenido

#### Scenario: Formularios de una y dos columnas

- **WHEN** se abre un formulario a 320 px y luego a 1280 px
- **THEN** a 320 px los campos se apilan en una columna y a 1280 px se distribuyen en dos columnas, sin que el grupo de autores, las tablas ni las acciones queden comprimidos

#### Scenario: Cabecera, navegación y contenido alineados

- **WHEN** se comparan las seis vistas
- **THEN** la marca, la navegación, el contenido principal y el pie comparten el mismo ancho máximo y la misma alineación

### Requirement: Adaptabilidad a 320 px y 1280 px

La interfaz SHALL ser usable a 320 px y 1280 px de ancho. La página MUST NOT presentar desplazamiento horizontal global en ninguno de esos anchos. La tipografía y los controles MUST conservar legibilidad y un área interactiva mínima de 24 × 24 px CSS, con objetivo de 44 × 44 px para botones y enlaces de navegación.

#### Scenario: 320 px sin desplazamiento horizontal de página

- **WHEN** se abre cualquier vista con un ancho de ventana de 320 px
- **THEN** el ancho de desplazamiento del documento no supera el ancho visible y todo el contenido principal es alcanzable

#### Scenario: 1280 px con distribución de escritorio

- **WHEN** se abre cualquier vista con un ancho de ventana de 1280 px
- **THEN** el contenido se distribuye en el ancho máximo previsto, sin estirarse más allá de él ni quedar pegado a los bordes

#### Scenario: Textos y controles legibles en ambos anchos

- **WHEN** se comparan las vistas a 320 px y 1280 px
- **THEN** el cuerpo de texto conserva al menos 16 px, los controles mantienen su altura táctil y ninguna etiqueta queda truncada ni superpuesta

### Requirement: Tablas con desplazamiento propio

Las tablas SHALL conservar un ancho mínimo legible y desplazarse horizontalmente dentro de su contenedor. El contenedor de tabla MUST limitar su ancho al 100% disponible, MUST ser enfocable por teclado y MUST exponer un nombre accesible cuando su contenido requiera desplazamiento. La página MUST NOT desplazarse horizontalmente como consecuencia de una tabla ancha.

#### Scenario: Tabla ancha en pantalla angosta

- **WHEN** se abre una vista con una tabla de seis columnas a 320 px
- **THEN** la tabla se desplaza dentro de su contenedor y la página conserva su ancho sin desplazamiento horizontal global

#### Scenario: Acceso por teclado al contenedor desplazable

- **WHEN** el recorrido con Tab alcanza un contenedor de tabla desplazable
- **THEN** el contenedor muestra foco visible, anuncia su propósito y permite desplazar su contenido con el teclado

#### Scenario: Sin desplazamiento horizontal global

- **WHEN** se recorren las seis vistas a 320 px y a 1280 px
- **THEN** `html` y `body` nunca generan una barra de desplazamiento horizontal

### Requirement: Foco visible y recorrido por teclado

Todo elemento interactivo SHALL mostrar un indicador de foco visible mediante `:focus-visible`, con un grosor mínimo de 2 px, una separación mínima de 2 px y un contraste mínimo de 3:1 respecto de los colores adyacentes. No se SHALL aplicar `outline: none` ni eliminar el foco sin un reemplazo visible. El enlace «Saltar al contenido» MUST permanecer visualmente oculto hasta recibir foco y MUST mostrarse completo cuando se enfoca.

#### Scenario: Foco visible con teclado

- **WHEN** se recorre una vista con la tecla Tab
- **THEN** cada enlace, control, botón y contenedor desplazable enfocado muestra un indicador visible y distinguible

#### Scenario: Sin foco anulado

- **WHEN** se inspeccionan las reglas de estilo
- **THEN** no existe `outline: none` ni `outline: 0` sin una regla de reemplazo visible para el mismo selector

#### Scenario: Enlace de salto visible al enfocarse

- **WHEN** se presiona Tab en la primera posición de cualquier vista
- **THEN** el enlace «Saltar al contenido» se hace visible, conserva contraste suficiente y al activarse mueve el foco al contenido principal

### Requirement: Indicación visual de la página actual

El enlace de navegación que expone `aria-current="page"` SHALL tener una presentación distinguible que no dependa únicamente del color, combinando al menos dos señales visuales, como peso tipográfico, borde inferior, fondo o subrayado.

#### Scenario: Página actual identificable sin color

- **WHEN** se abre `libros.html` y se observa la navegación en escala de grises
- **THEN** el enlace «Libros» se distingue de los demás por señales distintas del tono, y los otros enlaces no adoptan ese tratamiento

### Requirement: Estados visuales con texto

Las vistas SHALL presentar estados de vacío, sin resultados, éxito y error con un mensaje de texto visible. Ningún estado MUST depender únicamente del color. Los errores SHALL incluir el prefijo textual «Error:», peso tipográfico diferenciado y un borde de mayor grosor; los campos inválidos SHALL combinar `aria-invalid="true"` con un mensaje asociado. El estado de carga no aplica porque la aplicación no realiza peticiones de red.

#### Scenario: Lista vacía

- **WHEN** una vista no tiene datos para listar
- **THEN** se muestra un mensaje de vacío con texto y un tratamiento visual neutro, sin aparentar un error

#### Scenario: Búsqueda sin resultados

- **WHEN** el catálogo no tiene coincidencias para el título buscado
- **THEN** se muestra un mensaje específico de «sin resultados», visualmente distinguible del mensaje de catálogo vacío

#### Scenario: Error legible sin distinguir color

- **WHEN** una vista presenta un estado de error, incluido el detalle de una venta inexistente
- **THEN** el mensaje contiene el prefijo «Error:», un borde más grueso y peso tipográfico diferenciado, y sigue siendo comprensible en escala de grises

#### Scenario: Éxito legible sin distinguir color

- **WHEN** una operación futura informa un resultado exitoso mediante el componente de mensaje
- **THEN** el mensaje incluye el prefijo «Listo:» y una forma visual distinta de la del error, comprensible sin percibir el color

#### Scenario: Campo inválido asociado a su mensaje

- **WHEN** un control expone `aria-invalid="true"`
- **THEN** su borde aumenta de grosor y existe un mensaje de error con texto asociado al campo

### Requirement: Utilidad de texto visualmente oculto

El sistema SHALL ofrecer la clase `.visualmente-oculto` para texto disponible a lectores de pantalla pero no visible en pantalla. La utilidad MUST NOT usar `display: none`, `visibility: hidden` ni `hidden`, y MUST mantener el texto enfocable cuando se aplique a un control interactivo.

#### Scenario: Texto solo para lectores de pantalla

- **WHEN** un lector de pantalla recorre el enlace «Ver detalle» de una fila del historial
- **THEN** anuncia el texto adicional que aporta contexto sin que ese texto aparezca visualmente

#### Scenario: Texto oculto sin desaparecer del árbol de accesibilidad

- **WHEN** se inspeccionan los estilos calculados de un elemento con `.visualmente-oculto`
- **THEN** el elemento conserva dimensiones mínimas y recorte accesible, sin `display: none` ni `visibility: hidden`

### Requirement: Contraste y legibilidad tipográfica

Los textos SHALL cumplir un contraste mínimo de 4.5:1 para texto normal y 3:1 para texto grande y componentes de interfaz. La tipografía base MUST ser de al menos 16 px, con una altura de línea de al menos 1.5 y un ancho de línea máximo de 80 caracteres en bloques de prosa.

#### Scenario: Contraste de texto y controles

- **WHEN** se contrastan los colores de texto, bordes de control y foco contra sus fondos
- **THEN** todos alcanzan el mínimo exigido para su tamaño y función

#### Scenario: Legibilidad de párrafos

- **WHEN** se revisan los mensajes y textos descriptivos en escritorio
- **THEN** los bloques de prosa no superan los 80 caracteres por línea y conservan interlineado de al menos 1.5

### Requirement: Imágenes adaptables

Las portadas SHALL escalar dentro de su tarjeta sin desbordar el contenedor, conservando la proporción 2:3 y el texto alternativo definido en la estructura. Las imágenes MUST declarar dimensiones intrínsecas para evitar saltos de layout, y su procedencia MUST seguir documentándose como pregunta abierta hasta el cierre del proyecto.

#### Scenario: Portada en tarjeta angosta

- **WHEN** se muestra una tarjeta del catálogo a 320 px
- **THEN** la portada ocupa el ancho disponible sin deformarse ni generar desplazamiento horizontal

#### Scenario: Texto alternativo conservado

- **WHEN** se inspecciona una imagen informativa de portada
- **THEN** conserva su atributo `alt` y sus dimensiones, y no se agregaron recursos de imagen externos

### Requirement: Movimiento reducido

Las transiciones y animaciones decorativas SHALL respetar la preferencia `prefers-reduced-motion`. Cuando la persona solicite movimiento reducido, las transiciones MUST quedar desactivadas o reducirse a un cambio inmediato sin desplazamiento.

#### Scenario: Preferencia de movimiento reducido

- **WHEN** el sistema operativo o el navegador declara `prefers-reduced-motion: reduce`
- **THEN** los cambios de estado y de foco se aplican sin animación ni desplazamiento

### Requirement: Presentación sin lógica de datos

La capa de presentación MUST NOT agregar ni modificar lógica de datos, render, validación o persistencia. Este change MUST NOT crear archivos de `js/`, MUST NOT incorporar datos del seed en el HTML y MUST NOT alterar el contenido de las plantillas inertes más allá de las clases de presentación.

#### Scenario: Sin lógica incorporada

- **WHEN** se inspeccionan los archivos modificados por este change
- **THEN** no hay archivos nuevos en `js/`, no se referencia JavaScript nuevo y ninguna vista contiene libros, clientes o ventas reales

#### Scenario: Plantillas inertes preservadas

- **WHEN** se revisan las plantillas de tarjeta y de filas
- **THEN** siguen siendo inertes, conservan su estructura y solo reciben clases o texto accesible de presentación
