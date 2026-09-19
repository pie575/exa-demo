> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

<div id="companies-people">
  # 公司与人物
</div>

> 使用 Exa Search 查找公司、职业档案以及两者之间的关联。

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

使用 Exa Search 查找企业机构以及与之相关的人员。这两类搜索搭配使用效果最佳：既可以描述用于筛选人员的公司特征，也可以描述能反映公司运作方式的人员与职位。

<Columns cols={2}>
  <Card title="公司检索基准测试" icon="building" href="https://exa.ai/blog/company-search-benchmarks">
    了解 Exa 如何评估公司检索与事实提取能力。
  </Card>

  <Card title="人员检索基准测试" icon="users" href="https://exa.ai/blog/people-search-benchmark">
    了解 Exa 如何评估精准查找与人物档案发现能力。
  </Card>
</Columns>

<div id="use-it-for">
  ## 适用场景
</div>

* 公司、候选人与专家发掘
* 客户研究与关键干系人梳理
* 市场版图、投资研究与项目源挖掘
* 领导层、招聘与组织架构研究

<div id="write-better-queries">
  ## 写出更好的 query
</div>

先明确你想找的实体，再补充用于限定它的特征和关系。当来源类型很重要时，请直接指明，例如公司主页、职业档案、招聘信息或个人网站。

<Tabs>
  <Tab title="公司" icon="building">
    <div id="discover-companies-by-what-they-do">
      ### 按业务内容发现公司
    </div>

    描述界定该市场的客户、产品、能力、阶段和地域。这样可以根据公司实际在做什么来找到候选对象，而不必依赖预先定义好的公司名单。

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    <div id="find-operating-signals">
      ### 捕捉经营信号
    </div>

    说明你关注的信号以及重要的公司特征。search 在检索公司页面的同时，还能获取招聘信息、定价页面、产品文档和相关报道。

    <PlaygroundQuery query="remote staff engineer roles at Series B fintech companies" />

    <div id="research-funding-activity">
      ### 研究融资动态
    </div>

    指明轮次、行业、参与方和时间范围。

    <PlaygroundQuery query="investors who led seed rounds in robotics in the last year" />
  </Tab>

  <Tab title="人物" icon="users">
    <div id="discover-people-by-role-and-skills">
      ### 按职位和技能发现人物
    </div>

    把职位、资历、地点、相关技能和你想要的来源类型组合起来。

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    <div id="qualify-people-by-company-traits">
      ### 按公司特征筛选人物
    </div>

    描述此人与公司的关系，以及用于限定公司的特征。这比先整理一份公司名单效果更好。

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    <div id="find-personal-websites-and-public-work">
      ### 查找个人网站和公开作品
    </div>

    说明职业或研究领域，并明确要求个人网站、演讲、访谈或文章。

    <PlaygroundQuery query="personal blogs of distributed systems researchers" />
  </Tab>
</Tabs>

<div id="search-both-together">
  ## 同时检索两者
</div>

用一条 query 表达你需要的关联关系。Exa 可以在同一组结果中返回公司页面、职业档案、招聘页面和公开引用。

<PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />

<div id="make-a-request">
  ## 发起请求
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "heads of security at Series B healthcare software companies that sell to hospitals",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "heads of security at Series B healthcare software companies that sell to hospitals",
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
      "query": "heads of security at Series B healthcare software companies that sell to hospitals",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## 使用 Exa Agent 获取结构化数据
</div>

如果结构化数据需要跨多个来源进行调研，请使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述你需要的公司、人物、筛选 criteria 和输出字段，Agent 即可返回通过 schema 校验的结果，并附带引用来源。

<Card title="启动 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  构建并筛选公司或人物列表，再用从多个来源收集的字段丰富每条记录。
</Card>