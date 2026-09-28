> ## Индекс документации
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="baseten">
  # Baseten
</div>

> Обеспечьте опору на источники для моделей с открытым исходным кодом в Baseten Model APIs с помощью веб-поиска Exa через Baseten Hosted Tools.

Exa — провайдер веб-поиска в [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/). Baseten Model APIs обслуживают модели с открытым исходным кодом, а Hosted Tools позволяют этим моделям искать в вебе без самостоятельной настройки цикла вызова инструментов: вы добавляете селектор инструмента Exa в обычный запрос, Baseten выполняет модель и поисковые запросы Exa вместе в серверном цикле, и вы получаете ответ с опорой на источники в том же ответе. Exa API key при этом не нужен. Baseten перевыставляет стоимость Exa в вашем счёте Baseten без наценки.

<div id="use-the-exa-web-search-tools">
  ## Использование инструментов веб-поиска Exa
</div>

Задайте header `x-baseten-server-tools: true` и добавьте один или несколько селекторов Exa в массив `tools`. Достаточно указать только `type`; Baseten автоматически разворачивает tool schema, а модель сама решает, когда искать, что именно искать и какие страницы читать. Серверные инструменты работают с эндпоинтами Baseten [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions), [Messages](https://docs.baseten.co/reference/inference-api/messages) и Responses, как в буферизованном режиме, так и в режиме потоковой передачи.

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

Доступны три инструмента Exa. Давайте модели search вместе с fetch, если она должна сначала находить источники, а затем читать выбранные страницы.

| Селектор                                | Что получает модель                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `baseten__exa__web_search_exa`          | [Exa search](/ru/docs/search/quickstart): релевантные результаты с содержимым страниц по запросу    |
| `baseten__exa__web_search_advanced_exa` | Поиск с фильтрами по доменам, обходом подстраниц и необязательным summary для каждого результата |
| `baseten__exa__web_fetch_exa`           | [Полное содержимое страницы](/ru/docs/contents/quickstart) по URL, который у модели уже есть        |

Селекторы не принимают дополнительных полей; аргументы инструмента модель заполняет сама по schema Exa. С помощью system prompt задайте политику поиска: когда искать, нужно ли обращаться к первоисточникам и как цитировать. Чтобы ограничить цикл, используйте `baseten.tool_settings`:

| Настройка                      | Для чего использовать                                                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_react_iterations`         | Ограничить число итераций модели на один запрос (по умолчанию 12, диапазон от 2 до 20). Последняя итерация зарезервирована под ответ, поэтому `N` допускает `N - 1` раундов tool calls. |
| `max_tool_calls_per_iteration` | Ограничить число вызовов серверных инструментов в одной итерации (по умолчанию 10, диапазон от 1 до 10)                                                                                 |

<div id="how-results-come-back">
  ## Как возвращаются результаты
</div>

Итоговый ответ приходит в обычном поле эндпоинта. Завершённые вызовы Exa фиксируются по-разному в зависимости от протокола: блоки `tool_use` и `tool_result` в Messages, элементы `mcp_call` в Responses и `baseten.iterations[].continuation_messages` в Chat Completions. В потоковых запросах каждый вызов поиска и его результат приходят в виде server-sent events по ходу работы цикла, так что вы можете показывать прогресс ещё до появления ответа. Массив `baseten.request.server_tool_calls[]` сообщает об итоге каждого вызова Exa в рамках запроса.

<div id="pricing">
  ## Pricing
</div>

Вызовы Exa тарифицируются на вашем аккаунте Baseten по ставкам Exa без наценки — дополнительно к стоимости токенов модели: примерно $0,007 за search и $0,001 за каждый загруженный URL. Exa сообщает стоимость каждого вызова во время выполнения, поэтому отдельные вызовы могут отличаться от этих значений. Тарифицированные tool calls отображаются в настройках рабочего пространства Baseten в разделе Billing → Usage с группировкой по провайдерам. Актуальные ставки смотрите в [таблице цен Baseten](https://docs.baseten.co/inference/model-apis/web-search#pricing).

Hosted Tools доступны на Baseten в режиме раннего доступа с лимитом 25 запросов в минуту на организацию. Попробуйте Exa search в [песочнице Baseten](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground) или свяжитесь с Baseten, чтобы повысить лимит для production-нагрузок.

<div id="resources">
  ## Ресурсы
</div>

<Columns cols={2}>
  <Card title="Документация Baseten по веб-поиску" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="Открыть документацию" arrow="true">
    Готовые к запуску примеры Messages, Responses и Chat Completions с серверными инструментами.
  </Card>

  <Card title="Справочник по серверным инструментам" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="Открыть справочник" arrow="true">
    Каталог инструментов, настройки цикла, форматы `tool_choice` и структура ответов.
  </Card>
</Columns>