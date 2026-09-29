> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

<div id="baselayer">
  # Baselayer
</div>

> 米国企業を検証し、KYB データ (役員、登記情報、リスクスコア) を取得します。

[Baselayer](https://baselayer.com) は、信頼性の高い登記データやリスクデータと照合して
米国の事業体を検証する Know Your Business (KYB) プラットフォームです。
企業名と住所から事業体を特定し、役員、州の登記情報、事業体の構成、
検証ステータスを含む完全なプロファイルを返します。

[Exa Connect](/ja/docs/agent/connect/overview) を介して `baselayer` を
[Exa Agent](/ja/docs/agent/quickstart) の実行にアタッチすると、エージェントは
Exa のウェブ検索と並行して Baselayer にクエリを実行します。

<div id="use-it-for">
  ## 主な用途
</div>

* KYB オンボーディング、およびベンダーや顧客の検証。
* 役員、登記情報、事業体の構成に関するデューデリジェンス。
* 企業のリスク評価とウォッチリスト該当有無のスクリーニング。

<div id="provider-id">
  ## プロバイダー ID
</div>

`dataSources` には次の値を指定します：

```text theme={null}
baselayer
```

<div id="pricing">
  ## 料金
</div>

Baselayer は注文ごとに課金し、料金は操作とそのパラメーターによって異なります。

| 操作                     | 料金                                          |
| ---------------------- | ------------------------------------------- |
| 企業検索                   | `$1.00 / search`                            |
| 企業照会 / 役員 / 登記 / 役員逆引き | 無料 (過去の検索結果の読み取り)                           |
| 先取特権検索                 | `$2.00 / state searched`                    |
| 訴訟検索                   | `$1.00 / category (litigation, bankruptcy)` |
| ウォッチリストスクリーニング         | `$0.10 – $0.25 / list requested`            |
| 業種分類                   | `$0.35 / call`                              |
| ウェブサイト分析               | `$0.35 / call`                              |
| ウェブプレゼンス               | `$0.15 – $0.35 / selected analysis`         |
| 海外企業検索                 | `$4.00 / search`                            |

パラメーターの選択によって料金が変わります。たとえば、2 つの州を対象とする先取特権検索は
$4.00、サポート対象の 6 つのリストすべてを対象とするウォッチリストスクリーニングは $1.35 になります。また、
ウェブプレゼンスの呼び出し料金は、選択した分析の合計額です (何も選択しない場合は、Baselayer の
デフォルトセットである NAICS 予測とウェブサイト分析の合計額) 。

<div id="example">
  ## 例
</div>

企業の実在性を確認し、役員情報と登記情報を取得します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
      data_sources=[{"provider": "baselayer"}],
      output_schema={
          "type": "object",
          "required": ["business"],
          "properties": {
              "business": {
                  "type": "object",
                  "required": ["name", "verified", "incorporationState", "officers"],
                  "properties": {
                      "name": {"type": "string"},
                      "verified": {"type": "boolean"},
                      "incorporationState": {"type": "string"},
                      "officers": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "required": ["name", "title"],
                              "properties": {
                                  "name": {"type": "string"},
                                  "title": {"type": "string"},
                              },
                          },
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
    query: "Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
    dataSources: [{ provider: "baselayer" }],
    outputSchema: {
      type: "object",
      required: ["business"],
      properties: {
        business: {
          type: "object",
          required: ["name", "verified", "incorporationState", "officers"],
          properties: {
            name: { type: "string" },
            verified: { type: "boolean" },
            incorporationState: { type: "string" },
            officers: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "title"],
                properties: {
                  name: { type: "string" },
                  title: { type: "string" },
                },
              },
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
      "query": "Verify the business Stripe, Inc. in San Francisco, CA and return its officers and registration status.",
      "dataSources": [{ "provider": "baselayer" }],
      "outputSchema": {
        "type": "object",
        "required": ["business"],
        "properties": {
          "business": {
            "type": "object",
            "required": ["name", "verified", "incorporationState", "officers"],
            "properties": {
              "name": { "type": "string" },
              "verified": { "type": "boolean" },
              "incorporationState": { "type": "string" },
              "officers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["name", "title"],
                  "properties": {
                    "name": { "type": "string" },
                    "title": { "type": "string" }
                  }
                }
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

* [Fiber.ai](/ja/docs/agent/connect/fiber): 検証済みの企業に、ファーモグラフィック情報、従業員数、連絡先を付加します。
* [Financial Datasets](/ja/docs/agent/connect/financialdatasets): 上場企業に関する最新のニュース報道を追加します。
* [Similarweb](/ja/docs/agent/connect/similarweb): 検証済みの企業のウェブトラフィックを競合他社とベンチマーク比較します。

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="run にアタッチする" icon="rocket" href="/ja/docs/agent/connect/overview" cta="クイックスタートを開く" arrow="true">
    Exa Connect のクイックスタートでは、`dataSources`、料金、パートナーの全カタログについて説明しています。
  </Card>

  <Card title="プロバイダーを組み合わせる" icon="blend" href="/ja/docs/agent/connect/combining-providers" cta="ガイドを読む" arrow="true">
    1 つの run に最大 5 つのパートナーをアタッチし、各パートナーが確実に呼び出されるようにクエリを設計する方法を説明します。
  </Card>

  <Card title="Exa Agent について学ぶ" icon="book-open" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    run の作成、進捗のストリーミング、出力スキーマの設計、effort とコストの制御について説明します。
  </Card>

  <Card title="API キーを取得する" icon="key" href="https://dashboard.exa.ai/api-keys" cta="キーを作成する" arrow="true">
    ダッシュボードでキーを作成すれば、このページの例をそのまま実行できます。新規アカウントには無料クレジットが付与されます。
  </Card>
</Columns>