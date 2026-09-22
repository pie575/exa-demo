> ## 文档索引 {#documentation-index}
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# Exa Agent {#exa-agent}

> 运行深度研究、列表构建和增强工作流，返回结构化输出。

Exa Agent 是一个异步、按用量计费的端点，适用于列表构建、增强和深度研究等高算力任务。它能处理复杂推理，并返回大量结构化输出 field。

可以把它看作一个上下文 agent：你描述想要的数据以及希望返回的结构，Exa Agent 便会编排实现所需的工具调用。一次运行可以从不同角度展开大量 search、读取并提炼相应的页面内容、把列表构建拆分为并行执行的子任务、依据你的 criteria 逐一核验候选项、丰富联系人信息，并查询你接入的任意 [Exa Connect](/zh/docs/agent/connect/overview) 数据合作伙伴。你无需自己编排每一次 `/search` 和 `/contents` 调用，就能拿到整合好的上下文，以单个有据可依的结构化结果返回。

每次运行都可以返回自然语言答案、经 schema 校验的 JSON、field 级 grounding、元数据以及费用明细。你可以稍后检索已完成的运行、列出历史运行、重放事件，或从上一次运行继续。

<Tip>
  更喜欢用 MCP？Exa Agent 与 [Exa Connect](/zh/docs/agent/connect/overview) 已在 [Exa MCP](/zh/docs/get-started/exa-mcp#exa-agent) 中提供。启用 `tools=agent_run`，即可在 Claude、Cursor 及其他 MCP 客户端中运行多步研究、列表构建、增强和结构化输出。
</Tip>

## 何时使用 Exa Agent {#when-to-use-exa-agent}

当工作流需要的不只是一次 search 或提取调用，或者你原本得自己编写一套由 search、页面读取和 验证 步骤组成的 loop 来汇总数据时，就适合使用 Exa Agent：

* 根据开放式 criteria 构建列表，并对每条 result 进行丰富
* 跨多个 fields 研究实体，并附上引用来源
* 运行多跳任务，例如&quot;先找到公司，再找到其决策者&quot;
* 从长时间运行的网页研究任务中输出结构化 JSON
* 在同一个有据可依的答案中，将网页研究与高级数据合作伙伴结合
* 以&quot;再找 10 条结果&quot;这样的后续请求，从上一次运行继续

Exa Agent 在设计上延迟较高且为异步。如果只需一次低延迟 search，并由你自己编排 calls，请从 [Search API](/zh/docs/search/quickstart) 开始。

## 快速开始 {#quickstart}

本示例会启动一次运行，构建一份符合你的 criteria 的结构化人员列表，并以 JSON 形式在 `output.structured` 中返回结果。

### 1. 安装 Exa SDK {#1-install-the-exa-sdk}

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

### 2. 设置 API 密钥 {#2-set-your-api-key}

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

### 3. 创建运行 {#3-create-a-run}

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

创建运行时添加 `Accept: text/event-stream`，即可在运行排队、启动和完成时接收服务器发送事件。更多细节请参阅 [流式事件](#stream-events)。

### 4. 轮询等待完成 {#4-poll-for-completion}

如果不使用流式事件，请保存返回的 `id`，并轮询该运行，直到它进入终止状态。

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
* `output.structured`：提供 `outputSchema` 时返回经过校验的 JSON
* `output.grounding`：文本或结构化 field 的引用来源 (触发时返回)
* `costDollars`：本次运行的费用明细

<Note>
  Exa Agent 也可通过兼容 OpenAI 的 Responses API 调用。将 OpenAI SDK 指向
  `https://api.exa.ai`，设置 `model: "exa-agent"`，并选择同步、流式传输或后台执行方式。参见 [OpenAI SDK
  兼容性](/zh/docs/integrations/openai-sdk#agent-via-responses-api)。
</Note>

## 验证并增强特定实体 {#verify-and-enrich-a-specific-entity}

除了列表构建之外，你还可以用 Exa Agent 检查单个已知实体、对照权威来源核实某项说法，并返回结构化的增强结果。本示例会检查某公司官网是否有可公开访问的定价页面，若有则用定价细节丰富返回结果。该 schema 仅要求 `domain` 和 `verdict`，其余字段均为可选的增强内容。

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
  用于验证工作流的 schema 应当考虑不确定性。将可能无法验证的 field 设为可空，并且不要放入 `required`，
  这样 agent 就能返回 `null`，而不是编造一个值。`verdict`
  枚举区分了检查失败 (`cannot_verify`) 和确实存在的否定性证据 (`absent`) ：站点无法访问，并不能证明
  该页面不存在。
</Note>

## 流式事件 {#stream-events}

流式传输会保持创建请求处于打开状态，并持续发送 Server-Sent Events (SSE)，直到运行完成。事件类型和负载详见 [事件格式](#event-format)。

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

### 事件格式 {#event-format}

每个 SSE 帧都包含事件 ID、事件名称和 JSON 负载：

```text theme={null}
id: 1
event: agent_run.created
data: {"id":"agent_run_01j...","status":"queued","createdAt":"2026-05-07T21:21:52.051Z"}
```

流中还可能包含注释行，例如 `: keep-alive`。SSE 客户端会自动忽略注释，自定义解析器也应如此处理。

### 事件类型 {#event-types}

| 事件                    | `data` 负载                             | 用途                                                                                       |
| --------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `agent_run.created`   | `{ id, status: "queued", createdAt }` | 请求一旦被接受，立即保存运行 ID。                                                                       |
| `agent_run.started`   | `{ id, status: "running" }`           | 将该运行标记为正在处理中。                                                                            |
| `agent_run.completed` | 已完成的 Agent 运行对象                       | 从 `data.output.text` 或 `data.output.structured` 读取最终答案，从 `data.output.grounding` 读取引用来源。 |
| `agent_run.failed`    | `{ id, status: "failed", error }`     | 展示 `error.code` 和 `error.message`；此时没有可用的完成输出。                                           |
| `agent_run.cancelled` | `{ id, status: "cancelled", ... }`    | 停止消费该流，并按已取消的运行来处理。                                                                      |

属于同一研究步骤的事件会带有 `callId`，它与工具进度事件中的 `item.call_id` 相对应。可用它把 search 追踪、来源和工具进度归到一组。部分 search 追踪描述是异步生成的，可能晚于其所描述的来源或工具事件到达，因此不要仅凭到达顺序来做关联。

请把 `agent_run.source.added` 视为实时预览，而非完整的引用来源列表。运行进入终态后的 `output.grounding` 才是权威的 grounding 输出。

### 重放已存储的事件 {#replay-stored-events}

对于非 ZDR 运行，[`GET /agent/runs/{id}/events`](/zh/docs/reference/agent-api/list-run-events) 会以分页 JSON 的形式返回已存储的事件。发送 `Accept: text/event-stream` 可将已存储的事件以 SSE 形式重放，发送 `Last-Event-ID` 则可跳过客户端已处理的事件：

```bash cURL theme={null}
curl -N "https://api.exa.ai/agent/runs/agent_run_01j.../events" \
  -H "Accept: text/event-stream" \
  -H "Last-Event-ID: 12" \
  -H "Authorization: Bearer $EXA_API_KEY"
```

重放端点会发送请求时已存储的事件，随后关闭连接；它不会继续跟踪正在进行的运行。ZDR 运行不保留事件，因此无法重放。

为保持向前兼容，请忽略应用无法识别的事件名称，并持续处理直至收到终止事件。

## 返回结构化 JSON {#return-structured-json}

使用 `outputSchema` 在 `output.structured` 中返回经 schema 校验的 JSON。

`outputSchema` 支持 [JSON Schema 规范](https://json-schema.org/)。

若要获取联系方式，请在 `outputSchema` 中描述所需的联系 field。可使用标准的 JSON Schema 写法，例如用 `{ "type": "string", "format": "email" }` 表示电子邮箱地址，用 `{ "type": "string", "format": "phone" }` 表示电话号码，用 `{ "type": "string", "format": "uri" }` 表示 URL。尽量用 `maxItems` 限制列表长度，这样联系方式增强的最高费用才可预估。

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

## 处理输入行 {#process-input-rows}

当你已有一组想要丰富的数据时，可使用 `input.data`。你可以为每个数据实体添加更多 field，也可以基于传入的数据挖掘出更多实体，或者两者同时进行。

完整的行增强示例，请参阅 [Agent 示例](/zh/docs/agent/examples#enrich-input-rows-code)。

## 处理 exclusions {#process-exclusions}

使用 `input.exclusion` 可以让某些条目不出现在运行结果中。在下面的示例中，我们要查找最可爱的 10 种动物，但在本次运行中排除了山羊和熊猫，因为我们已经知道它们有多可爱了。

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

## 接入数据源 {#connect-data-sources}

索引在每次运行中都默认可用。`dataSources` 仅用于接入 [Exa Connect](/zh/docs/agent/connect/overview) 合作伙伴，每个条目对应选择一个 `provider`。当 `outputSchema` 中的某个属性指定了特定来源 (例如 &quot;from Similarweb&quot;) 时，Exa Agent 会调用相应的提供方工具，而不是从网页内容中推测。

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" }
  ]
}
```

请参阅 [Exa Connect](/zh/docs/agent/connect/overview)，查看完整的数据合作伙伴列表及各自的示例。

## 从上一次运行继续 {#continue-from-a-previous-run}

使用 `previousRunId` 对之前的响应进行追问。每次追问都会启动一次新的运行，并拥有独立的 ID。`previousRunId` 只是将上下文带入新的运行，不会作为新运行的 ID 复用。

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

## 查找运行 ID {#find-a-run-id}

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

## 定价 {#pricing}

费用按用量计算，并按组件分别计价：

| 组件                  | 价格                |
| ------------------- | ----------------- |
| Agent Compute Units | `1 ACU = $0.10`   |
| Search 工具调用         | `$0.005 / search` |

<Note>
  联系方式增强不包含在上述核心计价组件中：邮箱联系方式增强为 `$0.02 / email`，电话号码联系方式增强为 `$0.07 / phone number`。
</Note>

`usage.agentComputeUnits` 用于衡量整次运行中的模型计算量。复杂查询 (尤其是 `input.data` field 较大的查询) 需要更多推理步骤和工具调用，因而消耗更多 ACU。

有关并发与速率限制，请参阅 [Agent 限制](/zh/docs/admin/billing#agent-limits)。

### Effort {#effort}

使用 `effort` 为每次运行选择费用与推理级别。支持的取值为 `minimal`、`low`、`medium`、`high`、`xhigh`、`auto` 和 `max`，默认值为 `auto`。固定 effort 的单次请求价格是可预测的，而 `auto` 与测试版的 `max` 按用量计费：

| Effort    | 价格                              |
| --------- | ------------------------------- |
| `minimal` | `$0.012 / request`              |
| `low`     | `$0.025 / request`              |
| `medium`  | `$0.10 / request`               |
| `high`    | `$0.50 / request`               |
| `xhigh`   | `$1.00 / request`               |
| `auto`    | 按用量计费；最高不超过默认的 `$5` 上限          |
| `max`     | **测试版**，按用量计费；最高不超过默认的 `$20` 上限 |

<Info>
  Agent Max 是最高的 effort 层级，适用于完整性和详尽程度比延迟或费用更重要的场景，
  例如大规模列表构建、多来源深度研究，以及难以验证的 criteria。该功能目前处于公开测试阶段：
  使用 `effort: "max"` 的请求必须带上 `Exa-Beta: agent-max-effort-2026-07-27`。该
  header 接受以逗号分隔的测试版 token 列表。
</Info>

`budget.maxCostDollars` 是面向 `auto` 和 `max` 的可选单次运行费用上限，取值范围为 `$1`–`$100`；发布版本的最大值为 `$100`，但 server 可能配置更低的上限。`auto` 的默认上限为 `$5`，`max` 为 `$20`。这是上限而非固定价格：提前结束的运行费用更低。固定 effort 不支持设置 budget。

### 选择 effort 模式 {#choosing-an-effort-mode}

如果你希望标准研究任务的单次请求定价可预测，固定 effort 模式很合适。对于范围可变的工作 (如列表构建，实体数量可能因请求而异) ，请使用 `auto`。

| Effort    | 适用场景                     | 建议的 schema 复杂度             | 运行时间预期       |
| --------- | ------------------------ | -------------------------- | ------------ |
| `minimal` | 成本最低的查找、范围极窄的事实性任务、简短回答  | 一到两个 field，浅层 schema       | 最便宜，覆盖最不全面   |
| `low`     | 简单查找、范围较窄的事实性任务、简短回答     | 少量 field，浅层 schema         | 快速、轻量的研究     |
| `medium`  | 大多数标准研究任务的默认起点           | 中等数量的 field，简单的嵌套对象        | 质量与运行时间兼顾    |
| `high`    | 难度更高的研究、更多引用来源、更严格的完整性要求 | 更大的 schema 或更细致的 field     | 较慢，更彻底       |
| `xhigh`   | 完整性比费用/延迟更重要的高价值任务       | 复杂 schema、大量 field、难以验证的内容 | 最慢的固定 effort |
| `auto`    | 范围可变的工作、列表构建、任务难度未知      | 灵活；在实体数量或所需工作量未知时很有用       | 可变           |
| `max`     | 投入最高的研究 (beta)           | 复杂 schema、大量 field、难以验证的内容 | 运行时间最长       |

标准的单实体研究建议从 `medium` 起步。当费用和延迟比完整性更重要时，降到 `low` 或 `minimal`。当输出 schema 更大、field 需要验证，或任务需要更深入的推理时，提升到 `high` 或 `xhigh`。事先无法确定范围时 (例如列表构建，或可能返回大量实体的工作流) ，请使用 `auto`。

运行时间会因 query 难度、schema 复杂度以及外部 source 的可用性而异。请将 effort 模式视为质量、费用与运行时间之间的权衡，而非严格的延迟保证。

### 以 max effort 运行 {#run-with-max-effort}

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

上述 SDK 示例需要使用支持 Agent Max 的 `exa-py` 或 `exa-js` 版本。

## Zero Data Retention {#zero-data-retention}

Exa Agent 支持 [Zero Data Retention](/zh/docs/admin/security/zero-data-retention) (ZDR) 。ZDR 以团队为单位启用，如需为你的账户开启，请[联系我们](mailto:sales@exa.ai)。

团队启用 ZDR 后：

* 创建运行时使用流式传输 (`Accept: text/event-stream`) 以实时获取输出，或在保留窗口内轮询异步运行。
* 运行数据在运行执行期间可用，并在其进入终止状态后最多保留 10 分钟。超出该窗口后，将无法再检索该运行。
* `previousRunId` 不可用。
* Exa Connect 的 `dataSources` 不可用；包含该参数的请求会返回 `400` 错误。

## 后续步骤 {#next-steps}

<Columns cols={2}>
  <Card title="索引中有哪些内容" icon="search" href="/zh/docs/search/data/overview" cta="打开指南" arrow="true">
    探索公开网络中的新闻、代码、公司和人物来源。
  </Card>

  <Card title="Exa Connect" icon="database" href="/zh/docs/agent/connect/overview" cta="打开指南" arrow="true">
    将高级合作伙伴数据库接入到运行中。
  </Card>

  <Card title="agent 最佳实践" icon="lightbulb" href="/zh/docs/agent/best-practices" cta="打开指南" arrow="true">
    使用 Exa Agent 的最佳实践。
  </Card>

  <Card title="agent 示例" icon="code" href="/zh/docs/agent/examples" cta="打开指南" arrow="true">
    使用 Exa Agent 的示例。
  </Card>
</Columns>