> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# n8n

> Use Exa search and contents inside n8n workflows.

The official [Exa node for n8n](https://github.com/exa-labs/n8n-integration) adds web search, content extraction, grounded answers, and Exa Agent runs to visual workflows. Use it as a regular workflow step or connect it to an n8n AI Agent as a tool.

## Install the Exa node

The package name is `n8n-nodes-exa-official`.

<Steps>
  <Step title="Add the community node">
    Search for **Exa** in the n8n node picker. If it is not available on your instance, an instance owner can install `n8n-nodes-exa-official` by following n8n's [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

    The node requires n8n 1.60 or newer and Node.js 20.15 or newer.
  </Step>

  <Step title="Create an Exa API key">
    <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Create a key in the dashboard. New accounts start with free credits.
    </Card>
  </Step>

  <Step title="Add Exa credentials">
    Add an **Exa API** credential in n8n and paste your key. Select that credential on each Exa node that should use the account.
  </Step>
</Steps>

## Run a search

1. Add a trigger to a workflow.
2. Add the **Exa** node.
3. Choose **Search**.
4. Enter a query and select a search type.
5. Choose a response format:
   * **Results** for ranked pages
   * **Text** for a synthesized answer
   * **Structured** for JSON matching your schema
6. Run the node and pass its output to the next workflow step.

Search can also return text, highlights, summaries, links, and images from each result. Domain filters, publication dates, categories, `maxAgeHours`, and subpage crawling are available in the node's optional fields.

## Available resources

| Resource     | Operations                                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Search**   | Search the web using `auto`, `instant`, `fast`, `deep-lite`, `deep`, or `deep-reasoning`, with optional synthesis and structured output. |
| **Contents** | Retrieve cleaned text, highlights, summaries, links, and images for a list of URLs.                                                      |
| **Answer**   | Generate a grounded answer with citations and optional structured output.                                                                |
| **Agent**    | Create, inspect, list, stream, poll, and cancel multi-step Agent runs.                                                                   |

## Use Exa with an n8n AI Agent

Connect an Exa node to an **AI Agent** node through its tool input. Parameters that the model should supply can use n8n's `$fromAI()` expression:

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search and Answer work well as grounding tools. Use the Agent resource when the task requires multi-step research, list building, structured enrichment, or premium [Exa Connect](/docs/agent/connect/overview) data.

## Wait for an Agent run

When creating an Agent run, **Wait for Completion** supports:

* **Stream** to hold one server-sent events connection open until the run finishes
* **Poll** to check the run on an interval

For long-running or asynchronous workflows, turn **Wait for Completion** off, save the returned run `id`, and use **Get Run** later. The run continues on Exa after the n8n step finishes.

## Troubleshooting

<AccordionGroup>
  <Accordion title="The Exa node is not in the node picker">
    Ask an instance owner to install the verified community package `n8n-nodes-exa-official`. Community-node availability can depend on how your n8n instance is hosted.
  </Accordion>

  <Accordion title="The Exa credential is rejected">
    Confirm that the selected credential contains an active key from the [Exa dashboard](https://dashboard.exa.ai/api-keys) and that the key has available credits.
  </Accordion>

  <Accordion title="An Agent workflow times out">
    Disable **Wait for Completion**, persist the returned run `id`, and retrieve the result in a later step with **Get Run**.
  </Accordion>
</AccordionGroup>

## Resources

<Columns cols={3}>
  <Card title="Official Exa node" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="View repository" arrow="true">
    Review the current operations, compatibility, and source.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/docs/agent/quickstart" cta="Read guide" arrow="true">
    Build multi-step research and enrichment workflows.
  </Card>

  <Card title="Search best practices" icon="search" href="/docs/search/best-practices" cta="Read guide" arrow="true">
    Write better queries and choose the right search mode.
  </Card>
</Columns>
