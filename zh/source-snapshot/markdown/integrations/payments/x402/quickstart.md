> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

# 使用 x402 付款 {#pay-with-x402}

> 无需 API 密钥即可使用 Exa 的 Search 和 Contents API。通过 x402 协议，在 Base 或 Solana 上用 USDC 按请求付费。

## 什么是 x402？ {#what-is-x402}

[x402](https://x402.org) 是基于 HTTP `402 Payment Required` 状态码构建的开放支付标准。它让客户端能在 Base 或 Solana 上使用 USDC 稳定币按请求付费调用 API，无需账户、API 密钥或订阅。

Exa 在两个端点上支持 x402：**`/search`** 和 **`/contents`**。当你发送的请求既不带 API 密钥也不带支付 header 时，Exa 会返回 `402` 以及一个 `PAYMENT-REQUIRED` header，其中包含定价详情和支持的支付网络。你的客户端签署一笔 USDC 支付，带上 `PAYMENT-SIGNATURE` header 重试请求，待结算在链上确认后即可拿到结果。

对于需要自主为网页搜索付费、又没有预配凭据的 **AI agent** 来说，这是理想的方案。

<Info>
  x402 与 API 密钥访问相互独立。如果你的请求包含 `x-api-key` 或 `Authorization: Bearer` header，则会走常规的 API 密钥计费流程，完全绕过 x402。
</Info>

## 支持的端点 {#supported-endpoints}

| 端点          | 方法   | 描述                                                                           |
| ----------- | ---- | ---------------------------------------------------------------------------- |
| `/search`   | POST | 网页搜索，支持所有搜索类型 (`instant`、`auto`、`fast`、`deep`、`deep-lite`、`deep-reasoning`)  |
| `/contents` | POST | 通过 URL 或文档 ID 获取页面内容                                                         |

其余端点均**不**支持通过 x402 调用。

## 工作原理 {#how-it-works}

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/payments/x402/payment-flow.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a560d80bb84828e03dfacd61351e9fb" alt="x402 支付流程时序图：客户端向 server 发送请求，收到带 PAYMENT-REQUIRED header 的 402 响应，创建支付负载，携带 PAYMENT-SIGNATURE 重试，server 通过 facilitator 验证支付，执行任务，在链上完成结算，返回 200 响应，其中包含结果和 PAYMENT-RESPONSE" width="4224" height="2720" data-path="images/integrations/payments/x402/payment-flow.png" />
</Frame>

### 步骤 1：Discovery {#step-1-discovery}

在不带 API 密钥和支付 header 的情况下，向受支持的端点发送请求：

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "best machine learning frameworks", "numResults": 5}'
```

你会收到一个 `402` 响应，其中包含经过 base64 编码的 `PAYMENT-REQUIRED` header。解码后如下所示：

```json theme={null}
{
  "x402Version": 2,
  "resource": {
    "url": "https://api.exa.ai/search",
    "description": "Exa /search endpoint"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",
      "amount": "7000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "payTo": "0x...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2" }
    },
    {
      "scheme": "exact",
      "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      "amount": "7000",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "payTo": "...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2", "feePayer": "..." }
    }
  ]
}
```

`amount` 使用 USDC atomic 单位 (6 位小数) ，因此 `"7000"` = $0.007。
客户端可以使用它所支持的任意一个已声明的 `accepts` 条目进行支付。Solana 条目包含由 facilitator 提供的 fields，例如 `extra.feePayer`；构造支付时请使用 `PAYMENT-REQUIRED` header 中的原始条目。

### 步骤 2：支付并重试 {#step-2-pay-and-retry}

使用你的 wallet 对支付进行签名，然后重新发送请求，并附上 `PAYMENT-SIGNATURE` header，其中包含经 base64 编码的支付负载。x402 客户端 SDK 会自动完成这一过程。

### 第 3 步：结算 {#step-3-settlement}

Exa 会通过 facilitator 验证你的支付签名，然后在处理请求的**同时并行**启动链上结算。响应会一直挂起，直到结算确认完成。成功后，你将收到：

* HTTP `200` 及返回结果
* 一个 `PAYMENT-RESPONSE` header，其中包含结算回执 (base64 编码) ，内含链上交易哈希

如果结算失败，你会收到 `402`，并同时附带 `PAYMENT-RESPONSE` (错误详情) 和 `PAYMENT-REQUIRED` (便于重试) 。

## 定价 {#pricing}

x402 采用与 API 密钥计费相同的打包定价。价格会根据你的请求参数预先计算，而非依据实际返回的结果。

### Search (`/search`) {#search-search}

| 搜索类型                    | 基础价格 (最多 10 条结果)  | 超出 10 条的每条结果   |
| ----------------------- | ----------------- | -------------- |
| `instant`、`auto`、`fast` | $0.007 / 请求       | 不适用 (上限 10 条)  |
| `deep-lite`             | $0.012 / 请求       | 不适用 (上限 10 条)  |
| `deep`                  | $0.012 / 请求       | 不适用 (上限 10 条)  |
| `deep-reasoning`        | $0.015 / 请求       | 不适用 (上限 10 条)  |

添加 `contents.summary` 需额外支付 **每条结果 $0.001**。

<Warning>
  x402 请求的结果数上限为 **10 条**。如果请求超过 10 条，`numResults` 会被静默截断为 10，并按 10 条结果计费。
</Warning>

### Contents (`/contents`) {#contents-contents}

每种内容类型均按页面/URL 计费：

| 内容类型         | 每页价格   |
| ------------ | ------ |
| `text`       | $0.001 |
| `highlights` | $0.001 |
| `summary`    | $0.001 |

如果请求中未指定任何内容类型 (没有 `text`、`highlights` 或 `summary`) ，则默认启用 `text`。

### 示例 {#examples}

| 请求                                     | 价格     | USDC atomic |
| -------------------------------------- | ------ | ----------- |
| `/search`，10 条结果，`type: "auto"`        | $0.007 | 7000        |
| `/search`，5 条结果，`type: "fast"`         | $0.007 | 7000        |
| `/search`，3 条结果 + 摘要，`type: "auto"`    | $0.010 | 10000       |
| `/search`，10 条结果，`type: "deep-lite"`   | $0.012 | 12000       |
| `/search`，10 条结果，`type: "deep"`        | $0.012 | 12000       |
| `/contents`，2 个 URL，`text: true`       | $0.002 | 2000        |
| `/contents`，1 个 URL，`text` + `summary` | $0.002 | 2000        |

## 快速开始 {#quickstart}

### 安装依赖 {#install-dependencies}

<CodeGroup>
  ```bash JavaScript theme={null}
  npm install @x402/fetch @x402/core @x402/evm viem
  # 如需 Solana 支持，还需安装：
  npm install @x402/svm @solana/kit @scure/base
  ```

  ```bash Python theme={null}
  pip install "x402[requests,evm]"
  # 如需 Solana 支持，还需安装：
  pip install "x402[svm]" "solana<0.40"
  ```
</CodeGroup>

<Note>
  使用 cURL 无需安装任何依赖，但需要手动处理 402 挑战和支付签名。在 production 环境中建议使用 SDK 方式。
</Note>

<Tip>
  不想自己管理私钥？[Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) 为 AI agent 提供基于 TEE 隔离的密钥管理，你的 agent 始终不会接触到私钥。该 wallet 兼容 viem，可直接搭配 `@x402/fetch` 使用。
</Tip>

### 发起一次付费 search 请求 {#make-a-paid-search-request}

<CodeGroup>
  ```typescript JavaScript theme={null}
  import { wrapFetchWithPayment } from "@x402/fetch";
  import { x402Client, x402HTTPClient } from "@x402/core/client";
  import { ExactEvmScheme } from "@x402/evm/exact/client";
  // 如需支持 Solana，还需导入：
  // import { ExactSvmScheme } from "@x402/svm/exact/client";
  import { privateKeyToAccount } from "viem/accounts";

  const signer = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(signer));
  // 若希望客户端使用 Solana 的 accept 条目（例如
  // `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`），请同时注册 Solana 签名器：
  // client.register("solana:*", new ExactSvmScheme(svmSigner));
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  const response = await fetchWithPayment("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);

  // 查看结算回执
  const httpClient = new x402HTTPClient(client);
  const receipt = httpClient.getPaymentSettleResponse(
    (name) => response.headers.get(name)
  );
  console.log("Transaction:", receipt?.transaction);
  ```

  ```python Python theme={null}
  import os
  import requests
  from eth_account import Account
  from x402 import x402ClientSync
  from x402.http.clients import wrapRequestsWithPayment
  from x402.mechanisms.evm.exact import register_exact_evm_client
  from x402.mechanisms.evm.signers import EthAccountSigner

  account = Account.from_key(os.environ["WALLET_PRIVATE_KEY"])
  client = x402ClientSync()
  register_exact_evm_client(
      client,
      EthAccountSigner(account),
      networks="eip155:*",
  )
  session = wrapRequestsWithPayment(requests.Session(), client)

  response = session.post("https://api.exa.ai/search", json={
      "query": "best machine learning frameworks",
      "numResults": 5,
  })

  data = response.json()
  for result in data["results"]:
      print(result["url"], result["title"])
  print("Payment response:", response.headers.get("PAYMENT-RESPONSE"))
  ```

  ```bash cURL theme={null}
  # 第 1 步：discovery，获取定价信息
  curl -s -o /dev/null -w "%{http_code}" -D - \
    -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # 返回 402，PAYMENT-REQUIRED header 中包含 base64 编码的定价信息

  # 第 2 步：用你的 wallet 为支付签名（建议借助 SDK 完成）
  # 第 3 步：带上支付签名重试
  curl -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "PAYMENT-SIGNATURE: <base64-encoded-payment>" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # 返回 200，包含结果以及 PAYMENT-RESPONSE header（结算回执）
  ```
</CodeGroup>

<Info>
  cURL 需要手动完成支付签名。在 production 环境中，请使用 JavaScript 或 Python SDK，它们会自动处理完整的 402 &gt; 签名 &gt; 重试流程。
</Info>

### Discovery 模式 (无需 wallet) {#discovery-mode-no-wallet-needed}

发送未认证的请求即可探测定价，无需 wallet：

<CodeGroup>
  ```typescript JavaScript theme={null}
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "test query", numResults: 3 }),
  });

  // res.status === 402
  const paymentRequired = JSON.parse(
    atob(res.headers.get("PAYMENT-REQUIRED")!)
  );
  console.log(
    paymentRequired.accepts.map(({ network, amount }) => ({
      network,
      amount,
    }))
  );
  ```

  ```python Python theme={null}
  import base64, json, requests

  res = requests.post("https://api.exa.ai/search", json={
      "query": "test query",
      "numResults": 3,
  })

  # res.status_code == 402
  pricing = json.loads(base64.b64decode(res.headers["PAYMENT-REQUIRED"]))
  print([(accept["network"], accept["amount"]) for accept in pricing["accepts"]])
  ```

  ```bash cURL theme={null}
  curl -s -D - -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "test query", "numResults": 3}'
  # 在 402 响应中查找 PAYMENT-REQUIRED header
  # 解码：echo "<header-value>" | base64 -d
  ```
</CodeGroup>

## 支付网络 {#payment-networks}

Exa 会在 `accepts` 数组中列出当前支持的所有网络。请选择与你的 wallet 以及已注册的 x402 客户端方案相匹配的条目。

| 网络             | 标识符                                       | Token | 资产                                             |
| -------------- | ----------------------------------------- | ----- | ---------------------------------------------- |
| Base (以太坊 L2)  | `eip155:8453`                             | USDC  | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`   |
| Solana mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC  | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

