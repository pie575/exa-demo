> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 본격적으로 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="stop-a-run">
  # 실행 중지
</div>

> 진행 중인 Agent 실행을 정상적으로 중지하고 지금까지 수집한 결과를 유지합니다.

실행이 아직 활성 상태라면 agent가 작업을 마무리하고 지금까지 수집한 결과와 함께 실행을 조기에 완료합니다. 해당 실행은 상태가 `completed`, `stopReason: stopped`인 상태로 종료됩니다. 중지 전까지 누적된 usage에 대해서는 요금이 청구됩니다. 실행이 이미 종료 상태(completed, failed, cancelled)에 도달한 경우에는 이 endpoint가 기존 실행을 변경 없이 그대로 반환합니다.

결과를 반환하지 않고 실행을 즉시 종료하려면 [cancel](/ko/docs/reference/agent-api/cancel-a-run)을 사용하세요.

<Note>
  `max` effort 실행에서만 지원됩니다. 요청 header로 `Exa-Beta: agent-max-effort-2026-07-27`를
  전달해야 합니다. 이 header에는 쉼표로 구분된 베타 토큰 목록을 지정할 수 있습니다.
</Note>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

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
        해당 실행의 비용 및 추론 effort 설정입니다. `auto`로 설정하면 Exa가 적절한
        effort를 선택합니다. `max`는 대규모 list building, 여러 소스를 활용한 deep
        리서치, 검증하기 어려운 criteria 등 지연 시간이나 비용보다 완전성과 철저함이
        더 중요한 작업을 위한 최고 effort 공개 베타 등급입니다.
      default: auto
    JsonValue:
      description: 임의의 JSON 값입니다.
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
            해당 실행이 지출할 수 있는 최대 금액(미국 달러)입니다. $1~$100까지
            허용되며 `auto`와 `max`에만 적용됩니다. 생략하면 기본 상한은 `auto`의
            경우 $5, `max`의 경우 $20입니다.
          example: 10
      additionalProperties: false
      description: >-
        종량제로 과금되는 `auto` 및 `max` effort에 적용되는 선택적 실행별 지출 limit입니다.
        일찍 완료된 실행은 limit보다 적은 비용이 발생할 수 있습니다.
    AgentGrounding:
      type: object
      properties:
        field:
          type: string
          description: citations가 뒷받침하는 출력 필드입니다.
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
        해당 실행 중 사용된 Exa Connect 데이터 소스의 provider별 도구 call 횟수입니다.
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
        해당 실행 중 사용된 Exa Connect 데이터 소스의 provider별 비용(달러)입니다.
        키는 provider 이름입니다(예: `fiber`, `similarweb`). usage가 0이 아닌
        provider만 포함됩니다.
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
    AgentCitation:
      type: object
      properties:
        url:
          type: string
          format: uri
          description: source URL입니다.
        title:
          type: string
          description: 소스 제목입니다.
      required:
        - url
      additionalProperties: false
  parameters:
    ExaBetaHeader:
      in: header
      name: Exa-Beta
      schema:
        description: >-
          실험적 기능을 사용하도록 설정하기 위한 쉼표로 구분된 베타 기능 토큰입니다.
        type: string
      description: >-
        실험적 기능을 사용하도록 설정하기 위한 쉼표로 구분된 베타 기능 토큰입니다.
  headers:
    XRequestId:
      description: >-
        요청의 고유 식별자입니다. 해당 값을 포함하는 응답 본문에서 반환되는
        `requestId` 필드와 일치합니다.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key>로
        인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key>로
        인증할 수도 있습니다.
```