> ## Индекс документации
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

<div id="exa-agent">
  # Exa Agent
</div>

> Выполняйте deep research, построение списков и enrichment — рабочие процессы, возвращающие структурированные результаты.

Exa Agent — это асинхронный эндпоинт с оплатой по использованию для ресурсоёмких задач: построения списков, enrichment и deep research. Он справляется со сложными рассуждениями и может возвращать множество структурированных полей вывода.

Считайте его контекстным agent: вы описываете нужные данные и форму, в которой они должны вернуться, а Exa Agent оркестрирует необходимые для этого tool calls. Одно выполнение может развернуться во множество searches по разным направлениям, прочитать и сжать стоящие за ними страницы, разбить построение списков на параллельные подзадачи, проверить каждого кандидата по вашим criteria, обогатить контакты и обратиться с запросом к любым партнёрам данных [Exa Connect](/ru/docs/agent/connect/overview), которых вы подключите. Собранный context вы получаете как единый структурированный результат, подкреплённый источниками, вместо того чтобы самостоятельно оркестрировать каждый вызов `/search` и `/contents`.

Каждое выполнение может возвращать ответ на естественном языке, JSON, проверенный по schema, grounding на уровне полей, metadata и разбивку стоимости. Завершённые выполнения можно получить позже, вывести список прошлых выполнений, повторно воспроизвести события или продолжить с предыдущего выполнения.

<Tip>
  Предпочитаете MCP? Exa Agent и [Exa Connect](/ru/docs/agent/connect/overview) доступны в [Exa MCP](/ru/docs/get-started/exa-mcp#exa-agent). Включите `tools=agent_run`, чтобы запускать многошаговые исследования, построение списков, enrichment и получение структурированного вывода из Claude, Cursor и других MCP-клиентов.
</Tip>

<div id="when-to-use-exa-agent">
  ## Когда использовать Exa Agent
</div>

Используйте Exa Agent, когда рабочему процессу недостаточно одного вызова search или extraction, либо когда иначе вам пришлось бы писать собственный цикл из поисковых запросов, чтения страниц и шагов верификации, чтобы собрать данные:

* Формирование списков по открытым criteria с последующим обогащением каждого результата
* Исследование сущностей по множеству полей с citations
* Выполнение многошаговых задач вроде «найти компании, а затем их лиц, принимающих решения»
* Получение структурированного JSON из длительной задачи веб-исследования
* Объединение веб-исследования с премиальными партнёрами данных в одном ответе с опорой на источники
* Продолжение предыдущего выполнения с помощью follow-up-запроса вроде «найди ещё 10 результатов»

Exa Agent по своей природе асинхронен и работает с более высокой задержкой. Если вам нужен единичный поиск с низкой задержкой, а вызовами вы управляете сами, начните с [Search API](/ru/docs/search/quickstart).

<div id="quickstart">
  ## Quickstart
</div>

В этом примере запускается выполнение, которое формирует структурированный список людей, соответствующих вашим criteria. Результат возвращается в виде JSON в `output.structured`.

<div id="1-install-the-exa-sdk">
  ### 1. Установите Exa SDK
</div>

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

<div id="2-set-your-api-key">
  ### 2. Задайте API key
</div>

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

<div id="3-create-a-run">
  ### 3. Создайте выполнение
</div>

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      output_schema={
          "type": "object",
          "properties": {
              "people": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "job_title": {"type": "string"},
                          "linkedin_url": {"type": "string", "format": "uri"},
                      },
                      "required": ["name", "job_title", "linkedin_url"],
                  },
              }
          },
          "required": ["people"],
      },
      effort="auto",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
    outputSchema: {
      type: "object",
      properties: {
        people: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              job_title: { type: "string" },
              linkedin_url: { type: "string", format: "uri" }
            },
            required: ["name", "job_title", "linkedin_url"]
          }
        }
      },
      required: ["people"]
    },
    effort: "auto"
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "people": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "job_title": { "type": "string" },
                "linkedin_url": { "type": "string", "format": "uri" }
              },
              "required": ["name", "job_title", "linkedin_url"]
            }
          }
        },
        "required": ["people"]
      }
    }'
  ```
</CodeGroup>

Добавьте заголовок `Accept: text/event-stream` при создании выполнения, чтобы получать server-sent events по мере того, как выполнение ставится в очередь, запускается и завершается. Подробнее см. в разделе [Stream events](#stream-events).

<div id="4-poll-for-completion">
  ### 4. Опрос до завершения
</div>

Если вы не используете потоковую передачу событий, сохраните возвращённый `id` и опрашивайте выполнение, пока оно не перейдёт в терминальный статус.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run_id = "agent_run_01j..."
  run = exa.agent.runs.poll_until_finished(
      run_id,
      poll_interval=4000,
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const runId = "agent_run_01j...";
  const run = await exa.agent.runs.pollUntilFinished(runId, {
    pollInterval: 4000
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  RUN_ID="agent_run_01j..."

  while true; do
    RUN_JSON="$(curl -s "https://api.exa.ai/agent/runs/$RUN_ID" \
      -H "Authorization: Bearer $EXA_API_KEY")"

    STATUS="$(echo "$RUN_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["status"])')"
    echo "status=$STATUS"

    if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ] || [ "$STATUS" = "cancelled" ]; then
      echo "$RUN_JSON"
      break
    fi

    sleep 4
  done
  ```
