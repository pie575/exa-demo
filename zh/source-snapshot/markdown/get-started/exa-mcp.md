> ## 文档索引 {#documentation-index}
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件了解所有可用页面。

# Exa MCP {#exa-mcp}

> 将 ChatGPT、Codex、Claude、Grok、Cursor 以及任何其他 MCP 客户端连接到 Exa 的网页搜索、页面抓取、Exa Agent 和 Exa Connect tools。

使用 Exa MCP，用 Exa 的搜索能力增强 ChatGPT、Claude 及兼容 MCP 的工具中内置的网页搜索，包括网页搜索、代码搜索、[Exa Agent](/zh/docs/agent/quickstart) 和 [Exa Connect](/zh/docs/agent/connect/overview)。

Exa 提供了可在任何 MCP 客户端中使用的托管 server：

```text theme={null}
https://mcp.exa.ai/mcp
```

无需 API 密钥即可开始使用。Exa MCP 是开源项目，代码托管在 [GitHub](https://github.com/exa-labs/exa-mcp-server) 上。

## 安装 {#install}

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT & Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa 是 OpenAI 插件目录中的官方插件，其中包含托管的 MCP server 以及 Exa 的 `search` 和 `exa-agent` skill。

      <Steps>
        <Step title="打开插件">
          访问 [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app)，会在 OpenAI 的插件目录中打开 **Exa**；ChatGPT 和 Codex 共用同一个目录。
        </Step>

        <Step title="安装插件">
          点击加号按钮进行安装。出现提示时登录 Exa，可以在安装过程中登录，也可以在 Codex 或 ChatGPT 首次使用时登录。

          <Frame caption="在 Codex 中打开 Plugins、添加 Exa 并授权访问">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Opening Plugins in Codex, viewing the Exa plugin, and authorizing access" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="开启新会话">
          skill 只会在安装完成后新建的聊天和 CLI 会话中加载，因此请新开一个会话，并提出需要联网的问题。
        </Step>
      </Steps>

      就是这么简单。该插件同时包含 Exa 的 MCP integration 和 skill，无需再单独配置 MCP 或 skill。

      完整的设置和工作流指南请参阅 [Exa in Codex and ChatGPT](/zh/docs/integrations/chatgpt-codex)。
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
### Claude Code CLI {#claude-code-cli}

      <Steps>
        <Step title="安装插件">
          在终端中安装 Exa：

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          你也可以在 Claude Code 中输入 `/plugin`，搜索 **Exa** 并安装。
        </Step>

        <Step title="使用 Exa">
          启动一个新的 Claude Code 会话，提出需要联网才能回答的问题。
        </Step>
      </Steps>

### Desktop、Web 与 Cowork {#desktop-web-cowork}

      Claude Desktop、Web 和 Cowork 均使用 Exa 的官方连接器。

      <Steps>
        <Step title="打开连接器目录">
          在新对话中点击加号按钮，选择 **Add connector**，然后搜索 **Exa**。
        </Step>

        <Step title="连接 Exa">
          打开 Exa，选择 **Connect to Claude**，并在出现提示时授权访问。

          <Frame caption="在 Claude 中打开连接器目录、找到 Exa、连接并授权访问">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="在 Claude 中打开连接器目录、找到 Exa、连接并授权访问" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="使用 Exa">
          开启一个新对话，提出需要从网络获取最新信息的问题。
        </Step>
      </Steps>

      完整的设置与工作流指南请参见 [Exa in Claude Code, Web, and Desktop](/zh/docs/integrations/claude-web-desktop)。

      Claude Team 和 Enterprise 管理员也可以改为通过身份提供商为全体成员统一配置该连接器：参见 [Enterprise Managed Auth](/zh/docs/admin/mcp-enterprise-managed-auth)。
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa 已上架 [Grok Build](https://docs.x.ai/build/overview) 插件市场。

      <Steps>
        <Step title="打开插件市场">
          在 Grok Build 中运行 `/marketplace`。
        </Step>

        <Step title="安装 Exa">
          在列表中找到 **exa**，然后按 `i`。
        </Step>

        <Step title="登录">
          运行 `/mcp`，选择 **exa**，然后按 `i`，在浏览器中登录你的 Exa 账户。
        </Step>
      </Steps>

      新账户注册即可获得免费积分。
    </Tab>

    <Tab title="Cursor" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      从 [Cursor 插件市场](https://cursor.com/marketplace/exa)安装 Exa MCP，或将其添加到 `~/.cursor/mcp.json`：

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="VS Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/vscode.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9828a7b963d47467df217a38c716fea2" width="24" height="24" data-path="images/mcp-clients/vscode.svg">
      使用[一键安装](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D)，或将其添加到项目的 `.vscode/mcp.json` 中：

      ```json theme={null}
      {
        "servers": {
          "exa": {
            "type": "http",
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="其他客户端" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      大多数客户端使用标准的 `mcpServers` 结构：

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      配置存放的位置以及 URL 键的名称因客户端而异：

      | 客户端                                          | 添加位置                                                                                         | URL 键       |
      | -------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------- |
      | [fx by Vercel](/zh/docs/integrations/vercel/fx) | 在 fx shell 中执行 `/mcp add --transport http exa https://mcp.exa.ai/mcp` (保存到 `~/.fx/mcp.json`) | `url`       |
      | OpenCode                                     | `opencode.json` (在 `mcp` 下，并设置 `"type": "remote"`)                                           | `url`       |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (在 `mcpServers` 下)                                               | `url`       |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (在 `mcpServers` 下)                                     | `serverUrl` |
      | Google Antigravity                           | Agent 面板 → Manage MCP Servers → View Raw config (在 `mcpServers` 下)                           | `serverUrl` |
      | Zed                                          | Zed `settings.json` (在 `context_servers` 下)                                                  | `url`       |
      | Gemini CLI                                   | `~/.gemini/settings.json` (在 `mcpServers` 下)                                                 | `httpUrl`   |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (顶层 `exa`)                                           | `url`       |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                       | 直接粘贴 URL    |

      如果你的客户端不支持 remote MCP server，请使用 `mcp-remote` 桥接：

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
          }
        }
      }
      ```

      或者使用你的 [Exa API 密钥](https://dashboard.exa.ai/api-keys)运行本地 [npm 包](https://www.npmjs.com/package/exa-mcp-server)：

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp-server"],
            "env": {
              "EXA_API_KEY": "your_api_key"
            }
          }
        }
      }
      ```
    </Tab>
  </Tabs>
