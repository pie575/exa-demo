> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="baselayer">
  # Baselayer
</div>

> 验证美国企业并获取 KYB 数据：高管、注册信息、风险评分。

[Baselayer](https://baselayer.com) 是一个“了解你的企业” (KYB) 平台，依据权威的注册与风险数据对美国实体进行验证。它可根据企业名称和地址定位企业，并返回完整档案：高管、州注册信息、实体结构以及验证状态。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `baselayer` 附加到 [Exa Agent](/zh/docs/agent/quickstart) 运行中，Agent 便会在执行 Exa 网页搜索的同时查询 Baselayer。

<div id="use-it-for">
  ## 适用场景
</div>

* KYB 准入审核与供应商/客户身份核验。
* 对高管、注册信息和实体结构进行尽职调查。
* 企业风险筛查与监控名单命中排查。

<div id="provider-id">
  ## Provider ID
</div>

在 `dataSources` 中使用此值：

```text theme={null}
baselayer
```

<div id="pricing">
  ## 定价
</div>

Baselayer 按订单计费，费率取决于具体操作及其参数：

| 操作                        | 价格                                          |
| ------------------------- | ------------------------------------------- |
| 企业搜索                      | `$1.00 / search`                            |
| 企业详情 / 高管 / 注册信息 / 高管反向查询 | 免费 (读取此前搜索的结果)                              |
| 留置权搜索                     | `$2.00 / state searched`                    |
| 诉讼搜索                      | `$1.00 / category (litigation, bankruptcy)` |
| 监控名单筛查                    | `$0.10 – $0.25 / list requested`            |
| 行业分类                      | `$0.35 / call`                              |
| 网站分析                      | `$0.35 / call`                              |
| 网络存在                      | `$0.15 – $0.35 / selected analysis`         |
| 国际企业搜索                    | `$4.00 / search`                            |

参数选择会影响价格：在两个州范围内执行留置权搜索的费用为 $4.00；对全部六个受支持名单进行监控名单筛查的费用为 $1.35；网络存在调用的费用则是所选各项分析之和 (若未选择任何分析，则按 Baselayer 的默认组合计算，即 NAICS 预测与网站分析) 。

<div id="example">
  ## 示例
</div>

验证一家企业，并获取其高管及注册状态信息。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
      data_sources=[{"provider": "baselayer"}],
      output_schema={
          "type": "object",
          "required": ["business"],
          "properties": {
              "business": {
                  "type": "object",
                  "required": ["name", "verified", "incorporationState", "officers"],
                  "properties": {
                      "name": {"type": "string"},
                      "verified": {"type": "boolean"},
                      "incorporationState": {"type": "string"},
                      "officers": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "required": ["name", "title"],
                              "properties": {
                                  "name": {"type": "string"},
                                  "title": {"type": "string"},
                              },
                          },
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
    query: "Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
    dataSources: [{ provider: "baselayer" }],
    outputSchema: {
      type: "object",
      required: ["business"],
      properties: {
        business: {
          type: "object",
          required: ["name", "verified", "incorporationState", "officers"],
          properties: {
            name: { type: "string" },
            verified: { type: "boolean" },
            incorporationState: { type: "string" },
            officers: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "title"],
                properties: {
                  name: { type: "string" },
                  title: { type: "string" },
                },
              },
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
      "query": "Verify the business Stripe, Inc. in San Francisco, CA and return its officers and registration status.",
      "dataSources": [{ "provider": "baselayer" }],
      "outputSchema": {
        "type": "object",
        "required": ["business"],
        "properties": {
          "business": {
            "type": "object",
            "required": ["name", "verified", "incorporationState", "officers"],
            "properties": {
              "name": { "type": "string" },
              "verified": { "type": "boolean" },
              "incorporationState": { "type": "string" },
              "officers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["name", "title"],
                  "properties": {
                    "name": { "type": "string" },
                    "title": { "type": "string" }
                  }
                }
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

* [Fiber.ai](/zh/docs/agent/connect/fiber)：为已验证的企业补充公司属性、员工规模和联系人信息。
* [Financial Datasets](/zh/docs/agent/connect/financialdatasets)：为上市主体补充近期新闻报道。
* [Similarweb](/zh/docs/agent/connect/similarweb)：对已验证公司的网站流量和竞争对手进行对标分析。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="附加到运行中" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速入门" arrow="true">
    Exa Connect 快速入门介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个数据提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在单次运行中最多附加五个合作伙伴，并设计 query 让每一个都能被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制投入程度与成本。
  </Card>

  <Card title="获取 API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建 key" arrow="true">
    在仪表板中创建一个 key，即可直接运行本页示例。新账户可获得免费积分。
  </Card>
</Columns>