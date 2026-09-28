> ## ドキュメントインデックス
>
> ドキュメントインデックスの全体は次の URL から取得できます: https://exa.ai/docs/llms.txt
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="exa-agent">
  # Exa Agent
</div>

> ディープリサーチ、リスト作成、エンリッチメントのワークフローを実行し、構造化された出力を返します。

Exa Agent は、リスト作成、エンリッチメント、ディープリサーチなどの計算負荷の高いタスク向けの、非同期かつ従量課金制のエンドポイントです。複雑な推論を処理でき、多数の構造化出力フィールドを返すことができます。

Exa Agent は「コンテキストエージェント」と考えるとわかりやすいでしょう。必要なデータと返してほしい形式を記述すれば、Exa Agent がそのために必要なツール呼び出しをオーケストレーションします。1 回の実行で、さまざまな観点から多数の検索を展開し、ヒットしたページを読み込んで要約し、リスト作成をサブタスクに分割して並列実行し、各候補を指定した条件に照らして検証し、連絡先を補完し、アタッチした [Exa Connect](/ja/docs/agent/connect/overview) のデータパートナーにクエリを送信できます。`/search` や `/contents` の呼び出しを一つひとつ自分でオーケストレーションしなくても、集約されたコンテキストを、根拠に基づく 1 つの構造化された結果として受け取れます。

各実行では、自然言語による回答、スキーマ検証済みの JSON、フィールド単位のグラウンディング、メタデータ、コストの内訳を返すことができます。完了した実行は後から取得できるほか、過去の実行の一覧表示、イベントのリプレイ、以前の実行からの継続も可能です。

<Tip>
  MCP を使いたい場合は、[Exa MCP](/ja/docs/get-started/exa-mcp#exa-agent) で Exa Agent と [Exa Connect](/ja/docs/agent/connect/overview) を利用できます。`tools=agent_run` を有効にすると、Claude、Cursor、その他の MCP クライアントから、マルチステップのリサーチ、リスト作成、エンリッチメント、構造化出力を実行できます。
</Tip>

<div id="when-to-use-exa-agent">
  ## Exa Agent を使用するタイミング
</div>

ワークフローで単発の検索や抽出の呼び出しだけでは足りない場合や、データを集めるために検索、ページの読み取り、検証を繰り返すループを自前で実装する必要がある場合は、Exa Agent を使用してください。

* 自由度の高い条件でリストを作成し、各結果を補完する
* 多数のフィールドにわたってエンティティをリサーチし、引用を付ける
* 「企業を探し、次にその意思決定者を探す」といったマルチホップのタスクを実行する
* 長時間かかる Web リサーチタスクから構造化された JSON を生成する
* Web リサーチとプレミアムなデータパートナーを組み合わせ、根拠に基づく1つの回答にまとめる
* 「さらに10件の結果を探す」といったフォローアップリクエストで、以前の実行を継続する

Exa Agent は設計上、レイテンシが高く、非同期で動作します。呼び出しを自分でオーケストレーションする低レイテンシの単発検索には、まず [Search API](/ja/docs/search/quickstart) をお試しください。

<div id="quickstart">
  ## クイックスタート
</div>

この例では、指定した条件に一致する人物を構造化リストにまとめる実行を開始します。結果は `output.structured` に JSON 形式で返されます。

<div id="1-install-the-exa-sdk">
  ### 1. Exa SDK をインストールする
</div>

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

<div id="2-set-your-api-key">
  ### 2. API キーを設定する
</div>

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

<div id="3-create-a-run">
  ### 3. 実行を作成する
</div>

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      output_schema={
          "type": "object",
          "properties": {
              "people": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "job_title": {"type": "string"},
                          "linkedin_url": {"type": "string", "format": "uri"},
                      },
                      "required": ["name", "job_title", "linkedin_url"],
                  },
              }
          },
          "required": ["people"],
      },
      effort="auto",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
    outputSchema: {
      type: "object",
      properties: {
        people: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              job_title: { type: "string" },
              linkedin_url: { type: "string", format: "uri" }
            },
            required: ["name", "job_title", "linkedin_url"]
          }
        }
      },
      required: ["people"]
    },
    effort: "auto"
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "people": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "job_title": { "type": "string" },
                "linkedin_url": { "type": "string", "format": "uri" }
              },
              "required": ["name", "job_title", "linkedin_url"]
            }
          }
        },
        "required": ["people"]
      }
    }'
  ```
</CodeGroup>

実行の作成時に `Accept: text/event-stream` ヘッダーを追加すると、実行のキュー登録、開始、完了の各段階で server-sent events を受信できます。詳細は[イベントのストリーミング](#stream-events)を参照してください。

<div id="4-poll-for-completion">
  ### 4. 完了までポーリングする
</div>

イベントをストリーミングしない場合は、返された `id` を保存し、実行が終了ステータスになるまでポーリングします。

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run_id = "agent_run_01j..."
  run = exa.agent.runs.poll_until_finished(
      run_id,
      poll_interval=4000,
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const runId = "agent_run_01j...";
  const run = await exa.agent.runs.pollUntilFinished(runId, {
    pollInterval: 4000
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  RUN_ID="agent_run_01j..."

  while true; do
    RUN_JSON="$(curl -s "https://api.exa.ai/agent/runs/$RUN_ID" \
      -H "Authorization: Bearer $EXA_API_KEY")"

    STATUS="$(echo "$RUN_JSON" | python3 -c 'import json,sys; print(json.load(sys.stdin)["status"])')"
    echo "status=$STATUS"

    if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ] || [ "$STATUS" = "cancelled" ]; then
      echo "$RUN_JSON"
      break
    fi

    sleep 4
  done
  ```
