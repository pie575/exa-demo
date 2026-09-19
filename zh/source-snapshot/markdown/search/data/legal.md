> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="legal-public-records">
  # 法律与公共记录
</div>

> 使用 Exa Search 查找法院判决意见、专利、制裁名单、政府合同以及其他公共记录。

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

使用 Exa Search 检索一手法律文献和政府记录，以及针对这些内容撰写的评述。

<div id="included">
  ## 包含内容
</div>

* 美国法院判决意见，含全文、法院、案卷号及引用信息等元数据
* 已授权的美国专利，含摘要、权利要求、说明书、发明人及受让人
* 法律、法规及监管机构指引
* 制裁名单与监控名单
* 政府合同与采购记录
* 人口普查数据及其他公共统计记录

<div id="use-it-for">
  ## 适用场景
</div>

* 判例法研究与法律 RAG
* 法规与政策监测
* 现有技术检索与自由实施(FTO)检索
* 合规筛查与尽职调查
* 公共部门市场研究

<div id="example-queries">
  ## 查询示例
</div>

<div id="find-case-law">
  ### 查找判例法
</div>

用通俗语言描述法律问题和司法管辖区，而不是直接给出案例引证。

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

<div id="search-patents">
  ### 检索专利
</div>

像撰写权利要求那样，描述这项发明的功能。

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="screen-against-sanctions">
  ### 制裁名单筛查
</div>

指明要筛查的名单以及实体类别。

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

<div id="research-government-spending">
  ### 研究政府支出
</div>

指明采购机构或服务类别，以及时间范围。

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

<div id="pull-public-statistics">
  ### 提取公开统计数据
</div>

指明数据集和地理范围。

<PlaygroundQuery query="census tract population change in the Austin metro area" />

<div id="make-a-request">
  ## 发起请求
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "California appellate decisions on non-compete enforceability",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "California appellate decisions on non-compete enforceability",
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
      "query": "California appellate decisions on non-compete enforceability",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## 使用 Exa Agent 获取结构化数据
</div>

如果结构化数据需要跨多个来源进行研究，可使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述所需的司法管辖区、记录类型、criteria 和输出字段，Agent 即可返回经 schema 校验的结果，并附带引用来源。

<Card title="启动 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  跨记录类型筛查某一实体，或通过一手来源与相关报道追溯某项监管变更。
</Card>