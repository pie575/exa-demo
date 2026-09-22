> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="create-an-import">
  # import 생성
</div>

> 데이터를 Websets에 업로드하기 위한 새로운 import를 생성합니다. import는 다음과 같은 용도로 사용할 수 있습니다:

* **Enrich**: AI 기반 enrichment 엔진으로 데이터에 추가 정보를 보강합니다
* **Search**: Websets의 에이전틱 search와 자연어 필터로 데이터를 질의합니다
* **Exclude**: 중복되거나 이미 알고 있는 result가 search 결과에 나타나지 않도록 합니다

import가 생성되면 `uploadValidUntil`(기본값 1시간)까지 반환된 `uploadUrl`에 데이터를 업로드할 수 있습니다.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml POST /v0/imports
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
  /v0/imports:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Imports
      summary: Create an Import
      description: >-
        Creates a new import to upload your data into Websets. Imports can be
        used to:


        - **Enrich**: Enhance your data with additional information using our
        AI-powered enrichment engine

        - **Search**: Query your data using Websets' agentic search with natural
        language filters

        - **Exclude**: Prevent duplicate or already known results from appearing
        in your searches


        Once the import is created, you can upload your data to the returned
        `uploadUrl` until `uploadValidUntil` (by default 1 hour).
      operationId: imports-create
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateImportParameters'
      responses:
        '201':
          description: Import created successfully
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
                $ref: '#/components/schemas/CreateImportResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    CreateImportParameters:
      discriminator:
        propertyName: format
      oneOf:
        - properties:
            size:
              maximum: 50000000
              description: The size of the file in bytes. Maximum size is 50 MB.
              type: number
            count:
              description: The number of records to import
              type: number
            title:
              description: The title of the import
              type: string
            format:
              enum:
                - csv
              description: >-
                When the import is in CSV format, we expect a column containing
                the key identifier for the entity - for now URL. If not
                provided, import will fail to be processed.
              type: string
            metadata:
              description: Set of key-value pairs you want to associate with this object.
              propertyNames:
                type: string
              additionalProperties:
                type: string
                maxLength: 1000
              type: object
            entity:
              description: >-
                What type of entity the import contains (e.g. People, Companies,
                etc.), and thus should be attempted to be resolved as.
              oneOf:
                - $ref: '#/components/schemas/CompanyEntity'
                - $ref: '#/components/schemas/PersonEntity'
                - $ref: '#/components/schemas/ArticleEntity'
                - $ref: '#/components/schemas/ResearchPaperEntity'
                - $ref: '#/components/schemas/CustomEntity'
            csv:
              description: When format is `csv`, these are the specific import parameters.
              properties:
                identifier:
                  description: >-
                    Column containing the key identifier for the entity (e.g.
                    URL, Name, etc.). If not provided, we will try to infer it
                    from the file.
                  minimum: 0
                  type: integer
              type: object
          required:
            - size
            - count
            - format
            - entity
          type: object
    CreateImportResponse:
      properties:
        id:
          description: The unique identifier for the Import
          type: string
        object:
          enum:
            - import
          description: The type of object
          type: string
        status:
          enum:
            - pending
            - processing
            - completed
            - failed
            - canceled
          description: The status of the Import
          type: string
        format:
          enum:
            - csv
            - webset
          description: The format of the import.
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: The type of entity the import contains.
          nullable: true
        title:
          description: The title of the import
          type: string
        count:
          description: The number of entities in the import
          type: number
        metadata:
          description: Set of key-value pairs you want to associate with this object.
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
          description: The reason the import failed
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: When the import failed
          nullable: true
        failedMessage:
          type: string
          description: A human readable message of the import failure
          nullable: true
        createdAt:
          format: date-time
          description: When the import was created
          type: string
        updatedAt:
          format: date-time
          description: When the import was last updated
          type: string
        uploadUrl:
          description: The URL to upload the file to
          type: string
        uploadValidUntil:
          description: >-
            The date and time until the upload URL is valid. The upload URL will
            be valid for 1 hour.
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
        - uploadUrl
        - uploadValidUntil
      description: >-
        The response to a successful import. Includes the upload URL and the
        upload valid until date.
      type: object
    CompanyEntity:
      properties:
        type:
          type: string
          const: company
          default: company
      required:
        - type
      title: Company
      type: object
    PersonEntity:
      properties:
        type:
          type: string
          const: person
          default: person
      required:
        - type
      title: Person
      type: object
    ArticleEntity:
      properties:
        type:
          type: string
          const: article
          default: article
      required:
        - type
      title: Article
      type: object
    ResearchPaperEntity:
      properties:
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
      title: Research Paper
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
      title: Custom
      type: object
    Entity:
      oneOf:
        - $ref: '#/components/schemas/CompanyEntity'
        - $ref: '#/components/schemas/PersonEntity'
        - $ref: '#/components/schemas/ArticleEntity'
        - $ref: '#/components/schemas/ResearchPaperEntity'
        - $ref: '#/components/schemas/CustomEntity'
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