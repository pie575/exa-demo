> ## 文档索引 {#documentation-index}
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，请先通过该文件了解所有可用页面。

# Agent 最佳实践 {#agent-best-practices}

> 为 production 环境的 Exa Agent integration 调优 query 质量、结构化输出、effort 与费用。

完成 [Exa Agent 快速开始](/zh/docs/agent/quickstart) 后，可参考本指南提升 query 质量、组织输出结构，并控制运行时长与费用。如需完整的请求示例，请从 [Agent 示例](/zh/docs/agent/examples) 开始。

## 核心原则 {#core-principles}

把 `query` 当作一份任务说明来写：明确 agent 要找什么、工作的 scope、需要哪些证据，以及怎样才算一个完整的结果。

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

不指定 `outputSchema` 时，agent 会在 `output.text` 中返回文字内容，并在 `output.grounding` 中返回引用来源。只有当某个 field 确有用武之地时，才把它加上：

| Field                   | 适用场景                                                          |
| ----------------------- | ------------------------------------------------------------- |
| `outputSchema`          | 下游代码需要结构化 fields                                              |
| `input.data`            | 你已有待丰富的数据行                                                    |
| `input.exclusion`       | 已知的某些 记录 不应被返回                                           |
| `dataSources`           | 某个 field 应来自 [Exa Connect](/zh/docs/agent/connect/overview) 合作伙伴 |
| `previousRunId`         | 本次请求是对某次已完成运行的延续                                              |
| `effort`                | 需要显式设定费用或研究 depth                                             |
| `budget.maxCostDollars` | `auto` 或 `max` 运行需要设定硬性费用上限                                   |

数据行、exclusions 和响应结构都应放在各自专属的 fields 中，不要塞进 `query` 里。

## 编写列表构建与增强类 query {#writing-list-building-and-enrichment-queries}

对于列表构建，需要明确实体、目标数量、资格 criteria、exclusions 以及证据标准。对于增强，将已有记录放入 `input.data`，并只描述 agent 需要补充研究的内容。

当资格判定涉及主观判断时，要求给出理由。只有当某条 criterion 存在多种合理解读时，才提供示例。

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

发现类请求示例参见 [Find all GTM members](/zh/docs/agent/examples#find-all-code)，对应的行增强模式参见 [Enrich input rows](/zh/docs/agent/examples#enrich-input-rows-code)。

## 处理异步运行 {#handle-asynchronous-runs}

Agent 运行在搜索、阅读和推理期间可能耗时数秒到数分钟。请围绕运行生命周期来设计，而不是让应用请求一直挂着。

<Steps>
  <Step title="创建并持久化">
    创建运行，并将返回的 `id` 与请求元数据一起保存。创建请求的响应并不是最终结果。
  </Step>

  <Step title="等待终态">
    使用 SDK 轮询辅助方法、轮询 `GET /agent/runs/{id}`，或消费 SSE 流。只要运行仍处于 `queued` 或 `running`，就继续等待。
  </Step>

  <Step title="存储结果">
    在 `completed`、`failed` 或 `cancelled` 时停止等待，然后持久化终态响应和 grounding。
  </Step>
</Steps>

持久化运行 ID 可以让应用在重启后恢复、重新连接到流，并排查失败原因。要降低延迟，可以收窄 scope、限制结果数量、保持 schema 精简，并在速度比完整性更重要时选择 `minimal` 或 `low`。

对于批量场景，请先对有代表性的任务做基准测试，再估算并发或把 Agent 放到同步 UI 路径上。运行时长会随项目数量、schema 复杂度、source 可用性和 effort 而变化。

对于启用了 Zero Data Retention 的团队，请消费实时流或在保留窗口内轮询。`previousRunId` 和 Connect `dataSources` 不可用。参见 [Zero Data Retention](/zh/docs/admin/security/zero-data-retention)。

## 为结构化输出编写自定义 JSON schema {#write-custom-json-schemas-for-structured-output}

当下游代码需要机器可读的 fields、归一化的值、表格行或增强记录时，使用 `outputSchema`。如果一段文字答案就够用，可以省略它并直接读取 `output.text`；结构化输出会增加格式化工作量，也可能提高延迟。

把研究指令写在 `query` 里，把响应结构写在 `outputSchema` 里。使用清晰的属性名和描述，选择尽可能窄的可用类型，并用 `maxItems` 限制数组长度。

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

schema 遵从性校验的是结构，而不是事实。当证据不足以支撑某个 field 时，agent 可能返回 `null`，即使提交的 schema 把它标记为必填或不可为空。`stopReason: schema_satisfied` 表示 agent 认为在允许这些空值的前提下，预期结构已经完整，但并不保证严格通过所提交 schema 的校验。

不要在自己的 schema 中重复 Exa 内置的引用来源或 confidence。仅当需要每个项目说明自身为何符合条件时，才添加 rationale field，并将 `output.grounding` 与结构化结果一并保存。上线前请对照来源核实重要论断，并在有代表性的输入上测试 schema 变更。

浏览[结构化 agent 示例](/zh/docs/agent/examples)，对比列表构建、KYB、招聘信息、exclusions 和续跑运行所用的 schema。

## agent 与 Search 的对比 {#agent-vs-search}

| 需求             | 从这里开始                             |
| -------------- | --------------------------------- |
| 为你的 LLM 获取网页结果 | [Search](/zh/docs/search/quickstart) |
| 快速研究与综合        | [深度搜索](/zh/docs/search/deep-search)  |
| 异步列表构建、多跳研究或增强 | [agent](/zh/docs/agent/quickstart)   |

如果任务需要多步 retrieval、逐个实体验证，或对已知 记录 进行增强，请使用 agent。如果你只需快速获取网页，后续推理由你的应用完成，则使用 Search。

## 常见用例技巧 {#tips-for-common-use-cases}

| 如果你需要       | 使用                                                           | 避免                            |
| ----------- | ------------------------------------------------------------ | ----------------------------- |
| 数量未知的研究型列表  | `auto` 搭配有界的 `outputSchema`                                  | 固定的低 effort 搭配无界数组            |
| 对已有记录做增强    | `input.data` 加上要补充的 fields                                   | 把表格直接粘贴到 `query` 中            |
| 基于上一批结果的追问  | `previousRunId`                                              | 重新发送完整的上一次输出                  |
| 不希望再次出现的记录  | `input.exclusion` 配合下游去重                                     | 把 exclusions 当作严格的身份保证        |
| 高级提供方数据     | [Exa Connect](/zh/docs/agent/connect/overview) 配合 `dataSources` | 让 agent 从公开网络推断仅提供方才有的 fields |
| 可预测的单次请求费用  | 固定的 `effort`                                                 | 不设预算就使用 `auto` 或 `max`        |
| 完整性优先于延迟与费用 | `xhigh` 或 `max`                                              | 还没收紧 query 就先提高 effort        |

## 下一步 {#next-steps}

<Columns cols={2}>
  <Card title="Agent 快速开始" icon="bot" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式接收事件、设置 effort 并读取结构化输出。
  </Card>

  <Card title="Agent 示例" icon="layers" href="/zh/docs/agent/examples" cta="浏览示例" arrow="true">
    直接复用完整的列表构建、增强、KYB、exclusions 和追问请求示例。
  </Card>

  <Card title="Exa Connect" icon="database" href="/zh/docs/agent/connect/overview" cta="浏览数据合作伙伴" arrow="true">
    接入公司、人物、流量、合规、金融等高级提供方数据。
  </Card>

  <Card title="Search 最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    仅用 Search 即可满足需求时,如何兼顾 retrieval 质量、延迟与综合效果。
  </Card>
</Columns>