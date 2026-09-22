> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Buenas prácticas de Agent {#agent-best-practices}

> Ajusta la calidad de las consultas, la salida estructurada, el effort y el costo para integraciones de Exa Agent en producción.

Usa esta guía después del [quickstart de Exa Agent](/es/docs/agent/quickstart) para mejorar la calidad de las consultas, estructurar los outputs y controlar el tiempo de ejecución y el costo. Para ver solicitudes completas, empieza por los [ejemplos de Agent](/es/docs/agent/examples).

## Principios fundamentales {#core-principles}

Trata `query` como una especificación de tarea. Indica qué debe encontrar Agent, el alcance del trabajo, la evidencia requerida y cómo debe ser un resultado completo.

<CodeGroup>
  ```python Python theme={null}
  run = exa.agent.runs.create(
      query="Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources.",
  )
  ```

  ```javascript JavaScript theme={null}
  const run = await exa.agent.runs.create({
    query:
      "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
    }'
  ```
</CodeGroup>

Sin un `outputSchema`, Agent devuelve texto en prosa en `output.text` y citas en `output.grounding`. Agrega otro campo solo cuando cumpla una función clara:

| Campo                   | Úsalo cuando                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `outputSchema`          | El código posterior necesita campos estructurados                                   |
| `input.data`            | Ya tienes filas que enriquecer                                                      |
| `input.exclusion`       | No se deben devolver ciertos registros conocidos                                    |
| `dataSources`           | Un campo debe provenir de un partner de [Exa Connect](/es/docs/agent/connect/overview) |
| `previousRunId`         | La solicitud continúa un run completado                                             |
| `effort`                | El costo o la profundidad de la investigación requiere un ajuste explícito          |
| `budget.maxCostDollars` | Un run `auto` o `max` necesita un tope de costo estricto                            |

Mantén las filas, las exclusiones y la forma de la respuesta en sus campos dedicados en lugar de incrustarlas en `query`.

## Redacción de consultas de creación de listas y enrichment {#writing-list-building-and-enrichment-queries}

Para la creación de listas, define la entidad, el número objetivo, los criteria de calificación, las exclusiones y el nivel de evidencia exigido. Para el enrichment, coloca los registros existentes en `input.data` y describe únicamente la investigación que Agent debe añadir.

Pide una justificación cuando la calificación requiera criterio propio. Incluye ejemplos solo cuando un criterio admita varias interpretaciones plausibles.

<CodeGroup>
  ```text Query theme={null}
  Find up to 20 current engineering leaders at US-based AI infrastructure companies
  that announced a Series A or B between March 1 and August 31, 2026.

  Include CTOs, VPs of Engineering, and Heads of Engineering. Exclude founders without
  an operating engineering role and anyone whose current employment cannot be verified.
  For each person, return their name, current title, company, company website, funding
  announcement date, and a short explanation of why they qualify. Verify employment on
  the company website or another current source, and verify funding from the company
  announcement or a reputable business publication.
  ```
</CodeGroup>

Consulta [Find all GTM members](/es/docs/agent/examples#find-all-code) para ver una solicitud de descubrimiento y [Enrich input rows](/es/docs/agent/examples#enrich-input-rows-code) para el patrón correspondiente de enrichment de filas.

## Gestionar runs asíncronos {#handle-asynchronous-runs}

Los runs del Agent pueden tardar de segundos a minutos mientras buscan, leen y razonan. Diseña en torno al ciclo de vida en lugar de mantener abierta una solicitud de tu aplicación.

<Steps>
  <Step title="Crear y persistir">
    Crea el run y guarda el `id` devuelto junto con los metadatos de tu solicitud. La respuesta de creación no es el resultado final.
  </Step>

  <Step title="Esperar a un estado terminal">
    Usa el helper de sondeo del SDK, sondea `GET /agent/runs/{id}` o consume el stream SSE. Continúa mientras el run esté en `queued` o `running`.
  </Step>

  <Step title="Almacenar el resultado">
    Deja de esperar en `completed`, `failed` o `cancelled`, y luego persiste la respuesta terminal y el grounding.
  </Step>
</Steps>

Persistir el ID del run permite que tu aplicación se recupere tras un reinicio, vuelva a conectarse a un stream e inspeccione los fallos. Reduce la latencia acotando el scope, limitando el número de resultados, manteniendo el esquema enfocado y eligiendo `minimal` o `low` cuando la velocidad importe más que la exhaustividad.

Para batches, mide tareas representativas antes de estimar la concurrencia o de poner Agent en una ruta síncrona de la interfaz. El tiempo de ejecución varía según la cantidad de items, la complejidad del esquema, la disponibilidad de las fuentes y el effort.

Para equipos con Zero Data Retention, consume el stream en vivo o sondea dentro de la ventana de retención. `previousRunId` y los `dataSources` de Connect no están disponibles. Consulta [Zero Data Retention](/es/docs/admin/security/zero-data-retention).

## Escribe esquemas JSON personalizados para la salida estructurada {#write-custom-json-schemas-for-structured-output}

Usa `outputSchema` cuando el código posterior necesite campos legibles por máquina, valores normalizados, filas de tabla o registros de enrichment. Si basta con una respuesta en prosa, omítelo y lee `output.text`; la salida estructurada añade trabajo de formateo y puede aumentar la latencia.

Mantén las instrucciones de investigación en `query` y la forma de la respuesta en `outputSchema`. Usa nombres de propiedades y descripciones claros, elige los tipos más acotados que resulten útiles y limita los arreglos con `maxItems`.

<CodeGroup>
  ```json Output schema expandable theme={null}
  {
    "type": "object",
    "properties": {
      "people": {
        "type": "array",
        "maxItems": 10,
        "description": "Current engineering leaders who satisfy every criterion in the query.",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The person's full name."
            },
            "job_title": {
              "type": "string",
              "description": "Their current title at the qualifying company."
            },
            "company": {
              "type": "string",
              "description": "The qualifying company's canonical name."
            },
            "qualification_rationale": {
              "type": "string",
              "description": "A concise explanation of how the person satisfies the query criteria."
            }
          },
          "required": ["name", "job_title", "company", "qualification_rationale"]
        }
      }
    },
    "required": ["people"]
  }
  ```
</CodeGroup>

El cumplimiento del esquema valida la forma, no los hechos. Agent puede devolver `null` cuando la evidence no respalda un campo, aunque el esquema enviado lo marque como obligatorio o no anulable. `stopReason: schema_satisfied` significa que Agent considera completa la forma esperada admitiendo esos nulos; no garantiza una validación estricta frente al esquema enviado.

No dupliques en tu esquema las citas ni la confianza que Exa ya incluye. Añade un campo de justificación solo cuando cada item deba explicar por qué califica, y conserva `output.grounding` junto con el resultado estructurado. Contrasta las afirmaciones importantes con sus fuentes y prueba los cambios de esquema con entradas representativas antes de publicarlos.

Consulta los [ejemplos estructurados de Agent](/es/docs/agent/examples) para comparar esquemas de creación de listas, KYB, ofertas de empleo, exclusiones y runs continuados.

## Agent frente a Search {#agent-vs-search}

| Necesidad                                                           | Empieza con                             |
| ------------------------------------------------------------------- | --------------------------------------- |
| Resultados web para tu LLM                                          | [Search](/es/docs/search/quickstart)       |
| Investigación y síntesis rápidas                                    | [Deep Search](/es/docs/search/deep-search) |
| Creación de listas asíncrona, investigación multisalto o enrichment | [Agent](/es/docs/agent/quickstart)         |

Usa Agent cuando el trabajo requiera varios pasos de recuperación, verificación por entidad o enrichment sobre registros conocidos. Usa Search cuando necesites páginas con rapidez y sea tu aplicación la que realice el razonamiento restante.

## Consejos para casos de uso comunes {#tips-for-common-use-cases}

| Si necesitas                                        | Usa                                                           | Evita                                                                            |
| --------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Una lista investigada de tamaño desconocido         | `auto` y un `outputSchema` acotado                            | Un effort fijo y económico con un arreglo sin límites                            |
| Enrichment de registros que ya tienes               | `input.data` más los campos por añadir                        | Pegar la tabla en `query`                                                        |
| Un follow-up sobre el último conjunto de resultados | `previousRunId`                                               | Reenviar completo el output anterior                                             |
| Registros que no deberían volver a aparecer         | `input.exclusion` más deduplicación posterior                 | Tratar las exclusiones como una garantía estricta de identidad                   |
| Datos de proveedores premium                        | [Exa Connect](/es/docs/agent/connect/overview) con `dataSources` | Pedirle a Agent que infiera campos exclusivos del proveedor desde la web abierta |
| Costo predecible por solicitud                      | Un `effort` fijo                                              | `auto` o `max` sin un presupuesto                                                |
| Exhaustividad por encima de latencia y costo        | `xhigh` o `max`                                               | Subir el effort antes de afinar la consulta                                      |

## Próximos pasos {#next-steps}

<Columns cols={2}>
  <Card title="Quickstart de Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Crea un run, recibe eventos en streaming, ajusta el effort y lee la salida estructurada.
  </Card>

  <Card title="Ejemplos de Agent" icon="layers" href="/es/docs/agent/examples" cta="Ver ejemplos" arrow="true">
    Copia solicitudes completas de creación de listas, enrichment, KYB, exclusión y follow-up.
  </Card>

  <Card title="Exa Connect" icon="database" href="/es/docs/agent/connect/overview" cta="Ver data partners" arrow="true">
    Añade datos premium de empresas, personas, tráfico, cumplimiento, finanzas y otros proveedores.
  </Card>

  <Card title="Mejores prácticas de búsqueda" icon="sparkles" href="/es/docs/search/best-practices" cta="Leer guía" arrow="true">
    Calidad de recuperación, latencia y síntesis cuando Search es suficiente.
  </Card>
</Columns>