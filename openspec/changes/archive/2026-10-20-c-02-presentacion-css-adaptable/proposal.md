# Proposal

## Why

C-01 dejó seis pantallas semánticas y navegables, pero sin identidad visual ni comportamiento adaptable: se ven con los estilos por defecto del navegador, la navegación no se reorganiza en pantallas angostas y las tablas anchas desbordan la página. El Ejercicio 2 exige una presentación propia, coherente entre vistas, usable a 320 px y 1280 px y accesible con teclado. Este change incorpora esa capa de presentación sin tocar datos ni comportamiento.

## What Changes

- Se crea `css/estilos.css` como única hoja de estilos local, enlazada desde las seis vistas, con variables CSS de color, tipografía, espaciado, radios, sombras y foco.
- Se definen componentes reutilizables con clases estables: `.tarjeta`, `.formulario`, `.campo`, `.boton`, `.tabla`, `.mensaje` y `.badge`, con modificadores para estados y jerarquías.
- Se aplica layout con Flexbox y Grid al `header`, `nav`, `main` y `footer`, al listado del catálogo y a los formularios, que pasan de una columna en móvil a dos columnas en escritorio.
- Se envuelve el desplazamiento de las tablas en su propio contenedor (`overflow-x: auto`, región enfocable y con nombre accesible), sin `overflow-x` global en `html` ni `body`.
- Se agregan media queries con base en 320 px y un punto de quiebre de escritorio en 1280 px; la tipografía, los controles y los espacios escalan sin scroll horizontal de página.
- Se implementa foco visible con `:focus-visible`, estilo no cromático para `aria-current="page"`, enlace «Saltar al contenido» visible al enfocarse y utilidad `.visualmente-oculto` para texto disponible solo a lectores de pantalla.
- Se definen estados visuales de vacío, sin resultados, éxito y error. El error combina texto con prefijo «Error:», peso tipográfico y borde de mayor grosor; nunca depende solo del color. La carga no aplica porque no hay red.
- Se agregan al HTML de C-01 únicamente los hooks de presentación necesarios: `link` a la hoja, clases de componente, `tabindex="0"` y nombre accesible en los contenedores de tabla, y texto visualmente oculto en el enlace de detalle. No se agrega lógica ni datos.
- **Fuera de alcance**: datos iniciales, render dinámico, validaciones funcionales, persistencia, cálculos de venta y documentación de cierre (C-03 a C-06). No se agregan frameworks, dependencias, build, CDNs, fuentes remotas, `@import` ni peticiones de red.

## Capabilities

### New Capabilities

- `presentacion-adaptable`: contrato de presentación de las seis vistas, con sistema de tokens, componentes reutilizables, layout responsive a 320 px y 1280 px, foco visible, estados con texto y desplazamiento propio de tablas.

### Modified Capabilities

- Ninguna. `estructura-pantallas` sigue vigente: C-02 no cambia la estructura, el etiquetado ni la semántica de C-01, y mantiene el foco visible que aquella spec exige. La presentación es una capacidad nueva y separada para preservar la trazabilidad por ejercicio.

## Impact

- Archivo nuevo: `css/estilos.css`.
- Archivos modificados: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` y `venta-detalle.html` solo para enlazar la hoja y agregar clases, atributos de región en tablas y texto visualmente oculto. No se modifican `assets/` ni se crea `js/`.
- Sin dependencias externas, sin backend, sin cambios de configuración ni de esquema de datos.
- Riesgo principal: que los hooks agregados al HTML alteren la estructura validada en C-01. Se mitiga limitando los cambios a atributos `class`, `role`, `tabindex`, `aria-label` y un `span` de texto oculto, sin mover, quitar ni duplicar nodos existentes.
