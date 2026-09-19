> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="exa-connect">
  # Exa Connect
</div>

> Дайте своему Exa Agent доступ к данным премиальных партнёров в реальном времени — вместе с веб-поиском Exa, в рамках одного запуска.

Exa Connect подключает премиальных поставщиков данных к рабочему циклу Exa Agent. Привяжите
провайдера к запуску — и Exa Agent обратится к базе данных этого партнёра параллельно с веб-поиском,
а затем сведёт результаты в один структурированный ответ с опорой на источники.

Ещё не работали с запусками агента? Начните с [руководства по Exa Agent](/ru/docs/agent/quickstart),
а затем возвращайтесь сюда, чтобы подключить партнёров данных.

<Tip>
  Exa Agent уже ищет по всему [индексу данных](/ru/docs/search/data/overview) — по тем же источникам новостей,
  кода, компаний и людей, что и Search API. Exa Connect добавляет
  к этому премиальные партнёрские базы данных.
</Tip>

<Tip>
  Предпочитаете MCP? Exa Agent и [Exa Connect](/ru/docs/agent/connect/overview) доступны в [Exa MCP](/ru/docs/get-started/exa-mcp#exa-agent). Включите `tools=agent_run`, чтобы запускать многошаговые исследования, построение списков, enrichment и структурированный вывод из Claude, Cursor и других MCP-клиентов.
</Tip>

<div id="why-exa-connect">
  ## Зачем нужен Exa Connect
</div>

* **Премиальные данные без отдельных интеграций.** Получайте доступ к данным партнёров, не подписывая контракты и не подключая SDK. Вы обращаетесь к одному API Exa.
* **Exa берёт на себя всю техническую часть.** Мы отвечаем за аутентификацию у провайдеров, выбор инструментов, повторные попытки и ранжирование результатов.
* **Exa Agent сам выбирает источник.** Когда ваш `outputSchema` запрашивает «ежемесячные посещения по данным Similarweb» или «подтверждённых должностных лиц», Exa Agent вызывает подходящий партнёрский инструмент, а не пытается угадать ответ по веб-странице.
* **Данные индекса и партнёров за один запуск.** Connect работает поверх индекса Exa. Exa Agent задействует каждый источник там, где тот силён, и приводит ссылки на результаты.

<div id="how-it-works">
  ## Как это работает
</div>

1. **Подключите** одного или нескольких провайдеров через массив `dataSources` в
   [`POST /agent/runs`](/ru/docs/reference/agent-api/create-a-run).
2. Exa Agent **подбирает подходящий инструмент** для каждого шага исходя из вашего запроса и
   `outputSchema`: данные партнёра или веб-поиск Exa.
3. Результаты партнёров **объединяются с результатами веб-исследования** в структурированный вывод
   с указанием источников.

<div id="pricing">
  ## Тарификация
</div>

<Note>
  Стоимость Exa Connect суммируется со стандартной [стоимостью запуска Agent](/ru/docs/agent/quickstart#pricing).
  Вы оплачиваете обычные затраты Agent на вычисления и search, а также плату провайдеру за каждый вызов инструмента Exa Connect.
</Note>

| Провайдер                                            | Цена                                          |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/ru/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/ru/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/ru/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/ru/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / call`                               |
| Particle                                             | `$0.015 / call`                               |
| Financial Datasets                                   | `$0.01 / call`                                |
| Jinko                                                | `$0.005 / call`                               |

Fiber.ai тарифицирует в credits, а не по количеству вызовов, поскольку её собственная
плата различается от вызова к вызову: search стоит 2 credits плюс 1 за каждый
возвращённый результат, поиск компании или человека оплачивается за каждого
возвращённого кандидата (поэтому увеличение `numResults` при поиске компании ради
устранения неоднозначности имени обойдётся дороже), а раскрытие контакта — 2–5
credits в зависимости от того, запрашиваете ли вы рабочую почту, личную почту или
телефон. С вас списывается столько credits, сколько Fiber сообщает по каждому вызову;
вызовы без совпадений бесплатны. См. [цены Fiber.ai](/ru/docs/agent/connect/fiber#pricing).

Similarweb тарифицирует в кредитах данных (примерно один на метрику × строку × месяц),
поэтому цена вызова зависит от значений `numResults`/`months` — от 1 до 15 credits за вызов.
С вас списывается столько credits, сколько Similarweb сообщает по каждому вызову; вызовы,
не вернувшие данных, бесплатны. См. [цены Similarweb](/ru/docs/agent/connect/similarweb#pricing).

Baselayer тарифицирует по заказам, и ставка зависит от операции: KYB-поиск бизнеса
стоит $1.00, поиск залогов UCC — $2.00 за каждый штат, поиск судебных дел и дел о
банкротстве — $1.00 за категорию, проверка по спискам наблюдения — $0.10–$0.25 за
запрошенный список, отраслевая классификация и анализ сайта — по $0.35, веб-присутствие —
сумма выбранных видов анализа (по $0.15–$0.35 каждый), а международный поиск бизнеса —
$4.00. Последующие обращения к результатам ранее выполненного поиска бизнеса (данные о
компании, руководители, регистрации, обратный поиск по руководителю) бесплатны.
См. [цены Baselayer](/ru/docs/agent/connect/baselayer#pricing).

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
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
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="data-partners">
  ## Партнёры данных
</div>

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/ru/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM и рекрутинг.** B2B-база данных компаний и людей для поиска лидов
      и подбора контактов.
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/ru/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **Веб-аналитика.** Оценка трафика, глобальные рейтинги и поиск конкурентов
      для любого домена.
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/ru/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **Комплаенс и KYB.** Проверка компаний США: руководители, регистрационные данные и
      риск-сигналы.
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/ru/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **Рынки предсказаний.** Котировки рынков предсказаний, история цен и позиции
      трейдеров из Polymarket.
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/ru/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **Электронная коммерция.** Поиск по каталогу товаров с ценами, брендами и ссылками на магазины.
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/ru/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **Медиааналитика.** Поиск по расшифровкам подкастов с указанием спикеров
      и временных меток.
    </Card>

    <Card title="Финансовые датасеты" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/financialdatasets.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=24052e4641fa4060e1ccf64482b10e00" href="/ru/docs/agent/connect/financialdatasets" width="401" height="400" data-path="images/agent/connect/financialdatasets.svg">
      **Финансы.** Котировки, фундаментальные показатели, отчёты о прибыли, документы SEC, структура собственности и
      скрининг акций более чем по 27 000 американских тикеров.
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/jinko.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=958d2ec147d452f12c0904f41ffb2311" href="/ru/docs/agent/connect/jinko" width="400" height="395" data-path="images/agent/connect/jinko.svg">
      **Путешествия.** Поиск авиабилетов и отелей с ценами в реальном времени.
    </Card>
  </Columns>
</div>

Нужен источник, которого нет в списке выше? См. раздел [Дополнительные провайдеры](/ru/docs/agent/connect/additional-partners) — они доступны по запросу, для этого свяжитесь с нашей командой.

<div id="usage">
  ## Использование
</div>

<div id="combining-providers">
  ### Комбинирование провайдеров
</div>

Подключайте столько партнёров, сколько нужно для вашей задачи. Exa Agent обращается к каждому из них в тех сценариях, где он сильнее всего, и объединяет полученные данные с результатами веб-поиска в единый структурированный ответ:

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

Полное пошаговое руководство, в том числе о том, как составить запрос и `outputSchema`, чтобы срабатывал каждый
партнёр, см. в разделе [Комбинирование провайдеров](/ru/docs/agent/connect/combining-providers).