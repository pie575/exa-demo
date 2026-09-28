> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="cybersecurity">
  # サイバーセキュリティ
</div>

> Exa Search を使って、脆弱性情報、セキュリティアドバイザリ、脅威レポート、トラスト関連のドキュメントを検索できます。

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

Exa Search を使えば、セキュリティチームが普段から参照している情報源から、脆弱性レコード、ベンダーのアドバイザリ、脅威リサーチを検索できます。

<div id="included">
  ## 対象範囲
</div>

* CVE および GHSA の脆弱性レコード
* ベンダーのセキュリティアドバイザリとパッチノート
* 脅威インテリジェンスレポートとインシデントレポート
* トラストページ、サブプロセッサー一覧、コンプライアンス関連ドキュメント
* セキュリティブログ、カンファレンス講演、リサーチ

<div id="use-it-for">
  ## 主な用途
</div>

* 脆弱性のトリアージとリスク露出の評価
* 脅威インテリジェンスと攻撃者の追跡
* ベンダーリスクおよびサードパーティのセキュリティ評価
* セキュリティ監視とアラート

<div id="example-queries">
  ## クエリの例
</div>

<div id="triage-a-vulnerability-class">
  ### 脆弱性クラスのトリアージ
</div>

製品名、バージョン範囲、深刻度を指定します。

<PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

<div id="find-vendor-advisories">
  ### ベンダーのセキュリティアドバイザリを検索する
</div>

特定の CVE ID を 1 つ指定するのではなく、悪用状況と製品カテゴリを記述してください。

<PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

<div id="review-a-vendors-security-posture">
  ### ベンダーのセキュリティ体制を評価する
</div>

ドキュメントの種類とベンダーのカテゴリを指定します。

<PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />

<div id="research-an-adversary">
  ### 攻撃者を調査する
</div>

対象のグループ名またはキャンペーン名と、関心のある手法や業種を指定します。

<PlaygroundQuery query="reports on ransomware groups targeting healthcare providers this year" />

<div id="make-a-request">
  ## リクエストを送信する
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "critical CVEs affecting Apache Struts 6.x",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "critical CVEs affecting Apache Struts 6.x",
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
      "query": "critical CVEs affecting Apache Struts 6.x",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Exa Agent で構造化データを取得する
</div>

複数の情報源を横断したリサーチが必要な構造化データには、[Exa Agent のタスク実行](/ja/docs/agent/quickstart)を使用します。対象の製品、脅威の条件、必要な出力フィールドを記述すると、Agent がスキーマ検証済みの結果を引用付きで返します。

<Card title="Agent タスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agent ガイドを開く" arrow="true">
  セキュリティアドバイザリ、侵害報告、トラストページを横断してベンダーを審査したり、正規化された脆弱性データを収集したりできます。
</Card>