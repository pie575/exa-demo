> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="list-all-items-for-a-webset">
  # Menampilkan semua item untuk sebuah webset
</div>

> Mengembalikan daftar Item Webset.

Anda dapat melakukan paginasi pada Item menggunakan parameter `cursor`.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/websets/{webset}/items
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
  /v0/websets/{webset}/items:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Items
      summary: List all Items for a Webset
      description: |-
        Returns a list of Webset Items.

        You can paginate through the Items using the `cursor` parameter.
      operationId: websets-items-list
      parameters:
        - in: path
          name: webset
          schema:
            type: string
          description: The id or externalId of the Webset
          required: true
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
            default: 20
            minimum: 1
            maximum: 100
            type: integer
          required: false
          description: The number of results to return
        - in: query
          name: sourceId
          schema:
            type: string
          required: false
          description: The id of the source
      responses:
        '200':
          description: Webset Items
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
                $ref: '#/components/schemas/ListWebsetItemResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    ListWebsetItemResponse:
      properties:
        data:
          items:
            $ref: '#/components/schemas/WebsetItem'
          description: The list of webset items
          type: array
        hasMore:
          description: Whether there are more Items to paginate through
          type: boolean
        nextCursor:
          type: string
          description: The cursor to paginate through the next set of Items
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
    WebsetItem:
      properties:
        id:
          description: The unique identifier for the Webset Item
          type: string
        object:
          const: webset_item
          default: webset_item
          type: string
        source:
          enum:
            - search
            - import
          description: The source of the Item
          type: string
        sourceId:
          description: The unique identifier for the source
          type: string
        sourceEntityId:
          description: >-
            The original identifier used to resolve this item (e.g., email,
            name, or URL). Only relevant when the source is import.
          type: string
        scopeId:
          description: >-
            The import that sourced this item, when the item came from a scoped
            search with evaluate enabled on the import.
          type: string
        websetId:
          description: The unique identifier for the Webset this Item belongs to.
          type: string
        properties:
          description: The properties of the Item
          oneOf:
            - $ref: '#/components/schemas/WebsetItemPersonProperties'
            - $ref: '#/components/schemas/WebsetItemCompanyProperties'
            - $ref: '#/components/schemas/WebsetItemArticleProperties'
            - $ref: '#/components/schemas/WebsetItemResearchPaperProperties'
            - $ref: '#/components/schemas/WebsetItemCustomProperties'
        evaluations:
          items:
            $ref: '#/components/schemas/WebsetItemEvaluation'
          description: The criteria evaluations of the item
          type: array
        enrichments:
          items:
            $ref: '#/components/schemas/EnrichmentResult'
          type: array
          description: The enrichments results of the Webset item
          nullable: true
        createdAt:
          format: date-time
          description: The date and time the item was created
          type: string
        updatedAt:
          format: date-time
          description: The date and time the item was last updated
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
          description: The URL of the person profile
          type: string
        description:
          description: Short description of the relevance of the person
          type: string
        person:
          properties:
            name:
              description: The name of the person
              type: string
            location:
              type: string
              description: The location of the person
              nullable: true
            position:
              type: string
              description: The current work position of the person
              nullable: true
            company:
              properties:
                name:
                  description: The name of the company
                  type: string
                location:
                  type: string
                  description: The location the person is working at the company
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
              description: The image URL of the person
              nullable: true
            workHistory:
              items:
                properties:
                  title:
                    type: string
                    description: Job title or position
                    nullable: true
                  location:
                    type: string
                    description: Work location
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: Start date
                        nullable: true
                      to:
                        type: string
                        description: End date
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: Employment dates
                    nullable: true
                  company:
                    properties:
                      id:
                        type: string
                        description: Entity ID of the company
                        nullable: true
                      name:
                        type: string
                        description: Company name
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: LinkedIn URL of the company
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
              description: The work history of the person
              type: array
            educationHistory:
              items:
                properties:
                  degree:
                    type: string
                    description: Degree obtained
                    nullable: true
                  dates:
                    properties:
                      from:
                        type: string
                        description: Start date
                        nullable: true
                      to:
                        type: string
                        description: End date
                        nullable: true
                    required:
                      - from
                      - to
                    type: object
                    title: WebsetItemPersonDateRange
                    description: Education dates
                    nullable: true
                  institution:
                    properties:
                      id:
                        type: string
                        description: Entity ID of the institution
                        nullable: true
                      name:
                        type: string
                        description: Institution name
                        nullable: true
                      linkedinUrl:
                        type: string
                        description: LinkedIn URL of the institution
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
              description: The education history of the person
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
          description: The URL of the company website
          type: string
        description:
          description: Short description of the relevance of the company
          type: string
        content:
          type: string
          description: The text content of the company website
          nullable: true
        company:
          properties:
            name:
              description: The name of the company
              type: string
            location:
              type: string
              description: The main location of the company
              nullable: true
            employees:
              type: integer
              description: Jumlah karyawan perusahaan
              nullable: true
            industry:
              type: string
              description: Industri perusahaan
              nullable: true
            about:
              type: string
              description: Deskripsi singkat tentang perusahaan
              nullable: true
            logoUrl:
              format: uri
              type: string
              description: URL logo perusahaan
              nullable: true
            foundedYear:
              type: number
              description: Tahun perusahaan didirikan
              nullable: true
            headquarters:
              properties:
                address:
                  type: string
                  description: Alamat jalan kantor pusat
                  nullable: true
                city:
                  type: string
                  description: Kota kantor pusat
                  nullable: true
                state:
                  type: string
                  description: Negara bagian atau wilayah kantor pusat
                  nullable: true
                postalCode:
                  type: string
                  description: Kode pos kantor pusat
                  nullable: true
                country:
                  type: string
                  description: Negara kantor pusat
                  nullable: true
                countryCode:
                  type: string
                  description: Kode negara ISO kantor pusat
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
              description: Alamat kantor pusat terstruktur perusahaan
              nullable: true
            financials:
              properties:
                revenueAnnual:
                  type: number
                  description: Pendapatan tahunan perusahaan (USD)
                  nullable: true
                fundingTotal:
                  type: number
                  description: Total pendanaan yang dihimpun perusahaan (USD)
                  nullable: true
                fundingLatestRound:
                  properties:
                    name:
                      type: string
                      description: Nama putaran pendanaan (mis. Seri A)
                      nullable: true
                    date:
                      type: string
                      description: Tanggal putaran pendanaan
                      nullable: true
                    amount:
                      type: number
                      description: Jumlah yang dihimpun dalam putaran pendanaan (USD)
                      nullable: true
                  required:
                    - name
                    - date
                    - amount
                  type: object
                  title: WebsetItemCompanyFundingRound
                  description: Putaran pendanaan terbaru
                  nullable: true
              required:
                - revenueAnnual
                - fundingTotal
                - fundingLatestRound
              type: object
              title: WebsetItemCompanyFinancials
              description: Informasi keuangan tentang perusahaan
              nullable: true
            webTraffic:
              properties:
                visitsMonthly:
                  type: number
                  description: Perkiraan kunjungan situs web bulanan
                  nullable: true
                uniqueVisitors:
                  type: number
                  description: Perkiraan pengunjung unik bulanan
                  nullable: true
              required:
                - visitsMonthly
                - uniqueVisitors
              type: object
              title: WebsetItemCompanyWebTraffic
              description: Metrik lalu lintas web perusahaan
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
          description: URL artikel
          type: string
        description:
          description: Deskripsi singkat tentang relevansi artikel
          type: string
        content:
          type: string
          description: Konten teks artikel
          nullable: true
        article:
          properties:
            title:
              type: string
              description: Judul artikel
              nullable: true
            author:
              type: string
              description: Penulis artikel
              nullable: true
            publishedAt:
              type: string
              description: Tanggal dan waktu artikel diterbitkan
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
          description: URL makalah penelitian
          type: string
        description:
          description: Deskripsi singkat tentang relevansi makalah penelitian
          type: string
        content:
          type: string
          description: Konten teks makalah penelitian
          nullable: true
        researchPaper:
          properties:
            title:
              type: string
              description: Judul makalah penelitian
              nullable: true
            author:
              type: string
              description: Penulis makalah penelitian
              nullable: true
            publishedAt:
              type: string
              description: Tanggal dan waktu makalah penelitian diterbitkan
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
          description: URL Item
          type: string
        description:
          description: Deskripsi singkat tentang Item
          type: string
        content:
          type: string
          description: Konten teks Item
          nullable: true
        custom:
          properties:
            title:
              type: string
              description: Judul situs web
              nullable: true
            author:
              type: string
              description: Penulis situs web
              nullable: true
            publishedAt:
              type: string
              description: Tanggal dan waktu situs web diterbitkan
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
          description: Deskripsi kriteria
          type: string
        reasoning:
          description: Alasan untuk hasil evaluasi
          type: string
        satisfied:
          enum:
            - 'yes'
            - 'no'
            - unclear
          description: Pemenuhan kriteria
          type: string
        references:
          default: []
          description: Referensi yang digunakan untuk menghasilkan hasil.
          items:
            properties:
              title:
                type: string
                description: Judul referensi
                nullable: true
              snippet:
                type: string
                description: Cuplikan relevan dari konten referensi
                nullable: true
              url:
                format: uri
                description: URL referensi
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
          description: Status hasil pengayaan.
          type: string
        format:
          $ref: '#/components/schemas/WebsetEnrichmentFormat'
        result:
          items:
            type: string
          type: array
          description: Hasil pengayaan.
          nullable: true
        reasoning:
          type: string
          description: Alasan untuk hasil ketika Agent digunakan.
          nullable: true
        references:
          items:
            properties:
              title:
                type: string
                description: Judul referensi
                nullable: true
              snippet:
                type: string
                description: Cuplikan relevan dari konten referensi
                nullable: true
              url:
                format: uri
                description: URL referensi
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
        with Authorization: Bearer <key>.
```