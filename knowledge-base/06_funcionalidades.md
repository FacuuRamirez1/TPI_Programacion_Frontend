# Funcionalidades

Organizadas por épica y por historia de usuario (`US-NNN`). Cada historia referencia las reglas de negocio que la gobiernan.

## Épica 1: Estructura y navegación

### US-001 — Catálogo como entrada
**Como** visitante
**Quiero** abrir `index.html` y ver el catálogo de la librería
**Para** conocer los libros disponibles sin registrarme.

**Criterios de aceptación**:
- [ ] `index.html` es la entrada y muestra título de la librería, buscador y listado.
- [ ] Cada libro muestra título, ISBN, editorial, género, autores y precio.
- [ ] Un libro sin género muestra «Sin clasificar».

**Reglas**: RN-CAT-06, RN-CAT-07, RN-UI-03.

### US-002 — Navegación entre vistas
**Como** operador
**Quiero** navegar entre catálogo, libros, clientes, ventas e historial
**Para** acceder a cada operación sin perder el contexto.

**Criterios de aceptación**:
- [ ] Todas las páginas comparten encabezado y navegación semántica.
- [ ] La página actual se indica con `aria-current="page"`.
- [ ] La navegación funciona con teclado.

**Reglas**: RN-UI-01, RN-UI-08.

### US-003 — Estados vacíos y mensajes
**Como** operador
**Quiero** ver mensajes claros cuando no hay datos o una operación falla
**Para** entender qué pasó y cómo continuar.

**Criterios de aceptación**:
- [ ] Las listas vacías muestran un mensaje.
- [ ] Las búsquedas sin resultados muestran un mensaje.
- [ ] Las operaciones correctas y rechazadas muestran un mensaje con texto.

**Reglas**: RN-CAT-05, RN-UI-04, RN-UI-05.

## Épica 2: Presentación y adaptabilidad

### US-004 — Identidad visual coherente
**Como** visitante
**Quiero** una interfaz con colores, tipografía, espaciado, tarjetas, formularios y botones coherentes
**Para** percibir la librería como un sistema único.

**Criterios de aceptación**:
- [ ] El CSS está en archivos externos y reutiliza clases.
- [ ] Flexbox o Grid organiza el contenido.
- [ ] Tipografía y espaciado son consistentes entre páginas.

**Reglas**: RN-TEC-02, RN-RES-02.

### US-005 — Adaptabilidad a 320 px y 1280 px
**Como** visitante
**Quiero** usar la interfaz en celular y en escritorio
**Para** leer y operar sin desplazamiento horizontal global.

**Criterios de aceptación**:
- [ ] A 320 px no hay scroll horizontal de la página.
- [ ] A 1280 px el contenido se distribuye correctamente.
- [ ] Las tablas anchas se desplazan dentro de su contenedor.

**Reglas**: RN-RES-01, RN-RES-02, RN-RES-03, RN-RES-04.

### US-006 — Accesibilidad básica
**Como** operador
**Quiero** navegar con teclado y percibir errores sin depender del color
**Para** usar el sistema en distintos contextos.

**Criterios de aceptación**:
- [ ] Todos los controles tienen etiqueta y foco visible.
- [ ] Los errores se expresan con texto.
- [ ] Las imágenes informativas tienen `alt`.

**Reglas**: RN-UI-01, RN-UI-05, RN-UI-06, RN-UI-07.

## Épica 3: Datos locales y catálogo

### US-007 — Modelo de datos local
**Como** desarrollador
**Quiero** representar editoriales, géneros, autores, libros y clientes con arrays y objetos con IDs estables
**Para** relacionar las entidades sin backend.

**Criterios de aceptación**:
- [ ] El seed incluye al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes.
- [ ] Cada libro referencia una editorial, uno o más autores y un género opcional existentes.
- [ ] Los IDs siguen el formato `prefijo-N`.

**Reglas**: RN-LIB-05, RN-LIB-07, RN-LIB-08.

### US-008 — Render del catálogo
**Como** visitante
**Quiero** que el catálogo se genere desde el array de libros
**Para** ver siempre los datos vigentes.

**Criterios de aceptación**:
- [ ] El catálogo se renderiza con JavaScript desde los datos locales.
- [ ] Los datos de usuario se insertan como texto.
- [ ] El render se actualiza al agregar libros.

**Reglas**: RN-CAT-07, RN-CAT-08, RN-LIB-10.

### US-009 — Filtro por título
**Como** visitante
**Quiero** buscar por una parte del título sin distinguir mayúsculas
**Para** encontrar libros rápido.

