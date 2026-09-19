> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

<div id="monitors-api">
  # Monitors API
</div>

> Запускайте регулярные поисковые запросы и получайте новые найденные результаты через вебхук.

Monitors выполняют поиск Exa по заданному расписанию и доставляют результаты на эндпоинт вебхука.

Используйте Monitors, чтобы следить за новостями, анонсами конкурентов, раундами финансирования, изменениями в регулировании, научными
публикациями и любыми другими темами, которые меняются со временем.

<div id="how-monitors-work">
  ## Как работают monitorы
</div>

При каждом запуске Exa выполняет заданный поиск, фильтрует результаты по времени, исключает результаты и находки, которые monitor уже возвращал, и отправляет новые данные на ваш вебхук.

Каждый monitor ведёт собственную историю запусков, поэтому стройте запрос вокруг сигнала, который нужно отслеживать на постоянной основе, а не задавайте вручную смещающийся диапазон дат.

<div id="create-your-first-monitor">
  ## Создайте свой первый monitor
</div>

Создайте monitor, указав поисковый запрос, интервал и HTTPS-эндпоинт, на который будут приходить
обновления:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  monitor = exa.monitors.create({
      "name": "Battery recycling expansion",
      "search": {
          "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
          "type": "interval",
          "period": "1d",
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"],
      },
  })

  print(monitor.id)
  print(monitor.webhook_secret)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const monitor = await exa.monitors.create({
    name: "Battery recycling expansion",
    search: {
      query: "new battery recycling facilities announced in North America"
    },
    trigger: {
      type: "interval",
      period: "1d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });

  console.log(monitor.id);
  console.log(monitor.webhookSecret);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "Battery recycling expansion",
      "search": {
        "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<Accordion title="Пример ответа">
  ```json theme={null}
  {
    "id": "01k4d9w6y3h7p2m8n5q1r0s4tv",
    "name": "Battery recycling expansion",
    "status": "active",
    "search": {
      "query": "new battery recycling facilities announced in North America"
    },
    "trigger": {
      "type": "interval",
      "period": "1d"
    },
    "outputSchema": null,
    "metadata": null,
    "webhook": {
      "url": "https://example.com/webhooks/exa",
      "events": ["monitor.run.completed"]
    },
    "nextRunAt": null,
    "createdAt": "2026-09-05T20:00:00.000Z",
    "updatedAt": "2026-09-05T20:00:00.000Z",
    "webhookSecret": "<one-time-webhook-signing-secret>"
  }
  ```
</Accordion>

Сохраните `webhookSecret` при создании monitor. Он возвращается только один раз и需 необходим для
проверки подписей вебхуков.

<div id="configure-the-output">
  ## Настройка вывода
</div>

Каждый завершённый запуск возвращает новые найденные страницы в `output.results`.

Exa также обобщает результаты по каждой странице в `output.content`:

| Форма вывода           | Как использовать               | Возвращаемое значение                           |
| ---------------------- | ------------------------------ | ----------------------------------------------- |
| Текстовое summary      | По умолчанию                   | Строка в `output.content`                       |
| Структурированный JSON | Добавьте объект `outputSchema` | JSON, соответствующий схеме, в `output.content` |

Источники для синтезированных полей возвращаются автоматически в `output.grounding`.

Добавляйте `outputSchema`, когда последующему коду нужен единообразный
набор полей:

```json theme={null}
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "announcements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "company": { "type": "string" },
            "location": { "type": "string" },
            "announcement": { "type": "string" }
          },
          "required": ["company", "location", "announcement"]
        }
      }
    },
    "required": ["announcements"]
  }
}
```

Не включайте цитаты и уровень уверенности в схему. Они возвращаются отдельно — в
`output.grounding`.

<div id="add-page-content">
  ## Добавление содержимого страниц
</div>

`search` принимает те же параметры, что и [Exa Search](/ru/docs/search/quickstart): используйте `contents`, чтобы добавить к каждому результату
highlights, полный текст или краткое содержание, а `includeDomains` или `excludeDomains` — чтобы
ограничить набор источников.

<CodeGroup>
  ```python Python theme={null}
  monitor = exa.monitors.create({
      "name": "LLM Research Tracker",
      "search": {
          "query": "new large language model training techniques and architectures",
          "numResults": 10,
          "contents": {
              "highlights": True
          }
      },
      "trigger": {
          "type": "interval",
          "period": "7d"
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"]
      }
  })
  ```

  ```javascript JavaScript theme={null}
  const monitor = await exa.monitors.create({
    name: "LLM Research Tracker",
    search: {
      query: "new large language model training techniques and architectures",
      numResults: 10,
      contents: {
        highlights: true
      }
    },
    trigger: {
      type: "interval",
      period: "7d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "LLM Research Tracker",
      "search": {
        "query": "new large language model training techniques and architectures",
        "numResults": 10,
        "contents": {
          "highlights": true
        }
      },
      "trigger": {
        "type": "interval",
        "period": "7d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<div id="test-your-monitor">
  ## Тестирование monitor
</div>

Запустите выполнение сразу, не дожидаясь следующего запланированного времени, а затем получите список запусков:

<CodeGroup>
  ```python Python theme={null}
  exa.monitors.trigger(monitor.id)

  runs = exa.monitors.runs.list(monitor.id, limit=1)
  latest = runs.data[0]
  print(latest.id, latest.status)
  ```

  ```javascript JavaScript theme={null}
  await exa.monitors.trigger(monitor.id);

  const runs = await exa.monitors.runs.list(monitor.id, { limit: 1 });
  const latest = runs.data[0];
  console.log(latest.id, latest.status);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors/$MONITOR_ID/trigger" \
    -H "Authorization: Bearer $EXA_API_KEY"

  curl -s "https://api.exa.ai/monitors/$MONITOR_ID/runs?limit=1" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

Возможные статусы запуска:

| Статус      | Значение                                                              |
| ----------- | --------------------------------------------------------------------- |
| `pending`   | Запуск поставлен в очередь                                            |
| `running`   | Запуск выполняется                                                    |
| `completed` | Запуск завершён; запросите его по ID, чтобы получить полный результат |
| `failed`    | Запуск завершился с ошибкой; причина указана в `failReason`           |
| `cancelled` | Запуск отменён                                                        |

Поле `output` имеет значение null, пока запуск не завершится.

<div id="schedule-runs">
  ## Расписание запусков
</div>

Минимальный интервал — один час. Указывайте одно значение длительности, например `1h`, `6h`, `1d` или `7d`. Расписание привязано ко времени создания monitor: ежедневный monitor, созданный в 14:30, будет запускаться примерно в 14:30 каждый день. При этом каждый запуск может задержаться до 30 минут, поэтому не рассчитывайте на точное время срабатывания.

Чтобы создать monitor только с ручным запуском, не указывайте `trigger`. Приостановка monitor с расписанием также останавливает автоматические запуски, но ручные при этом сохраняются.

<Note>
  Запуски monitor не выполняются параллельно. Если следующий запуск по расписанию начинается, когда предыдущий ещё не завершён, Exa отменяет предыдущий запуск.
</Note>

<div id="receive-webhook-updates">
  ## Получение обновлений через вебхуки
</div>

Подпишитесь на `monitor.run.completed`, если вам нужны только завершённые запуски. Если параметр `events` не указан, Exa
будет присылать также события жизненного цикла monitor и события создания запусков.

Payload завершённого запуска содержит статус запуска и его вывод. Необязательное поле `metadata` у monitor
дублируется в доставках вебхуков — это позволяет направить обновление нужному клиенту,
в нужное рабочее пространство, канал или внутреннюю задачу.

<Accordion title="Payload вебхука для завершённого запуска">
  Вывод и временные метки ниже приведены в сокращённом виде.

  ```json theme={null}
  {
    "id": "event_...",
    "object": "event",
    "type": "monitor.run.completed",
    "data": {
      "id": "01k...",
      "monitorId": "01k...",
      "status": "completed",
      "output": {
        "results": [
          {
            "title": "New battery recycling facility announced",
            "url": "https://example.com/announcement"
          }
        ],
        "content": "...",
        "grounding": [
          {
            "field": "content",
            "citations": [
              {
                "title": "New battery recycling facility announced",
                "url": "https://example.com/announcement"
              }
            ],
            "confidence": "high"
          }
        ]
      },
      "failReason": null,
      "metadata": {
        "workspace_id": "workspace_123"
      }
    },
    "createdAt": "2026-09-05T20:00:00.000Z"
  }
  ```
</Accordion>

<Warning>
  Ваш вебхук должен работать по HTTPS и быть конечным адресом назначения: перенаправления не выполняются.
  Проверяйте `Exa-Signature` перед обработкой события.
</Warning>

Каждая доставка содержит header `Exa-Signature` в формате `t=<timestamp>,v1=<signature>`.
Сформируйте строку `<timestamp>.<raw-request-body>`, вычислите её HMAC-SHA256-дайджест с одноразовым
`webhookSecret` и сравните результат с `v1`, используя сравнение с постоянным временем выполнения.

<CodeGroup>
  ```python Python theme={null}
  import hashlib
  import hmac


  def verify_webhook(payload: bytes, signature_header: str, secret: str) -> bool:
      parts = dict(part.split("=", 1) for part in signature_header.split(","))
      signed_payload = parts["t"].encode() + b"." + payload
      expected = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()
      return hmac.compare_digest(expected, parts["v1"])
  ```

  ```javascript JavaScript theme={null}
  import crypto from "crypto";

  function verifyWebhook(payload, signatureHeader, secret) {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((part) => part.split("=", 2))
    );
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.`)
      .update(payload)
      .digest("hex");
    const actualBuffer = Buffer.from(parts.v1 ?? "", "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    return (
      actualBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
  ```
</CodeGroup>

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Создание monitor" icon="bell" href="/ru/docs/reference/monitors/create-a-monitor" cta="Открыть справочник" arrow="true">
    Все поля: search, расписание, вывод, метаданные и вебхук.
  </Card>

  <Card title="Запуски monitor" icon="clock" href="/ru/docs/reference/monitors/runs/get-a-run" cta="Открыть справочник" arrow="true">
    Просмотр статуса запуска, его вывода, grounding и причины сбоя.
  </Card>

  <Card title="Руководство по search" icon="search" href="/ru/docs/search/quickstart" cta="Открыть руководство" arrow="true">
    Настройка запросов, фильтров, highlights, полного текста и свежести данных.
  </Card>

  <Card title="Лучшие практики search" icon="sparkles" href="/ru/docs/search/best-practices" cta="Читать руководство" arrow="true">
    Как повысить качество поиска, не теряя фокуса в результатах.
  </Card>
</Columns>