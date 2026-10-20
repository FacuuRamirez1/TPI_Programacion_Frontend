# persistencia-local Specification

## Purpose
Provee una capa de almacenamiento local versionada para la Librería TU-CO que garantiza inicialización de seed solo en el primer arranque, creación de colecciones vacías cuando el esquema ya existe, escritura atómica por colección, y manejo de fallas visible al usuario con opción de reinicio selectivo de la colección afectada.

## Requirements

### Requirement: Versión de esquema en localStorage
El sistema SHALL persistir una clave `tuco:esquema` con valor `"1"` al completar la primera inicialización exitosa. La presencia de esta clave SHALL indicar que el seed ya fue aplicado y NO SHALL volver a aplicarse en cargas posteriores.

#### Scenario: Primera inicialización crea versión de esquema
- **WHEN** se abre la aplicación por primera vez (sin `tuco:esquema` en localStorage)
- **THEN** se inicializan todas las colecciones con el seed, se persiste `tuco:esquema = "1"` y las colecciones quedan disponibles

#### Scenario: Cargas posteriores no reaplican seed
- **WHEN** se abre la aplicación y `tuco:esquema = "1"` ya existe
- **THEN** se leen las colecciones desde localStorage y NO se sobrescriben con el seed

### Requirement: Inicialización de colecciones faltantes con esquema existente
Cuando `tuco:esquema = "1"` existe pero una colección individual falta en localStorage, el sistema SHALL crear esa colección como arreglo vacío (no con seed) y persistirla bajo su clave `tuco:*`.

#### Scenario: Colección faltante con esquema creado se inicializa vacía
- **WHEN** `tuco:esquema = "1"` existe pero `tuco:libros` no está en localStorage
- **THEN** se crea `tuco:libros = []`, se persiste y la aplicación continúa sin error

### Requirement: Escritura atómica por colección
Cada operación de escritura SHALL reemplazar la colección completa bajo su clave `tuco:*` (no hacer merge parcial). La lectura SHALL devolver una copia defensiva para evitar mutaciones accidentales del estado persistido.

#### Scenario: Escribir colección reemplaza completamente el contenido anterior
- **WHEN** se llama `escribirColeccion("libros", nuevaLista)`
- **THEN** `localStorage.setItem("tuco:libros", JSON.stringify(nuevaLista))` se ejecuta y una lectura posterior devuelve exactamente `nuevaLista`

### Requirement: Manejo de falla por cuota de localStorage agotada
Si una operación de escritura falla por `QuotaExceededError` o cuota agotada, el sistema SHALL mostrar un mensaje visible al usuario (no solo consola), SHALL NO confirmar la operación, y SHALL dejar los datos en memoria consistentes.

#### Scenario: Cuota agotada al guardar muestra mensaje y no confirma
- **WHEN** `localStorage.setItem` lanza `QuotaExceededError` al guardar una colección
- **THEN** se muestra un mensaje visible al usuario (ej. "No hay espacio en el almacenamiento local. La operación no se guardó."), la operación no se confirma y los datos en memoria no cambian

### Requirement: Manejo de falla por JSON corrupto en lectura
Si al leer una colección el JSON parseado es inválido, el sistema SHALL mostrar un mensaje visible al usuario, SHALL ofrecer la opción de reiniciar **solo esa colección** a estado vacío (no borrado automático de todo), y SHALL permitir continuar con el resto de la aplicación.

#### Scenario: JSON corrupto ofrece reinicio selectivo
- **WHEN** `JSON.parse(localStorage.getItem("tuco:clientes"))` lanza SyntaxError
- **THEN** se muestra mensaje visible (ej. "Datos de clientes corruptos. ¿Reiniciar solo esta colección?"), el usuario puede confirmar reinicio de solo `tuco:clientes = []`, y las demás colecciones no se afectan

### Requirement: Manejo de falla por localStorage no disponible
Si `localStorage` no está disponible (modo privado, bloqueado por política), el sistema SHALL operar en memoria con el seed, SHALL mostrar un mensaje visible informando que los cambios no persistirán, y SHALL NO romper la aplicación.

#### Scenario: localStorage bloqueado opera en memoria con aviso
- **WHEN** `localStorage` lanza SecurityError o devuelve null al intentar acceder
- **THEN** la aplicación usa el seed en memoria, muestra aviso visible ("El almacenamiento local no está disponible. Los datos no se guardarán al recargar.") y todas las funcionalidades siguen operativas en la sesión actual
