> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="deep-search">
  # Deep Search
</div>

> 通过迭代搜索、推理和有据可依的综合，完成复杂的研究任务。

Deep Search 是 Search API 的研究模式。它使用相同的 `/search` 端点，但检索过程可以发起多次搜索、审查证据、调整策略，并综合出有据可依的结果。

如果你只需针对表述清晰的 query 获取排序后的网页，使用标准 Search；如果找到答案需要开展研究，则使用 Deep。

<div id="how-deep-search-works">
  ## Deep Search 的工作原理
</div>

Deep Search 会在生成最终响应之前加入一轮研究循环：

<Steps>
  <Step title="规划搜索">
    Exa 从你的 `query` 出发，可能会将其拆解扩展为多次搜索，以覆盖请求的不同方面。你也可以通过 `additionalQueries` 提供初始的查询变体。
  </Step>

  <Step title="搜索并检查">
    Deep 搜索相关证据，将结果与请求进行比对，判断哪些内容已有支撑、哪些仍然缺失。
  </Step>

  <Step title="优化">
    当证据不完整或相互矛盾时，Deep 会发起更有针对性的搜索，而不是直接返回最先找到的看似合理的页面。
  </Step>

  <Step title="筛选与综合">
    Deep 挑选出有用的结果，然后使用与其他搜索类型相同的综合流程。当你提供 `outputSchema` 时，响应会包含结构化的 `output.content`，以及 `output.grounding` 中的字段级引用。
  </Step>
</Steps>

该流程对列表和结构化输出尤其有用：请求中的每一项可能都需要单独搜索，而 Deep 可以在生成最终结构之前先收集并核实这些结果。

<div id="choose-a-deep-mode">
  ## 选择 Deep 模式
</div>

| 类型               | 适用场景                      |
| ---------------- | ------------------------- |
| `deep-lite`      | 只需轻量级的查询扩展与结果综合           |
| `deep`           | 任务需要迭代式搜索、证据收集，或输出多个结构化项目 |
| `deep-reasoning` | 任务需要针对复杂或相互冲突的证据进行更审慎的推理  |

研究类工作流建议从 `deep` 入手；若任务较简单且对延迟敏感，则改用 `deep-lite`。

<Tip>
  对于长时间运行的研究、列表构建和多跳 Enrichment，建议使用 [Exa Agent](/zh/docs/agent/quickstart)，而非 `deep-reasoning`。Agent 单次运行可用的算力更多，并返回有据可依的结构化结果。
</Tip>

