> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Exa Search API {#exa-search-api}

> Effectuez des recherches sur le web en langage naturel et obtenez un contenu de page propre et pertinent en une seule requête.

Exa Search reçoit une requête en langage naturel et renvoie des résultats web classés, accompagnés d&#39;un contenu de page propre.

## Effectuez votre première requête {#make-your-first-request}

Commencez avec une `query` en langage naturel et `contents: { highlights: true }`, qui renvoie des extraits dont la longueur s&#39;adapte à la relevance de chaque result. D&#39;autres fields déterminent la façon dont Exa effectue la recherche et ce que contient chaque result ; la suite de cette page couvre ceux que vous utiliserez réellement.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "recent techniques for improving retrieval in RAG systems",
      type="auto",
      contents={"highlights": True},
  )

  for item in result.results:
      print(item.title, item.url)
      print(item.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "recent techniques for improving retrieval in RAG systems",
    {
      type: "auto",
      contents: { highlights: true }
    }
  );

  for (const item of result.results) {
    console.log(item.title, item.url);
    console.log(item.highlights);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "recent techniques for improving retrieval in RAG systems",
      "type": "auto",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Par défaut, search renvoie jusqu&#39;à 10 results. Définissez `numResults` pour en demander jusqu&#39;à 100 ; il peut y en avoir moins si le nombre de pages pertinentes est insuffisant. Search ne prend pas en charge la pagination.

<Accordion title="Exemple de réponse">
  Les highlights et la liste ci-dessous sont abrégés.

  ```json theme={null}
  {
    "requestId": "c3174df2b9cd5afbc64cdf79f3719b19",
    "resolvedSearchType": "",
    "results": [
      {
        "id": "https://arxiv.org/html/2608.21702",
        "title": "From Association to Causation: Improving Retrieval Precision ofRetrieval-Augmented Generation via Causal Relations and an Attention Mechanism",
        "url": "https://arxiv.org/html/2608.21702",
        "highlights": [
          "Retrieval-Augmented Generation (RAG) grounds LLM generation on retrieved documents, but the standard terminal retrieval stage—dense-vector similarity, optionally followed by reranking—often returns documents that merely share keywords with the query without containing the needed information...\n..."
        ],
        "image": "https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg",
        "favicon": "https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png"
      },
      {
        "id": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "title": "Four retrieval techniques to improve RAG you need to know",
        "url": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "publishedDate": "2025-04-14T00:00:00.000Z",
        "highlights": [
          "It's not surprising, then, that we've seen a range of different approaches emerge that attempt to address RAG's limitations over the last year or so.\n..."
        ],
        "image": "https://www.thoughtworks.com/content/dam/thoughtworks/images/illustration/brand/tw_illustration_5.jpg"
      }
    ],
    "searchTime": 1324.3,
    "costDollars": {
      "total": 0.007,
      "search": {
        "neural": 0.007
      }
    }
  }
  ```
</Accordion>

Les results sont classés par relevance. Chacun comporte des métadonnées telles que le titre, l&#39;URL et la date de publication, ainsi que tout ce que vous avez demandé dans `contents`.

## Rédiger des requêtes {#writing-queries}

Le field `query` est le seul field obligatoire pour utiliser la Search API.

Rédigez vos requêtes en langage naturel. Indiquez le sujet et, le cas échéant, le type de source et la période souhaités.

Les requêtes peuvent être larges et exploratoires. `"Latest news on EU battery policy"` donne à Exa suffisamment d&#39;intention pour découvrir des pages pertinentes ; `"news"` non. Lorsque le type de source importe, précisez-le dans la requête :

```text theme={null}
Articles techniques récents comparant la recherche hybride et la recherche sémantique pour les systèmes RAG
```

Consultez [Ce que contient l&#39;index d&#39;Exa](/fr/docs/search/data/overview) pour savoir ce que l&#39;index d&#39;Exa inclut et comment rechercher ces types de contenu.

<h2 id="search-types">
  Choisir un type de recherche
</h2>

`type` sélectionne un mode de recherche, chacun étant réglé selon un équilibre différent entre vitesse, profondeur de recherche et synthèse. `auto` est la valeur par défaut et convient à la plupart des recherches.

| Type             | À utiliser lorsque                                                                      |
| ---------------- | --------------------------------------------------------------------------------------- |
| `auto`           | Vous souhaitez le meilleur équilibre par défaut entre qualité et vitesse                |
| `fast`           | La requête est sensible à la latence                                                    |
| `instant`        | La requête s&#39;inscrit dans un flux temps réel, comme l&#39;autocomplétion ou la voix |
| `deep-lite`      | La tâche nécessite une recherche et une synthèse légères                                |
| `deep`           | La tâche exige une recherche en plusieurs étapes et une synthèse plus poussée           |
| `deep-reasoning` | L&#39;exhaustivité et la profondeur de raisonnement priment sur la latence              |

Les modes deep exécutent un véritable processus de recherche plutôt qu&#39;une simple passe de retrieval. Consultez [Deep Search](/fr/docs/search/deep-search) pour comprendre le fonctionnement de ce processus et l&#39;usage de ses contrôles supplémentaires.

<Tip>
  Plutôt que `deep-reasoning`, utilisez [Exa Agent](/fr/docs/agent/quickstart) pour la recherche de longue durée, la
  constitution de listes et l&#39;enrichment multi-étapes. Agent dispose de plus de puissance de calcul par run et renvoie des résultats structurés et
  fondés sur des preuves.
</Tip>

## Formes de sortie {#output-shapes}

Chaque result inclut des métadonnées telles que son titre, son URL et sa date de publication. Utilisez `contents` pour ajouter des highlights, le texte intégral ou un résumé de la page.

<Tabs>
  <Tab title="Highlights">
    Les highlights renvoient les extraits les plus pertinents pour votre requête. Ils fournissent aux modèles et aux agents les
    preuves dont ils ont besoin sans saturer la fenêtre de context avec des passages sans rapport de chaque page.

    C&#39;est la forme de sortie recommandée pour la plupart des tâches.

    Commencez simplement par `highlights: true`. Exa s&#39;appuie sur la requête pour sélectionner une quantité de
    contenu adaptée dans chaque result.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "How are inference providers reducing transformer latency?",
          contents={"highlights": True},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "How are inference providers reducing transformer latency?",
        { contents: { highlights: true } }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "How are inference providers reducing transformer latency?",
          "contents": { "highlights": true }
        }'
      ```
    </CodeGroup>

    Consultez [Highlights](/fr/docs/search/highlights) pour en savoir plus sur Dynamic Highlights et sur les cas où l&#39;activer.
  </Tab>

  <Tab title="Texte intégral">
    Le texte intégral renvoie le corps de page nettoyé. Utilisez-le lorsque la tâche dépend d&#39;un context plus large, de la
    structure du document ou de détails qui échappent aux extraits ciblés sur la requête.

    Les pages complètes peuvent être volumineuses. Limitez à la fois le nombre de results et le texte renvoyé par page.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "Technical postmortems of large-scale inference outages",
          num_results=5,
          contents={"text": {"max_characters": 10000}},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "Technical postmortems of large-scale inference outages",
        {
          numResults: 5,
          contents: { text: { maxCharacters: 10000 } }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "Technical postmortems of large-scale inference outages",
          "numResults": 5,
          "contents": {
            "text": { "maxCharacters": 10000 }
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

Choisissez une seule vue de contenu par requête. Demander à la fois les highlights et le texte renvoie et facture deux vues de la même page. `summary` constitue une troisième option, mais elle ajoute un appel à un modèle de langage pour chaque result.

<Warning>
  `/search` et `/contents` acceptent les mêmes options de contenu, mais à des endroits différents :

  * **`/search`** imbrique `highlights`, `text` et `summary` dans l&#39;objet `contents` :
    `"contents": { "highlights": true }`
  * **`/contents`** n&#39;a pas de wrapper `contents`. Son corps correspond aux options de contenu elles-mêmes : les
    mêmes fields se placent donc au niveau racine, à côté de `urls` : `"urls": [...], "highlights": true`
</Warning>

## Schéma de sortie {#output-schema}

Ajoutez `outputSchema` lorsque vous souhaitez qu&#39;Exa synthétise les résultats de recherche. Ce paramètre fonctionne avec tous les types de recherche et ajoute un objet `output` à la réponse.

Les pages classées restent dans `results`. La valeur générée est renvoyée dans `output.content`, avec les sources et la confiance au niveau de chaque field dans `output.grounding`.

<Tabs>
  <Tab title="Texte libre">
    Utilisez `type: "text"` pour générer du texte rédigé. Ajoutez une `description` pour en préciser le format ou la longueur.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "What changed in the latest EU battery policy?",
          output_schema={
              "type": "text",
              "description": "Summarize the changes in three concise bullets",
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "What changed in the latest EU battery policy?",
        {
          outputSchema: {
            type: "text",
            description: "Summarize the changes in three concise bullets"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "What changed in the latest EU battery policy?",
          "outputSchema": {
            "type": "text",
            "description": "Summarize the changes in three concise bullets"
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="JSON structuré">
    Utilisez `type: "object"` pour obtenir du JSON conforme aux propriétés et aux exigences que vous définissez.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "AI infrastructure companies that announced Series A or B funding in the past six months",
          output_schema={
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "maxItems": 10,
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "round": {"type": "string"},
                              "amount": {"type": "string"},
                              "announcedDate": {
                                  "type": "string",
                                  "description": "The funding announcement date",
                              },
                              "leadInvestors": {
                                  "type": "array",
                                  "items": {"type": "string"},
                              },
                          },
                          "required": ["name", "round", "amount", "announcedDate"],
                      },
                  }
              },
              "required": ["companies"],
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "AI infrastructure companies that announced Series A or B funding in the past six months",
        {
          outputSchema: {
            type: "object",
            properties: {
              companies: {
                type: "array",
                maxItems: 10,
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    round: { type: "string" },
                    amount: { type: "string" },
                    announcedDate: {
                      type: "string",
                      description: "The funding announcement date"
                    },
                    leadInvestors: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            required: ["companies"]
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "AI infrastructure companies that announced Series A or B funding in the past six months",
          "outputSchema": {
            "type": "object",
            "properties": {
              "companies": {
                "type": "array",
                "maxItems": 10,
                "items": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "round": { "type": "string" },
                    "amount": { "type": "string" },
                    "announcedDate": {
                      "type": "string",
                      "description": "The funding announcement date"
                    },
                    "leadInvestors": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            "required": ["companies"]
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

Utilisez `systemPrompt` pour les instructions telles que les préférences de sources ou les points à mettre en avant ; utilisez `outputSchema` pour la structure de la réponse. En Python, on utilise `system_prompt` et `output_schema`.

<Note>
  Gardez les schémas d&#39;objets simples : ils prennent en charge jusqu&#39;à 2 niveaux d&#39;imbrication et 10 propriétés. N&#39;ajoutez pas de
  fields de citation ou de confiance au schéma ; Exa les renvoie automatiquement dans `output.grounding`.
</Note>

## Filtrer les résultats {#filter-results}

Les filtres sont des contraintes strictes : ajoutez-en un lorsqu&#39;un résultat situé hors de son périmètre vous serait inutilisable, et exprimez plutôt vos préférences de sources plus souples directement dans le texte de la requête. L&#39;[Référence de l&#39;API](/fr/docs/reference/search) en présente la liste complète.

### Inclure des domaines ou des chemins {#include-domains-or-paths}

`includeDomains` limite les résultats aux sources de confiance. Ce paramètre accepte des domaines complets, des préfixes de chemin comme `anthropic.com/news` et des caractères génériques de sous-domaine comme `*.substack.com`.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "new model releases",
      include_domains=["openai.com", "anthropic.com/news"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("new model releases", {
    includeDomains: ["openai.com", "anthropic.com/news"],
    contents: { highlights: true }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "new model releases",
      "includeDomains": ["openai.com", "anthropic.com/news"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Indiquez le chemin dans le filtre plutôt que de le répéter sous forme d&#39;opérateur `site:` dans la requête.

### Exclure des domaines ou des chemins {#exclude-domains-or-paths}

`excludeDomains` écarte les résultats provenant de domaines ou de chemins précis. Ce paramètre prend en charge les mêmes préfixes de chemin et caractères génériques de sous-domaine que `includeDomains`. Utilisez-le lorsque ces sources rendraient un résultat inexploitable, et non pour exprimer une préférence.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "primary research on retrieval-augmented generation benchmarks",
      exclude_domains=["medium.com", "dev.to"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "primary research on retrieval-augmented generation benchmarks",
    {
      excludeDomains: ["medium.com", "dev.to"],
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "primary research on retrieval-augmented generation benchmarks",
      "excludeDomains": ["medium.com", "dev.to"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

## Fraîcheur du contenu {#content-freshness}

`contents.maxAgeHours` contrôle le degré de fraîcheur exigé du contenu extrait de chaque résultat. Ce paramètre ne filtre pas les résultats selon la date de publication.

| Valeur         | Comportement                                                                                           |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| Omis           | Utilise le contenu en cache lorsqu&#39;il est disponible et récupère la page si nécessaire             |
| Entier positif | Utilise le contenu en cache s&#39;il date de moins de ce nombre d&#39;heures ; sinon, récupère la page |
| `0`            | Récupère toujours un contenu frais                                                                     |
| `-1`           | Utilise uniquement le contenu en cache                                                                 |

La plupart des recherches devraient omettre ce field. Définissez-le lorsqu&#39;un contenu de page obsolète serait inutilisable, par exemple pour des prix, des disponibilités ou une page qui change fréquemment.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "current pricing for serverless GPU providers",
      contents={
          "highlights": True,
          "max_age_hours": 24,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("current pricing for serverless GPU providers", {
    contents: {
      highlights: true,
      maxAgeHours: 24
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "current pricing for serverless GPU providers",
      "contents": {
        "highlights": true,
        "maxAgeHours": 24
      }
    }'
  ```
</CodeGroup>

## Étapes suivantes {#next-steps}

<Columns cols={2}>
  <Card title="Bonnes pratiques" icon="sparkles" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Budgets de jetons, fraîcheur du contenu, sortie structurée et system prompts.
  </Card>

  <Card title="Référence de l'API" icon="square-terminal" href="/fr/docs/reference/search" cta="Ouvrir la référence" arrow="true">
    Tous les paramètres de requête et les fields de réponse, avec un playground interactif.
  </Card>

  <Card title="Contents" icon="file-text" href="/fr/docs/contents/quickstart" cta="Ouvrir le guide" arrow="true">
    Vous disposez déjà des URL et souhaitez obtenir du texte propre, des highlights ou des résumés.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Vous avez besoin de recherche longue durée, de constitution de listes ou d&#39;enrichment.
  </Card>
</Columns>