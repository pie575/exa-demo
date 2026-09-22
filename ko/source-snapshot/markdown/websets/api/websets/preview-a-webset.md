> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# webset 미리보기 {#preview-a-webset}

> webset을 생성하기 전에 검색 질의가 어떻게 분해되는지 미리 확인합니다. 이 엔드포인트는 webset 생성 시 수행되는 질의 분석과 동일한 분석을 실행하므로, 감지된 엔티티 유형, 생성된 search criteria, 사용 가능한 enrichment 열을 미리 확인할 수 있습니다.

사용자가 전체 webset 생성을 진행하기 전에 자신의 검색이 어떻게 해석될지 파악하도록 돕는 데 활용하세요.

## OpenAPI {#openapi}

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
          description: 회사와의 관련성에 대한 간단한 설명
          type: string
        content:
          type: string
          description: 회사 웹사이트의 텍스트 콘텐츠
          nullable: true
        company:
          properties:
            name:
              description: 회사의 이름
              type: string
            location:
              type: string
              description: 회사의 주요 위치
              nullable: true
            employees:
              type: integer
              description: 회사의 직원 수
              nullable: true
            industry:
              type: string
              description: 회사의 산업 분야
              nullable: true
            about:
              type: string
              description: 회사에 대한 간단한 설명
              nullable: true
            logoUrl:
              format: uri
              type: string
              description: 회사의 로고 URL
              nullable: true
            foundedYear:
              type: number
              description: 회사가 설립된 연도
              nullable: true
            headquarters:
              properties:
                address:
                  type: string
                  description: 본사의 도로명 주소
                  nullable: true
                city:
                  type: string
                  description: 본사가 위치한 도시
                  nullable: true
                state:
                  type: string
                  description: 본사가 위치한 주 또는 지역
                  nullable: true
                postalCode:
                  type: string
                  description: 본사의 우편번호
                  nullable: true
                country:
                  type: string
                  description: 본사가 위치한 국가
                  nullable: true
                countryCode:
                  type: string
                  description: 본사의 ISO 국가 코드
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
              description: 회사의 구조화된 본사 주소
              nullable: true
            financials:
              properties:
                revenueAnnual:
                  type: number
                  description: 회사의 연간 매출 (USD)
                  nullable: true
                fundingTotal:
                  type: number
                  description: 회사가 조달한 총 투자금 (USD)
                  nullable: true
                fundingLatestRound:
                  properties:
                    name:
                      type: string
                      description: 투자 라운드의 이름 (예: 시리즈 A)
                      nullable: true
                    date:
                      type: string
                      description: 투자 라운드의 날짜
                      nullable: true
                    amount:
                      type: number
                      description: 해당 투자 라운드에서 조달한 금액 (USD)
                      nullable: true
                  required:
                    - name
                    - date
                    - amount
                  type: object
                  title: WebsetItemCompanyFundingRound
                  description: 최신 투자 라운드
                  nullable: true
              required:
                - revenueAnnual
                - fundingTotal
                - fundingLatestRound
              type: object
              title: WebsetItemCompanyFinancials
              description: 회사에 대한 재무 정보
              nullable: true
            webTraffic:
              properties:
                visitsMonthly:
                  type: number
                  description: 예상 월간 웹사이트 방문 수
                  nullable: true
                uniqueVisitors:
                  type: number
                  description: 예상 월간 순 방문자 수
                  nullable: true
              required:
                - visitsMonthly
                - uniqueVisitors
              type: object
              title: WebsetItemCompanyWebTraffic
              description: 회사의 웹 트래픽 지표
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
          description: 기사의 URL
          type: string
        description:
          description: 기사와의 관련성에 대한 간단한 설명
          type: string
        content:
          type: string
          description: 기사의 텍스트 콘텐츠
          nullable: true
        article:
          properties:
            title:
              type: string
              description: 기사의 제목
              nullable: true
            author:
              type: string
              description: 기사의 저자
              nullable: true
            publishedAt:
              type: string
              description: 기사가 게시된 날짜와 시간
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
          description: 연구 논문의 URL
          type: string
        description:
          description: 연구 논문과의 관련성에 대한 간단한 설명
          type: string
        content:
          type: string
          description: 연구 논문의 텍스트 콘텐츠
          nullable: true
        researchPaper:
          properties:
            title:
              type: string
              description: 연구 논문의 제목
              nullable: true
            author:
              type: string
              description: 연구 논문의 저자
              nullable: true
            publishedAt:
              type: string
              description: 연구 논문이 게시된 날짜와 시간
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
          description: 항목의 URL
          type: string
        description:
          description: 항목에 대한 간단한 설명
          type: string
        content:
          type: string
          description: 항목의 텍스트 콘텐츠
          nullable: true
        custom:
          properties:
            title:
              type: string
              description: 웹사이트의 제목
              nullable: true
            author:
              type: string
              description: 웹사이트의 저자
              nullable: true
            publishedAt:
              type: string
              description: 웹사이트가 게시된 날짜와 시간
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
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key> 를 사용하여
        인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key> 를 사용하여
        인증할 수도 있습니다.
```