> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

<div id="llamaindex">
  # LlamaIndex
</div>

> 快速上手指南：如何将 Exa retrieval 接入 LlamaIndex agent 应用。

<Card title="编码智能体快速开始" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  初次接触 Exa？一分钟内即可上手。
</Card>

***

LlamaIndex 是一个基于结构化数据构建 LLM 应用的框架。在本指南中，我们将使用 Exa 的 LlamaIndex integration 来：

1. 将 Exa 的 Search and Retrieve Highlight Tool 指定为 LlamaIndex 检索器
2. 搭建一个在生成响应时调用该工具的 OpenAI Agent

***

<div id="get-started">
  ## 快速开始
</div>

<Steps>
  <Step title="前置条件与安装">
    安装 llama-index、llama-index core、llama-index-tools-exa 库。OpenAI 相关依赖已包含在 core 库中，无需单独指定。

    ```Python Python theme={null}
    pip install llama-index llama-index-core llama-index-tools-exa
    ```

    同时请确保已正确初始化 API 密钥。以下代码使用 `EXA_API_KEY` 作为对应的环境变量名。

    <Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建密钥。新账户可获得免费积分。
    </Card>
  </Step>

  <Step title="实例化 Exa 工具">
    导入对应的 Exa integration 库，并实例化 LlamaIndex 的 `ExaToolSpec`。

    ```Python Python theme={null}
    from llama_index.tools.exa import ExaToolSpec
    import os

    exa_tool = ExaToolSpec(
        api_key=os.environ["EXA_API_KEY"],
    )
    ```
  </Step>

  <Step title="选择要使用的 Exa 方法">
    在本示例中，我们只需向 agent 传入 [search&#95;and&#95;retrieve&#95;highlights](https://docs.llamaindex.ai/en/stable/api_reference/tools/exa/) 方法，因此用 LlamaIndex 的 `.to_tool_list` 方法来指定。同时还传入 `current_date`，这是一个简单的实用函数，可以让 agent 知道当前日期。

    ```Python Python theme={null}
    print('Tools that are provide by Exa LlamaIndex integration:')
    print('\n'.join(map(str, (exa_tool.spec_functions))))

    search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
        spec_functions=["search_and_retrieve_highlights", "current_date"]
    )
    ```
  </Step>

  <Step title="搭建 OpenAI agent 并发起由 Exa 驱动的请求">
    创建 [OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/)，并传入上面筛选出的 tools 集合。

    ```Python Python theme={null}
    from llama_index.agent.openai import OpenAIAgent

    agent = OpenAIAgent.from_tools(
        search_and_retrieve_highlights_tool,
        verbose=True,
    )
    ```

    随后即可使用 chat 方法与该 agent 交互。

    ```Python Python theme={null}
    agent.chat(
        "Can you summarize the news from the last month related to the US stock market?"
    )
    ```

    该 agent 会调用你提供给它的 Exa tools，再根据结果作答。具体输出会随 query 以及 Exa 返回页面的发布日期而变化。
  </Step>
</Steps>

<Columns cols={2}>
  <Card title="Search API 指南" icon="search" href="/zh/docs/search/quickstart" cta="阅读指南" arrow="true">
    查看 Exa 搜索参数与响应字段。
  </Card>

  <Card title="LlamaIndex 工具参考" icon="book" href="https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/" cta="查看参考" arrow="true">
    探索 LlamaIndex tools 与 agent 配置。
  </Card>
</Columns>