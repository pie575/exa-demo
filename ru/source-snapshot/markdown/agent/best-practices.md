> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

<div id="agent-best-practices">
  # Лучшие практики работы с Agent
</div>

> Настройте качество запросов, структурированный вывод, уровень усилий и стоимость для продакшен-интеграций Exa Agent.

Используйте это руководство после [быстрого старта Exa Agent](/ru/docs/agent/quickstart), чтобы повысить качество запросов, структурировать вывод и контролировать время выполнения и стоимость. Полные примеры запросов смотрите в разделе [Примеры Agent](/ru/docs/agent/examples).

<div id="core-principles">
  ## Основные принципы
</div>

Относитесь к `query` как к запросу. Опишите, что должен найти Agent, каковы границы работы, какие нужны подтверждения и как выглядит полный результат.

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

Без `outputSchema` Agent возвращает связный текст в `output.text` и ссылки на источники в `output.grounding`. Добавляйте очередное поле только тогда, когда у него есть понятная роль:

| Поле                    | Когда использовать                                                           |
| ----------------------- | ---------------------------------------------------------------------------- |
| `outputSchema`          | Последующему коду нужны структурированные поля                               |
| `input.data`            | У вас уже есть строки для обогащения                                         |
| `input.exclusion`       | Известные записи не должны попадать в результат                              |
| `dataSources`           | Поле должно приходить от partner [Exa Connect](/ru/docs/agent/connect/overview) |
| `previousRunId`         | Запрос продолжает завершённый запуск                                         |
| `effort`                | Нужно явно задать стоимость или глубину исследования                         |
| `budget.maxCostDollars` | Запуску с `auto` или `max` нужен жёсткий лимит стоимости                     |

Задавайте строки, исключения и структуру ответа в отведённых для этого полях, а не внутри `query`.

<div id="writing-list-building-and-enrichment-queries">
  ## Составление запросов для построения списков и Enrichment
</div>

Для построения списков определите сущность, целевое количество, критерии отбора, исключения и требуемый уровень доказательности. Для Enrichment поместите существующие записи в `input.data` и опишите только те данные, которые Agent должен найти и добавить.

Запрашивайте обоснование, если отбор требует оценочного суждения. Приводите примеры только в тех случаях, когда критерий допускает несколько правдоподобных толкований.

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

