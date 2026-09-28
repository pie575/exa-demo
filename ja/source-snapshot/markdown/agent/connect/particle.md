> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="particle">
  # Particle
</div>

> 話者情報とタイムスタンプ付きで、ポッドキャストのトランスクリプトを検索できます。

[Particle](https://particle.news) の Podcast Intelligence は、100,000 以上の番組をインデックス化しています。
各番組は配信から数分以内に全文の文字起こし、話者分離、話者識別、ラベル付けが行われ、メタデータで補完されます。
これにより、音声での会話を検索できるようになります。各結果は、
話者情報とタイムスタンプが付いたトランスクリプトの一区間です。

[Exa Connect](/ja/docs/agent/connect/overview) を使って `particle` を [Exa Agent](/ja/docs/agent/quickstart) の実行にアタッチすると、
エージェントは Exa のウェブ検索と並行して
Particle にもクエリを実行します。

<div id="use-it-for">
  ## 主な用途
</div>

* 専門家のコメントや引用に適した発言を見つける。
* メディアおよびブランドのモニタリング。
* ナラティブやセンチメントの調査。
* ポッドキャストの発見と最新情報の把握。

<div id="provider-id">
  ## プロバイダー ID
</div>

`dataSources` にはこの値を使用してください：

```text theme={null}
particle
```

<div id="example">
  ## 例
</div>

AI規制についてポッドキャストのホストがどのように語っているかを調べます。

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
  ## 相性の良い組み合わせ
</div>

* [Financial Datasets](/ja/docs/agent/connect/financialdatasets): ポッドキャストでの話題を、公開済みのニュースと照らし合わせて検証します。
* [Fiber.ai](/ja/docs/agent/connect/fiber): 話題に上がっている人物に、企業や連絡先のコンテキストを付加します。

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="実行にアタッチする" icon="rocket" href="/ja/docs/agent/connect/overview" cta="クイックスタートを開く" arrow="true">
    Exa Connect のクイックスタートでは、`dataSources`、料金、パートナーの全カタログを紹介しています。
  </Card>

  <Card title="プロバイダーを組み合わせる" icon="blend" href="/ja/docs/agent/connect/combining-providers" cta="ガイドを読む" arrow="true">
    1 回の実行に最大 5 つのパートナーをアタッチし、各パートナーが確実に呼び出されるようクエリを設計します。
  </Card>

  <Card title="Exa Agent について学ぶ" icon="book-open" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    実行の作成、進捗のストリーミング、出力スキーマの設計、effort とコストの制御方法を解説します。
  </Card>

  <Card title="API キーを取得する" icon="key" href="https://dashboard.exa.ai/api-keys" cta="キーを作成する" arrow="true">
    ダッシュボードでキーを作成すれば、このページの例をそのまま実行できます。新規アカウントには無料クレジットが付与されます。
  </Card>
</Columns>