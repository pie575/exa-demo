> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Cancelar un run {#cancel-a-run}

> Cancela un run de Agent en cola o en ejecución.

Si el run sigue activo, pasa a `cancelled` de inmediato y termina sin devolver ningún resultado. El run finaliza con estado `cancelled` y `stopReason: cancelled`. Se te factura el uso acumulado antes de la cancelación. Si el run ya alcanzó un estado terminal (completado, fallido o cancelado), el endpoint devuelve el run existente sin cambios.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas comienzan con créditos gratuitos.
</Card>

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /agent/runs/{id}/cancel
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
  /agent/runs/{id}/cancel:
    post:
      tags:
        - Agent
      summary: Cancel a run
      description: >-
        Cancel a queued or running Agent run immediately without returning any
        results. You are billed for usage accrued before cancellation. If the
        run has already reached a terminal status, the API returns the existing
        run.
      operationId: cancelAgentRun
      parameters:
        - in: path
          name: id
          schema:
            $ref: '#/components/schemas/AgentRunId'
            description: Agent run ID.
          required: true
          description: Agent run ID.
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
        Preferencia de costo y esfuerzo de razonamiento para el run. `auto`
        permite que Exa elija el esfuerzo adecuado. `max` es el nivel de mayor
        esfuerzo en beta pública, pensado para trabajos en los que la
        exhaustividad importa más que la latencia o el costo, como la creación
        de listas extensas, la investigación profunda con múltiples fuentes y
        criteria difíciles de verificar.
      default: auto
    JsonValue:
      description: Cualquier valor JSON.
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
            Proveedor de datos de Exa Connect que se habilitará para el run. De
            forma predeterminada, todas las herramientas del proveedor están
            disponibles.
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
            Monto máximo que este run puede gastar en dólares estadounidenses.
            Acepta entre $1 y $100 y solo aplica a `auto` y `max`; si se omite,
            el tope predeterminado es de $5 para `auto` y $20 para `max`.
          example: 10
      additionalProperties: false
      description: >-
        Límite de gasto opcional por run para los esfuerzos medidos `auto` y
        `max`. Los runs que terminan antes pueden costar menos que el límite.
    AgentGrounding:
      type: object
      properties:
        field:
          type: string
          description: Campo de salida que respaldan las citas.
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
              description: Fiabilidad de este campo informada por el modelo.
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
        Cantidad de llamadas a herramientas por proveedor para las fuentes de
        datos de Exa Connect usadas durante el run. Las claves son nombres de
        proveedores (por ejemplo, `fiber`, `similarweb`). Solo se incluyen los
        proveedores con uso distinto de cero.
    AgentDataSourceCost:
      type: object
      propertyNames:
        type: string
      additionalProperties:
        type: number
        minimum: 0
      description: >-
        Costo en dólares por proveedor para las fuentes de datos de Exa Connect
        usadas durante el run. Las claves son nombres de proveedores (por
        ejemplo, `fiber`, `similarweb`). Solo se incluyen los proveedores con
        uso distinto de cero.
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
      description: Identificador de un proveedor de datos de Exa Connect.
    AgentCitation:
      type: object
      properties:
        url:
          type: string
          format: uri
          description: URL de origen.
        title:
          type: string
          description: Título de la fuente.
      required:
        - url
      additionalProperties: false
  headers:
    XRequestId:
      description: >-
        Identificador único de la solicitud. Coincide con el campo `requestId`
        devuelto en los cuerpos de respuesta que lo incluyen.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Envía tu API key de Exa en el encabezado x-api-key. También puedes
        autenticarte con Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Envía tu API key de Exa en el encabezado x-api-key. También puedes
        autenticarte con Authorization: Bearer <key>.
```