</div>

## 身份验证 {#authentication}

Exa MCP 支持三种身份验证模式：

| 模式     | 适用场景                        | 设置方式                                                            |
| ------ | --------------------------- | --------------------------------------------------------------- |
| 无密钥    | 无需登录或 API 密钥的免费限速用量         | 连接到 `https://mcp.exa.ai/mcp`                                    |
| OAuth  | 交互式客户端、插件市场安装、production 用量 | 连接到 `https://mcp.exa.ai/mcp?login`，在浏览器中登录 Exa。用量计入你的 Exa 团队。   |
| API 密钥 | 不支持 MCP OAuth 的客户端          | 连接到 `https://mcp.exa.ai/mcp`，并将 `x-api-key` header 设置为你的 API 密钥 |

### 使用 OAuth 登录 {#sign-in-with-oauth}

ChatGPT、Claude 以及其他通过插件市场安装的方式，会在需要时提示你登录。在任何支持 MCP OAuth 的客户端中，你都可以通过连接以下地址来发起相同的流程：

```text theme={null}
https://mcp.exa.ai/mcp?login
```

你的客户端会自动发现 Exa 的授权 server，打开浏览器进行登录，并管理访问权限。

### 使用 API 密钥 {#use-an-api-key}

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

在 MCP server 配置中添加 `x-api-key` header：

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

## 可用tools {#available-tools}

| 工具                        | 可用性                  | 用途                    |
| ------------------------- | -------------------- | --------------------- |
| `web_search_exa`          | 默认启用                 | 搜索网页并返回相关、可直接使用的内容    |
| `web_fetch_exa`           | 默认启用                 | 从一个或多个已知 URL 读取干净的内容  |
| `web_search_advanced_exa` | 选择开启后可用              | 通过高级筛选和控制项配置网页搜索      |
| `agent_run`               | 使用 OAuth 或 API 密钥时可用 | 执行多步骤研究、列表构建、增强和结构化输出 |

使用 `tools` URL 参数来指定客户端可见的tools。例如，启用全部tools：

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  显式指定 `tools` 列表会覆盖默认配置，因此请列出所有需要启用的工具，包括网页搜索和抓取。
</Tip>

## Exa Agent {#exa-agent}

如果研究任务需要多次 search，请使用 [Exa Agent](/zh/docs/agent/quickstart)，例如构建列表、按 criteria 逐项核查，或返回结构化结果。

Agent 运行按用量计费，因此 `agent_run` 需要 OAuth 或 API 密钥。以下 URL 会启动 OAuth，并在默认 tools 之外加入 Agent：

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

