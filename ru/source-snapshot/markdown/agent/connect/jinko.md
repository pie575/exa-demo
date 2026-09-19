> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="jinko">
  # Jinko
</div>

> Поиск авиабилетов и отелей с ценами в реальном времени.

[Jinko](https://gojinko.com) — это тревел-платформа для поиска авиабилетов и отелей с ценами в реальном времени. Находите актуальные предложения по перелётам для нужного маршрута и даты, подбирайте номера и тарифы отелей по направлению или конкретным объектам, а также изучайте направления, доступные из ваших аэропортов вылета.

Подключите `jinko` к запуску [Exa Agent](/ru/docs/agent/quickstart) через
[Exa Connect](/ru/docs/agent/connect/overview) — и агент будет обращаться к
Jinko параллельно с веб-поиском Exa.

<div id="use-it-for">
  ## Для чего использовать
</div>

* Поиск актуальных предложений на авиабилеты с тарифами, правилами провоза багажа и условиями изменения бронирования для заданного маршрута и даты.
* Поиск отелей с актуальными ценами на номера в нужном городе или повторный запрос цен по конкретным отелям.
* Подбор направлений и гибких дат с учётом диапазонов дат, классов обслуживания и бюджета.

<div id="provider-id">
  ## Идентификатор провайдера
</div>

Используйте это значение в `dataSources`:

```text theme={null}
jinko
```

<div id="example">
  ## Пример
</div>

Найдите пляжные направления с вылетом из Нью-Йорка дешевле $400 за перелёт туда и обратно в марте.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find beach destinations reachable from New York for under $400 round-trip in March.",
      data_sources=[{"provider": "jinko"}],
      output_schema={
          "type": "object",
          "required": ["destinations"],
          "properties": {
              "destinations": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["city", "iataCode", "lowestFare"],
                      "properties": {
                          "city": {"type": "string"},
                          "iataCode": {"type": "string"},
                          "lowestFare": {"type": "number", "description": "round-trip fare in USD"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find beach destinations reachable from New York for under $400 round-trip in March.",
    dataSources: [{ provider: "jinko" }],
    outputSchema: {
      type: "object",
      required: ["destinations"],
      properties: {
        destinations: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["city", "iataCode", "lowestFare"],
            properties: {
              city: { type: "string" },
              iataCode: { type: "string" },
              lowestFare: { type: "number", description: "round-trip fare in USD" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find beach destinations reachable from New York for under $400 round-trip in March.",
      "dataSources": [{ "provider": "jinko" }],
      "outputSchema": {
        "type": "object",
        "required": ["destinations"],
        "properties": {
          "destinations": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["city", "iataCode", "lowestFare"],
              "properties": {
                "city": { "type": "string" },
                "iataCode": { "type": "string" },
                "lowestFare": { "type": "number", "description": "round-trip fare in USD" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## Хорошо сочетается с
</div>

* [Similarweb](/ru/docs/agent/connect/similarweb): изучайте туристические сайты и платформы бронирования, стоящие за тем или иным направлением.
* [Particle](/ru/docs/agent/connect/particle): собирайте свежие публикации и travel-обзоры о конкретном месте.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Подключите к запуску" icon="rocket" href="/ru/docs/agent/connect/overview" cta="Открыть быстрый старт" arrow="true">
    В быстром старте Exa Connect описаны `dataSources`, цены и полный каталог партнёров.
  </Card>

  <Card title="Комбинируйте провайдеров" icon="blend" href="/ru/docs/agent/connect/combining-providers" cta="Читать руководство" arrow="true">
    Подключите к одному запуску до пяти партнёров и сформулируйте запрос так, чтобы сработал каждый из них.
  </Card>

  <Card title="Изучите Exa Agent" icon="book-open" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создавайте запуски, отслеживайте ход выполнения в потоковом режиме, проектируйте схемы вывода и управляйте усилиями и затратами.
  </Card>

  <Card title="Получите API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Создать key" arrow="true">
    Создайте key в панели управления и запустите пример с этой страницы как есть. Новым аккаунтам начисляются бесплатные кредиты.
  </Card>
</Columns>