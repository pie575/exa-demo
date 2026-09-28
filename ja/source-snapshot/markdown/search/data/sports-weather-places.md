> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# スポーツ、天気、場所 {#sports-weather-places}

> Exa Search で、リアルタイムのスポーツデータ、天気予報、周辺の場所を検索できます。

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

Exa Search を使えば、ライブのスポーツデータ、天気予報、地域情報を、それぞれ個別の API と連携することなく取得できます。知りたいチーム、場所、期間を含めて、自然言語で質問してください。

## より良いクエリを書く {#write-better-queries}

場所やチームは正確に指定し、答えが時間とともに変わる場合は必ず日付を含めてください。漠然とした情報を求めるのではなく、タスクにとって重要な条件や属性を加えましょう。

<Tabs>
  <Tab title="スポーツ" icon="trophy">
### 対象データ {#included}

    利用可能なスポーツデータ:

    * **スコア**: 特定の日におけるリーグの試合情報 (チーム、スコア、ステータス、開始時刻、会場を含む)
    * **順位表**: カンファレンス別またはディビジョン別の内訳を含む最新のリーグ順位表
    * **スケジュール**: リーグまたはチームの過去の試合結果と今後の試合予定

    対象範囲は、NBA、WNBA、NFL、MLB、NHL、MLS、大学バスケットボールおよびフットボール、欧州の主要サッカーリーグと UEFA 大会、クリケット、F1、UFC、テニス、ゴルフです。

### リーグ、チーム、時期を指定する {#ask-for-the-league-team-and-time}

    <PlaygroundQuery query="NBA scores last night" />

    <PlaygroundQuery query="Lakers schedule this week" />

### 関連する報道もあわせて求める {#add-the-surrounding-story}

    ライブデータに加えて、必要な報道記事も指定しましょう。

    <PlaygroundQuery query="NBA injury reports ahead of tonight's games" />
  </Tab>

  <Tab title="天気" icon="cloud-sun">
### 対象データ {#included-2}

    予報には、天候、最高気温と最低気温、降水量、風、湿度、UV 指数、および現地時間での日の出と日の入りの時刻が含まれます。

    日付を指定しないクエリでは、今日の予報が返されます。特定の日または期間を指定すると、1 日につき 1 ページが返されます (最大 16 日先から 92 日前まで) 。

### 場所と日付を指定する {#name-the-place-and-day}

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

### 予定に影響する条件について尋ねる {#ask-about-the-condition-that-affects-your-plan}

    <PlaygroundQuery query="will it rain in Austin this weekend" />

### 予報と報道を組み合わせる {#combine-forecasts-with-reporting}

    <PlaygroundQuery query="hurricane forecast tracks for the Gulf Coast this week" />
  </Tab>

  <Tab title="場所" icon="map-pin">
### 対象データ {#included-3}

    * 住所、営業時間、設備、レビューを含む地元店舗・事業者のプロフィール
    * 会場、観光名所、スポット
    * 不動産物件情報と不動産登記記録
    * ゾーニングの決定、許認可、都市計画の記録

### 地元の人に尋ねるように場所を説明する {#describe-the-place-like-you-would-ask-a-local}

    カテゴリ、エリア、重視する条件を組み合わせましょう。

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />

### 記録の種類と地域を指定する {#name-the-record-type-and-geography}

    <PlaygroundQuery query="multifamily zoning variances approved in Denver" />

### 現実的な条件で場所を比較する {#compare-places-against-practical-constraints}

    <PlaygroundQuery query="walkable neighborhoods in Austin with good public schools and under 30 minutes to downtown" />
  </Tab>
</Tabs>

## リクエストを送信する {#make-a-request}

3種類のデータはいずれも同じ Search エンドポイントを使用します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "weather in San Francisco tomorrow",
      type="auto",
      num_results=5,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("weather in San Francisco tomorrow", {
    type: "auto",
    numResults: 5,
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "weather in San Francisco tomorrow",
      "type": "auto",
      "numResults": 5
    }'
  ```
</CodeGroup>

## Exa Agent で構造化データを取得する {#get-structured-data-with-exa-agent}

複数のソースにまたがる調査が必要な構造化データを取得するには、[Exa Agent タスクの実行](/ja/docs/agent/quickstart)を使用します。必要な場所、チーム、日付、条件、出力フィールドを指定すると、Agent がスキーマ検証済みの結果を引用付きで返します。

<Card title="Agent タスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agent ガイドを開く" arrow="true">
  場所の比較、試合当日のブリーフィングの作成、地域の詳細情報とコンディションを組み合わせた構造化結果の生成などが行えます。
</Card>