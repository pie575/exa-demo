> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，请先通过该文件查看所有可用页面。

<div id="financial-markets">
  # 金融市场
</div>

> 使用 Exa Search 查找市场数据、申报文件、财报电话会议和经济数据发布。

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
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1 2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

使用 Exa Search，在一次 query 中获取行情价格、申报文件、财报电话会议记录及其相关报道。针对某个股票代码的提问，可以同时返回报价、最新财报电话会议内容和分析师研报。

<div id="included">
  ## 包含内容
</div>

* 股票、加密货币、外汇、指数、期货、期权和大宗商品的报价及近期价格走势
* 证券概况，含关键统计指标和每日 OHLCV 历史数据
* 财报电话会议记录，含发言稿与问答环节，并标注发言人
* SEC 申报文件、已披露财务数据以及境外申报文件
* 分析师预测、融资公告和经济数据发布

<div id="use-it-for">
  ## 适用场景
</div>

* 股票与信用研究
* KYC、KYB 及负面舆情筛查
* 投资组合与政策监控
* 项目寻源与私募市场研究

<div id="example-queries">
  ## 查询示例
</div>

<div id="look-up-a-quote">
  ### 查询行情报价
</div>

给出股票代码或公司名称，并说明想要的数据。也可以使用美元标签，例如 `$NVDA`。

<PlaygroundQuery query="NVIDIA stock price and change today" />

<div id="read-an-earnings-call">
  ### 阅读财报电话会议
</div>

指明公司和季度，即可获取财报电话会议记录原文，而非相关报道。

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

<div id="search-filings">
  ### 检索申报文件
</div>

描述你想查找的披露内容，而不只是表格类型。`financial report` 类别会将结果限定在申报文件和报告范围内。

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

<div id="track-private-market-activity">
  ### 追踪一级市场动态
</div>

指定融资轮次、行业与时间范围。

<PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

<div id="follow-economic-data">
  ### 追踪经济数据
</div>

指明数据发布名称，以及你想从中获取的具体数值。

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

<div id="make-a-request">
  ## 发起请求
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "10-K risk factors that mention dependency on third-party AI models",
      type="auto",
      category="financial report",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "10-K risk factors that mention dependency on third-party AI models",
    {
      type: "auto",
      category: "financial report",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "10-K risk factors that mention dependency on third-party AI models",
      "type": "auto",
      "category": "financial report",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## 使用 Exa Agent 获取结构化数据
</div>

如果结构化数据需要跨多个来源进行研究，可以使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述所需的证券、时间区间、criteria 和输出字段，Agent 就会返回经过 schema 校验的结果，并附上引用来源。

<Card title="启动 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  筛选公司、比对申报文件，或为整个投资组合汇总一份结构化简报。
</Card>