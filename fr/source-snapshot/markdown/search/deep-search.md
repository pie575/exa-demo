> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="deep-search">
  # Deep Search
</div>

> Exploitez la recherche itérative, le raisonnement et la synthèse fondée sur des preuves pour vos tâches de recherche complexes.

Deep Search est le mode recherche approfondie de la Search API. Il utilise le même endpoint `/search`, mais le processus de récupération peut lancer plusieurs recherches, examiner les preuves, affiner son approche et produire une synthèse fondée sur ces preuves.

Utilisez la recherche standard lorsque vous avez besoin de pages classées pour une query bien formulée. Utilisez le mode deep lorsque trouver la réponse exige un véritable travail de recherche.

<div id="how-deep-search-works">
  ## Fonctionnement de Deep Search
</div>

Deep Search ajoute une boucle de recherche avant la réponse finale :

<Steps>
  <Step title="Planifier la recherche">
    Exa part de votre `query` et peut la décliner en plusieurs recherches couvrant différents aspects
    de la requête. Vous pouvez fournir des variantes de départ avec `additionalQueries`.
  </Step>

  <Step title="Rechercher et examiner">
    Deep recherche des preuves, confronte les résultats obtenus à la requête et détermine ce qui est
    étayé ou encore manquant.
  </Step>

  <Step title="Affiner">
    Lorsque les preuves sont incomplètes ou contradictoires, Deep peut lancer une recherche plus
    ciblée au lieu de renvoyer les premières pages plausibles.
  </Step>

  <Step title="Sélectionner et synthétiser">
    Deep sélectionne les résultats utiles, puis emprunte la même voie de synthèse que les autres
    types de recherche. Lorsque vous fournissez `outputSchema`, la réponse inclut un `output.content`
    structuré ainsi que des citations au niveau des champs dans `output.grounding`.
  </Step>
</Steps>

Ce processus s&#39;avère particulièrement utile pour les listes et les sorties structurées. Chaque élément demandé peut nécessiter une recherche distincte, et Deep peut rassembler et vérifier ces résultats avant de produire la structure finale.

<div id="choose-a-deep-mode">
  ## Choisir un mode Deep
</div>

| Type             | À utiliser quand                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `deep-lite`      | Vous avez besoin d&#39;une expansion de query et d&#39;une synthèse légères                       |
| `deep`           | La tâche nécessite une search itérative, une collecte de preuves ou plusieurs items structurés |
| `deep-reasoning` | La tâche exige un raisonnement plus poussé face à des preuves complexes ou contradictoires        |

Commencez par `deep` pour les workflows de recherche. Passez à `deep-lite` lorsque la tâche est plus simple et que la latence est critique.

<Tip>
  Plutôt que `deep-reasoning`, utilisez [Exa Agent](/fr/docs/agent/quickstart) pour la recherche de longue durée, la
  constitution de listes et l&#39;enrichment multi-étapes. Agent dispose de davantage de puissance de calcul par run et renvoie des résultats
  structurés et grounded.
</Tip>

