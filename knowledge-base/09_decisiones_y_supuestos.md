# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Aplicación multipágina con HTML en la raíz
**Decisión**: cada vista es una página HTML independiente en la raíz del proyecto (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `venta-detalle.html`).
**Contexto**: la consigna permite páginas separadas o secciones de una misma página.
**Alternativas consideradas**: single-page con secciones; HTML dentro de `pages/` o `src/`.
**Justificación**: navegación clara, evaluación simple por vista y rutas relativas cortas.
**Trade-offs aceptados**: el encabezado y la navegación se repiten en cada HTML.

### DD-02 — Scripts clásicos con namespace en lugar de módulos ES
**Decisión**: usar archivos JS cargados con `<script defer>` que exponen su API en `window.TUCO`.
**Contexto**: la entrega debe abrirse directamente desde `index.html`, sin npm ni servidor.
**Alternativas consideradas**: módulos ES (bloqueados por CORS en `file://`); un único `app.js` (pierde separación por dominio).
**Justificación**: mantiene la separación por dominio y funciona con doble clic.
**Trade-offs aceptados**: no hay `import`/`export`; el orden de carga debe cuidarse y el namespace es global.

### DD-03 — Identificadores legibles
**Decisión**: IDs con prefijo y secuencia numérica (`edi-1`, `gen-1`, `aut-1`, `lib-1`, `cli-1`, `ven-1`).
**Contexto**: los datos se inspeccionan a mano en `localStorage` durante la comprobación del precio histórico.
**Alternativas consideradas**: UUID; slugs.
**Justificación**: legibles, estables y fáciles de referenciar en el README y en las pruebas manuales.
**Trade-offs aceptados**: requieren una función que calcule el siguiente número.

### DD-04 — Claves separadas de `localStorage` con versión de esquema
**Decisión**: una clave por colección (`tuco:libros`, `tuco:clientes`, `tuco:ventas`, etc.) y `tuco:esquema` con la versión `"1"`.
**Contexto**: la comprobación del precio histórico exige modificar solo el catálogo sin tocar las ventas.
**Alternativas consideradas**: una única clave con todo el estado.
**Justificación**: permite editar `tuco:libros` de forma aislada y detectar el primer inicio con una sola clave.
**Trade-offs aceptados**: varias escrituras por operación y riesgo de desincronización entre claves.

### DD-05 — Snapshot histórico en la venta
**Decisión**: cada renglón guarda `titulo`, `precioUnitario` y `subtotal`; la venta guarda `clienteNombre` y `total`.
**Contexto**: el precio del catálogo puede cambiar después de confirmar.
**Alternativas consideradas**: leer siempre el precio actual del libro.
**Justificación**: cumple la inmutabilidad del historial y la comprobación del precio histórico.
**Trade-offs aceptados**: duplicación controlada de datos descriptivos.

### DD-06 — Verificación solo con casos manuales
**Decisión**: no se incorporan pruebas automatizadas ni test runners; se documentan casos manuales reproducibles en el README.
**Contexto**: la consigna exige casos manuales y prohíbe dependencias/build en la entrega.
**Alternativas consideradas**: Node test runner solo en desarrollo.
**Justificación**: cumple el alcance y evita agregar herramientas que no se entregan.
**Trade-offs aceptados**: la evidencia depende de la ejecución manual y de su registro.

### DD-07 — Formatos es-AR
**Decisión**: moneda con `Intl.NumberFormat('es-AR')` (`$ 12.500,00`) y fechas `dd/mm/aaaa`.
**Contexto**: el público y la cátedra son argentinos.
**Alternativas consideradas**: formato genérico con punto decimal o ISO.
**Justificación**: coherencia con el contexto y legibilidad.
**Trade-offs aceptados**: el formato depende del soporte de `Intl` del navegador.

### DD-08 — Autores con `<select multiple>`
**Decisión**: el alta de libros usa un `<select multiple>` para autores.
**Contexto**: la consigna admite selector múltiple o controles equivalentes.
**Alternativas consideradas**: checkboxes.
**Justificación**: un solo control, fácil de validar y de generar desde los datos locales.
**Trade-offs aceptados**: la selección múltiple requiere indicar al usuario cómo seleccionar varios autores.

### DD-09 — Portadas en `assets/portadas/`
**Decisión**: las imágenes locales viven en `assets/portadas/`; mientras no existan, se usan placeholders.
**Contexto**: la entrega exige recursos locales y declarar la procedencia de imágenes ajenas.
**Alternativas consideradas**: `public/` (sin significado especial sin build); portadas solo con CSS.
**Justificación**: `assets/` es la convención del proyecto y no requiere servidor.
**Trade-offs aceptados**: hay que incorporar los archivos y documentar su origen.

