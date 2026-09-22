> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="update-api-key">
  # API 키 업데이트
</div>

> 기존 API 키의 이름과 속도 제한을 업데이트합니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Info>
  Team Management API는 team 단위로 활성화됩니다. 인증에는 서비스 계정 API 키를 사용하며, 이 키는 해당 기능이 team에 활성화된 후 [API keys 페이지](https://dashboard.exa.ai/api-keys)의 **Service keys** 탭에서 생성할 수 있습니다. 액세스 요청은 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
</Info>

<div id="overview">
  ## 개요
</div>

API 키 업데이트 엔드포인트를 사용하면 기존 API 키를 수정할 수 있습니다

<div id="path-parameters">
  ## Path Parameters
</div>

* **id**: 업데이트할 API 키의 고유 식별자입니다.

<div id="optional-parameters">
  ## 선택적 Parameters
</div>

* **name**: API 키에 사용할 새 설명 이름
* **rateLimit**: 새 속도 제한(분당 요청 수)

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml PUT /api-keys/{id}
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
    put:
      tags:
        - Team Management
      summary: Update API key
      description: >-
        Updates an existing API key's name and/or rate limit. Only API keys
        belonging to the authenticated team can be updated.
      operationId: update-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key to update.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Optional new name for the API key
                  example: Updated Production Key
                rateLimit:
                  type: integer
                  description: >-
                    Optional new rate limit for the API key (requests per
                    second)
                  example: 2000
                budgetCents:
                  type:
                    - integer
                    - 'null'
                  minimum: 0
                  description: >-
                    Optional new spending budget for the API key, in cents. Set
                    to null to remove the budget.
                  example: 5000
              additionalProperties: false
      responses:
        '200':
          description: API key updated successfully
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
                      userId:
                        type: string
                        format: uuid
                      createdAt:
                        type: string
                        format: date-time
                      updatedAt:
                        type: string
                        format: date-time
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
                      - api_key_id is required
                      - Invalid API key ID format.
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
          description: Forbidden - API key belongs to a different team
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: You do not have permission to access this API key
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
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Update API key name and rate limit
          source: >
            curl -X PUT 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "Updated Production Key",
                "rateLimit": 2000
              }'
        - lang: python
          label: Update API key name and rate limit
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            data = {
                'name': 'Updated Production Key',
                'rateLimit': 2000
            }

            response = requests.put(
                'https://admin-api.exa.ai/team-management/api-keys/{id}',
                headers=headers,
                json=data
            )

            print(response.json())
        - lang: javascript
          label: Update API key name and rate limit
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys/{id}', {
              method: 'PUT',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: 'Updated Production Key',
                rateLimit: 2000
              })
            });


            const result = await response.json();

            console.log(result);
        - lang: bash
          label: Update only the name
          source: >
            curl -X PUT 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "New Name Only"
              }'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication
```