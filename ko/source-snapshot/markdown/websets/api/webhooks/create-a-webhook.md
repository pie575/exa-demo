> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 웹훅 생성 {#create-a-webhook}

> 선택한 이벤트가 발생할 때마다 해당 이벤트를 지정한 URL로 전달하는 웹훅을 생성합니다.

response에는 전송 내용을 검증하는 데 사용하는 서명용 `secret`이 포함되며, 이 값은 생성 시에만 반환됩니다.

<Warning>
  **리다이렉트는 따라가지 않습니다.** 웹훅은 등록된 URL로 직접 전송됩니다.
  엔드포인트가 3xx 리다이렉트로 응답하면 해당 전송은 실패로 처리됩니다.
  항상 최종 목적지 URL을 등록하세요.
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