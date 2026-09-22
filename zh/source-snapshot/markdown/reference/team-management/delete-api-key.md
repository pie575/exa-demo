> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# 删除 API 密钥 {#delete-api-key}

> 从团队中永久删除某个 API 密钥。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<Info>
  Team Management API 按团队启用，使用服务账户 API 密钥进行身份验证。为团队启用该功能后，即可在 [API 密钥页面](https://dashboard.exa.ai/api-keys) 的 **Service keys** 标签页创建该密钥。如需申请使用权限，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>

## 概览 {#overview}

Delete API Key 端点用于将某个 API 密钥从你的团队中永久删除。

## 路径参数 {#path-parameters}

* **id**：要删除的 API 密钥的唯一标识符。

## OpenAPI {#openapi}

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