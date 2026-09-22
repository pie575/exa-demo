> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 웹훅 시도 목록 조회 {#list-webhook-attempts}

> 웹훅이 수행한 모든 시도를 내림차순으로 조회합니다.

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
      summary: 웹훅 시도 목록 조회
      description: 웹훅이 수행한 모든 시도를 내림차순으로 정렬하여 나열합니다.
      operationId: webhooks-attempts-list
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: 웹훅의 ID
          required: true
        - in: query
          name: cursor
          schema:
            minLength: 1
            type: string
          required: false
          description: 결과를 페이지 단위로 탐색하기 위한 커서
        - in: query
          name: limit
          schema:
            default: 25
            minimum: 1
            maximum: 200
            type: integer
          required: false
          description: 반환할 결과의 개수
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
          description: 필터링할 이벤트 유형
        - in: query
          name: successful
          schema:
            type: boolean
          required: false
          description: 성공 여부로 시도를 필터링합니다
      responses:
        '200':
          description: 웹훅 시도 목록
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 요청의 고유 식별자입니다.
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
          description: 웹훅 시도 목록
          type: array
        hasMore:
          description: 페이지 단위로 탐색할 결과가 더 있는지 여부
          type: boolean
        nextCursor:
          type: string
          description: 다음 결과 집합을 페이지 단위로 탐색하기 위한 커서
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
    WebhookAttempt:
      properties:
        id:
          description: 웹훅 시도의 고유 식별자
          type: string
        object:
          const: webhook_attempt
          default: webhook_attempt
          type: string
        eventId:
          description: 이벤트의 고유 식별자
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
          description: 이벤트의 유형
          type: string
        webhookId:
          description: 웹훅의 고유 식별자
          type: string
        url:
          description: 시도 중에 사용된 URL
          type: string
        successful:
          description: 시도의 성공 여부
          type: boolean
        responseHeaders:
          propertyNames:
            type: string
          additionalProperties:
            type: string
          description: 응답의 헤더
          type: object
        responseBody:
          type: string
          description: 응답의 본문
          nullable: true
        responseStatusCode:
          description: 응답의 상태 코드
          type: number
        attempt:
          description: 웹훅의 시도 횟수
          type: number
        attemptedAt:
          format: date-time
          description: 웹훅 시도가 수행된 날짜 및 시간
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
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>를
        사용하여 인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>를
        사용하여 인증할 수도 있습니다.
```