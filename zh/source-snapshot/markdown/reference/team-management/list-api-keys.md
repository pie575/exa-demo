> ## 文档索引 {#documentation-index}
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

# List API keys {#list-api-keys}

> 获取你所在团队的所有 API 密钥及其元数据。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户会获赠免费积分。
</Card>

<Info>
  Team Management API 需按团队单独启用，并使用服务账户 API 密钥进行身份验证。该功能为你的团队启用后，可在 [API 密钥页面](https://dashboard.exa.ai/api-keys) 的 **Service keys** 标签页中创建此类密钥。如需申请访问权限，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>

## 概览 {#overview}

List API Keys 端点会返回与你的团队关联的所有 API 密钥，包括每个密钥的 ID、名称、速率限制和创建时间戳。

<div id="overview">
  ## 响应格式 {#response-format}
</div>

响应中包含一个 API 密钥对象数组，每个对象包含以下信息：

* **id**：API 密钥的唯一标识符
* **name**：便于识别的名称 (如果创建时提供)
* **rateLimit**：速率限制，单位为每分钟请求数 (如果已设置)
* **createdAt**：密钥创建时间的 ISO 8601 时间戳

<div id="response-format">
  ## OpenAPI {#openapi}
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