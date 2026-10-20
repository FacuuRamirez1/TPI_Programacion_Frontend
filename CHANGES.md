# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Librería TU-CO (TPI Frontend)**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

Alcance: TPI completo (ejercicios 1 a 6). Un change por ejercicio, con dependencia estrictamente secuencial 1 → 6. No hay changes de infraestructura: el proyecto no tiene backend, build, dependencias ni variables de entorno.

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 estructura-pantallas-html          ← Ejercicio 1: vistas y navegación
  └── C-02 presentacion-css-adaptable   ← Ejercicio 2: identidad visual y responsive
        └── C-03 datos-locales-catalogo-filtro   ← Ejercicio 3: seed, render y filtro
              └── C-04 altas-libros-clientes     ← Ejercicio 4: formularios y validaciones
                    └── C-05 venta-simulada-historial   ← Ejercicio 5: venta, historial y detalle
                          └── C-06 persistencia-verificacion-documentacion   ← Ejercicio 6: cierre
```

No hay ramas: la consigna exige entregar los ejercicios en orden 1 → 6 y cada uno reutiliza las pantallas, estilos o datos del anterior.

### Paralelismo por fase

> Los gates existen como puntos de sincronización, no como forks: la dependencia secuencial impuesta por la consigna impide ejecutar dos changes a la vez.

```
GATE 0: ninguna
  → C-01 estructura-pantallas-html            [Agente A]

GATE 1: C-01 ✓
  → C-02 presentacion-css-adaptable           [Agente A]

GATE 2: C-02 ✓
  → C-03 datos-locales-catalogo-filtro        [Agente A]

GATE 3: C-03 ✓
  → C-04 altas-libros-clientes                [Agente A]

GATE 4: C-04 ✓
  → C-05 venta-simulada-historial             [Agente A]

GATE 5: C-05 ✓
  → C-06 persistencia-verificacion-documentacion   [Agente A]
```

> Sin forks: cada gate desbloquea exactamente un change.

### Camino crítico (6 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-04 → C-05 → C-06
```

Todos los changes son indispensables: la entrega es el TPI completo y cada ejercicio depende del anterior.

### Plan óptimo con 3 agentes

```
Paso │ Agente A (HTML/CSS/JS) │ Agente B │ Agente C
─────┼────────────────────────┼──────────┼──────────
  1  │ C-01 estructura-pantallas-html        │    —     │    —
  2  │ C-02 presentacion-css-adaptable       │    —     │    —
  3  │ C-03 datos-locales-catalogo-filtro    │    —     │    —
  4  │ C-04 altas-libros-clientes            │    —     │    —
  5  │ C-05 venta-simulada-historial         │    —     │    —
  6  │ C-06 persistencia-verificacion-documentacion │ — │    —
```

> No conviene paralelizar con 3 agentes: la secuencia 1 → 6 es una restricción del usuario y todas las tareas tocan los mismos archivos (`css/estilos.css`, `js/almacenamiento.js`, HTML de vistas). Un solo agente evita conflictos de merge y retrabajo de estilos.

---

## FASE 1 — Estructura y pantallas (Ejercicio 1)

