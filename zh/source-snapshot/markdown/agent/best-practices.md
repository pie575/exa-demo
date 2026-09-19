> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="agent-best-practices">
  # Agent 最佳实践
</div>

> 为生产环境的 Exa Agent 集成调优 query 质量、结构化输出、投入程度与成本。

完成 [Exa Agent 快速入门](/zh/docs/agent/quickstart) 后，可参考本指南提升 query 质量、规范输出结构，并控制运行时长与成本。如需完整的请求示例，请从 [Agent 示例](/zh/docs/agent/examples) 开始。

<div id="core-principles">
  ## 核心原则
</div>

将 `query` 视为一份任务说明。明确 Agent 需要找什么、工作的 scope、需要哪些证据，以及怎样才算一个完整的结果。

<CodeGroup>
  ```python Python theme={null}
  run = exa.agent.runs.create(
      query="Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources.",
  )
  ```

  ```javascript JavaScript theme={null}
  const run = await exa.agent.runs.create({
    query:
      "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
    }'
  ```
</CodeGroup>

不指定 `outputSchema` 时，Agent 会在 `output.text` 中返回文字内容，在 `output.grounding` 中返回引用。只有当某个字段确有明确用途时，才添加它：

| 字段                      | 适用场景                                                     |
| ----------------------- | -------------------------------------------------------- |
| `outputSchema`          | 下游代码需要结构化字段                                              |
| `input.data`            | 你已有待补全的数据行                                               |
| `input.exclusion`       | 已知记录不应被返回                                                |
| `dataSources`           | 某个字段应来自 [Exa Connect](/zh/docs/agent/connect/overview) 合作伙伴 |
| `previousRunId`         | 该请求是对已完成运行的延续                                            |
| `effort`                | 需要显式设置成本或研究深度                                            |
| `budget.maxCostDollars` | `auto` 或 `max` 运行需要一个硬性成本上限                              |

数据行、排除项和响应结构请放在各自专用的字段里，不要塞进 `query`。

<div id="writing-list-building-and-enrichment-queries">
  ## 编写列表构建与 enrichment 查询
</div>

构建列表时，需明确实体、目标数量、入选 criteria、排除项以及证据标准。做 enrichment 时，将已有记录放入 `input.data`，并只描述需要 Agent 补充调研的内容。

当入选与否需要主观判断时，请要求给出理由；仅当某条 criteria 存在多种合理解读时才提供示例。

<CodeGroup>
  ```text Query theme={null}
  Find up to 20 current engineering leaders at US-based AI infrastructure companies
  that announced a Series A or B between March 1 and August 31, 2026.

  Include CTOs, VPs of Engineering, and Heads of Engineering. Exclude founders without
  an operating engineering role and anyone whose current employment cannot be verified.
  For each person, return their name, current title, company, company website, funding
  announcement date, and a short explanation of why they qualify. Verify employment on
  the company website or another current source, and verify funding from the company
  announcement or a reputable business publication.
  ```
</CodeGroup>

