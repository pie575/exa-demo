> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Publications de recherche {#research-publications}

> Trouvez des papers académiques, des brevets, des subventions, des essais cliniques et des approbations réglementaires avec Exa Search.

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

Utilisez Exa Search pour les publications de recherche et les records associés, y compris les titres, les résumés, les auteurs, les lieux de publication, les citations, les pages d&#39;éditeurs, les prépublications et les pages de repository.

<Tip>
  Lisez [SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search)
  pour en savoir plus sur la qualité de la recherche de publications.
</Tip>

## Inclus {#included}

* Papers et prépublications, y compris des fragments de texte intégral lorsqu&#39;un texte intégral analysé est disponible
* Brevets, avec résumés, revendications, inventeurs et titulaires
* Subventions et annonces de financement
* Essais cliniques, notices de médicaments et données d&#39;interactions
* Approbations réglementaires et sanitaires

## À utiliser pour {#use-it-for}

* La revue de littérature et la recherche de citations
* L&#39;analyse de l&#39;art antérieur et la cartographie des brevets
* La recherche clinique et pharmaceutique
* L&#39;identification de subventions et d&#39;opportunités de financement

## Exemples de requêtes {#example-queries}

### Trouver des papers sur un sujet {#find-papers-on-a-topic}

Décrivez la méthode ou le résultat obtenu plutôt que de deviner les mots-clés du titre. La catégorie `publication` restreint les résultats aux papers.

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

### Rechercher des preuves cliniques {#search-clinical-evidence}

Précisez la phase, l&#39;intervention et la population pour que les immatriculations d&#39;essais et les pages de résultats se classent avant la couverture générale.

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

### Suivre les approbations réglementaires {#track-regulatory-approvals}

Indiquez l&#39;organisme de réglementation ainsi que le dispositif ou la classe de médicaments que vous surveillez.

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

### Lancer une recherche d&#39;antériorité {#run-a-prior-art-search}

Décrivez l&#39;invention de façon fonctionnelle, comme le ferait une revendication, plutôt que d&#39;utiliser un nom de produit.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

## Envoyer une requête {#make-a-request}

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

## Obtenir des données structurées avec Exa Agent {#get-structured-data-with-exa-agent}

Pour des données structurées nécessitant une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les publications, les critères d&#39;inclusion et les fields d&#39;output dont vous avez besoin : Agent renvoie des résultats validés par schéma, accompagnés de leurs citations.

<Card title="Lancer une tâche Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Établissez une cartographie de la littérature, filtrez des papers selon des critères d&#39;inclusion ou regroupez des fields issus de plusieurs publications dans un seul tableau.
</Card>