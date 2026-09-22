> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="list-batches">
  # Batch 목록 조회
</div>

> team의 batch 목록을 페이지 단위로 조회합니다.

Batch는 최신순으로 반환됩니다. `limit`으로 페이지 크기를 조절하고, 이전 response의 `nextCursor` 값을 `cursor`에 전달해 다음 페이지를 가져오세요. `status=completed`를 전달하면 완료된 batch만 조회됩니다. 완료된 batch 목록은 별도의 cursor를 사용하므로, 페이지를 요청할 때마다 `status=completed`를 계속 함께 보내야 합니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /batches
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
  /batches:
    get:
      tags:
        - Batches
      summary: List batches
      description: List batches for your team, ordered from newest to oldest.
      operationId: listBatches
      parameters:
        - in: query
          name: cursor
          schema:
            type: string
            description: Pagination cursor from a previous response
        - in: query
          name: limit
          schema:
            type: integer
            minimum: 1
            description: >-
              Maximum number of batches to return per page. Defaults to 100 when
              omitted; there is no upper bound.
            default: 100
        - in: query
          name: status
          schema:
            type: string
            const: completed
            description: >-
              Filter the listing to completed batches. `completed` is the only
              supported value; any other value returns a 400. Completed listings
              are ordered by expiry and use a distinct cursor, so keep sending
              `status=completed` on every cursor-paginated request.
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
                object: list
                data:
                  - id: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
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
                hasMore: false
                nextCursor: null
              schema:
                $ref: '#/components/schemas/BatchList'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
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
        description: Required beta token for the Batch API.
      required: true
      description: Required beta token for the Batch API.
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    BatchList:
      type: object
      properties:
        object:
          type: string
          const: list
          description: The object type, always `list`.
        data:
          type: array
          items:
            $ref: '#/components/schemas/Batch'
          description: The page of batches, newest first.
        hasMore:
          type: boolean
          description: Whether there are more results
        nextCursor:
          anyOf:
            - type: string
            - type: 'null'
          description: Cursor for the next page
      required:
        - object
        - data
        - hasMore
        - nextCursor
      additionalProperties: false
    Batch:
      type: object
      properties:
        id:
          type: string
          description: Batch ID. New batch IDs are returned with the `batch_` prefix.
          example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
        object:
          type: string
          const: batch
          description: The object type, always `batch`.
        status:
          $ref: '#/components/schemas/BatchStatus'
        requestCounts:
          $ref: '#/components/schemas/BatchRequestCounts'
        createdAt:
          type: string
          format: date-time
          description: When the batch was created.
        expiresAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: When the batch expires, or `null` if it does not expire.
          format: date-time
        endedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: >-
            When the batch reached a terminal status, or `null` while it is
            still running.
          format: date-time
        resultsUrl:
          anyOf:
            - type: string
            - type: 'null'
          description: >-
            Short-lived presigned download URL for the batch results file
            (JSONL), or `null` until the batch completes. This is a direct
            object-store download link, not an API route; fetch it as-is and
            re-fetch the batch to mint a fresh URL once it expires.
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: Caller-provided key-value metadata for your own tracking.
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
    ErrorResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Unique identifier for the request.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: Human-readable message describing the error.
          example: Invalid API key
        tag:
          type: string
          description: >-
            Machine-readable error tag identifying the failure. The set of tags
            is open-ended: new tags may be added at any time, so treat
            unrecognized tags as a generic error of the response's HTTP status.
            Known tags are listed as examples.
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
      description: Standard error envelope returned by the Exa API for failed requests.
    BatchStatus:
      type: string
      enum:
        - in_progress
        - completed
        - cancelling
        - cancelled
        - expired
      description: Lifecycle status of the batch.
    BatchRequestCounts:
      type: object
      properties:
        total:
          type: integer
          minimum: 0
          description: Total requests in the batch.
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
  responses:
    BadRequestResponse:
      description: 요청 body 또는 query parameters가 유효성 검사를 통과하지 못했습니다.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 0a1b2c3d4e5f60718293a4b5c6d7e8f9
            error: >-
              Invalid request body: query: Invalid input: expected string,
              received undefined
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
            error: Invalid API key
            tag: INVALID_API_KEY
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
              Sorry, we encountered an error while processing your request.
              Please try again later
            tag: DEFAULT_ERROR
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key>로
        인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key>로
        인증할 수도 있습니다.
```