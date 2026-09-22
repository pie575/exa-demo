> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入查阅之前，可通过该文件了解所有可用页面。

<div id="build-with-exa-skill">
  # Build with Exa Skill
</div>

> 一个 agent skill，帮助开发者实现 Exa API 平台的任意功能。

使用此 skill，让你的 agent 学会按照最佳实践，用 Exa 的 API 构建应用和 agent。

<Card title="获取你的 Exa API 密钥" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建密钥。新账户可获得免费积分。
</Card>

<Note>
  在你的 agent 环境中将密钥设置为 `EXA_API_KEY`。
</Note>

<div id="setup">
  ## 设置
</div>

**方式 A：直接安装此 skill：**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "build-with-exa"
```

**方式 B：将以下提示词复制到你的编码智能体中。**

以下提示词会安装该 skill，并在不打印 API 密钥的情况下完成验证：

```text Copy this setup prompt into your agent theme={null}
在这台机器上配置 Exa build-with-exa agent skill。

目标：
- 安装 build-with-exa skill，让我的编码智能体能用它基于 Exa 的完整 API 平台构建应用和 agent。
- 让 Exa API 密钥可正常使用，同时绝不在本次对话中暴露、打印或粘贴该密钥。

所选 agent：
- Claude Code、Codex、Cursor，或任何兼容 Agent Skills 的 agent
- 全局安装目录：~/.claude/skills（Claude Code）、~/.codex/skills（Codex）、~/.agents/skills（Cursor / 其他）
- 项目本地安装目录：.claude/skills（Claude Code）、.agents/skills（Codex / Cursor / 其他）

Skill 来源：
- SKILL.md URL：https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md

需要执行的操作：
1. 先安装 skill，再做任何密钥配置。在代码仓库内工作时优先采用项目本地安装，否则使用上面列出的对应全局目录。创建所选的 skills 目录并下载 skill：
   mkdir -p <skills-dir>/build-with-exa && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" -o <skills-dir>/build-with-exa/SKILL.md
   然后确认 <skills-dir>/build-with-exa/SKILL.md 已存在。
2. 在你自己执行命令的环境中检查是否已有可用的 Exa API 密钥，要使用你后续运行 skill 时所用的同一工具/shell，而不是让我 echo 出来。该 skill 会先从 EXA_API_KEY 解析密钥，再从文件 ~/.config/exa/key 解析，因此请在不打印任何值的前提下检查这两处：
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   你的 shell 很可能是非交互式的，不会自动 source ~/.zshrc、~/.bashrc 这类交互式配置文件，所以我在其中设置的密钥，在我这边看起来存在，在你那边却是空的。如果两处都没有显示，密钥可能仍然放在你的 shell 跳过的交互式配置文件里：用 `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` 在不打印其值的情况下找出是哪个文件（只列文件名；绝不要对配置文件直接运行 `grep`/`cat`/`echo`，因为 `export EXA_API_KEY=...` 这一行会把 secret 泄漏到我们的对话里）。然后在你的命令中 `source` 该文件，并重新执行上面的存在性检查；如果显示存在，请在后续每条需要该密钥的命令前都加上同样的 `source ...;`。
3. 只有在任何位置都解析不到密钥时，才去配置一个，且不要手工编辑任何 shell 配置文件，也不要把密钥粘贴到本次对话中。让我去 https://dashboard.exa.ai/api-keys 创建/复制密钥，然后由我在自己的终端里自行 export EXA_API_KEY，或以 600 权限写入 ~/.config/exa/key；绝不要让我把密钥粘贴到对话里。然后等我确认完成后再继续。
4. 在你自己的 shell 中对该密钥做冒烟测试：从环境变量或文件中解析它，并只打印 HTTP 状态码：
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   端点、header 和请求体必须与上面写的完全一致（不要猜测 schema）。返回结果必须是 200，而不是 401/429。如果第 2 步中你需要加 `source ...;` 前缀才能看到环境变量里的密钥，这里也要加上。
5. 告诉我如何重启或重新扫描我的 agent，使其能发现该 skill。

全程适用的硬性规则：密钥属于 secret。只能通过存在性/长度检查（`${EXA_API_KEY:+set}`、`[ -s ~/.config/exa/key ]`）或 HTTP 状态码来查验；绝不要打印、`echo`、`cat`，或对任何可能包含它的文件或变量执行带输出的 `grep`，也不要试图用正则"脱敏"密钥文件。一旦密钥泄露，请让我去 https://dashboard.exa.ai/api-keys 轮换密钥。
```

<div id="view-source">
  ## 查看源文件
</div>

<Card title="build-with-exa/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" cta="查看源文件" arrow="true">
  安装前请先阅读 build-with-exa skill 的定义。
</Card>

<div id="related">
  ## 相关内容
</div>

<Columns cols={2}>
  <Card title="所有 agent skill" icon="layers" href="/zh/docs/get-started/agent-skills/overview" cta="浏览 skill" arrow="true">
    浏览全部 Exa skill，并一次性安装。
  </Card>

  <Card title="Skill 代码仓库" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="查看源文件" arrow="true">
    所有 skill 的源文件，包括原始 `SKILL.md` 文件。
  </Card>
</Columns>