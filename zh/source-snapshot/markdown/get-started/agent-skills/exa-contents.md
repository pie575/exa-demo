> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

<div id="exa-contents-skill">
  # Exa Contents Skill
</div>

> 当你已经拥有 URL 时，使用 Exa Contents 提取页面内容。

使用该 skill 让你的 agent 按照最佳实践，通过 cURL 或原始 HTTP 调用 Exa Contents。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<Note>
  在 agent 环境中将密钥设置为 `EXA_API_KEY`。
</Note>

<div id="setup">
  ## 设置
</div>

**方式 A：直接安装此 skill：**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**方案 B：将以下提示词复制到你的编码智能体中。**

该提示词会安装此 skill，并在不打印 API 密钥的情况下完成验证：

```text Copy this 设置提示词 into your agent theme={null}
在这台机器上配置 Exa exa-contents agent skill。

目标：
- 安装 exa-contents skill，使我的编码智能体可以用它通过 cURL 或原始 HTTP 直接调用 Exa Contents。
- 让 Exa API 密钥可用，并且绝不在本对话中暴露、打印或粘贴该密钥。

选定的 agent：
- Claude Code、Codex、Cursor，或任何兼容 Agent Skills 的 agent
- 全局安装目录：~/.claude/skills（Claude Code）、~/.codex/skills（Codex）、~/.agents/skills（Cursor / 其他）
- 项目本地安装目录：.claude/skills（Claude Code）、.agents/skills（Codex / Cursor / 其他）

Skill 来源：
- SKILL.md URL：https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

要做的事：
1. 先安装 skill，再进行任何密钥配置。在代码仓库内工作时优先采用项目本地安装，否则使用上面列出的对应全局目录。创建所选的 skills 目录并下载 skill：
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   然后确认 <skills-dir>/exa-contents/SKILL.md 确实存在。
2. 在你自己执行命令的环境中检查是否已有可用的 Exa API 密钥 —— 要使用你后续运行该 skill 时所用的同一工具/shell，而不是让我把它 echo 出来。该 skill 先从 EXA_API_KEY 解析密钥，再从文件 ~/.config/exa/key 解析，因此两处都要检查，且绝不打印其值：
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   你的 shell 很可能是非交互式的，不会自动 source ~/.zshrc 或 ~/.bashrc 这类交互式配置文件，因此我在那里设置的密钥，在我看来是存在的，对你却是空的。如果两处都没有显示，密钥可能仍存放在你的 shell 跳过的交互式配置文件里：用 `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` 找出是哪个文件，同时不要打印其值（该命令只列出文件名 —— 绝不要对配置文件直接运行 `grep`/`cat`/`echo`，因为 `export EXA_API_KEY=...` 这一行会把 secret 泄露到我们的对话中）。然后在你的命令中 `source` 该文件，并重新运行上面的存在性检测；如果显示存在，就在之后每个需要该密钥的命令前都加上同样的 `source ...;`。
3. 只有在任何地方都解析不到密钥时，才去配置一个，并且不要手动编辑任何 shell 配置文件，也不要把密钥粘贴到本对话中。告诉我去 https://dashboard.exa.ai/api-keys 创建/复制一个密钥，然后我会在自己的终端里自行 export EXA_API_KEY，或以 600 权限写入 ~/.config/exa/key —— 绝不要让我把密钥粘贴到对话中。之后等我确认完成，再继续。
4. 在你自己的 shell 中对密钥做冒烟测试 —— 从环境变量或文件中解析它，并且只打印状态码：
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   端点、header 和请求体都要与上面写的完全一致（不要猜测 schema）。它必须返回 200，而不是 401/429。如果在第 2 步中你需要加 `source ...;` 前缀才能看到环境变量里的密钥，这里也要加上。
5. 告诉我如何重启或重新扫描我的 agent，让它发现该 skill。

全程必须遵守的硬性规则：密钥是 secret。只能通过存在性/长度检查（`${EXA_API_KEY:+set}`、`[ -s ~/.config/exa/key ]`）或 HTTP 状态码来查看它 —— 绝不要打印、`echo`、`cat` 或用带输出的 `grep` 处理任何可能包含它的文件或变量，也绝不要试图用正则表达式对密钥文件做“脱敏”。一旦密钥被泄露，请告诉我去 https://dashboard.exa.ai/api-keys 轮换它。
```

<div id="view-source">
  ## 查看源文件
</div>

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="查看源文件" arrow="true">
  安装前请先阅读 exa-contents skill 的定义。
</Card>

<div id="related">
  ## 相关内容
</div>

<Columns cols={2}>
  <Card title="全部 agent skills" icon="layers" href="/zh/docs/get-started/agent-skills/overview" cta="浏览 skills" arrow="true">
    浏览所有 Exa skill，并一次性安装。
  </Card>

  <Card title="Skills 代码仓库" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="查看源文件" arrow="true">
    每个 skill 的源文件，包含原始 `SKILL.md` 文件。
  </Card>
</Columns>