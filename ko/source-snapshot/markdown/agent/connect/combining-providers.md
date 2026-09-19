> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="combining-providers">
  # Combining providers
</div>

> 하나의 Exa Agent 실행에서 여러 data partners를 함께 사용하세요.

`dataSources`에 partner를 attach하면 해당 partner를 Exa Agent가 도구로 사용할 수 있게 됩니다. 다만 agent가 반드시 그 도구를 call하도록 **강제하지는 않습니다**. partner가 실제로 호출될지는 `질의`와 `outputSchema`에 달려 있습니다. 각 partner로부터 어떤 종류의 결과를 얻고 싶은지 명시하면, Exa Agent는 웹 페이지에서 추측하는 대신 그에 맞는 도구를 사용합니다. 실행 하나당 최대 다섯 개의 partner를 attach할 수 있으며, 각 단계에서 어떤 도구를 call할지는 Exa Agent가 선택하고 Exa web search도 함께 사용할 수 있습니다. 단일 실행에서 다섯 개를 초과해야 하나요? limit 상향은 [문의해 주세요](mailto:sales@exa.ai).

<div id="two-partners-in-one-run">
  ## 하나의 실행에서 두 partner 사용하기
</div>

여러 partner를 함께 나열하면 Exa Agent가 각 partner의 강점이 발휘되는 부분을 알아서 활용합니다. 여기서 두 개는 예시일 뿐이며, `dataSources`에 최대 다섯 개의 partner를 attach할 수 있고 원칙은 동일합니다. 즉, 각 partner의 데이터를 명시적으로 요청하면 됩니다. 아래 투자자 브리핑 실행은 ticker 뉴스를 위한 [Financial Datasets](/ko/docs/agent/connect/financialdatasets)와 팟캐스트 논평을 위한 [Particle](/ko/docs/agent/connect/particle)을 함께 사용합니다. 질의에서 각 partner의 고유한 데이터를 요청하고 schema에서 output을 `financialNews`와 `podcastChatter`로 나누므로, Exa Agent는 하나의 실행에서 **두** partner를 모두 call합니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and "
          "earnings news, and (2) what podcast hosts and guests have recently been saying "
          "about NVIDIA, with speaker-attributed quotes and their stance."
      ),
      data_sources=[
          {"provider": "financial_datasets"},
          {"provider": "particle"},
      ],
      output_schema={
          "type": "object",
          "required": ["ticker", "financialNews", "podcastChatter"],
          "properties": {
              "ticker": {"type": "string"},
              "financialNews": {
                  "type": "array",
                  "maxItems": 6,
                  "items": {
                      "type": "object",
                      "required": ["title", "source", "date", "theme"],
                      "properties": {
                          "title": {"type": "string"},
                          "source": {"type": "string"},
                          "date": {"type": "string"},
                          "theme": {"type": "string", "description": "earnings, guidance, analyst rating, product, or market"},
                      },
                  },
              },
              "podcastChatter": {
                  "type": "array",
                  "maxItems": 6,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "bullish, bearish, or neutral"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and " +
      "earnings news, and (2) what podcast hosts and guests have recently been saying " +
      "about NVIDIA, with speaker-attributed quotes and their stance.",
    dataSources: [
      { provider: "financial_datasets" },
      { provider: "particle" },
    ],
    outputSchema: {
      type: "object",
      required: ["ticker", "financialNews", "podcastChatter"],
      properties: {
        ticker: { type: "string" },
        financialNews: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            required: ["title", "source", "date", "theme"],
            properties: {
              title: { type: "string" },
              source: { type: "string" },
              date: { type: "string" },
              theme: { type: "string", description: "earnings, guidance, analyst rating, product, or market" },
            },
          },
        },
        podcastChatter: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            required: ["podcast", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "bullish, bearish, or neutral" },
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
      "query": "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and earnings news, and (2) what podcast hosts and guests have recently been saying about NVIDIA, with speaker-attributed quotes and their stance.",
      "dataSources": [
        { "provider": "financial_datasets" },
        { "provider": "particle" }
      ],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "financialNews", "podcastChatter"],
        "properties": {
          "ticker": { "type": "string" },
          "financialNews": {
            "type": "array",
            "maxItems": 6,
            "items": {
              "type": "object",
              "required": ["title", "source", "date", "theme"],
              "properties": {
                "title": { "type": "string" },
                "source": { "type": "string" },
                "date": { "type": "string" },
                "theme": { "type": "string", "description": "earnings, guidance, analyst rating, product, or market" }
              }
            }
          },
          "podcastChatter": {
            "type": "array",
            "maxItems": 6,
            "items": {
              "type": "object",
              "required": ["podcast", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "bullish, bearish, or neutral" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<Tip>
  각 partner의 데이터를 *질의*에 명시하세요. 즉, 각 partner에서 어떤 종류의 결과를 원하는지 구체적으로 밝히는 것입니다(여기서는 ticker 기반 금융 뉴스와 발언자가 명시된 팟캐스트 quote). 요청이 &quot;최신 뉴스&quot;처럼 두루뭉술하면 Exa Agent는 partner 대신 web search로 돌아가는 경향이 있습니다. 이렇게 구분한 요구 사항을 `outputSchema` 필드에도 그대로 반영하면 효과가 한층 강화됩니다.
</Tip>