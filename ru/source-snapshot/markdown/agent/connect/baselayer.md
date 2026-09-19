> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="baselayer">
  # Baselayer
</div>

> Проверяйте компании США и получайте KYB-данные: руководителей, регистрации, оценки риска.

[Baselayer](https://baselayer.com) — это платформа Know Your Business (KYB),
которая проверяет юридические лица США по официальным регистрационным данным и
данным о рисках. Она определяет компанию по названию и адресу и возвращает полный
профиль: руководителей, регистрации в штатах, структуру юридического лица и
статус проверки.

Подключите `baselayer` к запуску [Exa Agent](/ru/docs/agent/quickstart) через
[Exa Connect](/ru/docs/agent/connect/overview) — и агент будет выполнять запросы к
Baselayer наряду с веб-поиском Exa.

<div id="use-it-for">
  ## Для чего использовать
</div>

* KYB-онбординг и проверка поставщиков и клиентов.
* Due diligence по руководителям, регистрациям и структуре юридического лица.
* Скрининг компаний на риски и совпадения по санкционным и контрольным спискам.

<div id="provider-id">
  ## Идентификатор провайдера
</div>

Используйте это значение в `dataSources`:

```text theme={null}
baselayer
```

<div id="pricing">
  ## Тарификация
</div>

Baselayer тарифицирует каждый заказ, а ставка зависит от операции и её
параметров:

| Операция                                                                          | Цена                                              |
| --------------------------------------------------------------------------------- | ------------------------------------------------- |
| Поиск компаний                                                                    | `$1.00 / search`                                  |
| Просмотр компании / руководителей / регистраций / обратный поиск по руководителям | Бесплатно (чтение результатов предыдущего поиска) |
| Поиск обременений                                                                 | `$2.00 / state searched`                          |
| Поиск судебных дел                                                                | `$1.00 / category (litigation, bankruptcy)`       |
| Проверка по контрольным спискам                                                   | `$0.10 – $0.25 / list requested`                  |
| Отраслевая классификация                                                          | `$0.35 / call`                                    |
| Анализ сайта                                                                      | `$0.35 / call`                                    |
| Присутствие в интернете                                                           | `$0.15 – $0.35 / selected analysis`               |
| Международный поиск компаний                                                      | `$4.00 / search`                                  |

Выбор параметров влияет на цену: поиск обременений по двум штатам обойдётся в
$4.00, проверка по всем шести поддерживаемым контрольным спискам — в $1.35, а стоимость вызова
для присутствия в интернете складывается из стоимости выбранных вами видов анализа (или
набора Baselayer по умолчанию — прогноз NAICS и анализ сайта, — если не выбрано ни одного).

<div id="example">
  ## Пример
</div>

Проверьте компанию и получите сведения о её руководителях и регистрации.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
      data_sources=[{"provider": "baselayer"}],
      output_schema={
          "type": "object",
          "required": ["business"],
          "properties": {
              "business": {
                  "type": "object",
                  "required": ["name", "verified", "incorporationState", "officers"],
                  "properties": {
                      "name": {"type": "string"},
                      "verified": {"type": "boolean"},
                      "incorporationState": {"type": "string"},
                      "officers": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "required": ["name", "title"],
                              "properties": {
                                  "name": {"type": "string"},
                                  "title": {"type": "string"},
                              },
                          },
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
    query: "Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
    dataSources: [{ provider: "baselayer" }],
    outputSchema: {
      type: "object",
      required: ["business"],
      properties: {
        business: {
          type: "object",
          required: ["name", "verified", "incorporationState", "officers"],
          properties: {
            name: { type: "string" },
            verified: { type: "boolean" },
            incorporationState: { type: "string" },
            officers: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "title"],
                properties: {
                  name: { type: "string" },
                  title: { type: "string" },
                },
              },
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
      "query": "Verify the business Stripe, Inc. in San Francisco, CA and return its officers and registration status.",
      "dataSources": [{ "provider": "baselayer" }],
      "outputSchema": {
        "type": "object",
        "required": ["business"],
        "properties": {
          "business": {
            "type": "object",
            "required": ["name", "verified", "incorporationState", "officers"],
            "properties": {
              "name": { "type": "string" },
              "verified": { "type": "boolean" },
              "incorporationState": { "type": "string" },
              "officers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["name", "title"],
                  "properties": {
                    "name": { "type": "string" },
                    "title": { "type": "string" }
                  }
                }
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

* [Fiber.ai](/ru/docs/agent/connect/fiber): обогащение данных о проверенной компании фирмографикой, численностью персонала и контактами.
* [Financial Datasets](/ru/docs/agent/connect/financialdatasets): добавление свежих новостных упоминаний о публичных компаниях.
* [Similarweb](/ru/docs/agent/connect/similarweb): сравнение веб-трафика проверенной компании с конкурентами.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Подключите к запуску" icon="rocket" href="/ru/docs/agent/connect/overview" cta="Открыть быстрый старт" arrow="true">
    Быстрый старт Exa Connect охватывает `dataSources`, цены и полный каталог партнёров.
  </Card>

  <Card title="Комбинируйте провайдеров" icon="blend" href="/ru/docs/agent/connect/combining-providers" cta="Читать руководство" arrow="true">
    Подключите к одному запуску до пяти партнёров и составьте запрос так, чтобы сработал каждый из них.
  </Card>

  <Card title="Изучите Exa Agent" icon="book-open" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создавайте запуски, отслеживайте ход выполнения в потоковом режиме, проектируйте схемы вывода и управляйте объёмом работы и затратами.
  </Card>

  <Card title="Получите API-ключ" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Создать ключ" arrow="true">
    Создайте ключ в панели управления и запустите пример с этой страницы как есть. Новым аккаунтам начисляются бесплатные кредиты.
  </Card>
</Columns>