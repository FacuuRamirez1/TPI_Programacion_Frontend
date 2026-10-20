# Librería TU-CO — Base de Conocimiento

Base de conocimiento del frontend estático de Librería TU-CO, generada a partir del relevamiento por Q&A del proyecto (Discovery) y de las decisiones de arquitectura acordadas.

## Índice de Archivos

| Archivo | Contenido |
|---|---|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos por actor, alcance, fuera de alcance y métricas de éxito |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack, arquitectura general, módulos e integraciones |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores, matriz de permisos conceptual y rutas públicas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Entidades, ERD, persistencia y seed inicial |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas codificadas por dominio (RN-XX) |
| [06_funcionalidades.md](06_funcionalidades.md) | Épicas e historias de usuario con criterios de aceptación |
| [07_flujos_principales.md](07_flujos_principales.md) | Flujos de catálogo, altas, ventas, historial y persistencia |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura de directorios, seguridad y manejo de errores |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | Decisiones de diseño (DD) y supuestos (SU) |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Inconsistencias detectadas y preguntas priorizadas |

## Quick Start para Desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [10](10_preguntas_abiertas.md)

## Resumen Ejecutivo

Librería TU-CO es un frontend multipágina sin backend ni build, construido con HTML semántico, CSS propio y JavaScript nativo, que persiste libros, clientes y ventas en `localStorage`. El alcance es el TPI completo, organizado en 6 changes secuenciales (uno por ejercicio), con historial de ventas inmutable y precio unitario histórico. La entrega prioriza cumplir la consigna: abrir `index.html` sin npm, ser adaptable a 320 px y 1280 px, navegable por teclado y documentada con casos manuales reproducibles.
