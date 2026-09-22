> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

# Listar los runs de un monitor {#list-monitor-runs}

> Lista todos los runs del Monitor.

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /v0/monitors/{monitor}/runs
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
  /v0/monitors/{monitor}/runs:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors Runs
      summary: Listar los runs de un Monitor
      description: Lista todos los runs del Monitor.
      operationId: monitors-runs-list
      parameters:
        - in: path
          name: monitor
          schema:
            type: string
          description: El id del Monitor cuyos runs se van a listar
          required: true
      responses:
        '200':
          description: Lista de runs del monitor
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Identificador único de la solicitud.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListMonitorRunsResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    ListMonitorRunsResponse:
      properties:
        data:
          items:
            $ref: '#/components/schemas/MonitorRun'
          description: La lista de runs del monitor
          type: array
        hasMore:
          description: Si hay más resultados para paginar
          type: boolean
        nextCursor:
          type: string
          description: El cursor para paginar el siguiente conjunto de resultados
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
    MonitorRun:
      properties:
        id:
          description: El identificador único del Monitor Run
          type: string
        object:
          enum:
            - monitor_run
          description: El tipo de objeto
          type: string
        monitorId:
          description: El monitor al que está asociado el run
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: El estado del Monitor Run
          type: string
        completedAt:
          format: date-time
          type: string
          description: Cuándo se completó el run
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: Cuándo falló el run
          nullable: true
        failedReason:
          type: string
          description: El motivo por el que falló el run
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: Cuándo se canceló el run
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: Cuándo se creó el run
        updatedAt:
          type: string
          format: date-time
          description: Cuándo se actualizó el run por última vez
        type:
          type: string
          enum:
            - search
            - refresh
          description: El tipo de Monitor Run
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