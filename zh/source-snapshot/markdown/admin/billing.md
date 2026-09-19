> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="billing-and-rate-limits">
  # 账单与速率限制
</div>

> 管理 Exa 积分、发票和 API 速率限制。

Exa 提供免费套餐、按量付费以及定制的企业版方案。API 用量会从团队的积分余额中扣除，速率限制则决定团队发起请求的频率上限。

<Columns cols={3}>
  <Card title="账单面板" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="管理账单" arrow="true">
    充值积分、配置自动充值并查看发票。
  </Card>

  <Card title="API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="管理 API key" arrow="true">
    查看用量，并为单个 key 设置更低的限制。
  </Card>

  <Card title="定价" icon="tag" href="/zh/docs/admin/pricing" cta="查看定价" arrow="true">
    对比各项 Exa 产品的当前价格。
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## 套餐一览
</div>

| 套餐       | 计费方式                      | 速率限制                                           | Agent 并发  |
| -------- | ------------------------- | ---------------------------------------------- | ---------- |
| **免费版**  | 赠送 $20 入门积分，此后每月刷新 $10 积分 | 10 QPS                                         | 50 个进行中的运行 |
| **按量付费** | 预付积分，无需订阅，无最低消费           | 10 QPS，[最高可达 25 QPS](#25-qps-on-pay-as-you-go) | 50 个进行中的运行 |
| **企业版**  | 定制化批量定价，可选后付费开票           | 定制                                             | 定制         |

<Card title="联系我们" icon="headset" href="https://exa.ai/contact/sales" cta="联系销售" arrow="true">
  我们将围绕延迟、规模、ZDR 等方面，为你推荐最合适的方案。
</Card>

<div id="billing-basics">
  ## 计费基础
</div>

请求会按 [定价](/zh/docs/admin/pricing) 中的费率或您的企业合同费率从预付积分中扣除。团队所有者可在 [账单面板](https://dashboard.exa.ai/billing) 中充值积分，付款通过 Stripe 处理。

如果团队积分耗尽，请求将返回 `402 Payment Required`。某个 API key 用满其分配的预算时，同样会返回 `402`。此时请充值积分，或联系团队管理员调整该 key 的预算。参见[错误码](/zh/docs/admin/error-codes)。

如需按 API key 查看历史用量，请使用[获取 API key 用量](/zh/docs/reference/team-management/get-api-key-usage)。

<div id="rate-limits">
  ## 速率限制
</div>

速率限制以每秒查询数(QPS)衡量,按团队整体计算,涵盖团队的所有 API key。你可以在 [API Keys](https://dashboard.exa.ai/api-keys) 页面为单个 key 设置更低的限制,但它的流量仍会计入团队限制。

| 端点                                                         | 默认限制           |
| ---------------------------------------------------------- | -------------- |
| `/search`、`/answer`、`/chat/completions`                    | 10 QPS         |
| `type` 为 `deep-lite`、`deep` 或 `deep-reasoning` 的 `/search` | 5 QPS          |
| `/contents`                                                | 100 QPS        |
| `/agent/runs`、`/responses`                                 | 5 QPS,50 个活跃运行 |
| `/websets/*`                                               | 20 QPS         |

部分端点共用速率限制额度。限制可能随时调整,并因套餐而异;Websets 搜索还有基于套餐的并发限制,可通过 [Get Team Info](/zh/docs/websets/api/teams/get-team-info) 查看。

超出限制时,请求会返回 `429 Too Many Requests`。若响应中带有 `Retry-After` header,请按其指示等待后重试,或采用指数退避重试。参见[错误码](/zh/docs/admin/error-codes)。

<div id="agent-limits">
  ### Agent 限制
</div>

Agent 限制分为两项独立控制：同时进行中的运行数量，以及启动新运行的速度。

* **并发**：同一时间最多可有 50 个 Agent 运行处于进行中。该限制与账户 QPS 相互独立，提升 QPS 也不会随之提高。超出该限制后再启动运行会返回 `429`，错误码为 `CONCURRENCY_LIMIT_REACHED`；请等待某个运行结束，或联系我们提升并发限制。
* **启动运行**：`POST /agent/runs` 会占用账户 QPS，且每次启动运行计为两次请求。因此启动运行的速率为 QPS 的一半：默认 10 QPS 的账户每秒可启动 5 个运行，25 QPS 则为每秒 12 个。
* **轮询**：查询运行状态、事件和运行列表的 `GET` 请求不计入 QPS，也不会阻塞调度，因此轮询进行中的 Agent 不受启动新运行速度的影响。

<div id="25-qps-on-pay-as-you-go">
  ### 按量付费享 25 QPS
</div>

在任意 30 天周期内购买满 $1,000 积分，你的团队速率限制将自动提升至 **25 QPS，有效期 90 天**。该阈值按购买的积分计算，而非消耗的积分；再次达标即重新计算 90 天。可在 [账单面板](https://dashboard.exa.ai/billing) 查看进度。

需要超过 25 QPS？[联系销售](https://exa.ai/contact/sales)。

<div id="auto-recharge">
  ## 自动充值
</div>

当余额降至你设定的阈值时，自动充值会自动购买积分。可在 [账单面板](https://dashboard.exa.ai/billing) 中配置。

| 设置项      | 说明                                 |
| -------- | ---------------------------------- |
| **充值金额** | 每次触发自动充值时购买的积分数量，范围为 $5 至 $10,000。 |
| **充值阈值** | 触发充值的余额水平。                         |
| **每月上限** | 计费周期内自动充值金额的上限，可选。设为 $0 或留空则不设上限。  |

例如：充值金额为 $100、阈值为 $10、每月上限为 $500，则余额每降至 $10 时便购买 $100，且本周期内自动购买总额不超过 $500。

如果即将发布新产品或有其他大流量的工作负载，请提前充入足够的积分，并将自动充值金额设置得高一些，以免产生大量小额扣款。

<div id="receipts-and-invoices">
  ## 收据与发票
</div>

Exa 会从 [billing@exa.ai](mailto:billing@exa.ai) 发送积分购买和自动充值的收据邮件。如有需要，请将该地址加入白名单。完整的发票记录可在[账单面板](https://dashboard.exa.ai/billing)中查看。

后付费发票结算仅在企业版方案中提供。

<div id="get-help">
  ## 获取帮助
</div>

<Columns cols={2}>
  <Card title="提升限制额度" icon="gauge" href="https://exa.ai/contact/sales" cta="联系销售" arrow="true">
    申请超过 25 QPS 的速率、自定义并发、批量定价或后付费结算。
  </Card>

  <Card title="账单支持" icon="mail" href="mailto:billing@exa.ai" cta="发送邮件至账单团队" arrow="true">
    获取付款、积分、发票或账户账单相关问题的帮助。
  </Card>
</Columns>