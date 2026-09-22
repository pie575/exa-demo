> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="get-a-batch">
  # batch 조회
</div>

> ID로 batch를 조회합니다.

이 엔드포인트로 batch가 `completed`, `cancelled`, `expired` 상태가 될 때까지 폴링하세요. batch가 완료되면 `resultsUrl`에 JSONL 결과 파일의 presigned URL이 담기며, 이 URL은 유효 기간이 짧습니다. 새 URL이 필요하면 batch를 다시 조회하세요.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits가 제공됩니다.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /batches/{id}
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
  /batches/{id}:
    get:
      tags:
        - Batches
      summary: 배치 조회
      description: ID로 단일 배치를 조회합니다.
      operationId: getBatch
      parameters:
        - in: path
          name: id
          schema:
            type: string
            minLength: 1
            description: 배치 ID.
            example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
          required: true
          description: 배치 ID.
        - $ref: '#/components/parameters/BatchesBetaHeader'
      responses:
        '200':
          description: OK
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              example:
                id: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
                object: batch
                status: completed
                requestCounts:
                  total: 2
                  completed: 2
                  failed: 0
                createdAt: '2026-06-06T12:00:00.000Z'
                expiresAt: '2026-06-13T12:00:00.000Z'
                endedAt: '2026-06-06T12:01:30.000Z'
                resultsUrl: >-
                  https://exa-batch-results.s3.us-east-1.amazonaws.com/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/results.jsonl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=EXAMPLESIGNATURE
                metadata:
                  project: weekly-digest
              schema:
                $ref: '#/components/schemas/Batch'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '404':
          $ref: '#/components/responses/NotFoundResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
