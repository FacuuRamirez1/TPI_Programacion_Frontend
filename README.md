# Librería TU-CO — Trabajo Práctico Integrador

## Integrantes

- Facundo Ramirez
- Facundo Deseff
- Santino Godoy
- Matías Vargas

---

## Cómo abrir la aplicación

1. Descargar o clonar el repositorio.
2. Abrir el archivo `index.html` con **doble clic** (se abre vía `file://`).
3. **No requiere** servidor web, Node.js, npm, build ni instalación de dependencias.
4. La aplicación funciona completamente en el navegador usando `localStorage` para persistencia.

---

## Navegación entre vistas

La aplicación tiene 6 páginas accesibles desde la barra de navegación superior:

| Vista | Archivo | Descripción |
|-------|---------|-------------|
| **Catálogo** | `index.html` | Listado de libros con buscador por título |
| **Libros** | `libros.html` | Alta de libros y listado de libros registrados |
| **Clientes** | `clientes.html` | Alta de clientes y listado de clientes registrados |
| **Ventas** | `ventas.html` | Composición y confirmación de ventas |
| **Historial** | `historial.html` | Listado de ventas confirmadas con enlace a detalle |
| **Detalle de venta** | `venta-detalle.html` | Vista de solo lectura de una venta (renglones, precios históricos) |

Todas las vistas comparten el mismo encabezado y barra de navegación. El enlace de la vista actual se marca con `aria-current="page"`.

---

## Funcionalidades implementadas

| ID | Historia de usuario | Descripción | Estado |
|----|---------------------|-------------|--------|
| US-001 | Como operador, quiero ver el catálogo con buscador por título | Filtro en vivo, trim, case-insensitive, parcial, vacío = todo, mensaje sin resultados | ✅ |
| US-002 | Como operador, quiero dar de alta libros | Título, ISBN único, precio > 0, editorial, género opcional, autores (múltiples) | ✅ |
| US-003 | Como operador, quiero dar de alta clientes | Nombre completo, email válido y único (case-insensitive) | ✅ |
| US-004 | Como operador, quiero componer una venta | Cliente, renglones (libro + cantidad), subtotales, total en vivo, editar/quitar renglones | ✅ |
| US-005 | Como operador, quiero confirmar una venta | Snapshot de título y precio unitario, identificador `ven-N`, fecha ISO, total, inmutable | ✅ |
| US-006 | Como operador, quiero consultar el historial | Tabla con id, fecha `dd/mm/aaaa`, cliente, total, orden descendente, enlace a detalle | ✅ |
| US-007 | Como operador, quiero ver el detalle de una venta | Renglones con valores históricos (no relee catálogo actual), mensaje si id inválido | ✅ |
| US-008 | Como operador, quiero que los datos persistan al recargar | `localStorage` con claves `tuco:*`, versión de esquema, seed solo primer inicio | ✅ |
| US-009 | Como visitante, quiero consultar el catálogo sin autenticación | Acceso público a `index.html`, buscador funcional | ✅ |
| US-010 | Validaciones de libro en alta | Título/ISBN no vacíos, ISBN único (sin espacios/guiones), precio numérico > 0, editorial existente, ≥1 autor, autores existentes, género opcional válido | ✅ |
| US-011 | Validaciones de cliente en alta | Nombre/email no vacíos, email válido, email único (trim + lowercase) | ✅ |
| US-012 | Validaciones de venta | Cliente existente, ≥1 renglón, libro existente, cantidad entera > 0, sin libro repetido, subtotal = cant × precio, total = suma subtotales, 2 decimales | ✅ |
| US-013 | Inmutabilidad de historial | Precio unitario copiado al confirmar, no se relee del catálogo, sin edición/borrado de ventas | ✅ |
| US-014 | Accesibilidad | Controles nativos, `:focus-visible`, labels asociados, `alt` en imágenes, `th scope="col"`, errores con texto + `aria-invalid`/`aria-describedby`, `role="status"`/`aria-live` | ✅ |

---

## Funcionalidades pendientes / ausentes (fuera de alcance del TPI)

- Gestión de stock (decremento al vender, alertas, reposición)
- Cobros, facturación fiscal, medios de pago
- API, base de datos, backend, servidor
- Login real, autenticación, roles/permisos
- `fetch` / XHR / comunicación de red
- ABM de editoriales, géneros, autores (solo seed fijo)
- Edición o eliminación de libros, clientes o ventas confirmadas
- Dígito verificador de ISBN (solo unicidad normalizada)
- Pantalla para editar precios del catálogo