### [C-01] `estructura-pantallas-html`
- **Estado**: `[x]` completado
- **Scope**: Maqueta navegable completa en HTML semántico, sin lógica de datos
  - Páginas: `index.html` (catálogo), `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `venta-detalle.html`
  - Estructura común: `header` con nombre de la librería, `nav` con los 5 enlaces y `aria-current="page"`, `main` por vista, `footer` opcional
  - `index.html`: buscador por título, contenedor del listado, mensaje de «sin resultados» y de lista vacía; cada tarjeta expone título, ISBN, editorial, género, autores y precio (maqueta estática o vacía)
  - `libros.html`: formulario con `titulo`, `isbn`, `precio`, `editorialId` (`select`), `generoId` (`select` con «Sin clasificar»), `autorIds` (`select multiple`) y botón «Registrar libro»; tabla de libros con `th scope="col"` y mensaje de lista vacía
  - `clientes.html`: formulario con `nombreCompleto`, `email` y botón «Registrar cliente»; tabla de clientes y mensaje de lista vacía
  - `ventas.html`: `select` de cliente, `select` de libro, `input` de cantidad, botón «Agregar renglón», tabla de renglones, total y botón «Confirmar venta»; contenedores de mensajes
  - `historial.html`: tabla de ventas (identificador, fecha, cliente, total) con enlace «Ver detalle» y mensaje de historial vacío
  - `venta-detalle.html`: contenedor de detalle, mensaje de venta inexistente y enlace de vuelta al historial
  - `assets/portadas/`: carpeta con placeholders y `alt` descriptivo para las imágenes informativas
  - Cada control con `<label for>`/`id`; mensajes con `role="status"` o `aria-live="polite"`; sin `innerHTML` con datos de usuario
  - Casos manuales: navegación entre las 6 vistas, foco por teclado, labels asociados, tablas con encabezados, mensajes visibles en listas vacías
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/02_descripcion_general.md` §Arquitectura general
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas
  - `knowledge-base/06_funcionalidades.md` §Épica 1 (US-001 a US-003)
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios
  - `knowledge-base/05_reglas_de_negocio.md` §RN-UI

---

## FASE 2 — Presentación adaptable (Ejercicio 2)

### [C-02] `presentacion-css-adaptable`
- **Estado**: `[x]` completado
- **Scope**: Identidad visual propia y responsive sobre las pantallas de C-01
  - `css/estilos.css` único (o dividido por responsabilidad) con variables CSS de color, tipografía, espaciado y radios
  - Componentes reutilizables: `.tarjeta`, `.formulario`, `.campo`, `.boton`, `.tabla`, `.mensaje`, `.badge`
  - Layout con Flexbox/Grid: `header` + `nav` + `main`, grilla de catálogo, formularios a una y dos columnas, tablas con contenedor `overflow-x: auto`
  - Media queries para 320 px y 1280 px; sin `overflow-x` global; tipografía y controles legibles en ambos anchos
  - Foco visible con `:focus-visible`; `aria-current="page"` estilizado; estilos de error con texto y borde, no solo color; `.visualmente-oculto` para texto accesible
  - Estados visuales: vacío, sin resultados, éxito, error y carga no aplica (sin red)
  - Casos manuales: 320 px y 1280 px sin scroll horizontal de página, tabla con scroll propio, recorrido completo por teclado con foco visible, errores legibles sin distinguir color
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 2 (US-004 a US-006)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-RES y §RN-UI
  - `knowledge-base/08_arquitectura_propuesta.md` §Reglas de render y DOM
  - `knowledge-base/02_descripcion_general.md` §Stack tecnológico
  - `knowledge-base/10_preguntas_abiertas.md` §IN-03 (imágenes y procedencia)

---

## FASE 3 — Datos locales y catálogo (Ejercicio 3)

### [C-03] `datos-locales-catalogo-filtro`
- **Estado**: `[x]` completado
- **Scope**: Modelo de datos, seed, render del catálogo y filtro por título
  - `js/datos-iniciales.js`: publica `TUCO.datosIniciales` con 2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes; IDs `edi-N`, `gen-N`, `aut-N`, `lib-N`, `cli-N`; `generoId: null` para «Sin clasificar»
  - `js/almacenamiento.js` v1: inicialización de colecciones, `leerColeccion`/`escribirColeccion`, generación del siguiente ID; única capa que conoce las claves `tuco:*` (la semántica de esquema y seed-único se completa en C-06)
  - `js/formato.js`: `formatearMoneda` con `Intl.NumberFormat('es-AR')` y `formatearFecha` `dd/mm/aaaa`
  - `js/catalogo.js`: render de tarjetas desde `tuco:libros` con `createElement` + `textContent`; resolución de editorial, género («Sin clasificar» si `null`) y autores; filtro en `input` con `trim`, minúsculas y coincidencia parcial; vacío = todo; sin coincidencias = mensaje
  - `index.html`: carga de `datos-iniciales.js`, `almacenamiento.js`, `formato.js`, `catalogo.js` con `defer`; contenedor de catálogo y de mensajes
  - Casos manuales: búsqueda parcial en mayúsculas, búsqueda vacía, texto inexistente, libro sin género, catálogo poblado desde el seed sin HTML hardcodeado
