> ## 文档索引 {#documentation-index}
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件查看所有可用页面。

# Tempo MPP GTM 增强手册 {#tempo-mpp-gtm-enrichment-cookbook}

> 构建 GTM 增强工作流，通过 Tempo MPP 按每次 Exa search 和 页面内容 请求付费，无需 API 密钥。

使用本手册，在 Exa 的 `/search` 和 `/contents` 端点之上构建 GTM 增强 agent 或
pipeline，并通过 Machine Payments Protocol (MPP) 按请求付费。MPP 支持多种支付方式，
本文示例使用 [Tempo](https://tempo.xyz) 上的稳定币。无需月度订阅，无需
API 密钥，也不按席位定价：只需为 wallet 充值 USDC.e，在丰富潜在客户或公司数据的过程中按量付费。

<Info>
  MPP 目前仅支持 Exa 的 `/search` 和 `/contents` 端点。
  Agent API (`/agent/runs`) 和 `/answer` 需要 Exa API 密钥，走标准的
  API 密钥计费流程。
</Info>

## 你将构建什么 {#what-youll-build}

一个轻量级的增强 pipeline：给定一组公司名称或目标描述后，它会：

1. 使用 Exa `/search`，配合 `type: "deep"` 和 `outputSchema`，找到公司官方页面并提取关键元数据。
2. 对返回的 result 使用 `contents.highlights`，提取有关融资、总部、员工人数和产品的来源片段。
3. 为每条输入生成一条 CSV 或 JSON 格式的增强记录。

该模式适用于线索列表增强、客户调研和外呼个性化。由于它由独立的 `/search` 与 `/contents` 调用组成，每一步都可以通过 MPP 付费。

## 前置条件 {#prerequisites}

* 一个兼容 Tempo 的 wallet，并在 Tempo mainnet 上存有 **USDC.e**。
* 一种在运行时安全加载 wallet 私钥的方式 (见下文；切勿提交私钥，也不要将其暴露在源代码中) 。
* 已安装 `mppx` (TypeScript) 或 `pympp` (Python) 。

<Info>
  如果希望使用无需原始私钥的命令行方式，请使用 [Tempo Wallet CLI](/zh/docs/integrations/payments/mpp/quickstart#pay-from-the-command-line)。`tempo wallet login` 会创建或连接一个 wallet，新注册用户还可能获得免费的 MPP 积分。
</Info>

## MPP 设置 {#mpp-setup}

### 安装客户端 {#install-the-client}

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

### 安全地加载私钥 {#load-your-private-key-safely}

切勿硬编码私钥。下面的示例从运行时环境中读取 `WALLET_PRIVATE_KEY`，仅供本地开发使用。在 production 环境中，请通过 secrets manager 加载，例如 1Password、AWS Secrets Manager 或 HashiCorp Vault。

<CodeGroup>
  ```bash TypeScript theme={null}
  # 在你的 shell 或 CI secrets 存储中设置；切勿提交此值
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # 在你的 shell 或 CI secrets 存储中设置；切勿提交此值
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

### 发起一次付费 search 请求 {#make-a-paid-search-request}

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // 在 production 环境中，请从 secrets manager 加载该值，切勿提交原始值。
  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      numResults: 5,
      contents: { highlights: true },
    }),
  });

  const data = (await response.json()) as { results: { title: string; url: string }[] };
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      # 在 production 环境中，请从 secrets manager 加载该值，切勿提交原始值。
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": "Series A fintech companies with 50-200 employees",
                  "numResults": 5,
                  "contents": {"highlights": True},
              },
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

请求成功时，响应会返回 Exa 结果，并附带一个包含 on-chain 交易哈希的 `Payment-Receipt` header。

### 发起付费的页面内容请求 {#make-a-paid-contents-request}

<CodeGroup>
  ```typescript TypeScript theme={null}
  const contentsResponse = await mppx.fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: ["https://www.example.com"],
      text: true,
      summary: true,
    }),
  });

  const contentsData = (await contentsResponse.json()) as {
    results: { url: string; text?: string; summary?: string }[];
  };
  console.log(contentsData.results[0]);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/contents",
      json={
          "urls": ["https://www.example.com"],
          "text": True,
          "summary": True,
      },
  )
  print(response.json()["results"][0])
  ```
</CodeGroup>

## GTM 增强实践方案 {#gtm-enrichment-recipe}

### 增强公司列表 {#enrich-a-list-of-companies}

给定一份公司名称列表，为每家公司搜索其页面并提取结构化详情。

<CodeGroup>
  ```typescript TypeScript theme={null}
  interface CompanyEnrichment {
    name: string;
    url: string;
    title: string;
    industry?: string;
    headquarters?: string;
    funding?: string;
    summary?: string;
    highlights: string[];
  }

  async function enrichCompanies(names: string[]): Promise<CompanyEnrichment[]> {
    const enriched: CompanyEnrichment[] = [];

    for (const name of names) {
      const response = await mppx.fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${name} official company`,
          type: "deep",
          numResults: 1,
          contents: {
            highlights: { query: "funding, headquarters, employees, product" },
          },
          outputSchema: {
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  industry: { type: "string" },
                  headquarters: { type: "string" },
                  funding: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["name", "url"],
              },
            },
            required: ["company"],
          },
        }),
      });

      const data = (await response.json()) as {
        output?: { company?: CompanyEnrichment & { summary?: string } };
        results?: { highlights?: string[] }[];
      };
      const company = data.output?.company;
      const highlights = data.results?.[0]?.highlights?.slice(0, 3) ?? [];
      if (!company) continue;

      enriched.push({
        ...company,
        title: company.name,
        highlights,
      });
    }

    return enriched;
  }
  ```

  ```python Python theme={null}
  async def enrich_companies(names):
      enriched = []
      for name in names:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": f"{name} official company",
                  "type": "deep",
                  "numResults": 1,
                  "contents": {
                      "highlights": {"query": "funding, headquarters, employees, product"}
                  },
                  "outputSchema": {
                      "type": "object",
                      "properties": {
                          "company": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "industry": {"type": "string"},
                                  "headquarters": {"type": "string"},
                                  "funding": {"type": "string"},
                                  "summary": {"type": "string"},
                              },
                              "required": ["name", "url"],
                          }
                      },
                      "required": ["company"],
                  },
              },
          )
          data = response.json()
          company = data.get("output", {}).get("company")
          highlights = []
          if data.get("results"):
              highlights = data["results"][0].get("highlights", [])[:3]
          if not company:
              continue

          enriched.append({
              "name": company["name"],
              "url": company["url"],
              "title": company["name"],
              "industry": company.get("industry"),
              "headquarters": company.get("headquarters"),
              "funding": company.get("funding"),
              "summary": company.get("summary"),
              "highlights": highlights,
          })
      return enriched
  ```
</CodeGroup>

### 增强个人档案 {#enrich-a-person-profile}

本示例使用 `type: "deep"`、`contents.highlights` 和 `outputSchema` 来
调研某个人物并返回结构化档案。

<CodeGroup>
  ```typescript TypeScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Exa Labs founders contact and background",
      type: "deep",
      numResults: 5,
      contents: {
        highlights: { query: "email, title, education, work history, LinkedIn" },
      },
      outputSchema: {
        type: "object",
        properties: {
          people: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                linkedInUrl: { type: "string" },
                summary: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
        required: ["people"],
      },
    }),
  });

  const data = (await response.json()) as {
    output?: { people: { name: string; title?: string; company?: string }[] };
  };
  console.log(data.output?.people);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Exa Labs founders contact and background",
          "type": "deep",
          "numResults": 5,
          "contents": {
              "highlights": {"query": "email, title, education, work history, LinkedIn"}
          },
          "outputSchema": {
              "type": "object",
              "properties": {
                  "people": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "title": {"type": "string"},
                              "company": {"type": "string"},
                              "email": {"type": "string"},
                              "linkedInUrl": {"type": "string"},
                              "summary": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["people"],
          },
      },
  )

  print(response.json().get("output", {}).get("people"))
  ```
</CodeGroup>

<Note>
  这里用 `type: "deep"` 获得更深入的推理，并用 `outputSchema` 约束
  响应结构。深度搜索的价格为每次请求 $0.012，
  `contents.highlights` 每条结果额外收取 $0.001。
</Note>

### 结构化输出 {#structured-output}

如果你想要 JSON field 而不是纯文本，可在搜索请求中使用 `outputSchema`。Exa 会返回一个符合你 schema 结构的 `output` 对象。

<CodeGroup>
  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Series A fintech companies with 50-200 employees",
          "type": "deep-lite",
          "numResults": 5,
          "outputSchema": {
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "headcount": {"type": "string"},
                              "headquarters": {"type": "string"},
                              "fundingStage": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["companies"],
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      type: "deep-lite",
      numResults: 5,
      outputSchema: {
        type: "object",
        properties: {
          companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                headcount: { type: "string" },
                headquarters: { type: "string" },
                fundingStage: { type: "string" }
              },
              required: ["name"]
            }
          }
        },
        required: ["companies"]
      }
    })
  });
  ```
</CodeGroup>

<Note>
  `outputSchema` 配合 `deep-lite` 或 `deep` 搜索类型效果最佳。它会在 Exa 端增加一次
  LLM 调用，因此按 `deep-lite`/`deep` 计费。
</Note>

## 定价与限制 {#pricing-and-limits}

MPP 采用与 API 密钥计费相同的按请求定价。MPP 搜索请求
最多返回 10 条结果。

| 操作                                             | 价格            |
| ---------------------------------------------- | ------------- |
| `type` 为 `instant`、`auto` 或 `fast` 的 `/search` | 每次请求 $0.007   |
| `type` 为 `deep-lite` 或 `deep` 的 `/search`      | 每次请求 $0.012   |
| `type` 为 `deep-reasoning` 的 `/search`          | 每次请求 $0.015   |
| `contents.text`                                | 每个 URL $0.001 |
| `contents.highlights`                          | 每个 URL $0.001 |
| `contents.summary`                             | 每条结果 $0.001   |

完整参考请见 [使用 MPP 支付 (Tempo) ](/zh/docs/integrations/payments/mpp/quickstart)，
其中包含速率限制、网络详情和支付 header。

## Production 提示 {#production-tips}

* **只向 wallet 充值 USDC.e。** Exa 会代付 Tempo 网络手续费，因此 wallet
  无需单独准备 gas token。
* **处理 `402` 响应。** MPP SDK 会自动重试，但自定义客户端需在收到 `402` 时，
  依据 `WWW-Authenticate: Payment` 挑战发起重试。
* **缓存 `/contents` 结果。** 页面内容按 URL 计费。按 URL 缓存可避免为同一家公司的页面重复付费。
* **注意 10 条结果上限。** MPP search 会将 `numResults` 限制为 10。
* **切勿提交私钥。** 请从 secrets manager 加载 `WALLET_PRIVATE_KEY`，不要放进源代码管理系统。

## 常见问题 {#faq}

<AccordionGroup>
  <Accordion title="可以在 Exa Agent API 中使用 MPP 吗？">
    不可以。在 Exa 代码库中，MPP 仅接入了 `/search` 和 `/contents`。
    `/agent/runs` 和 `/answer` 需要 Exa API 密钥，并采用标准的 API 密钥
    计费方式。
  </Accordion>

  <Accordion title="可以在同一个请求中同时使用 MPP 和 Exa API 密钥吗？">
    不可以。如果请求中包含 `x-api-key` 或 `Authorization: Bearer`，则以 API
    密钥流程优先，MPP 会被跳过。
  </Accordion>

  <Accordion title="如果 MPP 结算失败会怎样？">
    Exa 会返回 `402`，并附带一个新的 `WWW-Authenticate: Payment` 挑战，不返回
    任何结果。客户端可以发起新的支付后重试。结算成功之前不会返回任何结果。
  </Accordion>

  <Accordion title="每个环境都需要单独的 Tempo wallet 吗？">
    可以复用同一个 wallet，但我们建议 development 和 production 分别使用独立的
    wallet。单个 wallet 的 QPS 限制为 10 次/秒，涵盖该 wallet 发出的所有请求。
  </Accordion>
</AccordionGroup>

## 下一步 {#next-steps}

* [使用 MPP (Tempo) 支付](/zh/docs/integrations/payments/mpp/quickstart)：完整的 MPP 参考文档
* [Exa Search API 指南](/zh/docs/search/quickstart)：搜索参数参考
* [Exa Contents API 指南](/zh/docs/contents/quickstart)：页面内容参数参考
* [Tempo MPP 文档](https://mpp.dev/protocol)：协议与 SDK 详情