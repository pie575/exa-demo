> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="llamaindex">
  # LlamaIndex
</div>

> Guía rápida para añadir la recuperación de Exa a una aplicación de agentes de LlamaIndex.

<Card title="Inicio rápido del agente de programación" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  ¿Es tu primera vez con Exa? Empieza en menos de un minuto.
</Card>

***

LlamaIndex es un framework para crear aplicaciones con LLM basadas en datos estructurados. En esta guía, usaremos la integración de Exa con LlamaIndex para:

1. Especificar la herramienta Search and Retrieve Highlight de Exa como retriever de LlamaIndex
2. Configurar un agente de OpenAI que utilice esta herramienta para generar sus respuestas

***

<div id="get-started">
  ## Primeros pasos
</div>

<Steps>
  <Step title="Requisitos previos e instalación">
    Instala las bibliotecas llama-index, llama-index core y llama-index-tools-exa. Las dependencias de OpenAI ya están incluidas en la biblioteca core, así que no hace falta especificarlas.

    ```Python Python theme={null}
    pip install llama-index llama-index-core llama-index-tools-exa
    ```

    Asegúrate también de inicializar correctamente las API keys. El siguiente código usa `EXA_API_KEY` como nombre de la variable de entorno correspondiente.

    <Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Crea una key en el panel. Las cuentas nuevas empiezan con credits gratuitos.
    </Card>
  </Step>

  <Step title="Instancia la herramienta de Exa">
    Importa la biblioteca de integración de Exa correspondiente e instancia el `ExaToolSpec` de LlamaIndex.

    ```Python Python theme={null}
    from llama_index.tools.exa import ExaToolSpec
    import os

    exa_tool = ExaToolSpec(
        api_key=os.environ["EXA_API_KEY"],
    )
    ```
  </Step>

  <Step title="Elige el método de Exa que vas a usar">
    En este ejemplo solo nos interesa pasarle a nuestro agent el método [search&#95;and&#95;retrieve&#95;highlights](https://docs.llamaindex.ai/en/stable/api_reference/tools/exa/), así que lo indicamos con el método `.to_tool_list` de LlamaIndex. También pasamos `current_date`, una utilidad sencilla para que nuestro agent sepa la fecha actual.

    ```Python Python theme={null}
    print('Tools that are provide by Exa LlamaIndex integration:')
    print('\n'.join(map(str, (exa_tool.spec_functions))))

    search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
        spec_functions=["search_and_retrieve_highlights", "current_date"]
    )
    ```
  </Step>

  <Step title="Configura un agent de OpenAI y haz solicitudes con Exa">
    Configura el [OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/) y pásale el conjunto de herramientas filtrado en el paso anterior.

    ```Python Python theme={null}
    from llama_index.agent.openai import OpenAIAgent

    agent = OpenAIAgent.from_tools(
        search_and_retrieve_highlights_tool,
        verbose=True,
    )
    ```

    Después podemos usar el método chat para interactuar con el agent.

    ```Python Python theme={null}
    agent.chat(
        "Can you summarize the news from the last month related to the US stock market?"
    )
    ```

    El agent llama a las herramientas de Exa que se le proporcionaron y responde a partir de los resultados. El resultado exacto varía según la query y las fechas de publicación de las páginas que devuelve Exa.
  </Step>
</Steps>

<Columns cols={2}>
  <Card title="Guía de la Search API" icon="search" href="/es/docs/search/quickstart" cta="Leer guía" arrow="true">
    Revisa los parámetros de search de Exa y los campos de la respuesta.
  </Card>

  <Card title="Referencia de herramientas de LlamaIndex" icon="book" href="https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/" cta="Abrir referencia" arrow="true">
    Explora las herramientas de LlamaIndex y la configuration de agents.
  </Card>
</Columns>