> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Exa Search API {#exa-search-api}

> 自然言語でWebを検索し、関連性の高いページコンテンツを整形済みの状態で1回のリクエストで取得できます。

Exa Search は自然言語のクエリを受け取り、整形済みのページコンテンツを含むWeb検索結果をランク順に返します。

## 最初のリクエストを送信する {#make-your-first-request}

まずは自然言語の `query` と `contents: { highlights: true }` を指定してみましょう。各結果の関連度に応じた長さの抜粋が返されます。その他のフィールドでは、Exa の検索方法や各結果に含める内容を制御できます。このページでは以降、実際によく使うフィールドを解説します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "recent techniques for improving retrieval in RAG systems",
      type="auto",
      contents={"highlights": True},
  )

  for item in result.results:
      print(item.title, item.url)
      print(item.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "recent techniques for improving retrieval in RAG systems",
    {
      type: "auto",
      contents: { highlights: true }
    }
  );

  for (const item of result.results) {
    console.log(item.title, item.url);
    console.log(item.highlights);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "recent techniques for improving retrieval in RAG systems",
      "type": "auto",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Search はデフォルトで最大 10 件の結果を返します。`numResults` を設定すると最大 100 件までリクエストできますが、関連するページが少ない場合は返される件数が少なくなることがあります。Search はページネーションに対応していません。

<Accordion title="レスポンスの例">
  highlights と以下のリストは一部省略しています。

  ```json theme={null}
  {
    "requestId": "c3174df2b9cd5afbc64cdf79f3719b19",
    "resolvedSearchType": "",
    "results": [
      {
        "id": "https://arxiv.org/html/2608.21702",
        "title": "From Association to Causation: Improving Retrieval Precision ofRetrieval-Augmented Generation via Causal Relations and an Attention Mechanism",
        "url": "https://arxiv.org/html/2608.21702",
        "highlights": [
          "Retrieval-Augmented Generation (RAG) grounds LLM generation on retrieved documents, but the standard terminal retrieval stage—dense-vector similarity, optionally followed by reranking—often returns documents that merely share keywords with the query without containing the needed information...\n..."
        ],
        "image": "https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg",
        "favicon": "https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png"
      },
      {
        "id": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "title": "Four retrieval techniques to improve RAG you need to know",
        "url": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "publishedDate": "2025-04-14T00:00:00.000Z",
        "highlights": [
          "It's not surprising, then, that we've seen a range of different approaches emerge that attempt to address RAG's limitations over the last year or so.\n..."
        ],
        "image": "https://www.thoughtworks.com/content/dam/thoughtworks/images/illustration/brand/tw_illustration_5.jpg"
      }
    ],
    "searchTime": 1324.3,
    "costDollars": {
      "total": 0.007,
      "search": {
        "neural": 0.007
      }
    }
  }
  ```
</Accordion>

結果は関連度の高い順に並びます。各結果には、タイトル、URL、公開日などのメタデータに加えて、`contents` でリクエストした内容が含まれます。

## クエリの書き方 {#writing-queries}

Search API を使用する際に必須のフィールドは `query` フィールドのみです。

クエリは自然言語で記述してください。主題を含め、必要に応じて対象とするソースの種類や期間も指定します。

クエリは幅広く探索的なものでもかまいません。`"Latest news on EU battery policy"` であれば、Exa が関連ページを見つけるのに十分な意図が伝わりますが、`"news"` だけでは伝わりません。ソースタイプが重要な場合は、クエリ内で明示してください。

```text theme={null}
RAGシステムにおけるハイブリッド検索とセマンティック検索を比較した最近の技術記事
```

Exa のインデックスに含まれる内容と、それらのコンテンツタイプを検索する方法については、[Exa のインデックスの内容](/ja/docs/search/data/overview)を参照してください。

<h2 id="search-types">
  検索タイプを選択する
</h2>

`type` は検索モードを選択するパラメーターです。各モードは、速度、検索の深さ、合成のバランスがそれぞれ異なるように調整されています。デフォルトは `auto` で、ほとんどの検索に適しています。

| タイプ              | 使用する場面                                |
| ---------------- | ------------------------------------- |
| `auto`           | 品質と速度のバランスに最も優れたデフォルト設定を使いたい場合        |
| `fast`           | レイテンシを重視するリクエストの場合                    |
| `instant`        | オートコンプリートや音声など、リアルタイム処理が求められるリクエストの場合 |
| `deep-lite`      | 軽量なリサーチと合成が必要なタスクの場合                  |
| `deep`           | 複数ステップの検索と、より高度な合成が必要なタスクの場合          |
| `deep-reasoning` | レイテンシよりも網羅性と推論の深さを重視する場合              |

Deep モードでは、1 回の取得処理ではなく、リサーチプロセスが実行されます。このプロセスの仕組みと追加の制御オプションの使い方については、[Deep Search](/ja/docs/search/deep-search) を参照してください。

<Tip>
  長時間にわたるリサーチ、リスト作成、マルチホップのエンリッチメントには、`deep-reasoning` ではなく [Exa Agent](/ja/docs/agent/quickstart) を使用してください。Agent は run あたりに割り当てられる計算リソースが多く、根拠に基づいた構造化された結果を返します。
</Tip>

## 出力形式 {#output-shapes}

すべての結果には、タイトル、URL、公開日などのメタデータが含まれます。`contents` を使用すると、ページのハイライト、全文、または要約を追加できます。

<Tabs>
  <Tab title="ハイライト">
    ハイライトは、クエリに最も関連性の高い抜粋を返します。各ページの無関係な部分でコンテキストウィンドウを埋めることなく、
    モデルやエージェントに必要な根拠を提供できます。

    ほとんどのタスクでは、この出力形式をおすすめします。

    まずは `highlights: true` だけを指定してください。Exa がクエリに基づいて、各結果から適切な量の
    コンテンツを選択します。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "How are inference providers reducing transformer latency?",
          contents={"highlights": True},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "How are inference providers reducing transformer latency?",
        { contents: { highlights: true } }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "How are inference providers reducing transformer latency?",
          "contents": { "highlights": true }
        }'
      ```
    </CodeGroup>

    Dynamic Highlights の詳細と有効にすべき場面については、[ハイライト](/ja/docs/search/highlights)を参照してください。
  </Tab>

  <Tab title="全文">
    全文は、不要な要素を除いたページ本文を返します。より広いコンテキストやドキュメントの構造、
    あるいはクエリに絞った抜粋には含まれない可能性のある詳細がタスクに必要な場合に使用してください。

    ページ全体はサイズが大きくなる場合があります。結果の件数とページごとに返すテキスト量の両方を制限してください。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "Technical postmortems of large-scale inference outages",
          num_results=5,
          contents={"text": {"max_characters": 10000}},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "Technical postmortems of large-scale inference outages",
        {
          numResults: 5,
          contents: { text: { maxCharacters: 10000 } }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "Technical postmortems of large-scale inference outages",
          "numResults": 5,
          "contents": {
            "text": { "maxCharacters": 10000 }
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

コンテンツビューは、1回のリクエストにつき1つだけ選択してください。ハイライトとテキストの両方をリクエストすると、同じページについて2つのビューが返され、その両方に課金されます。3つ目の選択肢として `summary` もありますが、結果ごとに言語モデルの呼び出しが追加で発生します。

<Warning>
  `/search` と `/contents` は同じコンテンツオプションを受け付けますが、指定する位置が異なります。

  * **`/search`** では、`highlights`、`text`、`summary` を `contents` オブジェクト内にネストします:
    `"contents": { "highlights": true }`
  * **`/contents`** には `contents` ラッパーがありません。ボディそのものがコンテンツオプションになるため、
    同じフィールドを `urls` と同じトップレベルに配置します: `"urls": [...], "highlights": true`
</Warning>

## 出力スキーマ {#output-schema}

Exa に検索結果を統合・要約させたい場合は、`outputSchema` を追加します。すべての検索タイプに対応しており、レスポンスに `output` オブジェクトが追加されます。

ランク付けされたページは、これまでどおり `results` に含まれます。生成された値は `output.content` で返され、フィールド単位のソースと信頼度は `output.grounding` に含まれます。

<Tabs>
  <Tab title="自由形式のテキスト">
    文章を生成する場合は `type: "text"` を使用します。形式や長さを指定するには `description` を追加します。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "What changed in the latest EU battery policy?",
          output_schema={
              "type": "text",
              "description": "Summarize the changes in three concise bullets",
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "What changed in the latest EU battery policy?",
        {
          outputSchema: {
            type: "text",
            description: "Summarize the changes in three concise bullets"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "What changed in the latest EU battery policy?",
          "outputSchema": {
            "type": "text",
            "description": "Summarize the changes in three concise bullets"
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="構造化 JSON">
    定義したプロパティと必須項目に沿った JSON を取得するには `type: "object"` を使用します。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "AI infrastructure companies that announced Series A or B funding in the past six months",
          output_schema={
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "maxItems": 10,
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "round": {"type": "string"},
                              "amount": {"type": "string"},
                              "announcedDate": {
                                  "type": "string",
                                  "description": "The funding announcement date",
                              },
                              "leadInvestors": {
                                  "type": "array",
                                  "items": {"type": "string"},
                              },
                          },
                          "required": ["name", "round", "amount", "announcedDate"],
                      },
                  }
              },
              "required": ["companies"],
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "AI infrastructure companies that announced Series A or B funding in the past six months",
        {
          outputSchema: {
            type: "object",
            properties: {
              companies: {
                type: "array",
                maxItems: 10,
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    round: { type: "string" },
                    amount: { type: "string" },
                    announcedDate: {
                      type: "string",
                      description: "The funding announcement date"
                    },
                    leadInvestors: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            required: ["companies"]
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "AI infrastructure companies that announced Series A or B funding in the past six months",
          "outputSchema": {
            "type": "object",
            "properties": {
              "companies": {
                "type": "array",
                "maxItems": 10,
                "items": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "round": { "type": "string" },
                    "amount": { "type": "string" },
                    "announcedDate": {
                      "type": "string",
                      "description": "The funding announcement date"
                    },
                    "leadInvestors": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            "required": ["companies"]
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

ソースの優先設定や重視するポイントなどの指示には `systemPrompt` を、レスポンスの構造には `outputSchema` を使用します。Python では `system_prompt` と `output_schema` を使用します。

<Note>
  オブジェクトのスキーマは小さく保ってください。サポートされるのはネスト 2 階層まで、プロパティ 10 個までです。スキーマに
  引用や信頼度のフィールドを追加する必要はありません。これらは Exa が `output.grounding` で自動的に返します。
</Note>

## 結果を絞り込む {#filter-results}

フィルターは厳格な制約です。条件から外れた結果では役に立たない場合にフィルターを追加し、ソースに関する緩やかな希望はクエリのテキストに含めてください。利用可能なフィルターの一覧は [API リファレンス](/ja/docs/reference/search)を参照してください。

### ドメインまたはパスを指定して絞り込む {#include-domains-or-paths}

`includeDomains` を使うと、結果を信頼できるソースに限定できます。完全なドメイン、`anthropic.com/news` のようなパスプレフィックス、`*.substack.com` のようなサブドメインのワイルドカードを指定できます。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "new model releases",
      include_domains=["openai.com", "anthropic.com/news"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("new model releases", {
    includeDomains: ["openai.com", "anthropic.com/news"],
    contents: { highlights: true }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "new model releases",
      "includeDomains": ["openai.com", "anthropic.com/news"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

パスはフィルターで指定し、クエリ内に `site:` 演算子として重複して記述しないでください。

### ドメインまたはパスを除外する {#exclude-domains-or-paths}

`excludeDomains` は、特定のドメインまたはパスからの結果を除外します。`includeDomains` と同じく、パスプレフィックスとサブドメインのワイルドカードに対応しています。優先度を示すためではなく、該当するソースが含まれると結果が使えなくなる場合に使用してください。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "primary research on retrieval-augmented generation benchmarks",
      exclude_domains=["medium.com", "dev.to"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "primary research on retrieval-augmented generation benchmarks",
    {
      excludeDomains: ["medium.com", "dev.to"],
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "primary research on retrieval-augmented generation benchmarks",
      "excludeDomains": ["medium.com", "dev.to"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

## コンテンツの鮮度 {#content-freshness}

`contents.maxAgeHours` は、各結果から抽出するコンテンツに求める鮮度を制御します。公開日で結果をフィルタリングするものではありません。

| 値    | 動作                                                  |
| ---- | --------------------------------------------------- |
| 省略   | キャッシュ済みのコンテンツがあればそれを使用し、必要に応じてページを取得します             |
| 正の整数 | キャッシュ済みのコンテンツが指定した時間より新しければそれを使用し、それ以外の場合はページを取得します |
| `0`  | 常に最新のコンテンツを取得します                                    |
| `-1` | キャッシュ済みのコンテンツのみを使用します                               |

通常の検索では、このフィールドを省略してください。価格、在庫状況、頻繁に更新されるページなど、古いページコンテンツでは役に立たない場合に設定します。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "current pricing for serverless GPU providers",
      contents={
          "highlights": True,
          "max_age_hours": 24,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("current pricing for serverless GPU providers", {
    contents: {
      highlights: true,
      maxAgeHours: 24
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "current pricing for serverless GPU providers",
      "contents": {
        "highlights": true,
        "maxAgeHours": 24
      }
    }'
  ```
</CodeGroup>

## 次のステップ {#next-steps}

<Columns cols={2}>
  <Card title="ベストプラクティス" icon="sparkles" href="/ja/docs/search/best-practices" cta="ガイドを読む" arrow="true">
    トークン予算、コンテンツの鮮度、構造化出力、システムプロンプトについて解説します。
  </Card>

  <Card title="API リファレンス" icon="square-terminal" href="/ja/docs/reference/search" cta="リファレンスを開く" arrow="true">
    すべてのリクエストパラメータとレスポンスフィールドを、ライブプレイグラウンドで試しながら確認できます。
  </Card>

  <Card title="Contents" icon="file-text" href="/ja/docs/contents/quickstart" cta="ガイドを開く" arrow="true">
    取得対象の URL が決まっていて、整形されたテキスト、ハイライト、要約が必要な場合はこちら。
  </Card>

  <Card title="Exa Agent" icon="bot" href="/ja/docs/agent/quickstart" cta="ガイドを開く" arrow="true">
    長時間にわたるリサーチ、リスト作成、エンリッチメントが必要な場合はこちら。
  </Card>
</Columns>