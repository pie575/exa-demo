> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步浏览之前，可通过该文件查看所有可用页面。

# 代码与文档 {#code-docs}

> 使用 Exa Search 查找代码、技术文档和实现指导。

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

使用 Exa Search，通过自然语言查询检索代码仓库、技术文档、包信息以及实现方面的指引。

<Tip>
  阅读 [WebCode: Search Evals for 编码智能体](https://exa.ai/blog/webcode)，了解 Exa
  如何评估编码任务中的 retrieval 效果。
</Tip>

## 适用场景 {#use-it-for}

* 编码智能体与代码生成工具
* 面向开发者的搜索和文档类产品
* 调试、迁移与配置工作流
* 跨代码仓库、文档和包注册表的技术研究

## 示例查询 {#example-queries}

### 按能力发现库 {#discover-libraries-by-capability}

描述你关注的能力、生态系统和约束条件。这样可以根据库的实际功能来检索候选项，而无需依赖确切的项目名称。

<PlaygroundQuery query="open source Rust libraries for vector similarity search" />

### 检索实现文档 {#retrieve-implementation-documentation}

指明产品名称和具体操作。这样 search 就能优先返回 API 文档和实现指南，而不是泛泛的讨论内容。

<PlaygroundQuery query="Stripe webhook signature verification documentation" />

### 检查特定版本的变更 {#check-version-specific-changes}

当兼容性很重要时，请在 query 中注明发布渠道或版本号，这样可以减少与旧版本相关的结果。

<PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

### 查找可复用的 agent 工具 {#find-reusable-agent-tooling}

请直接说明所需的产物类型和任务，而不要搜索“AI 工具”这类宽泛的说法。

<PlaygroundQuery query="agent skills for extracting tables from PDFs" />

## 发起请求 {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "how to use Exa search in python",
      type="fast",
      num_results=10,
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "how to use Exa search in python",
    {
      type: "fast",
      numResults: 10,
      contents: {
        highlights: true,
      },
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "how to use Exa search in python",
      "type": "fast",
      "numResults": 10,
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

## 使用 Exa Agent 获取结构化数据 {#get-structured-data-with-exa-agent}

如果结构化数据需要跨多个来源开展研究，可使用 [Exa Agent 任务运行](/zh/docs/agent/quickstart)。只需描述你需要的库、技术 criteria 和输出 fields，agent 即可返回经过 schema 校验的结果及引用来源。

<Card title="启动 Agent 任务" icon="bot" href="/zh/docs/agent/quickstart" cta="打开 Agent 指南" arrow="true">
  对比各类库、丰富代码仓库记录，或基于多种技术信号生成结构化列表。
</Card>