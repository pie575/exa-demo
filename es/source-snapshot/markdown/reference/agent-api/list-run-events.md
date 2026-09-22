> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="list-run-events">
  # Listar eventos de un run
</div>

> Lista los eventos almacenados de un Agent run o reprodúcelos como server-sent events.

De forma predeterminada, este endpoint devuelve una lista JSON paginada de los eventos almacenados. Establece `Accept: text/event-stream` para reproducir los eventos almacenados como SSE. Para la paginación JSON, usa `cursor`. Para la reproducción por SSE, usa `Last-Event-ID`.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas comienzan con créditos gratuitos.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /agent/runs/{id}/events
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
  /agent/runs/{id}/events:
    get:
      tags:
        - Agent
      summary: List run events
      description: >-
        List stored events for an Agent run. Set `Accept: text/event-stream` to
        replay stored events as server-sent events. Use `cursor` for JSON
        pagination or `Last-Event-ID` for SSE replay.
      operationId: listAgentRunEvents
      parameters:
        - in: path
          name: id
          schema:
            $ref: '#/components/schemas/AgentRunId'
            description: Agent run ID.
          required: true
          description: Agent run ID.
        - in: query
          name: limit
          schema:
            type: integer
            minimum: 1
            maximum: 100
            description: Number of results per page
            default: 20
        - in: query
          name: cursor
          schema:
            type: string
            description: >-
              Cursor for pagination. Use the `nextCursor` value from the
              previous event list response.
        - $ref: '#/components/parameters/AcceptHeader'
        - $ref: '#/components/parameters/LastEventId'
      responses:
        '200':
          description: Agent run events
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentRunEventList'
            text/event-stream:
              schema:
                $ref: '#/components/schemas/AgentRunEvent'
              examples:
                replay:
                  summary: Replayed run events
                  value: >
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
    AgentRunEventList:
      type: object
      properties:
        object:
          type: string
          const: list
        data:
          type: array
          items:
            $ref: '#/components/schemas/AgentRunEvent'
        hasMore:
          type: boolean
          description: Whether there are more results
        nextCursor:
          anyOf:
            - type: string
            - type: 'null'
      required:
        - object
        - data
        - hasMore
        - nextCursor
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
    LastEventId:
      in: header
      name: Last-Event-ID
      schema:
        description: For SSE replay, return only events after this event ID.
        type: string
      description: For SSE replay, return only events after this event ID.
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