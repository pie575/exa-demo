> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 실행 중지 {#stop-a-run}

> 진행 중인 Agent 실행을 안전하게 중지하고 지금까지 수집한 결과를 그대로 유지합니다.

실행이 아직 활성 상태라면 agent가 작업을 마무리하고 지금까지 수집한 결과와 함께 실행을 조기에 완료합니다. 실행은 상태 `completed`, `stopReason: stopped`로 종료됩니다. 중지 이전까지 누적된 사용량에 대해서는 요금이 청구됩니다. 실행이 이미 종료 상태(completed, failed, cancelled)에 도달한 경우 엔드포인트는 기존 실행을 변경 없이 반환합니다.

결과를 반환하지 않고 실행을 즉시 종료하려면 [cancel](/ko/docs/reference/agent-api/cancel-a-run)을 사용하세요.

<Note>
  `max` effort 실행에서만 지원됩니다. `Exa-Beta: agent-max-effort-2026-07-27`을 요청 header로
  전달해야 합니다. 이 header는 쉼표로 구분된 베타 토큰 목록을 허용합니다.
</Note>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /agent/runs/{id}/stop
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
  /agent/runs/{id}/stop:
    post:
      tags:
        - Agent
      summary: Stop a run
      description: >-
        Complete a running Agent run early, returning the results gathered so
        far. You are billed for usage accrued before the stop. Currently
        supported only for `max` effort runs and requires the `Exa-Beta:
        agent-max-effort-2026-07-27` header. If the run has already reached a
        terminal status, the API returns the existing run.
      operationId: stopAgentRun
      parameters:
        - in: path
          name: id
          schema:
            $ref: '#/components/schemas/AgentRunId'
            description: Agent run ID.
          required: true
          description: Agent run ID.
        - $ref: '#/components/parameters/ExaBetaHeader'
      responses:
        '200':
          description: Agent run
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentRun'
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
        '404':
          description: Run not found.
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
  schemas:
    AgentRunId:
      type: string
      minLength: 1
      maxLength: 200
      pattern: ^[A-Za-z0-9_.:-]+$
      description: Agent run ID. New run IDs are returned with the `agent_run_` prefix.
      example: agent_run_01j7x9v0m2n4p6q8r0s2t4v6w8
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
    AgentErrorResponse:
      type: object
      properties:
        error:
          $ref: '#/components/schemas/AgentError'
      required:
        - error
      additionalProperties: false
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
          additionalProperties: false
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
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: Caller-provided key-value metadata for your own tracking.
          example:
            slack_channel_id: C123ABC
            slack_thread_id: '1745444400.123456'
            user_id: U123ABC
        dataSources:
          type: array
          items:
            $ref: '#/components/schemas/AgentDataSourceOutput'
          description: Exa Connect data providers configured for the run.
        budget:
          $ref: '#/components/schemas/AgentBudgetOutput'
      additionalProperties:
        $ref: '#/components/schemas/JsonValue'
      description: Canonicalized request fields stored with the run.
    AgentRunOutput:
      type: object
      properties:
        text:
          type: string
          description: Natural-language answer or summary.
        structured:
          anyOf:
            - $ref: '#/components/schemas/JsonValue'
            - type: 'null'
          description: >-
            JSON shaped by `outputSchema`; fields unsupported by evidence may be
            `null`. `null` when no schema was provided.
        grounding:
          type: array
          items:
            $ref: '#/components/schemas/AgentGrounding'
          description: Field-level citations emitted by the run.
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
    AgentDataSourceOutput:
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
      additionalProperties: false
    AgentBudgetOutput:
      type: object
      properties:
        maxCostDollars:
          type: number
          description: >-
            Maximum amount this run can spend in US dollars. Accepts $1–$100 and
            applies only to `auto` and `max`; when omitted, the default cap is
            $5 for `auto` and $20 for `max`.
          example: 10
      additionalProperties: false
      description: >-
        Optional per-run spending limit for the metered `auto` and `max`
        efforts. Runs that finish early may cost less than the limit.
    AgentGrounding:
      type: object
      properties:
        field:
          type: string
          description: Output field the citations support.
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
              description: Model-reported reliability for this field.
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
        Per-provider tool call counts for Exa Connect data sources used during
        the run. Keys are provider names (e.g. `fiber`, `similarweb`). Only
        providers with non-zero usage are included.
    AgentDataSourceCost:
      type: object
      propertyNames:
        type: string
      additionalProperties:
        type: number
        minimum: 0
      description: >-
        Per-provider cost in dollars for Exa Connect data sources used during
        the run. Keys are provider names (e.g. `fiber`, `similarweb`). Only
        providers with non-zero usage are included.
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
      description: Identifier of an Exa Connect data provider.
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
  parameters:
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