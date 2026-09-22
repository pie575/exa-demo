> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="update-api-key">
  # 更新 API 密钥
</div>

> 更新现有 API 密钥的名称和速率限制。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<Info>
  Team Management API 需按团队单独启用，并使用服务账户 API 密钥进行认证。为你的团队启用该功能后，可在 [API 密钥页面](https://dashboard.exa.ai/api-keys)的 **Service keys** 标签页中创建该密钥。如需申请访问权限，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>

<div id="overview">
  ## 概览
</div>

更新 API 密钥端点用于修改现有的 API 密钥

<div id="path-parameters">
  ## 路径参数
</div>

* **id**：待更新 API 密钥的唯一标识符。

<div id="optional-parameters">
  ## 可选参数
</div>

* **name**：API 密钥的新描述性名称
* **rateLimit**：新的速率限制，单位为每分钟请求数

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml PUT /api-keys/{id}
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
    put:
      tags:
        - Team Management
      summary: Update API key
      description: >-
        Updates an existing API key's name and/or rate limit. Only API keys
        belonging to the authenticated team can be updated.
      operationId: update-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key to update.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Optional new name for the API key
                  example: Updated Production Key
                rateLimit:
                  type: integer
                  description: >-
                    Optional new rate limit for the API key (requests per
                    second)
                  example: 2000
                budgetCents:
                  type:
                    - integer
                    - 'null'
                  minimum: 0
                  description: >-
                    Optional new spending budget for the API key, in cents. Set
                    to null to remove the budget.
                  example: 5000
              additionalProperties: false
      responses:
        '200':
          description: API key updated successfully
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
                      userId:
                        type: string
                        format: uuid
                      createdAt:
                        type: string
                        format: date-time
                      updatedAt:
                        type: string
                        format: date-time
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
                      - api_key_id is required
                      - Invalid API key ID format.
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
          description: Forbidden - API key belongs to a different team
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: You do not have permission to access this API key
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
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Update API key name and rate limit
          source: >
            curl -X PUT 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "Updated Production Key",
                "rateLimit": 2000
              }'
        - lang: python
          label: Update API key name and rate limit
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            data = {
                'name': 'Updated Production Key',
                'rateLimit': 2000
            }

            response = requests.put(
                'https://admin-api.exa.ai/team-management/api-keys/{id}',
                headers=headers,
                json=data
            )

            print(response.json())
        - lang: javascript
          label: Update API key name and rate limit
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys/{id}', {
              method: 'PUT',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: 'Updated Production Key',
                rateLimit: 2000
              })
            });


            const result = await response.json();

            console.log(result);
        - lang: bash
          label: Update only the name
          source: >
            curl -X PUT 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "New Name Only"
              }'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication
```