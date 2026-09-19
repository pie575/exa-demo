> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="elevenlabs">
  # ElevenLabs
</div>

> Añade búsqueda web de Exa a los agentes de voz de ElevenLabs.

***

Los agentes de voz de ElevenLabs pueden buscar en la web en mitad de una conversación usando Exa como **herramienta de webhook**. Cuando el agente determina que necesita información actualizada, ElevenLabs hace una solicitud HTTP POST directamente al endpoint `/search` de Exa: no necesitas ningún servidor ni middleware por tu parte.

Hay dos formas de conectar Exa con ElevenLabs:

| Enfoque                                    | Configuración                          | Flexibilidad                                                                                |
| ------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Herramienta de webhook** (recomendada)   | Configúrala mediante la API o el panel | Control total sobre los parámetros de búsqueda, las opciones de contenido y los encabezados |
| **Integración nativa de Exa** (alpha) | Un clic en el panel de ElevenLabs      | Más sencilla, pero con configuración limitada                                               |

Esta guía cubre el enfoque de la herramienta de webhook, que te da control total sobre cómo se invoca a Exa. También puedes configurar la integración desde el [panel de ElevenLabs](https://elevenlabs.io/app/conversational-ai).

<div id="how-it-works">
  ## Cómo funciona
</div>

1. El usuario habla con el agente de voz
2. El LLM decide llamar a `web_search` según la descripción de la herramienta
3. ElevenLabs envía un POST a `https://api.exa.ai/search` con los encabezados y el cuerpo que configuraste
4. Los parámetros determinados por el LLM (la `query` de la búsqueda) se combinan con tus valores constantes (`type`, `numResults`, `contents`)
5. Los resultados de Exa regresan al LLM, que responde de forma conversacional

Sin servidor, sin URL de callback, sin listener. ElevenLabs es el cliente HTTP que llama directamente a Exa. Las llamadas a herramientas tienen un tiempo de espera de 20 segundos.

<div id="prerequisites">
  ## Requisitos previos
</div>

* Una [API key de Exa](https://dashboard.exa.ai/api-keys)
* Una [API key de ElevenLabs](https://elevenlabs.io/app/settings/api-keys)

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen credits gratuitos.
</Card>

<div id="get-started">
  ## Empezar
</div>

<Steps>
  <Step title="Crear la herramienta de webhook">
    Usa la [API Create Tool](https://elevenlabs.io/docs/api-reference/tools/create) de ElevenLabs para registrar una herramienta de webhook que apunte al endpoint de search de Exa.

    El concepto clave: las propiedades con `constant_value` son fijas (se envían en cada solicitud), mientras que las propiedades con `description` las determina el LLM en tiempo de ejecución.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/tools" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "tool_config": {
          "type": "webhook",
          "name": "web_search",
          "description": "Search the web using Exa. Use this when the user asks anything that needs current or factual information.",
          "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
              "x-api-key": "YOUR_EXA_API_KEY",
              "Content-Type": "application/json",
              "x-exa-integration": "elevenlabs"
            },
            "request_body_schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "Natural language search query. Be specific."
                },
                "type": {
                  "type": "string",
                  "constant_value": "instant"
                },
                "numResults": {
                  "type": "integer",
                  "constant_value": 5
                },
                "contents": {
                  "type": "object",
                  "properties": {
                    "highlights": {
                      "type": "boolean",
                      "constant_value": true
                    }
                  }
                }
              },
              "required": ["query"]
            }
          }
        }
      }'
    ```

    Esto crea una herramienta en la que:

    * `query` — lo completa el LLM según el contexto de la conversación
    * `type: "instant"` — usa el modo de search más rápido de Exa (~150 ms)
    * `numResults: 5` — devuelve 5 resultados por search
    * `contents.highlights: true` — devuelve highlights eficientes en tokens (lo ideal para la latencia de voz)

    Guarda el `id` devuelto: lo necesitarás para conectar la herramienta a un agent.

    <Note>
      Si ya tienes un agent, puedes omitir el paso 2 y añadir la herramienta a tu agent existente desde el panel de ElevenLabs, en **Agent &gt; Tools**, o mediante la [API Update Agent](https://elevenlabs.io/docs/api-reference/agents/update). La herramienta no hará nada hasta que se asocie a un agent.
    </Note>
  </Step>

  <Step title="Crear un agent con la herramienta">
    Crea un agent conversacional y asocia la herramienta de webhook mediante su ID.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/agents/create" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Exa Search Assistant",
        "conversation_config": {
          "agent": {
            "prompt": {
              "prompt": "You are a helpful voice assistant with real-time web search powered by Exa. When users ask questions that need current information, use the web_search tool.\n\nGuidelines:\n- Search proactively for time-sensitive or factual questions.\n- Summarize results conversationally — do not read URLs aloud.\n- Cite sources naturally.\n- Keep responses concise — this is voice.",
              "tool_ids": ["YOUR_TOOL_ID"]
            },
            "first_message": "Hey! I can search the web for you in real-time. What would you like to know?"
          }
        }
      }'
    ```

    La respuesta incluye un `agent_id`. Abre el agent en el panel de ElevenLabs para probarlo:

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="Insertar el widget">
    Añade el agent a cualquier página web con dos líneas de HTML:

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

