> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="exa-in-codex-and-chatgpt">
  # 在 Codex 和 ChatGPT 中使用 Exa
</div>

> 直接在 Codex 和 ChatGPT 中使用 Exa 搜索网页、阅读任意页面并开展研究。

只需安装一次 Exa 插件，Codex 和 ChatGPT 即可通过 Exa 访问实时网络。无需离开当前对话或编码会话，就能搜索最新信息、阅读关键来源，并进行更深入的研究。

<div id="install-exa">
  ## 安装 Exa
</div>

<Steps>
  <Step title="打开插件">
    访问 [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app)，该链接会在 OpenAI 的插件目录中打开 **Exa**；ChatGPT 和 Codex 共用同一个目录。
  </Step>

  <Step title="安装插件">
    点击加号按钮即可安装。出现提示时登录 Exa，可以在安装过程中登录，也可以等 Codex 或 ChatGPT 首次调用时再登录。

    <Frame caption="在 Codex 中打开 Plugins、添加 Exa 并授权访问">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Opening Plugins in Codex, viewing the Exa plugin, and authorizing access" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="开启新会话">
    技能只会在安装之后新建的聊天和 CLI 会话中加载，因此请新开一个会话，提出一个需要联网才能回答的问题。
  </Step>
</Steps>

大功告成。该插件已同时包含 Exa 的 MCP 集成和技能，无需再单独配置 MCP 或技能。

<div id="build-with-whats-on-the-web-right-now">
  ## 用网络上最新的信息来构建
</div>

你所使用的库、API 和工具每天都在变化。安装 Exa 后，Codex 可以在工作过程中搜索最新的文档、issue、更新日志和真实案例。

在你的仓库中：

```text theme={null}
我们目前用的是 Tailwind v3。搜索 Tailwind v4 的升级指南并读完它，
然后把这个项目迁移到 v4。
```

Codex 可以用 Exa 进行搜索、阅读相关来源，并据此在你的代码库中完成修改。

只要答案可能在仓库之外，这套方式同样适用：

* “在尝试修复之前，先搜索 `tokio-tungstenite` 的 issues 和 changelog 里关于这个错误的信息。”
* “找一些 Rust 中 Postgres advisory locks 的真实示例，并推荐适合这个 worker pool 的模式。”
* “阅读当前的 Stripe webhook 文档，并对照检查我们的实现。”
* “搜索这个依赖的最新迁移指南，然后完成升级。”

<div id="search-read-and-research">
  ## 搜索、阅读与研究
</div>

Exa 插件为 Codex 和 ChatGPT 提供了三种与网页交互的方式。

<Columns cols={3}>
  <Card title="搜索" icon="search">
    用自然语言搜索，直接拿到最佳页面的正文内容，而不是一串链接。
  </Card>

  <Card title="阅读" icon="file-text">
    阅读你指定的页面，无论是文档、更新日志、issue 还是博客文章。
  </Card>

  <Card title="研究" icon="compass">
    深入处理需要多次搜索才能解决的问题，并给出带引用来源的答案。
  </Card>
</Columns>

<div id="research-without-leaving-chatgpt">
  ## 无需离开 ChatGPT 即可开展研究
</div>

Exa 同样支持在 ChatGPT 中使用。当你的问题需要最新信息时，可直接在对话中用 Exa 搜索和研究网络内容。

```text theme={null}
对比主流开源向量数据库的托管服务、许可方式和定价。
请使用最新的一手资料，并注明出处。
```

ChatGPT 不再局限于上下文中已有的信息，而是可以借助 Exa 查找并阅读任务所需的信息来源。

无论是竞品调研、技术调研、市场图谱、公司调研，还是其他答案散落在网络各处的场景，都可以这样使用。

<div id="mcp-skills-together">
  ## MCP + 技能，强强联合
</div>

在底层，该插件整合了 Exa agent 技术栈的两个部分。

[Exa MCP](/zh/docs/get-started/exa-mcp) 为 Codex 和 ChatGPT 提供访问 Exa 的工具，是连接 agent 与 Exa 搜索和研究能力的桥梁。

[Exa 技能](/zh/docs/get-started/agent-skills/overview)则为 agent 提供额外指令，指导它在实用工作流中运用这些能力，包括网页研究和 [Exa Agent](/zh/docs/agent/quickstart)。

安装插件后，你无需再分别配置这两者。

<div id="prefer-mcp-directly">
  ## 更想直接使用 MCP？
</div>

在 Codex 和 ChatGPT 中使用 Exa，推荐通过插件。如果你要手动配置 Codex，或使用其他 MCP 客户端，也可以直接连接 Exa 托管的 MCP 服务器：

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

有关其他客户端、配置选项和可用工具，请参阅 [Exa MCP](/zh/docs/get-started/exa-mcp)。

<Card title="为 ChatGPT 和 Codex 安装 Exa" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  从 ChatGPT 应用市场添加 Exa 插件。
</Card>