> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Financial Datasets

> Structured financial and market data for 27,000+ U.S. tickers: prices, fundamentals, earnings, SEC filings, ownership, and stock screening.

[Financial Datasets](https://financialdatasets.ai) provides machine-ready
company and market data for AI agents. Through
[Exa Connect](/docs/agent/connect/overview), agents can retrieve
real-time and historical prices, company facts, financial statements and
valuation metrics, earnings, insider and institutional ownership, SEC filings
and filing sections, company news, and screen the U.S. market by fundamental
criteria.

Attach `financial_datasets` to an [Exa Agent](/docs/agent/quickstart) run,
and the agent queries Financial Datasets alongside Exa web search.

## Use it for

* Building structured company research snapshots.
* Analyzing financial performance, valuation, and historical trends.
* Reading SEC filings and extracting sections such as risk factors and MD\&A.
* Examining insider transactions and institutional ownership.
* Screening the U.S. market by fundamental criteria.
* Monitoring company news and relevant developments.

## Data available

Each of the following datasets is available under the `financial_datasets`
provider; the agent selects whichever fits the task:

| Dataset                 | What it returns                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| Beneficial ownership    | 5%+ beneficial owners from Schedules 13D/13G, including activist and passive stakes.                     |
| Company facts           | Name, sector, industry, exchange, location, SEC CIK, SIC classification.                                 |
| Company news            | Recent news articles for a ticker.                                                                       |
| Earnings                | Quarterly revenue and EPS with YoY change and beat/miss surprises.                                       |
| Financial metrics       | Market cap, EV, P/E, P/B, P/S, EV/EBITDA, PEG, margins, ROE/ROA/ROIC, growth, EPS.                       |
| Financial statements    | Income statement, balance sheet, and cash flow from SEC filings.                                         |
| Historical stock prices | OHLCV bars over a date range at day/week/month/year granularity.                                         |
| Index-fund holdings     | ETF/index-fund constituents by weight, or the funds that hold a given security.                          |
| Insider ownership       | Insider holdings from SEC Forms 3 and 5 (shares owned by officers, directors, 10% owners).               |
| Insider trades          | SEC Form 4 insider transactions (name, role, type, shares, value).                                       |
| Institutional ownership | 13F institutional holders, shares, and reported value.                                                   |
| Interest rates          | Current and historical central-bank policy rates (Fed, ECB, BOJ, and more).                              |
| SEC filing items        | Extracted text of specific 10-K/10-Q/8-K items (e.g. risk factors, MD\&A).                               |
| SEC filings             | Filing metadata and direct EDGAR links, optionally filtered by form type.                                |
| Segmented financials    | Revenue, operating income, and other line items broken down by product, business segment, and geography. |
| Stock price snapshot    | Current real-time price, day change, and quote time.                                                     |
| Stock screener          | Companies matching fundamental filter criteria.                                                          |

## Provider ID

Use this value in `dataSources`:

```text theme={null}
financial_datasets
```

## Example

Build a structured company-research snapshot for NVIDIA.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
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
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Pairs well with

* [Particle](/docs/agent/connect/particle): compare published coverage with podcast commentary.
* [Baselayer](/docs/agent/connect/baselayer): verify the underlying entity behind a ticker.
* [Fiber.ai](/docs/agent/connect/fiber): enrich a public company with private-market peers and leadership contacts.

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
