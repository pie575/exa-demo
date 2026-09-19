> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 请通过以下地址获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可借助该文件了解所有可用页面。

<div id="cybersecurity">
  # 网络安全
</div>

> 使用 Exa Search 查找漏洞、安全公告、威胁情报报告和信任文档。

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

使用 Exa Search，从安全团队日常关注的信息源中获取漏洞记录、厂商安全公告和威胁研究。

<div id="included">
  ## 包含内容
</div>

* CVE 与 GHSA 漏洞记录
* 厂商安全公告与补丁说明
* 威胁情报报告与事件复盘
* 信任中心页面、子处理方清单与合规文档
* 安全博客、会议演讲与研究成果

<div id="use-it-for">
  ## 适用场景
</div>

* 漏洞分级与暴露面评估
* 威胁情报与攻击者追踪
* 供应商风险与第三方安全审查
* 安全监控与告警

<div id="example-queries">
  ## 示例查询
</div>

<div id="triage-a-vulnerability-class">
  ### 对某类漏洞进行分级排查
</div>

指明产品、版本范围和严重程度。

<PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

<div id="find-vendor-advisories">
  ### 查找厂商安全公告
</div>

描述漏洞的利用状态和产品类别，而不是某个具体的 CVE 编号。

<PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

<div id="review-a-vendors-security-posture">
  ### 审查供应商的安全态势
</div>

指明文档类型和供应商类别。

<PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />

<div id="research-an-adversary">
  ### 调查攻击者
</div>

指明你关注的组织或攻击行动，以及相关攻击手法或行业领域。

<PlaygroundQuery query="reports on ransomware groups targeting healthcare providers this year" />

<div id="make-a-request">
  ## 发起请求
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "critical CVEs affecting Apache Struts 6.x",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "critical CVEs affecting Apache Struts 6.x",
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
      "query": "critical CVEs affecting Apache Struts 6.x",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## 使用 Exa Agent 获取结构化数据
</div>

如果结构化数据需要跨多个来源进行研究，可以使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述所需的产品、威胁判定标准和输出字段，Agent 就会返回经过 schema 校验的结果，并附上引用来源。

<Card title="启动 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  结合安全公告、数据泄露报道和信任中心页面审查供应商，或汇总标准化的漏洞数据。
</Card>