> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

# 常见问题 {#faqs}

> 关于 Exa 产品、搜索索引、新鲜度、grounding、安全性和定价的常见问题解答。

<AccordionGroup>
  <Accordion title="什么是 Exa？">
    Exa 为 AI 应用提供网页搜索与研究基础设施。它将独立的搜索索引与内容提取、agentic research API 结合起来，使应用能够查找来源、获取其页面内容，并生成有据可依的输出。
  </Accordion>

  <Accordion title="我该使用哪个 Exa 产品？">
    * 使用 [Search API](/zh/docs/search/quickstart) 查找经过排序的网页结果，并可选择返回 highlights、full text 或摘要。
    * 当你已有 URL、需要提取其页面内容时，使用 [Contents API](/zh/docs/contents/quickstart)。
    * 需要异步、多步骤的研究、列表构建和结构化增强时，使用 [Agent API](/zh/docs/agent/quickstart)。
    * 使用 [Monitors](/zh/docs/monitors/quickstart) 周期性地运行 search，并接收新发现的结果。
  </Accordion>

  <Accordion title="什么是 Exa Connect？">
    [Exa Connect](/zh/docs/agent/connect/overview) 让 Exa Agent 在同一次运行中既能访问高级数据提供方，也能使用网页搜索。通过 `dataSources` 添加提供方后，Exa Agent 会自行决定何时查询各个来源，并将合作伙伴数据与网页研究合并为一份有据可依的结构化输出。

    对于自助式提供方，Exa 会处理提供方认证与用量计费，你无需另行构建 integration 或单独开设提供方账户。
  </Accordion>

  <Accordion title="Exa Search 有什么不同？">
    Exa Search 面向程序化 retrieval 而构建，而非广告驱动的浏览。它可以按语义搜索、接受自然语言 query，并在同一次请求中返回页面内容。搜索模式涵盖从低延迟 retrieval 到带结构化输出的多步骤研究。

    可用的搜索类型和响应格式请参见 [Search 快速开始](/zh/docs/search/quickstart)。
  </Accordion>

  <Accordion title="Exa 的索引有多大？">
    截至 2026 年 8 月，Exa 的索引已跟踪 1.4 万亿个 URL，并提供来自公开网络的 1000 亿个页面。随着页面被发现、刷新或移除，索引也在持续变化。
  </Accordion>

  <Accordion title="Exa 的结果有多新？">
    Exa 会持续发现并刷新页面，具体时间取决于来源以及页面的更新频率。当你需要比索引副本更新的内容时，可使用 Contents API 的 [`maxAgeHours`](/zh/docs/contents/quickstart#content-freshness) 选项来控制缓存时效和实时 retrieval。
  </Accordion>

  <Accordion title="Exa 是否运行爬虫？">
    是的。Exa 运行 `ExaSearchBot` 来发现并刷新公开网络上的页面，用于 search 与 retrieval。它遵循 Robots Exclusion Protocol，会限制对每个站点的请求速率，并且不会尝试绕过登录、付费墙或 CAPTCHA。

    抓取行为由 `robots.txt` 控制。若要移除已被索引的页面，可使用 `noindex` robots meta 标签或 `X-Robots-Tag: noindex` 响应 header；Exa 会在下次重新抓取后移除该页面。有关 user agent、加密验证方法及爬虫控制，请参见 [Exa Search Crawler](https://crawler.exa.ai/)。
  </Accordion>

  <Accordion title="Exa 如何帮助让 LLM 响应有据可依？">
    Exa 会返回来源 URL 以及用于 retrieval 的网页内容，使应用能够生成带引用来源的答案并查验支撑证据。高质量的 search 与来源 grounding 可以减少缺乏依据的表述，但如何解读和呈现检索到的信息，仍由应用及其语言模型负责。
  </Accordion>

  <Accordion title="我可以限制 Exa 搜索的来源吗？">
    可以。使用 `includeDomains` 将 Search 限定在指定域名，或使用 `excludeDomains` 排除不需要的来源。Exa 还提供面向特定来源 retrieval 的数据类别，例如公司、人物、新闻和代码。参见 [Search 最佳实践](/zh/docs/search/best-practices)和 [Data](/zh/docs/search/data/overview)。
  </Accordion>

  <Accordion title="有哪些安全和数据保留选项？">
    Exa 为 production 和企业用例提供安全与合规控制，包括面向符合条件的 Enterprise 客户的 [Zero Data Retention](/zh/docs/admin/security/zero-data-retention) 和 [HIPAA compliance](/zh/docs/admin/security/hipaa)。详情请参见 [Security &amp; Compliance](/zh/docs/admin/security/overview)。
  </Accordion>

  <Accordion title="Exa 的定价如何计算？">
    API 用量会按所使用的端点和选项从账户积分中扣除。新账户可获得免费积分；除非你的组织签有企业合同，付费用量均为按需付费。参见 [Pricing](/zh/docs/admin/pricing) 和 [Billing](/zh/docs/admin/billing)。
  </Accordion>
</AccordionGroup>