См. [Find all GTM members](/ru/docs/agent/examples#find-all-code) — пример запроса на поиск, и [Enrich input rows](/ru/docs/agent/examples#enrich-input-rows-code) — соответствующий шаблон Enrichment строк.

<div id="handle-asynchronous-runs">
  ## Обработка асинхронных запусков
</div>

Запуски Agent могут занимать от нескольких секунд до нескольких минут — всё это время идёт поиск, чтение и анализ. Стройте логику вокруг жизненного цикла запуска, а не удерживайте открытым запрос приложения.

<Steps>
  <Step title="Создайте и сохраните">
    Создайте запуск и сохраните возвращённый `id` вместе с метаданными запроса. Ответ на создание — это ещё не итоговый результат.
  </Step>

  <Step title="Дождитесь конечного состояния">
    Используйте вспомогательный метод опроса в SDK, опрашивайте `GET /agent/runs/{id}` или читайте поток SSE. Продолжайте, пока запуск находится в состоянии `queued` или `running`.
  </Step>

  <Step title="Сохраните результат">
    Прекратите ожидание при `completed`, `failed` или `cancelled`, затем сохраните итоговый ответ и grounding.
  </Step>
</Steps>

Сохранённый идентификатор запуска позволяет приложению восстановиться после перезапуска, переподключиться к потоку и разобраться в причинах сбоев. Снижайте задержку: сужайте scope, ограничивайте число результатов, держите схему компактной и выбирайте `minimal` или `low`, когда скорость важнее полноты.

Для пакетной обработки прогоните показательные задачи на бенчмарке, прежде чем оценивать параллелизм или встраивать Agent в синхронный сценарий интерфейса. Время выполнения зависит от количества элементов, сложности схемы, доступности источников и уровня усилий.

Командам с Zero Data Retention следует читать живой поток или опрашивать состояние в пределах окна хранения. `previousRunId` и `dataSources` в Connect недоступны. См. [Zero Data Retention](/ru/docs/admin/security/zero-data-retention).

<div id="write-custom-json-schemas-for-structured-output">
  ## Пишите собственные JSON-схемы для структурированного вывода
</div>

Используйте `outputSchema`, когда коду на следующем шаге нужны машиночитаемые поля, нормализованные значения, строки таблиц или записи enrichment. Если достаточно ответа обычным текстом, не указывайте его и читайте `output.text`; структурированный вывод требует дополнительной работы по форматированию и может увеличить задержку.

Инструкции по исследованию держите в `query`, а форму ответа — в `outputSchema`. Используйте понятные имена свойств и описания, выбирайте самые узкие из подходящих типов и ограничивайте массивы через `maxItems`.

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

Соответствие схеме проверяет форму, а не факты. Agent может вернуть `null`, если данные не подтверждают поле, — даже если в переданной схеме оно помечено как обязательное или не допускающее null. `stopReason: schema_satisfied` означает, что Agent считает ожидаемую форму заполненной с учётом этих null; это не гарантирует строгой валидации по переданной схеме.

Не дублируйте в своей схеме встроенные цитаты Exa или показатели уверенности. Добавляйте поле с обоснованием только тогда, когда каждый item должен пояснять, почему он подходит, и сохраняйте `output.grounding` вместе со структурированным результатом. Проверяйте важные утверждения по источникам и тестируйте изменения схемы на характерных входных данных до выпуска.

Изучите [примеры структурированного вывода Agent](/ru/docs/agent/examples), чтобы сравнить схемы для построения списков, KYB, вакансий, исключений и продолженных запусков.

<div id="agent-vs-search">
  ## Agent или Search
</div>

| Задача                                                                   | С чего начать                           |
| ------------------------------------------------------------------------ | --------------------------------------- |
| Веб-результаты для вашей LLM                                             | [Search](/ru/docs/search/quickstart)       |
| Быстрое исследование и синтез                                            | [Deep Search](/ru/docs/search/deep-search) |
| Асинхронное построение списков, многошаговое исследование или Enrichment | [Agent](/ru/docs/agent/quickstart)         |

Используйте Agent, если задача требует нескольких шагов поиска данных, проверки по каждой сущности или Enrichment для уже известных записей. Используйте Search, если нужно быстро получить страницы, а остальные рассуждения выполнит ваше приложение.

<div id="tips-for-common-use-cases">
  ## Советы для распространённых сценариев
</div>

| Если нужно                                         | Используйте                                                 | Избегайте                                                                      |
| -------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Собранный список заранее неизвестного размера      | `auto` и ограниченный `outputSchema`                        | Фиксированный низкий уровень усилий и неограниченный массив                    |
| Enrichment уже имеющихся записей                   | `input.data` и перечень добавляемых полей                   | Вставку таблицы в `query`                                                      |
| Уточняющий запрос по последнему набору результатов | `previousRunId`                                             | Повторную отправку всего предыдущего результата                                |
| Записи, которые не должны появиться снова          | `input.exclusion` и последующую дедупликацию                | Восприятие исключений как строгой гарантии уникальности                        |
| Данные премиум-провайдеров                         | [Exa Connect](/ru/docs/agent/connect/overview) с `dataSources` | Просьбу к Agent вывести поля, доступные только у провайдера, из открытого веба |
| Предсказуемую стоимость запроса                    | Фиксированный `effort`                                      | `auto` или `max` без бюджета                                                   |
| Полноту важнее задержки и стоимости                | `xhigh` или `max`                                           | Повышение усилий до того, как уточнён запрос                                   |

<div id="next-steps">
  ## Дальнейшие шаги
</div>

<Columns cols={2}>
  <Card title="Быстрый старт с Agent" icon="bot" href="/ru/docs/agent/quickstart" cta="Открыть руководство" arrow="true">
    Создайте запуск, получайте события потоком, задайте уровень усилий и считывайте структурированный вывод.
  </Card>

  <Card title="Примеры Agent" icon="layers" href="/ru/docs/agent/examples" cta="Посмотреть примеры" arrow="true">
    Готовые запросы для построения списков, Enrichment, KYB, исключений и уточняющих запросов.
  </Card>

  <Card title="Exa Connect" icon="database" href="/ru/docs/agent/connect/overview" cta="Посмотреть партнёров по данным" arrow="true">
    Добавьте премиальные данные о компаниях, людях, трафике, комплаенсе, финансах и другие источники.
  </Card>

  <Card title="Лучшие практики Search" icon="sparkles" href="/ru/docs/search/best-practices" cta="Читать руководство" arrow="true">
    Качество поиска, задержка и синтез ответа, когда достаточно Search.
  </Card>
</Columns>