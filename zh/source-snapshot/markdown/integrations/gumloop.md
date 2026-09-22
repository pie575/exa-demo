> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="gumloop">
  # Gumloop
</div>

> 在 Gumloop flow 中使用 Exa search 和页面内容。

[Gumloop](https://www.gumloop.com/) 内置了 Exa 作为 MCP integration。将其添加到 agent 或 Agent Node 中，即可在工作流内搜索网页、提取页面内容、查找相关 sources，并生成有引用来源支撑的答案。

<div id="add-exa-to-a-gumloop-agent">
  ## 将 Exa 添加到 Gumloop agent
</div>

<Steps>
  <Step title="打开 agent">
    打开 agent 的配置，然后选择 **Add tools** → **Connect an app with MCP**。
  </Step>

  <Step title="连接 Exa">
    搜索 **Exa**，选择该 integration，并完成认证流程。
  </Step>

  <Step title="选择 tools">
    打开已连接的 Exa integration，仅启用 agent 需要的 tools。这样可以让工具选择更清晰，也能避免 agent 调用无关的操作。
  </Step>

  <Step title="测试连接">
    向 agent 提问：

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    查看本次运行，确认 agent 调用了 Exa 并返回了带引用的来源。
  </Step>
</Steps>

<div id="available-tools">
  ## 可用工具
</div>

| 工具                       | 适用场景                         |
| ------------------------ | ---------------------------- |
| **Search**               | 通过神经搜索或关键词搜索查找相关页面。          |
| **Get Contents**         | 从已知 URL 提取 full text、摘要和元数据。 |
| **Find Similar**         | 查找与某个来源 URL 相关的页面。           |
| **Answer**               | 生成带引用来源的有据可循的答案。             |
| **Create Research Task** | 启动耗时较长的研究任务。                 |
| **Get Research Task**    | 获取研究任务的状态和结果。                |

对于对话式 agent，建议先启用 Search、Get Contents 和 Answer，其余工具仅在工作流确有需要时再添加。

<div id="use-exa-in-a-workflow">
  ## 在工作流中使用 Exa
</div>

<div id="agent-node">
  ### Agent Node
</div>

在确定性的 Gumloop flow 中添加一个 **Agent Node**，并将 Exa 接入为它的 tools 之一。该 node 可以自行决定是执行 search、抓取完整页面，还是先串联多次 Exa 调用，再将输出传递给工作流的下一步。

它非常适合以下场景：

* 用最新的网页证据丰富 CRM 或电子表格中的行数据
* 监控新闻，并将带来源的 summary 发送到 Slack 或邮箱
* 在将 record 转入销售工作流之前先研究公司背景
* 对比产品并将结果写入文档

<div id="reusable-custom-mcp-node">
  ### 可复用的自定义 MCP node
</div>

如果只是一个可重复执行的操作，可以创建一个专用 node：

1. 打开 node 库并搜索 Exa。
2. 选择 **Create a node with AI**。
3. 描述单个操作，例如 `Search for funding announcements from the past seven days`。
4. 测试生成的 node，确认其输入和输出，然后保存。

当任务需要动态规划或调用多个 tools 时，请使用 Agent Node；当同一个 Exa 操作需要在每个项目上稳定、可预期地执行时，请使用自定义 MCP node。

<div id="prompt-patterns">
  ## Prompt 模式
</div>

<AccordionGroup>
  <Accordion title="搜索并总结">
    ```text theme={null}
    搜索本周发布的关于 [topic] 的官方公告。
    为每条结果返回日期、发布方、摘要和来源 URL。
    ```
  </Accordion>

  <Accordion title="增强公司信息">
    ```text theme={null}
    根据给定的公司名称和域名，查找其产品描述、
    最新融资公告以及两条近期新闻来源。
    ```
  </Accordion>

  <Accordion title="读取已知页面">
    ```text theme={null}
    获取该 URL 的完整页面内容，并以 JSON 形式提取其定价层级。
    ```
  </Accordion>
</AccordionGroup>

<div id="troubleshooting">
  ## 故障排查
</div>

<AccordionGroup>
  <Accordion title="agent 无法使用 Exa">
    重新打开该 agent 的 MCP tools，确认 Exa 已连接，并启用所需的工具。即使 integration 已连接，其中的单个工具仍可能处于禁用状态。
  </Accordion>

  <Accordion title="agent 选择了错误的操作">
    在请求中明确说明它应当执行 search、读取已知 URL、查找相似页面，还是基于 sources 作答。同时禁用该工作流中 agent 用不到的 Exa tools。
  </Accordion>

  <Accordion title="工作流需要一次可预测的调用">
    用输入和任务均已固定的自定义 Exa MCP node 替换通用 agent 步骤。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 资源
</div>

<Columns cols={3}>
  <Card title="Gumloop Exa integration" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="阅读指南" arrow="true">
    查看 Gumloop 现有的 tools 和 Agent Node 工作流。
  </Card>

  <Card title="Exa MCP server" icon="plug" href="/zh/docs/get-started/exa-mcp" cta="阅读指南" arrow="true">
    了解通过 MCP 提供的 Exa tools。
  </Card>

  <Card title="Exa Search" icon="search" href="/zh/docs/search/quickstart" cta="阅读指南" arrow="true">
    了解如何构建搜索查询并调整返回的页面内容。
  </Card>
</Columns>