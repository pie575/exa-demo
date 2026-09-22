> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，请先通过该文件了解所有可用页面。

<div id="elevenlabs">
  # ElevenLabs
</div>

> 为 ElevenLabs 语音 agent 添加 Exa 网页搜索能力。

***

ElevenLabs 语音 agent 可以把 Exa 作为 **webhook tool**，在对话过程中执行网页搜索。当 agent 判断需要最新信息时，ElevenLabs 会直接向 Exa 的 `/search` 端点发起 HTTP POST 请求，你无需自行搭建 server 或中间层。

将 Exa 接入 ElevenLabs 有两种方式：

| 方式                                    | 配置                    | 灵活性                                |
| ------------------------------------- | --------------------- | ---------------------------------- |
| **Webhook tool** (推荐)                 | 通过 API 或控制台配置         | 可完全控制搜索参数、content options 和 header |
| **Built-in Exa integration** (alpha)  | 在 ElevenLabs 控制台中一键启用 | 更简单，但配置能力有限                        |

本指南介绍 webhook tool 方式，它让你完全掌控 Exa 的调用方式。你也可以通过 [ElevenLabs 控制台](https://elevenlabs.io/app/conversational-ai)配置该 integration。

<div id="how-it-works">
  ## 工作原理
</div>

1. 用户与语音 agent 对话
2. LLM 根据工具描述决定调用 `web_search`
3. ElevenLabs 带上你配置的 header 和请求体，向 `https://api.exa.ai/search` 发送 POST 请求
4. 由 LLM 确定的参数 (搜索 `query`) 会与你设置的固定值 (`type`、`numResults`、`contents`) 合并
5. Exa 的结果回传给 LLM，由其以对话方式作出回应

无需 server，无需回调 URL，也无需监听器。ElevenLabs 本身就是直接调用 Exa 的 HTTP 客户端。工具调用的超时时间为 20 秒。

<div id="prerequisites">
  ## 前置条件
</div>

* 一个 [Exa API 密钥](https://dashboard.exa.ai/api-keys)
* 一个 [ElevenLabs API 密钥](https://elevenlabs.io/app/settings/api-keys)

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<div id="get-started">
  ## 快速开始
</div>

<Steps>
  <Step title="创建 webhook tool">
    使用 ElevenLabs [Create Tool API](https://elevenlabs.io/docs/api-reference/tools/create) 注册一个指向 Exa search 端点的 webhook tool。

    关键概念：带 `constant_value` 的属性是固定值 (每次请求都会发送) ，而带 `description` 的属性由 LLM 在运行时决定。

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

    这样创建出的 tool 具有以下特点：

    * `query` — 由 LLM 根据对话上下文填充
    * `type: "instant"` — 使用 Exa 最快的搜索模式 (约 150 毫秒)
    * `numResults: 5` — 每次 search 返回 5 条结果
    * `contents.highlights: true` — 返回更省 token 的 highlights 片段 (对语音场景的延迟最友好)

    保存返回的 `id`，后续将 tool 关联到 agent 时需要用到。

    <Note>
      如果你已经有 agent，可以跳过第 2 步，在 ElevenLabs 控制台的 **Agent &gt; Tools** 中将该 tool 添加到现有 agent，或通过 [Update Agent API](https://elevenlabs.io/docs/api-reference/agents/update) 添加。在附加到 agent 之前，该 tool 不会生效。
    </Note>
  </Step>

  <Step title="创建带有该 tool 的 agent">
    创建一个对话 agent，并通过 ID 附加该 webhook tool。

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

    响应中包含 `agent_id`。在 ElevenLabs 控制台中打开该 agent 即可测试：

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="嵌入组件">
    用两行 HTML 即可把该 agent 添加到任意网页：

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

<div id="full-python-example">
  ## 完整 Python 示例
</div>

该脚本会在一次运行中同时创建 webhook tool 和 agent：

```python python theme={null}
import os
import requests

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
EXA_API_KEY = os.environ["EXA_API_KEY"]
BASE = "https://api.elevenlabs.io/v1/convai"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

# 1. 创建 webhook tool
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

# 2. 创建 agent
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

运行：

```bash bash theme={null}
export ELEVENLABS_API_KEY="your-key"
export EXA_API_KEY="your-key"
python elevenlabs_exa_webhook.py
```

<div id="customizing-search-parameters">
  ## 自定义搜索参数
</div>

webhook tool 的请求体 schema 与 [Exa 的 search API](/zh/docs/reference/search) 直接对应。以下是几种常见配置：

<div id="search-type">
  ### 搜索类型
</div>

通过 `type` 常量控制速度与质量的权衡：

| 类型        | 延迟     | 适用场景       |
| --------- | ------ | ---------- |
| `instant` | ~150ms | 语音对话 (推荐)  |
| `auto`    | ~1s    | 通用场景       |

语音 agent 建议从 `instant` 开始。若希望 Exa 为每个 query 自动选择当前最合适的搜索模式，请使用 `auto`。

<div id="content-options">
  ### Content options
</div>

通过 `contents` 对象选择结果的返回方式：

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

* **`highlights`** — 节省 token 的摘录。当你只想获取相关片段、又不想撑爆 LLM 上下文时使用。传入 `true` 即可使用质量最高的默认配置。
* **`text`** — 完整的页面 markdown。当 agent 需要完整页面内容时使用。可通过 `maxCharacters` 限制长度。
* **`summary`** — 由 LLM 为每个页面生成的摘要。延迟较高，但能提供经过综合的内容。

对于语音 agent，推荐默认使用 `highlights: true`，它在相关性与响应速度之间取得了良好平衡。

<div id="filtering-results">
  ### 过滤结果
</div>

以常量形式添加域名或日期过滤条件：

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

<div id="number-of-results">
  ### 结果数量
</div>

根据使用场景调整 `numResults`。语音场景下，3-5 条结果可以保证响应速度；面向研究的 agent 则可用 10 条以上，以获得更广的覆盖面。

<div id="schema-reference">
  ## Schema reference
</div>

ElevenLabs 的 webhook tool 使用包含以下属性类型的 JSON schema：

* **`constant_value`** — 每次请求都会发送的固定值。LLM 既看不到它，也无法修改它。支持字符串、数字和布尔值。
* **`description`** — LLM 在运行时根据该描述确定取值。适用于 `query` 等动态参数。
* **嵌套对象** — 使用 `type: "object"` 配合 `properties` 构建 `contents.highlights` 这类嵌套结构。

每个参数在控制台中都有一个模式开关 — **Fixed** 或 **LLM**：

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="ElevenLabs webhook tool 参数配置，展示 Fixed 与 LLM 模式开关" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

设为 **Fixed** 的参数 (在 API 中以 `constant_value` 标记) 会在每次请求中原样发送；设为 **LLM** 的参数 (以 `description` 标记) 则由模型在运行时决定取值。请尽量将参数设为 Fixed — 每个交由 LLM 决定的参数都会多出一次工具调用步骤，进而拉高响应延迟。

完整的 ElevenLabs webhook tool schema 请参阅 [ElevenLabs server tools 文档](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools)。

<div id="built-in-exa-integration-alpha">
  ## Built-in Exa integration (alpha)
</div>

ElevenLabs 还提供内置的 Exa integration，可在 agent 控制台的 **Tools &gt; Integrations** 中找到。这种方式配置更简单，但与 webhook tool 方式相比，自定义搜索参数更为不便。

如果需要完全掌控搜索类型、content options 和过滤，建议采用上文介绍的 webhook tool 方式。