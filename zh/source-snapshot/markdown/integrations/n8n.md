> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="n8n">
  # n8n
</div>

> 在 n8n 工作流中使用 Exa 的 search 与 contents。

官方 [n8n Exa 节点](https://github.com/exa-labs/n8n-integration)为可视化工作流带来了网页搜索、内容提取、有依据的答案以及 Exa Agent 运行能力。你既可以把它当作普通的工作流步骤使用，也可以将其作为工具接入 n8n AI Agent。

<div id="install-the-exa-node">
  ## 安装 Exa 节点
</div>

包名为 `n8n-nodes-exa-official`。

<Steps>
  <Step title="添加社区节点">
    在 n8n 节点选择器中搜索 **Exa**。如果你的实例上没有该节点，可由实例所有者参照 n8n 的[社区节点安装指南](https://docs.n8n.io/integrations/community-nodes/installation/)安装 `n8n-nodes-exa-official`。

    该节点要求 n8n 1.60 及以上版本，Node.js 20.15 及以上版本。
  </Step>

  <Step title="创建 Exa API key">
    <Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建 key。新账户可获赠免费积分。
    </Card>
  </Step>

  <Step title="添加 Exa 凭据">
    在 n8n 中添加 **Exa API** 凭据并粘贴你的 key。在每个需要使用该账户的 Exa 节点上选择该凭据。
  </Step>
</Steps>

<div id="run-a-search">
  ## 运行搜索
</div>

1. 为工作流添加一个触发器。
2. 添加 **Exa** 节点。
3. 选择 **Search**。
4. 输入查询并选择搜索类型。
5. 选择响应格式：
   * **Results**：返回排序后的页面
   * **Text**：返回综合生成的答案
   * **Structured**：返回符合你的 schema 的 JSON
6. 运行该节点，并将其输出传递给工作流的下一步。

搜索还可以从每条结果中返回正文文本、highlights、摘要、链接和图片。域名过滤、发布日期、类别、`maxAgeHours` 以及子页面抓取均可在该节点的可选字段中配置。

<div id="available-resources">
  ## 可用资源
</div>

| 资源           | 操作                                                                                     |
| ------------ | -------------------------------------------------------------------------------------- |
| **Search**   | 使用 `auto`、`instant`、`fast`、`deep-lite`、`deep` 或 `deep-reasoning` 搜索网络，可选择生成综合结果和结构化输出。 |
| **Contents** | 为一组 URL 获取清洗后的文本、highlights、摘要、链接和图片。                                                  |
| **Answer**   | 生成有依据的答案，附带引用来源，并可选结构化输出。                                                              |
| **Agent**    | 创建、查看、列出、流式获取、轮询和取消多步骤 Agent 运行。                                                       |

<div id="use-exa-with-an-n8n-ai-agent">
  ## 在 n8n AI Agent 中使用 Exa
</div>

通过工具输入将 Exa 节点连接到 **AI Agent** 节点。需要由模型提供的参数可以使用 n8n 的 `$fromAI()` 表达式：

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search 和 Answer 非常适合作为 grounding 工具。若任务涉及多步研究、列表构建、结构化 enrichment 或高级 [Exa Connect](/zh/docs/agent/connect/overview) 数据，请使用 Agent 资源。

<div id="wait-for-an-agent-run">
  ## 等待 Agent 运行完成
</div>

创建 Agent 运行时，**Wait for Completion** 支持两种方式：

* **Stream**：保持一个服务器发送事件 (SSE) 连接，直到运行结束
* **Poll**：按固定间隔轮询运行状态

对于长时间运行或异步的工作流，请关闭 **Wait for Completion**，保存返回的运行 `id`，稍后再通过 **Get Run** 获取结果。n8n 步骤结束后，该运行会在 Exa 上继续执行。

<div id="troubleshooting">
  ## 故障排查
</div>

<AccordionGroup>
  <Accordion title="节点选择器中找不到 Exa 节点">
    请让实例所有者安装已验证的社区包 `n8n-nodes-exa-official`。社区节点能否使用取决于 n8n 实例的托管方式。
  </Accordion>

  <Accordion title="Exa 凭据被拒绝">
    请确认所选凭据中的 key 来自 [Exa 控制台](https://dashboard.exa.ai/api-keys) 且处于启用状态，并且该 key 仍有可用积分。
  </Accordion>

  <Accordion title="Agent 工作流超时">
    关闭 **Wait for Completion**，保存返回的运行 `id`，再在后续步骤中通过 **Get Run** 获取结果。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 资源
</div>

<Columns cols={3}>
  <Card title="官方 Exa 节点" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="查看仓库" arrow="true">
    查看当前支持的操作、兼容性和源码。
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/zh/docs/agent/quickstart" cta="阅读指南" arrow="true">
    构建多步骤研究与 Enrichment 工作流。
  </Card>

  <Card title="搜索最佳实践" icon="search" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    写出更好的查询，并选择合适的搜索模式。
  </Card>
</Columns>