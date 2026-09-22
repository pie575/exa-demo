> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Compatibilidad con el OpenAI SDK {#openai-sdk-compatibility}

> Usa los endpoints de Exa como reemplazo directo de OpenAI, con soporte tanto para la API de chat completions como para la Responses API.

<Card title="Quickstart de agente de programación" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  ¿Es tu primera vez con Exa? Empieza en menos de un minuto.
</Card>

***

## Descripción general {#overview}

Exa ofrece endpoints compatibles con OpenAI que funcionan con el OpenAI SDK:

| Endpoint            | Interfaz de OpenAI   | Modelos disponibles | Caso de uso                                                         |
| ------------------- | -------------------- | ------------------- | ------------------------------------------------------------------- |
| `/chat/completions` | Chat Completions API | `exa`               | Interfaz de chat tradicional                                        |
| `/responses`        | Responses API        | `exa-agent`         | Agent API (investigación asíncrona, enrichment, creación de listas) |

<Info>
  `/chat/completions` se enruta a [`/answer`](/es/docs/reference/answer) y `/responses` se enruta a la [Agent API](/es/docs/agent/quickstart). Consulta [Agent mediante la Responses API](#agent-via-responses-api) más abajo.
</Info>

## Answer {#answer}

Para usar el endpoint `/answer` de Exa mediante la interfaz de chat completions:

1. Sustituye la URL base por `https://api.exa.ai`
2. Sustituye la API key por tu API key de Exa
3. Sustituye el nombre del modelo por `exa`.

<Info>
  Consulta la referencia completa del endpoint [`/answer`](/es/docs/reference/answer). Si necesitas un comportamiento de enrutamiento personalizado, escribe a [hello@exa.ai](mailto:hello@exa.ai).
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # usa exa como url base
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # usa extra_body para pasar parámetros adicionales al endpoint /answer
    extra_body={
      "text": True # incluye el texto completo de las fuentes
    }
  )

  print(completion.choices[0].message.content)  # imprime el contenido de la respuesta
  print(completion.choices[0].message.citations)  # imprime las citas
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // usa exa como url base
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "exa",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "What are the latest developments in quantum computing?",
        },
      ],
      store: true,
      stream: true,
      extra_body: {
        text: true, // incluye el texto completo de las fuentes
      },
    });

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s https://api.exa.ai/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "model": "exa",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "What are the latest developments in quantum computing?"
        }
      ],
      "text": true
    }'
  ```
</CodeGroup>

## Agent mediante la Responses API {#agent-via-responses-api}

El endpoint [`/responses`](https://api.exa.ai/responses) de Exa expone la [Agent API](/es/docs/agent/quickstart) a través de la interfaz de OpenAI Responses, por lo que los SDK de OpenAI funcionan con ella sin cambios. Define `model: "exa-agent"` y elige un modo de ejecución:

| Modo             | Solicitud                           | Comportamiento                                                                                                           |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Synchronous      | default (sin `stream`/`background`) | La solicitud se bloquea y devuelve el objeto `response` completado.                                                      |
| Streaming        | `stream: true`                      | La solicitud transmite eventos de OpenAI Responses (SSE) a medida que avanza el run y finaliza con `response.completed`. |
| En segundo plano | `background: true`                  | La solicitud devuelve de inmediato una respuesta `in_progress`; sondea `GET /responses/{id}` para obtener el resultado.  |

Define `reasoning.effort` (`minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, `max`) para equilibrar el costo frente a la profundidad, y cancela un run con `POST /responses/{id}/cancel`. Para `max`, define `Exa-Beta: agent-max-effort-2026-07-27` como encabezado por defecto del cliente. La [guía de Agent](/es/docs/agent/quickstart) cubre el modelo de runs, la forma del output y el precio por effort en los que se apoya esta interfaz.

<Warning>
  Los runs con `reasoning.effort` en `high`, `xhigh` y `max` tardan demasiado para una solicitud síncrona y devuelven `400`. Usa `stream: true` o `background: true` para esos runs. `/responses` no tiene un campo `budget`; max utiliza su límite por run predeterminado.
</Warning>

Usa `previous_response_id` para continuar un run de Responses completado.

### Synchronous {#synchronous}

La solicitud se bloquea hasta que el run finaliza y devuelve el objeto `response` terminal.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning={"effort": "medium"},
  )

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning: { effort: "medium" },
    });

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "reasoning": { "effort": "medium" }
    }'
  ```
</CodeGroup>

### Streaming {#streaming}

Establece `stream: true` para recibir los eventos de stream de Responses mediante SSE. Los eventos incluyen un `sequence_number` monótono y finalizan con `response.completed`; no existe un centinela `[DONE]`. El stream puede incluir líneas de comentario `: keep-alive`, que los clientes SSE ignoran.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  with client.responses.stream(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
  ) as stream:
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="", flush=True)
      final = stream.get_final_response()

  print("\n\n", final.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const stream = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -N -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "stream": true
    }'
  ```
</CodeGroup>

### En segundo plano {#background}

Establece `background: true` para iniciar un run sin mantener la conexión abierta y luego sondea `GET /responses/{id}` hasta que alcance un estado terminal. Para usar streaming en lugar de sondeo, consulta [Streaming](#streaming).

<CodeGroup>
  ```python Python theme={null}
  import os
  import time
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      background=True,
  )

  # Sondear hasta que se complete
  while response.status in ("queued", "in_progress"):
      time.sleep(5)
      response = client.responses.retrieve(response.id)

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    let response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      background: true,
    });

    // Sondear hasta que se complete
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # Crear un run en segundo plano
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }'

  # Sondear con el ID de respuesta devuelto
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

## Chat wrapper {#chat-wrapper}

Exa ofrece un wrapper de Python que añade automáticamente capacidades de RAG a cualquier chat completion de OpenAI. Con una sola línea de código, puedes convertir cualquier chat completion de OpenAI en un sistema RAG impulsado por Exa que se encarga de la búsqueda, la segmentación y el prompting de forma automática.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # Inicializa los clientes
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # Envuelve el cliente de OpenAI
  exa_openai = exa.wrap(openai)

  # Úsalo exactamente igual que el cliente normal de OpenAI
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

El cliente envuelto funciona exactamente igual que el cliente nativo de OpenAI, con la diferencia de que mejora automáticamente tus completions con resultados de búsqueda relevantes cuando hace falta.

El wrapper admite cualquier parámetro de la función `exa.search()`.

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto", "required" o "none"
    num_results=5,               # valor por defecto: 3
    result_max_len=1024,         # valor por defecto: 2048 caracteres
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```