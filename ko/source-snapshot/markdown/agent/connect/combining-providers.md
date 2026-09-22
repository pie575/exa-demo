> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="combining-providers">
  # Combining providers
</div>

> 하나의 Exa Agent 실행에서 여러 data partners를 함께 사용하세요.

`dataSources`에 파트너를 attach하면 해당 파트너가 Exa Agent에 도구로 제공됩니다. 다만 agent가 반드시 그 파트너를 call하도록 강제하는 것은 **아닙니다**. 파트너가 실제로 호출될지는 `query`와 `outputSchema`에 따라 달라집니다. 각 파트너에게서 어떤 종류의 결과를 원하는지 명시하면, Exa Agent는 웹 페이지에서 추측하는 대신 해당 도구를 사용합니다. 실행당 최대 다섯 개의 파트너를 attach할 수 있으며, Exa Agent가 단계마다 어떤 파트너를 call할지 선택하고, Exa web search도 함께 사용할 수 있습니다. 한 번의 실행에 다섯 개 이상이 필요하신가요? limit 상향은 [문의해 주세요](mailto:sales@exa.ai).

<div id="two-partners-in-one-run">
  ## 한 번의 실행에서 두 파트너 사용하기
</div>

여러 파트너를 함께 나열하면 Exa Agent가 각 파트너의 강점이 발휘되는 부분을 골라 활용합니다. 여기서 두 개는 예시일 뿐이며, `dataSources`에 최대 다섯 개의 파트너를 attach할 수 있고 동일한 원칙이 적용됩니다. 각 파트너의 데이터를 명시적으로 요청하세요. 이 투자자 브리핑 실행에서는 ticker 뉴스를 담당하는 [Financial Datasets](/ko/docs/agent/connect/financialdatasets)와 팟캐스트 논평을 담당하는 [Particle](/ko/docs/agent/connect/particle)을 함께 사용합니다. 질의에서 각 파트너의 고유한 데이터를 요청하고 schema가 output을 `financialNews`와 `podcastChatter`로 나누기 때문에, Exa Agent는 같은 실행에서 **두** 파트너를 모두 call합니다.

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
  각 파트너의 데이터를 *질의*에 명시적으로 밝히세요. 파트너별로 어떤 종류의 결과를 원하는지 구체적으로 지정하면 됩니다(여기서는 ticker 금융 뉴스와 발언자가 명시된 팟캐스트 quote). 요청이 &quot;최신 뉴스&quot;처럼 두루뭉술하면 Exa Agent는 파트너 대신 web search로 되돌아가는 경향이 있습니다. 이렇게 구분한 요구 사항을 `outputSchema` field에도 그대로 반영하면 효과가 더 확실해집니다.
</Tip>