---

## Estructura del seed (datos iniciales)

El seed se carga **una sola vez** en el primer inicio (cuando no existe `tuco:esquema` en `localStorage`). Al recargar, se recuperan los datos guardados sin duplicar el seed.

### Editoriales (`tuco:editoriales`)

| ID | Nombre |
|----|--------|
| `edi-1` | Editorial Sudamericana |
| `edi-2` | Anagrama |
| `edi-3` | Alfaguara |

### Géneros (`tuco:generos`)

| ID | Nombre |
|----|--------|
| `gen-1` | Novela |
| `gen-2` | Cuento / Ficción |
| `gen-3` | Cuento / Horror |
| `gen-4` | Novela policial |

### Autores (`tuco:autores`)

| ID | Nombre | Apellido |
|----|--------|----------|
| `aut-1` | Jorge Luis | Borges |
| `aut-2` | Julio | Cortázar |
| `aut-3` | Gabriel García | Márquez |
| `aut-4` | Ernesto | Sabato |
| `aut-5` | Mariana | Enríquez |
| `aut-6` | Claudia | Piñeiro |

### Libros (`tuco:libros`)

| ID | Título | ISBN | Precio | Editorial | Género | Autores |
|----|--------|------|--------|-----------|--------|---------|
| `lib-1` | Ficciones | 978-950-07-0015-3 | $15.500,00 | edi-1 | gen-2 | aut-1 |
| `lib-2` | Rayuela | 978-950-07-0365-9 | $18.900,00 | edi-1 | gen-1 | aut-2 |
| `lib-3` | Cien años de soledad | 978-950-07-0098-6 | $21.500,00 | edi-1 | gen-1 | aut-3 |
| `lib-4` | El túnel | 978-950-07-0118-1 | $13.200,00 | edi-1 | gen-1 | aut-4 |
| `lib-5` | Las cosas que perdimos en el fuego | 978-987-3951-09-1 | $16.800,00 | edi-2 | gen-3 | aut-5 |
| `lib-6` | Catedrales | 978-987-738-706-3 | $19.700,00 | edi-3 | gen-4 | aut-6 |

### Clientes (`tuco:clientes`)

| ID | Nombre completo | Email |
|----|-----------------|-------|
| `cli-1` | Ana Gómez | ana.gomez@example.com |
| `cli-2` | Bruno Díaz | bruno.diaz@example.com |
| `cli-3` | Carla Ruiz | carla.ruiz@example.com |

### Ventas (`tuco:ventas`)

Inicialmente vacía. Se pobla al confirmar ventas desde `ventas.html`. Cada venta tiene:
- `id`: `ven-N` (incremental)
- `fecha`: ISO string (`new Date().toISOString()`)
- `clienteId`, `clienteNombre` (snapshot)
- `total`: número (suma de subtotales)
- `renglones[]`: cada uno con `libroId`, `titulo` (snapshot), `cantidad`, `precioUnitario` (snapshot), `subtotal`

---

## Claves y límites de localStorage

| Clave | Descripción |
|-------|-------------|
| `tuco:esquema` | Versión del esquema (`"1"`). Indica que el seed ya se aplicó. |
| `tuco:editoriales` | Array de editoriales (seed + altas) |
| `tuco:generos` | Array de géneros (solo seed) |
| `tuco:autores` | Array de autores (solo seed) |
| `tuco:libros` | Array de libros (seed + altas) |
| `tuco:clientes` | Array de clientes (seed + altas) |
| `tuco:ventas` | Array de ventas confirmadas (inmutables) |

**Límites:**
- Cuota típica de `localStorage`: **~5 MB** por origen (navegador + perfil + ruta).
- En modo privado (Safari, Firefox con `dom.storage.enabled=false`) o si la cuota se agota, la aplicación entra en **modo memoria**: funciona en la sesión actual pero **no persiste** al recargar. Se muestra un aviso visible.
- Si una colección tiene JSON corrupto, se ofrece **reiniciar solo esa colección** (no borrado automático total).

---

## Procedencia de imágenes

Las portadas de los libros se encuentran en `assets/portadas/`:

