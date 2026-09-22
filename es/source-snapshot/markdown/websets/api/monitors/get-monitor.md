> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="get-a-websets-monitor">
  # Obtener un monitor de Websets
</div>

> Obtiene un monitor específico.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/monitors/{id}
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
  /v0/monitors/{id}:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors
      summary: Obtener Monitor
      description: Obtiene un monitor específico.
      operationId: monitors-get
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: El id del Monitor
          required: true
      responses:
        '200':
          description: Detalles del Monitor
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
                $ref: '#/components/schemas/Monitor'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    Monitor:
      properties:
        id:
          description: El identificador único del Monitor
          type: string
        object:
          enum:
            - monitor
          description: El tipo de objeto
          type: string
        status:
          enum:
            - enabled
            - disabled
          description: El estado del Monitor
          type: string
        websetId:
          description: El id del Webset al que pertenece el Monitor
          type: string
        cadence:
          properties:
            cron:
              description: >-
                Expresión cron para la cadencia del monitor (debe ser una
                expresión cron de Unix válida con 5 campos). La programación
                debe ejecutarse como máximo una vez al día.
              type: string
            timezone:
              default: Etc/UTC
              description: Zona horaria IANA (por ejemplo, "America/New_York")
              type: string
          required:
            - cron
          description: Con qué frecuencia se ejecutará el monitor
          type: object
        behavior:
          properties:
            config:
              properties:
                query:
                  description: >-
                    La consulta a buscar. De forma predeterminada, se usa la
                    consulta de la última búsqueda.
                  minLength: 2
                  maxLength: 10000
                  type: string
                criteria:
                  description: >-
                    Los criteria a buscar. De forma predeterminada, se usan los
                    criteria de la última búsqueda.
                  maxItems: 5
                  items:
                    properties:
                      description:
                        minLength: 2
                        maxLength: 1000
                        type: string
                    required:
                      - description
                    type: object
                  type: array
                entity:
                  $ref: '#/components/schemas/Entity'
                  title: Entity
                  description: >-
                    La entidad a buscar. De forma predeterminada, se usa la
                    entidad de la última búsqueda/import.
                count:
                  exclusiveMinimum: 0
                  description: El número máximo de resultados a encontrar
                  type: number
                behavior:
                  default: append
                  description: El comportamiento del Search cuando se agrega a un Webset.
                  enum:
                    - override
                    - append
                  type: string
              required:
                - count
              description: >-
                Especifica los parámetros de búsqueda del Monitor.


                De forma predeterminada, cuando no se proporcionan parámetros se
                usan los parámetros de búsqueda (consulta, entidad y criteria)
                de la última búsqueda.
              type: object
            type:
              type: string
              const: search
              default: search
          required:
            - type
            - config
          description: Comportamiento a realizar cuando se ejecuta el monitor
          type: object
        lastRun:
          $ref: '#/components/schemas/MonitorRun'
          title: MonitorRun
          description: El último run del monitor
          nullable: true
        nextRunAt:
          format: date-time
          type: string
          description: Fecha y hora en que ocurrirá el próximo run
          nullable: true
        metadata:
          description: Conjunto de pares clave-valor que quieres asociar con este objeto.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          type: string
          format: date-time
          description: Cuándo se creó el monitor
        updatedAt:
          type: string
          format: date-time
          description: Cuándo se actualizó por última vez el monitor
      required:
        - id
        - object
        - status
        - websetId
        - cadence
        - behavior
        - lastRun
        - nextRunAt
        - metadata
        - createdAt
        - updatedAt
      type: object
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
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
          description: El monitor con el que está asociado el run
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
          description: Cuándo se actualizó por última vez el run
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
    CompanyEntity:
      properties:
        type:
          type: string
          const: company
          default: company
      required:
        - type
      title: Company
      type: object
    PersonEntity:
      properties:
        type:
          type: string
          const: person
          default: person
      required:
        - type
      title: Person
      type: object
    ArticleEntity:
      properties:
        type:
          type: string
          const: article
          default: article
      required:
        - type
      title: Article
      type: object
    ResearchPaperEntity:
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
      title: Research Paper
      type: object
    CustomEntity:
      properties:
        description:
          minLength: 2
          maxLength: 200
          type: string
        type:
          type: string
          const: custom
          default: custom
      required:
        - type
        - description
      title: Custom
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