> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="search-best-practices">
  # Search のベストプラクティス
</div>

> 本番環境の Search API インテグレーションに向けて、検索精度、レイテンシ、コンテキスト、回答生成 (合成) を最適化します。

このガイドは、動作する [Search API リクエスト](/ja/docs/search/quickstart)がすでにあることを前提としています。Exa が推奨するベストプラクティスに沿って、そのリクエストを改善する方法を説明します。

<div id="start-with-the-smallest-useful-request">
  ## 必要最小限のリクエストから始める
</div>

最適なベースラインは、`highlights: true` を指定した自然言語のクエリです。Exa は各結果の抜粋の長さを関連度に応じて自動調整するため、文字数上限を調整する必要はありません。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

これで、ランク付けされたページと、各ページからクエリに関連するトークン効率の高いコンテキストが得られます。

その他のパラメーターは、必要な場合にのみ追加してください。

| パラメーター                     | 追加するケース                                            |
| -------------------------- | -------------------------------------------------- |
| `type`                     | レイテンシの目標や検索の深さの要件に合わせて調整する場合                       |
| `numResults`               | 小さいコンテキストウィンドウに収めるためにページ数を減らす場合、または再現率を高めるために増やす場合 |
| `outputSchema`             | 結果を統合する場合、または JSON に構造化する場合                        |
| `maxAgeHours`              | キャッシュされたページコンテンツが古すぎるおそれがある場合                      |
| `highlights.maxCharacters` | アプリケーションでページごとに抜粋の上限を固定する必要がある場合                   |
| ドメインまたは日付のフィルター            | 条件に合わない結果が使い物にならない場合                               |

<div id="search-vs-deep-search">
  ## Search と Deep Search の違い
</div>

標準の search は、クエリに対してページを取得し、ランク付けします。Deep Search はリサーチプロセスを実行し、反復的な検索、
結果の精査、検索の絞り込みを行ったうえで、根拠に基づいた結果を合成します。

| ニーズ                                                       | 推奨モード                               |
| --------------------------------------------------------- | ----------------------------------- |
| 明確なクエリに対して、ランク付けされたページを取得したい                              | `auto` または `fast`                   |
| 難しい検索、多数の結果にまたがる合成、または 1 回の検索では埋められない構造化出力 (3 つ以上のフィールド)  | `deep`                              |
| 長時間にわたるリサーチ、リスト作成、またはマルチホップの エンリッチメント                   | [Exa Agent](/ja/docs/agent/quickstart) |

`outputSchema` を使用する場合は、基本的に Deep モードをおすすめします。詳しい手順と例については、[Deep Search ガイド](/ja/docs/search/deep-search)をご覧ください。

<div id="improve-retrieval-quality">
  ## 検索精度を向上させる
</div>

結果を改善したい場合は、リクエストの要素を一度に1つずつ変更してください。

<Steps>
  <Step title="クエリを明確にする">
    キーワードを羅列するのではなく、求めるページを具体的に記述してください。主題に加えて、ソースの種類や
    期間など、どのような結果が関連性が高いかを左右する詳細も含めます。

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="レスポンスを段階的に確認する">
    リクエストを変更する前に、タイトル、URL、公開日、ハイライト を確認してください。

    ```json theme={null}
    {
      "results": [
        {
          "title": "Long-Context Retrieval Methods on Legal Documents",
          "url": "https://arxiv.org/abs/2608.00000",
          "publishedDate": "2026-08-26T00:00:00.000Z",
          "highlights": [
            "We compare long-context retrieval methods across legal document benchmarks..."
          ]
        }
      ]
    }
    ```

    タイトルと URL からは Exa が取得したソースの種類が、`publishedDate` からはその新しさが、
    highlight からはクエリに一致した根拠がわかります。別のページを取得したい場合はクエリを調整し、
    期間を絞り込みたい場合は日付フィルターを追加します。有用な結果についてより多くのコンテキストが必要な場合は、全文を取得してください。
  </Step>

  <Step title="厳格な制約のみを追加する">
    `includeDomains`、`excludeDomains`、公開日フィルターは、制約を満たさない結果が
    使えない場合にのみ使用してください。取得に関する希望はクエリに記述し、回答を生成する場合は
    レスポンスへの指示を `systemPrompt` に記述します。
  </Step>

  <Step title="検索モードの変更は最後に行う">
    レイテンシ要件がある場合は高速なモードを、取得プロセス自体に反復と推論が必要な場合は
    deep モードを使用してください。モードを変えても、条件が不十分なクエリを補うことはできません。
  </Step>
</Steps>

チューニング中は、代表的なクエリを少数用意しておきましょう。1つの例に合わせて最適化するのではなく、そのセット全体で結果の関連性と後続タスクの成功率を比較します。リグレッションを再現できるよう、`requestId`、`searchTime`、`costDollars` を記録してください。

