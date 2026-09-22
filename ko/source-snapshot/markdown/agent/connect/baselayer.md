> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="baselayer">
  # Baselayer
</div>

> 미국 기업을 verification하고 KYB 데이터를 조회하세요: 임원, 등록 정보, 리스크 score.

[Baselayer](https://baselayer.com)는 공신력 있는 등록 및 리스크 데이터를 기준으로 미국 법인을 검증하는 KYB(Know Your Business) 플랫폼입니다. 상호와 주소로 기업을 식별하고 임원, 주별 등록 정보, 법인 구조, verification 상태 등 전체 프로필을 반환합니다.

[Exa Connect](/ko/docs/agent/connect/overview)를 통해 [Exa Agent](/ko/docs/agent/quickstart) 실행에 `baselayer`를 attach하면, agent가 Exa web search와 함께 Baselayer를 조회합니다.

<div id="use-it-for">
  ## 활용 사례
</div>

* KYB 온보딩 및 벤더/고객 verification.
* 임원, 등록 정보, 법인 구조에 대한 실사.
* 기업의 위험 요소 및 워치리스트 일치 여부 screening.

<div id="provider-id">
  ## 제공업체 ID
</div>

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
baselayer
```

<div id="pricing">
  ## Pricing
</div>

Baselayer는 주문 단위로 과금하며, 요율은 작업 종류와 해당 parameters에 따라 달라집니다:

| 작업                            | 가격                                          |
| ----------------------------- | ------------------------------------------- |
| 비즈니스 search                   | `$1.00 / search`                            |
| 비즈니스 조회 / 임원 / 등록 정보 / 임원 역조회 | 무료(이전 search 결과 읽기)                         |
| 담보권(lien) search              | `$2.00 / state searched`                    |
| 소송 search                     | `$1.00 / category (litigation, bankruptcy)` |
| 워치리스트 스크리닝                    | `$0.10 – $0.25 / list requested`            |
| 산업 분류                         | `$0.35 / call`                              |
| 웹사이트 분석                       | `$0.35 / call`                              |
| 웹 존재감 분석                      | `$0.15 – $0.35 / selected analysis`         |
| 해외 비즈니스 search                | `$4.00 / search`                            |

가격은 매개변수 선택에 따라 달라집니다. 두 개 state를 대상으로 한 담보권 search는 $4.00, 지원되는 여섯 개 목록 전체를 대상으로 한 워치리스트 스크리닝은 $1.35이며, 웹 존재감 분석 call은 선택한 분석 항목의 합계(아무것도 선택하지 않으면 Baselayer의 기본 세트인 NAICS 예측과 웹사이트 분석의 합계)로 계산됩니다.

<div id="example">
  ## 예시
</div>

기업을 검증하고 해당 기업의 임원 및 등록 정보를 조회합니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
      data_sources=[{"provider": "baselayer"}],
      output_schema={
          "type": "object",
          "required": ["business"],
          "properties": {
              "business": {
                  "type": "object",
                  "required": ["name", "verified", "incorporationState", "officers"],
                  "properties": {
                      "name": {"type": "string"},
                      "verified": {"type": "boolean"},
                      "incorporationState": {"type": "string"},
                      "officers": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "required": ["name", "title"],
                              "properties": {
                                  "name": {"type": "string"},
                                  "title": {"type": "string"},
                              },
                          },
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
    query: "Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
    dataSources: [{ provider: "baselayer" }],
    outputSchema: {
      type: "object",
      required: ["business"],
      properties: {
        business: {
          type: "object",
          required: ["name", "verified", "incorporationState", "officers"],
          properties: {
            name: { type: "string" },
            verified: { type: "boolean" },
            incorporationState: { type: "string" },
            officers: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "title"],
                properties: {
                  name: { type: "string" },
                  title: { type: "string" },
                },
              },
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
      "query": "Verify the business Stripe, Inc. in San Francisco, CA and return its officers and registration status.",
      "dataSources": [{ "provider": "baselayer" }],
      "outputSchema": {
        "type": "object",
        "required": ["business"],
        "properties": {
          "business": {
            "type": "object",
            "required": ["name", "verified", "incorporationState", "officers"],
            "properties": {
              "name": { "type": "string" },
              "verified": { "type": "boolean" },
              "incorporationState": { "type": "string" },
              "officers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["name", "title"],
                  "properties": {
                    "name": { "type": "string" },
                    "title": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 함께 사용하기 좋은 도구
</div>

* [Fiber.ai](/ko/docs/agent/connect/fiber): 검증된 기업에 기업 정보, 직원 수, 연락처를 더해 enrich합니다.
* [Financial Datasets](/ko/docs/agent/connect/financialdatasets): 상장 기업의 최신 뉴스 보도를 추가합니다.
* [Similarweb](/ko/docs/agent/connect/similarweb): 검증된 기업의 웹 traffic과 competitor를 비교 분석합니다.

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="실행에 attach하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서는 `dataSources`, 가격, 전체 파트너 카탈로그를 다룹니다.
  </Card>

  <Card title="제공업체 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 다섯 개의 파트너를 attach하고, 각 파트너가 호출되도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 익히기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행 생성, 진행 상황 스트리밍, output schema 설계, effort와 비용 제어 방법을 알아보세요.
  </Card>

  <Card title="API 키 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="키 생성하기" arrow="true">
    dashboard에서 키를 생성하면 이 페이지의 예제를 그대로 실행할 수 있습니다. 신규 계정에는 무료 credits이 제공됩니다.
  </Card>
</Columns>