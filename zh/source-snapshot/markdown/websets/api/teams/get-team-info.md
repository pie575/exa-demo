> ## 文档索引 {#documentation-index}
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# 获取团队信息 {#get-team-info}

> 获取你的团队信息，包括并发使用情况和限制。

## 概览 {#overview}

获取团队信息端点返回已认证团队的信息，包括该团队当前的并发使用情况和已配置的限制。它有助于监控你的 Websets API 用量，并了解自己的速率限制。

## 响应 {#response}

响应包含：

* **object**：始终为 &quot;team&quot;
* **id**：团队的唯一标识符
* **name**：团队名称
* **concurrency**：当前用量，显示进行中和排队中的请求数
* **limits**：团队的并发限制

### 并发 Fields {#concurrency-fields}

`concurrency` 对象显示当前的请求状态：

* **active**：当前正在处理的请求数
* **queued**：正在等待处理的请求数

### 限制 field {#limits-fields}

`limits` 对象显示团队已配置的限制：

* **maxConcurrent**：可同时处理的最大请求数 (null 表示无限制) 
* **maxQueued**：可在队列中等待的最大请求数 (null 表示无限制)

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /v0/teams/me
openapi: 3.1.0
info:
  title: Exa Public API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /v0/teams/me:
    get:
      tags:
        - Teams
      summary: Get team info
      description: >-
        Returns information about the authenticated team, including current
        concurrency usage and limits.
      operationId: teams-me-get
      responses:
        '200':
          description: Team information retrieved successfully
          headers:
            x-request-id:
              $ref: '#/components/headers/XRequestId'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WebsetsTeamInfo'
components:
  headers:
    XRequestId:
      description: >-
        Unique identifier for the request. Matches the `requestId` field
        returned in response bodies that carry one.
      schema:
        type: string
      example: 07e29bb1f4f1dd05f0d4b57bbcf6e4b8
  schemas:
    WebsetsTeamInfo:
      type: object
      properties:
        object:
          type: string
          const: team
          description: The object type, always `"team"`.
        id:
          type: string
          description: Unique identifier for the team.
        name:
          type: string
          description: Name of the team.
        concurrency:
          type: object
          properties:
            active:
              type: integer
              description: Number of requests currently being processed.
            queued:
              type: integer
              description: Number of requests currently queued.
          required:
            - active
            - queued
          additionalProperties: false
          description: Current concurrency usage.
        limits:
          type: object
          properties:
            maxConcurrent:
              anyOf:
                - type: integer
                - type: 'null'
              description: >-
                Maximum number of concurrent requests allowed. Null means
                unlimited.
            maxQueued:
              anyOf:
                - type: integer
                - type: 'null'
              description: Maximum number of queued requests allowed. Null means unlimited.
          required:
            - maxConcurrent
            - maxQueued
          additionalProperties: false
          description: Concurrency limits for the team.
      required:
        - object
        - id
        - name
        - concurrency
        - limits
      additionalProperties: false
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Pass your Exa API key in the x-api-key header. You can also authenticate
        with Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Pass your Exa API key in the x-api-key header. You can also authenticate
        with Authorization: Bearer <key>.

```