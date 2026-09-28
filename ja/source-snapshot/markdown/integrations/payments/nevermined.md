> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは、次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Nevermined {#nevermined}

> Nevermined の x402 カードデリゲーションを使った、Exa 向けの自律型エージェント決済。7 USD を購入するたびに、7 USD 分のクレジットを含む Exa API キーが発行されるか、既存のキーにチャージされます。

エージェントは、[Nevermined](https://nevermined.ai) の [x402 カードデリゲーション](https://nevermined.ai/docs/specs/x402-card-delegation)方式を利用して、クレジットカードで Exa に支払います。**$7 を購入**するたびに、**$7 分の Exa クレジット**が付与された Exa API キーが返されます。

<Info>
  次の Nevermined プラン ID を使用してください:<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />このプランは Nevermined の本番環境 (live プレフィックス付きの API キー) で動作します。購入対象は API クレジットであり、個々の検索リクエストではありません。
</Info>

Nevermined で初めて支払う場合、`POST /team-management/nevermined/purchase-key` を呼び出すと新しい Exa API キーが発行され、$7 分のクレジットが追加されます。キーのクレジットを使い切ったら、同じデリゲーションで新しい x402 トークンを発行し、同じエンドポイントを再度呼び出してください。Exa から同じ API キーが返され、さらに $7 分のクレジットが追加されます。

## APIキーを購入する {#buy-a-key}

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **コスト:** 1 回の購入につき $7。x402 トークンが参照するデリゲーションに紐づくカードに請求されます。
* **レスポンス (新規の支払者) :** `{ status: "ok", apiKey: "…", expiresAt: null }` — $7 分のクレジットが付与された新しい Exa API キーが返されます。
* **レスポンス (既存の支払者) :** `{ status: "ok", apiKey: "…", expiresAt: null }` — 同じ Exa API キーに $7 分のクレジットが追加されます。
* **レスポンス (リプレイされたトークン) :** キャッシュされた結果が返され、新たな請求は発生しません。
* **署名がない、または無効な場合:** `402 Payment Required` が返され、ボディに支払い要件が含まれます。

## 仕組み {#how-it-works}

支払い処理は Nevermined が担当し、Exa が受け取るのは署名済みの x402 トークンのみです。

1. **初回セットアップ (カード所有者が実施) :** [nevermined.app](https://nevermined.app) でカードを登録し、そのカードに**デリゲーション** (支出権限。所有者が上限と期間を設定し、特定の API キーに範囲を限定することもできます) を作成したうえで、エージェント用の Nevermined API キーを発行します。
2. **エージェントがデリゲーションを見つけます。** エージェントは Nevermined SDK を使って、自身のキーで支出できるデリゲーションを検出し、残り予算が十分にある (最低 $7) ものを選択できます。該当するデリゲーションがない場合は、所有者がダッシュボードで作成します。完全自律型のエージェントであれば、カードの上限の範囲内で SDK から作成することもできます。
3. **エージェントが x402 アクセストークンを発行します。** 上記のプラン ID を対象とし、カードデリゲーション スキームを使用して、デリゲーションを ID で参照します。デリゲーションは発行前に作成しておく必要があります。トークンの発行時にデリゲーションをその場で作成することはできません。
4. **エージェントがトークンを上記のエンドポイントに POST します。** トークンは `payment-signature` ヘッダーに含めて送信し、レスポンスから Exa API キーを受け取ります。
5. **キーはすぐに使用できます。** 標準の [Exa Search API](/ja/docs/search/quickstart) でそのまま利用できます。

エージェント向けの詳しい手順 (SDK メソッド、パラメーター、デリゲーションの検出と作成、トラブルシューティング) については、Nevermined の Exa 統合ガイド [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) を参照してください (エージェントの場合は [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md) を取得してください) 。

## $7 で利用できる量 {#what-7-buys}

クレジットは Exa API の標準料金に基づいて消費されます。現在の料金では、$7 分のクレジットでおおよそ次の量を利用できます。

| エンドポイントまたは機能                                  |                         料金 |     おおよその利用量 |
| --------------------------------------------- | -------------------------: | -----------: |
| Search (`instant`、`fast`、`auto`) 、結果は最大 10 件  |           $7 / 1,000 リクエスト |  1,000 リクエスト |
| Deep-Lite Search                              |          $10 / 1,000 リクエスト |    700 リクエスト |
| Deep Search                                   |          $12 / 1,000 リクエスト |   ~583 リクエスト |
| Deep-Reasoning Search                         |          $15 / 1,000 リクエスト |   ~466 リクエスト |
| Contents (`text`、`highlights`、または `summary`)  | コンテンツタイプごとに $1 / 1,000 ページ |    7,000 ページ |
| Search または Contents の AI ページ要約                |             $1 / 1,000 ページ |   7,000 件の要約 |
| 最初の 10 件を超える追加結果                              |               $1 / 1,000 件 | 追加結果 7,000 件 |
| Answer                                        |           $5 / 1,000 リクエスト |  1,400 リクエスト |
| Monitors                                      |          $15 / 1,000 リクエスト |   ~466 リクエスト |

Search リクエストには、最大 10 件分の結果のテキストとハイライトが含まれます。10 件を超える追加結果と AI 要約は別途課金されます。<br />
料金の詳細は、[Exa の料金ページ](https://exa.ai/pricing)をご覧ください。

## キーのクレジットが尽きた場合 {#when-the-key-runs-out}

API キーのクレジットを使い切ると、Exa は通常の API エンドポイントに対して **`HTTP 402`** を返します。

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

同じプラン ID とデリゲーションで新しい x402 トークンを発行し、同じ `/purchase-key` エンドポイントに再度 POST してください。同じ API キーに $7 分のクレジットが追加されます。

## 参考資料 {#references}

* [Nevermined の Exa 統合ガイド](https://nevermined.ai/docs/integrations/exa)
* [x402 カードデリゲーションの仕様](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Exa の料金](https://exa.ai/pricing)
* [Exa Search API](/ja/docs/search/quickstart)