> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 個別のページを読み進める前に、このファイルで利用可能なすべてのページを確認してください。

<div id="batch-api">
  # Batch API
</div>

> Exa APIのリクエストをバッチで非同期に実行します。

<Info>
  Batch APIはEnterpriseのお客様向けの機能で、Exaがお客様のチームで有効化するとご利用いただけます。Enterpriseプランでのアクセスや有効化については、[sales@exa.ai](mailto:sales@exa.ai)までお問い合わせください。
</Info>

Batch APIを使用すると、多数のExa APIリクエストをまとめて送信し、その結果を後からJSONLファイルとして取得できます。数千件のリクエストを個別に送信し、レート制限や再試行を自前で管理する必要はありません。バッチを1つ送信してステータスをポーリングし、すべての結果を1つのファイルでダウンロードするだけです。

オフラインでのエンリッチメントやバックフィルなど、即時のレスポンスを必要としないジョブにご利用ください。リクエストとレスポンスの完全なスキーマは[APIリファレンス](/ja/docs/reference/batches/create-a-batch)をご覧ください。

<Note>
  Batch APIはベータ版です。すべてのリクエストに`Exa-Beta: batches-2026-06-06`ヘッダーを含めてください。
</Note>

<div id="supported-requests">
  ## サポートされているリクエスト
</div>

バッチ内の各項目は、以下のいずれかのルートに対する `POST` リクエストである必要があります。

| ルート           | ユースケース                  |
| ------------- | ----------------------- |
| `/search`     | Exa の検索リクエストを非同期で実行     |
| `/agent/runs` | Exa Agent のリクエストを非同期で実行 |

各項目には、バッチ内で一意の `customId` を指定する必要があります。結果ファイルにも同じ `customId` が返されるため、出力の各行を入力データと照合できます。

<div id="create-a-batch">
  ## バッチを作成する
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/batches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "customId": "row-1",
          "method": "POST",
          "url": "/search",
          "body": {
            "query": "Latest AI infrastructure funding rounds"
          }
        },
        {
          "customId": "row-2",
          "method": "POST",
          "url": "/agent/runs",
          "body": {
            "query": "Summarize recent vector database launches"
          }
        }
      ],
      "metadata": {
        "project": "weekly-digest"
      }
    }'
  ```
</CodeGroup>

レスポンスには、バッチ ID と初期ステータスが含まれます。

<Accordion title="レスポンス例">
  ```json theme={null}
  {
    "id": "batch_01j7x9v0m2n4p6q8r0s2t4v6w8",
    "object": "batch",
    "status": "in_progress",
    "requestCounts": {
      "total": 2,
      "completed": 0,
      "failed": 0
    },
    "createdAt": "2026-06-06T12:00:00.000Z",
    "expiresAt": null,
    "endedAt": null,
    "resultsUrl": null,
    "metadata": {
      "project": "weekly-digest"
    }
  }
  ```
</Accordion>

<div id="check-status">
  ## ステータスを確認する
</div>

バッチが終了ステータスになるまでポーリングします。

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

バッチのステータスは次のとおりです。

| ステータス         | 意味                             |
| ------------- | ------------------------------ |
| `in_progress` | バッチを実行中です                      |
| `completed`   | すべてのリクエストが完了し、結果を取得できます        |
| `cancelling`  | キャンセルがリクエストされ、実行中の処理の終了を待っています |
| `cancelled`   | バッチはキャンセルされました                 |
| `expired`     | 結果は利用できなくなりました                 |

バッチが完了すると、`resultsUrl` に JSONL 形式の結果ファイルのダウンロード URL が格納され、`expiresAt` には結果の保持期間の終了日時が設定されます。

<Warning>
  `resultsUrl` は有効期間の短い署名付き URL です。結果を再度ダウンロードする場合は、その都度バッチを再取得して新しい URL を取得してください。
</Warning>

<div id="list-batches">
  ## バッチの一覧を取得する
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

レスポンスはカーソルベースでページネーションされます。`data` には最大 `limit` 件のバッチが含まれます。`hasMore` が `true` の場合は、`nextCursor` の値を `cursor` クエリパラメーターに指定すると次のページを取得できます。

完了済みのバッチのみを一覧表示するには、`status=completed` を指定します。

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

サポートされている値は `completed` のみで、それ以外の値を指定するとエラーが返されます。完了済みの一覧は有効期限順に並び、独自のカーソルを使用するため、すべてのページのリクエストで `status=completed` を指定し続けてください。完了済みの一覧のカーソルとフィルターなしの一覧のカーソルは相互に使用できません。

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

<div id="download-results">
  ## 結果をダウンロードする
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

JSONL の各行には、元の `customId` と、`response` または `error` のいずれかが含まれます。

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

<div id="cancel-a-batch">
  ## バッチをキャンセルする
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="delete-a-batch">
  ## バッチを削除する
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="access">
  ## アクセス
</div>

チームで Batch API を有効にするには、[sales@exa.ai](mailto:sales@exa.ai) までお問い合わせください。