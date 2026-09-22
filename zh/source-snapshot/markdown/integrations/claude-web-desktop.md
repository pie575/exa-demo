> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="exa-in-claude-code-web-and-desktop">
  # 在 Claude Code、Web 和 Desktop 中使用 Exa
</div>

> 直接在 Claude 中用 Exa 搜索网页、阅读任意页面

在 Claude Code 中安装 Exa，或将其连接到 Claude Web、Desktop 和 Cowork，让 Claude 获取网络上的最新信息。Claude 可以用自然语言搜索，阅读关键页面，并在工作过程中引用这些来源。

<div id="install-exa">
  ## 安装 Exa
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web、Desktop 和 Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="打开连接器目录">
          在新的 Claude 对话中，点击加号按钮，选择 **Add connector**，然后搜索 **Exa**。
        </Step>

        <Step title="连接 Exa">
          打开 Exa，选择 **Connect to Claude**，并在出现提示时授权访问。

          <Frame caption="在 Claude 中打开连接器目录，找到 Exa，完成连接并授权访问">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="在 Claude 中打开连接器目录，找到 Exa，完成连接并授权访问" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
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
          打开一个新的 Claude Code 会话以加载插件，然后提出需要联网的问题。

          <Frame caption="打开新的 Claude Code 会话并提出需要联网的问题">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="打开新的 Claude Code 会话并提出需要联网的问题" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

两种方式都无需编辑 MCP 配置文件即可使用 Exa。

<div id="work-with-whats-on-the-web-right-now">
  ## 用上网络上此刻的最新信息
</div>

在 Claude Code 中，Exa 可以在你操作代码仓库的同时，搜索最新的文档、issues、变更日志和真实场景示例。同一个 integration 还能为 Claude Web、Desktop 和 Cowork 带来最新的新闻、研究、公司信息、产品详情，以及其他尚未进入上下文的 sources。

```text theme={null}
我们现在用的是 Tailwind v3。用 Exa 找到并阅读官方的 Tailwind v4
升级指南，然后把这个项目迁移到 v4。
```

Claude Code 可以利用检索到的内容修改你的代码库。在其他 Claude 客户端中，它可以将这些相同的 sources 用于回答、artifacts 和 Cowork 任务。

只要答案取决于最新的或特定的网络 sources，这一模式同样适用：

* “查找该依赖项的最新发布说明，并总结其中的破坏性变更。”
* “搜索推理时扩展方面的近期一手 research，并比较各种方法。”
* “阅读当前的 Stripe webhook 文档，并说明推荐的重试行为。”
* “查找这些产品的官方定价页面，并比较它们的入门级 plan。”

<div id="search-read-and-research">
  ## 搜索、阅读与研究
</div>

Exa integration 为 Claude 提供了搜索和阅读网页的 tools，Claude 可以在较长的研究任务中组合使用这些能力。

<Columns cols={3}>
  <Card title="Search" icon="search">
    用自然语言进行 search，直接获取相关的页面内容，而不只是一串链接。
  </Card>

  <Card title="阅读" icon="file-text">
    阅读你指定的页面，包括文档、研究资料、变更日志、issues 和文章。
  </Card>

  <Card title="研究" icon="compass">
    执行多次 search，查阅有价值的页面，并将证据整合成带来源出处的响应。
  </Card>
</Columns>

<div id="research-without-leaving-claude">
  ## 无需离开 Claude 即可完成研究
</div>

直接说出你想要的结果，并告诉 Claude 你看重哪些类型的信息源：

```text theme={null}
对比主流开源向量数据库的托管方案、许可协议和定价。
请使用最新的一手资料，并注明出处。
```

Claude 可以在整个对话过程中调用 Exa，查找并阅读完成任务所需的信息来源。适用于技术研究、竞品分析、市场版图梳理、公司调研，以及任何答案散落在网络各处的问题。

<div id="use-exa-in-cowork">
  ## 在 Cowork 中使用 Exa
</div>

同一个连接器在 Cowork 中同样可用。给 Claude 分配一项依赖外部信息的任务，它就能一边处理你的文件和其他已连接的 tools，一边搜索或读取网页。

```text theme={null}
审阅这份竞品简报，用 Exa 对照厂商当前页面逐条核实其中的定价说法，
并在文档中补充引用来源。
```

<div id="prefer-mcp-directly">
  ## 更想直接用 MCP？
</div>

如果你想手动配置 Claude，或使用其他 MCP 客户端，可以直接连接到 Exa 托管的 MCP server：

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

有关其他客户端、配置选项和可用 tools，请参阅 [Exa MCP](/zh/docs/get-started/exa-mcp)。

<Card title="打开 Exa 连接器" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  在 Claude 的连接器目录中添加 Exa。
</Card>