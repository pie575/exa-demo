> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="cancel-a-running-webset">
  # 取消正在运行的 webset
</div>

> 取消对某个 Webset 正在执行的所有操作。

所有正在进行的 enrichment 或 search 都会停止，该 Webset 将被标记为 `idle`。

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml POST /v0/websets/{id}/cancel
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
  /v0/websets/{id}/cancel:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Websets
      summary: 取消正在运行的 Webset
      description: >-
        取消在某个 Webset 上执行的所有操作。


        任何扩充（enrichment）或搜索都将被停止，并且该 Webset 将被标记为 `idle`。
      operationId: websets-cancel
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: 该 Webset 的 id 或 externalId
          required: true
      responses:
        '200':
          description: Webset 已取消
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 该请求的唯一标识符。
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webset'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    Webset:
      properties:
        id:
          description: 该 webset 的唯一标识符
          type: string
        object:
          const: webset
          default: webset
          type: string
        status:
          enum:
            - idle
            - pending
            - running
            - paused
          description: 该 webset 的状态
          title: WebsetStatus
          type: string
        externalId:
          type: string
          description: 该 webset 的外部标识符
          nullable: true
        title:
          type: string
          description: 该 webset 的标题
          nullable: true
        searches:
          items:
            $ref: '#/components/schemas/WebsetSearch'
          description: 已在该 webset 上执行的搜索。
          type: array
        imports:
          items:
            $ref: '#/components/schemas/Import'
          description: 已在该 webset 上执行的导入。
          type: array
        enrichments:
          items:
            $ref: '#/components/schemas/WebsetEnrichment'
          description: 要应用于 Webset Items 的 Enrichments。
          type: array
        monitors:
          items:
            $ref: '#/components/schemas/Monitor'
          description: 该 Webset 的 Monitors。
          type: array
        excludes:
          description: >-
            适用于此 Webset 内所有操作的 Excludes 来源（已有的 imports 或
            websets）。在这些来源中找到的任何结果都将在所有搜索和导入操作中被忽略。
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
            required:
              - source
              - id
            type: object
          type: array
        metadata:
          default: {}
          description: 你希望与该对象关联的一组键值对。
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        dashboardUrl:
          format: uri
          description: 在 Exa 仪表板中查看该 webset 的 URL
          type: string
        createdAt:
          format: date-time
          description: 该 webset 的创建日期和时间
          type: string
        updatedAt:
          format: date-time
          description: 该 webset 的更新日期和时间
          type: string
      required:
        - id
        - object
        - status
        - externalId
        - title
        - searches
        - imports
        - enrichments
        - monitors
        - dashboardUrl
        - createdAt
        - updatedAt
      type: object
    WebsetSearch:
      properties:
        id:
          description: 该搜索的唯一标识符
          type: string
        object:
          const: webset_search
          default: webset_search
          type: string
        websetId:
          description: 该搜索所属 Webset 的唯一标识符
          type: string
        status:
          enum:
            - created
            - pending
            - running
            - completed
            - canceled
          description: 该搜索的状态
          title: WebsetSearchStatus
          type: string
        query:
          minLength: 1
          maxLength: 5000
          description: 用于创建该搜索的查询。
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: >-
            该搜索将为其返回结果的实体。


            如果在创建时未提供实体，我们将根据查询自动选择最合适的实体。
          nullable: true
        criteria:
          items:
            properties:
              description:
                minLength: 1
                maxLength: 1000
                description: 该标准的描述
                type: string
              successRate:
                minimum: 0
                maximum: 100
                description: >-
                  介于 0 和 100 之间的值，表示满足该标准的结果所占的百分比。
                type: number
            required:
              - description
              - successRate
            type: object
          description: >-
            该搜索用于评估结果的标准。如果未提供，我们将自动为你生成。
          type: array
        count:
          minimum: 1
          description: >-
            该搜索将尝试找到的结果数量。实际结果数量可能少于此数字，具体取决于搜索的复杂度。
          type: number
        maxPeoplePerCompany:
          minimum: 1
          type: integer
          description: >-
            针对来自同一当前雇主公司的匹配人员所请求的软性上限；若未请求上限则为 null。
          nullable: true
        behavior:
          $ref: '#/components/schemas/WebsetSearchBehavior'
          default: override
          description: >-
            该搜索被添加到 Webset 时的行为。


            - `override`：该搜索将替换 Webset 中已有的 Items，并根据新标准对其进行评估。任何不符合新标准的
            Items 都将被丢弃。

            - `append`：该搜索会将新找到的 Items 添加到现有 Webset 中。任何不符合新标准的 Items 都将被丢弃。
        exclude:
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
            required:
              - source
              - id
            type: object
          description: >-
            用于在搜索过程中忽略某些结果的来源（已有的 imports 或 websets）。
          type: array
        scope:
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
              relationship:
                properties:
                  definition:
                    description: >-
                      你希望找到的实体与所提供来源中包含的实体之间的关系是什么。
                    type: string
                  limit:
                    minimum: 1
                    maximum: 10
                    type: number
                required:
                  - definition
                  - limit
                type: object
            required:
              - source
              - id
            type: object
          description: >-
            搜索的范围。默认情况下没有范围限制 —— 即在整个网络中搜索。


            If provided during creation, the search will only be performed on
            the sources provided.
          type: array
        progress:
          properties:
            found:
              description: The number of results found so far
              type: number
            analyzed:
              description: The number of results analyzed so far
              type: number
            completion:
              minimum: 0
              maximum: 100
              description: The completion percentage of the search
              type: number
            timeLeft:
              type: number
              description: The estimated time remaining in seconds, null if unknown
              nullable: true
          required:
            - found
            - analyzed
            - completion
            - timeLeft
          description: The progress of the search
          type: object
        recall:
          properties:
            expected:
              properties:
                total:
                  description: The estimated total number of potential matches
                  type: number
                confidence:
                  enum:
                    - high
                    - medium
                    - low
                  description: The confidence in the estimate
                  type: string
                bounds:
                  properties:
                    min:
                      description: The minimum estimated total number of potential matches
                      type: number
                    max:
                      description: The maximum estimated total number of potential matches
                      type: number
                  required:
                    - min
                    - max
                  type: object
              required:
                - total
                - confidence
                - bounds
              type: object
            reasoning:
              description: The reasoning for the estimate
              type: string
          required:
            - expected
            - reasoning
          type: object
          description: >-
            Recall metrics for the search, null if not yet computed or
            requested.
          nullable: true
        metadata:
          default: {}
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        canceledAt:
          format: date-time
          type: string
          description: The date and time the search was canceled
          nullable: true
        canceledReason:
          $ref: '#/components/schemas/WebsetSearchCanceledReason'
          description: The reason the search was canceled
          nullable: true
        createdAt:
          format: date-time
          description: The date and time the search was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the search was updated
          type: string
      required:
        - id
        - object
        - websetId
        - status
        - query
        - entity
        - criteria
        - count
        - maxPeoplePerCompany
        - exclude
        - scope
        - progress
        - recall
        - canceledAt
        - canceledReason
        - createdAt
        - updatedAt
      type: object
    Import:
      properties:
        id:
          description: The unique identifier for the Import
          type: string
        object:
          enum:
            - import
          description: The type of object
          type: string
        status:
          enum:
            - pending
            - processing
            - completed
            - failed
            - canceled
          description: The status of the Import
          type: string
        format:
          enum:
            - csv
            - webset
          description: The format of the import.
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: The type of entity the import contains.
          nullable: true
        title:
          description: The title of the import
          type: string
        count:
          description: The number of entities in the import
          type: number
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        failedReason:
          enum:
            - invalid_format
            - invalid_file_content
            - missing_identifier
          type: string
          description: The reason the import failed
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: When the import failed
          nullable: true
        failedMessage:
          type: string
          description: A human readable message of the import failure
          nullable: true
        createdAt:
          format: date-time
          description: When the import was created
          type: string
        updatedAt:
          format: date-time
          description: When the import was last updated
          type: string
      required:
        - id
        - object
        - status
        - format
        - entity
        - title
        - count
        - metadata
        - failedReason
        - failedAt
        - failedMessage
        - createdAt
        - updatedAt
      type: object
    WebsetEnrichment:
      properties:
        id:
          description: The unique identifier for the enrichment
          type: string
        object:
          const: webset_enrichment
          default: webset_enrichment
          type: string
        status:
          enum:
            - pending
            - canceled
            - completed
          description: The status of the enrichment
          title: WebsetEnrichmentStatus
          type: string
        websetId:
          description: The unique identifier for the Webset this enrichment belongs to.
          type: string
        title:
          type: string
          description: >-
            The title of the enrichment.


            This will be automatically generated based on the description and
            format.
          nullable: true
        description:
          description: >-
            The description of the enrichment task provided during the creation
            of the enrichment.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          description: The format of the enrichment response.
          nullable: true
        options:
          items:
            properties:
              label:
                description: The label of the option
                type: string
            required:
              - label
            type: object
          type: array
          description: >-
            When the format is options, the different options for the enrichment
            agent to choose from.
          title: WebsetEnrichmentOptions
          nullable: true
        instructions:
          type: string
          description: >-
            The instructions for the enrichment Agent.


            This will be automatically generated based on the description and
            format.
          nullable: true
        metadata:
          default: {}
          description: The metadata of the enrichment
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: The date and time the enrichment was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the enrichment was updated
          type: string
      required:
        - id
        - object
        - status
        - websetId
        - title
        - description
        - format
        - options
        - instructions
        - createdAt
        - updatedAt
      type: object
    Monitor:
      properties:
        id:
          description: The unique identifier for the Monitor
          type: string
        object:
          enum:
            - monitor
          description: The type of object
          type: string
        status:
          enum:
            - enabled
            - disabled
          description: The status of the Monitor
          type: string
        websetId:
          description: The id of the Webset the Monitor belongs to
          type: string
        cadence:
          properties:
            cron:
              description: >-
                Cron expression for monitor cadence (must be a valid Unix cron
                with 5 fields). The schedule must trigger at most once per day.
              type: string
            timezone:
              default: Etc/UTC
              description: IANA timezone (e.g., "America/New_York")
              type: string
          required:
            - cron
          description: How often the monitor will run
          type: object
        behavior:
          properties:
            config:
              properties:
                query:
                  description: >-
                    The query to search for. By default, the query from the last
                    search is used.
                  minLength: 2
                  maxLength: 10000
                  type: string
                criteria:
                  description: >-
                    The criteria to search for. By default, the criteria from
                    the last search is used.
                  maxItems: 5
                  items:
                    properties:
                      description:
                        minLength: 2
                        maxLength: 1000
                        type: string
                    required:
                      - description
                    type: object
                  type: array
                entity:
                  $ref: '#/components/schemas/Entity'
                  title: Entity
                  description: >-
                    The entity to search for. By default, the entity from the
                    last search/import is used.
                count:
                  exclusiveMinimum: 0
                  description: The maximum number of results to find
                  type: number
                behavior:
                  default: append
                  description: The behaviour of the Search when it is added to a Webset.
                  enum:
                    - override
                    - append
                  type: string
              required:
                - count
              description: >-
                Specify the search parameters for the Monitor.


                By default, the search parameters (query, entity and criteria)
                from the last search are used when no parameters are provided.
              type: object
            type:
              type: string
              const: search
              default: search
          required:
            - type
            - config
          description: Behavior to perform when monitor runs
          type: object
        lastRun:
          $ref: '#/components/schemas/MonitorRun'
          title: MonitorRun
          description: The last run of the monitor
          nullable: true
        nextRunAt:
          format: date-time
          type: string
          description: Date and time when the next run will occur in
          nullable: true
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          type: string
          format: date-time
          description: When the monitor was created
        updatedAt:
          type: string
          format: date-time
          description: When the monitor was last updated
      required:
        - id
        - object
        - status
        - websetId
        - cadence
        - behavior
        - lastRun
        - nextRunAt
        - metadata
        - createdAt
        - updatedAt
      type: object
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
    WebsetSearchBehavior:
      enum:
        - override
        - append
      type: string
    WebsetSearchCanceledReason:
      enum:
        - webset_deleted
        - webset_canceled
        - out_of_credits
      type: string
    WebsetEnrichmentFormat:
      enum:
        - text
        - date
        - number
        - options
        - email
        - phone
        - url
      type: string
    MonitorRun:
      properties:
        id:
          description: The unique identifier for the Monitor Run
          type: string
        object:
          enum:
            - monitor_run
          description: The type of object
          type: string
        monitorId:
          description: The monitor that the run is associated with
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: The status of the Monitor Run
          type: string
        completedAt:
          format: date-time
          type: string
          description: When the run completed
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: When the run failed
          nullable: true
        failedReason:
          type: string
          description: The reason the run failed
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: When the run was canceled
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: When the run was created
        updatedAt:
          type: string
          format: date-time
          description: When the run was last updated
        type:
          type: string
          enum:
            - search
            - refresh
          description: The type of the Monitor Run
      required:
        - id
        - object
        - monitorId
        - status
        - type
        - completedAt
        - failedAt
        - failedReason
        - canceledAt
        - createdAt
        - updatedAt
      type: object
    CompanyEntity:
      properties:
        type:
          type: string
          const: company
          default: company
      required:
        - type
      title: Company
      type: object
    PersonEntity:
      properties:
        type:
          type: string
          const: person
          default: person
      required:
        - type
      title: Person
      type: object
    ArticleEntity:
      properties:
        type:
          type: string
          const: article
          default: article
      required:
        - type
      title: Article
      type: object
    ResearchPaperEntity:
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
      title: Research Paper
      type: object
    CustomEntity:
      properties:
        description:
          minLength: 2
          maxLength: 200
          type: string
        type:
          type: string
          const: custom
          default: custom
      required:
        - type
        - description
      title: Custom
      type: object
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