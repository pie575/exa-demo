> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Exa Connect {#exa-connect}

> Exa Agent から、Exa ウェブ検索とあわせてプレミアムなデータパートナーにもライブでアクセスできます。すべて1回の実行で完結します。

Exa Connect は、プレミアムなデータパートナーを Exa Agent のループに統合します。実行にプロバイダーを
アタッチすると、Exa Agent はウェブ検索と並行してそのパートナーのデータベースにクエリを実行し、
結果を組み合わせて、根拠に基づく構造化された1つの回答を返します。

エージェントの実行を初めて使う場合は、まず [Exa Agent ガイド](/ja/docs/agent/quickstart)をご覧ください。
その後、このページに戻ってデータパートナーをアタッチしてください。

<Tip>
  Exa Agent は、Search API と同じニュース、コード、企業、人物のソースを含む
  [データインデックス](/ja/docs/search/data/overview)全体を標準で検索します。Exa Connect は、
  これにプレミアムなパートナーデータベースを追加します。
</Tip>

<Tip>
  MCP を使いたい場合は、[Exa MCP](/ja/docs/get-started/exa-mcp#exa-agent) で Exa Agent と [Exa Connect](/ja/docs/agent/connect/overview) を利用できます。`tools=agent_run` を有効にすると、Claude、Cursor、その他の MCP クライアントから、多段階のリサーチ、リスト作成、エンリッチメント、構造化出力を実行できます。
</Tip>

## Exa Connect を選ぶ理由 {#why-exa-connect}

* **個別の連携なしでプレミアムデータを利用可能。** 契約の締結や SDK の組み込みを行わずに、
  パートナーのデータにアクセスできます。呼び出すのは Exa API 1 つだけです。
* **煩雑な処理は Exa が担当。** プロバイダーの認証、ツールの選択、
  リトライ、結果のランキングは Exa が管理します。
* **ソースは Exa Agent が選択。** `outputSchema` で
  「Similarweb の月間訪問数」や「検証済みの役員」を指定すると、Exa Agent はウェブページから推測するのではなく、
  該当するパートナーツールを呼び出します。
* **インデックスとパートナーのデータを 1 回の実行で。** Connect は Exa インデックスを基盤としています。
  Exa Agent は各ソースを強みが最も活きる場面で使い分け、結果の出典を示します。

## 仕組み {#how-it-works}

1. [`POST /agent/runs`](/ja/docs/reference/agent-api/create-a-run) の `dataSources` 配列で、1 つ以上のプロバイダーを**アタッチ**します。
2. Exa Agent は、クエリと
   `outputSchema` に基づき、ステップごとに**適切なツールを選択**します。使用されるのは、パートナーデータまたは Exa のウェブ検索です。
3. パートナーの結果は**ウェブリサーチと統合**され、
   ソース付きの構造化出力として返されます。

## 料金 {#pricing}

<Note>
  Exa Connect の料金は、標準の [Agent run の料金](/ja/docs/agent/quickstart#pricing)に加算されます。
  通常の Agent のコンピュート料金と検索料金に加えて、Exa Connect のツール呼び出しごとにプロバイダーの呼び出し料金が発生します。
</Note>

| プロバイダー                                               | 価格                                            |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/ja/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/ja/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/ja/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/ja/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / call`                               |
| Particle                                             | `$0.015 / call`                               |
| Financial Datasets                                   | `$0.01 / call`                                |
| Jinko                                                | `$0.005 / call`                               |

Fiber.ai は呼び出しの内容によって自社の料金が変わるため、呼び出し単位ではなくクレジット単位で課金されます。
検索は 2 クレジットに加えて返された結果 1 件につき 1 クレジット、企業または人物の
ルックアップは返された候補の数に応じて課金されます (そのため、曖昧な名前を絞り込むために企業ルックアップの
`numResults` を増やすとコストが上がります) 。連絡先の
取得は、勤務先メールアドレス、個人メールアドレス、電話番号のどれを要求するかによって 2〜5 クレジットです。
各呼び出しについて Fiber が報告したクレジット分が請求されます。一致しなかった呼び出しは
無料です。詳しくは [Fiber.ai の料金](/ja/docs/agent/connect/fiber#pricing)をご覧ください。

Similarweb はデータクレジット (おおよそ指標 × 行 × 月ごとに 1 クレジット) で課金されるため、
呼び出しの価格は `numResults`/`months` によって変わり、1 回の呼び出しあたり 1〜15 クレジットです。
各呼び出しについて Similarweb が報告したクレジット分が請求されます。データが返されなかった呼び出しは
無料です。詳しくは [Similarweb の料金](/ja/docs/agent/connect/similarweb#pricing)をご覧ください。

Baselayer はオーダー単位で課金され、料金は操作によって異なります。KYB
企業検索は $1.00、UCC 担保権検索は検索対象の州ごとに $2.00、
訴訟/破産記録検索はカテゴリごとに $1.00、ウォッチリストのスクリーニングは
要求したリストごとに $0.10〜$0.25、業種分類とウェブサイト
分析はそれぞれ $0.35、ウェブプレゼンスは選択した分析の合計
(各 $0.15〜$0.35) 、海外企業検索は $4.00 です。実行済みの企業検索に対する
後続の読み取り (企業ルックアップ、役員、登記情報、
役員の逆引き検索) は無料です。詳しくは [Baselayer の料金](/ja/docs/agent/connect/baselayer#pricing)をご覧ください。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
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
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## データパートナー {#data-partners}

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/ja/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM &amp; 採用。** リードの発掘や連絡先の調査に活用できる、企業と人物のB2Bデータベースです。
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/ja/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **Web 分析。** あらゆるドメインについて、トラフィックの推定値、グローバルランキング、競合
      サイトの調査を提供します。
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/ja/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **コンプライアンス &amp; KYB。** 米国企業の役員、登記情報、リスク
      シグナルを確認できます。
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/ja/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **予測市場。** Polymarket の予測市場のオッズ、価格履歴、トレーダーの
      ポジションを提供します。
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/ja/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **コマース：** 価格、ブランド、販売事業者へのリンクを含む商品カタログ検索。
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/ja/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **メディアインテリジェンス。** 話者情報とタイムスタンプ付きのポッドキャスト文字起こしを
      検索できます。
    </Card>

    <Card title="金融データセット" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/financialdatasets.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=24052e4641fa4060e1ccf64482b10e00" href="/ja/docs/agent/connect/financialdatasets" width="401" height="400" data-path="images/agent/connect/financialdatasets.svg">
      **金融。** 米国の 27,000 以上のティッカーを対象に、株価、ファンダメンタルズ、決算、SEC 提出書類、株主構成、
      銘柄スクリーニングを提供します。
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/jinko.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=958d2ec147d452f12c0904f41ffb2311" href="/ja/docs/agent/connect/jinko" width="400" height="395" data-path="images/agent/connect/jinko.svg">
      **旅行。** リアルタイムの料金情報付きでフライトやホテルを検索できます。
    </Card>
  </Columns>
</div>

上記以外のソースが必要な場合は、[追加プロバイダー](/ja/docs/agent/connect/additional-partners)をご覧ください。追加プロバイダーは、当社チームにお問い合わせいただければご利用いただけます。

## 使用方法 {#usage}

### 複数のプロバイダーを組み合わせる {#combining-providers}

タスクに必要な数だけパートナーをアタッチできます。Exa Agent は各パートナーをその強みが最も活きる場面で呼び出し、得られた結果をウェブ検索の結果と組み合わせて、1 つの構造化された回答にまとめます。

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

すべてのパートナーが確実に呼び出されるようにクエリと `outputSchema` を設計する方法など、詳しい手順については
[プロバイダーの組み合わせ](/ja/docs/agent/connect/combining-providers)を参照してください。