# catalogo-local Specification

## Purpose
Define el modelo de datos locales de la Librería TU-CO, la carga del seed, el render del catálogo desde esos datos y el filtro por título con sus estados vacíos.

## Requirements

### Requirement: Modelo de datos local con seed

El sistema SHALL representar editoriales, géneros, autores, libros y clientes como colecciones locales de objetos con IDs únicos con formato `prefijo-N` (`edi-N`, `gen-N`, `aut-N`, `lib-N`, `cli-N`). El seed SHALL incluir al menos 2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes. Cada libro SHALL referenciar una editorial y al menos un autor existentes, y SHALL usar `generoId: null` cuando no tenga género.

#### Scenario: Seed mínimo y relaciones válidas
- **WHEN** se cargan los datos iniciales del sistema
- **THEN** existen al menos 2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes, y cada libro referencia una editorial y autores existentes en sus propias colecciones

#### Scenario: Identificadores legibles
- **WHEN** se inspeccionan los registros de cada colección
- **THEN** cada ID respeta el prefijo de su entidad seguido de un número (`edi-N`, `gen-N`, `aut-N`, `lib-N`, `cli-N`) y no se repite dentro de la colección

#### Scenario: Libro sin género
- **WHEN** un libro del seed no tiene género asignado
- **THEN** su `generoId` es `null` y no se usa un género ficticio para representar la ausencia

### Requirement: Carga inicial de colecciones con fallback
Al iniciar, el sistema SHALL verificar la clave `tuco:esquema`. Si no existe (`null` o ausente), SHALL tratarse como primer inicio: cargar cada colección desde `localStorage` con las claves `tuco:editoriales`, `tuco:generos`, `tuco:autores`, `tuco:libros`, `tuco:clientes` y `tuco:ventas`; si una colección falta, SHALL devolver una copia del seed y persistirla; luego SHALL persistir `tuco:esquema = "1"`. Si `tuco:esquema = "1"` ya existe, SHALL leer las colecciones desde localStorage; si una colección individual falta, SHALL crear esa colección como arreglo vacío y persistirla (NO usar seed). Si el almacenamiento no está disponible (SecurityError, cuota agotada) o el JSON guardado es inválido (SyntaxError), SHALL mostrar un mensaje **visible al usuario** (no solo consola), SHALL operar en memoria con el seed o colección vacía según corresponda, SHALL ofrecer opción de reiniciar **solo la colección afectada** (no borrado automático), y SHALL permitir continuar la aplicación.

#### Scenario: Primera apertura sin datos guardados
- **WHEN** se abre la aplicación sin `tuco:esquema` en localStorage
- **THEN** cada colección se completa con una copia del seed, se persiste bajo su clave `tuco:*`, y se crea `tuco:esquema = "1"`

#### Scenario: Recuperación de datos guardados
- **WHEN** `tuco:esquema = "1"` existe y hay colecciones en localStorage
- **THEN** el sistema devuelve los valores almacenados y NO los reemplaza por el seed

#### Scenario: Colección faltante con esquema creado se inicializa vacía
- **WHEN** `tuco:esquema = "1"` existe pero `tuco:libros` no está en localStorage
- **THEN** se crea `tuco:libros = []`, se persiste y el catálogo muestra lista vacía (mensaje de catálogo vacío)

#### Scenario: JSON inválido en el almacenamiento
- **WHEN** `JSON.parse(localStorage.getItem("tuco:clientes"))` lanza SyntaxError
- **THEN** se muestra mensaje visible ("Datos de clientes corruptos. ¿Reiniciar solo esta colección?"), el usuario puede confirmar reinicio de solo `tuco:clientes = []`, y las demás colecciones no se afectan

#### Scenario: Almacenamiento no disponible
- **WHEN** `localStorage` lanza SecurityError o no está accesible
- **THEN** el sistema usa el seed en memoria, muestra aviso visible ("El almacenamiento local no está disponible. Los datos no se guardarán al recargar.") y el catálogo no queda vacío

#### Scenario: Cuota agotada al escribir muestra mensaje y no confirma
- **WHEN** `localStorage.setItem` lanza `QuotaExceededError` al guardar una colección
- **THEN** se muestra mensaje visible ("No hay espacio en el almacenamiento local. La operación no se guardó."), la operación no se confirma y los datos en memoria no cambian

### Requirement: Render del catálogo desde los datos locales

