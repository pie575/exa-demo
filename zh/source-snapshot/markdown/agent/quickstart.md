> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="exa-agent">
  # Exa Agent
</div>

> 运行深度研究、列表构建和 enrichment 工作流，并返回结构化输出。

Exa Agent 是一个异步、按用量计费的端点，适用于列表构建、enrichment、深度研究等高算力任务。它能处理复杂推理，并可返回大量结构化输出字段。

可以把它理解为一个上下文 agent：你描述想要的数据以及希望返回的结构，Exa Agent 便会编排实现这一目标所需的工具调用。单次运行可以从不同角度并行发起多次 search，读取并提炼相应网页内容，把列表构建拆分为并行执行的子任务，依据你的 criteria 逐一核验候选项，补全联系人信息，并 query 你所接入的任意 [Exa Connect](/zh/docs/agent/connect/overview) 数据合作伙伴。最终你会得到一个带 grounding 的结构化结果，其中已整合好全部上下文，而不必自己逐个编排 `/search` 和 `/contents` 调用。

每次运行都可以返回自然语言答案、经 schema 校验的 JSON、字段级 grounding、元数据以及成本明细。你可以稍后获取已完成的运行、列出历史运行、回放事件，或从上一次运行继续。

<Tip>
  更喜欢用 MCP？Exa Agent 和 [Exa Connect](/zh/docs/agent/connect/overview) 均已在 [Exa MCP](/zh/docs/get-started/exa-mcp#exa-agent) 中提供。启用 `tools=agent_run`，即可在 Claude、Cursor 等 MCP 客户端中运行多步研究、列表构建、enrichment 并获得结构化输出。
</Tip>

<div id="when-to-use-exa-agent">
  ## 何时使用 Exa Agent
</div>

当工作流不止需要一次搜索或内容抽取调用时，或者当你原本得自己写一套「搜索—读取页面—验证」的循环来汇集数据时，就该用 Exa Agent：

* 基于开放式 criteria 构建列表，并对每条结果进行数据丰富
* 跨多个字段调研实体，并附上引用来源
* 执行多跳任务，例如“先找到公司，再找到它们的决策者”
* 从长时间运行的网络调研任务中输出结构化 JSON
* 将网络调研与高级数据合作伙伴结合，汇成一个有据可依的答案
* 在上一次运行的基础上继续追加请求，例如“再找 10 条结果”

Exa Agent 在设计上延迟较高，且采用异步模式。如果你只需要一次低延迟搜索并自行编排调用，请从 [Search API](/zh/docs/search/quickstart) 入手。

<div id="quickstart">
  ## 快速开始
</div>

此示例会启动一个运行，构建符合你 criteria 的人员结构化列表，并以 JSON 形式在 `output.structured` 中返回结果。

<div id="1-install-the-exa-sdk">
  ### 1. 安装 Exa SDK
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
  ### 2. 设置 API key
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
  ### 3. 创建运行
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

创建运行时加上 `Accept: text/event-stream`，即可在运行进入队列、开始执行和完成时接收 Server-Sent Events (SSE) 。详见[流式事件](#stream-events)。

<div id="4-poll-for-completion">
  ### 4. 轮询直至完成
</div>

如果不使用事件流，请保存返回的 `id`，并轮询该运行，直到其进入终止状态。

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

已完成的运行包含：

* `output.text`：自然语言形式的回答
* `output.structured`：提供 `outputSchema` 时返回的已校验 JSON
* `output.grounding`：文本或结构化字段的引用来源 (若有输出)
* `costDollars`：本次运行的费用明细

<Note>
  Exa Agent 也可通过兼容 OpenAI 的 Responses API 使用。将 OpenAI SDK 指向
  `https://api.exa.ai`，设置 `model: "exa-agent"`，并选择同步、流式或后台执行方式。参见 [OpenAI SDK
  兼容性](/zh/docs/integrations/openai-sdk#agent-via-responses-api)。
</Note>

<div id="verify-and-enrich-a-specific-entity">
  ## 核实并 enrich 特定实体
</div>

除了构建列表之外，还可以用 Exa Agent 来考察某个已知的单一实体、对照权威来源核实某项说法，并返回结构化的 enrichment 结果。本示例会检查某公司官网是否有可公开访问的定价页面，若有则用定价详情对结果进行 enrichment。该 schema 仅要求 `domain` 和 `verdict`，其余字段均为可选的 enrichment。

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
  用于验证类工作流的 schema 应当考虑不确定性。将可能无法验证的字段设为可为 null，并且不要将其列入 `required`，这样 agent 就可以返回 `null`，而不是编造一个值。`verdict` 枚举区分了检查失败 (`cannot_verify`) 与真正的否定证据 (`absent`) ：站点无法访问并不能证明该页面不存在。
</Note>

<div id="stream-events">
  ## 流式事件
</div>

流式传输会保持创建请求处于打开状态，并持续发送 Server-Sent Events (SSE)，直到运行完成。事件类型与负载详见[事件格式](#event-format)。

在 Python 中设置 `stream=True`，在 JavaScript 中设置 `stream: true`，或在 HTTP 请求中发送 `Accept: text/event-stream`：

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
  ### 事件格式
</div>

每个 SSE 帧都包含事件 ID、事件名称和 JSON 负载：

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

流中还可能包含注释行，例如 `: keep-alive`。SSE 客户端会自动忽略注释，自定义解析器也应如此处理。

<div id="event-types">
  ### 事件类型
</div>

| 事件                    | `data` 负载                             | 用途说明                                                                                   |
| --------------------- | ------------------------------------- | -------------------------------------------------------------------------------------- |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | 请求被受理后立即保存运行 ID。                                                                       |
| `agent_run.started`   | `{ id, status: "running" }`           | 将该运行标记为正在处理中。                                                                          |
| `agent_run.completed` | 已完成的 Agent 运行对象                       | 从 `data.output.text` 或 `data.output.structured` 读取最终答案，从 `data.output.grounding` 读取引用。 |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | 展示 `error.code` 和 `error.message`；此时不会有已完成的输出。                                         |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | 停止消费该流，并按已取消状态处理此次运行。                                                                  |

属于同一研究步骤的事件会包含 `callId`，它与工具进度事件中的 `item.call_id` 相对应。可借助它将搜索轨迹、来源和工具进度归到一组。部分搜索轨迹描述是异步生成的，可能晚于其所描述的来源或工具事件到达，因此不要仅凭到达顺序来做关联。

请将 `agent_run.source.added` 视为实时预览，而非完整的引用列表。运行结束时的 `output.grounding` 才是权威的 grounding 输出。

<div id="replay-stored-events">
  ### 回放已存储的事件
</div>

对于非 ZDR 运行，[`GET /agent/runs/{id}/events`](/zh/docs/reference/agent-api/list-run-events) 会以分页 JSON 形式返回已存储的事件。发送 `Accept: text/event-stream` 可将已存储的事件以 SSE 形式回放，发送 `Last-Event-ID` 可跳过客户端已处理的事件：

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

回放端点只发送请求时已存储的事件，随后即关闭连接；它不会继续跟踪正在进行的运行。ZDR 运行不保留事件，因此无法回放。

为保证向前兼容，请忽略应用无法识别的事件名称，并持续处理，直到收到终止事件。

<div id="return-structured-json">
  ## 返回结构化 JSON
</div>

使用 `outputSchema`，即可在 `output.structured` 中返回经过 schema 校验的 JSON。

`outputSchema` 支持 [JSON Schema 规范](https://json-schema.org/)。

若要获取联系方式，请在 `outputSchema` 中描述所需的联系字段，并采用标准的 JSON Schema 写法：电子邮箱用 `{ "type": "string", "format": "email" }`，电话号码用 `{ "type": "string", "format": "phone" }`，URL 用 `{ "type": "string", "format": "uri" }`。尽可能用 `maxItems` 限定列表长度，这样联系方式 enrichment 的成本上限才可预估。

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
  ## 处理输入行
</div>

当你已有一组需要 enrichment 的数据时，可使用 `input.data`。你可以为每个数据实体添加更多字段、基于传入的数据发掘出更多实体，或者两者同时进行。

完整的行 enrichment 示例，请参阅 [Agent 示例](/zh/docs/agent/examples#enrich-input-rows-code)。

<div id="process-exclusions">
  ## 处理排除项
</div>

使用 `input.exclusion` 可将某些条目排除在运行结果之外。在下面的示例中，我们想找出最可爱的 10 种动物，但因为已经知道山羊和熊猫有多可爱，所以把它们排除在本次运行之外。

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
  ## 接入数据源
</div>

索引在每次运行中都默认可用。`dataSources` 仅用于接入 [Exa Connect](/zh/docs/agent/connect/overview) 合作伙伴，每一项对应选择一个 `provider`。当 `outputSchema` 中的某个属性指定了特定来源 (例如 &quot;from Similarweb&quot;) 时，Exa Agent 会调用对应的 provider 工具，而不是从网页内容中臆测结果。

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

请参阅 [Exa Connect](/zh/docs/agent/connect/overview)，查看完整的数据合作伙伴列表及各自的示例。

<div id="continue-from-a-previous-run">
  ## 从上一次运行继续
</div>

使用 `previousRunId` 可以针对上一次的响应进行追问。每次追问都会启动一次新的运行，并拥有各自独立的 ID。`previousRunId` 只负责把上下文带入新的运行，不会被复用为新运行的 ID。

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
  ## 查找运行 ID
</div>

列出最近的运行并查看其状态：

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
  ## 定价
</div>

费用按用量计算，并按组件分别计价：

| 组件                | 价格                |
| ----------------- | ----------------- |
| Agent 计算单元 (ACU)  | `1 ACU = $0.10`   |
| Search 工具调用       | `$0.005 / search` |

<Note>
  联系方式 Enrichment 不包含在上述核心计价组件中：邮箱联系方式 Enrichment 为 `$0.02 / email`，电话号码联系方式 Enrichment 为 `$0.07 / phone number`。
</Note>

`usage.agentComputeUnits` 用于衡量整次运行的模型计算量。复杂查询 (尤其是 `input.data` 字段较大的查询) 需要更多推理步骤和工具调用，因而消耗更多 ACU。

并发与速率限制请参阅 [Agent 限制](/zh/docs/admin/billing#agent-limits)。

<div id="effort">
  ### Effort
</div>

使用 `effort` 为每次运行选择成本与推理级别。支持的取值为 `minimal`、`low`、`medium`、`high`、`xhigh`、`auto` 和 `max`，默认值为 `auto`。固定档位的单次请求价格是可预期的，而 `auto` 和处于 beta 阶段的 `max` 则按用量计费：

| Effort    | 价格                           |
| --------- | ---------------------------- |
| `minimal` | `$0.012 / request`           |
| `low`     | `$0.025 / request`           |
| `medium`  | `$0.10 / request`            |
| `high`    | `$0.50 / request`            |
| `xhigh`   | `$1.00 / request`            |
| `auto`    | 按用量计费；不超过默认上限 `$5`           |
| `max`     | **Beta**，按用量计费；不超过默认上限 `$20` |

<Info>
  Agent Max 是最高的 effort 档位，适用于完整性和详尽程度比延迟或成本更重要的场景，
  例如大规模列表构建、多来源深度研究，以及难以验证的 criteria。该档位目前处于公开 beta 阶段：
  使用 `effort: "max"` 的请求必须带上 `Exa-Beta: agent-max-effort-2026-07-27`。该
  header 支持以逗号分隔的 beta 令牌列表。
</Info>

`budget.maxCostDollars` 是面向 `auto` 和 `max` 的可选单次运行花费上限，取值范围为 `$1`–`$100`；发布版本的最大值为 `$100`，但服务端可能配置更低的上限。默认上限为 `auto` `$5`、`max` `$20`。这只是上限，并非固定价格：提前结束的运行花费更少。固定 effort 档位不支持设置 budget。

<div id="choosing-an-effort-mode">
  ### 选择 effort 模式
</div>

如果你希望标准研究任务的单次请求价格可预测，固定 effort 模式非常合适。对于范围不确定的任务 (例如列表构建，实体数量可能每次请求都不同) ，请使用 `auto`。

| Effort    | 适用场景                    | 建议的 schema 复杂度       | 运行时预期         |
| --------- | ----------------------- | -------------------- | ------------- |
| `minimal` | 成本最低的查找、范围极窄的事实性任务、简短回答 | 一到两个字段，浅层 schema     | 最便宜，覆盖最不全面    |
| `low`     | 简单查找、范围较窄的事实性任务、简短回答    | 少量字段，浅层 schema       | 快速、轻量的研究      |
| `medium`  | 大多数标准研究任务的默认起点          | 中等字段数量，简单的嵌套对象       | 质量与运行时间兼顾     |
| `high`    | 难度更大的研究、更多引用、更严格的完整性要求  | 较大的 schema 或更细致的字段   | 更慢，更彻底        |
| `xhigh`   | 完整性比成本/延迟更重要的高价值任务      | 复杂 schema、大量字段、验证难度高 | 固定 effort 中最慢 |
| `auto`    | 范围不确定的任务、列表构建、任务难度未知    | 灵活；实体数量或所需工作量未知时尤其有用 | 不固定           |
| `max`     | 投入最高的研究 (beta)          | 复杂 schema、大量字段、验证难度高 | 运行时间最长        |

标准的单实体研究建议从 `medium` 起步。当成本和延迟比完整性更重要时，降到 `low` 或 `minimal`。当输出 schema 更大、字段需要验证，或任务需要更深入的推理时，提升到 `high` 或 `xhigh`。如果事先无法确定任务范围 (例如列表构建，或可能返回大量实体的工作流) ，请使用 `auto`。

运行时间会随 query 难度、schema 复杂度以及外部信息源的可用性而变化。请把 effort 模式看作质量、成本与运行时间之间的权衡，而非严格的延迟保证。

<div id="run-with-max-effort">
  ### 以最大投入级别运行
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

上述 SDK 示例要求 `exa-py` 或 `exa-js` 版本支持 Agent Max。

<div id="zero-data-retention">
  ## 零数据保留
</div>

Exa Agent 支持[零数据保留](/zh/docs/admin/security/zero-data-retention) (ZDR) 。ZDR 以团队为单位启用，如需为你的账户开启，请[联系我们](mailto:sales@exa.ai)。

团队启用 ZDR 后：

* 创建运行时使用流式传输 (`Accept: text/event-stream`) 实时获取输出，或在保留窗口内轮询异步运行。
* 运行数据在运行执行期间可用，并在其进入终止状态后最多保留 10 分钟。超过该窗口后，将无法再获取该运行。
* `previousRunId` 不可用。
* Exa Connect 的 `dataSources` 不可用；包含该字段的请求会返回 `400` 错误。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="索引包含哪些内容" icon="search" href="/zh/docs/search/data/overview" cta="查看指南" arrow="true">
    探索公开网络上的新闻、代码、公司和人物数据源。
  </Card>

  <Card title="Exa Connect" icon="database" href="/zh/docs/agent/connect/overview" cta="查看指南" arrow="true">
    为运行接入高级合作伙伴数据库。
  </Card>

  <Card title="Agent 最佳实践" icon="lightbulb" href="/zh/docs/agent/best-practices" cta="查看指南" arrow="true">
    使用 Exa Agent 的最佳实践。
  </Card>

  <Card title="Agent 示例" icon="code" href="/zh/docs/agent/examples" cta="查看指南" arrow="true">
    使用 Exa Agent 的示例。
  </Card>
</Columns>