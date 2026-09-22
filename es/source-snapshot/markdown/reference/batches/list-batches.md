> ## Índice de documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Listar batches {#list-batches}

> Recupera una lista paginada de los batches de tu equipo.

Los batches se devuelven del más reciente al más antiguo. Usa `limit` para controlar el tamaño de página y `cursor` junto con el `nextCursor` de la respuesta anterior para obtener la página siguiente. Envía `status=completed` para listar solo los batches completados; estos listados usan su propio cursor, así que incluye `status=completed` en cada página.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas comienzan con créditos gratuitos.
</Card>

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /batches
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
  /batches:
    get:
      tags:
        - Batches
      summary: Listar batches
      description: >-
        Lista los batches de tu equipo, ordenados del más reciente al más
        antiguo.
      operationId: listBatches
      parameters:
        - in: query
          name: cursor
          schema:
            type: string
            description: Cursor de paginación de una respuesta anterior
        - in: query
          name: limit
          schema:
            type: integer
            minimum: 1
            description: >-
              Número máximo de batches a devolver por página. Si se omite, el
              valor por defecto es 100; no hay límite superior.
            default: 100
        - in: query
          name: status
          schema:
            type: string
            const: completed
            description: >-
              Filtra el listado para mostrar solo los batches completados.
              `completed` es el único valor admitido; cualquier otro valor
              devuelve un 400. Los listados de completados se ordenan por
              expiración y usan un cursor distinto, así que sigue enviando
              `status=completed` en cada solicitud paginada por cursor.
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
                object: list
                data:
                  - id: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
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
                hasMore: false
                nextCursor: null
              schema:
                $ref: '#/components/schemas/BatchList'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
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
        description: Token beta obligatorio para la Batch API.
      required: true
      description: Token beta obligatorio para la Batch API.
  headers:
    XRequestId:
      description: >-
        Identificador único de la solicitud. Coincide con el campo `requestId`
        que se devuelve en los cuerpos de respuesta que lo incluyen.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    BatchList:
      type: object
      properties:
        object:
          type: string
          const: list
          description: El tipo de objeto, siempre `list`.
        data:
          type: array
          items:
            $ref: '#/components/schemas/Batch'
          description: La página de batches, del más reciente al más antiguo.
        hasMore:
          type: boolean
          description: Indica si hay más resultados
        nextCursor:
          anyOf:
            - type: string
            - type: 'null'
          description: Cursor de la página siguiente
      required:
        - object
        - data
        - hasMore
        - nextCursor
      additionalProperties: false
    Batch:
      type: object
      properties:
        id:
          type: string
          description: >-
            ID del batch. Los nuevos IDs de batch se devuelven con el prefijo
            `batch_`.
          example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
        object:
          type: string
          const: batch
          description: El tipo de objeto, siempre `batch`.
        status:
          $ref: '#/components/schemas/BatchStatus'
        requestCounts:
          $ref: '#/components/schemas/BatchRequestCounts'
        createdAt:
          type: string
          format: date-time
          description: Cuándo se creó el batch.
        expiresAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: Cuándo expira el batch, o `null` si no expira.
          format: date-time
        endedAt:
          anyOf:
            - type: string
              format: date-time
            - type: 'null'
          description: >-
            Cuándo el batch alcanzó un estado terminal, o `null` mientras sigue
            en ejecución.
          format: date-time
        resultsUrl:
          anyOf:
            - type: string
            - type: 'null'
          description: >-
            URL de descarga prefirmada y de corta duración para el archivo de
            resultados del batch (JSONL), o `null` hasta que el batch se
            complete. Es un enlace de descarga directo al almacén de objetos, no
            una ruta de la API; úsalo tal cual y vuelve a consultar el batch para
            generar una URL nueva cuando expire.
        metadata:
          type: object
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: >-
            Metadatos clave-valor proporcionados por quien realiza la llamada,
            para tu propio seguimiento.
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
    ErrorResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Identificador único de la solicitud.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: Mensaje legible que describe el error.
          example: Invalid API key
        tag:
          type: string
          description: >-
            Tag de error legible por máquina que identifica el fallo. El conjunto
            de tags es abierto: pueden añadirse nuevos tags en cualquier momento,
            así que trata los tags no reconocidos como un error genérico del
            estado HTTP de la respuesta. Los tags conocidos se listan como
            ejemplos.
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
      description: >-
        Envoltorio de error estándar que devuelve la API de Exa para las
        solicitudes fallidas.
    BatchStatus:
      type: string
      enum:
        - in_progress
        - completed
        - cancelling
        - cancelled
        - expired
      description: Estado del ciclo de vida del batch.
    BatchRequestCounts:
      type: object
      properties:
        total:
          type: integer
          minimum: 0
          description: Total de solicitudes en el batch.
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
            error: Invalid API key
            tag: INVALID_API_KEY
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerErrorResponse:
      description: An unexpected error occurred while processing the request.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 9b1d3f5e7a0c2e4b6d8f0a2c4e6b8d0f
            error: >-
              Sorry, we encountered an error while processing your request.
              Please try again later
            tag: DEFAULT_ERROR
          schema:
            $ref: '#/components/schemas/ErrorResponse'
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