> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="anthropic-tool-calling">
  # Anthropic 工具调用
</div>

> 使用 Claude 工具调用，为你的应用添加 Exa 网页搜索与网页内容获取能力。

<Card title="编程 Agent 快速上手" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  初次使用 Exa？一分钟内即可上手。
</Card>

***

Claude 的[工具调用](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)功能让模型可以调用你在代码中定义的函数。Exa SDK 为 Anthropic 提供了开箱即用的网页搜索与网页读取工具，你无需手写工具 schema、解析 `tool_use` 块，也不必自行格式化 Exa 返回的结果。

<div id="get-started">
  ## 快速开始
</div>

<Steps>
  <Step title="安装 SDK">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="配置 API key">
    设置 `EXA_API_KEY` 和 `ANTHROPIC_API_KEY` 环境变量。前往 [Anthropic 控制台](https://console.anthropic.com/settings/keys) 和 [Exa 控制面板](https://dashboard.exa.ai/api-keys) 生成 API key。

    <Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制面板中创建 key。新账户可获赠免费积分。
    </Card>
  </Step>

  <Step title="把 Exa 工具接入你的工具循环">
    在请求的 `tools` 列表中传入这些工具，然后把助手消息交给 `handle_tool_use`。它会执行消息中的每个 `tool_use` 块并返回对应的 `tool_result` 块，可直接放入下一条用户消息发回。

    `web_search` 用于在网上搜索模型尚未见过的页面；`get_contents` 用于读取已有 URL 的页面，无论 URL 来自此前的 search 还是用户提供。两者可任选其一，也可同时注册。

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # 从环境变量读取 EXA_API_KEY
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

      const exa = new Exa(); // 从环境变量读取 EXA_API_KEY
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

    为简洁起见，这里只演示了一轮。实际的 Agent 会在每次请求中都带上 `tools`，并反复执行处理器这一步，直到模型的回复中不再出现 `tool_use` 块——search 结果正是这样延伸为后续的页面读取。

    不带参数调用这些工厂方法即可使用 Exa 推荐的默认配置：search 使用 `type="auto"`，并搭配 `contents={"highlights": True}`。highlights 返回与 query 相关的摘录，并不会把页面文本截断到 10,000 字符。contents 工厂方法返回页面文本；SDK 的 10,000 字符上限只作用于 `text`，且仅在省略 `max_characters` 时生效。
  </Step>
</Steps>

<div id="configuring-the-tools">
  ## 配置工具
</div>

关键字参数就是常规的 Exa 选项，会在工具运行时透传——search 选项传给 `exa.search()`，contents 选项传给 `exa.get_contents()`：

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

由模型决定搜索的 `query` 以及要读取的 `urls`；其余参数在创建工具时就已绑定，因此模型无法改变抓取或提取的内容。

而 `name` (默认为 `"web_search"` 和 `"get_contents"`) 和 `description` 则会覆盖模型看到的工具定义。Anthropic 要求工具名称唯一，因此自定义名称可以让 Exa 工具与 Anthropic 内置的 `web_search_20250305` 服务端工具并存——后者已占用 `web_search` 这个名称：

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

<div id="mixing-in-your-own-tools">
  ## 混用你自己的工具
</div>

`handle_tool_use` 会对消息中的每一个 `tool_use` 块作出响应：如果某个块指定的工具无法识别，它不会被直接丢弃，而是返回 `Error: unknown tool "<name>"` 结果，这样后续请求就不会遗漏任何必需的工具结果。如果你在 Exa 工具之外还运行了自己的工具，请在发起下一个请求前，用你自己的结果替换这些错误结果。

<div id="writing-the-loop-by-hand">
  ## 手动编写循环
</div>

如果你希望自己掌控工具 schema 和执行过程，可以自行定义工具并手动处理 `tool_use` 块。`exa.tools.web_search()` 和 `exa.tools.get_contents()` 同样提供与厂商无关的工具规范 (带 `run` 方法) ，可直接用于手写循环；当然，你也可以完全从零开始编写：

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

有关 Python 和 TypeScript 中的 search 与 contents 选项，请参阅 [SDK 快速开始](/zh/docs/sdks/quickstart)。