</CodeGroup>

Завершённые выполнения содержат:

* `output.text`: ответ на естественном языке
* `output.structured`: валидированный JSON, если вы указали `outputSchema`
* `output.grounding`: цитаты для текстовых или структурированных полей, если они возвращаются
* `costDollars`: детализация стоимости выполнения

<Note>
  Exa Agent также доступен через совместимый с OpenAI Responses API. Направьте
  OpenAI SDK на `https://api.exa.ai`, используйте `model: "exa-agent"` и выберите
  синхронное, потоковое или фоновое выполнение. См. [Совместимость с OpenAI
  SDK](/ru/docs/integrations/openai-sdk#agent-via-responses-api).
</Note>

<div id="verify-and-enrich-a-specific-entity">
  ## Проверка и enrichment конкретной сущности
</div>

Exa Agent подходит не только для построения списков: с его помощью можно изучить одну известную сущность, проверить утверждение по авторитетным источникам и получить структурированный enrichment. В этом примере проверяется, есть ли на официальном сайте компании общедоступная страница с ценами, и, если данные о ценах доступны, результат дополняется ими. Схема требует только `domain` и `verdict`; всё остальное — необязательный enrichment.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
      system_prompt="Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
      effort="low",
      output_schema={
          "type": "object",
          "additionalProperties": False,
          "required": ["domain", "verdict"],
          "properties": {
              "domain": {"type": "string", "const": "redbarnrobotics.com"},
              "verdict": {
                  "type": "string",
                  "enum": ["present", "absent", "cannot_verify"],
              },
              "pricing_page_url": {"type": ["string", "null"], "format": "uri"},
              "displays_numeric_prices": {"type": ["boolean", "null"]},
              "pricing_model": {
                  "type": ["string", "null"],
                  "enum": [
                      "free",
                      "subscription",
                      "usage_based",
                      "one_time",
                      "custom_quote",
                      "mixed",
                      "other",
                      None,
                  ],
              },
              "starting_price": {"type": ["number", "null"], "minimum": 0},
              "currency": {
                  "type": ["string", "null"],
                  "description": "ISO 4217 code such as USD or EUR.",
              },
              "billing_period": {
                  "type": ["string", "null"],
                  "enum": [
                      "monthly",
                      "annual",
                      "one_time",
                      "usage_based",
                      "variable",
                      "other",
                      None,
                  ],
              },
              "has_free_plan": {"type": ["boolean", "null"]},
              "has_free_trial": {"type": ["boolean", "null"]},
              "reasoning": {"type": ["string", "null"], "maxLength": 300},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
    systemPrompt:
      "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
    effort: "low",
    outputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["domain", "verdict"],
      properties: {
        domain: { type: "string", const: "redbarnrobotics.com" },
        verdict: {
          type: "string",
          enum: ["present", "absent", "cannot_verify"]
        },
        pricing_page_url: { type: ["string", "null"], format: "uri" },
        displays_numeric_prices: { type: ["boolean", "null"] },
        pricing_model: {
          type: ["string", "null"],
          enum: [
            "free",
            "subscription",
            "usage_based",
            "one_time",
            "custom_quote",
            "mixed",
            "other",
            null
          ]
        },
        starting_price: { type: ["number", "null"], minimum: 0 },
        currency: {
          type: ["string", "null"],
          description: "ISO 4217 code such as USD or EUR."
        },
        billing_period: {
          type: ["string", "null"],
          enum: [
            "monthly",
            "annual",
            "one_time",
            "usage_based",
            "variable",
            "other",
            null
          ]
        },
        has_free_plan: { type: ["boolean", "null"] },
        has_free_trial: { type: ["boolean", "null"] },
        reasoning: { type: ["string", "null"], maxLength: 300 }
      }
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says '"'"'Contact sales'"'"'.",
      "systemPrompt": "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company'"'"'s official website as evidence.",
      "effort": "low",
      "outputSchema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["domain", "verdict"],
        "properties": {
          "domain": { "type": "string", "const": "redbarnrobotics.com" },
          "verdict": {
            "type": "string",
            "enum": ["present", "absent", "cannot_verify"]
          },
          "pricing_page_url": { "type": ["string", "null"], "format": "uri" },
          "displays_numeric_prices": { "type": ["boolean", "null"] },
          "pricing_model": {
            "type": ["string", "null"],
            "enum": ["free", "subscription", "usage_based", "one_time", "custom_quote", "mixed", "other", null]
          },
          "starting_price": { "type": ["number", "null"], "minimum": 0 },
          "currency": {
            "type": ["string", "null"],
            "description": "ISO 4217 code such as USD or EUR."
          },
          "billing_period": {
            "type": ["string", "null"],
            "enum": ["monthly", "annual", "one_time", "usage_based", "variable", "other", null]
          },
          "has_free_plan": { "type": ["boolean", "null"] },
          "has_free_trial": { "type": ["boolean", "null"] },
          "reasoning": { "type": ["string", "null"], "maxLength": 300 }
        }
      }
    }'
  ```
</CodeGroup>

<Note>
  Схемы для рабочих процессов верификации должны учитывать неопределённость.
  Делайте поля, которые может не удаться проверить, nullable и не включайте их в `required`,
  чтобы agent мог вернуть `null` вместо того, чтобы придумывать значение. Enum `verdict`
  отличает неудавшуюся проверку (`cannot_verify`) от действительно отрицательных
  данных (`absent`): недоступность сайта не означает, что страница не существует.
</Note>

<div id="stream-events">
  ## Stream events
</div>

При потоковой передаче запрос на создание остаётся открытым, и сервер отправляет Server-Sent Events (SSE) до тех пор, пока выполнение не завершится. Типы событий и их payload описаны в разделе [Event format](#event-format).

Укажите `stream=True` в Python, `stream: true` в JavaScript или отправьте заголовок `Accept: text/event-stream` по HTTP:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  events = exa.agent.runs.create(
      query="Find five recently launched developer tools for evaluating AI agents.",
      stream=True,
  )

  for event in events:
      print(event.event, event.data)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const events = await exa.agent.runs.create({
    query: "Find five recently launched developer tools for evaluating AI agents.",
    stream: true
  });

  for await (const event of events) {
    console.log(event.event, event.data);
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find five recently launched developer tools for evaluating AI agents."
    }'
  ```
</CodeGroup>

<div id="event-format">
  ### Формат событий
</div>

Каждый SSE-фрейм содержит идентификатор события, имя события и JSON-payload:

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

Поток также может содержать строки-комментарии, например `: keep-alive`. SSE-клиенты автоматически игнорируют комментарии; собственные парсеры должны делать то же самое.

<div id="event-types">
  ### Типы событий
</div>

| Событие               | `data` payload                        | Как использовать                                                                                                        |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | Сохраните ID выполнения сразу после того, как request принят.                                                           |
| `agent_run.started`   | `{ id, status: "running" }`           | Пометьте выполнение как активно обрабатываемое.                                                                         |
| `agent_run.completed` | Объект завершённого Agent выполнения  | Прочитайте итоговый ответ из `data.output.text` или `data.output.structured`, а citations — из `data.output.grounding`. |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | Выведите `error.code` и `error.message`; завершённый вывод недоступен.                                                  |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | Прекратите чтение потока и обработайте выполнение как отменённое.                                                       |

События, относящиеся к одному и тому же шагу Research, содержат `callId`. Он соответствует `item.call_id` в событиях прогресса tool. Используйте его, чтобы группировать трассировки search, sources и прогресс tool. Некоторые описания трассировок search формируются асинхронно и могут прийти позже события source или tool, которое они описывают, поэтому не сопоставляйте их только по порядку поступления.

Считайте `agent_run.source.added` предварительным просмотром в реальном времени, а не полным списком citations. Итоговое `output.grounding` завершённого выполнения — это авторитетный вывод grounding.

<div id="replay-stored-events">
  ### Повторная отправка сохранённых событий
</div>

Для выполнений без ZDR метод [`GET /agent/runs/{id}/events`](/ru/docs/reference/agent-api/list-run-events) возвращает сохранённые события в виде JSON с постраничной разбивкой. Передайте `Accept: text/event-stream`, чтобы повторно отправить сохранённые события в формате SSE, и `Last-Event-ID`, чтобы пропустить события, которые ваш client уже обработал:

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

Эндпоинт повторного воспроизведения отправляет события, сохранённые на момент запроса, после чего закрывает соединение; он не продолжает следить за активным выполнением. Выполнения в режиме ZDR не сохраняют события, и повторно воспроизвести их нельзя.

Для совместимости с будущими версиями игнорируйте имена событий, которые ваше приложение не распознаёт, и продолжайте обработку до получения терминального события.

<div id="return-structured-json">
  ## Возврат структурированного JSON
</div>

Используйте `outputSchema`, чтобы получать в поле `output.structured` JSON, проверенный по схеме.

`outputSchema` поддерживает [спецификацию JSON Schema](https://json-schema.org/).

Чтобы запросить контактную информацию, опишите нужные контактные поля в `outputSchema`. Используйте стандартные конструкции JSON Schema: `{ "type": "string", "format": "email" }` для адресов электронной почты, `{ "type": "string", "format": "phone" }` для номеров телефонов и `{ "type": "string", "format": "uri" }` для URL. По возможности ограничивайте размер списков с помощью `maxItems`, чтобы максимальная стоимость contact-enrichment оставалась предсказуемой.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      effort="auto",
      output_schema={
          "type": "object",
          "properties": {
              "companies": {
                  "type": "array",
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "website": {"type": "string"},
                      },
                      "required": ["name", "round"],
                  },
              }
          },
          "required": ["companies"],
      },
  )
  run = exa.agent.runs.poll_until_finished(
      run.id,
  )

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
    effort: "auto",
    outputSchema: {
      type: "object",
      properties: {
        companies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              round: { type: "string" },
              website: { type: "string" }
            },
            required: ["name", "round"]
          }
        }
      },
      required: ["companies"]
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "companies": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "website": { "type": "string" }
              },
              "required": ["name", "round"]
            }
          }
        },
        "required": ["companies"]
      }
    }'
  ```
</CodeGroup>

<div id="process-input-rows">
  ## Обработка входных строк
</div>

Используйте `input.data`, если у вас уже есть набор данных, который требуется обогатить. Вы можете добавить дополнительные поля к каждой сущности данных, найти новые сущности на основе переданных данных или сделать и то, и другое.

Полные примеры обогащения строк см. в разделе [Примеры Agent](/ru/docs/agent/examples#enrich-input-rows-code).

<div id="process-exclusions">
  ## Обработка исключений
</div>

Используйте `input.exclusion`, чтобы определённые записи не попадали в результаты выполнения. В примере ниже мы ищем 10 самых милых животных, но исключаем из выполнения коз и панд, поскольку уже знаем, насколько они милые.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find the top 10 cutest animals. Return each animal's common name and a source URL.",
      input={
          "exclusion": [
              {"animal": "goat"},
              {"animal": "panda"},
          ]
      },
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find the top 10 cutest animals. Return each animal's common name and a source URL.",
    input: {
      exclusion: [
        { animal: "goat" },
        { animal: "panda" }
      ]
    }
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find the top 10 cutest animals. Return each animal'"'"'s common name and a source URL.",
      "input": {
        "exclusion": [
          { "animal": "goat" },
          { "animal": "panda" }
        ]
      }
    }'
  ```
