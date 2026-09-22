> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Quickstart para desarrolladores {#developer-quickstart}

> Consigue una API key y luego usa Exa desde tu código o desde tu agente.

<div className="docs-quickstart-section docs-quickstart-auth">
  ## 1. Consigue una API key {#1-get-an-api-key}

  <Steps>
    <Step title="Visita el Exa Dashboard">
      <Card title="Consigue tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        Crea una key en el panel. Las cuentas nuevas empiezan con créditos gratuitos.
      </Card>
    </Step>

    <Step title="Define la key como variable de entorno">
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
    </Step>
  </Steps>
</div>

<div className="docs-quickstart-section">
  ## 2. Elige cómo vas a usar Exa {#2-choose-how-youll-use-exa}

  Exa se integra en tu aplicación de dos formas: llamando a las APIs desde tu propio código o conectando un agente que ya uses.

  <Columns cols={2}>
    <Card title="Llamar a las APIs" icon="code" href="#3-install-an-sdk" cta="Instalar un SDK">
      Usa Search, Contents y Exa Agent desde tu propio código. Instala un SDK
      más abajo y haz tu primera solicitud.
    </Card>

    <Card title="Conecta tu agente" icon="plug" href="/es/docs/get-started/exa-mcp" cta="Configurar Exa MCP">
      Conecta ChatGPT, Claude, Codex o Cursor a las herramientas de búsqueda e investigación
      de Exa. No hace falta API key.
    </Card>
  </Columns>

  ¿Vas a desarrollar con las APIs? Elige por dónde empezar:

  | Empieza con                             | Úsalo para                                                                                    |
  | --------------------------------------- | --------------------------------------------------------------------------------------------- |
  | [Search](/es/docs/search/quickstart)       | Encontrar páginas web relevantes y devolver contenido sintetizado en menos de 2 s             |
  | [Deep Search](/es/docs/search/deep-search) | Búsquedas de mayor calidad, en las que un LLM encuentra mejores resultados de forma iterativa |
  | [Agent](/es/docs/agent/quickstart)         | Investigación asíncrona de larga duración, creación de listas, enrichment o informes          |
  | [Contents](/es/docs/contents/quickstart)   | Extraer el contenido de páginas cuando ya tienes las URL                                      |
</div>

<div className="docs-quickstart-section">
  ## 3. Instala un SDK {#3-install-an-sdk}

  <CodeGroup>
    ```bash Python theme={null}
    pip install exa-py
    ```

    ```bash JavaScript theme={null}
    npm install exa-js
    ```
  </CodeGroup>
</div>

<div className="docs-quickstart-section">
  ## 4. Realiza tu primera solicitud {#4-make-your-first-request}

  <CodeGroup>
    ```python Python theme={null}
    from exa_py import Exa

    exa = Exa()

    results = exa.search(
        "best blog posts about vector databases",
        contents={"highlights": True},
    )

    for result in results.results:
        print(result.title, result.url)
    ```

    ```javascript JavaScript theme={null}
    import Exa from "exa-js";

    const exa = new Exa();

    const { results } = await exa.search(
      "best blog posts about vector databases",
      { contents: { highlights: true } },
    );

    for (const result of results) {
      console.log(result.title, result.url);
    }
    ```

    ```bash cURL theme={null}
    curl -s -X POST "https://api.exa.ai/search" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $EXA_API_KEY" \
      -d '{
        "query": "best blog posts about vector databases",
        "contents": { "highlights": true }
      }'
    ```
  </CodeGroup>

  ## Próximos pasos {#next-steps}

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/es/docs/search/quickstart" cta="Leer la guía" arrow="true">
      Encuentra páginas relevantes y obtén contenido limpio o salidas estructuradas.
    </Card>

    <Card title="Agent API" icon="bot" href="/es/docs/agent/quickstart" cta="Leer la guía" arrow="true">
      Crea flujos de trabajo de investigación de larga duración, creación de listas y enrichment.
    </Card>

    <Card title="Contents API" icon="file-text" href="/es/docs/contents/quickstart" cta="Leer la guía" arrow="true">
      Extrae contenido limpio de páginas que ya conoces.
    </Card>

    <Card title="Exa MCP" icon="plug" href="/es/docs/get-started/exa-mcp" cta="Leer la guía" arrow="true">
      Conecta cualquier MCP client a las herramientas de búsqueda web, obtención de páginas y Exa Agent
      de Exa.
    </Card>
  </Columns>
</div>