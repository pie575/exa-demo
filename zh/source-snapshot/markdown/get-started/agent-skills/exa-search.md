> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在深入探索之前，可通过该文件了解所有可用页面。

<div id="exa-search-skill">
  # Exa Search Skill
</div>

> 使用 Exa Search，在两秒内找到相关网页并返回整合后的内容。

使用此 skill，让你的 agent 学会按照最佳实践，通过 cURL 或原始 HTTP 调用 Exa Search。

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
npx skills add exa-labs/agent-skills --skill "exa-search"
```

**方式 B：将以下 prompt 复制到你的编码智能体中。**

该 prompt 会安装此 skill，并在不打印 API 密钥的前提下完成验证：

```text Copy this setup prompt into your agent theme={null}
Set up the Exa exa-search agent skill on this machine.

Goal:
- Install the exa-search skill so my coding agent can use it to call Exa Search directly with cURL or raw HTTP.
- Get an Exa API key working WITHOUT ever exposing, printing, or pasting the key into this chat.

Selected agent:
- Claude Code, Codex, Cursor, or any Agent-Skills-compatible agent
- Global install directories: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / other)
- Project-local install directories: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / other)

Skill source:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md

What to do:
1. Install the skill FIRST, before any key setup. Prefer a project-local install when working inside a repo; otherwise use the matching global directory listed above. Create the chosen skills directory and download the skill:
   mkdir -p <skills-dir>/exa-search && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" -o <skills-dir>/exa-search/SKILL.md
   Then verify that <skills-dir>/exa-search/SKILL.md exists.
2. Check whether an Exa API key is already available FROM YOUR OWN COMMAND-RUNNING ENVIRONMENT — use the same tool/shell you will run the skill with, not by asking me to echo it. The skill resolves the key from EXA_API_KEY first, then from the file ~/.config/exa/key, so check both without ever printing a value:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Your shell is likely non-interactive and does NOT auto-source interactive profiles like ~/.zshrc or ~/.bashrc, so a key I set there can look present to me but empty to you. If neither shows, the key may still live in an interactive profile your shell skips: find which file WITHOUT printing its value using `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (lists names only — NEVER run a plain `grep`/`cat`/`echo` on a profile, since an `export EXA_API_KEY=...` line would leak the secret into our chat). Then `source` that file inside your command and re-run the presence test above; if it shows, prepend that same `source ...;` to every later command that needs the key.
3. Only if no key is resolvable anywhere, set one up WITHOUT hand-editing any shell profile and WITHOUT pasting the key into this chat. Tell me to create/copy a key at https://dashboard.exa.ai/api-keys, then in my own terminal either export EXA_API_KEY myself or write it to ~/.config/exa/key with mode 600 — never ask me to paste the key into chat. Then wait for me to confirm it is done before continuing.
4. Smoke-test the key from your own shell — resolve it from the env var or the file, and print only the status code:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   Keep the endpoint, headers, and body exactly as written (do not guess the schema). It must return 200, not 401/429. If you needed a `source ...;` prefix in step 2 to see an env key, prepend that here too.
5. Tell me how to restart or rescan my agent so it discovers the skill.

Hard rule throughout: the key is a secret. Only ever inspect it via a presence/length check (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) or an HTTP status code — never print, `echo`, `cat`, or `grep`-with-output any file or variable that may contain it, and never try to "redact" a key file with a regex. If a key is ever exposed, tell me to rotate it at https://dashboard.exa.ai/api-keys.
```

<div id="view-source">
  ## 查看源文件
</div>

<Card title="exa-search/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" cta="查看源文件" arrow="true">
  安装前请先阅读 exa-search skill 的定义。
</Card>

<div id="related">
  ## 相关内容
</div>

<Columns cols={2}>
  <Card title="所有 agent skill" icon="layers" href="/zh/docs/get-started/agent-skills/overview" cta="浏览 skill" arrow="true">
    浏览全部 Exa skill，并一次性安装。
  </Card>

  <Card title="Skill 代码仓库" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="查看源文件" arrow="true">
    包含每个 skill 的源文件，以及原始 `SKILL.md` 文件。
  </Card>
</Columns>