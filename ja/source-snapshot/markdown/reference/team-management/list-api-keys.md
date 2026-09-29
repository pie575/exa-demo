> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="list-api-keys">
  # API キーの一覧取得
</div>

> チームに属するすべての API キーを、メタデータとあわせて取得します。

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<Info>
  Team Management API はチームごとに有効化されます。認証にはサービスアカウントの API キーを使用します。このキーは、チームでこの機能が有効化された後に、[API キーページ](https://dashboard.exa.ai/api-keys)の **Service keys** タブから作成できます。アクセスを希望される場合は、[support@exa.ai](mailto:support@exa.ai) までお問い合わせください。
</Info>

<div id="overview">
  ## 概要
</div>

List API Keys エンドポイントは、チームに関連付けられているすべての API キーを返します。各キーのキー ID、名前、レート制限、作成タイムスタンプが含まれます。

<div id="response-format">
  ## レスポンス形式
</div>

レスポンスには、以下の情報を含む API キーオブジェクトの配列が含まれます。

* **id**: API キーの一意の識別子
* **name**: 人が読みやすい名前 (作成時に指定した場合)
* **rateLimit**: 1 分あたりのリクエスト数で表したレート制限 (設定されている場合)
* **createdAt**: キーの作成日時を示す ISO 8601 形式のタイムスタンプ

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys
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
    get:
      tags:
        - Team Management
      summary: List API keys
      description: >-
        Returns all API keys belonging to the authenticated team. Includes ID,
        name, and rate limit for each key.
      operationId: list-api-keys
      parameters:
        - name: api_key_id
          in: query
          required: false
          schema:
            type: string
          description: Optional API key ID to retrieve a specific key.
      responses:
        '200':
          description: List of API keys retrieved successfully
          content:
            application/json:
              schema:
                oneOf:
                  - type: object
                    properties:
                      apiKeys:
                        type: array
                        items:
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
                  - type: object
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
        '403':
          description: Forbidden - insufficient permissions to access this API key
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Insufficient permissions to access this API key
        '404':
          description: Not found - API key or team not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    examples:
                      - API key not found
                      - Team not found
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: List all API keys
          source: |
            curl -X GET 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: List all API keys
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY'
            }

            response = requests.get(
                'https://admin-api.exa.ai/team-management/api-keys',
                headers=headers
            )

            print(response.json())
        - lang: javascript
          label: List all API keys
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys', {
              method: 'GET',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY'
              }
            });


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