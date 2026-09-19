> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы найти все доступные страницы, прежде чем продолжить изучение.

<div id="create-api-key">
  # Создание API key
</div>

> Создайте новый API key для своей команды, при желании указав имя и настройки лимита запросов.

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новым аккаунтам начисляются бесплатные credits.
</Card>

<Info>
  Team Management API включается отдельно для каждой команды. Аутентификация выполняется с помощью API key сервисного аккаунта — он создаётся на вкладке **Service keys** на [странице API keys](https://dashboard.exa.ai/api-keys) после того, как эта возможность будет включена для вашей команды. Чтобы запросить доступ, напишите на [support@exa.ai](mailto:support@exa.ai).
</Info>

Эндпоинт Create API Key позволяет программно создавать новые API keys для своей команды, используя сервисный API key.

<div id="optional-parameters">
  ## Необязательные параметры
</div>

* **name**: понятное имя для API key, помогающее определить его назначение
* **rateLimit**: максимальное количество запросов в минуту, разрешённое для этого API key

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml POST /api-keys
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
    post:
      tags:
        - Team Management
      summary: Create API key
      description: >-
        Creates a new API key for the authenticated team. Optionally specify a
        name, rate limit, and budget for the API key.
      operationId: create-api-key
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Optional name for the API key
                  example: Production API Key
                rateLimit:
                  type: integer
                  description: Optional rate limit for the API key (requests per second)
                  example: 1000
                budgetCents:
                  type:
                    - integer
                    - 'null'
                  minimum: 0
                  description: >-
                    Optional spending budget for the API key, in cents. Set to
                    null to remove the budget.
                  example: 5000
              additionalProperties: false
      responses:
        '200':
          description: API key created successfully
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
                        description: Unique identifier for the API key
                      name:
                        type: string
                        description: Name of the API key
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
                        description: Team ID this key belongs to
                      userId:
                        type: string
                        format: uuid
                        description: User ID who created this key
                      createdAt:
                        type: string
                        format: date-time
                        description: When the key was created
        '400':
          description: Bad Request - Invalid parameters
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    examples:
                      - No user found for team
                      - Rate limit cannot exceed team's limit of 500 QPS
                      - >-
                        Unexpected parameters: invalidParam. Allowed: name,
                        rateLimit, budgetCents.
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
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Create API key with name and rate limit
          source: |
            curl -X POST 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "Production API Key",
                "rateLimit": 1000
              }'
        - lang: python
          label: Create API key with name and rate limit
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            data = {
                'name': 'Production API Key',
                'rateLimit': 1000
            }

            response = requests.post(
                'https://admin-api.exa.ai/team-management/api-keys',
                headers=headers,
                json=data
            )

            print(response.json())
        - lang: javascript
          label: Create API key with name and rate limit
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys', {
              method: 'POST',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: 'Production API Key',
                rateLimit: 1000
              })
            });


            const result = await response.json();

            console.log(result);
        - lang: bash
          label: Create API key without optional parameters
          source: |
            curl -X POST 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{}'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication
```