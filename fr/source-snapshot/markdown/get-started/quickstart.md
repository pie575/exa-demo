> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="developer-quickstart">
  # Quickstart développeur
</div>

> Obtenez une API key, puis utilisez Exa depuis votre code ou votre agent.

<div className="docs-quickstart-section docs-quickstart-auth">
  <div id="1-get-an-api-key">
    ## 1. Obtenir une API key
  </div>

  <Steps>
    <Step title="Rendez-vous sur l'Exa Dashboard">
      <Card title="Obtenez votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
        Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
      </Card>
    </Step>

    <Step title="Définissez la key comme environment variable">
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
  <div id="2-choose-how-youll-use-exa">
    ## 2. Choisissez comment utiliser Exa
  </div>

  Exa s&#39;intègre à votre application de deux façons : appelez les API depuis votre propre code, ou connectez un agent que vous utilisez déjà.

  <Columns cols={2}>
    <Card title="Appeler les API" icon="code" href="#3-install-an-sdk" cta="Installer un SDK">
      Utilisez Search, Contents et Exa Agent depuis votre propre code. Installez un SDK
      ci-dessous et effectuez votre première requête.
    </Card>

    <Card title="Connecter votre agent" icon="plug" href="/fr/docs/get-started/exa-mcp" cta="Configurer Exa MCP">
      Connectez ChatGPT, Claude, Codex ou Cursor aux outils de search et de recherche
      d&#39;Exa. Aucune API key n&#39;est nécessaire.
    </Card>
  </Columns>

  Vous développez avec les API ? Choisissez votre point de départ :

  | Commencer par                           | À utiliser pour                                                                     |
  | --------------------------------------- | ----------------------------------------------------------------------------------- |
  | [Search](/fr/docs/search/quickstart)       | Trouver des pages web pertinentes et renvoyer du contenu synthétisé en moins de 2 s |
  | [Deep Search](/fr/docs/search/deep-search) | Une search de meilleure qualité, où un LLM affine les résultats de façon itérative  |
  | [Agent](/fr/docs/agent/quickstart)         | Recherche asynchrone de longue durée, list building, enrichment ou rapports         |
  | [Contents](/fr/docs/contents/quickstart)   | Extraire le page content lorsque vous disposez déjà des URL                         |
</div>

<div className="docs-quickstart-section">
  <div id="3-install-an-sdk">
    ## 3. Installer un SDK
  </div>

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
  <div id="4-make-your-first-request">
    ## 4. Effectuez votre première requête
  </div>

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

  <div id="next-steps">
    ## Étapes suivantes
  </div>

  <Columns cols={2}>
    <Card title="Search API" icon="search" href="/fr/docs/search/quickstart" cta="Lire le guide" arrow="true">
      Trouvez les pages pertinentes et récupérez un contenu propre ou des sorties structurées.
    </Card>

    <Card title="Agent API" icon="bot" href="/fr/docs/agent/quickstart" cta="Lire le guide" arrow="true">
      Créez des workflows de recherche de longue durée, de list-building et d&#39;enrichment.
    </Card>

    <Card title="Contents API" icon="file-text" href="/fr/docs/contents/quickstart" cta="Lire le guide" arrow="true">
      Extrayez un contenu propre depuis des pages que vous connaissez déjà.
    </Card>

    <Card title="Exa MCP" icon="plug" href="/fr/docs/get-started/exa-mcp" cta="Lire le guide" arrow="true">
      Connectez n&#39;importe quel client MCP à la web search d&#39;Exa, à la récupération de pages et aux
      tools Exa Agent.
    </Card>
  </Columns>
</div>