</CodeGroup>

完了した実行には、次の内容が含まれます。

* `output.text`: 自然言語による回答
* `output.structured`: `outputSchema` を指定した場合に返される検証済みの JSON
* `output.grounding`: テキストまたは構造化フィールドの引用 (生成された場合)
* `costDollars`: 実行コストの内訳

<Note>
  Exa Agent は、OpenAI 互換の Responses API からも利用できます。OpenAI SDK の接続先を
  `https://api.exa.ai` に設定し、`model: "exa-agent"` を指定したうえで、
  同期、ストリーミング、バックグラウンドのいずれかの実行方式を選択してください。詳しくは [OpenAI SDK
  との互換性](/ja/docs/integrations/openai-sdk#agent-via-responses-api)を参照してください。
</Note>

<div id="verify-and-enrich-a-specific-entity">
  ## 特定のエンティティを検証して補完する
</div>

Exa Agent はリスト作成だけでなく、既知の単一エンティティの調査にも使えます。信頼できるソースと照合して主張を検証し、構造化されたエンリッチメントを返します。この例では、企業の公式ウェブサイトに一般公開された料金ページがあるかどうかを確認し、料金の詳細が取得できた場合はその情報で結果を補完します。スキーマで必須なのは `domain` と `verdict` のみで、それ以外はすべて任意のエンリッチメントです。

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
      system_prompt="Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
      effort="low",
      output_schema={
          "type": "object",
          "additionalProperties": False,
          "required": ["domain", "verdict"],
          "properties": {
              "domain": {"type": "string", "const": "redbarnrobotics.com"},
              "verdict": {
                  "type": "string",
                  "enum": ["present", "absent", "cannot_verify"],
              },
              "pricing_page_url": {"type": ["string", "null"], "format": "uri"},
              "displays_numeric_prices": {"type": ["boolean", "null"]},
              "pricing_model": {
                  "type": ["string", "null"],
                  "enum": [
                      "free",
                      "subscription",
                      "usage_based",
                      "one_time",
                      "custom_quote",
                      "mixed",
                      "other",
                      None,
                  ],
              },
              "starting_price": {"type": ["number", "null"], "minimum": 0},
              "currency": {
                  "type": ["string", "null"],
                  "description": "ISO 4217 code such as USD or EUR.",
              },
              "billing_period": {
                  "type": ["string", "null"],
                  "enum": [
                      "monthly",
                      "annual",
                      "one_time",
                      "usage_based",
                      "variable",
                      "other",
                      None,
                  ],
              },
              "has_free_plan": {"type": ["boolean", "null"]},
              "has_free_trial": {"type": ["boolean", "null"]},
              "reasoning": {"type": ["string", "null"], "maxLength": 300},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says 'Contact sales'.",
    systemPrompt:
      "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company's official website as evidence.",
    effort: "low",
    outputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["domain", "verdict"],
      properties: {
        domain: { type: "string", const: "redbarnrobotics.com" },
        verdict: {
          type: "string",
          enum: ["present", "absent", "cannot_verify"]
        },
        pricing_page_url: { type: ["string", "null"], format: "uri" },
        displays_numeric_prices: { type: ["boolean", "null"] },
        pricing_model: {
          type: ["string", "null"],
          enum: [
            "free",
            "subscription",
            "usage_based",
            "one_time",
            "custom_quote",
            "mixed",
            "other",
            null
          ]
        },
        starting_price: { type: ["number", "null"], minimum: 0 },
        currency: {
          type: ["string", "null"],
          description: "ISO 4217 code such as USD or EUR."
        },
        billing_period: {
          type: ["string", "null"],
          enum: [
            "monthly",
            "annual",
            "one_time",
            "usage_based",
            "variable",
            "other",
            null
          ]
        },
        has_free_plan: { type: ["boolean", "null"] },
        has_free_trial: { type: ["boolean", "null"] },
        reasoning: { type: ["string", "null"], maxLength: 300 }
      }
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Inspect the official website redbarnrobotics.com and determine whether it has a publicly accessible pricing or plans page. A dedicated pricing page counts as present even if it only says '"'"'Contact sales'"'"'.",
      "systemPrompt": "Judge only the company specified in the query. Use present only when a public pricing or plans page is found. Use absent only after successfully inspecting the website and finding no such page. If the website is unreachable, blocked, fails to render, or cannot be inspected reliably, use cannot_verify. Never use absent when inspection failed. Use only the company'"'"'s official website as evidence.",
      "effort": "low",
      "outputSchema": {
        "type": "object",
        "additionalProperties": false,
        "required": ["domain", "verdict"],
        "properties": {
          "domain": { "type": "string", "const": "redbarnrobotics.com" },
          "verdict": {
            "type": "string",
            "enum": ["present", "absent", "cannot_verify"]
          },
          "pricing_page_url": { "type": ["string", "null"], "format": "uri" },
          "displays_numeric_prices": { "type": ["boolean", "null"] },
          "pricing_model": {
            "type": ["string", "null"],
            "enum": ["free", "subscription", "usage_based", "one_time", "custom_quote", "mixed", "other", null]
          },
          "starting_price": { "type": ["number", "null"], "minimum": 0 },
          "currency": {
            "type": ["string", "null"],
            "description": "ISO 4217 code such as USD or EUR."
          },
          "billing_period": {
            "type": ["string", "null"],
            "enum": ["monthly", "annual", "one_time", "usage_based", "variable", "other", null]
          },
          "has_free_plan": { "type": ["boolean", "null"] },
          "has_free_trial": { "type": ["boolean", "null"] },
          "reasoning": { "type": ["string", "null"], "maxLength": 300 }
        }
      }
    }'
  ```
</CodeGroup>

<Note>
  検証ワークフロー用のスキーマは、不確実性を考慮して設計してください。検証できない可能性があるフィールドは
  nullable にし、`required` には含めないでください。こうすることで、エージェントは値を捏造せずに `null` を返せます。`verdict`
  列挙型は、確認の失敗 (`cannot_verify`) と実際の否定的な証拠 (`absent`) を区別します。サイトにアクセスできなかったからといって、
  そのページが存在しない証拠にはなりません。
</Note>

<div id="stream-events">
  ## イベントのストリーミング
</div>

ストリーミングを使用すると、作成リクエストの接続が維持され、実行が完了するまで Server-Sent Events (SSE) が送信されます。イベントタイプとペイロードについては、[イベント形式](#event-format)を参照してください。

Python では `stream=True`、JavaScript では `stream: true` を設定するか、HTTP の場合は `Accept: text/event-stream` ヘッダーを送信します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  events = exa.agent.runs.create(
      query="Find five recently launched developer tools for evaluating AI agents.",
      stream=True,
  )

  for event in events:
      print(event.event, event.data)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const events = await exa.agent.runs.create({
    query: "Find five recently launched developer tools for evaluating AI agents.",
    stream: true
  });

  for await (const event of events) {
    console.log(event.event, event.data);
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find five recently launched developer tools for evaluating AI agents."
    }'
  ```
</CodeGroup>

<div id="event-format">
  ### イベント形式
</div>

各 SSE フレームには、イベント ID、イベント名、JSON ペイロードが含まれます。

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

ストリームには、`: keep-alive` のようなコメント行が含まれる場合もあります。SSE クライアントはコメントを自動的に無視します。独自のパーサーを実装する場合も、同様にコメントを無視するようにしてください。

<div id="event-types">
  ### イベントタイプ
</div>

| イベント                  | `data` ペイロード                          | 使い方                                                                                              |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | リクエストが受け付けられたら、すぐに実行 ID を保存します。                                                                  |
| `agent_run.started`   | `{ id, status: "running" }`           | 実行を処理中としてマークします。                                                                                 |
| `agent_run.completed` | 完了した Agent 実行オブジェクト                   | 最終的な回答は `data.output.text` または `data.output.structured` から、引用は `data.output.grounding` から読み取ります。 |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | `error.code` と `error.message` をユーザーに表示します。完了した出力はありません。                                         |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | ストリームの受信を停止し、実行をキャンセル済みとして扱います。                                                                  |

同じリサーチステップに関連するイベントには `callId` が含まれます。これはツール進捗イベントの `item.call_id` に対応しており、検索トレース、ソース、ツール進捗をグループ化するのに使用できます。一部の検索トレースの説明は非同期に生成されるため、説明対象のソースイベントやツールイベントより後に届くことがあります。到着順だけで関連付けないようにしてください。

`agent_run.source.added` は完全な引用リストではなく、ライブプレビューとして扱ってください。正式なグラウンディング出力は、終了状態に達した実行の `output.grounding` です。

<div id="replay-stored-events">
  ### 保存済みイベントのリプレイ
</div>

ZDR 以外の実行では、[`GET /agent/runs/{id}/events`](/ja/docs/reference/agent-api/list-run-events) は保存済みのイベントをページネーション形式の JSON で返します。`Accept: text/event-stream` を送信すると保存済みのイベントを SSE としてリプレイでき、`Last-Event-ID` を送信するとクライアントで処理済みのイベントをスキップできます。

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

リプレイエンドポイントは、リクエスト時点で保存されているイベントを送信した後に接続を閉じます。進行中の実行を引き続き追跡することはありません。ZDR の実行ではイベントが保持されないため、リプレイできません。

前方互換性を確保するため、アプリケーションが認識できないイベント名は無視し、終了イベントを受信するまで処理を続けてください。

<div id="return-structured-json">
  ## 構造化JSONを返す
</div>

`outputSchema` を使用すると、スキーマで検証済みのJSONを `output.structured` で受け取れます。

`outputSchema` は [JSON Schema仕様](https://json-schema.org/)に対応しています。

連絡先情報を取得するには、必要な連絡先フィールドを `outputSchema` に記述します。メールアドレスには `{ "type": "string", "format": "email" }`、電話番号には `{ "type": "string", "format": "phone" }`、URLには `{ "type": "string", "format": "uri" }` のように、標準的なJSON Schemaの形式を使用してください。コンタクトエンリッチメントの最大コストを予測しやすくするため、可能であれば `maxItems` でリストのサイズに上限を設定してください。

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      effort="auto",
      output_schema={
          "type": "object",
          "properties": {
              "companies": {
                  "type": "array",
                  "items": {
                      "type": "object",
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "website": {"type": "string"},
                      },
                      "required": ["name", "round"],
                  },
              }
          },
          "required": ["companies"],
      },
  )
  run = exa.agent.runs.poll_until_finished(
      run.id,
  )

  print(json.dumps(run.output.structured if run.output else None, indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
    effort: "auto",
    outputSchema: {
      type: "object",
      properties: {
        companies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              round: { type: "string" },
              website: { type: "string" }
            },
            required: ["name", "round"]
          }
        }
      },
      required: ["companies"]
    }
  });
  const completedRun = await exa.agent.runs.pollUntilFinished(run.id);

  console.log(JSON.stringify(completedRun.output?.structured, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that raised a Series A or B in the last 6 months.",
      "effort": "auto",
      "outputSchema": {
        "type": "object",
        "properties": {
          "companies": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "website": { "type": "string" }
              },
              "required": ["name", "round"]
            }
          }
        },
        "required": ["companies"]
      }
    }'
  ```
</CodeGroup>

<div id="process-input-rows">
  ## 入力行を処理する
</div>

補完したい既存のデータセットがある場合は、`input.data` を使用します。各データエンティティにフィールドを追加することも、取り込んだデータをもとに関連するエンティティをさらに見つけることも、その両方を行うこともできます。

行のエンリッチメントの完全な例については、[Agent の例](/ja/docs/agent/examples#enrich-input-rows-code)を参照してください。

<div id="process-exclusions">
  ## 除外の処理
</div>

`input.exclusion` を使用すると、特定のエントリを実行結果から除外できます。以下の例では、かわいい動物トップ10を探していますが、ヤギとパンダのかわいさはすでにわかっているため、実行の対象から外しています。

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find the top 10 cutest animals. Return each animal's common name and a source URL.",
      input={
          "exclusion": [
              {"animal": "goat"},
              {"animal": "panda"},
          ]
      },
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find the top 10 cutest animals. Return each animal's common name and a source URL.",
    input: {
      exclusion: [
        { animal: "goat" },
        { animal: "panda" }
      ]
    }
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find the top 10 cutest animals. Return each animal'"'"'s common name and a source URL.",
      "input": {
        "exclusion": [
          { "animal": "goat" },
          { "animal": "panda" }
        ]
      }
    }'
  ```
