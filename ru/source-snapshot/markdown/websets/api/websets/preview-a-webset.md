> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем изучать документацию дальше.

<div id="preview-a-webset">
  # Предпросмотр webset
</div>

> Посмотрите, как поисковый запрос будет разложен на составляющие, ещё до создания webset. Этот эндпоинт выполняет тот же анализ запроса, что и при создании webset, позволяя заранее увидеть определённый тип сущности, сформированные критерии search и доступные колонки enrichment.

Используйте его, чтобы помочь пользователям понять, как будет интерпретирован их search, прежде чем переходить к полноценному созданию webset.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml POST /v0/websets/preview
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
  /v0/websets/preview:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Websets Preview
      summary: Preview a webset
      description: >-
        Preview how a search query will be decomposed before creating a webset.
        This endpoint performs the same query analysis that happens during
        webset creation, allowing you to see the detected entity type, generated
        search criteria, and available enrichment columns in advance.


        Use this to help users understand how their search will be interpreted
        before committing to a full webset creation.
      operationId: websets-preview
      parameters:
        - in: query
          name: search
          schema:
            type: boolean
          required: false
          description: Whether you want to search for a preview list of items or not
      requestBody:
        required: true
        description: Search parameters
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PreviewWebsetParameters'
      responses:
        '200':
          description: Preview of the webset
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
                $ref: '#/components/schemas/PreviewWebsetResponse'
        '422':
          description: Unable to detect entity or criteria from query
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
    PreviewWebsetParameters:
      properties:
        search:
          properties:
            query:
              minLength: 1
              maxLength: 5000
              description: >-
                Natural language search query describing what you are looking
                for.


                Be specific and descriptive about your requirements,
                characteristics, and any constraints that help narrow down the
                results.
              examples:
                - >-
                  Marketing agencies based in the US, that focus on consumer
                  products. Get brands worked with and city
                - AI startups in Europe that raised Series A funding in 2024
                - SaaS companies with 50-200 employees in the fintech space
              type: string
            entity:
              $ref: '#/components/schemas/Entity'
              description: >-
                Entity used to inform the decomposition.


                It is not required to provide it, we automatically detect the
                entity from all the information provided in the query. Only use
                this when you need more fine control.
            count:
              default: 10
              description: >-
                When query parameter search=true, the number of preview items to
                return.
              minimum: 1
              maximum: 10
              type: number
          required:
            - query
          type: object
      required:
        - search
      type: object
    PreviewWebsetResponse:
      properties:
        search:
          properties:
            entity:
              description: Detected entity from the query.
              oneOf:
                - $ref: '#/components/schemas/CompanyEntity'
                - $ref: '#/components/schemas/PersonEntity'
                - $ref: '#/components/schemas/ArticleEntity'
                - $ref: '#/components/schemas/ResearchPaperEntity'
                - $ref: '#/components/schemas/CustomEntity'
            criteria:
              items:
                properties:
                  description:
                    type: string
                required:
                  - description
                type: object
              description: Detected criteria from the query.
              type: array
          required:
            - entity
            - criteria
          type: object
        enrichments:
          items:
            properties:
              description:
                description: Description of the enrichment.
                type: string
              format:
                enum:
                  - text
                  - date
                  - number
                  - options
                  - email
                  - phone
                  - url
                description: Format of the enrichment.
                type: string
              options:
                description: When format is options, the options detected from the query.
                items:
                  properties:
                    label:
                      description: Label of the option.
                      type: string
                  required:
                    - label
                  type: object
                type: array
            required:
              - description
              - format
            type: object
          description: Detected enrichments from the query.
          type: array
        items:
          items:
            $ref: '#/components/schemas/WebsetItemPreview'
          description: Preview items matching the search criteria.
          type: array
      required:
        - search
        - enrichments
        - items
      type: object
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
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
    WebsetItemPreview:
      properties:
        id:
          description: The unique identifier for the preview item
          type: string
        properties:
          description: The properties of the preview item
          oneOf:
            - $ref: '#/components/schemas/WebsetItemPersonProperties'
            - $ref: '#/components/schemas/WebsetItemCompanyProperties'
            - $ref: '#/components/schemas/WebsetItemArticleProperties'
            - $ref: '#/components/schemas/WebsetItemResearchPaperProperties'
            - $ref: '#/components/schemas/WebsetItemCustomProperties'
        createdAt:
          format: date-time
          description: The date and time the preview was created
          type: string
      required:
        - id
        - properties
        - createdAt
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
                  description: The country of the headquarters
                  nullable: true
                countryCode:
                  type: string
                  description: The ISO country code of the headquarters
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
              description: The structured headquarters address of the company
              nullable: true
            financials:
              properties:
                revenueAnnual:
                  type: number
                  description: The annual revenue of the company (USD)
                  nullable: true
                fundingTotal:
                  type: number
                  description: The total funding raised by the company (USD)
                  nullable: true
                fundingLatestRound:
                  properties:
                    name:
                      type: string
                      description: The name of the funding round (e.g. Series A)
                      nullable: true
                    date:
                      type: string
                      description: The date of the funding round
                      nullable: true
                    amount:
                      type: number
                      description: The amount raised in the funding round (USD)
                      nullable: true
                  required:
                    - name
                    - date
                    - amount
                  type: object
                  title: WebsetItemCompanyFundingRound
                  description: The latest funding round
                  nullable: true
              required:
                - revenueAnnual
                - fundingTotal
                - fundingLatestRound
              type: object
              title: WebsetItemCompanyFinancials
              description: Financial information about the company
              nullable: true
            webTraffic:
              properties:
                visitsMonthly:
                  type: number
                  description: The estimated monthly website visits
                  nullable: true
                uniqueVisitors:
                  type: number
                  description: The estimated monthly unique visitors
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