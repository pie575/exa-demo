> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="anthropic-tool-calling">
  # Anthropic Tool Calling
</div>

> 使用 Claude 的 tool use，为你的应用添加 Exa 网页搜索和页面内容能力。

<Card title="编码智能体快速开始" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  第一次使用 Exa？一分钟内即可上手。
</Card>

***

Claude 的 [tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) 允许模型调用你在代码中定义的函数。Exa SDK 为 Anthropic 提供了开箱即用的网页搜索和页面读取工具，因此你无需手写 tool schema、解析 `tool_use` 块，也不必自行格式化 Exa 返回的结果。

<div id="get-started">
  ## Get started
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

  <Step title="配置 API 密钥">
    设置 `EXA_API_KEY` 和 `ANTHROPIC_API_KEY` 环境变量。访问 [Anthropic 控制台](https://console.anthropic.com/settings/keys) 和 [Exa 控制台](https://dashboard.exa.ai/api-keys) 生成 API 密钥。

    <Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建密钥。新账户可获得免费积分。
    </Card>
  </Step>

  <Step title="将 Exa 工具加入你的工具 loop">
    在请求的 `tools` 列表中传入工具，然后把助手消息交给 `handle_tool_use`。它会执行消息中的每个 `tool_use` 块，并返回对应的 `tool_result` 块，可直接放进下一条用户消息中发回。

    `web_search` 用于在网络上搜索模型尚未见过的页面；`get_contents` 用于读取已知 URL 的页面，无论 URL 来自先前的 search 还是用户提供。两者可任选其一，也可同时注册。

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

    为简洁起见，这里只演示一轮。实际的 agent 会在每次请求中都带上 `tools`，并反复执行处理器这一步，直到模型返回不含 `tool_use` 块的回复 —— search 结果正是这样转化为后续的页面读取的。

    不带参数调用工厂函数即可使用 Exa 推荐的默认配置：search 使用 `type="auto"`，并搭配 `contents={"highlights": True}`。highlights 返回与 query 相关的摘录 —— 它们不会把页面文本截断到 10,000 个字符。contents 工厂函数返回页面文本；SDK 的 10,000 字符限制仅作用于 `text`，且仅在你省略 `max_characters` 时生效。
  </Step>
</Steps>

<div id="configuring-the-tools">
  ## 配置 tools
</div>

关键字参数就是常规的 Exa options，会在工具运行时透传：search options 传给 `exa.search()`，页面内容选项传给 `exa.get_contents()`：

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

模型只负责选择搜索的 `query` 和要读取的 `urls`；其余参数在创建工具时就已绑定，因此模型无法改变抓取或提取的内容。

而 `name` (默认为 `"web_search"` 和 `"get_contents"`) 和 `description` 则会覆盖模型看到的工具定义。Anthropic 要求工具名称唯一，因此自定义名称可以让 Exa 工具与 Anthropic 内置的 `web_search_20250305` server tool 并存，后者占用了 `web_search` 这个名称：

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
  ## 混合使用你自己的 tools
</div>

`handle_tool_use` 会为消息中的每一个 `tool_use` 块返回结果：若某个块指定的 tool 无法解析，则返回 `Error: unknown tool "<name>"` 结果，而不是直接丢弃，这样后续请求就不会遗漏必需的 tool 结果。如果你在 Exa 的 tools 之外还运行了自己的 tools，请在发起下一个请求前，用你自己的结果替换这些错误结果。

<div id="writing-the-loop-by-hand">
  ## 手动编写 loop
</div>

如果你更愿意自己掌控 tool schema 和执行流程，可以手动定义 tool 并处理 `tool_use` 块。`exa.tools.web_search()` 和 `exa.tools.get_contents()` 同样提供与提供方无关的工具规范 (带有 `run` 方法) ，可用于手写 loop；当然，你也可以完全从零开始编写：

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

有关 Python 和 TypeScript 中的 search 与页面内容选项，请参阅 [SDK 快速开始](/zh/docs/sdks/quickstart)。