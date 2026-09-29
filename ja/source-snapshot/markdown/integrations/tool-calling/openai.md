> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="openai-tool-calling">
  # OpenAI のツール呼び出し
</div>

> OpenAI のツール呼び出しを使用して、Exa のウェブ検索とページコンテンツをアプリケーションに組み込みます。

<Info>
  OpenAI は、すべての新規プロジェクトで Responses API の使用を推奨しています。後述の [Responses API](#responses-api) セクションを参照してください。
</Info>

OpenAI の[ツール呼び出し](https://platform.openai.com/docs/guides/function-calling?lang=python)を使用すると、コード内で定義した関数をモデルから呼び出せます。Exa SDK には OpenAI 向けのウェブ検索ツールとページ読み取りツールが組み込まれているため、ツールスキーマを手書きしたり、ツール呼び出しを解析したり、Exa の結果を自分で整形したりする必要はありません。

<div id="get-started">
  ## はじめに
</div>

<Steps>
  <Step title="SDK をインストールする">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="API キーを設定する">
    環境変数 `EXA_API_KEY` と `OPENAI_API_KEY` を設定します。API キーは [OpenAI ダッシュボード](https://platform.openai.com/api-keys)と [Exa ダッシュボード](https://dashboard.exa.ai/api-keys)で生成してください。

    <Card title="Exa API キーを取得する" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      ダッシュボードでキーを作成します。新規アカウントには無料クレジットが付与されます。
    </Card>
  </Step>

  <Step title="Exa ツールをツールループに追加する">
    リクエストの `tools` リストにツールを指定し、返ってきたアシスタントメッセージを `handle_tool_calls` に渡します。このメソッドはメッセージ内の Exa ツール呼び出しをすべて実行し、対応する `role: "tool"` メッセージを返します。返されたメッセージはそのまま会話に追加できます。

    `web_search` はモデルがまだ見ていないページを Web から検索します。`get_contents` は、以前の検索結果やユーザーから URL を取得済みのページを読み取ります。どちらか一方だけ登録することも、両方登録することもできます。

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # 環境から EXA_API_KEY を読み取る
      openai_client = OpenAI()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
          tools=[exa.openai.web_search(), exa.openai.get_contents()],
      )

      message = completion.choices[0].message
      messages.append(message)
      messages += exa.openai.handle_tool_calls(message)

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
      )
      print(completion.choices[0].message.content)
      ```

      ```javascript JavaScript theme={null}
      import Exa from "exa-js";
      import { OpenAI } from "openai";

      const exa = new Exa(); // 環境から EXA_API_KEY を読み取る
      const openai = new OpenAI();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
        tools: [exa.openai.webSearch(), exa.openai.getContents()],
      });

      const message = completion.choices[0].message;
      messages.push(message, ...(await exa.openai.handleToolCalls(message)));

      completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
      });
      console.log(completion.choices[0].message.content);
      ```
    </CodeGroup>

    ここでは簡潔にするため 1 ラウンドのみ示しています。実際のエージェントでは、すべてのリクエストに `tools` を含め、モデルがツールを呼び出さずに応答するまでハンドラーのステップを繰り返します。こうすることで、検索結果をもとに続けてページを読み取れるようになります。

    ファクトリを引数なしで呼び出すと、Exa の推奨デフォルトが適用されます。検索の場合は `type="auto"` と `contents={"highlights": True}` です。ハイライトはクエリに関連する抜粋を返すもので、ページテキストを 10,000 文字に制限するものではありません。contents ファクトリはページテキストを返します。SDK の 10,000 文字制限が適用されるのは `text` のみで、かつ `max_characters` を省略した場合に限られます。
  </Step>
</Steps>

<div id="responses-api">
  ## Responses API
</div>

OpenAI の Responses API では、`responses` ファクトリを使用します。ヘルパーは同じ `handle_tool_calls` を使います。ハンドラーは、フォローアップリクエストで送信する `function_call_output` アイテムを返します。

<CodeGroup>
  ```python Python theme={null}
  response = openai_client.responses.create(
      model="gpt-5.6",
      input=messages,
      tools=[exa.openai.responses.web_search(), exa.openai.responses.get_contents()],
  )

  messages += response.output
  messages += exa.openai.responses.handle_tool_calls(response)
  ```

  ```javascript JavaScript theme={null}
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: messages,
    tools: [exa.openai.responses.webSearch(), exa.openai.responses.getContents()],
  });

  messages.push(...response.output);
  messages.push(...(await exa.openai.responses.handleToolCalls(response)));
  ```
</CodeGroup>

<Note>
  Chat Completions と Responses API ではツールの形式が異なり、互いの形式を受け付けません。呼び出すエンドポイントに合ったファクトリを使用してください。
</Note>

<div id="configuring-the-tools">
  ## ツールの設定
</div>

キーワード引数は通常の Exa のオプションで、ツールの実行時にそのまま渡されます。search オプションは `exa.search()` に、contents オプションは `exa.get_contents()` に渡されます。

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.openai.web_search(category="news", contents={"text": True}),
      exa.openai.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.openai.webSearch({ category: "news", contents: { text: true } }),
    exa.openai.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

モデルが選択するのは search の `query` と読み込む `urls` だけです。それ以外はすべてツールの作成時に固定されるため、モデルがクロールや抽出の対象を変更することはできません。

一方、`name`(デフォルトは `"web_search"` と `"get_contents"`)と `description` は、モデルに提示されるツール定義を上書きするためのものです。設定の異なる Exa ツールを並べて使いたい場合や、同じ名前を予約している他のツールとの衝突を避けたい場合は、カスタムの `name` を指定してください。

<div id="mixing-in-your-own-tools">
  ## 独自のツールを組み合わせる
</div>

ハンドラーは、メッセージ内のすべてのツール呼び出しに応答します。解決できないツールを指定した呼び出しは破棄されず、`Error: unknown tool "<name>"` という出力が返されます。そのため、フォローアップリクエストで必要なツールレスポンスが欠落することはありません。Exa のツールと併せて独自のツールを実行する場合は、次のリクエストを送信する前に、これらのエラー出力を独自の結果に置き換えてください。

<div id="writing-the-loop-by-hand">
  ## ループを手動で記述する
</div>

ツールスキーマと実行を自分で管理したい場合は、ツールを定義し、呼び出しを手動で処理します。`exa.tools.web_search()` と `exa.tools.get_contents()` を使うと、自作のループでも同じプロバイダー非依存のツール仕様 (`run` メソッド付き) を利用できます。もちろん、すべてを一から記述することもできます。

```python Python theme={null}
import json

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "exa_search",
            "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to perform.",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_calls(tool_calls, messages):
    for tool_call in tool_calls:
        if tool_call.function.name == "exa_search":
            args = json.loads(tool_call.function.arguments)
            messages.append(
                {
                    "role": "tool",
                    "content": str(exa_search(**args)),
                    "tool_call_id": tool_call.id,
                }
            )
    return messages
```

Python および TypeScript での search と contents のオプションについては、[SDK クイックスタート](/ja/docs/sdks/quickstart)を参照してください。