> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます：https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Deep Search {#deep-search}

> 複雑なリサーチタスクでは、反復的な検索、推論、根拠に基づく統合を活用できます。

Deep Search は Search API のリサーチモードです。同じ `/search` エンドポイントを使用しますが、取得プロセスでは複数の検索を実行し、エビデンスを精査しながらアプローチを洗練させ、根拠に基づいた結果を統合できます。

適切に構成されたクエリに対してランク付けされたページが必要な場合は、標準の Search を使用してください。答えを見つけるのにリサーチが必要な場合は、Deep を使用してください。

## Deep Search の仕組み {#how-deep-search-works}

Deep Search は、最終的なレスポンスを返す前にリサーチのループを実行します。

<Steps>
  <Step title="検索を計画する">
    Exa は指定された `query` を起点とし、リクエストのさまざまな側面をカバーする複数の検索に展開することがあります。
    `additionalQueries` を使用して、初期のクエリのバリエーションを指定することもできます。
  </Step>

  <Step title="検索と精査">
    Deep はエビデンスを検索し、得られた情報をリクエストと照らし合わせて、裏付けが取れている点とまだ不足している点を判断します。
  </Step>

  <Step title="絞り込み">
    エビデンスが不十分な場合や矛盾がある場合、Deep は最初に見つかったそれらしいページをそのまま返すのではなく、より的を絞った検索を実行できます。
  </Step>

  <Step title="選択と統合">
    Deep は有用な結果を選び出し、他の検索タイプと同じ統合パスで処理します。
    `outputSchema` を指定すると、レスポンスには構造化された `output.content` と、
    `output.grounding` 内のフィールド単位の引用が含まれます。
  </Step>
</Steps>

このプロセスは、リストや構造化出力で特に効果を発揮します。要求されたアイテムごとに異なる検索が必要になることもありますが、Deep は最終的な構造を生成する前にそれらの結果を収集し、検証できます。

## Deep モードを選択する {#choose-a-deep-mode}

| タイプ              | 適した場面                                        |
| ---------------- | -------------------------------------------- |
| `deep-lite`      | 軽量なクエリ拡張と統合が必要な場合                            |
| `deep`           | 反復的な検索、エビデンスの収集、または複数の構造化されたアイテムが必要なタスクの場合   |
| `deep-reasoning` | 判断が難しいエビデンスや矛盾するエビデンスを踏まえた、より慎重な推論が必要なタスクの場合 |

リサーチワークフローでは、まず `deep` から始めてください。タスクがよりシンプルで、レイテンシを重視する場合は `deep-lite` に切り替えてください。

<Tip>
  長時間実行されるリサーチ、リスト作成、マルチホップのエンリッチメントには、`deep-reasoning` ではなく [Exa Agent](/ja/docs/agent/quickstart) を使用してください。Agent は実行あたりに使える計算リソースが多く、根拠に基づいた構造化された結果を返します。
</Tip>

最新のコストとレイテンシの目安については、[料金](/ja/docs/admin/pricing#deep-search)を参照してください。

## Deep リクエストを送信する {#make-a-deep-request}

通常の Search API リクエストで `type` を指定します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "Compare how major database vendors support vector, keyword, and hybrid retrieval",
    {
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Deep は、選定した検索結果を `results` に格納して返します。統合された回答や構造化データセットも取得したい場合は、`outputSchema` を追加してください。

## 初期クエリを指定する {#provide-starting-queries}

通常、実行する検索は Deep が自動で決定します。調査で扱うべき用語、観点、サブ問題があらかじめわかっている場合は、`additionalQueries` を使用します。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Compare current approaches to inference-time scaling",
      additional_queries=[
          "inference-time compute scaling benchmark",
          "test-time reasoning methods survey",
          "adaptive compute language models",
      ],
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Compare current approaches to inference-time scaling",
    {
      additionalQueries: [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare current approaches to inference-time scaling",
      "additionalQueries": [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

メインの `query` は常に含まれます。追加クエリは最大 10 件まで指定でき、このリストは Deep 系の検索タイプでのみ使用できます。

検索量を増やす目的で、少し言い換えただけのクエリを追加するのは避けてください。クエリを追加するのは、それぞれが明確に異なる方向性の検索につながる場合に限ります。

## 動作と出力を分けて指定する {#guide-behavior-and-output-separately}

`systemPrompt` と `outputSchema` は、リクエストのそれぞれ異なる部分に作用します。

* `systemPrompt` は、ソースの優先設定、新規性、重複排除、および Deep のリサーチ動作を指示します。
* `outputSchema` は、最終的な出力の形式を定義し、統合を実行させます。

クエリには、何をリサーチするかを記述します。システムプロンプトには、そのリサーチをどのように進め、どのように提示するかを記述します。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      type="deep",
      system_prompt="Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 8,
                  "items": {
                      "type": "object",
                      "required": ["name", "round", "amount"],
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "amount": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Find AI infrastructure companies that announced Series A or B funding in the last six months",
    {
      type: "deep",
      systemPrompt:
        "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      outputSchema: {
        type: "object",
        required: ["companies"],
        properties: {
          companies: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              required: ["name", "round", "amount"],
              properties: {
                name: { type: "string" },
                round: { type: "string" },
                amount: { type: "string" }
              }
            }
          }
        }
      }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      "type": "deep",
      "systemPrompt": "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 8,
            "items": {
              "type": "object",
              "required": ["name", "round", "amount"],
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "amount": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

構造化されたアイテムが 3 件以上必要な場合や、各アイテムが複数の要件を満たす必要がある場合は、Deep の使用をおすすめします。標準の検索タイプも同じ統合パスを使用しますが、統合前に Deep のような反復的なリサーチは行いません。

## 根拠に基づくレスポンスを確認する {#read-the-grounded-response}

構造化レスポンスでは、次のように生成された値とその根拠が分けて返されます：

```json theme={null}
{
  "results": [
    {
      "title": "Acme AI raises $30M Series B",
      "url": "https://acme.example/news/series-b"
    }
  ],
  "output": {
    "content": {
      "companies": [
        {
          "name": "Acme AI",
          "round": "Series B",
          "amount": "$30M"
        }
      ]
    },
    "grounding": [
      {
        "field": "companies[0].amount",
        "citations": [
          {
            "title": "Acme AI raises $30M Series B",
            "url": "https://acme.example/news/series-b"
          }
        ],
        "confidence": "high"
      }
    ]
  }
}
```

生成結果には `output.content` を使用し、各フィールドを裏付けるソースの表示や検証には `output.grounding` を使用してください。引用や信頼度のフィールドは Exa が自動的に返すため、独自のスキーマに追加しないでください。

`numResults` は、`results` で返される選択済みページの数を指定します。Deep が実行する検索の回数を指定するものではありません。

## 統合結果をストリーミングする {#stream-the-synthesis}

`outputSchema` とあわせて `stream: true` を設定すると、統合された出力を Server-Sent Events (SSE) で受け取れます。

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/search",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "query": "Explain the competing technical approaches to long-context retrieval",
          "type": "deep",
          "stream": True,
          "outputSchema": {
              "type": "text",
              "description": "A grounded comparison organized by approach",
          },
      },
      stream=True,
  )
  response.raise_for_status()

  for line in response.iter_lines(decode_unicode=True):
      if line:
          print(line)
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      query: "Explain the competing technical approaches to long-context retrieval",
      type: "deep",
      stream: true,
      outputSchema: {
        type: "text",
        description: "A grounded comparison organized by approach"
      }
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const decoder = new TextDecoder();
  for await (const chunk of response.body) {
    process.stdout.write(decoder.decode(chunk, { stream: true }));
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Explain the competing technical approaches to long-context retrieval",
      "type": "deep",
      "stream": true,
      "outputSchema": {
        "type": "text",
        "description": "A grounded comparison organized by approach"
      }
    }'
  ```
</CodeGroup>

`done` を受信するまで、型付きイベントを順に処理します。最終イベントには完成した出力と検索時間が含まれ、利用可能な場合はコスト情報も含まれます。

## 標準の Search で十分な場合 {#when-to-stay-with-standard-search}

1 回の取得で要件を満たせる場合、Deep は不要です。

* 調査に基づく結論ではなく、関連ページが必要な場合。
* クエリがすでに特定のソースや限定的なトピックを指定している場合。
* アプリケーション側で独自に推論を行い、取得処理だけが必要な場合。
* リクエストがインタラクティブ、オートコンプリート、または音声の処理経路で発生する場合。

品質と速度をデフォルトのバランスにするには `auto` を、レイテンシ要件が定まっている場合は `fast` または `instant` を使用してください。

<Columns cols={2}>
  <Card title="Search API ガイド" icon="search" href="/ja/docs/search/quickstart" cta="Search を確認" arrow="true">
    リクエストの作成、結果に含めるコンテンツの選択、フィルターの適用方法を説明します。
  </Card>

  <Card title="Search のベストプラクティス" icon="sliders-horizontal" href="/ja/docs/search/best-practices" cta="取得を最適化" arrow="true">
    品質、コンテキスト、レイテンシ、エージェント連携を改善します。
  </Card>

  <Card title="Search API リファレンス" icon="square-terminal" href="/ja/docs/reference/search" cta="リファレンスを開く" arrow="true">
    すべてのリクエストパラメーターとレスポンスフィールドを確認できます。
  </Card>

  <Card title="料金" icon="credit-card" href="/ja/docs/admin/pricing#deep-search" cta="モードを比較" arrow="true">
    Deep Search の最新の料金とレイテンシを確認できます。
  </Card>
</Columns>