> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在进一步浏览之前，可通过该文件了解所有可用页面。

<div id="get-a-websets-monitor">
  # 获取 Websets monitor
</div>

> 获取指定的 monitor。

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/monitors/{id}
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
  /v0/monitors/{id}:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors
      summary: 获取监控器
      description: 获取指定的监控器。
      operationId: monitors-get
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: 监控器的 id
          required: true
      responses:
        '200':
          description: 监控器详情
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 请求的唯一标识符。
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
    Monitor:
      properties:
        id:
          description: 监控器的唯一标识符
          type: string
        object:
          enum:
            - monitor
          description: 对象类型
          type: string
        status:
          enum:
            - enabled
            - disabled
          description: 监控器的状态
          type: string
        websetId:
          description: 监控器所属 Webset 的 id
          type: string
        cadence:
          properties:
            cron:
              description: >-
                监控器运行频率的 Cron 表达式（必须是包含 5 个字段的有效 Unix
                cron）。该计划每天最多只能触发一次。
              type: string
            timezone:
              default: Etc/UTC
              description: IANA 时区（例如 "America/New_York"）
              type: string
          required:
            - cron
          description: 监控器的运行频率
          type: object
        behavior:
          properties:
            config:
              properties:
                query:
                  description: >-
                    要搜索的查询语句。默认情况下，将使用上一次搜索的查询语句。
                  minLength: 2
                  maxLength: 10000
                  type: string
                criteria:
                  description: >-
                    要搜索的条件。默认情况下，将使用上一次搜索的条件。
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
                    要搜索的实体。默认情况下，将使用上一次搜索/导入的实体。
                count:
                  exclusiveMinimum: 0
                  description: 要查找的最大结果数
                  type: number
                behavior:
                  default: append
                  description: 该搜索被添加到 Webset 时的行为。
                  enum:
                    - override
                    - append
                  type: string
              required:
                - count
              description: >-
                指定监控器的搜索参数。


                默认情况下，若未提供任何参数，将使用上一次搜索的搜索参数（查询语句、实体和条件）。
              type: object
            type:
              type: string
              const: search
              default: search
          required:
            - type
            - config
          description: 监控器运行时执行的行为
          type: object
        lastRun:
          $ref: '#/components/schemas/MonitorRun'
          title: MonitorRun
          description: 监控器的上一次运行
          nullable: true
        nextRunAt:
          format: date-time
          type: string
          description: 下一次运行将发生的日期和时间
          nullable: true
        metadata:
          description: 您希望与此对象关联的一组键值对。
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
          description: 监控器运行的唯一标识符
          type: string
        object:
          enum:
            - monitor_run
          description: 对象类型
          type: string
        monitorId:
          description: 该运行所关联的监控器
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: 监控器运行的状态
          type: string
        completedAt:
          format: date-time
          type: string
          description: 运行完成的时间
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: 运行失败的时间
          nullable: true
        failedReason:
          type: string
          description: 运行失败的原因
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: 运行被取消的时间
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: 运行的创建时间
        updatedAt:
          type: string
          format: date-time
          description: 运行的最后更新时间
        type:
          type: string
          enum:
            - search
            - refresh
          description: 监控器运行的类型
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
        在 x-api-key 标头中传入您的 Exa API 密钥。您也可以使用 Authorization: Bearer <key>
        进行身份验证。
    bearer:
      type: http
      scheme: bearer
      description: >-
        在 x-api-key 标头中传入您的 Exa API 密钥。您也可以使用 Authorization: Bearer <key>
        进行身份验证。
```