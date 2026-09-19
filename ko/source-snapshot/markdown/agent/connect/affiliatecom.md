> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="affiliatecom">
  # Affiliate.com
</div>

> 여러 판매처와 제휴 네트워크의 상품 카탈로그를 search합니다.

[Affiliate.com](https://affiliate.com)은 여러 판매처와 제휴 네트워크의 상품 카탈로그를 검색 가능한 단일 인덱스로 통합하고, 실시간 가격과 브랜드 정보, 판매처 직접 링크를 함께 제공합니다.

[Exa Connect](/ko/docs/agent/connect/overview)를 통해 [Exa Agent](/ko/docs/agent/quickstart) 실행에 `affiliate`를 연결하면, agent가 Exa web search와 함께 Affiliate.com에도 질의합니다.

<div id="use-it-for">
  ## 활용 사례
</div>

* 여러 판매처의 상품 탐색 및 가격 비교
* 쇼핑 어시스턴트 및 구매 가이드 콘텐츠 구동
* 리서치 결과와 함께 제휴 링크 노출

<div id="provider-id">
  ## Provider ID
</div>

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
affiliate
```

<div id="example">
  ## 예시
</div>

$300 미만의 무선 노이즈 캔슬링 헤드폰을 찾아 가격을 비교합니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      data_sources=[{"provider": "affiliate"}],
      output_schema={
          "type": "object",
          "required": ["products"],
          "properties": {
              "products": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "brand", "price", "merchant"],
                      "properties": {
                          "name": {"type": "string"},
                          "brand": {"type": "string"},
                          "price": {"type": "string", "description": "price with currency"},
                          "merchant": {"type": "string"},
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
    query: "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
    dataSources: [{ provider: "affiliate" }],
    outputSchema: {
      type: "object",
      required: ["products"],
      properties: {
        products: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "brand", "price", "merchant"],
            properties: {
              name: { type: "string" },
              brand: { type: "string" },
              price: { type: "string", description: "price with currency" },
              merchant: { type: "string" },
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
      "query": "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      "dataSources": [{ "provider": "affiliate" }],
      "outputSchema": {
        "type": "object",
        "required": ["products"],
        "properties": {
          "products": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "brand", "price", "merchant"],
              "properties": {
                "name": { "type": "string" },
                "brand": { "type": "string" },
                "price": { "type": "string", "description": "price with currency" },
                "merchant": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 함께 사용하면 좋은 기능
</div>

* [Similarweb](/ko/docs/agent/connect/similarweb): 판매처를 추천하기 전에 해당 판매처의 도달 범위를 확인합니다.
* [Fiber.ai](/ko/docs/agent/connect/fiber): 판매처나 브랜드를 운영하는 회사를 조사합니다.

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="실행에 연결하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서 `dataSources`, 가격, 전체 파트너 카탈로그를 확인할 수 있습니다.
  </Card>

  <Card title="여러 제공자 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 다섯 개의 파트너를 연결하고, 각 파트너가 모두 동작하도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 알아보기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행 생성, 진행 상황 스트리밍, 출력 스키마 설계, effort와 비용 제어 방법을 알아보세요.
  </Card>

  <Card title="API 키 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="키 생성하기" arrow="true">
    Dashboard에서 키를 생성하면 이 페이지의 예제를 그대로 실행할 수 있습니다. 신규 계정에는 무료 크레딧이 제공됩니다.
  </Card>
</Columns>