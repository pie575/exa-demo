> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Skill de Exa Search {#exa-search-skill}

> Encuentra páginas web relevantes y obtén contenido sintetizado en menos de dos segundos con Exa Search.

Usa este skill para enseñar a tu agente a llamar a Exa Search con cURL o HTTP sin procesar, aplicando las mejores prácticas.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

<Note>
  Define tu key como `EXA_API_KEY` en el entorno de tu agente.
</Note>

## Configuración {#setup}

**Opción A: instala esta skill directamente:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-search"
```

**Opción B: copia este prompt en tu agente de programación.**

El siguiente prompt instala la skill y verifica tu API key sin mostrarla:

```text Copy this setup prompt into your agente theme={null}
Set up the Exa exa-search agente skill on this machine.

Goal:
- Install the exa-search skill so my agente de programación can use it to llamar Exa Search directly with cURL or HTTP sin procesar.
- Get an API key de Exa working WITHOUT ever exposing, printing, or pasting the key into this chat.

Selected agente:
- Claude Code, Codex, Cursor, or any Agent-Skills-compatible agente
- Global install directories: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / other)
- Project-local install directories: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / other)

Skill source:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md

What to do:
1. Install the skill FIRST, before any key setup. Prefer a project-local install when working inside a repo; otherwise use the matching global directory listed above. Create the chosen skills directory and download the skill:
   mkdir -p <skills-dir>/exa-search && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" -o <skills-dir>/exa-search/SKILL.md
   Then verify that <skills-dir>/exa-search/SKILL.md exists.
2. Check whether an API key de Exa is already available FROM YOUR OWN COMMAND-RUNNING ENVIRONMENT — use the same tool/shell you will run the skill with, not by asking me to echo it. The skill resolves the key from EXA_API_KEY first, then from the file ~/.config/exa/key, so check both without ever printing a value:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   Your shell is likely non-interactive and does NOT auto-source interactive profiles like ~/.zshrc or ~/.bashrc, so a key I set there can look present to me but empty to you. If neither shows, the key may still live in an interactive profile your shell skips: find which file WITHOUT printing its value using `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null` (lists names only — NEVER run a plain `grep`/`cat`/`echo` on a profile, since an `export EXA_API_KEY=...` line would leak the secret into our chat). Then `source` that file inside your command and re-run the presence test above; if it shows, prepend that same `source ...;` to every later command that needs the key.
3. Only if no key is resolvable anywhere, set one up WITHOUT hand-editing any shell profile and WITHOUT pasting the key into this chat. Tell me to create/copy a key at https://dashboard.exa.ai/api-keys, then in my own terminal either export EXA_API_KEY myself or write it to ~/.config/exa/key with mode 600 — never ask me to paste the key into chat. Then wait for me to confirm it is done before continuing.
4. Smoke-test the key from your own shell — resolve it from the env var or the file, and print only the status code:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   Keep the endpoint, headers, and body exactly as written (do not guess the schema). It must return 200, not 401/429. If you needed a `source ...;` prefix in step 2 to see an env key, prepend that here too.
5. Tell me how to restart or rescan my agente so it discovers the skill.

Hard rule throughout: the key is a secret. Only ever inspect it via a presence/length check (`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) or an HTTP status code — never print, `echo`, `cat`, or `grep`-with-output any file or variable that may contain it, and never try to "redact" a key file with a regex. If a key is ever exposed, tell me to rotate it at https://dashboard.exa.ai/api-keys.
```

## Ver código fuente {#view-source}

<Card title="exa-search/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" cta="Ver código fuente" arrow="true">
  Lee la definición de la skill exa-search antes de instalarla.
</Card>

## Relacionado {#related}

<Columns cols={2}>
  <Card title="Todos los skills de agente" icon="layers" href="/es/docs/get-started/agent-skills/overview" cta="Explorar skills" arrow="true">
    Explora todos los skills de Exa e instálalos de una sola vez.
  </Card>

  <Card title="Repositorio de skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Ver código fuente" arrow="true">
    Código fuente de cada skill, incluidos los archivos `SKILL.md` sin procesar.
  </Card>
</Columns>