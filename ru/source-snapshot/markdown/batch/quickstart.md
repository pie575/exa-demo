> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем продолжить изучение.

<div id="batch-api">
  # Batch API
</div>

> Асинхронное выполнение запросов к Exa API пакетами.

<Info>
  Batch API доступен корпоративным клиентам после того, как Exa включит его для вашей команды. Напишите на [sales@exa.ai](mailto:sales@exa.ai), чтобы обсудить корпоративный доступ и подключение.
</Info>

Batch API позволяет отправить сразу множество запросов к Exa API и позднее получить их результаты в виде файла JSONL. Вместо того чтобы отправлять тысячи отдельных запросов и самостоятельно управлять лимитами и повторными попытками, вы отправляете один пакет, отслеживаете его статус и скачиваете все результаты одним файлом.

Используйте его для офлайн-enrichment, дозаполнения данных и любых других задач, которым не нужен мгновенный ответ. Полные схемы запросов и ответов приведены в [справочнике API](/ru/docs/reference/batches/create-a-batch).

<Note>
  Batch API находится в стадии бета-тестирования. Добавляйте header `Exa-Beta: batches-2026-06-06` в каждый запрос.
</Note>

<div id="supported-requests">
  ## Поддерживаемые запросы
</div>

Каждый элемент пакета должен быть `POST`-запросом к одному из следующих маршрутов:

| Маршрут       | Сценарий использования                     |
| ------------- | ------------------------------------------ |
| `/search`     | Асинхронное выполнение запросов Exa Search |
| `/agent/runs` | Асинхронное выполнение запросов Exa Agent  |

Каждому элементу требуется уникальный в рамках пакета `customId`. Этот же `customId` возвращается в файле результатов, что позволяет сопоставить строки вывода с исходными данными.

<div id="create-a-batch">
  ## Создание пакета
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/batches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "customId": "row-1",
          "method": "POST",
          "url": "/search",
          "body": {
            "query": "Latest AI infrastructure funding rounds"
          }
        },
        {
          "customId": "row-2",
          "method": "POST",
          "url": "/agent/runs",
          "body": {
            "query": "Summarize recent vector database launches"
          }
        }
      ],
      "metadata": {
        "project": "weekly-digest"
      }
    }'
  ```
</CodeGroup>

В ответе возвращаются идентификатор пакета и его начальный статус:

<Accordion title="Пример ответа">
  ```json theme={null}
  {
    "id": "batch_01j7x9v0m2n4p6q8r0s2t4v6w8",
    "object": "batch",
    "status": "in_progress",
    "requestCounts": {
      "total": 2,
      "completed": 0,
      "failed": 0
    },
    "createdAt": "2026-06-06T12:00:00.000Z",
    "expiresAt": null,
    "endedAt": null,
    "resultsUrl": null,
    "metadata": {
      "project": "weekly-digest"
    }
  }
  ```
</Accordion>

<div id="check-status">
  ## Проверка статуса
</div>

Опрашивайте пакет, пока он не перейдёт в один из конечных статусов:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

Возможные статусы пакета:

| Статус        | Значение                                     |
| ------------- | -------------------------------------------- |
| `in_progress` | Пакет выполняется                            |
| `completed`   | Все запросы завершены, результаты доступны   |
| `cancelling`  | Запрошена отмена, текущие задачи завершаются |
| `cancelled`   | Пакет отменён                                |
| `expired`     | Результаты больше недоступны                 |

После завершения пакета в `resultsUrl` возвращается ссылка для скачивания файла результатов в формате JSONL, а в `expiresAt` — момент окончания периода хранения результатов.

<Warning>
  `resultsUrl` — это предподписанная ссылка с коротким сроком действия. Каждый раз, когда нужно снова скачать результаты, запрашивайте пакет повторно, чтобы получить новую ссылку.
</Warning>

<div id="list-batches">
  ## Список пакетов
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

Ответ разбивается на страницы с помощью cursor: в `data` возвращается до `limit` пакетов, а если `hasMore` равно `true`, передайте `nextCursor` в параметре запроса `cursor`, чтобы получить следующую страницу.

Передайте `status=completed`, чтобы вывести только завершённые пакеты:

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

`completed` — единственное поддерживаемое значение; любое другое приводит к ошибке. Завершённые пакеты сортируются по сроку истечения и используют собственный cursor, поэтому передавайте `status=completed` при запросе каждой страницы — cursor для завершённых и cursor для нефильтрованного списка не взаимозаменяемы.

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

<div id="download-results">
  ## Скачивание результатов
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

Каждая строка JSONL содержит исходный `customId` и либо `response`, либо `error`:

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

<div id="cancel-a-batch">
  ## Отмена пакета
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="delete-a-batch">
  ## Удаление пакета
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="access">
  ## Доступ
</div>

Чтобы подключить Batch API для вашей команды, напишите на [sales@exa.ai](mailto:sales@exa.ai).