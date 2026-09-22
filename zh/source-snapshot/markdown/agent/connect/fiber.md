> ## 文档索引 {#documentation-index}
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

# Fiber.ai {#fiberai}

> 在 Fiber.ai 的 B2B 数据库中搜索公司、人员和 LinkedIn 资料。

[Fiber.ai](https://fiber.ai) 是一个 B2B 数据平台，拥有 4000 万+ 公司、8.5 亿+ 人员和
3000 万+ 职位的实时数据。你可以搜索实时的公司、人员和职位数据，并用
工作邮箱、个人邮箱和电话号码来丰富不完整的记录。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `fiber` 接入
[Exa Agent](/zh/docs/agent/quickstart) 的运行，agent 便会在进行 Exa 网页搜索的同时查询
Fiber.ai。

## 适用场景 {#use-it-for}

* 通过工作邮箱或个人邮箱反查对应人员，或丰富不完整的公司/人员记录，从而清理 CRM 数据。
* 实时追踪 LinkedIn 动态信号：职位变动、晋升、入职新岗位、员工人数变化以及融资情况。
* 在 LinkedIn、X、Instagram、TikTok、Reddit 和 YouTube 上查找相关帖子，抓取评论与互动，
  再丰富作者的联系方式信息。
* 在 4000 万家以上公司和 8.5 亿以上人员中进行搜索，并为潜在客户丰富工作邮箱、
  个人邮箱和电话号码等信息。

## 提供方 ID {#provider-id}

在 `dataSources` 中使用此值：

```text theme={null}
fiber
```

## 定价 {#pricing}

Fiber.ai 按积分计费，`$0.02 / credit`，每次调用按 Fiber 上报的积分数收费：

| 操作          | 积分                 |
| ----------- | ------------------ |
| Search      | 2 + 每返回一条结果加 1     |
| 公司查询        | 每返回一个候选项约 2        |
| 人员查询 / 邮箱反查 | 2                  |
| 联系方式获取      | 2 (工作邮箱) – 5 (电话)  |

未匹配到结果的调用 (或 Fiber 已退款的调用) 不收费。参数选择会影响价格：公司查询的 `numResults` 决定你需要为多少个候选项付费，而搜索的费用主要取决于返回的结果数量。

## 示例 {#example}

构建一份 B2B 潜客名单：位于纽约、员工人数为 50–200 人的 A 轮金融科技公司。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
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
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
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
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## 搭配使用 {#pairs-well-with}

* [Similarweb](/zh/docs/agent/connect/similarweb)：评估潜在客户的网络影响力及其竞争对手。
* [Baselayer](/zh/docs/agent/connect/baselayer)：为入围的美国企业核实高管信息与注册登记。
* [Particle](/zh/docs/agent/connect/particle)：了解播客中对某家公司或某位高管的讨论。

## 后续步骤 {#next-steps}

<Columns cols={2}>
  <Card title="将其接入运行" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始涵盖 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多附加五个合作伙伴，并合理设计 query，让每个都能被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制 effort 与费用。
  </Card>

  <Card title="获取 API 密钥" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建密钥" arrow="true">
    在控制台中创建密钥，即可直接运行本页示例。新账户会获得免费积分。
  </Card>
</Columns>