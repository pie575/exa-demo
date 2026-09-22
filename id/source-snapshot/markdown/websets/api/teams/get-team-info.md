> ## Indeks Dokumentasi {#documentation-index}
>
> Ambil indeks dokumentasi lengkap di: https://exa.ai/docs/llms.txt
> Gunakan file ini untuk menemukan semua halaman yang tersedia sebelum menjelajah lebih jauh.

# Get team info {#get-team-info}

> Ambil informasi tentang team Anda, termasuk penggunaan dan batas konkurensi.

## Overview {#overview}

Endpoint Get Team Info mengembalikan informasi tentang team yang terautentikasi, termasuk penggunaan konkurensi team saat ini dan batas yang telah dikonfigurasi. Ini berguna untuk memantau penggunaan Websets API Anda dan memahami rate limit yang berlaku.

## Response {#response}

Response mencakup:

* **object**: Selalu &quot;team&quot;
* **id**: Identifier unik Team Anda
* **name**: Nama Team Anda
* **concurrency**: Penggunaan saat ini, menampilkan permintaan yang aktif dan yang mengantre
* **limits**: Batas konkurensi Team Anda

### Field Konkurensi {#concurrency-fields}

Objek `concurrency` menampilkan status permintaan Anda saat ini:

* **active**: Jumlah permintaan yang sedang diproses
* **queued**: Jumlah permintaan yang menunggu untuk diproses

### Field Limits {#limits-fields}

Objek `limits` menampilkan batas yang dikonfigurasi untuk team Anda:

* **maxConcurrent**: Jumlah maksimum permintaan yang dapat diproses secara bersamaan (null berarti tidak terbatas)
* **maxQueued**: Jumlah maksimum permintaan yang dapat menunggu dalam antrean (null berarti tidak terbatas)

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /v0/teams/me
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
  /v0/teams/me:
    get:
      tags:
        - Teams
      summary: Get team info
      description: >-
        Returns information about the authenticated team, including current
        concurrency usage and limits.
      operationId: teams-me-get
      responses:
        '200':
          description: Team information retrieved successfully
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetsTeamInfo'
components:
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    WebsetsTeamInfo:
      type: object
      properties:
        object:
          type: string
          const: team
          description: The object type, always `"team"`.
        id:
          type: string
          description: Unique identifier for the team.
        name:
          type: string
          description: Name of the team.
        concurrency:
          type: object
          properties:
            active:
              type: integer
              description: Number of requests currently being processed.
            queued:
              type: integer
              description: Number of requests currently queued.
          required:
            - active
            - queued
          additionalProperties: false
          description: Current concurrency usage.
        limits:
          type: object
          properties:
            maxConcurrent:
              anyOf:
                - type: integer
                - type: 'null'
              description: >-
                Maximum number of concurrent requests allowed. Null means
                unlimited.
            maxQueued:
              anyOf:
                - type: integer
                - type: 'null'
              description: Maximum number of queued requests allowed. Null means unlimited.
          required:
            - maxConcurrent
            - maxQueued
          additionalProperties: false
          description: Concurrency limits for the team.
      required:
        - object
        - id
        - name
        - concurrency
        - limits
      additionalProperties: false
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