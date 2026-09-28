> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく見ていく前に、このファイルで利用可能なすべてのページを確認してください。

<div id="get-api-key">
  # APIキーの取得 {#get-api-key}
</div>

> IDを指定して、特定のAPIキーの詳細を取得します。

<Card title="Exa APIキーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<Info>
  Team Management APIはチーム単位で有効化されます。認証にはサービスアカウントのAPIキーを使用します。このキーは、チームでこの機能が有効化されると、[APIキーページ](https://dashboard.exa.ai/api-keys)の**Service keys**タブから作成できるようになります。アクセスをご希望の場合は、[support@exa.ai](mailto:support@exa.ai)までお問い合わせください。
</Info>

<div id="overview">
  ## 概要 {#overview}
</div>

Get API Key エンドポイントを使用すると、一意の識別子を指定して、特定の API キーの詳細情報を取得できます。

<div id="path-parameters">
  ## パスパラメーター {#path-parameters}
</div>

* **id**: 取得する API キーの一意の識別子

<div id="response">
  ## レスポンス {#response}
</div>

API キーに関する次のような詳細情報を返します。

* **id**: 一意の識別子
* **name**: わかりやすい名前
* **rateLimit**: レート制限 (1 分あたりのリクエスト数、設定されている場合)
* **teamId**: このキーが属するチームの ID
* **createdAt**: キーの作成日時

<div id="openapi">
  ## OpenAPI {#openapi}
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