# Spec Delta

## Purpose

Define el alta de clientes desde `clientes.html`: validación del nombre y del email, unicidad del email normalizado, generación de identificadores, persistencia local y actualización del listado sin recargar la página.

## ADDED Requirements

### Requirement: Nombre y email válidos

El alta de un cliente SHALL rechazar el envío cuando el nombre completo esté vacío o compuesto solo por espacios, cuando el email esté vacío o cuando el email no tenga un formato válido con texto antes de `@`, dominio y punto con extensión. El nombre SHALL guardarse recortado y no se SHALL separar en nombre y apellido.

#### Scenario: Datos válidos
- **WHEN** se envía un cliente con nombre completo y un email con formato válido, por ejemplo `nuevo.cliente@example.com`
- **THEN** esos campos se consideran válidos y el alta continúa con la validación de unicidad

#### Scenario: Nombre vacío
- **WHEN** el nombre completo está vacío o contiene solo espacios
- **THEN** el sistema muestra un error junto al campo de nombre y no agrega el cliente

#### Scenario: Email vacío
- **WHEN** el email está vacío o contiene solo espacios
- **THEN** el sistema muestra un error junto al campo de email y no agrega el cliente

#### Scenario: Email con formato inválido
- **WHEN** el email no contiene `@`, no tiene dominio o no tiene punto con extensión, por ejemplo `ana@example` o `ana.example.com`
- **THEN** el sistema muestra un error de formato junto al campo de email y no agrega el cliente

### Requirement: Unicidad del email normalizado

El email SHALL normalizarse con `trim` y minúsculas antes de comparar y antes de guardarse. El alta SHALL rechazar un email cuyo valor normalizado coincida con el de otro cliente existente.

#### Scenario: Email existente con mayúsculas y espacios
- **WHEN** se intenta dar de alta `  ANA.GOMEZ@EXAMPLE.COM  ` y ya existe `ana.gomez@example.com`
- **THEN** el sistema muestra el error «El email ya está registrado», marca el campo como inválido y no agrega el cliente

#### Scenario: Email nuevo
- **WHEN** el email normalizado no coincide con ningún cliente existente
- **THEN** la validación de unicidad pasa y el alta continúa

#### Scenario: Email normalizado al guardar
- **WHEN** se da de alta un email con mayúsculas o espacios extremos
- **THEN** el cliente se guarda con el email recortado y en minúsculas

### Requirement: Persistencia con identificador cli-N

Un alta válida SHALL generar un identificador `cli-N` con el mayor sufijo numérico existente más uno, agregar el cliente a la colección local y persistir la colección completa en `tuco:clientes`. El registro SHALL contener `id`, `nombreCompleto` y `email`.

#### Scenario: Primer alta después del seed
- **WHEN** se da de alta un cliente válido con los 3 clientes del seed presentes
- **THEN** el cliente se guarda con el identificador `cli-4` y la clave `tuco:clientes` contiene 4 registros

#### Scenario: Alta sucesiva
- **WHEN** se da de alta otro cliente válido después del anterior
- **THEN** el nuevo cliente recibe `cli-5` y no se reutiliza ningún identificador

#### Scenario: Persistencia entre recargas
- **WHEN** se recarga `clientes.html` después de un alta válida
- **THEN** el cliente agregado sigue presente en el listado y en `tuco:clientes`

#### Scenario: Disponibilidad para otras vistas
- **WHEN** otra vista lee la colección `tuco:clientes` después del alta
- **THEN** encuentra el cliente nuevo con su identificador y su email normalizado

### Requirement: Listado de clientes sin recarga

Después de un alta válida, el sistema SHALL volver a renderizar el listado de clientes en la misma página sin recargar el documento. Cada fila SHALL mostrar nombre completo y email, insertados como texto, y el listado SHALL ocultar el mensaje de lista vacía cuando existan clientes.

#### Scenario: Cliente visible tras el alta
- **WHEN** un alta válida finaliza
- **THEN** la tabla de clientes registrados muestra una fila nueva con el nombre y el email, sin que la página se recargue

#### Scenario: Mensaje de lista vacía
- **WHEN** el listado pasa de vacío a tener al menos un cliente
- **THEN** el mensaje «Todavía no hay clientes registrados» queda oculto

#### Scenario: Datos como texto
- **WHEN** un nombre o email contiene caracteres especiales
- **THEN** se muestran literalmente como texto y no se interpretan como HTML

### Requirement: Feedback de validación y éxito

Ante un envío inválido, el sistema SHALL no persistir el cliente, SHALL mostrar un mensaje de texto junto a cada campo inválido, SHALL marcar esos campos con `aria-invalid="true"` y SHALL mostrar un resumen al inicio del formulario. Ante un alta válida, SHALL mostrar un mensaje de éxito y SHALL limpiar el formulario. El envío SHALL controlarse con `preventDefault` para evitar la recarga.

#### Scenario: Errores por campo y resumen
- **WHEN** se envía el formulario con nombre vacío y email con formato inválido
- **THEN** ambos campos muestran su error con texto, quedan con `aria-invalid="true"` y el resumen del inicio lista los dos problemas

#### Scenario: Envío inválido sin persistencia
- **WHEN** el formulario tiene al menos un error de validación
- **THEN** la colección `tuco:clientes` no cambia y el listado no incorpora el cliente

#### Scenario: Alta correcta
- **WHEN** todas las validaciones pasan
- **THEN** se muestra un mensaje de éxito, el formulario queda limpio y el foco queda disponible para una nueva carga

#### Scenario: Sin recarga de la página
- **WHEN** se envía el formulario de alta
- **THEN** la URL no cambia, no aparecen parámetros de consulta y la página no se recarga
