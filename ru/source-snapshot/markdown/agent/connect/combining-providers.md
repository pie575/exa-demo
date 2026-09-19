> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжать изучение.

<div id="combining-providers">
  # Комбинирование провайдеров
</div>

> Используйте несколько партнёров по данным одновременно в рамках одного запуска Exa Agent.

Подключение партнёра к `dataSources` делает его доступным для Exa Agent в качестве инструмента, но **не** заставляет агента его вызывать. Будет ли задействован партнёр, зависит от вашего `запрос` и `outputSchema`: укажите, какой результат вы ожидаете от каждого партнёра, и Exa Agent обратится к подходящему инструменту, вместо того чтобы угадывать ответ по веб-странице. К одному запуску можно подключить до пяти партнёров; Exa Agent сам выбирает, какой из них вызвать на каждом шаге, а наряду с ними доступен веб-поиск Exa. Нужно больше пяти в рамках одного запуска? [Свяжитесь с нами](mailto:sales@exa.ai), чтобы увеличить лимит.

<div id="two-partners-in-one-run">
  ## Два партнёра в одном запуске
</div>

Перечислите несколько партнёров вместе, и Exa Agent задействует каждого там, где тот силён. Два — это лишь пример: в `dataSources` можно указать до пяти партнёров, и принцип остаётся тем же — явно запрашивайте данные каждого из них. В этом запуске для подготовки инвесторского брифинга объединяются [Financial Datasets](/ru/docs/agent/connect/financialdatasets) для новостей по тикеру и [Particle](/ru/docs/agent/connect/particle) для комментариев из подкастов. Запрос требует характерные данные каждого партнёра, а схема разделяет вывод на `financialNews` и `podcastChatter`, поэтому Exa Agent обращается к **обоим** партнёрам в рамках одного запуска.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and "
          "earnings news, and (2) what podcast hosts and guests have recently been saying "
          "about NVIDIA, with speaker-attributed quotes and their stance."
      ),
      data_sources=[
          {"provider": "financial_datasets"},
          {"provider": "particle"},
      ],
      output_schema={
          "type": "object",
          "required": ["ticker", "financialNews", "podcastChatter"],
          "properties": {
              "ticker": {"type": "string"},
              "financialNews": {
                  "type": "array",
                  "maxItems": 6,
                  "items": {
                      "type": "object",
                      "required": ["title", "source", "date", "theme"],
                      "properties": {
                          "title": {"type": "string"},
                          "source": {"type": "string"},
                          "date": {"type": "string"},
                          "theme": {"type": "string", "description": "earnings, guidance, analyst rating, product, or market"},
                      },
                  },
              },
              "podcastChatter": {
                  "type": "array",
                  "maxItems": 6,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "bullish, bearish, or neutral"},
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
      "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and " +
      "earnings news, and (2) what podcast hosts and guests have recently been saying " +
      "about NVIDIA, with speaker-attributed quotes and their stance.",
    dataSources: [
      { provider: "financial_datasets" },
      { provider: "particle" },
    ],
    outputSchema: {
      type: "object",
      required: ["ticker", "financialNews", "podcastChatter"],
      properties: {
        ticker: { type: "string" },
        financialNews: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            required: ["title", "source", "date", "theme"],
            properties: {
              title: { type: "string" },
              source: { type: "string" },
              date: { type: "string" },
              theme: { type: "string", description: "earnings, guidance, analyst rating, product, or market" },
            },
          },
        },
        podcastChatter: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            required: ["podcast", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "bullish, bearish, or neutral" },
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
      "query": "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and earnings news, and (2) what podcast hosts and guests have recently been saying about NVIDIA, with speaker-attributed quotes and their stance.",
      "dataSources": [
        { "provider": "financial_datasets" },
        { "provider": "particle" }
      ],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "financialNews", "podcastChatter"],
        "properties": {
          "ticker": { "type": "string" },
          "financialNews": {
            "type": "array",
            "maxItems": 6,
            "items": {
              "type": "object",
              "required": ["title", "source", "date", "theme"],
              "properties": {
                "title": { "type": "string" },
                "source": { "type": "string" },
                "date": { "type": "string" },
                "theme": { "type": "string", "description": "earnings, guidance, analyst rating, product, or market" }
              }
            }
          },
          "podcastChatter": {
            "type": "array",
            "maxItems": 6,
            "items": {
              "type": "object",
              "required": ["podcast", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "bullish, bearish, or neutral" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<Tip>
  Явно указывайте в *запросе*, какие данные нужны от каждого партнёра — назовите тип результата, который вы ждёте от каждого из них (здесь: финансовые новости по тикеру и цитаты из подкастов с указанием спикера). Если запрос сформулирован слишком общо («последние новости»), Exa Agent, как правило, обращается к веб-поиску вместо партнёра. Отражение этих различных задач в полях `outputSchema` дополнительно закрепляет результат.
</Tip>