> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="get-a-monitor-run">
  # 获取 monitor run
</div>

> 获取指定的 monitor run。

<div id="openapi">
  ## OpenAPI
</div>

```yaml exa-spec.yaml GET /v0/monitors/{monitor}/runs/{id}
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
  /v0/monitors/{monitor}/runs/{id}:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors Runs
      summary: Get Monitor Run
      description: Gets a specific monitor run.
      operationId: monitors-runs-get
      parameters:
        - in: path
          name: monitor
          schema:
            type: string
          description: The id of the Monitor to get the run for
          required: true
        - in: path
          name: id
          schema:
            type: string
          required: true
      responses:
        '200':
          description: Monitor run details
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Unique identifier for the request.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MonitorRun'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    MonitorRun:
      properties:
        id:
          description: The unique identifier for the Monitor Run
          type: string
        object:
          enum:
            - monitor_run
          description: The type of object
          type: string
        monitorId:
          description: The monitor that the run is associated with
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: The status of the Monitor Run
          type: string
        completedAt:
          format: date-time
          type: string
          description: When the run completed
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: When the run failed
          nullable: true
        failedReason:
          type: string
          description: The reason the run failed
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: When the run was canceled
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: When the run was created
        updatedAt:
          type: string
          format: date-time
          description: When the run was last updated
        type:
          type: string
          enum:
            - search
            - refresh
          description: The type of the Monitor Run
      required:
        - id
        - object
        - monitorId
        - status
        - type
        - completedAt
        - failedAt
        - failedReason
        - canceledAt
        - createdAt
        - updatedAt
      type: object
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