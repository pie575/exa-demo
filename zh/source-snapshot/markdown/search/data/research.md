> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="research-publications">
  # 研究文献
</div>

> 使用 Exa Search 查找学术论文、专利、科研资助、临床试验和监管批准信息。

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

使用 Exa Search 检索研究文献及相关记录，包括标题、摘要、作者、发表会议或期刊、引用来源、出版商页面、预印本以及代码仓库页面。

<Tip>
  阅读 [SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search)，
  进一步了解文献搜索的质量表现。
</Tip>

<div id="included">
  ## 包含内容
</div>

* 论文与预印本，若有解析好的 full text，则包含 full text 分块
* 专利，含摘要、权利要求、发明人和受让人
* 科研资助与资助公告
* 临床试验、药品说明书及药物相互作用数据
* 监管与卫生批准

<div id="use-it-for">
  ## 适用场景
</div>

* 文献综述与引用来源查找
* 现有技术检索与专利布局分析
* 临床与制药研究
* 科研资助与经费机会发掘

<div id="example-queries">
  ## 查询示例
</div>

<div id="find-papers-on-a-topic">
  ### 查找某个主题的论文
</div>

请描述方法或研究发现，而不是去猜测标题中的关键词。`publication` 类别可将结果限定为论文。

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

<div id="search-clinical-evidence">
  ### 检索临床证据
</div>

明确写出试验分期、干预措施和人群，让试验注册登记和结果页面的排名高于泛泛的报道。

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

<div id="track-regulatory-approvals">
  ### 追踪监管批准
</div>

指明你关注的监管机构以及设备或药物类别。

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

<div id="run-a-prior-art-search">
  ### 运行现有技术检索
</div>

像撰写权利要求那样，从功能角度描述该发明，而不要使用产品名称。

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="make-a-request">
  ## 发起请求
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "papers on evaluation benchmarks for retrieval-augmented generation",
      type="auto",
      category="publication",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "papers on evaluation benchmarks for retrieval-augmented generation",
    {
      type: "auto",
      category: "publication",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "papers on evaluation benchmarks for retrieval-augmented generation",
      "type": "auto",
      "category": "publication",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## 使用 Exa Agent 获取结构化数据
</div>

若所需的结构化数据需要跨多个来源开展研究，可使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述你需要的文献、纳入 criteria 和输出 fields，agent 即会返回经 schema 校验的结果及引用来源。

<Card title="启动 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  构建文献图谱、按纳入 criteria 筛选论文，或将多篇文献中的 fields 汇总到一个表格中。
</Card>