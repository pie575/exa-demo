> ## Индекс документации
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем изучать документацию дальше.

<div id="agent-best-practices">
  # Лучшие практики работы с Agent
</div>

> Настройте качество запросов, структурированный вывод, effort и стоимость для production-интеграций Exa Agent.

Используйте это руководство после [Quickstart по Exa Agent](/ru/docs/agent/quickstart), чтобы повысить качество запросов, структурировать вывод и контролировать время выполнения и стоимость. Готовые примеры запросов смотрите в разделе [Примеры Agent](/ru/docs/agent/examples).

<div id="core-principles">
  ## Основные принципы
</div>

Рассматривайте `query` как описание задачи. Укажите, что именно должен найти Agent, границы работы, какие данные требуются и как выглядит готовый результат.

<CodeGroup>
  ```python Python theme={null}
  run = exa.agent.runs.create(
      query="Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources.",
  )
  ```

  ```javascript JavaScript theme={null}
  const run = await exa.agent.runs.create({
    query:
      "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
    }'
  ```
</CodeGroup>

Без `outputSchema` Agent возвращает текст в `output.text` и citations в `output.grounding`. Добавляйте другие поля только тогда, когда у них есть чёткое назначение:

| Поле                    | Когда использовать                                                            |
| ----------------------- | ----------------------------------------------------------------------------- |
| `outputSchema`          | Последующему коду нужны структурированные поля                                |
| `input.data`            | У вас уже есть строки для обогащения                                          |
| `input.exclusion`       | Известные записи не должны возвращаться                                       |
| `dataSources`           | Поле должно поступать от партнёра [Exa Connect](/ru/docs/agent/connect/overview) |
| `previousRunId`         | Запрос продолжает завершённое выполнение                                      |
| `effort`                | Нужно явно задать стоимость или глубину исследования                          |
| `budget.maxCostDollars` | Выполнению с `auto` или `max` нужен жёсткий потолок стоимости                 |

Строки, исключения и форму ответа задавайте в предназначенных для них полях, а не внутри `query`.

<div id="writing-list-building-and-enrichment-queries">
  ## Составление запросов для построения списков и enrichment
</div>

Для построения списков определите сущность, целевое количество, criteria отбора, exclusions и требуемый уровень подтверждающих данных. Для enrichment поместите имеющиеся записи в `input.data` и опишите только то, что Agent должен найти дополнительно.

Запрашивайте обоснование, если отбор требует субъективной оценки. Приводите примеры только тогда, когда критерий допускает несколько правдоподобных трактовок.

<CodeGroup>
  ```text Query theme={null}
  Find up to 20 current engineering leaders at US-based AI infrastructure companies
  that announced a Series A or B between March 1 and August 31, 2026.

  Include CTOs, VPs of Engineering, and Heads of Engineering. Exclude founders without
  an operating engineering role and anyone whose current employment cannot be verified.
  For each person, return their name, current title, company, company website, funding
  announcement date, and a short explanation of why they qualify. Verify employment on
  the company website or another current source, and verify funding from the company
  announcement or a reputable business publication.
  ```
</CodeGroup>

