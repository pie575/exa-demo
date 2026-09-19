> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="update-an-enrichment">
  # Actualizar un enrichment
</div>

> Actualiza la configuración de un Enrichment de un Webset.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml PATCH /v0/websets/{webset}/enrichments/{id}
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
  /v0/websets/{webset}/enrichments/{id}:
    servers:
      - url: https://api.exa.ai/websets
    patch:
      tags:
        - Enrichments
      summary: Update an Enrichment
      description: Update an Enrichment configuration for a Webset.
      operationId: websets-enrichments-update
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          required: true
        - in: path
          name: id
          schema:
            type: string
          required: true
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateEnrichmentParameters'
      responses:
        '200':
          description: ''
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
    UpdateEnrichmentParameters:
      properties:
        description:
          minLength: 1
          maxLength: 5000
          description: >-
            Provide a description of the enrichment task you want to perform to
            each Webset Item.
          type: string
        format:
          description: >-
            Format of the enrichment response.


            We automatically select the best format based on the description. If
            you want to explicitly specify the format, you can do so here.
          enum:
            - text
            - date
            - number
            - options
            - email
            - phone
            - url
          type: string
        options:
          description: >-
            When the format is options, the different options for the enrichment
            agent to choose from.
          minItems: 1
          maxItems: 150
          items:
            properties:
              label:
                description: The label of the option
                type: string
            required:
              - label
            type: object
          type: array
        metadata:
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
          description: Set of key-value pairs you want to associate with this object.
          nullable: true
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

```