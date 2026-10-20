# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| Operador de librería | Persona que administra el catálogo, los clientes y las ventas | Usa todas las vistas: catálogo, libros, clientes, ventas e historial. No se autentica. |
| Visitante | Persona que solo consulta el catálogo | Usa la vista de catálogo y el buscador. No registra datos. |

No existe inicio de sesión real, ni separación técnica entre ambos actores: cualquier persona con acceso al navegador puede usar todas las vistas. Los roles se documentan como modelo conceptual para ordenar permisos, no como control de seguridad.

## RBAC — Matriz de permisos

| Recurso | Operador | Visitante | Crear | Leer | Editar | Eliminar |
|---|---|---|---|---|---|---|
| Catálogo | Sí | Sí | — | Sí | — | — |
| Libros | Sí | Solo lectura vía catálogo | Sí | Sí | No | No |
| Clientes | Sí | No | Sí | Sí | No | No |
| Ventas | Sí | No | Sí | Sí | No | No |
| Historial | Sí | No | — | Sí | No | No |
| Editoriales / géneros / autores | Lectura | Lectura vía catálogo | No | Sí | No | No |

Reglas de la matriz:

- Las altas de libros y clientes se hacen una sola vez; no hay edición ni borrado desde la interfaz.
- Las ventas confirmadas son inmutables.
- El catálogo es la única vista pensada para el visitante.

## Rutas públicas

Todas las rutas son públicas porque no hay autenticación:

| Ruta | Vista |
|---|---|
| `/index.html` | Catálogo y buscador |
| `/libros.html` | Alta y listado de libros |
| `/clientes.html` | Alta y listado de clientes |
| `/ventas.html` | Composición de venta |
| `/historial.html` | Listado de ventas |
| `/venta-detalle.html?id=ven-N` | Detalle de una venta |

## Limitaciones de seguridad

- `localStorage` no es un mecanismo de seguridad ni de integridad: cualquier usuario del navegador puede inspeccionarlo o modificarlo.
- No se almacenan contraseñas, tokens ni datos personales reales; los clientes son ficticios.
- La validación de entradas protege la consistencia de la práctica, no la seguridad del sistema.
