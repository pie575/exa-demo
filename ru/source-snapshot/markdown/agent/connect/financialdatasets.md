> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжать изучение.

<div id="financial-datasets">
  # Financial Datasets
</div>

> Структурированные финансовые и рыночные данные по более чем 27 000 тикеров США: цены, фундаментальные показатели, отчётность о прибыли, отчётность SEC, структура владения и скрининг акций.

[Financial Datasets](https://financialdatasets.ai) предоставляет готовые к машинной обработке
данные о компаниях и рынках для ИИ-агентов. Через
[Exa Connect](/ru/docs/agent/connect/overview) агенты могут получать
текущие и исторические котировки, сведения о компаниях, финансовую отчётность и
оценочные мультипликаторы, данные о прибыли, сведения об инсайдерском и институциональном владении, отчётность SEC
и их отдельные разделы, новости компаний, а также проводить скрининг рынка США по фундаментальным
критериям.

Подключите `financial_datasets` к запуску [Exa Agent](/ru/docs/agent/quickstart) —
и агент будет обращаться к Financial Datasets параллельно с веб-поиском Exa.

<div id="use-it-for">
  ## Для чего использовать
</div>

* Формирование структурированных аналитических срезов по компаниям.
* Анализ финансовых показателей, оценки стоимости и исторических трендов.
* Чтение отчётности SEC и извлечение отдельных разделов — например, факторов риска и MD&amp;A.
* Изучение сделок инсайдеров и институциональной структуры владения.
* Скрининг рынка США по фундаментальным критериям.
* Отслеживание новостей компаний и значимых событий.

<div id="data-available">
  ## Доступные данные
</div>

Каждый из перечисленных ниже наборов данных доступен у провайдера `financial_datasets`;
агент сам выбирает тот, который подходит для задачи:

| Набор данных            | Что возвращает                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| Beneficial ownership    | Бенефициарные владельцы с долей от 5% по формам 13D/13G, включая активистские и пассивные доли.      |
| Company facts           | Название, сектор, отрасль, биржа, местоположение, SEC CIK, классификация SIC.                        |
| Company news            | Свежие новостные статьи по тикеру.                                                                   |
| Earnings                | Квартальная выручка и EPS с изменением год к году и отклонениями от прогнозов.                       |
| Financial metrics       | Рыночная капитализация, EV, P/E, P/B, P/S, EV/EBITDA, PEG, маржинальность, ROE/ROA/ROIC, рост, EPS.  |
| Financial statements    | Отчёт о прибылях и убытках, баланс и отчёт о движении денежных средств из отчётности SEC.            |
| Historical stock prices | Бары OHLCV за период с детализацией по дням/неделям/месяцам/годам.                                   |
| Index-fund holdings     | Состав ETF и индексных фондов по весам либо фонды, держащие определённую бумагу.                     |
| Insider ownership       | Доли инсайдеров по формам SEC 3 и 5 (акции во владении руководителей, директоров, владельцев 10%).   |
| Insider trades          | Сделки инсайдеров по форме SEC 4 (имя, должность, тип, количество акций, стоимость).                 |
| Institutional ownership | Институциональные держатели по 13F, количество акций и заявленная стоимость.                         |
| Interest rates          | Текущие и исторические ключевые ставки центробанков (Fed, ECB, BOJ и другие).                        |
| SEC filing items        | Извлечённый текст отдельных разделов 10-K/10-Q/8-K (например, факторы риска, MD&amp;A).              |
| SEC filings             | Метаданные отчётности и прямые ссылки на EDGAR с возможностью фильтрации по типу формы.              |
| Segmented financials    | Выручка, операционная прибыль и другие статьи в разбивке по продуктам, бизнес-сегментам и географии. |
| Stock price snapshot    | Текущая цена в реальном времени, изменение за день и время котировки.                                |
| Stock screener          | Компании, соответствующие заданным фундаментальным критериям отбора.                                 |

<div id="provider-id">
  ## Provider ID
</div>

Используйте это значение в `dataSources`:

```text theme={null}
financial_datasets
```

<div id="example">
  ## Пример
</div>

Соберите структурированную аналитическую справку по компании NVIDIA.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
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
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
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

* [Particle](/ru/docs/agent/connect/particle): сравните опубликованные материалы с обсуждениями в подкастах.
* [Baselayer](/ru/docs/agent/connect/baselayer): проверьте, какая компания стоит за тикером.
* [Fiber.ai](/ru/docs/agent/connect/fiber): дополните данные о публичной компании сведениями о сопоставимых частных компаниях и контактах руководства.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Подключите к запуску" icon="rocket" href="/ru/docs/agent/connect/overview" cta="Открыть быстрый старт" arrow="true">
    Быстрый старт Exa Connect описывает `dataSources`, цены и полный каталог партнёров.
  </Card>

  <Card title="Комбинируйте провайдеров" icon="blend" href="/ru/docs/agent/connect/combining-providers" cta="Читать руководство" arrow="true">
    Подключите к одному запуску до пяти партнёров и сформулируйте запрос так, чтобы сработал каждый из них.
  </Card>

  <Card title="Изучите Exa Agent" icon="book-open" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создавайте запуски, отслеживайте прогресс в потоковом режиме, проектируйте схемы вывода и управляйте объёмом работы и затратами.
  </Card>

  <Card title="Получите API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Создать key" arrow="true">
    Создайте key в панели управления и запустите пример с этой страницы как есть. Новым аккаунтам начисляются бесплатные credits.
  </Card>
</Columns>