<div id="full-python-example">
  ## Ejemplo completo en Python
</div>

Este script crea tanto la herramienta de webhook como el agent en una sola ejecución:

```python python theme={null}
import os
import requests

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
EXA_API_KEY = os.environ["EXA_API_KEY"]
BASE = "https://api.elevenlabs.io/v1/convai"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

# 1. Crear la herramienta webhook
tool_resp = requests.post(f"{BASE}/tools", headers=HEADERS, json={
    "tool_config": {
        "type": "webhook",
        "name": "web_search",
        "description": (
            "Search the web using Exa. Use this when the user asks anything "
            "that needs current or factual information."
        ),
        "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
                "x-api-key": EXA_API_KEY,
                "Content-Type": "application/json",
                "x-exa-integration": "elevenlabs",
            },
            "request_body_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Natural language search query. Be specific.",
                    },
                    "type": {"type": "string", "constant_value": "instant"},
                    "numResults": {"type": "integer", "constant_value": 5},
                    "contents": {
                        "type": "object",
                        "properties": {
                            "highlights": {
                                "type": "boolean",
                                "constant_value": True,
                            }
                        },
                    },
                },
                "required": ["query"],
            },
        },
    }
})
tool_resp.raise_for_status()
tool_id = tool_resp.json()["id"]
print(f"Tool created: {tool_id}")

# 2. Crear el agent
agent_resp = requests.post(f"{BASE}/agents/create", headers=HEADERS, json={
    "name": "Exa Search Assistant",
    "conversation_config": {
        "agent": {
            "prompt": {
                "prompt": (
                    "You are a helpful voice assistant with real-time web search "
                    "powered by Exa. When users ask questions that need current "
                    "information, use the web_search tool.\n\n"
                    "Guidelines:\n"
                    "- Search proactively for time-sensitive or factual questions.\n"
                    "- Summarize results conversationally — do not read URLs aloud.\n"
                    "- Cite sources naturally.\n"
                    "- Keep responses concise — this is voice."
                ),
                "tool_ids": [tool_id],
            },
            "first_message": "Hey! I can search the web for you. What would you like to know?",
        }
    },
})
agent_resp.raise_for_status()
agent_id = agent_resp.json()["agent_id"]
print(f"Agent created: {agent_id}")
print(f"Dashboard: https://elevenlabs.io/app/conversational-ai/agents/{agent_id}")
```

Ejecútalo:

```bash bash theme={null}
export ELEVENLABS_API_KEY="your-key"
export EXA_API_KEY="your-key"
python elevenlabs_exa_webhook.py
```

<div id="customizing-search-parameters">
  ## Personalizar los parámetros de search
</div>

El esquema del cuerpo de la herramienta de webhook se corresponde directamente con la [Search API de Exa](/es/docs/reference/search). Estas son algunas configuraciones habituales:

