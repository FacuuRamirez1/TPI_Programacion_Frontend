# venta-simulada Specification

## Purpose
Define la composición de una venta en `ventas.html` y su confirmación con precios históricos, identificador `ven-N`, fecha ISO y persistencia local.

## Requirements

### Requirement: Carga de clientes y libros en la composición

Al abrir `ventas.html`, el sistema SHALL poblar el selector de clientes con los clientes de `tuco:clientes` y el de libros con los libros de `tuco:libros`. Las opciones SHALL generarse desde los datos, sin listas fijas en el HTML, y cada opción de libro SHALL mostrar su título y su precio actual formateado.

#### Scenario: Selectores con los datos del seed
- **WHEN** se abre `ventas.html` con los datos locales del seed
- **THEN** el selector de clientes lista los 3 clientes y el de libros los 6 libros, además de su opción inicial

#### Scenario: Altas previas visibles en los selectores
- **WHEN** se dio de alta un cliente o un libro en su vista y después se abre `ventas.html`
- **THEN** el registro nuevo aparece en el selector correspondiente

#### Scenario: Sin listas hardcodeadas
- **WHEN** se inspecciona el HTML de `ventas.html`
- **THEN** las opciones de clientes y libros, salvo el placeholder, no están escritas en el documento y se generan desde `localStorage`

### Requirement: Selección de un cliente existente

La confirmación de la venta SHALL exigir un cliente seleccionado que exista en `tuco:clientes`. Si no hay cliente o el identificador no corresponde a un cliente guardado, el sistema SHALL rechazar la operación, mostrar un error junto al selector y en el resumen, y no SHALL persistir la venta.

#### Scenario: Confirmar sin cliente
- **WHEN** se intenta confirmar una venta con renglones pero sin cliente seleccionado
- **THEN** el sistema muestra el error de cliente, el resumen lo lista y `tuco:ventas` no cambia

#### Scenario: Cliente inexistente
- **WHEN** el identificador del cliente seleccionado no existe en `tuco:clientes`
- **THEN** el sistema muestra el error de cliente y no confirma la venta

#### Scenario: Cliente válido
- **WHEN** el cliente seleccionado existe en `tuco:clientes`
- **THEN** la validación del cliente pasa y la confirmación continúa con las demás reglas

### Requirement: Alta de renglón con libro existente y cantidad válida

El alta de un renglón SHALL exigir un libro existente en `tuco:libros` y una cantidad entera mayor que cero. La cantidad SHALL validarse con la validación de cantidad ya existente. Un renglón inválido NO SHALL agregarse, NO SHALL alterar los renglones ni el total y SHALL mostrar un mensaje de texto.

#### Scenario: Renglón válido
- **WHEN** se agrega un libro existente con una cantidad entera mayor que cero
- **THEN** aparece un renglón con título, cantidad, precio unitario y subtotal, y el selector de libro y la cantidad quedan disponibles para otro alta

#### Scenario: Libro no seleccionado o inexistente
- **WHEN** se intenta agregar un renglón sin libro o con un identificador que no existe en `tuco:libros`
- **THEN** el sistema muestra un error junto al selector de libro y no agrega el renglón

#### Scenario: Cantidad cero, negativa, decimal o vacía
- **WHEN** se intenta agregar un renglón con cantidad `0`, `-1`, `1.5`, vacía o no numérica
- **THEN** el sistema muestra el error de cantidad y no agrega el renglón

#### Scenario: Renglón inválido sin efectos
- **WHEN** el alta de un renglón falla por libro o por cantidad
- **THEN** la cantidad de renglones y el total no cambian

### Requirement: Rechazo de libro repetido

El sistema SHALL rechazar un libro que ya tenga un renglón en la composición y SHALL informar que se modifique la cantidad del renglón existente. NO SHALL crear un segundo renglón ni sumar la cantidad en forma automática.

#### Scenario: Libro duplicado
- **WHEN** se intenta agregar un libro que ya está en la composición
- **THEN** el sistema informa el duplicado, conserva un solo renglón para ese libro y no modifica el total

#### Scenario: Modificar la cantidad del renglón existente
- **WHEN** se edita la cantidad del renglón ya agregado
- **THEN** se actualizan la cantidad, el subtotal y el total sin crear un renglón nuevo

#### Scenario: Volver a agregar después de quitar
- **WHEN** se quita el renglón de un libro y después se vuelve a agregar el mismo libro
- **THEN** el alta se acepta porque ya no existe un renglón para ese libro

### Requirement: Edición de cantidad

Cada renglón SHALL permitir editar su cantidad con un control numérico. Un valor válido SHALL actualizar cantidad, subtotal y total; un valor inválido SHALL rechazarse, conservar la cantidad anterior y mostrar un mensaje. La cantidad editada SHALL ser un entero mayor que cero.

#### Scenario: Cambio de cantidad válido
- **WHEN** un renglón con cantidad `2` se cambia a `3`
- **THEN** el renglón muestra `3`, su subtotal se recalcula y el total se actualiza

#### Scenario: Cambio de cantidad inválido
- **WHEN** se intenta dejar la cantidad en `0`, `-2` o `1.5`
- **THEN** el sistema muestra el error, conserva la cantidad anterior y no altera el total

#### Scenario: Total en vivo
- **WHEN** se edita la cantidad de un renglón
- **THEN** el total visible se actualiza sin recargar la página

### Requirement: Eliminación de renglón

