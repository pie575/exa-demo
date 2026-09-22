> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Actualités {#news}

> Trouvez des reportages récents, des articles sectoriels et des sujets émergents avec Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Ouvrir dans le playground de l’API" aria-label={`Ouvrir "${query}" dans le playground de l’API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Utilisez Exa Search pour les reportages des grands médias, de la presse spécialisée et des publications de niche. Les nouveaux articles deviennent consultables quelques minutes après leur publication. Combinez une requête en langage naturel avec des filtres de date lorsque la fenêtre de publication est une exigence stricte.

## À utiliser pour {#use-it-for}

* La recherche sur les marchés et les investissements
* La cybersécurité et le renseignement sur les menaces
* La surveillance des entreprises, des produits et des concurrents
* Les briefings sectoriels et la recherche sur l&#39;actualité

## Exemples de requêtes {#example-queries}

### Suivre l&#39;évolution d&#39;un dossier politique {#follow-a-developing-policy-story}

Précisez le sujet, le type de source et la fenêtre de publication afin que les résultats portent sur la phase actuelle du dossier.

<PlaygroundQuery query="news coverage of the EU AI Act enforcement timeline published this month" />

### Trouver des analyses de professionnels du domaine {#find-practitioner-analysis}

Précisez le type de source lorsque vous recherchez des analyses de professionnels du domaine plutôt qu&#39;une couverture médiatique généraliste.

<PlaygroundQuery query="engineering blog posts about migrating from Postgres to ClickHouse" />

### Découvrir des discussions dans un format spécifique {#discover-discussions-in-a-specific-format}

Indiquez le format et le sujet dans la requête. La recherche reste ainsi ouverte aux pages d&#39;épisodes et aux transcriptions publiées sur le web.

<PlaygroundQuery query="podcast episodes where founders discuss pricing strategy mistakes" />

### Rechercher la presse défavorable {#research-adverse-media}

Décrivez à la fois le signal négatif et la catégorie d&#39;entité sur laquelle porte votre enquête. Évitez de réduire la requête à un nom d&#39;entreprise suivi du mot « actualités ».

<PlaygroundQuery query="negative press and regulatory complaints about payday lending companies" />

## Envoyer une requête {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "news articles about AI regulation updates in the European Union",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "news articles about AI regulation updates in the European Union",
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
      "query": "news articles about AI regulation updates in the European Union",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Obtenir des données structurées avec Exa Agent {#get-structured-data-with-exa-agent}

Pour des données structurées qui nécessitent une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les sujets, les fields et la période qui vous intéressent : Agent renvoie des résultats validés par schéma, accompagnés de leurs citations.

<Card title="Démarrer une tâche Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Rédigez une synthèse d&#39;actualité sourcée, comparez les couvertures médiatiques ou extrayez des faits normalisés d&#39;un sujet en cours.
</Card>