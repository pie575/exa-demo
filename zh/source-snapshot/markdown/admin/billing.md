> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

<div id="billing-and-rate-limits">
  # 计费与速率限制
</div>

> 管理 Exa 积分、发票和 API 速率限制。

Exa 提供免费套餐、按量付费以及定制的 Enterprise plan。API 用量从团队的积分余额中扣除，速率限制则决定团队发起请求的频率上限。

<Columns cols={3}>
  <Card title="账单面板" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="管理计费" arrow="true">
    添加积分、配置自动充值并查看发票。
  </Card>

  <Card title="API 密钥" icon="key" href="https://dashboard.exa.ai/api-keys" cta="管理 API 密钥" arrow="true">
    查看用量，并为单个密钥设置更低的限制。
  </Card>

  <Card title="定价" icon="tag" href="/zh/docs/admin/pricing" cta="查看定价" arrow="true">
    对比 Exa 各产品的当前费率。
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## plan 一览
</div>

| plan              | 计费                         | 速率限制                                           | Agent 并发 |
| ----------------- | -------------------------- | ---------------------------------------------- | -------- |
| **Free**          | 赠送 $20 入门积分，之后每月刷新 $10 积分  | 10 QPS                                         | 50 个活跃运行 |
| **Pay as you go** | 预付积分，无需订阅，无最低消费            | 10 QPS，[最高可达 25 QPS](#25-qps-on-pay-as-you-go) | 50 个活跃运行 |
| **Enterprise**    | 定制化 批量定价，可选后付费开票 | 定制                                             | 定制       |

<Card title="联系我们" icon="headset" href="https://exa.ai/contact/sales" cta="联系销售" arrow="true">
  我们会就延迟、规模、ZDR 等方面为你推荐最合适的方案。
</Card>

<div id="billing-basics">
  ## 计费基础
</div>

请求将按 [定价](/zh/docs/admin/pricing) 中的费率或您的 Enterprise 合同约定，从预付积分中扣除。团队所有者可在[账单面板](https://dashboard.exa.ai/billing)中充值积分，支付通过 Stripe 处理。

如果团队积分耗尽，请求将返回 `402 Payment Required`。某个 API 密钥达到其分配的预算时，同样会返回 `402`。此时请充值积分，或联系团队管理员调整该密钥的预算。参见[错误码](/zh/docs/admin/error-codes)。

如需按 API 密钥查看历史用量，请使用 [获取 API 密钥用量](/zh/docs/reference/team-management/get-api-key-usage)。

<div id="rate-limits">
  ## 速率限制
</div>

速率限制以每秒查询数 (QPS) 衡量，按团队整体计算，涵盖团队的所有 API 密钥。你可以在 [API 密钥](https://dashboard.exa.ai/api-keys) 页面为单个密钥设置更低的限制，但该密钥的流量仍会计入团队限制。

| 端点                                                         | 默认限制             |
| ---------------------------------------------------------- | ---------------- |
| `/search`、`/answer`、`/chat/completions`                    | 10 QPS           |
| `type` 为 `deep-lite`、`deep` 或 `deep-reasoning` 的 `/search` | 5 QPS            |
| `/contents`                                                | 100 QPS          |
| `/agent/runs`、`/responses`                                 | 5 QPS 且 50 个活跃运行 |
| `/websets/*`                                               | 20 QPS           |

部分端点共享速率限制额度。限制可能会调整，且因 plan 而异；Websets 的 search 还有基于 plan 的并发限制，可通过 [Get Team Info](/zh/docs/websets/api/teams/get-team-info) 查询。

超出限制时，请求会返回 `429 Too Many Requests`。如果响应中带有 `Retry-After` header，请按其指定的时间等待，否则采用指数退避重试。参见[错误码](/zh/docs/admin/error-codes)。

<div id="agent-limits">
  ### Agent 限制
</div>

Agent 限制包含两项独立的控制：同时进行中的运行数量，以及启动新运行的速度。

* **并发**：同一时间最多可有 50 个 Agent 运行处于进行中状态。该限制独立于 QPS，提升 QPS 也不会改变它。超出限制后再启动运行会返回 `429`，错误码为 `CONCURRENCY_LIMIT_REACHED`；请等待某个运行结束，或联系我们提升并发限制。
* **启动运行**：`POST /agent/runs` 会占用账户 QPS，且每次启动运行计为两个请求。因此启动运行的速率为 QPS 的一半，即默认 10 QPS 的账户每秒可启动 5 个运行，25 QPS 则每秒可启动 12 个。
* **轮询**：用于获取运行状态、事件和运行列表的 `GET` 请求不计入 QPS，也不会阻塞调度，因此轮询进行中的 Agent 与启动新运行的速度互不影响。

<div id="25-qps-on-pay-as-you-go">
  ### Pay as you go 下的 25 QPS
</div>

在任意 30 天窗口内充值 $1,000 积分，你所在团队的速率限制会自动提升至 **25 QPS，有效期 90 天**。该门槛按购买的积分计算，而非消耗的积分；再次达标即重新计算 90 天。可在[账单面板](https://dashboard.exa.ai/billing)查看进度。

需要超过 25 QPS？[联系销售](https://exa.ai/contact/sales)。

<div id="auto-recharge">
  ## 自动充值
</div>

当余额降至你设定的阈值时，自动充值会自动购买积分。可在[账单面板](https://dashboard.exa.ai/billing)中进行配置。

| 设置       | 说明                                 |
| -------- | ---------------------------------- |
| **充值金额** | 每次触发自动充值时购买的积分金额，范围为 $5 至 $10,000。 |
| **充值阈值** | 触发充值的余额水平。                         |
| **每月上限** | 计费周期内自动充值消费的可选上限。设为 $0 或留空表示不设上限。  |

例如，充值金额为 $100、阈值为 $10、每月上限为 $500，则余额每次降至 $10 时都会购买 $100，且该周期内自动购买总额最多为 $500。

如果即将发布产品或有其他高用量场景，请提前充入足够的积分，并将自动充值金额设置得高一些，以免频繁产生小额支付。

<div id="receipts-and-invoices">
  ## 收据与发票
</div>

Exa 会通过 [billing@exa.ai](mailto:billing@exa.ai) 发送积分购买和自动充值的收据邮件。如有需要，请将该地址加入允许列表。完整的发票历史记录可在[账单面板](https://dashboard.exa.ai/billing)中查看。

后付费发票计费仅在 Enterprise plan 中提供。

<div id="get-help">
  ## 获取帮助
</div>

<Columns cols={2}>
  <Card title="提高限制" icon="gauge" href="https://exa.ai/contact/sales" cta="联系销售" arrow="true">
    申请高于 25 QPS 的速率、自定义并发、批量定价或后付费计费。
  </Card>

  <Card title="计费支持" icon="mail" href="mailto:billing@exa.ai" cta="发送计费邮件" arrow="true">
    获取支付、积分、发票或账户计费相关问题的帮助。
  </Card>
</Columns>