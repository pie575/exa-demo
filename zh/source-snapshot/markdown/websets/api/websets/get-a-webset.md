> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# 获取 webset {#get-a-webset}

> 通过 `id` 或 `externalId` 返回一个 Webset，包含其状态、search、导入、增强和 monitor。

传入 `expand=items`，可在响应中包含最多前 100 个项目。

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /v0/websets/{id}
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
  /v0/websets/{id}:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Websets
      summary: Get a Webset
      description: >-
        Returns a Webset by `id` or `externalId`, including its status,
        searches, imports, enrichments, and monitors.


        Pass `expand=items` to include up to the first 100 items in the
        response.
      operationId: websets-get
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: The id or externalId of the Webset.
          required: true
        - in: query
          name: expand
          schema:
            items:
              enum:
                - items
              type: string
            type: array
          required: false
          description: Expand the response with the specified resources
      responses:
        '200':
          description: Webset
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetWebsetResponse'
        '404':
          description: Webset not found
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    GetWebsetResponse:
      allOf:
        - $ref: '#/components/schemas/Webset'
        - properties:
            items:
              description: >-
                When expand query parameter contains `items`, this will contain
                the items in the webset
              items:
                $ref: '#/components/schemas/WebsetItem'
              type: array
          type: object
    Webset:
      properties:
        id:
          description: The unique identifier for the webset
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
          description: The status of the webset
          title: WebsetStatus
          type: string
        externalId:
          type: string
          description: The external identifier for the webset
          nullable: true
        title:
          type: string
          description: The title of the webset
          nullable: true
        searches:
          items:
            $ref: '#/components/schemas/WebsetSearch'
          description: The searches that have been performed on the webset.
          type: array
        imports:
          items:
            $ref: '#/components/schemas/Import'
          description: Imports that have been performed on the webset.
          type: array
        enrichments:
          items:
            $ref: '#/components/schemas/WebsetEnrichment'
          description: The Enrichments to apply to the Webset Items.
          type: array
        monitors:
          items:
            $ref: '#/components/schemas/Monitor'
          description: The Monitors for the Webset.
          type: array
        excludes:
          description: >-
            The Excludes sources (existing imports or websets) that apply to all
            operations within this Webset. Any results found within these
            sources will be omitted across all search and import operations.
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
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        dashboardUrl:
          format: uri
          description: The URL to view the webset in the Exa dashboard
          type: string
        createdAt:
          format: date-time
          description: The date and time the webset was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the webset was updated
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
    WebsetItem:
      properties:
        id:
          description: The unique identifier for the Webset Item
          type: string
        object:
          const: webset_item
          default: webset_item
          type: string
        source:
          enum:
            - search
            - import
          description: The source of the Item
          type: string
        sourceId:
          description: The unique identifier for the source
          type: string
        sourceEntityId:
          description: >-
            The original identifier used to resolve this item (e.g., email,
            name, or URL). Only relevant when the source is import.
          type: string
        scopeId:
          description: >-
            The import that sourced this item, when the item came from a scoped
            search with evaluate enabled on the import.
          type: string
        websetId:
          description: The unique identifier for the Webset this Item belongs to.
          type: string
        properties:
          description: The properties of the Item
          oneOf:
            - $ref: '#/components/schemas/WebsetItemPersonProperties'
            - $ref: '#/components/schemas/WebsetItemCompanyProperties'
            - $ref: '#/components/schemas/WebsetItemArticleProperties'
            - $ref: '#/components/schemas/WebsetItemResearchPaperProperties'
            - $ref: '#/components/schemas/WebsetItemCustomProperties'
        evaluations:
          items:
            $ref: '#/components/schemas/WebsetItemEvaluation'
          description: The criteria evaluations of the item
          type: array
        enrichments:
          items:
            $ref: '#/components/schemas/EnrichmentResult'
          type: array
          description: The enrichments results of the Webset item
          nullable: true
        createdAt:
          format: date-time
          description: The date and time the item was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the item was last updated
          type: string
      required:
        - id
        - object
        - source
        - sourceId
        - websetId
        - properties
        - evaluations
        - enrichments
        - createdAt
        - updatedAt
      type: object
    WebsetSearch:
      properties:
        id:
          description: The unique identifier for the search
          type: string
        object:
          const: webset_search
          default: webset_search
          type: string
        websetId:
          description: The unique identifier for the Webset this search belongs to
          type: string
        status:
          enum:
            - created
            - pending
            - running
            - completed
            - canceled
          description: The status of the search
          title: WebsetSearchStatus
          type: string
        query:
          minLength: 1
          maxLength: 5000
          description: The query used to create the search.
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: >-
            The entity the search will return results for.


            When no entity is provided during creation, we will automatically
            select the best entity based on the query.
          nullable: true
        criteria:
          items:
            properties:
              description:
                minLength: 1
                maxLength: 1000
                description: The description of the criterion
                type: string
              successRate:
                minimum: 0
                maximum: 100
                description: >-
                  Value between 0 and 100 representing the percentage of results
                  that meet the criterion.
                type: number
            required:
              - description
              - successRate
            type: object
          description: >-
            The criteria the search will use to evaluate the results. If not
            provided, we will automatically generate them for you.
          type: array
        count:
          minimum: 1
          description: >-
            The number of results the search will attempt to find. The actual
            number of results may be less than this number depending on the
            search complexity.
          type: number
        maxPeoplePerCompany:
          minimum: 1
          type: integer
          description: >-
            The soft cap requested for matching people from the same current
            employer company, or null when no cap was requested.
          nullable: true
        behavior:
          $ref: '#/components/schemas/WebsetSearchBehavior'
          default: override
          description: >-
            The behavior of the search when it is added to a Webset.


            - `override`: the search will replace the existing Items found in
            the Webset and evaluate them against the new criteria. Any Items
            that don't match the new criteria will be discarded.

            - `append`: the search will add the new Items found to the existing
            Webset. Any Items that don't match the new criteria will be
            discarded.
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
            Sources (existing imports or websets) used to omit certain results
            to be found during the search.
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
                      What the relationship of the entities you hope to find is
                      relative to the entities contained in the provided source.
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
            The scope of the search. By default, there is no scope - thus
            searching the web.


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


                默认情况下，当未提供参数时，将使用上次搜索的搜索参数（查询、实体和条件）。
              type: object
            type:
              type: string
              const: search
              default: search
          required:
            - type
            - config
          description: 监控器运行时要执行的行为
          type: object
        lastRun:
          $ref: '#/components/schemas/MonitorRun'
          title: MonitorRun
          description: 监控器的最近一次运行
          nullable: true
        nextRunAt:
          format: date-time
          type: string
          description: 下一次运行将发生的日期和时间
          nullable: true
        metadata:
          description: 你希望与此对象关联的一组键值对。
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          type: string
          format: date-time
          description: 监控器的创建时间
        updatedAt:
          type: string
          format: date-time
          description: 监控器的最后更新时间
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
    WebsetItemPersonProperties:
      properties:
        url:
          format: uri
          description: 该人物资料的 URL
          type: string
        description:
          description: 该人物相关性的简短描述
          type: string
        person:
          properties:
            name:
              description: 该人物的姓名
              type: string
            location:
              type: string
              description: 该人物所在地
              nullable: true
            position:
              type: string
              description: 该人物当前的工作职位
              nullable: true
            company:
              properties:
                name:
                  description: 公司名称
                  type: string
                location:
                  type: string
                  description: 该人物在该公司工作的地点
                  nullable: true
              required:
                - name
                - location
              type: object
              title: WebsetItemPersonCompanyPropertiesFields
              nullable: true
            pictureUrl:
              format: uri
              type: string
              description: 该人物的图片 URL
              nullable: true
            workHistory:
              items:
                properties:
                  title:
                    type: string
                    description: 职位名称或职务
                    nullable: true
                  location:
                    type: string
                    description: 工作地点
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: 开始日期
                        nullable: true
                      to:
                        type: string
                        description: 结束日期
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: 任职日期
                    nullable: true
                  company:
                    properties:
                      id:
                        type: string
                        description: 公司的实体 ID
                        nullable: true
                      name:
                        type: string
                        description: 公司名称
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: 公司的 LinkedIn URL
                        nullable: true
                    required:
                      - id
                      - name
                      - linkedinUrl
                    type: object
                    title: WebsetItemPersonWorkHistoryCompanyRef
                    nullable: true
                required:
                  - title
                  - location
                  - dates
                  - company
                title: WebsetItemPersonWorkHistoryEntry
                type: object
              description: 该人物的工作经历
              type: array
            educationHistory:
              items:
                properties:
                  degree:
                    type: string
                    description: 获得的学位
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: 开始日期
                        nullable: true
                      to:
                        type: string
                        description: 结束日期
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: 教育日期
                    nullable: true
                  institution:
                    properties:
                      id:
                        type: string
                        description: 院校的实体 ID
                        nullable: true
                      name:
                        type: string
                        description: 院校名称
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: 院校的 LinkedIn URL
                        nullable: true
                    required:
                      - id
                      - name
                      - linkedinUrl
                    type: object
                    title: WebsetItemPersonEducationInstitutionRef
                    nullable: true
                required:
                  - degree
                  - dates
                  - institution
                title: WebsetItemPersonEducationHistoryEntry
                type: object
              description: 该人物的教育经历
              type: array
          required:
            - name
            - location
            - position
            - company
            - pictureUrl
            - workHistory
            - educationHistory
          title: WebsetItemPersonPropertiesFields
          type: object
        type:
          type: string
          const: person
          default: person
      required:
        - type
        - url
        - description
        - person
      title: Person
      type: object
    WebsetItemCompanyProperties:
      properties:
        url:
          format: uri
          description: 公司网站的 URL
          type: string
        description:
          description: 该公司相关性的简短描述
          type: string
        content:
          type: string
          description: 公司网站的文本内容
          nullable: true
        company:
          properties:
            name:
              description: 公司名称
              type: string
            location:
              type: string
              description: 公司的主要所在地
              nullable: true
            employees:
              type: integer
              description: 公司的员工人数
              nullable: true
            industry:
              type: string
              description: 公司所属行业
              nullable: true
            about:
              type: string
              description: 公司的简短描述
              nullable: true
            logoUrl:
              format: uri
              type: string
              description: 公司的徽标 URL
              nullable: true
            foundedYear:
              type: number
              description: 公司成立年份
              nullable: true
            headquarters:
              properties:
                address:
                  type: string
                  description: 总部的街道地址
                  nullable: true
                city:
                  type: string
                  description: 总部所在城市
                  nullable: true
                state:
                  type: string
                  description: 总部所在州或地区
                  nullable: true
                postalCode:
                  type: string
                  description: 总部的邮政编码
                  nullable: true
                country:
                  type: string
                  description: 总部所在国家
                  nullable: true
                countryCode:
                  type: string
                  description: 总部的 ISO 国家代码
                  nullable: true
              required:
                - address
                - city
                - state
                - postalCode
                - country
                - countryCode
              type: object
              title: WebsetItemCompanyHeadquarters
              description: 公司总部的结构化地址
              nullable: true
            financials:
              properties:
                revenueAnnual:
                  type: number
                  description: 公司的年收入（美元）
                  nullable: true
                fundingTotal:
                  type: number
                  description: 公司融资总额（美元）
                  nullable: true
                fundingLatestRound:
                  properties:
                    name:
                      type: string
                      description: 融资轮次名称（例如 A 轮）
                      nullable: true
                    date:
                      type: string
                      description: 融资轮次的日期
                      nullable: true
                    amount:
                      type: number
                      description: 该轮融资金额（美元）
                      nullable: true
                  required:
                    - name
                    - date
                    - amount
                  type: object
                  title: WebsetItemCompanyFundingRound
                  description: 最新一轮融资
                  nullable: true
              required:
                - revenueAnnual
                - fundingTotal
                - fundingLatestRound
              type: object
              title: WebsetItemCompanyFinancials
              description: 公司的财务信息
              nullable: true
            webTraffic:
              properties:
                visitsMonthly:
                  type: number
                  description: 估算的每月网站访问量
                  nullable: true
                uniqueVisitors:
                  type: number
                  description: 估算的每月独立访客数
                  nullable: true
              required:
                - visitsMonthly
                - uniqueVisitors
              type: object
              title: WebsetItemCompanyWebTraffic
              description: Web traffic metrics for the company
              nullable: true
          required:
            - name
            - location
            - employees
            - industry
            - about
            - logoUrl
            - foundedYear
            - headquarters
            - financials
            - webTraffic
          title: WebsetItemCompanyPropertiesFields
          type: object
        type:
          type: string
          const: company
          default: company
      required:
        - type
        - url
        - description
        - content
        - company
      title: Company
      type: object
    WebsetItemArticleProperties:
      properties:
        url:
          format: uri
          description: The URL of the article
          type: string
        description:
          description: Short description of the relevance of the article
          type: string
        content:
          type: string
          description: The text content for the article
          nullable: true
        article:
          properties:
            title:
              type: string
              description: The title of the article
              nullable: true
            author:
              type: string
              description: The author(s) of the article
              nullable: true
            publishedAt:
              type: string
              description: The date and time the article was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemArticlePropertiesFields
          type: object
        type:
          type: string
          const: article
          default: article
      required:
        - type
        - url
        - description
        - content
        - article
      title: Article
      type: object
    WebsetItemResearchPaperProperties:
      properties:
        url:
          format: uri
          description: The URL of the research paper
          type: string
        description:
          description: Short description of the relevance of the research paper
          type: string
        content:
          type: string
          description: The text content of the research paper
          nullable: true
        researchPaper:
          properties:
            title:
              type: string
              description: The title of the research paper
              nullable: true
            author:
              type: string
              description: The author(s) of the research paper
              nullable: true
            publishedAt:
              type: string
              description: The date and time the research paper was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemResearchPaperPropertiesFields
          type: object
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
        - url
        - description
        - content
        - researchPaper
      title: Research Paper
      type: object
    WebsetItemCustomProperties:
      properties:
        url:
          format: uri
          description: The URL of the Item
          type: string
        description:
          description: Short description of the Item
          type: string
        content:
          type: string
          description: The text content of the Item
          nullable: true
        custom:
          properties:
            title:
              type: string
              description: The title of the website
              nullable: true
            author:
              type: string
              description: The author(s) of the website
              nullable: true
            publishedAt:
              type: string
              description: The date and time the website was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemCustomPropertiesFields
          type: object
        type:
          type: string
          const: custom
          default: custom
      required:
        - type
        - url
        - description
        - content
        - custom
      title: Custom
      type: object
    WebsetItemEvaluation:
      properties:
        criterion:
          description: The description of the criterion
          type: string
        reasoning:
          description: The reasoning for the result of the evaluation
          type: string
        satisfied:
          enum:
            - 'yes'
            - 'no'
            - unclear
          description: The satisfaction of the criterion
          type: string
        references:
          default: []
          description: The references used to generate the result.
          items:
            properties:
              title:
                type: string
                description: The title of the reference
                nullable: true
              snippet:
                type: string
                description: The relevant snippet of the reference content
                nullable: true
              url:
                format: uri
                description: The URL of the reference
                type: string
            required:
              - title
              - snippet
              - url
            type: object
          type: array
      required:
        - criterion
        - reasoning
        - satisfied
      type: object
    EnrichmentResult:
      properties:
        object:
          const: enrichment_result
          default: enrichment_result
          type: string
        status:
          enum:
            - pending
            - completed
            - canceled
          description: The status of the enrichment result.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
        result:
          items:
            type: string
          type: array
          description: The result of the enrichment.
          nullable: true
        reasoning:
          type: string
          description: The reasoning for the result when an Agent is used.
          nullable: true
        references:
          items:
            properties:
              title:
                type: string
                description: The title of the reference
                nullable: true
              snippet:
                type: string
                description: The relevant snippet of the reference content
                nullable: true
              url:
                format: uri
                description: The URL of the reference
                type: string
            required:
              - title
              - snippet
              - url
            type: object
          description: The references used to generate the result.
          type: array
        enrichmentId:
          description: The id of the Enrichment that generated the result
          type: string
      required:
        - object
        - status
        - format
        - result
        - reasoning
        - references
        - enrichmentId
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