发现类请求可参见 [查找所有 GTM 成员](/zh/docs/agent/examples#find-all-code)，对应的行级 enrichment 模式可参见 [对输入行做 enrichment](/zh/docs/agent/examples#enrich-input-rows-code)。

<div id="handle-asynchronous-runs">
  ## 处理异步运行
</div>

Agent 运行需要搜索、读取和推理，耗时可能从数秒到数分钟不等。请围绕运行生命周期来设计应用，而不是让应用请求一直挂着。

<Steps>
  <Step title="创建并持久化">
    创建运行，并将返回的 `id` 与请求元数据一起保存。创建响应并不是最终结果。
  </Step>

  <Step title="等待终态">
    使用 SDK 提供的轮询辅助方法、轮询 `GET /agent/runs/{id}`，或消费 SSE 流。只要运行处于 `queued` 或 `running` 状态就继续等待。
  </Step>

  <Step title="存储结果">
    在状态变为 `completed`、`failed` 或 `cancelled` 时停止等待，然后持久化终态响应和 grounding。
  </Step>
</Steps>

持久化运行 ID 可以让应用在重启后恢复、重新连接到流，并排查失败原因。要降低延迟，可以收窄 scope、限制结果数量、保持 schema 精简，并在速度比完整性更重要时选择 `minimal` 或 `low`。

对于批量场景，请先用有代表性的任务做基准测试，再估算并发量或把 Agent 放到同步的 UI 路径上。运行时长会随项目数量、schema 复杂度、来源可用性和 effort 而变化。

对于启用零数据保留的团队，请消费实时流或在保留窗口内轮询。`previousRunId` 和 Connect `dataSources` 不可用。参见[零数据保留](/zh/docs/admin/security/zero-data-retention)。

<div id="write-custom-json-schemas-for-structured-output">
  ## 为结构化输出编写自定义 JSON Schema
</div>

当下游代码需要机器可读的字段、规范化取值、表格行或 enrichment 记录时，请使用 `outputSchema`。如果一段文字性的回答就够用，则可以省略它，直接读取 `output.text`；结构化输出会增加格式化方面的工作量，还可能拉高延迟。

研究指令写在 `query` 中，响应结构写在 `outputSchema` 中。属性名和描述要清晰，类型选择尽量收窄，并用 `maxItems` 限定数组长度。

<CodeGroup>
  ```json Output schema expandable theme={null}
  {
    "type": "object",
    "properties": {
      "people": {
        "type": "array",
        "maxItems": 10,
        "description": "Current engineering leaders who satisfy every criterion in the query.",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The person's full name."
            },
            "job_title": {
              "type": "string",
              "description": "Their current title at the qualifying company."
            },
            "company": {
              "type": "string",
              "description": "The qualifying company's canonical name."
            },
            "qualification_rationale": {
              "type": "string",
              "description": "A concise explanation of how the person satisfies the query criteria."
            }
          },
          "required": ["name", "job_title", "company", "qualification_rationale"]
        }
      }
    },
    "required": ["people"]
  }
  ```
</CodeGroup>

Schema 校验只验证结构，不验证事实。当证据不足以支撑某个字段时，Agent 可能返回 `null`，即便你提交的 schema 将该字段标记为必填或不可为空。`stopReason: schema_satisfied` 表示 Agent 认为在允许这些空值的前提下，预期结构已经完整，但这并不保证结果能严格通过所提交 schema 的校验。

不要在自己的 schema 中重复 Exa 内置的引用或置信度信息。只有当每个项目都需要说明自身为何符合条件时，才添加理由字段，并将 `output.grounding` 与结构化结果一并保存。上线前请对照来源核实重要结论，并用有代表性的输入测试 schema 改动。

浏览[结构化 Agent 示例](/zh/docs/agent/examples)，对比列表构建、KYB、招聘信息、排除项和持续运行等场景下的 schema 写法。

<div id="agent-vs-search">
  ## Agent 与 Search 的选择
</div>

| 需求                      | 推荐入口                                    |
| ----------------------- | --------------------------------------- |
| 为 LLM 提供网页结果            | [Search](/zh/docs/search/quickstart)       |
| 快速研究与综合                 | [Deep Search](/zh/docs/search/deep-search) |
| 异步列表构建、多跳研究或 Enrichment | [Agent](/zh/docs/agent/quickstart)         |

如果任务需要多轮检索、逐个实体核验，或对已知记录做 Enrichment，请使用 Agent。如果你只是想快速拿到网页内容，后续推理交由自己的应用完成，请使用 Search。

<div id="tips-for-common-use-cases">
  ## 常见使用场景的建议
</div>

| 如果你需要             | 使用                                                           | 避免                           |
| ----------------- | ------------------------------------------------------------ | ---------------------------- |
| 数量未知的调研清单         | `auto` 搭配有边界的 `outputSchema`                                 | 固定的低档 effort 搭配无边界数组         |
| 为已有记录做 Enrichment | `input.data` 加上要补充的字段                                        | 把表格直接粘贴到 `query` 里           |
| 基于上一次结果集继续追问      | `previousRunId`                                              | 重新发送完整的上一次输出                 |
| 不希望再次出现的记录        | `input.exclusion` 配合下游去重                                     | 把排除项当作严格的身份保证                |
| 高级数据提供方的数据        | [Exa Connect](/zh/docs/agent/connect/overview) 配合 `dataSources` | 让 Agent 从公开网络推断只有提供方才有的字段    |
| 可预测的单次请求成本        | 固定的 `effort`                                                 | 在没有预算约束的情况下使用 `auto` 或 `max` |
| 完整性优先于延迟和成本       | `xhigh` 或 `max`                                              | 还没优化 query 就先调高 effort       |

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="Agent 快速开始" icon="bot" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式接收事件、设置 effort 并读取结构化输出。
  </Card>

  <Card title="Agent 示例" icon="layers" href="/zh/docs/agent/examples" cta="浏览示例" arrow="true">
    直接复用完整的列表构建、Enrichment、KYB、排除和追问请求示例。
  </Card>

  <Card title="Exa Connect" icon="database" href="/zh/docs/agent/connect/overview" cta="浏览数据合作伙伴" arrow="true">
    接入公司、人物、流量、合规、金融等高级数据提供方。
  </Card>

  <Card title="Search 最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    当 Search 已足够时，如何兼顾检索质量、延迟与结果综合。
  </Card>
</Columns>