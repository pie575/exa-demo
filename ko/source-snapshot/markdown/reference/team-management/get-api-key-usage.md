> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="get-api-key-usage">
  # API 키 사용량 조회
</div>

> 특정 API 키의 사용량 분석 및 billing 데이터를 조회합니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Info>
  Team Management API는 team 단위로 활성화됩니다. 인증에는 서비스 계정 API 키를 사용하며, 이 키는 team에 해당 기능이 활성화된 후 [API 키 페이지](https://dashboard.exa.ai/api-keys)의 **Service keys** 탭에서 생성할 수 있습니다. 액세스를 요청하려면 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
</Info>

<div id="overview">
  ## 개요
</div>

Get API Key Usage 엔드포인트를 사용하면 특정 API 키의 상세한 billing 및 사용량 분석 데이터를 지정한 기간에 대해 조회할 수 있습니다. 이 엔드포인트는 Exa의 billing 시스템에서 비용 데이터를 반환하므로, 해당 API 키에 대해 실제로 청구되는 내용을 정확하게 파악할 수 있습니다.

<div id="path-parameters">
  ## Path Parameters
</div>

* **id**: 사용량을 조회할 API 키의 고유 식별자

<div id="query-parameters">
  ## Query Parameters
</div>

* **start&#95;date** (선택): 사용량 집계 기간의 시작 날짜이며, ISO 8601 형식입니다(예: `2025-01-01T00:00:00Z` 또는 `2025-01-01`). 기본값은 30일 전입니다. 최근 6개월(180일) 이내여야 합니다.
* **end&#95;date** (선택): 사용량 집계 기간의 종료 날짜이며, ISO 8601 형식입니다. 기본값은 현재 시각입니다.
* **group&#95;by** (선택): 결과를 그룹화할 시간 단위입니다(`hour`, `day`, `month`). 현재는 향후 기능 확장을 위해 예약된 값으로, response 구조에는 영향을 주지 않습니다. 기본값은 `day`입니다.

<div id="response">
  ## Response
</div>

다음을 포함한 상세 사용량 및 billing 정보를 반환합니다:

* **id**: API 키의 고유 식별자
* **api&#95;key&#95;id**: API 키의 고유 식별자
* **api&#95;key&#95;name**: API 키의 설명용 이름(설정된 경우)
* **team&#95;id**: 이 키가 속한 team ID
* **period**: 사용량 집계 기간의 시작일과 종료일을 담은 객체
* **total&#95;cost&#95;usd**: 지정한 기간의 총 비용(USD)
* **cost&#95;breakdown**: 가격 유형별 비용 내역 array이며, 각 항목은 다음을 포함합니다:
  * **price&#95;id**: 가격의 고유 식별자
  * **price&#95;name**: 가격 이름(예: &quot;Neural Search&quot;, &quot;Content Retrieval&quot;)
  * **quantity**: 소비된 총 수량
  * **amount&#95;usd**: 해당 가격 유형의 비용(USD)
* **metadata**: 리포트 생성 timestamp를 담은 객체

<div id="important-notes">
  ## 중요 사항
</div>

* **6개월 조회 제한**: billing 시스템에는 6개월(180일) 조회 제한이 있습니다. `start_date`가 180일 이전인 요청은 400 오류를 반환합니다.
* **사용량 없음**: 요청한 기간에 해당 API 키의 사용량이 없으면 `total_cost_usd`는 0이 되고 `cost_breakdown`은 비어 있을 수 있습니다.
* **Team 소유권**: authentication에 사용하는 서비스 API 키는 조회 대상 API 키와 동일한 team에 속해야 합니다. team 간 액세스은 허용되지 않습니다.
* **날짜 형식**: 날짜는 시간 정보를 포함하거나 생략한 ISO 8601 형식으로 지정할 수 있습니다(예: `2025-01-01` 또는 `2025-01-01T00:00:00Z`).

<div id="use-cases">
  ## 사용 사례
</div>

이 엔드포인트는 다음과 같은 경우에 유용합니다:

* API 키 단위의 billing dashboard 구축
* 특정 API 키의 사용량 및 비용 모니터링
* 사용량 임계값 기반의 자동 알림 생성
* 내부 비용 배분을 위한 사용량 리포트 생성
* 특정 API 키의 billing 관련 문의 디버깅

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys/{id}/usage
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
  /api-keys/{id}/usage:
    get:
      tags:
        - Team Management
      summary: Get API key usage
      description: >-
        Retrieves usage analytics and billing data for a specific API key over a
        given time period. Returns cost breakdown by price type from the billing
        system.
      operationId: get-api-key-usage
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key.
        - name: start_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            Start date for the usage period (ISO 8601 format). Defaults to 30
            days ago. Must be within the last 6 months (180 days).
          example: '2025-01-01T00:00:00Z'
        - name: end_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            End date for the usage period (ISO 8601 format). Defaults to current
            time.
          example: '2025-01-31T23:59:59Z'
        - name: group_by
          in: query
          required: false
          schema:
            type: string
            enum:
              - hour
              - day
              - month
          description: >-
            Time granularity for grouping results. Currently reserved for future
            enhancements and does not change the response shape. Defaults to
            'day'.
          example: day
      responses:
        '200':
          description: Usage data retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: The unique identifier of the API key.
                  api_key_id:
                    type: string
                    format: uuid
                    description: The API key ID.
                  api_key_name:
                    type:
                      - string
                      - 'null'
                    description: The name of the API key
                  team_id:
                    type: string
                    format: uuid
                    description: The team ID this key belongs to
                  period:
                    type: object
                    properties:
                      start:
                        type: string
                        format: date-time
                        description: Start of the usage period
                      end:
                        type: string
                        format: date-time
                        description: End of the usage period
                  total_cost_usd:
                    type: number
                    description: Total cost in USD for the period
                    example: 45.67
                  cost_breakdown:
                    type: array
                    description: Breakdown of costs by price type
                    items:
                      type: object
                      properties:
                        price_id:
                          type: string
                          description: Unique identifier for the price
                        price_name:
                          type: string
                          description: >-
                            Name of the price (e.g., "Neural Search", "Content
                            Retrieval")
                        quantity:
                          type: number
                          description: Total quantity consumed
                        amount_usd:
                          type: number
                          description: Cost in USD for this price type
                  metadata:
                    type: object
                    properties:
                      generated_at:
                        type: string
                        format: date-time
                        description: When this report was generated
              example:
                id: key_abc123def456
                api_key_id: 550e8400-e29b-41d4-a716-446655440000
                api_key_name: Production API Key
                team_id: 660e8400-e29b-41d4-a716-446655440000
                period:
                  start: '2025-01-01T00:00:00Z'
                  end: '2025-01-31T23:59:59Z'
                total_cost_usd: 45.67
                cost_breakdown:
                  - price_id: price_neural_search
                    price_name: Neural Search
                    quantity: 1000
                    amount_usd: 30
                  - price_id: price_content_retrieval
                    price_name: Content Retrieval
                    quantity: 500
                    amount_usd: 15.67
                metadata:
                  generated_at: '2025-02-01T10:30:00Z'
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
                      - Invalid API key ID format.
                      - >-
                        Invalid date format. Use ISO 8601 format (YYYY-MM-DD or
                        YYYY-MM-DDTHH:mm:ss)
                      - start_date must be before end_date
                      - >-
                        Date range too far in the past. start_date must be
                        within the last 6 months.
                      - >-
                        Invalid group_by parameter. Must be one of: hour, day,
                        month
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
          description: Not Found - API key does not exist
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: API key not found
        '500':
          description: Internal Server Error - Failed to fetch usage data
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Failed to fetch usage data. Please try again later.
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Get usage for the last 30 days (default)
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: bash
          label: Get usage for a specific date range
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage?start_date=2025-01-01&end_date=2025-01-31'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: Get usage for a specific date range
          source: |
            import requests
            from datetime import datetime, timedelta

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY'
            }

            params = {
                'start_date': '2025-01-01T00:00:00Z',
                'end_date': '2025-01-31T23:59:59Z'
            }

            response = requests.get(
                'https://admin-api.exa.ai/team-management/api-keys/{id}/usage',
                headers=headers,
                params=params
            )

            print(response.json())
        - lang: javascript
          label: Get usage for a specific date range
          source: |
            const params = new URLSearchParams({
              start_date: '2025-01-01T00:00:00Z',
              end_date: '2025-01-31T23:59:59Z'
            });

            const response = await fetch(
              `https://admin-api.exa.ai/team-management/api-keys/{id}/usage?${params}`,
              {
                method: 'GET',
                headers: {
                  'x-api-key': 'YOUR-SERVICE-KEY'
                }
              }
            );

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