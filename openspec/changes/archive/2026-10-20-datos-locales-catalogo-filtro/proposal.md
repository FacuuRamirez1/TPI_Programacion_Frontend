# Proposal

## Why

El catálogo de la Librería TU-CO es hoy solo una maqueta estructural: no tiene datos, no se genera desde JavaScript y el buscador no filtra nada. El Ejercicio 3 exige un modelo de datos locales, un seed mínimo, el render del catálogo y una búsqueda por título en vivo, que además sientan la base para las altas y las ventas de los ejercicios siguientes.

## What Changes

- Nuevo `js/datos-iniciales.js` que publica `TUCO.datosIniciales` con el seed exacto de la KB: 2 editoriales, 2 géneros, 3 autores, 6 libros y 3 clientes, con IDs `edi-N`, `gen-N`, `aut-N`, `lib-N` y `cli-N`.
- Nuevo `js/almacenamiento.js` (v1) como única capa que conoce las claves `tuco:*`: lectura y escritura de colecciones, copia profunda del seed, fallback ante almacenamiento no disponible o JSON inválido y generación del siguiente ID con prefijo.
- Nuevo `js/formato.js` con `formatearMoneda` usando `Intl.NumberFormat('es-AR')` (salida `$ 12.500,00`) y `formatearFecha` en `dd/mm/aaaa`.
- Nuevo `js/catalogo.js` que renderiza las tarjetas desde los datos locales con `createElement`/`textContent`, resuelve editorial, género («Sin clasificar» cuando `generoId` es `null`) y autores, y filtra por título en el evento `input` con `trim`, sin distinguir mayúsculas y con coincidencia parcial.
- `index.html` carga los cuatro scripts con `defer`, en orden de dependencia. No se modifica la estructura, las clases ni los estilos existentes.
- Se agregan los estados de catálogo vacío y de búsqueda sin coincidencias, reutilizando los contenedores y mensajes ya presentes en la maqueta.

## Capabilities

### New Capabilities

- `catalogo-local`: modelo de datos locales con seed, carga y persistencia mínima en `localStorage`, render del catálogo desde los datos y filtro por título con sus estados.

### Modified Capabilities

<!-- Ninguna: este change no modifica requisitos de las capacidades existentes. -->

## Impact

- Archivos nuevos: `js/datos-iniciales.js`, `js/almacenamiento.js`, `js/formato.js`, `js/catalogo.js`.
- Archivo modificado: `index.html` (solo cuatro etiquetas `<script defer>` antes de `</body>`).
- Sin cambios en `css/estilos.css` ni en el resto de las vistas HTML.
- Sin dependencias, sin build, sin `fetch` ni peticiones de red; ejecutable con doble clic desde `file://`.
- Claves de `localStorage` afectadas: `tuco:editoriales`, `tuco:generos`, `tuco:autores`, `tuco:libros`, `tuco:clientes` y `tuco:ventas`.
- Verificación mediante casos manuales en el navegador; no se agregan pruebas automatizadas ni herramientas de test.
