> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# SDK クイックスタート {#sdk-quickstart}

> Exa の Python SDK と JavaScript SDK をインストールして使用する

Exa の公式 SDK です。ウェブ検索、ページコンテンツの取得、引用付きの回答の生成を行えます。

<Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

## インストール {#install}

<CodeGroup>
  ```bash pip theme={null}
  pip install exa-py
  ```

  ```bash uv theme={null}
  uv add exa-py
  ```

  ```bash npm theme={null}
  npm install exa-js
  ```

  ```bash pnpm theme={null}
  pnpm add exa-js
  ```
</CodeGroup>

Python SDK を使用するには Python 3.9 以降が必要です。

## 認証 {#authentication}

API キーを環境変数に設定します。

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

## はじめに {#getting-started}

クライアントを初期化して、最初の検索を実行してみましょう。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "latest developments in fusion energy",
      type="auto",
      contents={"highlights": True},
  )

  for source in results.results:
      print(source.url, source.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("latest developments in fusion energy", {
    type: "auto",
    contents: {
      highlights: true,
    },
  });

  for (const source of results.results) {
    console.log(source.url, source.highlights);
  }
  ```
</CodeGroup>

<Note>
  どちらのクライアントも、APIキーを `EXA_API_KEY` 環境変数から読み込みます。明示的に指定したい場合は、
  `Exa(api_key="your-api-key")` または `new Exa("your-api-key")` のように直接渡してください。
</Note>

## 推奨されるデフォルト設定 {#recommended-defaults}

| 項目       | 推奨されるデフォルト                                                 |
| -------- | ---------------------------------------------------------- |
| 出発点      | `search` を使用する                                             |
| 検索タイプ    | レイテンシや合成の要件で別のタイプが必要な場合を除き、`auto` のままにする                   |
| ページコンテンツ | まずは `highlights: true` を指定する                               |
| 既知のURL   | `get_contents` / `getContents` を使用する                       |
| 鮮度       | 古いコンテンツでは用をなさない場合にのみ `max_age_hours` / `maxAgeHours` を設定する |

<Warning>
  2種類のリクエストでは、同じコンテンツオプションを指定する場所が異なります。

  | メソッド                           | コンテンツオプションの指定場所                                                             |
  | ------------------------------ | --------------------------------------------------------------------------- |
  | `search`                       | `contents` 内に指定します (例: `exa.search(query, contents={"highlights": True})`)  |
  | `get_contents` / `getContents` | リクエストに直接指定します (例: `exa.get_contents(urls, highlights=True)`)                |
</Warning>

## Search {#search}

Search は関連性の高いページを見つけ、そのコンテンツを 1 回の呼び出しで返します。

<Tip>
  AI による回答、RAG、検索プレビューには `highlights: true` を使用してください。Exa は各結果の
  抜粋の長さを関連度に応じて自動で調整します。`max_characters` / `maxCharacters` は、アプリケーションで
  固定の上限が必要な場合にのみ設定してください。
</Tip>

フィルター、日付範囲、結果件数を指定する例:

<CodeGroup>
  ```python Python theme={null}
  results = exa.search(
      "climate tech news",
      num_results=20,
      start_published_date="2024-01-01",
      include_domains=["techcrunch.com", "wired.com"],
      contents={"highlights": True}
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("interesting articles about space", {
    numResults: 10,
    includeDomains: ["nasa.gov", "space.com"],
    startPublishedDate: "2024-01-01",
    contents: {
      highlights: true,
    },
  });
  ```
</CodeGroup>

### 出力スキーマ {#output-schema}

<CodeGroup>
  ```python Python theme={null}
  structured_results = exa.search(
      "Who is the CEO of OpenAI?",
      type="deep",
      system_prompt="Prefer official sources and avoid duplicate results",
      output_schema={
          "type": "object",
          "properties": {
              "leader": {"type": "string"},
              "title": {"type": "string"},
              "source_count": {"type": "number"}
          },
          "required": ["leader", "title"]
      },
      contents={"highlights": True}
  )

  print(structured_results.output.content if structured_results.output else None)
  ```

  ```javascript JavaScript theme={null}
  const structuredResult = await exa.search("Who is the CEO of OpenAI?", {
    type: "deep",
    systemPrompt: "Prefer official sources and avoid duplicate results",
    outputSchema: {
      type: "object",
      properties: {
        leader: { type: "string" },
        title: { type: "string" },
        sourceCount: { type: "number" },
      },
      required: ["leader", "title"],
    },
    contents: {
      highlights: true,
    },
  });

  console.log(structuredResult.output?.content);
  ```
</CodeGroup>

<Note>
  `output_schema` / `outputSchema` はすべての検索タイプで使用でき、合成された値を
  `output.content` に返します。ソースの優先条件や重視したい点は `system_prompt` / `systemPrompt` で指定してください。
  グラウンディングは `output.grounding` に自動で返されるため、引用や信頼度を
  スキーマに重複して含めないでください。
</Note>

複数の検索にまたがるリサーチが必要な出力には、Deep モードをおすすめします。軽量なリサーチには `deep-lite` を、多段階の検索とより高度な合成が必要な場合は `deep` を使用してください。リクエストオプションの詳細は [Search ガイド](/ja/docs/search/quickstart)を参照してください。

## Contents {#contents}

URLがすでにわかっている場合は、そこからハイライト、全文、または要約を抽出できます。まずはハイライトを使い、
queryを追加して必要な情報に絞り込みましょう。

<CodeGroup>
  ```python Python theme={null}
  results = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and result quality"},
  )
  ```

  ```javascript JavaScript theme={null}
  const results = await exa.getContents(["https://exa.ai/blog/dynamic-highlights"], {
    highlights: {
      query: "token efficiency and result quality",
    },
  });
  ```
</CodeGroup>

より広いコンテキストやドキュメント構造が必要な場合は、全文を使用してください。出力形式、鮮度の制御、サブページのクロールについては、[Contents ガイド](/ja/docs/contents/quickstart)を参照してください。

## Answer {#answer}

質問に対する回答を引用付きで取得します。

<CodeGroup>
  ```python Python theme={null}
  response = exa.answer("What caused the 2008 financial crisis?")
  print(response.answer)

  for chunk in exa.stream_answer("Explain quantum computing"):
      print(chunk, end="", flush=True)
  ```

  ```javascript JavaScript theme={null}
  const response = await exa.answer("What caused the 2008 financial crisis?");
  console.log(response.answer);

  for await (const chunk of exa.streamAnswer("Explain quantum computing")) {
    if (chunk.content) {
      process.stdout.write(chunk.content);
    }
  }
  ```
</CodeGroup>

## 非同期処理と型 {#async-and-types}

Python には非同期処理用の `AsyncExa` が用意されており、JavaScript SDK にはすべてのメソッドの TypeScript 型定義が
付属しています。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import AsyncExa

  exa = AsyncExa()

  results = await exa.search(
      "machine learning startups",
      contents={"highlights": True}
  )
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";
  import type { SearchResponse, RegularSearchOptions } from "exa-js";
  ```
</CodeGroup>

## リソース {#resources}

Python: [exa-py のソースコード](https://github.com/exa-labs/exa-py)、[PyPI パッケージ](https://pypi.org/project/exa-py/)。JavaScript: [exa-js のソースコード](https://github.com/exa-labs/exa-js)、[npm パッケージ](https://www.npmjs.com/package/exa-js)。

## 次のステップ {#continue}

<Columns cols={3}>
  <Card title="Search ガイド" icon="search" href="/ja/docs/search/quickstart" cta="ガイドを開く" arrow="true">
    メインの Search ガイドに戻り、リクエストのパターン、フィルター、より高度なモードを確認します。
  </Card>

  <Card title="Search リファレンス" icon="square-terminal" href="/ja/docs/reference/search" cta="リファレンスを開く" arrow="true">
    `/search` のリクエストとレスポンスの完全なスキーマを確認できます。
  </Card>

  <Card title="Contents ガイド" icon="file-text" href="/ja/docs/contents/quickstart" cta="ガイドを開く" arrow="true">
    対象の URL が分かっていて、コンテンツを直接抽出したい場合は Contents を使用します。
  </Card>
</Columns>