</CodeGroup>

<div id="connect-data-sources">
  ## Подключение источников данных
</div>

Индекс доступен при каждом выполнении по умолчанию. Используйте `dataSources` только для подключения партнёров [Exa Connect](/ru/docs/agent/connect/overview). В каждой записи указывается `provider`. Если свойство в вашем `outputSchema` ссылается на конкретный источник (например, &quot;from Similarweb&quot;), Exa Agent вызовет соответствующий инструмент провайдера, а не станет угадывать данные по веб-странице.

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

Полный список партнёров данных с примерами для каждого из них смотрите в разделе [Exa Connect](/ru/docs/agent/connect/overview).

<div id="continue-from-a-previous-run">
  ## Продолжение предыдущего выполнения
</div>

Используйте `previousRunId`, чтобы задать уточняющие вопросы к предыдущему ответу. Каждый уточняющий вопрос создаёт новое выполнение с собственным ID. `previousRunId` переносит контекст в новое выполнение и не используется повторно в качестве ID нового выполнения.

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Narrow that list to companies hiring in San Francisco.",
      previous_run_id="agent_run_01j...",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Narrow that list to companies hiring in San Francisco.",
    previousRunId: "agent_run_01j..."
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Narrow that list to companies hiring in San Francisco.",
      "previousRunId": "agent_run_01j..."
    }'
  ```
</CodeGroup>

<div id="find-a-run-id">
  ## Как найти ID выполнения
</div>

Получите список последних выполнений и проверьте их статусы:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  runs = exa.agent.runs.list(
      limit=10,
  )

  for run in runs.data:
      query = (run.request or {}).get("query", "")
      print(f"{run.id}\t{run.status}\t{run.created_at}\t{query}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const list = await exa.agent.runs.list({
    limit: 10
  });

  for (const run of list.data) {
    const query = run.request?.query ?? "";
    console.log(`${run.id}\t${run.status}\t${run.createdAt}\t${query}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/agent/runs?limit=10" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="pricing">
  ## Pricing
