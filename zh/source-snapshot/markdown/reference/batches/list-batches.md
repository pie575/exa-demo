> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅前，可通过该文件了解所有可用页面。

# 列出批次 {#list-batches}

> 获取团队批次的分页列表。

批次按从新到旧的顺序返回。使用 `limit` 控制每页大小，并将上一次响应中的 `nextCursor` 传给 `cursor` 以获取下一页。传入 `status=completed` 可仅列出已完成的批次；已完成列表使用独立的 cursor，因此每一页请求都需要带上 `status=completed`。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

## OpenAPI {#openapi}

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
      summary: 列出批次
      description: 列出你所在团队的批次，按从新到旧排序。
      operationId: listBatches
      parameters:
        - in: query
          name: cursor
          schema:
            type: string
            description: 上一次响应返回的分页 cursor
        - in: query
          name: limit
          schema:
            type: integer
            minimum: 1
            description: >-
              每页返回的批次数量上限。省略时默认为 100；无上限限制。
            default: 100
        - in: query
          name: status
          schema:
            type: string
            const: completed
            description: >-
              只列出已完成的批次。`completed` 是唯一支持的值，传入其他值会返回
              400。已完成批次的列表按过期时间排序，并使用独立的 cursor，因此在每个使用
              cursor 分页的请求中都需持续发送 `status=completed`。
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
        description: 使用 Batch API 所需的 beta token。
      required: true
      description: 使用 Batch API 所需的 beta token。
  headers:
    XRequestId:
      description: >-
        请求的唯一标识符。与响应体中返回的 `requestId` field（若存在）一致。
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
          description: 对象类型，始终为 `list`。
        data:
          type: array
          items:
            $ref: '#/components/schemas/Batch'
          description: 当前页的批次，最新的排在前面。
        hasMore:
          type: boolean
          description: 是否还有更多结果
        nextCursor:
          anyOf:
            - type: string
            - type: 'null'
          description: 下一页的 cursor
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
          description: 批次 ID。新的批次 ID 返回时会带有 `batch_` 前缀。
          example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
        object:
          type: string
          const: batch
          description: 对象类型，始终为 `batch`。
        status:
          $ref: '#/components/schemas/BatchStatus'
        requestCounts:
          $ref: '#/components/schemas/BatchRequestCounts'
        createdAt:
          type: string
          format: date-time
          description: 批次的创建时间。
        expiresAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: 批次的过期时间；若不会过期则为 `null`。
          format: date-time
        endedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: >-
            批次进入终态的时间；若仍在运行中则为 `null`。
          format: date-time
        resultsUrl:
          anyOf:
            - type: string
            - type: 'null'
          description: >-
            批次结果文件（JSONL）的短期预签名下载 URL；批次完成前为 `null`。这是
            直接指向对象存储的下载链接，而非 API 路由；请按原样使用，过期后重新获取
            该批次以 mint 一个新的 URL。
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: 由调用方提供的键值对元数据，供你自行追踪使用。
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
          description: 请求的唯一标识符。
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: 描述该错误的可读信息。
          example: Invalid API key
        tag:
          type: string
          description: >-
            标识该失败的机器可读错误 tag。tag 集合是开放的：随时可能新增 tag，因此
            请将无法识别的 tag 视为该响应 HTTP 状态对应的通用错误。已知 tag 见示例。
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
      description: 请求失败时 Exa API 返回的标准错误结构。
    BatchStatus:
      type: string
      enum:
        - in_progress
        - completed
        - cancelling
        - cancelled
        - expired
      description: 批次的生命周期状态。
    BatchRequestCounts:
      type: object
      properties:
        total:
          type: integer
          minimum: 0
          description: 批次中的请求总数。
        completed:
          type: integer
          minimum: 0
          description: 已成功完成的请求。
        failed:
          type: integer
          minimum: 0
          description: 已失败的请求。
      required:
        - total
        - completed
        - failed
      additionalProperties: false
  responses:
    BadRequestResponse:
      description: 请求体或查询参数未通过校验。
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
      description: API 密钥缺失或无效。
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
      description: 处理请求时发生意外错误。
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
        在 x-api-key header 中传入你的 Exa API 密钥。你也可以使用
        Authorization: Bearer <key> 进行认证。
    bearer:
      type: http
      scheme: bearer
      description: >-
        在 x-api-key header 中传入你的 Exa API 密钥。你也可以使用
        Authorization: Bearer <key> 进行认证。
```