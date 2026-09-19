> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

<div id="exa-search-api">
  # Exa Search API
</div>

> Ищите в интернете на естественном языке и получайте чистый, релевантный содержимое страницы за один запрос.

Exa Search принимает запрос на естественном языке и возвращает ранжированные результаты из интернета с чистым содержимым страниц.

<div id="make-your-first-request">
  ## Первый запрос
</div>

Начните с `query` на естественном языке и `contents: { highlights: true }` — так вы получите фрагменты, объём которых зависит от релевантности каждого результата. Остальные поля определяют, как Exa выполняет поиск и что попадает в каждый результат; далее на этой странице разобраны те из них, которые действительно пригодятся на практике.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "recent techniques for improving retrieval in RAG systems",
      type="auto",
      contents={"highlights": True},
  )

  for item in result.results:
      print(item.title, item.url)
      print(item.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "recent techniques for improving retrieval in RAG systems",
    {
      type: "auto",
      contents: { highlights: true }
    }
  );

  for (const item of result.results) {
    console.log(item.title, item.url);
    console.log(item.highlights);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "recent techniques for improving retrieval in RAG systems",
      "type": "auto",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

По умолчанию search возвращает до 10 результатов. Задайте `numResults`, чтобы запросить до 100 результатов; их может оказаться меньше, если релевантных страниц недостаточно. Постраничная выдача в search не поддерживается.

<Accordion title="Пример ответа">
  Highlights и список ниже приведены в сокращённом виде.

  ```json theme={null}
  {
    "requestId": "c3174df2b9cd5afbc64cdf79f3719b19",
    "resolvedSearchType": "",
    "results": [
      {
        "id": "https://arxiv.org/html/2608.21702",
        "title": "From Association to Causation: Improving Retrieval Precision ofRetrieval-Augmented Generation via Causal Relations and an Attention Mechanism",
        "url": "https://arxiv.org/html/2608.21702",
        "highlights": [
          "Retrieval-Augmented Generation (RAG) grounds LLM generation on retrieved documents, but the standard terminal retrieval stage—dense-vector similarity, optionally followed by reranking—often returns documents that merely share keywords with the query without containing the needed information...\n..."
        ],
        "image": "https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg",
        "favicon": "https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png"
      },
      {
        "id": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "title": "Four retrieval techniques to improve RAG you need to know",
        "url": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "publishedDate": "2025-04-14T00:00:00.000Z",
        "highlights": [
          "It's not surprising, then, that we've seen a range of different approaches emerge that attempt to address RAG's limitations over the last year or so.\n..."
        ],
        "image": "https://www.thoughtworks.com/content/dam/thoughtworks/images/illustration/brand/tw_illustration_5.jpg"
      }
    ],
    "searchTime": 1324.3,
    "costDollars": {
      "total": 0.007,
      "search": {
        "neural": 0.007
      }
    }
  }
  ```
</Accordion>

Результаты ранжируются по релевантности. Каждый из них содержит метаданные — заголовок, URL, дату публикации — а также всё, что вы запросили в `contents`.

<div id="writing-queries">
  ## Составление запросов
</div>

Поле `query` — единственное обязательное поле при использовании Search API.

Формулируйте запросы на естественном языке. Указывайте тему, а при необходимости — тип источника и интересующий период времени.

Запросы могут быть широкими и исследовательскими. Запрос `"Latest news on EU battery policy"` даёт Exa достаточно контекста, чтобы найти релевантные страницы, а `"news"` — нет. Если важен тип источника, укажите его прямо в запросе:

```text theme={null}
Свежие технические статьи со сравнением гибридного и семантического поиска для RAG-систем
```

Что входит в индекс Exa и как искать по этим типам контента, описано в разделе [Что содержится в индексе Exa](/ru/docs/search/data/overview).

<h2 id="search-types">
  Выбор типа поиска
</h2>

`type` задаёт режим поиска; каждый из них настроен на свой баланс скорости, глубины поиска и синтеза. По умолчанию используется `auto` — он подходит для большинства запросов.

| Тип              | Когда использовать                                                                  |
| ---------------- | ----------------------------------------------------------------------------------- |
| `auto`           | Нужен оптимальный баланс качества и скорости по умолчанию                           |
| `fast`           | Запрос чувствителен к задержкам                                                     |
| `instant`        | Запрос выполняется в реальном времени — например, автодополнение или голосовой ввод |
| `deep-lite`      | Задача требует лёгкого исследования и синтеза                                       |
| `deep`           | Задача требует многошагового поиска и более глубокого синтеза                       |
| `deep-reasoning` | Полнота и глубина рассуждений важнее задержки                                       |

Глубокие режимы выполняют полноценный исследовательский процесс, а не один проход извлечения. О том, как устроен этот процесс и как пользоваться его дополнительными настройками, см. [Deep Search](/ru/docs/search/deep-search).

<Tip>
  Вместо `deep-reasoning` для длительных исследований, построения списков и многошагового обогащения
  используйте [Exa Agent](/ru/docs/agent/quickstart). У Agent больше вычислительных ресурсов на запуск, и он возвращает обоснованные,
  структурированные результаты.
</Tip>

<div id="output-shapes">
  ## Форматы вывода
</div>

Каждый результат содержит метаданные — заголовок, URL и дату публикации. Используйте `contents`, чтобы добавить highlights, полный текст или summary страницы.

<Tabs>
  <Tab title="Highlights">
    Highlights возвращают фрагменты, наиболее релевантные вашему запросу. Они дают моделям и агентам
    нужные подтверждения, не засоряя контекстное окно посторонними частями каждой страницы.

    Это рекомендуемый формат вывода для большинства задач.

    Начните с простого `highlights: true`. Exa по запросу сама подберёт подходящий объём
    контента из каждого результата.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "How are inference providers reducing transformer latency?",
          contents={"highlights": True},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "How are inference providers reducing transformer latency?",
        { contents: { highlights: true } }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "How are inference providers reducing transformer latency?",
          "contents": { "highlights": true }
        }'
      ```
    </CodeGroup>

    См. [Highlights](/ru/docs/search/highlights) — о Dynamic Highlights и о том, когда их включать.
  </Tab>

  <Tab title="Полный текст">
    Полный текст возвращает очищенное содержимое страницы. Используйте его, когда задача требует более широкого контекста,
    структуры документа или деталей, которые могут не попасть во фрагменты, отобранные по запросу.

    Полные страницы могут быть объёмными. Ограничивайте и число результатов, и объём текста, возвращаемого для каждой страницы.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "Technical postmortems of large-scale inference outages",
          num_results=5,
          contents={"text": {"max_characters": 10000}},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "Technical postmortems of large-scale inference outages",
        {
          numResults: 5,
          contents: { text: { maxCharacters: 10000 } }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "Technical postmortems of large-scale inference outages",
          "numResults": 5,
          "contents": {
            "text": { "maxCharacters": 10000 }
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

Выбирайте одно представление контента на запрос. Если запросить одновременно highlights и text, вы получите — и оплатите — два представления одной и той же страницы. `summary` — третий вариант, но он добавляет вызов языковой модели для каждого результата.

<Warning>
  `/search` и `/contents` принимают одни и те же параметры контента, но в разных местах:

  * **`/search`** вкладывает `highlights`, `text` и `summary` внутрь объекта `contents`:
    `"contents": { "highlights": true }`
  * У **`/contents`** обёртки `contents` нет. Его тело — это сами параметры контента, поэтому
    те же поля располагаются на верхнем уровне рядом с `urls`: `"urls": [...], "highlights": true`
</Warning>

<div id="output-schema">
  ## Схема вывода
</div>

Добавьте `outputSchema`, если хотите, чтобы Exa обобщила результаты поиска. Это работает с любым типом поиска и добавляет в ответ объект `output`.

Ранжированные страницы по-прежнему возвращаются в `results`. Сгенерированное значение содержится в `output.content`, а источники и показатели уверенности на уровне отдельных полей — в `output.grounding`.

<Tabs>
  <Tab title="Произвольный текст">
    Используйте `type: "text"` для генерации связного текста. Добавьте `description`, чтобы задать его формат или длину.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "What changed in the latest EU battery policy?",
          output_schema={
              "type": "text",
              "description": "Summarize the changes in three concise bullets",
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "What changed in the latest EU battery policy?",
        {
          outputSchema: {
            type: "text",
            description: "Summarize the changes in three concise bullets"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "What changed in the latest EU battery policy?",
          "outputSchema": {
            "type": "text",
            "description": "Summarize the changes in three concise bullets"
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Структурированный JSON">
    Используйте `type: "object"`, чтобы получить JSON, соответствующий заданным вами свойствам и требованиям.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "AI infrastructure companies that announced Series A or B funding in the past six months",
          output_schema={
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "maxItems": 10,
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "round": {"type": "string"},
                              "amount": {"type": "string"},
                              "announcedDate": {
                                  "type": "string",
                                  "description": "The funding announcement date",
                              },
                              "leadInvestors": {
                                  "type": "array",
                                  "items": {"type": "string"},
                              },
                          },
                          "required": ["name", "round", "amount", "announcedDate"],
                      },
                  }
              },
              "required": ["companies"],
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "AI infrastructure companies that announced Series A or B funding in the past six months",
        {
          outputSchema: {
            type: "object",
            properties: {
              companies: {
                type: "array",
                maxItems: 10,
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    round: { type: "string" },
                    amount: { type: "string" },
                    announcedDate: {
                      type: "string",
                      description: "The funding announcement date"
                    },
                    leadInvestors: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            required: ["companies"]
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "AI infrastructure companies that announced Series A or B funding in the past six months",
          "outputSchema": {
            "type": "object",
            "properties": {
              "companies": {
                "type": "array",
                "maxItems": 10,
                "items": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "round": { "type": "string" },
                    "amount": { "type": "string" },
                    "announcedDate": {
                      "type": "string",
                      "description": "The funding announcement date"
                    },
                    "leadInvestors": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            "required": ["companies"]
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

Используйте `systemPrompt` для инструкций — например, предпочтений по источникам или расстановки акцентов; `outputSchema` — для структуры ответа. В Python используются `system_prompt` и `output_schema`.

<Note>
  Делайте схемы объектов компактными: поддерживается до 2 уровней вложенности и 10 свойств. Не добавляйте
  в схему поля с цитатами или уверенностью — Exa возвращает их автоматически в `output.grounding`.
</Note>

<div id="filter-results">
  ## Фильтрация результатов
</div>

Фильтры — это жёсткие ограничения: добавляйте фильтр, если результат, не подпадающий под него, вам заведомо не подойдёт, а более мягкие предпочтения по источникам лучше выражать в тексте запроса. Полный список приведён в [справочнике по API](/ru/docs/reference/search).

<div id="include-domains-or-paths">
  ### Включение доменов или путей
</div>

`includeDomains` ограничивает результаты источниками, которым вы доверяете. Параметр принимает полные домены, префиксы путей (например, `anthropic.com/news`) и шаблоны поддоменов (например, `*.substack.com`).

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "new model releases",
      include_domains=["openai.com", "anthropic.com/news"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("new model releases", {
    includeDomains: ["openai.com", "anthropic.com/news"],
    contents: { highlights: true }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "new model releases",
      "includeDomains": ["openai.com", "anthropic.com/news"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Указывайте путь в фильтре, а не дублируйте его оператором `site:` в запросе.

<div id="exclude-domains-or-paths">
  ### Исключение доменов или путей
</div>

`excludeDomains` исключает результаты с определённых доменов или путей. Поддерживаются те же префиксы путей и подстановочные знаки в поддоменах, что и в `includeDomains`. Применяйте этот параметр тогда, когда такие источники делают результат непригодным, а не для того, чтобы обозначить предпочтение.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "primary research on retrieval-augmented generation benchmarks",
      exclude_domains=["medium.com", "dev.to"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "primary research on retrieval-augmented generation benchmarks",
    {
      excludeDomains: ["medium.com", "dev.to"],
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "primary research on retrieval-augmented generation benchmarks",
      "excludeDomains": ["medium.com", "dev.to"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

<div id="content-freshness">
  ## Свежесть контента
</div>

`contents.maxAgeHours` определяет, насколько свежим должен быть контент, извлекаемый из каждого результата. Этот параметр не фильтрует результаты по дате публикации.

| Значение            | Поведение                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Не указано          | Использовать кешированный контент, если он есть, и загружать страницу при необходимости                    |
| Положительное целое | Использовать кешированный контент, если он не старше указанного количества часов; иначе загрузить страницу |
| `0`                 | Всегда загружать свежий контент                                                                            |
| `-1`                | Использовать только кешированный контент                                                                   |

В большинстве случаев это поле лучше не указывать. Задавайте его, когда устаревшее содержимое страницы окажется непригодным: например, для цен, наличия товара или часто меняющихся страниц.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "current pricing for serverless GPU providers",
      contents={
          "highlights": True,
          "max_age_hours": 24,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("current pricing for serverless GPU providers", {
    contents: {
      highlights: true,
      maxAgeHours: 24
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "current pricing for serverless GPU providers",
      "contents": {
        "highlights": true,
        "maxAgeHours": 24
      }
    }'
  ```
</CodeGroup>

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Лучшие практики" icon="sparkles" href="/ru/docs/search/best-practices" cta="Читать руководство" arrow="true">
    Бюджеты токенов, свежесть контента, структурированный вывод и системные промпты.
  </Card>

  <Card title="Справочник API" icon="square-terminal" href="/ru/docs/reference/search" cta="Открыть справочник" arrow="true">
    Все параметры запроса и поля ответа, а также интерактивная песочница.
  </Card>

  <Card title="Contents" icon="file-text" href="/ru/docs/contents/quickstart" cta="Открыть руководство" arrow="true">
    У вас уже есть URL, и вам нужен чистый текст, highlights или краткие изложения.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Вам нужны длительные исследования, составление списков или enrichment.
  </Card>
</Columns>