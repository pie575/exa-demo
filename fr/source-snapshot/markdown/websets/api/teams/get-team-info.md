> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="get-team-info">
  # Obtenir les informations de l&#39;équipe
</div>

> Récupérez les informations relatives à votre équipe, notamment l&#39;utilisation de la concurrency et les limites.

<div id="overview">
  ## Aperçu
</div>

L&#39;endpoint Obtenir les informations de l'équipe renvoie des informations sur l&#39;équipe authentifiée, notamment sa concurrency usage actuelle et sa limite configurée. Utile pour suivre votre usage de l&#39;API Websets et comprendre vos limites de débit.

<div id="response">
  ## Réponse
</div>

La réponse comprend :

* **object** : toujours « équipe »
* **id** : l&#39;identifiant unique de votre équipe
* **name** : le nom de votre équipe
* **concurrency** : l&#39;usage actuel, indiquant les requests actives et en file d&#39;attente
* **limits** : les limites de concurrency de votre équipe

<div id="concurrency-fields">
  ### Champs de concurrency
</div>

L&#39;objet `concurrency` indique l&#39;état actuel de vos requests :

* **active** : nombre de requests en cours de traitement
* **en file d'attente** : nombre de requests en attente de traitement

<div id="limits-fields">
  ### Champs Limits
</div>

L&#39;objet `limits` présente les limites configurées pour votre équipe :

* **maxConcurrent** : nombre maximal de requests pouvant être traitées simultanément (null signifie illimité)
* **maxQueued** : nombre maximal de requests pouvant être mises en file d&#39;attente (null signifie illimité)

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
      summary: Obtenir les informations de l'équipe
      description: >-
        Renvoie les informations sur l'équipe authentifiée, y compris
        l'utilisation actuelle de la concurrency et les limites.
      operationId: teams-me-get
      responses:
        '200':
          description: Informations de l'équipe récupérées avec succès
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
        Identifiant unique de la requête. Correspond au champ `requestId`
        renvoyé dans les corps de réponse qui en contiennent un.
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
          description: Le type d'objet, toujours `"team"`.
        id:
          type: string
          description: Identifiant unique de l'équipe.
        name:
          type: string
          description: Nom de l'équipe.
        concurrency:
          type: object
          properties:
            active:
              type: integer
              description: Nombre de requests en cours de traitement.
            queued:
              type: integer
              description: Nombre de requests actuellement en file d'attente.
          required:
            - active
            - queued
          additionalProperties: false
          description: Utilisation actuelle de la concurrency.
        limits:
          type: object
          properties:
            maxConcurrent:
              anyOf:
                - type: integer
                - type: 'null'
              description: >-
                Nombre maximal de requests concurrentes autorisées. Null
                signifie illimité.
            maxQueued:
              anyOf:
                - type: integer
                - type: 'null'
              description: Nombre maximal de requests en file d'attente autorisées. Null signifie illimité.
          required:
            - maxConcurrent
            - maxQueued
          additionalProperties: false
          description: Limites de concurrency de l'équipe.
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
        Transmettez votre clé API Exa dans le header x-api-key. Vous pouvez
        également vous authentifier avec Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Transmettez votre clé API Exa dans le header x-api-key. Vous pouvez
        également vous authentifier avec Authorization: Bearer <key>.

```