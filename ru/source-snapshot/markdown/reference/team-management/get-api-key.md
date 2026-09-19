> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем переходить к дальнейшему изучению.

<div id="get-api-key">
  # Получить API key
</div>

> Получение сведений о конкретном API key по его идентификатору.

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новым аккаунтам начисляются бесплатные credits.
</Card>

<Info>
  Team Management API включается отдельно для каждой команды. Аутентификация выполняется через API key сервисного аккаунта, который создаётся на вкладке **Service keys** на [странице API keys](https://dashboard.exa.ai/api-keys) после того, как эта возможность будет включена для вашей команды. Чтобы запросить доступ, напишите на [support@exa.ai](mailto:support@exa.ai).
</Info>

<div id="overview">
  ## Обзор
</div>

Эндпоинт Get API Key позволяет получить подробную информацию о конкретном API key по его уникальному идентификатору.

<div id="path-parameters">
  ## Параметры пути
</div>

* **id**: Уникальный идентификатор API key, который требуется получить

<div id="response">
  ## Ответ
</div>

Возвращает подробную информацию об API key, включая:

* **id**: уникальный идентификатор
* **name**: описательное имя
* **rateLimit**: лимит запросов в минуту (если задан)
* **teamId**: ID команды, которой принадлежит key
* **createdAt**: время создания key

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys/{id}
openapi: 3.1.0
info:
  version: 1.0.0
  title: Team Management API
  description: >-
    API for managing API keys within teams. Provides CRUD operations for
    creating, listing, updating, and deleting API keys with team-based access
    controls. The API is enabled per team. Contact support@exa.ai to request
    access.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys/{id}:
    get:
      tags:
        - Team Management
      summary: Get API key
      description: Retrieves details of a specific API key by its ID.
      operationId: get-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key.
      responses:
        '200':
          description: API key retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  apiKey:
                    type: object
                    properties:
                      id:
                        type: string
                        format: uuid
                      name:
                        type: string
                      rateLimit:
                        type:
                          - integer
                          - 'null'
                        description: Rate limit in requests per second
                      budgetCents:
                        type:
                          - integer
                          - 'null'
                        description: Spending budget for the API key, in cents
                      isOverBudget:
                        type: boolean
                        description: Whether the API key is currently over its budget
                      teamId:
                        type: string
                        format: uuid
                      createdAt:
                        type: string
                        format: date-time
        '400':
          description: Bad request - invalid API key ID format
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid API key ID format.
        '401':
          description: Unauthorized - Invalid or missing service key
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Unauthorized
        '404':
          description: Not found - API key does not exist
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: API key not found
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Get a specific API key
          source: >
            curl -X GET 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication

```