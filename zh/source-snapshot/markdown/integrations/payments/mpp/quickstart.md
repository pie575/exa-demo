> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索前，可通过该文件查看所有可用页面。

<div id="pay-with-mpp-tempo">
  # 使用 MPP (Tempo) 支付
</div>

> 无需 API 密钥即可调用 Exa 的 Search 和 Contents API，只需在 Tempo 上使用 USDC.e 按请求付费。

<div id="what-is-mpp">
  ## 什么是 MPP？
</div>

MPP (Machine Payments Protocol，机器支付协议) 是一个开放的、HTTP 原生的支付标准，基于 `402 Payment Required` 状态码构建。它让客户端能够按请求付费访问 API，支持多种支付方式，包括 [Tempo](https://tempo.xyz) 上的稳定币，无需账户、API 密钥或订阅。本页示例均使用 Tempo；Exa 目前在 Tempo mainnet 上以 USDC.e 结算 MPP 支付。

Exa 在两个端点上支持 MPP：**`/search`** 和 **`/contents`**。当你发送的请求不带 API 密钥或支付凭证时，Exa 会返回 `402`，并附带一个 `WWW-Authenticate: Payment` 挑战，说明价格和支付方式。你的客户端签署一笔支付，带上 `Authorization: Payment` 凭据重试请求，待支付在链上结算后即可获得结果。

这非常适合那些需要自主为网页搜索付费、又没有预配凭据的 **AI agents**。

<Info>
  MPP 与 API 密钥访问相互独立。如果请求中包含 `x-api-key` header，则走常规的 API 密钥计费流程，完全跳过 MPP。
</Info>

<div id="supported-endpoints">
  ## 支持的端点
</div>

| 端点          | 方法   | 说明                                                                           |
| ----------- | ---- | ---------------------------------------------------------------------------- |
| `/search`   | POST | 网页搜索，支持所有搜索类型 (`instant`、`auto`、`fast`、`deep`、`deep-lite`、`deep-reasoning`)  |
| `/contents` | POST | 通过 URL 或文档 ID 获取页面内容                                                         |

其他 Exa 端点*暂*不支持 MPP 支付。

<div id="get-started">
  ## 快速开始
</div>

你需要一个已充值 USDC.e 的 Tempo 兼容 wallet。在运行示例之前，请先导出该 wallet 的私钥：

```bash theme={null}
export WALLET_PRIVATE_KEY="0x..."
```

<div id="install-the-client">
  ### 安装客户端
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### 发起付费 search 请求
</div>

使用 MPP 客户端为 search 请求签名并提交支付：

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={"query": "best machine learning frameworks", "numResults": 5},
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

运行成功后，会打印 search 结果，以及包含链上交易哈希的 `Payment-Receipt` header。

<div id="pay-from-the-command-line">
  ## 通过命令行支付
</div>

如果你不想直接管理原始私钥，可以改用 Tempo Wallet CLI。`tempo wallet login` 会创建或连接 Tempo wallet，并授权一个本地访问密钥；新注册用户还可获赠免费的 MPP 积分。

<div id="install-and-authenticate">
  ### 安装并进行身份验证
</div>

```bash theme={null}
curl -fsSL https://tempo.xyz/install | bash
tempo add wallet
tempo add request
tempo wallet login
```

在没有本地浏览器的远程主机上，请使用 `tempo wallet login --no-browser`，然后在你的设备上打开命令输出的 URL，为 CLI 授权。

<div id="check-balances-and-credits">
  ### 查看余额和积分
</div>

```bash theme={null}
tempo wallet whoami
tempo wallet whoami --credits
```

<div id="make-a-paid-request">
  ### 发起付费请求
</div>

```bash theme={null}
tempo request --max-spend 1.00 https://api.exa.ai/search \
  --json '{"query": "Series A fintech companies", "numResults": 5}'
```

`tempo request` 会拦截 `402 Payment Required` 挑战，完成支付并自动重试请求。

完整的 CLI 参考请参阅 [Tempo Wallet CLI 文档](https://tempo.xyz/developers/docs/cli/wallet) 和 [`tempo request` 文档](https://tempo.xyz/developers/docs/cli/request)。

<div id="gas-fees">
  ## Gas 费用
</div>

Exa 会代付 Tempo 网络费用,并以 USDC.e 支付。你的 wallet 只需持有足够支付 API 费用的 USDC.e,无需持有 pathUSD 或其他 gas token 余额。你无需配置费用付款方,Exa 的支付质询与 MPP SDK 会自动处理代付。

<div id="pricing">
  ## 定价
</div>

MPP 采用与 API 密钥计费相同的打包定价。Exa 会在处理请求前，根据请求参数计算价格。

<div id="search">
  ### Search
</div>

| 搜索类型                    | 最多 10 条结果的价格 |
| ----------------------- | ------------ |
| `instant`、`auto`、`fast` | 每次请求 $0.007  |
| `deep-lite`、`deep`      | 每次请求 $0.012  |
| `deep-reasoning`        | 每次请求 $0.015  |

添加 `contents.summary` 需额外支付**每条结果 $0.001**。

<Warning>
  MPP search 最多返回 10 条结果。如果 `numResults` 大于 10，Exa 会按 10 处理，并按 10 条结果计费。如需更多结果，请使用 [API 密钥计费](/zh/docs/search/quickstart)。
</Warning>

<div id="contents">
  ### Contents
</div>

每请求一种内容类型，每个 URL 收费 $0.001：

| 内容类型         | 每个 URL 价格 |
| ------------ | --------- |
| `text`       | $0.001    |
| `highlights` | $0.001    |
| `summary`    | $0.001    |

如果你未请求 `text`、`highlights` 或 `summary`，Exa 会默认启用 `text`。

<div id="pricing-examples">
  ### 定价示例
</div>

| 请求                                           | 价格     |
| -------------------------------------------- | ------ |
| `/search`，`type: "auto"`                     | $0.007 |
| `/search`，返回 3 条结果并包含 `contents.summary`     | $0.010 |
| `/search`，`type: "deep"`                     | $0.012 |
| `/contents`，获取 2 个 URL，`text: true`          | $0.002 |
| `/contents`，获取 1 个 URL，包含 `text` 和 `summary` | $0.002 |

<div id="how-the-payment-flow-works">
  ## 支付流程的工作原理
</div>

SDK 会自动完成该流程，但你也可以直接通过 HTTP 查看其细节：

1. 发送不带 API 密钥或支付凭证的请求。Exa 返回 `402`，并附带 `WWW-Authenticate: Payment` 挑战，其中包含价格、token、收款方、网络以及代付详情。
2. 对挑战进行签名，并使用 `Authorization: Payment <credential>` 重试。
3. Exa 在结算支付的同时处理该请求。结算确认后，Exa 返回结果并附带 `Payment-Receipt` header。如果结算失败，Exa 返回 `402` 和一个新的挑战，且不返回任何结果。

<div id="inspect-a-payment-challenge">
  ### 查看支付质询
</div>

无需 wallet 即可查看价格和支付详情：

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "numResults": 3}'
```

在 `402` 响应中查找 `WWW-Authenticate: Payment` header。未付费发现请求有速率限制，因此请将其用于调试，而不要用于轮询。

<div id="payment-reference">
  ## 支付参考
</div>

Exa 接受在 Tempo mainnet 上以 USDC.e 进行的 MPP 支付。

| 网络            | 标识符           | Token  | 资产                                           |
| ------------- | ------------- | ------ | -------------------------------------------- |
| Tempo mainnet | `eip155:4217` | USDC.e | `0x20c000000000000000000000b9537d11c60e8b50` |

USDC.e 精确到 6 位小数。挑战以原子单位表示价格，因此 `7000` 表示 $0.007，`1000000` 表示 $1.00。

<Note>
  Exa 在同一批端点上同时支持 MPP 和 [x402](/zh/docs/integrations/payments/x402/quickstart)。未认证的 `402` 响应中可以同时包含 MPP 的 `WWW-Authenticate: Payment` 挑战和 x402 的 `PAYMENT-REQUIRED` header。请根据客户端支持的支付协议使用相应的 header。
</Note>

<div id="headers">
  ### Headers
</div>

| Header                                | 方向       | 说明            |
| ------------------------------------- | -------- | ------------- |
| `Authorization: Payment <credential>` | 请求       | MPP 支付凭证      |
| `WWW-Authenticate: Payment`           | `402` 响应 | 该请求的价格与支付说明   |
| `Payment-Receipt`                     | 成功响应     | 结算回执，包含链上交易哈希 |

<div id="errors">
  ### 错误
</div>

| 状态    | 说明                     |
| ----- | ---------------------- |
| `402` | 支付凭证缺失或无效；响应中会包含一个新的挑战 |
| `402` | 支付金额与请求价格不符，或结算失败      |
| `429` | 该 IP 发送的未付费发现请求过多      |
| `429` | 该 wallet 超出了付费请求的速率限制  |

<div id="rate-limits">
  ### 速率限制
</div>

MPP 的速率限制与 x402 共用，与 API 密钥限制相互独立：

| 限制              | 阈值     | 时间窗口 |
| --------------- | ------ | ---- |
| 每个 IP 的未付费发现请求  | 5 个请求  | 60 秒 |
| 每个 wallet 的付费请求 | 10 个请求 | 1 秒  |

<div id="faq">
  ## 常见问题
</div>

<AccordionGroup>
  <Accordion title="我可以同时使用 MPP 和 API 密钥吗？">
    如果请求中包含 `x-api-key` header，则 API 密钥流程优先，MPP 会被绕过。两者不能叠加，每个请求只能二选一。
  </Accordion>

  <Accordion title="如果请求已处理但结算失败，会发生什么？">
    响应会被拦截。你会收到 `402`，并附带一个新的 `WWW-Authenticate: Payment` 挑战，以便客户端重试。在结算成功之前，不会返回任何结果。
  </Accordion>

  <Accordion title="支持哪些 wallet？">
    任何客户端 SDK 能够签名的 Tempo 兼容 EVM wallet：搭配 `mppx` 使用的 `viem` 账户 (TypeScript) ，或搭配 `pympp` 使用的 `eth-account` 密钥 (Python) 。对于 AI agents，请使用在 Tempo 上持有 USDC.e 余额的 wallet，以支付请求费用。
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 资源
</div>

* [MPP 协议文档](https://mpp.dev/protocol)：协议细节与认证格式
* [mppx 文档](https://mpp.dev/sdk/typescript)：MPP TypeScript SDK 参考
* [pympp 文档](https://mpp.dev/sdk/python)：MPP Python SDK 参考
* [Tempo](https://tempo.xyz)：Tempo 网络文档
* [使用 x402 支付](/zh/docs/integrations/payments/x402/quickstart)：通过 x402 为相同的端点付费
* [Exa Search API 指南](/zh/docs/search/quickstart)：完整的搜索参数参考
* [Exa Contents API 指南](/zh/docs/contents/quickstart)：完整的 contents 参数参考