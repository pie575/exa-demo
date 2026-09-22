> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="delete-a-webhook">
  # Menghapus webhook
</div>

> Menghapus sebuah Webhook. Statusnya menjadi `inactive`, sehingga pengiriman webhook berikutnya ke URL-nya dihentikan.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /v0/webhooks/{id}
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
  /v0/webhooks/{id}:
    servers:
      - url: https://api.exa.ai/websets
    delete:
      tags:
        - Webhooks
      summary: Delete a Webhook
      description: >-
        Deletes a Webhook. Its status becomes `inactive`, which stops future
        webhook deliveries to its URL.
      operationId: webhooks-delete
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: The id of the webhook
          required: true
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
        '404':
          description: Webhook not found
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
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