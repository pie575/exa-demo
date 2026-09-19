> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="truefoundry">
  # TrueFoundry
</div>

> 将 Exa 接入 TrueFoundry MCP Gateway，实现集中式访问控制、工具管理和用量监控。

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) 是位于你的应用与 LLM 提供商或 MCP 服务器之间的企业级代理层，可统一访问 1,000 多个 LLM，并提供集中化的可观测性与治理能力。

TrueFoundry 在其 [MCP Gateway](https://www.truefoundry.com/mcp-gateway) 中将 Exa 作为官方远程服务器提供。接入 Exa MCP 服务器后，你的团队只需一个受管端点即可完成网页搜索、内容抓取和智能体研究。

<Frame caption="TrueFoundry 官方远程 MCP 服务器目录中的 Exa">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="The Exa server in TrueFoundry's official remote MCP catalog" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## 将 Exa 添加到 TrueFoundry
</div>

1. 在 TrueFoundry 侧边栏中打开 **MCP Servers**，然后选择 **Add new MCP Server**。
2. 选择 **Connect Official Remote MCP Servers**。

<Frame caption="选择官方远程 MCP 服务器目录">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="TrueFoundry 的 Add MCP Server 选择器，已选中 Connect Official Remote MCP Servers" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. 在目录中找到 **Exa**，然后选择 **+ Add**。
4. 确认预填的服务器信息：

| 字段             | 值                                                       |
| -------------- | ------------------------------------------------------- |
| Name           | `exa`                                                   |
| Description    | Search Engine made for AIs by Exa                       |
| URL            | `https://mcp.exa.ai/mcp`                                |
| Authentication | 可选 (该 MCP 服务器无需认证即可使用，只有在达到免费额度的速率限制时才需要 Exa API key。)  |

5. 添加需要管理或使用该服务器的用户或团队。**Auth Data** 保持关闭，然后选择 **Update MCP Server**。

<Frame caption="配置 Exa 服务器及其协作者">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Exa MCP 服务器注册表单，包含名称、URL、协作者和认证设置" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  打开 **Tools** 标签页，确认 Exa 的搜索、内容抓取和智能体研究工具均已可用。
</Check>

<div id="configure-the-exa-server">
  ## 配置 Exa 服务器
</div>

预填的 URL 提供 Exa 的默认工具集。只有在需要限制可用工具或使用自己的 API key 时，才需要修改它。

<div id="choose-which-tools-are-available">
  ### 选择可用的工具
</div>

在 `tools` 查询参数中传入以逗号分隔的工具名称列表：

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

你可以在服务器表单中填写该 URL，也可以使用 **Apply using YAML**：

```yaml theme={null}
url: >-
  https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
name: exa
type: mcp-server/remote
description: Search Engine made for AIs by Exa
collaborators:
  - role_id: mcp-server-manager
    subject: user:you@your-company.com
```

<Tip>
  可用的工具名称请参见 [Exa MCP 文档](/zh/docs/get-started/exa-mcp)。
</Tip>

<div id="use-your-exa-api-key-to-bypass-the-free-rate-limit">
  ### 使用你的 Exa API key 突破免费速率限制
</div>

如果你已达到免费速率限制，请将你的 Exa API key 添加到服务器 URL 中：

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建一个 key。新账户可免费获得一定额度的积分。
</Card>

<div id="connect-an-mcp-client">
  ## 连接 MCP 客户端
</div>

打开 Exa 服务器的 **How To Use** 标签页，选择你所使用的客户端。TrueFoundry 会为 Cursor、Claude Code、VS Code、Windsurf、Codex 等 MCP 客户端生成租户专属的端点和可直接粘贴的配置。

<Frame caption="复制适用于你的 MCP 客户端的配置">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="TrueFoundry 针对 Exa MCP 服务器提供的客户端专属设置说明" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## 测试工具
</div>

点击某个 Exa 工具旁的 **Try**，填入输入参数，然后点击 **Execute Tool**。Playground 会显示 JSON 响应，方便你在将该工具用于 agent 之前先行验证。

<Frame caption="在 TrueFoundry playground 中运行 Exa 工具">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Testing an Exa tool in the TrueFoundry tool playground" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## 管理与监控工具
</div>

* 逐个启用或禁用工具，控制 MCP 客户端可调用哪些工具
* 使用 **Tool Metrics** 查看流量、延迟和错误
* 通过 OpenTelemetry 将调用链路导出到你的可观测性平台

<Frame caption="管理向 MCP 客户端开放的 Exa 工具">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="TrueFoundry MCP 服务器提供的 Exa 工具" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## 资源
</div>

<Columns cols={3}>
  <Card title="TrueFoundry 设置指南" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="打开指南" arrow="true">
    阅读 TrueFoundry 关于其 Exa MCP 服务器的指南。
  </Card>

  <Card title="Exa MCP 文档" icon="search" href="/zh/docs/get-started/exa-mcp" cta="打开指南" arrow="true">
    了解 Exa 的工具、配置与使用示例。
  </Card>

  <Card title="Exa MCP Server" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="查看源码" arrow="true">
    在 GitHub 上查看服务器源码与版本发布。
  </Card>
</Columns>