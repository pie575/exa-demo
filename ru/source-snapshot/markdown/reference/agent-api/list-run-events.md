> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжать изучение.

<div id="list-run-events">
  # Список событий запуска
</div>

> Получение сохранённых событий запуска Agent или их воспроизведение в виде server-sent events.

По умолчанию этот эндпоинт возвращает постраничный JSON-список сохранённых событий. Укажите `Accept: text/event-stream`, чтобы воспроизвести сохранённые события через SSE. Для постраничной навигации по JSON используйте `cursor`, для воспроизведения через SSE — `Last-Event-ID`.

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новым аккаунтам начисляются бесплатные credits.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /agent/runs/{id}/events
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
  /agent/runs/{id}/events:
    get:
      tags:
        - Agent
      summary: Список событий запуска
      description: >-
        Список сохранённых событий запуска Agent. Укажите `Accept:
        text/event-stream`, чтобы воспроизвести сохранённые события как
        server-sent events. Используйте `cursor` для постраничной навигации
        в JSON или `Last-Event-ID` для повтора SSE.
      operationId: listAgentRunEvents
      parameters:
        - in: path
          name: id
          schema:
            $ref: '#/components/schemas/AgentRunId'
            description: Идентификатор запуска Agent.
          required: true
          description: Идентификатор запуска Agent.
        - in: query
          name: limit
          schema:
            type: integer
            minimum: 1
            maximum: 100
            description: Количество результатов на странице
            default: 20
        - in: query
          name: cursor
          schema:
            type: string
            description: >-
              Курсор для постраничной навигации. Используйте значение
              `nextCursor` из предыдущего ответа со списком событий.
        - $ref: '#/components/parameters/AcceptHeader'
        - $ref: '#/components/parameters/LastEventId'
      responses:
        '200':
          description: События запуска Agent
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentRunEventList'
            text/event-stream:
              schema:
                $ref: '#/components/schemas/AgentRunEvent'
              examples:
                replay:
                  summary: Воспроизведённые события запуска
                  value: >
                    id: 2

                    event: agent_run.started

                    data: {"id":"agent_run_01j...","status":"running"}


                    id: 3

                    event: agent_run.completed

                    data:
                    {"id":"agent_run_01j...","object":"agent_run","status":"completed"}
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
          description: Не найден контекст команды или аутентификация.
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
          description: Достигнут лимит одновременных запусков Agent.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '500':
          description: Ошибка сервера или тайм-аут запуска.
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
      description: >-
        Идентификатор запуска Agent. Новые идентификаторы запусков
        возвращаются с префиксом `agent_run_`.
      example: agent_run_01j7x9v0m2n4p6q8r0s2t4v6w8
    AgentRunEventList:
      type: object
      properties:
        object:
          type: string
          const: list
        data:
          type: array
          items:
            $ref: '#/components/schemas/AgentRunEvent'
        hasMore:
          type: boolean
          description: Есть ли ещё результаты
        nextCursor:
          anyOf:
            - type: string
            - type: 'null'
      required:
        - object
        - data
        - hasMore
        - nextCursor
      additionalProperties: false
    AgentRunEvent:
      type: object
      properties:
        id:
          type: string
          description: Идентификатор события в рамках запуска.
        event:
          type: string
          enum:
            - agent_run.created
            - agent_run.started
            - agent_run.completed
            - agent_run.failed
            - agent_run.cancelled
        data:
          $ref: '#/components/schemas/JsonValue'
        createdAt:
          type: string
          format: date-time
          description: Когда событие было создано
      required:
        - id
        - event
        - data
        - createdAt
      additionalProperties: false
    AgentErrorResponse:
      type: object
      properties:
        error:
          $ref: '#/components/schemas/AgentError'
      required:
        - error
      additionalProperties: false
    JsonValue:
      description: Любое значение JSON.
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
  parameters:
    AcceptHeader:
      in: header
      name: Accept
      schema:
        description: >-
          Укажите `text/event-stream`, чтобы получать server-sent events.
        type: string
        enum:
          - application/json
          - text/event-stream
      description: >-
        Укажите `text/event-stream`, чтобы получать server-sent events.
    LastEventId:
      in: header
      name: Last-Event-ID
      schema:
        description: >-
          При повторе SSE возвращать только события после этого идентификатора
          события.
        type: string
      description: >-
        При повторе SSE возвращать только события после этого идентификатора
        события.
  headers:
    XRequestId:
      description: >-
        Уникальный идентификатор запроса. Совпадает с полем `requestId`,
        возвращаемым в телах ответов, где оно присутствует.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Передавайте ваш API-ключ Exa в заголовке x-api-key. Также можно
        аутентифицироваться с помощью Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Передавайте ваш API-ключ Exa в заголовке x-api-key. Также можно
        аутентифицироваться с помощью Authorization: Bearer <key>.
```