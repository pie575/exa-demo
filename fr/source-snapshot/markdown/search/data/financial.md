> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="financial-markets">
  # Marchés financiers
</div>

> Trouvez des données de marché, des filings, des earnings calls et des publications économiques avec Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Ouvrir dans le playground de l’API" aria-label={`Ouvrir « ${query} » dans le playground de l’API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Utilisez Exa Search pour obtenir les prix, les filings, les transcriptions et les analyses associées en une seule requête. Une question sur un ticker peut renvoyer à la fois la quote, le dernier earnings call et la couverture des analystes.

<div id="included">
  ## Inclus
</div>

* Quotes et historique récent des prix pour les actions, cryptomonnaies, devises, indices, contrats à terme, options et matières premières
* Profils de titres avec statistiques clés et historique OHLCV quotidien
* Transcriptions d&#39;earnings calls, avec les allocutions préparées et les questions-réponses attribuées aux intervenants
* SEC filings, résultats financiers publiés et filings internationaux
* Estimations d&#39;analystes, annonces de levées de fonds et publications économiques

<div id="use-it-for">
  ## À utiliser pour
</div>

* La recherche actions et crédit
* Le KYC, le KYB et le screening des médias défavorables
* Le suivi des portefeuilles et des politiques
* Le sourcing d&#39;opérations et la recherche sur les marchés privés

<div id="example-queries">
  ## Exemples de requêtes
</div>

<div id="look-up-a-quote">
  ### Consulter une quote
</div>

Indiquez le ticker ou le nom de l&#39;entreprise, ainsi que la donnée souhaitée. Un cashtag tel que `$NVDA` fonctionne également.

<PlaygroundQuery query="NVIDIA stock price and change today" />

<div id="read-an-earnings-call">
  ### Lire un earnings call
</div>

Indiquez le nom de l&#39;entreprise et le trimestre pour obtenir la transcription elle-même plutôt que de la couverture de celle-ci.

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

<div id="search-filings">
  ### Rechercher des filings
</div>

Décrivez l&#39;information que vous recherchez, et pas seulement le type de formulaire. La catégorie `financial report` limite les résultats aux filings et aux rapports.

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

<div id="track-private-market-activity">
  ### Suivre l&#39;activité du marché privé
</div>

Précisez le tour de financement, le secteur et la période.

<PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

<div id="follow-economic-data">
  ### Suivre les données économiques
</div>

Indiquez la publication et le chiffre que vous souhaitez en extraire.

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

<div id="make-a-request">
  ## Envoyer une requête
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "10-K risk factors that mention dependency on third-party AI models",
      type="auto",
      category="financial report",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "10-K risk factors that mention dependency on third-party AI models",
    {
      type: "auto",
      category: "financial report",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "10-K risk factors that mention dependency on third-party AI models",
      "type": "auto",
      "category": "financial report",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Obtenir des données structurées avec Exa Agent
</div>

Pour des données structurées nécessitant une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les titres, les périodes, les critères et les fields de sortie dont vous avez besoin : Agent renvoie des résultats validés par schéma, accompagnés de leurs citations.

<Card title="Lancer une tâche Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Filtrez des entreprises, comparez des filings ou constituez un dossier structuré sur un portefeuille.
</Card>