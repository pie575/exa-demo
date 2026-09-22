> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Monitor 실행 목록 조회 {#list-monitor-runs}

> 해당 Monitor의 모든 실행을 나열합니다.

## OpenAPI {#openapi}

```yaml exa-spec.yaml GET /v0/monitors/{monitor}/runs
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
  /v0/monitors/{monitor}/runs:
    servers:
      - url: https://api.exa.ai/websets
    get:
      tags:
        - Monitors Runs
      summary: List Monitor Runs
      description: Lists all runs for the Monitor.
      operationId: monitors-runs-list
      parameters:
        - in: path
          name: monitor
          schema:
            type: string
          description: The id of the Monitor to list runs for
          required: true
      responses:
        '200':
          description: List of monitor runs
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
                $ref: '#/components/schemas/ListMonitorRunsResponse'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    ListMonitorRunsResponse:
      properties:
        data:
          items:
            $ref: '#/components/schemas/MonitorRun'
          description: The list of monitor runs
          type: array
        hasMore:
          description: Whether there are more results to paginate through
          type: boolean
        nextCursor:
          type: string
          description: The cursor to paginate through the next set of results
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
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