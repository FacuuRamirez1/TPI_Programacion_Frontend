# Spec Delta

## Purpose

Define el alta de libros desde `libros.html`: validación de los datos, unicidad del ISBN normalizado, generación de identificadores, persistencia local y actualización del listado y de los selectores sin recargar la página.

## ADDED Requirements

### Requirement: Título, ISBN y precio válidos

El alta de un libro SHALL rechazar el envío cuando el título o el ISBN estén vacíos o compuestos solo por espacios, o cuando el precio no sea un número finito mayor que cero. El precio SHALL guardarse como número, no como texto.

#### Scenario: Datos básicos válidos
- **WHEN** se envía un libro con título, ISBN y precio mayor que cero
- **THEN** esos tres campos se consideran válidos y el alta continúa con las demás validaciones

#### Scenario: Título vacío
- **WHEN** el título está vacío o contiene solo espacios
- **THEN** el sistema muestra un error junto al campo de título y no agrega el libro

#### Scenario: ISBN vacío
- **WHEN** el ISBN está vacío o contiene solo espacios
- **THEN** el sistema muestra un error junto al campo de ISBN y no agrega el libro

#### Scenario: Precio cero o negativo
- **WHEN** el precio es `0` o un número negativo
- **THEN** el sistema muestra un error junto al campo de precio y no agrega el libro

#### Scenario: Precio no numérico
- **WHEN** el precio está vacío o no representa un número
- **THEN** el sistema muestra un error junto al campo de precio y no agrega el libro

### Requirement: Editorial, autores y género existentes

El alta de un libro SHALL exigir una editorial existente en los datos locales y al menos un autor existente. Todos los autores seleccionados SHALL existir. El género SHALL ser opcional: la opción «Sin clasificar» (`value=""`) SHALL guardarse como `null`, y cualquier género informado SHALL existir en los datos locales.

#### Scenario: Editorial no seleccionada
- **WHEN** se envía el formulario sin elegir editorial
- **THEN** el sistema muestra un error junto al campo de editorial y no agrega el libro

#### Scenario: Editorial inexistente
- **WHEN** el identificador de editorial enviado no existe en la colección local
- **THEN** el sistema muestra un error junto al campo de editorial y no agrega el libro

#### Scenario: Alta sin autores
- **WHEN** se envía el formulario sin ningún autor seleccionado
- **THEN** el sistema muestra un error junto al campo de autores y no agrega el libro

#### Scenario: Autor inexistente
- **WHEN** alguno de los autores enviados no existe en la colección local
- **THEN** el sistema muestra un error junto al campo de autores y no agrega el libro

#### Scenario: Libro sin género
- **WHEN** se envía el libro con la opción «Sin clasificar» seleccionada
- **THEN** el alta es válida y el libro se guarda con `generoId: null`

#### Scenario: Género inexistente
- **WHEN** el identificador de género enviado no existe en la colección local
- **THEN** el sistema muestra un error junto al campo de género y no agrega el libro

### Requirement: Unicidad del ISBN normalizado

El ISBN SHALL compararse sin espacios, sin guiones y sin distinguir mayúsculas de minúsculas. El alta SHALL rechazar un ISBN cuyo valor normalizado coincida con el de otro libro existente. No se SHALL validar el dígito verificador ni se SHALL exigir una longitud determinada.

#### Scenario: ISBN duplicado en distinto formato
- **WHEN** se intenta dar de alta un ISBN que coincide con uno existente al quitar espacios, guiones y mayúsculas, por ejemplo `978 950 01 0001 1` frente a `978-950-01-0001-1`
- **THEN** el sistema muestra el error «El ISBN ya existe», marca el campo como inválido y no agrega el libro

#### Scenario: ISBN nuevo
- **WHEN** el ISBN normalizado no coincide con ningún libro existente
- **THEN** la validación de unicidad pasa y el alta continúa

#### Scenario: ISBN con distinta capitalización
- **WHEN** dos ISBN solo difieren por el uso de `x` o `X` en el dígito verificador
- **THEN** se consideran el mismo ISBN y el alta del segundo se rechaza

### Requirement: Selectores poblados desde los datos locales

Al abrir `libros.html`, el sistema SHALL poblar el selector de editorial con las editoriales locales, el selector de género con la opción «Sin clasificar» (`value=""`) y los géneros locales, y el selector múltiple de autores con los autores locales. Las opciones SHALL generarse desde los datos, sin listas hardcodeadas en el HTML.

