> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение документации.

<div id="get-api-key-usage">
  # Получение данных об использовании API key
</div>

> Получение аналитики использования и данных по биллингу для конкретного API key.

<Card title="Получите свой Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Создайте key в панели управления. Новым аккаунтам начисляются бесплатные credits.
</Card>

<Info>
  Team Management API включается отдельно для каждой команды. Аутентификация выполняется с помощью API key сервисного аккаунта — его можно создать на вкладке **Service keys** на [странице API keys](https://dashboard.exa.ai/api-keys) после того, как эта функция будет включена для вашей команды. Чтобы запросить доступ, напишите на [support@exa.ai](mailto:support@exa.ai).
</Info>

<div id="overview">
  ## Обзор
</div>

Эндпоинт Get API Key Usage позволяет получить подробную аналитику по биллингу и использованию конкретного API key за заданный период. Эндпоинт возвращает данные о расходах из биллинговой системы Exa, давая достоверную картину того, за что именно выставляются счета по этому API key.

<div id="path-parameters">
  ## Параметры пути
</div>

* **id**: Уникальный идентификатор API key, по которому нужно получить данные об использовании

<div id="query-parameters">
  ## Параметры запроса
</div>

* **start&#95;date** (необязательный): начальная дата периода использования в формате ISO 8601 (например, `2025-01-01T00:00:00Z` или `2025-01-01`). По умолчанию — 30 дней назад. Должна попадать в последние 6 месяцев (180 дней).
* **end&#95;date** (необязательный): конечная дата периода использования в формате ISO 8601. По умолчанию — текущее время.
* **group&#95;by** (необязательный): временная детализация для группировки результатов (`hour`, `day` или `month`). Пока зарезервирован для будущих改 улучшений и не влияет на структуру ответа. По умолчанию — `day`.

<div id="response">
  ## Ответ
</div>

Возвращает подробную информацию об использовании и биллинге, включая:

* **id**: уникальный идентификатор API key
* **api&#95;key&#95;id**: уникальный идентификатор API key
* **api&#95;key&#95;name**: описательное имя API key (если задано)
* **team&#95;id**: идентификатор команды, которой принадлежит key
* **period**: объект с датами начала и окончания периода использования
* **total&#95;cost&#95;usd**: общая стоимость в долларах США за указанный период
* **cost&#95;breakdown**: массив разбивок стоимости по типам тарифов, каждая из которых содержит:
  * **price&#95;id**: уникальный идентификатор тарифа
  * **price&#95;name**: название тарифа (например, «Neural Search», «Content Retrieval»)
  * **quantity**: общий объём потребления
  * **amount&#95;usd**: стоимость в долларах США по данному типу тарифа
* **metadata**: объект с меткой времени формирования отчёта

<div id="important-notes">
  ## Важные замечания
</div>

* **Ограничение глубины в 6 месяцев**: биллинговая система позволяет запрашивать данные не более чем за 6 месяцев (180 дней). Запросы со значением `start_date` старше 180 дней вернут ошибку 400.
* **Нулевое потребление**: если за запрошенный период у API key не было использования, `total_cost_usd` будет равен 0, а `cost_breakdown` может оказаться пустым.
* **Принадлежность команде**: сервисный API key, используемый для аутентификации, должен принадлежать той же команде, что и запрашиваемый API key. Доступ между разными командами не допускается.
* **Форматы дат**: даты можно указывать в формате ISO 8601 — со временем или без него (например, `2025-01-01` или `2025-01-01T00:00:00Z`).

<div id="use-cases">
  ## Сценарии использования
</div>

Этот эндпоинт полезен для:

* Создания панелей биллинга на уровне отдельных API key
* Отслеживания использования и расходов по конкретным API key
* Настройки автоматических оповещений при достижении пороговых значений использования
* Формирования отчётов об использовании для внутреннего распределения затрат
* Разбора вопросов по биллингу для конкретных API key

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys/{id}/usage
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
  /api-keys/{id}/usage:
    get:
      tags:
        - Team Management
      summary: Get API key usage
      description: >-
        Retrieves usage analytics and billing data for a specific API key over a
        given time period. Returns cost breakdown by price type from the billing
        system.
      operationId: get-api-key-usage
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key.
        - name: start_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            Start date for the usage period (ISO 8601 format). Defaults to 30
            days ago. Must be within the last 6 months (180 days).
          example: '2025-01-01T00:00:00Z'
        - name: end_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            End date for the usage period (ISO 8601 format). Defaults to current
            time.
          example: '2025-01-31T23:59:59Z'
        - name: group_by
          in: query
          required: false
          schema:
            type: string
            enum:
              - hour
              - day
              - month
          description: >-
            Time granularity for grouping results. Currently reserved for future
            enhancements and does not change the response shape. Defaults to
            'day'.
          example: day
      responses:
        '200':
          description: Usage data retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: The unique identifier of the API key.
                  api_key_id:
                    type: string
                    format: uuid
                    description: The API key ID.
                  api_key_name:
                    type:
                      - string
                      - 'null'
                    description: The name of the API key
                  team_id:
                    type: string
                    format: uuid
                    description: The team ID this key belongs to
                  period:
                    type: object
                    properties:
                      start:
                        type: string
                        format: date-time
                        description: Start of the usage period
                      end:
                        type: string
                        format: date-time
                        description: End of the usage period
                  total_cost_usd:
                    type: number
                    description: Total cost in USD for the period
                    example: 45.67
                  cost_breakdown:
                    type: array
                    description: Breakdown of costs by price type
                    items:
                      type: object
                      properties:
                        price_id:
                          type: string
                          description: Unique identifier for the price
                        price_name:
                          type: string
                          description: >-
                            Name of the price (e.g., "Neural Search", "Content
                            Retrieval")
                        quantity:
                          type: number
                          description: Total quantity consumed
                        amount_usd:
                          type: number
                          description: Cost in USD for this price type
                  metadata:
                    type: object
                    properties:
                      generated_at:
                        type: string
                        format: date-time
                        description: When this report was generated
              example:
                id: key_abc123def456
                api_key_id: 550e8400-e29b-41d4-a716-446655440000
                api_key_name: Production API Key
                team_id: 660e8400-e29b-41d4-a716-446655440000
                period:
                  start: '2025-01-01T00:00:00Z'
                  end: '2025-01-31T23:59:59Z'
                total_cost_usd: 45.67
                cost_breakdown:
                  - price_id: price_neural_search
                    price_name: Neural Search
                    quantity: 1000
                    amount_usd: 30
                  - price_id: price_content_retrieval
                    price_name: Content Retrieval
                    quantity: 500
                    amount_usd: 15.67
                metadata:
                  generated_at: '2025-02-01T10:30:00Z'
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
                      - Invalid API key ID format.
                      - >-
                        Invalid date format. Use ISO 8601 format (YYYY-MM-DD or
                        YYYY-MM-DDTHH:mm:ss)
                      - start_date must be before end_date
                      - >-
                        Date range too far in the past. start_date must be
                        within the last 6 months.
                      - >-
                        Invalid group_by parameter. Must be one of: hour, day,
                        month
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
          description: Not Found - API key does not exist
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: API key not found
        '500':
          description: Internal Server Error - Failed to fetch usage data
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Failed to fetch usage data. Please try again later.
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Get usage for the last 30 days (default)
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: bash
          label: Get usage for a specific date range
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage?start_date=2025-01-01&end_date=2025-01-31'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: Get usage for a specific date range
          source: |
            import requests
            from datetime import datetime, timedelta

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY'
            }

            params = {
                'start_date': '2025-01-01T00:00:00Z',
                'end_date': '2025-01-31T23:59:59Z'
            }

            response = requests.get(
                'https://admin-api.exa.ai/team-management/api-keys/{id}/usage',
                headers=headers,
                params=params
            )

            print(response.json())
        - lang: javascript
          label: Get usage for a specific date range
          source: |
            const params = new URLSearchParams({
              start_date: '2025-01-01T00:00:00Z',
              end_date: '2025-01-31T23:59:59Z'
            });

            const response = await fetch(
              `https://admin-api.exa.ai/team-management/api-keys/{id}/usage?${params}`,
              {
                method: 'GET',
                headers: {
                  'x-api-key': 'YOUR-SERVICE-KEY'
                }
              }
            );

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