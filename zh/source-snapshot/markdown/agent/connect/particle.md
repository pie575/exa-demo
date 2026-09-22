> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

<div id="particle">
  # Particle
</div>

> 搜索播客会议记录，支持说话人归属和时间戳。

[Particle](https://particle.news) 的 Podcast Intelligence 收录了 10 万多档节目，在节目播出后数分钟内即完成全文转写、说话人分离与识别、内容标注，并以元数据加以丰富，让口语对话变得可搜索。每条结果都是带时间戳、标注说话人的会议记录片段。

通过 [Exa Connect](/zh/docs/agent/connect/overview) 将 `particle` 附加到 [Exa Agent](/zh/docs/agent/quickstart) 运行，agent 就会在进行 Exa 网页搜索的同时查询 Particle。

<div id="use-it-for">
  ## 适用场景
</div>

* 查找专家评论和可引用的精彩观点。
* 媒体与品牌监测。
* 叙事与舆情研究。
* 发现播客并及时掌握最新内容。

<div id="provider-id">
  ## 提供方 ID
</div>

在 `dataSources` 中使用该值：

```text theme={null}
particle
```

<div id="example">
  ## 示例
</div>

查找播客主持人对 AI 监管的讨论内容。

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

* [Financial Datasets](/zh/docs/agent/connect/financialdatasets)：将播客中的讨论与已发布的新闻交叉验证。
* [Fiber.ai](/zh/docs/agent/connect/fiber)：为讨论中提及的人物接入公司与联系人上下文。

<div id="next-steps">
  ## 后续步骤
</div>

<Columns cols={2}>
  <Card title="附加到运行" icon="rocket" href="/zh/docs/agent/connect/overview" cta="打开快速开始" arrow="true">
    Exa Connect 快速开始介绍了 `dataSources`、定价以及完整的合作伙伴目录。
  </Card>

  <Card title="组合多个提供方" icon="blend" href="/zh/docs/agent/connect/combining-providers" cta="阅读指南" arrow="true">
    在一次运行中最多接入五个合作伙伴，并设计好 query，让每一个都被触发。
  </Card>

  <Card title="了解 Exa Agent" icon="book-open" href="/zh/docs/agent/quickstart" cta="打开指南" arrow="true">
    创建运行、流式获取进度、设计输出 schema，并控制 effort 与费用。
  </Card>

  <Card title="获取 API 密钥" icon="key" href="https://dashboard.exa.ai/api-keys" cta="创建密钥" arrow="true">
    在控制台中创建密钥，即可直接运行本页示例。新账户可获得免费积分。
  </Card>
</Columns>