> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="developer-quickstart">
  # 开发者快速开始
</div>

> 获取 API key，然后在你的代码或 agent 中使用 Exa。

<div className="docs-quickstart-section docs-quickstart-auth">
  <div id="1-get-an-api-key">
    ## 1. 获取 API key
  </div>

  <Steps>
    <Step title="访问 Exa 控制台">
      <Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        在控制台中创建一个 key。新账户可获得免费积分。
      </Card>
    </Step>

    <Step title="将 key 设置为环境变量">
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
    </Step>
  </Steps>
</div>

<div className="docs-quickstart-section">
  <div id="2-choose-how-youll-use-exa">
    ## 2. 选择使用 Exa 的方式
  </div>

  Exa 可以通过两种方式接入你的应用：在自己的代码中调用 API，或者连接你已经在用的 agent。

  <Columns cols={2}>
    <Card title="调用 API" icon="code" href="#3-install-an-sdk" cta="安装 SDK">
      在自己的代码中使用 Search、Contents 和 Exa Agent。按下方步骤安装 SDK
      并发起第一个请求。
    </Card>

    <Card title="连接你的 agent" icon="plug" href="/zh/docs/get-started/exa-mcp" cta="设置 Exa MCP">
      将 ChatGPT、Claude、Codex 或 Cursor 连接到 Exa 的搜索与研究
      工具，无需 API key。
    </Card>
  </Columns>

  想基于 API 构建？从这些入口开始：

  | 从这里开始                                   | 适用场景                           |
  | --------------------------------------- | ------------------------------ |
  | [Search](/zh/docs/search/quickstart)       | 2 秒内找到相关网页并返回综合后的内容            |
  | [Deep Search](/zh/docs/search/deep-search) | 由 LLM 反复迭代、找到更优结果的高质量搜索        |
  | [Agent](/zh/docs/agent/quickstart)         | 长时间运行的异步研究、列表构建、enrichment 或报告 |
  | [Contents](/zh/docs/contents/quickstart)   | 已有 URL 时提取页面内容                 |
</div>

<div className="docs-quickstart-section">
  <div id="3-install-an-sdk">
    ## 3. 安装 SDK
  </div>

  <CodeGroup>
    ```bash Python theme={null}
    pip install exa-py
    ```

    ```bash JavaScript theme={null}
    npm install exa-js
    ```
  </CodeGroup>
</div>

<div className="docs-quickstart-section">
  <div id="4-make-your-first-request">
    ## 4. 发起第一个请求
  </div>

  <CodeGroup>
    ```python Python theme={null}
    from exa_py import Exa

    exa = Exa()

    results = exa.search(
        "best blog posts about vector databases",
        contents={"highlights": True},
    )

    for result in results.results:
        print(result.title, result.url)
    ```

    ```javascript JavaScript theme={null}
    import Exa from "exa-js";

    const exa = new Exa();

    const { results } = await exa.search(
      "best blog posts about vector databases",
      { contents: { highlights: true } },
    );

    for (const result of results) {
      console.log(result.title, result.url);
    }
    ```

    ```bash cURL theme={null}
    curl -s -X POST "https://api.exa.ai/search" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $EXA_API_KEY" \
      -d '{
        "query": "best blog posts about vector databases",
        "contents": { "highlights": true }
      }'
    ```
  </CodeGroup>

  <div id="next-steps">
    ## 后续步骤
  </div>

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/zh/docs/search/quickstart" cta="阅读指南" arrow="true">
      查找相关页面，返回干净的内容或结构化输出。
    </Card>

    <Card title="Agent API" icon="bot" href="/zh/docs/agent/quickstart" cta="阅读指南" arrow="true">
      构建长时间运行的研究、列表构建和 enrichment 工作流。
    </Card>

    <Card title="Contents API" icon="file-text" href="/zh/docs/contents/quickstart" cta="阅读指南" arrow="true">
      从已知的页面中提取干净的内容。
    </Card>

    <Card title="Exa MCP" icon="plug" href="/zh/docs/get-started/exa-mcp" cta="阅读指南" arrow="true">
      将任意 MCP 客户端接入 Exa 的网页搜索、页面抓取和 Exa Agent
      工具。
    </Card>
  </Columns>
</div>