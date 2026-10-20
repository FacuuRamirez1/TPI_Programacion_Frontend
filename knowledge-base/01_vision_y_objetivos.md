# Visión y Objetivos

## Propósito del sistema

**Librería TU-CO** es el frontend estático de una librería: presenta el catálogo y permite registrar libros, clientes y ventas simuladas en el navegador. No existe backend, base de datos ni autenticación: los datos viven en `localStorage` y las operaciones se resuelven íntegramente en el cliente.

El objetivo académico es aplicar HTML semántico, CSS propio, JavaScript nativo, validaciones y persistencia, cumpliendo la consigna del TPI de Programación III.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| Operador de librería | Gestionar el catálogo, los clientes y las ventas simuladas | Encontrar libros por título; validar altas sin recargar la página; consultar el historial y el detalle de cada venta |
| Visitante | Explorar el catálogo | Buscar por título; ver título, ISBN, editorial, género, autores y precio de cada libro |

## Alcance v1.0

- Catálogo renderizado desde datos locales, con buscador por título y estado «Sin clasificar».
- Alta y listado de libros con editorial, género y autores.
- Alta y listado de clientes.
- Composición de ventas con cliente, renglones, cantidades, subtotales y total.
- Confirmación de venta con identificador, fecha y precio unitario histórico.
- Historial inmutable de ventas y página de detalle.
- Persistencia en `localStorage` con carga inicial de ejemplos sin duplicados.
- Interfaz adaptable a 320 px y 1280 px, navegable por teclado.
- `README.md` con navegación, funcionalidades, datos iniciales, límites de almacenamiento, casos manuales y procedencia de imágenes.

## Fuera de alcance

- Gestión de stock.
- Cobros, pagos y facturación fiscal.
- API, base de datos, servidor o conexión con el backend del TP.
- Inicio de sesión real y permisos por usuario.
- Obtención de datos con `fetch`.
- Altas, bajas o modificaciones de editoriales, géneros o autores.
- Edición o eliminación de libros, clientes o ventas.
- Dígito verificador de ISBN.
- Pantalla para editar precios del catálogo.
- Librerías, frameworks, CDNs, preprocesadores o herramientas de build.

## Métricas de éxito

- Cumplir la distribución de 100 puntos del TPI (HTML 20, CSS 20, datos/catálogo 15, altas 15, ventas 20, cierre 10).
- Ejecutar y registrar los casos manuales del README con resultado observado, sin declarar pruebas no ejecutadas.
- Cero errores en consola al abrir cada página.
- Sin desplazamiento horizontal global a 320 px ni a 1280 px.
- Navegación completa por teclado con foco visible.
- Recarga de la página sin duplicar datos iniciales ni ventas.
