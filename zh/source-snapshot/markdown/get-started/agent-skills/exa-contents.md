> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="exa-contents-skill">
  # Exa Contents Skill
</div>

> 已有 URL 时，用 Exa Contents 提取页面内容。

使用该技能，让你的 agent 按最佳实践通过 cURL 或原始 HTTP 调用 Exa Contents。

<Card title="获取你的 Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  在控制台中创建一个 key。新账户可获得免费积分。
</Card>

<Note>
  在 agent 环境中将你的 key 设置为 `EXA_API_KEY`。
</Note>

<div id="setup">
  ## 设置
</div>

**方式 A：直接安装此 Skill：**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**方式 B：将以下提示词复制到你的编程 agent 中。**

该提示词会安装此 skill，并在不输出 API key 的前提下完成验证：

```text Copy this setup prompt into your agent theme={null}
在这台机器上配置 Exa 的 exa-contents agent skill。

目标：
- 安装 exa-contents skill，让我的编码 agent 能用它通过 cURL 或原始 HTTP 直接调用 Exa Contents。
- 让 Exa API key 正常可用，且全程不得在此对话中暴露、打印或粘贴该 key。

选定的 agent：
- Claude Code、Codex、Cursor，或任何兼容 Agent Skills 的 agent
- 全局安装目录：~/.claude/skills（Claude Code）、~/.codex/skills（Codex）、~/.agents/skills（Cursor / 其他）
- 项目内安装目录：.claude/skills（Claude Code）、.agents/skills（Codex / Cursor / 其他）

Skill 来源：
- SKILL.md 地址：https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

操作步骤：
1. 先安装 skill，然后再做任何 key 配置。在仓库内工作时优先采用项目内安装；否则使用上面列出的对应全局目录。创建所选的 skills 目录并下载 skill：
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   然后确认 <skills-dir>/exa-contents/SKILL.md 确实存在。
2. 在你自己执行命令的环境中检查是否已有可用的 Exa API key —— 使用你之后运行该 skill 所用的同一工具/shell，而不是让我把它 echo 出来。skill 会先从 EXA_API_KEY 解析 key，再从文件 ~/.config/exa/key 解析，因此两者都要检查，并且不得打印出具体值：
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   你的 shell 很可能是非交互式的，不会自动加载 ~/.zshrc 或 ~/.bashrc 这类交互式配置文件，因此我在那里设置的 key 在我这边看起来存在，在你那边却是空的。如果两项都没有显示，key 可能仍存放在你的 shell 会跳过的交互式配置文件里：用 `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` 找出是哪个文件，且不要打印其值（该命令只列出文件名 —— 绝不要对配置文件直接运行 `grep`/`cat`/`echo`，因为 `export EXA_API_KEY=...` 这一行会把密钥泄漏到我们的对话中）。然后在你的命令中 `source` 该文件，并重新运行上面的存在性检测；如果这次显示出来了，就在后续每条需要该 key 的命令前都加上同样的 `source ...;`。
3. 只有在任何地方都解析不到 key 时，才去配置一个，并且不得手工编辑任何 shell 配置文件，也不得把 key 粘贴到此对话中。告诉我去 https://dashboard.exa.ai/api-keys 创建/复制一个 key，然后我会在自己的终端里自行 export EXA_API_KEY，或以 600 权限写入 ~/.config/exa/key —— 绝不要让我把 key 粘贴到对话里。然后等我确认完成后再继续。
4. 在你自己的 shell 中对 key 做冒烟测试 —— 从环境变量或文件中解析它，并且只打印状态码：
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   端点、header 和请求体必须与上面写的完全一致（不要猜测 schema）。它必须返回 200，而不是 401/429。如果第 2 步中你需要加 `source ...;` 前缀才能看到环境变量里的 key，这里也要加上。
5. 告诉我如何重启或重新扫描我的 agent，好让它发现这个 skill。

全程必须遵守的硬性规则：key 是机密。只能通过存在性/长度检查（`${EXA_API_KEY:+set}`、`[ -s ~/.config/exa/key ]`）或 HTTP 状态码来查看它 —— 绝不要打印、`echo`、`cat`，也不要对任何可能包含它的文件或变量执行会输出内容的 `grep`，更不要试图用正则去"脱敏"密钥文件。一旦 key 发生泄露，请告诉我到 https://dashboard.exa.ai/api-keys 轮换它。
```

<div id="view-source">
  ## 查看源码
</div>

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="查看源码" arrow="true">
  安装前请先阅读 exa-contents skill 定义。
</Card>

<div id="related">
  ## 相关内容
</div>

<Columns cols={2}>
  <Card title="全部 Agent Skills" icon="layers" href="/zh/docs/get-started/agent-skills/overview" cta="浏览 skill" arrow="true">
    浏览 Exa 的所有 skill，并一次性全部安装。
  </Card>

  <Card title="skill 仓库" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="查看源码" arrow="true">
    所有 skill 的源码，包含原始 `SKILL.md` 文件。
  </Card>
</Columns>