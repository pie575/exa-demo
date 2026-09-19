> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

<div id="particle">
  # Particle
</div>

> 搜索播客文字稿，支持说话人归属与时间戳。

[Particle](https://particle.news) 的 Podcast Intelligence 收录了 10 万多档节目，
并在节目播出后数分钟内完成全文转写、说话人分离与识别、打标签以及元数据补充，
让口语对话变得可检索。每条结果都是带时间戳、标注说话人的文字稿片段。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `particle` 附加到
[Exa Agent](/zh/docs/agent/quickstart) 运行中，agent 便会在进行 Exa 网页 search 的同时查询 Particle。

<div id="use-it-for">
  ## 适用场景
</div>

* 查找专家评论和可引用的精彩观点。
* 媒体与品牌监测。
* 叙事与舆情研究。
* 发现播客并持续关注最新内容。

<div id="provider-id">
  ## 数据提供方 ID
</div>

在 `dataSources` 中使用此值：

```text theme={null}
particle
```

<div id="example">
  ## 示例
</div>

了解播客主持人对 AI 监管的看法。

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      data_sources=[{"provider": "particle"}],
      output_schema={
          "type": "object",
          "required": ["mentions"],
          "properties": {
              "mentions": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "episode", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "episode": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "pro-regulation, anti-regulation, or nuanced"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
    dataSources: [{ provider: "particle" }],
    outputSchema: {
      type: "object",
      required: ["mentions"],
      properties: {
        mentions: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["podcast", "episode", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              episode: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "pro-regulation, anti-regulation, or nuanced" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      "dataSources": [{ "provider": "particle" }],
      "outputSchema": {
        "type": "object",
        "required": ["mentions"],
        "properties": {
          "mentions": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["podcast", "episode", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "episode": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "pro-regulation, anti-regulation, or nuanced" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## 搭配使用
</div>

* [Financial Datasets](/zh/docs/agent/connect/financialdatasets)：将播客中的讨论与已发布的新闻相互印证。
* [Fiber.ai](/zh/docs/agent/connect/fiber)：为讨论中提到的人物补充公司与联系人背景信息。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="附加到运行中" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速入门" arrow="true">
    Exa Connect 快速入门介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个数据提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多附加五个合作伙伴，并设计好 query，让每个提供方都被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出结构，并控制投入程度与成本。
  </Card>

  <Card title="获取 API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建 key" arrow="true">
    在控制面板中创建一个 key，即可直接运行本页示例。新账户会获赠免费积分。
  </Card>
</Columns>