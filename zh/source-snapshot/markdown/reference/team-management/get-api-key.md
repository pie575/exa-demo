> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可先通过该文件了解所有可用页面。

<div id="get-api-key">
  # 获取 API key
</div>

> 通过 ID 获取指定 API key 的详细信息。

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建 key。新账户会赠送免费积分。
</Card>

<Info>
  团队管理 API 需按团队单独启用，并使用服务账户 API key 进行认证。为你的团队启用该功能后，即可在 [API keys 页面](https://dashboard.exa.ai/api-keys)的 **Service keys** 标签页中创建此 key。如需开通，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>

<div id="overview">
  ## 概述
</div>

Get API Key 端点可让你通过唯一标识符获取某个 API key 的详细信息。

<div id="path-parameters">
  ## 路径参数
</div>

* **id**：要获取的 API key 的唯一标识符

<div id="response">
  ## 响应
</div>

返回该 API key 的详细信息，包括：

* **id**：唯一标识符
* **name**：描述性名称
* **rateLimit**：速率限制，以每分钟请求数计 (若已设置) 
* **teamId**：该 key 所属的团队 ID
* **createdAt**：该 key 的创建时间

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