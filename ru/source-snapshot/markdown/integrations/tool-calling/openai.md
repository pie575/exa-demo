> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем изучать документацию дальше.

<div id="openai-tool-calling">
  # Вызов инструментов OpenAI
</div>

> Используйте вызов инструментов OpenAI, чтобы добавить в своё приложение веб-поиск Exa и получение содержимого страниц.

<Info>
  OpenAI рекомендует использовать Responses API во всех новых проектах. См. раздел [Responses API](#responses-api) ниже.
</Info>

[Вызов инструментов](https://platform.openai.com/docs/guides/function-calling?lang=python) в OpenAI позволяет моделям вызывать функции, которые вы определяете в своём коде. SDK Exa поставляются с готовыми инструментами веб-поиска и чтения страниц для OpenAI, так что вам не придётся вручную описывать схему инструмента, разбирать вызовы инструментов и форматировать результаты Exa.

<div id="get-started">
  ## Начало работы
</div>

<Steps>
  <Step title="Установите SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="Настройте API-ключи">
    Задайте переменные окружения `EXA_API_KEY` и `OPENAI_API_KEY`. Ключи можно сгенерировать в [панели управления OpenAI](https://platform.openai.com/api-keys) и [панели управления Exa](https://dashboard.exa.ai/api-keys).

    <Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Создайте ключ в панели управления. Новым аккаунтам начисляются бесплатные credits.
    </Card>
  </Step>

  <Step title="Добавьте инструменты Exa в свой цикл вызова инструментов">
    Передайте инструменты в списке `tools` запроса, а затем передайте сообщение ассистента в `handle_tool_calls`. Функция выполнит все вызовы инструментов Exa из этого сообщения и вернёт соответствующие сообщения с `role: "tool"`, готовые к добавлению в диалог.

    `web_search` ищет в вебе страницы, которых модель ещё не видела; `get_contents` читает страницы, URL которых уже известны — из предыдущего search или от пользователя. Зарегистрируйте один из инструментов или оба.

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # читает EXA_API_KEY из окружения
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

      const exa = new Exa(); // читает EXA_API_KEY из окружения
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

    Для краткости здесь показан всего один раунд. Реальный агент передаёт `tools` в каждом запросе и повторяет шаг с обработчиком до тех пор, пока модель не ответит без вызовов инструментов — именно так результат search приводит к последующему чтению страницы.

    Вызов фабрик без аргументов даёт рекомендованные Exa значения по умолчанию: `type="auto"` с `contents={"highlights": True}` для search. Highlights возвращают релевантные запросу выдержки — они не ограничивают текст страницы 10 000 символами. Фабрика contents возвращает текст страницы; ограничение SDK в 10 000 символов применяется только к `text` и только если вы не указали `max_characters`.
  </Step>
</Steps>

<div id="responses-api">
  ## Responses API
</div>

Для OpenAI Responses API используйте фабрику `responses` с тем же вспомогательным методом `handle_tool_calls`. Обработчик возвращает элементы `function_call_output` для последующего запроса.

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
  Chat Completions и Responses API используют разные форматы инструментов и не принимают форматы друг друга, поэтому выбирайте фабрику, соответствующую вызываемому эндпоинту.
</Note>

<div id="configuring-the-tools">
  ## Настройка инструментов
</div>

Именованные аргументы — это обычные опции Exa, которые передаются при выполнении инструмента: опции search — в `exa.search()`, опции contents — в `exa.get_contents()`:

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

Модель выбирает поисковый `query` и `urls` для чтения; всё остальное фиксируется при создании инструмента, поэтому модель не может повлиять на то, что именно обходится или извлекается.

А вот `name` (по умолчанию `"web_search"` и `"get_contents"`) и `description` переопределяют описание инструмента, которое видит модель. Задайте собственное значение `name`, чтобы параллельно использовать инструменты Exa с разными настройками или избежать конфликтов с другими инструментами, которые занимают эти имена.

<div id="mixing-in-your-own-tools">
  ## Подключение собственных инструментов
</div>

Обработчики отвечают на каждый вызов инструмента в сообщении: если вызов указывает на инструмент, который не удаётся распознать, такой вызов не отбрасывается, а возвращает вывод `Error: unknown tool "<name>"` — благодаря этому в следующем запросе не потеряется ни один обязательный ответ инструмента. Если вы используете собственные инструменты наряду с инструментами Exa, замените эти сообщения об ошибках своими результатами перед отправкой следующего запроса.

<div id="writing-the-loop-by-hand">
  ## Пишем цикл вручную
</div>

Если вы предпочитаете сами контролировать схему инструмента и его выполнение, определите инструмент и обрабатывайте вызовы вручную. `exa.tools.web_search()` и `exa.tools.get_contents()` возвращают те же независимые от провайдера спецификации инструментов (с методом `run`) для самописных циклов — либо можно написать всё с нуля:

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

См. [быстрый старт по SDK](/ru/docs/sdks/quickstart) — там описаны параметры search и contents для Python и TypeScript.