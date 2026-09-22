> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="similarweb">
  # Similarweb
</div>

> Obtenez des estimations de trafic des sites web, des classements mondiaux et découvrez les concurrents.

[Similarweb](https://www.similarweb.com) est une source de référence en matière
d&#39;intelligence de marché numérique. La plateforme modélise le trafic et l&#39;engagement de millions de sites web et
d&#39;applications : visites estimées, sources de trafic, données démographiques d&#39;audience et
paysage concurrentiel autour de n&#39;importe quel domaine.

Attachez `similarweb` à un run [Exa Agent](/fr/docs/agent/quickstart) via
[Exa Connect](/fr/docs/agent/connect/overview) : l&#39;agent interroge alors
Similarweb en parallèle d&#39;Exa web search.

<div id="use-it-for">
  ## À utiliser pour
</div>

* Comparer le trafic web et l&#39;engagement d&#39;une entreprise à ceux de ses concurrents directs.
* Cartographier les concurrents d&#39;un domaine et les sites dont l&#39;audience se recoupe.
* Évaluer la taille des marchés et filtrer les entreprises selon leur empreinte numérique.
* Enrichir la recherche sur les entreprises et les catégories avec des données comportementales réelles.

<div id="provider-id">
  ## Provider ID
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
similarweb
```

<div id="pricing">
  ## Tarification
</div>

Similarweb facture en crédits de données à `$0.30 / credit`, et chaque appel est facturé
selon les crédits que Similarweb déclare pour celui-ci. Les crédits varient selon les données renvoyées —
environ un crédit par point de donnée (métrique × ligne × mois) — le prix d&#39;un appel
est donc déterminé par ses paramètres :

| Outil                                    | Crédits                                                                       |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| Trafic et classement                     | jusqu&#39;à 7 par mois demandé (1 à 2 mois)                                   |
| Sites similaires                         | 3 par site renvoyé (1 à 5 sites)                                              |
| Sources de trafic                        | 10                                                                            |
| Principaux référents                     | 3 par référent renvoyé (1 à 5)                                                |
| Principaux pays                          | 3 par pays renvoyé (1 à 5)                                                    |
| Principales pages                        | 2 par page renvoyée (1 à 7)                                                   |
| Principaux mots-clés                     | 1 à 10 (environ 1 pour 100 points de données de mots-clés ; 50 mots-clés ≈ 7) |
| Aperçu des mots-clés                     | 1 à 2                                                                         |
| Données démographiques de l&#39;audience | 8                                                                             |
| Recoupement d&#39;audience               | 2 par combinaison de domaines (2 à 3 domaines : 6 à 14)                       |
| Technologies                             | 10                                                                            |
| Principaux sites par catégorie           | 1 par site renvoyé (1 à 10)                                                   |

Les appels qui ne renvoient aucune donnée (domaine inconnu ou à faible trafic, mot-clé sans
volume de recherche) sont gratuits. `numResults` et `months` déterminent le nombre de points de données qui vous
sont facturés : limitez-les au strict nécessaire pour la tâche.

<div id="example">
  ## Exemple
</div>

Trouvez 10 entreprises SaaS B2B à forte croissance ainsi que leur trafic web estimé.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      data_sources=[{"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "monthlyVisits"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
    dataSources: [{ provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "monthlyVisits"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              monthlyVisits: { type: "number", description: "from Similarweb" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      "dataSources": [{ "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "monthlyVisits"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "monthlyVisits": { "type": "number", "description": "from Similarweb" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## S&#39;associe bien avec
</div>

* [Fiber.ai](/fr/docs/agent/connect/fiber) : transformez les concurrents identifiés en records d&#39;entreprises enrichis.
* [Affiliate.com](/fr/docs/agent/connect/affiliatecom) : évaluez la portée d&#39;un marchand avant de recommander ses produits.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="L'attacher à un run" icon="rocket" href="/fr/docs/agent/connect/overview" cta="Ouvrir le quickstart" arrow="true">
    Le quickstart Exa Connect couvre `dataSources`, la tarification et le catalogue complet des partners.
  </Card>

  <Card title="Combiner des providers" icon="blend" href="/fr/docs/agent/connect/combining-providers" cta="Lire le guide" arrow="true">
    Attachez jusqu&#39;à cinq partners à un même run et formulez la requête de façon à ce que chacun soit sollicité.
  </Card>

  <Card title="Découvrir Exa Agent" icon="book-open" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez des runs, suivez la progression en stream, concevez des schémas d&#39;output et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une clé" arrow="true">
    Créez une clé dans le tableau de bord et exécutez l&#39;exemple de cette page tel quel. Les nouveaux comptes démarrent avec des crédits gratuits.
  </Card>
</Columns>