**Criterios de aceptación**:
- [ ] El filtro recorta extremos, ignora mayúsculas y acepta coincidencias parciales.
- [ ] Una búsqueda vacía muestra todo el catálogo.
- [ ] Una búsqueda sin coincidencias muestra un mensaje.

**Reglas**: RN-CAT-01, RN-CAT-02, RN-CAT-03, RN-CAT-04, RN-CAT-05.

## Épica 4: Altas

### US-010 — Alta de libros
**Como** operador
**Quiero** registrar un libro con título, ISBN, precio, editorial, género y autores
**Para** incorporarlo al catálogo.

**Criterios de aceptación**:
- [ ] Editorial y género se eligen con selectores generados desde los datos locales.
- [ ] Los autores se eligen con `<select multiple>`.
- [ ] Se validan título, ISBN único, precio, editorial, autores y género.
- [ ] El libro aparece en el listado y en el catálogo sin recargar.

**Reglas**: RN-LIB-01 a RN-LIB-10.

### US-011 — Alta de clientes
**Como** operador
**Quiero** registrar un cliente con nombre completo y email
**Para** asociarlo a ventas.

**Criterios de aceptación**:
- [ ] Se validan nombre y email no vacíos, formato de email y unicidad.
- [ ] Los errores se muestran cerca del formulario.
- [ ] El cliente aparece en el listado y en el selector de ventas sin recargar.

**Reglas**: RN-CLI-01 a RN-CLI-07.

## Épica 5: Ventas e historial

### US-012 — Composición de venta
**Como** operador
**Quiero** seleccionar un cliente y agregar renglones con libro y cantidad
**Para** preparar una venta antes de confirmarla.

**Criterios de aceptación**:
- [ ] Se puede agregar, cambiar cantidad y quitar renglones.
- [ ] No se admite un libro repetido.
- [ ] Cada renglón muestra libro, cantidad, precio unitario y subtotal.
- [ ] El total se actualiza al cambiar los renglones.

**Reglas**: RN-VEN-01 a RN-VEN-10.

### US-013 — Confirmación de venta
**Como** operador
**Quiero** confirmar la venta con un identificador y fecha
**Para** dejarla registrada en el historial.

**Criterios de aceptación**:
- [ ] No se confirma sin cliente, sin renglones o con cantidades inválidas.
- [ ] Se asigna `ven-N`, fecha ISO y total.
- [ ] El precio unitario se copia como valor histórico.
- [ ] El formulario se limpia y se muestra un mensaje de resultado.

**Reglas**: RN-VEN-09, RN-VEN-11, RN-VEN-12, RN-VEN-13, RN-VEN-14.

### US-014 — Historial y detalle
**Como** operador
**Quiero** ver las ventas y consultar sus renglones
**Para** auditar lo vendido.

**Criterios de aceptación**:
- [ ] El historial muestra identificador, fecha, cliente y total.
- [ ] El detalle muestra los renglones con valores históricos.
- [ ] Las ventas no se editan ni eliminan.
- [ ] Un id inexistente muestra un mensaje.

**Reglas**: RN-HIS-01 a RN-HIS-05.

## Épica 6: Persistencia, verificación y documentación

### US-015 — Carga inicial y recuperación
**Como** operador
**Quiero** que los datos persistan entre recargas
**Para** no perder altas ni ventas.

**Criterios de aceptación**:
- [ ] El seed se carga solo en el primer inicio.
- [ ] Al recargar se recuperan los datos sin duplicar el seed.
- [ ] Una falla de `localStorage` se informa.

**Reglas**: RN-PER-01, RN-PER-02, RN-PER-05.

### US-016 — Precio histórico inmutable
**Como** docente
**Quiero** comprobar que cambiar el precio de catálogo no altera una venta confirmada
**Para** verificar que el historial conserva el valor al momento de la venta.

**Criterios de aceptación**:
- [ ] El README identifica las claves y la estructura del catálogo guardado.
- [ ] Al modificar solo `tuco:libros` y recargar, la venta conserva precio unitario, subtotales y total.

**Reglas**: RN-VEN-12, RN-HIS-04, RN-PER-04.

### US-017 — Documentación y casos manuales
**Como** docente
**Quiero** un README con navegación, funcionalidades, datos iniciales, límites y resultados de casos manuales
**Para** evaluar la entrega.

**Criterios de aceptación**:
- [ ] El README identifica a los integrantes y los pasos para abrir `index.html` sin npm.
- [ ] Documenta funcionalidades implementadas y pendientes.
- [ ] Registra el resultado observado de cada caso manual.
- [ ] Declara la procedencia de las imágenes.

**Reglas**: RN-PER-03, RN-PER-04, RN-UI-04.
