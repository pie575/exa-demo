> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="openrouter">
  # OpenRouter
</div>

> openrouter:web&#95;search サーバーツールを使って、OpenRouter のあらゆるモデルを Exa のウェブ検索でグラウンディングできます。

Exa は [OpenRouter](https://openrouter.ai) のウェブ検索を支える検索エンジンです。OpenRouter は数百のモデルを 1 つの API で提供し、Exa はそれらのモデルにリアルタイムのウェブアクセスを提供します。ネイティブの検索機能を持たないモデルはデフォルトで Exa を通じてグラウンディングされ、どのモデルでも明示的に Exa を指定できます。Exa API キーは不要です。検索は OpenRouter がサーバー側で実行し、料金は OpenRouter クレジットに課金されます。

<div id="use-the-web-search-server-tool">
  ## ウェブ検索サーバーツールを使用する
</div>

`tools` 配列に `openrouter:web_search` を追加すると、いつ検索するか、何を検索するか、同一リクエスト内で再検索するかどうかをモデルが判断します。OpenRouter の[サーバーツール](https://openrouter.ai/docs/guides/features/server-tools/web-search)は現在ベータ版で、非推奨となった `web` プラグインと `:online` モデルバリアントに代わるものです。これらのいずれかを使用している場合は、OpenRouter の[移行ガイド](https://openrouter.ai/docs/guides/features/server-tools/web-search#migrating-from-the-web-search-plugin)を参照してください。

<CodeGroup>
  ```javascript JavaScript theme={null}
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer <OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.2",
      messages: [
        { role: "user", content: "What were the major AI announcements this week?" },
      ],
      tools: [{ type: "openrouter:web_search" }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      "https://openrouter.ai/api/v1/chat/completions",
      headers={
          "Authorization": "Bearer <OPENROUTER_API_KEY>",
          "Content-Type": "application/json",
      },
      json={
          "model": "openai/gpt-5.2",
          "messages": [
              {"role": "user", "content": "What were the major AI announcements this week?"}
          ],
          "tools": [{"type": "openrouter:web_search"}],
      },
  )

  print(response.json()["choices"][0]["message"]["content"])
  ```

  ```bash cURL theme={null}
  curl https://openrouter.ai/api/v1/chat/completions \
    -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "openai/gpt-5.2",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [{ "type": "openrouter:web_search" }]
    }'
  ```
</CodeGroup>

デフォルトの `engine: "auto"` では、OpenRouter はプロバイダーのネイティブ検索を備えたモデルではそれを使用し、それ以外のモデルでは Exa を使用します。すべてのモデルで検索の挙動を統一するには、`engine: "exa"` を設定します。

```json theme={null}
{
  "type": "openrouter:web_search",
  "parameters": {
    "engine": "exa",
    "mode": "auto",
    "max_results": 5,
    "max_total_results": 20,
    "allowed_domains": ["arxiv.org"],
    "excluded_domains": ["reddit.com"]
  }
}
```

| パラメーター                                | 用途                                                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`                                | レイテンシーと調査の深さのバランスを調整します。`instant`、`fast`、`auto` (デフォルト) 、`deep-lite`、`deep`、`deep-reasoning` から選択できます。各モードは Exa の[検索タイプ](/ja/docs/search/quickstart)に対応しています。 |
| `max_results`                         | 1 回の検索呼び出しで返される結果数の上限を設定します (デフォルトは 5)                                                                                                                     |
| `max_uses`                            | 1 回のリクエストでモデルが検索を実行できる回数の上限を設定します                                                                                                                          |
| `max_total_results`                   | 1 回のリクエスト内のすべての検索を合わせた累計結果数の上限を設定します                                                                                                                       |
| `max_characters`                      | ハイライトの文字数上限を結果ごとに厳密に指定します                                                                                                                                  |
| `search_context_size`                 | 文字数を直接指定する代わりに、プリセットの上限 (`low`、`medium`、`high`) を使用します                                                                                                     |
| `allowed_domains`, `excluded_domains` | 結果をドメインでフィルタリングします。Exa では同じリクエスト内で両方のフィルターを併用できます。                                                                                                         |

<div id="how-results-come-back">
  ## 結果の返され方
</div>

OpenRouter は、各結果についてページ全文ではなく [Exa highlights](/ja/docs/search/highlights) をリクエストします。highlights は抽出型の抜粋で、サイズは適応的に調整されます。`max_characters` または `search_context_size` を設定しない限り、通常は結果1件あたり2,000〜4,000文字です。モデルはこの抜粋を読み取り、API の呼び出し元はレスポンスメッセージに含まれる標準化された `url_citation` アノテーションとして抜粋を受け取ります。1件の結果の中で、ページ内の異なる箇所から抽出された抜粋同士は `[...]` マーカーで区切られます。

<div id="pricing">
  ## 料金
</div>

Exa の検索料金は OpenRouter クレジットから差し引かれ、これとは別に、モデルが結果を読み込む際のトークンコストもかかります。`instant`、`fast`、`auto` モードは 1 回の検索あたり $0.007、`deep-lite` と `deep` は $0.012、`deep-reasoning` は $0.015 です。1 回の検索には最大 10 件の結果が含まれ、それを超える結果は 1 件につき $0.001 かかります。最新の料金は [OpenRouter のウェブ検索ドキュメント](https://openrouter.ai/docs/guides/features/server-tools/web-search) を参照してください。

モデルが実行した検索の回数は、レスポンスの `usage` オブジェクト内の `server_tool_use.web_search_requests` で確認できます。

<div id="resources">
  ## リソース
</div>

<Columns cols={2}>
  <Card title="サーバーツールのドキュメント" icon="wrench" href="https://openrouter.ai/docs/guides/features/server-tools/web-search" cta="ドキュメントを開く" arrow="true">
    `openrouter:web_search` の設定に関する完全なリファレンスです。
  </Card>

  <Card title="導入事例" icon="book-open" href="https://exa.ai/customers/openrouter" cta="事例を読む" arrow="true">
    OpenRouter が Exa を活用し、数百ものモデルでウェブ検索を利用可能にした事例をご紹介します。
  </Card>
</Columns>