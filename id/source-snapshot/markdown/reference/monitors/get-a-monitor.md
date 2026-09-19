> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk melihat semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="get-a-monitor">
  # Mendapatkan monitor
</div>

> Mengambil satu monitor berdasarkan ID-nya.

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
      summary: Mendapatkan monitor
      description: Mengambil satu monitor berdasarkan ID-nya.
      operationId: getMonitor
      parameters:
        - in: path
          name: id
          schema:
            type: string
            description: ID monitor
          required: true
          description: ID monitor
      responses:
        '200':
          description: Monitor tersebut
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
        Pengidentifikasi unik untuk permintaan ini. Sama dengan kolom
        `requestId` yang dikembalikan pada body respons yang memuatnya.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    SearchMonitor:
      type: object
      properties:
        id:
          type: string
          description: Pengidentifikasi unik untuk monitor
        name:
          anyOf:
            - type: string
            - type: 'null'
          description: Nama tampilan opsional
        status:
          type: string
          enum:
            - active
            - paused
            - disabled
          description: >-
            Status monitor. Monitor `active` berjalan sesuai jadwal dan dapat
            dipicu secara manual. Monitor `paused` hanya dapat dipicu secara
            manual. Monitor `disabled` dinonaktifkan otomatis setelah 10
            kegagalan autentikasi berturut-turut.
        search:
          $ref: '#/components/schemas/SearchMonitorSearchOutput'
        trigger:
          anyOf:
            - $ref: '#/components/schemas/SearchMonitorTriggerOutput'
            - type: 'null'
          description: >-
            Jadwal berbasis interval untuk run otomatis. Null jika tidak ada
            jadwal yang diatur.
        outputSchema:
          $ref: '#/components/schemas/SearchMonitorOutputSchemaOutput'
        metadata:
          anyOf:
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                type: string
              description: Metadata pasangan kunci-nilai dari pemanggil untuk pelacakan Anda sendiri.
              example:
                slack_channel_id: C123ABC
                slack_thread_id: '1745444400.123456'
                user_id: U123ABC
            - type: 'null'
          description: >-
            Metadata pasangan kunci-nilai opsional untuk pelacakan Anda sendiri.
            Dikirim kembali dalam pengiriman webhook sehingga Anda dapat
            mengarahkan pembaruan ke sistem seperti Slack.
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
          description: Kapan run terjadwal berikutnya akan berlangsung. Null jika tidak ada pemicu yang diatur.
          format: date-time
        createdAt:
          type: string
          format: date-time
          description: Kapan monitor dibuat
        updatedAt:
          type: string
          format: date-time
          description: Kapan monitor terakhir diperbarui
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
          description: String query untuk search.
          example: Latest developments in LLM capabilities
        numResults:
          type: integer
          minimum: 1
          maximum: 100
          description: >-
            Jumlah hasil yang dikembalikan. Limit berbeda-beda menurut search
            type. Limit publik maksimum adalah 100 hasil. Hubungi tim penjualan
            (hello@exa.ai) untuk membahas limit yang lebih tinggi.
          example: 10
          default: 10
        includeDomains:
          description: Batasi hasil search hanya pada domain-domain ini.
          type: array
          items:
            type: string
        excludeDomains:
          description: Kecualikan domain-domain ini dari hasil search.
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
          description: Jenis pemicu. Saat ini hanya `interval` yang didukung.
          default: interval
        period:
          type: string
          description: >-
            String durasi yang menentukan seberapa sering monitor berjalan
            (mis. "1h", "6h", "1d", "7d"). Hanya satu satuan. Interval minimum
            adalah 1 jam. Jadwal mengacu pada waktu pembuatan monitor (mis.
            monitor harian yang dibuat pukul 14.30 berjalan setiap hari sekitar
            pukul 14.30).
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
            JSON schema untuk output hasil synthesis. Tipe root yang didukung
            adalah "text" dan "object". Jika diberikan, respons menyertakan
            objek output yang isinya sesuai dengan schema ini. Berfungsi dengan
            setiap search type dan menambah sekitar 2 detik latensi synthesis
            di atas search type yang dipilih.
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
        Mengontrol format output run. Default-nya `{ "type": "text" }` jika
        tidak ditentukan. Jika `type` bernilai `"text"`, output berupa summary
        teks biasa. Jika `type` bernilai `"object"`, output berupa JSON
        terstruktur. Jika tidak ada `properties` yang ditentukan dengan tipe
        `"object"`, schema akan disimpulkan secara otomatis; jika tidak, output
        mengikuti schema yang diberikan.
    SearchMonitorWebhookOutput:
      type: object
      properties:
        url:
          type: string
          format: uri
          description: >-
            URL HTTPS untuk menerima event webhook. Tidak boleh mengarah ke
            localhost atau rentang IP privat.
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
            Event mana yang akan dilanggani. Default-nya semua event jika tidak
            ditentukan.
      required:
        - url
      additionalProperties: false
    ErrorResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Pengidentifikasi unik untuk permintaan ini.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: Pesan yang mudah dibaca manusia yang menjelaskan error.
          example: Invalid API key
        tag:
          type: string
          description: >-
            Tag error yang dapat dibaca mesin untuk mengidentifikasi kegagalan.
            Kumpulan tag bersifat terbuka: tag baru dapat ditambahkan kapan
            saja, jadi perlakukan tag yang tidak dikenali sebagai error generik
            sesuai status HTTP respons. Tag yang diketahui dicantumkan sebagai
            contoh.
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