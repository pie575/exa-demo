> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳細を確認する前に、このファイルで利用可能なすべてのページを把握してください。

# Baseten {#baseten}

> Baseten Hosted Tools 経由で Exa のウェブ検索を利用し、Baseten Model APIs 上のオープンソースモデルに根拠のある回答を生成させます。

Exa は [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/) のウェブ検索プロバイダーです。Baseten Model APIs はオープンソースモデルを提供しており、Hosted Tools を使えば、ツールループを自前で構築しなくてもモデルがウェブを検索できます。通常のリクエストに Exa のツールセレクターを追加するだけで、Baseten がサーバー側のループでモデルの推論と Exa の検索をまとめて実行し、根拠に基づいた回答を同じレスポンスで返します。Exa API キーは不要です。Exa の利用料金は上乗せなしで Baseten の請求にそのまま含まれます。

## Exa のウェブ検索ツールを使用する {#use-the-exa-web-search-tools}

`x-baseten-server-tools: true` ヘッダーを設定し、`tools` 配列に 1 つ以上の Exa セレクターを追加します。指定が必要なのは `type` だけです。ツールスキーマは Baseten が自動的に展開し、いつ検索するか、何を検索するか、どのページを読むかはモデルが判断します。サーバーサイドツールは、Baseten の [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions)、[Messages](https://docs.baseten.co/reference/inference-api/messages)、Responses の各エンドポイントで、バッファリングとストリーミングのどちらでも利用できます。

<CodeGroup>
  ```python Python theme={null}
  from openai import OpenAI

  client = OpenAI(
      api_key="<BASETEN_API_KEY>",
      base_url="https://inference.baseten.co/v1",
      default_headers={"x-baseten-server-tools": "true"},
  )

  response = client.chat.completions.create(
      model="zai-org/GLM-5.3-Fast",
      messages=[
          {"role": "user", "content": "What were the major AI announcements this week?"}
      ],
      tools=[
          {"type": "baseten__exa__web_search_exa"},
          {"type": "baseten__exa__web_fetch_exa"},
      ],
      extra_body={"baseten": {"tool_settings": {"max_react_iterations": 5}}},
  )

  print(response.choices[0].message.content)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const client = new OpenAI({
    apiKey: "<BASETEN_API_KEY>",
    baseURL: "https://inference.baseten.co/v1",
    defaultHeaders: { "x-baseten-server-tools": "true" },
  });

  const response = await client.chat.completions.create({
    model: "zai-org/GLM-5.3-Fast",
    messages: [
      { role: "user", content: "What were the major AI announcements this week?" },
    ],
    tools: [
      { type: "baseten__exa__web_search_exa" },
      { type: "baseten__exa__web_fetch_exa" },
    ],
    baseten: { tool_settings: { max_react_iterations: 5 } },
  });

  console.log(response.choices[0].message.content);
  ```

  ```bash cURL theme={null}
  curl https://inference.baseten.co/v1/chat/completions \
    -H "Authorization: Bearer <BASETEN_API_KEY>" \
    -H "Content-Type: application/json" \
    -H "x-baseten-server-tools: true" \
    -d '{
      "model": "zai-org/GLM-5.3-Fast",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [
        { "type": "baseten__exa__web_search_exa" },
        { "type": "baseten__exa__web_fetch_exa" }
      ],
      "baseten": { "tool_settings": { "max_react_iterations": 5 } }
    }'
  ```
</CodeGroup>

利用できる Exa ツールは 3 つです。モデルにソースを探させ、その中から選んだページを読ませたい場合は、検索ツールと取得ツールを組み合わせて渡します。

| セレクター                                   | モデルが得られるもの                                                   |
| --------------------------------------- | ------------------------------------------------------------ |
| `baseten__exa__web_search_exa`          | [Exa 検索](/ja/docs/search/quickstart): クエリに関連する結果とそのページコンテンツ |
| `baseten__exa__web_search_advanced_exa` | ドメインフィルター、サブページのクロール、結果ごとの要約(任意)に対応した検索                      |
| `baseten__exa__web_fetch_exa`           | モデルがすでに把握している URL の[ページ全体のコンテンツ](/ja/docs/contents/quickstart)  |

セレクターに追加のフィールドは不要です。ツールの引数は、モデルが Exa のスキーマに沿って入力します。いつ検索するか、一次ソースを取得するか、どのように引用するかといった検索方針は、システムプロンプトで指示してください。ループの上限は `baseten.tool_settings` で設定します。

| 設定                             | 用途                                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `max_react_iterations`         | リクエストあたりのモデルのイテレーション数の上限(デフォルト 12、範囲 2〜20)。最後のイテレーションは回答用に確保されるため、`N` を指定した場合、ツール呼び出しは最大 `N - 1` ラウンドになります。 |
| `max_tool_calls_per_iteration` | 1 イテレーションあたりのサーバーサイドツール呼び出し数の上限(デフォルト 10、範囲 1〜10)                                                           |

## 結果の返され方 {#how-results-come-back}

最終的な回答は、エンドポイントの通常のフィールドで返されます。完了した Exa の呼び出しは、プロトコルごとに次の形式で記録されます。Messages では `tool_use` ブロックと `tool_result` ブロック、Responses では `mcp_call` アイテム、Chat Completions では `baseten.iterations[].continuation_messages` です。ストリーミングリクエストでは、ループの実行中に各 search 呼び出しとその結果が server-sent events として届くため、回答が返される前に進捗を表示できます。`baseten.request.server_tool_calls[]` 配列には、リクエスト内のすべての Exa 呼び出しの結果が含まれます。

## 料金 {#pricing}

Exa の呼び出しは、モデルのトークン料金とは別に、Exa の料金のまま上乗せなしで Baseten アカウントに請求されます。目安は検索1回あたり約 $0.007、取得した URL 1件あたり $0.001 です。各呼び出しの料金は実行時に Exa から報告されるため、呼び出しによってはこれらの金額と異なる場合があります。課金対象のツール呼び出しは、Baseten のワークスペース設定の Billing → Usage に、プロバイダーごとにまとめて表示されます。最新の料金は [Baseten の料金表](https://docs.baseten.co/inference/model-apis/web-search#pricing)を参照してください。

Hosted Tools は Baseten で早期アクセスとして提供されており、組織ごとに毎分 25 リクエストの上限があります。[Baseten playground](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground) で Exa 検索をお試しください。本番ワークロード向けに上限を引き上げたい場合は、Baseten にお問い合わせください。

## リソース {#resources}

<Columns cols={2}>
  <Card title="Baseten ウェブ検索ドキュメント" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="ドキュメントを開く" arrow="true">
    サーバーサイドツールを使った、そのまま実行できる Messages、Responses、Chat Completions のサンプル。
  </Card>

  <Card title="サーバーサイドツールリファレンス" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="リファレンスを開く" arrow="true">
    ツールカタログ、ループ設定、`tool_choice` の形式、レスポンスの構造。
  </Card>
</Columns>