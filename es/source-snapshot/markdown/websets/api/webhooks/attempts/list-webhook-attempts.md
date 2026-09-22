> ## Índice de documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Listar intentos de webhook {#list-webhook-attempts}

> Lista todos los intentos realizados por un Webhook, en orden descendente.

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /v0/webhooks/{id}/attempts
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
  /v0/webhooks/{id}/attempts:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Webhooks Attempts
      summary: List webhook attempts
      description: List all attempts made by a Webhook ordered in descending order.
      operationId: webhooks-attempts-list
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: The ID of the webhook
          required: true
        - in: query
          name: cursor
          schema:
            minLength: 1
            type: string
          required: false
          description: The cursor to paginate through the results
        - in: query
          name: limit
          schema:
            default: 25
            minimum: 1
            maximum: 200
            type: integer
          required: false
          description: The number of results to return
        - in: query
          name: eventType
          schema:
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
          required: false
          description: The type of event to filter by
        - in: query
          name: successful
          schema:
            type: boolean
          required: false
          description: Filter attempts by their success status
      responses:
        '200':
          description: List of webhook attempts
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
                $ref: '#/components/schemas/ListWebhookAttemptsResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    ListWebhookAttemptsResponse:
      properties:
        data:
          items:
            $ref: '#/components/schemas/WebhookAttempt'
          description: The list of webhook attempts
          type: array
        hasMore:
          description: Whether there are more results to paginate through
          type: boolean
        nextCursor:
          type: string
          description: The cursor to paginate through the next set of results
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
    WebhookAttempt:
      properties:
        id:
          description: The unique identifier for the webhook attempt
          type: string
        object:
          const: webhook_attempt
          default: webhook_attempt
          type: string
        eventId:
          description: The unique identifier for the event
          type: string
        eventType:
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
          description: The type of event
          type: string
        webhookId:
          description: The unique identifier for the webhook
          type: string
        url:
          description: The URL that was used during the attempt
          type: string
        successful:
          description: Whether the attempt was successful
          type: boolean
        responseHeaders:
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: The headers of the response
          type: object
        responseBody:
          type: string
          description: The body of the response
          nullable: true
        responseStatusCode:
          description: The status code of the response
          type: number
        attempt:
          description: The attempt number of the webhook
          type: number
        attemptedAt:
          format: date-time
          description: The date and time the webhook attempt was made
          type: string
      required:
        - id
        - object
        - eventId
        - eventType
        - webhookId
        - url
        - successful
        - responseHeaders
        - responseBody
        - responseStatusCode
        - attempt
        - attemptedAt
      type: object
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