> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="openai-tool-calling">
  # Tool calling de OpenAI
</div>

> Usa el tool calling de OpenAI para añadir búsqueda web y contenido de páginas de Exa a tu aplicación.

<Info>
  OpenAI recomienda la Responses API para todos los proyectos nuevos. Consulta la sección [Responses API](#responses-api) más abajo.
</Info>

El [tool calling](https://platform.openai.com/docs/guides/function-calling?lang=python) de OpenAI permite que los modelos llamen a funciones que defines en tu código. Los SDK de Exa incluyen herramientas listas para usar de búsqueda web y lectura de páginas para OpenAI, de modo que no tienes que escribir a mano el esquema de la herramienta, procesar las llamadas a herramientas ni dar formato a los resultados de Exa.

<div id="get-started">
  ## Empezar
</div>

<Steps>
  <Step title="Instala los SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Configura tus API keys">
    Define las variables de entorno `EXA_API_KEY` y `OPENAI_API_KEY`. Visita el [panel de OpenAI](https://platform.openai.com/api-keys) y el [panel de Exa](https://dashboard.exa.ai/api-keys) para generar tus API keys.

    <Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas incluyen credits gratuitos.
    </Card>
  </Step>

  <Step title="Añade las herramientas de Exa a tu bucle de herramientas">
    Pasa las herramientas en la lista `tools` de la solicitud y luego entrega el mensaje del asistente a `handle_tool_calls`. Esta ejecuta todas las llamadas a herramientas de Exa que haya en el mensaje y devuelve los mensajes `role: "tool"` correspondientes, listos para añadirlos a la conversación.

    `web_search` busca en la web páginas que el modelo no ha visto; `get_contents` lee páginas cuyas URL ya tiene, ya sea de una búsqueda anterior o del propio usuario. Registra una o ambas.

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # lee EXA_API_KEY del entorno
      openai_client = OpenAI()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
          tools=[exa.openai.web_search(), exa.openai.get_contents()],
      )

      message = completion.choices[0].message
      messages.append(message)
      messages += exa.openai.handle_tool_calls(message)

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
      )
      print(completion.choices[0].message.content)
      ```

      ```javascript JavaScript theme={null}
      import Exa from "exa-js";
      import { OpenAI } from "openai";

      const exa = new Exa(); // lee EXA_API_KEY del entorno
      const openai = new OpenAI();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
        tools: [exa.openai.webSearch(), exa.openai.getContents()],
      });

      const message = completion.choices[0].message;
      messages.push(message, ...(await exa.openai.handleToolCalls(message)));

      completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
      });
      console.log(completion.choices[0].message.content);
      ```
    </CodeGroup>

    Por brevedad, aquí se muestra una sola ronda. Un agent real mantiene `tools` en todas las solicitudes y repite el paso del manejador hasta que el modelo responde sin llamadas a herramientas: así es como un resultado de búsqueda deriva en la lectura posterior de una página.

    Llamar a las fábricas sin argumentos aplica los valores predeterminados recomendados por Exa: `type="auto"` con `contents={"highlights": True}` para la búsqueda. Los highlights devuelven extractos relevantes para la query; no limitan el texto de la página a 10.000 caracteres. La fábrica de contenido devuelve el texto de la página; el límite de 10.000 caracteres del SDK se aplica solo a `text`, y únicamente cuando omites `max_characters`.
  </Step>
</Steps>

<div id="responses-api">
  ## Responses API
</div>

Para la API Responses de OpenAI, usa la fábrica `responses` con el mismo helper `handle_tool_calls`. El handler devuelve elementos `function_call_output` para una solicitud posterior.

<CodeGroup>
  ```python Python theme={null}
  response = openai_client.responses.create(
      model="gpt-5.6",
      input=messages,
      tools=[exa.openai.responses.web_search(), exa.openai.responses.get_contents()],
  )

  messages += response.output
  messages += exa.openai.responses.handle_tool_calls(response)
  ```

  ```javascript JavaScript theme={null}
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: messages,
    tools: [exa.openai.responses.webSearch(), exa.openai.responses.getContents()],
  });

  messages.push(...response.output);
  messages.push(...(await exa.openai.responses.handleToolCalls(response)));
  ```
</CodeGroup>

<Note>
  Chat Completions y la API Responses usan formatos de herramientas distintos y rechazan los de la otra, así que usa la fábrica que corresponda al endpoint que vayas a llamar.
</Note>

<div id="configuring-the-tools">
  ## Configuración de las herramientas
</div>

Los argumentos con nombre son opciones normales de Exa que se pasan cuando se ejecuta la herramienta: las opciones de búsqueda a `exa.search()` y las de contenido a `exa.get_contents()`:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.openai.web_search(category="news", contents={"text": True}),
      exa.openai.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.openai.webSearch({ category: "news", contents: { text: true } }),
    exa.openai.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

El modelo elige el `query` de búsqueda y las `urls` que va a leer; todo lo demás queda fijado al crear la herramienta, así que no puede cambiar qué se rastrea ni qué se extrae.

En cambio, `name` (con valor predeterminado `"web_search"` y `"get_contents"`) y `description` sobrescriben la definición de la herramienta que ve el modelo. Usa un `name` personalizado para ejecutar en paralelo herramientas de Exa con configuraciones distintas, o para evitar conflictos con otras herramientas que reserven esos nombres.

<div id="mixing-in-your-own-tools">
  ## Combinar tus propias herramientas
</div>

Los handlers responden a todas las llamadas de herramienta del mensaje: si una llamada nombra una herramienta que no pueden resolver, devuelve una salida `Error: unknown tool "<name>"` en lugar de descartarse, de modo que la solicitud siguiente nunca omite una respuesta de herramienta obligatoria. Si ejecutas tus propias herramientas junto con las de Exa, sustituye esas salidas de error por tus propios resultados antes de la siguiente solicitud.

<div id="writing-the-loop-by-hand">
  ## Escribir el bucle a mano
</div>

Si prefieres encargarte tú mismo del esquema de la herramienta y de su ejecución, define la herramienta y procesa las llamadas manualmente. `exa.tools.web_search()` y `exa.tools.get_contents()` te ofrecen las mismas especificaciones de herramientas independientes del proveedor (con un método `run`) para bucles hechos a mano, o bien puedes escribirlo todo desde cero:

```python Python theme={null}
import json

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "exa_search",
            "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to perform.",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_calls(tool_calls, messages):
    for tool_call in tool_calls:
        if tool_call.function.name == "exa_search":
            args = json.loads(tool_call.function.arguments)
            messages.append(
                {
                    "role": "tool",
                    "content": str(exa_search(**args)),
                    "tool_call_id": tool_call.id,
                }
            )
    return messages
```

Consulta el [inicio rápido del SDK](/es/docs/sdks/quickstart) para ver las opciones de búsqueda y contenido en Python y TypeScript.