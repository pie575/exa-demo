> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 各ページを詳しく見る前に、このファイルで利用可能なすべてのページを確認してください。

<div id="affiliatecom">
  # Affiliate.com
</div>

> 複数のマーチャントやアフィリエイトネットワークにまたがる商品カタログを検索します。

[Affiliate.com](https://affiliate.com) は、複数のマーチャントやアフィリエイトネットワークの商品カタログを
単一の検索可能なインデックスに集約し、リアルタイムの
価格情報、ブランド、マーチャントへの直接リンクを提供します。

[Exa Connect](/ja/docs/agent/connect/overview) を介して [Exa Agent](/ja/docs/agent/quickstart) の実行に `affiliate` をアタッチすると、
エージェントは Exa のウェブ検索とあわせて
Affiliate.com にもクエリを実行します。

<div id="use-it-for">
  ## 主な用途
</div>

* 複数のマーチャントを横断した商品の発見と価格比較。
* ショッピングアシスタントや購入ガイドコンテンツの基盤として活用。
* リサーチ結果とあわせたアフィリエイトリンクの提示。

<div id="provider-id">
  ## プロバイダーID
</div>

`dataSources` には次の値を指定してください。

```text theme={null}
affiliate
```

<div id="example">
  ## 例
</div>

$300 未満のワイヤレスノイズキャンセリングヘッドホンを検索し、価格を比較します。

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
  ## 組み合わせて使えるサービス
</div>

* [Similarweb](/ja/docs/agent/connect/similarweb): マーチャントを推奨する前に、そのリーチを把握します。
* [Fiber.ai](/ja/docs/agent/connect/fiber): マーチャントやブランドを運営する企業を調査します。

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="実行にアタッチする" icon="rocket" href="/ja/docs/agent/connect/overview" cta="クイックスタートを開く" arrow="true">
    Exa Connect のクイックスタートでは、`dataSources`、料金、パートナーの全カタログを紹介しています。
  </Card>

  <Card title="プロバイダーを組み合わせる" icon="blend" href="/ja/docs/agent/connect/combining-providers" cta="ガイドを読む" arrow="true">
    1 つの実行に最大 5 つのパートナーをアタッチし、各パートナーが確実に呼び出されるようクエリを工夫します。
  </Card>

  <Card title="Exa Agent を学ぶ" icon="book-open" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    実行の作成、進捗のストリーミング、出力スキーマの設計、エフォートとコストの制御方法を解説します。
  </Card>

  <Card title="API キーを取得する" icon="key" href="https://dashboard.exa.ai/api-keys" cta="キーを作成する" arrow="true">
    ダッシュボードでキーを作成すれば、このページの例をそのまま実行できます。新規アカウントには無料クレジットが付与されます。
  </Card>
</Columns>