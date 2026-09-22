> <div id="documentation-index">
  > ## Indeks Dokumentasi
> </div>
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

<div id="list-monitor-runs">
  # Daftar run monitor
</div>

> Menampilkan semua run untuk Monitor.

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/monitors/{monitor}/runs
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
  /v0/monitors/{monitor}/runs:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors Runs
      summary: Daftar Run Monitor
      description: Menampilkan semua run untuk Monitor.
      operationId: monitors-runs-list
      parameters:
        - in: path
          name: monitor
          schema:
            type: string
          description: Id Monitor yang run-nya ingin ditampilkan
          required: true
      responses:
        '200':
          description: Daftar run monitor
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Identifier unik untuk permintaan.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListMonitorRunsResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    ListMonitorRunsResponse:
      properties:
        data:
          items:
            $ref: '#/components/schemas/MonitorRun'
          description: Daftar run monitor
          type: array
        hasMore:
          description: Apakah masih ada hasil lain untuk dipaginasi
          type: boolean
        nextCursor:
          type: string
          description: Cursor untuk memaginasi kumpulan hasil berikutnya
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
    MonitorRun:
      properties:
        id:
          description: Identifier unik untuk Run Monitor
          type: string
        object:
          enum:
            - monitor_run
          description: Tipe objek
          type: string
        monitorId:
          description: Monitor yang terkait dengan run ini
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: Status Run Monitor
          type: string
        completedAt:
          format: date-time
          type: string
          description: Waktu run selesai
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: Waktu run gagal
          nullable: true
        failedReason:
          type: string
          description: Alasan run gagal
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: Waktu run dibatalkan
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: Waktu run dibuat
        updatedAt:
          type: string
          format: date-time
          description: Waktu run terakhir diperbarui
        type:
          type: string
          enum:
            - search
            - refresh
          description: Tipe Run Monitor
      required:
        - id
        - object
        - monitorId
        - status
        - type
        - completedAt
        - failedAt
        - failedReason
        - canceledAt
        - createdAt
        - updatedAt
      type: object
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Kirimkan Exa API key Anda pada header x-api-key. Anda juga dapat
        melakukan autentikasi dengan Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Kirimkan Exa API key Anda pada header x-api-key. Anda juga dapat
        melakukan autentikasi dengan Authorization: Bearer <key>.

```