两者均使用 6 位小数精度的 USDC (`1000000` = $1.00) ，并通过 x402 facilitator 完成 on-chain 结算。

## 速率限制 {#rate-limits}

x402 有自己的速率限制，与 API 密钥的限制相互独立：

| 限制               | 阈值       | 时间窗口 |
| ---------------- | -------- | ---- |
| 未付费发现请求 (按 IP)   | 5 次请求    | 60 秒 |
| 付费请求 (按 wallet)  | 10 次请求/秒 | 1 秒  |

同一 IP 在 60 秒内发起 5 次未认证的 `402` 发现请求后，后续请求将返回 `429 Too Many Requests`。成功发起一次付费请求会使该计数器减一。

按 wallet 的 QPS 限制适用于来自同一 wallet 地址的所有付费请求。

## Header 参考 {#headers-reference}

### 请求 header {#request-headers}

| Header              | 说明                        |
| ------------------- | ------------------------- |
| `PAYMENT-SIGNATURE` | Base64 编码的支付负载 (x402 v2)  |
| `payment-signature` | 别名 (同样支持)                 |
| `x-payment`         | 旧版别名 (兼容 v1)              |

### 响应 header {#response-headers}

| Header             | 出现时机                    | 说明                                        |
| ------------------ | ----------------------- | ----------------------------------------- |
| `PAYMENT-REQUIRED` | `402` 响应                | Base64 编码的 `PaymentRequired` 对象，包含定价和支付说明 |
| `PAYMENT-RESPONSE` | `200` 或 `402` (支付尝试之后)  | Base64 编码的结算结果，包含交易哈希或错误信息                |

