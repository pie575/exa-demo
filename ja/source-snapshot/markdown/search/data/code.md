> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# コードとドキュメント {#code-docs}

> Exa Search で、コード、技術ドキュメント、実装ガイダンスを検索できます。

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

Exa Search を使うと、リポジトリ、技術ドキュメント、パッケージ情報、実装のガイダンスを自然言語のクエリで検索できます。

<Tip>
  Exa がコーディングタスクにおける検索の精度をどのように評価しているかについては、[WebCode: Search Evals for Coding Agents](https://exa.ai/blog/webcode)
  をご覧ください。
</Tip>

## 主な用途 {#use-it-for}

* コーディングエージェントやコード生成ツール
* 開発者向けの検索サービスやドキュメント製品
* デバッグ、移行、設定などのワークフロー
* リポジトリ、ドキュメント、パッケージレジストリを横断した技術調査

## クエリの例 {#example-queries}

### 機能からライブラリを探す {#discover-libraries-by-capability}

必要な機能、エコシステム、制約条件を記述してください。正確なプロジェクト名に頼らず、ライブラリの機能をもとに候補を取得できます。

<PlaygroundQuery query="open source Rust libraries for vector similarity search" />

### 実装ドキュメントを取得する {#retrieve-implementation-documentation}

製品名と具体的な操作を明記してください。そうすれば、検索時に一般的な議論よりも API ドキュメントや実装ガイドが優先されます。

<PlaygroundQuery query="Stripe webhook signature verification documentation" />

### バージョン固有の変更を確認する {#check-version-specific-changes}

互換性が重要な場合は、クエリにリリースチャネルやバージョンを含めてください。古いリリースに関する結果を減らせます。

<PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

### 再利用可能なエージェント用ツールを探す {#find-reusable-agent-tooling}

「AI tools」のような漠然としたフレーズで検索するのではなく、成果物の種類とタスクを具体的に指定してください。

<PlaygroundQuery query="agent skills for extracting tables from PDFs" />

## リクエストを送信する {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "how to use Exa search in python",
      type="fast",
      num_results=10,
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "how to use Exa search in python",
    {
      type: "fast",
      numResults: 10,
      contents: {
        highlights: true,
      },
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "how to use Exa search in python",
      "type": "fast",
      "numResults": 10,
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

## Exa Agent で構造化データを取得する {#get-structured-data-with-exa-agent}

複数のソースを横断した調査が必要な構造化データには、[Exa Agent のタスク実行](/ja/docs/agent/quickstart)を使用します。必要なライブラリ、技術的な条件、出力フィールドを記述すると、Agent がスキーマ検証済みの結果を引用付きで返します。

<Card title="Agent タスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agent ガイドを開く" arrow="true">
  ライブラリを比較したり、リポジトリのレコードを補完したり、複数の技術的シグナルから構造化リストを作成したりできます。
</Card>