<div id="budget-latency-and-context">
  ## レイテンシとコンテキストの予算配分
</div>

各コントロールは、それぞれ異なるリソースを消費します。

| コントロール                    | 増えるもの                      |
| ------------------------- | -------------------------- |
| 結果数の増加                    | ページ数、レスポンスデータ、下流のコンテキスト    |
| 全文                        | より広範なページコンテキストと、より大きなペイロード |
| `summary`                 | 結果ごとに 1 回の言語モデル呼び出し        |
| `outputSchema`            | 取得した結果全体を対象とした合成           |
| `contents.maxAgeHours: 0` | キャッシュ済みコンテンツではなく、ページの新規取得  |
| ディープ検索タイプ                 | 反復的な検索、合成、推論               |

キャッシュ済みコンテンツで問題ないリアルタイム処理では、最もレイテンシの低いモードに、ハイライトとキャッシュのみのコンテンツを組み合わせます。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent product updates from major AI labs",
      type="instant",
      contents={
          "highlights": True,
          "max_age_hours": -1,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("Recent product updates from major AI labs", {
    type: "instant",
    contents: {
      highlights: true,
      maxAgeHours: -1
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent product updates from major AI labs",
      "type": "instant",
      "contents": {
        "highlights": true,
        "maxAgeHours": -1
      }
    }'
  ```
</CodeGroup>

ページの鮮度が正確性を左右する場合は、この方法を使用しないでください。プロダクトに計測済みのレイテンシ目標がない限り、まずは `auto` とデフォルトの鮮度設定から始めてください。

結果セット全体で 1 つのコンテキスト予算を Exa に配分させる (有力なソースには多く、冗長なソースには少なく割り当てる) には、[Dynamic Highlights リサーチプレビュー](/ja/docs/search/highlights#dynamic-highlights)を参照してください。

<div id="tips-for-common-use-cases">
  ## 一般的なユースケース別のヒント
</div>

| 目的                       | 推奨                                                                            | 非推奨                         |
| ------------------------ | ----------------------------------------------------------------------------- | --------------------------- |
| より新しい出版物を取得したい           | クエリに期間を含めるか、公開日フィルターを使用する                                                     | `maxAgeHours`               |
| 更新されるページから最新のコンテンツを取得したい | `contents.maxAgeHours`                                                        | 公開日フィルター                    |
| 特定の種類のソースを優先したい          | クエリの表現を工夫する。合成時は `systemPrompt` を使用する                                         | 厳格なドメイン許可リスト                |
| 承認済みのソースからのみ結果を取得したい     | `includeDomains`                                                              | クエリ内で `site:` を繰り返し指定する     |
| 小規模な構造化出力が欲しい            | 標準の Search で `outputSchema` を使用する                                             | 出力が JSON だという理由だけで Deep を選ぶ |
| 調査に基づく複数アイテムの出力が欲しい      | `deep` と `outputSchema` を組み合わせる、または [Exa Agent](/ja/docs/agent/quickstart) を使用する | 1 回の取得ですべてのアイテムを収集できると想定する  |
| 少数のページからより多くのコンテキストを得たい  | ハイライト 付きで検索してから Contents を呼び出す                                           | すべての結果の全文を取得する              |
| レイテンシを下げたい               | コンパクトなコンテンツで `fast` または `instant` を計測する                                       | 鮮度や合成の制御をデフォルトで追加する         |

<div id="when-to-use-another-endpoint">
  ## 別のエンドポイントを使うべき場合
</div>

タスクの性質が異なる場合は、別の Exa エンドポイントを使用してください。

| タスク                     | 使用するエンドポイント                           |
| ----------------------- | ------------------------------------- |
| 長時間のリサーチ、リスト作成、エンリッチメント | [Exa Agent](/ja/docs/agent/quickstart)   |
| URL がすでにわかっている          | [Contents](/ja/docs/contents/quickstart) |
| スケジュールに沿って検索を実行する       | [Monitors](/ja/docs/monitors/quickstart) |

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="Search API リファレンス" icon="square-terminal" href="/ja/docs/reference/search" cta="リファレンスを開く" arrow="true">
    すべてのリクエストパラメーターとレスポンスフィールドを確認できます。
  </Card>

  <Card title="Search クイックスタート" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを確認" arrow="true">
    基本的なリクエスト形式、フィルター、出力、鮮度について解説します。
  </Card>

  <Card title="Contents API" icon="file-text" href="/ja/docs/contents/quickstart" cta="ガイドを開く" arrow="true">
    URL がわかっているページから、ハイライトや全文を抽出できます。
  </Card>

  <Card title="Exa Agent" icon="bot" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    長時間にわたるリサーチ、リスト作成、エンリッチメントを実行できます。
  </Card>
</Columns>