> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件查看所有可用页面。

# Baseten {#baseten}

> 通过 Baseten Hosted Tools，用 Exa 网页搜索为 Baseten Model APIs 上的开源模型提供依据。

Exa 是 [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/) 中的网页搜索提供方。Baseten Model APIs 托管开源模型，而 Hosted Tools 让这些模型无需你自行搭建 tool loop 即可搜索网页：你只需在标准请求中加入 Exa 工具选择器，Baseten 便会在 server 端的 loop 中同时运行模型与 Exa search，并在同一响应中返回一个有据可循的答案。无需 Exa API 密钥。Baseten 会将 Exa 的费用原价计入你的 Baseten 账单，不加价。

## 使用 Exa 网页搜索工具 {#use-the-exa-web-search-tools}

设置 `x-baseten-server-tools: true` header，并在 `tools` 数组中添加一个或多个 Exa 选择器。只需提供 `type`；Baseten 会自动展开 tool schema，由模型决定何时搜索、搜索什么，以及读取哪些页面。服务端工具可用于 Baseten 的 [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions)、[Messages](https://docs.baseten.co/reference/inference-api/messages) 和 Responses 端点，支持缓冲或流式传输。

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

共有三个 Exa 工具可用。如果希望模型先查找来源、再阅读自己选中的页面，可同时提供搜索和抓取工具。

| 选择器                                     | 模型可获得的能力                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `baseten__exa__web_search_exa`          | [Exa search](/zh/docs/search/quickstart)：针对 query 返回带页面内容的相关结果 |
| `baseten__exa__web_search_advanced_exa` | 支持域名过滤、子页面抓取，并可为每条结果生成可选摘要的搜索                               |
| `baseten__exa__web_fetch_exa`           | 针对模型已有的 URL 获取[完整页面内容](/zh/docs/contents/quickstart)           |

选择器无需额外 field；模型会依据 Exa 的 schema 填入工具参数。可通过 system prompt 引导搜索策略，例如何时搜索、是否抓取原始来源，以及如何引用。使用 `baseten.tool_settings` 可限定 loop 的范围：

| 设置                             | 用途                                                                       |
| ------------------------------ | ------------------------------------------------------------------------ |
| `max_react_iterations`         | 限制每个请求的模型迭代次数 (默认 12，范围 2 到 20) 。最后一次迭代保留用于生成答案，因此 `N` 允许 `N - 1` 轮工具调用。 |
| `max_tool_calls_per_iteration` | 限制单次迭代中的服务端工具调用次数 (默认 10，范围 1 到 10)                                      |

## 结果如何返回 {#how-results-come-back}

最终答案通过端点的常规 field 返回。已完成的 Exa 调用会按各自协议记录：Messages 上的 `tool_use` 和 `tool_result` 块、Responses 上的 `mcp_call` 项目，以及 Chat Completions 上的 `baseten.iterations[].continuation_messages`。在 loop 运行期间，流式请求会以服务器发送事件的形式收到每一次 search 调用及其结果，因此你可以在最终答案返回前展示进度。`baseten.request.server_tool_calls[]` 数组会报告该请求中每一次 Exa 调用的结果。

## 定价 {#pricing}

Exa 调用按 Exa 的费率计入你的 Baseten 账户，不加价，且与模型的 token 费用分开计算：每次 search 约 $0.007，每个抓取的 URL 约 $0.001。Exa 会在运行时上报每次调用的费用，因此单次调用可能与上述数字略有出入。已计费的工具调用会显示在 Baseten 工作区设置的 Billing → Usage 中，并按提供方分组。当前费率请参阅 [Baseten 的定价表格](https://docs.baseten.co/inference/model-apis/web-search#pricing)。

Hosted Tools 在 Baseten 上处于早期访问阶段，每个组织每分钟限制 25 个请求。你可以在 [Baseten playground](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground) 中试用 Exa search，或联系 Baseten 为 production 工作负载提高该限制。

## 资源 {#resources}

<Columns cols={2}>
  <Card title="Baseten 网页搜索文档" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="打开文档" arrow="true">
    可直接运行的 Messages、Responses 和 Chat Completions 示例，均使用服务端工具。
  </Card>

  <Card title="服务端工具参考文档" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="查看参考文档" arrow="true">
    工具目录、loop 设置、`tool_choice` 格式以及响应结构。
  </Card>
</Columns>