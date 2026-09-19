> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="polymarket">
  # Polymarket
</div>

> 예측 시장의 배당률, 가격 이력, order books, trader 포지션을 가져옵니다.

[Polymarket](https://polymarket.com)은 시장 가격이 현실 세계 결과에 대한 대중의
implied probability를 나타내는 예측 시장 플랫폼입니다. [Exa Connect](/ko/docs/agent/connect/overview)는
Polymarket의 공개 시장 데이터에 대한 읽기 전용 접근을 제공합니다.

[Exa Agent](/ko/docs/agent/quickstart) 실행에 `polymarket`을 attach하면
agent가 Exa web search와 함께 Polymarket에도 질의합니다.

<div id="use-it-for">
  ## 활용 사례
</div>

* 특정 주제의 prediction markets와 현재 market-implied odds 찾기
* 특정 결과의 implied probability가 시간에 따라 어떻게 변했는지 비교하기
* 시장 유동성, 매수/매도 호가 depth, 상위 포지션 보유자 확인하기
* trader의 현재 포지션과 최근 온체인 활동 검토하기

<div id="provider-id">
  ## Provider ID
</div>

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
polymarket
```

<div id="pricing">
  ## 요금
</div>

Polymarket의 읽기 API는 인증이 필요 없고 무료이므로 Polymarket 도구 call에는
비용이 발생하지 않습니다. 표준
[Agent 실행 요금](/ko/docs/agent/quickstart#pricing)만 지불하면 됩니다.

<div id="data-available">
  ## 사용 가능한 데이터
</div>

| 데이터          | 설명                                                                     |
| ------------ | ---------------------------------------------------------------------- |
| 마켓 및 이벤트     | 현재 진행 중인 prediction markets와 이벤트, implied probability 기반 가격, 거래량, 유동성. |
| 가격 이력      | 특정 결과의 implied probability가 시간에 따라 어떻게 변해왔는지.                          |
| Order books  | 마켓 결과별 실시간 매수/매도 호가 깊이와 스프레드.                                          |
| 보유자 및 trader | 해당 마켓의 상위 포지션 보유자와 특정 trader의 현재 포지션 및 최근 온체인 활동.                      |

<div id="example">
  ## 예시
</div>

연준 금리 인하에 대한 market-implied odds와 지난 한 달간의 변동 추이를 조회합니다.

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

<div id="pairs-well-with">
  ## 함께 쓰면 좋은 기능
</div>

* [Exa web search](/ko/docs/search/quickstart): 시장 확률에 보도 내용과 배경 정보를 더해 보세요.
* [Particle](/ko/docs/agent/connect/particle): 확률이 움직인 배경의 뉴스 보도를 가져옵니다.
* [Financial Datasets](/ko/docs/agent/connect/financialdatasets): 시장 내재 확률(market-implied odds)을 가격, 펀더멘털, 거시 경제 데이터와 연결합니다.

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="실행에 연결하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서는 `dataSources`, 가격, 전체 파트너 카탈로그를 다룹니다.
  </Card>

  <Card title="여러 제공자 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 다섯 개의 파트너를 연결하고, 각 파트너가 모두 동작하도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 익히기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 진행 상황을 스트리밍하고, 출력 schema를 설계하고, effort와 비용을 제어해 보세요.
  </Card>

  <Card title="API key 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="key 생성하기" arrow="true">
    Dashboard에서 key를 생성하면 이 페이지의 예제를 그대로 실행할 수 있습니다. 신규 계정에는 무료 credits이 제공됩니다.
  </Card>
</Columns>