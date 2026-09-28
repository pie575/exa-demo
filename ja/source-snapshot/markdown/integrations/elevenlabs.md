> ## ドキュメントインデックス {#documentation-index}
>
> ドキュメントインデックスの全体は https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

# ElevenLabs {#elevenlabs}

> ElevenLabs の音声エージェントに Exa のウェブ検索を追加します。

***

ElevenLabs の音声エージェントは、Exa を **webhook ツール**として使用することで、会話の途中でウェブを検索できます。エージェントが最新の情報を必要と判断すると、ElevenLabs は Exa の `/search` エンドポイントに直接 HTTP POST リクエストを送信します。お客様側でサーバーやミドルウェアを用意する必要はありません。

Exa を ElevenLabs に接続する方法は 2 つあります。

| 方式                        | セットアップ                    | 柔軟性                             |
| ------------------------- | ------------------------- | ------------------------------- |
| **webhook ツール** (推奨)      | API またはダッシュボードで設定         | 検索パラメータ、コンテンツオプション、ヘッダーを細かく制御可能 |
| **組み込みの Exa 連携** (アルファ版)  | ElevenLabs ダッシュボードでワンクリック | 手軽だが設定の自由度は低い                   |

このガイドでは、Exa の呼び出し方を細かく制御できる webhook ツール方式について説明します。連携は [ElevenLabs ダッシュボード](https://elevenlabs.io/app/conversational-ai)から設定することもできます。

## 仕組み {#how-it-works}

1. ユーザーが音声エージェントに話しかけます
2. LLM がツールの説明をもとに `web_search` を呼び出すかどうかを判断します
3. ElevenLabs が、設定したヘッダーとボディを付けて `https://api.exa.ai/search` に POST リクエストを送信します
4. LLM が決定したパラメーター (検索の `query`) が、あらかじめ設定した固定値 (`type`、`numResults`、`contents`) とマージされます
5. Exa の検索結果が LLM に返され、LLM がそれをもとに会話形式で応答します

サーバー、コールバック URL、リスナーはいずれも不要です。ElevenLabs が HTTP クライアントとして Exa を直接呼び出します。ツール呼び出しのタイムアウトは 20 秒です。

## 前提条件 {#prerequisites}

* [Exa APIキー](https://dashboard.exa.ai/api-keys)
* [ElevenLabs APIキー](https://elevenlabs.io/app/settings/api-keys)

<Card title="Exa APIキーを取得" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  ダッシュボードでキーを作成してください。新規アカウントには無料クレジットが付与されます。
</Card>

## はじめに {#get-started}

<Steps>
  <Step title="webhook ツールを作成する">
    ElevenLabs の [Create Tool API](https://elevenlabs.io/docs/api-reference/tools/create) を使用して、Exa の search エンドポイントを呼び出す webhook ツールを登録します。

    ポイントは、`constant_value` を持つプロパティは固定値 (すべてのリクエストで送信) となり、`description` を持つプロパティは実行時に LLM が決定するという点です。

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/tools" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "tool_config": {
          "type": "webhook",
          "name": "web_search",
          "description": "Search the web using Exa. Use this when the user asks anything that needs current or factual information.",
          "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
              "x-api-key": "YOUR_EXA_API_KEY",
              "Content-Type": "application/json",
              "x-exa-integration": "elevenlabs"
            },
            "request_body_schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "Natural language search query. Be specific."
                },
                "type": {
                  "type": "string",
                  "constant_value": "instant"
                },
                "numResults": {
                  "type": "integer",
                  "constant_value": 5
                },
                "contents": {
                  "type": "object",
                  "properties": {
                    "highlights": {
                      "type": "boolean",
                      "constant_value": true
                    }
                  }
                }
              },
              "required": ["query"]
            }
          }
        }
      }'
    ```

    これで、次のように動作するツールが作成されます。

    * `query` — 会話のコンテキストに基づいて LLM が値を設定します
    * `type: "instant"` — Exa で最も高速な検索モード (~150ms) を使用します
    * `numResults: 5` — 1 回の検索につき 5 件の結果を返します
    * `contents.highlights: true` — トークン効率の高いハイライトスニペットを返します (音声のレイテンシを抑えるのに最適)

    返された `id` を控えておいてください。ツールをエージェントに接続する際に必要です。

    <Note>
      すでにエージェントがある場合は、ステップ 2 をスキップして、ElevenLabs のダッシュボードの **Agent &gt; Tools**、または [Update Agent API](https://elevenlabs.io/docs/api-reference/agents/update) から既存のエージェントにツールを追加できます。ツールはエージェントにアタッチするまで機能しません。
    </Note>
  </Step>

  <Step title="ツールを使うエージェントを作成する">
    会話型エージェントを作成し、ID を指定して webhook ツールをアタッチします。

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/agents/create" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Exa Search Assistant",
        "conversation_config": {
          "agent": {
            "prompt": {
              "prompt": "You are a helpful voice assistant with real-time web search powered by Exa. When users ask questions that need current information, use the web_search tool.\n\nGuidelines:\n- Search proactively for time-sensitive or factual questions.\n- Summarize results conversationally — do not read URLs aloud.\n- Cite sources naturally.\n- Keep responses concise — this is voice.",
              "tool_ids": ["YOUR_TOOL_ID"]
            },
            "first_message": "Hey! I can search the web for you in real-time. What would you like to know?"
          }
        }
      }'
    ```

    レスポンスには `agent_id` が含まれます。ElevenLabs のダッシュボードでエージェントを開いてテストしてください。

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="ウィジェットを埋め込む">
    わずか 2 行の HTML で、任意のウェブページにエージェントを追加できます。

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

