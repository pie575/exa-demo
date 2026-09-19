> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="list-monitor-runs">
  # Monitor 실행 목록 조회
</div>

> 해당 Monitor의 모든 실행을 조회합니다.

<div id="openapi">
  ## OpenAPI
</div>

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
      summary: monitor 실행 목록 조회
      description: 해당 monitor의 모든 실행을 조회합니다.
      operationId: monitors-runs-list
      parameters:
        - in: path
          name: monitor
          schema:
            type: string
          description: 실행 목록을 조회할 monitor의 id
          required: true
      responses:
        '200':
          description: monitor 실행 목록
          headers:
            X-Request-Id:
              schema:
                type: string
              description: 요청의 고유 식별자입니다.
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
          description: monitor 실행 목록
          type: array
        hasMore:
          description: 페이지를 넘겨 조회할 결과가 더 있는지 여부
          type: boolean
        nextCursor:
          type: string
          description: 다음 결과 묶음을 조회하기 위한 cursor
          nullable: true
      required:
        - data
        - hasMore
        - nextCursor
      type: object
    MonitorRun:
      properties:
        id:
          description: monitor 실행의 고유 식별자
          type: string
        object:
          enum:
            - monitor_run
          description: 객체의 유형
          type: string
        monitorId:
          description: 해당 실행이 연결된 monitor
          type: string
        status:
          enum:
            - created
            - running
            - completed
            - canceled
            - failed
          description: monitor 실행의 상태
          type: string
        completedAt:
          format: date-time
          type: string
          description: 실행이 완료된 시점
          nullable: true
        failedAt:
          format: date-time
          type: string
          description: 실행이 실패한 시점
          nullable: true
        failedReason:
          type: string
          description: 실행이 실패한 이유
          nullable: true
        canceledAt:
          format: date-time
          type: string
          description: 실행이 취소된 시점
          nullable: true
        createdAt:
          type: string
          format: date-time
          description: 실행이 생성된 시점
        updatedAt:
          type: string
          format: date-time
          description: 실행이 마지막으로 업데이트된 시점
        type:
          type: string
          enum:
            - search
            - refresh
          description: monitor 실행의 유형
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
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key> 방식으로
        인증할 수도 있습니다.
    bearer:
      type: http
      scheme: bearer
      description: >-
        x-api-key header에 Exa API key를 전달하세요. Authorization: Bearer <key> 방식으로
        인증할 수도 있습니다.

```