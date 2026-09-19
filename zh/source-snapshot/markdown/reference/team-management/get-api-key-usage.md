> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="get-api-key-usage">
  # 获取 API key 用量情况
</div>

> 检索特定 API key 的用量分析与计费数据。

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建 key。新账户可获得免费积分。
</Card>

<Info>
  Team Management API 需按团队单独启用，并使用服务账户 API key 进行身份验证。为你的团队启用该功能后，即可在 [API keys 页面](https://dashboard.exa.ai/api-keys)的 **Service keys** 标签页中创建此 key。如需申请访问权限，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>

<div id="overview">
  ## 概述
</div>

获取 API key 用量端点可用于查询指定 API key 在给定时间段内的详细计费与用量分析数据。该端点返回 Exa 计费系统中的成本数据，可作为该 API key 实际账单内容的权威依据。

<div id="path-parameters">
  ## 路径参数
</div>

* **id**：要查询用量的 API key 唯一标识符

<div id="query-parameters">
  ## 查询参数
</div>

* **start&#95;date** (可选) ：用量统计周期的开始日期，采用 ISO 8601 格式 (例如 `2025-01-01T00:00:00Z` 或 `2025-01-01`) 。默认为 30 天前。必须在最近 6 个月 (180 天) 以内。
* **end&#95;date** (可选) ：用量统计周期的结束日期，采用 ISO 8601 格式。默认为当前时间。
* **group&#95;by** (可选) ：结果分组的时间粒度 (`hour`、`day` 或 `month`) 。目前为后续功能扩展预留，不会改变响应结构。默认为 `day`。

<div id="response">
  ## 响应
</div>

返回详细的用量与计费信息，包括：

* **id**：该 API key 的唯一标识符
* **api&#95;key&#95;id**：该 API key 的唯一标识符
* **api&#95;key&#95;name**：该 API key 的描述性名称 (如已设置) 
* **team&#95;id**：该 key 所属的团队 ID
* **period**：包含用量周期起止日期的对象
* **total&#95;cost&#95;usd**：指定周期内的总成本 (美元) 
* **cost&#95;breakdown**：按价格类型划分的成本明细数组，每项包含：
  * **price&#95;id**：价格的唯一标识符
  * **price&#95;name**：价格名称 (例如 &quot;Neural Search&quot;、&quot;Content Retrieval&quot;) 
  * **quantity**：消耗的总数量
  * **amount&#95;usd**：该价格类型对应的成本 (美元) 
* **metadata**：包含报告生成时间戳的对象

<div id="important-notes">
  ## 重要说明
</div>

* **6 个月回溯限制**：计费系统有 6 个月 (180 天) 的回溯限制。`start_date` 早于 180 天的请求将返回 400 错误。
* **无用量**：如果该 API key 在所请求的时间段内没有任何用量，`total_cost_usd` 将为 0，`cost_breakdown` 可能为空。
* **团队归属**：用于认证的服务 API key 必须与所查询的 API key 属于同一团队，不允许跨团队访问。
* **日期格式**：日期需使用 ISO 8601 格式，可带时间部分，也可不带 (例如 `2025-01-01` 或 `2025-01-01T00:00:00Z`) 。

<div id="use-cases">
  ## 使用场景
</div>

此端点适用于：

* 构建 API key 级别的计费看板
* 监控特定 API key 的用量与成本
* 基于用量阈值创建自动告警
* 生成用于内部成本分摊的用量报告
* 排查特定 API key 的计费问题

<div id="openapi">
  ## OpenAPI
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