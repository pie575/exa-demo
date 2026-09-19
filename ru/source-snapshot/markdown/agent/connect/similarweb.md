> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение документации.

<div id="similarweb">
  # Similarweb
</div>

> Получайте оценки трафика сайтов, глобальные рейтинги и данные о конкурентах.

[Similarweb](https://www.similarweb.com) — один из ведущих источников аналитики
цифрового рынка. Сервис моделирует трафик и вовлечённость миллионов сайтов и
приложений: оценочное число визитов, источники трафика, демографию аудитории
и конкурентное окружение любого домена.

Подключите `similarweb` к запуску [Exa Agent](/ru/docs/agent/quickstart) через
[Exa Connect](/ru/docs/agent/connect/overview) — и агент будет отправлять
запросы в Similarweb наряду с веб-поиском Exa.

<div id="use-it-for">
  ## Для чего использовать
</div>

* Сравнение веб-трафика и вовлечённости компании с показателями конкурентов.
* Поиск конкурентов домена и сайтов с пересекающейся аудиторией.
* Оценка объёма рынков и отбор компаний по цифровому присутствию.
* Дополнение исследований компаний и категорий реальными поведенческими данными.

<div id="provider-id">
  ## Идентификатор провайдера
</div>

Используйте это значение в `dataSources`:

```text theme={null}
similarweb
```

<div id="pricing">
  ## Тарификация
</div>

Similarweb взимает плату в кредитах данных по ставке `$0.30 / credit`, и за каждый вызов
списывается то количество кредитов, которое сообщает для него Similarweb. Число кредитов
растёт вместе с объёмом возвращаемых данных — примерно один кредит на точку
данных (метрика × строка × месяц), поэтому стоимость вызова определяется его параметрами:

| Инструмент              | Кредиты                                                                      |
| ----------------------- | ---------------------------------------------------------------------------- |
| Трафик и рейтинг        | до 7 за каждый запрошенный месяц (1–2 месяца)                                |
| Похожие сайты           | 3 за каждый возвращённый сайт (1–5 сайтов)                                   |
| Источники трафика       | 10                                                                           |
| Топ реферреров          | 3 за каждый возвращённый реферрер (1–5)                                      |
| Топ стран               | 3 за каждую возвращённую страну (1–5)                                        |
| Топ страниц             | 2 за каждую возвращённую страницу (1–7)                                      |
| Топ ключевых слов       | 1–10 (около 1 на 100 точек данных по ключевым словам; 50 ключевых слов — ~7) |
| Обзор ключевого слова   | 1–2                                                                          |
| Демография аудитории    | 8                                                                            |
| Пересечение аудитории   | 2 за каждую комбинацию доменов (2–3 домена: 6–14)                            |
| Технологии              | 10                                                                           |
| Топ сайтов по категории | 1 за каждый возвращённый сайт (1–10)                                         |

Вызовы, не возвращающие данных (неизвестный домен или домен с низким трафиком,
ключевое слово с нулевым поисковым объёмом), бесплатны. Параметры `numResults` и `months`
задают, за сколько точек данных вы платите, поэтому задавайте минимальные значения,
достаточные для вашей задачи.

<div id="example">
  ## Пример
</div>

Найдите 10 быстрорастущих B2B SaaS-компаний и их предполагаемый веб-трафик.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      data_sources=[{"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "monthlyVisits"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "monthlyVisits": {"type": "number", "description": "from Similarweb"},
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
    query: "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
    dataSources: [{ provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "monthlyVisits"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      "dataSources": [{ "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "monthlyVisits"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "monthlyVisits": { "type": "number", "description": "from Similarweb" }
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

* [Fiber.ai](/ru/docs/agent/connect/fiber): превращайте найденных конкурентов в обогащённые карточки компаний.
* [Affiliate.com](/ru/docs/agent/connect/affiliatecom): оценивайте охват продавца, прежде чем рекомендовать его товары.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Подключите его к запуску" icon="rocket" href="/ru/docs/agent/connect/overview" cta="Открыть быстрый старт" arrow="true">
    Быстрый старт Exa Connect охватывает `dataSources`, тарификацию и полный каталог партнёров.
  </Card>

  <Card title="Комбинируйте провайдеров" icon="blend" href="/ru/docs/agent/connect/combining-providers" cta="Читать руководство" arrow="true">
    Подключите к одному запуску до пяти партнёров и сформулируйте запрос так, чтобы сработал каждый из них.
  </Card>

  <Card title="Изучите Exa Agent" icon="book-open" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создавайте запуски, получайте прогресс в потоковом режиме, проектируйте схемы вывода и управляйте затратами усилий и средств.
  </Card>

  <Card title="Получите API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Создать key" arrow="true">
    Создайте key в панели управления и запустите пример с этой страницы как есть. Новым аккаунтам начисляются бесплатные кредиты.
  </Card>
</Columns>