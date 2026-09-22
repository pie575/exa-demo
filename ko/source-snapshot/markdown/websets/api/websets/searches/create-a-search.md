> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# search 생성 {#create-a-search}

> Webset에 대한 새로운 search를 생성합니다.

기본 동작은 이전 search 결과를 재사용해 새로운 criteria로 평가하는 것입니다.

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /v0/websets/{webset}/searches
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
  /v0/websets/{webset}/searches:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Searches
      summary: Create a Search
      description: >-
        Creates a new Search for the Webset.


        The default behavior is to reuse the previous Search results and
        evaluate them against the new criteria.
      operationId: websets-searches-create
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: The id of the Webset
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateWebsetSearchParameters'
      responses:
        '200':
          description: Webset Search created
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
                $ref: '#/components/schemas/WebsetSearch'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    CreateWebsetSearchParameters:
      properties:
        count:
          minimum: 1
          description: >-
            Number of Items the Search will attempt to find.


            The actual number of Items found may be less than this number
            depending on the query complexity.
          type: number
        query:
          minLength: 1
          maxLength: 5000
          description: >-
            Natural language search query describing what you are looking for.


            Be specific and descriptive about your requirements,
            characteristics, and any constraints that help narrow down the
            results.


            Any URLs provided will be crawled and used as additional context for
            the search.
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
            Entity the search will return results for.


            It is not required to provide it, we automatically detect the entity
            from all the information provided in the query. Only use this when
            you need more fine control.
        criteria:
          description: >-
            Criteria every item is evaluated against.


            It's not required to provide your own criteria, we automatically
            detect the criteria from all the information provided in the query.
            Only use this when you need more fine control.
          minItems: 1
          maxItems: 5
          items:
            $ref: '#/components/schemas/CreateCriterionParameters'
            title: CreateCriterionParameters
          type: array
        maxPeoplePerCompany:
          description: >-
            Optional soft cap for people searches. When set, the search will try
            to include at most this many matching people from the same current
            employer company.
          minimum: 1
          type: integer
        exclude:
          description: >-
            Sources (existing imports or websets) to exclude from search
            results. Any results found within these sources will be omitted to
            prevent finding them during search.
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                minLength: 1
                description: The ID of the source to exclude.
                type: string
            required:
              - source
              - id
            type: object
          type: array
        scope:
          description: >-
            Limit the search to specific sources (existing imports). Any results
            found within these sources matching the search criteria will be
            included in the Webset.
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                minLength: 1
                description: The ID of the source to search.
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
          type: array
        recall:
          description: >-
            Whether to provide an estimate of how many total relevant results
            could exist for this search.

            Result of the analysis will be available in the `recall` field
            within the search request.
          type: boolean
        behavior:
          $ref: '#/components/schemas/WebsetSearchBehavior'
          default: override
          description: >-
            How this search interacts with existing items in the Webset:


            - **override**: Replace existing items and evaluate all items
            against new criteria

            - **append**: Add new items to existing ones, keeping items that
            match the new criteria
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
      required:
        - count
        - query
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

            - `append`: 검색은 새로 찾은 항목을 기존 Webset에 추가합니다. 새 기준과
            일치하지 않는 항목은 모두 폐기됩니다.
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
            검색 중 특정 결과가 발견되지 않도록 제외하는 데 사용되는
            소스(기존 임포트 또는 websets)입니다.
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
                      찾고자 하는 엔티티가 제공된 소스에 포함된 엔티티와
                      어떤 관계에 있는지를 나타냅니다.
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
            검색 범위입니다. 기본적으로 범위가 없으므로 웹 전체를 검색합니다.


            생성 시 제공되면 검색은 제공된 소스에서만 수행됩니다.
          type: array
        progress:
          properties:
            found:
              description: 지금까지 발견된 결과 수
              type: number
            analyzed:
              description: 지금까지 분석된 결과 수
              type: number
            completion:
              minimum: 0
              maximum: 100
              description: 검색의 완료 비율
              type: number
            timeLeft:
              type: number
              description: 남은 예상 시간(초), 알 수 없으면 null
              nullable: true
          required:
            - found
            - analyzed
            - completion
            - timeLeft
          description: 검색의 진행 상황
          type: object
        recall:
          properties:
            expected:
              properties:
                total:
                  description: 잠재적 일치 항목의 추정 총 개수
                  type: number
                confidence:
                  enum:
                    - high
                    - medium
                    - low
                  description: 추정치에 대한 신뢰도
                  type: string
                bounds:
                  properties:
                    min:
                      description: 잠재적 일치 항목의 최소 추정 총 개수
                      type: number
                    max:
                      description: 잠재적 일치 항목의 최대 추정 총 개수
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
              description: 추정에 대한 근거
              type: string
          required:
            - expected
            - reasoning
          type: object
          description: >-
            검색에 대한 재현율 지표이며, 아직 계산되지 않았거나 요청되지 않은
            경우 null입니다.
          nullable: true
        metadata:
          default: {}
          description: 이 객체에 연결하려는 키-값 쌍의 집합입니다.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        canceledAt:
          format: date-time
          type: string
          description: 검색이 취소된 날짜 및 시간
          nullable: true
        canceledReason:
          $ref: '#/components/schemas/WebsetSearchCanceledReason'
          description: 검색이 취소된 이유
          nullable: true
        createdAt:
          format: date-time
          description: 검색이 생성된 날짜 및 시간
          type: string
        updatedAt:
          format: date-time
          description: 검색이 업데이트된 날짜 및 시간
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
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
    CreateCriterionParameters:
      properties:
        description:
          minLength: 1
          maxLength: 1000
          description: 기준에 대한 설명
          type: string
      required:
        - description
      type: object
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
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>
        방식으로 인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>
        방식으로 인증할 수도 있습니다.
```