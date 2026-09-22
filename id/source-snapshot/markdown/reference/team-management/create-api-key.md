> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Membuat API key {#create-api-key}

> Buat API key baru untuk team Anda dengan konfigurasi nama dan rate limit opsional.

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru mendapatkan credits gratis.
</Card>

<Info>
  Team Management API diaktifkan per team. API ini diautentikasi menggunakan API key service account, yang dibuat dari tab **Service keys** di [halaman API keys](https://dashboard.exa.ai/api-keys) setelah fitur ini diaktifkan untuk team Anda. Hubungi [support@exa.ai](mailto:support@exa.ai) untuk meminta akses.
</Info>

Endpoint Create API Key memungkinkan Anda membuat API key baru untuk team Anda secara terprogram menggunakan service API key Anda.

## Parameter Opsional {#optional-parameters}

* **name**: Nama deskriptif untuk API key guna membantu mengidentifikasi tujuan penggunaannya
* **rateLimit**: Jumlah maksimum permintaan per menit yang diizinkan untuk API key ini

## OpenAPI {#openapi}

```yaml team-management-spec.yaml POST /api-keys
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
  /api-keys:
    post:
      tags:
        - Team Management
      summary: Create API key
      description: >-
        Creates a new API key for the authenticated team. Optionally specify a
        name, rate limit, and budget for the API key.
      operationId: create-api-key
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Optional name for the API key
                  example: Production API Key
                rateLimit:
                  type: integer
                  description: Optional rate limit for the API key (requests per second)
                  example: 1000
                budgetCents:
                  type:
                    - integer
                    - 'null'
                  minimum: 0
                  description: >-
                    Optional spending budget for the API key, in cents. Set to
                    null to remove the budget.
                  example: 5000
              additionalProperties: false
      responses:
        '200':
          description: API key created successfully
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
                        description: Unique identifier for the API key
                      name:
                        type: string
                        description: Name of the API key
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
                        description: Team ID this key belongs to
                      userId:
                        type: string
                        format: uuid
                        description: User ID who created this key
                      createdAt:
                        type: string
                        format: date-time
                        description: When the key was created
        '400':
          description: Bad Request - Invalid parameters
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    examples:
                      - No user found for team
                      - Rate limit cannot exceed team's limit of 500 QPS
                      - >-
                        Unexpected parameters: invalidParam. Allowed: name,
                        rateLimit, budgetCents.
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
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Create API key with name and rate limit
          source: |
            curl -X POST 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "Production API Key",
                "rateLimit": 1000
              }'
        - lang: python
          label: Create API key with name and rate limit
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            data = {
                'name': 'Production API Key',
                'rateLimit': 1000
            }

            response = requests.post(
                'https://admin-api.exa.ai/team-management/api-keys',
                headers=headers,
                json=data
            )

            print(response.json())
        - lang: javascript
          label: Create API key with name and rate limit
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys', {
              method: 'POST',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: 'Production API Key',
                rateLimit: 1000
              })
            });


            const result = await response.json();

            console.log(result);
        - lang: bash
          label: Create API key without optional parameters
          source: |
            curl -X POST 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{}'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication
```