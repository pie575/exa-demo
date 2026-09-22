> ## 文档索引 {#documentation-index}
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

# 获取 API 密钥 {#get-api-key}

> 通过 ID 获取指定 API 密钥的详细信息。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<Info>
  Team Management API 需按团队单独启用。该 API 使用服务账户 API 密钥进行身份验证；为你的团队启用该功能后，可在 [API 密钥页面](https://dashboard.exa.ai/api-keys) 的 **Service keys** 选项卡中创建此密钥。如需申请访问权限，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>

## 概览 {#overview}

Get API Key 端点用于通过唯一标识符获取特定 API 密钥的详细信息。

<div id="overview">
  ## 路径参数 {#path-parameters}
</div>

* **id**：要获取的 API 密钥的唯一标识符

<div id="path-parameters">
  ## 响应 {#response}
</div>

返回该 API 密钥的详细信息，包括：

* **id**：唯一标识符
* **name**：描述性名称
* **rateLimit**：速率限制，单位为每分钟请求数 (如已设置)
* **teamId**：该密钥所属的团队 ID
* **createdAt**：密钥的创建时间

<div id="response">
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