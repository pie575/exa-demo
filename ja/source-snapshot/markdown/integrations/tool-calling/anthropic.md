> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# Anthropic のツール呼び出し {#anthropic-tool-calling}

> Claude のツール使用機能を使って、Exa のウェブ検索とページコンテンツ取得をアプリケーションに組み込みます。

<Card title="コーディングエージェント クイックスタート" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa を初めてお使いですか？1 分以内に使い始められます。
</Card>

***

Claude の[ツール使用](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)機能を使うと、コード内で定義した関数をモデルから呼び出せます。Exa SDK には Anthropic 向けのウェブ検索ツールとページ読み取りツールが組み込まれているため、ツールスキーマを手書きしたり、`tool_use` ブロックを解析したり、Exa の結果を自分で整形したりする必要はありません。

## はじめに {#get-started}

<Steps>
  <Step title="SDK をインストールする">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="API キーを設定する">
    環境変数 `EXA_API_KEY` と `ANTHROPIC_API_KEY` を設定します。API キーは [Anthropic Console](https://console.anthropic.com/settings/keys) と [Exa ダッシュボード](https://dashboard.exa.ai/api-keys)で生成できます。

    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="Exa ツールをツールループに追加する">
    リクエストの `tools` リストにツールを渡し、アシスタントメッセージを `handle_tool_use` に渡します。`handle_tool_use` はメッセージ内のすべての `tool_use` ブロックを実行し、対応する `tool_result` ブロックを返します。返されたブロックは、そのまま次のユーザーメッセージとして送り返せます。

    `web_search` はモデルがまだ把握していないページを Web から検索し、`get_contents` は以前の検索結果やユーザーから取得済みの URL のページを読み込みます。どちらか一方だけでも、両方でも登録できます。

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # 環境変数から EXA_API_KEY を読み込む
      claude = anthropic.Anthropic()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )

      messages.append({"role": "assistant", "content": response.content})
      messages.append(
          {"role": "user", "content": exa.anthropic.handle_tool_use(response)}
      )

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )
      print(response.content[0].text)
      ```

      ```javascript JavaScript theme={null}
      import Anthropic from "@anthropic-ai/sdk";
      import Exa from "exa-js";

      const exa = new Exa(); // 環境変数から EXA_API_KEY を読み込む
      const anthropic = new Anthropic();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: await exa.anthropic.handleToolUse(response),
      });

      response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });
      console.log(response.content[0].text);
      ```
    </CodeGroup>

    ここでは簡潔にするため、1 往復分のみを示しています。実際のエージェントでは、すべてのリクエストに `tools` を含め、モデルが `tool_use` ブロックを含まない応答を返すまでハンドラーの処理を繰り返します。こうすることで、検索結果をもとにしたページの追加読み込みが行われます。

    ファクトリーを引数なしで呼び出すと、Exa の推奨デフォルトが適用されます。検索の場合は `type="auto"` と `contents={"highlights": True}` です。ハイライトはクエリに関連する抜粋を返すもので、ページテキストを 10,000 文字に制限するわけではありません。contents ファクトリーはページテキストを返します。SDK の 10,000 文字の上限が適用されるのは `text` のみで、しかも `max_characters` を省略した場合に限られます。
  </Step>
</Steps>

## ツールの設定 {#configuring-the-tools}

キーワード引数は通常の Exa オプションで、ツールの実行時にそのまま渡されます。検索オプションは `exa.search()` に、contents オプションは `exa.get_contents()` に渡されます。

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.anthropic.web_search(category="news", contents={"text": True}),
      exa.anthropic.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.anthropic.webSearch({ category: "news", contents: { text: true } }),
    exa.anthropic.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

モデルが決めるのは検索の `query` と読み込む `urls` だけです。それ以外はすべてツールの作成時に固定されるため、モデルがクロールや抽出の内容を変えることはできません。

一方、`name`(デフォルトは `"web_search"` と `"get_contents"`)と `description` は、モデルに提示されるツール定義を上書きします。Anthropic ではツール名が一意でなければならないため、カスタム名を指定すれば、`web_search` という名前を予約している Anthropic 組み込みの `web_search_20250305` サーバーツールと Exa のツールを併用できます。

<CodeGroup>
  ```python Python theme={null}
  response = claude.messages.create(
      model="claude-sonnet-4-6",
      max_tokens=1024,
      messages=messages,
      tools=[
          exa.anthropic.web_search(name="exa_web_search"),
          {"type": "web_search_20250305", "name": "web_search", "max_uses": 5},
      ],
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
    tools: [
      exa.anthropic.webSearch({ name: "exa_web_search" }),
      { type: "web_search_20250305", name: "web_search", max_uses: 5 },
    ],
  });
  ```
</CodeGroup>

## 独自のツールを組み合わせる {#mixing-in-your-own-tools}

`handle_tool_use` は、メッセージ内のすべての `tool_use` ブロックに応答します。解決できないツールを指定したブロックも破棄されず、`Error: unknown tool "<name>"` という結果が返されます。そのため、フォローアップリクエストで必須のツール結果が欠けることはありません。Exa のツールと独自のツールを併用する場合は、次のリクエストを送信する前に、これらのエラー結果を独自のツールの結果に置き換えてください。

## ループを手動で記述する {#writing-the-loop-by-hand}

ツールスキーマと実行処理を自分で管理したい場合は、ツールを定義し、`tool_use` ブロックを手動で処理します。`exa.tools.web_search()` と `exa.tools.get_contents()` を使うと、自前で実装するループ向けに、同じプロバイダー非依存のツール仕様 (`run` メソッド付き) を利用できます。すべてを一から記述することも可能です。

```python Python theme={null}
TOOLS = [
    {
        "name": "exa_search",
        "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to perform.",
                },
            },
            "required": ["query"],
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_use(response):
    results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "exa_search":
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(exa_search(**block.input)),
                }
            )
    return results
```

Python と TypeScript における search と contents のオプションについては、[SDK クイックスタート](/ja/docs/sdks/quickstart)を参照してください。