> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

<div id="fiberai">
  # Fiber.ai
</div>

> Fiber.ai の B2B データベースで企業、人物、LinkedIn プロフィールを検索します。

[Fiber.ai](https://fiber.ai) は、4,000 万社以上の企業、8 億 5,000 万人以上の人物、3,000 万件以上の求人について最新データを提供する B2B データプラットフォームです。企業、人物、求人のライブデータを検索できるほか、不完全なレコードに勤務先メールアドレス、個人用メールアドレス、電話番号を追加して補完できます。

[Exa Connect](/ja/docs/agent/connect/overview) を通じて `fiber` を [Exa Agent](/ja/docs/agent/quickstart) のランにアタッチすると、エージェントは Exa のウェブ検索と併せて Fiber.ai にもクエリを実行します。

<div id="use-it-for">
  ## 主な用途
</div>

* 勤務先メールアドレスまたは個人用のメールアドレスから人物を逆引きしたり、
  不完全な企業・人物レコードを補完したりして、CRMのデータを整理する。
* LinkedInのシグナル (転職、昇進、新たな就職、従業員数の変化、資金調達など) を
  リアルタイムで追跡する。
* LinkedIn、X、Instagram、TikTok、Reddit、YouTubeを横断して関連する投稿を探し、
  コメントやリアクションを取得したうえで、投稿者の
  連絡先情報を補完する。
* 4,000万社以上の企業と8億5,000万人以上の人物を横断検索し、見込み顧客の情報を
  勤務先メールアドレス、個人用メールアドレス、電話番号で補完する。

<div id="provider-id">
  ## プロバイダー ID
</div>

`dataSources` には次の値を指定します。

```text theme={null}
fiber
```

<div id="pricing">
  ## 料金
</div>

Fiber.ai は `$0.02 / credit` のクレジット制で課金され、各呼び出しには Fiber が報告した
クレジット数が請求されます。

| 操作                 | クレジット                  |
| ------------------ | ---------------------- |
| 検索                 | 2 + 返された結果 1 件につき 1    |
| 企業検索               | 返された候補 1 件につき ~2       |
| 人物検索 / メールアドレスの逆引き | 2                      |
| 連絡先の取得             | 2(勤務先メールアドレス)~ 5(電話番号) |

一致する結果がなかった呼び出し(または Fiber が料金を払い戻した呼び出し)は無料です。パラメーターの
設定によって料金は変わります。企業検索では `numResults` によって課金対象の候補数が決まり、検索では結果の件数がコストの大部分を左右します。

<div id="example">
  ## 例
</div>

ニューヨークに拠点を置く従業員数50～200名のシリーズAフィンテック企業を対象に、B2B営業の見込み客リストを作成します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
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
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
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
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 相性の良い連携先
</div>

* [Similarweb](/ja/docs/agent/connect/similarweb): 見込み顧客のウェブ上でのプレゼンスや競合を把握できます。
* [Baselayer](/ja/docs/agent/connect/baselayer): 候補として絞り込んだ米国企業の役員や登記情報を確認できます。
* [Particle](/ja/docs/agent/connect/particle): 企業や経営幹部についてポッドキャストで何が語られているかを調べられます。

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="ランにアタッチする" icon="rocket" href="/ja/docs/agent/connect/overview" cta="クイックスタートを開く" arrow="true">
    Exa Connect のクイックスタートでは、`dataSources`、料金体系、パートナーの全カタログについて説明しています。
  </Card>

  <Card title="プロバイダーを組み合わせる" icon="blend" href="/ja/docs/agent/connect/combining-providers" cta="ガイドを読む" arrow="true">
    1 つのランに最大 5 つのパートナーをアタッチし、各パートナーが確実に呼び出されるようクエリを設計する方法を説明します。
  </Card>

  <Card title="Exa Agent について学ぶ" icon="book-open" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    ランの作成、進捗のストリーミング、出力スキーマの設計、effort とコストの制御について説明します。
  </Card>

  <Card title="API キーを取得する" icon="key" href="https://dashboard.exa.ai/api-keys" cta="キーを作成する" arrow="true">
    ダッシュボードでキーを作成すれば、このページのサンプルをそのまま実行できます。新規アカウントには無料クレジットが付与されます。
  </Card>
</Columns>