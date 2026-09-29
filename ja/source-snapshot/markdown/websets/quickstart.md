> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="websets">
  # Websets
</div>

> Webから、検証済みでエンリッチされたデータセットを構築できます。

<div id="what-are-websets">
  ## Websets とは
</div>

Webset は、自然言語のクエリと目標アイテム数を指定して作成します。すべての結果が満たすべき条件 (criteria) と、承認された各アイテムに値を設定するエンリッチメントフィールドを追加してください。結果は ダッシュボード、API、または webhook を通じて非同期で配信されます。

[ダッシュボード](/ja/docs/websets/dashboard/get-started) を使えば、コードを書かずに視覚的な操作で webset を作成することもできます。

<Info>
  リスト作成やエンリッチメントのワークフローを新たに始める場合は、[Exa Agent](/ja/docs/agent/quickstart) を使用してください。
  このガイドは、既存の Websets インテグレーションを保守・拡張する場合にご利用ください。
  Websets API の利用には有料の Websets プランが必要です。Search API のクレジットと Websets のクレジットは別管理です。
</Info>

<div id="how-it-works">
  ## 仕組み
</div>

1. **検索を定義する:** 自然言語のクエリ、取得する結果の件数、および必要に応じて検証条件とエンリッチメントを指定します。
2. **検索と検証:** Websets が候補を探し、それぞれを指定した条件と照合します。条件に一致した結果だけがアイテムになります。
3. **エンリッチメントを実行する:** 検証済みの各アイテムについて、Websets が CEO の名前、資金調達額、連絡先情報など、リクエストした追加データを検索します。
4. **結果を受け取る:** ステータスをポーリングするか、Webhook で更新を受け取るか、アイテムが追加されるたびにダッシュボードで確認します。

<div id="key-capabilities">
  ## 主な機能
</div>

| 機能                 | 内容                                                     |
| ------------------ | ------------------------------------------------------ |
| **Criteria による検証** | 各結果をユーザーが定義したルールに照らしてチェックするため、条件に合致する関連性の高い結果のみを取得できます |
| **エンリッチメント**       | すべての結果から特定のデータポイント (テキスト、数値、日付、真偽値) を抽出します             |
| **モニター**           | 定期的な検索をスケジュールし、webset を自動的に最新の状態に保ちます                  |
| **Webhooks**       | アイテムが追加またはエンリッチされるたびに、HTTP コールバックをリアルタイムで受け取れます       |
| **インポート**          | 手持ちの URL を取り込み、エンリッチメントを実行できます                         |

<div id="human-quickstart">
  ## Human Quickstart
</div>

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

SDK をインストールします。

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

続いて、最初のリクエストを送信します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa
  from exa_py.websets.types import CreateWebsetParameters, CreateEnrichmentParameters
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  webset = exa.websets.create(
      params=CreateWebsetParameters(
          search={
              "query": "Top AI research labs focusing on large language models",
              "count": 5
          },
          enrichments=[
              CreateEnrichmentParameters(
                  description="LinkedIn profile of VP of Engineering or related role",
                  format="text",
              ),
          ],
      )
  )

  print(f"Webset created with ID: {webset.id}")
  print(f"View your Webset at: {webset.dashboard_url}")

  # Webset の処理が完了するまで待機
  webset = exa.websets.wait_until_idle(webset.id)

  # Webset の Item を取得
  items = exa.websets.items.list(webset_id=webset.id)
  for item in items.data:
      print(f"Item: {item.model_dump_json(indent=2)}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  const webset = await exa.websets.create({
    search: {
      query: "Top AI research labs focusing on large language models",
      count: 10
    },
    enrichments: [
      { description: "Estimate the company's founding year", format: "number" }
    ],
  });

  console.log(`Webset created with ID: ${webset.id}`);
  console.log(`View your Webset at: ${webset.dashboardUrl}`);

  const idleWebset = await exa.websets.waitUntilIdle(webset.id, {
    timeout: 60000,
    pollInterval: 2000,
    onPoll: (status) => console.log(`Current status: ${status}...`)
  });

  const items = await exa.websets.items.list(webset.id, { limit: 10 });
  for (const item of items.data) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/" \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer ${EXA_API_KEY}" \
    -d '{
      "search": {
        "query": "Top AI research labs focusing on large language models",
        "count": 5
      },
      "enrichments": [
        {"description": "Find the company'\''s founding year", "format": "number"}
      ]
    }'
  ```
</CodeGroup>

<Note>
  各製品での提供状況については、[Zero Data Retention](/ja/docs/admin/security/zero-data-retention) を参照してください。
</Note>

<div id="next">
  ## 次のステップ
</div>

* [**ダッシュボードガイド**](./dashboard/get-started) - ダッシュボードで Websets を使う手順をステップごとに解説
* [**仕組み**](./api/how-it-works) - イベント駆動型アーキテクチャの詳細解説
* [**Websets API リファレンス**](./api/websets/create-a-webset) - すべてのエンドポイントを網羅した API リファレンス