如果你使用 API 密钥，请省略 `login`，并按照 [身份验证](#authentication) 中的说明添加密钥。

<Steps>
  <Step title="描述你的需求">
    用自然语言说明你需要的研究内容。你的助手会把请求以 `query` 的形式传给 `agent_run`，Exa Agent 会自行判断该搜索什么、阅读来源，并对照请求核查所发现的内容。

    只有当你的应用需要以统一的 JSON 格式获取研究结果时，才让 Agent 提供 `outputSchema`。你可以在 system prompt 中把它交给助手，也可以让助手为你生成一个。
  </Step>

  <Step title="获取结果">
    研究完成后，这次工具调用会把完整的研究成果交给你的助手：

    * 书面研究结论
    * 支撑这些结论的来源
    * 如果你提供了 `outputSchema`，还包括经过校验的 JSON
    * 用量与费用

    你的助手会基于这份成果撰写回复，因此请告诉它你希望如何处理这些输出。你可以让它总结结论、进行对比、保存到文件，或是做任何其他事情。
  </Step>

  <Step title="需要更多时间时继续">
    超出单次 MCP 调用时长的研究不会失败：工具会返回 `status: "running"` 和一个 `id`，同时该运行会在 Exa 上继续进行。你的助手可以用该 `id` 作为 `runId` 再次调用 `agent_run`，从而接回同一次运行。
  </Step>
</Steps>

<Accordion title="可选控制项" icon="sliders-horizontal">
  | Field             | 用途                                                     |
  | ----------------- | ------------------------------------------------------ |
  | `systemPrompt`    | 为 Agent 提供额外指引，用于研究或判定结果                               |
  | `outputSchema`    | 以特定的 JSON 格式返回答案                                       |
  | `input.data`      | 丰富你已有的行或实体                                             |
  | `input.exclusion` | 跳过你已经知道的结果                                             |
  | `dataSources`     | 添加最多五个 [Exa Connect](/zh/docs/agent/connect/overview) 提供方 |
  | `previousRunId`   | 在已完成的研究基础上发起新请求                                        |
  | `effort`          | 选择 Agent 研究的深入程度                                       |
</Accordion>

<Tip>
  用 `runId` 继续等待进行中的工作；用 `previousRunId` 基于已完成的工作提出新的 follow-up。
</Tip>

关于 output schema 模式、effort 模式、数据源和定价，请参阅 [Exa Agent 指南](/zh/docs/agent/quickstart)。

## Advanced search {#advanced-search}

当请求需要显式的类别或域名过滤、日期范围、文本约束、地理定位、query 扩展、摘要、highlights、新鲜度控制或子页面抓取时，请使用 `web_search_advanced_exa`。普通的 search 仍建议使用 `web_search_exa`，它暴露给模型的工具面更小，所需配置也更少。

Advanced Search 无需认证，不过已认证的连接会使用你自己的 plan 和速率限制。可通过以下方式将其与默认 tools 一同启用：

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

MCP 工具把常用的 [Search API](/zh/docs/reference/search) 控制项暴露为便于工具调用的 field，例如 `includeDomains`、`startPublishedDate`、`enableHighlights` 和 `maxAgeHours`。具体的 field 名称请在你的客户端中查看 tool schema。

## 故障排查 {#troubleshooting}

<AccordionGroup>
  <Accordion title="速率限制错误 (429)">
    当前连接使用的是 Exa 的免费速率限制。请通过 OAuth 登录或添加自己的 API 密钥，然后重新连接，使请求按你所在团队的 plan 和限制计算。

    <Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      在控制台中创建密钥。新账户会赠送免费积分。
    </Card>
  </Accordion>

  <Accordion title="缺少 agent 或提示需要认证">
    `agent_run` 默认未启用，且无法使用免费速率限制。请将其添加到 `tools` URL 参数中，然后使用 `?login` 连接或配置 API 密钥。完整 URL 请参阅 [Exa Agent](#exa-agent)。
  </Accordion>

  <Accordion title="OAuth 登录页面无法打开">
    请确认你的客户端支持 MCP OAuth，并连接到 `https://mcp.exa.ai/mcp?login`。更改 URL 后请重启客户端。如果客户端无法完成 MCP OAuth，请改用 API 密钥。
  </Accordion>

  <Accordion title="tools 未显示">
    显式指定 `tools` 参数会覆盖默认的工具列表。请检查所需的每个工具是否都已包含在 URL 中，然后重启 MCP 客户端，让它重新获取工具列表。
  </Accordion>

  <Accordion title="Claude desktop 无法连接">
    使用内置连接器：选择 **+** (或 **Add connectors**) → **Connectors** 选项卡 → 搜索 **Exa** → 选择 **+**。
  </Accordion>

  <Accordion title="找不到 Config 文件">
    常见的配置文件位置：

    * Cursor：`~/.cursor/mcp.json`
    * fx：`~/.fx/mcp.json`
    * VS Code：`.vscode/mcp.json` (位于项目根目录)
    * Claude desktop (macOS)：`~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude desktop (Windows)：`%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

## 资源 {#resources}

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="查看源文件" arrow="true">
    Exa MCP 源代码。
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="打开包" arrow="true">
    使用 npm 包在本地运行 Exa MCP。
  </Card>

  <Card title="Agent skills" icon="wrench" href="/zh/docs/get-started/agent-skills/overview" cta="浏览 skills" arrow="true">
    可与 Exa MCP 搭配使用的可移植 skill。
  </Card>

  <Card title="Codex 与 ChatGPT 中的 Exa" icon="messages-square" href="/zh/docs/integrations/chatgpt-codex" cta="打开指南" arrow="true">
    Exa 插件的完整配置与工作流指南。
  </Card>
</Columns>