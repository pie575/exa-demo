> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="research-publications">
  # Publications de recherche
</div>

> Trouvez des papers, des brevets, des subventions de recherche, des essais cliniques et des approbations réglementaires avec Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Ouvrir dans le playground d’API" aria-label={`Ouvrir « ${query} » dans le playground d’API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Utilisez Exa Search pour les publications de recherche et les records associés, y compris les titres, résumés, auteurs, lieux de publication, citations, pages d&#39;éditeurs, preprints et pages de repository.

<Tip>
  Lisez [SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search)
  pour en savoir plus sur la qualité de la recherche de publications.
</Tip>

<div id="included">
  ## Inclus
</div>

* Papers et preprints, y compris les fragments de full text lorsqu&#39;un full text analysé est disponible
* Brevets, avec résumés, revendications, inventeurs et titulaires
* Subventions et annonces de financement
* Essais cliniques, notices de médicaments et données d&#39;interaction
* Approbations réglementaires et sanitaires

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Revue de littérature et découverte de citations
* Recherche d&#39;antériorité et cartographie des brevets
* Recherche clinique et pharmaceutique
* Découverte de subventions et d&#39;opportunités de financement

<div id="example-queries">
  ## Exemples de requêtes
</div>

<div id="find-papers-on-a-topic">
  ### Trouver des papers sur un sujet
</div>

Décrivez la méthode ou le résultat plutôt que d&#39;essayer de deviner les mots-clés du titre. La catégorie `publication` restreint les résultats aux papers.

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

<div id="search-clinical-evidence">
  ### Rechercher des preuves cliniques
</div>

Précisez la phase, l&#39;intervention et la population afin que les enregistrements d&#39;essais cliniques et les pages de résultats ressortent avant les contenus généralistes.

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

<div id="track-regulatory-approvals">
  ### Suivre les approbations réglementaires
</div>

Indiquez l&#39;autorité de régulation ainsi que le dispositif ou la classe de médicaments qui vous intéresse.

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

<div id="run-a-prior-art-search">
  ### Lancer une recherche d&#39;antériorité
</div>

Décrivez l&#39;invention de façon fonctionnelle, comme le ferait une revendication de brevet, plutôt que d&#39;utiliser un nom de produit.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="make-a-request">
  ## Envoyer une requête
</div>

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

<div id="get-structured-data-with-exa-agent">
  ## Obtenir des données structurées avec Exa Agent
</div>

Pour des données structurées qui nécessitent une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les publications, les critères d&#39;inclusion et les champs de sortie dont vous avez besoin : Agent renvoie des résultats validés par schéma, accompagnés de citations.

<Card title="Lancer une tâche Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Construisez une cartographie de la littérature, filtrez des papers selon des critères d&#39;inclusion ou regroupez des champs issus de plusieurs publications dans un seul tableau.
</Card>