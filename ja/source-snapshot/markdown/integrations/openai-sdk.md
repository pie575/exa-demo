> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="openai-sdk-compatibility">
  # OpenAI SDK 互換性
</div>

> Exa のエンドポイントは OpenAI のドロップイン代替として利用できます。Chat Completions API と Responses API の両方に対応しています。

<Card title="コーディングエージェント クイックスタート" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa を初めてお使いですか？1 分もかからずに始められます。
</Card>

***

<div id="overview">
  ## 概要
</div>

Exa は、OpenAI SDK で利用できる OpenAI 互換のエンドポイントを提供しています。

| エンドポイント             | OpenAI インターフェース      | 利用可能なモデル    | ユースケース                               |
| ------------------- | -------------------- | ----------- | ------------------------------------ |
| `/chat/completions` | Chat Completions API | `exa`       | 従来型のチャットインターフェース                     |
| `/responses`        | Responses API        | `exa-agent` | Agent API (非同期のリサーチ、エンリッチメント、リスト作成)  |

<Info>
  `/chat/completions` は [`/answer`](/ja/docs/reference/answer) に、`/responses` は [Agent API](/ja/docs/agent/quickstart) にルーティングされます。詳しくは、後述の「[Responses API 経由の Agent](#agent-via-responses-api)」を参照してください。
</Info>

<div id="answer">
  ## Answer
</div>

chat completions インターフェースから Exa の `/answer` エンドポイントを使用するには、次のように設定します。

1. ベース URL を `https://api.exa.ai` に置き換えます
2. API キーを Exa API キーに置き換えます
3. モデル名を `exa` に置き換えます。

<Info>
  [`/answer`](/ja/docs/reference/answer) エンドポイントの詳細はリファレンスをご覧ください。ルーティング動作のカスタマイズについては、[hello@exa.ai](mailto:hello@exa.ai) までお問い合わせください。
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # ベース URL に exa を指定
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # extra_body で /answer エンドポイントに追加のパラメーターを渡す
    extra_body={
      "text": True # ソースの全文を含める
    }
  )

  print(completion.choices[0].message.content)  # レスポンスの内容を出力
  print(completion.choices[0].message.citations)  # 引用を出力
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // ベース URL に exa を指定
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "exa",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "What are the latest developments in quantum computing?",
        },
      ],
      store: true,
      stream: true,
      extra_body: {
        text: true, // ソースの全文を含める
      },
    });

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s https://api.exa.ai/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "model": "exa",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "What are the latest developments in quantum computing?"
        }
      ],
      "text": true
    }'
  ```
</CodeGroup>

<div id="agent-via-responses-api">
  ## Responses API 経由の Agent
</div>

Exa の [`/responses`](https://api.exa.ai/responses) エンドポイントは、OpenAI Responses インターフェースを通じて [Agent API](/ja/docs/agent/quickstart) を提供しているため、OpenAI SDK を変更なしでそのまま使用できます。`model: "exa-agent"` を設定し、実行モードを選択してください。

| モード      | リクエスト                                | 動作                                                                                 |
| -------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| 同期       | デフォルト (`stream`/`background` の指定なし)  | リクエストは処理が完了するまでブロックし、完了した `response` オブジェクトを返します。                                  |
| ストリーミング  | `stream: true`                       | 実行の進行に合わせて OpenAI Responses のイベント (SSE) をストリーミングし、最後に `response.completed` を送信します。 |
| バックグラウンド | `background: true`                   | `in_progress` 状態のレスポンスを即座に返します。結果は `GET /responses/{id}` をポーリングして取得します。            |

`reasoning.effort` (`minimal`、`low`、`medium`、`high`、`xhigh`、`auto`、`max`) を設定すると、コストと調査の深さのバランスを調整できます。実行をキャンセルするには `POST /responses/{id}/cancel` を使用します。`max` を使用する場合は、クライアントのデフォルトヘッダーとして `Exa-Beta: agent-max-effort-2026-07-27` を設定してください。この機能を支える実行モデル、出力の形式、effort ごとの料金については [Agent ガイド](/ja/docs/agent/quickstart) を参照してください。

<Warning>
  `reasoning.effort` が `high`、`xhigh`、`max` の実行は、同期リクエストでは時間がかかりすぎるため `400` が返されます。これらの実行には `stream: true` または `background: true` を使用してください。`/responses` には `budget` フィールドがないため、max では実行ごとのデフォルトの上限額が適用されます。
</Warning>

完了した Responses の実行を継続するには、`previous_response_id` を使用します。

<div id="synchronous">
  ### 同期
</div>

リクエストは実行が完了するまでブロックされ、完了後に最終状態の `response` オブジェクトが返されます。

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning={"effort": "medium"},
  )

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning: { effort: "medium" },
    });

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "reasoning": { "effort": "medium" }
    }'
  ```
</CodeGroup>

<div id="streaming">
  ### ストリーミング
</div>

`stream: true` を設定すると、Responses のストリームイベントを SSE で受信できます。各イベントには単調増加する `sequence_number` が付与され、ストリームは `response.completed` で終了します。`[DONE]` センチネルは送信されません。ストリームには `: keep-alive` コメント行が含まれることがありますが、SSE クライアントはこれを無視します。

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  with client.responses.stream(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
  ) as stream:
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="", flush=True)
      final = stream.get_final_response()

  print("\n\n", final.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const stream = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -N -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "stream": true
    }'
  ```
</CodeGroup>

<div id="background">
  ### バックグラウンド
</div>

`background: true` を設定すると、接続を維持せずに実行を開始できます。その後、終了ステータスになるまで `GET /responses/{id}` をポーリングしてください。ポーリングではなくストリーミングで受け取るには、[ストリーミング](#streaming) を参照してください。

<CodeGroup>
  ```python Python theme={null}
  import os
  import time
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      background=True,
  )

  # 完了するまでポーリング
  while response.status in ("queued", "in_progress"):
      time.sleep(5)
      response = client.responses.retrieve(response.id)

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    let response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      background: true,
    });

    // 完了するまでポーリング
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # バックグラウンド実行を作成
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }'

  # 返されたレスポンス ID を使ってポーリング
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="chat-wrapper">
  ## チャットラッパー
</div>

Exa は、あらゆる OpenAI のチャット補完に RAG 機能を自動で追加する Python ラッパーを提供しています。コードを 1 行追加するだけで、OpenAI のチャット補完を Exa を活用した RAG システムに変えられます。検索、チャンク分割、プロンプト作成はすべて自動で処理されます。

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # クライアントを初期化
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # OpenAI クライアントをラップ
  exa_openai = exa.wrap(openai)

  # 通常の OpenAI クライアントとまったく同じように使用
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

ラップしたクライアントは、ネイティブの OpenAI クライアントとまったく同じように動作します。唯一の違いは、必要に応じて関連する検索結果を取り込み、補完の精度を自動で高める点です。

このラッパーでは、`exa.search()` 関数のすべてのパラメーターを使用できます。

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto"、"required"、"none" のいずれか
    num_results=5,               # デフォルトは 3
    result_max_len=1024,         # デフォルトは 2048 文字
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```