Пример поискового запроса смотрите в разделе [Find all GTM members](/ru/docs/agent/examples#find-all-code), а соответствующий шаблон enrichment строк — в разделе [Enrich input rows](/ru/docs/agent/examples#enrich-input-rows-code).

<div id="handle-asynchronous-runs">
  ## Обработка асинхронных запусков
</div>

Запуски Agent могут занимать от нескольких секунд до нескольких минут, пока идут поиск, чтение и рассуждение. Стройте логику вокруг жизненного цикла, а не удерживайте открытым запрос приложения.

<Steps>
  <Step title="Создайте и сохраните">
    Создайте запуск и сохраните возвращённый `id` вместе с metadata вашего запроса. Ответ на создание не является финальным результатом.
  </Step>

  <Step title="Дождитесь терминального состояния">
    Используйте вспомогательный механизм поллинга из SDK, опрашивайте `GET /agent/runs/{id}` или читайте поток SSE. Продолжайте, пока запуск находится в состоянии `queued` или `running`.
  </Step>

  <Step title="Сохраните результат">
    Прекратите ожидание при `completed`, `failed` или `cancelled`, затем сохраните итоговый ответ и grounding.
  </Step>
</Steps>

Сохранение ID запуска позволяет приложению восстановиться после перезапуска, переподключиться к потоку и разобраться в сбоях. Снижайте задержку: сужайте scope, ограничивайте количество результатов, делайте схему компактнее и выбирайте `minimal` или `low`, когда скорость важнее полноты.

Для пакетов протестируйте показательные задачи, прежде чем оценивать параллелизм или встраивать Agent в синхронный путь интерфейса. Время выполнения зависит от количества items, сложности схемы, доступности sources и effort.

Для команд с нулевым хранением данных читайте живой поток или выполняйте поллинг в пределах окна хранения. `previousRunId` и `dataSources` в Connect недоступны. См. [Нулевое хранение данных](/ru/docs/admin/security/zero-data-retention).

<div id="write-custom-json-schemas-for-structured-output">
  ## Пишите собственные JSON-схемы для структурированного вывода
</div>

Используйте `outputSchema`, когда вызывающему коду нужны машиночитаемые поля, нормализованные значения, строки таблицы или enrichment-записи. Если достаточно ответа обычным текстом, не указывайте схему и читайте `output.text`; структурированный вывод требует дополнительной работы с форматированием и может увеличить задержку.

Инструкции по исследованию держите в `query`, а форму ответа — в `outputSchema`. Используйте понятные имена свойств и описания, выбирайте максимально узкие из подходящих типов и ограничивайте массивы через `maxItems`.

<CodeGroup>
  ```json Output schema expandable theme={null}
  {
    "type": "object",
    "properties": {
      "people": {
        "type": "array",
        "maxItems": 10,
        "description": "Current engineering leaders who satisfy every criterion in the query.",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The person's full name."
            },
            "job_title": {
              "type": "string",
              "description": "Their current title at the qualifying company."
            },
            "company": {
              "type": "string",
              "description": "The qualifying company's canonical name."
            },
            "qualification_rationale": {
              "type": "string",
              "description": "A concise explanation of how the person satisfies the query criteria."
            }
          },
          "required": ["name", "job_title", "company", "qualification_rationale"]
        }
      }
    },
    "required": ["people"]
  }
  ```
</CodeGroup>

Соответствие схеме проверяет форму, а не факты. Agent может вернуть `null`, если данные не подтверждают поле, даже если в переданной схеме оно помечено как обязательное или не допускающее null. `stopReason: schema_satisfied` означает, что Agent считает ожидаемую форму заполненной с учётом таких null; это не гарантирует строгой валидации по переданной схеме.

Не дублируйте в своей схеме встроенные citations или показатели уверенности Exa. Добавляйте поле с обоснованием только в том случае, если каждый item должен объяснять, почему он подходит, и сохраняйте `output.grounding` вместе со структурированным результатом. Проверяйте важные утверждения по их sources и тестируйте изменения схемы на характерных входных данных до выпуска.

Посмотрите [структурированные примеры Agent](/ru/docs/agent/examples), чтобы сравнить схемы для построения списков, KYB, вакансий, exclusions и продолженных запусков.

<div id="agent-vs-search">
  ## Agent или Search
</div>

| Задача                                                                   | С чего начать                           |
| ------------------------------------------------------------------------ | --------------------------------------- |
| Веб-результаты для вашего LLM                                            | [Search](/ru/docs/search/quickstart)       |
| Быстрое исследование и синтез                                            | [Deep Search](/ru/docs/search/deep-search) |
| Асинхронное построение списков, многошаговое исследование или enrichment | [Agent](/ru/docs/agent/quickstart)         |

Используйте Agent, если задача требует нескольких шагов поиска, верификации каждой сущности или enrichment для уже известных записей. Используйте Search, если вам нужно быстро получить страницы, а всю дальнейшую логику возьмёт на себя ваше приложение.

<div id="tips-for-common-use-cases">
  ## Советы для распространённых сценариев
</div>

| Если вам нужно                             | Используйте                                                 | Избегайте                                                                      |
| ------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Проработанный список неизвестного размера  | `auto` и ограниченный `outputSchema`                        | Фиксированный низкий effort и массив без ограничений                           |
| Enrichment уже имеющихся записей           | `input.data` и поля, которые нужно добавить                 | Вставку таблицы в `query`                                                      |
| Follow-up по последнему набору результатов | `previousRunId`                                             | Повторную отправку всего предыдущего вывода                                    |
| Записи, которые не должны появиться снова  | `input.exclusion` и последующую дедупликацию                | Восприятие exclusions как строгой гарантии идентичности                        |
| Данные премиального провайдера             | [Exa Connect](/ru/docs/agent/connect/overview) с `dataSources` | Просьбу к Agent вывести поля, доступные только у провайдера, из открытого веба |
| Предсказуемую стоимость запроса            | Фиксированный `effort`                                      | `auto` или `max` без бюджета                                                   |
| Полноту важнее задержки и стоимости        | `xhigh` или `max`                                           | Повышение effort до уточнения запроса                                          |

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Быстрый старт с Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создайте выполнение, получайте события потоком, задайте effort и читайте структурированный вывод.
  </Card>

  <Card title="Примеры Agent" icon="layers" href="/ru/docs/agent/examples" cta="Смотреть примеры" arrow="true">
    Готовые запросы для построения списков, enrichment, KYB, исключений и уточняющих запросов.
  </Card>

  <Card title="Exa Connect" icon="database" href="/ru/docs/agent/connect/overview" cta="Смотреть партнёров данных" arrow="true">
    Добавьте премиальные данные о компаниях, людях, трафике, комплаенсе, финансах и другие данные провайдеров.
  </Card>

  <Card title="Лучшие практики Search" icon="sparkles" href="/ru/docs/search/best-practices" cta="Читать руководство" arrow="true">
    Качество поиска, задержка и синтез в случаях, когда достаточно Search.
  </Card>
</Columns>