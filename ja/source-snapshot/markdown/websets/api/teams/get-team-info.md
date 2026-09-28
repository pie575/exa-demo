> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

<div id="get-team-info">
  # チーム情報を取得 {#get-team-info}
</div>

> 同時実行数の使用状況や上限など、チームに関する情報を取得します。

<div id="overview">
  ## 概要 {#overview}
</div>

Get Team Info エンドポイントは、認証済みチームの情報を返します。返される情報には、チームの現在の同時実行数の使用状況や、設定されている上限が含まれます。Websets API の使用状況の監視や、レート制限の把握に役立ちます。

<div id="response">
  ## レスポンス {#response}
</div>

レスポンスには以下が含まれます。

* **object**: 常に &quot;team&quot;
* **id**: チームの一意の識別子
* **name**: チーム名
* **concurrency**: アクティブなリクエストと待機中のリクエストを示す現在の使用状況
* **limits**: チームの同時実行数の上限

<div id="concurrency-fields">
  ### 同時実行数のフィールド {#concurrency-fields}
</div>

`concurrency` オブジェクトは、現在のリクエストの状況を示します。

* **active**: 現在処理中のリクエスト数
* **queued**: 処理待ちのリクエスト数

<div id="limits-fields">
  ### Limitsフィールド {#limits-fields}
</div>

`limits` オブジェクトには、チームに設定されている上限値が表示されます。

* **maxConcurrent**: 同時に処理できるリクエストの最大数 (null の場合は無制限)
* **maxQueued**: キューで待機できるリクエストの最大数 (null の場合は無制限)

<div id="openapi">
  ## OpenAPI {#openapi}
</div>

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