> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="openai-sdk-compatibility">
  # Совместимость с OpenAI SDK
</div>

> Используйте эндпоинты Exa как прямую замену OpenAI — с поддержкой API как chat completions, так и responses.

<Card title="Быстрый старт с Coding Agent" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Впервые работаете с Exa? Начните меньше чем за минуту.
</Card>

***

<div id="overview">
  ## Обзор
</div>

Exa предоставляет совместимые с OpenAI эндпоинты, которые работают с OpenAI SDK:

| Эндпоинт            | Интерфейс OpenAI     | Доступные модели | Сценарий использования                                                |
| ------------------- | -------------------- | ---------------- | --------------------------------------------------------------------- |
| `/chat/completions` | Chat Completions API | `exa`            | Обычный чат-интерфейс                                                 |
| `/responses`        | Responses API        | `exa-agent`      | Agent API (асинхронные исследования, enrichment, составление списков) |

<Info>
  `/chat/completions` направляет запросы в [`/answer`](/ru/docs/reference/answer), а `/responses` — в [Agent API](/ru/docs/agent/quickstart). См. раздел [Agent через Responses API](#agent-via-responses-api) ниже.
</Info>

<div id="answer">
  ## Answer
</div>

Чтобы использовать эндпоинт `/answer` от Exa через интерфейс chat completions:

1. Замените базовый URL на `https://api.exa.ai`
2. Замените API key на свой Exa API key
3. Замените название модели на `exa`.

<Info>
  Полное описание эндпоинта см. в разделе [`/answer`](/ru/docs/reference/answer). По вопросам настройки маршрутизации пишите на [hello@exa.ai](mailto:hello@exa.ai).
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # использовать exa в качестве базового URL
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # использовать extra_body для передачи дополнительных параметров в эндпоинт /answer
    extra_body={
      "text": True # включить полный текст из источников
    }
  )

  print(completion.choices[0].message.content)  # вывести содержимое ответа
  print(completion.choices[0].message.citations)  # вывести ссылки на источники
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // использовать exa в качестве базового URL
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "exa",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "What are the latest developments in quantum computing?",
        },
      ],
      store: true,
      stream: true,
      extra_body: {
        text: true, // включить полный текст из источников
      },
    });

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s https://api.exa.ai/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "model": "exa",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "What are the latest developments in quantum computing?"
        }
      ],
      "text": true
    }'
  ```
</CodeGroup>

<div id="agent-via-responses-api">
  ## Agent через Responses API
</div>

Эндпоинт [`/responses`](https://api.exa.ai/responses) в Exa предоставляет доступ к [Agent API](/ru/docs/agent/quickstart) через интерфейс OpenAI Responses, поэтому SDK от OpenAI работают с ним без каких-либо изменений. Укажите `model: "exa-agent"` и выберите режим выполнения:

| Режим      | Запрос                                   | Поведение                                                                                                          |
| ---------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Синхронный | по умолчанию (без `stream`/`background`) | Запрос блокируется и возвращает завершённый объект `response`.                                                     |
| Потоковый  | `stream: true`                           | Запрос передаёт события OpenAI Responses (SSE) по мере выполнения run и завершается событием `response.completed`. |
| Background | `background: true`                       | Запрос сразу возвращает ответ со статусом `in_progress`; результат получайте опросом `GET /responses/{id}`.        |

Задайте `reasoning.effort` (`minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, `max`), чтобы выбрать баланс между стоимостью и глубиной; отменить run можно через `POST /responses/{id}/cancel`. Для `max` задайте `Exa-Beta: agent-max-effort-2026-07-27` в качестве header по умолчанию на стороне клиента. В [руководстве по Agent](/ru/docs/agent/quickstart) описаны модель выполнения run, структура вывода и тарификация по effort, лежащие в основе этого интерфейса.

<Warning>
  run с `reasoning.effort` уровня `high`, `xhigh` и `max` выполняются слишком долго для синхронного запроса и возвращают `400`. Для них используйте `stream: true` или `background: true`. В `/responses` нет поля `budget`; max использует ограничение по умолчанию на один run.
</Warning>

Чтобы продолжить завершённый run в Responses, используйте `previous_response_id`.

<div id="synchronous">
  ### Синхронный режим
</div>

Запрос блокируется до завершения run и возвращает итоговый объект `response`.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning={"effort": "medium"},
  )

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning: { effort: "medium" },
    });

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "reasoning": { "effort": "medium" }
    }'
  ```
</CodeGroup>

<div id="streaming">
  ### Потоковая передача
</div>

Укажите `stream: true`, чтобы получать события потока Responses через SSE. События содержат монотонно возрастающий `sequence_number`, а последним приходит `response.completed`; завершающего маркера `[DONE]` нет. Поток может содержать строки-комментарии `: keep-alive`, которые SSE-клиенты игнорируют.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  with client.responses.stream(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
  ) as stream:
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="", flush=True)
      final = stream.get_final_response()

  print("\n\n", final.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const stream = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -N -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "stream": true
    }'
  ```
</CodeGroup>

<div id="background">
  ### Background
</div>

Укажите `background: true`, чтобы запустить run, не удерживая соединение открытым, а затем опрашивайте `GET /responses/{id}`, пока run не перейдёт в терминальный статус. Если вместо опроса нужна потоковая передача, используйте [Потоковая передача](#streaming).

<CodeGroup>
  ```python Python theme={null}
  import os
  import time
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      background=True,
  )

  # Опрашиваем до завершения
  while response.status in ("queued", "in_progress"):
      time.sleep(5)
      response = client.responses.retrieve(response.id)

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    let response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      background: true,
    });

    // Опрашиваем до завершения
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # Создаём фоновый run
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }'

  # Опрашиваем по возвращённому идентификатору ответа
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="chat-wrapper">
  ## Обёртка для чата
</div>

Exa предоставляет Python-обёртку, которая автоматически дополняет любой chat completion от OpenAI возможностями RAG. Всего одной строкой кода вы превращаете любой chat completion OpenAI в RAG-систему на базе Exa, которая сама выполняет search, разбиение на фрагменты и формирование промптов.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # Инициализация клиентов
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # Оборачиваем клиент OpenAI
  exa_openai = exa.wrap(openai)

  # Используем точно так же, как обычный клиент OpenAI
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

Обёрнутый клиент работает точно так же, как нативный клиент OpenAI, но при необходимости автоматически дополняет ответы релевантными результатами поиска.

Обёртка поддерживает любые параметры функции `exa.search()`.

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto", "required" или "none"
    num_results=5,               # по умолчанию 3
    result_max_len=1024,         # по умолчанию 2048 символов
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```