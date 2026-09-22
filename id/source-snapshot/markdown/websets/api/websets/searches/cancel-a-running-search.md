> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="cancel-a-running-search">
  # Membatalkan search yang sedang berjalan
</div>

> Membatalkan Search yang sedang berjalan.

Anda dapat membatalkan semua search sekaligus menggunakan endpoint `websets/:webset/cancel`.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml POST /v0/websets/{webset}/searches/{id}/cancel
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
  /v0/websets/{webset}/searches/{id}/cancel:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Searches
      summary: Cancel a running Search
      description: >-
        Cancels a currently running Search.


        You can cancel all searches at once by using the
        `websets/:webset/cancel` endpoint.
      operationId: websets-searches-cancel
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: The id of the Webset
          required: true
        - in: path
          name: id
          schema:
            type: string
          description: The id of the Search
          required: true
      responses:
        '200':
          description: Search canceled
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
                $ref: '#/components/schemas/WebsetSearch'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    WebsetSearch:
      properties:
        id:
          description: The unique identifier for the search
          type: string
        object:
          const: webset_search
          default: webset_search
          type: string
        websetId:
          description: The unique identifier for the Webset this search belongs to
          type: string
        status:
          enum:
            - created
            - pending
            - running
            - completed
            - canceled
          description: The status of the search
          title: WebsetSearchStatus
          type: string
        query:
          minLength: 1
          maxLength: 5000
          description: The query used to create the search.
          type: string
        entity:
          $ref: '#/components/schemas/Entity'
          description: >-
            The entity the search will return results for.


            When no entity is provided during creation, we will automatically
            select the best entity based on the query.
          nullable: true
        criteria:
          items:
            properties:
              description:
                minLength: 1
                maxLength: 1000
                description: The description of the criterion
                type: string
              successRate:
                minimum: 0
                maximum: 100
                description: >-
                  Value between 0 and 100 representing the percentage of results
                  that meet the criterion.
                type: number
            required:
              - description
              - successRate
            type: object
          description: >-
            The criteria the search will use to evaluate the results. If not
            provided, we will automatically generate them for you.
          type: array
        count:
          minimum: 1
          description: >-
            The number of results the search will attempt to find. The actual
            number of results may be less than this number depending on the
            search complexity.
          type: number
        maxPeoplePerCompany:
          minimum: 1
          type: integer
          description: >-
            The soft cap requested for matching people from the same current
            employer company, or null when no cap was requested.
          nullable: true
        behavior:
          $ref: '#/components/schemas/WebsetSearchBehavior'
          default: override
          description: >-
            The behavior of the search when it is added to a Webset.


            - `override`: the search will replace the existing Items found in
            the Webset and evaluate them against the new criteria. Any Items
            that don't match the new criteria will be discarded.

            - `append`: the search will add the new Items found to the existing
            Webset. Any Items that don't match the new criteria will be
            discarded.
        exclude:
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
            required:
              - source
              - id
            type: object
          description: >-
            Sources (existing imports or websets) used to omit certain results
            to be found during the search.
          type: array
        scope:
          items:
            properties:
              source:
                enum:
                  - import
                  - webset
                type: string
              id:
                type: string
              relationship:
                properties:
                  definition:
                    description: >-
                      What the relationship of the entities you hope to find is
                      relative to the entities contained in the provided source.
                    type: string
                  limit:
                    minimum: 1
                    maximum: 10
                    type: number
                required:
                  - definition
                  - limit
                type: object
            required:
              - source
              - id
            type: object
          description: >-
            The scope of the search. By default, there is no scope - thus
            searching the web.


            Jika diberikan saat pembuatan, pencarian hanya akan dilakukan pada
            sumber yang diberikan.
          type: array
        progress:
          properties:
            found:
              description: Jumlah hasil yang ditemukan sejauh ini
              type: number
            analyzed:
              description: Jumlah hasil yang dianalisis sejauh ini
              type: number
            completion:
              minimum: 0
              maximum: 100
              description: Persentase penyelesaian pencarian
              type: number
            timeLeft:
              type: number
              description: Perkiraan sisa waktu dalam detik, null jika tidak diketahui
              nullable: true
          required:
            - found
            - analyzed
            - completion
            - timeLeft
          description: Progres pencarian
          type: object
        recall:
          properties:
            expected:
              properties:
                total:
                  description: Perkiraan jumlah total kecocokan potensial
                  type: number
                confidence:
                  enum:
                    - high
                    - medium
                    - low
                  description: Tingkat keyakinan terhadap perkiraan
                  type: string
                bounds:
                  properties:
                    min:
                      description: Perkiraan jumlah total minimum kecocokan potensial
                      type: number
                    max:
                      description: Perkiraan jumlah total maksimum kecocokan potensial
                      type: number
                  required:
                    - min
                    - max
                  type: object
              required:
                - total
                - confidence
                - bounds
              type: object
            reasoning:
              description: Alasan di balik perkiraan tersebut
              type: string
          required:
            - expected
            - reasoning
          type: object
          description: >-
            Metrik recall untuk pencarian, null jika belum dihitung atau
            diminta.
          nullable: true
        metadata:
          default: {}
          description: Kumpulan pasangan kunci-nilai yang ingin Anda kaitkan dengan objek ini.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        canceledAt:
          format: date-time
          type: string
          description: Tanggal dan waktu pencarian dibatalkan
          nullable: true
        canceledReason:
          $ref: '#/components/schemas/WebsetSearchCanceledReason'
          description: Alasan pencarian dibatalkan
          nullable: true
        createdAt:
          format: date-time
          description: Tanggal dan waktu pencarian dibuat
          type: string
        updatedAt:
          format: date-time
          description: Tanggal dan waktu pencarian diperbarui
          type: string
      required:
        - id
        - object
        - websetId
        - status
        - query
        - entity
        - criteria
        - count
        - maxPeoplePerCompany
        - exclude
        - scope
        - progress
        - recall
        - canceledAt
        - canceledReason
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
    WebsetSearchBehavior:
      enum:
        - override
        - append
      type: string
    WebsetSearchCanceledReason:
      enum:
        - webset_deleted
        - webset_canceled
        - out_of_credits
      type: string
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
        Berikan kunci API Exa Anda pada header x-api-key. Anda juga dapat
        melakukan autentikasi dengan Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Berikan kunci API Exa Anda pada header x-api-key. Anda juga dapat
        melakukan autentikasi dengan Authorization: Bearer <key>.
```