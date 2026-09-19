> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="create-a-run">
  # 실행 생성
</div>

> 비동기 Agent 실행을 생성합니다. server-sent events를 요청하지 않는 한, 응답은 즉시 실행 객체를 반환합니다.

자연어 `query`로 실행을 생성하세요. 검증된 구조화 JSON을 받으려면 `outputSchema`를, 처리할 행이 있으면 `input.data`를, 제외할 레코드나 엔티티가 있으면 `input.exclusion`을, 완료된 실행에 이어서 진행하려면 `previousRunId`를 추가하세요.

`Accept: text/event-stream`을 설정하면 실행이 생성, 시작, 완료되는 과정을 실행 이벤트로 스트리밍할 수 있습니다.

<Note>
  **Connect:** `dataSources`를 전달하면 실행 중에 에이전트가 서드파티 data provider에 접근할 수 있습니다. 자세한 내용은 [Connect 가이드](/ko/docs/agent/quickstart#connect-data-sources)를 참고하세요.
</Note>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

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
            이 실행이 지출할 수 있는 최대 금액(미국 달러)입니다. $1–$100까지 허용되며
            `auto`와 `max`에만 적용됩니다. 생략하면 기본 상한은 `auto`의 경우
            $5, `max`의 경우 $20입니다.
          example: 10
      description: >-
        사용량 기반으로 과금되는 `auto` 및 `max` effort에 적용되는 선택적 실행별 지출
        한도입니다. 일찍 종료된 실행은 한도보다 비용이 적게 들 수 있습니다.
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
          description: 요청에 대한 자연어 질문 또는 지시문입니다.
          example: >-
            What are the most important AI infrastructure funding rounds
            announced this week?
        systemPrompt:
          type: string
          description: >-
            생성 출력이나 agent 동작을 유도하는 추가 지시문입니다. 출처 선호,
            신규성 제약, 중복 제약 또는 기타 동작 지침을 지정할 때 사용합니다.
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
                description: JSON 객체 레코드입니다.
              description: agent가 처리하거나 enrich할 레코드입니다.
            exclusion:
              type: array
              items:
                type: object
                propertyNames:
                  type: string
                additionalProperties:
                  $ref: '#/components/schemas/JsonValue'
                description: JSON 객체 레코드입니다.
              description: agent가 반환하지 않아야 할 레코드 또는 엔터티입니다.
          additionalProperties: false
        outputSchema:
          anyOf:
            - type: object
              propertyNames:
                type: string
              additionalProperties:
                $ref: '#/components/schemas/JsonValue'
              description: >-
                `output.structured`에 담기는 검증된 structured output을 위한 JSON
                Schema입니다. evidence로 뒷받침되지 않는 필드는 `null`로 반환될 수
                있습니다. `$schema`를 통해 draft-07, 2019-09, 2020-12를
                지원합니다.
            - type: 'null'
        previousRunId:
          $ref: '#/components/schemas/AgentRunId'
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: 자체 추적 용도로 호출자가 제공하는 키-값 메타데이터입니다.
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
        dataSources:
          type: array
          items:
            $ref: '#/components/schemas/AgentDataSourceOutput'
          description: 해당 실행에 구성된 Exa Connect data provider입니다.
        budget:
          $ref: '#/components/schemas/AgentBudgetOutput'
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
      description: 실행과 함께 저장되는 정규화된 요청 필드입니다.
    AgentRunOutput:
      type: object
      properties:
        text:
          type: string
          description: 자연어 답변 또는 summary입니다.
        structured:
          anyOf:
            - $ref: '#/components/schemas/JsonValue'
            - type: 'null'
          description: >-
            `outputSchema`에 맞춰 구성된 JSON입니다. evidence로 뒷받침되지 않는
            필드는 `null`일 수 있으며, schema를 제공하지 않은 경우 `null`입니다.
        grounding:
          type: array
          items:
            $ref: '#/components/schemas/AgentGrounding'
          description: 실행이 생성한 필드 수준 citations입니다.
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
      description: Exa Connect data provider의 식별자입니다.
    AgentDataSourceOutput:
      type: object
      properties:
        provider:
          $ref: '#/components/schemas/AgentDataSourceProvider'
          description: >-
            해당 실행에서 활성화할 Exa Connect data provider입니다. 모든 provider
            도구는 기본적으로 사용할 수 있습니다.
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
            이 실행이 지출할 수 있는 최대 금액(미국 달러)입니다. $1–$100까지 허용되며
            `auto`와 `max`에만 적용됩니다. 생략하면 기본 상한은 `auto`의 경우
            $5, `max`의 경우 $20입니다.
          example: 10
      additionalProperties: false
      description: >-
        사용량 기반으로 과금되는 `auto` 및 `max` effort에 적용되는 선택적 실행별 지출
        한도입니다. 일찍 종료된 실행은 한도보다 비용이 적게 들 수 있습니다.
    AgentGrounding:
      type: object
      properties:
        field:
          type: string
          description: 해당 citations가 뒷받침하는 출력 필드입니다.
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
              description: 이 필드에 대해 모델이 보고한 신뢰도입니다.
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
        실행 중 사용된 Exa Connect 데이터 소스의 provider별 도구 호출 횟수입니다.
        키는 provider 이름입니다(예: `fiber`, `similarweb`). usage가 0이 아닌
        provider만 포함됩니다.
    AgentDataSourceCost:
      type: object
      propertyNames:
        type: string
      additionalProperties:
        type: number
        minimum: 0
      description: >-
        실행 중 사용된 Exa Connect 데이터 소스의 provider별 비용(달러)입니다.
        키는 provider 이름입니다(예: `fiber`, `similarweb`). usage가 0이 아닌
        provider만 포함됩니다.
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