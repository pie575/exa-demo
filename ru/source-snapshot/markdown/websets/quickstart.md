> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="websets">
  # Websets
</div>

> Создавайте проверенные и обогащённые наборы данных из интернета.

<div id="what-are-websets">
  ## Что такое Websets?
</div>

Webset начинается с запроса на естественном языке и целевого количества item. Задайте criteria, которым должен удовлетворять каждый результат, и поля enrichment, заполняемые для каждого принятого item. Результаты поступают асинхронно — через дашборд, API или вебхуки.

Кроме того, websets можно собирать визуально в [Dashboard](/ru/docs/websets/dashboard/get-started), без единой строки кода.

<Info>
  Начинаете новый сценарий сбора списков или enrichment? Используйте [Exa Agent](/ru/docs/agent/quickstart).
  Это руководство пригодится для поддержки или расширения существующей интеграции с Websets.
  Для Websets API требуется платный тарифный план Websets; credits для Search API и credits для Websets учитываются отдельно.
</Info>

<div id="how-it-works">
  ## Как это работает
</div>

1. **Определите search:** укажите запрос на естественном языке, количество результатов, а при необходимости — criteria для проверки и enrichments.
2. **Поиск и проверка:** Websets находит кандидатов и сверяет каждого с вашими criteria. Только подходящие результаты становятся items.
3. **Выполнение enrichments:** для каждого проверенного item Websets находит запрошенные вами дополнительные данные — например, имя CEO, объём привлечённого финансирования или контакты.
4. **Получение результатов:** опрашивайте статус, подпишитесь на обновления через вебхуки или следите за появлением items в дашборде.

<div id="key-capabilities">
  ## Ключевые возможности
</div>

| Возможность              | Что она делает                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Проверка по criteria** | Каждый результат проверяется по заданным вами правилам, так что вы получаете только релевантные совпадения |
| **Enrichments**          | Извлечение конкретных данных (текст, числа, даты, логические значения) для каждого результата              |
| **Monitors**             | Запуск повторяющихся searches по расписанию, чтобы ваш webset обновлялся автоматически                     |
| **вебхуки**              | Получайте HTTP-колбэки в реальном времени по мере добавления или обогащения items                          |
| **Imports**              | Загружайте собственные URL и выполняйте по ним enrichments                                                 |

<div id="human-quickstart">
  ## Быстрый старт для человека
</div>

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в дашборде. Новым аккаунтам начисляются бесплатные credits.
</Card>

Установите SDK:

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

Затем выполните первый запрос:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa
  from exa_py.websets.types import CreateWebsetParameters, CreateEnrichmentParameters
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  webset = exa.websets.create(
      params=CreateWebsetParameters(
          search={
              "query": "Top AI research labs focusing on large language models",
              "count": 5
          },
          enrichments=[
              CreateEnrichmentParameters(
                  description="LinkedIn profile of VP of Engineering or related role",
                  format="text",
              ),
          ],
      )
  )

  print(f"Webset created with ID: {webset.id}")
  print(f"View your Webset at: {webset.dashboard_url}")

  # Дождитесь завершения обработки Webset
  webset = exa.websets.wait_until_idle(webset.id)

  # Получите Items из Webset
  items = exa.websets.items.list(webset_id=webset.id)
  for item in items.data:
      print(f"Item: {item.model_dump_json(indent=2)}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  const webset = await exa.websets.create({
    search: {
      query: "Top AI research labs focusing on large language models",
      count: 10
    },
    enrichments: [
      { description: "Estimate the company's founding year", format: "number" }
    ],
  });

  console.log(`Webset created with ID: ${webset.id}`);
  console.log(`View your Webset at: ${webset.dashboardUrl}`);

  const idleWebset = await exa.websets.waitUntilIdle(webset.id, {
    timeout: 60000,
    pollInterval: 2000,
    onPoll: (status) => console.log(`Current status: ${status}...`)
  });

  const items = await exa.websets.items.list(webset.id, { limit: 10 });
  for (const item of items.data) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/" \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer ${EXA_API_KEY}" \
    -d '{
      "search": {
        "query": "Top AI research labs focusing on large language models",
        "count": 5
      },
      "enrichments": [
        {"description": "Find the company'\''s founding year", "format": "number"}
      ]
    }'
  ```
</CodeGroup>

<Note>
  Сведения о доступности продукта см. в разделе [Zero Data Retention](/ru/docs/admin/security/zero-data-retention).
</Note>

<div id="next">
  ## Далее
</div>

* [**Руководство по дашборду**](./dashboard/get-started) — пошаговое руководство по работе с Websets в дашборде
* [**Как это работает**](./api/how-it-works) — подробный разбор событийно-ориентированной архитектуры
* [**Справочник Websets API**](./api/websets/create-a-webset) — полный справочник по всем эндпоинтам API