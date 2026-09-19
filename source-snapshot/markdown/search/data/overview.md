> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Data Index

> What Exa indexes across the public web and private data sources.

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

Exa searches the public web and select private data sources, with coverage refreshed continuously. It includes:

<AccordionGroup>
  <Accordion title="News" icon="newspaper">
    <Card title="News guide" icon="newspaper" href="/docs/search/data/news" cta="Read guide" arrow="true">
      Explore news search use cases, examples, and best practices.
    </Card>

    News and articles:

    <PlaygroundQuery query="coverage of the EU AI Act enforcement timeline published this month" />

    Blog posts and listicles:

    <PlaygroundQuery query="engineering blog posts about migrating from Postgres to ClickHouse" />

    Podcast and video transcripts:

    <PlaygroundQuery query="podcast episodes where founders discuss pricing strategy mistakes" />

    Adverse media:

    <PlaygroundQuery query="negative press and regulatory complaints about payday lending companies" />
  </Accordion>

  <Accordion title="Code & Docs" icon="code">
    <Card title="Code & Docs guide" icon="code" href="/docs/search/data/code" cta="Read guide" arrow="true">
      Explore code search use cases, examples, and best practices.
    </Card>

    GitHub repos:

    <PlaygroundQuery query="open source Rust libraries for vector similarity search" />

    API and developer documentation:

    <PlaygroundQuery query="Stripe webhook signature verification documentation" />

    Package registries, with precise version and release details:

    <PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

    Agent skills directories:

    <PlaygroundQuery query="agent skills for extracting tables from PDFs" />
  </Accordion>

  <Accordion title="Companies & People" icon="users">
    <Card title="Companies & People guide" icon="users" href="/docs/search/data/companies-people" cta="Read guide" arrow="true">
      Learn how to find companies, people, and the relationships between them.
    </Card>

    Company discovery and operating signals:

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    Professional profiles by role, skill, and location:

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    People qualified by the companies they work for:

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    Company and stakeholder research in one query:

    <PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />
  </Accordion>

  <Accordion title="Financial Markets" icon="chart-line">
    <Card title="Financial Markets guide" icon="chart-line" href="/docs/search/data/financial" cta="Read guide" arrow="true">
      Explore quotes, filings, earnings calls, and market research use cases.
    </Card>

    Prices, analyst estimates, and financial reports:

    <PlaygroundQuery query="analyst price targets for NVIDIA after its most recent earnings" />

    SEC filings, earnings calls, and international filings:

    <PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" />

    Announced funding and other publicly-reported data:

    <PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

    Published economic data and government statistics:

    <PlaygroundQuery query="most recent US CPI release and month-over-month change" />
  </Accordion>

  <Accordion title="Research Publications" icon="book-open">
    <Card title="Research Publications guide" icon="book-open" href="/docs/search/data/research" cta="Read guide" arrow="true">
      Explore paper, patent, clinical, and regulatory research use cases.
    </Card>

    Research papers, patents, and grants:

    <PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" />

    Clinical trials and drug interactions:

    <PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

    Regulatory and health approvals:

    <PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />
  </Accordion>

  <Accordion title="Legal & Public Records" icon="scale">
    <Card title="Legal & Public Records guide" icon="scale" href="/docs/search/data/legal" cta="Read guide" arrow="true">
      Explore case law, patents, sanctions, and public-records use cases.
    </Card>

    Legal and court records:

    <PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

    Sanctions and watchlists:

    <PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

    Public government contracts:

    <PlaygroundQuery query="federal contracts awarded for cloud migration services" />

    Censuses and other public records:

    <PlaygroundQuery query="census tract population change in the Austin metro area" />
  </Accordion>

  <Accordion title="Sports, Weather & Places" icon="map-pin">
    <Card title="Sports, Weather & Places guide" icon="map-pin" href="/docs/search/data/sports-weather-places" cta="Read guide" arrow="true">
      Learn how to query live sports data, forecasts, and local information.
    </Card>

    Live scores, standings, and schedules:

    <PlaygroundQuery query="NBA scores last night" />

    Forecasts for any place and date:

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    Local businesses, venues, and properties:

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />
  </Accordion>

  <Accordion title="Cybersecurity" icon="shield">
    <Card title="Cybersecurity guide" icon="shield" href="/docs/search/data/security" cta="Read guide" arrow="true">
      Explore vulnerability, advisory, and vendor-risk use cases.
    </Card>

    Security advisories:

    <PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

    CVE and GHSA vulnerability databases:

    <PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

    Data subprocessor lists and trust pages:

    <PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />
  </Accordion>
</AccordionGroup>

These guides cover common data patterns, but Exa also searches the broader public web across many sites, formats, and languages.