#### Scenario: Selectores con datos del seed
- **WHEN** se abre `libros.html` con los datos locales del seed
- **THEN** el selector de editorial lista las 2 editoriales, el de género lista «Sin clasificar» y los 2 géneros, y el de autores lista los 3 autores

#### Scenario: Selector de autores múltiple
- **WHEN** el operador elige más de un autor en el selector
- **THEN** el control conserva todas las selecciones y el alta recibe el conjunto completo de identificadores

#### Scenario: Selectores sin listas hardcodeadas
- **WHEN** se inspecciona el HTML de `libros.html`
- **THEN** las opciones de editorial, género y autores no están escritas en el documento y se generan desde `localStorage`

### Requirement: Persistencia con identificador lib-N

Un alta válida SHALL generar un identificador `lib-N` con el mayor sufijo numérico existente más uno, agregar el libro a la colección local y persistir la colección completa en `tuco:libros`. El registro SHALL conservar título e ISBN recortados, precio numérico, `editorialId`, `generoId` o `null`, y `autorIds` con todos los autores seleccionados.

#### Scenario: Primer alta después del seed
- **WHEN** se da de alta un libro válido con los 6 libros del seed presentes
- **THEN** el libro se guarda con el identificador `lib-7` y la clave `tuco:libros` contiene 7 registros

#### Scenario: Alta sucesiva
- **WHEN** se da de alta otro libro válido después del anterior
- **THEN** el nuevo libro recibe `lib-8` y no se reutiliza ningún identificador

#### Scenario: Persistencia entre recargas
- **WHEN** se recarga `libros.html` después de un alta válida
- **THEN** el libro agregado sigue presente en el listado y en `tuco:libros`

### Requirement: Listado de libros sin recarga

Después de un alta válida, el sistema SHALL volver a renderizar el listado de libros en la misma página sin recargar el documento. Cada fila SHALL mostrar título, ISBN, editorial, género («Sin clasificar» cuando `generoId` es `null`), autores y precio formateado en es-AR con dos decimales. El listado SHALL insertar los valores como texto y SHALL ocultar el mensaje de lista vacía cuando existan libros.

#### Scenario: Libro visible tras el alta
- **WHEN** un alta válida finaliza
- **THEN** la tabla de libros registrados muestra una fila nueva con los datos del libro, sin que la página se recargue

#### Scenario: Mensaje de lista vacía
- **WHEN** el listado pasa de vacío a tener al menos un libro
- **THEN** el mensaje «Todavía no hay libros registrados» queda oculto

#### Scenario: Precio y género en el listado
- **WHEN** se muestra la fila de un libro con precio `12500` y `generoId: null`
- **THEN** el precio se muestra como `$ 12.500,00` y el género como «Sin clasificar»

#### Scenario: Datos como texto
- **WHEN** un título o ISBN contiene caracteres especiales
- **THEN** se muestran literalmente como texto y no se interpretan como HTML

### Requirement: Feedback de validación y éxito

Ante un envío inválido, el sistema SHALL no persistir el libro, SHALL mostrar un mensaje de texto junto a cada campo inválido, SHALL marcar esos campos con `aria-invalid="true"` y SHALL mostrar un resumen al inicio del formulario. Ante un alta válida, SHALL mostrar un mensaje de éxito y SHALL limpiar el formulario. El envío SHALL controlarse con `preventDefault` para evitar la recarga.

#### Scenario: Errores por campo y resumen
- **WHEN** se envía un formulario con título vacío y precio igual a cero
- **THEN** el campo de título y el de precio muestran su error con texto, ambos quedan con `aria-invalid="true"` y el resumen del inicio lista los dos problemas

#### Scenario: Envío inválido sin persistencia
- **WHEN** el formulario tiene al menos un error de validación
- **THEN** la colección `tuco:libros` no cambia y el listado no incorpora el libro

#### Scenario: Alta correcta
- **WHEN** todas las validaciones pasan
- **THEN** se muestra un mensaje de éxito, el formulario queda limpio y el foco queda disponible para una nueva carga

#### Scenario: Sin recarga de la página
- **WHEN** se envía el formulario de alta
- **THEN** la URL no cambia, no aparecen parámetros de consulta y la página no se recarga
