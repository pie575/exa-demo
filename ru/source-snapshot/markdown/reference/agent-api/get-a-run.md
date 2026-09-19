> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжать изучение.

<div id="get-an-agent-run">
  # Получение запуска Agent
</div>

> Получение запуска Agent по ID.

Используйте этот эндпоинт, чтобы опрашивать запуск, пока он не перейдёт в статус `completed`, `failed` или `cancelled`.

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новым аккаунтам начисляются бесплатные кредиты.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /agent/runs/{id}
openapi: 3.1.0
info:
  title: Exa Public API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /agent/runs/{id}:
    get:
      tags:
        - Agent
      summary: Получить запуск
      description: Получение одного запуска Agent по идентификатору.
      operationId: getAgentRun
      parameters:
        - in: path
          name: id
          schema:
            $ref: '#/components/schemas/AgentRunId'
            description: Идентификатор запуска Agent.
          required: true
          description: Идентификатор запуска Agent.
      responses:
        '200':
          description: Запуск Agent
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentRun'
        '400':
          description: Некорректный запрос.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '401':
          description: Контекст команды или данные аутентификации не найдены.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '404':
          description: Запуск не найден.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '429':
          description: Достигнут предел параллелизма запусков Agent.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '500':
          description: Ошибка сервера или превышено время ожидания запуска.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
