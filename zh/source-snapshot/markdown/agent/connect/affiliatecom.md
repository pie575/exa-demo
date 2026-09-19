> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="affiliatecom">
  # Affiliate.com
</div>

> 跨商家和联盟网络搜索商品目录。

[Affiliate.com](https://affiliate.com) 将各商家和联盟网络的商品目录聚合成
一个可搜索的索引，提供实时价格、品牌以及商家直达链接。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 为 [Exa Agent](/zh/docs/agent/quickstart)
运行附加 `affiliate`，Agent 就会在 Exa 网页搜索的同时查询 Affiliate.com。

<div id="use-it-for">
  ## 适用场景
</div>

* 跨商家的商品发现与比价。
* 为购物助手和选购指南类内容提供支持。
* 在调研结果旁展示联盟营销链接。

<div id="provider-id">
  ## Provider ID
</div>

在 `dataSources` 中使用此值：

```text theme={null}
affiliate
```

<div id="example">
  ## 示例
</div>

查找售价低于 $300 的无线降噪耳机并比较价格。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      data_sources=[{"provider": "affiliate"}],
      output_schema={
          "type": "object",
          "required": ["products"],
          "properties": {
              "products": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "brand", "price", "merchant"],
                      "properties": {
                          "name": {"type": "string"},
                          "brand": {"type": "string"},
                          "price": {"type": "string", "description": "price with currency"},
                          "merchant": {"type": "string"},
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
    query: "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
    dataSources: [{ provider: "affiliate" }],
    outputSchema: {
      type: "object",
      required: ["products"],
      properties: {
        products: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "brand", "price", "merchant"],
            properties: {
              name: { type: "string" },
              brand: { type: "string" },
              price: { type: "string", description: "price with currency" },
              merchant: { type: "string" },
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
      "query": "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      "dataSources": [{ "provider": "affiliate" }],
      "outputSchema": {
        "type": "object",
        "required": ["products"],
        "properties": {
          "products": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "brand", "price", "merchant"],
              "properties": {
                "name": { "type": "string" },
                "brand": { "type": "string" },
                "price": { "type": "string", "description": "price with currency" },
                "merchant": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 推荐搭配使用
</div>

* [Similarweb](/zh/docs/agent/connect/similarweb)：在推荐商家前先评估其影响力覆盖。
* [Fiber.ai](/zh/docs/agent/connect/fiber)：调研商家或品牌背后的公司。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="附加到运行中" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多附加五个合作伙伴，并设计好 query，让每一个都能被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制投入程度与成本。
  </Card>

  <Card title="获取 API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建 key" arrow="true">
    在控制台中创建一个 key，即可原样运行本页示例。新账户会获赠免费积分。
  </Card>
</Columns>