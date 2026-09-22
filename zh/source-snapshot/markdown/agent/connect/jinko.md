> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

<div id="jinko">
  # Jinko
</div>

> 提供实时定价的航班与酒店搜索。

[Jinko](https://gojinko.com) 是一个旅行搜索平台，提供带实时定价的航班和酒店搜索。你可以按航线和日期搜索实时航班报价，为某个目的地或指定酒店查询房型与费率，还能探索从你的出发机场可以抵达的目的地。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `jinko` 接入 [Exa Agent](/zh/docs/agent/quickstart) 运行，agent 便会在使用 Exa 网页搜索的同时查询 Jinko。

<div id="use-it-for">
  ## 适用场景
</div>

* 搜索指定航线和日期的实时航班报价，包含票价、行李额和改签政策。
* 查找目的地的酒店及其实时房间费率，或对特定酒店重新比价。
* 在不同日期区间、舱位等级和预算范围内发掘目的地与灵活出行日期。

<div id="provider-id">
  ## 提供方 ID
</div>

在 `dataSources` 中使用此值：

```text theme={null}
jinko
```

<div id="example">
  ## 示例
</div>

查找 3 月可从纽约出发、往返票价低于 $400 的海滩目的地。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find beach destinations reachable from New York for under $400 round-trip in March.",
      data_sources=[{"provider": "jinko"}],
      output_schema={
          "type": "object",
          "required": ["destinations"],
          "properties": {
              "destinations": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["city", "iataCode", "lowestFare"],
                      "properties": {
                          "city": {"type": "string"},
                          "iataCode": {"type": "string"},
                          "lowestFare": {"type": "number", "description": "round-trip fare in USD"},
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
    query: "Find beach destinations reachable from New York for under $400 round-trip in March.",
    dataSources: [{ provider: "jinko" }],
    outputSchema: {
      type: "object",
      required: ["destinations"],
      properties: {
        destinations: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["city", "iataCode", "lowestFare"],
            properties: {
              city: { type: "string" },
              iataCode: { type: "string" },
              lowestFare: { type: "number", description: "round-trip fare in USD" },
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
      "query": "Find beach destinations reachable from New York for under $400 round-trip in March.",
      "dataSources": [{ "provider": "jinko" }],
      "outputSchema": {
        "type": "object",
        "required": ["destinations"],
        "properties": {
          "destinations": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["city", "iataCode", "lowestFare"],
              "properties": {
                "city": { "type": "string" },
                "iataCode": { "type": "string" },
                "lowestFare": { "type": "number", "description": "round-trip fare in USD" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 搭配使用效果更佳
</div>

* [Similarweb](/zh/docs/agent/connect/similarweb)：研究某个目的地背后的旅游网站与预订平台。
* [Particle](/zh/docs/agent/connect/particle)：获取某地的近期报道与旅行评论。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="附加到运行" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多接入五个合作伙伴，并精心设计 query，让每个合作伙伴都能被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制 effort 与费用。
  </Card>

  <Card title="获取 API 密钥" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建密钥" arrow="true">
    在控制台中创建密钥，即可直接运行本页示例。新账户可获得免费积分。
  </Card>
</Columns>