El sistema SHALL renderizar el catálogo desde la colección local de libros, sin datos del seed escritos en el HTML. Cada tarjeta SHALL mostrar título, ISBN, editorial, género («Sin clasificar» cuando `generoId` es `null`), autores y precio formateado en es-AR con dos decimales. Todos los valores SHALL insertarse como texto, nunca como HTML interpretado.

#### Scenario: Tarjeta completa por libro
- **WHEN** el catálogo se renderiza con los libros locales
- **THEN** cada tarjeta muestra título, ISBN, editorial, género, autores y precio, y la cantidad de tarjetas coincide con la cantidad de libros

#### Scenario: Libro sin género en el catálogo
- **WHEN** un libro tiene `generoId: null`
- **THEN** su tarjeta muestra el texto «Sin clasificar» en el campo de género

#### Scenario: Precio con formato es-AR
- **WHEN** se muestra el precio de un libro en el catálogo
- **THEN** se presenta con separador de miles, coma decimal y dos decimales, por ejemplo `$ 12.500,00`

#### Scenario: Autores resueltos desde sus IDs
- **WHEN** un libro referencia uno o más autores
- **THEN** la tarjeta muestra nombre y apellido de cada autor existente, unidos por coma, en el orden de sus IDs

#### Scenario: Sin catálogo hardcodeado
- **WHEN** se inspecciona el HTML del catálogo
- **THEN** no existen tarjetas con libros reales ni datos del seed escritos en el documento; el listado se genera desde los datos locales

### Requirement: Filtro por título en vivo

El filtro por título SHALL aplicarse en vivo mientras se escribe, SHALL recortar espacios extremos con `trim`, SHALL ignorar diferencias entre mayúsculas y minúsculas y SHALL admitir coincidencias parciales. Una consulta vacía o compuesta solo por espacios SHALL mostrar el catálogo completo. El envío del formulario de búsqueda SHALL no recargar la página.

#### Scenario: Coincidencia parcial en mayúsculas
- **WHEN** se escribe una parte del título en mayúsculas
- **THEN** el catálogo muestra los libros cuyo título contiene ese fragmento, sin distinguir mayúsculas de minúsculas

#### Scenario: Búsqueda vacía
- **WHEN** el campo de búsqueda está vacío
- **THEN** el catálogo muestra todos los libros disponibles

#### Scenario: Búsqueda con solo espacios
- **WHEN** el campo contiene únicamente espacios
- **THEN** el sistema recorta la consulta y muestra el catálogo completo

#### Scenario: Envío del formulario sin recarga
- **WHEN** se envía el formulario de búsqueda con Enter
- **THEN** el sistema evita la recarga de la página y conserva el catálogo filtrado en pantalla

### Requirement: Estados de catálogo vacío y sin coincidencias

El sistema SHALL mostrar un mensaje cuando el catálogo no tenga libros y un mensaje distinto cuando la búsqueda no tenga coincidencias. Ambos mensajes SHALL expresarse con texto y SHALL alternarse según corresponda, sin dejar el listado vacío sin explicación.

#### Scenario: Catálogo sin libros
- **WHEN** la colección de libros está vacía
- **THEN** se muestra el mensaje de catálogo vacío y no se muestra el mensaje de búsqueda sin resultados

#### Scenario: Búsqueda sin coincidencias
- **WHEN** el catálogo tiene libros pero ninguno coincide con la consulta
- **THEN** se muestra el mensaje de búsqueda sin resultados, distinto del de catálogo vacío

#### Scenario: Vuelta a resultados
- **WHEN** se modifica la consulta y vuelven a existir coincidencias
- **THEN** el mensaje de búsqueda sin resultados se oculta y se muestran las tarjetas correspondientes

### Requirement: Ejecución local sin dependencias

La aplicación SHALL ejecutarse al abrir `index.html` con doble clic mediante `file://`, usando scripts clásicos con `defer` que exponen su API en `window.TUCO`. No SHALL usar `import`/`export`, módulos ES, `fetch`, XHR, frameworks, librerías, CDNs ni build, y SHALL cargar solo recursos locales.

#### Scenario: Apertura directa del catálogo
- **WHEN** se abre `index.html` con doble clic
- **THEN** el catálogo se renderiza y el filtro funciona sin servidor, sin instalación y sin peticiones de red

#### Scenario: Sin módulos ni peticiones
- **WHEN** se inspeccionan los archivos JavaScript del catálogo
- **THEN** no existen `import`, `export`, `type="module"`, `fetch` ni XHR

#### Scenario: Orden de carga de scripts
- **WHEN** se revisa el final de `index.html`
- **THEN** los scripts de datos, almacenamiento, formato y catálogo se cargan con `defer` en ese orden
