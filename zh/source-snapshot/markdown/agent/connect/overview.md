> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

<div id="exa-connect">
  # Exa Connect
</div>

> 让你的 Exa Agent 在一次运行中实时访问优质数据合作伙伴，并同时使用 Exa 网页搜索。

Exa Connect 将优质数据合作伙伴集成到 Exa Agent 的 loop 中。为一次运行接入某个
提供方后，Exa Agent 会在网页搜索之外同时查询该合作伙伴的数据库，并将结果
整合为一个有据可依的结构化答案。

初次接触 agent 运行？建议先阅读 [Exa Agent 指南](/zh/docs/agent/quickstart)，
再回来接入数据合作伙伴。

<Tip>
  Exa Agent 已经可以搜索完整的[数据索引](/zh/docs/search/data/overview)，与 Search API 所用的新闻、代码、公司和人物数据源相同。Exa Connect 则在此基础上新增了优质合作伙伴数据库。
</Tip>

<Tip>
  更习惯用 MCP？[Exa MCP](/zh/docs/get-started/exa-mcp#exa-agent) 中已提供 Exa Agent 和 [Exa Connect](/zh/docs/agent/connect/overview)。启用 `tools=agent_run`，即可在 Claude、Cursor 等 MCP 客户端中运行多步研究、列表构建、增强和结构化输出。
</Tip>

<div id="why-exa-connect">
  ## 为什么选择 Exa Connect
</div>

* **无需单独集成即可获取优质数据。** 不用签合同，也不用接入 SDK，就能访问合作伙伴数据。你只需调用一个 Exa API。
* **繁琐的对接工作交给 Exa。** 提供方认证、工具选择、重试和结果排序都由我们负责。
* **由 Exa Agent 选择数据来源。** 当你的 `outputSchema` 要求
  「来自 Similarweb 的月访问量」或「经过验证的高管信息」时，Exa Agent 会调用
  对应的合作伙伴工具，而不是从网页中猜测。
* **一次运行即可同时使用索引与合作伙伴数据。** Connect 构建于 Exa 索引之上。
  Exa Agent 会扬长避短地使用各个来源，并为结果标注引用。

<div id="how-it-works">
  ## 工作原理
</div>

1. 在 [`POST /agent/runs`](/zh/docs/reference/agent-api/create-a-run) 的 `dataSources` 数组中**附加**一个或多个提供方。
2. Exa Agent 会根据你的 query 和 `outputSchema`，为每一步**选择合适的工具**：合作伙伴数据或 Exa 网页搜索。
3. 合作伙伴返回的结果会与网页研究结果**融合**成结构化输出，并附带来源。

<div id="pricing">
  ## 定价
</div>

<Note>
  Exa Connect 的定价在标准 [Agent 运行定价](/zh/docs/agent/quickstart#pricing)之上叠加计费。
  你需要支付常规的 Agent 计算与 search 费用，外加每次 Exa Connect 工具调用产生的提供方调用费用。
</Note>

| 提供方                                                  | 价格                                            |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/zh/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/zh/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/zh/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/zh/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / call`                               |
| Particle                                             | `$0.015 / call`                               |
| Financial Datasets                                   | `$0.01 / call`                                |
| Jinko                                                | `$0.005 / call`                               |

Fiber.ai 按积分计费，而非按调用次数计费，因为它自身的收费会因调用而异：一次 search 收取 2 积分，外加每返回一条 result 加收 1 积分；公司或人员查询按返回的候选项计费 (因此为消除同名歧义而调高公司查询的 `numResults` 会更贵) ；联系方式获取则视你请求的是 work email、personal email 还是电话号码，收取 2 到 5 积分。你按 Fiber 为每次调用上报的积分数计费；未匹配到结果的调用不收费。参见 [Fiber.ai 定价](/zh/docs/agent/connect/fiber#pricing)。

Similarweb 按数据积分计费 (大致为每个指标 × 行 × 月一个积分) ，因此一次调用的价格取决于其 `numResults`/`months`，每次调用 1 到 15 积分不等。你按 Similarweb 为每次调用上报的积分数计费；未返回数据的调用不收费。参见 [Similarweb 定价](/zh/docs/agent/connect/similarweb#pricing)。

Baselayer 按订单计费，费率取决于具体操作：KYB 企业 search 为 $1.00，UCC 留置权 search 按检索的每个州收取 $2.00，诉讼/破产案卷 search 按每个类别收取 $1.00，Watchlist screening 按请求的每份名单收取 $0.10 至 $0.25，行业分类和网站分析各为 $0.35，网络存在情况为所选各项分析之和 (每项 $0.15 至 $0.35) ，国际企业 search 为 $4.00。对此前企业 search 结果的后续读取 (企业查询、高管信息、注册登记、高管反向查询) 均免费。参见 [Baselayer 定价](/zh/docs/agent/connect/baselayer#pricing)。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
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
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="data-partners">
  ## 数据合作伙伴
</div>

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/zh/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM 与招聘。** 面向线索发现与联系人研究的公司和人员 B2B 数据库。
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/zh/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **网站分析。** 针对任意域名提供流量预估、全球排名和竞品发现。
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/zh/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **合规与 KYB。** 验证美国企业：高管信息、注册登记及风险信号。
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/zh/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **预测市场。** 来自 Polymarket 的预测市场赔率、历史价格和交易者持仓。
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/zh/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **电商。** 商品目录搜索，包含定价、品牌和商家链接。
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/zh/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **媒体情报。** 搜索播客会议记录，附带发言人标注和时间戳。
    </Card>

    <Card title="金融数据集" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/financialdatasets.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=24052e4641fa4060e1ccf64482b10e00" href="/zh/docs/agent/connect/financialdatasets" width="401" height="400" data-path="images/agent/connect/financialdatasets.svg">
      **金融。** 覆盖 27,000 多个美股代码的价格、基本面、财报、SEC 备案文件、持股结构与选股筛选数据。
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/jinko.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=958d2ec147d452f12c0904f41ffb2311" href="/zh/docs/agent/connect/jinko" width="400" height="395" data-path="images/agent/connect/jinko.svg">
      **旅行。** 航班与酒店搜索，支持实时定价。
    </Card>
  </Columns>
</div>

需要上面未列出的数据源？请查看我们的[更多提供方](/zh/docs/agent/connect/additional-partners)，联系我们的团队即可按需开通。

<div id="usage">
  ## 用量
</div>

<div id="combining-providers">
  ### 组合多个提供方
</div>

根据任务需要接入任意数量的合作伙伴。Exa Agent 会在每个合作伙伴最擅长的领域调用它，并将这些结果与网页搜索结果融合为一个统一的结构化答案：

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

完整教程 (包括如何设计 query 和 `outputSchema`，让每个合作伙伴都能被触发) 请参阅[组合使用提供方](/zh/docs/agent/connect/combining-providers)。