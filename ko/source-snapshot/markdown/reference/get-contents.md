> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="contents">
  # Contents
</div>

> URL 목록에 대한 전체 page contents, summaries, 메타데이터를 가져옵니다.

캐시에 있는 결과를 즉시 반환하며, 캐시되지 않은 페이지는 자동 라이브 크롤링으로 대체됩니다.

***

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml POST /contents
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
  /contents:
    post:
      summary: Contents
      operationId: getContents
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ContentsRequest'
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
                requestId: e492118ccdedcba5088bfc4357a8a125
                results:
                  - id: https://arxiv.org/abs/2307.06435
                    title: A Comprehensive Overview of Large Language Models
                    url: https://arxiv.org/pdf/2307.06435.pdf
                    publishedDate: '2023-11-16T01:36:32.547Z'
                    author: >-
                      Humza  Naveed, University of Engineering and Technology
                      (UET), Lahore, Pakistan
                    text: >-
                      Abstract Large Language Models (LLMs) have recently
                      demonstrated remarkable capabilities...
                    highlights:
                      - Such requirements have limited their adoption...
                    summary: >-
                      This overview paper on Large Language Models (LLMs)
                      highlights key developments...
                statuses:
                  - id: https://arxiv.org/abs/2307.06435
                    status: success
                    source: cached
                costDollars:
                  total: 0.003
              schema:
                $ref: '#/components/schemas/ContentsResponse'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '402':
          description: >-
            Payment required. For API-key requests this is the standard error
            envelope (out of credits or a budget exceeded). On x402-priced
            endpoints, requests without an API key instead receive an x402
            payment challenge with tag `X402_PAYMENT_REQUIRED`: the envelope
            extended with x402 payment metadata (`x402Version`, `resource`,
            `accepts`, and optional `extensions`) describing how to pay for the
            request.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                oneOf:
                  - $ref: '#/components/schemas/ErrorResponse'
                  - $ref: '#/components/schemas/X402PaymentChallenge'
        '429':
          $ref: '#/components/responses/TooManyRequestsResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
        '503':
          $ref: '#/components/responses/ServiceUnavailableResponse'
