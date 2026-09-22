> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Code &amp; Docs {#code-docs}

> Trouvez du code, de la documentation technique et des conseils d&#39;implémentation avec Exa Search.

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

Utilisez Exa Search pour trouver des dépôts, de la documentation technique, des informations sur les packages et des conseils d&#39;implémentation à partir de requêtes en langage naturel.

<Tip>
  Lisez [WebCode: Search Evals for Coding Agents](https://exa.ai/blog/webcode) pour découvrir comment Exa
  évalue le retrieval pour les tâches de code.
</Tip>

## Cas d&#39;usage {#use-it-for}

* Agents de code et outils de génération de code
* Produits de recherche pour développeurs et de documentation
* Workflows de débogage, de migration et de configuration
* Recherche technique dans les dépôts, la documentation et les registres de packages

## Exemples de requêtes {#example-queries}

### Découvrir des bibliothèques par capacité {#discover-libraries-by-capability}

Décrivez la capacité, l&#39;écosystème et les contraintes qui vous intéressent. Les candidats sont ainsi identifiés selon ce qu&#39;ils font, plutôt qu&#39;à partir d&#39;un nom de projet exact.

<PlaygroundQuery query="open source Rust libraries for vector similarity search" />

### Récupérer la documentation d&#39;implémentation {#retrieve-implementation-documentation}

Indiquez le produit et l&#39;opération exacte. Search peut alors privilégier la documentation d&#39;API et les guides d&#39;implémentation plutôt que les discussions générales.

<PlaygroundQuery query="Stripe webhook signature verification documentation" />

### Vérifier les changements spécifiques à une version {#check-version-specific-changes}

Précisez le canal de publication ou la version lorsque la compatibilité est en jeu. Cela limite les résultats portant sur des versions plus anciennes.

<PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

### Trouver des outils d&#39;agent réutilisables {#find-reusable-agent-tooling}

Indiquez le type d&#39;artefact et la tâche plutôt que de rechercher une expression générale comme « outils d&#39;IA ».

<PlaygroundQuery query="agent skills for extracting tables from PDFs" />

## Envoyer une requête {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "how to use Exa search in python",
      type="fast",
      num_results=10,
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "how to use Exa search in python",
    {
      type: "fast",
      numResults: 10,
      contents: {
        highlights: true,
      },
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "how to use Exa search in python",
      "type": "fast",
      "numResults": 10,
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

## Obtenir des données structurées avec Exa Agent {#get-structured-data-with-exa-agent}

Pour des données structurées nécessitant une recherche sur plusieurs sources, utilisez un [run de tâche Exa Agent](/fr/docs/agent/quickstart). Décrivez les bibliothèques, les critères techniques et les output fields dont vous avez besoin : Agent renvoie des résultats validés par schéma, accompagnés de leurs citations.

<Card title="Démarrer une tâche Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide Agent" arrow="true">
  Comparez des bibliothèques, enrichissez des records de repository ou générez une liste structurée à partir de plusieurs signaux techniques.
</Card>