| Archivo | Libro | Procedencia |
|---------|-------|-------------|
| `Ficciones.webp` | Ficciones | <https://www.penguinrandomhouse.com/books/16193/ficciones-by-jorge-luis-borges-introduction-by-john-sturrock/> — Penguin Random House — Uso educativo (fair use) |
| `Rayuela.webp` | Rayuela | <https://www.lecturalia.com/libro/8229/rayuela> — Lecturalia — Uso educativo (fair use) |
| `Cien-anos-de-soledad.webp` | Cien años de soledad | <https://www.buscalibre.com.ar/libro-cien-anos-de-soledad/9789588886213/p/46863379> — Buscalibre — Uso educativo (fair use) |
| `el-tunel.webp` | El túnel | <https://www.planetadelibros.com/libro-el-tunel-edicion-conmemorativa/270027> — Planeta de Libros — Uso educativo (fair use) |
| `Las-cosas-que-perdimos-en-el-fuego.webp` | Las cosas que perdimos en el fuego | <https://www.buscalibre.com.ar/libro-las-cosas-que-perdimos-en-el-fuego/9788433998064/p/47247747> — Buscalibre — Uso educativo (fair use) |
| `Catedrales.webp` | Catedrales | <https://www.libreriaalberti.com/libros/catedrales/9788420455594/> — Librería Alberti — Uso educativo (fair use) |
| `portada-placeholder.svg` | Fallback genérico | SVG inline creado por el equipo del proyecto — Dominio público |



---

## Casos manuales de cierre

| Caso | Pasos | Resultado esperado | Resultado observado | Evidencia |
|------|-------|-------------------|---------------------|-----------|
| **Recarga sin duplicar seed** | 1. Abrir `index.html` (primer vez) → 2. Dar alta 1 libro en `libros.html` → 3. Dar alta 1 cliente en `clientes.html` → 4. Confirmar 1 venta en `ventas.html` → 5. Recargar `index.html` (F5) | El catálogo muestra los 7 libros (6 seed + 1 alta). No hay 12 libros. `tuco:esquema = "1"`. | ✅ **2026-10-20** Catálogo 7 libros (6 seed + 1 alta). `tuco:esquema = "1"` confirmado en DevTools | localStorage Application |
| **Inmutabilidad de precios en ventas** | 1. Confirmar una venta con un libro a $15.500,00 → 2. En DevTools Application → localStorage → `tuco:libros`, cambiar el precio de ese libro a $20.000,00 → 3. Abrir `historial.html` → 4. Click "Ver detalle" de esa venta | El detalle muestra precio unitario $15.500,00 (histórico), no $20.000,00. Subtotales y total coinciden con la confirmación original. | ✅ **2026-10-20** Detalle muestra $15.500,00 histórico. Subtotales y total intactos | localStorage edit + historial.html |
| **Navegación por teclado** | 1. Abrir `index.html` → 2. `Tab` para recorrer: saltar a contenido, nav (5 enlaces), buscador, tarjetas → 3. `Enter` en enlaces de nav → 4. `Escape` no aplica (sin modales) | Todos los elementos interactivos alcanzables y operables. Foco visible en cada paso (`outline` 3px). Orden lógico. | ✅ **2026-10-20** Tab recorre: salto → nav (5) → buscador → **tarjetas alcanzadas** (foco visible en cada una). Fix: `tabindex="0"` en tarjetas | DevTools Elements + teclado |
| **Responsive 320px** | 1. Abrir DevTools → Device Toolbar → 320px width → 2. Recorrer las 6 vistas | Sin scroll horizontal global. Tablas con scroll interno (`overflow-x: auto`). Controles legibles (≥44px altura). Texto no truncado. | ✅ **2026-10-20** Sin scroll horizontal global. Tablas con scroll interno. Controles ≥44px | Device Toolbar 320px |
| **Responsive 1280px** | 1. Abrir DevTools → Device Toolbar → 1280px width → 2. Recorrer las 6 vistas | Layout en grilla/columnas según diseño. Sin scroll horizontal. Aprovecha ancho disponible. | ✅ **2026-10-20** Layout grilla/columnas. Sin scroll horizontal. Aprovecha ancho | Device Toolbar 1280px |
| **Alta libro válida** | 1. `libros.html` → 2. Completar todos los campos válidos → 3. Submit | Libro aparece en listado y catálogo. Mensaje de éxito. Formulario se limpia. | ✅ **2026-10-20** Libro aparece en listado y catálogo. Mensaje éxito. Formulario limpio | libros.html + index.html |
| **Alta libro ISBN duplicado** | 1. `libros.html` → 2. Ingresar ISBN de libro existente (ej. `978-950-07-0015-3`) → 3. Submit | Error visible: "El ISBN ya existe". No se registra. | ✅ **2026-10-20** Error "El ISBN ya existe". No se registra duplicado | libros.html |
| **Alta cliente email duplicado** | 1. `clientes.html` → 2. Ingresar `ana.gomez@example.com` (mayúsculas/minúsculas indistinto) → 3. Submit | Error visible: "El email ya está registrado". No se registra. | ✅ **2026-10-20** Error "El email ya está registrado" (case-insensitive). No se registra | clientes.html |
| **Venta con libro repetido** | 1. `ventas.html` → 2. Agregar renglón libro A → 3. Intentar agregar mismo libro A | Cantidad del renglón existente se incrementa / mensaje "El libro ya está en la venta". No se duplica. | ✅ **2026-10-20** Cantidad se incrementa en renglón existente. No se duplica fila | ventas.html |
| **Venta sin renglones** | 1. `ventas.html` → 2. Sin agregar renglones, click "Confirmar venta" | Error visible: "Agregue al menos un renglón". No se confirma. | ✅ **2026-10-20** Error "Agregue al menos un renglón". No se confirma venta | ventas.html |
| **Detalle venta id inexistente** | 1. Abrir `venta-detalle.html?id=ven-999` | Mensaje de error visible. Enlace "Volver al historial" funcional. | ✅ **2026-10-20** Error visible. Enlace "Volver al historial" funciona | venta-detalle.html |
| **Búsqueda catálogo vacía** | 1. `index.html` → 2. Vaciar buscador (solo espacios) → 3. Enter | Catálogo completo (6 libros). Sin mensaje "sin resultados". | ✅ **2026-10-20** Catálogo completo (6+ libros). Sin mensaje "sin resultados" | index.html |
| **Búsqueda sin coincidencias** | 1. `index.html` → 2. Buscar "xyzzz" → 3. Enter | Mensaje "No se encontraron libros para el título buscado." visible. | ✅ **2026-10-20** Mensaje "No se encontraron libros para el título buscado." visible | index.html |

