> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="how-to-use-imports">
  # Как использовать imports
</div>

> Пошаговое руководство по импорту URL в Websets — обогащение списка, его оценка по criteria, поиск новых совпадений и сочетание всех трёх подходов.

Если у вас уже есть список URL (компании, люди, продукты и т. д.), вы можете **импортировать** их в Webset. В зависимости от того, как настроен Webset, импортированные items можно обогатить, оценить по criteria или объединить с результатами веб-поиска.

В этом руководстве разобрана каждая настройка с готовыми вызовами API, которые можно скопировать и вставить. Просто замените `$EXA_API_KEY` на свой API key.

<div id="our-example-5-it-consulting-suppliers">
  ## Наш пример: 5 поставщиков ИТ-консалтинга
</div>

В этом руководстве в качестве import мы будем использовать один и тот же список из 5 компаний:

| Компания     | URL                              | Примечания                                                                |
| ------------ | -------------------------------- | ------------------------------------------------------------------------- |
| Accenture    | `https://www.accenture.com`      | Глобальный ИТ-консалтинг, штаб-квартира в США                             |
| Infosys      | `https://www.infosys.com`        | ИТ-услуги, широкое присутствие в США                                      |
| Wipro        | `https://www.wipro.com`          | ИТ-услуги, офисы в США                                                    |
| EPAM Systems | `https://www.epam.com`           | Разработка ПО, листинг в США                                              |
| Persol Group | `https://www.persol-group.co.jp` | Кадровая компания, ориентирована на Японию, минимальное присутствие в США |

Мы выбрали их потому, что 4 из 5 явно соответствуют типичным criteria ИТ-консалтинга (офис в США, ИТ-услуги). **Persol Group** — исключение: это японская кадровая компания с минимальным присутствием в США, поэтому она не должна пройти criteria, ориентированные на США.

Наши criteria для приведённых ниже примеров:

1. «У компании есть офис в Соединённых Штатах»
2. «Компания предоставляет услуги ИТ-консалтинга или расширения штата»

***

<div id="config-1-import-only-enrich-without-filtering">
  ## Конфигурация 1: только импорт — обогащение без фильтрации
</div>

