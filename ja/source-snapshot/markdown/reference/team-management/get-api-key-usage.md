> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの完全版は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

<div id="get-api-key-usage">
  # API キーの使用量を取得 {#get-api-key-usage}
</div>

> 特定の API キーの使用状況分析と請求データを取得します。

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

<Info>
  Team Management API はチーム単位で有効化されます。認証にはサービスアカウントの API キーを使用します。このキーは、チームでこの機能が有効になると、[API キーページ](https://dashboard.exa.ai/api-keys)の **Service keys** タブから作成できます。アクセスをご希望の場合は、[support@exa.ai](mailto:support@exa.ai) までお問い合わせください。
</Info>

<div id="overview">
  ## 概要 {#overview}
</div>

Get API Key Usage エンドポイントを使用すると、特定の API キーについて、指定した期間における詳細な請求データと使用量の分析データを取得できます。このエンドポイントは Exa の請求システムから取得したコストデータを返すため、その API キーに対して実際に請求されている内容を正確に確認できます。

<div id="path-parameters">
  ## パスパラメーター {#path-parameters}
</div>

* **id**: 使用量を取得する対象の API キーの一意の識別子

<div id="query-parameters">
  ## クエリパラメーター {#query-parameters}
</div>

* **start&#95;date** (任意) : 使用期間の開始日 (ISO 8601 形式、例: `2025-01-01T00:00:00Z` または `2025-01-01`) 。デフォルトは 30 日前です。過去 6 か月 (180 日) 以内の日付を指定してください。
* **end&#95;date** (任意) : 使用期間の終了日 (ISO 8601 形式) 。デフォルトは現在時刻です。
* **group&#95;by** (任意) : 結果をグループ化する時間単位 (`hour`、`day`、または `month`) 。現在は将来の機能拡張用に予約されており、指定してもレスポンスの構造は変わりません。デフォルトは `day` です。

<div id="response">
  ## レスポンス {#response}
</div>

以下を含む、使用量と請求に関する詳細情報を返します。

* **id**: API キーの一意の識別子
* **api&#95;key&#95;id**: API キーの一意の識別子
* **api&#95;key&#95;name**: API キーのわかりやすい名前 (設定されている場合)
* **team&#95;id**: このキーが属するチームの ID
* **period**: 使用期間の開始日と終了日を含むオブジェクト
* **total&#95;cost&#95;usd**: 指定期間の合計コスト (USD)
* **cost&#95;breakdown**: 料金タイプ別のコスト内訳の配列。各要素には以下が含まれます。
  * **price&#95;id**: 料金の一意の識別子
  * **price&#95;name**: 料金の名前 (例: 「Neural Search」、「Content Retrieval」)
  * **quantity**: 合計消費量
  * **amount&#95;usd**: この料金タイプのコスト (USD)
* **metadata**: レポート生成日時のタイムスタンプを含むオブジェクト

<div id="important-notes">
  ## 重要な注意事項 {#important-notes}
</div>

* **遡及期間の上限は6か月**: 請求システムで遡って取得できる期間は最大6か月 (180日) です。`start_date` に180日より前の日付を指定したリクエストは、400 エラーを返します。
* **使用量がゼロの場合**: 指定した期間に API キーの使用量がない場合、`total_cost_usd` は 0 となり、`cost_breakdown` は空になることがあります。
* **チームの所有権**: 認証に使用するサービス API キーは、対象の API キーと同じチームに属している必要があります。チームをまたいだアクセスは許可されていません。
* **日付の形式**: 日付は ISO 8601 形式で指定します。時刻部分は省略可能です (例: `2025-01-01` または `2025-01-01T00:00:00Z`) 。

<div id="use-cases">
  ## ユースケース {#use-cases}
</div>

このエンドポイントは、次のような用途に役立ちます。

* APIキー単位の請求ダッシュボードの構築
* 特定のAPIキーの使用量とコストの監視
* 使用量のしきい値に基づく自動アラートの設定
* 社内のコスト配分に向けた使用量レポートの作成
* 特定のAPIキーに関する請求上の疑問点の調査

<div id="openapi">
  ## OpenAPI {#openapi}
</div>

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