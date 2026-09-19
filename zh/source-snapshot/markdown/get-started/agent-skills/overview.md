> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

<div id="agent-skills">
  # Agent Skills
</div>

> 在 Claude Code、Codex 等编程 agent 中安装 Exa skills。

Exa skills 教会编程 agent 如何使用 Exa 的 API 进行搜索、获取内容并构建应用，相关内容可在开源仓库 [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills) 中找到。

每个 skill 都包含遵循开放 [Agent Skills](https://agentskills.io) 标准的 markdown 文件，因此同一批文件可安装到任意兼容的 agent 中。

<div id="install">
  ## 安装
</div>

一次性安装所有 Exa skill：

```bash theme={null}
npx skills add exa-labs/agent-skills
```

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建一个 key。新账户可获得免费积分。
</Card>

<Note>
  在 agent 环境中将 key 设置为 `EXA_API_KEY`。
</Note>

或者打开下方的 skill 页面，将其 setup prompt 复制到你的 agent 中。该 prompt 会安装对应 skill，并在不打印 API key 的前提下完成验证。

<div id="skills">
  ## Skills
</div>

每个 skill 页面都包含一句话简介、一段可复制的 setup prompt，以及指向 `SKILL.md` 原始文件的链接。

<Columns cols={3}>
  <Card title="使用 Exa 构建" icon="rocket" href="/zh/docs/get-started/agent-skills/build-with-exa" cta="打开 skill" arrow="true">
    借助 Exa 完整的 API 平台构建应用和 agent。
  </Card>

  <Card title="Exa Search" icon="search" href="/zh/docs/get-started/agent-skills/exa-search" cta="打开 skill" arrow="true">
    使用 cURL 或原始 HTTP 直接调用 Exa Search。
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/zh/docs/get-started/agent-skills/exa-contents" cta="打开 skill" arrow="true">
    使用 cURL 或原始 HTTP 直接调用 Exa Contents。
  </Card>
</Columns>

<div id="related">
  ## 相关内容
</div>

<Columns cols={2}>
  <Card title="Skills 仓库" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="查看源码" arrow="true">
    每个 skill 的源文件，包括原始 `SKILL.md` 文件。
  </Card>

  <Card title="Exa MCP" icon="plug" href="/zh/docs/get-started/exa-mcp" cta="查看指南" arrow="true">
    通过 MCP 将 Claude、Cursor、VS Code 等客户端连接到 Exa。
  </Card>
</Columns>