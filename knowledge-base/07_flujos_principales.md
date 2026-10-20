# Flujos Principales

Cada flujo se documenta de punta a punta dentro del navegador. No hay llamadas de red: todos los pasos ocurren en el cliente y, cuando corresponde, terminan en `localStorage`.

## Flujo 1: Búsqueda en el catálogo

**Disparador**: el visitante escribe en el buscador.
**Actor**: visitante u operador.

**Pasos**:
1. `catalogo.js` escucha el evento `input` del campo de búsqueda.
2. Normaliza el texto con `trim` y minúsculas.
3. Filtra el array de libros por coincidencia parcial en el título.
4. Si el texto está vacío, usa el catálogo completo.
5. Renderiza las tarjetas o filas del catálogo.
6. Si no hay coincidencias, muestra el mensaje «No se encontraron libros».

**Casos de error**:
- Texto con solo espacios → se trata como búsqueda vacía y muestra todo.
- `localStorage` no disponible → se muestra un mensaje y no se rompe la página.

## Flujo 2: Alta de un libro

**Disparador**: el operador envía el formulario de `libros.html`.
**Actor**: operador.

**Pasos**:
1. `libros.js` captura el evento `submit` y ejecuta `preventDefault`.
2. Lee título, ISBN, precio, editorial, género y autores.
3. `validaciones.js` normaliza y valida cada campo contra el estado local.
4. Si hay errores, los muestra junto a cada campo y no agrega el registro.
5. Si todo es válido, `almacenamiento.js` genera `lib-N`, agrega el libro y guarda.
6. Se actualizan el listado de libros, el catálogo y los selectores de venta sin recargar.
7. Se muestra un mensaje de alta correcta y se limpia el formulario.

**Casos de error**:
- Título o ISBN vacíos → error por campo.
- ISBN repetido al normalizar → error «El ISBN ya existe».
- Precio no numérico o menor o igual a cero → error.
- Sin autores seleccionados → error.
- Editorial o género inexistente → error.
- Falla de escritura en `localStorage` → mensaje y no se confirma el alta.

## Flujo 3: Alta de un cliente

**Disparador**: el operador envía el formulario de `clientes.html`.
**Actor**: operador.

**Pasos**:
1. `clientes.js` captura `submit` y ejecuta `preventDefault`.
2. Lee nombre completo y email.
3. `validaciones.js` valida campos no vacíos, formato de email y unicidad normalizada.
4. Si hay errores, los muestra junto a los campos.
5. Si todo es válido, genera `cli-N`, agrega el cliente y guarda.
6. Se actualizan el listado y el selector de clientes de la venta sin recargar.
7. Se muestra un mensaje de alta correcta y se limpia el formulario.

**Casos de error**:
- Nombre vacío → error.
- Email vacío o con formato inválido → error.
- Email repetido (con mayúsculas o espacios) → error «El email ya está registrado».

## Flujo 4: Composición de una venta

**Disparador**: el operador selecciona un cliente y agrega renglones en `ventas.html`.
**Actor**: operador.

**Pasos**:
1. `ventas.js` carga clientes y libros desde `almacenamiento.js`.
2. El operador elige un cliente y un libro, indica una cantidad entera y presiona «Agregar».
3. Se valida que el libro exista y que la cantidad sea entera y mayor que cero.
4. Si el libro ya está en la venta, se modifica la cantidad del renglón existente o se informa el duplicado.
5. Se calcula el subtotal del renglón y el total de la venta.
6. Se renderiza la tabla de renglones con libro, cantidad, precio unitario y subtotal.
7. El operador puede cambiar cantidades o quitar renglones; se recalculan subtotales y total.

**Casos de error**:
- Cantidad cero, negativa o decimal → mensaje y no se agrega.
- Libro repetido → se informa y no se crea otro renglón.
- Sin cliente seleccionado → se advierte antes de confirmar.

## Flujo 5: Confirmación de una venta

**Disparador**: el operador presiona «Confirmar venta».
**Actor**: operador.

**Pasos**:
1. `ventas.js` valida cliente, renglones y cantidades.
2. Copia título y precio unitario de cada libro a los renglones (snapshot).
3. Calcula subtotales y total definitivos.
4. Genera `ven-N` y la fecha con `new Date().toISOString()`.
5. Guarda la venta en `tuco:ventas`.
6. Limpia el formulario y muestra un mensaje de venta confirmada.
7. Deja la venta disponible en el historial.

**Casos de error**:
- Sin cliente, sin renglones o con cantidades inválidas → no se confirma.
- Falla de escritura en `localStorage` → no se confirma y se informa.

## Flujo 6: Consulta del historial y detalle

**Disparador**: el operador abre `historial.html` o el enlace de una venta.
**Actor**: operador.

**Pasos**:
1. `historial.js` lee `tuco:ventas` y renderiza identificador, fecha, cliente y total.
2. Si no hay ventas, muestra un mensaje de historial vacío.
3. El enlace «Ver detalle» navega a `venta-detalle.html?id=ven-N`.
4. `venta-detalle.js` lee el parámetro `id`, busca la venta y renderiza sus renglones.
5. Si el id no existe, muestra un mensaje y un enlace para volver al historial.

**Casos de error**:
- Id ausente o inválido → mensaje y enlace al historial.
- Venta inexistente → mensaje y enlace al historial.

## Flujo 7: Carga inicial y persistencia

**Disparador**: se abre cualquier página del sistema.
**Actor**: sistema.

**Pasos**:
1. `almacenamiento.js` verifica la clave `tuco:esquema`.
2. Si no existe, escribe todas las colecciones con el seed y guarda `tuco:esquema = "1"`.
3. Si existe, lee las colecciones guardadas.
4. Si falta una colección con el esquema ya inicializado, la inicializa vacía sin volver a sembrar.
5. Los módulos de página consumen los datos y renderizan la vista.
6. Cada alta o venta guarda la colección modificada completa.

**Casos de error**:
- `localStorage` bloqueado o sin cuota → se informa y la aplicación sigue en modo solo lectura.
- JSON corrupto en una clave → se informa y se ofrece reiniciar esa colección (sin borrar datos automáticamente).

## Flujo 8: Comprobación del precio histórico (guiada por el docente)

**Disparador**: se confirma una venta de prueba y luego se modifica el catálogo guardado.
**Actor**: docente, con una copia del proyecto.

**Pasos**:
1. Confirmar una venta y anotar sus importes.
2. Abrir las herramientas de almacenamiento del navegador.
3. Modificar únicamente el precio del libro dentro de `tuco:libros`, sin tocar `tuco:ventas`.
4. Recargar la página y consultar el detalle de la venta anterior.
5. Verificar que precio unitario, subtotales y total conservan los valores confirmados.

**Casos de error**:
- Si se modifica también `tuco:ventas`, la comprobación deja de ser válida y se registra el comportamiento real.
