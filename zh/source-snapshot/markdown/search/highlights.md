> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="highlights">
  # Highlights
</div>

> 从 Exa Search 结果中返回与查询相关的摘录，同时控制上下文长度和延迟。

Highlights 会从每条结果中抽取与查询相关的原文片段。当应用需要页面中的佐证内容，又不想承担全文的 token 开销时，就可以使用它。

每条结果所选的片段会返回在 `results[].highlights` 中。

<div id="why-highlights-instead-of-full-text">
  ## 为什么用 highlights 而不是全文
</div>

Highlights 来自 Exa 自研的抽取模型。每次请求时，模型都会结合你的 query 通读每条结果，只返回能够回答该 query 的段落。你只需付出整页文本的零头 token，就能获得同等甚至更好的下游回答质量。

| 评估项             | 结果                                                               |
| --------------- | ---------------------------------------------------------------- |
| 准确率 (SimpleQA)  | 500 个字符的 highlights 即可达到页面文本前 8,000 个字符的准确率，而 token 用量减少为 1/16   |
| 更大预算下的质量        | 4,000 个字符的 highlights 得分高于 32,000 个字符的全文                         |
| 长篇技术文档          | 在 500 字符预算下，highlights 在 API 参考、SDK 文档、规范和论文上达到 60% 的准确率，全文仅为 6% |
| 搜索 token 用量     | Highlights 平均将搜索 token 降至原来的 1/5                                 |

这种节省在 agent 循环中尤为关键——每一轮搜索结果都要与推理轨迹争夺上下文空间。

<Tip>
  阅读 [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  了解方法论与完整结果。
</Tip>

<div id="add-highlights-to-search">
  ## 为 Search 添加 highlights
</div>

建议默认在 `contents` 中设置 `highlights: true`。Exa 会根据每条结果与你的 query 的相关度，自动决定返回多少文本，因此无需调整字符数预算。只有当你的应用需要固定的单页字符上限时，才设置 `maxCharacters`。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "How are inference providers reducing transformer latency?",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "How are inference providers reducing transformer latency?",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "How are inference providers reducing transformer latency?",
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

<div id="dynamic-highlights">
  ## 动态 highlights
</div>

动态 highlights 会根据哪些内容对你的 query 最有价值，动态调整从每个结果中提取的文本量：对优质来源多取，对重复或无关的来源少取，从而减少返回的 token 总量。

当多个结果会送入同一个 agent 或上下文窗口时，适合使用它。如果每个页面都需要各自的摘录或可预期的单页上限，则继续使用常规的 `highlights: true`。

在 Exa 的评测中，动态 highlights 相比完整页面内容平均减少了 95% 的 token。在 12,000 字符的预算下，它优于常规 highlights，token 效率平均提升 40%，质量提升 3.8%。在 Exa Agent 内部，它将 agent 的总 token 用量降低了 30%，并在 BrowseComp、WideSearch 等基准测试中取得 2.1% 的平均质量提升。

<Tip>
  阅读 [动态 highlights](https://exa.ai/blog/dynamic-highlights)，了解跨结果 highlight 选取的评测结果与设计思路。
</Tip>

通过 `dynamic: true` 启用：

<CodeGroup>
  ```python Python theme={null}
  from exa_py.api import DYNAMIC_HIGHLIGHTS_BETA

  result = exa.search(
      "How did US household solar installation costs change over the past five years?",
      contents={
          "highlights": {
              "dynamic": True,
          }
      },
      betas=[DYNAMIC_HIGHLIGHTS_BETA],
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa, { DYNAMIC_HIGHLIGHTS_BETA } from "exa-js";

  const result = await exa.search(
    "How did US household solar installation costs change over the past five years?",
    {
      contents: {
        highlights: {
          dynamic: true
        }
      },
      betas: [DYNAMIC_HIGHLIGHTS_BETA]
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: dynamic-highlights-2026-08-28" \
    -d '{
      "query": "How did US household solar installation costs change over the past five years?",
      "contents": {
        "highlights": {
          "dynamic": true
        }
      }
    }'
  ```
</CodeGroup>

<Info>
  动态 highlights 目前为研究预览版，需要在请求中携带
  `Exa-Beta: dynamic-highlights-2026-08-28` header。当你传入
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) 或 `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript) 时，SDK 会自动发送该 header。

  响应使用与常规 highlights 相同的
  `results[].highlights` 结构。
</Info>

<div id="next-steps">
  ## 下一步
</div>

<Columns cols={2}>
  <Card title="Search API 指南" icon="search" href="/zh/docs/search/quickstart" cta="打开指南" arrow="true">
    构建 Search 请求，并选择合适的输出形式。
  </Card>

  <Card title="Search 最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    优化检索质量、延迟、时效性和上下文大小。
  </Card>
</Columns>