</CodeGroup>

<div id="connect-data-sources">
  ## データソースを接続する
</div>

インデックスはすべての実行でデフォルトで利用できます。`dataSources` は、[Exa Connect](/ja/docs/agent/connect/overview) のパートナーを追加する場合にのみ使用してください。各エントリでは `provider` を1つ指定します。`outputSchema` 内のプロパティが特定のソース (例: &quot;Similarweb から&quot;) を参照している場合、Exa Agent はウェブページから推測せず、該当するプロバイダーのツールを呼び出します。

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

データパートナーの全一覧と各パートナーの使用例については、[Exa Connect](/ja/docs/agent/connect/overview) を参照してください。

<div id="continue-from-a-previous-run">
  ## 以前の実行から続ける
</div>

`previousRunId` を使用すると、以前のレスポンスに対してフォローアップの質問を送信できます。フォローアップごとに、独自の ID を持つ新しい実行が開始されます。`previousRunId` はコンテキストを新しい実行に引き継ぐためのもので、新しい実行の ID として再利用されることはありません。

<CodeGroup>
  ```python Python theme={null}
  import json
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Narrow that list to companies hiring in San Francisco.",
      previous_run_id="agent_run_01j...",
  )

  print(json.dumps(run.model_dump(), indent=2))
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Narrow that list to companies hiring in San Francisco.",
    previousRunId: "agent_run_01j..."
  });

  console.log(JSON.stringify(run, null, 2));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Narrow that list to companies hiring in San Francisco.",
      "previousRunId": "agent_run_01j..."
    }'
  ```
