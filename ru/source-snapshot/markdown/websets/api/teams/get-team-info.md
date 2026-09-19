> <div id="documentation-index">
  > ## Указатель документации
> </div>
>
> Полный указатель документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем изучать документацию дальше.

<div id="get-team-info">
  # Получение информации о команде
</div>

> Получите информацию о вашей команде, включая использование параллелизма и лимиты.

<div id="overview">
  ## Обзор
</div>

Эндпоинт Get Team Info возвращает информацию об аутентифицированной команде, в том числе текущий уровень параллелизма и заданные лимиты. Это удобно для контроля использования Websets API и понимания действующих для вас рейт-лимитов.

<div id="response">
  ## Ответ
</div>

Ответ содержит:

* **object**: всегда `"team"`
* **id**: уникальный идентификатор вашей команды
* **name**: название вашей команды
* **concurrency**: текущий параллелизм — количество активных запросов и запросов в очереди
* **limits**: лимиты параллелизма для вашей команды

<div id="concurrency-fields">
  ### Поля параллелизма
</div>

Объект `concurrency` отражает текущее состояние ваших запросов:

* **active**: количество запросов, обрабатываемых в данный момент
* **queued**: количество запросов, ожидающих обработки

<div id="limits-fields">
  ### Поля limits
</div>

Объект `limits` показывает лимиты, настроенные для вашей команды:

* **maxConcurrent**: максимальное число запросов, которые могут обрабатываться одновременно (значение null означает отсутствие ограничений)
* **maxQueued**: максимальное число запросов, которые могут находиться в очереди (значение null означает отсутствие ограничений)

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/teams/me
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
  /v0/teams/me:
    get:
      tags:
        - Teams
      summary: Get team info
      description: >-
        Returns information about the authenticated team, including current
        concurrency usage and limits.
      operationId: teams-me-get
      responses:
        '200':
          description: Team information retrieved successfully
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetsTeamInfo'
components:
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    WebsetsTeamInfo:
      type: object
      properties:
        object:
          type: string
          const: team
          description: The object type, always `"team"`.
        id:
          type: string
          description: Unique identifier for the team.
        name:
          type: string
          description: Name of the team.
        concurrency:
          type: object
          properties:
            active:
              type: integer
              description: Number of requests currently being processed.
            queued:
              type: integer
              description: Number of requests currently queued.
          required:
            - active
            - queued
          additionalProperties: false
          description: Current concurrency usage.
        limits:
          type: object
          properties:
            maxConcurrent:
              anyOf:
                - type: integer
                - type: 'null'
              description: >-
                Maximum number of concurrent requests allowed. Null means
                unlimited.
            maxQueued:
              anyOf:
                - type: integer
                - type: 'null'
              description: Maximum number of queued requests allowed. Null means unlimited.
          required:
            - maxConcurrent
            - maxQueued
          additionalProperties: false
          description: Concurrency limits for the team.
      required:
        - object
        - id
        - name
        - concurrency
        - limits
      additionalProperties: false
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