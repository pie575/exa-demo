> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Particle

> Search podcast transcripts with speaker attribution and timestamps.

[Particle](https://particle.news)' Podcast Intelligence indexes 100,000+ shows,
fully transcribed, diarized, speaker-identified, labeled, and enriched with metadata
within minutes of airing, making spoken conversations searchable. Each result is a
speaker-attributed transcript window with timestamps.

Attach `particle` to an [Exa Agent](/docs/agent/quickstart) run through
[Exa Connect](/docs/agent/connect/overview), and the agent queries
Particle alongside Exa web search.

## Use it for

* Finding expert commentary and quotable soundbites.
* Media and brand monitoring.
* Narrative and sentiment research.
* Discovering and staying up to date with podcasts.

## Provider ID

Use this value in `dataSources`:

```text theme={null}
particle
```

## Example

Find what podcast hosts are saying about AI regulation.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      data_sources=[{"provider": "particle"}],
      output_schema={
          "type": "object",
          "required": ["mentions"],
          "properties": {
              "mentions": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "episode", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "episode": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "pro-regulation, anti-regulation, or nuanced"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
    dataSources: [{ provider: "particle" }],
    outputSchema: {
      type: "object",
      required: ["mentions"],
      properties: {
        mentions: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["podcast", "episode", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              episode: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "pro-regulation, anti-regulation, or nuanced" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      "dataSources": [{ "provider": "particle" }],
      "outputSchema": {
        "type": "object",
        "required": ["mentions"],
        "properties": {
          "mentions": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["podcast", "episode", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "episode": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "pro-regulation, anti-regulation, or nuanced" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Pairs well with

* [Financial Datasets](/docs/agent/connect/financialdatasets): cross-check podcast chatter against published news.
* [Fiber.ai](/docs/agent/connect/fiber): attach company and contact context to the people being discussed.

## Next steps

<Columns cols={2}>
  <Card title="Attach it to a run" icon="rocket" href="/docs/agent/connect/overview" cta="Open quickstart" arrow="true">
    The Exa Connect quickstart covers `dataSources`, pricing, and the full partner catalog.
  </Card>

  <Card title="Combine providers" icon="blend" href="/docs/agent/connect/combining-providers" cta="Read guide" arrow="true">
    Attach up to five partners to one run and shape the query so each one fires.
  </Card>

  <Card title="Learn Exa Agent" icon="book-open" href="/docs/agent/quickstart" cta="Open guide" arrow="true">
    Create runs, stream progress, design output schemas, and control effort and cost.
  </Card>

  <Card title="Get an API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Create a key" arrow="true">
    Create a key in the dashboard and run this page's example as-is. New accounts start with free credits.
  </Card>
</Columns>
