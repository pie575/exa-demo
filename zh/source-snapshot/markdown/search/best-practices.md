> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# Search 最佳实践 {#search-best-practices}

> 为 production 环境的 Search API integration 调优 retrieval 质量、延迟、上下文与综合效果。

本指南假定你已经有一个可用的 [Search API 请求](/zh/docs/search/quickstart)，下面介绍如何按照 Exa 推荐的最佳实践进一步优化它。

## 从最小可用请求开始 {#start-with-the-smallest-useful-request}

最佳的基线做法是使用自然语言 query 并设置 `highlights: true`。Exa 会根据每条结果的相关性自动调整摘录长度，因此无需调节字符预算：

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

这样你就能获得经过排序的页面，以及每个页面中与 query 相关、token 开销更小的上下文。

仅在确有需要时再添加其他参数：

| 参数                         | 何时添加                        |
| -------------------------- | --------------------------- |
| `type`                     | 需要满足延迟预算或深度要求时              |
| `numResults`               | 减少页面数以适配更小的上下文窗口，或增加以扩大召回范围 |
| `outputSchema`             | 需要综合结果或将其结构化为 JSON 时        |
| `maxAgeHours`              | 缓存的页面内容可能过于陈旧时              |
| `highlights.maxCharacters` | 你的应用要求每个页面有固定的摘录上限时         |
| 域名或日期过滤条件                  | 不满足该约束的结果将无法使用时             |

## Search 与深度搜索对比 {#search-vs-deep-search}

标准 search 会针对 query 检索并排序页面。深度搜索则运行一套研究流程，可迭代式地 search、检查已找到的内容、优化 search，并综合出有据可依的结果。

| 需求                                                       | 从这里开始                               |
| -------------------------------------------------------- | ----------------------------------- |
| 针对表述完善的 query 返回排序页面                                     | `auto` 或 `fast`                     |
| 高难度 search、跨多个结果的综合，或单次 search 无法填满的结构化输出 (3 个以上 field)  | `deep`                              |
| 长时间运行的研究、列表构建或多跳增强                                       | [Exa Agent](/zh/docs/agent/quickstart) |

使用 `outputSchema` 时，默认推荐采用 deep 模式。完整说明与示例请阅读[深度搜索指南](/zh/docs/search/deep-search)。

## 提升 retrieval 质量 {#improve-retrieval-quality}

当结果不理想时，每次只调整请求中的一个部分。

<Steps>
  <Step title="写清 query">
    描述你想要的页面，而不是堆砌关键词。写明主题，以及任何会影响相关结果形态的 source type、时间范围或其他细节。

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="分层阅读响应">
    在修改请求之前，先看标题、URL、publication date 和 highlights。

    ```json theme={null}
    {
      "results": [
        {
          "title": "Long-Context Retrieval Methods on Legal Documents",
          "url": "https://arxiv.org/abs/2608.00000",
          "publishedDate": "2026-08-26T00:00:00.000Z",
          "highlights": [
            "We compare long-context retrieval methods across legal document benchmarks..."
          ]
        }
      ]
    }
    ```

    标题和 URL 说明 Exa 检索到的 source 属于哪一类，`publishedDate` 说明其时效性，highlight 则展示与 query 匹配的 evidence。调整 query 可以检索到不同的页面，添加日期过滤条件可以收窄时间范围，需要从某个有用的 result 中获取更多上下文时，则抓取 full text。
  </Step>

  <Step title="只添加硬性约束">
    只有当违反约束的 result 完全无法使用时，才使用 `includeDomains`、`excludeDomains` 和发布日期过滤条件。把 retrieval 偏好写进 query；需要综合生成时，把响应指令放在 `systemPrompt` 中。
  </Step>

  <Step title="最后再改搜索模式">
    有延迟要求时用更快的模式；retrieval 过程本身需要迭代和推理时，用 deep 模式。换模式救不了描述不充分的 query。
  </Step>
</Steps>

调优时保留一小组有代表性的 query，在整组 query 上比较结果的 relevance 和下游任务的成功率，而不要针对单个示例做优化。记录 `requestId`、`searchTime` 和 `costDollars`，这样出现回归时才能复现。

