> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Affiliate.com

> Search product catalogs across merchants and affiliate networks.

[Affiliate.com](https://affiliate.com) aggregates product catalogs across
merchants and affiliate networks into a single searchable index, with live
pricing, brands, and direct merchant links.

Attach `affiliate` to an [Exa Agent](/docs/agent/quickstart) run through
[Exa Connect](/docs/agent/connect/overview), and the agent queries
Affiliate.com alongside Exa web search.

## Use it for

* Product discovery and price comparison across merchants.
* Powering shopping assistants and buying-guide content.
* Surfacing affiliate links alongside research.

## Provider ID

Use this value in `dataSources`:

```text theme={null}
affiliate
```

## Example

Find wireless noise-cancelling headphones under \$300 and compare pricing.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      data_sources=[{"provider": "affiliate"}],
      output_schema={
          "type": "object",
          "required": ["products"],
          "properties": {
              "products": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "brand", "price", "merchant"],
                      "properties": {
                          "name": {"type": "string"},
                          "brand": {"type": "string"},
                          "price": {"type": "string", "description": "price with currency"},
                          "merchant": {"type": "string"},
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
    query: "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
    dataSources: [{ provider: "affiliate" }],
    outputSchema: {
      type: "object",
      required: ["products"],
      properties: {
        products: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "brand", "price", "merchant"],
            properties: {
              name: { type: "string" },
              brand: { type: "string" },
              price: { type: "string", description: "price with currency" },
              merchant: { type: "string" },
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
      "query": "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      "dataSources": [{ "provider": "affiliate" }],
      "outputSchema": {
        "type": "object",
        "required": ["products"],
        "properties": {
          "products": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "brand", "price", "merchant"],
              "properties": {
                "name": { "type": "string" },
                "brand": { "type": "string" },
                "price": { "type": "string", "description": "price with currency" },
                "merchant": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Pairs well with

* [Similarweb](/docs/agent/connect/similarweb): gauge a merchant's reach before recommending it.
* [Fiber.ai](/docs/agent/connect/fiber): research the company behind a merchant or brand.

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
