> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

# 定价 {#pricing}

> Exa Search、Contents、Answer、Monitors 和 Agent API 的按量付费费率

***

Exa 采用按量付费模式，无订阅费、无最低消费：你充值积分，按下方费率为每次请求计费。

<Check>
  **免费开始。** 新账户可获得 $20 免费积分 (约 2,800 次 search) ，Free Tier 每月还会额外赠送 $10 积分。获取 API 密钥，即可开始构建。

  **需要扩大规模？** 如果你有高用量、自定义索引、更高速率限制、SLA 或 Zero Data Retention 方面的需求，请[联系我们](https://exa.ai/contact/sales)，了解提供批量折扣的 [Enterprise plan](#enterprise)。
</Check>

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户自带免费积分。
</Card>

## 产品 {#products}

<Columns cols={3}>
  <Card title="Search" icon="search" href="/zh/docs/search/quickstart">
    **$7** / 1k 次请求

    实时 search，返回节省 token 的页面内容。
  </Card>

  <Card title="深度搜索" icon="microscope" href="/zh/docs/search/deep-search">
    **$12–15** / 1k 次请求

    多步骤研究，提供结构化输出与引用来源。
  </Card>

  <Card title="Contents" icon="file-text" href="/zh/docs/contents/quickstart">
    **$1** / 1k 个页面

    针对已知 URL 获取完整页面文本、highlights 和摘要。
  </Card>

  <Card title="Answer" icon="message-circle" href="/zh/docs/reference/answer">
    **$5** / 1k 次请求

    针对问题给出带引用来源的 LLM 回答。
  </Card>

  <Card title="Monitors" icon="bell" href="/zh/docs/monitors/quickstart">
    **$15** / 1k 次请求

    定时 search，及时发现网络上的新动态。
  </Card>

  <Card title="Agent" icon="bot" href="/zh/docs/agent/quickstart">
    **$0.012–$1.00** / 次固定 effort 运行，或按用量计费

    异步深度研究、列表构建与增强。
  </Card>
</Columns>

## Search、Contents、Answer 和 Monitors {#search-contents-answer-and-monitors}

每个端点都有按请求计费的基础价格，包含最多 10 条结果。超出部分的结果以及 Exa 生成的页面摘要将额外计费。

| 端点          | 基础价格<br /> (最多 10 条结果)  | 超出 10 条的每条结果 | AI 页面摘要   |
| ----------- | ----------------------- | ------------ | --------- |
| `/search`   | $7 / 1k 请求              | $1 / 1k 结果   | $1 / 1k 页 |
| `/answer`   | $5 / 1k 请求              | —            | —         |
| `/monitors` | $15 / 1k 请求             | $1 / 1k 结果   | $1 / 1k 页 |
| `/contents` | $1 / 1k 页，按内容类型计费       | —            | $1 / 1k 页 |

## Agent {#agent}

为 [Agent](/zh/docs/agent/quickstart) 设置固定的 `effort`，即可获得可预测的单次请求价格。`auto` 是默认的计量模式；测试版的 `max` 同样按计量计费，并使用相同的用量费率：

| Effort    | 价格          |
| --------- | ----------- |
| `minimal` | $0.012 / 请求 |
| `low`     | $0.025 / 请求 |
| `medium`  | $0.10 / 请求  |
| `high`    | $0.50 / 请求  |
| `xhigh`   | $1.00 / 请求  |

计量运行按实际用量计费，并受单次运行的费用上限约束。`auto` 的默认上限为 $5；测试版的 `max` 默认上限为 $20：

| 用量项目                | 价格            |
| ------------------- | ------------- |
| Agent Compute Units | $0.10 / ACU   |
| Search 工具调用         | $0.005 / 次搜索  |
| 邮箱联系方式增强            | $0.02 / 个邮箱   |
| 电话联系方式增强            | $0.07 / 个电话号码 |

### Connect 提供方 {#connect-providers}

使用 [Exa Connect](/zh/docs/agent/connect/overview) 数据源的运行，还会对每次提供方调用单独计费。例如
[Fiber.ai](/zh/docs/agent/connect/fiber#pricing) 每积分 $0.02，
[Baselayer](/zh/docs/agent/connect/baselayer#pricing) 则视操作不同，每次订单 $0.15–$4.00。
全部提供方费率请参见
[Connect 定价](/zh/docs/agent/connect/overview#pricing)。

## 深度搜索 {#deep-search}

在 [`/search`](/zh/docs/search/deep-search) 中通过 `type` 设置。额外结果和 AI 页面摘要的费用与标准搜索相同。

| 类型               | 基础价格<br /> (最多 10 条结果)  | 延迟      | 适用场景        |
| ---------------- | ----------------------- | ------- | ----------- |
| `deep-lite`      | $12 / 1000 次请求          | ~4 秒    | 轻量级综合       |
| `deep`           | $12 / 1000 次请求          | 4–15 秒  | 带结构化输出的多步推理 |
| `deep-reasoning` | $15 / 1000 次请求          | 12–40 秒 | 难度更高的研究任务   |

## Enterprise {#enterprise}

面向大规模用量、自定义数据集以及更严格的安全要求。

<Columns cols={3}>
  <Card title="强大的搜索能力" icon="gauge">
    每次搜索最多返回 1,000 条结果，支持单次请求超过 25 条结果、自定义速率限制 (QPS) 、定制化内容审核以及自定义索引。
  </Card>

  <Card title="企业级支持" icon="headphones">
    SLA 与 MSA、一对一上手指导与支持，以及 [Zero Data Retention](/zh/docs/admin/security/zero-data-retention)。
  </Card>

  <Card title="定制化定价" icon="tag">
    批量折扣与后付费发票计费。
  </Card>
</Columns>

<Card title="联系我们" icon="mail" horizontal href="https://exa.ai/contact/sales">
  获取企业级用量与条款的报价
</Card>

## 费用术语表 {#cost-glossary}

<AccordionGroup>
  <Accordion title="请求">
    对某个端点的一次 API 调用。价格按每 1,000 次请求标价，因此 $7 / 1k 的费率相当于每次调用 $0.007。
  </Accordion>

  <Accordion title="结果">
    响应中返回的一条搜索结果。基础价格已包含单次请求的前 10 条结果；超出 10 条的部分每条按 $1 / 1k 结果计费。因此，请求 `numResults: 20` 的费用为基础价格加上 10 条额外结果的费用。
  </Accordion>

  <Accordion title="页面与内容类型">
    页面指 Exa 为其返回内容的一个 URL。内容类型指该页面的一种呈现形式：`text`、`highlights` 或 `summary`。`/contents` 对每种内容类型分别计费，因此同时返回 `text` 和 `highlights` 的一个页面按两次计算。
  </Accordion>

  <Accordion title="AI 页面摘要">
    由 Exa 生成的页面摘要，由我们这边额外的一次 LLM 调用产生。在任何返回该摘要的端点上均按 $1 / 1k 页面计费。
  </Accordion>

  <Accordion title="Agent 计算单元（ACU）">
    一次 Agent 运行所消耗的模型计算单位，通过 `usage.agentComputeUnits` 上报。运行时间越长、`input.data` 越大、推理步骤越多，消耗的 ACU 就越多。
  </Accordion>

  <Accordion title="Effort">
    用于在费用、延迟与完备程度之间权衡的 agent 参数。`auto` 按消耗计费 (ACU 加工具调用) ，默认上限为 $5；beta 版 `max` 采用相同的用量费率，默认上限为 $20。固定 effort 则按每次请求收取固定价格。参见 [Agent effort 模式](/zh/docs/agent/quickstart#effort)。
  </Accordion>

  <Accordion title="联系方式增强">
    一次 agent 查找，用于获取某个人或公司的电子邮箱地址或电话号码。除该次运行的其他费用外，按找到的每条联系方式另行计费。
  </Accordion>

  <Accordion title="积分">
    账户中的预付美元余额。用量会按上述费率扣减积分。
  </Accordion>
</AccordionGroup>

<Card title="计费" icon="credit-card" horizontal href="/zh/docs/admin/billing">
  添加积分、设置自动充值并查看您的发票
</Card>