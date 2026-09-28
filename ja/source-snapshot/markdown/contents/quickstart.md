> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Contents API {#contents-api}

> 任意のURLからテキスト、ハイライト、要約を抽出します。

Exa Contentsは、URLからクリーンなページコンテンツを返します。JavaScriptでレンダリングされるページ、PDF、複雑なレイアウトも自動的に処理します。

contentsのすべての機能は、[Exa Search](/ja/docs/search/quickstart)で返されたURLに対しても利用できます。1回の検索につき結果10件までは追加料金なしで、それ以降は1000ページあたり$1です。ウェブ検索ツールのユースケースでは、Contentsではなく、このようにSearchを使用することをおすすめします。

<Tip>
  AIのコンテキストに渡す検索結果には、`/search`で`contents: { highlights: true }`をリクエストしてください。
  Exaが各結果の関連度に応じて抜粋の長さを調整します。詳しくは[ハイライト](/ja/docs/search/highlights)を参照してください。
</Tip>

## 最初のリクエストを送信する {#make-your-first-request}

1 つ以上の URL またはドキュメント ID を渡し、タスクに関連する部分のハイライトをリクエストします。HTTP リクエストでは、これらを `ids` で指定します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and quality results"},
  )

  print(result.results[0].highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://exa.ai/blog/dynamic-highlights"],
    {
      highlights: {
        query: "token efficiency and quality results"
      }
    }
  );

  console.log(result.results[0].highlights);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://exa.ai/blog/dynamic-highlights"],
      "highlights": {
        "query": "token efficiency and quality results"
      }
    }'
  ```
</CodeGroup>

<Accordion title="レスポンスの例">
  ```json theme={null}
  {
    "requestId": "e492118ccdedcba5088bfc4357a8a125",
    "results": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "title": "Dynamic Highlights",
        "url": "https://exa.ai/blog/dynamic-highlights",
        "highlights": [
          "With a 12k character budget, relative to existing highlights, Dynamic Highlights achieves a 40% average token efficiency gain with a notable quality increase..."
        ]
      }
    ],
    "statuses": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "status": "success",
        "source": "cached"
      }
    ],
    "costDollars": {
      "total": 0.001
    }
  }
  ```
</Accordion>

`results` の各要素には、ページのメタデータとリクエストしたコンテンツビューが含まれます。各 URL の取得に成功したかどうかは `statuses` で確認できます。

<h2 id="dynamic-highlights">
  出力形式
</h2>

<Tabs>
  <Tab title="ハイライト">
    ハイライトは、ページからそのまま抜き出した関連性の高いパッセージを返します。フルテキストよりもコンテキストを小さく抑えられるため、エージェント、RAG、事実確認の用途では、まずハイライトから試してください。

    ハイライトを有効にするには `highlights: true` を設定します。Contents を使用する場合は、ページから抽出するコンテンツを絞り込むために `query` パラメーターを併せて指定することをおすすめします。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/research-paper"],
          highlights={"query": "methodology and results"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/research-paper"],
        {
          highlights: {
            query: "methodology and results"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/research-paper"],
          "highlights": {
            "query": "methodology and results"
          }
        }'
      ```
    </CodeGroup>

    Dynamic Highlights や、複数ページにまたがるコンテキストの配分方法については、[ハイライト](/ja/docs/search/highlights)を参照してください。
  </Tab>

  <Tab title="フルテキスト">
    フルテキストは、不要な要素を除いたページ本文を Markdown で返します。幅広いコンテキストや文書構造、あるいはハイライトでは拾いきれない詳細が必要なタスクに使用してください。

    ページ全体は長くなることがあるため、上限を設けたい場合は `maxCharacters` を使用してください。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/technical-report"],
          text={"max_characters": 10000},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/technical-report"],
        {
          text: {
            maxCharacters: 10000
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/technical-report"],
          "text": {
            "maxCharacters": 10000
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="要約">
    要約では、ページごとに言語モデルを呼び出します。生成された概要が必要な場合や、JSON スキーマに沿ってフィールドを抽出したい場合に使用してください。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/company"],
          summary={"query": "Summarize the product, customers, and pricing"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/company"],
        {
          summary: {
            query: "Summarize the product, customers, and pricing"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/company"],
          "summary": {
            "query": "Summarize the product, customers, and pricing"
          }
        }'
      ```
    </CodeGroup>

    文章ではなくフィールドとして抽出するには、`summary.schema` に JSON スキーマを渡します。要約はスキーマに沿った JSON 文字列として返されるので、パースしてから各フィールドを読み取ってください。

    ```json theme={null}
    {
      "ids": ["https://example.com/company"],
      "summary": {
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "title": "Company Information",
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "The company name" },
            "industry": { "type": "string", "description": "Primary industry" },
            "foundedYear": { "type": "number", "description": "Year the company was founded" }
          },
          "required": ["name"]
        }
      }
    }
    ```
  </Tab>
</Tabs>

コンテンツビューは1回のリクエストにつき1つだけ選択してください。ハイライト、テキスト、要約を同時にリクエストすると、ビューごとに個別に返され、それぞれ課金されます。

## コンテンツの鮮度 {#content-freshness}

`maxAgeHours` は、抽出されるページコンテンツにどの程度の鮮度を求めるかを制御します。

| 値    | 動作                                                  |
| ---- | --------------------------------------------------- |
| 省略   | キャッシュされたコンテンツがあればそれを使用し、必要に応じてページを取得します             |
| 正の整数 | キャッシュされたコンテンツが指定した時間数より新しければそれを使用し、そうでなければページを取得します |
| `0`  | 常に最新のコンテンツを取得します                                    |
| `-1` | キャッシュされたコンテンツのみを使用します                               |

ほとんどのリクエストでは、このフィールドを省略してください。価格、在庫状況、頻繁に更新されるページなど、古いページコンテンツでは役に立たない場合に設定します。小さい `maxAgeHours` と `livecrawlTimeout` (ミリ秒) を組み合わせると、最新コンテンツの取得にかかる時間に上限を設けられます。

<Accordion title="非推奨の livecrawl パラメータからの移行">
  `livecrawl` 文字列パラメーター (`"always"`、`"preferred"`、`"fallback"`、`"never"`) は
  非推奨となり、`maxAgeHours` に置き換えられました。

  | 旧 `livecrawl` の値 | 対応する設定                                           |
  | ---------------- | ------------------------------------------------ |
  | `"always"`       | `maxAgeHours: 0`                                 |
  | `"never"`        | `maxAgeHours: -1`                                |
  | `"fallback"`     | `maxAgeHours` を省略                                |
  | `"preferred"`    | 直接対応する設定はありません。`maxAgeHours: 1` などの小さい値を使用してください |
</Accordion>

## サブページをクロールする {#crawl-subpages}

各開始 URL からリンクをたどるには、`subpages` を設定します。特定のサイトセクションを Exa に優先してクロールさせたい場合は、`subpageTarget` を追加します。

<CodeGroup>
  ```python Python theme={null}
  result = exa.get_contents(
      ["https://docs.example.com"],
      subpages=10,
      subpage_target=["api", "reference", "guides"],
      highlights=True,
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.getContents(
    ["https://docs.example.com"],
    {
      subpages: 10,
      subpageTarget: ["api", "reference", "guides"],
      highlights: true
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://docs.example.com"],
      "subpages": 10,
      "subpageTarget": ["api", "reference", "guides"],
      "highlights": true
    }'
  ```
</CodeGroup>

## 画像とファビコン {#images-and-favicons}

各ページから取得する画像 URL の数を `extras.imageLinks` に設定します。利用可能な場合は、サイトの
`favicon` と代表画像の `image` URL も結果に含まれます。`/search` では、このオプションを
`contents.extras.imageLinks` で指定します。

## 次のステップ {#next-steps}

<Columns cols={2}>
  <Card title="API リファレンス" icon="square-terminal" href="/ja/docs/reference/get-contents" cta="リファレンスを開く" arrow="true">
    すべてのリクエストパラメーターとレスポンスフィールドを確認できます。
  </Card>

  <Card title="ハイライト" icon="highlighter" href="/ja/docs/search/highlights" cta="ガイドを読む" arrow="true">
    エージェントや RAG のコンテキスト用途で、通常のハイライトと Dynamic Highlights を比較できます。
  </Card>

  <Card title="Search API" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを開く" arrow="true">
    コンテンツを抽出する前に、関連するページを検索できます。
  </Card>

  <Card title="SDK" icon="code" href="/ja/docs/sdks/quickstart" cta="SDK を見る" arrow="true">
    Python や JavaScript から Exa を利用できます。
  </Card>
</Columns>