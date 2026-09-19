> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="baseten">
  # Baseten
</div>

> Заземляйте открытые модели в Baseten Model APIs на веб-поиск Exa через Baseten Hosted Tools.

Exa — один из провайдеров веб-поиска в [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/). Baseten Model APIs дают доступ к открытым моделям, а Hosted Tools позволяют этим моделям искать в интернете без необходимости самостоятельно выстраивать цикл вызова инструментов: вы добавляете селектор инструмента Exa в обычный запрос, Baseten запускает модель и поиски Exa в едином серверном цикле, и вы получаете готовый ответ, опирающийся на найденные источники, — в рамках того же ответа. API key Exa не требуется. Baseten включает стоимость Exa в ваш счёт Baseten без наценки.

<div id="use-the-exa-web-search-tools">
  ## Используйте инструменты веб-поиска Exa
</div>

Задайте header `x-baseten-server-tools: true` и добавьте в массив `tools` один или несколько селекторов Exa. Достаточно указать только `type`: Baseten автоматически разворачивает схему инструмента, а модель сама решает, когда выполнять поиск, что искать и какие страницы читать. Серверные инструменты работают с эндпоинтами Baseten [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions), [Messages](https://docs.baseten.co/reference/inference-api/messages) и Responses — как в буферизованном, так и в потоковом режиме.

<CodeGroup>
  ```python Python theme={null}
  from openai import OpenAI

  client = OpenAI(
      api_key="<BASETEN_API_KEY>",
      base_url="https://inference.baseten.co/v1",
      default_headers={"x-baseten-server-tools": "true"},
  )

  response = client.chat.completions.create(
      model="zai-org/GLM-5.3-Fast",
      messages=[
          {"role": "user", "content": "What were the major AI announcements this week?"}
      ],
      tools=[
          {"type": "baseten__exa__web_search_exa"},
          {"type": "baseten__exa__web_fetch_exa"},
      ],
      extra_body={"baseten": {"tool_settings": {"max_react_iterations": 5}}},
  )

  print(response.choices[0].message.content)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const client = new OpenAI({
    apiKey: "<BASETEN_API_KEY>",
    baseURL: "https://inference.baseten.co/v1",
    defaultHeaders: { "x-baseten-server-tools": "true" },
  });

  const response = await client.chat.completions.create({
    model: "zai-org/GLM-5.3-Fast",
    messages: [
      { role: "user", content: "What were the major AI announcements this week?" },
    ],
    tools: [
      { type: "baseten__exa__web_search_exa" },
      { type: "baseten__exa__web_fetch_exa" },
    ],
    baseten: { tool_settings: { max_react_iterations: 5 } },
  });

  console.log(response.choices[0].message.content);
  ```

  ```bash cURL theme={null}
  curl https://inference.baseten.co/v1/chat/completions \
    -H "Authorization: Bearer <BASETEN_API_KEY>" \
    -H "Content-Type: application/json" \
    -H "x-baseten-server-tools: true" \
    -d '{
      "model": "zai-org/GLM-5.3-Fast",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [
        { "type": "baseten__exa__web_search_exa" },
        { "type": "baseten__exa__web_fetch_exa" }
      ],
      "baseten": { "tool_settings": { "max_react_iterations": 5 } }
    }'
  ```
</CodeGroup>

Доступны три инструмента Exa. Дайте модели search вместе с fetch, если она должна сначала находить источники, а затем читать выбранные ею страницы.

| Селектор                                | Что получает модель                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `baseten__exa__web_search_exa`          | [Exa search](/ru/docs/search/quickstart): релевантные результаты с содержимым страниц по запросу     |
| `baseten__exa__web_search_advanced_exa` | Search с фильтрами по доменам, обходом подстраниц и необязательным summary для каждого результата |
| `baseten__exa__web_fetch_exa`           | [Полное содержимое страницы](/ru/docs/contents/quickstart) по URL, который у модели уже есть         |

Селекторы не принимают дополнительных полей: аргументы инструмента модель заполняет сама по схеме Exa. Задавайте политику поиска через системный промпт: когда выполнять search, нужно ли загружать первоисточники и как оформлять ссылки. Ограничить цикл можно с помощью `baseten.tool_settings`:

| Настройка                      | Для чего                                                                                                                                                                                 |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_react_iterations`         | Ограничивает число итераций модели на запрос (по умолчанию 12, диапазон от 2 до 20). Последняя итерация отводится под ответ, поэтому `N` допускает `N - 1` раундов вызовов инструментов. |
| `max_tool_calls_per_iteration` | Ограничивает число серверных вызовов инструментов в одной итерации (по умолчанию 10, диапазон от 1 до 10)                                                                                |

<div id="how-results-come-back">
  ## Как возвращаются результаты
</div>

Итоговый ответ приходит в обычном поле эндпоинта. Завершённые вызовы Exa фиксируются по-разному в зависимости от протокола: блоки `tool_use` и `tool_result` в Messages, элементы `mcp_call` в Responses и `baseten.iterations[].continuation_messages` в Chat Completions. При потоковых запросах каждый вызов search и его результат приходят в виде server-sent events по ходу работы цикла, поэтому прогресс можно показывать ещё до получения ответа. Массив `baseten.request.server_tool_calls[]` содержит результат каждого вызова Exa в рамках запроса.

<div id="pricing">
  ## Тарификация
</div>

Вызовы Exa списываются с вашего аккаунта Baseten по тарифам Exa без наценки — в дополнение к стоимости токенов модели: примерно $0,007 за поиск и $0,001 за каждый загруженный URL. Exa сообщает стоимость каждого вызова во время выполнения, поэтому отдельные вызовы могут отличаться от этих значений. Оплачиваемые вызовы инструментов отображаются в настройках рабочего пространства Baseten в разделе Billing → Usage с группировкой по провайдерам. Актуальные тарифы см. в [таблице цен Baseten](https://docs.baseten.co/inference/model-apis/web-search#pricing).

Hosted Tools доступны в Baseten в режиме раннего доступа с ограничением в 25 запросов в минуту на организацию. Попробуйте поиск Exa в [песочнице Baseten](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground) или свяжитесь с Baseten, чтобы повысить лимит для продакшен-нагрузок.

<div id="resources">
  ## Ресурсы
</div>

<Columns cols={2}>
  <Card title="Документация Baseten по веб-поиску" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="Открыть документацию" arrow="true">
    Готовые к запуску примеры Messages, Responses и Chat Completions с серверными инструментами.
  </Card>

  <Card title="Справочник по серверным инструментам" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="Открыть справочник" arrow="true">
    Каталог инструментов, параметры цикла, форматы `tool_choice` и структура ответов.
  </Card>
</Columns>