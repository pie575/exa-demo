> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Agent Skills

> Install Exa skills in Claude Code, Codex, and other coding agents.

Exa skills teach coding agents how to search, retrieve content, and build with Exa’s APIs. Find them in the open-source [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills) repository.

Each skill contains markdown files that follow the open [Agent Skills](https://agentskills.io) standard, so the same files install into any compatible agent.

## Install

Install every Exa skill at once:

```bash theme={null}
npx skills add exa-labs/agent-skills
```

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Create a key in the dashboard. New accounts start with free credits.
</Card>

<Note>
  Set your key as `EXA_API_KEY` in your agent environment.
</Note>

Or open a skill page below and copy its setup prompt into your agent. The prompt installs that skill and verifies your API key without printing it.

## Skills

Each skill page includes a one-line description, a copyable setup prompt, and a link to the raw `SKILL.md` source.

<Columns cols={3}>
  <Card title="Build with Exa" icon="rocket" href="/docs/get-started/agent-skills/build-with-exa" cta="Open skill" arrow="true">
    Build applications and agents with Exa's full API platform.
  </Card>

  <Card title="Exa Search" icon="search" href="/docs/get-started/agent-skills/exa-search" cta="Open skill" arrow="true">
    Call Exa Search directly with cURL or raw HTTP.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/docs/get-started/agent-skills/exa-contents" cta="Open skill" arrow="true">
    Call Exa Contents directly with cURL or raw HTTP.
  </Card>
</Columns>

## Related

<Columns cols={2}>
  <Card title="Skills repository" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="View source" arrow="true">
    Source for every skill, including raw `SKILL.md` files.
  </Card>

  <Card title="Exa MCP" icon="plug" href="/docs/get-started/exa-mcp" cta="Open guide" arrow="true">
    Connect Claude, Cursor, VS Code, and other clients to Exa over MCP.
  </Card>
</Columns>
