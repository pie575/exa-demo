> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="sdk-quickstart">
  # SDK 快速开始
</div>

> 安装并使用 Exa 的 Python 和 JavaScript SDK

Exa 官方 SDK。搜索网络、获取页面内容，并获得带引用来源的答案。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<div id="install">
  ## 安装
</div>

<CodeGroup>
  ```bash pip theme={null}
  pip install exa-py
  ```

  ```bash uv theme={null}
  uv add exa-py
  ```

  ```bash npm theme={null}
  npm install exa-js
  ```

  ```bash pnpm theme={null}
  pnpm add exa-js
  ```
</CodeGroup>

Python SDK 需要 Python 3.9 及以上版本。

<div id="authentication">
  ## 身份验证
</div>

将你的 API 密钥设置为环境变量：

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

<div id="getting-started">
  ## 开始使用
</div>

初始化客户端并运行第一次搜索：

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "latest developments in fusion energy",
      type="auto",
      contents={"highlights": True},
  )

  for source in results.results:
      print(source.url, source.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("latest developments in fusion energy", {
    type: "auto",
    contents: {
      highlights: true,
    },
  });

  for (const source of results.results) {
    console.log(source.url, source.highlights);
  }
  ```
</CodeGroup>

<Note>
  两个客户端都会从 `EXA_API_KEY` 环境变量读取密钥。如需显式指定，可直接内联传入：`Exa(api_key="your-api-key")` 或 `new Exa("your-api-key")`。
</Note>

<div id="recommended-defaults">
  ## 推荐默认配置
</div>

| 决策项    | 推荐默认值                                              |
| ------ | -------------------------------------------------- |
| 起点     | 使用 `search`                                        |
| 搜索类型   | 保持 `auto`，除非延迟或综合需求需要改用其他类型                        |
| 页面内容   | 先使用 `highlights: true`                             |
| 已知 URL | 使用 `get_contents` / `getContents`                  |
| 新鲜度    | 仅当过时内容会导致结果不可用时才设置 `max_age_hours` / `maxAgeHours` |

<Warning>
  这两种请求类型接受相同的 content options，只是设置位置不同：

  | 方法                             | content option 设置位置                                                   |
  | ------------------------------ | --------------------------------------------------------------------- |
  | `search`                       | 放在 `contents` 内，例如 `exa.search(query, contents={"highlights": True})` |
  | `get_contents` / `getContents` | 直接放在请求上，例如 `exa.get_contents(urls, highlights=True)`                  |
</Warning>

<div id="search">
  ## Search
</div>

Search 只需一次调用即可找到相关页面并返回其页面内容。

<Tip>
  在 AI 回答、RAG 和搜索预览场景中，建议使用 `highlights: true`。Exa 会根据每条结果的相关性
  自动调整摘录长度；只有当你的应用需要固定的长度上限时，才需设置 `max_characters` / `maxCharacters`。
</Tip>

过滤条件、日期范围与结果数量：

<CodeGroup>
  ```python Python theme={null}
  results = exa.search(
      "climate tech news",
      num_results=20,
      start_published_date="2024-01-01",
      include_domains=["techcrunch.com", "wired.com"],
      contents={"highlights": True}
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("interesting articles about space", {
    numResults: 10,
    includeDomains: ["nasa.gov", "space.com"],
    startPublishedDate: "2024-01-01",
    contents: {
      highlights: true,
    },
  });
  ```
</CodeGroup>

<div id="output-schema">
  ### 输出 schema
</div>

<CodeGroup>
  ```python Python theme={null}
  structured_results = exa.search(
      "Who is the CEO of OpenAI?",
      type="deep",
      system_prompt="Prefer official sources and avoid duplicate results",
      output_schema={
          "type": "object",
          "properties": {
              "leader": {"type": "string"},
              "title": {"type": "string"},
              "source_count": {"type": "number"}
          },
          "required": ["leader", "title"]
      },
      contents={"highlights": True}
  )

  print(structured_results.output.content if structured_results.output else None)
  ```

  ```javascript JavaScript theme={null}
  const structuredResult = await exa.search("Who is the CEO of OpenAI?", {
    type: "deep",
    systemPrompt: "Prefer official sources and avoid duplicate results",
    outputSchema: {
      type: "object",
      properties: {
        leader: { type: "string" },
        title: { type: "string" },
        sourceCount: { type: "number" },
      },
      required: ["leader", "title"],
    },
    contents: {
      highlights: true,
    },
  });

  console.log(structuredResult.output?.content);
  ```
</CodeGroup>

<Note>
  `output_schema` / `outputSchema` 适用于所有搜索类型，综合后的结果会在 `output.content` 中返回。
  如需指定来源偏好或强调重点，请使用 `system_prompt` / `systemPrompt`。
  grounding 会自动在 `output.grounding` 中返回，因此无需在 schema 中重复定义引用来源或 confidence。
</Note>

当输出需要跨多次 search 进行研究时，建议使用 deep 模式：轻量级研究可使用 `deep-lite`，需要多步搜索和更强综合能力时可使用 `deep`。完整的请求选项请参阅 [Search 指南](/zh/docs/search/quickstart)。

<div id="contents">
  ## Contents
</div>

从你已知的 URL 中提取 highlights、full text 或摘要。可以先使用 highlights，再加上 query，让提取内容聚焦于你所需的信息。

<CodeGroup>
  ```python Python theme={null}
  results = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and result quality"},
  )
  ```

  ```javascript JavaScript theme={null}
  const results = await exa.getContents(["https://exa.ai/blog/dynamic-highlights"], {
    highlights: {
      query: "token efficiency and result quality",
    },
  });
  ```
</CodeGroup>

如果需要更完整的上下文或文档结构，请使用 full text。关于输出结构、新鲜度控制和子页面抓取，请参阅 [Contents 指南](/zh/docs/contents/quickstart)。

<div id="answer">
  ## Answer
</div>

获取问题的答案，并附带引用来源。

<CodeGroup>
  ```python Python theme={null}
  response = exa.answer("What caused the 2008 financial crisis?")
  print(response.answer)

  for chunk in exa.stream_answer("Explain quantum computing"):
      print(chunk, end="", flush=True)
  ```

  ```javascript JavaScript theme={null}
  const response = await exa.answer("What caused the 2008 financial crisis?");
  console.log(response.answer);

  for await (const chunk of exa.streamAnswer("Explain quantum computing")) {
    if (chunk.content) {
      process.stdout.write(chunk.content);
    }
  }
  ```
</CodeGroup>

<div id="async-and-types">
  ## 异步与类型
</div>

Python 提供 `AsyncExa` 用于异步操作，JavaScript SDK 则为每个方法都提供了 TypeScript 类型。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import AsyncExa

  exa = AsyncExa()

  results = await exa.search(
      "machine learning startups",
      contents={"highlights": True}
  )
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";
  import type { SearchResponse, RegularSearchOptions } from "exa-js";
  ```
</CodeGroup>

<div id="resources">
  ## 资源
</div>

Python：[exa-py 源码](https://github.com/exa-labs/exa-py) 和 [PyPI 包](https://pypi.org/project/exa-py/)。JavaScript：[exa-js 源码](https://github.com/exa-labs/exa-js) 和 [npm 包](https://www.npmjs.com/package/exa-js)。

<div id="continue">
  ## 继续
</div>

<Columns cols={3}>
  <Card title="Search 指南" icon="search" href="/zh/docs/search/quickstart" cta="打开指南" arrow="true">
    返回 Search 主指南，了解请求写法、过滤条件以及更深入的搜索模式。
  </Card>

  <Card title="Search 参考" icon="square-terminal" href="/zh/docs/reference/search" cta="打开参考" arrow="true">
    查看完整的 `/search` 请求与响应 schema。
  </Card>

  <Card title="Contents 指南" icon="file-text" href="/zh/docs/contents/quickstart" cta="打开指南" arrow="true">
    如果已知 URL 并希望直接提取内容，请使用 Contents。
  </Card>
</Columns>