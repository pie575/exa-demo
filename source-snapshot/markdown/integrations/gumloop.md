> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Gumloop

> Use Exa search and contents inside Gumloop flows.

[Gumloop](https://www.gumloop.com/) includes Exa as a built-in MCP integration. Add it to an agent or Agent Node to search the web, extract pages, find related sources, and produce citation-backed answers inside a workflow.

## Add Exa to a Gumloop agent

<Steps>
  <Step title="Open the agent">
    Open your agent's configuration, then select **Add tools** → **Connect an app with MCP**.
  </Step>

  <Step title="Connect Exa">
    Search for **Exa**, select the integration, and complete the authentication flow.
  </Step>

  <Step title="Choose the tools">
    Open the connected Exa integration and enable only the tools the agent needs. This makes tool selection clearer and prevents the agent from calling unrelated actions.
  </Step>

  <Step title="Test the connection">
    Ask the agent:

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    Review the run to confirm that the agent called Exa and returned cited sources.
  </Step>
</Steps>

## Available tools

| Tool                     | Use it for                                                  |
| ------------------------ | ----------------------------------------------------------- |
| **Search**               | Find relevant pages with neural or keyword search.          |
| **Get Contents**         | Extract full text, summaries, and metadata from known URLs. |
| **Find Similar**         | Discover pages related to a source URL.                     |
| **Answer**               | Generate a grounded answer with citations.                  |
| **Create Research Task** | Start longer-running research.                              |
| **Get Research Task**    | Retrieve a research task's status and result.               |

For a conversational agent, enable Search, Get Contents, and Answer first. Add the remaining tools only when the workflow requires them.

## Use Exa in a workflow

### Agent Node

Add an **Agent Node** to a deterministic Gumloop flow and attach Exa as one of its tools. The node can decide whether to search, retrieve complete pages, or chain several Exa calls before passing its output to the next workflow step.

This works well for:

* enriching CRM or spreadsheet rows with current web evidence
* monitoring news and sending a sourced summary to Slack or email
* researching companies before routing records to a sales workflow
* comparing products and writing the result to a document

### Reusable custom MCP node

For a single repeatable action, create a dedicated node:

1. Open the node library and find Exa.
2. Select **Create a node with AI**.
3. Describe one action, such as `Search for funding announcements from the past seven days`.
4. Test the generated node, verify its inputs and outputs, then save it.

Use an Agent Node when the task requires dynamic planning or multiple tools. Use a custom MCP node when the same Exa operation should run predictably on every item.

## Prompt patterns

<AccordionGroup>
  <Accordion title="Search and summarize">
    ```text theme={null}
    Search for official announcements about [topic] published this week.
    Return the date, publisher, summary, and source URL for each result.
    ```
  </Accordion>

  <Accordion title="Enrich a company">
    ```text theme={null}
    Given this company name and domain, find its product description,
    latest funding announcement, and two recent news sources.
    ```
  </Accordion>

  <Accordion title="Read a known page">
    ```text theme={null}
    Get the full contents of this URL and extract the pricing tiers as JSON.
    ```
  </Accordion>
</AccordionGroup>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Exa is not available to the agent">
    Reopen the agent's MCP tools, confirm that Exa is connected, and enable the required tool. A connected integration can still have individual tools disabled.
  </Accordion>

  <Accordion title="The agent chooses the wrong action">
    Make the request explicit about whether it should search, read known URLs, find similar pages, or answer from sources. Disable Exa tools the agent does not need for that workflow.
  </Accordion>

  <Accordion title="A workflow needs a predictable single call">
    Replace the general-purpose agent step with a custom Exa MCP node whose inputs and task are fixed.
  </Accordion>
</AccordionGroup>

## Resources

<Columns cols={3}>
  <Card title="Gumloop Exa integration" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="Read guide" arrow="true">
    Review Gumloop's current tools and Agent Node workflow.
  </Card>

  <Card title="Exa MCP server" icon="plug" href="/docs/get-started/exa-mcp" cta="Read guide" arrow="true">
    Understand the Exa tools exposed through MCP.
  </Card>

  <Card title="Exa Search" icon="search" href="/docs/search/quickstart" cta="Read guide" arrow="true">
    Learn how to shape search queries and returned contents.
  </Card>
</Columns>
