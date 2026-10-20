# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| Módulo con IIFE y namespace | Todos los archivos de `js/` | Separa responsabilidades sin módulos ES y funciona con `file://` |
| Separación de responsabilidades | HTML (estructura), CSS (presentación), JS (comportamiento), `localStorage` (datos) | Facilita la evaluación y el mantenimiento |
| Funciones puras | `validaciones.js`, `formato.js` | Validaciones y cálculos testeables y sin efectos secundarios |
| Adaptador de almacenamiento | `almacenamiento.js` | Único punto de acceso a `localStorage`; el resto de los módulos no conoce las claves |
| Snapshot histórico | Renglones de venta | Conserva el precio y el título al momento de la venta |
| Render defensivo | Todos los módulos de vista | Inserta datos de usuario con `textContent`, nunca con `innerHTML` |
| Delegación de eventos | Tablas y listados dinámicos | Evita reasignar listeners al re-renderizar |

## Estructura de directorios

```
repaso_parcial/
├── index.html
├── libros.html
├── clientes.html
├── ventas.html
├── historial.html
├── venta-detalle.html
├── css/
│   └── estilos.css
├── js/
│   ├── datos-iniciales.js
│   ├── almacenamiento.js
│   ├── validaciones.js
│   ├── formato.js
│   ├── catalogo.js
│   ├── libros.js
│   ├── clientes.js
│   ├── ventas.js
│   ├── historial.js
│   └── venta-detalle.js
├── assets/
│   └── portadas/
└── README.md
```

## Responsabilidad de cada módulo

| Módulo | Responsabilidad | Depende de |
|---|---|---|
| `datos-iniciales.js` | Publicar el seed de editoriales, géneros, autores, libros y clientes | — |
| `almacenamiento.js` | Inicializar el esquema, leer/escribir colecciones, generar IDs | `datos-iniciales.js` |
| `validaciones.js` | Normalizar y validar libros, clientes y ventas | — |
| `formato.js` | Formatear moneda es-AR y fechas | — |
| `catalogo.js` | Renderizar catálogo y aplicar el filtro por título | `almacenamiento`, `formato` |
| `libros.js` | Alta y listado de libros; actualizar selectores | `almacenamiento`, `validaciones`, `formato` |
| `clientes.js` | Alta y listado de clientes | `almacenamiento`, `validaciones` |
| `ventas.js` | Composición, cálculo y confirmación de ventas | `almacenamiento`, `validaciones`, `formato` |
| `historial.js` | Listado de ventas confirmadas | `almacenamiento`, `formato` |
| `venta-detalle.js` | Detalle de una venta por `?id=` | `almacenamiento`, `formato` |

## Orden de carga de scripts

Cada página carga los módulos compartidos y después su módulo de vista, todos con `defer`:

```html
<script src="js/datos-iniciales.js" defer></script>
<script src="js/almacenamiento.js" defer></script>
<script src="js/validaciones.js" defer></script>
<script src="js/formato.js" defer></script>
<script src="js/libros.js" defer></script>
```

`ventas.html`, `historial.html` y `venta-detalle.html` reemplazan el último script por el de su vista. Los módulos resuelven sus dependencias en tiempo de llamada, por lo que el orden solo importa para que `datos-iniciales.js` esté disponible cuando `almacenamiento.js` inicializa.

## Patrón de módulo

```js
(function (global) {
  'use strict';

  const TUCO = global.TUCO = global.TUCO || {};

  function inicializar() {
    // leer datos, renderizar, registrar eventos
  }

  TUCO.catalogo = { inicializar };
})(window);
```

## Reglas de render y DOM

- Crear nodos con `document.createElement` y asignar texto con `textContent`.
- No usar `innerHTML` con datos provenientes de formularios o `localStorage`.
- Usar `aria-live="polite"` en los contenedores de mensajes para anunciar resultados.
- Mantener los mensajes de error junto al campo correspondiente y un resumen al inicio del formulario.
- Usar `aria-current="page"` en el enlace de navegación activo.
- Asociar cada `<label>` con su control mediante `for`/`id`.
- Incluir `<caption>` o encabezados `<th scope="col">` en las tablas.

## Seguridad

| Aspecto | Enfoque |
|---|---|
| Autenticación | No existe; todas las vistas son públicas |
| Autorización | No existe; los roles son conceptuales |
| Validación de entrada | `validaciones.js` antes de persistir |
| XSS | Render con `textContent`; nunca HTML interpretado |
| Secretos | No hay credenciales ni tokens |
| Integridad | `localStorage` no garantiza integridad; se asume un usuario de confianza |
| Red | Cero peticiones; la aplicación funciona sin conexión |

## Variables de entorno

No aplica. El proyecto no tiene variables de entorno, configuración externa ni build.

## Manejo de errores

- Errores de validación: mensaje por campo y resumen; no se persiste.
- Errores de almacenamiento: mensaje visible, operación no confirmada.
- Datos corruptos: mensaje y opción de reiniciar la colección afectada, sin borrado automático.
- Detalle inexistente: mensaje y enlace al historial.

## Estrategia de verificación

La consigna exige **casos manuales reproducibles**, no pruebas automatizadas. Cada caso se ejecuta en el navegador y su resultado observado se registra en el `README.md`. Las funciones puras de `validaciones.js` y `formato.js` se diseñan para poder verificarse manualmente desde la consola si hace falta, sin incorporar un test runner.
