> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

# 变更日志 {#changelog}

> 来自 Exa 的产品更新与公告。

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  ## Dynamic Highlights (研究预览) {#dynamic-highlights-research-preview}

  Dynamic Highlights 会在完整结果集范围内挑选摘录，而不是孤立地处理每个页面。它会把更多共享上下文预算分配给有价值的 source，而对只是重复已返回信息的 source 少分配上下文。

  * **单轮 RAG**：在编程与通用问答评测中，配合 Exa Auto 使用时，token 效率提升约 49%，下游质量提升 2.4%。
  * **agent**：在完整 agent 轨迹上 token 消耗减少约 30%，在 BrowseComp、WideSearch 以及内部公司与人物评测中质量提升 1%。

  设置了 `dynamic: true` 的请求需要携带 `Exa-Beta: dynamic-highlights-2026-08-28` header。

  [阅读 Dynamic Highlights 指南 →](/zh/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  ## 文献研究 {#publication-research}

  我们大幅扩展并改进了对学术文献的研究能力。

  * **3.5 亿篇文献**：可在 3.5 亿篇文献的索引中进行 search。
  * **更丰富的机构与人物结果**：search 现在会同时返回机构及其关联人物，每一项都是一份详尽且内容丰富的档案，涵盖文献、主要合作者、研究领域与资助情况。
  * **agent 化的人物与机构 search**：agent 现在可以对人物和机构进行 search。
  * **公开 retrieval 基准**：我们发布了面向文献 retrieval 的公开基准。
  * **新增 `publication` search 类别**：使用 `category: "publication"` 查询学术结果，该类别取代原有的 `research paper` 类别。
  * **已弃用的类别**：`pdf`、`github` 和 `tweet` search 类别正在逐步弃用。
  * **`startCrawlDate` / `endCrawlDate`**：这两个已弃用的 parameter 现对所有团队均被忽略，但为保持兼容仍可继续传入。

  通过 API 使用 `publication` [search 类别](/zh/docs/search/quickstart)进行查询，或[在控制台中试用 →](https://dashboard.exa.ai/playground/search?type=instant)。
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  ## MCP 中的 Exa Agent 与 Exa Connect {#exa-agent-and-exa-connect-in-mcp}

  Exa Agent 现已在 Exa MCP 中可用。当任务不止需要一次 search 调用时，可在 Claude、Cursor 或任意其他 MCP 客户端中使用它。

  使用 `https://mcp.exa.ai/mcp?tools=agent_run` 启用 Agent 工具，然后调用 `agent_run`，让 agent 运行至完成并返回输出。

  Exa Connect 数据源可通过 Agent flow 使用，因此当某次运行仅靠网页搜索还不够时，你可以接入优质数据合作伙伴。

  [阅读 Exa MCP 指南 →](/zh/docs/get-started/exa-mcp) · [阅读 Exa Agent 指南 →](/zh/docs/agent/quickstart) · [发布推文 →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  ## 推出 Exa Connect {#introducing-exa-connect}

  Exa Connect 让 Exa Agent 能够实时访问全球的公开与私有数据。首批上线的合作伙伴包括 Similarweb、Fiber.ai、Baselayer、Financial Datasets、Affiliate.com、Particle、Jinko 以及更多合作伙伴。你可以通过 `POST /agent/runs` 上的 `dataSources` 接入它们。

  [阅读 Exa Connect 指南 →](/zh/docs/agent/connect/overview) · [发布推文 →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  ## 推出 Exa Agent {#introducing-exa-agent}

  我们发布了新一代前沿网页研究 agent，可通过 API 使用。

  Exa Agent API 支持多种 parameter，包括自然语言 query、`effort` 模式、用于结构化输出的 `outputSchema`，以及用于在现有数据集基础上继续构建的 `input.data`。

  [阅读 Exa Agent API 指南 →](/zh/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "API 弃用通知" }}>
  ## API 弃用通知 {#api-deprecation-notice}

  我们下线了 Exa API 中的部分历史遗留项：

  * **`/research` 端点**：改用 `/search` 并设置 `type: "deep-reasoning"`。
  * **`resolvedSearchType` 和 `highlightScores` (响应 fields)&#x20;**：自 4 月 15 日起返回 `null`，5 月 1 日移除。
  * **`startCrawlDate` / `endCrawlDate` (已弃用的请求参数)&#x20;**：自 4 月 15 日起静默忽略。

  [迁移到深度搜索 →](/zh/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "隆重推出 Exa Monitors" }}>
  ## 隆重推出 Exa Monitors {#introducing-exa-monitors}

  Monitors 按 schedule 运行 Exa search，并将结果投递到你的 webhook，同时与此前的运行去重，因此你只会收到新增内容。

  * **持续跟踪话题**：competitor 动态、融资轮次、监管变化、研究论文。
  * **结构化结果**：通过 `outputSchema` 返回纯文本或带类型的 JSON。
  * **灵活的调度**：按 interval 运行 (最短 1 小时) 或手动触发。

  [阅读 Monitors API 指南 →](/zh/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Exa Deep 全面升级" }}>
  ## Exa Deep 全面升级 {#exa-deep-revamp}

  Exa Deep 更快、更便宜，现已支持带 field 级 grounding 的结构化输出。

  * **新增 `deep-reasoning` 类型**，适用于更高 effort 的任务 (12-50 秒) ；`deep` 的运行时间为 4-12 秒。
  * 常规 `deep` search **价格下调 20%**。
  * 通过 `outputSchema` 支持**结构化输出**，响应中包含 `output.content` 和 `output.grounding` (field 级引用来源与 confidence) 。

  完整定价请参阅下方的 [Exa 定价更新](#exa-pricing-update)。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Exa 定价更新" }}>
  ## Exa 定价更新 {#exa-pricing-update}

  我们简化并下调了定价。前 10 条搜索结果的页面内容现已免费包含，新定价自动生效，无需任何操作。

  * **带页面内容的 search**：每 1000 次请求 $7 (含 10 条结果、text + highlights) ；额外结果每 1000 条 $1。
  * **摘要**：每 1000 条 $1，search 与 页面内容 均适用。
  * **Exa Deep**：每 1000 次请求 $12；**Deep (Reasoning)** 每 1000 次请求 $15。
  * **页面内容端点**：每种内容类型每 1000 个页面 $1。

  [查看当前定价 →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "隆重推出 Exa Instant Search" }}>
  ## 隆重推出 Exa Instant Search {#introducing-exa-instant-search}

  Exa Instant 是我们最快的搜索类型，在提升 neural search 质量的同时将延迟控制在 150 毫秒以内。使用 `type="instant"` 即可启用。

  * **为实时场景打造**：聊天应用、语音 AI、编码智能体、自动补全和实时建议。
  * 以我们所能提供的最低延迟实现**业界领先的质量**。

  [阅读 Search API 指南 →](/zh/docs/search/quickstart) · [在控制台中试用 →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights、内容新鲜度与 MCP 更新" }}>
  ## Highlights、内容新鲜度与 MCP 更新 {#highlights-content-freshness-and-mcp-updates}

  内容提取与访问方面的三项改进：

  * **highlights 的 `maxCharacters`**：现已成为控制 highlight 长度的推荐方式。`numSentences` 和 `highlightsPerUrl` 已弃用。
  * **内容新鲜度的 `maxAgeHours`**：基于时长的控制方式，取代布尔值 `livecrawl` (`0` 表示始终抓取，`-1` 表示仅使用缓存，`24` 表示超过 24 小时才抓取) 。
  * **Exa MCP 免费额度**：可在未认证状态下试用，限 3 QPS、每天 150 次调用；添加 API 密钥即可获得完整访问权限。

  [内容新鲜度文档 →](/zh/docs/contents/quickstart#content-freshness) · [Exa MCP →](/zh/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Introducing Exa Company Search" }}>
  ## 推出 Exa Company Search {#introducing-exa-company-search}

  公司搜索现已采用微调的 retrieval 模型和实体匹配 pipeline。使用 `type="auto"`、`category="company"`。

  * **多维属性精准匹配**：行业、地域、融资阶段和员工人数。
  * **结构化实体数据**：返回带类型的公司信息 (员工规模、总部、财务数据、网站 traffic) 。
  * **适用场景**：销售线索挖掘、市场研究和供应链工作流。

  [阅读 Companies &amp; People Search 文档 →](/zh/docs/search/data/companies-people) · [阅读基准测试博客 →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Introducing Exa People Search" }}>
  ## 推出 Exa People Search {#introducing-exa-people-search}

  人物搜索现已通过混合 retrieval 系统覆盖超过 10 亿份公开资料。`linkedin` 类别由新的 `people` 类别取代。

  * **覆盖更广**：涵盖全网资料，不再局限于 LinkedIn。
  * **准确度更高**：针对职位、技能和公司 query 微调的嵌入模型。
  * **适用场景**：销售、招聘和市场研究。

  [阅读 Companies &amp; People Search 文档 →](/zh/docs/search/data/companies-people) · [阅读基准测试博客 →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: highlights restored" }}>
  ## JS SDK：恢复 highlights {#js-sdk-highlights-restored}

  自 `exa-js` v2.0.11 起，highlights 回归 JavaScript SDK，返回带相关性分数的关键句子。在 search 和 contents 调用中传入 `highlights: true` 或 `highlights: { maxCharacters, query }` 即可。

  [阅读 JavaScript SDK 文档 →](/zh/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "New Deep Search Type" }}>
  ## 新增深度搜索类型 {#new-deep-search-type}

  Exa Deep 会同时运行多个 search，并为每条结果返回高质量上下文，从而得到更优结果。使用 `type="deep"` 启用。

  * **Query 扩展**：只需发送一个 query，我们会自动生成多个变体，你也可以通过 `additionalQueries` 自行提供。
  * **并行 search 与智能排序**：覆盖你的 query 及所有变体。
  * 为每条结果提供**详细摘要**。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Added Language Filtering" }}>
  ## 新增语言过滤 {#added-language-filtering}

  Exa 现在会检测你的 query 语言，并仅返回该语言的结果。所有用户默认启用，无需任何配置。

  [阅读 Search API 指南 →](/zh/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "SDK changes: highlights removed and contents returned by default" }}>
  ## SDK 变更：移除 highlights，默认返回页面内容 {#sdk-changes-highlights-removed-and-contents-returned-by-default}

  这是一个包含破坏性变更的大版本 SDK 更新：

  * **默认返回页面内容**：search 现在会包含页面内容；也可关闭以加快 search 速度。
  * **SDK 中移除 highlights**：后来已在 JS SDK 中恢复，参见 [JS SDK：恢复 highlights](#js-sdk-highlights-restored)。
  * **`use_autoprompt` 已弃用**：已从所有 API 响应中移除。

  [阅读 Python SDK 文档 →](/zh/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Domain Path Filter Support" }}>
  ## 支持域名路径过滤 {#domain-path-filter-support}

  `includeDomains` 和 `excludeDomains` 现在支持更精细的定位：

  * **路径级过滤**：例如 `exa.ai/blog` 或 `linkedin.com/company`。
  * **子域名通配符**：例如 `*.substack.com`。

  适合将 search 范围限定在博客、产品目录或索引站点。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Geolocation Filter Support" }}>
  ## 支持地理位置过滤 {#geolocation-filter-support}

  新增的 `userLocation` 参数可让结果偏向用户所在地区，传入 [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 国家代码即可 (例如 `"us"`、`"fr"`) 。适合多地区应用、地区语言内容和本地信息发现。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "全新 Fast 搜索类型" }}>
  ## 全新 Fast 搜索类型 {#new-fast-search-type}

  Exa Fast 采用精简的搜索模型，p50 延迟低于 425ms。通过 `type="fast"` 即可启用。

  * **与 neural search 相同的 Exa 索引**，内容质量一致。
  * **与其他搜索类型完全参数兼容**。
  * **专为**快速网页 grounding、agent 工作流和低延迟产品**打造**。

  [阅读 Search API 指南 →](/zh/docs/search/quickstart) · [在控制台中试用 →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Auto Search 中 Score 的弃用" }}>
  ## Auto Search 中 Score 的弃用 {#score-deprecation-in-auto-search}

  新的 Auto search 架构已无法给出有意义的相关性分数，因此 `score` field 将从 Auto search 结果中移除。

  * **Auto search**：不再返回 `score`；结果本身已按相关性排序。
  * **Neural search**：分数保持不变。如果你依赖分数，请设置 `type="neural"`。

  [阅读 Search API 参考 →](/zh/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Markdown 页面内容成为默认" }}>
  ## Markdown 页面内容成为默认 {#markdown-contents-as-default}

  所有端点现在默认返回干净的 markdown，更适合 LLM、RAG 以及一般的文本处理。无需任何改动。

  * **`includeHtmlTags=false` (默认)&#x20;**：内容会被处理为干净的 markdown。
  * **`includeHtmlTags=true`**：返回原始 HTML，不做 markdown 处理。

  无论哪种方式，广告、导航等冗余内容都会被剥离。

  [阅读页面内容文档 →](/zh/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "新的 Livecrawl 选项：Preferred" }}>
  ## 新的 Livecrawl 选项：Preferred {#new-livecrawl-option-preferred}

  <Warning>
    历史条目：`livecrawl` 字符串参数现已弃用。新的 integration 请使用 `maxAgeHours` 搭配 `livecrawlTimeout`。参见 [内容新鲜度](/zh/docs/contents/quickstart#content-freshness)。
  </Warning>

  已弃用的 `livecrawl: "preferred"` 选项会尝试重新抓取，但抓取失败时会回退到缓存内容 (不同于 `"always"`，后者会直接报错) 。非常适合既想获取新鲜内容、又不希望因站点临时不可用而失败的 production 应用。

  [阅读内容新鲜度文档 →](/zh/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "页面内容端点状态变更" }}>
  ## 页面内容端点状态变更 {#contents-endpoint-status-changes}

  `/contents` 现在返回按 URL 区分的 `statuses` field，而不是单个 HTTP 错误，因此你可以分别处理每个 URL 的结果。该端点仅在出现内部问题时才会报错。

  * **`status`**：每个 URL 对应 `"success"` 或 `"error"`。
  * **`error.tag`**：例如 `CRAWL_NOT_FOUND`、`CRAWL_TIMEOUT`、`SOURCE_NOT_AVAILABLE`，并附带 `httpStatusCode`。

  [阅读错误码参考 →](/zh/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search 成为默认" }}>
  ## Auto search 成为默认 {#auto-search-as-default}

  Auto search 现已成为默认设置，会自动将每个 query 路由到最合适的搜索方式。无需任何改动；设置 `type="neural"` 即可保持此前的行为。

  [了解 Exa 的搜索类型 →](/zh/docs/search/quickstart)
</Update>