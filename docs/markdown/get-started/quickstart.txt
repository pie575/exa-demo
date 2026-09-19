> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Developer quickstart

> Get an API key, then use Exa from your code or your agent.

<div className="docs-quickstart-section docs-quickstart-auth">
  ## 1. Get an API key

  <Steps>
    <Step title="Visit the Exa Dashboard">
      <Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        Create a key in the dashboard. New accounts start with free credits.
      </Card>
    </Step>

    <Step title="Set the key as an environment variable">
      <Tabs>
        <Tab title="macOS/Linux">
          ```bash theme={null}
          export EXA_API_KEY="your-api-key"
          ```
        </Tab>

        <Tab title="Windows">
          ```powershell theme={null}
          setx EXA_API_KEY "your-api-key"
          ```
        </Tab>
      </Tabs>
    </Step>
  </Steps>
</div>

<div className="docs-quickstart-section">
  ## 2. Choose how you'll use Exa

  Exa fits into your application two ways: call the APIs from your own code, or connect an agent you already use.

  <Columns cols={2}>
    <Card title="Call the APIs" icon="code" href="#3-install-an-sdk" cta="Install an SDK">
      Use Search, Contents, and Exa Agent from your own code. Install an SDK
      below and make your first request.
    </Card>

    <Card title="Connect your agent" icon="plug" href="/docs/get-started/exa-mcp" cta="Set up Exa MCP">
      Connect ChatGPT, Claude, Codex, or Cursor to Exa's search and research
      tools. No API key is required.
    </Card>
  </Columns>

  Building with the APIs? Pick where to start:

  | Start with                         | Use it for                                                                |
  | ---------------------------------- | ------------------------------------------------------------------------- |
  | [Search](/docs/search/quickstart)       | Finding relevant web pages & returning synthesized content in under 2s    |
  | [Deep Search](/docs/search/deep-search) | Higher-quality search where an LLM iteratively finds better results       |
  | [Agent](/docs/agent/quickstart)         | Long-running asynchronous research, list building, enrichment, or reports |
  | [Contents](/docs/contents/quickstart)   | Extracting page content when you already have the URL(s)                  |
</div>

<div className="docs-quickstart-section">
  ## 3. Install an SDK

  <CodeGroup>
    ```bash Python theme={null}
    pip install exa-py
    ```

    ```bash JavaScript theme={null}
    npm install exa-js
    ```
  </CodeGroup>
</div>

<div className="docs-quickstart-section">
  ## 4. Make your first request

  <CodeGroup>
    ```python Python theme={null}
    from exa_py import Exa

    exa = Exa()

    results = exa.search(
        "best blog posts about vector databases",
        contents={"highlights": True},
    )

    for result in results.results:
        print(result.title, result.url)
    ```

    ```javascript JavaScript theme={null}
    import Exa from "exa-js";

    const exa = new Exa();

    const { results } = await exa.search(
      "best blog posts about vector databases",
      { contents: { highlights: true } },
    );

    for (const result of results) {
      console.log(result.title, result.url);
    }
    ```

    ```bash cURL theme={null}
    curl -s -X POST "https://api.exa.ai/search" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $EXA_API_KEY" \
      -d '{
        "query": "best blog posts about vector databases",
        "contents": { "highlights": true }
      }'
    ```
  </CodeGroup>

  ## Next steps

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/docs/search/quickstart" cta="Read guide" arrow="true">
      Find relevant pages and return clean content or structured outputs.
    </Card>

    <Card title="Agent API" icon="bot" href="/docs/agent/quickstart" cta="Read guide" arrow="true">
      Build long-running research, list-building, and enrichment workflows.
    </Card>

    <Card title="Contents API" icon="file-text" href="/docs/contents/quickstart" cta="Read guide" arrow="true">
      Extract clean content from pages you already know.
    </Card>

    <Card title="Exa MCP" icon="plug" href="/docs/get-started/exa-mcp" cta="Read guide" arrow="true">
      Connect any MCP client to Exa's web search, page fetching, and Exa Agent
      tools.
    </Card>
  </Columns>
</div>
