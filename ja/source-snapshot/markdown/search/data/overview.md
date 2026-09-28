> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="data-index">
  # データインデックス
</div>

> Exa が公開ウェブとプライベートデータソースにわたってインデックス化している対象について説明します。

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

Exa は公開ウェブと厳選された非公開データソースを検索対象としており、カバー範囲は継続的に更新されています。主な内容は次のとおりです。

<AccordionGroup>
  <Accordion title="ニュース" icon="newspaper">
    <Card title="ニュースガイド" icon="newspaper" href="/ja/docs/search/data/news" cta="ガイドを読む" arrow="true">
      ニュース検索のユースケース、例、ベストプラクティスを紹介します。
    </Card>

    ニュースと記事:

    <PlaygroundQuery query="今月公開された EU AI 法の施行スケジュールに関する報道" />

    ブログ記事とまとめ記事:

    <PlaygroundQuery query="Postgres から ClickHouse への移行に関するエンジニアリングブログの記事" />

    ポッドキャストと動画の文字起こし:

    <PlaygroundQuery query="創業者が価格戦略の失敗について語っているポッドキャストのエピソード" />

    アドバースメディア (ネガティブ報道) :

    <PlaygroundQuery query="ペイデイローン企業に関する否定的な報道や規制当局への苦情" />
  </Accordion>

  <Accordion title="コードとドキュメント" icon="code">
    <Card title="コードとドキュメントのガイド" icon="code" href="/ja/docs/search/data/code" cta="ガイドを読む" arrow="true">
      コード検索のユースケース、例、ベストプラクティスを紹介します。
    </Card>

    GitHub リポジトリ:

    <PlaygroundQuery query="open source Rust libraries for vector similarity search" />

    API ドキュメントと開発者向けドキュメント:

    <PlaygroundQuery query="Stripe webhook signature verification documentation" />

    パッケージレジストリ(正確なバージョン情報やリリース詳細を含む):

    <PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

    エージェントスキルのディレクトリ:

    <PlaygroundQuery query="agent skills for extracting tables from PDFs" />
  </Accordion>

  <Accordion title="企業と人物" icon="users">
    <Card title="企業・人物ガイド" icon="users" href="/ja/docs/search/data/companies-people" cta="ガイドを読む" arrow="true">
      企業や人物、およびその関係性を見つける方法を説明します。
    </Card>

    企業の発見と事業シグナル:

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    役職、スキル、所在地で絞り込んだ職務経歴プロフィール:

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    所属企業の条件で絞り込んだ人物:

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    企業と関係者を 1 つのクエリでまとめて調査:

    <PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />
  </Accordion>

  <Accordion title="金融市場" icon="chart-line">
    <Card title="金融市場ガイド" icon="chart-line" href="/ja/docs/search/data/financial" cta="ガイドを読む" arrow="true">
      株価、開示書類、決算説明会、市場調査のユースケースを紹介します。
    </Card>

    株価、アナリスト予想、財務報告書：

    <PlaygroundQuery query="analyst price targets for NVIDIA after its most recent earnings" />

    SEC 提出書類、決算説明会、海外の開示書類：

    <PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" />

    発表済みの資金調達情報やその他の公開データ：

    <PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

    公表済みの経済データや政府統計：

    <PlaygroundQuery query="most recent US CPI release and month-over-month change" />
  </Accordion>

  <Accordion title="研究論文" icon="book-open">
    <Card title="研究論文・学術出版物ガイド" icon="book-open" href="/ja/docs/search/data/research" cta="ガイドを読む" arrow="true">
      論文、特許、臨床、規制分野における研究のユースケースを紹介します。
    </Card>

    研究論文、特許、研究助成金:

    <PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" />

    臨床試験と薬物相互作用:

    <PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

    規制当局・保健当局による承認:

    <PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />
  </Accordion>

  <Accordion title="法的文書・公的記録" icon="scale">
    <Card title="法務・公的記録ガイド" icon="scale" href="/ja/docs/search/data/legal" cta="ガイドを読む" arrow="true">
      判例、特許、制裁、公的記録のユースケースを紹介します。
    </Card>

    法的記録・裁判記録:

    <PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

    制裁・ウォッチリスト:

    <PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

    公開されている政府契約:

    <PlaygroundQuery query="federal contracts awarded for cloud migration services" />

    国勢調査などの公的記録:

    <PlaygroundQuery query="census tract population change in the Austin metro area" />
  </Accordion>

  <Accordion title="スポーツ・天気・地域情報" icon="map-pin">
    <Card title="スポーツ・天気・場所ガイド" icon="map-pin" href="/ja/docs/search/data/sports-weather-places" cta="ガイドを読む" arrow="true">
      リアルタイムのスポーツデータ、天気予報、地域情報をクエリする方法を説明します。
    </Card>

    リアルタイムのスコア、順位表、試合日程：

    <PlaygroundQuery query="NBA scores last night" />

    任意の場所と日付の天気予報：

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    地域の店舗、施設、物件：

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />
  </Accordion>

  <Accordion title="サイバーセキュリティ" icon="shield">
    <Card title="サイバーセキュリティガイド" icon="shield" href="/ja/docs/search/data/security" cta="ガイドを読む" arrow="true">
      脆弱性、アドバイザリ、ベンダーリスクに関するユースケースを紹介します。
    </Card>

    セキュリティアドバイザリ：

    <PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

    CVE および GHSA の脆弱性データベース：

    <PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

    データ処理の再委託先 (サブプロセッサー) リストとトラストページ：

    <PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />
  </Accordion>
</AccordionGroup>

これらのガイドでは一般的なデータパターンを紹介していますが、Exa はそれ以外にも、さまざまなサイト、形式、言語にわたる幅広い公開ウェブを検索対象としています。