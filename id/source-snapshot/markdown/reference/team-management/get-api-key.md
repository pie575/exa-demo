> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih lanjut.

<div id="get-api-key">
  # Get API key
</div>

> Ambil detail API key tertentu berdasarkan ID-nya.

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru mendapatkan credits gratis.
</Card>

<Info>
  Team Management API diaktifkan per team. Autentikasinya menggunakan API key akun layanan, yang dibuat dari tab **Service keys** di [halaman API keys](https://dashboard.exa.ai/api-keys) setelah fitur ini diaktifkan untuk team Anda. Hubungi [support@exa.ai](mailto:support@exa.ai) untuk meminta akses.
</Info>

<div id="overview">
  ## Ikhtisar
</div>

Endpoint Get API Key memungkinkan Anda mengambil informasi detail tentang suatu API key tertentu menggunakan identifier uniknya.

<div id="path-parameters">
  ## Path Parameters
</div>

* **id**: Identifier unik dari API key yang ingin diambil

<div id="response">
  ## Response
</div>

Mengembalikan informasi detail tentang API key, termasuk:

* **id**: Identifier unik
* **name**: Nama deskriptif
* **rateLimit**: Rate limit dalam permintaan per menit (jika diatur)
* **teamId**: ID Team pemilik key ini
* **createdAt**: Waktu key dibuat

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys/{id}
openapi: 3.1.0
info:
  version: 1.0.0
  title: Team Management API
  description: >-
    API for managing API keys within teams. Provides CRUD operations for
    creating, listing, updating, and deleting API keys with team-based access
    controls. The API is enabled per team. Contact support@exa.ai to request
    access.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys/{id}:
    get:
      tags:
        - Team Management
      summary: Get API key
      description: Retrieves details of a specific API key by its ID.
      operationId: get-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key.
      responses:
        '200':
          description: API key retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  apiKey:
                    type: object
                    properties:
                      id:
                        type: string
                        format: uuid
                      name:
                        type: string
                      rateLimit:
                        type:
                          - integer
                          - 'null'
                        description: Rate limit in requests per second
                      budgetCents:
                        type:
                          - integer
                          - 'null'
                        description: Spending budget for the API key, in cents
                      isOverBudget:
                        type: boolean
                        description: Whether the API key is currently over its budget
                      teamId:
                        type: string
                        format: uuid
                      createdAt:
                        type: string
                        format: date-time
        '400':
          description: Bad request - invalid API key ID format
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid API key ID format.
        '401':
          description: Unauthorized - Invalid or missing service key
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Unauthorized
        '404':
          description: Not found - API key does not exist
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: API key not found
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Get a specific API key
          source: >
            curl -X GET 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication

```