> ## ドキュメントインデックス
>
> 完全なドキュメントインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="legal-public-records">
  # 法務・公的記録
</div>

> Exa Search で、判例、特許、制裁リスト、政府契約などの公的記録を検索できます。

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

Exa Search を使えば、一次法源や政府の公的記録を、それらに関する解説記事とあわせて検索できます。

<div id="included">
  ## 収録内容
</div>

* 米国の判例(全文、裁判所名、事件番号、判例引用などのメタデータ付き)
* 米国の登録特許(要約、請求項、明細書、発明者、譲受人付き)
* 制定法、規則、行政機関のガイダンス
* 制裁リストおよびウォッチリスト
* 政府契約および調達記録
* 国勢調査データおよびその他の公的統計記録

<div id="use-it-for">
  ## 主な用途
</div>

* 判例リサーチと法務向けRAG
* 規制・政策のモニタリング
* 先行技術調査およびFTO(侵害予防)調査
* コンプライアンススクリーニングとデューデリジェンス
* 公共部門の市場リサーチ

<div id="example-queries">
  ## クエリの例
</div>

<div id="find-case-law">
  ### 判例を検索する
</div>

判例の引用表記ではなく、法的な論点と管轄区域を平易な言葉で記述してください。

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

<div id="search-patents">
  ### 特許を検索する
</div>

請求項のように、発明が何をするものかを記述してください。

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="screen-against-sanctions">
  ### 制裁リストとの照合
</div>

照合に使うリストと、対象となるエンティティの種類を指定してください。

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

<div id="research-government-spending">
  ### 政府支出をリサーチする
</div>

調達を行う機関またはサービスカテゴリと、対象期間を指定します。

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

<div id="pull-public-statistics">
  ### 公的統計を取得する
</div>

データセットと対象地域を指定します。

<PlaygroundQuery query="census tract population change in the Austin metro area" />

<div id="make-a-request">
  ## リクエストを送信する
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "California appellate decisions on non-compete enforceability",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "California appellate decisions on non-compete enforceability",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "California appellate decisions on non-compete enforceability",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Exa Agentで構造化データを取得する
</div>

複数のソースにまたがるリサーチが必要な構造化データを取得するには、[Exa Agentのタスク実行](/ja/docs/agent/quickstart)を使用します。必要な管轄区域、記録の種類、条件、出力フィールドを指定すると、Agentがスキーマ検証済みの結果を引用付きで返します。

<Card title="Agentタスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agentガイドを開く" arrow="true">
  複数の種類の記録を横断してエンティティをスクリーニングしたり、一次資料や報道をもとに規制の変更を追跡したりできます。
</Card>