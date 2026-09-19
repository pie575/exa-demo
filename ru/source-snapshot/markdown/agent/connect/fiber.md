> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц перед дальнейшим изучением.

<div id="fiberai">
  # Fiber.ai
</div>

> Поиск по B2B-базе Fiber.ai: компании, люди и профили LinkedIn.

[Fiber.ai](https://fiber.ai) — это B2B-платформа данных со свежей информацией
о более чем 40 млн компаний, 850 млн человек и 30 млн вакансий. Ищите актуальные
данные о компаниях, людях и вакансиях и дополняйте неполные записи рабочими
и личными адресами электронной почты, а также номерами телефонов.

Подключите `fiber` к запуску [Exa Agent](/ru/docs/agent/quickstart) через
[Exa Connect](/ru/docs/agent/connect/overview) — и агент будет обращаться к
Fiber.ai параллельно с веб-поиском Exa.

<div id="use-it-for">
  ## Для чего использовать
</div>

* Наведение порядка в CRM: обратный поиск человека по рабочему или личному
  адресу электронной почты, а также дополнение неполных записей о компании или человеке.
* Отслеживание сигналов LinkedIn в реальном времени: смена работы, повышения, новые
  вакансии, изменения численности персонала и привлечение инвестиций.
* Поиск релевантных публикаций в LinkedIn, X, Instagram, TikTok, Reddit и
  YouTube, сбор комментариев и реакций к ним с последующим обогащением контактных
  данных авторов.
* Поиск по базе из более чем 40 млн компаний и 850 млн человек и обогащение данных о потенциальных клиентах
  рабочей почтой, личной почтой и номерами телефонов.

<div id="provider-id">
  ## Provider ID
</div>

Используйте это значение в `dataSources`:

```text theme={null}
fiber
```

<div id="pricing">
  ## Тарификация
</div>

Fiber.ai тарифицирует в кредитах по цене `$0.02 / credit`, и каждый вызов оплачивается в том количестве кредитов, которое Fiber по нему сообщает:

| Операция                                 | Кредиты                         |
| ---------------------------------------- | ------------------------------- |
| Search                                   | 2 + 1 за каждый результат       |
| Поиск компании                           | ~2 за каждого кандидата         |
| Поиск человека / обратный поиск по email | 2                               |
| Раскрытие контакта                       | 2 (рабочий email) – 5 (телефон) |

Вызовы, не вернувшие совпадений (или те, оплату которых Fiber возвращает), бесплатны. Стоимость зависит от выбранных параметров: параметр `numResults` при поиске компании определяет, за сколько кандидатов вы платите, а для поиска основную часть стоимости формирует количество результатов.

<div id="example">
  ## Пример
</div>

Соберите список B2B-лидов: финтех-компании из Нью-Йорка на стадии Series A с численностью 50–200 сотрудников.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
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
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
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
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
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

* [Similarweb](/ru/docs/agent/connect/similarweb): оцените веб-присутствие потенциального клиента и его конкурентов.
* [Baselayer](/ru/docs/agent/connect/baselayer): проверьте руководителей и регистрационные данные отобранных компаний из США.
* [Particle](/ru/docs/agent/connect/particle): узнайте, что говорят о компании или её руководителе в подкастах.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Подключите к запуску" icon="rocket" href="/ru/docs/agent/connect/overview" cta="Открыть быстрый старт" arrow="true">
    Быстрый старт Exa Connect охватывает `dataSources`, цены и полный каталог партнёров.
  </Card>

  <Card title="Объедините провайдеров" icon="blend" href="/ru/docs/agent/connect/combining-providers" cta="Читать руководство" arrow="true">
    Подключите к одному запуску до пяти партнёров и сформулируйте запрос так, чтобы сработал каждый из них.
  </Card>

  <Card title="Изучите Exa Agent" icon="book-open" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создавайте запуски, отслеживайте прогресс в потоковом режиме, проектируйте схемы вывода и управляйте объёмом работы и затратами.
  </Card>

  <Card title="Получите API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Создать key" arrow="true">
    Создайте key в панели управления и запустите пример с этой страницы как есть. Новым аккаунтам начисляются бесплатные кредиты.
  </Card>
</Columns>