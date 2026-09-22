> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Get API key usage {#get-api-key-usage}

> Ambil analitik penggunaan dan data billing untuk API key tertentu.

<Card title="Dapatkan Exa API key Anda" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Buat key di dashboard. Akun baru langsung mendapatkan credits gratis.
</Card>

<Info>
  Team Management API diaktifkan per Team. Autentikasinya menggunakan API key akun layanan, yang dibuat dari tab **Service keys** di [halaman API keys](https://dashboard.exa.ai/api-keys) setelah feature ini diaktifkan untuk Team Anda. Hubungi [support@exa.ai](mailto:support@exa.ai) untuk meminta akses.
</Info>

## Ringkasan {#overview}

Endpoint Get API Key Usage memungkinkan Anda mengambil analitik billing dan penggunaan secara mendetail untuk API key tertentu dalam rentang periode waktu tertentu. Endpoint ini mengembalikan data biaya dari sistem billing Exa, sehingga memberikan gambaran resmi mengenai apa saja yang ditagihkan kepada Anda untuk API key tersebut.

## Path Parameters {#path-parameters}

* **id**: Identifier unik dari API key yang ingin diambil data penggunaannya

## Query Parameters {#query-parameters}

* **start&#95;date** (opsional): Tanggal mulai usage period dalam format ISO 8601 (misalnya, `2025-01-01T00:00:00Z` atau `2025-01-01`). Default-nya 30 hari yang lalu. Harus berada dalam rentang 6 bulan terakhir (180 hari).
* **end&#95;date** (opsional): Tanggal akhir usage period dalam format ISO 8601. Default-nya waktu saat ini.
* **group&#95;by** (opsional): Granularitas waktu untuk mengelompokkan hasil (`hour`, `day`, atau `month`). Saat ini dicadangkan untuk pengembangan di masa mendatang dan tidak mengubah bentuk response. Default-nya `day`.

## Response {#response}

Mengembalikan informasi penggunaan dan billing secara terperinci, meliputi:

* **id**: Identifier unik API key
* **api&#95;key&#95;id**: Identifier unik API key
* **api&#95;key&#95;name**: Nama deskriptif API key (jika diatur)
* **team&#95;id**: ID Team pemilik key ini
* **period**: Objek berisi tanggal mulai dan berakhir periode penggunaan
* **total&#95;cost&#95;usd**: Total biaya dalam USD untuk periode yang ditentukan
* **cost&#95;breakdown**: Array rincian biaya berdasarkan tipe harga, masing-masing berisi:
  * **price&#95;id**: Identifier unik untuk harga tersebut
  * **price&#95;name**: Nama harga (misalnya, &quot;Neural Search&quot;, &quot;Content Retrieval&quot;)
  * **quantity**: Total kuantitas yang digunakan
  * **amount&#95;usd**: Biaya dalam USD untuk tipe harga ini
* **metadata**: Objek berisi timestamp pembuatan laporan

## Catatan Penting {#important-notes}

* **Batas Penelusuran Mundur 6 Bulan**: Sistem billing memiliki batas penelusuran mundur 6 bulan (180 hari). Permintaan dengan `start_date` yang lebih lama dari 180 hari akan mengembalikan error 400.
* **Penggunaan Nol**: Jika API key tidak memiliki penggunaan pada periode yang diminta, `total_cost_usd` akan bernilai 0 dan `cost_breakdown` bisa jadi kosong.
* **Kepemilikan Team**: Service API key yang digunakan untuk autentikasi harus berada di team yang sama dengan API key yang diminta. Akses lintas team tidak diizinkan.
* **Format Tanggal**: Tanggal dapat diberikan dalam format ISO 8601 dengan atau tanpa komponen waktu (misalnya, `2025-01-01` atau `2025-01-01T00:00:00Z`).

## Use Cases {#use-cases}

Endpoint ini berguna untuk:

* Membangun dashboard billing di tingkat API key
* Memantau penggunaan dan biaya untuk API key tertentu
* Membuat peringatan otomatis berdasarkan ambang batas penggunaan
* Membuat laporan penggunaan untuk alokasi biaya internal
* Menelusuri pertanyaan seputar billing untuk API key tertentu

## OpenAPI {#openapi}

```yaml team-management-spec.yaml GET /api-keys/{id}/usage
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
  /api-keys/{id}/usage:
    get:
      tags:
        - Team Management
      summary: Get API key usage
      description: >-
        Retrieves usage analytics and billing data for a specific API key over a
        given time period. Returns cost breakdown by price type from the billing
        system.
      operationId: get-api-key-usage
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key.
        - name: start_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            Start date for the usage period (ISO 8601 format). Defaults to 30
            days ago. Must be within the last 6 months (180 days).
          example: '2025-01-01T00:00:00Z'
        - name: end_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            End date for the usage period (ISO 8601 format). Defaults to current
            time.
          example: '2025-01-31T23:59:59Z'
        - name: group_by
          in: query
          required: false
          schema:
            type: string
            enum:
              - hour
              - day
              - month
          description: >-
            Time granularity for grouping results. Currently reserved for future
            enhancements and does not change the response shape. Defaults to
            'day'.
          example: day
      responses:
        '200':
          description: Usage data retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: The unique identifier of the API key.
                  api_key_id:
                    type: string
                    format: uuid
                    description: The API key ID.
                  api_key_name:
                    type:
                      - string
                      - 'null'
                    description: The name of the API key
                  team_id:
                    type: string
                    format: uuid
                    description: The team ID this key belongs to
                  period:
                    type: object
                    properties:
                      start:
                        type: string
                        format: date-time
                        description: Start of the usage period
                      end:
                        type: string
                        format: date-time
                        description: End of the usage period
                  total_cost_usd:
                    type: number
                    description: Total cost in USD for the period
                    example: 45.67
                  cost_breakdown:
                    type: array
                    description: Breakdown of costs by price type
                    items:
                      type: object
                      properties:
                        price_id:
                          type: string
                          description: Unique identifier for the price
                        price_name:
                          type: string
                          description: >-
                            Name of the price (e.g., "Neural Search", "Content
                            Retrieval")
                        quantity:
                          type: number
                          description: Total quantity consumed
                        amount_usd:
                          type: number
                          description: Cost in USD for this price type
                  metadata:
                    type: object
                    properties:
                      generated_at:
                        type: string
                        format: date-time
                        description: When this report was generated
              example:
                id: key_abc123def456
                api_key_id: 550e8400-e29b-41d4-a716-446655440000
                api_key_name: Production API Key
                team_id: 660e8400-e29b-41d4-a716-446655440000
                period:
                  start: '2025-01-01T00:00:00Z'
                  end: '2025-01-31T23:59:59Z'
                total_cost_usd: 45.67
                cost_breakdown:
                  - price_id: price_neural_search
                    price_name: Neural Search
                    quantity: 1000
                    amount_usd: 30
                  - price_id: price_content_retrieval
                    price_name: Content Retrieval
                    quantity: 500
                    amount_usd: 15.67
                metadata:
                  generated_at: '2025-02-01T10:30:00Z'
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
                      - Invalid API key ID format.
                      - >-
                        Invalid date format. Use ISO 8601 format (YYYY-MM-DD or
                        YYYY-MM-DDTHH:mm:ss)
                      - start_date must be before end_date
                      - >-
                        Date range too far in the past. start_date must be
                        within the last 6 months.
                      - >-
                        Invalid group_by parameter. Must be one of: hour, day,
                        month
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
          description: Not Found - API key does not exist
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: API key not found
        '500':
          description: Internal Server Error - Failed to fetch usage data
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Failed to fetch usage data. Please try again later.
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Get usage for the last 30 days (default)
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: bash
          label: Get usage for a specific date range
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage?start_date=2025-01-01&end_date=2025-01-31'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: Get usage for a specific date range
          source: |
            import requests
            from datetime import datetime, timedelta

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY'
            }

            params = {
                'start_date': '2025-01-01T00:00:00Z',
                'end_date': '2025-01-31T23:59:59Z'
            }

            response = requests.get(
                'https://admin-api.exa.ai/team-management/api-keys/{id}/usage',
                headers=headers,
                params=params
            )

            print(response.json())
        - lang: javascript
          label: Get usage for a specific date range
          source: |
            const params = new URLSearchParams({
              start_date: '2025-01-01T00:00:00Z',
              end_date: '2025-01-31T23:59:59Z'
            });

            const response = await fetch(
              `https://admin-api.exa.ai/team-management/api-keys/{id}/usage?${params}`,
              {
                method: 'GET',
                headers: {
                  'x-api-key': 'YOUR-SERVICE-KEY'
                }
              }
            );

            const result = await response.json();
            console.log(result);
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication
```