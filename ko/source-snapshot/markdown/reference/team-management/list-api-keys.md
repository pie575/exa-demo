> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 본격적으로 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="list-api-keys">
  # API key 목록 조회
</div>

> team에 속한 모든 API key와 메타데이터를 조회합니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  대시보드에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Info>
  Team Management API는 team 단위로 활성화됩니다. 인증에는 서비스 계정 API key를 사용하며, 해당 기능이 team에 활성화되면 [API keys 페이지](https://dashboard.exa.ai/api-keys)의 **Service keys** 탭에서 key를 생성할 수 있습니다. 접근 권한이 필요하면 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
</Info>

<div id="overview">
  ## 개요
</div>

List API Keys endpoint는 team에 연결된 모든 API key를 반환합니다. 응답에는 각 key의 key ID, 이름, rate limit, 생성 timestamp가 포함됩니다.

<div id="response-format">
  ## 응답 형식
</div>

응답에는 다음 정보를 포함한 API key 객체 배열이 포함됩니다:

* **id**: API key의 고유 식별자
* **name**: 사람이 읽을 수 있는 이름(생성 시 지정한 경우)
* **rateLimit**: 분당 요청 수 기준 rate limit(설정된 경우)
* **createdAt**: key가 생성된 시점의 ISO 8601 timestamp

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys
openapi: 3.1.0
info:
  version: 1.0.0
  title: Team Management API
  description: >-
    team 내 API key를 관리하는 API입니다. team 기반 접근 제어와 함께 API key
    생성, 조회, 수정, 삭제 등의 CRUD 작업을 제공합니다. 이 API는 team 단위로
    활성화됩니다. 사용을 요청하려면 support@exa.ai로 문의하세요.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys:
    get:
      tags:
        - Team Management
      summary: API key 목록 조회
      description: >-
        인증된 team에 속한 모든 API key를 반환합니다. 각 키의 ID, 이름, rate limit이
        포함됩니다.
      operationId: list-api-keys
      parameters:
        - name: api_key_id
          in: query
          required: false
          schema:
            type: string
          description: 특정 키를 조회할 때 사용하는 선택적 API key ID입니다.
      responses:
        '200':
          description: API key 목록을 성공적으로 조회했습니다
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
                              description: rate limit(초당 요청 수)
                            budgetCents:
                              type:
                                - integer
                                - 'null'
                              description: 해당 API key의 지출 예산(센트 단위)
                            isOverBudget:
                              type: boolean
                              description: 해당 API key가 현재 예산을 초과했는지 여부
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
                            description: rate limit(초당 요청 수)
                          budgetCents:
                            type:
                              - integer
                              - 'null'
                            description: 해당 API key의 지출 예산(센트 단위)
                          isOverBudget:
                            type: boolean
                            description: 해당 API key가 현재 예산을 초과했는지 여부
                          teamId:
                            type: string
                            format: uuid
                          createdAt:
                            type: string
                            format: date-time
        '400':
          description: 잘못된 요청 - 유효하지 않은 API key ID 형식
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid API key ID format.
        '401':
          description: 인증 실패 - 서비스 키가 유효하지 않거나 누락됨
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Unauthorized
        '403':
          description: 접근 거부 - 이 API key에 접근할 권한 부족
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Insufficient permissions to access this API key
        '404':
          description: 찾을 수 없음 - API key 또는 team을 찾을 수 없음
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
          label: 모든 API key 조회
          source: |
            curl -X GET 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: 모든 API key 조회
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
          label: 모든 API key 조회
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
      description: team 인증에 사용되는 서비스 API key

```