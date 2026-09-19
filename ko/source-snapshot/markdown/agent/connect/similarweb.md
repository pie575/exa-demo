> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 다음 주소에서 가져오세요: https://exa.ai/docs/llms.txt
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="similarweb">
  # Similarweb
</div>

> 웹사이트 트래픽 추정치, 글로벌 순위, 경쟁사 발굴 정보를 확인하세요.

[Similarweb](https://www.similarweb.com)은 디지털 마켓 인텔리전스 분야를 선도하는
데이터 제공처입니다. 수백만 개의 웹사이트와 앱의 트래픽 및 인게이지먼트를 모델링하여
추정 방문 수, 트래픽 유입 경로, 방문자 인구 통계는 물론 특정 도메인을 둘러싼
경쟁 그룹까지 다룹니다.

[Exa Connect](/ko/docs/agent/connect/overview)를 통해 `similarweb`을
[Exa Agent](/ko/docs/agent/quickstart) 실행에 attach하면, agent가
Exa web search와 함께 Similarweb에도 질의합니다.

<div id="use-it-for">
  ## 활용 사례
</div>

* 특정 기업의 웹 트래픽과 사용자 참여도를 동종 업계와 비교 분석
* 도메인의 경쟁사 및 방문자가 겹치는 사이트 파악
* 디지털 존재감을 기준으로 시장 규모 산정 및 기업 선별
* 실제 행동 데이터로 기업 및 산업 분야 조사 보강

<div id="provider-id">
  ## Provider ID
</div>

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
similarweb
```

<div id="pricing">
  ## 가격
</div>

Similarweb은 데이터 credit 기준으로 `$0.30 / credit`을 청구하며, 각 call에는
Similarweb이 해당 call에 대해 보고한 credit만큼 요금이 부과됩니다. credit은 반환되는
데이터 양에 비례해 늘어나며, 대략 데이터 포인트(지표 × 행 × 월)당 1 credit입니다.
따라서 call의 가격은 해당 call의 파라미터에 따라 결정됩니다:

| 도구           | Credits                                   |
| ------------ | ----------------------------------------- |
| 트래픽 및 순위     | 요청 월당 최대 7 (1~2개월)                        |
| 유사 사이트       | 반환된 사이트당 3 (1~5개 사이트)                     |
| 트래픽 소스       | 10                                        |
| 상위 리퍼러       | 반환된 리퍼러당 3 (1~5)                          |
| 상위 국가        | 반환된 국가당 3 (1~5)                           |
| 상위 페이지       | 반환된 페이지당 2 (1~7)                          |
| 상위 키워드       | 1~10 (키워드 데이터 포인트 100개당 약 1; 키워드 50개는 ~7) |
| 키워드 개요       | 1~2                                       |
| 방문자 인구통계     | 8                                         |
| 방문자 중복도      | 도메인 조합당 2 (도메인 2~~3개: 6~~14)              |
| 기술           | 10                                        |
| 카테고리별 상위 사이트 | 반환된 사이트당 1 (1~10)                         |

데이터를 반환하지 않는 call(알 수 없거나 트래픽이 적은 도메인, search 볼륨이 없는
키워드)은 무료입니다. `numResults`와 `months`가 요금이 부과되는 데이터 포인트 수를
결정하므로, 작업에 필요한 최소한으로 설정하세요.

<div id="example">
  ## 예시
</div>

빠르게 성장하는 B2B SaaS 기업 10곳과 각 기업의 추정 웹 트래픽을 찾습니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      data_sources=[{"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "monthlyVisits"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
    dataSources: [{ provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "monthlyVisits"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              monthlyVisits: { type: "number", description: "from Similarweb" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      "dataSources": [{ "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "monthlyVisits"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "monthlyVisits": { "type": "number", "description": "from Similarweb" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 함께 쓰면 좋은 도구
</div>

* [Fiber.ai](/ko/docs/agent/connect/fiber): 발견한 경쟁사를 정보가 enrich된 기업 레코드로 변환합니다.
* [Affiliate.com](/ko/docs/agent/connect/affiliatecom): 특정 판매처의 제품을 추천하기 전에 해당 판매처의 도달 범위를 확인합니다.

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="실행에 attach하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서 `dataSources`, 가격, 전체 partner 카탈로그를 다룹니다.
  </Card>

  <Card title="provider 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 5개의 partner를 attach하고, 각 partner가 모두 동작하도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 익히기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 진행 상황을 스트리밍하고, output schema를 설계하고, effort와 cost를 제어해 보세요.
  </Card>

  <Card title="API key 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="key 생성하기" arrow="true">
    Dashboard에서 key를 생성한 뒤 이 페이지의 예제를 그대로 실행해 보세요. 신규 계정에는 무료 credits이 제공됩니다.
  </Card>
</Columns>