<div id="search-type">
  ### Tipo de search
</div>

Controla el equilibrio entre velocidad y calidad con la constante `type`:

| Tipo      | Latencia | Ideal para                          |
| --------- | -------- | ----------------------------------- |
| `instant` | ~150 ms  | Conversaciones de voz (recomendado) |
| `auto`    | ~1 s     | Uso general                         |

Para los agentes de voz, empieza con `instant`. Usa `auto` cuando quieras que Exa elija el mejor modo de search disponible en cada momento para cada query.

<div id="content-options">
  ### Opciones de contenido
</div>

Elige cómo se devuelven los resultados mediante el objeto `contents`:

```json json theme={null}
{
  "contents": {
    "type": "object",
    "properties": {
      "highlights": {
        "type": "boolean",
        "constant_value": true
      }
    }
  }
}
```

* **`highlights`** — Extractos eficientes en tokens. Úsalo cuando quieras fragmentos relevantes sin saturar el contexto del LLM. Pasa `true` para usar el valor predeterminado de mayor calidad.
* **`text`** — Markdown completo de la página. Úsalo cuando el agent necesite todo el contenido de la página. Define `maxCharacters` para limitar la longitud.
* **`summary`** — Resumen de cada página generado por un LLM. Mayor latencia, pero ofrece contenido sintetizado.

Para los agentes de voz, se recomienda usar `highlights: true` de forma predeterminada: equilibra la relevancia con la velocidad de respuesta.

<div id="filtering-results">
  ### Filtrar resultados
</div>

Agrega filtros de dominio o de fecha como constantes:

```json json theme={null}
{
  "includeDomains": {
    "type": "array",
    "constant_value": ["reuters.com", "apnews.com", "bbc.com"]
  }
}
```

```json json theme={null}
{
  "startPublishedDate": {
    "type": "string",
    "constant_value": "2025-01-01T00:00:00.000Z"
  }
}
```

<div id="number-of-results">
  ### Número de resultados
</div>

Ajusta `numResults` según tu caso de uso. Para voz, de 3 a 5 resultados mantienen las respuestas rápidas. Para agents orientados a investigación, 10 o más ofrecen una cobertura más amplia.

<div id="schema-reference">
  ## Referencia del esquema
</div>

Las herramientas de webhook de ElevenLabs usan un esquema JSON con estos tipos de propiedades:

* **`constant_value`** — Valor fijo que se envía en cada solicitud. El LLM nunca lo ve ni lo modifica. Funciona con cadenas, números y booleanos.
* **`description`** — El LLM determina el valor en tiempo de ejecución a partir de esta descripción. Úsalo para parámetros dinámicos como `query`.
* **Objetos anidados** — Usa `type: "object"` con `properties` para construir estructuras anidadas como `contents.highlights`.

Cada parámetro tiene un selector de modo en el panel: **Fixed** o **LLM**:

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="Configuración de parámetros de la herramienta de webhook de ElevenLabs donde se muestran los selectores de modo Fixed y LLM" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

Los parámetros configurados como **Fixed** (marcados con `constant_value` en la API) se envían tal cual en cada solicitud. Los parámetros configurados como **LLM** (marcados con `description`) dejan que el modelo elija el valor en tiempo de ejecución. Mantén en Fixed todos los parámetros que puedas: cada parámetro determinado por el LLM añade un paso de llamada a herramienta que aumenta la latencia de respuesta.

Para ver el esquema completo de las herramientas de webhook de ElevenLabs, consulta la [documentación de server tools de ElevenLabs](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools).

<div id="built-in-exa-integration-alpha">
  ## Integración nativa de Exa (alpha)
</div>

ElevenLabs también ofrece una integración nativa de Exa disponible en el panel del agent, en **Tools &gt; Integrations**. Es más sencilla de configurar, pero personalizar los parámetros de search resulta más difícil que con el enfoque de la herramienta de webhook.

Para tener control total sobre el tipo de search, las opciones de contenido y el filtrado, se recomienda el enfoque de la herramienta de webhook descrito anteriormente.