> ## 文档索引 {#documentation-index}
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

# Baselayer {#baselayer}

> 验证美国企业并获取 KYB 数据：高管信息、注册登记、风险评分。

[Baselayer](https://baselayer.com) 是一个企业尽职调查 (KYB) 平台，
可依据权威的注册登记与风险数据对美国实体进行验证。它
可通过名称和地址定位企业，并返回完整档案：高管信息、
各州注册登记、实体结构以及验证状态。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `baselayer` 附加到
[Exa Agent](/zh/docs/agent/quickstart) 运行中，agent 便会在进行 Exa 网页搜索的同时查询
Baselayer。

## 适用场景 {#use-it-for}

* KYB 入驻以及厂商/客户验证。
* 针对高管信息、注册登记和实体结构的尽职调查。
* 对企业进行风险与 Watchlist 命中筛查。

## 提供方 ID {#provider-id}

在 `dataSources` 中使用此值：

```text theme={null}
baselayer
```

## 定价 {#pricing}

Baselayer 按订单计费，费率取决于具体操作及其参数：

| 操作                            | 价格                                          |
| ----------------------------- | ------------------------------------------- |
| 企业搜索                          | `$1.00 / search`                            |
| 企业查询 / 高管信息 / 注册登记 / 高管信息反向查询 | 免费 (读取先前搜索的结果)                              |
| 留置权搜索                         | `$2.00 / state searched`                    |
| 诉讼搜索                          | `$1.00 / category (litigation, bankruptcy)` |
| Watchlist 筛查                  | `$0.10 – $0.25 / list requested`            |
| 行业分类                          | `$0.35 / call`                              |
| 网站分析                          | `$0.35 / call`                              |
| 网络存在情况                        | `$0.15 – $0.35 / selected analysis`         |
| 国际企业搜索                        | `$4.00 / search`                            |

参数的选择会影响价格：在两个州范围内进行留置权搜索的费用为 $4.00，对全部六个受支持列表进行 Watchlist 筛查的费用为 $1.35，而网络存在情况调用的费用为所选各项分析之和 (若未选择任何项，则按 Baselayer 的默认组合计算，即 NAICS 预测与网站分析) 。

## 示例 {#example}

验证一家企业，并获取其高管信息与注册登记详情。

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

## 搭配使用效果更佳 {#pairs-well-with}

* [Fiber.ai](/zh/docs/agent/connect/fiber)：用企业属性、员工人数和联系人信息丰富已验证的企业。
* [Financial Datasets](/zh/docs/agent/connect/financialdatasets)：为上市主体添加近期新闻报道。
* [Similarweb](/zh/docs/agent/connect/similarweb)：对已验证公司的网站流量和竞争对手进行对标分析。

## 后续步骤 {#next-steps}

<Columns cols={2}>
  <Card title="将其附加到运行" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始涵盖 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    单次运行最多可接入五个合作伙伴，并通过设计 query 让每个都被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制 effort 与费用。
  </Card>

  <Card title="获取 API 密钥" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建密钥" arrow="true">
    在控制台中创建密钥，即可直接运行本页示例。新账户会赠送免费积分。
  </Card>
</Columns>