components:
  schemas:
    AgentRunId:
      type: string
      minLength: 1
      maxLength: 200
      pattern: ^[A-Za-z0-9_.:-]+$
      description: Идентификатор запуска Agent. Новые идентификаторы запусков возвращаются с префиксом `agent_run_`.
      example: agent_run_01j7x9v0m2n4p6q8r0s2t4v6w8
    AgentRun:
      type: object
      properties:
        id:
          $ref: '#/components/schemas/AgentRunId'
        object:
          type: string
          const: agent_run
        status:
          $ref: '#/components/schemas/AgentRunStatus'
        stopReason:
          anyOf:
            - $ref: '#/components/schemas/AgentStopReason'
            - type: 'null'
          description: Причина остановки запуска. `null`, пока запуск находится в очереди или выполняется.
        createdAt:
          type: string
          format: date-time
          description: Время создания запуска
        completedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          format: date-time
        request:
          anyOf:
            - $ref: '#/components/schemas/AgentRunRequest'
            - type: 'null'
        output:
          $ref: '#/components/schemas/AgentRunOutput'
        usage:
          $ref: '#/components/schemas/AgentUsage'
        costDollars:
          $ref: '#/components/schemas/AgentCostDollars'
      required:
        - id
        - object
        - status
        - stopReason
        - createdAt
        - completedAt
        - request
        - output
        - usage
        - costDollars
      additionalProperties: false
    AgentErrorResponse:
      type: object
      properties:
        error:
          $ref: '#/components/schemas/AgentError'
      required:
        - error
      additionalProperties: false
    AgentRunStatus:
      type: string
      enum:
        - queued
        - running
        - completed
        - failed
        - cancelled
    AgentStopReason:
      type: string
      enum:
        - schema_satisfied
        - budget_reached
        - stopped
        - error
        - cancelled
    AgentRunRequest:
      type: object
      properties:
        query:
          type: string
          minLength: 1
          description: Вопрос или инструкции к запросу на естественном языке.
          example: >-
            What are the most important AI infrastructure funding rounds
            announced this week?
        systemPrompt:
          type: string
          description: >-
            Дополнительные инструкции, управляющие генерируемым результатом или
            поведением агента. Используйте это поле для указания предпочтительных
            источников, требований к новизне, ограничений на дубликаты и других
            указаний по поведению.
          example: Prefer official sources and avoid duplicate results.
        effort:
          $ref: '#/components/schemas/AgentEffort'
        input:
          type: object
          properties:
            data:
              type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: Запись в виде объекта JSON.
              description: Записи, которые агент должен обработать или обогатить.
            exclusion:
              type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: Запись в виде объекта JSON.
              description: Записи или сущности, которые агент не должен возвращать.
          additionalProperties: false
        outputSchema:
          anyOf:
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
              description: >-
                JSON Schema для проверяемого структурированного результата в
                `output.structured`. Поля, не подтверждённые источниками, могут
                возвращаться как `null`. Поддерживаются версии draft-07, 2019-09
                и 2020-12 через `$schema`.
            - type: 'null'
        previousRunId:
          $ref: '#/components/schemas/AgentRunId'
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: Метаданные «ключ — значение», передаваемые вызывающей стороной для собственного учёта.
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
        dataSources:
          type: array
          items:
            $ref: '#/components/schemas/AgentDataSourceOutput'
          description: Поставщики данных Exa Connect, настроенные для запуска.
        budget:
          $ref: '#/components/schemas/AgentBudgetOutput'
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
      description: Приведённые к канонической форме поля запроса, сохранённые вместе с запуском.
    AgentRunOutput:
      type: object
      properties:
        text:
          type: string
          description: Ответ или краткое изложение на естественном языке.
        structured:
          anyOf:
            - $ref: '#/components/schemas/JsonValue'
            - type: 'null'
          description: >-
            JSON, структура которого задана полем `outputSchema`; поля, не
            подтверждённые источниками, могут быть `null`. Значение `null`, если
            схема не была указана.
        grounding:
          type: array
          items:
            $ref: '#/components/schemas/AgentGrounding'
          description: Ссылки на источники на уровне отдельных полей, сформированные запуском.
      required:
        - text
        - structured
        - grounding
      additionalProperties: false
    AgentUsage:
      type: object
      properties:
        agentComputeUnits:
          type: number
          minimum: 0
        searches:
          type: integer
          minimum: 0
        emails:
          type: integer
          minimum: 0
        phoneNumbers:
          type: integer
          minimum: 0
        dataSources:
          $ref: '#/components/schemas/AgentDataSourceUsage'
      required:
        - agentComputeUnits
        - searches
        - emails
        - phoneNumbers
      additionalProperties: false
    AgentCostDollars:
      type: object
      properties:
        total:
          type: number
          minimum: 0
        agentCompute:
          type: number
          minimum: 0
        search:
          type: number
          minimum: 0
        emails:
          type: number
          minimum: 0
        phoneNumbers:
          type: number
          minimum: 0
        dataSources:
          $ref: '#/components/schemas/AgentDataSourceCost'
      required:
        - total
        - agentCompute
        - search
        - emails
        - phoneNumbers
      additionalProperties: false
    AgentError:
      type: object
      properties:
        type:
          type: string
          enum:
            - INVALID_REQUEST
            - AUTHENTICATION_ERROR
            - RATE_LIMIT_ERROR
            - NOT_FOUND
            - SERVER_ERROR
        code:
          type: string
          enum:
            - INVALID_REQUEST
            - TEAM_NOT_FOUND
            - RUN_NOT_FOUND
            - PREVIOUS_RUN_NOT_FOUND
            - PREVIOUS_RUN_NOT_COMPLETED
            - CONCURRENCY_LIMIT_REACHED
            - INVALID_OUTPUT_SCHEMA
            - INVALID_DATA_SOURCE
            - TIMEOUT
            - SERVER_ERROR
        message:
          type: string
      required:
        - type
        - code
        - message
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
    AgentEffort:
      type: string
      enum:
        - minimal
        - low
        - medium
        - high
        - xhigh
        - auto
        - max
      description: >-
        Cost and reasoning effort preference for the run. `auto` lets Exa choose
        the appropriate effort. `max` is the highest-effort public beta tier for
        work where completeness and thoroughness matter more than latency or
        cost, including large list building, deep multi-source research, and
        criteria that are hard to verify.
      default: auto
    JsonValue:
      description: Any JSON value.
      oneOf:
        - type: 'null'
        - type: boolean
        - type: number
        - type: string
        - type: array
          items:
            $ref: '#/components/schemas/JsonValue'
        - type: object
          propertyNames:
            type: string
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
    AgentDataSourceOutput:
      type: object
      properties:
        provider:
          $ref: '#/components/schemas/AgentDataSourceProvider'
          description: >-
            Exa Connect data provider to enable for the run. All provider tools
            are available by default.
          example: fiber
      required:
        - provider
      additionalProperties: false
    AgentBudgetOutput:
      type: object
      properties:
        maxCostDollars:
          type: number
          description: >-
            Maximum amount this run can spend in US dollars. Accepts $1–$100 and
            applies only to `auto` and `max`; when omitted, the default cap is
            $5 for `auto` and $20 for `max`.
          example: 10
      additionalProperties: false
      description: >-
        Optional per-run spending limit for the metered `auto` and `max`
        efforts. Runs that finish early may cost less than the limit.
    AgentGrounding:
      type: object
      properties:
        field:
          type: string
          description: Output field the citations support.
          example: structured.companies[0].sourceUrl
        citations:
          type: array
          items:
            $ref: '#/components/schemas/AgentCitation'
        confidence:
          anyOf:
            - type: string
              enum:
                - low
                - medium
                - high
              description: Model-reported reliability for this field.
            - type: 'null'
      required:
        - field
        - citations
      additionalProperties: false
    AgentDataSourceUsage:
      type: object
      propertyNames:
        type: string
      additionalProperties:
        type: integer
        minimum: 0
      description: >-
        Per-provider tool call counts for Exa Connect data sources used during
        the run. Keys are provider names (e.g. `fiber`, `similarweb`). Only
        providers with non-zero usage are included.
    AgentDataSourceCost:
      type: object
      propertyNames:
        type: string
      additionalProperties:
        type: number
        minimum: 0
      description: >-
        Per-provider cost in dollars for Exa Connect data sources used during
        the run. Keys are provider names (e.g. `fiber`, `similarweb`). Only
        providers with non-zero usage are included.
    AgentDataSourceProvider:
      type: string
      enum:
        - fiber
        - financial_datasets
        - similarweb
        - baselayer
        - affiliate
        - particle
        - jinko
        - polymarket
      description: Identifier of an Exa Connect data provider.
    AgentCitation:
      type: object
      properties:
        url:
          type: string
          format: uri
          description: Source URL.
        title:
          type: string
          description: Source title.
      required:
        - url
      additionalProperties: false
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Pass your Exa API key in the x-api-key header. You can also authenticate
        with Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Pass your Exa API key in the x-api-key header. You can also authenticate
        with Authorization: Bearer <key>.
```