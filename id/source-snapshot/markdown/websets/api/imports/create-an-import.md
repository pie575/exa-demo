> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

# Membuat impor {#create-an-import}

> Membuat impor baru untuk mengunggah data Anda ke Websets. Impor dapat digunakan untuk:

* **Enrich**: Memperkaya data Anda dengan informasi tambahan menggunakan mesin enrichment bertenaga AI kami
* **Search**: Menelusuri data Anda menggunakan agentic search Websets dengan filter berbahasa alami
* **Exclude**: Mencegah hasil duplikat atau yang sudah diketahui muncul dalam search Anda

Setelah impor dibuat, Anda dapat mengunggah data ke `uploadUrl` yang dikembalikan hingga `uploadValidUntil` (secara default 1 jam).

## OpenAPI {#openapi}

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