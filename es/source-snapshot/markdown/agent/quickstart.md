> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="exa-agent">
  # Exa Agent
</div>

> Ejecuta flujos de trabajo de deep research, creación de listas y enrichment que devuelven salidas estructuradas.

Exa Agent es un endpoint asíncrono y basado en uso para tareas de alto cómputo como creación de listas, enrichment y deep research. Maneja razonamiento complejo y puede devolver muchos campos de salida estructurada.

Piénsalo como un agente de contexto: describes los datos que quieres y el formato en el que deben devolverse, y Exa Agent orquesta las llamadas a herramientas necesarias para conseguirlo. Un solo run puede lanzar muchas búsquedas desde distintos ángulos, leer y condensar las páginas correspondientes, dividir la creación de listas en subtareas que se ejecutan en paralelo, verificar cada candidato frente a tus criteria, enriquecer contactos y consultar los data partners de [Exa Connect](/es/docs/agent/connect/overview) que adjuntes. Recibes el contexto ya ensamblado como un único resultado fundamentado y estructurado, en lugar de orquestar tú mismo cada llamada a `/search` y `/contents`.

Cada run puede devolver una respuesta en lenguaje natural, JSON validado contra un esquema, grounding a nivel de campo, metadatos y un desglose de costos. Puedes recuperar más tarde los runs completados, listar runs anteriores, reproducir eventos o continuar a partir de un run previo.

