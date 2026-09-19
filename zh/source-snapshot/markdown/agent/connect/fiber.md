> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件查看所有可用页面。

<div id="fiberai">
  # Fiber.ai
</div>

> 在 Fiber.ai 的 B2B 数据库中搜索公司、人员和 LinkedIn 资料。

[Fiber.ai](https://fiber.ai) 是一个 B2B 数据平台，收录了 4000 万+ 公司、8.5 亿+ 人员和
3000 万+ 职位的最新数据。你可以搜索实时的公司、人员和职位数据，并用工作邮箱、个人邮箱和
电话号码补全不完整的记录。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `fiber` 附加到
[Exa Agent](/zh/docs/agent/quickstart) 运行中，Agent 就会在执行 Exa 网页搜索的同时查询
Fiber.ai。

<div id="use-it-for">
  ## 适用场景
</div>

* 通过工作邮箱或个人邮箱反查对应人员，或补全不完整的公司/人员记录，从而清理
  CRM 数据。
* 实时追踪 LinkedIn 动态信号：职位变动、晋升、入职新岗位、
  团队人数变化以及融资情况。
* 在 LinkedIn、X、Instagram、TikTok、Reddit 和
  YouTube 上查找相关帖子，抓取其评论和互动数据，再补全作者的
  联系方式。
* 在 4000 万多家公司和 8.5 亿多人中进行检索，并为潜在客户补全
  工作邮箱、个人邮箱和电话号码。

<div id="provider-id">
  ## Provider ID
</div>

在 `dataSources` 中使用此值：

```text theme={null}
fiber
```

<div id="pricing">
  ## 定价
</div>

Fiber.ai 按积分计费，单价为 `$0.02 / credit`，每次调用按 Fiber 为该次调用上报的积分数扣费：

| 操作          | 积分                 |
| ----------- | ------------------ |
| Search      | 2 + 每返回一条结果加 1     |
| 公司查找        | 每返回一个候选项约 ~2       |
| 人员查找 / 邮箱反查 | 2                  |
| 联系方式获取      | 2 (工作邮箱) – 5 (电话)  |

未匹配到结果 (或 Fiber 已退费) 的调用不收费。参数选择会影响价格：公司查找的 `numResults` 决定你要为多少个候选项付费，而 search 的返回结果数量是其成本的主要决定因素。

<div id="example">
  ## 示例
</div>

构建一份 B2B 潜客名单，收录位于纽约、员工规模 50–200 人的 A 轮金融科技公司。

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

<div id="pairs-well-with">
  ## 搭配使用效果更佳
</div>

* [Similarweb](/zh/docs/agent/connect/similarweb)：评估潜在客户的网络影响力及其竞争对手情况。
* [Baselayer](/zh/docs/agent/connect/baselayer)：核实入围美国企业的高管与注册信息。
* [Particle](/zh/docs/agent/connect/particle)：了解播客中如何谈论某家公司或某位高管。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="将其附加到运行" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始涵盖 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多附加五个合作伙伴，并设计好 query，让每个提供方都能被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制投入程度与成本。
  </Card>

  <Card title="获取 API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建 key" arrow="true">
    在仪表板中创建一个 key，即可原样运行本页示例。新账户附赠免费积分。
  </Card>
</Columns>