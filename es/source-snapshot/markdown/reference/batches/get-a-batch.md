> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="get-a-batch">
  # Obtener un batch
</div>

> Recupera un batch por ID.

Usa este endpoint para sondear un batch hasta que alcance el estado `completed`, `cancelled` o `expired`. Cuando el batch se completa, `resultsUrl` contiene una URL prefirmada de corta duración para el archivo JSONL de resultados; vuelve a consultar el batch para obtener una URL nueva.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas empiezan con créditos gratuitos.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /batches/{id}
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
  /batches/{id}:
    get:
      tags:
        - Batches
      summary: Get a batch
      description: Retrieve a single batch by ID.
      operationId: getBatch
      parameters:
        - in: path
          name: id
          schema:
            type: string
            minLength: 1
            description: Batch ID.
            example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
          required: true
          description: Batch ID.
        - $ref: '#/components/parameters/BatchesBetaHeader'
      responses:
        '200':
          description: OK
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              example:
                id: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
                object: batch
                status: completed
                requestCounts:
                  total: 2
                  completed: 2
                  failed: 0
                createdAt: '2026-06-06T12:00:00.000Z'
                expiresAt: '2026-06-13T12:00:00.000Z'
                endedAt: '2026-06-06T12:01:30.000Z'
                resultsUrl: >-
                  https://exa-batch-results.s3.us-east-1.amazonaws.com/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/results.jsonl?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=EXAMPLESIGNATURE
                metadata:
                  project: weekly-digest
              schema:
                $ref: '#/components/schemas/Batch'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '404':
          $ref: '#/components/responses/NotFoundResponse'
        '500':
          $ref: '#/components/responses/InternalServerErrorResponse'
components:
  parameters:
    BatchesBetaHeader:
      in: header
      name: Exa-Beta
      schema:
        type: string
        enum:
          - batches-2026-06-06
        description: Required beta token for the Batch API.
      required: true
      description: Required beta token for the Batch API.
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    Batch:
      type: object
      properties:
        id:
          type: string
          description: Batch ID. New batch IDs are returned with the `batch_` prefix.
          example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
        object:
          type: string
          const: batch
          description: The object type, always `batch`.
        status:
          $ref: '#/components/schemas/BatchStatus'
        requestCounts:
          $ref: '#/components/schemas/BatchRequestCounts'
        createdAt:
          type: string
          format: date-time
          description: When the batch was created.
        expiresAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: When the batch expires, or `null` if it does not expire.
          format: date-time
        endedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: >-
            When the batch reached a terminal status, or `null` while it is
            still running.
          format: date-time
        resultsUrl:
          anyOf:
            - type: string
            - type: 'null'
          description: >-
            Short-lived presigned download URL for the batch results file
            (JSONL), or `null` until the batch completes. This is a direct
            object-store download link, not an API route; fetch it as-is and
            re-fetch the batch to mint a fresh URL once it expires.
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
      required:
        - id
        - object
        - status
        - requestCounts
        - createdAt
        - expiresAt
        - endedAt
        - resultsUrl
        - metadata
      additionalProperties: false
    BatchStatus:
      type: string
      enum:
        - in_progress
        - completed
        - cancelling
        - cancelled
        - expired
      description: Lifecycle status of the batch.
    BatchRequestCounts:
      type: object
      properties:
        total:
          type: integer
          minimum: 0
          description: Total requests in the batch.
        completed:
          type: integer
          minimum: 0
          description: Requests that have completed successfully.
        failed:
          type: integer
          minimum: 0
          description: Requests that have failed.
      required:
        - total
        - completed
        - failed
      additionalProperties: false
    ErrorResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Unique identifier for the request.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: Human-readable message describing the error.
          example: Invalid API key
        tag:
          type: string
          description: >-
            Machine-readable error tag identifying the failure. The set of tags
            is open-ended: new tags may be added at any time, so treat
            unrecognized tags as a generic error of the response's HTTP status.
            Known tags are listed as examples.
          examples:
            - DEFAULT_ERROR
            - INTERNAL_ERROR
            - INVALID_API_KEY
            - INVALID_REQUEST
            - INVALID_REQUEST_BODY
            - INVALID_REQUEST_QUERY
            - INVALID_JSON_SCHEMA
            - INVALID_NUM_RESULTS
            - NUM_RESULTS_EXCEEDED
            - NO_MORE_CREDITS
            - API_KEY_BUDGET_EXCEEDED
            - TEAM_BUDGET_EXCEEDED
            - NO_CONTENT_FOUND
            - PROHIBITED_CONTENT
            - INSUFFICIENT_SCOPE
            - UNABLE_TO_GENERATE_RESPONSE
            - UNSUPPORTED_PUBLICATION_INCLUDE_FILTER
            - SUBPAGES_LIMIT_EXCEEDED
            - FEATURE_DISABLED
            - INVALID_URLS
            - FETCH_DOCUMENT_ERROR
            - TEAM_BLOCKED
            - NOT_FOUND
            - RATE_LIMIT_EXCEEDED
            - SNAPSHOT_RATE_LIMIT_EXCEEDED
            - SNAPSHOT_NOT_ON_PLAN
            - SNAPSHOT_NOT_IN_CONTRACT
            - SNAPSHOT_TRIAL_EXHAUSTED
            - SNAPSHOT_TRIAL_CAP_EXCEEDED
      required:
        - requestId
        - error
        - tag
      additionalProperties: false
      description: Standard error envelope returned by the Exa API for failed requests.
  responses:
    BadRequestResponse:
      description: The request body or query parameters failed validation.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 0a1b2c3d4e5f60718293a4b5c6d7e8f9
            error: >-
              Invalid request body: query: Invalid input: expected string,
              received undefined
            tag: INVALID_REQUEST_BODY
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    UnauthorizedResponse:
      description: The API key is missing or invalid.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2
            error: Clave de API no válida
            tag: INVALID_API_KEY
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    NotFoundResponse:
      description: El recurso solicitado no existe.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 3b1d5f7a9c0e2b4d6f8a0c2e4b6d8f0a
            error: No encontrado
            tag: NOT_FOUND
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerErrorResponse:
      description: Se produjo un error inesperado al procesar la solicitud.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 9b1d3f5e7a0c2e4b6d8f0a2c4e6b8d0f
            error: >-
              Lo sentimos, se produjo un error al procesar tu solicitud.
              Vuelve a intentarlo más tarde
            tag: DEFAULT_ERROR
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Pasa tu clave de API de Exa en el encabezado x-api-key. También puedes
        autenticarte con Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Pasa tu clave de API de Exa en el encabezado x-api-key. También puedes
        autenticarte con Authorization: Bearer <key>.
```