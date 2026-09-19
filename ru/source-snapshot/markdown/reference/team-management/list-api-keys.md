> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем переходить к дальнейшему изучению.

<div id="list-api-keys">
  # Список API-ключей
</div>

> Получите все API-ключи вашей команды вместе с их метаданными.

<Card title="Получите свой API-ключ Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте ключ в дашборде. Новым аккаунтам начисляются бесплатные кредиты.
</Card>

<Info>
  Team Management API включается отдельно для каждой команды. Аутентификация выполняется с помощью API-ключа сервисного аккаунта, который создаётся на вкладке **Service keys** на [странице API-ключей](https://dashboard.exa.ai/api-keys) после того, как эта функция будет включена для вашей команды. Чтобы запросить доступ, напишите на [support@exa.ai](mailto:support@exa.ai).
</Info>

<div id="overview">
  ## Обзор
</div>

Эндпоинт List API Keys возвращает все API-ключи, связанные с вашей командой. Для каждого ключа возвращаются его идентификатор, название, лимит запросов и время создания.

<div id="response-format">
  ## Формат ответа
</div>

Ответ содержит массив объектов API-ключ со следующей информацией:

* **id**: уникальный идентификатор API-ключ
* **name**: понятное человеку название (если указано при создании)
* **rateLimit**: лимит запросов в минуту (если задан)
* **createdAt**: время создания key в формате ISO 8601

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys
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
  /api-keys:
    get:
      tags:
        - Team Management
      summary: List API keys
      description: >-
        Returns all API keys belonging to the authenticated team. Includes ID,
        name, and rate limit for each key.
      operationId: list-api-keys
      parameters:
        - name: api_key_id
          in: query
          required: false
          schema:
            type: string
          description: Optional API key ID to retrieve a specific key.
      responses:
        '200':
          description: List of API keys retrieved successfully
          content:
            application/json:
              schema:
                oneOf:
                  - type: object
                    properties:
                      apiKeys:
                        type: array
                        items:
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
                  - type: object
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
        '403':
          description: Forbidden - insufficient permissions to access this API key
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Insufficient permissions to access this API key
        '404':
          description: Not found - API key or team not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    examples:
                      - API key not found
                      - Team not found
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: List all API keys
          source: |
            curl -X GET 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: List all API keys
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY'
            }

            response = requests.get(
                'https://admin-api.exa.ai/team-management/api-keys',
                headers=headers
            )

            print(response.json())
        - lang: javascript
          label: List all API keys
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys', {
              method: 'GET',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY'
              }
            });


            const result = await response.json();

            console.log(result);
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication

```