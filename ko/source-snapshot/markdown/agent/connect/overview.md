> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Exa Connect {#exa-connect}

> 한 번의 실행에서 Exa web search와 함께 프리미엄 data partners에 실시간으로 접근할 수 있는 권한을 Exa Agent에 부여하세요.

Exa Connect는 프리미엄 data partners를 Exa Agent 루프에 통합합니다. 실행에 제공업체를
attach하면 Exa Agent가 web search와 함께 해당 파트너의 데이터베이스를 조회한 뒤, 그 결과를
하나의 근거 기반 구조화된 답변으로 통합합니다.

Agent 실행이 처음이신가요? [Exa Agent 가이드](/ko/docs/agent/quickstart)부터 시작한 다음,
다시 돌아와 data partners를 attach하세요.

<Tip>
  Exa Agent는 이미 Search API와 동일한 뉴스, 코드, 기업, 인물 소스로 구성된 전체 [데이터 인덱스](/ko/docs/search/data/overview)를 검색합니다. Exa Connect는 여기에 프리미엄 파트너 데이터베이스를 더해줍니다.
</Tip>

<Tip>
  MCP를 선호하시나요? Exa Agent와 [Exa Connect](/ko/docs/agent/connect/overview)는 [Exa MCP](/ko/docs/get-started/exa-mcp#exa-agent)에서 사용할 수 있습니다. `tools=agent_run`을 활성화하면 Claude, Cursor를 비롯한 MCP 클라이언트에서 다단계 리서치, 리스트 빌딩, enrichment, structured output을 실행할 수 있습니다.
</Tip>

## Exa Connect를 사용하는 이유 {#why-exa-connect}

* **별도 연동 없이 프리미엄 데이터 이용.** 계약을 체결하거나 SDK를 붙이지 않고도
  파트너 데이터에 접근할 수 있습니다. Exa API 하나만 call하면 됩니다.
* **복잡한 작업은 Exa가 처리.** 제공업체 authentication, 도구 선택,
  재시도, 결과 랭킹을 Exa가 관리합니다.
* **Exa Agent가 소스를 선택.** `outputSchema`에서
  &quot;Similarweb의 월간 방문자 수&quot;나 &quot;검증된 임원&quot;을 요청하면, Exa Agent는 웹 페이지를 보고 추측하는 대신
  적합한 파트너 도구를 call합니다.
* **한 번의 실행에서 인덱스와 파트너 데이터를 함께 활용.** Connect는 Exa 인덱스 위에서 동작합니다.
  Exa Agent는 각 소스를 가장 강점이 있는 영역에 활용하고 그 결과를 인용합니다.

## 작동 방식 {#how-it-works}

1. [`POST /agent/runs`](/ko/docs/reference/agent-api/create-a-run)의 `dataSources` 배열로 하나 이상의 제공업체를 **attach**합니다.
2. Exa Agent가 질의와 `outputSchema`를 바탕으로 각 단계에 **알맞은 도구**를 선택합니다. 파트너 데이터 또는 Exa web search 중에서 선택합니다.
3. 파트너 결과는 **웹 리서치와 통합**되어 소스가 첨부된 structured output으로 제공됩니다.

## Pricing {#pricing}

<Note>
  Exa Connect 가격은 표준 [Agent 실행 가격](/ko/docs/agent/quickstart#pricing)에 더해 부과됩니다.
  기본 Agent 컴퓨팅 및 search 비용에 더해, Exa Connect 도구 호출마다 제공업체 call 요금이 부과됩니다.
</Note>

| 제공업체                                                 | 가격                                            |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/ko/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/ko/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/ko/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/ko/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / call`                               |
| Particle                                             | `$0.015 / call`                               |
| Financial Datasets                                   | `$0.01 / call`                                |
| Jinko                                                | `$0.005 / call`                               |

Fiber.ai는 call 단위가 아니라 credits 단위로 과금합니다. 자체 요금이 call마다
달라지기 때문입니다. search는 2 credits에 반환된 result 1건당 1 credit이 추가되고,
기업 또는 인물 조회는 반환된 후보 1건당 과금되며(따라서 이름이 모호할 때 이를 구분하려고
기업 조회의 `numResults`를 늘리면 비용이 더 듭니다), 연락처 공개는 work email, 개인 이메일,
전화번호 중 무엇을 요청하는지에 따라 2~5 credits입니다. call마다 Fiber가 보고한
credits만큼 과금되며, 일치하는 항목이 없는 call은 무료입니다. [Fiber.ai 가격](/ko/docs/agent/connect/fiber#pricing)을 참고하세요.

Similarweb은 데이터 credits 단위로 과금하며(대략 지표 × 행 × 월당 1 credit), 따라서
call 가격은 `numResults`/`months` 값에 따라 call당 1~15 credits가 됩니다. call마다
Similarweb이 보고한 credits만큼 과금되며, 데이터를 반환하지 않은 call은 무료입니다.
[Similarweb 가격](/ko/docs/agent/connect/similarweb#pricing)을 참고하세요.

Baselayer는 order 단위로 과금하며, 요율은 작업 종류에 따라 달라집니다. KYB 사업자 search는
$1.00, UCC 담보권 search는 검색한 state당 $2.00, 소송/파산 사건 기록 search는
카테고리당 $1.00, 워치리스트 screening은 요청한 목록당 $0.10~$0.25, 산업 분류와
웹사이트 분석은 각각 $0.35, 웹 존재감 분석은 선택한 분석 항목 비용의 합계(각
$0.15~$0.35), 국제 사업자 search는 $4.00입니다. 앞서 수행한 사업자 search에 대한 후속
조회(사업자 조회, 임원, 등록 정보, 임원 역방향 조회)는 무료입니다. [Baselayer 가격](/ko/docs/agent/connect/baselayer#pricing)을 참고하세요.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
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
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Data partners {#data-partners}

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/ko/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM 및 리크루팅.** 리드 발굴과 연락처 리서치를 위한 기업 및 인물 B2B 데이터베이스입니다.
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/ko/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **웹 분석.** 모든 도메인의 트래픽 추정치, 글로벌 순위, 경쟁사
      탐색 기능을 제공합니다.
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/ko/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **규정 준수 및 KYB.** 미국 기업의 임원, 등록 정보, 리스크
      신호를 검증합니다.
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/ko/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **예측 시장.** Polymarket에서 제공하는 예측 시장 odds, 가격 이력, trader 포지션 정보입니다.
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/ko/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **커머스.** 가격, 브랜드, 판매처 링크를 포함한 상품 카탈로그 search.
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/ko/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **미디어 인텔리전스.** 화자 정보와 timestamp가 포함된 팟캐스트 전문을 검색하세요.
    </Card>

    <Card title="금융 데이터셋" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/financialdatasets.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=24052e4641fa4060e1ccf64482b10e00" href="/ko/docs/agent/connect/financialdatasets" width="401" height="400" data-path="images/agent/connect/financialdatasets.svg">
      **금융.** 27,000개 이상의 미국 ticker에 대한 주가, fundamental, 실적, SEC 공시 자료,
      지분 정보, 주식 screening 데이터를 제공합니다.
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/jinko.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=958d2ec147d452f12c0904f41ffb2311" href="/ko/docs/agent/connect/jinko" width="400" height="395" data-path="images/agent/connect/jinko.svg">
      **여행.** 실시간 가격을 제공하는 항공편 및 호텔 search.
    </Card>
  </Columns>
</div>

위 목록에 없는 소스가 필요하신가요? [추가 제공업체](/ko/docs/agent/connect/additional-partners)를 확인해 보세요. 저희 팀에 문의하시면 요청에 따라 이용하실 수 있습니다.

## 사용량 {#usage}

### 제공업체 조합하기 {#combining-providers}

작업에 필요한 만큼 파트너를 attach하세요. Exa Agent는 각 파트너가 가장 강점을 보이는 영역에서 해당 파트너를 call하고, 그 결과를 web search 결과와 결합해 하나의 구조화된 답변으로 만들어 줍니다:

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

모든 파트너가 호출되도록 질의와 `outputSchema`를 구성하는 방법을 포함한 전체 과정은 [Combining providers](/ko/docs/agent/connect/combining-providers)를 참고하세요.