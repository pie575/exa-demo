> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем переходить к дальнейшему изучению.

<div id="anthropic-tool-calling">
  # Вызов инструментов Anthropic
</div>

> Используйте вызов инструментов Claude, чтобы добавить в своё приложение web search и page contents от Exa.

<Card title="Быстрый старт с кодинг-агентом" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Впервые в Exa? Начните работу меньше чем за минуту.
</Card>

***

[Вызов инструментов](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) в Claude позволяет моделям вызывать функции, которые вы определяете в своём коде. SDK Exa поставляются с готовыми инструментами web search и чтения страниц для Anthropic, поэтому вам не придётся вручную писать схему инструмента, разбирать блоки `tool_use` или самостоятельно форматировать результаты Exa.

<div id="get-started">
  ## Начало работы
</div>

<Steps>
  <Step title="Установите SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Настройте API-ключи">
    Задайте переменные окружения `EXA_API_KEY` и `ANTHROPIC_API_KEY`. Сгенерировать ключи можно в [консоли Anthropic](https://console.anthropic.com/settings/keys) и в [панели управления Exa](https://dashboard.exa.ai/api-keys).

    <Card title="Получите свой Exa API-ключ" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в панели управления. Новым аккаунтам начисляются бесплатные credits.
    </Card>
  </Step>

  <Step title="Добавьте инструменты Exa в цикл вызова инструментов">
    Передайте инструменты в списке `tools` запроса, а затем отдайте сообщение ассистента в `handle_tool_use`. Функция выполнит каждый блок `tool_use` из сообщения и вернёт соответствующие блоки `tool_result`, готовые к отправке в следующем сообщении пользователя.

    `web_search` ищет в вебе страницы, которых модель ещё не видела; `get_contents` читает страницы, URL которых уже известны, — полученные из предыдущего search или от пользователя. Регистрируйте любой из инструментов или оба сразу.

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # читает EXA_API_KEY из окружения
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

      const exa = new Exa(); // читает EXA_API_KEY из окружения
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

    Для краткости здесь показан один раунд. Настоящий агент передаёт `tools` в каждом запросе и повторяет шаг с обработчиком, пока модель не ответит без блоков `tool_use`, — именно так результат поиска приводит к последующему чтению страницы.

    Вызов фабрик без аргументов даёт рекомендованные Exa значения по умолчанию: `type="auto"` с `contents={"highlights": True}` для поиска. Highlights возвращают фрагменты, релевантные запросу, — они не ограничивают текст страницы 10 000 символами. Фабрика contents возвращает текст страницы; ограничение SDK в 10 000 символов применяется только к `text` и только если вы не указали `max_characters`.
  </Step>
</Steps>

<div id="configuring-the-tools">
  ## Настройка инструментов
</div>

Именованные аргументы — это обычные параметры Exa, которые передаются при запуске инструмента: параметры поиска — в `exa.search()`, параметры contents — в `exa.get_contents()`:

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

Модель выбирает поисковый `query` и `urls` для чтения; всё остальное фиксируется в момент создания инструмента, так что модель не может повлиять на то, что именно обходится и извлекается.

А вот `name` (по умолчанию `"web_search"` и `"get_contents"`) и `description` переопределяют то определение инструмента, которое видит модель. Anthropic требует, чтобы имена инструментов были уникальными, поэтому собственное имя позволяет запускать инструмент Exa рядом со встроенным серверным инструментом Anthropic `web_search_20250305`, за которым закреплено имя `web_search`:

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
  ## Подключение собственных инструментов
</div>

`handle_tool_use` отвечает на каждый блок `tool_use` в сообщении: блок, в котором указан неизвестный инструмент, не отбрасывается, а получает результат `Error: unknown tool "<name>"` — поэтому в следующем запросе никогда не будет пропущен обязательный результат инструмента. Если вы используете собственные инструменты наряду с инструментами Exa, замените эти результаты с ошибками на свои перед отправкой следующего запроса.

<div id="writing-the-loop-by-hand">
  ## Пишем цикл вручную
</div>

Если вы предпочитаете сами управлять схемой инструмента и его выполнением, определите инструмент и обрабатывайте блоки `tool_use` вручную. `exa.tools.web_search()` и `exa.tools.get_contents()` дают те же независимые от провайдера спецификации инструментов (с методом `run`) для собственных циклов — или же вы можете написать всё с нуля:

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

Параметры search и contents для Python и TypeScript описаны в [кратком руководстве по SDK](/ru/docs/sdks/quickstart).