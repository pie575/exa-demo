> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# 料金 {#pricing}

> Exa Search、Contents、Answer、Monitors、Agent API の従量課金料金

***

Exa は従量課金制です。サブスクリプション契約や最低利用額はなく、チャージしたクレジットから、以下の料金に基づいてリクエストごとに課金されます。

<Check>
  **無料で始められます。** 新規アカウントには $20 分の無料クレジット (約 2,800 回の検索分) が付与されるほか、Free Tier では毎月 $10 分のクレジットが追加されます。API キーを取得して、さっそく開発を始めましょう。

  **本格的な利用をお考えですか？** 大量の利用、カスタムインデックス、より高いレート制限、SLA、Zero Data Retention が必要な場合は、ボリュームディスカウントを適用した [Enterprise プラン](#enterprise)について[お問い合わせください](https://exa.ai/contact/sales)。
</Check>

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

## 製品 {#products}

<Columns cols={3}>
  <Card title="Search" icon="search" href="/ja/docs/search/quickstart">
    **$7** / 1,000 リクエスト

    トークン効率に優れたページコンテンツを返すリアルタイム検索。
  </Card>

  <Card title="Deep Search" icon="microscope" href="/ja/docs/search/deep-search">
    **$12–15** / 1,000 リクエスト

    構造化出力と引用に対応したマルチステップのリサーチ。
  </Card>

  <Card title="Contents" icon="file-text" href="/ja/docs/contents/quickstart">
    **$1** / 1,000 ページ

    既知の URL からページ全文、ハイライト、要約を取得。
  </Card>

  <Card title="Answer" icon="message-circle" href="/ja/docs/reference/answer">
    **$5** / 1,000 リクエスト

    質問に対して LLM が引用付きで回答。
  </Card>

  <Card title="Monitors" icon="bell" href="/ja/docs/monitors/quickstart">
    **$15** / 1,000 リクエスト

    Web 上の新しい動きを検出する定期実行の検索。
  </Card>

  <Card title="Agent" icon="bot" href="/ja/docs/agent/quickstart">
    **$0.012–$1.00** / 固定 effort の実行 1 回あたり、または従量課金

    非同期のディープリサーチ、リスト作成、エンリッチメント。
  </Card>
</Columns>

## Search、Contents、Answer、Monitors {#search-contents-answer-and-monitors}

各エンドポイントには、リクエストごとに基本料金が設定されており、結果 10 件までが含まれます。追加の結果と Exa が生成するページ要約には、別途料金がかかります。

| エンドポイント     | 基本料金<br />(結果 10 件まで)   | 10 件を超える結果 1 件ごと | AI によるページ要約 |
| ----------- | ----------------------- | ---------------- | ----------- |
| `/search`   | $7 / 1k リクエスト           | $1 / 1k 件の結果     | $1 / 1k ページ |
| `/answer`   | $5 / 1k リクエスト           | —                | —           |
| `/monitors` | $15 / 1k リクエスト          | $1 / 1k 件の結果     | $1 / 1k ページ |
| `/contents` | $1 / 1k ページ(コンテンツタイプごと) | —                | $1 / 1k ページ |

## Agent {#agent}

[Agent](/ja/docs/agent/quickstart) で `effort` を固定値に設定すると、リクエストあたりの料金を予測しやすくなります。`auto` はデフォルトの従量課金モードです。ベータ版の `max` も従量課金で、同じ使用量単価が適用されます。

| Effort    | 料金             |
| --------- | -------------- |
| `minimal` | $0.012 / リクエスト |
| `low`     | $0.025 / リクエスト |
| `medium`  | $0.10 / リクエスト  |
| `high`    | $0.50 / リクエスト  |
| `xhigh`   | $1.00 / リクエスト  |

従量課金の実行では、実行ごとの上限額を上限として、実際の使用量に応じて課金されます。デフォルトの上限額は、`auto` が $5、ベータ版の `max` が $20 です。

| 使用量の内訳              | 料金              |
| ------------------- | --------------- |
| Agent Compute Units | $0.10 / ACU     |
| Search ツール呼び出し      | $0.005 / 検索     |
| メール連絡先エンリッチメント      | $0.02 / メールアドレス |
| 電話連絡先エンリッチメント       | $0.07 / 電話番号    |

### Connect プロバイダー {#connect-providers}

[Exa Connect](/ja/docs/agent/connect/overview) のデータソースを使用する実行では、
プロバイダーの呼び出しごとに追加料金が発生します。たとえば、
[Fiber.ai](/ja/docs/agent/connect/fiber#pricing) は 1 クレジットあたり $0.02、
[Baselayer](/ja/docs/agent/connect/baselayer#pricing) は操作に応じて 1 注文あたり
$0.15～$4.00 です。各プロバイダーの料金一覧は、
[Connect の料金](/ja/docs/agent/connect/overview#pricing)を
参照してください。

## Deep Search {#deep-search}

[`/search`](/ja/docs/search/deep-search) の `type` で指定します。追加の結果と AI によるページ要約の料金は、通常の検索と同じです。

| タイプ              | 基本料金<br />(結果 10 件まで) | レイテンシ   | 主な用途           |
| ---------------- | --------------------- | ------- | -------------- |
| `deep-lite`      | $12 / 1k リクエスト        | ~4 秒    | 軽量な情報統合        |
| `deep`           | $12 / 1k リクエスト        | 4–15 秒  | 構造化出力を伴う多段階の推論 |
| `deep-reasoning` | $15 / 1k リクエスト        | 12–40 秒 | 難易度の高いリサーチタスク  |

## Enterprise {#enterprise}

大量利用、カスタムデータセット、より厳格なセキュリティ要件が必要な場合に。

<Columns cols={3}>
  <Card title="強力な検索" icon="gauge">
    1回の検索あたり最大1,000件の結果取得、25件を超える結果のリクエスト、カスタムレート制限 (QPS) 、ニーズに合わせたモデレーション、カスタムインデックスをご利用いただけます。
  </Card>

  <Card title="Enterprise サポート" icon="headphones">
    SLA および MSA の締結、1対1のオンボーディングとサポート、[Zero Data Retention](/ja/docs/admin/security/zero-data-retention) を提供します。
  </Card>

  <Card title="カスタム料金" icon="tag">
    ボリュームディスカウントと、請求書による後払い課金に対応します。
  </Card>
</Columns>

<Card title="お問い合わせ" icon="mail" horizontal href="https://exa.ai/contact/sales">
  Enterprise 向けの利用量と契約条件についてお見積もりを依頼
</Card>

## コスト用語集 {#cost-glossary}

<AccordionGroup>
  <Accordion title="リクエスト">
    エンドポイントへの 1 回の API 呼び出しです。価格は 1,000 リクエストあたりで表示されるため、$7 / 1k の料金は 1 回の呼び出しあたり $0.007 になります。
  </Accordion>

  <Accordion title="結果">
    レスポンスで返される 1 件の検索結果です。基本料金にはリクエストあたり最初の 10 件の結果が含まれ、10 件を超える分は 1k 件あたり $1 が加算されます。そのため、`numResults: 20` を指定した場合のコストは、基本料金に追加 10 件分を加えた額になります。
  </Accordion>

  <Accordion title="ページとコンテンツタイプ">
    ページとは、Exa がコンテンツを返す 1 つの URL を指します。コンテンツタイプとは、そのページの表現形式の 1 つで、`text`、`highlights`、`summary` のいずれかです。`/contents` ではコンテンツタイプごとに個別に課金されるため、`text` と `highlights` を含む 1 ページは 2 件としてカウントされます。
  </Accordion>

  <Accordion title="AI ページ要約">
    Exa 側で追加の LLM 呼び出しを行って生成するページの要約です。要約を返すすべてのエンドポイントで、1k ページあたり $1 が課金されます。
  </Accordion>

  <Accordion title="Agent Compute Unit (ACU)">
    Agent の実行で消費されるモデル計算量の単位で、`usage.agentComputeUnits` として報告されます。実行時間が長いほど、`input.data` が大きいほど、推論ステップが多いほど、消費される ACU は増えます。
  </Accordion>

  <Accordion title="Effort">
    コストおよびレイテンシと網羅性のバランスを調整する Agent のパラメーターです。`auto` は消費量 (ACU とツール呼び出し) に応じて課金され、デフォルトの上限は $5 です。ベータ版の `max` も同じ従量料金で課金され、デフォルトの上限は $20 です。固定の effort では、リクエストごとに定額で課金されます。詳しくは [Agent の effort モード](/ja/docs/agent/quickstart#effort)を参照してください。
  </Accordion>

  <Accordion title="連絡先エンリッチメント">
    人物または企業のメールアドレスや電話番号を取得する Agent の検索機能です。実行にかかるその他のコストに加えて、見つかった連絡先ごとに課金されます。
  </Accordion>

  <Accordion title="クレジット">
    アカウントに前払いでチャージされたドル建ての残高です。利用に応じて、上記の料金でクレジットが差し引かれます。
  </Accordion>
</AccordionGroup>

<Card title="課金" icon="credit-card" horizontal href="/ja/docs/admin/billing">
  クレジットの追加、自動チャージの設定、請求書の確認ができます
</Card>