components:
  parameters:
    BatchesBetaHeader:
      in: header
      name: Exa-Beta
      schema:
        type: string
        enum:
          - batches-2026-06-06
        description: Batch API에 필요한 베타 토큰입니다.
      required: true
      description: Batch API에 필요한 베타 토큰입니다.
  headers:
    XRequestId:
      description: >-
        요청의 고유 식별자입니다. 해당 값을 포함하는 응답 본문에서 반환되는 `requestId`
        필드와 일치합니다.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    Batch:
      type: object
      properties:
        id:
          type: string
          description: 배치 ID. 새 배치 ID는 `batch_` 접두사와 함께 반환됩니다.
          example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
        object:
          type: string
          const: batch
          description: 객체 유형이며, 항상 `batch`입니다.
        status:
          $ref: '#/components/schemas/BatchStatus'
        requestCounts:
          $ref: '#/components/schemas/BatchRequestCounts'
        createdAt:
          type: string
          format: date-time
          description: 배치가 생성된 시점입니다.
        expiresAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: 배치가 만료되는 시점이며, 만료되지 않는 경우 `null`입니다.
          format: date-time
        endedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: >-
            배치가 종료 상태에 도달한 시점이며, 아직 실행 중인 경우 `null`입니다.
          format: date-time
        resultsUrl:
          anyOf:
            - type: string
            - type: 'null'
          description: >-
            배치 결과 파일(JSONL)에 대한 단기 사전 서명된 다운로드 URL이며, 배치가
            완료될 때까지는 `null`입니다. 이는 API 경로가 아닌 오브젝트 스토어
            직접 다운로드 링크입니다. 그대로 요청하고, 만료되면 배치를 다시 조회하여
            새 URL을 발급받으세요.
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: 자체 추적을 위해 호출자가 제공하는 키-값 메타데이터입니다.
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
      required:
        - id
        - object
        - status
        - requestCounts
        - createdAt
        - expiresAt
        - endedAt
        - resultsUrl
        - metadata
      additionalProperties: false
    BatchStatus:
      type: string
      enum:
        - in_progress
        - completed
        - cancelling
        - cancelled
        - expired
      description: 배치의 수명 주기 상태입니다.
    BatchRequestCounts:
      type: object
      properties:
        total:
          type: integer
          minimum: 0
          description: 배치의 전체 요청 수입니다.
        completed:
          type: integer
          minimum: 0
          description: 성공적으로 완료된 요청 수입니다.
        failed:
          type: integer
          minimum: 0
          description: 실패한 요청 수입니다.
      required:
        - total
        - completed
        - failed
      additionalProperties: false
    ErrorResponse:
      type: object
      properties:
        requestId:
          type: string
          description: 요청의 고유 식별자입니다.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: 오류를 설명하는 사람이 읽을 수 있는 메시지입니다.
          example: 유효하지 않은 API 키
        tag:
          type: string
          description: >-
            실패를 식별하는 기계 판독 가능한 오류 태그입니다. 태그 집합은
            개방형입니다. 새로운 태그가 언제든 추가될 수 있으므로, 인식할 수 없는
            태그는 해당 응답의 HTTP 상태에 대한 일반 오류로 처리하세요.
            알려진 태그는 예시로 나열되어 있습니다.
          examples:
            - DEFAULT_ERROR
            - INTERNAL_ERROR
            - INVALID_API_KEY
            - INVALID_REQUEST
            - INVALID_REQUEST_BODY
            - INVALID_REQUEST_QUERY
            - INVALID_JSON_SCHEMA
            - INVALID_NUM_RESULTS
            - NUM_RESULTS_EXCEEDED
            - NO_MORE_CREDITS
            - API_KEY_BUDGET_EXCEEDED
            - TEAM_BUDGET_EXCEEDED
            - NO_CONTENT_FOUND
            - PROHIBITED_CONTENT
            - INSUFFICIENT_SCOPE
            - UNABLE_TO_GENERATE_RESPONSE
            - UNSUPPORTED_PUBLICATION_INCLUDE_FILTER
            - SUBPAGES_LIMIT_EXCEEDED
            - FEATURE_DISABLED
            - INVALID_URLS
            - FETCH_DOCUMENT_ERROR
            - TEAM_BLOCKED
            - NOT_FOUND
            - RATE_LIMIT_EXCEEDED
            - SNAPSHOT_RATE_LIMIT_EXCEEDED
            - SNAPSHOT_NOT_ON_PLAN
            - SNAPSHOT_NOT_IN_CONTRACT
            - SNAPSHOT_TRIAL_EXHAUSTED
            - SNAPSHOT_TRIAL_CAP_EXCEEDED
      required:
        - requestId
        - error
        - tag
      additionalProperties: false
      description: 실패한 요청에 대해 Exa API가 반환하는 표준 오류 엔벨로프입니다.
  responses:
    BadRequestResponse:
      description: 요청 본문 또는 쿼리 매개변수의 유효성 검사에 실패했습니다.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 0a1b2c3d4e5f60718293a4b5c6d7e8f9
            error: >-
              유효하지 않은 요청 본문: query: 유효하지 않은 입력: 문자열이 필요하지만
              undefined를 받았습니다
            tag: INVALID_REQUEST_BODY
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    UnauthorizedResponse:
      description: API 키가 없거나 유효하지 않습니다.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2
            error: 유효하지 않은 API 키
            tag: INVALID_API_KEY
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    NotFoundResponse:
      description: 요청한 리소스가 존재하지 않습니다.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 3b1d5f7a9c0e2b4d6f8a0c2e4b6d8f0a
            error: 찾을 수 없음
            tag: NOT_FOUND
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerErrorResponse:
      description: 요청을 처리하는 중 예기치 않은 오류가 발생했습니다.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 9b1d3f5e7a0c2e4b6d8f0a2c4e6b8d0f
            error: >-
              죄송합니다. 요청을 처리하는 중 오류가 발생했습니다.
              나중에 다시 시도해 주세요
            tag: DEFAULT_ERROR
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>를 사용하여
        인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>를 사용하여
        인증할 수도 있습니다.
```