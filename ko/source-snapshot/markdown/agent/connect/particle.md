> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="particle">
  # Particle
</div>

> 화자 정보와 timestamp가 포함된 팟캐스트 transcript를 검색하세요.

[Particle](https://particle.news)의 Podcast Intelligence는 10만 개 이상의 프로그램을
인덱싱하며, 방송 후 몇 분 이내에 전체 전사, 화자 분리, 화자 식별, 라벨링, 메타데이터
enrich까지 마쳐 음성 대화를 검색할 수 있게 해줍니다. 각 결과는 timestamp와 화자 정보가
표시된 transcript 구간으로 제공됩니다.

[Exa Connect](/ko/docs/agent/connect/overview)를 통해 [Exa Agent](/ko/docs/agent/quickstart) 실행에
`particle`을 attach하면, agent가 Exa web search와 함께 Particle에도 질의합니다.

<div id="use-it-for">
  ## 활용 사례
</div>

* 전문가 논평과 인용할 만한 발언 찾기
* 미디어 및 브랜드 모니터링
* 내러티브 및 여론 분석
* 팟캐스트 탐색 및 최신 정보 파악

<div id="provider-id">
  ## Provider ID
</div>

`dataSources`에 다음 값을 사용하세요:

```text theme={null}
particle
```

<div id="example">
  ## 예시
</div>

팟캐스트 진행자들이 AI 규제에 대해 어떤 이야기를 하는지 찾아봅니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      data_sources=[{"provider": "particle"}],
      output_schema={
          "type": "object",
          "required": ["mentions"],
          "properties": {
              "mentions": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "episode", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "episode": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "pro-regulation, anti-regulation, or nuanced"},
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
    query: "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
    dataSources: [{ provider: "particle" }],
    outputSchema: {
      type: "object",
      required: ["mentions"],
      properties: {
        mentions: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["podcast", "episode", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              episode: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "pro-regulation, anti-regulation, or nuanced" },
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
      "query": "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      "dataSources": [{ "provider": "particle" }],
      "outputSchema": {
        "type": "object",
        "required": ["mentions"],
        "properties": {
          "mentions": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["podcast", "episode", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "episode": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "pro-regulation, anti-regulation, or nuanced" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 함께 사용하기 좋은 항목
</div>

* [Financial Datasets](/ko/docs/agent/connect/financialdatasets): 팟캐스트에서 오간 이야기를 게시된 뉴스와 교차 검증합니다.
* [Fiber.ai](/ko/docs/agent/connect/fiber): 논의 대상 인물에 대한 회사 및 연락처 컨텍스트를 attach합니다.

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="실행에 attach하기" icon="rocket" href="/ko/docs/agent/connect/overview" cta="Quickstart 열기" arrow="true">
    Exa Connect Quickstart에서 `dataSources`, 가격 정책, 전체 파트너 카탈로그를 다룹니다.
  </Card>

  <Card title="여러 제공자 조합하기" icon="blend" href="/ko/docs/agent/connect/combining-providers" cta="가이드 읽기" arrow="true">
    하나의 실행에 최대 다섯 개의 파트너를 attach하고, 각 파트너가 모두 동작하도록 질의를 구성하세요.
  </Card>

  <Card title="Exa Agent 알아보기" icon="book-open" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    실행을 생성하고, 진행 상황을 스트리밍하고, 출력 schema를 설계하고, effort와 비용을 제어하세요.
  </Card>

  <Card title="API key 발급받기" icon="key" href="https://dashboard.exa.ai/api-keys" cta="key 생성" arrow="true">
    Dashboard에서 key를 생성하면 이 페이지의 예제를 그대로 실행할 수 있습니다. 신규 계정에는 무료 credit이 제공됩니다.
  </Card>
</Columns>