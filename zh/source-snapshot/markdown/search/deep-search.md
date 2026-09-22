> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="deep-search">
  # 深度搜索
</div>

> 通过迭代式 search、推理和有据可依的综合，完成复杂的研究任务。

深度搜索是 Search API 的研究模式。它使用同一个 `/search` 端点，但 retrieval 过程可以发起多次 search、检视证据、调整策略，并综合出有据可依的结果。

如果你只需针对表述清晰的 query 获取排序后的页面，请使用标准 Search；如果找到答案需要研究，请使用 Deep。

<div id="how-deep-search-works">
  ## 深度搜索的工作原理
</div>

深度搜索会在生成最终响应前先执行一个研究 loop：

<Steps>
  <Step title="规划搜索">
    Exa 以你的 `query` 为起点，可能将其扩展为若干次 search，以覆盖请求的不同方面。你也可以通过 `additionalQueries` 提供初始的查询变体。
  </Step>

  <Step title="搜索并核查">
    deep 会搜索证据，将结果与请求逐一比对，判断哪些已有支撑、哪些仍有缺失。
  </Step>

  <Step title="优化">
    当证据不完整或相互矛盾时，deep 会发起更有针对性的 search，而不是直接返回最先看似合理的页面。
  </Step>

  <Step title="筛选与综合">
    deep 会挑选出有用的结果，然后走与其他搜索类型相同的综合路径。当你提供 `outputSchema` 时，响应中会包含结构化的 `output.content`，以及 `output.grounding` 中的 field 级引用来源。
  </Step>
</Steps>

这一流程在处理列表和结构化输出时尤其有用：请求中的每个项目可能都需要各自的 search，而 deep 能在生成最终结构前先收集并核查这些结果。

<div id="choose-a-deep-mode">
  ## 选择 Deep 模式
</div>

| 类型               | 适用场景                           |
| ---------------- | ------------------------------ |
| `deep-lite`      | 需要轻量级的 query 扩展与综合             |
| `deep`           | 任务需要迭代式 search、收集证据，或产出多个结构化项目 |
| `deep-reasoning` | 任务需要针对复杂或相互矛盾的证据进行更审慎的推理       |

研究类工作流建议从 `deep` 入手；当任务较为简单且更看重延迟时，改用 `deep-lite`。

<Tip>
  对于长时间运行的研究、列表构建和多跳增强，请使用 [Exa Agent](/zh/docs/agent/quickstart)，而不是 `deep-reasoning`。agent 每次运行可用的算力更多，返回的结果有据可依且结构化。
</Tip>

当前的费用与延迟参考请见 [定价](/zh/docs/admin/pricing#deep-search)。

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

Deep 会在 `results` 中返回筛选出的搜索结果。如果你还需要综合生成的答案或结构化数据集，请添加 `outputSchema`。

<div id="provide-starting-queries">
  ## 提供初始 query
</div>

deep 通常会自行决定执行哪些 search。如果你已经明确知道研究需要覆盖的特定术语、视角或子问题，可以使用 `additionalQueries`：

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

主 `query` 始终会被包含在内。最多可提供 10 个额外的 query，该列表仅在 Deep 搜索类型下可用。

不要只为增加搜索量而提供细微改写。只有当每个 query 都能带来实质不同的搜索方向时，才值得添加。

<div id="guide-behavior-and-output-separately">
  ## 分别控制行为与输出
</div>

`systemPrompt` 和 `outputSchema` 作用于请求的不同部分：

* `systemPrompt` 用于引导来源偏好、新颖性、去重以及 Deep 的研究行为。
* `outputSchema` 定义最终的输出结构，并触发综合。

query 应描述要研究什么，system prompt 则应描述如何开展并呈现这项研究。

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

当你需要两个以上的结构化项目，或每个项目必须满足多项要求时，建议使用 Deep。标准搜索类型走的是同一条综合路径，但不会在综合之前执行同样的迭代研究。

<div id="read-the-grounded-response">
  ## 读取有据可依的响应
</div>

结构化响应会将生成的值与其证据分开呈现：

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

使用 `output.content` 作为生成的结果，并通过 `output.grounding` 展示或验证支撑每个 field 的 sources。不要在自己的 schema 中添加 citation 或 confidence field，Exa 会自动返回这些内容。

`numResults` 控制 `results` 中返回多少个选中的页面，但不决定 Deep 可能执行的 search 次数。

<div id="stream-the-synthesis">
  ## 流式获取综合结果
</div>

将 `stream: true` 与 `outputSchema` 搭配使用，即可通过服务器发送事件接收综合后的输出：

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

持续消费这些带类型的事件，直到收到 `done`。最后一个事件包含最终输出和搜索耗时，若有费用信息也会一并返回。

<div id="when-to-stay-with-standard-search">
  ## 何时继续使用标准 Search
</div>

当一次 retrieval 就能满足请求时，就不需要 deep：

* 你需要的是相关页面，而不是经过研究得出的结论。
* query 本身已经指向某个特定 source 或很窄的主题。
* 你的应用自行完成推理，只需要 retrieval。
* 该请求位于交互式、自动补全或语音链路上。

需要默认的质量与速度平衡时使用 `auto`；对延迟有明确要求时使用 `fast` 和 `instant`。

<Columns cols={2}>
  <Card title="Search API 指南" icon="search" href="/zh/docs/search/quickstart" cta="查看 Search" arrow="true">
    构建请求、选择结果内容并应用过滤条件。
  </Card>

  <Card title="Search 最佳实践" icon="sliders-horizontal" href="/zh/docs/search/best-practices" cta="调优 retrieval" arrow="true">
    提升质量、上下文、延迟以及 agent integration 效果。
  </Card>

  <Card title="Search API 参考" icon="square-terminal" href="/zh/docs/reference/search" cta="打开参考" arrow="true">
    查看全部请求参数与响应 field。
  </Card>

  <Card title="定价" icon="credit-card" href="/zh/docs/admin/pricing#deep-search" cta="对比模式" arrow="true">
    了解当前深度搜索的费用与延迟。
  </Card>
</Columns>