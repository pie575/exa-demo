> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

<div id="polymarket">
  # Polymarket
</div>

> 予測市場のオッズ、価格履歴、オーダーブック、トレーダーのポジションを取得します。

[Polymarket](https://polymarket.com) は予測市場プラットフォームで、
市場価格は現実世界の結果について参加者全体が見込むインプライド確率を表します。
[Exa Connect](/ja/docs/agent/connect/overview) を使うと、Polymarket の公開市場データに
読み取り専用でアクセスできます。

[Exa Agent](/ja/docs/agent/quickstart) の実行に `polymarket` をアタッチすると、
エージェントは Exa のウェブ検索と並行して Polymarket にクエリを実行します。

<div id="use-it-for">
  ## 主な用途
</div>

* 特定のトピックに関する予測市場と、現在の市場価格が示すオッズを検索する。
* あるアウトカムのインプライド確率が時間の経過とともにどう変化したかを比較する。
* 市場の流動性、買い/売りの板の厚み、上位ポジション保有者を確認する。
* トレーダーの現在のポジションと直近のオンチェーンアクティビティを確認する。

<div id="provider-id">
  ## プロバイダー ID
</div>

`dataSources` には次の値を指定します。

```text theme={null}
polymarket
```

<div id="pricing">
  ## 料金
</div>

Polymarket の読み取り API は認証不要かつ無料のため、Polymarket のツール呼び出しに
費用はかかりません。発生するのは標準の
[Agent 実行の料金](/ja/docs/agent/quickstart#pricing)のみです。

<div id="data-available">
  ## 利用可能なデータ
</div>

| データ        | 説明                                                   |
| ---------- | ---------------------------------------------------- |
| マーケットとイベント | 現在の予測市場とイベント。インプライド確率ベースの価格、取引量、流動性を含みます。            |
| 価格履歴       | アウトカムのインプライド確率の時系列推移。                                |
| オーダーブック    | マーケットの各アウトカムにおけるリアルタイムの買い/売りの板の厚みとスプレッド。             |
| 保有者とトレーダー  | マーケットの上位ポジション保有者、およびトレーダーの現在のポジションと直近のオンチェーンアクティビティ。 |

<div id="example">
  ## 例
</div>

FRBの利下げについて市場価格が示すオッズと、過去1か月間の推移を取得します。

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
  ## 相性の良い連携先
</div>

* [Exa ウェブ検索](/ja/docs/search/quickstart): マーケットのオッズに、報道や背景情報を補足します。
* [Particle](/ja/docs/agent/connect/particle): オッズ変動の背景にあるニュース報道を取得します。
* [Financial Datasets](/ja/docs/agent/connect/financialdatasets): 市場価格が示すオッズを、株価、ファンダメンタルズ、マクロ経済データと関連付けます。

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="実行にアタッチする" icon="rocket" href="/ja/docs/agent/connect/overview" cta="クイックスタートを開く" arrow="true">
    Exa Connect のクイックスタートでは、`dataSources`、料金、パートナーの全一覧を紹介しています。
  </Card>

  <Card title="プロバイダーを組み合わせる" icon="blend" href="/ja/docs/agent/connect/combining-providers" cta="ガイドを読む" arrow="true">
    1 つの実行に最大 5 つのパートナーをアタッチし、各パートナーが確実に呼び出されるようにクエリを工夫します。
  </Card>

  <Card title="Exa Agent について学ぶ" icon="book-open" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    実行の作成、進捗のストリーミング、出力スキーマの設計、effort とコストの制御方法を確認できます。
  </Card>

  <Card title="API キーを取得する" icon="key" href="https://dashboard.exa.ai/api-keys" cta="キーを作成する" arrow="true">
    ダッシュボードでキーを作成すれば、このページの例をそのまま実行できます。新規アカウントには無料クレジットが付与されます。
  </Card>
</Columns>