## 错误码 {#error-codes}

| 状态    | Tag                        | 说明                                      |
| ----- | -------------------------- | --------------------------------------- |
| `402` | `X402_PAYMENT_REQUIRED`    | 未提供支付。`PAYMENT-REQUIRED` header 中包含定价信息 |
| `402` | `X402_VERIFICATION_FAILED` | 支付签名未通过 facilitator 验证                  |
| `400` | `X402_INVALID_SIGNATURE`   | 支付签名格式有误或无法解析                           |
| `429` | `X402_TOO_MANY_UNPAID`     | 来自该 IP 的未付费发现请求过多                       |
| `429` | `X402_WALLET_RATE_LIMITED` | wallet 超过每秒 10 个请求的限制                   |
| `500` | `X402_INTERNAL_ERROR`      | 生成支付要求时发生服务端错误                          |

## FAQ {#faq}

<AccordionGroup>
  <Accordion title="可以同时使用 x402 和 API 密钥吗？">
    如果请求中包含 `x-api-key` header 或 `Authorization: Bearer` token，则优先走 API 密钥流程，x402 会被跳过。两者不能叠加，每个请求只能二选一。
  </Accordion>

  <Accordion title="如果请求已处理完成但结算失败，会怎样？">
    响应会被拦截。你会收到 `402`，其中同时包含 `PAYMENT-RESPONSE` (内含错误信息) 和 `PAYMENT-REQUIRED` (便于客户端重试) 。在结算成功之前，不会返回任何结果。
  </Accordion>

  <Accordion title="为什么 numResults 上限是 10？">
    x402 请求限制每次 search 最多返回 10 条结果。如需更多结果，请改用付费 plan 下的 API 密钥流程。
  </Accordion>

  <Accordion title="支持哪些 wallet？">
    任何能在 Base 上签署 EIP-712 类型化数据的 EVM 兼容 wallet，或 x402 SVM 客户端为 `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` 支持的 Solana wallet。x402 SDK 支持 `viem`、`ethers`、Coinbase Wallet 签名器以及 Solana SVM 签名器。对于基于 EVM 的 AI agent，[Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management) 提供 TEE 隔离的密钥管理，让 agent 无需直接接触原始私钥。
  </Accordion>
</AccordionGroup>

## 资源 {#resources}

* [x402 协议文档](https://docs.x402.org)：完整的协议规范
* [x402 GitHub](https://github.com/coinbase/x402)：开源 SDK 与示例
* [npm 上的 @x402/fetch](https://www.npmjs.com/package/@x402/fetch)：用于自动处理支付的 fetch 封装
* [npm 上的 @x402/svm](https://www.npmjs.com/package/@x402/svm)：Solana/SVM exact 支付支持
* [Exa Search API 指南](/zh/docs/search/quickstart)：完整的搜索参数参考
* [Exa Contents API 指南](/zh/docs/contents/quickstart)：完整的 contents 参数参考