> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="changelog">
  # 更新日志
</div>

> 来自 Exa 的产品更新与公告。

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  <div id="dynamic-highlights-research-preview">
    ## 动态 highlights (研究预览版)
  </div>

  动态 highlights 会在整个结果集范围内挑选摘录片段，而不是孤立地处理每个页面。它会把更多共享上下文预算分配给有价值的来源，而对那些只是重复已返回信息的来源减少分配。

  * **单轮 RAG**：在编程与通用问答评测中，配合 Exa Auto 使用时，token 效率提升约 49%，下游质量提升 2.4%。
  * **Agent**：在完整的 agent 执行轨迹中 token 消耗减少约 30%，在 BrowseComp、WideSearch 以及内部的公司与人物评测中质量提升 1%。

  设置了 `dynamic: true` 的请求需要携带 `Exa-Beta: dynamic-highlights-2026-08-28` header。

  [阅读动态 highlights 指南 →](/zh/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  <div id="publication-research">
    ## 学术出版物研究
  </div>

  我们大幅扩展并改进了对学术出版物的研究能力。

  * **3.5 亿篇出版物**：可在包含 3.5 亿篇出版物的索引中进行搜索。
  * **更丰富的机构与人物结果**：搜索现在会同时返回机构及其关联人员，每条结果都是详尽的增强档案，涵盖出版物、主要合作者、研究领域和资助情况。
  * **智能化的人物与机构搜索**：agent 现在可以对人物和机构进行搜索。
  * **公开检索基准**：我们发布了一套面向出版物检索的公开基准。
  * **新增 `publication` 搜索类别**：使用 `category: "publication"` 查询学术结果，该类别取代了原有的 `research paper` 类别。
  * **废弃的类别**：`pdf`、`github` 和 `tweet` 搜索类别即将废弃。
  * **`startCrawlDate` / `endCrawlDate`**：这两个已废弃的参数现在对所有团队都会被忽略，但仍可传入以保持兼容。

  通过 API 使用 `publication` [搜索类别](/zh/docs/search/quickstart) 进行查询，或[在控制台中体验 →](https://dashboard.exa.ai/playground/search?type=instant)。
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## MCP 中的 Exa Agent 与 Exa Connect
  </div>

  Exa Agent 现已在 Exa MCP 中提供。当任务仅靠一次 search 调用无法完成时，你可以在 Claude、Cursor 或任何其他 MCP 客户端中使用它。

  使用 `https://mcp.exa.ai/mcp?tools=agent_run` 启用 Agent 工具，然后调用 `agent_run` 让 agent 运行至完成并返回其输出。

  Exa Connect 数据源可通过 Agent 流程使用，因此当某次运行不能只依赖网页搜索时，你可以接入优质数据合作伙伴。

  [阅读 Exa MCP 指南 →](/zh/docs/get-started/exa-mcp) · [阅读 Exa Agent 指南 →](/zh/docs/agent/quickstart) · [公告推文 →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## 推出 Exa Connect
  </div>

  Exa Connect 让 Exa Agent 能够实时访问全球的公开与私有数据。首批上线的合作伙伴包括 Similarweb、Fiber.ai、Baselayer、Financial Datasets、Affiliate.com、Particle、Jinko 以及其他合作伙伴。你可以在 `POST /agent/runs` 中通过 `dataSources` 接入它们。

  [阅读 Exa Connect 指南 →](/zh/docs/agent/connect/overview) · [公告推文 →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## 推出 Exa Agent
  </div>

  我们发布了一类全新的前沿网页研究 agent，可通过 API 调用。

  Exa Agent API 支持的参数包括自然语言 query、`effort` 模式、用于结构化输出的 `outputSchema`，以及用于在已有数据集基础上继续构建的 `input.data`。

  [阅读 Exa Agent API 指南 →](/zh/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "API 弃用通知" }}>
  <div id="api-deprecation-notice">
    ## API 弃用通知
  </div>

  我们已下线 Exa API 中的若干遗留功能：

  * **`/research` 端点**：改用 `/search` 并搭配 `type: "deep-reasoning"`。
  * **`resolvedSearchType` 与 `highlightScores` (响应字段)&#x20;**：自 4 月 15 日起返回 `null`，5 月 1 日移除。
  * **`startCrawlDate` / `endCrawlDate` (已弃用的请求参数)&#x20;**：自 4 月 15 日起被静默忽略。

  [迁移到 Deep search →](/zh/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "推出 Exa Monitors" }}>
  <div id="introducing-exa-monitors">
    ## 推出 Exa Monitors
  </div>

  Monitors 会按计划定时运行 Exa 搜索，并将结果投递到你的 webhook，同时与此前各次运行的结果去重，让你只收到新内容。

  * **持续跟踪主题**：竞品动态、融资轮次、监管变化、研究论文。
  * **结构化结果**：通过 `outputSchema` 返回纯文本或带类型的 JSON。
  * **灵活调度**：按间隔运行 (最短 1 小时) 或手动触发。

  [阅读 Monitors API 指南 →](/zh/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Exa Deep 全面升级" }}>
  <div id="exa-deep-revamp">
    ## Exa Deep 全面升级
  </div>

  Exa Deep 更快、更便宜，现已支持带字段级 grounding 的结构化输出。

  * **新增 `deep-reasoning` 类型**，适用于更高投入的任务 (12-50 秒) ；`deep` 耗时 4-12 秒。
  * 常规 `deep` 搜索**降价 20%**。
  * 通过 `outputSchema` 实现**结构化输出**，响应中包含 `output.content` 与 `output.grounding` (字段级引用与置信度) 。

  完整价格请参阅下方的 [Exa 价格更新](#exa-pricing-update)。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Exa 价格更新" }}>
  <div id="exa-pricing-update">
    ## Exa 价格更新
  </div>

  我们简化并下调了价格。前 10 条搜索结果的 contents 现已免费包含，新价格自动生效，无需任何操作。

  * **带 contents 的搜索**：每 1000 次请求 $7 (含 10 条结果的文本 + highlights) ；每额外 1000 条结果 $1。
  * **摘要**：每 1000 次 $1，搜索与 contents 均适用。
  * **Exa Deep**：每 1000 次请求 $12；**Deep (Reasoning)** 每 1000 次 $15。
  * **Contents 端点**：每种内容类型每 1000 个页面 $1。

  [查看当前价格 →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "推出 Exa Instant Search" }}>
  <div id="introducing-exa-instant-search">
    ## 推出 Exa Instant Search
  </div>

  Exa Instant 是我们最快的搜索类型，在提升神经搜索质量的同时将延迟控制在 150 毫秒以内。使用 `type="instant"` 即可启用。

  * **为实时场景打造**：聊天应用、语音 AI、编程 agent、自动补全与实时建议。
  * 以我们所能提供的最低延迟，实现**业界领先的质量**。

  [阅读 Search API 指南 →](/zh/docs/search/quickstart) · [在控制台中试用 →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights、内容新鲜度与 MCP 更新" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Highlights、内容新鲜度与 MCP 更新
  </div>

  内容提取与访问方面的三项改进：

  * **highlights 的 `maxCharacters`**：现已成为控制 highlight 长度的首选方式，`numSentences` 与 `highlightsPerUrl` 已弃用。
  * **控制内容新鲜度的 `maxAgeHours`**：以基于时效的控制取代布尔值 `livecrawl` (`0` 始终抓取，`-1` 仅使用缓存，`24` 表示超过 24 小时才抓取) 。
  * **Exa MCP 免费额度**：无需认证即可试用，限 3 QPS、每天 150 次调用；添加 API key 即可获得完整访问权限。

  [内容新鲜度文档 →](/zh/docs/contents/quickstart#content-freshness) · [Exa MCP →](/zh/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Exa 公司搜索发布" }}>
  <div id="introducing-exa-company-search">
    ## Exa 公司搜索发布
  </div>

  公司搜索现已采用微调的检索模型和实体匹配流程。使用 `type="auto"`、`category="company"` 即可。

  * **多维属性精准匹配**：行业、地域、融资阶段和员工规模。
  * **结构化实体数据**：返回带类型的公司信息 (人员规模、总部、财务状况、网站流量) 。
  * **适用场景**：销售线索挖掘、市场研究和供应链工作流。

  [阅读公司与人物搜索文档 →](/zh/docs/search/data/companies-people) · [阅读基准测试博客 →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Exa 人物搜索发布" }}>
  <div id="introducing-exa-people-search">
    ## Exa 人物搜索发布
  </div>

  人物搜索现已通过混合检索系统覆盖超过 10 亿个公开档案。`linkedin` 类别已由新的 `people` 类别取代。

  * **覆盖更广**：涵盖全网档案，不再局限于 LinkedIn。
  * **准确度更高**：针对职位、技能和公司类 query 微调的嵌入模型。
  * **适用场景**：销售、招聘和市场研究。

  [阅读公司与人物搜索文档 →](/zh/docs/search/data/companies-people) · [阅读基准测试博客 →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK：恢复 highlights" }}>
  <div id="js-sdk-highlights-restored">
    ## JS SDK：恢复 highlights
  </div>

  自 `exa-js` v2.0.11 起，highlights 回归 JavaScript SDK，可返回带相关性分数的关键语句。在 search 和 contents 调用中传入 `highlights: true` 或 `highlights: { maxCharacters, query }` 即可。

  [阅读 JavaScript SDK 文档 →](/zh/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "新增 Deep 搜索类型" }}>
  <div id="new-deep-search-type">
    ## 新增 Deep 搜索类型
  </div>

  Exa Deep 通过并行执行多次 search 获得更优结果，并为每条结果返回高质量上下文。使用 `type="deep"` 即可启用。

  * **query 扩展**：只需发送一个 query，我们便会生成多种变体，你也可以通过 `additionalQueries` 自行提供。
  * **并行 search 与智能排序**：覆盖你的 query 及所有变体。
  * 为每条结果生成**详细摘要**。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "新增语言过滤" }}>
  <div id="added-language-filtering">
    ## 新增语言过滤
  </div>

  Exa 现在会检测你的 query 语言，并仅返回该语言的结果。所有用户默认启用，无需任何配置。

  [阅读 Search API 指南 →](/zh/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "SDK 变更：移除 highlights，默认返回 contents" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## SDK 变更：移除 highlights，默认返回 contents
  </div>

  这是一个包含破坏性变更的 SDK 大版本更新：

  * **默认返回 contents**：search 现在会包含 page contents；可关闭以获得更快的 search 速度。
  * **SDK 中移除 highlights**：后续已在 JS SDK 中恢复，参见 [JS SDK：恢复 highlights](#js-sdk-highlights-restored)。
  * **`use_autoprompt` 已弃用**：已从所有 API 响应中移除。

  [阅读 Python SDK 文档 →](/zh/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "支持域名路径过滤" }}>
  <div id="domain-path-filter-support">
    ## 支持域名路径过滤
  </div>

  `includeDomains` 和 `excludeDomains` 现已支持更精细的定向：

  * **按路径过滤**：例如 `exa.ai/blog` 或 `linkedin.com/company`。
  * **子域名通配符**：例如 `*.substack.com`。

  适用于将 search 范围限定到博客、产品目录或名录站点。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "支持地理位置过滤" }}>
  <div id="geolocation-filter-support">
    ## 支持地理位置过滤
  </div>

  新增的 `userLocation` 参数可让结果偏向用户所在地区，取值为 [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 国家代码 (例如 `"us"`、`"fr"`) 。适用于多地区应用、地区语言内容和本地发现场景。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "新的 Fast 搜索类型" }}>
  <div id="new-fast-search-type">
    ## 新的 Fast 搜索类型
  </div>

  Exa Fast 采用精简的搜索模型，p50 延迟低于 425ms。设置 `type="fast"` 即可启用。

  * **与神经搜索共用同一套 Exa 索引**，内容质量一致。
  * **参数完全兼容**其他搜索类型。
  * **专为**快速网页 grounding、agent 工作流和低延迟产品打造。

  [阅读 Search API 指南 →](/zh/docs/search/quickstart) · [在控制台中试用 →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Auto 搜索弃用 Score 字段" }}>
  <div id="score-deprecation-in-auto-search">
    ## Auto 搜索弃用 Score 字段
  </div>

  新的 Auto 搜索架构已无法给出有意义的相关性分数，因此 `score` 字段将从 Auto 搜索结果中移除。

  * **Auto 搜索**：不再返回 `score`；结果本身已按相关性排序。
  * **神经搜索**：分数保持不变。如果你依赖分数，请设置 `type="neural"`。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Markdown 内容成为默认格式" }}>
  <div id="markdown-contents-as-default">
    ## Markdown 内容成为默认格式
  </div>

  所有端点现在默认返回干净的 markdown，更适合 LLM、RAG 和常规文本处理。无需任何操作。

  * **`includeHtmlTags=false` (默认)&#x20;**：内容会被处理为干净的 markdown。
  * **`includeHtmlTags=true`**：返回原始 HTML，不做 markdown 处理。

  无论哪种方式，广告、导航等冗余内容都会被剔除。

  [阅读 Contents 文档 →](/zh/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "新的 Livecrawl 选项：Preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## 新的 Livecrawl 选项：Preferred
  </div>

  <Warning>
    历史条目：`livecrawl` 字符串参数现已弃用。新的集成请使用 `maxAgeHours` 配合 `livecrawlTimeout`。参见[内容新鲜度](/zh/docs/contents/quickstart#content-freshness)。
  </Warning>

  已弃用的 `livecrawl: "preferred"` 选项会尝试进行一次实时抓取，抓取失败时则回退到缓存内容 (与 `"always"` 不同，后者会直接报错) 。非常适合既想获取最新内容、又不希望因站点临时不可用而失败的生产应用。

  [阅读内容新鲜度文档 →](/zh/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Contents 端点状态变更" }}>
  <div id="contents-endpoint-status-changes">
    ## Contents 端点状态变更
  </div>

  `/contents` 现在返回按 URL 区分的 `statuses` 字段，而不是单一的 HTTP 错误，因此你可以逐个处理每个 URL 的结果。该端点仅在出现内部问题时报错。

  * **`status`**：每个 URL 为 `"success"` 或 `"error"`。
  * **`error.tag`**：例如 `CRAWL_NOT_FOUND`、`CRAWL_TIMEOUT`、`SOURCE_NOT_AVAILABLE`，并附带 `httpStatusCode`。

  [阅读错误码参考 →](/zh/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto 搜索成为默认方式" }}>
  <div id="auto-search-as-default">
    ## Auto 搜索成为默认方式
  </div>

  Auto 搜索现已成为默认方式，会自动将每个 query 路由到最合适的搜索方法。无需任何操作；如需保持此前的行为，请设置 `type="neural"`。

  [了解 Exa 的搜索类型 →](/zh/docs/search/quickstart)
</Update>