> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入探索前，可通过该文件了解所有可用页面。

<div id="exa-in-codex-and-chatgpt">
  # 在 Codex 和 ChatGPT 中使用 Exa
</div>

> 直接在 Codex 和 ChatGPT 中使用 Exa 搜索网页、阅读任意页面并开展研究。

只需安装一次 Exa 插件，即可让 Codex 和 ChatGPT 通过 Exa 访问实时网络。无需离开当前对话或编程会话，即可搜索最新信息、阅读关键来源并进行更深入的研究。

<div id="install-exa">
  ## Install Exa
</div>

<Steps>
  <Step title="打开插件">
    访问 [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app)，即可在 OpenAI 的插件目录中打开 **Exa**；ChatGPT 和 Codex 共用同一个目录。
  </Step>

  <Step title="安装插件">
    点击加号按钮进行安装。出现提示时登录 Exa，可以在安装过程中登录，也可以在 Codex 或 ChatGPT 首次使用时登录。

    <Frame caption="在 Codex 中打开 Plugins、添加 Exa 并授权访问">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Opening Plugins in Codex, viewing the Exa plugin, and authorizing access" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="开启新会话">
    skill 只会在安装之后启动的聊天和 CLI 会话中加载，因此请新开一个会话，试着提出需要联网的请求。
  </Step>
</Steps>

到这里就完成了。该插件已同时包含 Exa 的 MCP integration 和 skill，无需再单独配置 MCP 或 skill。

<div id="build-with-whats-on-the-web-right-now">
  ## 用网络上此刻的最新内容来构建
</div>

你所依赖的库、API 和 tools 每天都在变化。安装 Exa 后，Codex 可以在工作过程中搜索最新的文档、issues、变更日志和实际用例。

在你的代码仓库中：

```text theme={null}
我们现在用的是 Tailwind v3。搜索 Tailwind v4 升级指南并阅读，
然后把这个项目迁移到 v4。
```

Codex 可以用 Exa 搜索、阅读相关来源，并根据检索到的内容在你的代码库中完成修改。

只要答案可能在代码仓库之外，这套做法同样适用：

* “在动手修复之前，先搜索 `tokio-tungstenite` 的 issues 和变更日志，找找这个错误。”
* “找一些 Rust 中使用 Postgres 咨询锁的真实示例，并推荐适合这个工作线程池的模式。”
* “阅读 Stripe webhook 的最新文档，并对照检查我们的实现。”
* “搜索这个依赖的最新迁移指南，然后完成升级。”

<div id="search-read-and-research">
  ## 搜索、阅读与研究
</div>

Exa 插件为 Codex 和 ChatGPT 提供了三种与网页交互的方式。

<Columns cols={3}>
  <Card title="搜索" icon="search">
    用自然语言搜索，直接获取最相关页面的内容，而不是一串链接。
  </Card>

  <Card title="阅读" icon="file-text">
    读取你指定的页面，无论是文档、变更日志、issue 还是博客文章。
  </Card>

  <Card title="研究" icon="compass">
    处理需要多次搜索才能解答的问题，并给出带引用来源的答案。
  </Card>
</Columns>

<div id="research-without-leaving-chatgpt">
  ## 无需离开 ChatGPT 即可研究
</div>

Exa 同样支持在 ChatGPT 中使用。提出需要最新信息的问题，即可直接在对话中用 Exa 搜索并研究网络内容。

```text theme={null}
对比主流开源向量数据库的托管服务、许可协议和定价。
请使用最新的一手资料，并注明出处。
```

ChatGPT 不再只能依赖上下文中已有的信息，而是可以借助 Exa 查找并阅读完成任务所需的来源。

你可以将它用于竞品研究、技术研究、市场图谱、公司调研，或任何答案散落在网络各处的场景。

<div id="mcp-skills-together">
  ## MCP + skills，协同工作
</div>

在底层，该插件整合了 Exa agent 技术栈中的两个部分。

[Exa MCP](/zh/docs/get-started/exa-mcp) 为 Codex 和 ChatGPT 提供访问 Exa 的 tools，是连接 agent 与 Exa 搜索和研究能力的桥梁。

[Exa skills](/zh/docs/get-started/agent-skills/overview) 则为 agent 补充指令，指导它在实用的工作流中运用这些能力，包括网络研究和 [Exa Agent](/zh/docs/agent/quickstart)。

安装插件后，你无需再分别配置这两者。

<div id="prefer-mcp-directly">
  ## 更想直接使用 MCP？
</div>

插件是在 Codex 和 ChatGPT 中使用 Exa 的推荐方式。如果你要手动配置 Codex，或使用其他 MCP 客户端，也可以直接连接到 Exa 托管的 MCP server：

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

有关其他客户端、配置选项和可用 tools，请参阅 [Exa MCP](/zh/docs/get-started/exa-mcp)。

<Card title="为 ChatGPT 和 Codex 安装 Exa" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  从 ChatGPT 插件市场添加 Exa 插件。
</Card>