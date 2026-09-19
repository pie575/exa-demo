> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="world-agentkit">
  # World AgentKit
</div>

> 借助 World AgentKit，让经过真人身份验证的 AI 智能体免费访问 Exa——无需 USDC。

<div id="what-is-agentkit">
  ## 什么是 AgentKit？
</div>

[World AgentKit](https://docs.world.org/agents/agent-kit) 是一套工具包，可让 AI 智能体通过 [World ID](https://world.org) 证明自己背后有真实且经过验证的人类。与 [x402](/zh/docs/integrations/payments/x402/quickstart) 集成后，它还能提供一条**免费试用**路径：在 World 的 [AgentBook](https://docs.world.org/agents/agent-kit/integrate) 中注册的智能体无需支付 USDC 即可访问 Exa 的 `/search` 和 `/contents` 端点。

该机制与标准 x402 支付流程并行运作。每位经过验证的人类在其背书的所有智能体之间共享**每月 100 次免费请求**。额度用尽后，智能体将回退到常规的 USDC 支付路径。计数器在每个自然月初 (UTC) 重置。

<Info>
  如果请求中包含 `x-api-key` 或 `Authorization: Bearer` header，AgentKit 免费试用和 x402 支付都会被跳过，常规的 API key 计费流程优先生效。
</Info>

<div id="how-it-works">
  ## 工作原理
</div>

当客户端在未提供 API key 的情况下请求 `/search` 或 `/contents` 时，Exa 会返回 `402 Payment Required`。响应会在 `PAYMENT-REQUIRED` header 中包含一个 `agentkit` 扩展，其中携带 [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) (Sign-In with Ethereum) 挑战。

Agent 使用其已注册的钱包对该挑战进行签名，Exa 随后进行验证：

1. **签名校验** — 对照钱包地址验证 SIWE 签名 (既支持通过 EIP-191 的 EOA，也支持通过 ERC-1271 的智能合约钱包)
2. **AgentBook 查询** — 通过 World Chain (`eip155:480`) 上的 AgentBook 合约将钱包解析为匿名的 `humanId`，以确认有一位经过验证的唯一真人已将其身份委托给该 Agent
3. **用量检查** — 若该真人仍有剩余的免费试用次数，则授予访问权限；否则回退为要求支付 USDC

<div id="quickstart">
  ## 快速开始
</div>

<div id="1-register-your-agent-in-agentbook">
  ### 1. 在 AgentBook 中注册你的 Agent
</div>

这是一次性设置。你需要安装 [World App](https://world.org/download) 并完成身份验证。

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

CLI 会触发 World App 验证流程，然后在 World Chain 上提交一笔注册交易。完成后，任何使用 AgentKit 的服务器都可以查询你的钱包，确认其背后是一个真实的人。

<div id="2-send-a-request-get-the-challenge">
  ### 2. 发送请求 (获取质询)
</div>

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

`402` 响应在解码后的 `PAYMENT-REQUIRED` payload 中包含一个 `agentkit` 扩展：

```json theme={null}
{
  "x402Version": 2,
  "accepts": [ ... ],
  "extensions": {
    "agentkit": {
      "info": {
        "version": "1",
        "statement": "Verify your agent is backed by a real human to access Exa",
        "domain": "api.exa.ai",
        "uri": "https://api.exa.ai/search",
        "nonce": "abc123...",
        "issuedAt": "2026-04-11T01:30:00.000Z",
        "resources": ["https://api.exa.ai/search"]
      },
      "supportedChains": [
        { "chainId": "eip155:480", "type": "eip191" },
        { "chainId": "eip155:480", "type": "eip1271" }
      ],
      "schema": { ... },
      "_options": {
        "statement": "Verify your agent is backed by a real human to access Exa",
        "mode": { "type": "free-trial", "uses": 100 },
        "network": "eip155:480"
      }
    }
  }
}
```

<div id="3-sign-the-challenge-and-resubmit">
  ### 3. 签名挑战并重新提交
</div>

根据 `info` 字段 (domain、uri、nonce、statement 等) 构造一条 [SIWE 消息](https://eips.ethereum.org/EIPS/eip-4361)，使用已注册的 agent 钱包，以 `supportedChains` 中的某一种类型对其签名，然后通过 `agentkit` header 发送 (base64 编码的 JSON) ：

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

如果该 Agent 已通过验证且仍有剩余的免费试用次数，Exa 将返回 `200` 及搜索结果——无需付费。

<div id="using-the-agentkit-x402-skill">
  ### 使用 AgentKit x402 技能
</div>

无需手动实现质询-响应流程，只需将 [agentkit-x402 技能](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md) 添加到你的 AI 智能体中：

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

当 agent 收到带有 AgentKit 扩展的 `402` 响应时，该技能会自动完成整个流程。

<div id="free-trial-details">
  ## 免费试用详情
</div>

* 每位经过验证的真人在其支持的所有 agent 之间共享 **每月 100 次免费请求**
* 用量计数器在每个自然月 (UTC) 开始时重置
* 用量按真人和端点分别统计 (`/search` 和 `/contents` 分开计数)
* 由同一位真人支持的两个 agent 共用同一个计数器
* 当月免费试用次数用尽后，agent 将回退到标准的 [x402 支付流程](/zh/docs/integrations/payments/x402/quickstart)
* `/search` 上的免费试用请求同样适用 [10 条结果上限](/zh/docs/integrations/payments/x402/quickstart#pricing)
* 免费试用计数器目前不会在 API 响应中体现——次数用尽时，服务器会返回标准的 `402`，不再授予免费访问

<div id="supported-endpoints">
  ## 支持的端点
</div>

| 端点          | x402 支付 | AgentKit 免费试用 |
| ----------- | :-----: | :-----------: |
| `/search`   |    是    |       是       |
| `/contents` |    是    |       是       |

其他所有 Exa 端点均不支持 x402 或 AgentKit 免费试用。

<div id="network-details">
  ## 网络详情
</div>

| 属性             | 值                                 |
| -------------- | --------------------------------- |
| AgentBook 所在链  | World Chain                       |
| 链 ID (CAIP-2)  | `eip155:480`                      |
| 验证方式           | World Chain 上的 AgentBook 合约       |
| 支持的钱包类型        | EOA (EIP-191) 和智能合约钱包 (ERC-1271)  |

<div id="faq">
  ## 常见问题
</div>

<AccordionGroup>
  <Accordion title="可以同时使用 x402 支付和 AgentKit 吗？">
    可以。`PAYMENT-REQUIRED` 响应中会同时返回支付价格和 AgentKit challenge，你的客户端可任选一种方式。如果免费试用次数已用完，agent 可以回退到使用 USDC 支付。
  </Accordion>

  <Accordion title="如果我的 agent 未在 AgentBook 中注册会怎样？">
    AgentKit 验证会静默失败，该请求将按标准 `402` 处理——你的 agent 仍可通过常规 x402 流程使用 USDC 支付。
  </Accordion>

  <Accordion title="同一个人名下的两个 agent 会各自拥有独立的免费试用额度吗？">
    不会。用量按人统计 (依据 AgentBook 提供的匿名 `humanId`) ，而非按钱包统计。同一个 World ID 名下的两个 agent 共用同一个计数器。
  </Accordion>

  <Accordion title="涉及哪些区块链网络？">
    标准 x402 USDC 支付可在 **Base** (`eip155:8453`) 或 **Solana 主网** (`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`) 上结算。AgentKit 验证则使用 **World Chain** (`eip155:480`) 进行 AgentBook 查询。两者相互独立——AgentKit 不需要任何链上支付。
  </Accordion>

  <Accordion title="支持哪些钱包类型？">
    既支持使用 EIP-191 签名的 EOA (外部拥有账户) ，也支持使用 ERC-1271 的智能合约钱包 (如 Coinbase Smart Wallet、Safe) 。详见 [World AgentKit SDK 参考](https://docs.world.org/agents/agent-kit/sdk-reference)。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 资源
</div>

* [x402 支付指南](/zh/docs/integrations/payments/x402/quickstart)：标准 USDC 支付流程
* [World AgentKit 文档](https://docs.world.org/agents/agent-kit)：完整的 AgentKit 文档
* [World AgentKit 集成指南](https://docs.world.org/agents/agent-kit/integrate)：AgentBook 注册
* [World AgentKit SDK 参考](https://docs.world.org/agents/agent-kit/sdk-reference)：SDK API 参考
* [AgentKit x402 技能](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md)：面向 AI 智能体的预构建技能
* [x402 协议文档](https://docs.x402.org)：完整的 x402 规范