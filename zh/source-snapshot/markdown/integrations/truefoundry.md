> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

# TrueFoundry {#truefoundry}

> 将 Exa 接入 TrueFoundry MCP 网关，实现集中式访问控制、工具管理和用量监控。

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway) 是一个位于你的应用与 LLM 提供方或 MCP server 之间的企业级代理层，可统一访问 1,000 多个 LLM，并提供集中式可观测性与治理能力。

TrueFoundry 已在其 [MCP 网关](https://www.truefoundry.com/mcp-gateway) 中将 Exa 作为官方远程 server 提供。接入 Exa MCP server，即可为团队提供一个统一托管的端点，用于网页搜索、内容抓取和 agentic research。

<Frame caption="TrueFoundry 官方远程 MCP server 目录中的 Exa">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="The Exa server in TrueFoundry's official remote MCP catalog" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

## 将 Exa 添加到 TrueFoundry {#add-exa-to-truefoundry}

1. 在 TrueFoundry sidebar 中打开 **MCP Servers**，然后选择 **Add new MCP Server**。
2. 选择 **Connect Official Remote MCP Servers**。

<Frame caption="选择官方远程 MCP server 目录">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="TrueFoundry's Add MCP Server picker with Connect Official Remote MCP Servers selected" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. 在目录中找到 **Exa**，然后选择 **+ Add**。
4. 确认预填的 server 信息：

| Field          | Value                                                     |
| -------------- | --------------------------------------------------------- |
| Name           | `exa`                                                     |
| Description    | Search Engine made for AIs by Exa                         |
| URL            | `https://mcp.exa.ai/mcp`                                  |
| Authentication | 可选 (该 MCP Server 无需身份验证即可使用，只有在达到免费速率限制后才需要 Exa API 密钥。)  |

5. 添加需要管理或使用该 server 的用户或团队。保持 **Auth Data** 为关闭状态，然后选择 **Update MCP Server**。

<Frame caption="配置 Exa server 及其协作者">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="Exa MCP server registration form with its name, URL, collaborators, and authentication settings" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  打开 **Tools** 标签页，确认 Exa 的 search、内容抓取和 agentic research tools 均已可用。
</Check>

## 配置 Exa server {#configure-the-exa-server}

预填的 URL 提供 Exa 的默认工具集。仅当你需要限制可用的 tools 或使用自己的 API 密钥时，才需要修改它。

### 选择可用的 tools {#choose-which-tools-are-available}

在 `tools` query 参数中传入以逗号分隔的工具名称列表：

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

你可以在 server 表单中填写该 URL，也可以使用 **Apply using YAML**：

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
  你可以在 [Exa MCP 文档](/zh/docs/get-started/exa-mcp)中查看可用的工具名称。
</Tip>

### 使用你的 Exa API 密钥突破免费速率限制 {#use-your-exa-api-key-to-bypass-the-free-rate-limit}

如果达到了免费速率限制，请将你的 Exa API 密钥添加到 server URL 中：

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

## 连接 MCP 客户端 {#connect-an-mcp-client}

打开 Exa server 的 **How To Use** 标签页，选择你使用的客户端。TrueFoundry 会为 Cursor、Claude Code、VS Code、Windsurf、Codex 等 MCP 客户端生成租户专属的端点和可直接粘贴的配置。

<Frame caption="复制适用于你的 MCP 客户端的配置">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="TrueFoundry's client-specific setup instructions for the Exa MCP server" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

## 测试工具 {#test-a-tool}

在某个 Exa 工具旁点击 **Try**，填入输入参数，然后点击 **Execute Tool**。playground 会显示 JSON 响应，方便你在将该工具用于 agent 之前先行验证。

<Frame caption="在 TrueFoundry playground 中运行 Exa 工具">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Testing an Exa tool in the TrueFoundry tool playground" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

## 管理和监控 tools {#manage-and-monitor-tools}

* 逐个开启或关闭 tools，控制 MCP 客户端可调用的范围
* 使用 **Tool Metrics** 查看流量、延迟和错误
* 通过 OpenTelemetry 将调用链路导出到你的可观测性系统

<Frame caption="管理向 MCP 客户端开放的 Exa tools">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="TrueFoundry MCP server 中可用的 Exa tools" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

## 资源 {#resources}

<Columns cols={3}>
  <Card title="TrueFoundry 设置指南" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="打开指南" arrow="true">
    阅读 TrueFoundry 关于其 Exa MCP server 的指南。
  </Card>

  <Card title="Exa MCP 文档" icon="search" href="/zh/docs/get-started/exa-mcp" cta="打开指南" arrow="true">
    了解 Exa 的 tools、配置和使用示例。
  </Card>

  <Card title="Exa MCP Server" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="查看源文件" arrow="true">
    在 GitHub 上查看 server 源代码和版本发布。
  </Card>
</Columns>