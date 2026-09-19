> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Research Publications

> Find academic papers, patents, grants, clinical trials, and regulatory approvals with Exa Search.

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Open in API playground" aria-label={`Open "${query}" in the API playground`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Use Exa Search for research publications and related records, including titles, abstracts, authors, venues, citations, publisher pages, preprints, and repository pages.

<Tip>
  Read [SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search)
  to learn more about publication search quality.
</Tip>

## Included

* Papers and preprints, including full-text chunks where a parsed full text is available
* Patents, with abstracts, claims, inventors, and assignees
* Grants and funding announcements
* Clinical trials, drug labels, and interaction data
* Regulatory and health approvals

## Use it for

* Literature review and citation discovery
* Prior-art and patent landscaping
* Clinical and pharmaceutical research
* Grant and funding-opportunity discovery

## Example queries

### Find papers on a topic

Describe the method or finding rather than guessing at title keywords. The `publication` category keeps results to papers.

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

### Search clinical evidence

Name the phase, intervention, and population so trial registrations and results pages rank above general coverage.

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

### Track regulatory approvals

Name the regulator and the device or drug class you are watching.

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

### Run a prior-art search

Describe the invention functionally, the way a claim would, instead of using a product name.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

## Make a request

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "papers on evaluation benchmarks for retrieval-augmented generation",
      type="auto",
      category="publication",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "papers on evaluation benchmarks for retrieval-augmented generation",
    {
      type: "auto",
      category: "publication",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "papers on evaluation benchmarks for retrieval-augmented generation",
      "type": "auto",
      "category": "publication",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Get structured data with Exa Agent

For structured data that requires research across multiple sources, use an [Exa Agent task run](/docs/agent/quickstart). Describe the publications, inclusion criteria, and output fields you need, and Agent returns schema-validated results with citations.

<Card title="Start an Agent task" icon="bot" href="/docs/agent/quickstart" cta="Open Agent guide" arrow="true">
  Build a literature map, screen papers against inclusion criteria, or gather fields from several publications into one table.
</Card>
