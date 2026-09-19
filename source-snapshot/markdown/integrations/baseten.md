> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Baseten

> Ground open-source models on Baseten Model APIs with Exa web search through Baseten Hosted Tools.

Exa is a web search provider in [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/). Baseten Model APIs serve open-source models, and Hosted Tools let those models search the web without you wiring up a tool loop: you add an Exa tool selector to a standard request, Baseten runs the model and the Exa searches together in a server-side loop, and you get back a grounded answer in the same response. No Exa API key is needed. Baseten passes Exa's cost through to your Baseten bill with no markup.

## Use the Exa web search tools

Set the `x-baseten-server-tools: true` header, and add one or more Exa selectors to your `tools` array. Only the `type` is needed; Baseten expands the tool schema automatically, and the model decides when to search, what to search for, and which pages to read. Server-side tools work on Baseten's [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions), [Messages](https://docs.baseten.co/reference/inference-api/messages), and Responses endpoints, buffered or streaming.

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

Three Exa tools are available. Give the model search plus fetch when it should discover sources and then read the pages it picks.

| Selector                                | What the model gets                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| `baseten__exa__web_search_exa`          | [Exa search](/docs/search/quickstart): relevant results with page content for a query |
| `baseten__exa__web_search_advanced_exa` | Search with domain filters, subpage crawling, and an optional summary per result |
| `baseten__exa__web_fetch_exa`           | [Full page contents](/docs/contents/quickstart) for a URL the model already has       |

Selectors take no extra fields; the model fills in the tool arguments from Exa's schema. Use the system prompt to steer search policy, such as when to search, whether to fetch primary sources, and how to cite. Use `baseten.tool_settings` to bound the loop:

| Setting                        | Use it to                                                                                                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max_react_iterations`         | Cap model iterations per request (default 12, range 2 to 20). The last iteration is reserved for the answer, so `N` allows `N - 1` rounds of tool calls. |
| `max_tool_calls_per_iteration` | Cap server-side tool calls in one iteration (default 10, range 1 to 10)                                                                                  |

## How results come back

The final answer arrives through the endpoint's normal field. Completed Exa calls are recorded per protocol: `tool_use` and `tool_result` blocks on Messages, `mcp_call` items on Responses, and `baseten.iterations[].continuation_messages` on Chat Completions. Streaming requests receive each search call and result as server-sent events while the loop runs, so you can show progress before the answer lands. The `baseten.request.server_tool_calls[]` array reports the outcome of every Exa call in the request.

## Pricing

Exa calls bill to your Baseten account at Exa's rate with no markup, in addition to the model's token costs: about \$0.007 per search and \$0.001 per fetched URL. Exa reports the charge for each call at runtime, so individual calls can deviate from these figures. Billed tool calls appear in Baseten workspace settings under Billing → Usage, grouped by provider. See [Baseten's pricing table](https://docs.baseten.co/inference/model-apis/web-search#pricing) for current rates.

Hosted Tools are in early access on Baseten with a 25 requests per minute limit per organization. Try Exa search in the [Baseten playground](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground), or contact Baseten to raise the limit for production workloads.

## Resources

<Columns cols={2}>
  <Card title="Baseten web search docs" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="Open docs" arrow="true">
    Runnable Messages, Responses, and Chat Completions examples with server-side tools.
  </Card>

  <Card title="Server-side tool reference" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="Open reference" arrow="true">
    Tool catalog, loop settings, `tool_choice` formats, and response shapes.
  </Card>
</Columns>
