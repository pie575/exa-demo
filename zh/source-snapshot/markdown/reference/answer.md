> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

# Answer {#answer}

> 基于 Exa search 结果，获取由 LLM 生成的问题答案。`/answer` 会执行一次 Exa search，并使用 LLM 生成以下两种结果之一：

1. 针对具体问题的直接答案 (例如，“法国的首都是哪里？”会返回“巴黎”)
2. 针对开放式问题的详细总结及引用来源 (例如，“人工智能在医疗健康领域的现状如何？”会返回一份附有相关来源引用的总结)

响应中既包含生成的答案，也包含生成答案所依据的来源。该端点还支持流式传输 (设置 `stream=True`) ，会在 token 生成的同时逐步返回。

此外，你也可以使用兼容 OpenAI 的 [chat completions 接口](https://exa.ai/docs/integrations/openai-sdk#answer)。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<Info>
  `/answer` 通过 `outputSchema` 参数支持结构化输出。传入一个 [JSON Schema](https://json-schema.org/draft-07) 对象后，答案将以符合该 schema 的结构化 JSON 返回，而不是普通字符串。
</Info>

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /answer
openapi: 3.1.0
info:
  title: Exa 公共 API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /answer:
    post:
      summary: 回答
      description: >-
        根据查询执行搜索，并依据查询类型生成直接答案或带引用的详细摘要。
      operationId: answer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnswerRequest'
      responses:
        '200':
          description: OK
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
            x-exa-queued:
              $ref: '#/components/headers/XExaQueued'
            x-exa-queue-ms:
              $ref: '#/components/headers/XExaQueueMs'
          content:
            application/json:
              example:
                requestId: a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
                answer: $350 billion.
                citations:
                  - id: >-
                      https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                    url: >-
                      https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                    title: >-
                      SpaceX valued at $350bn as company agrees to buy shares
                      from ...
                    author: Dan Milmo
                    publishedDate: '2024-12-11T00:00:00.000Z'
                    text: >-
                      SpaceX valued at $350bn as company agrees to buy shares
                      from ...
                costDollars:
                  total: 0.005
              schema:
                $ref: '#/components/schemas/AnswerResponse'
            text/event-stream:
              schema:
                $ref: '#/components/schemas/AnswerStreamChunk'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '402':
          $ref: '#/components/responses/PaymentRequiredResponse'
        '429':
          $ref: '#/components/responses/TooManyRequestsResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
        '503':
          $ref: '#/components/responses/ServiceUnavailableResponse'
components:
  schemas:
    AnswerRequest:
      type: object
      properties:
        query:
          type: string
          minLength: 1
          description: 针对该请求的自然语言问题或指令。
          example: What is the latest valuation of SpaceX?
        stream:
          type: boolean
          description: >-
            如果为 true，响应将以服务器发送事件（SSE）流的形式返回。
          default: false
        text:
          type: boolean
          title: 简单文本检索
          description: >-
            如果为 true，则使用默认设置返回完整页面文本。如果为 false，则禁用文本返回。
          default: false
        model:
          description: 用于生成答案的模型。
          default: exa
          type: string
          enum:
            - exa
            - exa-pro
            - exa-research
            - exa-fast
        systemPrompt:
          type: string
          description: >-
            用于指导生成输出或智能体行为的附加指令。可用于来源偏好、新颖性约束、去重约束或其他行为指导。
          example: Prefer official sources and avoid duplicate results.
        userLocation:
          anyOf:
            - type: string
              description: 用户所在国家/地区的两位 ISO 代码，例如 US。
              example: US
            - type: 'null'
        outputSchema:
          type: object
          properties:
            type:
              type: string
              description: 根 schema 类型（通常为 "object"）。
              example: object
            properties:
              type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
              description: >-
                一个对象，其中每个键是属性名，每个值是描述该属性的 JSON Schema（包含 `type`、`description` 等）。
            required:
              type: array
              items:
                type: string
              description: 必需属性名称的列表。
            description:
              type: string
              description: 该 schema 的描述。
            additionalProperties:
              type: boolean
              description: 是否允许 `properties` 中未列出的属性。
              default: false
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
          description: >-
            用于描述所需答案结构的 [JSON Schema Draft 7](https://json-schema.org/draft-07)
            规范。提供后，答案将以符合该 schema 的结构化对象返回，而不是纯字符串。
      required:
        - query
    AnswerResponse:
      type: object
      properties:
        requestId:
          type: string
          description: 该请求的唯一标识符。
          example: b5947044c4b78efa9552a7c89b306d95
        answer:
          description: >-
            基于搜索结果生成的答案。默认返回字符串，或返回与所提供 outputSchema 匹配的结构化对象。
          example: $350 billion.
          oneOf:
            - type: string
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
        citations:
          description: 用于生成答案的搜索结果。
          type: array
          items:
            type: object
            properties:
              title:
                type: string
                description: 搜索结果的标题。
                example: >-
                  SpaceX valued at $350bn as company agrees to buy shares from
                  ...
              url:
                type: string
                description: 搜索结果的 URL。
                example: >-
                  https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                format: uri
              publishedDate:
                description: >-
                  通过解析 HTML 内容估算的创建日期。格式为 YYYY-MM-DD。
                example: '2023-11-16T01:36:32.547Z'
                format: date-time
                type: string
              author:
                description: 如果可用，则为内容的作者。
                example: Humza Naveed
                anyOf:
                  - type: string
                  - type: 'null'
              id:
                description: >-
                  文档的临时 ID。可用于 /contents 端点。
                example: https://arxiv.org/abs/2307.06435
                type: string
              image:
                description: >-
                  与搜索结果关联的图片 URL（如果可用）。
                example: https://arxiv.org/pdf/2307.06435.pdf/page_1.png
                format: uri
                type: string
              favicon:
                description: 搜索结果所属域名的 favicon URL。
                example: https://arxiv.org/favicon.ico
                format: uri
                type: string
              text:
                description: >-
                  每个来源的完整文本内容。仅在请求文本内容时出现。
                example: >-
                  SpaceX valued at $350bn as company agrees to buy shares from
                  ...
                type: string
            required:
              - title
              - url
            additionalProperties: false
        costDollars:
          $ref: '#/components/schemas/CostDollarsOutput'
      required:
        - answer
      additionalProperties: false
    AnswerStreamChunk:
      description: >-
        `/answer` 服务器发送事件流中每个 JSON 负载的 schema。每个事件以 `data: <json>` 的形式发出。
      oneOf:
        - $ref: '#/components/schemas/AnswerStreamTextDeltaChunk'
        - $ref: '#/components/schemas/AnswerStreamCitationsChunkOutput'
        - $ref: '#/components/schemas/AnswerStreamCostChunkOutput'
        - $ref: '#/components/schemas/AnswerStreamErrorChunkOutput'
    JsonValue:
      description: Any JSON value.
      oneOf:
        - type: 'null'
        - type: boolean
        - type: number
        - type: string
        - type: array
          items:
            $ref: '#/components/schemas/JsonValue'
        - type: object
          propertyNames:
            type: string
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
    CostDollarsOutput:
      type: object
      properties:
        total:
          description: >-
            Estimated total dollar cost for the completed request. This response
            value is not an invoice record.
          example: 0.007
          format: float
          type: number
        search:
          description: >-
            Endpoint-dependent estimated search cost breakdown by retrieval
            mode. Instant, fast, and auto search responses may include neural
            search cost. Deep search modes may be reflected only in total.
          type: object
          properties:
            neural:
              description: Cost of neural search operations.
              example: 0.007
              format: float
              type: number
            keyword:
              description: Cost of keyword search operations.
              example: 0.0025
              format: float
              type: number
          additionalProperties: false
        summary:
          description: Cost of synthesized summary generation for search requests.
          example: 0.005
          format: float
          type: number
        contents:
          description: >-
            Estimated cost breakdown for standalone content retrieval (text,
            highlights, and summaries billed outside the bundled search price).
          type: object
          properties:
            text:
              description: Cost of text extraction.
              example: 0.001
              format: float
              type: number
            highlights:
              description: Cost of highlight extraction.
              example: 0.001
              format: float
              type: number
            summary:
              description: Cost of per-result summary generation.
              example: 0.001
              format: float
              type: number
          additionalProperties: false
      additionalProperties: false
      description: >-
        Endpoint-dependent estimated dollar cost breakdown for the completed
        request. Billing is computed from usage counters rather than this
        response object.
    AnswerStreamTextDeltaChunk:
      type: object
      properties:
        choices:
          type: array
          items:
            type: object
            properties:
              index:
                type: integer
                minimum: 0
                description: Index of this streamed choice.
              delta:
                type: object
                properties:
                  role:
                    type: string
                    const: assistant
                  content:
                    type: string
                  refusal:
                    anyOf:
                      - type: string
                      - type: 'null'
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: Incremental answer content emitted by the model.
              finish_reason:
                description: Reason this streamed choice finished, when present.
                oneOf:
                  - type: string
                  - type: 'null'
            required:
              - index
              - delta
            additionalProperties:
              $ref: '#/components/schemas/JsonValue'
          description: >-
            OpenAI-compatible streamed completion choices with internal provider
            fields removed.
      required:
        - choices
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
    AnswerStreamCitationsChunkOutput:
      type: object
      properties:
        citations:
          type: array
          items:
            type: object
            properties:
              title:
                type: string
                description: The title of the search result.
                example: >-
                  SpaceX valued at $350bn as company agrees to buy shares from
                  ...
              url:
                type: string
                description: The URL of the search result.
                example: >-
                  https://www.theguardian.com/science/2024/dec/11/spacex-valued-at-350bn-as-company-agrees-to-buy-shares-from-employees
                format: uri
              publishedDate:
                description: >-
                  An estimate of the creation date, from parsing HTML content.
                  Format is YYYY-MM-DD.
                example: '2023-11-16T01:36:32.547Z'
                format: date-time
                type: string
              author:
                description: If available, the author of the content.
                example: Humza Naveed
                anyOf:
                  - type: string
                  - type: 'null'
              id:
                description: >-
                  The temporary ID for the document. Useful for the /contents
                  endpoint.
                example: https://arxiv.org/abs/2307.06435
                type: string
              image:
                description: >-
                  The URL of an image associated with the search result, if
                  available.
                example: https://arxiv.org/pdf/2307.06435.pdf/page_1.png
                format: uri
                type: string
              favicon:
                description: The URL of the favicon for the search result's domain.
                example: https://arxiv.org/favicon.ico
                format: uri
                type: string
              text:
                description: >-
                  The full text content of each source. Only present when text
                  contents are requested.
                example: >-
                  SpaceX valued at $350bn as company agrees to buy shares from
                  ...
                type: string
            required:
              - title
              - url
            additionalProperties: false
          description: Search results cited by the final streamed answer.
      required:
        - citations
      additionalProperties: false
    AnswerStreamCostChunkOutput:
      type: object
      properties:
        costDollars:
          $ref: '#/components/schemas/CostDollarsOutput'
        requestId:
          type: string
          description: Unique identifier for the request.
          example: b5947044c4b78efa9552a7c89b306d95
      required:
        - costDollars
      additionalProperties: false
    AnswerStreamErrorChunkOutput:
      type: object
      properties:
        tag:
          type: string
          const: ERROR
        payload:
          type: object
          properties:
            error:
              type: object
              properties:
                code:
                  type: integer
                message:
                  type: string
              required:
                - code
                - message
              additionalProperties: false
            requestId:
              type: string
              description: Unique identifier for the request.
              example: b5947044c4b78efa9552a7c89b306d95
          required:
            - error
          additionalProperties: false
      required:
        - tag
        - payload
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
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
    XExaQueued:
      description: >-
        Whether the request waited in the customer rate-limit queue before being
        admitted.
      schema:
        type: string
        enum:
          - 'true'
          - 'false'
      example: 'false'
    XExaQueueMs:
      description: Total milliseconds the request waited in the customer rate-limit queue.
      schema:
        type: string
      example: '0'
  responses:
    BadRequestResponse:
      description: The request body or query parameters failed validation.
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
      description: The API key is missing or invalid.
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
    PaymentRequiredResponse:
      description: The team is out of credits or a spending budget has been exceeded.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 1c3e5a7b9d0f2a4c6e8b0d2f4a6c8e0b
            error: >-
              You have exceeded your credits limit. Please top up to keep using
              Exa at dashboard.exa.ai
            tag: NO_MORE_CREDITS
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    TooManyRequestsResponse:
      description: A rate limit for this API key, team, or network was exceeded.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 7f9b1d3e5a0c2e4b6d8f0a2c4e6b8d0f
            error: >-
              You've exceeded the Exa rate limit for your network. If you
              believe this is in error, please email hello@exa.ai :)
            tag: RATE_LIMIT_EXCEEDED
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerErrorResponse:
      description: An unexpected error occurred while processing the request.
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
    ServiceUnavailableResponse:
      description: >-
        Exa is temporarily over capacity or unavailable. The request was not
        processed; retry with exponential backoff.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: b3d5f7a9c1e0a2c4e6b8d0f2a4c6e8b1
            error: >-
              Exa is temporarily over capacity. Please retry with exponential
              backoff.
            tag: SERVICE_OVERLOADED
          schema:
            $ref: '#/components/schemas/ErrorResponse'
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