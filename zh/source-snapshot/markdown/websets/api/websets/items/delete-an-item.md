> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件查看所有可用页面。

# 删除项目 {#delete-an-item}

> 从 Webset 中删除一个项目。

此操作将取消该项目正在进行的所有增强处理。

## OpenAPI {#openapi}

```yaml exa-spec.yaml DELETE /v0/websets/{webset}/items/{id}
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
  /v0/websets/{webset}/items/{id}:
    servers:
      - url: https://api.exa.ai/websets
    delete:
      tags:
        - Items
      summary: Delete an Item
      description: |-
        Deletes an Item from the Webset.

        This will cancel any enrichment process for it.
      operationId: websets-items-delete
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: The id or externalId of the Webset
          required: true
        - in: path
          name: id
          schema:
            type: string
          description: The id of the Webset item
          required: true
      responses:
        '200':
          description: Webset Item deleted
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
                $ref: '#/components/schemas/WebsetItem'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
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
    WebsetItemPersonProperties:
      properties:
        url:
          format: uri
          description: The URL of the person profile
          type: string
        description:
          description: Short description of the relevance of the person
          type: string
        person:
          properties:
            name:
              description: The name of the person
              type: string
            location:
              type: string
              description: The location of the person
              nullable: true
            position:
              type: string
              description: The current work position of the person
              nullable: true
            company:
              properties:
                name:
                  description: The name of the company
                  type: string
                location:
                  type: string
                  description: The location the person is working at the company
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
              description: The image URL of the person
              nullable: true
            workHistory:
              items:
                properties:
                  title:
                    type: string
                    description: Job title or position
                    nullable: true
                  location:
                    type: string
                    description: Work location
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: Start date
                        nullable: true
                      to:
                        type: string
                        description: End date
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: Employment dates
                    nullable: true
                  company:
                    properties:
                      id:
                        type: string
                        description: Entity ID of the company
                        nullable: true
                      name:
                        type: string
                        description: Company name
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: LinkedIn URL of the company
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
              description: The work history of the person
              type: array
            educationHistory:
              items:
                properties:
                  degree:
                    type: string
                    description: Degree obtained
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: Start date
                        nullable: true
                      to:
                        type: string
                        description: End date
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: Education dates
                    nullable: true
                  institution:
                    properties:
                      id:
                        type: string
                        description: Entity ID of the institution
                        nullable: true
                      name:
                        type: string
                        description: Institution name
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: LinkedIn URL of the institution
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
              description: The education history of the person
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
          description: The URL of the company website
          type: string
        description:
          description: Short description of the relevance of the company
          type: string
        content:
          type: string
          description: The text content of the company website
          nullable: true
        company:
          properties:
            name:
              description: The name of the company
              type: string
            location:
              type: string
              description: The main location of the company
              nullable: true
            employees:
              type: integer
              description: The number of employees of the company
              nullable: true
            industry:
              type: string
              description: The industry of the company
              nullable: true
            about:
              type: string
              description: A short description of the company
              nullable: true
            logoUrl:
              format: uri
              type: string
              description: The logo URL of the company
              nullable: true
            foundedYear:
              type: number
              description: The year the company was founded
              nullable: true
            headquarters:
              properties:
                address:
                  type: string
                  description: The street address of the headquarters
                  nullable: true
                city:
                  type: string
                  description: The city of the headquarters
                  nullable: true
                state:
                  type: string
                  description: The state or region of the headquarters
                  nullable: true
                postalCode:
                  type: string
                  description: The postal code of the headquarters
                  nullable: true
                country:
                  type: string
                  description: 总部所在国家
                  nullable: true
                countryCode:
                  type: string
                  description: 总部所在国家的 ISO 国家代码
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
                  description: 公司的年营收（美元）
                  nullable: true
                fundingTotal:
                  type: number
                  description: 公司累计融资总额（美元）
                  nullable: true
                fundingLatestRound:
                  properties:
                    name:
                      type: string
                      description: 融资轮次的名称（例如 Series A）
                      nullable: true
                    date:
                      type: string
                      description: 融资轮次的日期
                      nullable: true
                    amount:
                      type: number
                      description: 该轮融资的金额（美元）
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
                  description: 预估的每月网站访问量
                  nullable: true
                uniqueVisitors:
                  type: number
                  description: 预估的每月独立访客数
                  nullable: true
              required:
                - visitsMonthly
                - uniqueVisitors
              type: object
              title: WebsetItemCompanyWebTraffic
              description: 公司的网站流量指标
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
          description: 文章的 URL
          type: string
        description:
          description: 该文章相关性的简短说明
          type: string
        content:
          type: string
          description: 文章的文本内容
          nullable: true
        article:
          properties:
            title:
              type: string
              description: 文章的标题
              nullable: true
            author:
              type: string
              description: 文章的作者
              nullable: true
            publishedAt:
              type: string
              description: 文章的发布日期和时间
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
          description: 研究论文的 URL
          type: string
        description:
          description: 该研究论文相关性的简短说明
          type: string
        content:
          type: string
          description: 研究论文的文本内容
          nullable: true
        researchPaper:
          properties:
            title:
              type: string
              description: 研究论文的标题
              nullable: true
            author:
              type: string
              description: 研究论文的作者
              nullable: true
            publishedAt:
              type: string
              description: 研究论文的发布日期和时间
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
          description: 该项目的 URL
          type: string
        description:
          description: 该项目的简短说明
          type: string
        content:
          type: string
          description: 该项目的文本内容
          nullable: true
        custom:
          properties:
            title:
              type: string
              description: 网站的标题
              nullable: true
            author:
              type: string
              description: 网站的作者
              nullable: true
            publishedAt:
              type: string
              description: 网站的发布日期和时间
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
          description: 该 criterion 的描述
          type: string
        reasoning:
          description: 该评估结果的推理过程
          type: string
        satisfied:
          enum:
            - 'yes'
            - 'no'
            - unclear
          description: 是否满足该 criterion
          type: string
        references:
          default: []
          description: 用于生成该结果的参考来源。
          items:
            properties:
              title:
                type: string
                description: 参考来源的标题
                nullable: true
              snippet:
                type: string
                description: 参考来源内容中的相关片段
                nullable: true
              url:
                format: uri
                description: 参考来源的 URL
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
          description: 增强结果的状态。
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
        result:
          items:
            type: string
          type: array
          description: 增强的结果。
          nullable: true
        reasoning:
          type: string
          description: 使用 agent 时该结果的推理过程。
          nullable: true
        references:
          items:
            properties:
              title:
                type: string
                description: 参考来源的标题
                nullable: true
              snippet:
                type: string
                description: 参考来源内容中的相关片段
                nullable: true
              url:
                format: uri
                description: 参考来源的 URL
                type: string
            required:
              - title
              - snippet
              - url
            type: object
          description: 用于生成该结果的参考来源。
          type: array
        enrichmentId:
          description: 生成该结果的 Enrichment 的 id
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
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        请在 x-api-key header 中传入你的 Exa API 密钥。你也可以使用
        Authorization: Bearer <key> 进行认证。
    bearer:
      type: http
      scheme: bearer
      description: >-
        请在 x-api-key header 中传入你的 Exa API 密钥。你也可以使用
        使用 Authorization: Bearer <key>。
```