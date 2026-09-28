> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# イベントタイプ {#event-types}

> Webset API 内で発生するイベントについて説明します

Websets API は、Websets で発生した変更をイベントによって通知します。これらのイベントは、[イベントエンドポイント](/ja/docs/websets/api/events/list-all-events)から取得するか、[webhook](/ja/docs/websets/api/webhooks/create-a-webhook) を設定することで監視できます。

イベントは 60 日間保持された後、自動的に削除されます。

## Webset {#webset}

* `webset.created` - 新しい Webset が作成されたときに発行されます。
* `webset.deleted` - Webset が削除されたときに発行されます。
* `webset.paused` - Webset の処理が一時停止されたときに発行されます。
* `webset.idle` - Webset に実行中の処理がなくなったときに発行されます。

## Search {#search}

* `webset.search.created` - 新しい Search が開始されたときに発行されます。
* `webset.search.updated` - Search の進捗が更新されたときに発行されます。
* `webset.search.completed` - Search がすべてのアイテムを見つけ終えたときに発行されます。
* `webset.search.canceled` - Search が手動でキャンセルされたときに発行されます。

## Item {#item}

* `webset.item.created` - 新しいアイテムが Webset に追加されたときに発行されます。
* `webset.item.enriched` - アイテムのエンリッチメントが完了したときに発行されます。

## Import {#import}

* `import.created` - 新しいインポートが開始されたときに発行されます。
* `import.completed` - インポートが完了したときに発行されます。

## エクスポート {#export}

* `webset.export.created` - 新しいエクスポートが開始されたときに発行されます。
* `webset.export.completed` - エクスポートが完了したときに発行されます。

## モニター {#monitor}

* `monitor.created` - 新しいモニターが作成されたときに発行されます。
* `monitor.updated` - モニターの設定が更新されたときに発行されます。
* `monitor.deleted` - モニターが削除されたときに発行されます。
* `monitor.run.created` - モニターの実行が開始されたときに発行されます。
* `monitor.run.completed` - モニターの実行が完了したときに発行されます。

各イベントには以下が含まれます。

* 一意の `id`
* イベントの `type`
* イベントのトリガーとなったリソース全体を格納する `data` オブジェクト
* `createdAt` タイムスタンプ

これらのイベントは、次のような用途に活用できます。

* Search やエンリッチメントの進行状況を追跡する
* リアルタイムのダッシュボードを構築する
* 新しいアイテムが見つかったときにワークフローを起動する
* エクスポートのステータスを監視する