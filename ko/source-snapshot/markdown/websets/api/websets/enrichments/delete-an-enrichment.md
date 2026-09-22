> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="delete-an-enrichment">
  # enrichment 삭제
</div>

> Enrichment를 삭제하면 실행 중인 enrichment는 모두 취소되고, 해당 Enrichment가 생성한 기존 `enrichment_result`도 더 이상 사용할 수 없습니다.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /v0/websets/{webset}/enrichments/{id}
openapi: 3.1.0
info:
  title: Exa 공개 API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /v0/websets/{webset}/enrichments/{id}:
    servers:
      - url: https://api.exa.ai/websets
    delete:
      tags:
        - Enrichments
      summary: Enrichment 삭제
      description: >-
        Enrichment를 삭제하면 실행 중인 모든 enrichment가 취소되며 이 Enrichment가 생성한 기존
        `enrichment_result`는 더 이상 사용할 수 없습니다.
      operationId: websets-enrichments-delete
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: Webset의 id 또는 externalId
          required: true
        - in: path
          name: id
          schema:
            type: string
          description: Enrichment의 id
          required: true
      responses:
        '200':
          description: Enrichment가 삭제되었습니다
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
                $ref: '#/components/schemas/WebsetEnrichment'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    WebsetEnrichment:
      properties:
        id:
          description: enrichment의 고유 식별자
          type: string
        object:
          const: webset_enrichment
          default: webset_enrichment
          type: string
        status:
          enum:
            - pending
            - canceled
            - completed
          description: enrichment의 상태
          title: WebsetEnrichmentStatus
          type: string
        websetId:
          description: 이 enrichment가 속한 Webset의 고유 식별자입니다.
          type: string
        title:
          type: string
          description: >-
            enrichment의 제목입니다.


            이는 description과 format을 기반으로 자동 생성됩니다.
          nullable: true
        description:
          description: >-
            enrichment 생성 시 제공된 enrichment 작업에 대한 설명입니다.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          description: enrichment 응답의 형식입니다.
          nullable: true
        options:
          items:
            properties:
              label:
                description: 옵션의 레이블
                type: string
            required:
              - label
            type: object
          type: array
          description: >-
            format이 options인 경우, enrichment 에이전트가 선택할 수 있는 여러 옵션입니다.
          title: WebsetEnrichmentOptions
          nullable: true
        instructions:
          type: string
          description: >-
            enrichment 에이전트를 위한 지침입니다.


            이는 description과 format을 기반으로 자동 생성됩니다.
          nullable: true
        metadata:
          default: {}
          description: enrichment의 메타데이터
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: enrichment가 생성된 날짜와 시간
          type: string
        updatedAt:
          format: date-time
          description: enrichment가 업데이트된 날짜와 시간
          type: string
      required:
        - id
        - object
        - status
        - websetId
        - title
        - description
        - format
        - options
        - instructions
        - createdAt
        - updatedAt
      type: object
    WebsetEnrichmentFormat:
      enum:
        - text
        - date
        - number
        - options
        - email
        - phone
        - url
      type: string
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>로도 인증할 수
        있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>로도 인증할 수
        있습니다.

```