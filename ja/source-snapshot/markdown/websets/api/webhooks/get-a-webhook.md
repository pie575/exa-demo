> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="get-a-webhook">
  # webhook を取得する
</div>

> ID を指定して Webhook を取得します。レスポンスにはステータス、サブスクライブしているイベント、送信先 URL、メタデータが含まれます。署名用の `secret` は返されません。

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/webhooks/{id}
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
    get:
      tags:
        - Webhooks
      summary: Webhookを取得
      description: >-
        指定したIDのWebhookを返します。レスポンスには、ステータス、サブスクライブしているイベント、送信先URL、メタデータが含まれます。署名用の `secret` は返されません。
      operationId: webhooks-get
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: WebhookのID
          required: true
      responses:
        '200':
          description: Webhook
          headers:
            X-Request-Id:
              schema:
                type: string
              description: リクエストの一意の識別子。
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webhook'
        '404':
          description: Webhookが見つかりません
          headers:
            X-Request-Id:
              schema:
                type: string
              description: リクエストの一意の識別子。
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
          description: Webhookの一意の識別子
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
          description: Webhookのステータス
          type: string
        events:
          minItems: 1
          items:
            $ref: '#/components/schemas/EventType'
          description: Webhookをトリガーするイベント
          type: array
        url:
          format: uri
          description: Webhookの送信先URL
          type: string
        secret:
          type: string
          description: >-
            Webhookの署名を検証するためのシークレット。Webhookの作成時にのみ返されます。
          nullable: true
        metadata:
          default: {}
          description: Webhookのメタデータ
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: Webhookの作成日時
          type: string
        updatedAt:
          format: date-time
          description: Webhookの最終更新日時
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
        Exa API keyをx-api-keyヘッダーに指定して渡してください。Authorization: Bearer <key> で認証することもできます。
    bearer:
      type: http
      scheme: bearer
      description: >-
        Exa API keyをx-api-keyヘッダーに指定して渡してください。Authorization: Bearer <key> で認証することもできます。

```