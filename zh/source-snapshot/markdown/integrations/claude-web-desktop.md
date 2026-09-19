> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件查看所有可用页面。

<div id="exa-in-claude-code-web-and-desktop">
  # 在 Claude Code、Web 和桌面端使用 Exa
</div>

> 直接在 Claude 中用 Exa 搜索网页、读取任意页面

在 Claude Code 中安装 Exa，或将其连接到 Claude Web、桌面端和 Cowork，让 Claude 能获取网络上的最新信息。Claude 可以用自然语言搜索，读取关键页面，并在工作时引用这些来源。

<div id="install-exa">
  ## 安装 Exa
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web、Desktop 与 Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="打开连接器目录">
          在新的 Claude 对话中，点击加号按钮，选择 **Add connector**，然后搜索 **Exa**。
        </Step>

        <Step title="连接 Exa">
          打开 Exa，选择 **Connect to Claude**，并在出现提示时授权访问。

          <Frame caption="在 Claude 中打开连接器目录、找到 Exa、进行连接并授权访问">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="在 Claude 中打开连接器目录、找到 Exa、进行连接并授权访问" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="使用 Exa">
          开启一个新对话，提出需要从网络获取最新信息的问题。
        </Step>
      </Steps>
    </Tab>

    <Tab title="Claude Code CLI" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="安装插件">
          在终端中安装 Exa：

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          你也可以在 Claude Code 中输入 `/plugin`，搜索 **Exa** 并安装。
        </Step>

        <Step title="开启新会话">
          打开一个新的 Claude Code 会话以加载插件，然后提出需要联网才能回答的问题。

          <Frame caption="开启新的 Claude Code 会话并提出需要联网才能回答的问题">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="开启新的 Claude Code 会话并提出需要联网才能回答的问题" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

这两种方式都无需编辑 MCP configuration 文件即可启用 Exa。

<div id="work-with-whats-on-the-web-right-now">
  ## 用上网络上此刻的最新内容
</div>

在 Claude Code 中，Exa 可以在你操作代码仓库的同时，搜索最新的文档、issue、变更日志和真实场景示例。同样的集成也能为 Claude Web、Desktop 和 Cowork 提供最新资讯、研究成果、公司信息、产品详情，以及其他可能尚未进入上下文的资料。

```text theme={null}
我们现在用的是 Tailwind v3。用 Exa 找到并阅读官方的 Tailwind v4
升级指南，然后把这个项目迁移到 v4。
```

Claude Code 可以基于检索到的内容直接在你的代码库中做出修改。在其他 Claude 客户端中，它同样可以将这些来源用于回答、artifacts 和 Cowork 任务。

只要答案取决于最新的或特定的网络来源，这一模式都同样适用：

* “查找这个依赖项的最新发布说明，并总结其中的破坏性变更。”
* “搜索推理时扩展方面的近期一手研究，并比较各种方法。”
* “阅读 Stripe 当前的 webhook 文档，并说明推荐的重试行为。”
* “查找这些产品的官方定价页面，并比较它们的入门级套餐。”

<div id="search-read-and-research">
  ## 搜索、阅读与研究
</div>

Exa 集成为 Claude 提供了搜索和阅读网页的工具，Claude 可以在较长的研究任务中将它们组合使用。

<Columns cols={3}>
  <Card title="搜索" icon="search">
    用自然语言搜索，获取相关的页面内容，而不只是一份链接列表。
  </Card>

  <Card title="阅读" icon="file-text">
    阅读你指定的页面，包括文档、研究资料、变更日志、issue 和文章。
  </Card>

  <Card title="研究" icon="compass">
    执行多次搜索，查阅有价值的页面，并将证据整合成带来源的回答。
  </Card>
</Columns>

<div id="research-without-leaving-claude">
  ## 无需离开 Claude 即可完成研究
</div>

直接说明你想要的结果，并告诉 Claude 哪类信息源更重要：

```text theme={null}
对比主流开源向量数据库的托管服务、许可方式和定价。
请使用最新的一手资料，并注明出处。
```

Claude 可以在整个对话过程中调用 Exa，查找并阅读完成任务所需的资料。可用于技术调研、竞品分析、市场版图梳理、公司调研，或任何答案散落在网络各处的问题。

<div id="use-exa-in-cowork">
  ## 在 Cowork 中使用 Exa
</div>

同一个连接器在 Cowork 中同样可用。把需要外部信息的任务交给 Claude，它就能一边使用你的文件和其他已连接的工具，一边搜索或读取网页。

```text theme={null}
审阅这份竞品简报，用 Exa 对照各供应商的最新页面逐条核实定价说法，
并在文档中补充引用来源。
```

<div id="prefer-mcp-directly">
  ## 更愿意直接使用 MCP？
</div>

如果你想手动配置 Claude，或者使用其他 MCP 客户端，可以直接连接到 Exa 托管的 MCP 服务器：

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

有关其他客户端、配置选项以及可用工具，请参阅 [Exa MCP](/zh/docs/get-started/exa-mcp)。

<Card title="打开 Exa 连接器" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  在 Claude 的连接器目录中添加 Exa。
</Card>