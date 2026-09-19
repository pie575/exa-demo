> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="nevermined">
  # Nevermined
</div>

> 通过 Nevermined x402 银行卡委托为 Exa 实现自主智能体支付。一次 7 美元的购买可开通新的 Exa API key，或为现有 key 充值 7 美元额度。

智能体通过 [Nevermined](https://nevermined.ai) 的 [x402 银行卡委托](https://nevermined.ai/docs/specs/x402-card-delegation)方案，使用信用卡向 Exa 付款。每次 **$7 购买**都会返回一个包含 **$7 Exa 额度**的 Exa API key。

<Info>
  请使用此 Nevermined 计划 ID：<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />该计划运行在 Nevermined 的正式环境 (API key 以 live 为前缀) 。此次购买针对的是 API 额度，而非单次 search 请求。
</Info>

首次使用 Nevermined 付款时，`POST /team-management/nevermined/purchase-key` 会开通一个新的 Exa API key 并充值 $7 额度。如果该 key 的额度用尽，可使用相同的委托铸造一个新的 x402 令牌，并再次调用该端点。Exa 会返回同一个 API key，并再充值 $7 额度。

<div id="buy-a-key">
  ## 购买 key
</div>

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **费用：** 每次购买 7 美元，从 x402 令牌所引用的委托关联的银行卡扣款。
* **响应 (首次付款方) ：** `{ status: "ok", apiKey: "…", expiresAt: null }` —— 一个包含 7 美元额度的全新 Exa API key。
* **响应 (再次付款方) ：** `{ status: "ok", apiKey: "…", expiresAt: null }` —— 同一个 Exa API key，额度再增加 7 美元。
* **响应 (重放的令牌) ：** 返回缓存结果，不产生新的扣款。
* **签名缺失或无效：** 返回 `402 Payment Required`，响应体中包含支付要求。

<div id="how-it-works">
  ## 工作原理
</div>

支付部分由 Nevermined 处理；Exa 只能看到签名后的 x402 令牌。

1. **一次性设置 (由卡片所有者完成) ：** 在 [nevermined.app](https://nevermined.app) 绑定一张卡片，并在该卡上创建一个 **delegation** (即支出授权：所有者设定额度上限和有效期，还可将其限定到特定的 API key) ，然后为 agent 签发一个 Nevermined API key。
2. **agent 找到自己的 delegation。** 借助 Nevermined SDK，agent 可以发现其 key 能够动用的 delegation，并从中挑选一个剩余预算充足 (至少 $7) 的。如果没有可用的 delegation，所有者可在控制台中创建一个；完全自主的 agent 也可以在卡片限制范围内通过 SDK 自行创建。
3. **agent 针对上述 plan ID 铸造一个 x402 访问令牌**，采用银行卡委托方案，并通过 ID 引用该 delegation。delegation 必须在铸造之前就已存在，令牌无法临时创建 delegation。
4. **agent 将该令牌放在 `payment-signature` header 中 POST 到上述端点**，并从响应中获取 Exa API key。
5. **该 key 可立即用于**标准的 [Exa Search API](/zh/docs/search/quickstart)。

如需面向 agent 的完整操作说明 (SDK 方法、参数、delegation 的发现与创建、故障排查) ，请参阅 Nevermined 的 Exa 集成指南：[nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agent 可直接抓取 [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)) 。

<div id="what-7-buys">
  ## $7 能用多少
</div>

额度按 Exa API 标准价格扣费。按当前费率，$7 的额度大致相当于：

| 端点或功能                                       |                  价格 |        大致用量 |
| ------------------------------------------- | ------------------: | ----------: |
| Search (`instant`、`fast`、`auto`) ，最多 10 条结果 |      $7 / 1,000 次请求 |   1,000 次请求 |
| Deep-Lite Search                            |     $10 / 1,000 次请求 |     700 次请求 |
| Deep Search                                 |     $12 / 1,000 次请求 |    ~583 次请求 |
| Deep-Reasoning Search                       |     $15 / 1,000 次请求 |    ~466 次请求 |
| Contents (`text`、`highlights` 或 `summary`)  | $1 / 每种内容类型 1,000 页 |     7,000 页 |
| Search 或 Contents 的 AI 页面摘要                 |        $1 / 1,000 页 |   7,000 条摘要 |
| 前 10 条以外的额外结果                               |      $1 / 1,000 条结果 | 7,000 条额外结果 |
| Answer                                      |      $5 / 1,000 次请求 |   1,400 次请求 |
| Monitors                                    |     $15 / 1,000 次请求 |    ~466 次请求 |

Search 请求已包含最多 10 条结果的正文与 highlights。超出 10 条的结果以及 AI 摘要单独计费。<br />
完整定价详情请参阅 [Exa 定价](https://exa.ai/pricing)。

<div id="when-the-key-runs-out">
  ## 当 key 额度用尽时
</div>

一旦 API key 的额度耗尽，Exa 会在常规 API 端点上返回 **`HTTP 402`**：

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

使用相同的 plan ID 和委托关系铸造一个新的 x402 令牌，然后再次 POST 到同一个 `/purchase-key` 端点。Exa 会为同一个 API key 再追加 7 美元的额度。

<div id="references">
  ## 参考资料
</div>

* [Nevermined Exa 集成指南](https://nevermined.ai/docs/integrations/exa)
* [x402 银行卡委托规范](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Exa 定价](https://exa.ai/pricing)
* [Exa Search API](/zh/docs/search/quickstart)