El sistema SHALL permitir quitar cualquier renglón de la composición antes de confirmar. Al quitarlo SHALL recalcular el total y, si no quedan renglones, SHALL mostrar el estado vacío y el total en `$ 0,00`.

#### Scenario: Quitar un renglón
- **WHEN** se quita uno de varios renglones
- **THEN** el renglón desaparece de la tabla y el total se recalcula con los renglones restantes

#### Scenario: Quitar el último renglón
- **WHEN** se quita el único renglón de la composición
- **THEN** la tabla queda sin filas, el total muestra `$ 0,00` y aparece el mensaje de estado vacío

### Requirement: Cálculo de subtotal y total

El subtotal SHALL calcularse como `cantidad × precioUnitario` y el total como la suma de los subtotales. Ambos SHALL redondearse a dos decimales y mostrarse en formato es-AR. El total SHALL actualizarse después de agregar, editar o quitar renglones.

#### Scenario: Subtotal del renglón
- **WHEN** un renglón tiene cantidad `2` y precio unitario `1500`
- **THEN** su subtotal se muestra como `$ 3.000,00`

#### Scenario: Total de la venta
- **WHEN** la composición tiene `2 × 1500` y `1 × 2000`
- **THEN** los subtotales son `$ 3.000,00` y `$ 2.000,00`, y el total es `$ 5.000,00`

#### Scenario: Redondeo a dos decimales
- **WHEN** una multiplicación produce más de dos decimales
- **THEN** el subtotal y el total se redondean a dos decimales antes de mostrarse y de guardarse

### Requirement: Bloqueo de confirmación con datos inválidos

El sistema SHALL rechazar la confirmación si falta el cliente, si no hay renglones, si un libro no existe, si una cantidad no es un entero mayor que cero o si hay libros repetidos. En ese caso NO SHALL persistir la venta y SHALL mostrar un resumen con texto y enfocar el control correspondiente.

#### Scenario: Confirmar sin renglones
- **WHEN** se presiona «Confirmar venta» sin renglones en la composición
- **THEN** el sistema muestra el mensaje de venta sin renglones y no persiste nada

#### Scenario: Confirmar con cliente inválido
- **WHEN** se confirma con un cliente ausente o inexistente
- **THEN** el sistema muestra el error de cliente y no persiste la venta

#### Scenario: Confirmar con un renglón inválido
- **WHEN** la composición contiene un libro inexistente, una cantidad inválida o un libro repetido, por ejemplo tras una edición manual de `localStorage`
- **THEN** el sistema rechaza la confirmación, informa el problema y no persiste la venta

#### Scenario: Datos inválidos sin persistencia
- **WHEN** la confirmación falla por cualquier validación
- **THEN** `tuco:ventas` conserva exactamente sus registros anteriores

### Requirement: Confirmación con snapshot inmutable

Una confirmación válida SHALL generar un identificador `ven-N` con el mayor sufijo existente más uno y una `fecha` ISO obtenida con `new Date().toISOString()`. La venta SHALL guardar `clienteId`, `clienteNombre`, `total` y renglones con `libroId`, `titulo`, `cantidad`, `precioUnitario` y `subtotal` copiados del catálogo al confirmar.

#### Scenario: Snapshot de título y precio
- **WHEN** se confirma una venta con un libro del catálogo
- **THEN** el renglón guarda el título y el precio unitario vigentes en ese momento, además de la cantidad y el subtotal

#### Scenario: Identificador incremental
- **WHEN** no existen ventas previas y se confirma la primera venta
- **THEN** la venta se guarda como `ven-1`; la siguiente confirmación se guarda como `ven-2`

#### Scenario: Fecha ISO
- **WHEN** se confirma una venta
- **THEN** el campo `fecha` es un string ISO 8601 generado con `new Date().toISOString()`

#### Scenario: El catálogo posterior no altera el snapshot
- **WHEN** se modifica el precio de un libro en `tuco:libros` después de confirmar la venta
- **THEN** la venta guardada conserva el título, el precio unitario, el subtotal y el total originales

### Requirement: Persistencia en tuco:ventas y feedback

Tras confirmar, el sistema SHALL persistir la colección completa en `tuco:ventas`, limpiar cliente, libro, cantidad y renglones, dejar el total en cero y mostrar un mensaje con el identificador y el total. Si la escritura no se verifica, SHALL informar el error, conservar la composición y NO SHALL simular el éxito.

#### Scenario: Venta persistida
- **WHEN** una confirmación válida finaliza
- **THEN** `tuco:ventas` contiene la venta nueva con su identificador, fecha, cliente, renglones y total

#### Scenario: Limpieza y mensaje de resultado
- **WHEN** una venta se confirma correctamente
- **THEN** el formulario queda limpio, la tabla no tiene renglones, el total muestra `$ 0,00` y el mensaje informa el identificador y el total confirmados

#### Scenario: Sin recarga de la página
- **WHEN** se confirma una venta
- **THEN** la URL no cambia, no aparecen parámetros de consulta y la página no se recarga

#### Scenario: Doble confirmación
- **WHEN** se presiona «Confirmar venta» dos veces mientras la primera confirmación está en curso
- **THEN** se genera una sola venta y no se duplica el registro

#### Scenario: Falla de almacenamiento
- **WHEN** `localStorage` no permite guardar o la venta no se encuentra al releer `tuco:ventas`
- **THEN** el sistema muestra un mensaje de error, conserva la composición y no muestra el mensaje de éxito
