> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="pricing">
  # 定价
</div>

> Exa Search、Contents、Answer、Monitors 和 Agent API 的按量付费费率

***

Exa 采用按量付费模式，无订阅费、无最低消费：充值积分后，按下方费率逐次请求计费。

<Check>
  **免费开始。** 新账户可获得 $20 免费积分 (约 2,800 次 search) ，免费套餐每月再赠送 $10 积分。获取 API key，即刻开始构建。

  **需要扩容？** 如有高用量、自定义索引、更高速率限制、SLA 或零数据保留 (Zero Data Retention) 需求，欢迎[联系我们](https://exa.ai/contact/sales)，了解提供批量折扣的[企业方案](#enterprise)。
</Check>

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建 key。新账户即享免费积分。
</Card>

<div id="products">
  ## 产品
</div>

<Columns cols={3}>
  <Card title="Search" icon="search" href="/zh/docs/search/quickstart">
    **$7** / 每千次请求

    实时搜索，返回节省 token 的页面内容。
  </Card>

  <Card title="Deep Search" icon="microscope" href="/zh/docs/search/deep-search">
    **$12–15** / 每千次请求

    多步骤研究，输出结构化结果并附带引用。
  </Card>

  <Card title="Contents" icon="file-text" href="/zh/docs/contents/quickstart">
    **$1** / 每千个页面

    针对已知 URL 获取完整页面文本、highlights 和摘要。
  </Card>

  <Card title="Answer" icon="message-circle" href="/zh/docs/reference/answer">
    **$5** / 每千次请求

    由 LLM 生成的问题答案，并附带引用。
  </Card>

  <Card title="Monitors" icon="bell" href="/zh/docs/monitors/quickstart">
    **$15** / 每千次请求

    定时搜索，及时发现网络上的新动态。
  </Card>

  <Card title="Agent" icon="bot" href="/zh/docs/agent/quickstart">
    **$0.012–$1.00** / 每次固定 effort 运行，或按用量计费

    异步深度研究、list building 与 enrichment。
  </Card>
</Columns>

<div id="search-contents-answer-and-monitors">
  ## Search、Contents、Answer 和 Monitors
</div>

每个端点均按请求收取基础费用，其中已包含最多 10 条结果。超出 10 条的结果以及 Exa 生成的页面摘要需额外计费。

| 端点          | 基础价格<br /> (含最多 10 条结果)  | 超出 10 条后每条结果 | AI 页面摘要     |
| ----------- | ------------------------ | ------------ | ----------- |
| `/search`   | $7 / 1k 次请求              | $1 / 1k 条结果  | $1 / 1k 个页面 |
| `/answer`   | $5 / 1k 次请求              | —            | —           |
| `/monitors` | $15 / 1k 次请求             | $1 / 1k 条结果  | $1 / 1k 个页面 |
| `/contents` | $1 / 1k 个页面，按内容类型分别计费    | —            | $1 / 1k 个页面 |

<div id="agent">
  ## Agent
</div>

为 [Agent](/zh/docs/agent/quickstart) 设置固定的 `effort`，即可获得可预测的单次请求价格。`auto` 是默认的按量计费模式；测试版的 `max` 同样按量计费，且适用相同的用量费率：

| Effort    | 价格           |
| --------- | ------------ |
| `minimal` | $0.012 / 次请求 |
| `low`     | $0.025 / 次请求 |
| `medium`  | $0.10 / 次请求  |
| `high`    | $0.50 / 次请求  |
| `xhigh`   | $1.00 / 次请求  |

按量计费的运行按实际用量收费，上限为单次运行的费用上限。`auto` 的默认上限为 $5；测试版的 `max` 默认上限为 $20：

| 用量项               | 价格                |
| ----------------- | ----------------- |
| Agent 计算单元        | $0.10 / ACU       |
| Search 工具调用       | $0.005 / 次 search |
| 邮箱联系方式 enrichment | $0.02 / 个邮箱       |
| 电话联系方式 enrichment | $0.07 / 个电话号码     |

<div id="connect-providers">
  ### Connect 提供方
</div>

使用 [Exa Connect](/zh/docs/agent/connect/overview) 数据源的运行，还会针对每次提供方调用额外计费——例如
[Fiber.ai](/zh/docs/agent/connect/fiber#pricing) 每积分 $0.02，
[Baselayer](/zh/docs/agent/connect/baselayer#pricing) 则视操作不同，每笔订单
$0.15–$4.00。全部提供方费率请参阅
[Connect 定价](/zh/docs/agent/connect/overview#pricing)。

<div id="deep-search">
  ## Deep Search
</div>

在 [`/search`](/zh/docs/search/deep-search) 中通过 `type` 设置。额外结果和 AI 页面摘要的收费与标准 search 相同。

| 类型               | 基础价格<br /> (最多 10 条结果)  | 延迟      | 适用场景        |
| ---------------- | ----------------------- | ------- | ----------- |
| `deep-lite`      | $12 / 1k 次请求            | ~4 秒    | 轻量级信息整合     |
| `deep`           | $12 / 1k 次请求            | 4–15 秒  | 带结构化输出的多步推理 |
| `deep-reasoning` | $15 / 1k 次请求            | 12–40 秒 | 难度更高的研究任务   |

<div id="enterprise">
  ## 企业版
</div>

适用于高用量、自定义数据集以及更严格的安全要求的场景。

<Columns cols={3}>
  <Card title="强大的搜索能力" icon="gauge">
    每次搜索最多返回 1,000 条结果，支持单次请求超过 25 条结果、自定义速率限制 (QPS) 、定制化内容审核以及自定义索引。
  </Card>

  <Card title="企业级支持" icon="headphones">
    SLA 与 MSA、一对一上手指导与支持，以及[零数据保留](/zh/docs/admin/security/zero-data-retention)。
  </Card>

  <Card title="定制化定价" icon="tag">
    批量折扣与后付费发票结算。
  </Card>
</Columns>

<Card title="联系我们" icon="mail" horizontal href="https://exa.ai/contact/sales">
  获取企业级用量与条款的报价
</Card>

<div id="cost-glossary">
  ## 费用术语表
</div>

<AccordionGroup>
  <Accordion title="请求（Request）">
    对某个端点的一次 API 调用。价格按每 1,000 次请求计价，因此 $7 / 1k 的费率相当于每次调用 $0.007。
  </Accordion>

  <Accordion title="结果（Result）">
    响应中返回的一条搜索结果。基础价格包含单次请求中的前 10 条结果；超出 10 条的部分每条按 $1 / 1k 结果计费。因此请求 `numResults: 20` 的费用为基础价格加上 10 条额外结果的费用。
  </Accordion>

  <Accordion title="页面与内容类型">
    页面指 Exa 为其返回内容的一个 URL。内容类型指该页面的一种呈现形式：`text`、`highlights` 或 `summary`。`/contents` 对每种内容类型分别计费，因此同一页面同时返回 `text` 和 `highlights` 会计为两次。
  </Accordion>

  <Accordion title="AI 页面摘要">
    由 Exa 生成的页面摘要，由我们侧额外一次 LLM 调用产生。在任何返回该摘要的端点上均按 $1 / 1k 页面计费。
  </Accordion>

  <Accordion title="Agent 计算单元（ACU）">
    一次 Agent 运行所消耗的模型计算单位，通过 `usage.agentComputeUnits` 上报。运行时间越长、`input.data` 越大、推理步骤越多，消耗的 ACU 就越多。
  </Accordion>

  <Accordion title="Effort">
    用于在成本、延迟与彻底程度之间权衡的 Agent 参数。`auto` 按实际消耗计费 (ACU 加上工具调用) ，默认上限为 $5；测试版的 `max` 采用相同的用量费率，默认上限为 $20。固定 effort 则按每次请求收取统一价格。参见 [Agent effort 模式](/zh/docs/agent/quickstart#effort)。
  </Accordion>

  <Accordion title="联系方式 enrichment">
    一次 Agent 查找，返回某个人或公司的邮箱地址或电话号码。在该次运行的其他费用之外，按找到的每条联系方式计费。
  </Accordion>

  <Accordion title="积分（Credits）">
    账户中的预付美元余额。用量将按上述费率从积分中扣除。
  </Accordion>
</AccordionGroup>

<Card title="账单" icon="credit-card" horizontal href="/zh/docs/admin/billing">
  添加积分、设置自动充值并查看发票
</Card>