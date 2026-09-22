> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，请通过该文件了解所有可用页面。

# Combining providers {#combining-providers}

> 在单次 Exa Agent 运行中同时使用多个数据合作伙伴。

将合作伙伴附加到 `dataSources` 后，它便会作为工具提供给 Exa Agent，但这**并不会**强制 agent 去调用它。合作伙伴是否会被触发，取决于你的 `query` 和 `outputSchema`：明确说明你希望从每个合作伙伴获得哪类结果，Exa Agent 就会直接选用对应的工具，而不必从网页中猜测。每次运行最多可接入五个合作伙伴；Exa Agent 会为每一步选择要调用的工具，同时还可使用 Exa 网页搜索。单次运行需要超过五个？请[联系我们](mailto:sales@exa.ai)以提高该上限。

## 在一次运行中使用两个合作伙伴 {#two-partners-in-one-run}

同时列出多个合作伙伴，Exa Agent 会各取所长。这里的两个只是举例，你最多可以将五个合作伙伴附加到 `dataSources`，原理相同：明确要求获取每个合作伙伴的数据。下面这个投资简报运行结合了 [Financial Datasets](/zh/docs/agent/connect/financialdatasets) (获取股票代码相关新闻) 与 [Particle](/zh/docs/agent/connect/particle) (获取播客评论) 。query 明确要求获取每个合作伙伴的特色数据，schema 将输出拆分为 `financialNews` 和 `podcastChatter`，因此 Exa Agent 会在同一次运行中同时调用**两个**合作伙伴。

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
  在 *query* 中写明你需要每个合作伙伴提供什么数据——分别指明希望从各自拿到哪类 result (此处为：按股票代码的财经新闻 vs. 标注发言人的播客引述) 。如果请求写得过于笼统 (比如&quot;最新新闻&quot;) ，Exa Agent 往往会退而使用网页搜索，而不去调用合作伙伴。在 `outputSchema` 的 fields 中同样体现这些不同的诉求，能进一步强化这一效果。
</Tip>