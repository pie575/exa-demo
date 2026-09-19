> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Получите полный индекс документации по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы ознакомиться со всеми доступными страницами, прежде чем продолжить изучение.

<div id="developer-quickstart">
  # Быстрый старт для разработчиков
</div>

> Получите API key, а затем используйте Exa из своего кода или из своего агента.

<div className="docs-quickstart-section docs-quickstart-auth">
  <div id="1-get-an-api-key">
    ## 1. Получите API key
  </div>

  <Steps>
    <Step title="Откройте панель управления Exa">
      <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        Создайте ключ в панели управления. Новым аккаунтам начисляются бесплатные credits.
      </Card>
    </Step>

    <Step title="Задайте ключ как переменную окружения">
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
  <div id="2-choose-how-youll-use-exa">
    ## 2. Выберите, как вы будете использовать Exa
  </div>

  Exa встраивается в ваше приложение двумя способами: вызывайте API из собственного кода или подключите агента, которым уже пользуетесь.

  <Columns cols={2}>
    <Card title="Вызов API" icon="code" href="#3-install-an-sdk" cta="Установить SDK">
      Используйте Search, Contents и Exa Agent из собственного кода. Установите SDK
      ниже и выполните первый запрос.
    </Card>

    <Card title="Подключите своего агента" icon="plug" href="/ru/docs/get-started/exa-mcp" cta="Настроить Exa MCP">
      Подключите ChatGPT, Claude, Codex или Cursor к инструментам поиска и исследований
      Exa. API key не требуется.
    </Card>
  </Columns>

  Разрабатываете на базе API? Выберите, с чего начать:

  | Начните с                               | Для чего это нужно                                                                 |
  | --------------------------------------- | ---------------------------------------------------------------------------------- |
  | [Search](/ru/docs/search/quickstart)       | Поиск релевантных веб-страниц и возврат синтезированного контента менее чем за 2 с |
  | [Deep Search](/ru/docs/search/deep-search) | Более качественный поиск, в котором LLM итеративно находит лучшие результаты       |
  | [Agent](/ru/docs/agent/quickstart)         | Длительные асинхронные исследования, составление списков, enrichment или отчёты    |
  | [Contents](/ru/docs/contents/quickstart)   | Извлечение содержимого страниц, когда URL уже известны                             |
</div>

<div className="docs-quickstart-section">
  <div id="3-install-an-sdk">
    ## 3. Установите SDK
  </div>

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
  <div id="4-make-your-first-request">
    ## 4. Отправьте первый запрос
  </div>

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

  <div id="next-steps">
    ## Дальнейшие шаги
  </div>

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/ru/docs/search/quickstart" cta="Читать руководство" arrow="true">
      Находите релевантные страницы и получайте очищенный контент или структурированные результаты.
    </Card>

    <Card title="Agent API" icon="bot" href="/ru/docs/agent/quickstart" cta="Читать руководство" arrow="true">
      Создавайте長длительные сценарии исследований, построения списков и enrichment.
    </Card>

    <Card title="Contents API" icon="file-text" href="/ru/docs/contents/quickstart" cta="Читать руководство" arrow="true">
      Извлекайте очищенный контент со страниц, которые вам уже известны.
    </Card>

    <Card title="Exa MCP" icon="plug" href="/ru/docs/get-started/exa-mcp" cta="Читать руководство" arrow="true">
      Подключайте любой MCP-клиент к инструментам Exa: web search, загрузке страниц и
      Exa Agent.
    </Card>
  </Columns>
</div>