> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# 金融市场 {#financial-markets}

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
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

使用 Exa Search，在一次 query 中获取价格、申报文件、会议记录以及相关报道。针对某个股票代码的提问，可以同时返回报价、最新的财报电话会议和分析师研究内容。

## 包含内容 {#included}

* 股票、加密货币、外汇、指数、期货、期权和大宗商品的报价及近期价格走势
* 证券概况，包含关键统计指标和每日 OHLCV 历史数据
* 财报电话会议记录，包含发言稿内容以及标注发言人的问答环节
* SEC 备案文件、已披露的财务数据以及国际申报文件
* 分析师预测、融资公告和经济数据发布

## 适用场景 {#use-it-for}

* 股票与信用研究
* KYC、KYB 及负面媒体信息筛查
* 投资组合与政策监控
* 项目寻源与私募市场研究

## 示例查询 {#example-queries}

### 查询报价 {#look-up-a-quote}

写明股票代码或公司名称，以及你想要的数据。使用 `$NVDA` 这类美元标签 (cashtag) 同样有效。

<PlaygroundQuery query="NVIDIA stock price and change today" />

### 阅读财报电话会议 {#read-an-earnings-call}

指明公司和季度，以获取会议记录本身，而非相关报道。

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

### 搜索申报文件 {#search-filings}

描述你要查找的披露内容，而不只是表格类型。`financial report` 类别会将结果限定在申报文件和报告范围内。

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

### 追踪一级市场动态 {#track-private-market-activity}

指定融资轮次、行业赛道和时间范围。

<PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

### 跟踪经济数据 {#follow-economic-data}

指明数据发布的名称，以及你想从中获取的具体数值。

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

## 发起请求 {#make-a-request}

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

## 使用 Exa Agent 获取结构化数据 {#get-structured-data-with-exa-agent}

若所需的结构化数据需要跨多个信息来源开展研究，可以使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述你需要的证券、时间区间、criteria 和输出 fields，agent 即会返回经 schema 校验的结果及引用来源。

<Card title="启动一个 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  筛选公司、对比申报文件，或为整个投资组合汇总一份结构化简报。
</Card>