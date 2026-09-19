> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件查看所有可用页面。

<div id="delete-api-key">
  # 删除 API key
</div>

> 从你的团队中永久删除某个 API key。

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建 key。新账户会赠送免费积分。
</Card>

<Info>
  Team Management API 需按团队启用，并使用服务账户 API key 进行身份验证。该功能为你的团队启用后，可在 [API keys 页面](https://dashboard.exa.ai/api-keys)的 **Service keys** 标签页中创建此 key。如需申请访问权限，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>

<div id="overview">
  ## 概览
</div>

删除 API key 接口会将指定的 API key 从你的团队中永久移除。

<div id="path-parameters">
  ## 路径参数
</div>

* **id**：要删除的 API key 的唯一标识符。

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml DELETE /api-keys/{id}
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
    delete:
      tags:
        - Team Management
      summary: Delete API key
      description: >-
        Deletes an API key. Only API keys belonging to the authenticated team
        can be deleted.
      operationId: delete-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key to delete.
      responses:
        '200':
          description: API key deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
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
          label: Delete an API key
          source: >
            curl -X DELETE
            'https://admin-api.exa.ai/team-management/api-keys/{id}' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: Delete an API key
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            response = requests.delete(
                'https://admin-api.exa.ai/team-management/api-keys/{id}',
                headers=headers
            )

            print(response.json())
        - lang: javascript
          label: Delete an API key
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys/{id}', {
              method: 'DELETE',
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