## Python の完全なサンプル {#full-python-example}

このスクリプトは、webhook ツールとエージェントの両方を 1 回の実行でまとめて作成します。

```python python theme={null}
import os
import requests

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
EXA_API_KEY = os.environ["EXA_API_KEY"]
BASE = "https://api.elevenlabs.io/v1/convai"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

# 1. Webhookツールを作成
tool_resp = requests.post(f"{BASE}/tools", headers=HEADERS, json={
    "tool_config": {
        "type": "webhook",
        "name": "web_search",
        "description": (
            "Search the web using Exa. Use this when the user asks anything "
            "that needs current or factual information."
        ),
        "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
                "x-api-key": EXA_API_KEY,
                "Content-Type": "application/json",
                "x-exa-integration": "elevenlabs",
            },
            "request_body_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Natural language search query. Be specific.",
                    },
                    "type": {"type": "string", "constant_value": "instant"},
                    "numResults": {"type": "integer", "constant_value": 5},
                    "contents": {
                        "type": "object",
                        "properties": {
                            "highlights": {
                                "type": "boolean",
                                "constant_value": True,
                            }
                        },
                    },
                },
                "required": ["query"],
            },
        },
    }
})
tool_resp.raise_for_status()
tool_id = tool_resp.json()["id"]
print(f"Tool created: {tool_id}")

# 2. エージェントを作成
agent_resp = requests.post(f"{BASE}/agents/create", headers=HEADERS, json={
    "name": "Exa Search Assistant",
    "conversation_config": {
        "agent": {
            "prompt": {
                "prompt": (
                    "You are a helpful voice assistant with real-time web search "
                    "powered by Exa. When users ask questions that need current "
                    "information, use the web_search tool.\n\n"
                    "Guidelines:\n"
                    "- Search proactively for time-sensitive or factual questions.\n"
                    "- Summarize results conversationally — do not read URLs aloud.\n"
                    "- Cite sources naturally.\n"
                    "- Keep responses concise — this is voice."
                ),
                "tool_ids": [tool_id],
            },
            "first_message": "Hey! I can search the web for you. What would you like to know?",
        }
    },
})
agent_resp.raise_for_status()
agent_id = agent_resp.json()["agent_id"]
print(f"Agent created: {agent_id}")
print(f"Dashboard: https://elevenlabs.io/app/conversational-ai/agents/{agent_id}")
```

実行します。

```bash bash theme={null}
export ELEVENLABS_API_KEY="your-key"
export EXA_API_KEY="your-key"
python elevenlabs_exa_webhook.py
```

## 検索パラメータのカスタマイズ {#customizing-search-parameters}

