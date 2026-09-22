> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

# Highlights {#highlights}

> 从 Exa Search 结果中返回与 query 相关的摘录，同时控制上下文大小和延迟。

Highlights 会从每条 result 中抽取与 query 相关的文本段落。如果你的应用需要页面中的证据，又不想为 full text 付出 token 费用，就可以使用它。

每条 result 所选出的段落都会返回在 `results[].highlights` 中。

## 为什么用 highlights 而不是 full text {#why-highlights-instead-of-full-text}

Highlights 来自 Exa 自研的提取模型。每次请求时，模型都会结合你的 query 通读每条 result，只返回能回答该 query 的段落。你只需消耗整页文本零头的 token，就能获得同等甚至更好的下游回答质量。

| 评估项             | 结果                                                                      |
| --------------- | ----------------------------------------------------------------------- |
| 准确率 (SimpleQA)  | 500 个字符的 highlights 准确率与页面文本前 8,000 个字符相当，token 数却少 16 倍                |
| 更大预算下的质量        | 4,000 个字符的 highlights 得分高于 32,000 个字符的 full text                        |
| 长篇技术文档          | 在 500 字符预算下，highlights 在 API 参考、SDK 文档、规范和论文上的准确率达到 60%，full text 仅为 6% |
| 搜索 token 用量     | Highlights 平均将搜索 token 减少至原来的五分之一                                       |

在 agent loop 中，这种节省尤为关键，因为每一轮搜索结果都要与推理过程争夺上下文。

<Tip>
  阅读 [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  了解方法论和完整结果。
</Tip>

## 为 Search 添加 highlights {#add-highlights-to-search}

推荐的默认做法是在 `contents` 中设置 `highlights: true`。Exa 会根据每条结果与 query 的相关性，自动决定从中返回多少文本，因此无需调整字符预算。只有当你的应用需要固定的单页上限时，才需要设置 `maxCharacters`。

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

## Dynamic Highlights {#dynamic-highlights}

Dynamic Highlights 会根据哪些内容对你的 query 最有用，动态调整从每条结果中选取的文本量：对优质来源多取一些，对重复或无关的来源少取一些，从而减少返回的总 token 数。

当多条结果会一并送入同一个 agent 或上下文窗口时，适合使用该功能。如果每个页面都需要各自的摘录，或需要可预期的单页限制，则继续使用常规的 `highlights: true`。

在 Exa 的评估中，与完整页面内容相比，Dynamic Highlights 平均减少了 95% 的 token。在 12,000 字符预算下，它的表现优于常规 highlights，平均 token 效率提升 40%，质量提升 3.8%。在 Exa Agent 中，它将 agent 的总 token 用量降低了 30%，并在 BrowseComp、WideSearch 等基准测试中取得 2.1% 的平均质量提升。

<Tip>
  阅读 [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights)，了解跨结果 highlight 选取的评估结果与设计思路。
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
  Dynamic Highlights 目前处于研究预览阶段，需要在请求中携带
  `Exa-Beta: dynamic-highlights-2026-08-28` header。当你传入
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) 或 `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript) 时，SDK 会自动发送该 header。

  响应使用与常规 highlights 相同的
  `results[].highlights` 结构。
</Info>

## 后续步骤 {#next-steps}

<Columns cols={2}>
  <Card title="Search API 指南" icon="search" href="/zh/docs/search/quickstart" cta="打开指南" arrow="true">
    构建 Search 请求，并选择合适的输出形式。
  </Card>

  <Card title="Search 最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    优化 retrieval 质量、延迟、新鲜度和上下文大小。
  </Card>
</Columns>