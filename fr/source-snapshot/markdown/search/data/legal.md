> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="legal-public-records">
  # Documents juridiques et records publics
</div>

> Trouvez des décisions de justice, des brevets, des sanctions, des marchés publics et d&#39;autres records publics avec Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Ouvrir dans l’aire de test de l’API" aria-label={`Ouvrir "${query}" dans l’aire de test de l’API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Utilisez Exa Search pour accéder aux sources juridiques primaires et aux records gouvernementaux, ainsi qu&#39;aux commentaires qui les analysent.

<div id="included">
  ## Inclus
</div>

* Décisions de justice américaines, avec texte intégral, juridiction, numéro de rôle et métadonnées de citation
* Brevets américains délivrés, avec abrégé, revendications, description, inventeurs et cessionnaires
* Lois, réglementations et guidance des agences
* Listes de sanctions et watchlists
* Marchés publics et records de passation de marchés
* Données de recensement et autres records statistiques publics

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Recherche jurisprudentielle et RAG juridique
* Veille réglementaire et politique
* Recherches d&#39;antériorité et de liberté d&#39;exploitation
* Screening de conformité et due diligence
* Études de marché dans le secteur public

<div id="example-queries">
  ## Exemples de requêtes
</div>

<div id="find-case-law">
  ### Trouver de la jurisprudence
</div>

Décrivez la question juridique et la juridiction en langage courant plutôt que sous forme de citation juridique.

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

<div id="search-patents">
  ### Rechercher des brevets
</div>

Décrivez ce que fait l&#39;invention, comme le ferait une revendication.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="screen-against-sanctions">
  ### Effectuer un screening des sanctions
</div>

Indiquez la liste et la catégorie d&#39;entités que vous passez au crible.

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

<div id="research-government-spending">
  ### Rechercher les dépenses publiques
</div>

Indiquez l&#39;organisme acheteur ou la catégorie de service ainsi que la période concernée.

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

<div id="pull-public-statistics">
  ### Extraire des statistiques publiques
</div>

Précisez le jeu de données et la zone géographique.

<PlaygroundQuery query="census tract population change in the Austin metro area" />

<div id="make-a-request">
  ## Envoyer une requête
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "California appellate decisions on non-compete enforceability",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "California appellate decisions on non-compete enforceability",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "California appellate decisions on non-compete enforceability",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Obtenir des données structurées avec Exa Agent
</div>

Pour des données structurées nécessitant une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les juridictions, les types de records, les critères et les fields d&#39;output dont vous avez besoin : Agent renvoie des résultats validés par schéma, avec citations.

<Card title="Démarrer une tâche Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Passez une entité au crible selon différents types de records ou retracez une évolution réglementaire à partir des sources primaires et de leur couverture médiatique.
</Card>