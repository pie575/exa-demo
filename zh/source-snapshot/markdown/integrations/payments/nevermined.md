> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="nevermined">
  # Nevermined
</div>

> 通过 Nevermined x402 银行卡委托为 Exa 实现自主 agent 支付。每笔 7 美元的购买会开通一个 Exa API 密钥或为其充值 7 美元积分。

Agent 通过 [Nevermined](https://nevermined.ai) 的 [x402 银行卡委托](https://nevermined.ai/docs/specs/x402-card-delegation) 方案，使用信用卡向 Exa 付款。每笔 **$7 购买**都会返回一个含 **$7 Exa 积分**的 Exa API 密钥。

<Info>
  请使用此 Nevermined 计划 ID：<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />该 plan 运行在 Nevermined 的生产环境 (以 live 为前缀的 API 密钥) 上。此次购买购买的是 API 积分，而非单次 search 请求。
</Info>

对于首次付款的 Nevermined 付款方，`POST /team-management/nevermined/purchase-key` 会开通一个新的 Exa API 密钥并充入 $7 积分。若密钥积分用尽，可使用相同的委托 mint 一个新的 x402 token，并再次调用同一端点。Exa 会返回同一个 API 密钥，并再充入 $7 积分。

<div id="buy-a-key">
  ## 购买密钥
</div>

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **费用：** 每次购买 7 美元，从 x402 token 所引用的委托对应的银行卡扣款。
* **响应 (新付款方) ：** `{ status: "ok", apiKey: "…", expiresAt: null }` — 一个含 7 美元积分的全新 Exa API 密钥。
* **响应 (老付款方) ：** `{ status: "ok", apiKey: "…", expiresAt: null }` — 同一个 Exa API 密钥，再增加 7 美元积分。
* **响应 (重放的 token) ：** 返回缓存结果，不重复扣款。
* **签名缺失或无效：** 返回 `402 Payment Required`，响应体中包含支付要求。

<div id="how-it-works">
  ## 工作原理
</div>

支付部分由 Nevermined 处理；Exa 只看到签名后的 x402 token。

1. **一次性设置 (由银行卡持有者完成) ：** 在 [nevermined.app](https://nevermined.app) 绑定一张卡，在卡上创建一个**委托** (即支出许可：持有者设定额度和有效期，并可将其限定到特定的 API 密钥) ，然后为 agent 签发一个 Nevermined API 密钥。
2. **agent 查找自己的委托。** Nevermined SDK 让 agent 能够发现其密钥可支出的委托，并从中选择一个剩余预算充足 (至少 $7) 的委托。若不存在这样的委托，持有者可在控制台中创建，完全自主的 agent 也可以在银行卡限制范围内通过 SDK 创建。
3. **agent 针对上述计划 ID mint 一个 x402 访问 token**，采用银行卡委托方案，并通过 ID 引用该委托。委托必须在 mint 之前已存在；token 无法即时创建委托。
4. **agent 将该 token 放在 `payment-signature` header 中 POST 到上述端点**，并从响应中获得 Exa API 密钥。
5. **该密钥可立即用于**标准的 [Exa Search API](/zh/docs/search/quickstart)。

如需面向 agent 的完整操作指南 (SDK 方法、参数、委托的发现与创建、故障排查) ，请参阅 Nevermined 的 Exa 集成指南：[nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agent 可获取 [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)) 。

<div id="what-7-buys">
  ## $7 能用来做什么
</div>

积分按 Exa API 标准定价扣除。按当前费率，$7 积分大致可覆盖：

| 端点或功能                                       |                    价格 |        大致用量 |
| ------------------------------------------- | --------------------: | ----------: |
| Search (`instant`、`fast`、`auto`) ，最多 10 条结果 |        $7 / 1,000 次请求 |   1,000 次请求 |
| Deep-Lite Search                            |       $10 / 1,000 次请求 |     700 次请求 |
| Deep Search                                 |       $12 / 1,000 次请求 |    ~583 次请求 |
| Deep-Reasoning Search                       |       $15 / 1,000 次请求 |    ~466 次请求 |
| Contents (`text`、`highlights` 或 `summary`)  | $1 / 每种内容类型 1,000 个页面 |   7,000 个页面 |
| Search 或 Contents 的 AI 页面摘要                 |        $1 / 1,000 个页面 |   7,000 条摘要 |
| 前 10 条之外的额外结果                               |        $1 / 1,000 条结果 | 7,000 条额外结果 |
| Answer                                      |        $5 / 1,000 次请求 |   1,400 次请求 |
| Monitors                                    |       $15 / 1,000 次请求 |    ~466 次请求 |

Search 请求包含最多 10 条结果的文本和 highlights。超出 10 条的结果以及 AI 摘要将单独计费。<br />
完整定价详情请参见 [Exa 定价](https://exa.ai/pricing)。

<div id="when-the-key-runs-out">
  ## 密钥额度耗尽时
</div>

当 API 密钥的积分耗尽后，Exa 会在常规 API 端点上返回 **`HTTP 402`**：

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

使用相同的计划 ID 和委托 mint 一个新的 x402 token，然后再次将其 POST 到同一个 `/purchase-key` 端点。Exa 会向同一个 API 密钥再追加价值 7 美元的积分。

<div id="references">
  ## 参考资料
</div>

* [Nevermined Exa integration 指南](https://nevermined.ai/docs/integrations/exa)
* [x402 银行卡委托规范](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Exa 定价](https://exa.ai/pricing)
* [Exa Search API](/zh/docs/search/quickstart)