## 权衡延迟与上下文 {#budget-latency-and-context}

每项控制消耗的资源各不相同：

| 控制项                       | 带来的开销            |
| ------------------------- | ---------------- |
| 更多结果                      | 更多页面、响应数据以及下游上下文 |
| Full text                 | 更大的页面上下文范围和更大的负载 |
| `summary`                 | 每条结果额外一次语言模型调用   |
| `outputSchema`            | 对检索到的结果进行综合      |
| `contents.maxAgeHours: 0` | 重新抓取页面，而非使用缓存内容  |
| 深度搜索类型                    | 迭代式搜索、综合与推理      |

在实时性要求高、且可以接受缓存内容的场景下，可将延迟最低的模式与 highlights、仅缓存内容组合使用：

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent product updates from major AI labs",
      type="instant",
      contents={
          "highlights": True,
          "max_age_hours": -1,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("Recent product updates from major AI labs", {
    type: "instant",
    contents: {
      highlights: true,
      maxAgeHours: -1
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent product updates from major AI labs",
      "type": "instant",
      "contents": {
        "highlights": true,
        "maxAgeHours": -1
      }
    }'
  ```
</CodeGroup>

当页面新鲜度直接关系到结果正确性时，不要采用这种方案。除非产品有明确测定的延迟目标，否则应从 `auto` 和默认新鲜度开始。

若希望由 Exa 在整个结果集范围内统一分配上下文预算，即对优质来源多分配、对冗余来源少分配，请参阅 [Dynamic Highlights 研究预览](/zh/docs/search/highlights#dynamic-highlights)。

## 常见用例技巧 {#tips-for-common-use-cases}

| 如果你需要             | 使用                                                             | 避免                         |
| ----------------- | -------------------------------------------------------------- | -------------------------- |
| 更新的文献             | 在 query 中写明时间范围，或使用发布日期过滤条件                                    | `maxAgeHours`              |
| 经常更新页面的最新内容       | `contents.maxAgeHours`                                         | 发布日期过滤条件                   |
| 偏向某一类 source      | 调整 query 措辞；综合时使用 `systemPrompt`                               | 硬性的域名白名单                   |
| 仅来自已批准 source 的结果 | `includeDomains`                                               | 在 query 中反复使用 `site:`      |
| 小规模结构化输出          | `outputSchema` 配合 standard Search                              | 仅因为输出是 JSON 就选择 Deep       |
| 多项目的研究型输出         | `deep` 配合 `outputSchema`，或 [Exa Agent](/zh/docs/agent/quickstart) | 指望一次 retrieval 就收集齐所有 item |
| 从少量页面获取更多上下文      | 先用带 highlights 的 search，再调用 Contents                           | 为每条结果都获取 full text         |
| 更低延迟              | 用精简内容测试 `fast` 或 `instant`                                     | 默认添加新鲜度或综合类控制项             |

## 何时使用其他端点 {#when-to-use-another-endpoint}

当任务性质发生变化时，请改用其他 Exa 端点：

| 任务                | 使用                                    |
| ----------------- | ------------------------------------- |
| 长时间运行的研究、列表构建或增强  | [Exa Agent](/zh/docs/agent/quickstart)   |
| URL 已知            | [Contents](/zh/docs/contents/quickstart) |
| 按 schedule 定期执行搜索 | [Monitors](/zh/docs/monitors/quickstart) |

## 后续步骤 {#next-steps}

<Columns cols={2}>
  <Card title="Search API 参考" icon="square-terminal" href="/zh/docs/reference/search" cta="打开参考" arrow="true">
    全部请求参数与响应 field。
  </Card>

  <Card title="Search 快速开始" icon="search" href="/zh/docs/search/quickstart" cta="查看指南" arrow="true">
    核心请求结构、筛选、输出与新鲜度。
  </Card>

  <Card title="Contents API" icon="file-text" href="/zh/docs/contents/quickstart" cta="打开指南" arrow="true">
    从已知 URL 的页面中提取 highlights 或 full text。
  </Card>

  <Card title="Exa Agent" icon="bot" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    长时间运行的研究、列表构建与增强。
  </Card>
</Columns>