有关当前的成本与延迟说明，请参阅[定价](/zh/docs/admin/pricing#deep-search)。

<div id="make-a-deep-request">
  ## 发起 Deep 请求
</div>

在普通的 Search API 请求中设置 `type`：

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "Compare how major database vendors support vector, keyword, and hybrid retrieval",
    {
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Deep 会在 `results` 中返回筛选后的搜索结果。如果你还需要综合生成的答案或结构化数据集，请加上 `outputSchema`。

<div id="provide-starting-queries">
  ## 提供初始查询
</div>

Deep 通常会自行决定执行哪些搜索。如果你已经明确知道研究需要覆盖的特定术语、视角或子问题，可以使用 `additionalQueries`：

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Compare current approaches to inference-time scaling",
      additional_queries=[
          "inference-time compute scaling benchmark",
          "test-time reasoning methods survey",
          "adaptive compute language models",
      ],
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Compare current approaches to inference-time scaling",
    {
      additionalQueries: [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare current approaches to inference-time scaling",
      "additionalQueries": [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

主 `query` 始终包含在内。最多可提供 10 条附加查询，该列表仅对 Deep 搜索类型可用。

不要仅仅为了增加搜索量而提供细微改写的查询。只有当某条查询能带来实质不同的搜索方向时，才值得添加。

<div id="guide-behavior-and-output-separately">
  ## 分别控制行为与输出
</div>

`systemPrompt` 与 `outputSchema` 作用于请求的不同部分：

* `systemPrompt` 用于控制来源偏好、新颖度、去重以及 Deep 的研究行为。
* `outputSchema` 定义最终输出结构，并触发结果综合。

query 应说明要研究什么，系统提示词则应说明如何开展并呈现这项研究。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      type="deep",
      system_prompt="Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 8,
                  "items": {
                      "type": "object",
                      "required": ["name", "round", "amount"],
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "amount": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Find AI infrastructure companies that announced Series A or B funding in the last six months",
    {
      type: "deep",
      systemPrompt:
        "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      outputSchema: {
        type: "object",
        required: ["companies"],
        properties: {
          companies: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              required: ["name", "round", "amount"],
              properties: {
                name: { type: "string" },
                round: { type: "string" },
                amount: { type: "string" }
              }
            }
          }
        }
      }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      "type": "deep",
      "systemPrompt": "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 8,
            "items": {
              "type": "object",
              "required": ["name", "round", "amount"],
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "amount": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

如果你需要两个以上的结构化项目，或每个项目都必须满足多项要求，建议使用 Deep。标准 search 类型走的是同一条综合流程，但不会在综合前执行同样的迭代式研究。

<div id="read-the-grounded-response">
  ## 读取有据可依的响应
</div>

结构化响应会将生成的值与其证据分离：

```json theme={null}
{
  "results": [
    {
      "title": "Acme AI raises $30M Series B",
      "url": "https://acme.example/news/series-b"
    }
  ],
  "output": {
    "content": {
      "companies": [
        {
          "name": "Acme AI",
          "round": "Series B",
          "amount": "$30M"
        }
      ]
    },
    "grounding": [
      {
        "field": "companies[0].amount",
        "citations": [
          {
            "title": "Acme AI raises $30M Series B",
            "url": "https://acme.example/news/series-b"
          }
        ],
        "confidence": "high"
      }
    ]
  }
}
```

使用 `output.content` 作为生成的结果，使用 `output.grounding` 来展示或验证支撑每个字段的来源。无需在你自己的 schema 中添加引用或置信度字段，Exa 会自动返回这些信息。

`numResults` 控制 `results` 中返回的页面数量，而非 Deep 可能执行的 search 次数。

<div id="stream-the-synthesis">
  ## 流式输出综合结果
</div>

将 `stream: true` 与 `outputSchema` 搭配使用，即可通过服务器发送事件 (SSE) 接收综合输出：

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/search",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "query": "Explain the competing technical approaches to long-context retrieval",
          "type": "deep",
          "stream": True,
          "outputSchema": {
              "type": "text",
              "description": "A grounded comparison organized by approach",
          },
      },
      stream=True,
  )
  response.raise_for_status()

  for line in response.iter_lines(decode_unicode=True):
      if line:
          print(line)
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      query: "Explain the competing technical approaches to long-context retrieval",
      type: "deep",
      stream: true,
      outputSchema: {
        type: "text",
        description: "A grounded comparison organized by approach"
      }
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const decoder = new TextDecoder();
  for await (const chunk of response.body) {
    process.stdout.write(decoder.decode(chunk, { stream: true }));
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Explain the competing technical approaches to long-context retrieval",
      "type": "deep",
      "stream": true,
      "outputSchema": {
        "type": "text",
        "description": "A grounded comparison organized by approach"
      }
    }'
  ```
</CodeGroup>

持续消费这些带类型的事件，直到收到 `done`。最后一个事件包含完整的输出结果和搜索耗时，若有费用信息也会一并返回。

<div id="when-to-stay-with-standard-search">
  ## 何时继续使用标准 Search
</div>

当一次检索就能满足需求时，就不必用 Deep：

* 你需要的是相关页面，而不是研究得出的结论。
* query 本身已指向特定来源或范围很窄的主题。
* 你的应用自行完成推理，只需要检索。
* 该请求处于交互式、自动补全或语音链路中。

使用 `auto` 可获得默认的质量与速度平衡；若有明确的延迟要求，可使用 `fast` 和 `instant`。

<Columns cols={2}>
  <Card title="Search API 指南" icon="search" href="/zh/docs/search/quickstart" cta="查看 Search" arrow="true">
    构建请求、选择结果内容并应用筛选条件。
  </Card>

  <Card title="Search 最佳实践" icon="sliders-horizontal" href="/zh/docs/search/best-practices" cta="调优检索" arrow="true">
    提升质量、上下文、延迟表现以及 agent 集成效果。
  </Card>

  <Card title="Search API 参考" icon="square-terminal" href="/zh/docs/reference/search" cta="打开参考文档" arrow="true">
    查看全部请求参数与响应字段。
  </Card>

  <Card title="定价" icon="credit-card" href="/zh/docs/admin/pricing#deep-search" cta="对比模式" arrow="true">
    了解当前 Deep Search 的费用与延迟。
  </Card>
</Columns>