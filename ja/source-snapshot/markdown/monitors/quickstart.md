> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Monitors API {#monitors-api}

> 定期的に検索を実行し、新たに見つかった結果をWebhookで受け取ります。

Monitorsは、スケジュールに沿ってExaの検索を定期実行し、結果をWebhookエンドポイントに配信します。

Monitorsを使えば、ニュース、競合他社の発表、資金調達ラウンド、規制の変更、研究
論文など、時間とともに変化するあらゆるトピックを追跡できます。

## Monitors の仕組み {#how-monitors-work}

実行のたびに、Exa は設定済みの検索を実行して時間で絞り込み、モニターがすでに返した結果や検出事項を除外したうえで、新しい出力を Webhook に送信します。

各モニターは独自の実行履歴を保持しています。そのため、変動する日付範囲を自分でクエリに追加するのではなく、継続的に追跡したいシグナルを軸にクエリを記述してください。

## 最初のモニターを作成する {#create-your-first-monitor}

検索クエリ、実行間隔、更新を受信する HTTPS エンドポイントを指定して
モニターを作成します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  monitor = exa.monitors.create({
      "name": "Battery recycling expansion",
      "search": {
          "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
          "type": "interval",
          "period": "1d",
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"],
      },
  })

  print(monitor.id)
  print(monitor.webhook_secret)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const monitor = await exa.monitors.create({
    name: "Battery recycling expansion",
    search: {
      query: "new battery recycling facilities announced in North America"
    },
    trigger: {
      type: "interval",
      period: "1d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });

  console.log(monitor.id);
  console.log(monitor.webhookSecret);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "Battery recycling expansion",
      "search": {
        "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<Accordion title="レスポンスの例">
  ```json theme={null}
  {
    "id": "01k4d9w6y3h7p2m8n5q1r0s4tv",
    "name": "Battery recycling expansion",
    "status": "active",
    "search": {
      "query": "new battery recycling facilities announced in North America"
    },
    "trigger": {
      "type": "interval",
      "period": "1d"
    },
    "outputSchema": null,
    "metadata": null,
    "webhook": {
      "url": "https://example.com/webhooks/exa",
      "events": ["monitor.run.completed"]
    },
    "nextRunAt": null,
    "createdAt": "2026-09-05T20:00:00.000Z",
    "updatedAt": "2026-09-05T20:00:00.000Z",
    "webhookSecret": "<one-time-webhook-signing-secret>"
  }
  ```
</Accordion>

モニターを作成したら、`webhookSecret` を必ず保存してください。この値は一度しか返されず、
Webhook の署名検証に必要です。

## 出力を設定する {#configure-the-output}

実行が完了するたびに、新たに見つかったページが `output.results` に返されます。

さらに Exa は、各ページから得られた情報を統合し、`output.content` に格納します。

| 出力形式     | 使用方法                         | 返される値                              |
| -------- | ---------------------------- | ---------------------------------- |
| テキスト要約   | デフォルト                        | `output.content` 内の文字列             |
| 構造化 JSON | オブジェクト形式の `outputSchema` を追加 | `output.content` 内の、スキーマに一致する JSON |

統合されたフィールドのソースは、`output.grounding` に自動的に返されます。

下流のコードで一貫した
フィールドが必要な場合は、`outputSchema` を追加します。

```json theme={null}
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "announcements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "company": { "type": "string" },
            "location": { "type": "string" },
            "announcement": { "type": "string" }
          },
          "required": ["company", "location", "announcement"]
        }
      }
    },
    "required": ["announcements"]
  }
}
```

引用と信頼度はスキーマに含めないでください。これらは
`output.grounding` で別途返されます。

## ページコンテンツを追加する {#add-page-content}

`search` では [Exa Search](/ja/docs/search/quickstart) と同じオプションを使用できます。`contents` を指定すると各結果に
ハイライト、全文、または要約を含めることができ、`includeDomains` または `excludeDomains` を指定すると
ソースを絞り込めます。

<CodeGroup>
  ```python Python theme={null}
  monitor = exa.monitors.create({
      "name": "LLM Research Tracker",
      "search": {
          "query": "new large language model training techniques and architectures",
          "numResults": 10,
          "contents": {
              "highlights": True
          }
      },
      "trigger": {
          "type": "interval",
          "period": "7d"
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"]
      }
  })
  ```

  ```javascript JavaScript theme={null}
  const monitor = await exa.monitors.create({
    name: "LLM Research Tracker",
    search: {
      query: "new large language model training techniques and architectures",
      numResults: 10,
      contents: {
        highlights: true
      }
    },
    trigger: {
      type: "interval",
      period: "7d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "LLM Research Tracker",
      "search": {
        "query": "new large language model training techniques and architectures",
        "numResults": 10,
        "contents": {
          "highlights": true
        }
      },
      "trigger": {
        "type": "interval",
        "period": "7d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

## モニターをテストする {#test-your-monitor}

次のスケジュール時刻を待たずに実行をすぐにトリガーし、その後、実行の一覧を取得します。

<CodeGroup>
  ```python Python theme={null}
  exa.monitors.trigger(monitor.id)

  runs = exa.monitors.runs.list(monitor.id, limit=1)
  latest = runs.data[0]
  print(latest.id, latest.status)
  ```

  ```javascript JavaScript theme={null}
  await exa.monitors.trigger(monitor.id);

  const runs = await exa.monitors.runs.list(monitor.id, { limit: 1 });
  const latest = runs.data[0];
  console.log(latest.id, latest.status);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors/$MONITOR_ID/trigger" \
    -H "Authorization: Bearer $EXA_API_KEY"

  curl -s "https://api.exa.ai/monitors/$MONITOR_ID/runs?limit=1" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

実行のステータスは次のとおりです。

| ステータス       | 意味                                         |
| ----------- | ------------------------------------------ |
| `pending`   | 実行はキューで待機中です                               |
| `running`   | 実行中です                                      |
| `completed` | 実行が完了しました。完全な出力を確認するには、ID を指定して実行を取得してください |
| `failed`    | 実行が失敗しました。失敗の理由は `failReason` で確認できます      |
| `cancelled` | 実行がキャンセルされました                              |

実行が完了するまで、`output` は null です。

## 実行のスケジュール設定 {#schedule-runs}

最小間隔は1時間です。`1h`、`6h`、`1d`、`7d` のように、単一の期間で指定してください。
スケジュールはモニターの作成時刻を基準とします。たとえば午後2時30分に作成した日次モニターは、毎日午後2時30分頃に実行されます。
ただし、各実行は最大30分遅れる可能性があるため、厳密な配信時刻を前提にしないでください。

`trigger` を省略すると、手動実行専用のモニターを作成できます。スケジュール設定済みのモニターを一時停止した場合も自動実行は停止しますが、
手動トリガーは引き続き利用できます。

<Note>
  モニターの実行が重複することはありません。前回の実行が完了する前に次のスケジュール実行が開始されると、
  Exa は前回の実行をキャンセルします。
</Note>

## webhook で更新を受信する {#receive-webhook-updates}

完了した実行だけを受け取りたい場合は、`monitor.run.completed` をサブスクライブしてください。`events` を省略すると、Exa
はモニターのライフサイクルイベントと実行作成イベントも送信します。

完了した実行の payload には、実行のステータスと出力が含まれます。モニターに任意で設定した `metadata` は
webhook の配信にそのまま含まれるため、更新を該当する顧客、
ワークスペース、チャネル、内部ジョブなどに振り分けられます。

<Accordion title="完了した実行の webhook payload">
  以下の例では、出力とタイムスタンプを省略しています。

  ```json theme={null}
  {
    "id": "event_...",
    "object": "event",
    "type": "monitor.run.completed",
    "data": {
      "id": "01k...",
      "monitorId": "01k...",
      "status": "completed",
      "output": {
        "results": [
          {
            "title": "New battery recycling facility announced",
            "url": "https://example.com/announcement"
          }
        ],
        "content": "...",
        "grounding": [
          {
            "field": "content",
            "citations": [
              {
                "title": "New battery recycling facility announced",
                "url": "https://example.com/announcement"
              }
            ],
            "confidence": "high"
          }
        ]
      },
      "failReason": null,
      "metadata": {
        "workspace_id": "workspace_123"
      }
    },
    "createdAt": "2026-09-05T20:00:00.000Z"
  }
  ```
</Accordion>

<Warning>
  リダイレクトには追従しないため、webhook は HTTPS を使用し、最終的な送信先となる URL を指定する必要があります。
  イベントを処理する前に、必ず `Exa-Signature` を検証してください。
</Warning>

各配信には、`t=<timestamp>,v1=<signature>` 形式の `Exa-Signature` header が含まれます。
`<timestamp>.<raw-request-body>` という文字列を組み立て、一度だけ発行される
`webhookSecret` で HMAC-SHA256 ダイジェストを計算したうえで、定数時間比較を使って `v1` の値と照合してください。

<CodeGroup>
  ```python Python theme={null}
  import hashlib
  import hmac


  def verify_webhook(payload: bytes, signature_header: str, secret: str) -> bool:
      parts = dict(part.split("=", 1) for part in signature_header.split(","))
      signed_payload = parts["t"].encode() + b"." + payload
      expected = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()
      return hmac.compare_digest(expected, parts["v1"])
  ```

  ```javascript JavaScript theme={null}
  import crypto from "crypto";

  function verifyWebhook(payload, signatureHeader, secret) {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((part) => part.split("=", 2))
    );
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.`)
      .update(payload)
      .digest("hex");
    const actualBuffer = Buffer.from(parts.v1 ?? "", "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    return (
      actualBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
  ```
</CodeGroup>

## 次のステップ {#next-steps}

<Columns cols={2}>
  <Card title="モニターを作成する" icon="bell" href="/ja/docs/reference/monitors/create-a-monitor" cta="リファレンスを開く" arrow="true">
    search、schedule、output、metadata、webhook の各フィールドをすべて確認できます。
  </Card>

  <Card title="モニター実行" icon="clock" href="/ja/docs/reference/monitors/runs/get-a-run" cta="リファレンスを開く" arrow="true">
    実行のステータス、出力、グラウンディング、失敗理由を確認できます。
  </Card>

  <Card title="Search ガイド" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを開く" arrow="true">
    クエリ、フィルター、ハイライト、全文、鮮度の設定方法を説明します。
  </Card>

  <Card title="Search のベストプラクティス" icon="sparkles" href="/ja/docs/search/best-practices" cta="ガイドを読む" arrow="true">
    出力を必要な情報に絞りつつ、検索精度を高める方法を紹介します。
  </Card>
</Columns>