- **Dependencias**: C-02
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades y §Seed data inicial
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CAT
  - `knowledge-base/06_funcionalidades.md` §Épica 3 (US-007 a US-009)
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 y §Flujo 7
  - `knowledge-base/08_arquitectura_propuesta.md` §Responsabilidad de cada módulo

---

## FASE 4 — Altas de libros y clientes (Ejercicio 4)

### [C-04] `altas-libros-clientes`
- **Estado**: `[x]` completado
- **Scope**: Formularios de alta con validaciones y actualización del DOM sin recargar
  - `js/validaciones.js`: funciones puras de normalización y validación de libros, clientes y ventas
  - `js/libros.js`: `preventDefault`, lectura de campos, generación de `lib-N`, persistencia y re-render del listado; poblado de `select` de editorial, `select` de género con «Sin clasificar» (`value=""`) y `select multiple` de autores desde el seed
  - Reglas de libro: título e ISBN no vacíos; ISBN único al quitar espacios y guiones, case-insensitive; precio numérico > 0; editorial existente; al menos un autor; todos los autores existentes; género opcional pero existente
  - `js/clientes.js`: `preventDefault`, generación de `cli-N`, persistencia y re-render; email válido y único con `trim` + minúsculas
  - Errores por campo con texto, resumen al inicio del formulario y mensaje de éxito; limpieza del formulario tras alta válida
  - Actualización sin recarga de: listado de libros, catálogo (`index.html` en la siguiente visita o mismo documento si aplica), listado de clientes y selectores de `ventas.html`
  - Casos manuales: ISBN duplicado en distinto formato, ISBN nuevo, email inválido, email existente con mayúsculas, email nuevo, alta sin autores, precio cero/negativo/no numérico
- **Dependencias**: C-03
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Libro, §Cliente y §Estrategia de identificadores
  - `knowledge-base/05_reglas_de_negocio.md` §RN-LIB y §RN-CLI
  - `knowledge-base/06_funcionalidades.md` §Épica 4 (US-010, US-011)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2 y §Flujo 3
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones aplicados

---

## FASE 5 — Venta simulada e historial (Ejercicio 5)

### [C-05] `venta-simulada-historial`
- **Estado**: `[x]` completado
- **Scope**: Composición, confirmación inmutable, historial y detalle de venta
  - `js/ventas.js`: carga de clientes y libros, alta de renglones, edición de cantidad, eliminación de renglones, cálculo de subtotal y total en vivo
  - Reglas: cliente existente; libro existente; cantidad entera > 0; sin libros repetidos (modificar cantidad o informar duplicado); al menos un renglón; no confirmar con datos inválidos
  - Confirmación: snapshot de `titulo` y `precioUnitario` en cada renglón, `clienteNombre` y `total` en la venta; `ven-N` incremental; `fecha` ISO con `new Date().toISOString()`; persistencia en `tuco:ventas`; limpieza del formulario y mensaje de resultado
  - `js/historial.js`: tabla con identificador, fecha `dd/mm/aaaa`, cliente y total; mensaje de historial vacío; enlace a detalle
  - `js/venta-detalle.js`: lectura de `?id=ven-N`, render de renglones con valores históricos, mensaje y enlace de vuelta si el id falta o no existe
  - Inmutabilidad: ninguna acción de edición o borrado de ventas confirmadas en la UI
  - Casos manuales: venta sin cliente, cantidad 0/negativa/decimal, libro repetido, venta válida con 2 × 1500 + 1 × 2000 (subtotales 3000/2000, total 5000), detalle conservado tras recarga, id inexistente
