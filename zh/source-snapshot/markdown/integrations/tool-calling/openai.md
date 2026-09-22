> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="openai-tool-calling">
  # OpenAI 工具调用
</div>

> 使用 OpenAI 工具调用，为你的应用添加 Exa 网页搜索和页面内容能力。

<Info>
  OpenAI 建议所有新项目使用 Responses API。请参阅下方的 [Responses API](#responses-api) 章节。
</Info>

OpenAI 的[工具调用](https://platform.openai.com/docs/guides/function-calling?lang=python)允许模型调用你在代码中定义的函数。Exa SDK 为 OpenAI 提供了开箱即用的网页搜索和页面读取工具，因此你无需自己手写工具 schema、解析工具调用，也无需自行格式化 Exa 返回的结果。

<div id="get-started">
  ## 快速开始
</div>

<Steps>
  <Step title="安装 SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="配置 API 密钥">
    设置 `EXA_API_KEY` 和 `OPENAI_API_KEY` 环境变量。访问 [OpenAI 控制台](https://platform.openai.com/api-keys) 和 [Exa 控制台](https://dashboard.exa.ai/api-keys) 生成你的 API 密钥。

    <Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建密钥。新账户会附赠免费积分。
    </Card>
  </Step>

  <Step title="将 Exa tools 加入你的工具 loop">
    在请求的 `tools` 列表中传入这些工具，然后把助手消息交给 `handle_tool_calls`。它会执行该消息中的每一次 Exa 工具调用，并返回对应的 `role: "tool"` 消息，可直接追加到对话中。

    `web_search` 用于在网络上检索模型尚未见过的页面；`get_contents` 用于读取已有 URL 的页面，无论这些 URL 来自先前的 search 还是用户提供。两者可任选其一，也可同时注册。

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # 从环境变量读取 EXA_API_KEY
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

      const exa = new Exa(); // 从环境变量读取 EXA_API_KEY
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

    为简洁起见，这里只演示了一轮。实际的 agent 会在每次请求中都带上 `tools`，并反复执行处理器这一步，直到模型的回复中不再出现工具调用 —— search 结果正是这样进一步转化为后续的页面读取的。

    不带参数调用工厂函数即可使用 Exa 推荐的默认值：search 为 `type="auto"` 搭配 `contents={"highlights": True}`。Highlights 返回与 query 相关的摘录 —— 它不会把页面文本截断到 10,000 字符。页面内容工厂函数返回页面文本；SDK 的 10,000 字符限制仅适用于 `text`，且仅在你省略 `max_characters` 时生效。
  </Step>
</Steps>

<div id="responses-api">
  ## Responses API
</div>

对于 OpenAI Responses API，请使用 `responses` 工厂函数，并搭配同样的 `handle_tool_calls` 辅助函数。该处理器会返回 `function_call_output` 项目，供后续请求使用。

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
  Chat Completions 与 Responses API 使用不同的工具格式，且互不接受对方的格式，因此请使用与所调用端点相匹配的工厂函数。
</Note>

<div id="configuring-the-tools">
  ## 配置 工具
</div>

关键字参数就是常规的 Exa options，会在工具运行时透传下去：search options 传给 `exa.search()`，页面内容选项 传给 `exa.get_contents()`：

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

模型只负责选择搜索用的 `query` 和要读取的 `urls`；其余参数在创建工具时就已绑定，因此模型无法改变抓取或提取的内容。

而 `name` (默认为 `"web_search"` 和 `"get_contents"`) 和 `description` 则会覆盖模型看到的工具定义。可以用自定义 `name` 让配置不同的 Exa 工具并存，或避免与占用这些名称的其他工具冲突。

<div id="mixing-in-your-own-tools">
  ## 混入你自己的 tools
</div>

处理器会应答消息中的每一个工具调用：若某个调用指定了它们无法识别的工具，该调用不会被丢弃，而是返回一个 `Error: unknown tool "<name>"` 输出，因此后续请求绝不会遗漏必需的工具响应。如果你在 Exa 的 tools 之外还运行自己的 tools，请在发起下一次请求前，用你自己的结果替换这些错误输出。

<div id="writing-the-loop-by-hand">
  ## 手动编写 loop
</div>

如果你希望自行掌控工具 schema 和执行过程，可以手动定义工具并处理调用。`exa.tools.web_search()` 和 `exa.tools.get_contents()` 会提供同样的、与提供方无关的工具规范 (带有 `run` 方法) ，供你手写 loop 使用；你也可以完全从零开始编写：

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

请参阅 [SDK 快速开始](/zh/docs/sdks/quickstart)，了解 Python 和 TypeScript 中的搜索与页面内容选项。