<Tip>
  ¿Prefieres MCP? Exa Agent y [Exa Connect](/es/docs/agent/connect/overview) están disponibles en [Exa MCP](/es/docs/get-started/exa-mcp#exa-agent). Habilita `tools=agent_run` para ejecutar investigación de varios pasos, creación de listas, enrichment y salida estructurada desde Claude, Cursor y otros MCP clients.
</Tip>

<div id="when-to-use-exa-agent">
  ## Cuándo usar Exa Agent
</div>

Usa Exa Agent cuando un flujo de trabajo necesite más que una sola llamada de búsqueda o de extracción, o cuando de otro modo tendrías que escribir tu propio bucle de búsquedas, lecturas de páginas y pasos de verificación para reunir los datos:

* Crear listas a partir de criteria abiertos y luego enriquecer cada resultado
* Investigar entidades en muchos campos con citas
* Ejecutar tareas de varios saltos como «encontrar empresas y luego encontrar a sus responsables de decisión»
* Producir JSON estructurado a partir de una tarea de investigación web de larga duración
* Combinar investigación web con data partners premium en una única respuesta fundamentada
* Continuar desde un run anterior con una solicitud de follow-up como «encuentra 10 resultados más»

Exa Agent es, por diseño, asíncrono y de mayor latencia. Para una sola búsqueda de baja latencia en la que tú mismo orquestas las llamadas, empieza con la [Search API](/es/docs/search/quickstart).

<div id="quickstart">
  ## Quickstart
</div>

Este ejemplo inicia un run que crea una lista estructurada de personas que cumplen tus criteria. Devuelve JSON en `output.structured`.

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
  ### 3. Crear un run
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

Agrega `Accept: text/event-stream` al crear un run para recibir server-sent events a medida que el run se encola, se inicia y se completa. Consulta [Eventos de streaming](#stream-events) para más detalles.

<div id="4-poll-for-completion">
  ### 4. Sondear hasta la finalización
</div>

Si no usas streaming de eventos, guarda el `id` devuelto y sondea el run hasta que alcance un estado terminal.

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

Los runs completados incluyen:

* `output.text`: una respuesta en lenguaje natural
* `output.structured`: JSON validado cuando proporcionas `outputSchema`
* `output.grounding`: citas del texto o de los campos estructurados, cuando se emiten
* `costDollars`: el desglose del costo del run

<Note>
  Exa Agent también está disponible a través de la Responses API compatible con OpenAI. Apunta
  el OpenAI SDK a `https://api.exa.ai`, usa `model: "exa-agent"` y elige entre
  ejecución síncrona, con streaming o en segundo plano. Consulta [compatibilidad con el OpenAI
  SDK](/es/docs/integrations/openai-sdk#agent-via-responses-api).
</Note>

<div id="verify-and-enrich-a-specific-entity">
  ## Verificar y enriquecer una entidad específica
</div>

Más allá de la creación de listas, usa Exa Agent para inspeccionar una única entidad conocida, contrastar una afirmación con fuentes autorizadas y devolver un enrichment estructurado. Este ejemplo comprueba si el sitio web oficial de una empresa tiene una página de precios de acceso público y enriquece el resultado con los detalles de precio cuando están disponibles. El esquema solo requiere `domain` y `verdict`; todo lo demás es enrichment opcional.

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
  Los esquemas para flujos de trabajo de verificación deben contemplar la incertidumbre. Haz
  que los campos que quizá no puedan verificarse admitan valores nulos y déjalos fuera de `required`,
  de modo que el agente pueda devolver `null` en lugar de inventar un valor. El enum `verdict`
  distingue una inspección fallida (`cannot_verify`) de la evidencia negativa real
  (`absent`): que no se haya podido acceder a un sitio no es evidencia de que
  la página no exista.
</Note>

<div id="stream-events">
  ## Eventos de streaming
</div>

El streaming mantiene abierta la solicitud de creación y envía Server-Sent Events (SSE) hasta que el run finaliza. Consulta [Formato de eventos](#event-format) para ver los tipos de evento y los payloads.

Establece `stream=True` en Python, `stream: true` en JavaScript, o envía `Accept: text/event-stream` por HTTP:

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

El stream también puede contener líneas de comentario como `: keep-alive`. Los clientes SSE ignoran los comentarios automáticamente; los parsers personalizados deberían hacer lo mismo.

<div id="event-types">
  ### Tipos de evento
</div>

| Evento                | Payload de `data`                     | Cómo usarlo                                                                                                      |
| --------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | Guarda el ID del run en cuanto se acepte la solicitud.                                                           |
| `agent_run.started`   | `{ id, status: "running" }`           | Marca el run como en procesamiento activo.                                                                       |
| `agent_run.completed` | El objeto del Agent run completado    | Lee la respuesta final en `data.output.text` o `data.output.structured`, y las citas en `data.output.grounding`. |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | Muestra `error.code` y `error.message`; no hay output completado disponible.                                     |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | Deja de consumir el stream y trata el run como cancelado.                                                        |

Los eventos asociados a un mismo paso de investigación incluyen un `callId`, que se corresponde con `item.call_id` en los eventos de progreso de herramientas. Úsalo para agrupar trazas de búsqueda, sources y progreso de herramientas. Algunas descripciones de trazas de búsqueda se generan de forma asíncrona y pueden llegar después del evento de source o de herramienta que describen, así que no las correlaciones solo por el orden de llegada.

Trata `agent_run.source.added` como una vista previa en vivo y no como una lista completa de citas. El `output.grounding` del run terminal es el output de grounding de referencia.

<div id="replay-stored-events">
  ### Reproducir eventos almacenados
</div>

Para los runs sin ZDR, [`GET /agent/runs/{id}/events`](/es/docs/reference/agent-api/list-run-events) devuelve los eventos almacenados como JSON paginado. Envía `Accept: text/event-stream` para reproducir los eventos almacenados como SSE, y `Last-Event-ID` para omitir los eventos que tu cliente ya haya procesado:

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

El endpoint de reproducción envía los eventos almacenados en el momento de la solicitud y luego se cierra; no continúa siguiendo un run en curso. Los runs con ZDR no conservan eventos y no se pueden reproducir.

Para garantizar la compatibilidad futura, ignora los nombres de evento que tu aplicación no reconozca y continúa hasta que llegue un evento terminal.

<div id="return-structured-json">
  ## Devolver JSON estructurado
</div>

Usa `outputSchema` para devolver JSON validado contra un esquema en `output.structured`.

`outputSchema` admite la [especificación JSON Schema](https://json-schema.org/).

Para solicitar información de contacto, describe los campos de contacto deseados en `outputSchema`. Usa estructuras estándar de JSON Schema como `{ "type": "string", "format": "email" }` para direcciones de correo electrónico, `{ "type": "string", "format": "phone" }` para números de teléfono y `{ "type": "string", "format": "uri" }` para URL. Acota el tamaño de las listas con `maxItems` siempre que sea posible para que el costo máximo del enrichment de contactos sea predecible.

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

Usa `input.data` cuando ya tengas un conjunto de datos que quieras enriquecer. Puedes añadir más campos a cada entidad de datos, descubrir nuevas entidades a partir de los datos que aportes, o ambas cosas.

Para ver ejemplos completos de enrichment de filas, consulta [Ejemplos de Agent](/es/docs/agent/examples#enrich-input-rows-code).

<div id="process-exclusions">
  ## Procesar exclusiones
</div>

Usa `input.exclusion` para evitar que ciertas entradas aparezcan en el run. En el siguiente ejemplo, buscamos los 10 animales más tiernos, pero excluimos del run las cabras y los pandas porque ya sabemos lo tiernos que son.

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

El índice ya está disponible en cada run. Usa `dataSources` únicamente para adjuntar partners de [Exa Connect](/es/docs/agent/connect/overview). Cada entrada selecciona un `provider`. Cuando una propiedad de tu `outputSchema` hace referencia a una fuente específica (por ejemplo, &quot;from Similarweb&quot;), Exa Agent llama a la herramienta del proveedor correspondiente en lugar de inferir el dato de una página web.

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

Consulta [Exa Connect](/es/docs/agent/connect/overview) para ver la lista completa de data partners, con ejemplos de cada uno.

<div id="continue-from-a-previous-run">
  ## Continuar desde un run anterior
</div>

Usa `previousRunId` para enviar follow-ups a una respuesta anterior. Cada follow-up inicia un nuevo run con su propio ID. `previousRunId` traslada el contexto al nuevo run; no se reutiliza como ID del nuevo run.

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
  ## Encontrar un ID de run
</div>

Lista los runs recientes e inspecciona sus estados:

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

| Componente                            | Precio              |
| ------------------------------------- | ------------------- |
| Agent Compute Units                   | `1 ACU = $0.10`     |
| Llamadas a la herramienta de búsqueda | `$0.005 / búsqueda` |

<Note>
  El enrichment de contacto es independiente de los componentes de precios anteriores: el enrichment de contacto por correo electrónico cuesta `$0.02 / correo electrónico` y el de número de teléfono, `$0.07 / número de teléfono`.
</Note>

`usage.agentComputeUnits` mide la computación del modelo durante todo el run. Las consultas complejas, sobre todo las que tienen un campo `input.data` extenso, requieren más pasos de razonamiento y más llamadas a herramientas, por lo que consumen más ACU.

Consulta [Límites de Agent](/es/docs/admin/billing#agent-limits) para conocer los límites de concurrencia y de tasa.

<div id="effort">
  ### Effort
</div>

Usa `effort` para elegir un nivel de costo y razonamiento en cada run. Los valores admitidos son `minimal`, `low`, `medium`, `high`, `xhigh`, `auto` y `max`; el valor predeterminado es `auto`. Los niveles de effort fijos tienen un precio predecible por solicitud, mientras que `auto` y `max` (beta) se cobran según el uso:

| Effort    | Precio                                                     |
| --------- | ---------------------------------------------------------- |
| `minimal` | `$0.012 / solicitud`                                       |
| `low`     | `$0.025 / solicitud`                                       |
| `medium`  | `$0.10 / solicitud`                                        |
| `high`    | `$0.50 / solicitud`                                        |
| `xhigh`   | `$1.00 / solicitud`                                        |
| `auto`    | Según uso; hasta el tope predeterminado de `$5`            |
| `max`     | **Beta**, según uso; hasta el tope predeterminado de `$20` |

<Info>
  Agent Max es el nivel de effort más alto, pensado para tareas en las que la
  exhaustividad y la cobertura importan más que la latencia o el costo, como la
  creación de listas grandes, la investigación profunda con múltiples fuentes y
  criteria difíciles de verificar. Está en beta pública: las solicitudes con
  `effort: "max"` deben incluir `Exa-Beta: agent-max-effort-2026-07-27`. El
  encabezado acepta una lista de tokens beta separados por comas.
</Info>

`budget.maxCostDollars` es un tope opcional por run para `auto` y `max`. Acepta valores de `$1` a `$100`; el máximo disponible es `$100`, aunque el server puede configurar un máximo menor. El tope predeterminado es `$5` para `auto` y `$20` para `max`. Es un tope, no un precio fijo: los runs que terminan antes cuestan menos. El budget no se acepta con niveles de effort fijos.

<div id="choosing-an-effort-mode">
  ### Elegir un modo de effort
</div>

Los modos de effort fijos funcionan bien cuando se busca un precio por solicitud predecible para investigación estándar. Usa `auto` para trabajos de alcance variable, como la creación de listas, donde la cantidad de entidades puede variar de una solicitud a otra.

| Effort    | Ideal para                                                                              | Complejidad de esquema sugerida                                                    | Expectativa de tiempo de ejecución             |
| --------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| `minimal` | Consultas de menor costo, tareas fácticas muy acotadas, respuestas cortas               | Uno o dos campos, esquema superficial                                              | El más económico y el menos exhaustivo         |
| `low`     | Consultas simples, tareas fácticas acotadas, respuestas cortas                          | Unos pocos campos, esquema superficial                                             | Rápido, investigación ligera                   |
| `medium`  | Punto de partida predeterminado para la mayoría de las tareas de investigación estándar | Cantidad moderada de campos, objetos anidados simples                              | Equilibrio entre calidad y tiempo de ejecución |
| `high`    | Investigación más difícil, más citas, mayor exigencia de exhaustividad                  | Esquemas más grandes o campos con más matices                                      | Más lento, más minucioso                       |
| `xhigh`   | Tareas de alto valor donde la exhaustividad importa más que el costo o la latencia      | Esquemas complejos, muchos campos, verificación difícil                            | El effort fijo más lento                       |
| `auto`    | Trabajos de alcance variable, creación de listas, dificultad desconocida                | Flexible; útil cuando se desconoce la cantidad de entidades o el trabajo requerido | Variable                                       |
| `max`     | Investigación de máximo effort (beta)                                                   | Esquemas complejos, muchos campos, verificación difícil                            | El de mayor duración                           |

Comienza con `medium` para investigación estándar de una sola entidad. Baja a `low` o `minimal` cuando el costo y la latencia importen más que la exhaustividad. Sube a `high` o `xhigh` cuando el esquema de salida sea más grande, los campos requieran verificación o la tarea necesite un razonamiento más profundo. Usa `auto` cuando no conozcas el alcance de antemano, como en la creación de listas o en flujos de trabajo que pueden devolver muchas entidades.

El tiempo de ejecución varía según la dificultad de la consulta, la complejidad del esquema y la disponibilidad de fuentes externas. Considera los modos de effort como un equilibrio entre calidad, costo y tiempo de ejecución, y no como garantías estrictas de latencia.

<div id="run-with-max-effort">
  ### Run con effort máximo
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

Los ejemplos de SDK requieren una versión de `exa-py` o `exa-js` compatible con Agent Max.

<div id="zero-data-retention">
  ## Zero Data Retention
</div>

Exa Agent admite [Zero Data Retention](/es/docs/admin/security/zero-data-retention) (ZDR). ZDR se habilita por equipo. [Contáctanos](mailto:sales@exa.ai) para habilitarlo en tu cuenta.

Cuando ZDR está habilitado en tu equipo:

* Crea runs con streaming (`Accept: text/event-stream`) para consumir el output en tiempo real, o sondea los runs asíncronos dentro de la ventana de retención.
* Los datos del run están disponibles mientras el run se ejecuta y hasta 10 minutos después de que alcance un estado terminal. Pasada esa ventana, el run ya no se puede recuperar.
* `previousRunId` no está disponible.
* Los `dataSources` de Exa Connect no están disponibles; las solicitudes que los incluyan devuelven un error `400`.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Qué contiene el índice" icon="search" href="/es/docs/search/data/overview" cta="Abrir guía" arrow="true">
    Explora fuentes de noticias, código, empresas y personas de toda la web pública.
  </Card>

  <Card title="Exa Connect" icon="database" href="/es/docs/agent/connect/overview" cta="Abrir guía" arrow="true">
    Adjunta bases de datos premium de partners a un run.
  </Card>

  <Card title="Buenas prácticas del Agent" icon="lightbulb" href="/es/docs/agent/best-practices" cta="Abrir guía" arrow="true">
    Buenas prácticas para usar Exa Agent.
  </Card>

  <Card title="Ejemplos del Agent" icon="code" href="/es/docs/agent/examples" cta="Abrir guía" arrow="true">
    Ejemplos de uso de Exa Agent.
  </Card>
</Columns>