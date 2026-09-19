> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Exa in Claude Code, Web, and Desktop

> Search the web and read any page with Exa directly from Claude

Install Exa in Claude Code or connect it to Claude Web, Desktop, and Cowork to give Claude access to current information from the web. Claude can search in natural language, read the pages that matter, and use those sources while it works.

## Install Exa

<div className="docs-tabs">
  <Tabs>
    <Tab title="Claude Web, Desktop & Cowork" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <Steps>
        <Step title="Open the connector directory">
          In a new Claude chat, select the plus button, choose **Add connector**, and search for **Exa**.
        </Step>

        <Step title="Connect Exa">
          Open Exa, select **Connect to Claude**, and authorize access when prompted.

          <Frame caption="Opening the connector directory in Claude, finding Exa, connecting it, and authorizing access">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Opening the connector directory in Claude, finding Exa, connecting it, and authorizing access" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Use Exa">
          Start a new chat and ask for something that needs current information from the web.
        </Step>
      </Steps>
    </Tab>

    <Tab title="Claude Code CLI" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude-code.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=f7f017b187974c56e5822d7baf8272fa" width="16" height="16" data-path="images/mcp-clients/claude-code.svg">
      <Steps>
        <Step title="Install the plugin">
          Install Exa from the terminal:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          You can also type `/plugin` in Claude Code, search for **Exa**, and install it.
        </Step>

        <Step title="Start a new session">
          Open a new Claude Code session so the plugin loads, then ask for something that needs the web.

          <Frame caption="Opening a new Claude Code session and asking for something that needs the web">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/claude-code.gif?s=1a6d69ab819e600fd2101771380a5711" alt="Opening a new Claude Code session and asking for something that needs the web" style={{width: "100%", height: "auto"}} width="800" height="502" data-path="images/integrations/claude-web-desktop/claude-code.gif" />
          </Frame>
        </Step>
      </Steps>
    </Tab>
  </Tabs>
</div>

Both options make Exa available without editing an MCP configuration file.

## Work with what's on the web right now

In Claude Code, Exa can search current documentation, issues, changelogs, and real-world examples while working in your repository. The same integration gives Claude Web, Desktop, and Cowork current news, research, company information, product details, and other sources that may not already be in context.

```text theme={null}
We're on Tailwind v3. Use Exa to find and read the official Tailwind v4
upgrade guide, then migrate this project to v4.
```

Claude Code can use what it finds to make the change in your codebase. In other Claude clients, it can use the same sources in answers, artifacts, and Cowork tasks.

The same pattern works whenever the answer depends on current or specific web sources:

* "Find the latest release notes for this dependency and summarize the breaking changes."
* "Search for recent primary research on inference-time scaling and compare the methods."
* "Read the current Stripe webhook documentation and explain the recommended retry behavior."
* "Find official pricing pages for these products and compare their entry-level plans."

## Search, read, and research

The Exa integration gives Claude tools to search and read the web, which it can combine across a longer research task.

<Columns cols={3}>
  <Card title="Search" icon="search">
    Search in natural language and get relevant page content, not only a list of links.
  </Card>

  <Card title="Read" icon="file-text">
    Read a page you point to, including documentation, research, changelogs, issues, and articles.
  </Card>

  <Card title="Research" icon="compass">
    Run multiple searches, inspect useful pages, and combine the evidence into a sourced response.
  </Card>
</Columns>

## Research without leaving Claude

Ask for the result you want and tell Claude what kinds of sources matter:

```text theme={null}
Compare the managed offerings, licensing, and pricing of the main
open source vector databases. Use current primary sources and cite them.
```

Claude can use Exa throughout the conversation to find and read the sources needed for the task. Use this for technical research, competitive analysis, market mapping, company research, or any question whose answer lives across the web.

## Use Exa in Cowork

The same connector is available in Cowork. Give Claude a task that depends on outside information, and it can search or read pages while working with your files and other connected tools.

```text theme={null}
Review this competitive brief, verify every pricing claim against the
current vendor pages with Exa, and update the document with citations.
```

## Prefer MCP directly?

If you’re configuring Claude manually or using another MCP client, you can connect directly to Exa’s hosted MCP server:

```bash theme={null}
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

See [Exa MCP](/docs/get-started/exa-mcp) for other clients, configuration options, and available tools.

<Card title="Open the Exa connector" icon="external-link" horizontal href="https://claude.ai/connectors/exa">
  Add Exa in Claude's connector directory.
</Card>