</div>

Стоимость зависит от использования и рассчитывается по компонентам:

| Компонент                 | Цена              |
| ------------------------- | ----------------- |
| Agent Compute Units       | `1 ACU = $0.10`   |
| Вызовы инструмента Search | `$0.005 / search` |

<Note>
  Обогащение контактов не входит в основные компоненты стоимости выше: обогащение контактов по email стоит `$0.02 / email`, а по номеру телефона — `$0.07 / phone number`.
</Note>

`usage.agentComputeUnits` измеряет объём вычислений модели за всё выполнение. Сложные запросы, особенно с объёмным полем `input.data`, требуют больше шагов рассуждения и вызовов инструментов, а значит потребляют больше ACU.

Информацию о параллелизме и лимитах частоты запросов см. в разделе [Лимиты Agent](/ru/docs/admin/billing#agent-limits).

<div id="effort">
  ### Effort
</div>

Используйте `effort`, чтобы выбрать уровень стоимости и рассуждений для каждого выполнения. Поддерживаются значения `minimal`, `low`, `medium`, `high`, `xhigh`, `auto` и `max`; по умолчанию используется `auto`. У фиксированных уровней effort цена за запрос предсказуема, а `auto` и бета-режим `max` тарифицируются по использованию:

| Effort    | Цена                                                     |
| --------- | -------------------------------------------------------- |
| `minimal` | `$0.012 / запрос`                                        |
| `low`     | `$0.025 / запрос`                                        |
| `medium`  | `$0.10 / запрос`                                         |
| `high`    | `$0.50 / запрос`                                         |
| `xhigh`   | `$1.00 / запрос`                                         |
| `auto`    | По использованию; до лимита `$5` по умолчанию            |
| `max`     | **Бета**, по использованию; до лимита `$20` по умолчанию |

<Info>
  Agent Max — уровень с наибольшим effort для задач, где полнота и тщательность
  важнее задержки или стоимости: масштабное построение списков, глубокое исследование
  по множеству источников и criteria, которые трудно проверить. Режим находится в
  публичной бете: запросы с `effort: "max"` должны содержать `Exa-Beta: agent-max-effort-2026-07-27`.
  Этот header принимает список бета-токенов через запятую.
</Info>

`budget.maxCostDollars` — необязательный предел на одно выполнение для `auto` и `max`. Допустимы значения от `$1` до `$100`; максимум в поставке — `$100`, однако на server может быть задан более низкий максимум. Лимит по умолчанию — `$5` для `auto` и `$20` для `max`. Это именно предел, а не фиксированная цена: выполнения, завершившиеся раньше, обойдутся дешевле. Для фиксированных уровней effort бюджет не принимается.

<div id="choosing-an-effort-mode">
  ### Выбор режима effort
</div>

Фиксированные режимы effort хорошо подходят, когда для стандартных исследований нужна предсказуемая стоимость каждого запроса. Используйте `auto` для задач с переменным объёмом, например для построения списков, где число сущностей может меняться от запроса к запросу.

| Effort    | Лучше всего для                                                           | Рекомендуемая сложность schema                                            | Ожидания по времени выполнения       |
| --------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------ |
| `minimal` | Самые дешёвые запросы, очень узкие фактические задачи, короткие ответы    | Одно-два поля, неглубокая schema                                          | Дешевле всего, наименее полно        |
| `low`     | Простые запросы, узкие фактические задачи, короткие ответы                | Несколько полей, неглубокая schema                                        | Быстро, лёгкое исследование          |
| `medium`  | Отправная точка по умолчанию для большинства стандартных исследований     | Умеренное число полей, простые вложенные объекты                          | Баланс качества и времени            |
| `high`    | Более сложные исследования, больше citations, строже требования к полноте | Крупные schema или более тонкие поля                                      | Медленнее, более тщательно           |
| `xhigh`   | Важные задачи, где полнота значит больше, чем стоимость и задержка        | Сложные schema, много полей, трудная верификация                          | Самый медленный фиксированный effort |
| `auto`    | Задачи с переменным объёмом, построение списков, неизвестная сложность    | Гибко; полезно, когда число сущностей или объём работы заранее неизвестны | Переменное                           |
| `max`     | Исследования с максимальным effort (бета)                                 | Сложные schema, много полей, трудная верификация                          | Самое долгое выполнение              |

Начинайте с `medium` для стандартных исследований по одной сущности. Снижайте до `low` или `minimal`, когда стоимость и задержка важнее полноты. Повышайте до `high` или `xhigh`, если выходная schema крупнее, поля требуют верификации или задача требует более глубокого рассуждения. Используйте `auto`, когда объём заранее неизвестен, например при построении списков или в рабочих процессах, которые могут вернуть много сущностей.

Время выполнения зависит от сложности запроса, сложности schema и доступности внешних источников. Рассматривайте режимы effort как компромисс между качеством, стоимостью и временем выполнения, а не как строгие гарантии задержки.

<div id="run-with-max-effort">
  ### Выполнение с effort max
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.beta.agent.runs.create(
      query="Find all companies building browser automation tools in the United States.",
      effort="max",
      budget={"maxCostDollars": 10},
      betas=["agent-max-effort-2026-07-27"],
  )
  print(run)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.beta.agent.runs.create({
    query: "Find all companies building browser automation tools in the United States.",
    effort: "max",
    budget: { maxCostDollars: 10 },
    betas: ["agent-max-effort-2026-07-27"]
  });
  console.log(run);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: agent-max-effort-2026-07-27" \
    -d '{
      "query": "Find all companies building browser automation tools in the United States.",
      "effort": "max",
      "budget": { "maxCostDollars": 10 }
    }'
  ```
</CodeGroup>

Для примеров с SDK требуется версия `exa-py` или `exa-js` с поддержкой Agent Max.

<div id="zero-data-retention">
  ## Нулевое хранение данных
</div>

Exa Agent поддерживает [нулевое хранение данных](/ru/docs/admin/security/zero-data-retention) (ZDR). ZDR включается на уровне команды. [Свяжитесь с нами](mailto:sales@exa.ai), чтобы включить его для вашего аккаунта.

Когда ZDR включён для вашей команды:

* Создавайте выполнения с потоковой передачей (`Accept: text/event-stream`), чтобы получать вывод в реальном времени, либо опрашивайте асинхронные выполнения в пределах окна хранения.
* Данные выполнения доступны во время его выполнения и ещё до 10 минут после перехода в терминальное состояние. По истечении этого окна получить данные выполнения нельзя.
* `previousRunId` недоступен.
* `dataSources` в Exa Connect недоступны; запросы, содержащие их, возвращают ошибку `400`.

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Что есть в индексе" icon="search" href="/ru/docs/search/data/overview" cta="Открыть руководство" arrow="true">
    Изучите источники новостей, кода, данных о компаниях и людях со всего открытого веба.
  </Card>

  <Card title="Exa Connect" icon="database" href="/ru/docs/agent/connect/overview" cta="Открыть руководство" arrow="true">
    Подключайте премиальные партнёрские базы данных к выполнению.
  </Card>

  <Card title="Лучшие практики Agent" icon="lightbulb" href="/ru/docs/agent/best-practices" cta="Открыть руководство" arrow="true">
    Лучшие практики использования Exa Agent.
  </Card>

  <Card title="Примеры Agent" icon="code" href="/ru/docs/agent/examples" cta="Открыть руководство" arrow="true">
    Примеры использования Exa Agent.
  </Card>
</Columns>