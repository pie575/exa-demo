> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

# 获取 webhook {#get-a-webhook}

> 根据 id 返回对应的 Webhook，包括其状态、已订阅的事件、目标 URL 和元数据。签名用的 `secret` 不会返回。

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /v0/webhooks/{id}
openapi: 3.1.0
info:
  title: Exa 公共 API
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
    get:
      tags:
        - Webhooks
      summary: 获取 Webhook
      description: >-
        根据 id 返回 Webhook，包括其状态、已订阅的事件、目标
        URL 和元数据。签名用的 `secret` 不会返回。
      operationId: webhooks-get
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: webhook 的 id
          required: true
      responses:
        '200':
          description: Webhook
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 请求的唯一标识符。
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webhook'
        '404':
          description: 未找到 Webhook
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 请求的唯一标识符。
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
          description: webhook 的唯一标识符
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
          description: webhook 的状态
          type: string
        events:
          minItems: 1
          items:
            $ref: '#/components/schemas/EventType'
          description: 触发该 webhook 的事件
          type: array
        url:
          format: uri
          description: 发送 webhook 的目标 URL
          type: string
        secret:
          type: string
          description: >-
            用于验证 webhook 签名的密钥。仅在创建 Webhook
            时返回。
          nullable: true
        metadata:
          default: {}
          description: webhook 的元数据
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: webhook 的创建日期和时间
          type: string
        updatedAt:
          format: date-time
          description: webhook 最后一次更新的日期和时间
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
        在 x-api-key 请求头中传入你的 Exa API 密钥。你也可以使用
        Authorization: Bearer <key> 进行认证。
    bearer:
      type: http
      scheme: bearer
      description: >-
        在 x-api-key 请求头中传入你的 Exa API 密钥。你也可以使用
        Authorization: Bearer <key> 进行认证。

```