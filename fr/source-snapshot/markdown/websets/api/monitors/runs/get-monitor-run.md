> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="get-a-monitor-run">
  # Récupérer une exécution de monitor
</div>

> Récupère une exécution de monitor spécifique.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/monitors/{monitor}/runs/{id}
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
  /v0/monitors/{monitor}/runs/{id}:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors Runs
      summary: Récupérer une exécution de monitor
      description: Récupère une exécution de monitor spécifique.
      operationId: monitors-runs-get
      parameters:
        - in: path
          name: monitor
          schema:
            type: string
          description: L'id du Monitor dont on souhaite récupérer l'exécution
          required: true
        - in: path
          name: id
          schema:
            type: string
          required: true
      responses:
        '200':
          description: Détails de l'exécution du monitor
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Identifiant unique de la requête.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MonitorRun'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    MonitorRun:
      properties:
        id:
          description: L'identifiant unique de l'exécution du Monitor
          type: string
        object:
          enum:
            - monitor_run
          description: Le type d'objet
          type: string
        monitorId:
          description: Le monitor auquel l'exécution est associée
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: Le status de l'exécution du Monitor
          type: string
        completedAt:
          format: date-time
          type: string
          description: Date à laquelle l'exécution s'est terminée
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: Date à laquelle l'exécution a échoué
          nullable: true
        failedReason:
          type: string
          description: La raison de l'échec de l'exécution
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: Date à laquelle l'exécution a été annulée
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: Date de création de l'exécution
        updatedAt:
          type: string
          format: date-time
          description: Date de dernière mise à jour de l'exécution
        type:
          type: string
          enum:
            - search
            - refresh
          description: Le type de l'exécution du Monitor
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
        Transmettez votre Exa API key dans le header x-api-key. Vous pouvez
        également vous authentifier avec Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Transmettez votre Exa API key dans le header x-api-key. Vous pouvez
        également vous authentifier avec Authorization: Bearer <key>.

```