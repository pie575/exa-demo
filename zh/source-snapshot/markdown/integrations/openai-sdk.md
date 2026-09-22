> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

<div id="openai-sdk-compatibility">
  # OpenAI SDK 兼容性
</div>

> 将 Exa 的端点作为 OpenAI 的直接替代，同时支持 chat completions 和 responses API。

<Card title="编码智能体快速开始" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  第一次使用 Exa？一分钟内即可上手。
</Card>

***

<div id="overview">
  ## 概览
</div>

Exa 提供与 OpenAI 兼容的端点，可直接搭配 OpenAI SDK 使用：

| 端点                  | OpenAI 接口            | 可用模型        | 适用场景                      |
| ------------------- | -------------------- | ----------- | ------------------------- |
| `/chat/completions` | Chat Completions API | `exa`       | 传统聊天接口                    |
| `/responses`        | Responses API        | `exa-agent` | Agent API (异步研究、增强、列表构建)  |

<Info>
  `/chat/completions` 会路由到 [`/answer`](/zh/docs/reference/answer)，`/responses` 会路由到 [Agent API](/zh/docs/agent/quickstart)。详见下方的[通过 Responses API 使用 Agent](#agent-via-responses-api)。
</Info>

<div id="answer">
  ## Answer
</div>

要通过 chat completions 接口使用 Exa 的 `/answer` 端点：

1. 将基础 URL 替换为 `https://api.exa.ai`
2. 将 API 密钥替换为你的 Exa API 密钥
3. 将模型名称替换为 `exa`。

<Info>
  查看完整的 [`/answer`](/zh/docs/reference/answer) 端点参考文档。如需自定义路由行为，请联系 [hello@exa.ai](mailto:hello@exa.ai)。
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # 使用 exa 作为基础 URL
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # 使用 extra_body 向 /answer 端点传递额外参数
    extra_body={
      "text": True # 包含来源的 full text
    }
  )

  print(completion.choices[0].message.content)  # 打印响应内容
  print(completion.choices[0].message.citations)  # 打印引用来源
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // 使用 exa 作为基础 URL
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
        text: true, // 包含来源的 full text
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
  ## 通过 Responses API 使用 Agent
</div>

Exa 的 [`/responses`](https://api.exa.ai/responses) 端点通过 OpenAI Responses 接口对外提供 [Agent API](/zh/docs/agent/quickstart)，因此 OpenAI SDK 无需改动即可直接使用。设置 `model: "exa-agent"` 并选择一种执行模式：

| 模式   | 请求                              | 行为                                                                    |
| ---- | ------------------------------- | --------------------------------------------------------------------- |
| 同步   | 默认 (不设置 `stream`/`background`)  | 请求会阻塞，并返回已完成的 `response` 对象。                                          |
| 流式传输 | `stream: true`                  | 请求会随着运行的推进流式返回 OpenAI Responses 事件 (SSE) ，并以 `response.completed` 结束。 |
| 后台   | `background: true`              | 请求立即返回状态为 `in_progress` 的响应；轮询 `GET /responses/{id}` 获取结果。            |

设置 `reasoning.effort` (`minimal`、`low`、`medium`、`high`、`xhigh`、`auto`、`max`) 可在费用与深度之间权衡，并可通过 `POST /responses/{id}/cancel` 取消运行。使用 `max` 时，需将 `Exa-Beta: agent-max-effort-2026-07-27` 设置为客户端默认 header。[Agent 指南](/zh/docs/agent/quickstart)介绍了支撑该接口的运行模型、输出结构以及 effort 定价。

<Warning>
  `reasoning.effort` 为 `high`、`xhigh` 和 `max` 的运行耗时过长，不适用于同步请求，会返回 `400`。这类运行请使用 `stream: true` 或 `background: true`。`/responses` 没有 `budget` field；max 使用其默认的单次运行上限。
</Warning>

使用 `previous_response_id` 可以继续一次已完成的 Responses 运行。

<div id="synchronous">
  ### Synchronous
</div>

请求会一直阻塞，直到运行完成，并返回终态的 `response` 对象。

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
  ### 流式传输
</div>

设置 `stream: true` 即可通过 SSE 接收 Responses 流式事件。事件带有单调递增的 `sequence_number`，并以 `response.completed` 结束，没有 `[DONE]` 结束标记。流中可能包含 `: keep-alive` 注释行，SSE 客户端会自动忽略。

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
  ### 后台
</div>

设置 `background: true` 可在不保持连接的情况下启动运行，然后轮询 `GET /responses/{id}`，直到其进入终止状态。如果想用流式传输代替轮询，请参阅[流式传输](#streaming)。

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

  # 轮询直到完成
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

    // 轮询直到完成
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # 创建一次后台运行
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }'

  # 使用返回的响应 ID 进行轮询
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="chat-wrapper">
  ## Chat wrapper
</div>

Exa 提供了一个 Python wrapper，可自动为任意 OpenAI chat completion 增加 RAG 能力。只需一行代码，就能把任意 OpenAI chat completion 变成由 Exa 驱动的 RAG 系统，自动完成搜索、分块和 prompt 构建。

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # 初始化客户端
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # 包装 OpenAI 客户端
  exa_openai = exa.wrap(openai)

  # 用法与普通 OpenAI 客户端完全一致
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

包装后的客户端用法与原生 OpenAI 客户端完全相同，唯一区别是它会在需要时自动用相关搜索结果来提升 completion 的质量。

该 wrapper 支持 `exa.search()` 函数的所有参数。

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto"、"required" 或 "none"
    num_results=5,               # 默认为 3
    result_max_len=1024,         # 默认为 2048 个字符
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```