> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="get-team-info">
  # Obtenir les informations de l&#39;équipe
</div>

> Récupérez les informations sur votre équipe, notamment l&#39;utilisation de la concurrency et les limites associées.

<div id="overview">
  ## Aperçu
</div>

L&#39;endpoint Get Team Info renvoie des informations sur l&#39;équipe authentifiée, notamment sa concurrency utilisation actuelle et ses limites configurées. Pratique pour suivre votre utilisation de l&#39;API Websets et comprendre vos limites de débit.

<div id="response">
  ## Réponse
</div>

La réponse comprend :

* **object** : toujours « team »
* **id** : l&#39;identifiant unique de votre équipe
* **name** : le nom de votre équipe
* **concurrency** : l&#39;utilisation actuelle, indiquant les requests actives et en file d&#39;attente
* **limits** : les limites de concurrency de votre équipe

<div id="concurrency-fields">
  ### Fields de concurrency
</div>

L&#39;objet `concurrency` indique l&#39;état actuel de vos requests :

* **active** : nombre de requests en cours de traitement
* **en file d'attente** : nombre de requests en attente de traitement

<div id="limits-fields">
  ### Fields de l&#39;objet limits
</div>

L&#39;objet `limits` affiche les limites configurées pour votre équipe :

* **maxConcurrent** : nombre maximal de requests pouvant être traitées simultanément (null signifie illimité)
* **maxQueued** : nombre maximal de requests pouvant patienter dans la file d&#39;attente (null signifie illimité)

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