> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="similarweb">
  # Similarweb
</div>

> 获取网站流量预估、全球排名和竞争对手发现。

[Similarweb](https://www.similarweb.com) 是数字市场情报领域的领先数据来源。它对数百万网站和应用的流量及互动情况进行建模，涵盖预估访问量、流量来源、受众画像，以及任意域名所处的竞争格局。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `similarweb` 附加到 [Exa Agent](/zh/docs/agent/quickstart) 运行中，agent 便会在执行 Exa 网页搜索的同时查询 Similarweb。

<div id="use-it-for">
  ## 适用场景
</div>

* 将某家公司的网站流量与用户参与度与同行进行对标。
* 梳理某个域名的竞争对手以及受众重叠的站点。
* 估算市场规模，并按数字足迹筛选公司。
* 用真实行为数据丰富公司研究与行业品类研究。

<div id="provider-id">
  ## 数据提供方 ID
</div>

在 `dataSources` 中使用此值：

```text theme={null}
similarweb
```

<div id="pricing">
  ## 定价
</div>

Similarweb 按数据积分计费，单价为 `$0.30 / credit`，每次调用按 Similarweb 报告的积分数扣费。积分数随返回的数据量增长——大致是每个数据点 (指标 × 行 × 月份) 一个积分——因此一次调用的价格由其参数决定：

| 工具       | 积分                                        |
| -------- | ----------------------------------------- |
| 流量与排名    | 每请求一个月最多 7 (1–2 个月)                       |
| 相似站点     | 每返回一个站点 3 (1–5 个站点)                       |
| 流量来源     | 10                                        |
| 主要引荐来源   | 每返回一个引荐来源 3 (1–5 个)                       |
| 主要国家/地区  | 每返回一个国家/地区 3 (1–5 个)                      |
| 热门页面     | 每返回一个页面 2 (1–7 个)                         |
| 热门关键词    | 1–10 (约每 100 个关键词数据点 1 个积分；50 个关键词约为 ~7)  |
| 关键词概览    | 1–2                                       |
| 受众人口统计   | 8                                         |
| 受众重叠     | 每个域名组合 2 (2–3 个域名：6–14)                   |
| 技术栈      | 10                                        |
| 按类别的热门站点 | 每返回一个站点 1 (1–10 个)                        |

没有返回任何数据的调用 (未知或低流量域名、无搜索量的关键词) 不收费。`numResults` 和 `months` 决定了你要为多少数据点付费，因此请在满足任务需要的前提下尽量取小值。

<div id="example">
  ## 示例
</div>

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

<div id="pairs-well-with">
  ## 搭配使用
</div>

* [Fiber.ai](/zh/docs/agent/connect/fiber)：将发现的竞争对手转化为信息丰富的公司档案。
* [Affiliate.com](/zh/docs/agent/connect/affiliatecom)：在推荐某商家的产品前，先评估其覆盖范围。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="附加到运行中" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速入门" arrow="true">
    Exa Connect 快速入门介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个数据提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多附加五个合作伙伴，并设计好 query，让每个都能被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制投入程度与成本。
  </Card>

  <Card title="获取 API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建 key" arrow="true">
    在控制台中创建一个 key，即可直接运行本页的示例。新账户会获赠免费积分。
  </Card>
</Columns>