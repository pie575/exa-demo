> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 個別のページを読み進める前に、このファイルで利用可能なすべてのページを確認してください。

<div id="combining-providers">
  # 複数のプロバイダーの組み合わせ
</div>

> 1回の Exa Agent の実行で、複数のデータパートナーを組み合わせて使用します。

パートナーを `dataSources` にアタッチすると、Exa Agent はそのパートナーをツールとして利用できるようになります。ただし、エージェントがそのパートナーを必ず呼び出すわけでは**ありません**。パートナーが呼び出されるかどうかは、`query` と `outputSchema` の内容によって決まります。各パートナーから取得したい結果の種類を明示すれば、Exa Agent はウェブページから推測するのではなく、該当するツールを使用します。1回の実行につき最大5つのパートナーをアタッチでき、Exa Agent は各ステップで呼び出すパートナーを選択します。また、これらに加えて Exa のウェブ検索も利用できます。1回の実行で6つ以上のパートナーを使用したい場合は、[お問い合わせ](mailto:sales@exa.ai)いただければ上限を引き上げます。

<div id="two-partners-in-one-run">
  ## 1回の実行で2つのパートナーを使う
</div>

複数のパートナーをまとめて指定すると、Exa Agent は各パートナーをそれぞれ最も得意な分野で活用します。ここでは2つを例にしていますが、`dataSources` には最大5つのパートナーをアタッチできます。その場合も原則は同じで、各パートナーのデータを明示的に要求してください。この投資家向けブリーフィングの実行では、ティッカー関連のニュースに [Financial Datasets](/ja/docs/agent/connect/financialdatasets) を、ポッドキャストでのコメントに [Particle](/ja/docs/agent/connect/particle) を組み合わせています。クエリで各パートナー固有のデータを要求し、スキーマで出力を `financialNews` と `podcastChatter` に分けているため、Exa Agent は同じ実行内で**両方**のパートナーを呼び出します。

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
  *クエリ*では、各パートナーから取得したいデータを明示してください。それぞれのパートナーにどのような結果を求めるか (この例では、ティッカー別の金融ニュースと、発言者が明記されたポッドキャストの引用) を具体的に指定します。「最新ニュース」のような汎用的なリクエストでは、Exa Agent はパートナーではなくウェブ検索にフォールバックしがちです。こうした個別の要求を `outputSchema` のフィールドにも反映させると、より確実にパートナーが使われるようになります。
</Tip>