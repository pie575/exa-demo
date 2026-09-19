> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 제공되는 모든 페이지를 확인하세요.

<div id="get-api-key">
  # API key 조회
</div>

> ID로 특정 API key의 상세 정보를 조회합니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Info>
  Team Management API는 team 단위로 활성화됩니다. 인증에는 서비스 계정 API key를 사용하며, 이 key는 해당 기능이 team에 활성화된 후 [API keys 페이지](https://dashboard.exa.ai/api-keys)의 **Service keys** 탭에서 생성할 수 있습니다. 액세스를 요청하려면 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
</Info>

<div id="overview">
  ## 개요
</div>

Get API Key endpoint를 사용하면 고유 식별자로 특정 API key의 상세 정보를 조회할 수 있습니다.

<div id="path-parameters">
  ## 경로 매개변수
</div>

* **id**: 조회할 API key의 고유 식별자

<div id="response">
  ## 응답
</div>

다음을 포함한 API key 상세 정보를 반환합니다:

* **id**: 고유 식별자
* **name**: 설명용 이름
* **rateLimit**: 분당 요청 수 기준 rate limit(설정된 경우)
* **teamId**: 이 key가 속한 Team의 ID
* **createdAt**: key가 생성된 시각

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