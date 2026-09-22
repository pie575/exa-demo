> ## 文档索引 {#documentation-index}
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件查看所有可用页面。

# Pydantic AI {#pydantic-ai}

> 为 Pydantic AI agent 配备由 Exa search API 支持的网页研究工具。

<Card title="编码智能体快速开始" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  第一次使用 Exa？一分钟内即可上手。
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/) 是 Pydantic 团队推出的 Python agent 框架。其 [harness](https://pydantic.dev/docs/ai/harness/exa-search/) 以两个可组合的能力形式内置了官方 Exa integration：

* **`ExaSearch`**：由 Exa Search API 支持的网页研究工具，包括 `web_search` (返回排名靠前的结果及其最相关的摘录，并可选附带综合生成的文本摘要) 、`get_page` (针对指定 URL 的整页 retrieval) ，以及可选启用的 `deep_search` (一次调用即可获得带引用的综合答案) 。
* **`ExaAgent`**：将长时间运行的研究以 deferred tool calls 的形式委托给 [Exa Agent API](/zh/docs/agent/quickstart)。

一个能力会打包好相应的 tools、各工具的输出预算，以及 system prompt 中简短的研究 guidance，你无需自己把 search API 与页面抓取器对接起来，也无需自己编写 prompt 引导 agent 有条不紊地开展研究。

<Info> 查看 Pydantic 提供的完整 reference，请点击[此处](https://pydantic.dev/docs/ai/harness/exa-search/)。 </Info>

<Card title="阅读 Pydantic 关于使用 Exa 构建研究 agent 的文章" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  详解三个基于 Pydantic AI 和 Exa 构建、可直接复制使用的研究 agent。
</Card>

***

## Get Started {#get-started}

<Steps>
  <Step title="前置条件与安装">
    安装带 Exa extra 的 harness，并设置 `EXA_API_KEY` 环境变量。

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建密钥。新账户会附赠免费积分。
    </Card>
  </Step>

  <Step title="为 agent 添加 ExaSearch">
    通过 `capabilities` 参数将 `ExaSearch` 传入 `Agent`。默认情况下，身份验证凭据取自 `EXA_API_KEY`。

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch` 为 agent 提供两个 tools：

    | 工具           | 用途                                                                 |
    | ------------ | ------------------------------------------------------------------ |
    | `web_search` | search 网络并返回排名靠前的 `num_results` 个页面，每个页面包含标题、URL 及其最相关的摘录。         |
    | `get_page`   | 获取指定 URL 的 full text —— 可以是 `web_search` 中值得深入的命中结果，也可以是用户提供的 URL。 |

    `web_search` 返回的是简短摘录 (Exa highlights) 而非整页文本，因此浏览多个来源的开销很低；随后 agent 再用 `get_page` 精读选定的页面。若某个 URL 或问题没有返回内容、触发速率限制或出现临时故障，都会以 `ModelRetry` 的形式反馈给模型，让本次运行有机会恢复；而身份验证失败 (401/403) 则会作为配置错误向上抛出。
  </Step>

  <Step title="启用深度搜索（可选）">
    `deep_search` 会运行 Exa 的多步[深度搜索](/zh/docs/search/quickstart) (`type='deep'`) ：Exa 将问题拆解为多个查询，执行 search，并在一次工具调用中返回有据可依、附带引用来源的答案。它比 `web_search` 耗时更长、搜索更深入，因此默认关闭。需显式启用：

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    启用后，该能力的指令会告知模型：应将 `deep_search` 视为 `web_search` 的升级手段，而非替代品。
  </Step>
</Steps>

***

## 配置 {#configuration}

`ExaSearch` 的每个 field 及其默认值：

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # 每次 web_search 调用返回的结果数（1 到 100）
    max_text_chars=10_000,     # get_page 文本上限，单位为字符（1 到 10,000）
    text_summary=False,        # web_search 同时返回合成的文本摘要
    include_deep_search=False, # 同时提供 deep_search 工具
    include_domains=[],        # 仅搜索这些域名（允许列表）
    exclude_domains=[],        # 从不搜索这些域名（屏蔽列表）
    guidance=None,             # None = 默认指令，'' = 不使用，str = 自定义
    client=None,               # ExaClient —— 为 None 时根据 EXA_API_KEY 构建 exa_py.AsyncExa
)
```

`include_domains` 和 `exclude_domains` 适用于 `web_search` 和 `deep_search`，且两者互斥。限制值超出范围或同时设置这两个域名列表，都会在构造时抛出异常。

### 文本摘要 {#text-summary}

设置 `text_summary` 后，每次 `web_search` 调用都会同时请求对结果生成的纯文本摘要。传入 `True` 表示不限定格式的摘要，或传入一个字符串来描述所需的格式：

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

该工具的返回结构保持不变：当 Exa 返回 summary 时，它会以 `Summary:` 开头的一行形式添加到结果最前面。

### 结构化引用来源 {#structured-citations}

每个工具都会返回一个 `ToolReturn`：`return_value` 包含模型看到的可读文本 (含 `Sources:` 块) ，`metadata` 则在 `'sources'` 键下以结构化的 `ExaSource` 记录 (`{'url': ..., 'title': ...}`) 形式提供各个 source。元数据不会发送给模型，因此渲染引用来源时无需解析文本：

```Python Python theme={null}
from pydantic_ai.messages import ModelRequest, ToolReturnPart

for message in result.all_messages():
    if isinstance(message, ModelRequest):
        for part in message.parts:
            if isinstance(part, ToolReturnPart) and part.metadata is not None:
                for source in part.metadata.get('sources', []):
                    print(source['url'], source['title'])
```

### 自定义客户端 {#custom-client}

默认客户端为 `exa_py.AsyncExa`，由 `EXA_API_KEY` 配置。你可以传入任何满足 `ExaClient` 协议的对象，以显式配置认证或基础 URL，或在测试中替换为伪造实现：

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

## Exa agent 运行 {#exa-agent-runs}

[Exa Agent API](/zh/docs/agent/quickstart) 以异步方式执行开放式研究任务。`ExaAgent` 能力将该生命周期映射到 Pydantic AI 的 [deferred tool calls](https://pydantic.dev/docs/ai/deferred-tools/)：其 `exa_agent` 工具会创建运行并进入延迟状态，并在延迟调用的元数据中携带 Exa 运行 ID。

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

默认情况下 (`execution='inline'`) ，该能力会在 agent 运行内部轮询 Exa 运行直至完成，从而自行处理延迟调用，因此该工具的表现与普通工具无异 (只是慢一些) 。设置 `execution='external'` 时，这些调用会以 `DeferredToolRequests` 输出的形式向上传递，交由宿主应用在带外处理。

`ExaAgent` 的每个 field 及其默认值：

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None = API 默认值
    execution='inline',   # 'inline' 轮询直至完成；'external' 将 DeferredToolRequests 向上抛出
    output_schema=None,   # 用于结构化输出的 BaseModel 类或 dict schema
    system_prompt=None,   # 转发给 Exa agent 运行
    poll_interval=1000,   # inline 模式下两次轮询的间隔（毫秒）
    timeout_ms=3_600_000, # inline 模式下等待运行完成的时长（毫秒）
    guidance=None,        # None = 默认指令，'' = 无，str = 自定义
    runs=None,            # ExaAgentRuns -- None 时根据 EXA_API_KEY 构建 AsyncExa().agent.runs
)
```

***

## Agent spec (YAML/JSON) {#agent-spec-yamljson}

这两种能力都支持 Pydantic AI 的 [agent spec](https://pydantic.dev/docs/ai/agents/#agent-spec)，因此你可以在配置文件中声明它们，而不必写 Python 代码：

```yaml agent.yaml theme={null}
model: anthropic:claude-sonnet-4-6
capabilities:
  - ExaSearch:
      num_results: 3
      include_deep_search: true
  - ExaAgent:
      effort: low
```

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent, ExaSearch

agent = Agent.from_file('agent.yaml', custom_capability_types=[ExaSearch, ExaAgent])
```

传入 `custom_capability_types`，以便 spec 加载器知道如何实例化这些能力。通过 spec 加载的 instance 始终会基于 `EXA_API_KEY` 构建默认客户端。

***

## 下一步 {#next}

* [**Search API**](/zh/docs/search/quickstart) - 语义搜索，支持 highlights、摘要和深度搜索
* [**Agent API**](/zh/docs/agent/quickstart) - 开放式的异步研究运行
* [**MCP 设置**](/zh/docs/get-started/exa-mcp) - Exa 托管的 MCP server
* [**SDK**](/zh/docs/sdks/quickstart) - Python 和 JavaScript SDK 文档