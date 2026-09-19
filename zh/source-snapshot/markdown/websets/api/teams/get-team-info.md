> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="get-team-info">
  # 获取团队信息
</div>

> 获取团队的相关信息，包括并发使用情况和限制。

<div id="overview">
  ## 概览
</div>

Get Team Info 端点会返回当前已认证团队的信息，包括团队的并发使用情况和已配置的限制。这有助于你监控 Websets API 的用量，并了解自己的速率限制。

<div id="response">
  ## 响应
</div>

响应包含：

* **object**：始终为 &quot;team&quot;
* **id**：团队的唯一标识符
* **name**：团队名称
* **concurrency**：当前用量，显示进行中和排队中的请求数
* **limits**：团队的并发限制

<div id="concurrency-fields">
  ### 并发字段
</div>

`concurrency` 对象展示你当前的请求状态：

* **active**：当前正在处理的请求数
* **queued**：等待处理的请求数

<div id="limits-fields">
  ### Limits 字段
</div>

`limits` 对象显示团队已配置的限制：

* **maxConcurrent**：可同时处理的最大请求数 (null 表示无限制) 
* **maxQueued**：可在队列中等待的最大请求数 (null 表示无限制)

<div id="openapi">
  ## OpenAPI
</div>

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
      summary: 获取团队信息
      description: >-
        返回已认证团队的信息，包括当前的并发使用量和限制。
      operationId: teams-me-get
      responses:
        '200':
          description: 团队信息获取成功
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
        该请求的唯一标识符。与响应体中返回的 `requestId` 字段（若存在）一致。
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
          description: 对象类型，始终为 `"team"`。
        id:
          type: string
          description: 团队的唯一标识符。
        name:
          type: string
          description: 团队名称。
        concurrency:
          type: object
          properties:
            active:
              type: integer
              description: 当前正在处理的请求数量。
            queued:
              type: integer
              description: 当前排队中的请求数量。
          required:
            - active
            - queued
          additionalProperties: false
          description: 当前并发使用情况。
        limits:
          type: object
          properties:
            maxConcurrent:
              anyOf:
                - type: integer
                - type: 'null'
              description: >-
                允许的最大并发请求数。Null 表示不限制。
            maxQueued:
              anyOf:
                - type: integer
                - type: 'null'
              description: 允许的最大排队请求数。Null 表示不限制。
          required:
            - maxConcurrent
            - maxQueued
          additionalProperties: false
          description: 团队的并发限制。
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
        在 x-api-key 请求头中传入你的 Exa API key。也可以使用 Authorization: Bearer <key> 进行认证。
    bearer:
      type: http
      scheme: bearer
      description: >-
        在 x-api-key 请求头中传入你的 Exa API key。也可以使用 Authorization: Bearer <key> 进行认证。

```