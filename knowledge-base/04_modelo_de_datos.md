# Modelo de Datos

## Dominios

| Dominio | Descripción |
|---|---|
| Catálogo | Editoriales, géneros, autores y libros |
| Clientes | Personas ficticias que pueden asociarse a ventas |
| Ventas | Ventas confirmadas y sus renglones históricos |
| Persistencia | Esquema, claves y seed de `localStorage` |

## ERD (Entity Relationship Diagram)

```
Editorial 1 ────── N Libro N ────── N Autor
Genero    1 ────── N Libro
Cliente   1 ────── N Venta 1 ────── N Renglon N ────── 1 Libro
```

- Un libro pertenece a una editorial existente.
- Un libro puede tener un género o quedar sin clasificar (`generoId: null`).
- Un libro tiene uno o más autores existentes.
- Una venta pertenece a un cliente existente y tiene uno o más renglones.
- Cada renglón referencia un libro, pero conserva una copia histórica de título y precio.

## Entidades

### Editorial

| Atributo | Tipo | Restricciones |
|---|---|---|
| `id` | string | Formato `edi-N`, único |
| `nombre` | string | No vacío |

### Género

| Atributo | Tipo | Restricciones |
|---|---|---|
| `id` | string | Formato `gen-N`, único |
| `nombre` | string | No vacío |

### Autor

| Atributo | Tipo | Restricciones |
|---|---|---|
| `id` | string | Formato `aut-N`, único |
| `nombre` | string | No vacío |
| `apellido` | string | No vacío |

### Libro

| Atributo | Tipo | Restricciones |
|---|---|---|
| `id` | string | Formato `lib-N`, único e incremental |
| `titulo` | string | No vacío |
| `isbn` | string | No vacío; único al normalizar (sin espacios ni guiones, sin distinguir mayúsculas) |
| `precio` | number | Numérico, mayor que cero |
| `editorialId` | string | Debe existir en editoriales |
| `generoId` | string \| null | `null` = «Sin clasificar»; si no es `null`, debe existir |
| `autorIds` | string[] | Al menos un autor; todos deben existir |

Relaciones: `editorialId` → Editorial (N:1), `generoId` → Género (N:1 opcional), `autorIds` → Autor (N:N).

### Cliente

| Atributo | Tipo | Restricciones |
|---|---|---|
| `id` | string | Formato `cli-N`, único e incremental |
| `nombreCompleto` | string | No vacío; no se separa en nombre y apellido |
| `email` | string | No vacío; formato válido; único al normalizar (trim + minúsculas) |

### Venta

| Atributo | Tipo | Restricciones |
|---|---|---|
| `id` | string | Formato `ven-N`, único e incremental |
| `fecha` | string | ISO 8601 (`new Date().toISOString()`); se muestra como `dd/mm/aaaa` |
| `clienteId` | string | Debe existir al confirmar |
| `clienteNombre` | string | Copia histórica del nombre del cliente |
| `renglones` | Renglon[] | Al menos uno; libros no repetidos |
| `total` | number | Suma de subtotales; se muestra con dos decimales |

### Renglon de venta

| Atributo | Tipo | Restricciones |
|---|---|---|
| `libroId` | string | Debe existir al agregar el renglón |
| `titulo` | string | Copia histórica del título |
| `cantidad` | number | Entero mayor que cero |
| `precioUnitario` | number | Copia histórica del precio al confirmar |
| `subtotal` | number | `cantidad × precioUnitario` |

Los renglones y la venta confirmada son inmutables: no se editan ni se eliminan desde la interfaz.

## Estrategia de identificadores

- IDs legibles con prefijo y secuencia: `edi-1`, `gen-1`, `aut-1`, `lib-1`, `cli-1`, `ven-1`.
- La secuencia se calcula con el mayor sufijo numérico existente en la colección más uno.
- No se reutilizan IDs aunque se eliminaran registros (la interfaz no permite eliminar).

## Persistencia en `localStorage`

| Clave | Contenido | Tipo |
|---|---|---|
| `tuco:esquema` | Versión del esquema | string (`"1"`) |
| `tuco:editoriales` | Array de editoriales | JSON |
| `tuco:generos` | Array de géneros | JSON |
| `tuco:autores` | Array de autores | JSON |
| `tuco:libros` | Array de libros | JSON |
| `tuco:clientes` | Array de clientes | JSON |
| `tuco:ventas` | Array de ventas | JSON |

Reglas de arranque:

1. Si `tuco:esquema` no existe, se escriben todas las colecciones con el seed y se guarda `"1"`.
2. Si `tuco:esquema` existe, se leen las colecciones guardadas.
3. Si falta una colección con el esquema ya inicializado, se inicializa vacía (no se vuelve a sembrar) para evitar duplicados.
4. Toda escritura reemplaza la colección completa serializada.

Esta separación permite modificar únicamente `tuco:libros` en la comprobación del precio histórico sin tocar `tuco:ventas`.

## Seed data inicial

### Editoriales

| ID | Nombre |
|---|---|
| `edi-1` | Editorial Horizonte |
| `edi-2` | Ediciones del Sur |

### Géneros

| ID | Nombre |
|---|---|
| `gen-1` | Novela |
| `gen-2` | Ensayo |

### Autores

| ID | Nombre | Apellido |
|---|---|---|
| `aut-1` | Elena | Marchetti |
| `aut-2` | Tomás | Ferrer |
| `aut-3` | Lucía | Benítez |

### Libros

| ID | Título | ISBN | Editorial | Género | Autores | Precio |
|---|---|---|---|---|---|---|
| `lib-1` | El jardín de las horas | 978-950-01-0001-1 | `edi-1` | `gen-1` | `aut-1` | 12500 |
| `lib-2` | Cartas al sur | 978-950-01-0002-8 | `edi-2` | `gen-1` | `aut-2` | 9800 |
| `lib-3` | La memoria del agua | 978-950-01-0003-5 | `edi-1` | `gen-1` | `aut-1`, `aut-3` | 14200 |
| `lib-4` | Manual del lector curioso | 978-950-01-0004-2 | `edi-2` | `gen-2` | `aut-3` | 10500 |
| `lib-5` | Ciudades invisibles del norte | 978-950-01-0005-9 | `edi-1` | `gen-1` | `aut-2` | 11900 |
| `lib-6` | Notas sobre el oficio de escribir | 978-950-01-0006-6 | `edi-2` | `null` | `aut-1`, `aut-2` | 8700 |

### Clientes

| ID | Nombre completo | Email |
|---|---|---|
| `cli-1` | Ana Gómez | ana.gomez@example.com |
| `cli-2` | Bruno Díaz | bruno.diaz@example.com |
| `cli-3` | Carla Ruiz | carla.ruiz@example.com |

Todos los datos son ficticios y cumplen los mínimos de la consigna: seis libros, dos editoriales, dos géneros, tres autores y tres clientes.
