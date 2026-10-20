# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — Entrega por etapas vs. TPI completo
**Lo que plantea la organización**: el trabajo se organiza en una Etapa 1 (repaso) y una Etapa 2 (TPI completo).
**Lo que se decidió**: construir el TPI completo desde el inicio, organizado en 6 changes secuenciales.
**Impacto**: si la cátedra evaluara solo la Etapa 1 en una fecha intermedia, el avance tiene que poder identificarse como maqueta.
**Resolución propuesta**: mantener el proyecto siempre abrible y documentar en el README qué está implementado y qué es maqueta.

### IN-02 — Apertura directa vs. módulos ES
**Lo que plantea la consigna**: abrir `index.html` en el navegador sin npm.
**Lo que se había elegido**: módulos ES por dominio.
**Impacto**: los módulos ES no cargan desde `file://` por CORS.
**Resolución propuesta**: scripts clásicos con namespace `window.TUCO`, manteniendo la separación por dominio (DD-02).

### IN-03 — Imágenes y procedencia
**Lo que plantea la consigna**: recursos locales y declaración de procedencia de imágenes ajenas.
**Lo que existe hoy**: no hay archivos de portadas en el proyecto.
**Impacto**: el README no puede declarar procedencia de imágenes que todavía no existen.
**Resolución propuesta**: usar placeholders hasta incorporar las portadas en `assets/portadas/` y completar la sección de procedencia antes de la entrega.

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor |
|---|---|---|---|
| Alta | ¿Quiénes son los integrantes que deben figurar en el README? | Entrega final | Responsable del proyecto |
| Alta | ¿Qué archivos de portada se van a incorporar y cuál es su procedencia/licencia? | Cierre del catálogo y README | Responsable del proyecto |
| Media | ¿La cátedra confirma que la entrega incremental por ejercicio es aceptable? | Planificación de entregas | Docente |
| Media | En el detalle de venta, ¿se muestra solo la fecha o también la hora? | Detalle de venta | Responsable del proyecto |
| Baja | ¿Qué navegador se usará para la corrección? | Compatibilidad y pruebas | Docente |
| Baja | ¿Se abre siempre con doble clic o se admite un servidor local? | Paso de apertura del README | Docente |
| Baja | ¿Hay nombres de archivo o estructura exigidos por la cátedra? | Entrega | Docente |
| Baja | ¿Qué hacer si se abren dos pestañas y se editan datos a la vez? | Consistencia | Equipo técnico |

## Supuestos a validar antes de la entrega

- Que el navegador de corrección soporta `Intl.NumberFormat('es-AR')`, Flexbox y Grid.
- Que se acepta `localStorage` como mecanismo de persistencia sin backend.
- Que los datos ficticios del seed son suficientes para la evaluación.
- Que el README con resultados observados de casos manuales es el formato de evidencia esperado.
