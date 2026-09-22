> ## 文档索引 {#documentation-index}
>
> 完整的文档索引请访问：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

# 创建运行 {#create-a-run}

> 创建一个异步 Agent 运行。除非请求服务器发送事件，否则响应会立即返回运行对象。

使用自然语言 `query` 创建运行。可添加 `outputSchema` 以获得经过校验的结构化 JSON，用 `input.data` 传入待处理的数据行，用 `input.exclusion` 指定需要排除的记录或实体，或用 `previousRunId` 从已完成的运行继续。

设置 `Accept: text/event-stream`，即可在运行创建、启动和完成时流式接收运行事件。

<Note>
  **Connect：** 传入 `dataSources`，让 agent 在运行期间访问第三方数据提供方。详见 [Connect 指南](/zh/docs/agent/quickstart#connect-data-sources)。
</Note>

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /agent/runs
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
  /agent/runs:
    post:
      tags:
        - Agent
      summary: Create a run
      description: >-
        Create an asynchronous Agent run. By default, the API returns the run
        object immediately. Set `Accept: text/event-stream` to stream run
        lifecycle events until the run reaches a terminal status.
      operationId: createAgentRun
      parameters:
        - $ref: '#/components/parameters/AcceptHeader'
        - $ref: '#/components/parameters/ExaBetaHeader'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateAgentRunRequest'
            examples:
              simple:
                summary: Simple research run
                value:
                  query: >-
                    What are the most important AI infrastructure funding rounds
                    announced this week?
              structuredOutput:
                summary: Structured output
                value:
                  query: >-
                    Find recent Series A or Series B AI infrastructure funding
                    rounds.
                  outputSchema:
                    type: object
                    required:
                      - companies
                    properties:
                      companies:
                        type: array
                        maxItems: 10
                        items:
                          type: object
                          required:
                            - name
                            - round
                            - amount
                            - sourceUrl
                          properties:
                            name:
                              type: string
                            round:
                              type: string
                            amount:
                              type: string
                            sourceUrl:
                              type: string
                              format: uri
              inputRows:
                summary: Process input rows
                value:
                  query: >-
                    For each company, find one current executive and cite a
                    source.
                  input:
                    data:
                      - company: Apple
                        domain: apple.com
                      - company: Microsoft
                        domain: microsoft.com
                    exclusion:
                      - company: Apple
                        person: Tim Cook
              contactFields:
                summary: Contact fields in structured output
                value:
                  query: >-
                    Find engineering leaders at AI infrastructure companies that
                    raised a Series A or B in the last 6 months.
                  effort: auto
                  outputSchema:
                    type: object
                    required:
                      - people
                    properties:
                      people:
                        type: array
                        maxItems: 10
                        items:
                          type: object
                          required:
                            - name
                            - linkedin_url
                          properties:
                            name:
                              type: string
                            contact_email:
                              type: string
                              format: email
                            linkedin_url:
                              type: string
                              format: uri
              dataSources:
                summary: Connect data sources
                value:
                  query: >-
                    Find 10 fast-growing B2B SaaS companies and their estimated
                    web traffic.
                  dataSources:
                    - provider: similarweb
                  outputSchema:
                    type: object
                    required:
                      - companies
                    properties:
                      companies:
                        type: array
                        maxItems: 10
                        items:
                          type: object
                          required:
                            - name
                            - domain
                            - monthlyVisits
                          properties:
                            name:
                              type: string
                            domain:
                              type: string
                            monthlyVisits:
                              type: number
                              description: from Similarweb
      responses:
        '200':
          description: Agent run created
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentRun'
              examples:
                running:
                  summary: Run accepted
                  value:
                    id: agent_run_01j7x9v0m2n4p6q8r0s2t4v6w8
                    object: agent_run
                    status: running
                    stopReason: null
                    createdAt: '2026-05-07T18:31:00.000Z'
                    completedAt: null
                    request:
                      query: >-
                        What are the most important AI infrastructure funding
                        rounds announced this week?
                    output:
                      text: ''
                      structured: null
                      grounding: []
                    usage:
                      agentComputeUnits: 0
                      searches: 0
                      emails: 0
                      phoneNumbers: 0
                    costDollars:
                      total: 0
                      agentCompute: 0
                      search: 0
                      emails: 0
                      phoneNumbers: 0
            text/event-stream:
              schema:
                $ref: '#/components/schemas/AgentRunEvent'
              examples:
                lifecycle:
                  summary: Run lifecycle events
                  value: >-
                    id: 1

                    event: agent_run.created

                    data:
                    {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}


                    id: 2

                    event: agent_run.started

                    data: {"id":"agent_run_01j...","status":"running"}


                    id: 3

                    event: agent_run.completed

                    data:
                    {"id":"agent_run_01j...","object":"agent_run","status":"completed"}
        '400':
          description: Invalid request.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '401':
          description: Team context or authentication was not found.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '429':
          description: Agent run concurrency limit reached.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '500':
          description: Server error or run timeout.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
components:
  parameters:
    AcceptHeader:
      in: header
      name: Accept
      schema:
        description: Set to `text/event-stream` to receive server-sent events.
        type: string
        enum:
          - application/json
          - text/event-stream
      description: Set to `text/event-stream` to receive server-sent events.
    ExaBetaHeader:
      in: header
      name: Exa-Beta
      schema:
        description: >-
          Comma-separated beta feature tokens for opting into experimental
          features.
        type: string
      description: >-
        Comma-separated beta feature tokens for opting into experimental
        features.
  schemas:
    CreateAgentRunRequest:
      type: object
      properties:
        query:
          type: string
          minLength: 1
          description: Natural-language question or instructions for the request.
          example: >-
            What are the most important AI infrastructure funding rounds
            announced this week?
        systemPrompt:
          type: string
          description: >-
            Additional instructions that guide generated output or agent
            behavior. Use this for source preferences, novelty constraints,
            duplication constraints, or other behavior guidance.
          example: Prefer official sources and avoid duplicate results.
        effort:
          $ref: '#/components/schemas/AgentEffort'
        input:
          type: object
          properties:
            data:
              type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: A JSON object record.
              description: Records the agent should process or enrich.
            exclusion:
              type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: A JSON object record.
              description: Records or entities the agent should avoid returning.
          description: >-
            Records to process and records or entities to exclude from the
            answer.
        outputSchema:
          anyOf:
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
              description: >-
                JSON Schema for validated structured output in
                `output.structured`. Fields unsupported by evidence may be
                returned as `null`. Supports draft-07, 2019-09, and 2020-12 via
                `$schema`.
            - type: 'null'
        previousRunId:
          $ref: '#/components/schemas/AgentRunId'
          description: Completed run ID to continue from. Must belong to the same team.
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: Caller-provided metadata stored with the run.
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
        dataSources:
          maxItems: 5
          type: array
          items:
            $ref: '#/components/schemas/AgentDataSource'
          description: >-
            Exa Connect data providers to enable for the run. Each entry enables
            all of that provider's tools.
        budget:
          $ref: '#/components/schemas/AgentBudget'
      required:
        - query
    AgentRun:
      type: object
      properties:
        id:
          $ref: '#/components/schemas/AgentRunId'
        object:
          type: string
          const: agent_run
        status:
          $ref: '#/components/schemas/AgentRunStatus'
        stopReason:
          anyOf:
            - $ref: '#/components/schemas/AgentStopReason'
            - type: 'null'
          description: Why the run stopped. `null` while the run is queued or running.
        createdAt:
          type: string
          format: date-time
          description: When the run was created
        completedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          format: date-time
        request:
          anyOf:
            - $ref: '#/components/schemas/AgentRunRequest'
            - type: 'null'
        output:
          $ref: '#/components/schemas/AgentRunOutput'
        usage:
          $ref: '#/components/schemas/AgentUsage'
        costDollars:
          $ref: '#/components/schemas/AgentCostDollars'
      required:
        - id
        - object
        - status
        - stopReason
        - createdAt
        - completedAt
        - request
        - output
        - usage
        - costDollars
      additionalProperties: false
    AgentRunEvent:
      type: object
      properties:
        id:
          type: string
          description: Event ID within the run.
        event:
          type: string
          enum:
            - agent_run.created
            - agent_run.started
            - agent_run.completed
            - agent_run.failed
            - agent_run.cancelled
        data:
          $ref: '#/components/schemas/JsonValue'
        createdAt:
          type: string
          format: date-time
          description: When the event was created
      required:
        - id
        - event
        - data
        - createdAt
      additionalProperties: false
    AgentErrorResponse:
      type: object
      properties:
        error:
          $ref: '#/components/schemas/AgentError'
      required:
        - error
      additionalProperties: false
    AgentEffort:
      type: string
      enum:
        - minimal
        - low
        - medium
        - high
        - xhigh
        - auto
        - max
      description: >-
        Cost and reasoning effort preference for the run. `auto` lets Exa choose
        the appropriate effort. `max` is the highest-effort public beta tier for
        work where completeness and thoroughness matter more than latency or
        cost, including large list building, deep multi-source research, and
        criteria that are hard to verify.
      default: auto
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
    AgentRunId:
      type: string
      minLength: 1
      maxLength: 200
      pattern: ^[A-Za-z0-9_.:-]+$
      description: Agent run ID. New run IDs are returned with the `agent_run_` prefix.
      example: agent_run_01j7x9v0m2n4p6q8r0s2t4v6w8
    AgentDataSource:
      type: object
      properties:
        provider:
          $ref: '#/components/schemas/AgentDataSourceProvider'
          description: >-
            Exa Connect data provider to enable for the run. All provider tools
            are available by default.
          example: fiber
      required:
        - provider
    AgentBudget:
      type: object
      properties:
        maxCostDollars:
          type: number
          description: >-
            本次运行可花费的最高金额（美元）。接受 $1–$100，且仅适用于 `auto` 和
            `max`；省略时，默认上限为 `auto` $5、`max` $20。
          example: 10
      description: >-
        针对计量计费的 `auto` 和 `max` 强度的可选单次运行花费上限。提前结束的运行花费可能低于该上限。
    AgentRunStatus:
      type: string
      enum:
        - queued
        - running
        - completed
        - failed
        - cancelled
    AgentStopReason:
      type: string
      enum:
        - schema_satisfied
        - budget_reached
        - stopped
        - error
        - cancelled
    AgentRunRequest:
      type: object
      properties:
        query:
          type: string
          minLength: 1
          description: 本次请求的自然语言问题或指令。
          example: >-
            本周宣布的最重要的 AI 基础设施融资轮有哪些？
        systemPrompt:
          type: string
          description: >-
            用于指导生成输出或智能体行为的附加说明。可用于来源偏好、新颖性约束、去重约束或其他行为指导。
          example: 优先使用官方来源并避免重复结果。
        effort:
          $ref: '#/components/schemas/AgentEffort'
        input:
          type: object
          properties:
            data:
              type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: 一条 JSON 对象记录。
              description: 智能体应处理或增强的记录。
            exclusion:
              type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: 一条 JSON 对象记录。
              description: 智能体应避免返回的记录或实体。
          additionalProperties: false
        outputSchema:
          anyOf:
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
              description: >-
                用于校验 `output.structured` 中结构化输出的 JSON Schema。缺乏证据支持的字段可能返回
                `null`。通过 `$schema` 支持 draft-07、2019-09 和 2020-12。
            - type: 'null'
        previousRunId:
          $ref: '#/components/schemas/AgentRunId'
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: 调用方提供的键值元数据，供你自行跟踪使用。
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
        dataSources:
          type: array
          items:
            $ref: '#/components/schemas/AgentDataSourceOutput'
          description: 为本次运行配置的 Exa Connect 数据提供方。
        budget:
          $ref: '#/components/schemas/AgentBudgetOutput'
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
      description: 与运行一并存储的规范化请求字段。
    AgentRunOutput:
      type: object
      properties:
        text:
          type: string
          description: 自然语言答案或摘要。
        structured:
          anyOf:
            - $ref: '#/components/schemas/JsonValue'
            - type: 'null'
          description: >-
            由 `outputSchema` 定义结构的 JSON；缺乏证据支持的字段可能为 `null`。未提供 schema 时为
            `null`。
        grounding:
          type: array
          items:
            $ref: '#/components/schemas/AgentGrounding'
          description: 本次运行输出的字段级引用。
      required:
        - text
        - structured
        - grounding
      additionalProperties: false
    AgentUsage:
      type: object
      properties:
        agentComputeUnits:
          type: number
          minimum: 0
        searches:
          type: integer
          minimum: 0
        emails:
          type: integer
          minimum: 0
        phoneNumbers:
          type: integer
          minimum: 0
        dataSources:
          $ref: '#/components/schemas/AgentDataSourceUsage'
      required:
        - agentComputeUnits
        - searches
        - emails
        - phoneNumbers
      additionalProperties: false
    AgentCostDollars:
      type: object
      properties:
        total:
          type: number
          minimum: 0
        agentCompute:
          type: number
          minimum: 0
        search:
          type: number
          minimum: 0
        emails:
          type: number
          minimum: 0
        phoneNumbers:
          type: number
          minimum: 0
        dataSources:
          $ref: '#/components/schemas/AgentDataSourceCost'
      required:
        - total
        - agentCompute
        - search
        - emails
        - phoneNumbers
      additionalProperties: false
    AgentError:
      type: object
      properties:
        type:
          type: string
          enum:
            - INVALID_REQUEST
            - AUTHENTICATION_ERROR
            - RATE_LIMIT_ERROR
            - NOT_FOUND
            - SERVER_ERROR
        code:
          type: string
          enum:
            - INVALID_REQUEST
            - TEAM_NOT_FOUND
            - RUN_NOT_FOUND
            - PREVIOUS_RUN_NOT_FOUND
            - PREVIOUS_RUN_NOT_COMPLETED
            - CONCURRENCY_LIMIT_REACHED
            - INVALID_OUTPUT_SCHEMA
            - INVALID_DATA_SOURCE
            - TIMEOUT
            - SERVER_ERROR
        message:
          type: string
      required:
        - type
        - code
        - message
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
    AgentDataSourceProvider:
      type: string
      enum:
        - fiber
        - financial_datasets
        - similarweb
        - baselayer
        - affiliate
        - particle
        - jinko
        - polymarket
      description: Exa Connect 数据提供方的标识符。
    AgentDataSourceOutput:
      type: object
      properties:
        provider:
          $ref: '#/components/schemas/AgentDataSourceProvider'
          description: >-
            为本次运行启用的 Exa Connect 数据提供方。默认情况下所有提供方工具均可用。
          example: fiber
      required:
        - provider
      additionalProperties: false
    AgentBudgetOutput:
      type: object
      properties:
        maxCostDollars:
          type: number
          description: >-
            本次运行可花费的最高金额（美元）。接受 $1–$100，且仅适用于 `auto` 和
            `max`；省略时，默认上限为 `auto` $5、`max` $20。
          example: 10
      additionalProperties: false
      description: >-
        针对计量计费的 `auto` 和 `max` 强度的可选单次运行花费上限。提前结束的运行花费可能低于该上限。
    AgentGrounding:
      type: object
      properties:
        field:
          type: string
          description: 这些引用所支持的输出字段。
          example: structured.companies[0].sourceUrl
        citations:
          type: array
          items:
            $ref: '#/components/schemas/AgentCitation'
        confidence:
          anyOf:
            - type: string
              enum:
                - low
                - medium
                - high
              description: 模型给出的该字段可靠性评估。
            - type: 'null'
      required:
        - field
        - citations
      additionalProperties: false
    AgentDataSourceUsage:
      type: object
      propertyNames:
        type: string
      additionalProperties:
        type: integer
        minimum: 0
      description: >-
        本次运行中使用的 Exa Connect 数据源按提供方统计的工具调用次数。键为提供方名称（例如 `fiber`、`similarweb`）。仅包含使用量非零的提供方。
    AgentDataSourceCost:
      type: object
      propertyNames:
        type: string
      additionalProperties:
        type: number
        minimum: 0
      description: >-
        本次运行中使用的 Exa Connect 数据源按提供方统计的费用（美元）。键为提供方名称（例如 `fiber`、`similarweb`）。仅包含使用量非零的提供方。
    AgentCitation:
      type: object
      properties:
        url:
          type: string
          format: uri
          description: Source URL.
        title:
          type: string
          description: Source title.
      required:
        - url
      additionalProperties: false
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
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