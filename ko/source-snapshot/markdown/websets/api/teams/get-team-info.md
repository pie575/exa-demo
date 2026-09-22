> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일에서 사용 가능한 모든 페이지를 확인하세요.

# team 정보 조회 {#get-team-info}

> concurrency 사용량과 limits를 포함한 team 정보를 조회합니다.

## 개요 {#overview}

Get Team Info 엔드포인트는 인증된 team의 현재 concurrency 사용량과 설정된 limits를 비롯해 해당 team에 대한 정보를 반환합니다. Websets API 사용량을 모니터링하고 속도 제한을 파악하는 데 유용합니다.

## Response {#response}

response에는 다음 항목이 포함됩니다:

* **object**: 항상 &quot;team&quot;
* **id**: team의 고유 식별자
* **name**: team 이름
* **concurrency**: 활성 요청과 대기 중인 요청을 나타내는 현재 사용량
* **limits**: team의 concurrency limits

### Concurrency Fields {#concurrency-fields}

`concurrency` 객체는 현재 요청 상태를 나타냅니다:

* **active**: 현재 처리 중인 요청 수
* **queued**: 처리를 대기 중인 요청 수

### Limits Fields {#limits-fields}

`limits` 객체는 team에 설정된 limits를 보여줍니다:

* **maxConcurrent**: 동시에 처리할 수 있는 최대 요청 수 (null이면 무제한)
* **maxQueued**: 큐에서 대기할 수 있는 최대 요청 수 (null이면 무제한)

## OpenAPI {#openapi}

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