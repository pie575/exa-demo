> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 個別のページを参照する前に、このファイルで利用可能なすべてのページを確認してください。

# 金融市場 {#financial-markets}

> Exa Search を使って、市場データ、開示書類、決算説明会、経済指標の発表を検索できます。

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

Exa Search を使えば、株価、開示書類、トランスクリプト、およびそれらに関する報道を 1 つのクエリでまとめて取得できます。ティッカーについて質問すれば、株価、直近の決算説明会、アナリストのカバレッジが一度に返されます。

## 含まれる内容 {#included}

* 株式、暗号資産、外国為替、株価指数、先物、オプション、コモディティの相場情報と直近の価格履歴
* 主要統計と日次 OHLCV 履歴を含む銘柄プロファイル
* 決算説明会のトランスクリプト (冒頭説明と質疑応答を発言者別に収録)
* SEC 開示書類、公表済みの財務データ、海外の開示書類
* アナリスト予想、資金調達の発表、経済指標の発表

## 主な用途 {#use-it-for}

* 株式・クレジットのリサーチ
* KYC、KYB、アドバースメディアのスクリーニング
* ポートフォリオおよび政策のモニタリング
* ディールソーシングと未公開市場のリサーチ

## クエリの例 {#example-queries}

### 株価を調べる {#look-up-a-quote}

ティッカーまたは企業名と、知りたい数値を指定してください。`$NVDA` のようなキャッシュタグも使えます。

<PlaygroundQuery query="NVIDIA stock price and change today" />

### 決算説明会の内容を読む {#read-an-earnings-call}

企業名と四半期を指定すると、決算説明会に関する報道ではなく、トランスクリプトそのものを取得できます。

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

### 開示書類を検索する {#search-filings}

フォームの種類だけでなく、探している開示内容を具体的に記述してください。`financial report` カテゴリを指定すると、結果が開示書類やレポートに絞り込まれます。

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

### 未公開市場の動向を追跡する {#track-private-market-activity}

ラウンド、セクター、期間を指定します。

<PlaygroundQuery query="今四半期に発表された気候テック分野のシリーズBラウンド" />

### 経済指標を追跡する {#follow-economic-data}

対象となる統計の名称と、そこから取得したい数値を指定します。

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

## リクエストを送信する {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "10-K risk factors that mention dependency on third-party AI models",
      type="auto",
      category="financial report",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "10-K risk factors that mention dependency on third-party AI models",
    {
      type: "auto",
      category: "financial report",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "10-K risk factors that mention dependency on third-party AI models",
      "type": "auto",
      "category": "financial report",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Exa Agent で構造化データを取得する {#get-structured-data-with-exa-agent}

複数の情報源にまたがる調査が必要な構造化データを取得するには、[Exa Agent のタスク実行](/ja/docs/agent/quickstart)を使用します。必要な銘柄、期間、条件、出力フィールドを指定すると、Agent がスキーマ検証済みの結果を引用付きで返します。

<Card title="Agent タスクを開始する" icon="bot" href="/ja/docs/agent/quickstart" cta="Agent ガイドを開く" arrow="true">
  企業のスクリーニングや開示書類の比較、ポートフォリオ全体を対象とした構造化レポートの作成に活用できます。
</Card>