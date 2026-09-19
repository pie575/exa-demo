> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de continuar explorando.

<div id="exa-agent">
  # Exa Agent
</div>

> Ejecuta flujos de trabajo de investigación profunda, construcción de listas y enrichment que devuelven resultados estructurados.

Exa Agent es un endpoint asíncrono y basado en uso para tareas de alto cómputo como la construcción de listas, el enrichment y la investigación profunda. Resuelve razonamientos complejos y puede devolver muchos campos de salida estructurados.

Piénsalo como un agente de contexto: describes los datos que necesitas y el formato en que deben llegar, y Exa Agent orquesta las llamadas a herramientas necesarias para conseguirlo. Una sola ejecución puede lanzar múltiples búsquedas desde distintos ángulos, leer y condensar las páginas que hay detrás, dividir la construcción de listas en subtareas que se ejecutan en paralelo, verificar cada candidato frente a tus criteria, enriquecer contactos y consultar cualquier partner de datos de [Exa Connect](/es/docs/agent/connect/overview) que adjuntes. Recibes todo el contexto reunido en un único resultado estructurado y respaldado por fuentes, en lugar de orquestar tú mismo cada llamada a `/search` y `/contents`.

Cada ejecución puede devolver una respuesta en lenguaje natural, JSON validado contra un esquema, grounding a nivel de campo, metadatos y un desglose de costos. Puedes recuperar ejecuciones completadas más tarde, listar ejecuciones anteriores, reproducir eventos o continuar a partir de una ejecución previa.

<Tip>
  ¿Prefieres MCP? Exa Agent y [Exa Connect](/es/docs/agent/connect/overview) están disponibles en [Exa MCP](/es/docs/get-started/exa-mcp#exa-agent). Activa `tools=agent_run` para ejecutar investigación de varios pasos, construcción de listas, enrichment y salida estructurada desde Claude, Cursor y otros clientes MCP.
</Tip>

<div id="when-to-use-exa-agent">
  ## Cuándo usar Exa Agent
</div>

Usa Exa Agent cuando un flujo de trabajo requiere más que una sola llamada de search o de extracción, o cuando de otro modo tendrías que escribir tu propio bucle de búsquedas, lecturas de páginas y pasos de verificación para reunir los datos:

* Crear listas a partir de criteria abiertos y luego enriquecer cada resultado
* Investigar entidades en múltiples campos con citas
* Ejecutar tareas de varios pasos como «encontrar empresas y luego encontrar a sus responsables de decisiones»
* Generar JSON estructurado a partir de una tarea de investigación web de larga duración
* Combinar la investigación web con partners de datos premium en una única respuesta fundamentada
* Continuar una ejecución anterior con una solicitud de seguimiento como «encuentra 10 resultados más»

Exa Agent tiene mayor latencia y es asíncrono por diseño. Si solo necesitas una search de baja latencia y orquestas tú mismo las llamadas, empieza por la [Search API](/es/docs/search/quickstart).

<div id="quickstart">
  ## Inicio rápido
</div>

Este ejemplo inicia una ejecución que genera una lista estructurada de personas que cumplen tus criterios. Devuelve JSON en `output.structured`.

<div id="1-install-the-exa-sdk">
  ### 1. Instala el SDK de Exa
</div>

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

<div id="2-set-your-api-key">
  ### 2. Configura tu API key
</div>

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

<div id="3-create-a-run">
  ### 3. Crear una ejecución
</div>

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      output_schema={
          "type": "object",
          "properties": {
              "people": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "job_title": {"type": "string"},
                          "linkedin_url": {"type": "string", "format": "uri"},
                      },
                      "required": ["name", "job_title", "linkedin_url"],
                  },
              }
          },
          "required": ["people"],
      },
      effort="auto",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
    outputSchema: {
      type: "object",
      properties: {
        people: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              job_title: { type: "string" },
              linkedin_url: { type: "string", format: "uri" }
            },
            required: ["name", "job_title", "linkedin_url"]
          }
        }
      },
      required: ["people"]
    },
    effort: "auto"
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "people": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "job_title": { "type": "string" },
                "linkedin_url": { "type": "string", "format": "uri" }
              },
              "required": ["name", "job_title", "linkedin_url"]
            }
          }
        },
        "required": ["people"]
      }
    }'
  ```
</CodeGroup>

Añade `Accept: text/event-stream` al crear una ejecución para recibir eventos enviados por el servidor a medida que la ejecución se encola, se inicia y se completa. Consulta [Eventos de streaming](#stream-events) para más detalles.

<div id="4-poll-for-completion">
  ### 4. Consulta periódicamente hasta que finalice
</div>

Si no recibes eventos en streaming, guarda el `id` devuelto y consulta la ejecución hasta que alcance un estado terminal.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run_id = "agent_run_01j..."
  run = exa.agent.runs.poll_until_finished(
      run_id,
      poll_interval=4000,
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const runId = "agent_run_01j...";
  const run = await exa.agent.runs.pollUntilFinished(runId, {
    pollInterval: 4000
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  RUN_ID="agent_run_01j..."

  while true; do
    RUN_JSON="$(curl -s "https://api.exa.ai/agent/runs/$RUN_ID" \
      -H "Authorization: Bearer $EXA_API_KEY")"

    STATUS="$(echo "$RUN_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["status"])')"
    echo "status=$STATUS"

    if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ] || [ "$STATUS" = "cancelled" ]; then
      echo "$RUN_JSON"
      break
    fi

    sleep 4
  done
  ```
