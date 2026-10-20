# Spec Delta

## MODIFIED Requirements

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