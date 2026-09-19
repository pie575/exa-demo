> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="deep-search">
  # Deep Search
</div>

> Используйте итеративный поиск, рассуждения и синтез с опорой на источники для сложных исследовательских задач.

Deep Search — это исследовательский режим Search API. Он использует тот же эндпоинт `/search`, но процесс извлечения может выполнять несколько поисковых запросов, анализировать найденные данные, корректировать подход и формировать результат с опорой на источники.

Используйте стандартный Search, когда нужны ранжированные страницы по чётко сформулированному запросу. Используйте Deep, когда для получения ответа требуется исследование.

<div id="how-deep-search-works">
  ## Как работает Deep Search
</div>

Deep Search добавляет исследовательский цикл перед формированием итогового ответа:

<Steps>
  <Step title="Планирование поиска">
    Exa начинает с вашего `query` и может развернуть его в несколько поисковых запросов, охватывающих разные части
    исходного запроса. Начальные варианты можно задать через `additionalQueries`.
  </Step>

  <Step title="Поиск и анализ">
    Deep ищет подтверждающие данные, сопоставляет найденное с запросом и определяет, что
    уже подтверждено, а чего всё ещё не хватает.
  </Step>

  <Step title="Уточнение">
    Если данных недостаточно или они противоречивы, Deep может выполнить более точечный поиск вместо того,
    чтобы возвращать первые правдоподобные страницы.
  </Step>

  <Step title="Отбор и синтез">
    Deep отбирает полезные результаты, а затем применяет тот же механизм синтеза, что и другие типы поиска.
    Если вы указываете `outputSchema`, ответ включает структурированный `output.content` и
    цитаты на уровне полей в `output.grounding`.
  </Step>
</Steps>

Этот процесс особенно полезен для списков и структурированных результатов. Для каждого запрошенного элемента может потребоваться отдельный поиск, и Deep способен собрать и проверить эти результаты, прежде чем сформировать итоговую структуру.

<div id="choose-a-deep-mode">
  ## Выберите режим Deep
</div>

| Тип              | Когда использовать                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `deep-lite`      | Нужны лёгкое расширение запроса и синтез                                                    |
| `deep`           | Задача требует итеративного поиска, сбора данных или нескольких структурированных элементов |
| `deep-reasoning` | Задача требует более тщательных рассуждений при сложных или противоречивых данных           |

Для исследовательских сценариев начните с `deep`. Переходите на `deep-lite`, когда задача проще, а важна скорость отклика.

<Tip>
  Вместо `deep-reasoning` используйте [Exa Agent](/ru/docs/agent/quickstart) для длительных исследований, построения списков и многошагового Enrichment. У Agent больше вычислительных ресурсов на один запуск, и он возвращает обоснованные структурированные результаты.
</Tip>