</CodeGroup>

<div id="find-a-run-id">
  ## 実行 ID を確認する
</div>

最近の実行を一覧表示し、各実行のステータスを確認します。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  runs = exa.agent.runs.list(
      limit=10,
  )

  for run in runs.data:
      query = (run.request or {}).get("query", "")
      print(f"{run.id}\t{run.status}\t{run.created_at}\t{query}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const list = await exa.agent.runs.list({
    limit: 10
  });

  for (const run of list.data) {
    const query = run.request?.query ?? "";
    console.log(`${run.id}\t${run.status}\t${run.createdAt}\t${query}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/agent/runs?limit=10" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="pricing">
  ## 料金
</div>

料金は従量課金制で、コンポーネントごとに設定されています。

| コンポーネント             | 料金                |
| ------------------- | ----------------- |
| Agent Compute Units | `1 ACU = $0.10`   |
| Search ツール呼び出し      | `$0.005 / search` |

<Note>
  コンタクトエンリッチメントは、上記の基本料金コンポーネントとは別に課金されます。メールアドレスのコンタクトエンリッチメントは `$0.02 / email`、電話番号のコンタクトエンリッチメントは `$0.07 / phone number` です。
</Note>

`usage.agentComputeUnits` は、実行全体で消費されたモデルの計算量を表します。複雑なクエリ、特に `input.data` フィールドが大きいクエリでは、推論ステップやツール呼び出しが増えるため、消費される ACU も多くなります。

同時実行数とレート制限については、[Agent の制限](/ja/docs/admin/billing#agent-limits)を参照してください。

<div id="effort">
  ### Effort
</div>

`effort` を使用して、実行ごとのコストと推論レベルを選択します。サポートされる値は `minimal`、`low`、`medium`、`high`、`xhigh`、`auto`、`max` で、デフォルトは `auto` です。固定の effort はリクエストごとの料金が一定で予測しやすく、`auto` とベータ版の `max` は使用量に応じた従量課金です。

| Effort    | 料金                              |
| --------- | ------------------------------- |
| `minimal` | `$0.012 / request`              |
| `low`     | `$0.025 / request`              |
| `medium`  | `$0.10 / request`               |
| `high`    | `$0.50 / request`               |
| `xhigh`   | `$1.00 / request`               |
| `auto`    | 従量課金。デフォルトの上限 `$5` まで           |
| `max`     | **ベータ版**、従量課金。デフォルトの上限 `$20` まで |

<Info>
  Agent Max は effort が最も高いティアで、レイテンシやコストよりも網羅性と徹底性を
  重視する作業に適しています。大規模なリスト作成、複数ソースにわたる深いリサーチ、
  検証が難しい条件などが該当します。現在パブリックベータ版のため、
  `effort: "max"` を指定するリクエストには `Exa-Beta: agent-max-effort-2026-07-27` を含める必要があります。
  このヘッダーには、複数のベータトークンをカンマ区切りで指定できます。
</Info>

`budget.maxCostDollars` は、`auto` および `max` で実行ごとの上限を設定する任意のパラメーターです。指定できる範囲は `$1`〜`$100` です。標準の最大値は `$100` ですが、サーバー側でより低い最大値が設定されている場合があります。デフォルトの上限は、`auto` が `$5`、`max` が `$20` です。これは固定料金ではなく上限のため、早く完了した実行はコストが低くなります。固定の effort では budget を指定できません。

<div id="choosing-an-effort-mode">
  ### effortモードの選び方
</div>

固定のeffortモードは、標準的なリサーチでリクエストごとの料金を予測しやすくしたい場合に適しています。リスト作成のように、エンティティ数がリクエストごとに変わり、作業範囲が一定でない場合は `auto` を使用してください。

| Effort    | 適した用途                          | 推奨されるスキーマの複雑さ              | 実行時間の目安         |
| --------- | ------------------------------ | -------------------------- | --------------- |
| `minimal` | 最低コストでの調べもの、対象がごく限られた事実確認、短い回答 | 1〜2個のフィールド、浅いスキーマ          | 最も安価、網羅性は最も低い   |
| `low`     | 簡単な調べもの、対象が限られた事実確認、短い回答       | 少数のフィールド、浅いスキーマ            | 高速、軽めのリサーチ      |
| `medium`  | ほとんどの標準的なリサーチタスクで最初に試すデフォルト    | 中程度のフィールド数、単純なネストされたオブジェクト | 品質と実行時間のバランスが良い |
| `high`    | 難度の高いリサーチ、より多くの引用、より厳格な網羅性     | 大きめのスキーマ、または細かな判断を要するフィールド | 低速だがより徹底的       |
| `xhigh`   | コストやレイテンシよりも網羅性を重視する重要度の高いタスク  | 複雑なスキーマ、多数のフィールド、検証が難しい項目  | 固定effortの中で最も低速 |
| `auto`    | 作業範囲が一定でない作業、リスト作成、難易度が不明なタスク  | 柔軟。エンティティ数や必要な作業量が不明な場合に便利 | 変動あり            |
| `max`     | 最大限のeffortによるリサーチ (ベータ)        | 複雑なスキーマ、多数のフィールド、検証が難しい項目  | 実行時間が最も長い       |

標準的な単一エンティティのリサーチでは、まず `medium` から始めてください。網羅性よりもコストやレイテンシを優先する場合は `low` または `minimal` に下げます。出力スキーマが大きい場合、フィールドの検証が必要な場合、またはタスクに深い推論が必要な場合は `high` または `xhigh` に上げます。リスト作成や多数のエンティティを返す可能性のあるワークフローなど、作業範囲が事前にわからない場合は `auto` を使用してください。

実行時間は、クエリの難易度、スキーマの複雑さ、外部ソースの可用性によって変動します。effortモードは厳密なレイテンシを保証するものではなく、品質・コスト・実行時間のトレードオフを調整するものと考えてください。

<div id="run-with-max-effort">
  ### max effort で実行する
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.beta.agent.runs.create(
      query="Find all companies building browser automation tools in the United States.",
      effort="max",
      budget={"maxCostDollars": 10},
      betas=["agent-max-effort-2026-07-27"],
  )
  print(run)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.beta.agent.runs.create({
    query: "Find all companies building browser automation tools in the United States.",
    effort: "max",
    budget: { maxCostDollars: 10 },
    betas: ["agent-max-effort-2026-07-27"]
  });
  console.log(run);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: agent-max-effort-2026-07-27" \
    -d '{
      "query": "Find all companies building browser automation tools in the United States.",
      "effort": "max",
      "budget": { "maxCostDollars": 10 }
    }'
  ```
</CodeGroup>

SDK のサンプルを実行するには、Agent Max に対応したバージョンの `exa-py` または `exa-js` が必要です。

<div id="zero-data-retention">
  ## Zero Data Retention
</div>

Exa Agent は [Zero Data Retention](/ja/docs/admin/security/zero-data-retention)(ZDR)に対応しています。ZDR はチーム単位で有効化されます。アカウントで有効にするには、[お問い合わせ](mailto:sales@exa.ai)ください。

チームで ZDR が有効になっている場合:

* ストリーミング(`Accept: text/event-stream`)で実行を作成して出力をリアルタイムで受け取るか、非同期実行を保持期間内にポーリングしてください。
* 実行データを取得できるのは、実行中および終了状態に達してから最大 10 分間です。この期間を過ぎると、実行は取得できなくなります。
* `previousRunId` は使用できません。
* Exa Connect の `dataSources` は使用できません。これを含むリクエストには `400` エラーが返されます。

<div id="next-steps">
  ## 次のステップ
</div>

<Columns cols={2}>
  <Card title="インデックスの内容" icon="search" href="/ja/docs/search/data/overview" cta="ガイドを開く" arrow="true">
    公開ウェブ全体にわたるニュース、コード、企業、人物のソースを確認できます。
  </Card>

  <Card title="Exa Connect" icon="database" href="/ja/docs/agent/connect/overview" cta="ガイドを開く" arrow="true">
    プレミアムパートナーのデータベースを実行に接続できます。
  </Card>

  <Card title="Agent のベストプラクティス" icon="lightbulb" href="/ja/docs/agent/best-practices" cta="ガイドを開く" arrow="true">
    Exa Agent を活用するためのベストプラクティスを紹介します。
  </Card>

  <Card title="Agent の例" icon="code" href="/ja/docs/agent/examples" cta="ガイドを開く" arrow="true">
    Exa Agent の具体的な使用例を紹介します。
  </Card>
</Columns>