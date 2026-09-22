> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Websets monitor 생성 {#create-a-websets-monitor}

> 새로운 `Monitor`를 생성해 Websets를 최신 데이터로 계속 업데이트합니다.

monitor는 지정한 일정에 따라 자동으로 실행되어, 수동 개입 없이도 Websets를 항상 최신 상태로 유지합니다:

* **새로운 콘텐츠 찾기**: `search` 작업을 실행해 criteria에 부합하는 새로운 item을 찾습니다
* **기존 콘텐츠 업데이트**: `refresh` 작업을 실행해 item의 contents와 enrichment를 업데이트합니다
* **자동 일정 관리**: `cron` 표현식과 `timezone`을 설정해 일정을 정밀하게 제어합니다

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /v0/monitors
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
  /v0/monitors:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Monitors
      summary: Monitor 생성
      description: >-
        Websets를 새로운 데이터로 계속 업데이트하도록 새 `Monitor`를
        생성합니다.


        Monitors는 정의한 일정에 따라 자동으로 실행되어 수동 개입 없이도
        Websets를 최신 상태로 유지합니다:


        - **새 콘텐츠 찾기**: `search` 작업을 실행해 criteria에 부합하는
        새로운 item을 찾습니다

        - **기존 콘텐츠 업데이트**: `refresh` 작업을 실행해 item의 콘텐츠와
        enrichment를 업데이트합니다

        - **자동 일정 관리**: `cron` 표현식과 `timezone`을 설정해 일정을
        정밀하게 제어합니다
      operationId: monitors-create
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateMonitorParameters'
      responses:
        '201':
          description: Monitor가 성공적으로 생성되었습니다
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 요청의 고유 식별자입니다.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Monitor'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    CreateMonitorParameters:
      properties:
        websetId:
          description: Webset의 id
          type: string
        cadence:
          properties:
            cron:
              description: >-
                monitor 주기를 지정하는 cron 표현식입니다(5개 field로 구성된
                유효한 Unix cron이어야 합니다). 일정은 하루에 최대 한 번만
                실행되어야 합니다.
              type: string
            timezone:
              default: Etc/UTC
              description: IANA 시간대 (예: "America/New_York")
              type: string
          required:
            - cron
          description: monitor가 실행되는 빈도
          type: object
        behavior:
          properties:
            config:
              properties:
                query:
                  description: >-
                    검색할 질의입니다. 기본적으로 마지막 search의 질의가
                    사용됩니다.
                  minLength: 2
                  maxLength: 10000
                  type: string
                criteria:
                  description: >-
                    검색에 사용할 criteria입니다. 기본적으로 마지막 search의
                    criteria가 사용됩니다.
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
                    검색할 엔티티입니다. 기본적으로 마지막 search/import의
                    엔티티가 사용됩니다.
                count:
                  exclusiveMinimum: 0
                  description: 찾을 결과의 최대 개수
                  type: number
                behavior:
                  default: append
                  description: search가 Webset에 추가될 때의 동작 방식입니다.
                  enum:
                    - override
                    - append
                  type: string
              required:
                - count
              description: >-
                Monitor에 사용할 search parameters를 지정합니다.


                parameters를 제공하지 않으면 기본적으로 마지막 search의
                search parameters(질의, 엔티티, criteria)가 사용됩니다.
              type: object
            type:
              type: string
              const: search
              default: search
          required:
            - type
            - config
          description: monitor가 실행될 때 수행할 동작
          type: object
        metadata:
          propertyNames:
            type: string
          additionalProperties:
            type: string
          type: object
      required:
        - websetId
        - cadence
        - behavior
      type: object
    Monitor:
      properties:
        id:
          description: Monitor의 고유 식별자
          type: string
        object:
          enum:
            - monitor
          description: 객체의 유형
          type: string
        status:
          enum:
            - enabled
            - disabled
          description: Monitor의 상태
          type: string
        websetId:
          description: Monitor가 속한 Webset의 id
          type: string
        cadence:
          properties:
            cron:
              description: >-
                monitor 주기를 지정하는 cron 표현식입니다(5개 field로 구성된
                유효한 Unix cron이어야 합니다). 일정은 하루에 최대 한 번만
                실행되어야 합니다.
              type: string
            timezone:
              default: Etc/UTC
              description: IANA 시간대 (예: "America/New_York")
              type: string
          required:
            - cron
          description: monitor가 실행되는 빈도
          type: object
        behavior:
          properties:
            config:
              properties:
                query:
                  description: >-
                    검색할 질의입니다. 기본적으로 마지막 search의 질의가
                    사용됩니다.
                  minLength: 2
                  maxLength: 10000
                  type: string
                criteria:
                  description: >-
                    검색에 사용할 criteria입니다. 기본적으로 마지막 search의
                    criteria가 사용됩니다.
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
                    검색할 엔티티입니다. 기본적으로 마지막 search/import의
                    엔티티가 사용됩니다.
                count:
                  exclusiveMinimum: 0
                  description: 찾을 결과의 최대 개수
                  type: number
                behavior:
                  default: append
                  description: search가 Webset에 추가될 때의 동작 방식입니다.
                  enum:
                    - override
                    - append
                  type: string
              required:
                - count
              description: >-
                Monitor에 사용할 search parameters를 지정합니다.


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