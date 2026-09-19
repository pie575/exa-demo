> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="baseten">
  # Baseten
</div>

> 通过 Baseten Hosted Tools，用 Exa 网页搜索为 Baseten Model APIs 上的开源模型提供事实依据。

Exa 是 [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/) 中的网页搜索提供方。Baseten Model APIs 托管开源模型，而 Hosted Tools 让这些模型无需你自行搭建工具调用循环即可搜索网页：你只需在标准请求中加入 Exa 工具选择器，Baseten 便会在服务端循环中同时运行模型与 Exa 搜索，并在同一个响应中返回有据可依的答案。无需 Exa API key。Baseten 会将 Exa 的费用按原价计入你的 Baseten 账单，不加价。

<div id="use-the-exa-web-search-tools">
  ## 使用 Exa 网页搜索工具
</div>

设置 `x-baseten-server-tools: true` header，并在 `tools` 数组中添加一个或多个 Exa 选择器。只需提供 `type` 即可；Baseten 会自动展开工具 schema，由模型决定何时搜索、搜索什么以及读取哪些页面。服务端工具可用于 Baseten 的 [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions)、[Messages](https://docs.baseten.co/reference/inference-api/messages) 和 Responses 端点，缓冲和流式模式均支持。

<CodeGroup>
  ```python Python theme={null}
  from openai import OpenAI

  client = OpenAI(
      api_key="<BASETEN_API_KEY>",
      base_url="https://inference.baseten.co/v1",
      default_headers={"x-baseten-server-tools": "true"},
  )

  response = client.chat.completions.create(
      model="zai-org/GLM-5.3-Fast",
      messages=[
          {"role": "user", "content": "What were the major AI announcements this week?"}
      ],
      tools=[
          {"type": "baseten__exa__web_search_exa"},
          {"type": "baseten__exa__web_fetch_exa"},
      ],
      extra_body={"baseten": {"tool_settings": {"max_react_iterations": 5}}},
  )

  print(response.choices[0].message.content)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const client = new OpenAI({
    apiKey: "<BASETEN_API_KEY>",
    baseURL: "https://inference.baseten.co/v1",
    defaultHeaders: { "x-baseten-server-tools": "true" },
  });

  const response = await client.chat.completions.create({
    model: "zai-org/GLM-5.3-Fast",
    messages: [
      { role: "user", content: "What were the major AI announcements this week?" },
    ],
    tools: [
      { type: "baseten__exa__web_search_exa" },
      { type: "baseten__exa__web_fetch_exa" },
    ],
    baseten: { tool_settings: { max_react_iterations: 5 } },
  });

  console.log(response.choices[0].message.content);
  ```

  ```bash cURL theme={null}
  curl https://inference.baseten.co/v1/chat/completions \
    -H "Authorization: Bearer <BASETEN_API_KEY>" \
    -H "Content-Type: application/json" \
    -H "x-baseten-server-tools: true" \
    -d '{
      "model": "zai-org/GLM-5.3-Fast",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [
        { "type": "baseten__exa__web_search_exa" },
        { "type": "baseten__exa__web_fetch_exa" }
      ],
      "baseten": { "tool_settings": { "max_react_iterations": 5 } }
    }'
  ```
</CodeGroup>

共有三个 Exa 工具可用。如果希望模型先找到来源、再读取自己选中的页面，就同时提供 search 和 fetch。

| 选择器                                     | 模型可获得的能力                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------ |
| `baseten__exa__web_search_exa`          | [Exa search](/zh/docs/search/quickstart)：针对某个 query 返回带 page contents 的相关结果 |
| `baseten__exa__web_search_advanced_exa` | 支持域名过滤、子页面抓取，并可为每条结果生成可选 summary 的搜索                                     |
| `baseten__exa__web_fetch_exa`           | 针对模型已掌握的 URL 获取[完整 page contents](/zh/docs/contents/quickstart)             |

选择器不接受额外字段；模型会根据 Exa 的 schema 填充工具参数。可通过系统提示词引导搜索策略，例如何时搜索、是否抓取一手来源，以及如何标注引用。使用 `baseten.tool_settings` 来限制循环：

| 设置                             | 用途                                                                       |
| ------------------------------ | ------------------------------------------------------------------------ |
| `max_react_iterations`         | 限制每个请求的模型迭代次数 (默认 12，范围 2 到 20) 。最后一次迭代用于生成答案，因此 `N` 实际允许 `N - 1` 轮工具调用。 |
| `max_tool_calls_per_iteration` | 限制单次迭代中的服务端工具调用次数 (默认 10，范围 1 到 10)                                      |

<div id="how-results-come-back">
  ## 结果如何返回
</div>

最终答案通过端点的常规字段返回。已完成的 Exa 调用会按各协议分别记录：在 Messages 中记录为 `tool_use` 和 `tool_result` 块，在 Responses 中记录为 `mcp_call` 项，在 Chat Completions 中记录为 `baseten.iterations[].continuation_messages`。对于流式请求，循环运行期间每次搜索调用及其结果都会以服务器发送事件 (SSE) 的形式推送，因此你可以在最终答案返回前展示进度。`baseten.request.server_tool_calls[]` 数组会报告请求中每次 Exa 调用的结果。

<div id="pricing">
  ## 定价
</div>

Exa 调用按 Exa 的费率计入你的 Baseten 账户，不加价，费用独立于模型的 token 费用：每次搜索约 $0.007，每抓取一个 URL 约 $0.001。Exa 会在运行时报告每次调用的费用，因此单次调用的实际金额可能与上述数字有出入。已计费的工具调用会显示在 Baseten 工作区设置的 Billing → Usage 中，并按提供方分组。当前费率请参见 [Baseten 的定价表](https://docs.baseten.co/inference/model-apis/web-search#pricing)。

Hosted Tools 在 Baseten 上处于早期访问阶段，每个组织每分钟限 25 次请求。你可以在 [Baseten playground](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground) 中试用 Exa search，或联系 Baseten 为生产工作负载提高限额。

<div id="resources">
  ## 资源
</div>

<Columns cols={2}>
  <Card title="Baseten 网页搜索文档" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="打开文档" arrow="true">
    可直接运行的 Messages、Responses 和 Chat Completions 示例，均使用服务端工具。
  </Card>

  <Card title="服务端工具参考" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="打开参考文档" arrow="true">
    工具目录、循环设置、`tool_choice` 格式以及响应结构。
  </Card>
</Columns>