components:
  schemas:
    ContentsRequest:
      type: object
      properties:
        ids:
          minItems: 1
          maxItems: 100
          type: array
          items:
            type: string
            minLength: 1
            maxLength: 2048
          description: Document IDs obtained from searches.
          example:
            - https://arxiv.org/pdf/2307.06435
        urls:
          minItems: 1
          maxItems: 100
          type: array
          items:
            type: string
            minLength: 1
            maxLength: 2048
          description: URLs to crawl (backwards compatible with the `ids` parameter).
          example:
            - https://arxiv.org/pdf/2307.06435
        compliance:
          anyOf:
            - type: string
              enum:
                - hipaa
              description: >-
                Enterprise-only compliance mode. Set to `hipaa` for HIPAA mode.
                Requires cache-only retrieval with supported parameters. See the
                HIPAA docs for details.
              example: hipaa
            - type: 'null'
        text:
          anyOf:
            - description: Text extraction options for each result.
              oneOf:
                - type: boolean
                  title: Simple text retrieval
                  description: >-
                    If true, returns full page text with default settings. If
                    false, disables text return.
                  default: false
                - type: object
                  properties:
                    maxCharacters:
                      anyOf:
                        - type: integer
                          minimum: 1
                          maximum: 10000
                          description: >-
                            Maximum character limit for the full page text.
                            Useful for controlling response size and API costs.
                            Maximum supported value is 10000.
                          example: 1000
                        - type: 'null'
                    includeHtmlTags:
                      anyOf:
                        - type: boolean
                          description: >-
                            If true, include lightweight HTML tags in returned
                            text instead of plain markdown-style text. Use
                            maxAgeHours: 0 when you need this applied to freshly
                            fetched content.
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
                            Controls text rendering verbosity. compact focuses
                            on main content, standard includes more surrounding
                            page context, and full requests the most complete
                            rendered text. Some pages may produce identical
                            standard and full output. Use maxAgeHours: 0 when
                            you need this applied to freshly fetched content.
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
                            Best-effort. Only include content classified into
                            these semantic page sections. Section classification
                            may be unavailable or incomplete for some pages;
                            validate output if strict filtering is required. Use
                            maxAgeHours: 0 when you need this applied to freshly
                            fetched content.
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
                  title: Advanced text options
                  description: >-
                    Advanced options for controlling text extraction. Use this
                    when you need to limit text length or include HTML
                    structure.
            - type: 'null'
        highlights:
          anyOf:
            - description: >-
                Text snippets the LLM identifies as most relevant from each
                page.
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
                          description: >-
                            Custom query that guides which highlights the LLM
                            picks.
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
                            returned highlights. With highlights.dynamic, the
                            preset sets a single shared budget across the whole
                            result set instead of a per-URL budget. Exact
                            budgets are tuned by Exa and may change. Not
                            compatible with maxCharacters or numSentences. Beta:
                            requires the `Exa-Beta:
                            dynamic-highlights-2026-08-28` request header;
                            requests setting `verbosity` without it are
                            rejected.
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
                            Enable Dynamic Highlights (research preview):
                            considers all results together and allocates a
                            single shared context budget across the result set
                            instead of a per-document budget. Not compatible
                            with maxCharacters. Beta: requires the `Exa-Beta:
                            dynamic-highlights-2026-08-28` request header;
                            requests setting `dynamic` without it are rejected.
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
                            Maximum number of characters to return for
                            highlights. Controls the total length of highlight
                            text returned per URL. Maximum supported value is
                            10000. Not compatible with highlights.dynamic.
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
                            default highlights, or { query } to guide selection
                            with your own query.
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
                            highlights, or { query } to guide selection with
                            your own query.
                          example: 1
                          deprecated: true
                        - type: 'null'
                  title: Advanced highlights options
                  description: >-
                    Advanced options for steering highlight extraction. Pass
                    highlights: true for the highest-quality default; supply
                    this object only when you need to guide selection with your
                    own query.
            - type: 'null'
        summary:
          anyOf:
            - type: object
              properties:
                query:
                  anyOf:
                    - type: string
                      description: Custom query for the LLM-generated summary.
                      example: Main developments
                    - type: 'null'
                schema:
                  anyOf:
                    - type: object
                      propertyNames:
                        type: string
                      additionalProperties:
                        $ref: '#/components/schemas/JsonValue'
                      description: >-
                        JSON schema for structured output from summary. See
                        https://json-schema.org/overview/what-is-jsonschema for
                        JSON Schema documentation.
                      example:
                        $schema: http://json-schema.org/draft-07/schema#
                        title: Title
                        type: object
                        properties:
                          Property 1:
                            type: string
                            description: Description
                          Property 2:
                            type: string
                            enum:
                              - option 1
                              - option 2
                              - option 3
                            description: Description
                        required:
                          - Property 1
                    - type: 'null'
              description: Summary of the webpage.
            - type: 'null'
        extras:
          anyOf:
            - type: object
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
              description: Extra parameters to pass.
            - type: 'null'
        context:
          anyOf:
            - description: >-
                Deprecated: Use highlights or text instead. Returns page
                contents as a combined context string.
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
                        Deprecated. Maximum character limit for the context
                        string. Maximum supported value is 10000.
                      example: 10000
                  description: >-
                    Deprecated: Use highlights or text instead. Returns page
                    contents as a combined context string.
                  deprecated: true
            - type: 'null'
        livecrawl:
          anyOf:
            - type: string
              enum:
                - never
                - always
                - fallback
                - preferred
              description: >-
                Deprecated: Use maxAgeHours instead for content freshness
                control. livecrawl does not guarantee freshly fetched parser
                output and may be served according to server freshness policy.
                Do not send livecrawl and maxAgeHours together.
              example: preferred
              deprecated: true
            - type: 'null'
        livecrawlTimeout:
          anyOf:
            - type: integer
              exclusiveMinimum: 0
              maximum: 90000
              description: The timeout for livecrawling in milliseconds.
              example: 1000
              default: 10000
            - type: 'null'
        maxAgeHours:
          anyOf:
            - type: integer
              minimum: -1
              maximum: 720
              description: >-
                Maximum age of cached content in hours. Positive values use
                cached content if it is less than this many hours old; 0 fetches
                fresh content and is the supported way to apply text rendering
                options to newly fetched pages; -1 always uses cache; omitted
                uses fallback fetching when cached content is unavailable.
                Maximum supported value is 720 hours.
              example: 24
            - type: 'null'
        snapshotAsOf:
          anyOf:
            - type: string
              description: >-
                Return the newest stored version of each page as of this instant
                (ISO 8601 date-time). Historical requests are served from stored
                versions only and never fetch the live page.
              example: '2026-01-15T00:00:00.000Z'
              format: date-time
            - type: 'null'
        subpages:
          anyOf:
            - type: integer
              minimum: 0
              maximum: 100
              description: >-
                The number of subpages to crawl. The actual number crawled may
                be limited by system constraints.
              example: 1
              default: 0
            - type: 'null'
        subpageTarget:
          anyOf:
            - description: >-
                Term to find specific subpages of search results. Can be a
                single string or an array of strings.
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
            - type: 'null'
      description: Provide either `ids` or `urls`, but not both.
      oneOf:
        - required:
            - ids
        - required:
            - urls
    ContentsResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Unique identifier for the request.
          example: b5947044c4b78efa9552a7c89b306d95
        results:
          type: array
          items:
            $ref: '#/components/schemas/SearchResultOutput'
        context:
          type: string
          description: >-
            더 이상 사용되지 않습니다. search 결과를 결합한 컨텍스트 문자열입니다. 대신
            highlights 또는 text를 사용하세요.
          deprecated: true
        statuses:
          description: 요청된 각 URL 또는 문서 ID에 대한 상태 정보입니다.
          type: array
          items:
            type: object
            properties:
              id:
                type: string
                description: 요청된 URL 또는 문서 ID입니다.
                example: https://example.com
              status:
                type: string
                enum:
                  - success
                  - error
                description: 콘텐츠 가져오기 작업의 상태입니다.
                example: success
              source:
                description: 반환된 콘텐츠의 출처입니다.
                type: string
                enum:
                  - cached
                  - crawled
              error:
                anyOf:
                  - type: object
                    properties:
                      tag:
                        description: 구체적인 오류 유형입니다.
                        example: CRAWL_NOT_FOUND
                        type: string
                      httpStatusCode:
                        anyOf:
                          - type: integer
                            minimum: 100
                            maximum: 599
                          - type: 'null'
                        description: 이에 해당하는 HTTP 상태 코드입니다.
                        example: 404
                    additionalProperties: false
                  - type: 'null'
                description: 오류 세부 정보로, status가 "error"일 때만 포함됩니다.
            required:
              - id
              - status
            additionalProperties: false
        costDollars:
          $ref: '#/components/schemas/CostDollarsOutput'
        searchTime:
          type: number
          description: >-
            gateway에서 측정한 서버 측 처리 시간(밀리초)입니다. retrieval은 포함하지만
            structured output synthesis 같은 이후 단계는 제외될 수 있어,
            엔드투엔드 요청 지연 시간보다 짧을 수 있습니다.
          example: 312.4
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
          description: 오류를 설명하는, 사람이 읽을 수 있는 메시지입니다.
          example: Invalid API key
        tag:
          type: string
          description: >-
            실패 원인을 식별하는 기계 판독 가능한 오류 태그입니다. 태그 집합은 개방형이어서
            새 태그가 언제든 추가될 수 있으므로, 인식할 수 없는 태그는 응답의
            HTTP 상태에 해당하는 일반 오류로 처리하세요. 알려진 태그는 예시로
            나열되어 있습니다.
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
      description: 실패한 요청에 대해 Exa API가 반환하는 표준 오류 응답 구조입니다.
    X402PaymentChallenge:
      type: object
      properties:
        requestId:
          type: string
          description: 요청의 고유 식별자입니다.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: 오류를 설명하는, 사람이 읽을 수 있는 메시지입니다.
          example: Payment required to access this resource
        tag:
          type: string
          description: >-
            실패 원인을 식별하는 기계 판독 가능한 오류 태그입니다. 태그 집합은 개방형이어서
            새 태그가 언제든 추가될 수 있으므로, 인식할 수 없는 태그는 응답의
            HTTP 상태에 해당하는 일반 오류로 처리하세요. 알려진 태그는 예시로
            나열되어 있습니다.
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
        x402Version:
          type: number
          description: 이 challenge를 구성하는 데 사용된 x402 프로토콜의 버전입니다.
          example: 2
        resource:
          type: object
          properties:
            url:
              type: string
              description: 요청 대상인 유료 리소스의 URL입니다.
            description:
              type: string
              description: 사람이 읽을 수 있는 리소스 설명입니다.
            mimeType:
              type: string
              description: 유료 리소스의 MIME 타입입니다.
          required:
            - url
            - description
            - mimeType
          additionalProperties: false
          description: 이 challenge가 적용되는 유료 리소스입니다.
        accepts:
          type: array
          items:
            type: object
            propertyNames:
              type: string
            additionalProperties: {}
            description: >-
              허용되는 x402 payment 요구 사항입니다(scheme, network, amount,
              payTo, asset, maxTimeoutSeconds 및 scheme별 `extra`
              필드).
          description: 서버가 허용하는 payment 요구 사항으로, 지원되는 결제 수단마다 하나씩 제공됩니다.
        extensions:
          description: >-
            선택적인 x402 프로토콜 확장입니다(예: Bazaar 또는 AgentKit 탐색
            메타데이터).
          type: object
          propertyNames:
            type: string
          additionalProperties: {}
      required:
        - requestId
        - error
        - tag
        - x402Version
        - resource
        - accepts
      additionalProperties: false
      description: >-
        x402 payment challenge: 표준 오류 응답 구조에 x402 payment 메타데이터를
        추가한 형태입니다.
    JsonValue:
      description: 임의의 JSON 값입니다.
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
    SearchResultOutput:
      type: object
      properties:
        title:
          type: string
          description: search 결과의 제목입니다.
          example: A Comprehensive Overview of Large Language Models
        url:
          type: string
          description: search 결과의 URL입니다.
          example: https://arxiv.org/pdf/2307.06435.pdf
          format: uri
        publishedDate:
          description: >-
            HTML 콘텐츠를 파싱해 추정한 생성 날짜입니다. 형식은
            YYYY-MM-DD입니다.
          example: '2023-11-16T01:36:32.547Z'
          format: date-time
          type: string
        author:
          description: 확인 가능한 경우, 콘텐츠의 작성자입니다.
          example: Humza Naveed
          anyOf:
            - type: string
            - type: 'null'
        id:
          description: >-
            문서의 임시 ID입니다. /contents endpoint에서 유용하게
            사용됩니다.
          example: https://arxiv.org/abs/2307.06435
          type: string
        image:
          description: 확인 가능한 경우, search 결과와 연관된 이미지의 URL입니다.
          example: https://arxiv.org/pdf/2307.06435.pdf/page_1.png
          format: uri
          type: string
        favicon:
          description: search 결과 도메인의 파비콘 URL입니다.
          example: https://arxiv.org/favicon.ico
          format: uri
          type: string
        text:
          description: search 결과의 전체 콘텐츠 텍스트입니다.
          example: >-
            Abstract Large Language Models (LLMs) have recently demonstrated
            remarkable capabilities...
          type: string
        highlights:
          description: Array of highlights extracted from the search result content.
          example:
            - Such requirements have limited their adoption...
          type: array
          items:
            type: string
        highlightScores:
          description: Array of cosine similarity scores for each highlighted snippet.
          example:
            - 0.4600165784358978
          type: array
          items:
            type: number
            format: float
        summary:
          description: Summary of the webpage.
          example: >-
            This overview paper on Large Language Models (LLMs) highlights key
            developments...
          type: string
        subpages:
          description: Array of subpages for the search result.
          type: array
          items:
            type: object
            properties:
              title:
                type: string
                description: The title of the search result.
                example: A Comprehensive Overview of Large Language Models
              url:
                type: string
                description: The URL of the search result.
                example: https://arxiv.org/pdf/2307.06435.pdf
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
            required:
              - title
              - url
            additionalProperties: false
        entities:
          description: >-
            Structured entity data for company, person, or publication search
            results. Returned for supported entity-backed categories.
          type: array
          items:
            oneOf:
              - $ref: '#/components/schemas/SearchCompanyEntityOutput'
              - $ref: '#/components/schemas/SearchPersonEntityOutput'
              - $ref: '#/components/schemas/SearchPublicationEntityOutput'
            type: object
            discriminator:
              propertyName: type
              mapping:
                company:
                  $ref: '#/components/schemas/SearchCompanyEntityOutput'
                person:
                  $ref: '#/components/schemas/SearchPersonEntityOutput'
                publication:
                  $ref: '#/components/schemas/SearchPublicationEntityOutput'
        extras:
          description: >-
            Results from extras. Each field is returned only when requested via
            contents.extras.
          example:
            links: []
          type: object
          properties:
            links:
              description: Array of links from the search result.
              example: []
              type: array
              items:
                type: string
            imageLinks:
              description: Array of image URLs from the search result.
              example: []
              type: array
              items:
                type: string
            richImageLinks:
              description: >-
                Array of images with their alt text, in the order the images
                appear on the page.
              example:
                - url: https://exa.ai/images/illustrations/api_illustration4.webp
                  alt: High rate limits, low latency and high reliability.
              type: array
              items:
                type: object
                properties:
                  url:
                    type: string
                    description: The URL of the image.
                  alt:
                    description: The alt text of the image, when the page provides one.
                    type: string
                required:
                  - url
                additionalProperties: false
            richLinks:
              description: >-
                Array of links with their anchor text, in the order they appear
                on the page.
              example:
                - url: https://dashboard.exa.ai
                  anchor: API Dashboard
              type: array
              items:
                type: object
                properties:
                  url:
                    type: string
                    description: The URL of the link.
                  anchor:
                    description: The anchor text of the link, when the page provides one.
                    type: string
                required:
                  - url
                additionalProperties: false
            codeBlocks:
              description: Array of code blocks from the search result.
              example:
                - text: pip install exa-py
                  source: bash
              type: array
              items:
                type: object
                properties:
                  text:
                    type: string
                    description: The contents of the code block.
                  source:
                    type: string
                    description: The language the code block is annotated with, if any.
                required:
                  - text
                  - source
                additionalProperties: false
          additionalProperties: false
      required:
        - title
        - url
      additionalProperties: false
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
    SearchCompanyEntityOutput:
      type: object
      properties:
        id:
          type: string
          description: Stable company entity identifier.
        type:
          type: string
          const: company
          description: Entity discriminator.
        version:
          type: integer
          minimum: 1
          description: Entity schema version.
        properties:
          type: object
          properties:
            name:
              anyOf:
                - type: string
                - type: 'null'
              description: Company name.
            foundedYear:
              anyOf:
                - type: integer
                - type: 'null'
              description: Year the company was founded.
            description:
              anyOf:
                - type: string
                - type: 'null'
              description: Short company description.
            workforce:
              anyOf:
                - type: object
                  properties:
                    total:
                      anyOf:
                        - type: number
                        - type: 'null'
                      description: Total estimated employee count.
                  required:
                    - total
                  additionalProperties: false
                - type: 'null'
              description: Company workforce information.
            headquarters:
              anyOf:
                - type: object
                  properties:
                    address:
                      anyOf:
                        - type: string
                        - type: 'null'
                      description: Company headquarters street address.
                    city:
                      anyOf:
                        - type: string
                        - type: 'null'
                      description: Company headquarters city.
                    postalCode:
                      anyOf:
                        - type: string
                        - type: 'null'
                      description: Company headquarters postal code.
                    country:
                      anyOf:
                        - type: string
                        - type: 'null'
                      description: Company headquarters country.
                  required:
                    - address
                    - city
                    - postalCode
                    - country
                  additionalProperties: false
                - type: 'null'
              description: Company headquarters information.
            financials:
              anyOf:
                - type: object
                  properties:
                    revenueAnnual:
                      anyOf:
                        - type: number
                        - type: 'null'
                      description: Estimated annual revenue in USD.
                    fundingTotal:
                      anyOf:
                        - type: number
                        - type: 'null'
                      description: Total funding raised in USD.
                    fundingLatestRound:
                      anyOf:
                        - type: object
                          properties:
                            name:
                              anyOf:
                                - type: string
                                - type: 'null'
                              description: Funding round name.
                            date:
                              anyOf:
                                - type: string
                                - type: 'null'
                              description: Funding round date.
                            amount:
                              anyOf:
                                - type: number
                                - type: 'null'
                              description: Funding round amount in USD.
                          required:
                            - name
                            - date
                            - amount
                          additionalProperties: false
                        - type: 'null'
                      description: Most recent funding round, when available.
                  required:
                    - revenueAnnual
                    - fundingTotal
                    - fundingLatestRound
                  additionalProperties: false
                - type: 'null'
              description: Company financial information.
            webTraffic:
              anyOf:
                - type: object
                  properties:
                    visitsMonthly:
                      anyOf:
                        - type: number
                        - type: 'null'
                      description: Estimated monthly website visits.
                    countryRank:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: >-
                        Estimated website traffic rank within the company's
                        primary country.
                    avgDurationSeconds:
                      anyOf:
                        - type: number
                        - type: 'null'
                      description: Estimated average visit duration, in seconds.
                    history:
                      type: array
                      items:
                        type: object
                        properties:
                          value:
                            type: number
                            description: Estimated monthly visits for this period.
                          dateFrom:
                            type: string
                            description: Start month for this value, formatted as YYYY-MM.
                          dateTo:
                            type: string
                            description: End month for this value, formatted as YYYY-MM.
                        required:
                          - value
                          - dateFrom
                          - dateTo
                        additionalProperties: false
                      description: Historical monthly website visits.
                  required:
                    - visitsMonthly
                    - countryRank
                    - avgDurationSeconds
                    - history
                  additionalProperties: false
                - type: 'null'
              description: Company web traffic information.
            research:
              anyOf:
                - type: object
                  properties:
                    worksCount:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: Number of works with an affiliated author.
                    citationCount:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: Lifetime citation count.
                    areas:
                      type: array
                      items:
                        type: string
                      description: Ranked research areas, most active first.
                    notableWorks:
                      type: array
                      items:
                        type: object
                        properties:
                          title:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Publication title.
                          year:
                            anyOf:
                              - type: integer
                              - type: 'null'
                            description: Publication year.
                          venue:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Publication venue.
                          citationCount:
                            anyOf:
                              - type: integer
                              - type: 'null'
                            description: Number of works citing this publication.
                          doi:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Digital Object Identifier.
                          id:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: >-
                              Resolved publication entity identifier, when
                              available.
                          type:
                            anyOf:
                              - type: string
                                enum:
                                  - article
                                  - book
                                  - book-chapter
                                  - dataset
                                  - dissertation
                                  - preprint
                                  - report
                                  - review
                              - type: 'null'
                            description: Publication type.
                        required:
                          - title
                          - year
                          - venue
                          - citationCount
                          - doi
                          - id
                          - type
                        additionalProperties: false
                      description: Most-cited notable works.
                    topResearchers:
                      type: array
                      items:
                        type: object
                        properties:
                          person:
                            anyOf:
                              - type: object
                                properties:
                                  name:
                                    anyOf:
                                      - type: string
                                      - type: 'null'
                                    description: Referenced person name.
                                  id:
                                    anyOf:
                                      - type: string
                                      - type: 'null'
                                    description: Referenced person entity identifier.
                                required:
                                  - name
                                  - id
                                additionalProperties: false
                              - type: 'null'
                            description: Referenced researcher.
                          worksCount:
                            anyOf:
                              - type: integer
                              - type: 'null'
                            description: Number of works produced at the organization.
                          citationCount:
                            anyOf:
                              - type: integer
                              - type: 'null'
                            description: >-
                              Number of citations for works produced at the
                              organization.
                        required:
                          - person
                          - worksCount
                          - citationCount
                        additionalProperties: false
                      description: >-
                        Researchers ordered by works produced at the
                        organization.
                  required:
                    - worksCount
                    - citationCount
                    - areas
                    - notableWorks
                    - topResearchers
                  additionalProperties: false
                - type: 'null'
              description: Company research information.
          required:
            - name
            - foundedYear
            - description
            - workforce
            - headquarters
            - financials
            - webTraffic
            - research
          additionalProperties: false
          description: Company-specific entity fields.
      required:
        - id
        - type
        - version
        - properties
      additionalProperties: false
    SearchPersonEntityOutput:
      type: object
      properties:
        id:
          type: string
          description: Stable person entity identifier.
        type:
          type: string
          const: person
          description: Entity discriminator.
        version:
          type: integer
          minimum: 1
          description: Entity schema version.
        properties:
          type: object
          properties:
            name:
              anyOf:
                - type: string
                - type: 'null'
              description: Person name.
            firstName:
              anyOf:
                - type: string
                - type: 'null'
              description: Person first name.
            lastName:
              anyOf:
                - type: string
                - type: 'null'
              description: Person last name.
            location:
              anyOf:
                - type: string
                - type: 'null'
              description: Person location.
            workHistory:
              type: array
              items:
                type: object
                properties:
                  title:
                    anyOf:
                      - type: string
                      - type: 'null'
                    description: Role title.
                  location:
                    anyOf:
                      - type: string
                      - type: 'null'
                    description: Role location.
                  dates:
                    anyOf:
                      - type: object
                        properties:
                          from:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Start date for the date range.
                          to:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: End date for the date range.
                        required:
                          - from
                          - to
                        additionalProperties: false
                      - type: 'null'
                    description: Role date range.
                  company:
                    anyOf:
                      - type: object
                        properties:
                          id:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Referenced company identifier.
                          name:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Referenced company name.
                        required:
                          - id
                          - name
                        additionalProperties: false
                      - type: 'null'
                    description: Company for this role.
                required:
                  - title
                  - location
                  - dates
                  - company
                additionalProperties: false
              description: Known professional roles for this person.
            educationHistory:
              type: array
              items:
                type: object
                properties:
                  degree:
                    anyOf:
                      - type: string
                      - type: 'null'
                    description: Degree or credential.
                  dates:
                    anyOf:
                      - type: object
                        properties:
                          from:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Start date for the date range.
                          to:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: End date for the date range.
                        required:
                          - from
                          - to
                        additionalProperties: false
                      - type: 'null'
                    description: Education date range.
                  institution:
                    anyOf:
                      - type: object
                        properties:
                          id:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Referenced institution identifier.
                          name:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Referenced institution name.
                        required:
                          - id
                          - name
                        additionalProperties: false
                      - type: 'null'
                    description: Education institution.
                required:
                  - degree
                  - dates
                  - institution
                additionalProperties: false
              description: Known education history for this person.
            research:
              anyOf:
                - type: object
                  properties:
                    worksCount:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: Lifetime number of works.
                    citationCount:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: Lifetime citation count.
                    hIndex:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: Research h-index.
                    firstPublicationYear:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: Year of the first publication.
                    latestPublicationYear:
                      anyOf:
                        - type: integer
                        - type: 'null'
                      description: Year of the latest publication.
                    areas:
                      type: array
                      items:
                        type: string
                      description: Ranked research areas, most active first.
                    notableWorks:
                      type: array
                      items:
                        type: object
                        properties:
                          title:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Publication title.
                          year:
                            anyOf:
                              - type: integer
                              - type: 'null'
                            description: Publication year.
                          venue:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Publication venue.
                          citationCount:
                            anyOf:
                              - type: integer
                              - type: 'null'
                            description: Number of works citing this publication.
                          doi:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: Digital Object Identifier.
                          id:
                            anyOf:
                              - type: string
                              - type: 'null'
                            description: >-
                              Resolved publication entity identifier, when
                              available.
                          type:
                            anyOf:
                              - type: string
                                enum:
                                  - article
                                  - book
                                  - book-chapter
                                  - dataset
                                  - dissertation
                                  - preprint
                                  - report
                                  - review
                              - type: 'null'
                            description: Publication type.
                        required:
                          - title
                          - year
                          - venue
                          - citationCount
                          - doi
                          - id
                          - type
                        additionalProperties: false
                      description: Most-cited notable works.
                  required:
                    - worksCount
                    - citationCount
                    - hIndex
                    - firstPublicationYear
                    - latestPublicationYear
                    - areas
                    - notableWorks
                  additionalProperties: false
                - type: 'null'
              description: Person research information.
          required:
            - name
            - firstName
            - lastName
            - location
            - workHistory
            - educationHistory
            - research
          additionalProperties: false
          description: Person-specific entity fields.
      required:
        - id
        - type
        - version
        - properties
      additionalProperties: false
    SearchPublicationEntityOutput:
      type: object
      properties:
        id:
          type: string
          description: Stable publication entity identifier.
        type:
          type: string
          const: publication
          description: Entity discriminator.
        version:
          type: integer
          minimum: 1
          description: Entity schema version.
        properties:
          type: object
          properties:
            title:
              anyOf:
                - type: string
                - type: 'null'
              description: Publication title.
            year:
              anyOf:
                - type: integer
                - type: 'null'
              description: Publication year.
            date:
              anyOf:
                - type: string
                - type: 'null'
              description: Publication date.
            type:
              anyOf:
                - type: string
                  enum:
                    - article
                    - book
                    - book-chapter
                    - dataset
                    - dissertation
                    - preprint
                    - report
                    - review
                - type: 'null'
              description: Publication type.
            language:
              anyOf:
                - type: string
                - type: 'null'
              description: Publication language.
            citationCount:
              anyOf:
                - type: integer
                - type: 'null'
              description: Number of works citing this publication (incoming references).
            authors:
              type: array
              items:
                type: object
                properties:
                  name:
                    anyOf:
                      - type: string
                      - type: 'null'
                    description: Author display name.
                  id:
                    anyOf:
                      - type: string
                      - type: 'null'
                    description: Resolved person entity identifier, when available.
                required:
                  - name
                  - id
                additionalProperties: false
              description: Ordered list of authors.
            referenceCount:
              anyOf:
                - type: integer
                - type: 'null'
              description: Number of works this publication cites (outgoing references).
            abstract:
              anyOf:
                - type: string
                - type: 'null'
              description: Publication abstract text.
            doi:
              anyOf:
                - type: string
                - type: 'null'
              description: Bare DOI identifier (e.g. 10.1234/abcd).
          required:
            - title
            - year
            - date
            - type
            - language
            - citationCount
            - authors
            - referenceCount
            - abstract
            - doi
          additionalProperties: false
          description: Publication-specific entity fields.
      required:
        - id
        - type
        - version
        - properties
      additionalProperties: false
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