Актуальные рекомендации по стоимости и задержкам см. в разделе [Цены](/ru/docs/admin/pricing#deep-search).

<div id="make-a-deep-request">
  ## Выполнение Deep-запроса
</div>

Укажите `type` в обычном запросе к Search API:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "Compare how major database vendors support vector, keyword, and hybrid retrieval",
    {
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Deep возвращает отобранные результаты поиска в поле `results`. Добавьте `outputSchema`, если вам нужен также готовый сводный ответ или структурированный набор данных.

<div id="provide-starting-queries">
  ## Задайте начальные запросы
</div>

Обычно Deep сам решает, какие поисковые запросы выполнять. Используйте `additionalQueries`, когда вы заранее знаете конкретную терминологию, точки зрения или подзадачи, которые должно охватить исследование:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Compare current approaches to inference-time scaling",
      additional_queries=[
          "inference-time compute scaling benchmark",
          "test-time reasoning methods survey",
          "adaptive compute language models",
      ],
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Compare current approaches to inference-time scaling",
    {
      additionalQueries: [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare current approaches to inference-time scaling",
      "additionalQueries": [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Основной `query` включается всегда. Можно указать до 10 дополнительных запросов; этот список доступен только для типов Deep search.

Не добавляйте мелкие перефразировки просто ради увеличения числа запросов. Добавляйте запрос только тогда, когда он задаёт заметно иное направление поиска.

<div id="guide-behavior-and-output-separately">
  ## Управляйте поведением и выводом раздельно
</div>

`systemPrompt` и `outputSchema` влияют на разные части запроса:

* `systemPrompt` задаёт предпочтения по источникам, новизну, дедупликацию и характер исследования в режиме Deep.
* `outputSchema` определяет итоговую структуру и запускает синтез.

Запрос должен описывать, что именно нужно исследовать, а системный промпт — как проводить это исследование и как представлять результаты.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      type="deep",
      system_prompt="Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 8,
                  "items": {
                      "type": "object",
                      "required": ["name", "round", "amount"],
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "amount": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Find AI infrastructure companies that announced Series A or B funding in the last six months",
    {
      type: "deep",
      systemPrompt:
        "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      outputSchema: {
        type: "object",
        required: ["companies"],
        properties: {
          companies: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              required: ["name", "round", "amount"],
              properties: {
                name: { type: "string" },
                round: { type: "string" },
                amount: { type: "string" }
              }
            }
          }
        }
      }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      "type": "deep",
      "systemPrompt": "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 8,
            "items": {
              "type": "object",
              "required": ["name", "round", "amount"],
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "amount": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

Выбирайте Deep, если нужно больше двух структурированных элементов или если каждый элемент должен удовлетворять сразу нескольким требованиям. Стандартные типы поиска используют тот же механизм синтеза, но не проводят перед ним такое же итеративное исследование.

<div id="read-the-grounded-response">
  ## Чтение ответа с подтверждающими источниками
</div>

В структурированных ответах сгенерированные значения отделены от подтверждающих их источников:

```json theme={null}
{
  "results": [
    {
      "title": "Acme AI raises $30M Series B",
      "url": "https://acme.example/news/series-b"
    }
  ],
  "output": {
    "content": {
      "companies": [
        {
          "name": "Acme AI",
          "round": "Series B",
          "amount": "$30M"
        }
      ]
    },
    "grounding": [
      {
        "field": "companies[0].amount",
        "citations": [
          {
            "title": "Acme AI raises $30M Series B",
            "url": "https://acme.example/news/series-b"
          }
        ],
        "confidence": "high"
      }
    ]
  }
}
```

Используйте `output.content` как сгенерированный результат, а `output.grounding` — для отображения или проверки источников, подтверждающих каждое поле. Не добавляйте в собственную схему поля с цитатами или оценкой уверенности: Exa возвращает их автоматически.

`numResults` определяет, сколько отобранных страниц вернётся в `results`. Этот параметр не задаёт количество поисковых запросов, которые может выполнить Deep.

<div id="stream-the-synthesis">
  ## Потоковая передача синтеза
</div>

Задайте `stream: true` вместе с `outputSchema`, чтобы получать синтезированный результат через server-sent events:

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/search",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "query": "Explain the competing technical approaches to long-context retrieval",
          "type": "deep",
          "stream": True,
          "outputSchema": {
              "type": "text",
              "description": "A grounded comparison organized by approach",
          },
      },
      stream=True,
  )
  response.raise_for_status()

  for line in response.iter_lines(decode_unicode=True):
      if line:
          print(line)
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      query: "Explain the competing technical approaches to long-context retrieval",
      type: "deep",
      stream: true,
      outputSchema: {
        type: "text",
        description: "A grounded comparison organized by approach"
      }
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const decoder = new TextDecoder();
  for await (const chunk of response.body) {
    process.stdout.write(decoder.decode(chunk, { stream: true }));
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Explain the competing technical approaches to long-context retrieval",
      "type": "deep",
      "stream": true,
      "outputSchema": {
        "type": "text",
        "description": "A grounded comparison organized by approach"
      }
    }'
  ```
</CodeGroup>

Обрабатывайте типизированные события вплоть до `done`. Последнее событие содержит готовый результат и время поиска, а при наличии — и информацию о стоимости.

<div id="when-to-stay-with-standard-search">
  ## Когда достаточно стандартного Search
</div>

Deep не нужен, если задачу решает один проход поиска:

* Вам нужны релевантные страницы, а не проработанный вывод.
* Запрос уже указывает на конкретный источник или узкую тему.
* Ваше приложение само выполняет рассуждения, и ему нужен только поиск.
* Запрос выполняется в интерактивном сценарии, автодополнении или голосовом интерфейсе.

Используйте `auto` для стандартного баланса качества и скорости либо `fast` и `instant` при жёстких требованиях к задержке.

<Columns cols={2}>
  <Card title="Руководство по Search API" icon="search" href="/ru/docs/search/quickstart" cta="Изучить Search" arrow="true">
    Формируйте запросы, выбирайте содержимое результатов и применяйте фильтры.
  </Card>

  <Card title="Лучшие практики Search" icon="sliders-horizontal" href="/ru/docs/search/best-practices" cta="Настроить поиск" arrow="true">
    Улучшайте качество, контекст, задержку и интеграции с агентами.
  </Card>

  <Card title="Справочник Search API" icon="square-terminal" href="/ru/docs/reference/search" cta="Открыть справочник" arrow="true">
    Все параметры запроса и поля ответа.
  </Card>

  <Card title="Цены" icon="credit-card" href="/ru/docs/admin/pricing#deep-search" cta="Сравнить режимы" arrow="true">
    Актуальная стоимость и задержки Deep Search.
  </Card>
</Columns>