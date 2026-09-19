> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="get-a-monitor">
  # 获取 monitor
</div>

> 根据 ID 检索单个 monitor。

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /monitors/{id}
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
  /monitors/{id}:
    get:
      tags:
        - Monitors
      summary: 获取单个 monitor
      description: 根据 ID 获取单个 monitor。
      operationId: getMonitor
      parameters:
        - in: path
          name: id
          schema:
            type: string
            description: monitor 的 ID
          required: true
          description: monitor 的 ID
      responses:
        '200':
          description: 该 monitor
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SearchMonitor'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '404':
          $ref: '#/components/responses/NotFoundResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
components:
  headers:
    XRequestId:
      description: >-
        请求的唯一标识符。与响应体中返回的 `requestId` 字段一致（如果响应体包含该字段）。
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    SearchMonitor:
      type: object
      properties:
        id:
          type: string
          description: monitor 的唯一标识符
        name:
          anyOf:
            - type: string
            - type: 'null'
          description: 可选的显示名称
        status:
          type: string
          enum:
            - active
            - paused
            - disabled
          description: >-
            monitor 的状态。`active` 的 monitor 会按计划运行，也可手动触发；`paused` 的 monitor
            只能手动触发；`disabled` 表示 monitor 在连续 10 次认证失败后被自动禁用。
        search:
          $ref: '#/components/schemas/SearchMonitorSearchOutput'
        trigger:
          anyOf:
            - $ref: '#/components/schemas/SearchMonitorTriggerOutput'
            - type: 'null'
          description: >-
            自动运行的间隔计划。若未设置计划，则为 null。
        outputSchema:
          $ref: '#/components/schemas/SearchMonitorOutputSchemaOutput'
        metadata:
          anyOf:
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                type: string
              description: 由调用方提供的键值元数据，供你自行追踪使用。
              example:
                slack_channel_id: C123ABC
                slack_thread_id: '1745444400.123456'
                user_id: U123ABC
            - type: 'null'
          description: >-
            可选的键值元数据，供你自行追踪使用。会在 webhook 投递中原样回传，便于你将更新路由到 Slack 等系统。
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
        webhook:
          $ref: '#/components/schemas/SearchMonitorWebhookOutput'
        nextRunAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: 下一次计划运行的时间。若未设置触发器，则为 null。
          format: date-time
        createdAt:
          type: string
          format: date-time
          description: monitor 的创建时间
        updatedAt:
          type: string
          format: date-time
          description: monitor 的最后更新时间
      required:
        - id
        - name
        - status
        - search
        - trigger
        - outputSchema
        - metadata
        - webhook
        - nextRunAt
        - createdAt
        - updatedAt
      additionalProperties: false
    SearchMonitorSearchOutput:
      type: object
      properties:
        query:
          type: string
          minLength: 1
          description: search 使用的查询字符串。
          example: Latest developments in LLM capabilities
        numResults:
          type: integer
          minimum: 1
          maximum: 100
          description: >-
            返回的结果数量。限制因 search 类型而异，公开的最大限制为 100 条结果。如需更高限制，请联系销售
            (hello@exa.ai) 洽谈。
          example: 10
          default: 10
        includeDomains:
          description: 将 search 结果限定在这些域名内。
          type: array
          items:
            type: string
        excludeDomains:
          description: 从 search 结果中排除这些域名。
          type: array
          items:
            type: string
        contents:
          $ref: '#/components/schemas/SearchMonitorContentsOutput'
      required:
        - query
      additionalProperties: false
    SearchMonitorTriggerOutput:
      type: object
      properties:
        type:
          type: string
          const: interval
          description: 触发器类型。目前仅支持 `interval`。
          default: interval
        period:
          type: string
          description: >-
            指定 monitor 运行频率的时长字符串（例如 "1h"、"6h"、"1d"、"7d"）。仅支持单一单位，最小间隔为 1
            小时。计划以 monitor 的创建时间为基准（例如，在下午 2:30 创建的每日 monitor 每天约在下午 2:30 运行）。
          example: 6h
      required:
        - type
        - period
      additionalProperties: false
    SearchMonitorOutputSchemaOutput:
      anyOf:
        - oneOf:
            - $ref: '#/components/schemas/OutputSchemaTextOutput'
            - $ref: '#/components/schemas/OutputSchemaObject'
          description: >-
            用于合成输出的 JSON schema。支持的根类型为 "text" 和 "object"。提供后，响应中会包含一个内容符合该
            schema 的 output 对象。适用于所有 search 类型，并在所选 search 类型的基础上增加约 2 秒的合成延迟。
          type: object
          discriminator:
            propertyName: type
            mapping:
              text:
                $ref: '#/components/schemas/OutputSchemaTextOutput'
              object:
                $ref: '#/components/schemas/OutputSchemaObject'
        - type: 'null'
      description: >-
        控制运行输出的格式。未指定时默认为 `{ "type": "text" }`。当 `type` 为 `"text"`
        时，输出为纯文本 summary；当 `type` 为 `"object"` 时，输出为结构化 JSON。若使用 `"object"`
        类型但未指定 `properties`，则会自动推断 schema；否则输出将遵循所提供的 schema。
    SearchMonitorWebhookOutput:
      type: object
      properties:
        url:
          type: string
          format: uri
          description: >-
            用于接收 webhook 事件的 HTTPS URL。不得指向 localhost 或私有 IP 段。
        events:
          type: array
          items:
            type: string
            enum:
              - monitor.created
              - monitor.updated
              - monitor.deleted
              - monitor.run.created
              - monitor.run.completed
          description: >-
            要订阅的事件。未指定时默认订阅所有事件。
      required:
        - url
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
            标识该故障的机器可读错误标签。标签集合是开放的：随时可能新增标签，因此请将无法识别的标签视为该响应 HTTP
            状态对应的通用错误。已知标签在示例中列出。
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
    SearchMonitorContentsOutput:
      type: object
      properties:
        text:
          description: Text extraction options for each result.
          oneOf:
            - type: boolean
              title: Simple text retrieval
              description: >-
                If true, returns full page text with default settings. If false,
                disables text return.
              default: false
            - type: object
              properties:
                maxCharacters:
                  anyOf:
                    - type: integer
                      minimum: 1
                      maximum: 10000
                      description: >-
                        Maximum character limit for the full page text. Useful
                        for controlling response size and API costs. Maximum
                        supported value is 10000.
                      example: 1000
                    - type: 'null'
                includeHtmlTags:
                  anyOf:
                    - type: boolean
                      description: >-
                        If true, include lightweight HTML tags in returned text
                        instead of plain markdown-style text. Use maxAgeHours: 0
                        when you need this applied to freshly fetched content.
                      example: false
                      default: false
                    - type: 'null'
                verbosity:
                  anyOf:
                    - type: string
                      enum:
                        - compact
                        - standard
                        - full
                      description: >-
                        Controls text rendering verbosity. compact focuses on
                        main content, standard includes more surrounding page
                        context, and full requests the most complete rendered
                        text. Some pages may produce identical standard and full
                        output. Use maxAgeHours: 0 when you need this applied to
                        freshly fetched content.
                      example: standard
                      default: compact
                    - type: 'null'
                includeSections:
                  anyOf:
                    - type: array
                      items:
                        type: string
                        enum:
                          - header
                          - navigation
                          - banner
                          - body
                          - sidebar
                          - footer
                          - metadata
                      description: >-
                        Best-effort. Only include content classified into these
                        semantic page sections. Section classification may be
                        unavailable or incomplete for some pages; validate
                        output if strict filtering is required. Use maxAgeHours:
                        0 when you need this applied to freshly fetched content.
                      example:
                        - body
                        - header
                    - type: 'null'
                excludeSections:
                  anyOf:
                    - type: array
                      items:
                        type: string
                        enum:
                          - header
                          - navigation
                          - banner
                          - body
                          - sidebar
                          - footer
                          - metadata
                      description: >-
                        Exclude content classified into these semantic page
                        sections. Section classification is best-effort. Use
                        maxAgeHours: 0 when you need this applied to freshly
                        fetched content.
                      example:
                        - navigation
                        - footer
                        - sidebar
                    - type: 'null'
              additionalProperties: false
              title: Advanced text options
              description: >-
                Advanced options for controlling text extraction. Use this when
                you need to limit text length or include HTML structure.
        highlights:
          description: Text snippets the LLM identifies as most relevant from each page.
          oneOf:
            - type: boolean
              title: Simple highlights retrieval
              description: >-
                If true, returns highlights with default settings. If false,
                disables highlights.
              default: false
            - type: object
              properties:
                query:
                  anyOf:
                    - type: string
                      description: Custom query that guides which highlights the LLM picks.
                      example: Key advancements
                    - type: 'null'
                verbosity:
                  anyOf:
                    - type: string
                      enum:
                        - low
                        - medium
                        - high
                      description: >-
                        Preset highlight length: `low`, `medium`, and `high`
                        allocate progressively larger token budgets for the
                        returned highlights. With highlights.dynamic, the preset
                        sets a single shared budget across the whole result set
                        instead of a per-URL budget. Exact budgets are tuned by
                        Exa and may change. Not compatible with maxCharacters or
                        numSentences. Beta: requires the `Exa-Beta:
                        dynamic-highlights-2026-08-28` request header; requests
                        setting `verbosity` without it are rejected.
                      example: medium
                      x-exa-lifecycle: beta
                      x-exa-beta-flag: dynamic-highlights-2026-08-28
                      x-mint:
                        post:
                          - Beta
                    - type: 'null'
                dynamic:
                  anyOf:
                    - type: boolean
                      description: >-
                        Enable Dynamic Highlights (research preview): considers
                        all results together and allocates a single shared
                        context budget across the result set instead of a
                        per-document budget. Not compatible with maxCharacters.
                        Beta: requires the `Exa-Beta:
                        dynamic-highlights-2026-08-28` request header; requests
                        setting `dynamic` without it are rejected.
                      example: true
                      x-exa-lifecycle: beta
                      x-exa-beta-flag: dynamic-highlights-2026-08-28
                      x-mint:
                        post:
                          - Beta
                    - type: 'null'
                maxCharacters:
                  anyOf:
                    - type: integer
                      minimum: 1
                      maximum: 10000
                      description: >-
                        Maximum number of characters to return for highlights.
                        Controls the total length of highlight text returned per
                        URL. Maximum supported value is 10000. Not compatible
                        with highlights.dynamic.
                      example: 2000
                    - type: 'null'
                numSentences:
                  anyOf:
                    - type: integer
                      minimum: 1
                      description: >-
                        Deprecated and will be removed in a future release.
                        Currently mapped to a character budget of about 1333
                        characters per sentence. Pass highlights: true for
                        default highlights, or { query } to guide selection with
                        your own query.
                      example: 1
                      deprecated: true
                    - type: 'null'
                highlightsPerUrl:
                  anyOf:
                    - type: integer
                      minimum: 1
                      description: >-
                        Deprecated and will be removed in a future release.
                        Currently ignored. Pass highlights: true for default
                        highlights, or { query } to guide selection with your
                        own query.
                      example: 1
                      deprecated: true
                    - type: 'null'
              additionalProperties: false
              title: Advanced highlights options
              description: >-
                Advanced options for steering highlight extraction. Pass
                highlights: true for the highest-quality default; supply this
                object only when you need to guide selection with your own
                query.
        summary:
          description: >-
            Return an LLM-generated summary. Pass `true` for defaults, or an
            object with `query` and `maxTokens`.
          oneOf:
            - type: boolean
            - $ref: '#/components/schemas/SummaryWithMaxTokensOptionsOutput'
        extras:
          type: object
          properties:
            links:
              anyOf:
                - type: integer
                  minimum: 0
                  maximum: 1000
                  description: Number of URLs to return from each webpage.
                  example: 1
                  default: 0
                - type: 'null'
            imageLinks:
              anyOf:
                - type: integer
                  minimum: 0
                  maximum: 1000
                  description: Number of images to return for each result.
                  example: 1
                  default: 0
                - type: 'null'
            richImageLinks:
              anyOf:
                - type: integer
                  minimum: 0
                  maximum: 1000
                  description: Number of rich image links to return for each result.
                  default: 0
                - type: 'null'
            richLinks:
              anyOf:
                - type: integer
                  minimum: 0
                  maximum: 1000
                  description: Number of rich links to return for each result.
                  default: 0
                - type: 'null'
            codeBlocks:
              anyOf:
                - type: integer
                  minimum: 0
                  maximum: 1000
                  description: Number of code blocks to return for each result.
                  default: 0
                - type: 'null'
          additionalProperties: false
          description: Extra parameters to pass.
        context:
          description: >-
            Deprecated: Use highlights or text instead. Returns page contents as
            a combined context string.
          deprecated: true
          oneOf:
            - type: boolean
              description: >-
                Deprecated: Use highlights or text instead. Returns page
                contents as a combined context string.
              example: true
              deprecated: true
            - type: object
              properties:
                maxCharacters:
                  type: integer
                  minimum: 1
                  maximum: 10000
                  description: >-
                    Deprecated. Maximum character limit for the context string.
                    Maximum supported value is 10000.
                  example: 10000
              additionalProperties: false
              description: >-
                Deprecated: Use highlights or text instead. Returns page
                contents as a combined context string.
              deprecated: true
        livecrawl:
          description: Crawl strategy for fetching page content
          oneOf:
            - type: string
              enum:
                - never
                - always
                - fallback
                - preferred
            - type: string
              const: auto
        livecrawlTimeout:
          type: integer
          exclusiveMinimum: 0
          maximum: 90000
          description: The timeout for livecrawling in milliseconds.
          example: 1000
          default: 10000
        maxAgeHours:
          type: integer
          minimum: -1
          maximum: 720
          description: >-
            Maximum age of cached content in hours. Positive values use cached
            content if it is less than this many hours old; 0 fetches fresh
            content and is the supported way to apply text rendering options to
            newly fetched pages; -1 always uses cache; omitted uses fallback
            fetching when cached content is unavailable. Maximum supported value
            is 720 hours.
          example: 24
        filterEmptyResults:
          type: boolean
          description: Filter out results with no content
        subpages:
          type: integer
          minimum: 0
          maximum: 100
          description: >-
            The number of subpages to crawl. The actual number crawled may be
            limited by system constraints.
          example: 1
          default: 0
        subpageTarget:
          description: >-
            Term to find specific subpages of search results. Can be a single
            string or an array of strings.
          example: sources
          oneOf:
            - type: string
              minLength: 1
              maxLength: 100
            - minItems: 0
              maxItems: 100
              type: array
              items:
                type: string
                minLength: 1
                maxLength: 100
      additionalProperties: false
      description: >-
        Content extraction options applied to each search result. All fields are
        optional.
    OutputSchemaTextOutput:
      type: object
      properties:
        type:
          type: string
          const: text
        description:
          type: string
      required:
        - type
      additionalProperties: false
    OutputSchemaObject:
      type: object
      properties:
        type:
          type: string
          const: object
        description:
          type: string
        properties:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            $ref: '#/components/schemas/JsonValue'
        required:
          type: array
          items:
            type: string
        additionalProperties:
          type: boolean
      required:
        - type
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
    SummaryWithMaxTokensOptionsOutput:
      type: object
      properties:
        query:
          anyOf:
            - type: string
              description: Custom query for the LLM-generated summary.
              example: Main developments
            - type: 'null'
        maxTokens:
          type: integer
          minimum: 1
          description: Maximum tokens for the generated summary.
      additionalProperties: false
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
    NotFoundResponse:
      description: The requested resource does not exist.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 3b1d5f7a9c0e2b4d6f8a0c2e4b6d8f0a
            error: Not found
            tag: NOT_FOUND
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