Consultez [Pricing](/fr/docs/admin/pricing#deep-search) pour connaître les cost actuels et les recommandations en matière de latence.

<div id="make-a-deep-request">
  ## Effectuer une requête Deep
</div>

Définissez `type` dans une requête Search API classique :

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "Compare how major database vendors support vector, keyword, and hybrid retrieval",
    {
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare how major database vendors support vector, keyword, and hybrid retrieval",
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Deep renvoie les résultats de recherche sélectionnés dans `results`. Ajoutez `outputSchema` si vous souhaitez également obtenir une réponse synthétisée ou un jeu de données structuré.

<div id="provide-starting-queries">
  ## Fournir des requêtes de départ
</div>

Deep détermine normalement les searches à exécuter. Utilisez `additionalQueries` lorsque vous connaissez déjà une terminologie, des angles d&#39;approche ou des sous-problèmes précis que la recherche doit couvrir :

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Compare current approaches to inference-time scaling",
      additional_queries=[
          "inference-time compute scaling benchmark",
          "test-time reasoning methods survey",
          "adaptive compute language models",
      ],
      type="deep",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Compare current approaches to inference-time scaling",
    {
      additionalQueries: [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      type: "deep",
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Compare current approaches to inference-time scaling",
      "additionalQueries": [
        "inference-time compute scaling benchmark",
        "test-time reasoning methods survey",
        "adaptive compute language models"
      ],
      "type": "deep",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

La `query` principale est toujours incluse. Vous pouvez fournir jusqu&#39;à 10 requêtes supplémentaires ; cette liste n&#39;est disponible que pour les search types Deep.

Évitez les simples reformulations destinées uniquement à augmenter le volume de searches. N&#39;ajoutez une requête que si elle ouvre une piste de recherche véritablement différente.

<div id="guide-behavior-and-output-separately">
  ## Guider le comportement et la sortie séparément
</div>

`systemPrompt` et `outputSchema` agissent sur des parties différentes de la requête :

* `systemPrompt` oriente les préférences de sources, la nouveauté, la déduplication et le comportement de recherche de Deep.
* `outputSchema` définit la forme finale de la sortie et déclenche la synthèse.

La query doit décrire ce qu&#39;il faut rechercher. Le system prompt, lui, doit décrire comment mener et présenter cette recherche.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      type="deep",
      system_prompt="Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 8,
                  "items": {
                      "type": "object",
                      "required": ["name", "round", "amount"],
                      "properties": {
                          "name": {"type": "string"},
                          "round": {"type": "string"},
                          "amount": {"type": "string"},
                      },
                  },
              }
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Find AI infrastructure companies that announced Series A or B funding in the last six months",
    {
      type: "deep",
      systemPrompt:
        "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      outputSchema: {
        type: "object",
        required: ["companies"],
        properties: {
          companies: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              required: ["name", "round", "amount"],
              properties: {
                name: { type: "string" },
                round: { type: "string" },
                amount: { type: "string" }
              }
            }
          }
        }
      }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find AI infrastructure companies that announced Series A or B funding in the last six months",
      "type": "deep",
      "systemPrompt": "Prefer company announcements and investor portfolio pages. Exclude duplicate rounds.",
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 8,
            "items": {
              "type": "object",
              "required": ["name", "round", "amount"],
              "properties": {
                "name": { "type": "string" },
                "round": { "type": "string" },
                "amount": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

Privilégiez Deep lorsqu&#39;il vous faut plus de deux items structurés ou lorsque chaque item doit satisfaire plusieurs exigences. Les search types standard empruntent le même synthèse path, mais ils n&#39;effectuent pas la même recherche itérative en amont de la synthèse.

<div id="read-the-grounded-response">
  ## Lire la réponse étayée
</div>

Les réponses structurées séparent les valeurs générées des preuves qui les étayent :

```json theme={null}
{
  "results": [
    {
      "title": "Acme AI raises $30M Series B",
      "url": "https://acme.example/news/series-b"
    }
  ],
  "output": {
    "content": {
      "companies": [
        {
          "name": "Acme AI",
          "round": "Series B",
          "amount": "$30M"
        }
      ]
    },
    "grounding": [
      {
        "field": "companies[0].amount",
        "citations": [
          {
            "title": "Acme AI raises $30M Series B",
            "url": "https://acme.example/news/series-b"
          }
        ],
        "confidence": "high"
      }
    ]
  }
}
```

Utilisez `output.content` comme résultat généré et `output.grounding` pour afficher ou vérifier les sources qui étayent chaque champ. N&#39;ajoutez pas de champs de citation ou de confiance à votre propre schéma ; Exa les renvoie automatiquement.

`numResults` détermine le nombre de pages sélectionnées renvoyées dans `results`. Ce paramètre ne définit pas le nombre de recherches que Deep peut effectuer.

<div id="stream-the-synthesis">
  ## Diffuser la synthèse en streaming
</div>

Définissez `stream: true` avec `outputSchema` pour recevoir la sortie synthétisée via des server-sent events :

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/search",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "query": "Explain the competing technical approaches to long-context retrieval",
          "type": "deep",
          "stream": True,
          "outputSchema": {
              "type": "text",
              "description": "A grounded comparison organized by approach",
          },
      },
      stream=True,
  )
  response.raise_for_status()

  for line in response.iter_lines(decode_unicode=True):
      if line:
          print(line)
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      query: "Explain the competing technical approaches to long-context retrieval",
      type: "deep",
      stream: true,
      outputSchema: {
        type: "text",
        description: "A grounded comparison organized by approach"
      }
    })
  });

  if (!response.ok || !response.body) {
    throw new Error(`Search failed: ${response.status}`);
  }

  const decoder = new TextDecoder();
  for await (const chunk of response.body) {
    process.stdout.write(decoder.decode(chunk, { stream: true }));
  }
  ```

  ```bash cURL theme={null}
  curl -N -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Explain the competing technical approaches to long-context retrieval",
      "type": "deep",
      "stream": true,
      "outputSchema": {
        "type": "text",
        "description": "A grounded comparison organized by approach"
      }
    }'
  ```
</CodeGroup>

Consommez les événements typés jusqu&#39;à `done`. L&#39;événement final contient la sortie complète et la durée de la recherche, ainsi que les informations de coût lorsqu&#39;elles sont disponibles.

<div id="when-to-stay-with-standard-search">
  ## Quand s&#39;en tenir à la Search standard
</div>

Le mode deep est superflu lorsqu&#39;une seule passe de retrieval suffit à répondre à la requête :

* Vous avez besoin de pages pertinentes, pas d&#39;une conclusion issue d&#39;une recherche approfondie.
* La query cible déjà une source précise ou un sujet restreint.
* Votre application assure elle-même le raisonnement et n&#39;a besoin que du retrieval.
* La requête s&#39;inscrit dans un parcours interactif, d&#39;autocomplétion ou vocal.

Utilisez `auto` pour l&#39;équilibre qualité/vitesse par défaut, ou `fast` et `instant` lorsque la latence doit rester maîtrisée.

<Columns cols={2}>
  <Card title="Guide de la Search API" icon="search" href="/fr/docs/search/quickstart" cta="Consulter Search" arrow="true">
    Construisez des requêtes, choisissez le contenu des résultats et appliquez des filtres.
  </Card>

  <Card title="Bonnes pratiques de Search" icon="sliders-horizontal" href="/fr/docs/search/best-practices" cta="Affiner le retrieval" arrow="true">
    Améliorez la qualité, le contexte, la latence et les intégrations avec les agents.
  </Card>

  <Card title="Référence de la Search API" icon="square-terminal" href="/fr/docs/reference/search" cta="Ouvrir la référence" arrow="true">
    Découvrez chaque paramètre de requête et chaque champ de réponse.
  </Card>

  <Card title="Tarification" icon="credit-card" href="/fr/docs/admin/pricing#deep-search" cta="Comparer les modes" arrow="true">
    Consultez les coûts et la latence actuels de Deep Search.
  </Card>
</Columns>