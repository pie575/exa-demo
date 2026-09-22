> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 다음 주소에서 가져오세요: https://exa.ai/docs/llms.txt
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Polymarket {#polymarket}

> 예측 시장의 odds, 가격 이력, 오더북, trader 포지션을 가져옵니다.

[Polymarket](https://polymarket.com)은 시장 가격이 실제 결과에 대한
대중의 implied probability를 나타내는 예측 시장 플랫폼입니다. [Exa Connect](/ko/docs/agent/connect/overview)는
Polymarket의 공개 시장 데이터에 대한 읽기 전용 접근을 제공합니다.

[Exa Agent](/ko/docs/agent/quickstart) 실행에 `polymarket`을 attach하면
agent가 Exa web search와 함께 Polymarket에도 쿼리를 보냅니다.

## 활용 사례 {#use-it-for}

* 특정 주제에 대한 예측 시장과 현재 market-implied odds 찾기
* 특정 결과의 implied probability가 시간에 따라 어떻게 변했는지 비교하기
* 시장 유동성, 매수/매도 깊이, 상위 포지션 보유자 살펴보기
* trader의 현재 포지션과 최근 온체인 활동 검토하기

## 제공업체 ID {#provider-id}

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
polymarket
```

## Pricing {#pricing}

Polymarket의 읽기 API는 인증이 필요 없고 무료이므로 Polymarket 도구 호출에는
비용이 발생하지 않습니다. 표준
[Agent 실행 가격](/ko/docs/agent/quickstart#pricing)만 지불하면 됩니다.

## 제공 데이터 {#data-available}

| 데이터          | 설명                                                |
| ------------ | ------------------------------------------------- |
| 시장 및 이벤트     | 현재 예측 시장과 이벤트, implied probability 가격, 거래량, 유동성.                |
| 가격 이력        | 특정 결과의 implied probability가 시간에 따라 변해온 추이.                      |
| 오더북          | 시장 결과에 대한 실시간 매수/매도 깊이와 스프레드.                     |
| 보유자 및 trader | 해당 시장의 상위 포지션 보유자, 그리고 trader의 현재 포지션과 최근 온체인 활동. |

## 예시 {#example}

연준 금리 인하의 market-implied odds와 지난 한 달 동안의 변화 추이를 가져옵니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "What are the current market-implied odds of a Fed rate cut at the "
          "next FOMC meeting, and how have they moved over the past month?"
      ),
      data_sources=[{"provider": "polymarket"}],
      output_schema={
          "type": "object",
          "required": ["market", "currentProbability", "trend"],
          "properties": {
              "market": {"type": "string", "description": "the market question"},
              "currentProbability": {"type": "number", "description": "between 0 and 1"},
              "trend": {"type": "string", "description": "how the implied probability moved over the past month"},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
    dataSources: [{ provider: "polymarket" }],
    outputSchema: {
      type: "object",
      required: ["market", "currentProbability", "trend"],
      properties: {
        market: { type: "string", description: "the market question" },
        currentProbability: { type: "number", description: "between 0 and 1" },
        trend: { type: "string", description: "how the implied probability moved over the past month" },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
      "dataSources": [{ "provider": "polymarket" }],
      "outputSchema": {
        "type": "object",
        "required": ["market", "currentProbability", "trend"],
        "properties": {
          "market": { "type": "string", "description": "the market question" },
          "currentProbability": { "type": "number", "description": "between 0 and 1" },
          "trend": { "type": "string", "description": "how the implied probability moved over the past month" }
        }
      }
    }'
  ```
</CodeGroup>

## 함께 사용하면 좋은 기능 {#pairs-well-with}

* [Exa web search](/ko/docs/search/quickstart): 시장 odds에 관련 보도와 배경 컨텍스트를 더합니다.
* [Particle](/ko/docs/agent/connect/particle): odds 변동의 배경이 된 뉴스 보도를 가져옵니다.
* [Financial Datasets](/ko/docs/agent/connect/financialdatasets): market-implied odds를 가격, fundamental, 거시 경제 데이터와 연결합니다.

## 다음 단계 {#next-steps}

<Columns cols={2}>
  <Card title="실행에 attach하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서 `dataSources`, 가격, 전체 파트너 카탈로그를 다룹니다.
  </Card>

  <Card title="제공업체 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 다섯 개의 파트너를 attach하고, 각 파트너가 모두 호출되도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 알아보기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 진행 상황을 스트리밍하고, output schema를 설계하고, effort와 비용을 제어하세요.
  </Card>

  <Card title="API 키 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="키 생성하기" arrow="true">
    dashboard에서 키를 생성하고 이 페이지의 예제를 그대로 실행해 보세요. 신규 계정에는 무료 credits이 제공됩니다.
  </Card>
</Columns>