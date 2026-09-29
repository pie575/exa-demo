> ## ドキュメントインデックス
>
> 完全なドキュメントインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="changelog">
  # 変更履歴
</div>

> Exa の製品アップデートとお知らせ。

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights（リサーチプレビュー）" }}>
  ## Dynamic Highlights (リサーチプレビュー)

  Dynamic Highlights は、各ページを個別に扱うのではなく、結果セット全体を見渡して抜粋を選択します。共有のコンテキスト予算を有用なソースに多く配分し、すでに返された情報を繰り返すだけのソースへの配分は抑えます。

  * **シングルターン RAG**: コーディングおよび一般 QA の評価において、Exa Auto でトークン効率が約 49% 向上し、下流タスクの品質が 2.4% 向上しました。
  * **エージェント**: エージェントの軌跡全体でトークン数が約 30% 削減され、BrowseComp、WideSearch、および社内の企業・人物評価において品質が 1% 向上しました。

  `dynamic: true` を設定したリクエストには、`Exa-Beta: dynamic-highlights-2026-08-28` ヘッダーが必要です。

  [Dynamic Highlights ガイドを読む →](/ja/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "学術出版物のリサーチ" }}>
  ## 学術出版物のリサーチ

  学術出版物を対象としたリサーチ機能を大幅に拡張・改善しました。

  * **3 億 5,000 万件の出版物**: 3 億 5,000 万件の出版物を収録したインデックスを横断して検索できます。
  * **より充実した組織・人物の結果**: 検索結果として、組織とその所属人物の両方が返されるようになりました。いずれも、出版物、主な共同研究者、研究分野、資金提供の情報を網羅した、詳細な補完済みプロフィールとして提供されます。
  * **エージェントによる人物・組織検索**: エージェントが人物と組織を検索できるようになりました。
  * **公開検索ベンチマーク**: 出版物検索向けの公開ベンチマークをリリースしました。
  * **新しい `publication` 検索カテゴリ**: `category: "publication"` を指定して学術的な結果をクエリできます。このカテゴリは `research paper` カテゴリに代わるものです。
  * **非推奨のカテゴリ**: `pdf`、`github`、`tweet` の検索カテゴリは非推奨となります。
  * **`startCrawlDate` / `endCrawlDate`**: これらの非推奨パラメータは、互換性維持のため引き続き受け付けますが、すべてのチームで無視されるようになりました。

  API で `publication` [検索カテゴリ](/ja/docs/search/quickstart) を指定してクエリするか、[ダッシュボードで試してみてください →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="July 1, 2026" rss={{ title: "MCP での Exa Agent と Exa Connect" }}>
  ## MCP での Exa Agent と Exa Connect

  Exa Agent が Exa MCP で利用可能になりました。1 回の検索呼び出しでは対応しきれないタスクに、Claude、Cursor、その他の MCP クライアントから利用できます。

  `https://mcp.exa.ai/mcp?tools=agent_run` で Agent ツールを有効にし、`agent_run` を呼び出すと、エージェントが完了まで実行され、その出力が返されます。

  Exa Connect のデータソースは Agent のフローから利用できるため、ウェブ検索だけでは不十分な実行には、プレミアムなデータパートナーをアタッチできます。

  [Exa MCP ガイドを読む →](/ja/docs/get-started/exa-mcp) · [Exa Agent ガイドを読む →](/ja/docs/agent/quickstart) · [発表ツイート →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Exa Connect のご紹介" }}>
  ## Exa Connect のご紹介

  Exa Connect により、Exa Agent は世界中の公開データと非公開データにリアルタイムでアクセスできるようになります。ローンチ時の提供パートナーは、Similarweb、Fiber.ai、Baselayer、Financial Datasets、Affiliate.com、Particle、Jinko、および追加パートナーです。`POST /agent/runs` の `dataSources` で指定してアタッチします。

  [Exa Connect ガイドを読む →](/ja/docs/agent/connect/overview) · [発表ツイート →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Exa Agent のご紹介" }}>
  ## Exa Agent のご紹介

  API から利用できる、新しいタイプの最先端ウェブリサーチエージェントをリリースしました。

  Exa Agent API は、自然言語のクエリ、`effort` モード、構造化出力用の `outputSchema`、既存のデータセットを活用するための `input.data` などのパラメータをサポートしています。

  [Exa Agent API ガイドを読む →](/ja/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "API 非推奨のお知らせ" }}>
  ## API 非推奨のお知らせ

  Exa API のレガシー機能の一部を廃止しました。

  * **`/research` エンドポイント**: `type: "deep-reasoning"` を指定した `/search` に置き換えられました。
  * **`resolvedSearchType` と `highlightScores`(レスポンスフィールド)**: 4月15日から `null` を返すようになり、5月1日に削除されました。
  * **`startCrawlDate` / `endCrawlDate`(非推奨のリクエストパラメーター)**: 4月15日以降、エラーを返さずに無視されます。

  [Deep search に移行する →](/ja/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Exa Monitors の提供開始" }}>
  ## Exa Monitors の提供開始

  Monitors は Exa の検索をスケジュールに従って実行し、結果を Webhook に配信します。過去の実行結果との重複は除外されるため、新しいコンテンツだけを受け取れます。

  * **トピックを継続的に追跡**: 競合他社のニュース、資金調達ラウンド、規制の変更、研究論文など。
  * **構造化された結果**: プレーンテキスト、または `outputSchema` による型付き JSON で返します。
  * **柔軟なスケジュール設定**: 一定間隔(最短 1 時間)で実行するか、手動でトリガーできます。

  [Monitors API ガイドを読む →](/ja/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Exa Deep の刷新" }}>
  ## Exa Deep の刷新

  Exa Deep がより高速かつ低価格になり、フィールド単位のグラウンディングを備えた構造化出力に対応しました。

  * より負荷の高いタスク向けの **新しい `deep-reasoning` タイプ**(12〜50 秒)。`deep` は 4〜12 秒で完了します。
  * 通常の `deep` 検索の **価格を 20% 引き下げ**。
  * `outputSchema` による **構造化出力**。レスポンスには `output.content` と `output.grounding`(フィールド単位の引用と信頼度)が含まれます。

  料金の詳細は、下記の [Exa 料金改定](#exa-pricing-update) をご覧ください。

  [Search API リファレンスを読む →](/ja/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Exa 料金改定" }}>
  ## Exa 料金改定

  料金体系を簡素化し、値下げしました。検索結果の上位 10 件のコンテンツが無料で含まれるようになりました。新料金は自動的に適用されるため、特に操作は必要ありません。

  * **コンテンツ付き検索**: 1,000 リクエストあたり $7(10 件の結果、テキストとハイライトを含む)。追加結果は 1,000 件あたり $1。
  * **要約**: 検索と contents のいずれも 1,000 件あたり $1。
  * **Exa Deep**: 1,000 リクエストあたり $12。**Deep (Reasoning)** は 1,000 件あたり $15。
  * **Contents エンドポイント**: コンテンツタイプごとに 1,000 ページあたり $1。

  [現在の料金を見る →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Exa Instant Search の提供開始" }}>
  ## Exa Instant Search の提供開始

  Exa Instant は最速の検索タイプで、向上したニューラル検索の品質と 150ms 未満のレイテンシーを両立しています。`type="instant"` で有効にできます。

  * **リアルタイム用途向けに設計**: チャットアプリ、音声 AI、コーディングエージェント、オートコンプリート、ライブサジェストなど。
  * 当社最小のレイテンシーで **最先端の品質** を実現。

  [Search API ガイドを読む →](/ja/docs/search/quickstart) · [ダッシュボードで試す →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "ハイライト、コンテンツの鮮度、MCP のアップデート" }}>
  ## ハイライト、コンテンツの鮮度、MCP のアップデート

  コンテンツの抽出とアクセスに関する 3 つの改善を行いました。

  * **ハイライト向けの `maxCharacters`**: ハイライトの長さを制御する推奨の方法になりました。`numSentences` と `highlightsPerUrl` は非推奨です。
  * **コンテンツの鮮度向けの `maxAgeHours`**: ブール値の `livecrawl` に代わる、経過時間ベースの制御です(`0` は常にクロール、`-1` はキャッシュのみ、`24` は 24 時間より古い場合にクロール)。
  * **Exa MCP 無料枠**: 認証なしで 3 QPS、1 日 150 回の呼び出しまで試せます。API キーを追加するとフルアクセスが可能です。

  [コンテンツの鮮度のドキュメント →](/ja/docs/contents/quickstart#content-freshness) · [Exa MCP →](/ja/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Exa Company Search の提供開始" }}>
  ## Exa Company Search の提供開始

  企業検索に、ファインチューニングした検索モデルとエンティティマッチングパイプラインを導入しました。`type="auto"`、`category="company"` を指定して利用できます。

  * **あらゆる属性で高精度**: 業種、地域、資金調達ステージ、従業員数。
  * **構造化されたエンティティデータ**: 結果には型付きの企業情報 (従業員、本社、財務、ウェブトラフィック) が含まれます。
  * **ユースケース**: 営業の見込み顧客開拓、市場リサーチ、サプライチェーン関連のワークフロー。

  [Companies &amp; People Search のドキュメントを読む →](/ja/docs/search/data/companies-people) · [ベンチマークのブログを読む →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Exa People Search の提供開始" }}>
  ## Exa People Search の提供開始

  人物検索がハイブリッド検索システムにより、10 億件以上の公開プロフィールを対象にできるようになりました。`linkedin` カテゴリは新しい `people` カテゴリに置き換わります。

  * **対象範囲の拡大**: LinkedIn に限らず、ウェブ全体のプロフィールを対象とします。
  * **精度の向上**: 役職、スキル、企業に関するクエリ向けにファインチューニングした埋め込みを使用します。
  * **ユースケース**: 営業、採用、市場リサーチ。

  [Companies &amp; People Search のドキュメントを読む →](/ja/docs/search/data/companies-people) · [ベンチマークのブログを読む →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: ハイライトが復活" }}>
  ## JS SDK: ハイライトが復活

  `exa-js` v2.0.11 から JavaScript SDK でハイライトが再び利用可能になり、重要な文を関連度スコア付きで返します。search および contents の呼び出しで `highlights: true` または `highlights: { maxCharacters, query }` を渡してください。

  [JavaScript SDK のドキュメントを読む →](/ja/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "新しい Deep 検索タイプ" }}>
  ## 新しい Deep 検索タイプ

  Exa Deep は複数の検索を同時に実行し、各結果について質の高いコンテキストを返すことで、より精度の高い結果を見つけます。`type="deep"` で有効にできます。

  * **クエリ拡張**: クエリを 1 つ送信するだけでバリエーションを自動生成します。`additionalQueries` で独自のクエリを指定することもできます。
  * **並列検索とスマートランキング**: 元のクエリとすべてのバリエーションを横断して実行します。
  * **各結果の詳細な要約**。

  [Search API リファレンスを読む →](/ja/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "言語フィルタリングを追加" }}>
  ## 言語フィルタリングを追加

  Exa がクエリの言語を検出し、その言語の結果のみを返すようになりました。すべてのユーザーでデフォルトで有効になっており、設定は不要です。

  [Search API ガイドを読む →](/ja/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "SDK の変更: ハイライトの削除とコンテンツのデフォルト返却" }}>
  ## SDK の変更: ハイライトの削除とコンテンツのデフォルト返却

  破壊的変更を含む SDK のメジャーバージョンアップです。

  * **コンテンツをデフォルトで返却**: search にページコンテンツが含まれるようになりました。検索を高速化したい場合はオプトアウトしてください。
  * **SDK からハイライトを削除**: その後 JS SDK では復活しています。[JS SDK: ハイライトが復活](#js-sdk-highlights-restored) を参照してください。
  * **`use_autoprompt` を非推奨化**: すべての API レスポンスから削除されました。

  [Python SDK のドキュメントを読む →](/ja/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "ドメインパスフィルターに対応" }}>
  ## ドメインパスフィルターに対応

  `includeDomains` と `excludeDomains` で、より細かい指定ができるようになりました。

  * **パス単位のフィルタリング**: 例: `exa.ai/blog`、`linkedin.com/company`。
  * **サブドメインのワイルドカード**: 例: `*.substack.com`。

  検索対象をブログ、製品カタログ、ディレクトリなどに絞り込む際に便利です。

  [Search API リファレンスを読む →](/ja/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "位置情報フィルターに対応" }}>
  ## 位置情報フィルターに対応

  新しい `userLocation` パラメーターに [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 国コード (例: `"us"`、`"fr"`) を渡すと、ユーザーの地域の結果が優先されます。複数地域向けのアプリ、地域言語のコンテンツ、ローカル情報の探索に役立ちます。

  [Search API リファレンスを読む →](/ja/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "新しい Fast 検索タイプ" }}>
  ## 新しい Fast 検索タイプ

  Exa Fast は、p50 レイテンシ 425ms 未満を実現する軽量化された検索モデルを使用します。`type="fast"` で有効にできます。

  * ニューラル検索と**同じ Exa インデックス**の高品質なコンテンツを利用できます。
  * 他の検索タイプと**すべてのパラメーターに互換性**があります。
  * 高速な Web グラウンディング、エージェント型ワークフロー、低レイテンシが求められる製品**向けに設計**されています。

  [Search API ガイドを読む →](/ja/docs/search/quickstart) · [ダッシュボードで試す →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Auto 検索でのスコアの非推奨化" }}>
  ## Auto 検索でのスコアの非推奨化

  新しい Auto 検索アーキテクチャでは意味のある関連性スコアを算出できなくなったため、Auto 検索の結果から `score` フィールドを削除します。

  * **Auto 検索**: `score` は返されなくなりました。結果はすでに関連性の高い順に並んでいます。
  * **ニューラル検索**: スコアに変更はありません。スコアを利用している場合は `type="neural"` を指定してください。

  [Search API リファレンスを読む →](/ja/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Markdown コンテンツがデフォルトに" }}>
  ## Markdown コンテンツがデフォルトに

  すべてのエンドポイントが、デフォルトでクリーンな Markdown を返すようになりました。LLM、RAG、一般的なテキスト処理に適した形式です。特に対応は必要ありません。

  * **`includeHtmlTags=false` (デフォルト)&#x20;**: コンテンツをクリーンな Markdown に変換して返します。
  * **`includeHtmlTags=true`**: Markdown に変換せず、生の HTML を返します。

  どちらの場合も、広告やナビゲーションなどの定型部分は除去されます。

  [Contents ドキュメントを読む →](/ja/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "新しい Livecrawl オプション: Preferred" }}>
  ## 新しい Livecrawl オプション: Preferred

  <Warning>
    これは過去のエントリーです。`livecrawl` 文字列パラメーターは現在非推奨です。新規の統合では `maxAgeHours` と `livecrawlTimeout` を使用してください。詳しくは [Content Freshness](/ja/docs/contents/quickstart#content-freshness) を参照してください。
  </Warning>

  非推奨の `livecrawl: "preferred"` オプションは、新たにクロールを試み、失敗した場合はキャッシュされたコンテンツにフォールバックします (エラーを返す `"always"` とは異なります) 。一時的にアクセスできないサイトがあっても失敗させずに、最新のコンテンツを取得したい本番アプリに最適です。

  [Content Freshness ドキュメントを読む →](/ja/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Contents エンドポイントのステータス変更" }}>
  ## Contents エンドポイントのステータス変更

  `/contents` は単一の HTTP エラーを返す代わりに、URL ごとの `statuses` フィールドを返すようになりました。これにより、各 URL の結果を個別に処理できます。エンドポイント自体がエラーを返すのは、内部的な問題が発生した場合のみです。

  * **`status`**: URL ごとに `"success"` または `"error"`。
  * **`error.tag`**: `CRAWL_NOT_FOUND`、`CRAWL_TIMEOUT`、`SOURCE_NOT_AVAILABLE` など。`httpStatusCode` も併せて返されます。

  [エラーコードのリファレンスを読む →](/ja/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto 検索がデフォルトに" }}>
  ## Auto 検索がデフォルトに

  Auto 検索がデフォルトになりました。各クエリを最適な検索方式に自動で振り分けます。特に対応は必要ありません。以前の動作を維持したい場合は `type="neural"` を指定してください。

  [Exa の検索タイプについて詳しく見る →](/ja/docs/search/quickstart)
</Update>