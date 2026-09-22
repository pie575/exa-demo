> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# API 키 목록 조회 {#list-api-keys}

> team에 속한 모든 API 키를 metadata와 함께 조회합니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Info>
  Team Management API는 team 단위로 활성화됩니다. 인증에는 서비스 계정 API 키를 사용하며, 이 키는 team에 해당 feature가 활성화된 후 [API 키 페이지](https://dashboard.exa.ai/api-keys)의 **Service keys** 탭에서 생성할 수 있습니다. 접근 권한이 필요하면 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
</Info>

## 개요 {#overview}

List API Keys 엔드포인트는 team에 연결된 모든 API 키를 반환합니다. 응답에는 각 키의 키 ID, 이름, 속도 제한, 생성 timestamp가 포함됩니다.

## Response Format {#response-format}

response에는 다음 정보가 담긴 API 키 객체의 배열이 포함됩니다:

* **id**: API 키의 고유 식별자
* **name**: 사람이 읽을 수 있는 이름(생성 시 제공한 경우)
* **rateLimit**: 분당 요청 수 기준 속도 제한(설정된 경우)
* **createdAt**: 키가 생성된 시점의 ISO 8601 timestamp

## OpenAPI {#openapi}

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