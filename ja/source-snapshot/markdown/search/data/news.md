> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# ニュース {#news}

> Exa Search で、最新の報道、業界に関する報道や論評、注目され始めたニュースを見つけましょう。

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

主要な報道機関、業界専門誌、ニッチなメディアの記事を探すには Exa Search を使用します。新しい記事は公開から数分以内に検索できるようになります。公開期間を厳密に指定する必要がある場合は、自然言語のクエリと日付フィルターを組み合わせてください。

## 主な用途 {#use-it-for}

* 市場調査・投資リサーチ
* サイバーセキュリティ・脅威インテリジェンス
* 企業、製品、競合他社のモニタリング
* 業界ブリーフィング・時事問題のリサーチ

## クエリの例 {#example-queries}

### 進展中の政策ニュースを追う {#follow-a-developing-policy-story}

トピック、ソースタイプ、公開期間を指定すると、ニュースの最新の展開に絞った結果が得られます。

<PlaygroundQuery query="news coverage of the EU AI Act enforcement timeline published this month" />

### 実務者による分析を探す {#find-practitioner-analysis}

一般的なニュース報道ではなく、実務者による分析を求める場合は、ソースタイプを明示しましょう。

<PlaygroundQuery query="engineering blog posts about migrating from Postgres to ClickHouse" />

### 特定の形式で行われた議論を探す {#discover-discussions-in-a-specific-format}

クエリには形式とテーマの両方を含めてください。そうすれば、Web 上のエピソードページやトランスクリプトまで幅広く検索対象にできます。

<PlaygroundQuery query="podcast episodes where founders discuss pricing strategy mistakes" />

### アドバースメディアを調査する {#research-adverse-media}

ネガティブなシグナルと、調査対象のエンティティの種類の両方を記述してください。クエリを企業名に「news」という単語を加えただけのものにするのは避けてください。

<PlaygroundQuery query="negative press and regulatory complaints about payday lending companies" />

## リクエストを送信する {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "news articles about AI regulation updates in the European Union",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "news articles about AI regulation updates in the European Union",
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
      "query": "news articles about AI regulation updates in the European Union",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Exa Agent で構造化データを取得する {#get-structured-data-with-exa-agent}

複数のソースにまたがるリサーチが必要な構造化データを取得するには、[Exa Agent のタスク実行](/ja/docs/agent/quickstart)を使用します。必要な記事、フィールド、対象期間を指定すると、Agent がスキーマ検証済みの結果を引用付きで返します。

<Card title="Agent タスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agent ガイドを開く" arrow="true">
  出典付きのニュースブリーフの作成、報道内容の比較、進行中のニュースからの正規化された事実の抽出などが行えます。
</Card>