> **Regla**: No declarar ✅ sin haber ejecutado el caso y verificado el resultado observado real.

---

## Verificación final de restricciones

- ✅ **Sin librerías/frameworks**: Solo HTML5, CSS3, JavaScript nativo (ES2020)
- ✅ **Sin CDN**: Todos los recursos son locales (`css/`, `js/`, `assets/`)
- ✅ **Sin `fetch`/`import`/`export`**: Scripts clásicos con `defer`, namespace `window.TUCO`
- ✅ **Sin build/npm**: No hay `package.json`, `node_modules`, `webpack`, `vite`, etc.
- ✅ **Entrega directa**: Carpeta/zip se abre con doble clic en `index.html`
- ✅ **Persistencia**: Solo `localStorage` con claves `tuco:*`
- ✅ **Formato moneda/fecha**: `Intl.NumberFormat('es-AR')` y `dd/mm/aaaa`
- ✅ **IDs**: Prefijos `edi-N`, `gen-N`, `aut-N`, `lib-N`, `cli-N`, `ven-N`

---

## Estructura del proyecto

```
.
├── index.html              # Catálogo (entrada)
├── libros.html             # Alta + listado libros
├── clientes.html           # Alta + listado clientes
├── ventas.html             # Composición + confirmación venta
├── historial.html          # Listado ventas confirmadas
├── venta-detalle.html      # Detalle histórico de venta
├── css/
│   └── estilos.css         # Hoja de estilos única
├── js/
│   ├── datos-iniciales.js  # Seed (TUCO.datosIniciales)
│   ├── almacenamiento.js   # Capa localStorage v2 (esquema, seed-una-vez, fallas)
│   ├── formato.js          # formatearMoneda (es-AR), formatearFecha (dd/mm/aaaa)
│   ├── validaciones.js     # Funciones puras de validación
│   ├── catalogo.js         # Render catálogo + filtro
│   ├── libros.js           # Alta libros
│   ├── clientes.js         # Alta clientes
│   ├── ventas.js           # Composición + confirmación venta
│   ├── historial.js        # Listado historial
│   └── venta-detalle.js    # Detalle de venta
├── assets/
│   └── portadas/           # Imágenes .webp de portadas
├── openspec/               # OpenSpec changes (C-01 a C-06)
├── knowledge-base/         # Documentación del dominio (10 archivos)
├── CHANGES.md              # Roadmap de 6 changes
├── CLAUDE.md               # Instrucciones para agentes
├── AGENTS.md               # Instrucciones para agentes (copia)
└── README.md               # Este archivo
```

---

## Licencia / Uso académico

Trabajo Práctico Integrador — Programación III (Frontend) — Universidad / Institución correspondiente. Uso educativo.