- **Dependencias**: C-04
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Venta y §Renglón de venta
  - `knowledge-base/05_reglas_de_negocio.md` §RN-VEN y §RN-HIS
  - `knowledge-base/06_funcionalidades.md` §Épica 5 (US-012 a US-014)
  - `knowledge-base/07_flujos_principales.md` §Flujo 4, §Flujo 5 y §Flujo 6
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-05, §DD-10 y §DD-13

---

## FASE 6 — Persistencia, verificación y documentación (Ejercicio 6)

### [C-06] `persistencia-verificacion-documentacion`
- **Estado**: `[ ]` pendiente
- **Scope**: Cierre de persistencia, casos manuales observados y README de entrega
  - `js/almacenamiento.js` v2: `tuco:esquema = "1"`; seed solo en el primer inicio; al recargar se recuperan colecciones sin duplicar ejemplos; colección faltante con esquema inicializado se crea vacía; escritura reemplaza la colección completa
  - Manejo de fallas: `localStorage` bloqueado o sin cuota → mensaje visible y operación no confirmada; JSON corrupto → mensaje y opción de reiniciar solo la colección afectada, sin borrado automático
  - `README.md`: integrantes; pasos para abrir `index.html` sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación y estructura del seed; claves y límites de `localStorage`; procedencia de imágenes; tabla de casos manuales con resultado observado real (no declarar aprobado sin ejecutar)
  - Casos manuales de cierre: recarga después de altas y venta sin duplicar seed; modificar solo el precio dentro de `tuco:libros` y verificar que `tuco:ventas` conserva precio unitario, subtotales y total; navegación por teclado; 320 px y 1280 px
  - Verificación final de restricciones: sin librerías, frameworks, CDN ni `fetch`; recursos locales; entrega sin dependencias instaladas ni build
- **Dependencias**: C-05
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Persistencia en `localStorage` y §Seed data inicial
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PER y §RN-HIS-04
  - `knowledge-base/07_flujos_principales.md` §Flujo 7 y §Flujo 8
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-04, §DD-06 y §SU-03
  - `knowledge-base/10_preguntas_abiertas.md` §IN-01 y §IN-03

---

## Tabla resumen

| ID | Change | Ejercicio | Depende de | Governance |
|---|---|---|---|---|
| C-01 | `estructura-pantallas-html` | 1 — HTML | — | BAJO |
| C-02 | `presentacion-css-adaptable` | 2 — CSS | C-01 | BAJO |
| C-03 | `datos-locales-catalogo-filtro` | 3 — Datos y catálogo | C-02 | CRITICO |
| C-04 | `altas-libros-clientes` | 4 — Altas | C-03 | MEDIO |
| C-05 | `venta-simulada-historial` | 5 — Ventas | C-04 | CRITICO |
| C-06 | `persistencia-verificacion-documentacion` | 6 — Cierre | C-05 | ALTO |

**Primer change recomendado**: `C-01` (`estructura-pantallas-html`).

Para arrancar: `/opsx:propose C-01-estructura-pantallas-html`

### Notas de secuencia

- **Persistencia adelantada**: C-03 incluye `almacenamiento.js` v1 porque la aplicación es multipágina y los datos deben sobrevivir entre `libros.html`, `clientes.html`, `index.html` y `ventas.html`. C-06 completa la semántica de esquema, seed único y manejo de fallas exigida por el Ejercicio 6.
- **Bloqueos de cierre (no bloquean el roadmap)**: nombres de los integrantes y archivos/procedencia de las portadas se resuelven antes de archivar C-06 (ver `knowledge-base/10_preguntas_abiertas.md`).
