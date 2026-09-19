> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="delete-an-enrichment">
  # Supprimer un Enrichment
</div>

> Lors de la suppression d&#39;un Enrichment, tous les Enrichments en cours seront annulés et l&#39;ensemble des `enrichment_result` générés par cet Enrichment ne seront plus disponibles.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /v0/websets/{webset}/enrichments/{id}
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
  /v0/websets/{webset}/enrichments/{id}:
    servers:
      - url: https://api.exa.ai/websets
    delete:
      tags:
        - Enrichments
      summary: Supprimer une Enrichment
      description: >-
        Lors de la suppression d'une Enrichment, toutes les enrichments en cours
        d'exécution sont annulées et tous les `enrichment_result` existants
        générés par cette Enrichment ne sont plus disponibles.
      operationId: websets-enrichments-delete
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: L'id ou l'externalId du Webset
          required: true
        - in: path
          name: id
          schema:
            type: string
          description: L'id de l'Enrichment
          required: true
      responses:
        '200':
          description: Enrichment supprimée
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
                $ref: '#/components/schemas/WebsetEnrichment'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    WebsetEnrichment:
      properties:
        id:
          description: L'identifiant unique de l'enrichment
          type: string
        object:
          const: webset_enrichment
          default: webset_enrichment
          type: string
        status:
          enum:
            - pending
            - canceled
            - completed
          description: Le status de l'enrichment
          title: WebsetEnrichmentStatus
          type: string
        websetId:
          description: L'identifiant unique du Webset auquel appartient cette enrichment.
          type: string
        title:
          type: string
          description: >-
            Le titre de l'enrichment.


            Il est généré automatiquement à partir de la description et du
            format.
          nullable: true
        description:
          description: >-
            La description de la tâche d'enrichment fournie lors de la création
            de l'enrichment.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          description: Le format de la response de l'enrichment.
          nullable: true
        options:
          items:
            properties:
              label:
                description: Le libellé de l'option
                type: string
            required:
              - label
            type: object
          type: array
          description: >-
            Lorsque le format est options, les différentes options parmi
            lesquelles l'agent d'enrichment peut choisir.
          title: WebsetEnrichmentOptions
          nullable: true
        instructions:
          type: string
          description: >-
            Les instructions destinées à l'Agent d'enrichment.


            Elles sont générées automatiquement à partir de la description et du
            format.
          nullable: true
        metadata:
          default: {}
          description: Les metadata de l'enrichment
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: La date et l'heure de création de l'enrichment
          type: string
        updatedAt:
          format: date-time
          description: La date et l'heure de mise à jour de l'enrichment
          type: string
      required:
        - id
        - object
        - status
        - websetId
        - title
        - description
        - format
        - options
        - instructions
        - createdAt
        - updatedAt
      type: object
    WebsetEnrichmentFormat:
      enum:
        - text
        - date
        - number
        - options
        - email
        - phone
        - url
      type: string
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