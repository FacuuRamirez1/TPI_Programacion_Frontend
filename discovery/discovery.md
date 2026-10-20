# Discovery — TPI Frontend Librería

**Fecha**: 2026-10-19
**Fuentes**: relevamiento por Q&A con el responsable del proyecto. Sin competidores (proyecto académico, no de mercado).

## Decisiones de alcance y entrega

- **Alcance de la entrega**: TPI completo, ejercicios 1 a 6.
- **Organización del trabajo**: un change de OpenSpec por ejercicio del TPI (6 changes), respetando el orden de dependencia 1 → 6.
- **Arquitectura de pantallas**: multipágina, con `index.html` como entrada (catálogo) y páginas separadas para libros, clientes, ventas e historial.
- **Formato de importes y fechas**: es-AR (`$ 1.234,56`, `dd/mm/aaaa`).
- **Control de autores**: `<select multiple>`.
- **Portadas**: imágenes locales en `assets/` o `public/` (la carpeta exacta se define en el design del change 1).

## 1. Problema que resuelve

Construir el frontend de una librería que presenta su catálogo y registra libros, clientes y ventas simuladas en el navegador, para aplicar HTML semántico, CSS propio, JavaScript nativo, validaciones y persistencia en el marco del TPI de Programación III.

## 2. Usuarios / roles

- **Operador de librería**: consulta el catálogo, da de alta libros y clientes, compone ventas y revisa el historial. Único rol, sin login real ni permisos.
- **Visitante**: consulta el catálogo y usa el buscador. Comparte la misma interfaz, sin autenticación.

## 3. Casos de uso

1. Como operador, quiero ver el catálogo con buscador por título para encontrar un libro.
2. Como operador, quiero dar de alta libros con editorial, género y autores para incorporarlos al catálogo.
3. Como operador, quiero dar de alta clientes para poder asociarlos a ventas.
4. Como operador, quiero componer una venta con varios renglones y ver el total antes de confirmar.
5. Como operador, quiero consultar el historial y el detalle de cada venta para auditar lo vendido.
6. Como operador, quiero que libros, clientes y ventas persistan al recargar la página.

## 4. Competidores / soluciones existentes

No aplica. El relevamiento no identificó competidores: es un trabajo práctico académico, no un producto de mercado. La referencia funcional es el TP backend de la misma materia, que aquí se simula íntegramente en el navegador.

## 5. Funcionalidades necesarias

- Catálogo renderizado desde datos locales con filtro por título (recorta extremos, ignora mayúsculas, coincidencia parcial, búsqueda vacía muestra todo, sin coincidencias muestra mensaje).
- Alta y listado de libros con validaciones y selectores alimentados por los datos locales.
- Alta y listado de clientes con validaciones y unicidad de email.
- Composición de venta: selección de cliente, renglones, cantidades, subtotales y total; edición y eliminación de renglones antes de confirmar.
- Confirmación de venta con identificador, fecha, cliente, renglones y total; el precio unitario se copia como valor histórico.
- Historial inmutable con detalle de renglones.
- Persistencia en `localStorage` con carga inicial de ejemplos sin duplicados.
- README con navegación, funcionalidades implementadas y pendientes, datos iniciales, límites de `localStorage`, resultados de los casos manuales y procedencia de imágenes.

## 6. Funcionalidades opcionales / excluidas explícitamente

- Gestión de stock.
- Cobros y facturación fiscal.
- API, base de datos, servidor o conexión con el backend.
- Inicio de sesión real.
- Obtención de datos con `fetch`.
- Altas, bajas y modificaciones de editoriales, géneros o autores.
- Edición o eliminación de libros, clientes o ventas.
- Dígito verificador de ISBN.
- Pantalla para editar precios del catálogo.

## 7. Reglas de negocio

- **Filtro por título**: recorta espacios en los extremos, ignora diferencias entre mayúsculas y minúsculas, busca coincidencias parciales; una búsqueda vacía muestra todo el catálogo; una búsqueda sin coincidencias muestra un mensaje claro.
- **Alta de libro**: título e ISBN no vacíos; ISBN único comparado sin espacios ni guiones; precio numérico y mayor que cero; editorial y todos los autores seleccionados deben existir en los datos locales; al menos un autor; el género es opcional y, si se asigna, debe existir.
- **Alta de cliente**: nombre completo y email no vacíos; email con formato válido; email único comparado sin espacios exteriores y sin distinguir mayúsculas.
- **Venta**: cliente existente; al menos un renglón; libro existente; cantidad entera mayor que cero; prohibido repetir libro en la misma venta (se modifica la cantidad del renglón existente o se informa el duplicado); subtotal = cantidad × precio unitario; total = suma de subtotales; importes con dos decimales; no se confirma sin cliente, sin renglones o con cantidades inválidas.
- **Historial**: las ventas confirmadas no se editan ni eliminan; el precio unitario se copia al renglón al confirmar y no se relee del catálogo actual; se conservan los datos descriptivos necesarios para leer la venta.
- **Persistencia**: los ejemplos se cargan solo en el primer inicio; al recargar se recuperan los registros guardados sin duplicar los datos iniciales.

## 8. Integraciones

Ninguna. Todo corre en el navegador, sin red ni backend.

## 9. Restricciones

- Solo HTML, CSS y JavaScript nativos; prohibidas librerías, frameworks y CDNs.
- Recursos locales (CSS, JavaScript, imágenes) dentro del proyecto.
- Multipágina: `index.html` como entrada del catálogo, más páginas de libros, clientes, ventas e historial.
- Interfaz verificada a 320 px y 1280 px, sin desplazamiento horizontal global; las tablas que lo necesiten se desplazan dentro de su propio contenedor.
- Foco visible y recorrido por teclado; los errores se expresan con texto y no dependen únicamente del color; las imágenes informativas tienen texto alternativo.
- Entrega en carpeta o archivo comprimido con `README.md`, sin dependencias instaladas ni herramientas de compilación.
- Proceso: un change de OpenSpec por ejercicio del TPI (6 changes), secuenciales.

## 10. Riesgos

- **Supuesto sin probar**: que la cátedra acepte la entrega incremental por ejercicio; la consigna describe etapas, pero el puntaje corresponde al TPI completo.
- **Riesgo**: `localStorage` depende del navegador, del perfil y de la ubicación de apertura; no comparte información entre usuarios.
- **Riesgo**: documentar casos manuales como aprobados sin ejecutarlos.
- **Riesgo**: que accesibilidad, validaciones y persistencia queden para el final y no alcance el tiempo.
- **Riesgo**: portadas sin procedencia declarada en el README.
- **Riesgo de secuencia**: el change de CSS depende de todas las pantallas del change 1; si cambian las vistas, hay que revisar los estilos.

## 11. Preguntas abiertas

- Nombre exacto de la carpeta de portadas: `assets/` o `public/` (se define en el design del change 1).
- Nombres de los integrantes para el README (dato pendiente al momento de la entrega).
- Formato del identificador de venta (numérico, `V-001`, etc.) y si la fecha incluye hora.
- Claves y versionado de `localStorage` (decisión de implementación, no de producto).
