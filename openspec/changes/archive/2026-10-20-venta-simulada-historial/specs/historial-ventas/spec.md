# Spec Delta

## Purpose

Define la consulta de las ventas confirmadas en `historial.html` y el detalle histórico de cada venta en `venta-detalle.html`, sin permitir su edición ni su borrado.

## ADDED Requirements

### Requirement: Listado de ventas confirmadas

Al abrir `historial.html`, el sistema SHALL leer `tuco:ventas` y mostrar una fila por venta, de la más reciente a la más antigua según el sufijo de `ven-N`, con identificador, fecha `dd/mm/aaaa`, `clienteNombre` y total formateado en es-AR. Cada fila SHALL incluir un enlace a `venta-detalle.html?id=<id>` y los datos SHALL insertarse como texto.

#### Scenario: Listado con ventas
- **WHEN** se abre `historial.html` con ventas confirmadas
- **THEN** la tabla muestra una fila por venta con identificador, fecha, cliente y total

#### Scenario: Venta recién confirmada
- **WHEN** se confirma una venta en `ventas.html` y después se abre `historial.html`
- **THEN** la venta nueva aparece en el listado

#### Scenario: Fecha en formato local
- **WHEN** una venta tiene `fecha: "2026-10-20T14:03:00.000Z"`
- **THEN** el historial muestra `20/10/2026`

#### Scenario: Total formateado
- **WHEN** una venta tiene `total: 5000`
- **THEN** el historial muestra `$ 5.000,00`

#### Scenario: Enlace al detalle
- **WHEN** se muestra una fila de la venta `ven-3`
- **THEN** su enlace apunta a `venta-detalle.html?id=ven-3`

#### Scenario: Orden de las ventas
- **WHEN** existen las ventas `ven-1`, `ven-2` y `ven-3`
- **THEN** el listado muestra primero `ven-3`, después `ven-2` y al final `ven-1`

#### Scenario: Datos como texto
- **WHEN** el nombre del cliente contiene caracteres especiales
- **THEN** se muestra literalmente como texto y no se interpreta como HTML

### Requirement: Mensaje de historial vacío

Cuando `tuco:ventas` no tenga registros, el sistema SHALL mostrar el mensaje «Todavía no hay ventas confirmadas.» y NO SHALL mostrar filas de ventas. Al existir al menos una venta, el mensaje SHALL quedar oculto.

#### Scenario: Historial vacío
- **WHEN** se abre `historial.html` sin ventas confirmadas
- **THEN** se muestra el mensaje de historial vacío y la tabla no tiene filas

#### Scenario: Mensaje oculto con ventas
- **WHEN** se abre `historial.html` con al menos una venta
- **THEN** el mensaje de historial vacío queda oculto

#### Scenario: Paso de vacío a con ventas
- **WHEN** se confirma la primera venta y se vuelve a abrir el historial
- **THEN** la tabla muestra la venta y el mensaje de vacío ya no aparece

### Requirement: Detalle de venta por identificador

Al abrir `venta-detalle.html?id=ven-N`, el sistema SHALL leer el parámetro `id`, buscar la venta en `tuco:ventas` y mostrar identificador, fecha `dd/mm/aaaa`, `clienteNombre`, total y una tabla de renglones con título, cantidad, precio unitario y subtotal. Los renglones SHALL renderizarse con los valores guardados, sin releer `tuco:libros`.

#### Scenario: Detalle válido
- **WHEN** se abre el detalle de una venta existente
- **THEN** se muestran los datos de la venta y una fila por renglón con título, cantidad, precio unitario y subtotal

#### Scenario: Valores históricos
- **WHEN** se modifica el precio del libro en `tuco:libros` después de confirmada la venta y se abre su detalle
- **THEN** el título, el precio unitario, el subtotal y el total coinciden con los valores guardados al confirmar

#### Scenario: Detalle conservado tras recargar
- **WHEN** se recarga `venta-detalle.html?id=ven-1`
- **THEN** los datos y los renglones se siguen mostrando con los mismos valores históricos

#### Scenario: Tabla accesible
- **WHEN** se renderizan los renglones del detalle
- **THEN** la tabla tiene `caption` y encabezados `th scope="col"` para título, cantidad, precio unitario y subtotal

#### Scenario: Datos como texto
- **WHEN** un título o un nombre de cliente contiene caracteres especiales
- **THEN** se muestra literalmente como texto y no se interpreta como HTML

### Requirement: Identificador ausente o inexistente en el detalle

Si el parámetro `id` falta, no tiene el formato `ven-N` o no corresponde a una venta guardada, el sistema SHALL no renderizar renglones, SHALL mostrar un mensaje de error con texto y SHALL dejar disponible el enlace para volver al historial.

#### Scenario: Detalle sin identificador
- **WHEN** se abre `venta-detalle.html` sin el parámetro `id`
- **THEN** se muestra el mensaje de error y el enlace «Volver al historial»

#### Scenario: Identificador con formato inválido
- **WHEN** se abre `venta-detalle.html?id=abc` o `venta-detalle.html?id=ven-x`
- **THEN** se muestra el mensaje de error y no se renderizan renglones

#### Scenario: Identificador inexistente
- **WHEN** se abre `venta-detalle.html?id=ven-999` y esa venta no existe
- **THEN** se muestra el mensaje de error y el enlace «Volver al historial»

#### Scenario: Venta con renglones malformados
- **WHEN** la venta existe pero sus `renglones` no son un arreglo
- **THEN** el sistema trata el detalle como no disponible y muestra el mensaje de error

### Requirement: Inmutabilidad de las ventas confirmadas

El historial y el detalle NO SHALL ofrecer acciones para editar ni eliminar ventas confirmadas. La única interacción disponible SHALL ser consultar el detalle y volver al historial.

#### Scenario: Sin controles de edición o borrado
- **WHEN** se inspecciona el historial o el detalle de una venta
- **THEN** no existen botones ni enlaces para editar o eliminar la venta

#### Scenario: Navegación de solo lectura
- **WHEN** se recorre el historial y el detalle de una venta
- **THEN** `tuco:ventas` no cambia y la venta conserva todos sus valores

#### Scenario: Sin formulario de modificación
- **WHEN** se abre el detalle de una venta
- **THEN** no hay campos editables ni una acción de guardado de cambios sobre la venta
