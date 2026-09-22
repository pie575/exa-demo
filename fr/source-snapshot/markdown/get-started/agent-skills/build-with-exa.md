> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="build-with-exa-skill">
  # Build with Exa Skill
</div>

> Une agent skill pour aider les développeurs à implémenter n&#39;importe quelle partie de la plateforme d&#39;API Exa.

Utilisez cette skill pour apprendre à votre agent à créer des applications et des agents avec les API d&#39;Exa, en suivant les bonnes pratiques.

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<Note>
  Définissez votre clé sous le nom `EXA_API_KEY` dans l&#39;environnement de votre agent.
</Note>

<div id="setup">
  ## Configuration
</div>

**Option A : installez directement ce skill :**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "build-with-exa"
```

**Option B : copiez ce prompt dans votre agent de code.**

Le prompt suivant installe la skill et vérifie votre API key sans l&#39;afficher :

```text Copy this setup prompt into your agent theme={null}
Set up the Exa build-with-exa agent skill on this machine.

Goal:
- Install the build-with-exa skill so my coding agent can use it to build applications and agents with Exa's full API platform.
- Get an Exa API key working WITHOUT ever exposing, printing, or pasting the key into this chat.

Selected agent:
- Claude Code, Codex, Cursor, or any Agent-Skills-compatible agent
- Global install directories: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / other)
- Project-local install directories: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / other)

Skill source:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md

What to do:
1. Install the skill FIRST, before any key setup. Prefer a project-local install when working inside a repo; otherwise use the matching global directory listed above. Create the chosen skills directory and download the skill:
   mkdir -p <skills-dir>/build-with-exa && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" -o <skills-dir>/build-with-exa/SKILL.md
   Then verify that <skills-dir>/build-with-exa/SKILL.md exists.
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
  ## Voir la source
</div>

<Card title="build-with-exa/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" cta="Voir la source" arrow="true">
  Consultez la définition de la skill build-with-exa avant de l&#39;installer.
</Card>

<div id="related">
  ## Ressources associées
</div>

<Columns cols={2}>
  <Card title="Toutes les agent skills" icon="layers" href="/fr/docs/get-started/agent-skills/overview" cta="Parcourir les skills" arrow="true">
    Parcourez toutes les skills Exa et installez-les en une seule fois.
  </Card>

  <Card title="Repository des skills" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="Voir la source" arrow="true">
    Source de chaque skill, y compris les fichiers `SKILL.md` bruts.
  </Card>
</Columns>