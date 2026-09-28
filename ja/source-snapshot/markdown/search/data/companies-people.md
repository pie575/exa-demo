> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの完全版は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# 企業と人物 {#companies-people}

> Exa Search で、企業や職務プロフィール、そしてそれらの関係性を検索できます。

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

Exa Search を使って、組織とそれに関係する人物を検索できます。これらの検索は組み合わせて使うと最も効果的です。人物を絞り込む条件となる企業特性や、企業の運営実態がわかる人物・役職を記述してください。

<Columns cols={2}>
  <Card title="企業検索ベンチマーク" icon="building" href="https://exa.ai/blog/company-search-benchmarks">
    Exa による企業情報の検索と事実抽出の評価方法をご覧ください。
  </Card>

  <Card title="人物検索ベンチマーク" icon="users" href="https://exa.ai/blog/people-search-benchmark">
    Exa による特定人物の検索とプロフィール発見の評価方法をご覧ください。
  </Card>
</Columns>

## 主な用途 {#use-it-for}

* 企業、候補者、専門家の発掘
* アカウントリサーチとステークホルダーマッピング
* マーケットマップの作成、投資リサーチ、ディールソーシング
* 経営陣、採用動向、組織に関するリサーチ

## より良いクエリを書く {#write-better-queries}

まず目的のエンティティを指定し、次にそれを絞り込む特性や関係性を加えます。企業のホームページ、職務プロフィール、求人情報、個人のウェブサイトなど、ソースの種類が重要な場合はそれも指定してください。

<Tabs>
  <Tab title="企業" icon="building">
### 事業内容から企業を見つける {#discover-companies-by-what-they-do}

    市場を定義する顧客、製品、ケイパビリティ、成長段階、地域を記述します。これにより、あらかじめ用意した企業リストに頼らず、事業内容に基づいて候補を見つけられます。

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

### 事業シグナルを見つける {#find-operating-signals}

    対象のシグナルと、重視する企業の特性を指定します。Search では、企業ページに加えて求人情報、料金ページ、製品ドキュメント、報道記事も取得できます。

    <PlaygroundQuery query="remote staff engineer roles at Series B fintech companies" />

### 資金調達の動向をリサーチする {#research-funding-activity}

    ラウンド、業界、参加者、期間を指定します。

    <PlaygroundQuery query="investors who led seed rounds in robotics in the last year" />
  </Tab>

  <Tab title="人物" icon="users">
### 役職とスキルから人物を見つける {#discover-people-by-role-and-skills}

    役職、職位、所在地、関連スキル、目的のソースの種類を組み合わせます。

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

### 企業の特性で人物を絞り込む {#qualify-people-by-company-traits}

    人物と企業の関係性、および企業を絞り込む特性を記述します。先に企業リストを作成するよりも効果的です。

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

### 個人のウェブサイトや公開された成果を見つける {#find-personal-websites-and-public-work}

    職業や研究分野を指定し、個人のウェブサイト、講演、インタビュー、記事といった対象を明示します。

    <PlaygroundQuery query="personal blogs of distributed systems researchers" />
  </Tab>
</Tabs>

## 両方をまとめて検索する {#search-both-together}

必要な関係性を表現したクエリを1つ作成します。Exa は、企業ページ、職務プロフィール、採用ページ、公開情報での言及を1つの結果セットにまとめて返すことができます。

<PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />

## リクエストを送信する {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "heads of security at Series B healthcare software companies that sell to hospitals",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "heads of security at Series B healthcare software companies that sell to hospitals",
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
      "query": "heads of security at Series B healthcare software companies that sell to hospitals",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Exa Agentで構造化データを取得する {#get-structured-data-with-exa-agent}

複数のソースを横断したリサーチが必要な構造化データには、[Exa Agentのタスク実行](/ja/docs/agent/quickstart)を使用します。必要な企業、人物、選定条件、出力フィールドを指定すると、Agentがスキーマ検証済みの結果を引用付きで返します。

<Card title="Agentタスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agentガイドを開く" arrow="true">
  企業や人物のリストを作成して絞り込み、複数のソースから収集したフィールドで各レコードを補完します。
</Card>