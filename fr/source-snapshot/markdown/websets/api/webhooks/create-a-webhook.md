> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Créer un webhook {#create-a-webhook}

> Crée un Webhook qui transmet les events sélectionnés à votre URL au fur et à mesure qu&#39;ils se produisent.

La réponse contient le `secret` de signature permettant de vérifier les deliveries ; il n&#39;est renvoyé qu&#39;à la création.

<Warning>
  **Les redirections ne sont pas suivies.** Les deliveries de webhook sont envoyées directement à
  l&#39;URL enregistrée. Si votre endpoint répond par une redirection 3xx, la delivery
  est considérée comme un échec. Enregistrez toujours l&#39;URL de destination finale.
</Warning>

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /v0/webhooks
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
  /v0/webhooks:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Webhooks
      summary: Create a Webhook
      description: >-
        Creates a Webhook that delivers the selected events to your URL as they
        occur.


        The response includes the signing `secret` used to verify deliveries; it
        is only returned on creation.
      operationId: webhooks-create
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateWebhookParameters'
      responses:
        '200':
          description: Webhook
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webhook'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    CreateWebhookParameters:
      properties:
        events:
          minItems: 1
          maxItems: 19
          items:
            $ref: '#/components/schemas/EventType'
          description: The events to trigger the webhook
          type: array
        url:
          format: uri
          description: The URL to send the webhook to
          type: string
        metadata:
          description: Set of key-value pairs you want to associate with this object.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
      required:
        - events
        - url
      type: object
    Webhook:
      properties:
        id:
          description: The unique identifier for the webhook
          type: string
        object:
          const: webhook
          default: webhook
          type: string
        status:
          enum:
            - active
            - inactive
          title: WebhookStatus
          description: The status of the webhook
          type: string
        events:
          minItems: 1
          items:
            $ref: '#/components/schemas/EventType'
          description: The events to trigger the webhook
          type: array
        url:
          format: uri
          description: The URL to send the webhook to
          type: string
        secret:
          type: string
          description: >-
            The secret to verify the webhook signature. Only returned on Webhook
            creation.
          nullable: true
        metadata:
          default: {}
          description: The metadata of the webhook
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: The date and time the webhook was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the webhook was last updated
          type: string
      required:
        - id
        - object
        - status
        - events
        - url
        - secret
        - createdAt
        - updatedAt
      type: object
    EventType:
      enum:
        - webset.created
        - webset.deleted
        - webset.paused
        - webset.idle
        - webset.search.created
        - webset.search.canceled
        - webset.search.completed
        - webset.search.updated
        - import.created
        - import.completed
        - webset.item.created
        - webset.item.enriched
        - monitor.created
        - monitor.updated
        - monitor.deleted
        - monitor.run.created
        - monitor.run.completed
        - webset.export.created
        - webset.export.completed
      type: string
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