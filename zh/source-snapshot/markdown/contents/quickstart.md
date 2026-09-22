> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# Contents API {#contents-api}

> 从任意 URL 提取文本、highlights 和摘要。

Exa Contents 从 URL 返回干净的页面内容，并自动处理 JavaScript 渲染页面、PDF 和复杂排版。

所有页面内容功能同样适用于 [Exa Search](/zh/docs/search/quickstart) 返回的 URL，每次搜索前 10 条结果不额外收费 (超出部分为 $1/1000 页) 。在网页搜索工具类场景中，我们建议以这种方式使用 Search，而不是 Contents。

<Tip>
  若搜索结果用于为 AI 提供上下文，请在 `/search` 请求中加上 `contents: { highlights: true }`，
  Exa 会根据每条结果的相关度确定其摘录长度。参见 [Highlights](/zh/docs/search/highlights)。
</Tip>

## 发起首个请求 {#make-your-first-request}

传入一个或多个 URL 或文档 ID，并针对与任务相关的部分请求 highlights。在 HTTP 请求中，通过 `ids` 传入：

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and quality results"},
  )

  print(result.results[0].highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://exa.ai/blog/dynamic-highlights"],
    {
      highlights: {
        query: "token efficiency and quality results"
      }
    }
  );

  console.log(result.results[0].highlights);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://exa.ai/blog/dynamic-highlights"],
      "highlights": {
        "query": "token efficiency and quality results"
      }
    }'
  ```
</CodeGroup>

<Accordion title="响应示例">
  ```json theme={null}
  {
    "requestId": "e492118ccdedcba5088bfc4357a8a125",
    "results": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "title": "Dynamic Highlights",
        "url": "https://exa.ai/blog/dynamic-highlights",
        "highlights": [
          "With a 12k character budget, relative to existing highlights, Dynamic Highlights achieves a 40% average token efficiency gain with a notable quality increase..."
        ]
      }
    ],
    "statuses": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "status": "success",
        "source": "cached"
      }
    ],
    "costDollars": {
      "total": 0.001
    }
  }
  ```
</Accordion>

`results` 中的每一项都包含页面元数据以及你所请求的内容视图。可通过 `statuses` 查看每个 URL 的成功或失败情况。

<h2 id="dynamic-highlights">
  输出形态
</h2>

<Tabs>
  <Tab title="Highlights">
    highlights 返回从页面中摘取的相关段落。agent、RAG 和事实查询场景建议优先使用它，因为 highlights 占用的上下文比 full text 更少。

    设置 `highlights: true` 即可启用 highlights。使用 Contents 时，建议额外传入 `query` 参数，让页面内容的提取更有针对性：

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/research-paper"],
          highlights={"query": "methodology and results"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/research-paper"],
        {
          highlights: {
            query: "methodology and results"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/research-paper"],
          "highlights": {
            "query": "methodology and results"
          }
        }'
      ```
    </CodeGroup>

    有关 Dynamic Highlights 以及如何在多个页面之间分配上下文，请参阅 [Highlights](/zh/docs/search/highlights)。
  </Tab>

  <Tab title="Full text">
    full text 以 markdown 形式返回干净的页面正文。如果任务依赖大范围上下文、文档结构，或 highlights 可能遗漏的细节，就使用它。

    完整页面可能很大，需要限制长度时可使用 `maxCharacters`：

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/technical-report"],
          text={"max_characters": 10000},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/technical-report"],
        {
          text: {
            maxCharacters: 10000
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/technical-report"],
          "text": {
            "maxCharacters": 10000
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Summary">
    summary 会为每个页面发起一次语言模型调用。当你需要模型生成的概览，或需要按 JSON schema 提取字段时，就使用它。

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/company"],
          summary={"query": "Summarize the product, customers, and pricing"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/company"],
        {
          summary: {
            query: "Summarize the product, customers, and pricing"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/company"],
          "summary": {
            "query": "Summarize the product, customers, and pricing"
          }
        }'
      ```
    </CodeGroup>

    若要提取字段而非成段文字，请在 `summary.schema` 中传入一个 JSON schema。summary 将以符合该 schema 的 JSON 字符串返回，解析后即可读取各字段：

    ```json theme={null}
    {
      "ids": ["https://example.com/company"],
      "summary": {
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "title": "Company Information",
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "The company name" },
            "industry": { "type": "string", "description": "Primary industry" },
            "foundedYear": { "type": "number", "description": "Year the company was founded" }
          },
          "required": ["name"]
        }
      }
    }
    ```
  </Tab>
</Tabs>

每个请求只选用一种内容视图。若同时请求 highlights、text 和 summary，三者将分别返回并分别计费。

## 内容新鲜度 {#content-freshness}

`maxAgeHours` 用于控制提取的页面内容需要多新。

| 值    | 行为                         |
| ---- | -------------------------- |
| 省略   | 有缓存内容时使用缓存，需要时抓取页面         |
| 正整数  | 如果缓存内容在指定小时数以内则使用缓存，否则抓取页面 |
| `0`  | 始终抓取最新内容                   |
| `-1` | 仅使用缓存内容                    |

大多数请求应省略该 field。只有当过时的页面内容无法使用时才设置它，例如价格、库存或频繁更新的页面。可将较低的 `maxAgeHours` 与 `livecrawlTimeout` (毫秒) 搭配使用，以限制实时抓取的最长耗时。

<Accordion title="从已弃用的 livecrawl 参数迁移">
  `livecrawl` 字符串参数 (`"always"`、`"preferred"`、`"fallback"`、`"never"`) 已弃用，请改用 `maxAgeHours`：

  | 旧 `livecrawl` 值 | 等效写法                                |
  | --------------- | ----------------------------------- |
  | `"always"`      | `maxAgeHours: 0`                    |
  | `"never"`       | `maxAgeHours: -1`                   |
  | `"fallback"`    | 省略 `maxAgeHours`                    |
  | `"preferred"`   | 无直接等效写法；请使用较小的值，例如 `maxAgeHours: 1` |
</Accordion>

## 抓取子页面 {#crawl-subpages}

设置 `subpages` 即可沿着每个起始 URL 中的链接继续抓取。若希望 Exa 优先抓取特定的站点板块，可添加 `subpageTarget`：

<CodeGroup>
  ```python Python theme={null}
  result = exa.get_contents(
      ["https://docs.example.com"],
      subpages=10,
      subpage_target=["api", "reference", "guides"],
      highlights=True,
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.getContents(
    ["https://docs.example.com"],
    {
      subpages: 10,
      subpageTarget: ["api", "reference", "guides"],
      highlights: true
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://docs.example.com"],
      "subpages": 10,
      "subpageTarget": ["api", "reference", "guides"],
      "highlights": true
    }'
  ```
</CodeGroup>

## 图片与网站图标 {#images-and-favicons}

将 `extras.imageLinks` 设置为你希望从每个页面获取的图片 URL 数量。结果中还会包含
站点的 `favicon`，以及一个具有代表性的 `image` URL (如果有) 。在 `/search` 中，该选项
位于 `contents.extras.imageLinks`。

## 后续步骤 {#next-steps}

<Columns cols={2}>
  <Card title="API 参考" icon="square-terminal" href="/zh/docs/reference/get-contents" cta="打开参考" arrow="true">
    查看全部请求参数和响应 field。
  </Card>

  <Card title="Highlights" icon="highlighter" href="/zh/docs/search/highlights" cta="阅读指南" arrow="true">
    对比常规 highlights 与 Dynamic Highlights，为 agent 和 RAG 提供上下文。
  </Card>

  <Card title="Search API" icon="search" href="/zh/docs/search/quickstart" cta="打开指南" arrow="true">
    先找到相关页面，再提取其页面内容。
  </Card>

  <Card title="SDKs" icon="code" href="/zh/docs/sdks/quickstart" cta="查看 SDK" arrow="true">
    通过 Python 或 JavaScript 使用 Exa。
  </Card>
</Columns>