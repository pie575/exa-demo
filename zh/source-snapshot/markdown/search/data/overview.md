> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="data-index">
  # 数据索引
</div>

> Exa 从公开网络和私有数据源中索引哪些内容。

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="在 API Playground 中打开" aria-label={`在 API Playground 中打开“${query}”`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Exa 会搜索公开网络以及精选的私有数据源，索引覆盖持续更新。具体包括：

<AccordionGroup>
  <Accordion title="新闻" icon="newspaper">
    <Card title="新闻指南" icon="newspaper" href="/zh/docs/search/data/news" cta="阅读指南" arrow="true">
      探索新闻搜索的使用场景、示例和最佳实践。
    </Card>

    新闻与文章：

    <PlaygroundQuery query="coverage of the EU AI Act enforcement timeline published this month" />

    博客文章与清单式文章：

    <PlaygroundQuery query="engineering blog posts about migrating from Postgres to ClickHouse" />

    播客与视频文字稿：

    <PlaygroundQuery query="podcast episodes where founders discuss pricing strategy mistakes" />

    负面舆情：

    <PlaygroundQuery query="negative press and regulatory complaints about payday lending companies" />
  </Accordion>

  <Accordion title="代码与文档" icon="code">
    <Card title="代码与文档指南" icon="code" href="/zh/docs/search/data/code" cta="阅读指南" arrow="true">
      探索代码搜索的使用场景、示例与最佳实践。
    </Card>

    GitHub 仓库：

    <PlaygroundQuery query="open source Rust libraries for vector similarity search" />

    API 与开发者文档：

    <PlaygroundQuery query="Stripe webhook signature verification documentation" />

    软件包注册表，含精确的版本与发布详情：

    <PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

    Agent 技能目录：

    <PlaygroundQuery query="agent skills for extracting tables from PDFs" />
  </Accordion>

  <Accordion title="公司与人物" icon="users">
    <Card title="公司与人物指南" icon="users" href="/zh/docs/search/data/companies-people" cta="阅读指南" arrow="true">
      了解如何查找公司、人物以及两者之间的关系。
    </Card>

    公司发现与经营信号：

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    按职位、技能和地点查找职业档案：

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    按任职公司筛选人物：

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    一次 query 同时调研公司与关键人员：

    <PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />
  </Accordion>

  <Accordion title="金融市场" icon="chart-line">
    <Card title="金融市场指南" icon="chart-line" href="/zh/docs/search/data/financial" cta="阅读指南" arrow="true">
      探索行情报价、申报文件、财报电话会议与市场研究等应用场景。
    </Card>

    价格、分析师预测与财务报告：

    <PlaygroundQuery query="analyst price targets for NVIDIA after its most recent earnings" />

    SEC 申报文件、财报电话会议与境外申报文件：

    <PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" />

    已公布的融资信息及其他公开报道的数据：

    <PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

    已发布的经济数据与政府统计数据：

    <PlaygroundQuery query="most recent US CPI release and month-over-month change" />
  </Accordion>

  <Accordion title="研究论文" icon="book-open">
    <Card title="研究文献指南" icon="book-open" href="/zh/docs/search/data/research" cta="阅读指南" arrow="true">
      探索论文、专利、临床与监管等研究场景的用例。
    </Card>

    研究论文、专利与科研资助：

    <PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" />

    临床试验与药物相互作用：

    <PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

    监管与医疗审批：

    <PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />
  </Accordion>

  <Accordion title="法律与公共记录" icon="scale">
    <Card title="法律与公共记录指南" icon="scale" href="/zh/docs/search/data/legal" cta="阅读指南" arrow="true">
      探索判例法、专利、制裁名单和公共记录等应用场景。
    </Card>

    法律与法院记录：

    <PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

    制裁与监控名单：

    <PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

    政府公共合同：

    <PlaygroundQuery query="federal contracts awarded for cloud migration services" />

    人口普查及其他公共记录：

    <PlaygroundQuery query="census tract population change in the Austin metro area" />
  </Accordion>

  <Accordion title="体育、天气和地点" icon="map-pin">
    <Card title="体育、天气与地点指南" icon="map-pin" href="/zh/docs/search/data/sports-weather-places" cta="阅读指南" arrow="true">
      了解如何查询实时体育数据、天气预报和本地信息。
    </Card>

    实时比分、排名与赛程：

    <PlaygroundQuery query="NBA scores last night" />

    任意地点、任意日期的天气预报：

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    本地商家、场所与房产：

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />
  </Accordion>

  <Accordion title="网络安全" icon="shield">
    <Card title="网络安全指南" icon="shield" href="/zh/docs/search/data/security" cta="阅读指南" arrow="true">
      探索漏洞、安全公告和供应商风险等应用场景。
    </Card>

    安全公告：

    <PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

    CVE 与 GHSA 漏洞数据库：

    <PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

    数据子处理者清单与信任页面：

    <PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />
  </Accordion>
</AccordionGroup>

这些指南涵盖了常见的数据模式，但 Exa 的搜索范围还覆盖更广泛的公开网络，涵盖众多站点、格式和语言。