</CodeGroup>

Las ejecuciones completadas incluyen:

* `output.text`: una respuesta en lenguaje natural
* `output.structured`: JSON validado cuando proporcionas `outputSchema`
* `output.grounding`: citas para el texto o los campos estructurados, cuando se emiten
* `costDollars`: el desglose de costes de la ejecución

<Note>
  Exa Agent también está disponible a través de la Responses API compatible con OpenAI. Apunta
  el SDK de OpenAI a `https://api.exa.ai`, usa `model: "exa-agent"` y elige
  entre ejecución síncrona, en streaming o en segundo plano. Consulta [Compatibilidad con el SDK de
  OpenAI](/es/docs/integrations/openai-sdk#agent-via-responses-api).
</Note>

<div id="verify-and-enrich-a-specific-entity">
  ## Verificar y enriquecer una entidad específica
</div>

Además de la construcción de listas, puedes usar Exa Agent para analizar una entidad concreta ya conocida, verificar una afirmación contra fuentes autorizadas y devolver un enrichment estructurado. Este ejemplo comprueba si el sitio web oficial de una empresa tiene una página de precios de acceso público y enriquece el resultado con los detalles de precios cuando están disponibles. El esquema solo requiere `domain` y `verdict`; todo lo demás es enrichment opcional.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
      system_prompt="Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
      effort="low",
      output_schema={
          "type": "object",
          "additionalProperties": False,
          "required": ["domain", "verdict"],
          "properties": {
              "domain": {"type": "string", "const": "redbarnrobotics.com"},
              "verdict": {
                  "type": "string",
                  "enum": ["present", "absent", "cannot_verify"],
              },
              "pricing_page_url": {"type": ["string", "null"], "format": "uri"},
              "displays_numeric_prices": {"type": ["boolean", "null"]},
              "pricing_model": {
                  "type": ["string", "null"],
                  "enum": [
                      "free",
                      "subscription",
                      "usage_based",
                      "one_time",
                      "custom_quote",
                      "mixed",
                      "other",
                      None,
                  ],
              },
              "starting_price": {"type": ["number", "null"], "minimum": 0},
              "currency": {
                  "type": ["string", "null"],
                  "description": "ISO 4217 code such as USD or EUR.",
              },
              "billing_period": {
                  "type": ["string", "null"],
                  "enum": [
                      "monthly",
                      "annual",
                      "one_time",
                      "usage_based",
                      "variable",
                      "other",
                      None,
                  ],
              },
              "has_free_plan": {"type": ["boolean", "null"]},
              "has_free_trial": {"type": ["boolean", "null"]},
              "reasoning": {"type": ["string", "null"], "maxLength": 300},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
    systemPrompt:
      "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
    effort: "low",
    outputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["domain", "verdict"],
      properties: {
        domain: { type: "string", const: "redbarnrobotics.com" },
        verdict: {
          type: "string",
          enum: ["present", "absent", "cannot_verify"]
        },
        pricing_page_url: { type: ["string", "null"], format: "uri" },
        displays_numeric_prices: { type: ["boolean", "null"] },
        pricing_model: {
          type: ["string", "null"],
          enum: [
            "free",
            "subscription",
            "usage_based",
            "one_time",
            "custom_quote",
            "mixed",
            "other",
            null
          ]
        },
        starting_price: { type: ["number", "null"], minimum: 0 },
        currency: {
          type: ["string", "null"],
          description: "ISO 4217 code such as USD or EUR."
        },
        billing_period: {
          type: ["string", "null"],
          enum: [
            "monthly",
            "annual",
            "one_time",
            "usage_based",
            "variable",
            "other",
            null
          ]
        },
        has_free_plan: { type: ["boolean", "null"] },
        has_free_trial: { type: ["boolean", "null"] },
        reasoning: { type: ["string", "null"], maxLength: 300 }
      }
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says '"'"'Contact sales'"'"'.",
      "systemPrompt": "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company'"'"'s official website as evidence.",
      "effort": "low",
      "outputSchema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["domain", "verdict"],
        "properties": {
          "domain": { "type": "string", "const": "redbarnrobotics.com" },
          "verdict": {
            "type": "string",
            "enum": ["present", "absent", "cannot_verify"]
          },
          "pricing_page_url": { "type": ["string", "null"], "format": "uri" },
          "displays_numeric_prices": { "type": ["boolean", "null"] },
          "pricing_model": {
            "type": ["string", "null"],
            "enum": ["free", "subscription", "usage_based", "one_time", "custom_quote", "mixed", "other", null]
          },
          "starting_price": { "type": ["number", "null"], "minimum": 0 },
          "currency": {
            "type": ["string", "null"],
            "description": "ISO 4217 code such as USD or EUR."
          },
          "billing_period": {
            "type": ["string", "null"],
            "enum": ["monthly", "annual", "one_time", "usage_based", "variable", "other", null]
          },
          "has_free_plan": { "type": ["boolean", "null"] },
          "has_free_trial": { "type": ["boolean", "null"] },
          "reasoning": { "type": ["string", "null"], "maxLength": 300 }
        }
      }
    }'
  ```
</CodeGroup>

<Note>
  Los esquemas para flujos de verificación deben contemplar la incertidumbre.
  Define como nullable los campos que quizá no puedan verificarse y déjalos
  fuera de `required`, de modo que el agent pueda devolver `null` en lugar de
  inventar un valor. El enum `verdict` distingue una inspección fallida
  (`cannot_verify`) de la evidencia negativa real (`absent`): que no se haya
  podido acceder a un sitio no es prueba de que la página no exista.
</Note>

<div id="stream-events">
  ## Eventos de streaming
</div>

El streaming mantiene abierta la solicitud de creación y envía Server-Sent Events (SSE) hasta que la ejecución finaliza. Consulta [Formato de evento](#event-format) para conocer los tipos de eventos y sus payloads.

Define `stream=True` en Python, `stream: true` en JavaScript o envía `Accept: text/event-stream` por HTTP:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  events = exa.agent.runs.create(
      query="Find five recently launched developer tools for evaluating AI agents.",
      stream=True,
  )

  for event in events:
      print(event.event, event.data)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const events = await exa.agent.runs.create({
    query: "Find five recently launched developer tools for evaluating AI agents.",
    stream: true
  });

  for await (const event of events) {
    console.log(event.event, event.data);
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find five recently launched developer tools for evaluating AI agents."
    }'
  ```
</CodeGroup>

<div id="event-format">
  ### Formato de los eventos
</div>

Cada frame SSE contiene un ID de evento, un nombre de evento y un payload JSON:

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

El flujo también puede contener líneas de comentario como `: keep-alive`. Los clientes SSE ignoran los comentarios automáticamente; los analizadores personalizados deberían hacer lo mismo.

<div id="event-types">
  ### Tipos de eventos
</div>

| Evento                | payload de `data`                             | Cómo usarlo                                                                                                      |
| --------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `agent_run.created`   | `{ id, status: "queued", createdAt }`         | Guarda el ID de la ejecución en cuanto se acepte la solicitud.                                                   |
| `agent_run.started`   | `{ id, status: "running" }`                   | Marca la ejecución como en curso.                                                                                |
| `agent_run.completed` | El objeto de la ejecución de Agent completada | Lee la respuesta final en `data.output.text` o `data.output.structured`, y las citas en `data.output.grounding`. |
| `agent_run.failed`    | `{ id, status: "failed", error }`             | Muestra `error.code` y `error.message`; no hay ninguna salida completada disponible.                             |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`            | Deja de consumir el stream y trata la ejecución como cancelada.                                                  |

Los eventos asociados al mismo paso de investigación incluyen un `callId`, que se corresponde con `item.call_id` en los eventos de progreso de herramientas. Úsalo para agrupar trazas de search, fuentes y progreso de herramientas. Algunas descripciones de trazas de search se generan de forma asíncrona y pueden llegar después de la fuente o del evento de herramienta que describen, así que no las correlaciones únicamente por el orden de llegada.

Trata `agent_run.source.added` como una vista previa en tiempo real, no como una lista de citas completa. El `output.grounding` de la ejecución terminal es la salida de grounding de referencia.

<div id="replay-stored-events">
  ### Reproducir eventos almacenados
</div>

Para las ejecuciones que no son ZDR, [`GET /agent/runs/{id}/events`](/es/docs/reference/agent-api/list-run-events) devuelve los eventos almacenados como JSON paginado. Envía `Accept: text/event-stream` para reproducir los eventos almacenados como SSE, y `Last-Event-ID` para omitir los eventos que tu cliente ya haya procesado:

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

El endpoint de reproducción envía los eventos almacenados en el momento de la solicitud y luego cierra la conexión; no sigue emitiendo eventos de una ejecución en curso. Las ejecuciones con ZDR no conservan eventos, por lo que no se pueden reproducir.

Para garantizar la compatibilidad futura, ignora los nombres de eventos que tu aplicación no reconozca y continúa hasta que llegue un evento terminal.

<div id="return-structured-json">
  ## Devolver JSON estructurado
</div>

Usa `outputSchema` para devolver en `output.structured` un JSON validado contra un esquema.

`outputSchema` admite la [especificación JSON Schema](https://json-schema.org/).

Para solicitar información de contacto, describe los campos de contacto deseados en `outputSchema`. Usa estructuras estándar de JSON Schema como `{ "type": "string", "format": "email" }` para direcciones de correo electrónico, `{ "type": "string", "format": "phone" }` para números de teléfono y `{ "type": "string", "format": "uri" }` para URLs. Siempre que sea posible, acota el tamaño de las listas con `maxItems` para que el costo máximo del enrichment de contactos sea predecible.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      effort="auto",
      output_schema={
          "type": "object",
          "properties": {
              "companies": {
                  "type": "array",
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "website": {"type": "string"},
                      },
                      "required": ["name", "round"],
                  },
              }
          },
          "required": ["companies"],
      },
  )
  run = exa.agent.runs.poll_until_finished(
      run.id,
  )

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
    effort: "auto",
    outputSchema: {
      type: "object",
      properties: {
        companies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              round: { type: "string" },
              website: { type: "string" }
            },
            required: ["name", "round"]
          }
        }
      },
      required: ["companies"]
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "companies": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "website": { "type": "string" }
              },
              "required": ["name", "round"]
            }
          }
        },
        "required": ["companies"]
      }
    }'
  ```
</CodeGroup>

<div id="process-input-rows">
  ## Procesar filas de entrada
</div>

Usa `input.data` cuando ya tengas un conjunto de datos que quieras enriquecer. Puedes añadir más campos a cada entidad de datos, descubrir nuevas entidades a partir de los datos que aportas, o ambas cosas.

Para ver ejemplos completos de enrichment de filas, consulta [Ejemplos de Agent](/es/docs/agent/examples#enrich-input-rows-code).

<div id="process-exclusions">
  ## Procesar exclusiones
</div>

Usa `input.exclusion` para excluir ciertas entradas de los resultados de la ejecución. En el ejemplo siguiente, queremos buscar los 10 animales más tiernos, pero excluimos las cabras y los pandas de la ejecución porque ya sabemos lo tiernos que son.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find the top 10 cutest animals. Return each animal's common name and a source URL.",
      input={
          "exclusion": [
              {"animal": "goat"},
              {"animal": "panda"},
          ]
      },
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find the top 10 cutest animals. Return each animal's common name and a source URL.",
    input: {
      exclusion: [
        { animal: "goat" },
        { animal: "panda" }
      ]
    }
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find the top 10 cutest animals. Return each animal'"'"'s common name and a source URL.",
      "input": {
        "exclusion": [
          { "animal": "goat" },
          { "animal": "panda" }
        ]
      }
    }'
  ```
</CodeGroup>

<div id="connect-data-sources">
  ## Conectar fuentes de datos
</div>

El índice ya está disponible en todas las ejecuciones. Usa `dataSources` únicamente para adjuntar partners de [Exa Connect](/es/docs/agent/connect/overview). Cada entrada selecciona un `provider`. Cuando una propiedad de tu `outputSchema` hace referencia a una fuente concreta (por ejemplo, &quot;from Similarweb&quot;), Exa Agent invoca la herramienta del proveedor correspondiente en lugar de inferir el dato a partir de una página web.

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

Consulta [Exa Connect](/es/docs/agent/connect/overview) para ver la lista completa de partners de datos, con ejemplos de cada uno.

<div id="continue-from-a-previous-run">
  ## Continuar desde una ejecución anterior
</div>

Usa `previousRunId` para hacer preguntas de seguimiento sobre una respuesta anterior. Cada seguimiento inicia una nueva ejecución con su propio ID. `previousRunId` traslada el contexto a la nueva ejecución; no se reutiliza como ID de la nueva ejecución.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Narrow that list to companies hiring in San Francisco.",
      previous_run_id="agent_run_01j...",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Narrow that list to companies hiring in San Francisco.",
    previousRunId: "agent_run_01j..."
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Narrow that list to companies hiring in San Francisco.",
      "previousRunId": "agent_run_01j..."
    }'
  ```
</CodeGroup>

<div id="find-a-run-id">
  ## Encontrar un ID de ejecución
</div>

Enumera las ejecuciones recientes y consulta sus estados:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  runs = exa.agent.runs.list(
      limit=10,
  )

  for run in runs.data:
      query = (run.request or {}).get("query", "")
      print(f"{run.id}\t{run.status}\t{run.created_at}\t{query}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const list = await exa.agent.runs.list({
    limit: 10
  });

  for (const run of list.data) {
    const query = run.request?.query ?? "";
    console.log(`${run.id}\t${run.status}\t${run.createdAt}\t${query}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/agent/runs?limit=10" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="pricing">
  ## Precios
</div>

Los costos se basan en el uso y se calculan por componente:

| Componente                          | Precio            |
| ----------------------------------- | ----------------- |
| Agent Compute Units                 | `1 ACU = $0.10`   |
| Llamadas a la herramienta de search | `$0.005 / search` |

<Note>
  El enrichment de contactos es independiente de los componentes de precios anteriores: el enrichment de contactos por correo electrónico cuesta `$0.02 / email` y el de números de teléfono cuesta `$0.07 / phone number`.
</Note>

`usage.agentComputeUnits` mide el cómputo del modelo durante toda la ejecución. Las consultas complejas, sobre todo las que incluyen un campo `input.data` extenso, requieren más pasos de razonamiento y más llamadas a herramientas, por lo que consumen más ACU.

Consulta los [limits de Agent](/es/docs/admin/billing#agent-limits) para conocer los limits de concurrency y de tasa.

<div id="effort">
  ### Effort
</div>

Usa `effort` para elegir un nivel de costo y razonamiento en cada ejecución. Los valores admitidos son `minimal`, `low`, `medium`, `high`, `xhigh`, `auto` y `max`; el valor predeterminado es `auto`. Los niveles fijos tienen un precio por solicitud predecible, mientras que `auto` y `max` (beta) se facturan según el uso:

| Effort    | Precio                                                       |
| --------- | ------------------------------------------------------------ |
| `minimal` | `$0.012 / solicitud`                                         |
| `low`     | `$0.025 / solicitud`                                         |
| `medium`  | `$0.10 / solicitud`                                          |
| `high`    | `$0.50 / solicitud`                                          |
| `xhigh`   | `$1.00 / solicitud`                                          |
| `auto`    | Según uso; hasta el límite predeterminado de `$5`            |
| `max`     | **Beta**, según uso; hasta el límite predeterminado de `$20` |

<Info>
  Agent Max es el nivel de mayor esfuerzo, pensado para trabajos donde la exhaustividad
  y la integridad importan más que la latencia o el costo, como la construcción de listas
  grandes, la investigación profunda en múltiples fuentes y los criteria difíciles de
  verificar. Está en beta pública: las solicitudes con `effort: "max"` deben incluir
  `Exa-Beta: agent-max-effort-2026-07-27`. El encabezado acepta una lista de tokens beta
  separados por comas.
</Info>

`budget.maxCostDollars` es un tope opcional por ejecución para `auto` y `max`. Acepta valores de `$1` a `$100`; el máximo disponible es `$100`, aunque el servidor puede configurar uno menor. El tope predeterminado es de `$5` para `auto` y de `$20` para `max`. Se trata de un límite máximo, no de un precio fijo: las ejecuciones que terminan antes cuestan menos. El presupuesto no se acepta en los niveles de esfuerzo fijos.

<div id="choosing-an-effort-mode">
  ### Elegir un modo de esfuerzo
</div>

Los modos de esfuerzo fijo funcionan bien cuando quieres precios predecibles por solicitud en investigación estándar. Usa `auto` para trabajos de alcance variable, como la construcción de listas, donde la cantidad de entidades puede variar de una solicitud a otra.

| Esfuerzo  | Ideal para                                                                              | Complejidad de esquema sugerida                                                    | Expectativa de tiempo de ejecución             |
| --------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| `minimal` | Consultas de menor costo, tareas factuales muy acotadas, respuestas cortas              | Uno o dos campos, esquema superficial                                              | El más barato, el menos exhaustivo             |
| `low`     | Consultas simples, tareas factuales acotadas, respuestas cortas                         | Pocos campos, esquema superficial                                                  | Rápido, investigación ligera                   |
| `medium`  | Punto de partida predeterminado para la mayoría de las tareas de investigación estándar | Cantidad moderada de campos, objetos anidados simples                              | Equilibrio entre calidad y tiempo de ejecución |
| `high`    | Investigación más difícil, más citas, exhaustividad más estricta                        | Esquemas más grandes o campos con más matices                                      | Más lento, más minucioso                       |
| `xhigh`   | Tareas de alto valor donde la exhaustividad importa más que el costo o la latencia      | Esquemas complejos, muchos campos, verificación difícil                            | El esfuerzo fijo más lento                     |
| `auto`    | Trabajo de alcance variable, construcción de listas, dificultad desconocida             | Flexible; útil cuando se desconoce la cantidad de entidades o el trabajo requerido | Variable                                       |
| `max`     | Investigación de máximo esfuerzo (beta)                                                 | Esquemas complejos, muchos campos, verificación difícil                            | El de mayor duración                           |

Comienza con `medium` para investigación estándar de una sola entidad. Baja a `low` o `minimal` cuando el costo y la latencia importen más que la exhaustividad. Sube a `high` o `xhigh` cuando el esquema de salida sea más grande, los campos necesiten verificación o la tarea requiera un razonamiento más profundo. Usa `auto` cuando no conozcas el alcance de antemano, como en la construcción de listas o en flujos de trabajo que puedan devolver muchas entidades.

El tiempo de ejecución varía según la dificultad de la query, la complejidad del esquema y la disponibilidad de fuentes externas. Considera los modos de esfuerzo como un balance entre calidad, costo y tiempo de ejecución, y no como garantías estrictas de latencia.

<div id="run-with-max-effort">
  ### Ejecutar con esfuerzo máximo
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.beta.agent.runs.create(
      query="Find all companies building browser automation tools in the United States.",
      effort="max",
      budget={"maxCostDollars": 10},
      betas=["agent-max-effort-2026-07-27"],
  )
  print(run)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.beta.agent.runs.create({
    query: "Find all companies building browser automation tools in the United States.",
    effort: "max",
    budget: { maxCostDollars: 10 },
    betas: ["agent-max-effort-2026-07-27"]
  });
  console.log(run);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: agent-max-effort-2026-07-27" \
    -d '{
      "query": "Find all companies building browser automation tools in the United States.",
      "effort": "max",
      "budget": { "maxCostDollars": 10 }
    }'
  ```
</CodeGroup>

Los ejemplos de los SDK requieren una versión de `exa-py` o `exa-js` compatible con Agent Max.

<div id="zero-data-retention">
  ## Retención cero de datos
</div>

Exa Agent admite [Retención cero de datos](/es/docs/admin/security/zero-data-retention) (ZDR). La ZDR se habilita por equipo. [Contáctanos](mailto:sales@exa.ai) para habilitarla en tu cuenta.

Cuando la ZDR está habilitada en tu equipo:

* Crea ejecuciones con streaming (`Accept: text/event-stream`) para consumir la salida en tiempo real, o sondea las ejecuciones asíncronas dentro de la ventana de retención.
* Los datos de la ejecución están disponibles mientras esta se ejecuta y hasta 10 minutos después de que alcance un estado terminal. Pasada esa ventana, la ejecución ya no se puede recuperar.
* `previousRunId` no está disponible.
* Los `dataSources` de Exa Connect no están disponibles; las solicitudes que los incluyan devuelven un error `400`.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Qué contiene el índice" icon="search" href="/es/docs/search/data/overview" cta="Abrir guía" arrow="true">
    Explora fuentes de noticias, código, empresas y personas en toda la web pública.
  </Card>

  <Card title="Exa Connect" icon="database" href="/es/docs/agent/connect/overview" cta="Abrir guía" arrow="true">
    Adjunta bases de datos premium de partners a una ejecución.
  </Card>

  <Card title="Buenas prácticas de Agent" icon="lightbulb" href="/es/docs/agent/best-practices" cta="Abrir guía" arrow="true">
    Buenas prácticas para usar Exa Agent.
  </Card>

  <Card title="Ejemplos de Agent" icon="code" href="/es/docs/agent/examples" cta="Abrir guía" arrow="true">
    Ejemplos de uso de Exa Agent.
  </Card>
</Columns>