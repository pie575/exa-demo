> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# Similarweb {#similarweb}

> 获取网站流量估算、全球排名和竞争对手发现。

[Similarweb](https://www.similarweb.com) 是数字市场情报的领先来源，对数百万网站和应用的流量与互动情况进行建模，涵盖预估访问量、流量来源、受众画像以及任一域名周边的竞争格局。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `similarweb` 附加到 [Exa Agent](/zh/docs/agent/quickstart) 运行中，agent 就会在 Exa 网页搜索之外同时查询 Similarweb。

## 适用场景 {#use-it-for}

* 将某家公司的网站流量与互动表现与同行进行对标。
* 梳理某个域名的竞争对手及受众重叠的站点。
* 依据数字足迹估算市场规模并筛选公司。
* 用真实的行为数据丰富公司与品类研究。

## 提供方 ID {#provider-id}

在 `dataSources` 中使用此值：

```text theme={null}
similarweb
```

## 定价 {#pricing}

Similarweb 按数据积分计费，`$0.30 / credit`，每次调用按 Similarweb 报告的积分数扣费。积分随返回的数据量增加——大致每个数据点 (指标 × 行 × 月) 消耗一个积分——因此一次调用的价格由其参数决定：

| Tool                  | 积分                                       |
| --------------------- | ---------------------------------------- |
| Traffic and rank      | 每请求一个月最多 7 个 (1–2 个月)                    |
| Similar sites         | 每返回一个站点 3 个 (1–5 个站点)                    |
| Traffic sources       | 10                                       |
| Top referrers         | 每返回一个引荐来源 3 个 (1–5)                      |
| Top countries         | 每返回一个国家/地区 3 个 (1–5)                     |
| Top pages             | 每返回一个页面 2 个 (1–7)                        |
| Top keywords          | 1–10 (约每 100 个关键词数据点 1 个；50 个关键词约 ~7 个)  |
| Keyword overview      | 1–2                                      |
| Audience demographics | 8                                        |
| Audience overlap      | 每个域名组合 2 个 (2–3 个域名：6–14)                |
| Technologies          | 10                                       |
| Top sites by category | 每返回一个站点 1 个 (1–10)                       |

未返回任何数据的调用 (未知或低流量域名、无搜索量的关键词) 不收费。`numResults` 和 `months` 决定你需要为多少数据点付费，因此应在满足任务需要的前提下尽量取小值。

## 示例 {#example}

查找 10 家快速增长的 B2B SaaS 公司及其预估网站流量。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      data_sources=[{"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "monthlyVisits"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
    dataSources: [{ provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "monthlyVisits"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              monthlyVisits: { type: "number", description: "from Similarweb" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      "dataSources": [{ "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "monthlyVisits"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "monthlyVisits": { "type": "number", "description": "from Similarweb" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## 搭配使用 {#pairs-well-with}

* [Fiber.ai](/zh/docs/agent/connect/fiber)：将发现的竞争对手转化为内容丰富的公司记录。
* [Affiliate.com](/zh/docs/agent/connect/affiliatecom)：在推荐某个商家的产品之前，先评估其影响力覆盖范围。

## 后续步骤 {#next-steps}

<Columns cols={2}>
  <Card title="附加到运行" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    单次运行最多可接入五个合作伙伴，并通过调整 query 让每个都被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制 effort 与费用。
  </Card>

  <Card title="获取 API 密钥" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建密钥" arrow="true">
    在控制台中创建密钥，即可直接运行本页示例。新账户可获得免费积分。
  </Card>
</Columns>