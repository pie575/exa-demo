> ## 文档索引 {#documentation-index}
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

# Exa Search API {#exa-search-api}

> 用自然语言搜索网页，一次请求即可获得干净、相关的页面内容。

Exa Search 接收自然语言 query，返回经过排序的网页结果，并附带干净的页面内容。

## 发起首次请求 {#make-your-first-request}

先传入一条自然语言 `query`，并设置 `contents: { highlights: true }`，后者会返回长度随各条结果相关度而定的摘录。其他 field 用于控制 Exa 如何搜索、以及每条结果包含哪些内容；本页余下部分会介绍你实际会用到的那些。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "recent techniques for improving retrieval in RAG systems",
      type="auto",
      contents={"highlights": True},
  )

  for item in result.results:
      print(item.title, item.url)
      print(item.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "recent techniques for improving retrieval in RAG systems",
    {
      type: "auto",
      contents: { highlights: true }
    }
  );

  for (const item of result.results) {
    console.log(item.title, item.url);
    console.log(item.highlights);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "recent techniques for improving retrieval in RAG systems",
      "type": "auto",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

search 默认最多返回 10 条结果。通过 `numResults` 最多可请求 100 条；若相关页面不足，返回数量会更少。search 不支持分页。

<Accordion title="示例响应">
  highlights 与下方列表均已精简。

  ```json theme={null}
  {
    "requestId": "c3174df2b9cd5afbc64cdf79f3719b19",
    "resolvedSearchType": "",
    "results": [
      {
        "id": "https://arxiv.org/html/2608.21702",
        "title": "From Association to Causation: Improving Retrieval Precision ofRetrieval-Augmented Generation via Causal Relations and an Attention Mechanism",
        "url": "https://arxiv.org/html/2608.21702",
        "highlights": [
          "Retrieval-Augmented Generation (RAG) grounds LLM generation on retrieved documents, but the standard terminal retrieval stage—dense-vector similarity, optionally followed by reranking—often returns documents that merely share keywords with the query without containing the needed information...\n..."
        ],
        "image": "https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg",
        "favicon": "https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png"
      },
      {
        "id": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "title": "Four retrieval techniques to improve RAG you need to know",
        "url": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "publishedDate": "2025-04-14T00:00:00.000Z",
        "highlights": [
          "It's not surprising, then, that we've seen a range of different approaches emerge that attempt to address RAG's limitations over the last year or so.\n..."
        ],
        "image": "https://www.thoughtworks.com/content/dam/thoughtworks/images/illustration/brand/tw_illustration_5.jpg"
      }
    ],
    "searchTime": 1324.3,
    "costDollars": {
      "total": 0.007,
      "search": {
        "neural": 0.007
      }
    }
  }
  ```
</Accordion>

结果按相关度排序。每条结果都带有标题、URL、发布日期等元数据，以及你在 `contents` 中请求的内容。

## 编写查询 {#writing-queries}

使用 Search API 时，`query` 是唯一必填的 field。

用自然语言编写 query，写明主题；如有需要，还可以说明想要的来源类型和时间范围。

query 可以宽泛、带有探索性。`"Latest news on EU battery policy"` 能让 Exa 充分理解意图，从而找到相关页面；而 `"news"` 则不能。如果来源类型很重要，请在 query 中明确指出：

```text theme={null}
近期对比 RAG 系统中混合 retrieval 与语义 retrieval 的技术文章
```

关于 Exa 索引包含哪些内容以及如何搜索这些内容类型，请参阅 [Exa 索引中有什么](/zh/docs/search/data/overview)。

<h2 id="search-types">
  选择搜索类型
</h2>

`type` 用于选择搜索模式，每种模式在速度、搜索深度和综合能力之间各有侧重。`auto` 是默认值，适用于大多数 search。

| 类型               | 适用场景                   |
| ---------------- | ---------------------- |
| `auto`           | 希望在质量与速度之间取得最佳的默认平衡    |
| `fast`           | 请求对延迟敏感                |
| `instant`        | 请求处于实时链路上，例如自动补全或语音    |
| `deep-lite`      | 任务需要轻量级的研究与综合          |
| `deep`           | 任务需要多步 search 和更强的综合能力 |
| `deep-reasoning` | 完整性和推理深度比延迟更重要         |

Deep 模式执行的是一套研究流程，而非单次 retrieval。关于该流程的工作方式及其附加控制项的使用，请参阅[深度搜索](/zh/docs/search/deep-search)。

<Tip>
  如需长时间运行的研究、列表构建和多跳增强，请使用 [Exa Agent](/zh/docs/agent/quickstart)，而不是 `deep-reasoning`。Agent
  在每次运行中拥有更多算力，并返回有据可依的结构化结果。
</Tip>

## 输出形态 {#output-shapes}

每条 result 都包含元数据，例如标题、URL 和发布日期。使用 `contents` 可以额外获取页面的 highlights、full text 或 summary。

<Tabs>
  <Tab title="Highlights">
    Highlights 返回与你的 query 最相关的摘录，让模型和 agent 拿到所需的证据，同时不会让页面中无关的内容占满上下文窗口。

    对大多数任务而言，这是推荐的输出形态。

    先从最简单的 `highlights: true` 开始，Exa 会根据 query 从每条 result 中选取适量内容。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "How are inference providers reducing transformer latency?",
          contents={"highlights": True},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "How are inference providers reducing transformer latency?",
        { contents: { highlights: true } }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "How are inference providers reducing transformer latency?",
          "contents": { "highlights": true }
        }'
      ```
    </CodeGroup>

    关于 Dynamic Highlights 以及何时启用它，参见 [Highlights](/zh/docs/search/highlights)。
  </Tab>

  <Tab title="Full text">
    Full text 返回清理后的页面正文。如果任务依赖更完整的上下文、文档结构，或依赖围绕 query 的摘录之外的细节，就应该使用它。

    完整页面可能很大，请同时限制 result 的数量和每个页面返回的文本量。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "Technical postmortems of large-scale inference outages",
          num_results=5,
          contents={"text": {"max_characters": 10000}},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "Technical postmortems of large-scale inference outages",
        {
          numResults: 5,
          contents: { text: { maxCharacters: 10000 } }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "Technical postmortems of large-scale inference outages",
          "numResults": 5,
          "contents": {
            "text": { "maxCharacters": 10000 }
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

每个请求只选用一种内容视图。同时请求 highlights 和 text 会返回同一页面的两种视图，并按两份计费。`summary` 是第三种选择，但它会为每条 result 额外增加一次语言模型调用。

<Warning>
  `/search` 和 `/contents` 接受相同的 content options，但放置位置不同：

  * **`/search`** 将 `highlights`、`text` 和 `summary` 嵌套在 `contents` 对象内：
    `"contents": { "highlights": true }`
  * **`/contents`** 没有 `contents` 这层包装。它的请求体本身就是 content options，因此相同的 fields 与 `urls` 并列位于顶层：`"urls": [...], "highlights": true`
</Warning>

## 输出 schema {#output-schema}

如果希望 Exa 对搜索结果进行归纳合成，可添加 `outputSchema`。它适用于所有搜索类型，并会在响应中增加一个 `output` 对象。

排序后的页面仍保留在 `results` 中，生成的内容则返回在 `output.content` 中，字段级的来源和置信度位于 `output.grounding` 中。

<Tabs>
  <Tab title="自由格式文本">
    使用 `type: "text"` 生成文字内容。添加 `description` 可指定其格式或长度。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "What changed in the latest EU battery policy?",
          output_schema={
              "type": "text",
              "description": "Summarize the changes in three concise bullets",
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "What changed in the latest EU battery policy?",
        {
          outputSchema: {
            type: "text",
            description: "Summarize the changes in three concise bullets"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "What changed in the latest EU battery policy?",
          "outputSchema": {
            "type": "text",
            "description": "Summarize the changes in three concise bullets"
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="结构化 JSON">
    使用 `type: "object"` 获取符合你所定义的属性和必填项的 JSON。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "AI infrastructure companies that announced Series A or B funding in the past six months",
          output_schema={
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "maxItems": 10,
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "round": {"type": "string"},
                              "amount": {"type": "string"},
                              "announcedDate": {
                                  "type": "string",
                                  "description": "The funding announcement date",
                              },
                              "leadInvestors": {
                                  "type": "array",
                                  "items": {"type": "string"},
                              },
                          },
                          "required": ["name", "round", "amount", "announcedDate"],
                      },
                  }
              },
              "required": ["companies"],
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "AI infrastructure companies that announced Series A or B funding in the past six months",
        {
          outputSchema: {
            type: "object",
            properties: {
              companies: {
                type: "array",
                maxItems: 10,
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    round: { type: "string" },
                    amount: { type: "string" },
                    announcedDate: {
                      type: "string",
                      description: "The funding announcement date"
                    },
                    leadInvestors: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            required: ["companies"]
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "AI infrastructure companies that announced Series A or B funding in the past six months",
          "outputSchema": {
            "type": "object",
            "properties": {
              "companies": {
                "type": "array",
                "maxItems": 10,
                "items": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "round": { "type": "string" },
                    "amount": { "type": "string" },
                    "announcedDate": {
                      "type": "string",
                      "description": "The funding announcement date"
                    },
                    "leadInvestors": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            "required": ["companies"]
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

使用 `systemPrompt` 提供指令，例如来源偏好或需要强调的内容；使用 `outputSchema` 定义响应的结构。Python 中对应的是 `system_prompt` 和 `output_schema`。

<Note>
  保持对象 schema 精简：最多支持 2 层嵌套和 10 个属性。请勿在 schema 中添加 citation 或 confidence
  field；Exa 会在 `output.grounding` 中自动返回这些信息。
</Note>

## 过滤结果 {#filter-results}

过滤器是硬性约束：只有当范围之外的 result 对你毫无用处时才添加过滤器；较宽松的来源偏好则应写进 query 文本中。完整的过滤器列表请参见 [API 参考](/zh/docs/reference/search)。

### 包含域名或路径 {#include-domains-or-paths}

`includeDomains` 可将结果限制在你信任的来源范围内。它支持完整域名、路径前缀 (如 `anthropic.com/news`) ，以及子域名通配符 (如 `*.substack.com`) 。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "new model releases",
      include_domains=["openai.com", "anthropic.com/news"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("new model releases", {
    includeDomains: ["openai.com", "anthropic.com/news"],
    contents: { highlights: true }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "new model releases",
      "includeDomains": ["openai.com", "anthropic.com/news"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

请把路径写在过滤条件中，不要在 query 里用 `site:` 操作符再写一遍。

### 排除域名或路径 {#exclude-domains-or-paths}

`excludeDomains` 会剔除来自特定域名或路径的结果。它支持与 `includeDomains` 相同的路径前缀和子域名通配符。只有当这些来源会让结果变得不可用时才使用它，不要用它来表达偏好。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "primary research on retrieval-augmented generation benchmarks",
      exclude_domains=["medium.com", "dev.to"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "primary research on retrieval-augmented generation benchmarks",
    {
      excludeDomains: ["medium.com", "dev.to"],
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "primary research on retrieval-augmented generation benchmarks",
      "excludeDomains": ["medium.com", "dev.to"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

## 内容新鲜度 {#content-freshness}

`contents.maxAgeHours` 用于控制从每个 result 中提取的内容必须有多新，它不会按 publication date 过滤 result。

| 值    | 行为                          |
| ---- | --------------------------- |
| 省略   | 有缓存内容时使用缓存，必要时再抓取页面         |
| 正整数  | 缓存内容的缓存时长小于该小时数时使用缓存，否则抓取页面 |
| `0`  | 始终抓取最新内容                    |
| `-1` | 仅使用缓存内容                     |

大多数 search 都应省略该 field。仅当陈旧的页面内容无法使用时才设置它，例如价格、库存情况或变动频繁的页面。

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "current pricing for serverless GPU providers",
      contents={
          "highlights": True,
          "max_age_hours": 24,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("current pricing for serverless GPU providers", {
    contents: {
      highlights: true,
      maxAgeHours: 24
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "current pricing for serverless GPU providers",
      "contents": {
        "highlights": true,
        "maxAgeHours": 24
      }
    }'
  ```
</CodeGroup>

## 下一步 {#next-steps}

<Columns cols={2}>
  <Card title="最佳实践" icon="sparkles" href="/zh/docs/search/best-practices" cta="阅读指南" arrow="true">
    token 预算、内容新鲜度、结构化输出与系统提示词。
  </Card>

  <Card title="API 参考" icon="square-terminal" href="/zh/docs/reference/search" cta="打开参考" arrow="true">
    涵盖每个请求参数与响应 field，并配有在线调试环境。
  </Card>

  <Card title="Contents" icon="file-text" href="/zh/docs/contents/quickstart" cta="打开指南" arrow="true">
    已经有 URL，只想获取干净的文本、highlights 或摘要。
  </Card>

  <Card title="Exa Agent" icon="bot" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    需要长时间运行的研究、列表构建或增强。
  </Card>
</Columns>