### DD-10 — Detalle de venta en página propia
**Decisión**: el detalle se abre en `venta-detalle.html?id=ven-N`.
**Contexto**: el historial debe permitir consultar los renglones.
**Alternativas consideradas**: modal o sección expandible en el historial.
**Justificación**: separa la vista, simplifica el render y permite enlazar una venta concreta.
**Trade-offs aceptados**: una página más y lectura de query string.

### DD-11 — «Sin clasificar» como `generoId: null`
**Decisión**: la ausencia de género se representa con `null`, no con un género ficticio.
**Contexto**: el género es opcional y debe mostrarse «Sin clasificar».
**Alternativas consideradas**: género `gen-0` «Sin clasificar».
**Justificación**: modela correctamente la ausencia y evita que un género ficticio se pueda asignar desde el selector.
**Trade-offs aceptados**: el render debe contemplar `null`.

### DD-12 — Seed mínimo de la consigna
**Decisión**: 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios.
**Contexto**: la consigna fija esos mínimos.
**Alternativas consideradas**: un seed más amplio.
**Justificación**: cumple el mínimo y facilita las pruebas manuales.
**Trade-offs aceptados**: pocos datos para probar filtros y ventas; se pueden agregar más por la interfaz.

### DD-13 — Fecha ISO almacenada, fecha local mostrada
**Decisión**: `fecha` se guarda con `toISOString()` y se muestra como `dd/mm/aaaa`; el detalle puede mostrar también la hora.
**Contexto**: se necesita un valor estable para ordenar y mostrar.
**Alternativas consideradas**: guardar directamente `dd/mm/aaaa`.
**Justificación**: ISO es inequívoca y fácil de formatear.
**Trade-offs aceptados**: hay que formatear en cada vista.

### DD-14 — Sin frameworks, build ni red
**Decisión**: solo HTML, CSS y JavaScript nativos, con recursos locales.
**Contexto**: restricción explícita de la consigna.
**Alternativas consideradas**: ninguna viable dentro del alcance.
**Justificación**: cumple la restricción y mantiene la entrega portable.
**Trade-offs aceptados**: más código manual para render y eventos.

### DD-15 — Filtro en vivo
**Decisión**: el filtro del catálogo se aplica en el evento `input`, sin botón de búsqueda.
**Contexto**: la consigna pide un buscador por título.
**Alternativas consideradas**: búsqueda al enviar un formulario.
**Justificación**: respuesta inmediata y menos pasos.
**Trade-offs aceptados**: se re-renderiza en cada tecla; el volumen de datos es pequeño.

## Supuestos inferidos

### SU-01 — La cátedra acepta la entrega incremental por ejercicio
**Supuesto**: se puede construir y entregar el TPI en 6 changes secuenciales.
**Origen**: la consigna describe etapas de trabajo y la organización del proyecto.
**Riesgo si es falso**: habría que reagrupar los changes o entregar todo junto.
**Cómo validar**: confirmar con el docente las fechas y la modalidad de entrega.

### SU-02 — Las portadas se incorporarán más adelante
**Supuesto**: el usuario agregará imágenes locales en `assets/portadas/`; hasta entonces se usan placeholders.
**Origen**: decisión del relevamiento.
**Riesgo si es falso**: el catálogo se vería sin portadas o con placeholders definitivos.
**Cómo validar**: confirmar los archivos y su procedencia antes del cierre.

### SU-03 — `localStorage` está disponible y alcanza
**Supuesto**: el navegador permite `localStorage` y el volumen de datos es muy inferior a la cuota habitual (5 MB).
**Origen**: la consigna exige persistencia local.
**Riesgo si es falso**: las altas y ventas no persisten; se informa el error.
**Cómo validar**: probar en el navegador de entrega y en modo incógnito.

### SU-04 — Navegador moderno
**Supuesto**: se usa un navegador con soporte de `Intl`, Flexbox, Grid y `defer`.
**Origen**: el alcance no exige compatibilidad con navegadores antiguos.
**Riesgo si es falso**: formatos o layout degradados.
**Cómo validar**: abrir en Chrome/Edge/Firefox actuales.

### SU-05 — Un solo operador a la vez
**Supuesto**: no hay concurrencia real; si se abren dos pestañas, la última escritura gana.
**Origen**: aplicación local sin backend.
**Riesgo si es falso**: pérdida de datos entre pestañas.
**Cómo validar**: documentar la limitación en el README.

### SU-06 — Los datos son ficticios
**Supuesto**: no se cargan datos personales reales ni información sensible.
**Origen**: consigna y seed de ejemplo.
**Riesgo si es falso**: exposición de datos en `localStorage`.
**Cómo validar**: revisar el seed y las altas antes de la entrega.

### SU-07 — Apertura directa desde `file://`
**Supuesto**: la cátedra abre `index.html` directamente, sin servidor.
**Origen**: requisito de entrega sin npm.
**Riesgo si es falso**: se podría usar un servidor local, pero no es necesario con scripts clásicos.
**Cómo validar**: probar el zip descomprimido con doble clic en los navegadores objetivo.
