> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

# Pydantic AI {#pydantic-ai}

> Dale a un agente de Pydantic AI herramientas de investigación web respaldadas por la Exa Search API.

<Card title="Quickstart de agentes de programación" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  ¿Es tu primera vez con Exa? Empieza en menos de un minuto.
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) es un framework de agentes en Python creado por el equipo detrás de Pydantic. Su [harness](https://pydantic.dev/docs/ai/harness/exa-search/) incluye una integración oficial de Exa en forma de dos capacidades componibles:

* **`ExaSearch`**: herramientas de investigación web respaldadas por la Exa Search API: `web_search` (los mejores resultados con sus extractos más relevantes, más un resumen de texto sintetizado opcional), `get_page` (recuperación de la página completa para una URL concreta) y `deep_search` opcional (una respuesta sintetizada y con citas en una sola llamada).
* **`ExaAgent`**: delega la investigación de larga duración en la [Exa Agent API](/es/docs/agent/quickstart) como llamadas a herramienta diferidas.

Una capacidad agrupa las herramientas, los presupuestos de output por herramienta y unas breves indicaciones de investigación en el prompt de sistema, de modo que no tengas que conectar tú mismo una API de búsqueda con un recuperador de páginas ni indicarle al agente que investigue de forma metódica.

<Info> Consulta la referencia completa de Pydantic [aquí](https://pydantic.dev/docs/ai/harness/exa-search/). </Info>

<Card title="Lee el artículo de Pydantic sobre cómo crear un agente de investigación con Exa" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  Un recorrido por tres agentes de investigación listos para copiar y pegar, creados con Pydantic AI y Exa.
</Card>

***

## Primeros pasos {#get-started}

<Steps>
  <Step title="Requisitos previos e instalación">
    Instala el harness con el extra de Exa y define tu variable de entorno `EXA_API_KEY`.

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
    </Card>
  </Step>

  <Step title="Agregar ExaSearch a un agente">
    Pasa `ExaSearch` a un `Agent` mediante el parámetro `capabilities`. De forma predeterminada, la autenticación se toma de `EXA_API_KEY`.

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch` aporta dos herramientas al agente:

    | Herramienta  | Propósito                                                                                                                       |
    | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
    | `web_search` | Busca en la web y devuelve las primeras `num_results` páginas, cada una con título, URL y sus extractos más relevantes.         |
    | `get_page`   | Recupera el texto completo de una URL concreta: un resultado prometedor de `web_search` o una URL proporcionada por el usuario. |

    `web_search` devuelve extractos cortos (highlights de Exa) en lugar del texto completo de la página, de modo que revisar varias fuentes resulta económico; después el agente lee la página elegida con `get_page`. Una URL o pregunta que no devuelve contenido, un límite de tasa o un fallo transitorio se comunican al modelo como un `ModelRetry` para que el run pueda recuperarse; los fallos de autenticación (401/403) se propagan como errores de configuración.
  </Step>

  <Step title="Habilitar deep search (opcional)">
    `deep_search` ejecuta la [deep search](/es/docs/search/quickstart) de varios pasos de Exa (`type='deep'`): Exa expande la pregunta en varias consultas, busca y devuelve una respuesta fundamentada en citas con una sola llamada a herramienta. Dedica más tiempo y profundidad de búsqueda que `web_search`, por lo que está desactivada de forma predeterminada. Actívala explícitamente:

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    Cuando está habilitada, las instrucciones de la capacidad indican al modelo que trate `deep_search` como una escalada desde `web_search`, no como un reemplazo.
  </Step>
</Steps>

***

## Configuración {#configuration}

Todos los campos de `ExaSearch` con su valor predeterminado:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # resultados por llamada a web_search (1 a 100)
    max_text_chars=10_000,     # límite de texto de get_page, en caracteres (1 a 10.000)
    text_summary=False,        # web_search también devuelve un resumen de texto sintetizado
    include_deep_search=False, # expone además la herramienta deep_search
    include_domains=[],        # buscar solo en estos dominios (lista de permitidos)
    exclude_domains=[],        # nunca buscar en estos dominios (lista de bloqueados)
    guidance=None,             # None = instrucciones predeterminadas, '' = ninguna, str = personalizada
    client=None,               # ExaClient -- None construye exa_py.AsyncExa a partir de EXA_API_KEY
)
```

`include_domains` y `exclude_domains` se aplican a `web_search` y `deep_search`, y son mutuamente excluyentes. Los límites fuera de rango y definir ambas listas de dominios provocan un error en la construcción.

### Resumen de texto {#text-summary}

Define `text_summary` para que cada llamada a `web_search` solicite también un resumen sintetizado en texto plano de los resultados. Pasa `True` para obtener un resumen sin restricciones, o una cadena que describa el formato deseado:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

La estructura del valor devuelto por la herramienta no cambia: cuando Exa devuelve un resumen, este se antepone como una línea `Summary:`.

### Citas estructuradas {#structured-citations}

Cada herramienta devuelve un `ToolReturn`: `return_value` contiene el texto legible que ve el modelo (incluidos los bloques `Sources:`), y `metadata` contiene las fuentes como registros `ExaSource` estructurados (`{'url': ..., 'title': ...}`) bajo la clave `'sources'`. Los metadatos nunca se envían al modelo, así que renderizar las citas no requiere analizar ningún texto:

```Python Python theme={null}
from pydantic_ai.messages import ModelRequest, ToolReturnPart

for message in result.all_messages():
    if isinstance(message, ModelRequest):
        for part in message.parts:
            if isinstance(part, ToolReturnPart) and part.metadata is not None:
                for source in part.metadata.get('sources', []):
                    print(source['url'], source['title'])
```

### Cliente personalizado {#custom-client}

El cliente predeterminado es `exa_py.AsyncExa`, configurado a partir de `EXA_API_KEY`. Pasa cualquier objeto que cumpla el protocolo `ExaClient` para configurar explícitamente la autenticación o la URL base, o para sustituirlo por un doble de prueba en tus tests:

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

## Runs del agente de Exa {#exa-agent-runs}

La [Exa Agent API](/es/docs/agent/quickstart) ejecuta tareas de investigación abiertas de forma asíncrona. La capacidad `ExaAgent` adapta ese ciclo de vida a las [llamadas a herramienta diferidas](https://pydantic.dev/docs/ai/deferred-tools/) de Pydantic AI: su herramienta `exa_agent` crea el run y lo difiere, llevando el ID del run de Exa en los metadatos de la llamada diferida.

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

Por defecto (`execution='inline'`), la capacidad resuelve sus propias llamadas diferidas dentro del run del agente sondeando el run de Exa hasta que se completa, de modo que la herramienta se comporta como una herramienta normal (aunque lenta). Con `execution='external'`, las llamadas se propagan como output de `DeferredToolRequests` para que la aplicación anfitriona las resuelva de forma externa.

Todos los campos de `ExaAgent` con sus valores por defecto:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = valor por defecto de la API
    execution='inline',   # 'inline' sondea hasta completar; 'external' propaga DeferredToolRequests
    output_schema=None,   # clase BaseModel o esquema dict para la salida estructurada
    system_prompt=None,   # se reenvía al run del agente de Exa
    poll_interval=1000,   # ms entre sondeos al resolver en modo inline
    timeout_ms=3_600_000, # ms de espera de un run al resolver en modo inline
    guidance=None,        # None = instrucciones por defecto, '' = ninguna, str = personalizada
    runs=None,            # ExaAgentRuns -- None construye AsyncExa().agent.runs a partir de EXA_API_KEY
)
```

***

## Especificación de agente (YAML/JSON) {#agent-spec-yamljson}

Ambas capacidades funcionan con la [especificación de agente](https://pydantic.dev/docs/ai/agents/#agent-spec) de Pydantic AI, por lo que puedes declararlas en un archivo de configuración en lugar de en Python:

```yaml agent.yaml theme={null}
model: anthropic:claude-sonnet-4-6
capabilities:
  - ExaSearch:
      num_results: 3
      include_deep_search: true
  - ExaAgent:
      effort: low
```

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent, ExaSearch

agent = Agent.from_file('agent.yaml', custom_capability_types=[ExaSearch, ExaAgent])
```

Pasa `custom_capability_types` para que el cargador de especificaciones sepa cómo instanciar las capacidades. Las instancias cargadas desde una especificación siempre construyen el cliente por defecto a partir de `EXA_API_KEY`.

***

## Siguiente {#next}

* [**Search API**](/es/docs/search/quickstart) - Búsqueda semántica con highlights, resúmenes y deep search
* [**Agent API**](/es/docs/agent/quickstart) - Runs de investigación asíncronos y de final abierto
* [**Configuración de MCP**](/es/docs/get-started/exa-mcp) - El MCP server alojado de Exa
* [**SDKs**](/es/docs/sdks/quickstart) - Documentación de los SDK de Python y JavaScript