Webhookツールのボディスキーマは、[ExaのSearch API](/ja/docs/reference/search)にそのまま対応しています。よく使われる設定例は次のとおりです。

### 検索タイプ {#search-type}

`type` 定数で速度と品質のトレードオフを調整します。

| タイプ       | レイテンシ  | 最適な用途      |
| --------- | ------ | ---------- |
| `instant` | ~150ms | 音声会話 (推奨)  |
| `auto`    | ~1s    | 汎用         |

音声エージェントでは、まず `instant` を使用してください。クエリごとに現時点で最適な検索モードを Exa に選択させたい場合は、`auto` を使用します。

### コンテンツオプション {#content-options}

`contents` オブジェクトで、結果の返却形式を選択します。

```json json theme={null}
{
  "contents": {
    "type": "object",
    "properties": {
      "highlights": {
        "type": "boolean",
        "constant_value": true
      }
    }
  }
}
```

* **`highlights`** — トークン効率の高い抜粋です。LLM のコンテキストを圧迫せずに関連性の高いスニペットを取得したい場合に使用します。`true` を渡すと、最高品質のデフォルト設定が適用されます。
* **`text`** — ページ全体の Markdown です。エージェントがページコンテンツ全体を必要とする場合に使用します。長さを制限するには `maxCharacters` を設定します。
* **`summary`** — LLM が生成した各ページの要約です。レイテンシは高くなりますが、情報を統合したコンテンツが得られます。

音声エージェントには `highlights: true` をデフォルトとして推奨します。関連性と応答速度のバランスに優れています。

### 結果のフィルタリング {#filtering-results}

ドメインや日付のフィルターを定数として追加します。

```json json theme={null}
{
  "includeDomains": {
    "type": "array",
    "constant_value": ["reuters.com", "apnews.com", "bbc.com"]
  }
}
```

```json json theme={null}
{
  "startPublishedDate": {
    "type": "string",
    "constant_value": "2025-01-01T00:00:00.000Z"
  }
}
```

### 結果の件数 {#number-of-results}

ユースケースに応じて `numResults` を調整してください。音声用途では、結果を3〜5件に抑えるとレスポンスを高速に保てます。リサーチ重視のエージェントでは、10件以上に設定するとより幅広い情報をカバーできます。

## スキーマリファレンス {#schema-reference}

ElevenLabs の webhook ツールは、次のプロパティタイプを持つ JSON スキーマを使用します。

* **`constant_value`** — すべてのリクエストで送信される固定値です。LLM がこの値を参照したり変更したりすることはありません。文字列、数値、ブール値に使用できます。
* **`description`** — LLM が実行時にこの説明に基づいて値を決定します。`query` のような動的なパラメータに使用します。
* **ネストされたオブジェクト** — `type: "object"` と `properties` を組み合わせて、`contents.highlights` のようなネスト構造を作成します。

ダッシュボードでは、パラメータごとに **Fixed** と **LLM** のモードを切り替えられます。

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="Fixed と LLM のモード切り替えを示す ElevenLabs webhook ツールのパラメータ設定" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

**Fixed** に設定したパラメータ (API では `constant_value` で指定) は、すべてのリクエストでそのまま送信されます。**LLM** に設定したパラメータ (`description` で指定) は、モデルが実行時に値を選択します。LLM が決定するパラメータが 1 つ増えるごとにツール呼び出しのステップが追加され、レスポンスのレイテンシが増加します。できるだけ多くのパラメータを Fixed にしておいてください。

ElevenLabs の webhook ツールスキーマの詳細は、[ElevenLabs の server tools ドキュメント](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools)を参照してください。

## 組み込みの Exa 連携 (アルファ版) {#built-in-exa-integration-alpha}

ElevenLabs には組み込みの Exa 連携もあり、エージェントのダッシュボードの **Tools &gt; Integrations** から利用できます。こちらはセットアップが簡単な反面、webhook ツールを使う方法に比べて検索パラメータのカスタマイズが難しくなります。

検索タイプ、コンテンツオプション、フィルタリングを細かく制御したい場合は、前述の webhook ツールを使う方法をおすすめします。