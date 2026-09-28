> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 個別のページを詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="research-publications">
  # 研究文献
</div>

> Exa Search を使って、学術論文、特許、研究助成金、臨床試験、規制当局の承認を検索できます。

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="APIプレイグラウンドで開く" aria-label={`「${query}」をAPIプレイグラウンドで開く`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Exa Search を使用すると、研究論文や関連レコードを検索できます。タイトル、アブストラクト、著者、掲載誌・学会、引用、出版社のページ、プレプリント、リポジトリのページなどが対象です。

<Tip>
  論文検索の品質について詳しくは、[SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search)
  をご覧ください。
</Tip>

<div id="included">
  ## 対象
</div>

* 論文およびプレプリント(解析済みの全文がある場合は全文チャンクを含む)
* 特許(要約、請求項、発明者、譲受人を含む)
* 研究助成金および資金提供に関する発表
* 臨床試験、医薬品の添付文書、相互作用データ
* 規制当局および保健当局による承認

<div id="use-it-for">
  ## 主な用途
</div>

* 文献レビューと引用文献の探索
* 先行技術調査と特許ランドスケープ分析
* 臨床・医薬分野のリサーチ
* 助成金や資金調達機会の探索

<div id="example-queries">
  ## クエリの例
</div>

<div id="find-papers-on-a-topic">
  ### 特定のトピックに関する論文を探す
</div>

タイトルに含まれそうなキーワードを推測するのではなく、手法や研究結果を説明してください。`publication` カテゴリを指定すると、結果を論文に絞り込めます。

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

<div id="search-clinical-evidence">
  ### 臨床エビデンスを検索する
</div>

フェーズ、介入、対象集団を指定すると、一般的な報道よりも治験登録情報や試験結果のページが上位に表示されます。

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

<div id="track-regulatory-approvals">
  ### 規制当局の承認を追跡する
</div>

追跡したい規制当局と、医療機器または医薬品の分類を指定してください。

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

<div id="run-a-prior-art-search">
  ### 先行技術調査を行う
</div>

製品名ではなく、請求項を書くときのように、発明を機能面から記述してください。

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="make-a-request">
  ## リクエストを送信する
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "papers on evaluation benchmarks for retrieval-augmented generation",
      type="auto",
      category="publication",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "papers on evaluation benchmarks for retrieval-augmented generation",
    {
      type: "auto",
      category: "publication",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "papers on evaluation benchmarks for retrieval-augmented generation",
      "type": "auto",
      "category": "publication",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Exa Agent で構造化データを取得する
</div>

複数のソースにまたがるリサーチが必要な構造化データを得るには、[Exa Agent のタスク実行](/ja/docs/agent/quickstart)を使用します。対象とする文献、選定基準、必要な出力フィールドを記述すると、Agent がスキーマ検証済みの結果を引用付きで返します。

<Card title="Agent タスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agent ガイドを開く" arrow="true">
  文献マップの作成、選定基準に基づく論文のスクリーニング、複数の文献から収集したフィールドの 1 つの表への集約などが行えます。
</Card>