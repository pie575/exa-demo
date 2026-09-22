> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="get-a-webhook">
  # 웹훅 조회
</div>

> id로 Webhook을 반환하며, 상태, 구독 중인 events, 대상 URL, metadata가 함께 포함됩니다. 서명용 `secret`은 반환되지 않습니다.

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
      summary: Get a Webhook
      description: >-
        Returns a Webhook by id, including its status, subscribed events, target
        URL, and metadata. The signing `secret` is not returned.
      operationId: webhooks-get
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