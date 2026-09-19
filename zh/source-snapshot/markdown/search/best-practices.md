> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="search-best-practices">
  # Search 最佳实践
</div>

> 为生产环境中的 Search API 集成调优检索质量、延迟、上下文与综合效果。

本指南假设你已经有一个可用的 [Search API 请求](/zh/docs/search/quickstart)，并介绍如何依据 Exa 推荐的最佳实践对其进行优化。

<div id="start-with-the-smallest-useful-request">
  ## 从最小可用请求开始
</div>

最好的基线做法是使用自然语言 query 并设置 `highlights: true`。Exa 会根据每条结果的相关性自动调整摘录长度，因此无需调节字符预算：

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

这样你就能得到经过排序的页面，以及每个页面中与 query 相关、token 占用更少的上下文。

仅在需要时添加额外参数：

| 参数                         | 何时添加                        |
| -------------------------- | --------------------------- |
| `type`                     | 需要满足延迟预算或深度要求时              |
| `numResults`               | 上下文窗口较小时减少页面数，或需要更广召回时增加页面数 |
| `outputSchema`             | 需要综合结果或将其结构化为 JSON 时        |
| `maxAgeHours`              | 缓存的页面内容可能过旧时                |
| `highlights.maxCharacters` | 你的应用要求每个页面有固定的摘录长度上限时       |
| 域名或日期过滤条件                  | 约束范围之外的结果无法使用时              |

<div id="search-vs-deep-search">
  ## Search 与 Deep Search 的对比
</div>

标准 search 会针对 query 检索并排序页面。Deep Search 则会运行一套研究流程，可迭代搜索、检视已找到的内容、优化搜索，并综合得出有据可依的结果。

| 需求                                         | 建议起点                                |
| ------------------------------------------ | ----------------------------------- |
| 针对表述清晰的 query 获取排序后的页面                     | `auto` 或 `fast`                     |
| 高难度搜索、跨多条结果的综合，或单次搜索无法填充的结构化输出 (3 个及以上字段)  | `deep`                              |
| 长时间运行的研究、列表构建或多跳 enrichment                | [Exa Agent](/zh/docs/agent/quickstart) |

使用 `outputSchema` 时，默认推荐采用 deep 模式。完整说明与示例请参阅 [Deep Search 指南](/zh/docs/search/deep-search)。

<div id="improve-retrieval-quality">
  ## 提升检索质量
</div>

当结果不理想时，每次只调整请求中的一个部分。

<Steps>
  <Step title="写清楚 query">
    描述你想要的页面，而不是堆砌关键词。写明主题，以及任何会影响&quot;什么算相关结果&quot;的来源类型、
    时间范围或其他细节。

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="分层阅读响应">
    在修改请求之前，先看标题、URL、发布日期和 highlights。

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

    标题和 URL 反映 Exa 检索到的来源类型，`publishedDate` 反映其时效性，
    highlight 则展示与 query 匹配的依据。你可以调整 query 以检索不同的页面、添加日期筛选以缩小时间范围，
    或在需要从某个有价值的结果中获取更多上下文时抓取全文。
  </Step>

  <Step title="只添加硬性约束">
    只有在违反约束的结果完全无法使用时，才使用 `includeDomains`、`excludeDomains` 和发布日期过滤条件。
    把检索偏好写进 query；需要内容合成时，把响应指令写进 `systemPrompt`。
  </Step>

  <Step title="最后再改搜索模式">
    有延迟要求时用更快的模式；检索过程本身需要迭代和推理时用深度模式。
    换模式救不了一个描述不充分的 query。
  </Step>
</Steps>

调优时固定一小组有代表性的 query，在整组 query 上比较结果相关性和下游任务成功率，而不是针对单个示例做优化。记录 `requestId`、`searchTime` 和 `costDollars`，以便回归问题可复现。

<div id="budget-latency-and-context">
  ## 权衡延迟与上下文
</div>

每个控制项消耗的资源各不相同：

| 控制项                       | 带来的开销                 |
| ------------------------- | --------------------- |
| 更多结果                      | 更多页面、响应数据以及下游上下文      |
| 全文                        | 更完整的页面上下文和更大的 payload |
| `summary`                 | 每条结果额外一次语言模型调用        |
| `outputSchema`            | 对检索到的结果进行综合           |
| `contents.maxAgeHours: 0` | 重新抓取页面，而非使用缓存内容       |
| 深度搜索类型                    | 迭代式搜索、综合与推理           |

如果是可以接受缓存内容的实时场景，可将延迟最低的模式与 highlights、仅用缓存的内容结合使用：

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

当页面新鲜度直接关系到结果正确性时，不要使用这套方案。除非产品有实测的延迟目标，否则应从 `auto` 和默认新鲜度开始。

若希望由 Exa 在整个结果集上统一分配一份上下文预算——优质来源多取、冗余来源少取——请参阅 [Dynamic Highlights 研究预览](/zh/docs/search/highlights#dynamic-highlights)。

<div id="tips-for-common-use-cases">
  ## 常见场景使用建议
</div>

| 如果你需要        | 使用                                                             | 避免                   |
| ------------ | -------------------------------------------------------------- | -------------------- |
| 较新发布的内容      | 在 query 中写明时间范围，或使用发布日期过滤条件                                    | `maxAgeHours`        |
| 经常变动页面的最新内容  | `contents.maxAgeHours`                                         | 发布日期过滤条件             |
| 偏向某类信息来源     | 调整 query 措辞；合成时使用 `systemPrompt`                               | 强制的域名白名单             |
| 仅来自指定来源的结果   | `includeDomains`                                               | 在 query 中反复写 `site:` |
| 小型结构化输出      | 标准 Search 搭配 `outputSchema`                                    | 仅因输出为 JSON 就选择 Deep  |
| 多项目的研究型输出    | `deep` 搭配 `outputSchema`，或 [Exa Agent](/zh/docs/agent/quickstart) | 指望一次检索就收集齐所有项目       |
| 从少量页面获取更多上下文 | 先用 highlights 搜索，再调用 Contents                                  | 为每条结果都获取全文           |
| 更低的延迟        | 搭配精简内容测试 `fast` 或 `instant`                                    | 默认开启新鲜度或合成相关控制项      |

<div id="when-to-use-another-endpoint">
  ## 何时使用其他端点
</div>

当任务性质发生变化时，应改用其他 Exa 端点：

| 任务                        | 使用                                    |
| ------------------------- | ------------------------------------- |
| 长时间运行的研究、列表构建或 enrichment | [Exa Agent](/zh/docs/agent/quickstart)   |
| URL 已知                    | [Contents](/zh/docs/contents/quickstart) |
| 按计划定期执行 search            | [Monitors](/zh/docs/monitors/quickstart) |

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="Search API 参考" icon="square-terminal" href="/zh/docs/reference/search" cta="打开参考文档" arrow="true">
    逐一说明每个请求参数与响应字段。
  </Card>

  <Card title="Search 快速上手" icon="search" href="/zh/docs/search/quickstart" cta="查看指南" arrow="true">
    核心请求结构、过滤条件、输出与新鲜度。
  </Card>

  <Card title="Contents API" icon="file-text" href="/zh/docs/contents/quickstart" cta="打开指南" arrow="true">
    从已知页面中提取 highlights 或全文。
  </Card>

  <Card title="Exa Agent" icon="bot" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    长时间运行的研究、列表构建与 enrichment。
  </Card>
</Columns>