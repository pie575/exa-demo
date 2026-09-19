> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="anthropic-tool-calling">
  # Uso de herramientas con Anthropic
</div>

> Aprovecha el uso de herramientas de Claude para añadir búsqueda web de Exa y contenido de páginas a tu aplicación.

<Card title="Inicio rápido del agente de programación" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  ¿Es tu primera vez con Exa? Empieza en menos de un minuto.
</Card>

***

El [uso de herramientas](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) de Claude permite que los modelos llamen a funciones que defines en tu código. Los SDK de Exa incluyen herramientas listas para usar de búsqueda web y lectura de páginas para Anthropic, así que no tienes que escribir a mano el esquema de la herramienta, analizar los bloques `tool_use` ni dar formato a los resultados de Exa por tu cuenta.

<div id="get-started">
  ## Empezar
</div>

<Steps>
  <Step title="Instala los SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Configura tus API keys">
    Define las variables de entorno `EXA_API_KEY` y `ANTHROPIC_API_KEY`. Visita la [consola de Anthropic](https://console.anthropic.com/settings/keys) y el [panel de Exa](https://dashboard.exa.ai/api-keys) para generar tus API keys.

    <Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas empiezan con credits gratuitos.
    </Card>
  </Step>

  <Step title="Añade las herramientas de Exa a tu bucle de herramientas">
    Pasa las herramientas en la lista `tools` de la solicitud y luego entrega el mensaje del asistente a `handle_tool_use`. Esta función ejecuta cada bloque `tool_use` del mensaje y devuelve los bloques `tool_result` correspondientes, listos para enviarse en el siguiente mensaje del usuario.

    `web_search` busca en la web páginas que el modelo aún no ha visto; `get_contents` lee páginas cuyas URL ya conoce, ya sea por una search anterior o porque se las dio el usuario. Registra una o ambas.

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # lee EXA_API_KEY del entorno
      claude = anthropic.Anthropic()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )

      messages.append({"role": "assistant", "content": response.content})
      messages.append(
          {"role": "user", "content": exa.anthropic.handle_tool_use(response)}
      )

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )
      print(response.content[0].text)
      ```

      ```javascript JavaScript theme={null}
      import Anthropic from "@anthropic-ai/sdk";
      import Exa from "exa-js";

      const exa = new Exa(); // lee EXA_API_KEY del entorno
      const anthropic = new Anthropic();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: await exa.anthropic.handleToolUse(response),
      });

      response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });
      console.log(response.content[0].text);
      ```
    </CodeGroup>

    Aquí mostramos una sola ronda, por brevedad. Un agente real mantiene `tools` en cada solicitud y repite el paso del manejador hasta que el modelo responde sin bloques `tool_use`: así es como un resultado de search deriva en la lectura posterior de una página.

    Llamar a las fábricas sin argumentos aplica los valores predeterminados recomendados de Exa: `type="auto"` con `contents={"highlights": True}` para la search. Los highlights devuelven extractos relevantes para la query; no limitan el texto de la página a 10.000 caracteres. La fábrica de contenido devuelve el texto de la página; el límite de 10.000 caracteres del SDK se aplica solo a `text`, y únicamente cuando omites `max_characters`.
  </Step>
</Steps>

<div id="configuring-the-tools">
  ## Configuración de las herramientas
</div>

Los argumentos con nombre son opciones habituales de Exa que se pasan cuando se ejecuta la herramienta: las opciones de search van a `exa.search()` y las de contenido a `exa.get_contents()`:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.anthropic.web_search(category="news", contents={"text": True}),
      exa.anthropic.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.anthropic.webSearch({ category: "news", contents: { text: true } }),
    exa.anthropic.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

El modelo elige la `query` de búsqueda y las `urls` que va a leer; todo lo demás queda fijado al crear la herramienta, así que no puede cambiar qué se rastrea ni qué se extrae.

En cambio, `name` (con valor predeterminado `"web_search"` y `"get_contents"`) y `description` sobrescriben la definición de la herramienta que ve el modelo. Anthropic exige que los nombres de herramientas sean únicos, por lo que un nombre personalizado permite que la herramienta de Exa funcione junto a la herramienta de servidor integrada de Anthropic `web_search_20250305`, que reserva el nombre `web_search`:

<CodeGroup>
  ```python Python theme={null}
  response = claude.messages.create(
      model="claude-sonnet-4-6",
      max_tokens=1024,
      messages=messages,
      tools=[
          exa.anthropic.web_search(name="exa_web_search"),
          {"type": "web_search_20250305", "name": "web_search", "max_uses": 5},
      ],
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
    tools: [
      exa.anthropic.webSearch({ name: "exa_web_search" }),
      { type: "web_search_20250305", name: "web_search", max_uses: 5 },
    ],
  });
  ```
</CodeGroup>

<div id="mixing-in-your-own-tools">
  ## Cómo integrar tus propias herramientas
</div>

`handle_tool_use` responde a todos los bloques `tool_use` del mensaje: si un bloque nombra una herramienta que no puede resolver, recibe un resultado `Error: unknown tool "<name>"` en lugar de descartarse, de modo que la solicitud posterior nunca omite un resultado de herramienta obligatorio. Si ejecutas tus propias herramientas junto con las de Exa, sustituye esos resultados de error por los tuyos antes de la siguiente solicitud.

<div id="writing-the-loop-by-hand">
  ## Escribir el bucle a mano
</div>

Si prefieres controlar tú mismo el esquema y la ejecución de la herramienta, define la herramienta y procesa los bloques `tool_use` de forma manual. `exa.tools.web_search()` y `exa.tools.get_contents()` te ofrecen las mismas especificaciones de herramientas independientes del proveedor (con un método `run`) para bucles hechos a mano, o puedes escribirlo todo desde cero:

```python Python theme={null}
TOOLS = [
    {
        "name": "exa_search",
        "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to perform.",
                },
            },
            "required": ["query"],
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_use(response):
    results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "exa_search":
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(exa_search(**block.input)),
                }
            )
    return results
```

Consulta la [guía rápida del SDK](/es/docs/sdks/quickstart) para conocer las opciones de search y contenido en Python y TypeScript.