> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Jinko {#jinko}

> リアルタイム料金を確認できるフライト・ホテル検索。

[Jinko](https://gojinko.com) は、リアルタイム料金でフライトとホテルを検索できる旅行検索プラットフォームです。路線と日付を指定して最新のフライトオファーを検索したり、目的地や特定の施設のホテル客室と料金を比較したり、
出発空港から行ける目的地を探したりできます。

[Exa Connect](/ja/docs/agent/connect/overview) を通じて `jinko` を [Exa Agent](/ja/docs/agent/quickstart) の実行にアタッチすると、
エージェントは Exa のウェブ検索と併せて
Jinko にもクエリを実行します。

## 主な用途 {#use-it-for}

* 路線と日付を指定して、運賃、手荷物、変更規定を含む最新のフライトオファーを検索する。
* 目的地のホテルを最新の客室料金とあわせて検索する、または特定のホテルの料金を再検索する。
* 日付の範囲、座席クラス、予算を横断的に比較して、目的地や柔軟な日程を探す。

## プロバイダー ID {#provider-id}

`dataSources` には次の値を指定します：

```text theme={null}
jinko
```

## 例 {#example}

ニューヨークから3月に往復$400未満で行けるビーチリゾートを探します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find beach destinations reachable from New York for under $400 round-trip in March.",
      data_sources=[{"provider": "jinko"}],
      output_schema={
          "type": "object",
          "required": ["destinations"],
          "properties": {
              "destinations": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["city", "iataCode", "lowestFare"],
                      "properties": {
                          "city": {"type": "string"},
                          "iataCode": {"type": "string"},
                          "lowestFare": {"type": "number", "description": "round-trip fare in USD"},
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
    query: "Find beach destinations reachable from New York for under $400 round-trip in March.",
    dataSources: [{ provider: "jinko" }],
    outputSchema: {
      type: "object",
      required: ["destinations"],
      properties: {
        destinations: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["city", "iataCode", "lowestFare"],
            properties: {
              city: { type: "string" },
              iataCode: { type: "string" },
              lowestFare: { type: "number", description: "round-trip fare in USD" },
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
      "query": "Find beach destinations reachable from New York for under $400 round-trip in March.",
      "dataSources": [{ "provider": "jinko" }],
      "outputSchema": {
        "type": "object",
        "required": ["destinations"],
        "properties": {
          "destinations": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["city", "iataCode", "lowestFare"],
              "properties": {
                "city": { "type": "string" },
                "iataCode": { "type": "string" },
                "lowestFare": { "type": "number", "description": "round-trip fare in USD" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## 組み合わせて使うと効果的なツール {#pairs-well-with}

* [Similarweb](/ja/docs/agent/connect/similarweb): 旅行先に関連する旅行サイトや予約プラットフォームを調査します。
* [Particle](/ja/docs/agent/connect/particle): 特定の場所に関する最新の報道や旅行関連のコメントを取得します。

## 次のステップ {#next-steps}

<Columns cols={2}>
  <Card title="実行にアタッチする" icon="rocket" href="/ja/docs/agent/connect/overview" cta="クイックスタートを開く" arrow="true">
    Exa Connect のクイックスタートでは、`dataSources`、料金、パートナーの全カタログについて説明しています。
  </Card>

  <Card title="プロバイダーを組み合わせる" icon="blend" href="/ja/docs/agent/connect/combining-providers" cta="ガイドを読む" arrow="true">
    1 つの実行に最大 5 つのパートナーをアタッチし、各パートナーが確実に呼び出されるようにクエリを設計します。
  </Card>

  <Card title="Exa Agent について学ぶ" icon="book-open" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    実行の作成、進捗のストリーミング、出力スキーマの設計、effort とコストの制御方法を解説します。
  </Card>

  <Card title="API キーを取得する" icon="key" href="https://dashboard.exa.ai/api-keys" cta="キーを作成する" arrow="true">
    ダッシュボードでキーを作成すれば、このページの例をそのまま実行できます。新規アカウントには無料クレジットが付与されます。
  </Card>
</Columns>