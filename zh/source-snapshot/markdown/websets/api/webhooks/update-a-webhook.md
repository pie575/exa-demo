> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

# 更新 webhook {#update-a-webhook}

> 更新 Webhook 的目标 URL、订阅的 events 或元数据。未提供的 fields 保持不变。

<Warning>
  **不会跟随重定向。** 如果你更新 URL，请确保它是最终目标地址。返回 3xx
  重定向的端点将被视为投递失败。
</Warning>

## OpenAPI {#openapi}

```yaml exa-spec.yaml PATCH /v0/webhooks/{id}
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
    patch:
      tags:
        - Webhooks
      summary: Update a Webhook
      description: >-
        Updates the target URL, subscribed events, or metadata of a Webhook.
        Omitted fields are left unchanged.
      operationId: webhooks-update
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: The id of the webhook
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateWebhookParameters'
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
    UpdateWebhookParameters:
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