<Note>
  **Рабочий пример:** [Открыть этот webset в панели управления](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**Когда использовать:** у вас есть список URL и вы просто хотите их обогатить. Без оценки и фильтрации — сохраняется каждый item.

<div id="api-calls">
  ### Вызовы API
</div>

```bash theme={null}
# Шаг 1: Создайте CSV import с URL ваших поставщиков
curl -s -X POST "https://api.exa.ai/websets/v0/imports" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "count": 5,
    "size": 128,
    "entity": { "type": "company" },
    "title": "IT Consulting Suppliers"
  }'
# В ответе возвращаются `uploadUrl` и `id` import'а

# Шаг 2: Загрузите CSV по предподписанному URL из шага 1
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv содержит: url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# Шаг 3: Создайте Webset, использующий этот import (только enrichments, без search/criteria)
# При создании Webset обработка import'а планируется автоматически.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "import": [
      { "source": "import", "id": "<IMPORT_ID>" }
    ],
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }'
```

<div id="what-we-see-in-the-live-webset">
  ### Что мы видим в готовом Webset
</div>

В Webset попадают все **5 items**. Фильтрации нет, поскольку criteria не заданы.

| Поставщик    | В Webset? | Источник | Оценки | Enrichments | Почему?                               |
| ------------ | --------- | -------- | ------ | ----------- | ------------------------------------- |
| Accenture    | **Да**    | `import` | 0      | 2           | Импортирован, нет criteria для оценки |
| Infosys      | **Да**    | `import` | 0      | 2           | Импортирован, нет criteria для оценки |
| Wipro        | **Да**    | `import` | 0      | 2           | Импортирован, нет criteria для оценки |
| EPAM Systems | **Да**    | `import` | 0      | 2           | Импортирован, нет criteria для оценки |
| Persol Group | **Да**    | `import` | 0      | 2           | Импортирован, нет criteria для оценки |

У каждого item указано `source: "import"` и `evaluations: []`. Все 5 сохраняются и обогащаются вне зависимости от того, прошли бы они какие-либо criteria, — ведь в этой конфигурации criteria нет.

<Note>
  URL Persol Group (`persol-group.co.jp`) в данных сущности определился как «PERSOL Vietnam Japan Desk» — система всё равно импортирует и обогащает его, просто ссылка ведёт на страницу регионального подразделения.
</Note>

***

<div id="config-2-search-only-web-discovery">
  ## Конфигурация 2: только Search — поиск по вебу
</div>

<Note>
  **Живой пример:** [Открыть этот webset в дашборде](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**Когда использовать:** у вас нет готового списка — вы хотите найти в вебе новые компании, отвечающие вашим criteria.

<div id="api-call">
  ### Вызов API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-2">
  ### Что мы видим в реальном Webset
</div>

Система выполнила поиск по вебу и нашла **35 компаний**, удовлетворяющих обоим criteria. У каждого item указано `source: "search"` вместе с полными оценками, поясняющими, почему он подошёл.

| Наши 5 поставщиков     | Есть в Webset? | Почему?                                                              |
| ---------------------- | -------------- | -------------------------------------------------------------------- |
| Accenture              | **Да**         | Веб-поиск самостоятельно обнаружил Accenture как подходящую компанию |
| Infosys                | **Нет**        | Не найдена этим конкретным веб-поиском                               |
| Wipro                  | **Нет**        | Не найдена этим конкретным веб-поиском                               |
| EPAM Systems           | **Нет**        | Не найдена этим конкретным веб-поиском                               |
| Persol Group           | **Нет**        | Не найдена этим конкретным веб-поиском                               |
| *(34 другие компании)* | **Да**         | Найдены веб-поиском, прошли оба criteria                             |

Веб-поиск случайно наткнулся на Accenture среди своих 35 результатов, а вот остальных 4 поставщиков не нашёл. Так и должно быть: websets, построенные только на search, возвращают лишь то, что находит обход веба, а не заранее заданный список. Примеры других найденных компаний: Artech, TurnKey Staffing, DataArt, Insight Global и другие.

***

<div id="config-3-scoped-search-score-your-list-against-criteria">
  ## Конфигурация 3: Scoped Search — оценка вашего списка по criteria
</div>

<Note>
  **Живой пример:** [Открыть этот webset в панели управления](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**Когда использовать:** у вас есть список поставщиков и вы хотите **оценить каждого из них по criteria**. Возвращаются только те, кто прошёл проверку. Это сценарий «оцени мой список».

<div id="api-calls-2">
  ### Вызовы API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Создайте CSV-import и загрузите его, как показано в конфигурации 1, затем укажите здесь его ID.
  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  // Создайте CSV-import и загрузите его, как показано в конфигурации 1, затем укажите здесь его ID.
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        scope: [
          { source: "import", id: "<IMPORT_ID>" }
        ]
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  # Шаг 1: создайте CSV-import и загрузите его (как в конфигурации 1, шаги 1-2)
  # ... (полный процесс импорта см. в конфигурации 1)
  # В ответ вы получите <IMPORT_ID>

  # Шаг 2: создайте Webset со scoped search -- он оценивает каждый импортированный URL по criteria
  # Import автоматически ставится в очередь на обработку при создании Webset.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-3">
  ### Что мы видим в готовом Webset
</div>

Webset содержит **4 items**. Каждый из наших 5 поставщиков был оценён по criteria — в результатах остаются только те, кто прошёл оба criteria.

| Поставщик    | В Webset?          | Источник | Есть оценки? | Почему?                                                                            |
| ------------ | ------------------ | -------- | ------------ | ---------------------------------------------------------------------------------- |
| Accenture    | **Да**             | `search` | Да (2)       | Прошёл: есть офис в США, оказывает ИТ-консалтинг                                   |
| Infosys      | **Да**             | `search` | Да (2)       | Прошёл: есть офис в США, оказывает ИТ-услуги                                       |
| Wipro        | **Да**             | `search` | Да (2)       | Прошёл: есть офис в США, оказывает ИТ-услуги                                       |
| EPAM Systems | **Да**             | `search` | Да (2)       | Прошёл: листинг в США, оказывает услуги по разработке ПО                           |
| Persol Group | **Нет — отброшен** | —        | —            | Не прошёл «has an office in the United States» — ориентирован в основном на Японию |

Мы импортировали 5 поставщиков, но в результатах оказалось только 4. **Persol Group был оценён и не прошёл проверку**, поэтому он отфильтрован. У каждого видимого item указано `source: "search"` и полный набор `evaluations` с обоснованием по каждому критерию.

<Warning>
  Items, не прошедшие criteria, **исключаются из результатов**. Если вам нужно сохранить все items и просто видеть, какие из них проходят, а какие нет, используйте Config 1 (только import, без фильтрации) как отдельный webset параллельно с Config 3.
</Warning>

***

<div id="config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches">
  ## Конфигурация 4: Scoped Search + поиск по вебу — оцените свой список И найдите новые совпадения
</div>

<Note>
  **Живой пример:** [Открыть этот webset в дашборде](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**Когда использовать:** у вас есть список поставщиков, который нужно оценить по criteria, но при этом вы хотите найти в вебе дополнительные компании, отвечающие тем же criteria. Это двухэтапный процесс: сначала создайте webset со scoped search, а затем добавьте в этот же webset обычный веб-поиск.

<div id="api-calls-3">
  ### Вызовы API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Создайте CSV-import и загрузите его, как показано в конфигурации 1, а затем укажите его ID здесь.
  headers = {"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"}
  webset_response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers=headers,
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  webset_response.raise_for_status()
  webset_id = webset_response.json()["id"]

  search_response = requests.post(
      f"https://api.exa.ai/websets/v0/websets/{webset_id}/searches",
      headers=headers,
      json={
          "query": "IT consulting and staff augmentation companies",
          "entity": {"type": "company"},
          "criteria": [
              {"description": "The company has an office in the United States"},
              {
                  "description": "The company provides IT consulting or staff augmentation services"
              },
          ],
          "count": 25,
          "behavior": "append",
      },
  )
  search_response.raise_for_status()
  ```

  ```javascript JavaScript theme={null}
  // Создайте CSV-import и загрузите его, как показано в Config 1, а затем укажите здесь его ID.
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXA_API_KEY}`
  };
  const websetResponse = await fetch(
    "https://api.exa.ai/websets/v0/websets",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        search: {
          query: "IT consulting and staff augmentation companies",
          entity: { type: "company" },
          criteria: [
            { description: "The company has an office in the United States" },
            {
              description: "The company provides IT consulting or staff augmentation services"
            }
          ],
          count: 25,
          scope: [
            { source: "import", id: "<IMPORT_ID>" }
          ]
        },
        enrichments: [
          {
            description: "What services does this company provide?",
            format: "text"
          },
          { description: "Number of employees", format: "number" }
        ]
      })
    }
  );

  if (!websetResponse.ok) {
    throw new Error(`Webset creation failed: ${websetResponse.status}`);
  }
  const webset = await websetResponse.json();

  const searchResponse = await fetch(
    `https://api.exa.ai/websets/v0/websets/${webset.id}/searches`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        behavior: "append"
      })
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Search creation failed: ${searchResponse.status}`);
  }
  ```

  ```bash cURL theme={null}
  # Шаг 1: создайте CSV-import и загрузите файл (как в Config 1, шаги 1-2)
  # ... (полный процесс import см. в Config 1)
  # В ответ вы получите <IMPORT_ID>

  # Шаг 2: создайте Webset со scoped search -- он оценивает каждый импортированный URL по criteria
  # При создании Webset обработка import запускается автоматически.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  # Ответ содержит `id` webset -- сохраните его как <WEBSET_ID>

  # Шаг 3: дождитесь завершения scoped search, затем добавьте веб-search, чтобы найти новые совпадения
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/<WEBSET_ID>/searches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "behavior": "append"
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-4">
  ### Что мы видим в готовом Webset
</div>

Webset содержит **29 items** — 4 из импортированных поставщиков (оценены и прошли проверку) плюс 25 компаний, найденных в вебе. Оба набора оцениваются по criteria.

| Поставщик                         | В Webset?           | Источник | Есть оценки? | Почему?                                                        |
| --------------------------------- | ------------------- | -------- | ------------ | -------------------------------------------------------------- |
| Accenture                         | **Да**              | `search` | Да (2)       | Прошла scoped search: есть офис в США, оказывает ИТ-консалтинг |
| Infosys                           | **Да**              | `search` | Да (2)       | Прошла scoped search: есть офис в США, оказывает ИТ-услуги     |
| Wipro                             | **Да**              | `search` | Да (2)       | Прошла scoped search: есть офис в США, оказывает ИТ-услуги     |
| EPAM Systems                      | **Да**              | `search` | Да (2)       | Прошла scoped search: листинг в США, занимается разработкой ПО |
| Persol Group                      | **Нет — исключена** | --       | --           | Не прошла scoped search: нет офиса в США                       |
| *(25 компаний, найденных в вебе)* | **Да**              | `search` | Да (по 2)    | Найдены веб-поиском, прошли оба criteria                       |

Scoped search оценивает ваш импортированный список по criteria (отсеивая Persol Group), а добавленный веб-поиск находит ещё 25 компаний. В итоге получается единый webset, в котором есть и ваши оценённые импорты, и новые находки из веба.

<Note>
  Веб-поиск использует `"behavior": "append"`, поэтому он дополняет существующие результаты, а не заменяет их. Если веб-поиск находит компанию, которая уже есть в результатах scoped search (например, Accenture), дубликат обрабатывается автоматически.
</Note>

***

<div id="quick-reference">
  ## Краткая справка
</div>

| Настройка                                         | Что делает                                      | Все элементы сохраняются?                   | Элементы оцениваются?                            |
| ------------------------------------------------- | ----------------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **1. Только import**                              | Обогащает ваш список                            | Да — сохраняются все                        | Нет                                              |
| **2. Только search**                              | Находит новые совпадения в вебе                 | Неприменимо (нет imports)                   | Да — возвращаются только прошедшие элементы      |
| **3. scoped search**                              | Оценивает ваш список по criteria                | Нет — не прошедшие отбрасываются            | Да                                               |
| **4. scoped search + поиск в вебе**               | Оценивает ваш список и находит новые совпадения | Нет — не прошедшие из imports отбрасываются | Да — оцениваются и imports, и найденные элементы |

<div id="which-config-should-i-use">
  ## Какую конфигурацию выбрать?
</div>

* **«Мне нужно просто обогатить список, без фильтрации»** — конфигурация 1
* **«У меня нет списка, найдите мне компании»** — конфигурация 2
* **«Оцените мой список и уберите неподходящие записи»** — конфигурация 3
* **«Оцените мой список И найдите новые подходящие компании»** — конфигурация 4