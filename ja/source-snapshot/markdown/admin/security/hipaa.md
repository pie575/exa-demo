> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="hipaa">
  # HIPAA
</div>

> 対象となるキャッシュからの取得のリクエストには、HIPAA準拠モードを使用します。

<Info>
  HIPAA準拠は、Exaがお客様のチームで有効化した後にEnterpriseのお客様がご利用いただけます。Enterpriseへのアクセス、BAA要件、有効化については、[sales@exa.ai](mailto:sales@exa.ai)までお問い合わせください。
</Info>

HIPAAモードは、トップレベルの`compliance`フィールドを使ってリクエストごとに制御します。

```json theme={null}
{
  "compliance": "hipaa"
}
```

対象となるチームのリクエストにこのフィールドが含まれている場合、Exa は HIPAA 準拠の管理策を適用してリクエストを処理します。チームでこの機能が有効になっていない場合、API は `403 FEATURE_DISABLED` を返します。

HIPAA モードでは、該当するリクエストに [Zero Data Retention](/ja/docs/admin/security/zero-data-retention) が適用されるため、Exa が PHI を保存することはありません。

<div id="supported-endpoints">
  ## 対応エンドポイント
</div>

`compliance` フィールドは、次のエンドポイントで使用できます。

* [`/search`](/ja/docs/reference/search)
* [`/contents`](/ja/docs/reference/get-contents)

その他のエンドポイントでは、このフィールドを指定するとリクエストが拒否されます。

<div id="requirements">
  ## 要件
</div>

HIPAA モードでは、キャッシュからの取得のみがサポートされます。対応しているリクエストは次のとおりです。

* `/search` では、`type` を `instant` または `fast` に設定する
* `text` または `highlights` をリクエストする (`summary` は不可)
* キャッシュのみのコンテンツを使用する。鮮度関連のフィールドを省略するか、`/contents` で `maxAgeHours: -1` を設定する

対応していないリクエストは `400 INVALID_REQUEST_BODY` を返します。主な例は次のとおりです。

* `/contents` での `summary`、または `/search` での `contents.summary`
* ライブフェッチが必要になる鮮度設定 (`maxAgeHours: 0` や正の値の `maxAgeHours` など)
* `type` を省略した検索リクエスト、または `instant`、`fast` 以外のタイプを指定した検索リクエスト

<div id="example">
  ## 例
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "urls": ["https://example.com/article"],
      "compliance": "hipaa",
      "highlights": true,
      "maxAgeHours": -1
    }'
  ```
</CodeGroup>

<div id="access">
  ## アクセス
</div>

チームでHIPAAモードを有効にするには、[sales@exa.ai](mailto:sales@exa.ai)までお問い合わせください。Exaのセキュリティ関連ドキュメントは、[Trust Center](https://trust.exa.ai)でご確認いただけます。