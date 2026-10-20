# Reglas de Negocio

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad entre la KB, los changes y los casos de prueba manuales.

## Dominio: Catálogo y búsqueda (RN-CAT)

- **RN-CAT-01**: el texto de búsqueda se recorta con `trim` antes de comparar.
- **RN-CAT-02**: la comparación ignora diferencias entre mayúsculas y minúsculas.
- **RN-CAT-03**: la búsqueda por título admite coincidencias parciales.
- **RN-CAT-04**: una búsqueda vacía (o solo espacios) muestra el catálogo completo.
- **RN-CAT-05**: una búsqueda sin coincidencias muestra un mensaje claro, no una lista vacía sin explicación.
- **RN-CAT-06**: un libro con `generoId: null` se muestra como «Sin clasificar».
- **RN-CAT-07**: el catálogo muestra título, ISBN, editorial, género, autores y precio de cada libro.
- **RN-CAT-08**: los datos escritos por usuarios se insertan como texto en el DOM (`textContent`), nunca como HTML interpretado.

## Dominio: Alta de libros (RN-LIB)

- **RN-LIB-01**: el título no puede estar vacío.
- **RN-LIB-02**: el ISBN no puede estar vacío.
- **RN-LIB-03**: el ISBN se normaliza quitando espacios y guiones; no puede coincidir con el de otro libro del conjunto local (comparación sin distinguir mayúsculas para admitir `X`).
- **RN-LIB-04**: el precio debe ser numérico y mayor que cero.
- **RN-LIB-05**: la editorial seleccionada debe existir en los datos locales.
- **RN-LIB-06**: se debe seleccionar al menos un autor.
- **RN-LIB-07**: todos los autores seleccionados deben existir en los datos locales.
- **RN-LIB-08**: el género es opcional; si se asigna, debe existir en los datos locales. La opción «Sin clasificar» representa la ausencia de género.
- **RN-LIB-09**: el envío se controla con `preventDefault`; solo se agrega el libro si todas las validaciones pasan.
- **RN-LIB-10**: tras un alta correcta, el listado y las opciones relacionadas se actualizan sin recargar la página.
- **RN-LIB-11**: no se exige el dígito verificador del ISBN.

## Dominio: Alta de clientes (RN-CLI)

- **RN-CLI-01**: el nombre completo no puede estar vacío; no se separa en nombre y apellido.
- **RN-CLI-02**: el email no puede estar vacío.
- **RN-CLI-03**: el email debe tener un formato válido.
- **RN-CLI-04**: el email se normaliza con `trim` y minúsculas; no puede coincidir con el de otro cliente.
- **RN-CLI-05**: el envío se controla con `preventDefault`; solo se agrega el cliente si todas las validaciones pasan.
- **RN-CLI-06**: tras un alta correcta, el listado y las opciones relacionadas se actualizan sin recargar la página.
- **RN-CLI-07**: los errores se muestran cerca del formulario y con texto, no solo con color.

## Dominio: Ventas (RN-VEN)

- **RN-VEN-01**: se debe seleccionar un cliente existente.
- **RN-VEN-02**: la venta debe tener al menos un renglón.
- **RN-VEN-03**: cada renglón debe referenciar un libro existente.
- **RN-VEN-04**: la cantidad debe ser un entero mayor que cero; no se admiten cero, negativos ni decimales.
- **RN-VEN-05**: no se admite el mismo libro dos veces en la misma venta; se modifica la cantidad del renglón existente o se informa el duplicado.
- **RN-VEN-06**: el subtotal se calcula como `cantidad × precioUnitario`.
- **RN-VEN-07**: el total se calcula como la suma de los subtotales.
- **RN-VEN-08**: los importes se presentan con dos decimales en formato es-AR (`$ 12.500,00`).
- **RN-VEN-09**: no se puede confirmar una venta sin cliente, sin renglones o con cantidades inválidas.
- **RN-VEN-10**: antes de confirmar se pueden cambiar cantidades y quitar renglones.
- **RN-VEN-11**: al confirmar se asigna un identificador `ven-N`, una fecha ISO y el total.
- **RN-VEN-12**: el precio unitario se copia al renglón como valor histórico al confirmar; no se relee del catálogo al consultar el historial.
- **RN-VEN-13**: se conservan los datos descriptivos necesarios para leer la venta (nombre del cliente y título de cada libro).
- **RN-VEN-14**: la confirmación limpia el formulario para una nueva venta y muestra un mensaje de resultado.

## Dominio: Historial (RN-HIS)

- **RN-HIS-01**: las ventas confirmadas no se editan ni se eliminan desde la interfaz.
- **RN-HIS-02**: el historial muestra identificador, fecha, cliente y total de cada venta.
- **RN-HIS-03**: cada venta permite consultar sus renglones con título, cantidad, precio unitario y subtotal.
- **RN-HIS-04**: un cambio posterior del precio de catálogo no altera el precio unitario, los subtotales ni el total de una venta ya confirmada.
- **RN-HIS-05**: si se consulta un identificador inexistente en el detalle, se muestra un mensaje y un enlace para volver al historial.

## Dominio: Persistencia (RN-PER)

- **RN-PER-01**: en el primer inicio se cargan los ejemplos del seed.
- **RN-PER-02**: al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales.
- **RN-PER-03**: el almacenamiento depende del navegador, del perfil y de la ubicación de apertura; no se comparte entre usuarios.
- **RN-PER-04**: el README identifica las claves y la estructura de los datos guardados para reproducir la comprobación del precio histórico.
- **RN-PER-05**: si `localStorage` no está disponible o falla una escritura, se informa el problema y no se simula una operación exitosa.

## Dominio: Interfaz y accesibilidad (RN-UI)

- **RN-UI-01**: cada campo de formulario tiene una etiqueta asociada.
- **RN-UI-02**: los botones tienen textos que describen su acción.
- **RN-UI-03**: las tablas incluyen encabezados.
- **RN-UI-04**: se muestran mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.
- **RN-UI-05**: los mensajes de error se expresan con texto y no dependen únicamente del color.
- **RN-UI-06**: los controles conservan un foco visible y se recorren con el teclado.
- **RN-UI-07**: las imágenes informativas tienen texto alternativo; las decorativas no repiten información innecesaria.
- **RN-UI-08**: la navegación indica la página actual con `aria-current="page"`.

## Dominio: Adaptabilidad (RN-RES)

- **RN-RES-01**: la interfaz se comprueba a 320 px y 1280 px.
- **RN-RES-02**: los textos y controles resultan legibles en ambos anchos.
- **RN-RES-03**: no hay desplazamiento horizontal de toda la página.
- **RN-RES-04**: una tabla que necesita más espacio se desplaza dentro de su propio contenedor.

## Dominio: Restricciones técnicas (RN-TEC)

- **RN-TEC-01**: solo HTML, CSS y JavaScript nativos; prohibidas librerías, frameworks y CDNs.
- **RN-TEC-02**: los estilos y scripts viven en archivos externos locales.
- **RN-TEC-03**: la aplicación se abre directamente desde `index.html` sin npm ni servidor; por eso se usan scripts clásicos con namespace, no módulos ES.
- **RN-TEC-04**: no se realizan peticiones de red ni se accede al backend.
- **RN-TEC-05**: la entrega no incluye dependencias instaladas ni herramientas de compilación.
