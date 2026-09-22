> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="news">
  # 新闻
</div>

> 使用 Exa Search 查找最新报道、行业动态和新兴话题。

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="在 API 演练场中打开" aria-label={`在 API 演练场中打开“${query}”`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

使用 Exa Search 检索主流媒体、行业媒体和垂直小众媒体的报道。新文章发布后几分钟内即可被搜索到。若对发布时间窗口有硬性要求，可将自然语言 query 与日期筛选条件结合使用。

<div id="use-it-for">
  ## 适用场景
</div>

* 市场与投资研究
* 网络安全与威胁情报
* 公司、产品与竞争对手监测
* 行业简报与时事研究

<div id="example-queries">
  ## 查询示例
</div>

<div id="follow-a-developing-policy-story">
  ### 追踪持续发酵的政策事件
</div>

指明主题、来源类型和发布时间窗口，让结果聚焦于事件的当前阶段。

<PlaygroundQuery query="news coverage of the EU AI Act enforcement timeline published this month" />

<div id="find-practitioner-analysis">
  ### 查找从业者分析
</div>

如果你想获取从业者的分析而非泛泛的新闻报道，请在 query 中指明来源类型。

<PlaygroundQuery query="engineering blog posts about migrating from Postgres to ClickHouse" />

<div id="discover-discussions-in-a-specific-format">
  ### 发现特定形式的讨论
</div>

在 query 中同时写明形式和主题，这样搜索就能覆盖全网的单集页面和会议记录。

<PlaygroundQuery query="podcast episodes where founders discuss pricing strategy mistakes" />

<div id="research-adverse-media">
  ### 研究负面媒体报道
</div>

请同时描述负面信号和你要调查的实体类别，不要把 query 简化成&quot;公司名 + news&quot;。

<PlaygroundQuery query="negative press and regulatory complaints about payday lending companies" />

<div id="make-a-request">
  ## 发起请求
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "news articles about AI regulation updates in the European Union",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "news articles about AI regulation updates in the European Union",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "news articles about AI regulation updates in the European Union",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## 使用 Exa Agent 获取结构化数据
</div>

如果所需的结构化数据需要跨多个来源进行研究，可使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。描述你需要的报道、field 和时间范围，agent 会返回经过 schema 校验的结果及引用来源。

<Card title="启动一个 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  生成带来源的新闻简报、对比报道口径，或从持续发展的事件中提取标准化事实。
</Card>