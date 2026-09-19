> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="delete-an-item">
  # Eliminar un item
</div>

> Elimina un Item del Webset.

Esto cancelará cualquier proceso de enrichment asociado.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml DELETE /v0/websets/{webset}/items/{id}
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
  /v0/websets/{webset}/items/{id}:
    servers:
      - url: https://api.exa.ai/websets
    delete:
      tags:
        - Items
      summary: Delete an Item
      description: |-
        Deletes an Item from the Webset.

        Esto cancelará cualquier proceso de enriquecimiento para él.
      operationId: websets-items-delete
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
          description: El id del elemento del Webset
          required: true
      responses:
        '200':
          description: Elemento del Webset eliminado
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
                $ref: '#/components/schemas/WebsetItem'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    WebsetItem:
      properties:
        id:
          description: El identificador único del elemento del Webset
          type: string
        object:
          const: webset_item
          default: webset_item
          type: string
        source:
          enum:
            - search
            - import
          description: La fuente del elemento
          type: string
        sourceId:
          description: El identificador único de la fuente
          type: string
        sourceEntityId:
          description: >-
            El identificador original usado para resolver este elemento (p. ej.,
            correo electrónico, nombre o URL). Solo es relevante cuando la
            fuente es import.
          type: string
        scopeId:
          description: >-
            La importación que originó este elemento, cuando el elemento
            proviene de una búsqueda con alcance y con evaluate habilitado en
            la importación.
          type: string
        websetId:
          description: El identificador único del Webset al que pertenece este elemento.
          type: string
        properties:
          description: Las propiedades del elemento
          oneOf:
            - $ref: '#/components/schemas/WebsetItemPersonProperties'
            - $ref: '#/components/schemas/WebsetItemCompanyProperties'
            - $ref: '#/components/schemas/WebsetItemArticleProperties'
            - $ref: '#/components/schemas/WebsetItemResearchPaperProperties'
            - $ref: '#/components/schemas/WebsetItemCustomProperties'
        evaluations:
          items:
            $ref: '#/components/schemas/WebsetItemEvaluation'
          description: Las evaluaciones de criterios del elemento
          type: array
        enrichments:
          items:
            $ref: '#/components/schemas/EnrichmentResult'
          type: array
          description: Los resultados de enriquecimiento del elemento del Webset
          nullable: true
        createdAt:
          format: date-time
          description: La fecha y hora en que se creó el elemento
          type: string
        updatedAt:
          format: date-time
          description: La fecha y hora de la última actualización del elemento
          type: string
      required:
        - id
        - object
        - source
        - sourceId
        - websetId
        - properties
        - evaluations
        - enrichments
        - createdAt
        - updatedAt
      type: object
    WebsetItemPersonProperties:
      properties:
        url:
          format: uri
          description: La URL del perfil de la persona
          type: string
        description:
          description: Breve descripción de la relevancia de la persona
          type: string
        person:
          properties:
            name:
              description: El nombre de la persona
              type: string
            location:
              type: string
              description: La ubicación de la persona
              nullable: true
            position:
              type: string
              description: El puesto de trabajo actual de la persona
              nullable: true
            company:
              properties:
                name:
                  description: El nombre de la empresa
                  type: string
                location:
                  type: string
                  description: La ubicación en la que la persona trabaja en la empresa
                  nullable: true
              required:
                - name
                - location
              type: object
              title: WebsetItemPersonCompanyPropertiesFields
              nullable: true
            pictureUrl:
              format: uri
              type: string
              description: La URL de la imagen de la persona
              nullable: true
            workHistory:
              items:
                properties:
                  title:
                    type: string
                    description: Título o puesto de trabajo
                    nullable: true
                  location:
                    type: string
                    description: Ubicación de trabajo
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: Fecha de inicio
                        nullable: true
                      to:
                        type: string
                        description: Fecha de finalización
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: Fechas de empleo
                    nullable: true
                  company:
                    properties:
                      id:
                        type: string
                        description: ID de entidad de la empresa
                        nullable: true
                      name:
                        type: string
                        description: Nombre de la empresa
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: URL de LinkedIn de la empresa
                        nullable: true
                    required:
                      - id
                      - name
                      - linkedinUrl
                    type: object
                    title: WebsetItemPersonWorkHistoryCompanyRef
                    nullable: true
                required:
                  - title
                  - location
                  - dates
                  - company
                title: WebsetItemPersonWorkHistoryEntry
                type: object
              description: El historial laboral de la persona
              type: array
            educationHistory:
              items:
                properties:
                  degree:
                    type: string
                    description: Título obtenido
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: Fecha de inicio
                        nullable: true
                      to:
                        type: string
                        description: Fecha de finalización
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: Fechas de estudios
                    nullable: true
                  institution:
                    properties:
                      id:
                        type: string
                        description: ID de entidad de la institución
                        nullable: true
                      name:
                        type: string
                        description: Nombre de la institución
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: URL de LinkedIn de la institución
                        nullable: true
                    required:
                      - id
                      - name
                      - linkedinUrl
                    type: object
                    title: WebsetItemPersonEducationInstitutionRef
                    nullable: true
                required:
                  - degree
                  - dates
                  - institution
                title: WebsetItemPersonEducationHistoryEntry
                type: object
              description: El historial educativo de la persona
              type: array
          required:
            - name
            - location
            - position
            - company
            - pictureUrl
            - workHistory
            - educationHistory
          title: WebsetItemPersonPropertiesFields
          type: object
        type:
          type: string
          const: person
          default: person
      required:
        - type
        - url
        - description
        - person
      title: Person
      type: object
    WebsetItemCompanyProperties:
      properties:
        url:
          format: uri
          description: La URL del sitio web de la empresa
          type: string
        description:
          description: Breve descripción de la relevancia de la empresa
          type: string
        content:
          type: string
          description: El contenido de texto del sitio web de la empresa
          nullable: true
        company:
          properties:
            name:
              description: El nombre de la empresa
              type: string
            location:
              type: string
              description: La ubicación principal de la empresa
              nullable: true
            employees:
              type: integer
              description: El número de empleados de la empresa
              nullable: true
            industry:
              type: string
              description: El sector de la empresa
              nullable: true
            about:
              type: string
              description: Una breve descripción de la empresa
              nullable: true
            logoUrl:
              format: uri
              type: string
              description: La URL del logotipo de la empresa
              nullable: true
            foundedYear:
              type: number
              description: El año en que se fundó la empresa
              nullable: true
            headquarters:
              properties:
                address:
                  type: string
                  description: La dirección de la sede
                  nullable: true
                city:
                  type: string
                  description: La ciudad de la sede
                  nullable: true
                state:
                  type: string
                  description: El estado o región de la sede
                  nullable: true
                postalCode:
                  type: string
                  description: El código postal de la sede
                  nullable: true
                country:
                  type: string
                  description: The country of the headquarters
                  nullable: true
                countryCode:
                  type: string
                  description: The ISO country code of the headquarters
                  nullable: true
              required:
                - address
                - city
                - state
                - postalCode
                - country
                - countryCode
              type: object
              title: WebsetItemCompanyHeadquarters
              description: The structured headquarters address of the company
              nullable: true
            financials:
              properties:
                revenueAnnual:
                  type: number
                  description: The annual revenue of the company (USD)
                  nullable: true
                fundingTotal:
                  type: number
                  description: The total funding raised by the company (USD)
                  nullable: true
                fundingLatestRound:
                  properties:
                    name:
                      type: string
                      description: The name of the funding round (e.g. Series A)
                      nullable: true
                    date:
                      type: string
                      description: The date of the funding round
                      nullable: true
                    amount:
                      type: number
                      description: The amount raised in the funding round (USD)
                      nullable: true
                  required:
                    - name
                    - date
                    - amount
                  type: object
                  title: WebsetItemCompanyFundingRound
                  description: The latest funding round
                  nullable: true
              required:
                - revenueAnnual
                - fundingTotal
                - fundingLatestRound
              type: object
              title: WebsetItemCompanyFinancials
              description: Financial information about the company
              nullable: true
            webTraffic:
              properties:
                visitsMonthly:
                  type: number
                  description: The estimated monthly website visits
                  nullable: true
                uniqueVisitors:
                  type: number
                  description: The estimated monthly unique visitors
                  nullable: true
              required:
                - visitsMonthly
                - uniqueVisitors
              type: object
              title: WebsetItemCompanyWebTraffic
              description: Web traffic metrics for the company
              nullable: true
          required:
            - name
            - location
            - employees
            - industry
            - about
            - logoUrl
            - foundedYear
            - headquarters
            - financials
            - webTraffic
          title: WebsetItemCompanyPropertiesFields
          type: object
        type:
          type: string
          const: company
          default: company
      required:
        - type
        - url
        - description
        - content
        - company
      title: Company
      type: object
    WebsetItemArticleProperties:
      properties:
        url:
          format: uri
          description: The URL of the article
          type: string
        description:
          description: Short description of the relevance of the article
          type: string
        content:
          type: string
          description: The text content for the article
          nullable: true
        article:
          properties:
            title:
              type: string
              description: The title of the article
              nullable: true
            author:
              type: string
              description: The author(s) of the article
              nullable: true
            publishedAt:
              type: string
              description: The date and time the article was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemArticlePropertiesFields
          type: object
        type:
          type: string
          const: article
          default: article
      required:
        - type
        - url
        - description
        - content
        - article
      title: Article
      type: object
    WebsetItemResearchPaperProperties:
      properties:
        url:
          format: uri
          description: The URL of the research paper
          type: string
        description:
          description: Short description of the relevance of the research paper
          type: string
        content:
          type: string
          description: The text content of the research paper
          nullable: true
        researchPaper:
          properties:
            title:
              type: string
              description: The title of the research paper
              nullable: true
            author:
              type: string
              description: The author(s) of the research paper
              nullable: true
            publishedAt:
              type: string
              description: The date and time the research paper was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemResearchPaperPropertiesFields
          type: object
        type:
          type: string
          const: research_paper
          default: research_paper
      required:
        - type
        - url
        - description
        - content
        - researchPaper
      title: Research Paper
      type: object
    WebsetItemCustomProperties:
      properties:
        url:
          format: uri
          description: The URL of the Item
          type: string
        description:
          description: Short description of the Item
          type: string
        content:
          type: string
          description: The text content of the Item
          nullable: true
        custom:
          properties:
            title:
              type: string
              description: The title of the website
              nullable: true
            author:
              type: string
              description: The author(s) of the website
              nullable: true
            publishedAt:
              type: string
              description: The date and time the website was published
              nullable: true
          required:
            - title
            - author
            - publishedAt
          title: WebsetItemCustomPropertiesFields
          type: object
        type:
          type: string
          const: custom
          default: custom
      required:
        - type
        - url
        - description
        - content
        - custom
      title: Custom
      type: object
    WebsetItemEvaluation:
      properties:
        criterion:
          description: The description of the criterion
          type: string
        reasoning:
          description: The reasoning for the result of the evaluation
          type: string
        satisfied:
          enum:
            - 'yes'
            - 'no'
            - unclear
          description: The satisfaction of the criterion
          type: string
        references:
          default: []
          description: The references used to generate the result.
          items:
            properties:
              title:
                type: string
                description: The title of the reference
                nullable: true
              snippet:
                type: string
                description: The relevant snippet of the reference content
                nullable: true
              url:
                format: uri
                description: The URL of the reference
                type: string
            required:
              - title
              - snippet
              - url
            type: object
          type: array
      required:
        - criterion
        - reasoning
        - satisfied
      type: object
    EnrichmentResult:
      properties:
        object:
          const: enrichment_result
          default: enrichment_result
          type: string
        status:
          enum:
            - pending
            - completed
            - canceled
          description: The status of the enrichment result.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
        result:
          items:
            type: string
          type: array
          description: The result of the enrichment.
          nullable: true
        reasoning:
          type: string
          description: The reasoning for the result when an Agent is used.
          nullable: true
        references:
          items:
            properties:
              title:
                type: string
                description: The title of the reference
                nullable: true
              snippet:
                type: string
                description: The relevant snippet of the reference content
                nullable: true
              url:
                format: uri
                description: The URL of the reference
                type: string
            required:
              - title
              - snippet
              - url
            type: object
          description: The references used to generate the result.
          type: array
        enrichmentId:
          description: The id of the Enrichment that generated the result
          type: string
      required:
        - object
        - status
        - format
        - result
        - reasoning
        - references
        - enrichmentId
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
        Pass your Exa API key in the x-api-key header. You can also authenticate
        with Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Pass your Exa API key in the x-api-key header. You can also authenticate
        con Authorization: Bearer <key>.
```