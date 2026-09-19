> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 받을 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="delete-a-run">
  # 실행 삭제
</div>

> 저장된 Agent 실행을 삭제합니다.

실행을 삭제하면 해당 실행이 team의 Agent 실행 기록에서 제거됩니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /agent/runs/{id}
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
  /agent/runs/{id}:
    delete:
      tags:
        - Agent
      summary: 실행 삭제
      description: 저장된 Agent 실행을 삭제합니다.
      operationId: deleteAgentRun
      parameters:
        - in: path
          name: id
          schema:
            $ref: '#/components/schemas/AgentRunId'
            description: Agent 실행 ID.
          required: true
          description: Agent 실행 ID.
      responses:
        '200':
          description: Agent 실행이 삭제됨
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DeleteAgentRunResponse'
        '400':
          description: 잘못된 요청입니다.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '401':
          description: team 컨텍스트 또는 인증 정보를 찾을 수 없습니다.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '404':
          description: 실행을 찾을 수 없습니다.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '429':
          description: Agent 실행 concurrency 한도에 도달했습니다.
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentErrorResponse'
        '500':
          description: 서버 오류 또는 실행 시간 초과입니다.
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
      description: Agent 실행 ID. 새 실행 ID는 `agent_run_` 접두사가 붙어 반환됩니다.
      example: agent_run_01j7x9v0m2n4p6q8r0s2t4v6w8
    DeleteAgentRunResponse:
      type: object
      properties:
        id:
          $ref: '#/components/schemas/AgentRunId'
        object:
          type: string
          const: agent_run.deleted
        deleted:
          type: boolean
          const: true
      required:
        - id
        - object
        - deleted
      additionalProperties: false
    AgentErrorResponse:
      type: object
      properties:
        error:
          $ref: '#/components/schemas/AgentError'
      required:
        - error
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
    JsonValue:
      description: 임의의 JSON 값.
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
  headers:
    XRequestId:
      description: >-
        요청의 고유 식별자. 이 값을 포함하는 응답 본문에서 반환되는 `requestId`
        필드와 동일합니다.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key>로도
        인증할 수 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key>로도
        인증할 수 있습니다.
```