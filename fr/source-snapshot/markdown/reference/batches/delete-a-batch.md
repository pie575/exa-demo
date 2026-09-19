> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="delete-a-batch">
  # Supprimer un batch
</div>

> Supprimez un batch ayant un statut terminal.

La suppression d&#39;un batch le retire de l&#39;historique des batchs de votre team. Seuls les batchs ayant un statut terminal peuvent être supprimés.

<Card title="Obtenez votre clé API Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /batches/{id}
openapi: 3.1.0
info:
  title: API publique Exa
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /batches/{id}:
    delete:
      tags:
        - Batches
      summary: Supprimer un lot
      description: Supprimer de manière réversible un lot dans un statut terminal.
      operationId: deleteBatch
      parameters:
        - in: path
          name: id
          schema:
            type: string
            minLength: 1
            description: Identifiant du lot.
            example: batch_01j7x9v0m2n4p6q8r0s2t4v6w8
          required: true
          description: Identifiant du lot.
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
                object: batch.deleted
                deleted: true
              schema:
                $ref: '#/components/schemas/DeletedBatch'
        '400':
          $ref: '#/components/responses/BadRequestResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedResponse'
        '404':
          $ref: '#/components/responses/NotFoundResponse'
        '409':
          $ref: '#/components/responses/ConflictResponse'
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
        description: Jeton bêta requis pour l'API Batch.
      required: true
      description: Jeton bêta requis pour l'API Batch.
  headers:
    XRequestId:
      description: >-
        Identifiant unique de la requête. Correspond au champ `requestId`
        renvoyé dans les corps de réponse qui en comportent un.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    DeletedBatch:
      type: object
      properties:
        id:
          type: string
          description: Identifiant du lot supprimé.
        object:
          type: string
          const: batch.deleted
          description: Le type d'objet, toujours `batch.deleted`.
        deleted:
          type: boolean
          const: true
          description: Toujours `true` en cas de suppression réussie.
      required:
        - id
        - object
        - deleted
      additionalProperties: false
    ErrorResponse:
      type: object
      properties:
        requestId:
          type: string
          description: Identifiant unique de la requête.
          example: b5947044c4b78efa9552a7c89b306d95
        error:
          type: string
          description: Message lisible par un humain décrivant l'erreur.
          example: Invalid API key
        tag:
          type: string
          description: >-
            Étiquette d'erreur lisible par machine identifiant l'échec. L'ensemble
            des étiquettes est ouvert : de nouvelles étiquettes peuvent être ajoutées à tout moment,
            traitez donc les étiquettes non reconnues comme une erreur générique du statut HTTP de la réponse.
            Les étiquettes connues sont répertoriées à titre d'exemples.
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
      description: Enveloppe d'erreur standard renvoyée par l'API Exa pour les requêtes en échec.
  responses:
    BadRequestResponse:
      description: Le corps de la requête ou les paramètres de requête n'ont pas passé la validation.
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
      description: La clé API est manquante ou invalide.
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
    NotFoundResponse:
      description: La ressource demandée n'existe pas.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 3b1d5f7a9c0e2b4d6f8a0c2e4b6d8f0a
            error: Not found
            tag: NOT_FOUND
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    ConflictResponse:
      description: La requête entre en conflit avec l'état actuel de la ressource.
      headers:
        x-request-id:
          $ref: '#/components/headers/XRequestId'
      content:
        application/json:
          example:
            requestId: 5d7f9b1c3e0a2c4e6b8d0f2a4c6e8b0d
            error: Batch is not in a cancellable state
            tag: INVALID_REQUEST
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerErrorResponse:
      description: Une erreur inattendue s'est produite lors du traitement de la requête.
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
        Transmettez votre clé API Exa dans l'en-tête x-api-key. Vous pouvez également vous authentifier
        avec Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Transmettez votre clé API Exa dans l'en-tête x-api-key. Vous pouvez également vous authentifier
        avec Authorization: Bearer <key>.
```