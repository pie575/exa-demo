> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="delete-an-enrichment">
  # Eliminar un enrichment
</div>

> Al eliminar un Enrichment, se cancelarán los enrichments en curso y todos los `enrichment_result` existentes generados por este Enrichment dejarán de estar disponibles.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /v0/websets/{webset}/enrichments/{id}
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
    delete:
      tags:
        - Enrichments
      summary: Eliminar un Enrichment
      description: >-
        Al eliminar un Enrichment, cualquier enrichment en ejecución se
        cancelará y todos los `enrichment_result` existentes generados por este
        Enrichment dejarán de estar disponibles.
      operationId: websets-enrichments-delete
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: El id o externalId del Webset
          required: true
        - in: path
          name: id
          schema:
            type: string
          description: El id del Enrichment
          required: true
      responses:
        '200':
          description: Enrichment eliminado
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Identificador único de la solicitud.
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
          description: El identificador único del enrichment
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
          description: El estado del enrichment
          title: WebsetEnrichmentStatus
          type: string
        websetId:
          description: El identificador único del Webset al que pertenece este enrichment.
          type: string
        title:
          type: string
          description: >-
            El título del enrichment.


            Se generará automáticamente en función de la descripción y el
            formato.
          nullable: true
        description:
          description: >-
            La descripción de la tarea de enrichment proporcionada durante
            la creación del enrichment.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
          description: El formato de la respuesta del enrichment.
          nullable: true
        options:
          items:
            properties:
              label:
                description: La etiqueta de la opción
                type: string
            required:
              - label
            type: object
          type: array
          description: >-
            Cuando el formato es options, las diferentes opciones entre las que
            puede elegir el agente de enrichment.
          title: WebsetEnrichmentOptions
          nullable: true
        instructions:
          type: string
          description: >-
            Las instrucciones para el Agent de enrichment.


            Se generará automáticamente en función de la descripción y el
            formato.
          nullable: true
        metadata:
          default: {}
          description: Los metadatos del enrichment
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: La fecha y hora en que se creó el enrichment
          type: string
        updatedAt:
          format: date-time
          description: La fecha y hora en que se actualizó el enrichment
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
        Pase su clave de API de Exa en el encabezado x-api-key. También puede
        autenticarse con Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Pase su clave de API de Exa en el encabezado x-api-key. También puede
        autenticarse con Authorization: Bearer <key>.

```