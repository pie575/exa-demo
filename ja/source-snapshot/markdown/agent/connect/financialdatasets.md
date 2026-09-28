> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="financial-datasets">
  # Financial Datasets
</div>

> 27,000以上の米国ティッカーを対象とした構造化金融・市場データ：株価、ファンダメンタルズ、決算、SEC提出書類、保有状況、株式スクリーニング。

[Financial Datasets](https://financialdatasets.ai) は、AIエージェントがそのまま利用できる
企業データと市場データを提供します。
[Exa Connect](/ja/docs/agent/connect/overview) を利用すると、エージェントは
リアルタイムおよび過去の株価、企業情報、財務諸表、
バリュエーション指標、決算、インサイダーおよび機関投資家の保有状況、SEC提出書類
とそのセクション、企業ニュースを取得できるほか、ファンダメンタルズの
条件で米国市場をスクリーニングすることもできます。

[Exa Agent](/ja/docs/agent/quickstart) の実行に `financial_datasets` をアタッチすると、
エージェントは Exa のウェブ検索と並行して Financial Datasets にクエリを実行します。

<div id="use-it-for">
  ## 主な用途
</div>

* 構造化された企業リサーチのスナップショットを作成する。
* 財務実績、バリュエーション、過去の推移を分析する。
* SEC 提出書類を読み込み、リスク要因や MD&amp;A などのセクションを抽出する。
* インサイダー取引や機関投資家の保有状況を調査する。
* ファンダメンタルズの条件で米国市場をスクリーニングする。
* 企業ニュースや関連する動向をモニタリングする。

<div id="data-available">
  ## 利用可能なデータ
</div>

以下の各データセットは `financial_datasets`
プロバイダーで利用できます。エージェントがタスクに適したものを選択します。

| データセット          | 返される内容                                                           |
| --------------- | ---------------------------------------------------------------- |
| 実質的所有者          | Schedule 13D/13G に基づく5%以上の実質的所有者 (アクティビスト保有およびパッシブ保有を含む) 。       |
| 企業情報            | 名称、セクター、業種、取引所、所在地、SEC CIK、SIC 分類。                               |
| 企業ニュース          | ティッカーに関する最新のニュース記事。                                              |
| 決算              | 四半期の売上高と EPS、前年同期比の増減、予想に対する上振れ/下振れ。                             |
| 財務指標            | 時価総額、EV、P/E、P/B、P/S、EV/EBITDA、PEG、利益率、ROE/ROA/ROIC、成長率、EPS。      |
| 財務諸表            | SEC 提出書類に基づく損益計算書、貸借対照表、キャッシュフロー計算書。                             |
| 過去の株価           | 指定期間における日次/週次/月次/年次の OHLCV データ。                                  |
| インデックスファンドの保有銘柄 | ETF/インデックスファンドの構成銘柄とそのウェイト、または特定の銘柄を保有するファンド。                    |
| インサイダー保有        | SEC Form 3 および Form 5 に基づくインサイダーの保有状況 (役員、取締役、10%以上の株主が保有する株式) 。 |
| インサイダー取引        | SEC Form 4 に基づくインサイダー取引 (氏名、役職、取引種別、株数、金額) 。                     |
| 機関投資家保有         | 13F に基づく機関投資家の保有者、株数、報告額。                                        |
| 政策金利            | 中央銀行の現在および過去の政策金利 (Fed、ECB、BOJ など) 。                             |
| SEC 提出書類の項目     | 10-K/10-Q/8-K の特定項目から抽出したテキスト (リスク要因、MD&amp;A など) 。              |
| SEC 提出書類        | 提出書類のメタデータと EDGAR への直接リンク (フォーム種別による絞り込みも可能) 。                   |
| セグメント別財務情報      | 製品別、事業セグメント別、地域別に分類した売上高、営業利益、その他の項目。                            |
| 株価スナップショット      | 現在のリアルタイム株価、当日の変動、株価の更新時刻。                                       |
| 株式スクリーナー        | ファンダメンタル指標のフィルター条件に合致する企業。                                       |

<div id="provider-id">
  ## プロバイダー ID
</div>

`dataSources` には次の値を指定します:

```text theme={null}
financial_datasets
```

<div id="example">
  ## 例
</div>

NVIDIA について、構造化された企業リサーチスナップショットを作成します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
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
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
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
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 組み合わせて使えるプロバイダー
</div>

* [Particle](/ja/docs/agent/connect/particle): 公開済みの報道・アナリストレポートとポッドキャストでの論評を比較します。
* [Baselayer](/ja/docs/agent/connect/baselayer): ティッカーに対応する実際の企業を検証します。
* [Fiber.ai](/ja/docs/agent/connect/fiber): 上場企業の情報に、未公開市場の同業他社や経営陣の連絡先を付加します。

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="runにアタッチする" icon="rocket" href="/ja/docs/agent/connect/overview" cta="クイックスタートを開く" arrow="true">
    Exa Connectのクイックスタートでは、`dataSources`、料金、パートナーの全一覧について説明しています。
  </Card>

  <Card title="プロバイダーを組み合わせる" icon="blend" href="/ja/docs/agent/connect/combining-providers" cta="ガイドを読む" arrow="true">
    1つのrunに最大5つのパートナーをアタッチし、それぞれが確実に呼び出されるようにクエリを設計します。
  </Card>

  <Card title="Exa Agentについて学ぶ" icon="book-open" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    runの作成、進捗のストリーミング、出力スキーマの設計、effortとコストの制御について解説します。
  </Card>

  <Card title="APIキーを取得する" icon="key" href="https://dashboard.exa.ai/api-keys" cta="キーを作成" arrow="true">
    ダッシュボードでキーを作成すれば、このページの例をそのまま実行できます。新規アカウントには無料クレジットが付与されます。
  </Card>
</Columns>