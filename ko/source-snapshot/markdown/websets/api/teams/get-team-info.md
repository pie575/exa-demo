> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="get-team-info">
  # team 정보 가져오기
</div>

> concurrency 사용량 및 limits를 포함한 team 정보를 조회합니다.

<div id="overview">
  ## 개요
</div>

Get Team Info endpoint는 인증된 team의 정보를 반환하며, 여기에는 해당 team의 현재 concurrency usage와 설정된 limits가 포함됩니다. Websets API usage를 모니터링하고 rate limits를 파악하는 데 유용합니다.

<div id="response">
  ## 응답
</div>

응답에는 다음이 포함됩니다:

* **object**: 항상 &quot;team&quot;
* **id**: Team의 고유 식별자
* **name**: Team 이름
* **concurrency**: 활성 요청 수와 대기 중인 요청 수를 나타내는 현재 usage
* **limits**: Team의 concurrency limits

<div id="concurrency-fields">
  ### concurrency 필드
</div>

`concurrency` 객체는 현재 요청 상태를 나타냅니다:

* **active**: 현재 처리 중인 요청 수
* **queued**: 처리를 대기 중인 요청 수

<div id="limits-fields">
  ### Limits 필드
</div>

`limits` 객체는 team에 설정된 limits를 나타냅니다:

* **maxConcurrent**: 동시에 처리할 수 있는 최대 요청 수 (null이면 무제한)
* **maxQueued**: 큐에서 대기할 수 있는 최대 요청 수 (null이면 무제한)

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