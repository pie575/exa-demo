> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# List imports

> Lists all imports for the Webset.



## OpenAPI

````yaml exa-spec.yaml GET /v0/imports
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
    get:
      tags:
        - Imports
      summary: List Imports
      description: Lists all imports for the Webset.
      operationId: imports-list
      parameters:
        - in: query
          name: cursor
          schema:
            minLength: 1
            type: string
          required: false
          description: The cursor to paginate through the results
        - in: query
          name: limit
          schema:
            default: 25
            minimum: 1
            maximum: 200
            type: integer
          required: false
          description: The number of results to return
      responses:
        '200':
          description: List of imports
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
                $ref: '#/components/schemas/ListImportsResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    ListImportsResponse:
      properties:
        data:
          items:
            $ref: '#/components/schemas/Import'
          description: The list of imports
          type: array
        hasMore:
          description: Whether there are more results to paginate through
          type: boolean
        nextCursor:
          type: string
          description: The cursor to paginate through the next set of results
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
    Import:
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

````