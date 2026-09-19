> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="delete-an-import">
  # import 삭제
</div>

> import를 삭제합니다.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /v0/imports/{id}
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
  /v0/imports/{id}:
    servers:
      - url: https://api.exa.ai/websets
    delete:
      tags:
        - Imports
      summary: 가져오기 삭제
      description: 가져오기를 삭제합니다.
      operationId: imports-delete
      parameters:
        - in: path
          name: id
          schema:
            type: string
          description: Import의 id
          required: true
      responses:
        '200':
          description: 가져오기가 성공적으로 삭제되었습니다
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
                $ref: '#/components/schemas/Import'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    Import:
      properties:
        id:
          description: Import의 고유 식별자
          type: string
        object:
          enum:
            - import
          description: 객체의 유형
          type: string
        status:
          enum:
            - pending
            - processing
            - completed
            - failed
            - canceled
          description: Import의 상태
          type: string
        format:
          enum:
            - csv
            - webset
          description: 가져오기의 형식입니다.
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: 가져오기에 포함된 엔티티의 유형입니다.
          nullable: true
        title:
          description: 가져오기의 제목
          type: string
        count:
          description: 가져오기에 포함된 엔티티 수
          type: number
        metadata:
          description: 이 객체와 연결하려는 키-값 쌍의 집합입니다.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        failedReason:
          enum:
            - invalid_format
            - invalid_file_content
            - missing_identifier
          type: string
          description: 가져오기가 실패한 이유
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: 가져오기가 실패한 시점
          nullable: true
        failedMessage:
          type: string
          description: 가져오기 실패에 대한 사람이 읽을 수 있는 메시지
          nullable: true
        createdAt:
          format: date-time
          description: 가져오기가 생성된 시점
          type: string
        updatedAt:
          format: date-time
          description: 가져오기가 마지막으로 업데이트된 시점
          type: string
      required:
        - id
        - object
        - status
        - format
        - entity
        - title
        - count
        - metadata
        - failedReason
        - failedAt
        - failedMessage
        - createdAt
        - updatedAt
      type: object
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
    CompanyEntity:
      properties:
        type:
          type: string
          const: company
          default: company
      required:
        - type
      title: 회사
      type: object
    PersonEntity:
      properties:
        type:
          type: string
          const: person
          default: person
      required:
        - type
      title: 인물
      type: object
    ArticleEntity:
      properties:
        type:
          type: string
          const: article
          default: article
      required:
        - type
      title: 기사
      type: object
    ResearchPaperEntity:
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
      title: 연구 논문
      type: object
    CustomEntity:
      properties:
        description:
          minLength: 2
          maxLength: 200
          type: string
        type:
          type: string
          const: custom
          default: custom
      required:
        - type
        - description
      title: 사용자 지정
      type: object
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>를 사용하여
        인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key 헤더에 Exa API 키를 전달하세요. Authorization: Bearer <key>를 사용하여
        인증할 수도 있습니다.
```