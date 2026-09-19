> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="get-team-info">
  # Obtener información del equipo
</div>

> Consulta la información de tu equipo, incluidos el uso y los límites de concurrencia.

<div id="overview">
  ## Descripción general
</div>

El endpoint Get Team Info devuelve información sobre el equipo autenticado, incluidos el uso actual de concurrencia del equipo y los límites configurados. Resulta útil para supervisar el uso que haces de la API de Websets y conocer tus límites de tasa.

<div id="response">
  ## Respuesta
</div>

La respuesta incluye:

* **object**: Siempre &quot;team&quot;
* **id**: El identificador único de tu equipo
* **name**: El nombre de tu equipo
* **concurrencia**: Uso actual, con las solicitudes activas y en cola
* **límites**: Los límites de concurrencia de tu equipo

<div id="concurrency-fields">
  ### Campos de concurrencia
</div>

El objeto `concurrency` muestra el estado actual de tus solicitudes:

* **active**: número de solicitudes que se están procesando en este momento
* **queued**: número de solicitudes en espera de procesarse

<div id="limits-fields">
  ### Campos de límites
</div>

El objeto `limits` muestra los límites configurados de tu equipo:

* **maxConcurrent**: número máximo de solicitudes que pueden procesarse de forma simultánea (null significa sin límite)
* **maxQueued**: número máximo de solicitudes que pueden permanecer en espera en la cola (null significa sin límite)

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/teams/me
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
  /v0/teams/me:
    get:
      tags:
        - Teams
      summary: Get team info
      description: >-
        Returns information about the authenticated team, including current
        concurrency usage and limits.
      operationId: teams-me-get
      responses:
        '200':
          description: Team information retrieved successfully
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetsTeamInfo'
components:
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    WebsetsTeamInfo:
      type: object
      properties:
        object:
          type: string
          const: team
          description: The object type, always `"team"`.
        id:
          type: string
          description: Unique identifier for the team.
        name:
          type: string
          description: Name of the team.
        concurrency:
          type: object
          properties:
            active:
              type: integer
              description: Number of requests currently being processed.
            queued:
              type: integer
              description: Number of requests currently queued.
          required:
            - active
            - queued
          additionalProperties: false
          description: Current concurrency usage.
        limits:
          type: object
          properties:
            maxConcurrent:
              anyOf:
                - type: integer
                - type: 'null'
              description: >-
                Maximum number of concurrent requests allowed. Null means
                unlimited.
            maxQueued:
              anyOf:
                - type: integer
                - type: 'null'
              description: Maximum number of queued requests allowed. Null means unlimited.
          required:
            - maxConcurrent
            - maxQueued
          additionalProperties: false
          description: Concurrency limits for the team.
      required:
        - object
        - id
        - name
        - concurrency
        - limits
      additionalProperties: false
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