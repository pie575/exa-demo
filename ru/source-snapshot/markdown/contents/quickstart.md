> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы перед дальнейшим изучением.

<div id="contents-api">
  # Contents API
</div>

> Извлекайте текст, highlights и краткие изложения из любого URL.

Exa Contents возвращает очищенное содержимое страниц по URL, автоматически обрабатывая страницы с JavaScript-рендерингом, PDF-файлы и сложную вёрстку.

Все возможности contents доступны и в [Exa Search](/ru/docs/search/quickstart) для возвращаемых URL — без дополнительной оплаты для первых 10 результатов на один search (далее $1 за 1000 страниц). Для сценариев с инструментами web search рекомендуем использовать именно Search, а не Contents.

<Tip>
  Если результаты search используются как контекст для ИИ, указывайте `contents: { highlights: true }` в запросе к `/search` —
  Exa подбирает размер фрагментов для каждого результата в зависимости от его релевантности. См. [Highlights](/ru/docs/search/highlights).
</Tip>

<div id="make-your-first-request">
  ## Выполните первый запрос
</div>

Передайте один или несколько URL либо идентификаторов документов и запросите highlights для фрагментов, относящихся к вашей задаче. В HTTP-запросах указывайте их в `ids`:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and quality results"},
  )

  print(result.results[0].highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://exa.ai/blog/dynamic-highlights"],
    {
      highlights: {
        query: "token efficiency and quality results"
      }
    }
  );

  console.log(result.results[0].highlights);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://exa.ai/blog/dynamic-highlights"],
      "highlights": {
        "query": "token efficiency and quality results"
      }
    }'
  ```
</CodeGroup>

<Accordion title="Пример ответа">
  ```json theme={null}
  {
    "requestId": "e492118ccdedcba5088bfc4357a8a125",
    "results": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "title": "Dynamic Highlights",
        "url": "https://exa.ai/blog/dynamic-highlights",
        "highlights": [
          "With a 12k character budget, relative to existing highlights, Dynamic Highlights achieves a 40% average token efficiency gain with a notable quality increase..."
        ]
      }
    ],
    "statuses": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "status": "success",
        "source": "cached"
      }
    ],
    "costDollars": {
      "total": 0.001
    }
  }
  ```
</Accordion>

Каждый элемент в `results` содержит метаданные страницы и запрошенное вами представление контента. Проверяйте `statuses`, чтобы узнать, для каких URL запрос выполнен успешно, а для каких — нет.

<h2 id="dynamic-highlights">
  Форматы вывода
</h2>

<Tabs>
  <Tab title="Highlights">
    Highlights возвращают релевантные фрагменты, скопированные со страницы. Начните с них для агентов, RAG и
    проверки фактов: highlights занимают меньше контекста, чем полный текст.

    Чтобы включить highlights, задайте `highlights: true`. При использовании Contents рекомендуется дополнительно указать параметр `query` — он помогает сфокусировать извлечение содержимого страницы:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/research-paper"],
          highlights={"query": "methodology and results"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/research-paper"],
        {
          highlights: {
            query: "methodology and results"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/research-paper"],
          "highlights": {
            "query": "methodology and results"
          }
        }'
      ```
    </CodeGroup>

    См. [Highlights](/ru/docs/search/highlights) — о Dynamic Highlights и о том, как распределять контекст
    между несколькими страницами.
  </Tab>

  <Tab title="Полный текст">
    Полный текст возвращает очищенное тело страницы в формате markdown. Используйте его, когда задача требует широкого контекста,
    структуры документа или деталей, которые highlights могут упустить.

    Страницы целиком бывают объёмными, поэтому при необходимости ограничьте размер с помощью `maxCharacters`:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/technical-report"],
          text={"max_characters": 10000},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/technical-report"],
        {
          text: {
            maxCharacters: 10000
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/technical-report"],
          "text": {
            "maxCharacters": 10000
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Summary">
    Summary выполняет вызов языковой модели для каждой страницы. Используйте его, когда нужен сгенерированный обзор или
    поля, извлечённые по JSON-схеме.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/company"],
          summary={"query": "Summarize the product, customers, and pricing"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/company"],
        {
          summary: {
            query: "Summarize the product, customers, and pricing"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/company"],
          "summary": {
            "query": "Summarize the product, customers, and pricing"
          }
        }'
      ```
    </CodeGroup>

    Чтобы получить поля вместо связного текста, передайте JSON-схему в `summary.schema`. Summary вернётся
    в виде JSON-строки, соответствующей схеме; разберите её, чтобы прочитать поля:

    ```json theme={null}
    {
      "ids": ["https://example.com/company"],
      "summary": {
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "title": "Company Information",
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "The company name" },
            "industry": { "type": "string", "description": "Primary industry" },
            "foundedYear": { "type": "number", "description": "Year the company was founded" }
          },
          "required": ["name"]
        }
      }
    }
    ```
  </Tab>
</Tabs>

Выбирайте одно представление контента на запрос. Если запросить highlights, text и summary одновременно, каждое представление будет возвращено и тарифицировано отдельно.

<div id="content-freshness">
  ## Актуальность контента
</div>

`maxAgeHours` определяет, насколько свежим должно быть извлекаемое содержимое страницы.

| Значение            | Поведение                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Не указано          | Использовать кешированное содержимое, если оно доступно, и загружать страницу при необходимости       |
| Положительное целое | Использовать кешированное содержимое, если оно новее указанного числа часов, иначе загрузить страницу |
| `0`                 | Всегда загружать свежее содержимое                                                                    |
| `-1`                | Использовать только кешированное содержимое                                                           |

В большинстве запросов это поле лучше не указывать. Указывайте его, когда устаревшее содержимое страницы окажется непригодным, — например, для цен, наличия товаров или часто обновляемых страниц. Сочетайте небольшое значение `maxAgeHours` с `livecrawlTimeout` (в миллисекундах), чтобы ограничить время свежей загрузки.

<Accordion title="Переход с устаревшего параметра livecrawl">
  Строковый параметр `livecrawl` (`"always"`, `"preferred"`, `"fallback"`, `"never"`)
  объявлен устаревшим — вместо него используйте `maxAgeHours`:

  | Прежнее значение `livecrawl` | Эквивалент                                                                         |
  | ---------------------------- | ---------------------------------------------------------------------------------- |
  | `"always"`                   | `maxAgeHours: 0`                                                                   |
  | `"never"`                    | `maxAgeHours: -1`                                                                  |
  | `"fallback"`                 | Опустить `maxAgeHours`                                                             |
  | `"preferred"`                | Прямого эквивалента нет; используйте небольшое значение, например `maxAgeHours: 1` |
</Accordion>

<div id="crawl-subpages">
  ## Обход вложенных страниц
</div>

Укажите `subpages`, чтобы переходить по ссылкам с каждого исходного URL. Добавьте `subpageTarget`, если нужно, чтобы Exa отдавала приоритет определённым разделам сайта:

<CodeGroup>
  ```python Python theme={null}
  result = exa.get_contents(
      ["https://docs.example.com"],
      subpages=10,
      subpage_target=["api", "reference", "guides"],
      highlights=True,
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.getContents(
    ["https://docs.example.com"],
    {
      subpages: 10,
      subpageTarget: ["api", "reference", "guides"],
      highlights: true
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://docs.example.com"],
      "subpages": 10,
      "subpageTarget": ["api", "reference", "guides"],
      "highlights": true
    }'
  ```
</CodeGroup>

<div id="images-and-favicons">
  ## Изображения и фавиконы
</div>

Укажите в `extras.imageLinks` количество URL изображений, которые нужно получить с каждой страницы. Результаты также включают `favicon` сайта и URL характерного изображения `image`, если они доступны. В `/search` этот параметр задаётся в `contents.extras.imageLinks`.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Справочник API" icon="square-terminal" href="/ru/docs/reference/get-contents" cta="Открыть справочник" arrow="true">
    Все параметры запроса и поля ответа.
  </Card>

  <Card title="Highlights" icon="highlighter" href="/ru/docs/search/highlights" cta="Читать руководство" arrow="true">
    Сравните обычные и Dynamic Highlights как контекст для агента и RAG.
  </Card>

  <Card title="Search API" icon="search" href="/ru/docs/search/quickstart" cta="Открыть руководство" arrow="true">
    Находите нужные страницы перед извлечением их содержимого.
  </Card>

  <Card title="SDK" icon="code" href="/ru/docs/sdks/quickstart" cta="Смотреть SDK" arrow="true">
    Используйте Exa из Python или JavaScript.
  </Card>
</Columns>