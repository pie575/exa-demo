> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="faqs">
  # 常见问题
</div>

> 关于 Exa 产品、搜索索引、时效性、grounding、安全性和定价的常见问题解答。

<AccordionGroup>
  <Accordion title="什么是 Exa？">
    Exa 为 AI 应用提供网页搜索与研究基础设施。它将独立的搜索索引与内容提取、agent 式研究 API 相结合，使应用能够查找来源、获取其内容，并生成有依据的输出。
  </Accordion>

  <Accordion title="我该使用哪个 Exa 产品？">
    * 使用 [Search API](/zh/docs/search/quickstart) 查找经过排序的网页结果，并可选择返回 highlights、全文或摘要。
    * 当你已有 URL 且需要提取其内容时，使用 [Contents API](/zh/docs/contents/quickstart)。
    * 需要进行异步的多步研究、列表构建和结构化 enrichment 时，使用 [Agent API](/zh/docs/agent/quickstart)。
    * 使用 [Monitors](/zh/docs/monitors/quickstart) 定期运行搜索并接收新发现的结果。
  </Accordion>

  <Accordion title="什么是 Exa Connect？">
    [Exa Connect](/zh/docs/agent/connect/overview) 让 Exa Agent 在同一次运行中既能访问优质数据提供方，也能使用网页搜索。通过 `dataSources` 添加提供方后，Exa Agent 会自行决定何时查询各个来源，再将合作伙伴数据与网络研究结果整合为一份有依据的结构化输出。

    对于自助接入的提供方，Exa 会处理提供方的身份验证与用量计费，因此你无需另行构建集成或单独开通提供方账户。
  </Accordion>

  <Accordion title="Exa Search 有何不同？">
    Exa Search 专为程序化检索而非广告驱动的浏览而构建。它可以按语义搜索、接受自然语言 query，并在同一请求中返回 page contents。搜索模式涵盖从低延迟检索到带结构化输出的多步研究。

    可用的搜索类型和响应格式请参阅 [Search 快速开始](/zh/docs/search/quickstart)。
  </Accordion>

  <Accordion title="Exa 的索引有多大？">
    截至 2026 年 8 月，Exa 的索引已追踪 1.4 万亿个 URL，并提供来自公开网络的 1000 亿个页面。随着页面被发现、刷新或移除，索引持续变化。
  </Accordion>

  <Accordion title="Exa 的结果有多新？">
    Exa 持续发现并刷新页面，具体时效因来源以及页面变更频率而异。当你需要比索引副本更新的内容时，可使用 Contents API 的 [`maxAgeHours`](/zh/docs/contents/quickstart#content-freshness) 选项来控制缓存时效与实时抓取。
  </Accordion>

  <Accordion title="Exa 运行爬虫吗？">
    是的。Exa 运行 `ExaSearchBot` 来发现并刷新公开网络上的页面，用于搜索与检索。它遵循 Robots 排除协议，限制对各站点的请求速率，并且不会尝试绕过登录、付费墙或验证码。

    抓取行为由 `robots.txt` 控制。若要移除已被索引的页面，请使用 `noindex` robots meta 标签或 `X-Robots-Tag: noindex` 响应头；Exa 会在下一次重新抓取后移除该页面。有关用户代理、加密验证说明和爬虫控制，请参阅 [Exa Search Crawler](https://crawler.exa.ai/)。
  </Accordion>

  <Accordion title="Exa 如何帮助为 LLM 回复提供依据？">
    Exa 会返回来源 URL 以及用于检索的网页内容，使应用能够生成带引用的答案并查验支持证据。搜索质量和来源 grounding 有助于减少无依据的论断，但如何解读和呈现检索到的信息，仍由应用及其语言模型负责。
  </Accordion>

  <Accordion title="我可以限制 Exa 搜索哪些来源吗？">
    可以。使用 `includeDomains` 将 Search 限定在选定域名，或使用 `excludeDomains` 排除不需要的来源。Exa 还提供面向特定来源检索的数据类别，例如公司、人物、新闻和代码。请参阅 [Search 最佳实践](/zh/docs/search/best-practices) 和 [Data](/zh/docs/search/data/overview)。
  </Accordion>

  <Accordion title="有哪些安全和数据留存选项？">
    Exa 为生产和企业用例提供安全与合规控制，包括面向符合条件的企业客户的 [零数据留存](/zh/docs/admin/security/zero-data-retention) 和 [HIPAA 合规](/zh/docs/admin/security/hipaa)。详情请参阅 [安全与合规](/zh/docs/admin/security/overview)。
  </Accordion>

  <Accordion title="Exa 如何计费？">
    API 用量会根据所用的端点和选项，从账户积分中扣费。新账户可获得免费积分；除非你的组织签有企业合同，付费用量均为按需付费。请参阅 [定价](/zh/docs/admin/pricing) 和 [账单](/zh/docs/admin/billing)。
  </Accordion>
</AccordionGroup>