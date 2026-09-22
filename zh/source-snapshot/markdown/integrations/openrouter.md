> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

<div id="openrouter">
  # OpenRouter
</div>

> 通过 openrouter:web&#95;search server tool，为任意 OpenRouter 模型接入 Exa 网页搜索。

Exa 是 [OpenRouter](https://openrouter.ai) 网页搜索背后的搜索引擎。OpenRouter 让你用一套 API 调用数百个模型，而 Exa 为这些模型提供实时联网能力：不具备原生搜索能力的模型默认通过 Exa 获取事实依据，任何模型也都可以显式指定使用 Exa。无需 Exa API 密钥。OpenRouter 在服务端执行这些 search，并从你的 OpenRouter credits 中扣费。

<div id="use-the-web-search-server-tool">
  ## 使用网页搜索 server tool
</div>

在 `tools` 数组中加入 `openrouter:web_search`，模型即可自行决定何时搜索、搜索什么，以及是否在同一个请求中再次搜索。[Server tools](https://openrouter.ai/docs/guides/features/server-tools/web-search) 在 OpenRouter 上处于 beta 阶段，用于取代已弃用的 `web` 插件和 `:online` 模型变体；如果你仍在使用其中任意一种，请参阅 OpenRouter 的[迁移指南](https://openrouter.ai/docs/guides/features/server-tools/web-search#migrating-from-the-web-search-plugin)。

<CodeGroup>
  ```javascript JavaScript theme={null}
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer <OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.2",
      messages: [
        { role: "user", content: "What were the major AI announcements this week?" },
      ],
      tools: [{ type: "openrouter:web_search" }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      "https://openrouter.ai/api/v1/chat/completions",
      headers={
          "Authorization": "Bearer <OPENROUTER_API_KEY>",
          "Content-Type": "application/json",
      },
      json={
          "model": "openai/gpt-5.2",
          "messages": [
              {"role": "user", "content": "What were the major AI announcements this week?"}
          ],
          "tools": [{"type": "openrouter:web_search"}],
      },
  )

  print(response.json()["choices"][0]["message"]["content"])
  ```

  ```bash cURL theme={null}
  curl https://openrouter.ai/api/v1/chat/completions \
    -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "openai/gpt-5.2",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [{ "type": "openrouter:web_search" }]
    }'
  ```
</CodeGroup>

在默认的 `engine: "auto"` 下，若模型自带原生搜索，OpenRouter 就使用该提供方的原生搜索，其余情况一律使用 Exa。设置 `engine: "exa"` 可让所有模型保持一致的搜索行为：

```json theme={null}
{
  "type": "openrouter:web_search",
  "parameters": {
    "engine": "exa",
    "mode": "auto",
    "max_results": 5,
    "max_total_results": 20,
    "allowed_domains": ["arxiv.org"],
    "excluded_domains": ["reddit.com"]
  }
}
```

| 参数                                   | 用途                                                                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `mode`                               | 在延迟与检索深度之间权衡：`instant`、`fast`、`auto` (默认) 、`deep-lite`、`deep` 或 `deep-reasoning`。这些模式与 Exa 的[搜索类型](/zh/docs/search/quickstart)一一对应。 |
| `max_results`                        | 限制每次 search 调用返回的结果数量 (默认 5)                                                                                                     |
| `max_uses`                           | 限制模型在一次请求中可以执行 search 的次数                                                                                                        |
| `max_total_results`                  | 限制一次请求中所有 search 累计返回的结果数量                                                                                                       |
| `max_characters`                     | 为每条结果的 highlights 设置精确的字符预算                                                                                                      |
| `search_context_size`                | 改用预设预算：`low`、`medium` 或 `high`                                                                                                   |
| `allowed_domains`、`excluded_domains` | 按域名过滤结果。Exa 支持在同一请求中同时使用这两个过滤器。                                                                                                  |

<div id="how-results-come-back">
  ## 结果如何返回
</div>

OpenRouter 针对每条结果请求的是 [Exa highlights](/zh/docs/search/highlights)，而非整页文本：这些抽取式摘录长度自适应，通常每条结果 2,000 到 4,000 个字符，除非你设置了 `max_characters` 或 `search_context_size`。模型会读取这些摘录，API 调用方则可在响应消息的标准化 `url_citation` 注解中获取它们。在同一条结果中，`[...]` 标记用于分隔取自页面不同部分的摘录。

<div id="pricing">
  ## 定价
</div>

Exa search 会从你的 OpenRouter credits 中扣费，此外模型读取结果还会产生 token 费用。`instant`、`fast` 和 `auto` 模式每次 search 费用为 $0.007，`deep-lite` 和 `deep` 为 $0.012，`deep-reasoning` 为 $0.015。每次 search 最多包含 10 条结果，超出部分每条 $0.001。当前费率请参见 [OpenRouter 的网页搜索文档](https://openrouter.ai/docs/guides/features/server-tools/web-search)。

响应中的 `usage` 对象会在 `server_tool_use.web_search_requests` 中报告模型执行了多少次 search。

<div id="resources">
  ## 资源
</div>

<Columns cols={2}>
  <Card title="Server tool 文档" icon="wrench" href="https://openrouter.ai/docs/guides/features/server-tools/web-search" cta="打开文档" arrow="true">
    `openrouter:web_search` 的完整配置参考。
  </Card>

  <Card title="客户案例" icon="book-open" href="https://exa.ai/customers/openrouter" cta="阅读案例" arrow="true">
    OpenRouter 如何借助 Exa 为数百个模型提供网页搜索能力。
  </Card>
</Columns>