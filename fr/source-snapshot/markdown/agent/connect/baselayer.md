> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="baselayer">
  # Baselayer
</div>

> Vérifiez les entreprises américaines et récupérez des données KYB : dirigeants, immatriculations, scores de risque.

[Baselayer](https://baselayer.com) est une plateforme de vérification d&#39;entreprise (KYB, Know Your Business) qui
contrôle les entités américaines à partir de données officielles d&#39;immatriculation et de risque. Elle
identifie une entreprise par son nom et son adresse, puis renvoie son profil complet : dirigeants,
immatriculations par État, structure de l&#39;entité et statut de vérification.

Attachez `baselayer` à un run d&#39;[Exa Agent](/fr/docs/agent/quickstart) via
[Exa Connect](/fr/docs/agent/connect/overview) : l&#39;agent interroge alors
Baselayer en parallèle d&#39;Exa web search.

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Onboarding KYB et vérification des vendors et des clients.
* Due diligence sur les dirigeants, les immatriculations et la structure de l&#39;entité.
* Screening des entreprises pour détecter les risques et les correspondances en watchlist.

<div id="provider-id">
  ## ID du provider
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
baselayer
```

<div id="pricing">
  ## Tarification
</div>

Baselayer facture à la commande, et le tarif dépend de l&#39;opération et de ses
paramètres :

| Opération                                                                                       | Prix                                             |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Recherche d&#39;entreprise                                                                      | `$1.00 / search`                                 |
| Consultation d&#39;entreprise / dirigeants / immatriculations / recherche inversée de dirigeant | Gratuit (lecture d&#39;une recherche antérieure) |
| Recherche de privilèges                                                                         | `$2.00 / state searched`                         |
| Recherche de contentieux                                                                        | `$1.00 / category (litigation, bankruptcy)`      |
| Filtrage sur liste de surveillance                                                              | `$0.10 – $0.25 / list requested`                 |
| Classification sectorielle                                                                      | `$0.35 / call`                                   |
| Analyse de site web                                                                             | `$0.35 / call`                                   |
| Présence en ligne                                                                               | `$0.15 – $0.35 / selected analysis`              |
| Recherche d&#39;entreprise à l&#39;international                                                | `$4.00 / search`                                 |

Le choix des paramètres fait varier le prix : une recherche de privilèges sur deux
États coûte 4,00 $, un filtrage sur les six listes de surveillance prises en charge coûte 1,35 $, et un
appel de présence en ligne correspond à la somme des analyses sélectionnées (ou de l&#39;ensemble
par défaut de Baselayer — prédiction NAICS et analyse de site web — si vous n&#39;en sélectionnez aucune).

<div id="example">
  ## Exemple
</div>

Vérifiez une entreprise et récupérez les informations sur ses dirigeants et son immatriculation.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
      data_sources=[{"provider": "baselayer"}],
      output_schema={
          "type": "object",
          "required": ["business"],
          "properties": {
              "business": {
                  "type": "object",
                  "required": ["name", "verified", "incorporationState", "officers"],
                  "properties": {
                      "name": {"type": "string"},
                      "verified": {"type": "boolean"},
                      "incorporationState": {"type": "string"},
                      "officers": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "required": ["name", "title"],
                              "properties": {
                                  "name": {"type": "string"},
                                  "title": {"type": "string"},
                              },
                          },
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
    query: "Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
    dataSources: [{ provider: "baselayer" }],
    outputSchema: {
      type: "object",
      required: ["business"],
      properties: {
        business: {
          type: "object",
          required: ["name", "verified", "incorporationState", "officers"],
          properties: {
            name: { type: "string" },
            verified: { type: "boolean" },
            incorporationState: { type: "string" },
            officers: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "title"],
                properties: {
                  name: { type: "string" },
                  title: { type: "string" },
                },
              },
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
      "query": "Verify the business Stripe, Inc. in San Francisco, CA and return its officers and registration status.",
      "dataSources": [{ "provider": "baselayer" }],
      "outputSchema": {
        "type": "object",
        "required": ["business"],
        "properties": {
          "business": {
            "type": "object",
            "required": ["name", "verified", "incorporationState", "officers"],
            "properties": {
              "name": { "type": "string" },
              "verified": { "type": "boolean" },
              "incorporationState": { "type": "string" },
              "officers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["name", "title"],
                  "properties": {
                    "name": { "type": "string" },
                    "title": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## S&#39;utilise bien avec
</div>

* [Fiber.ai](/fr/docs/agent/connect/fiber) : enrichissez une entreprise vérifiée avec des données firmographiques, des effectifs et des contacts.
* [Financial Datasets](/fr/docs/agent/connect/financialdatasets) : ajoutez la couverture médiatique récente des entités publiques.
* [Similarweb](/fr/docs/agent/connect/similarweb) : comparez le trafic web et les concurrents d&#39;une entreprise vérifiée.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="L'attacher à un run" icon="rocket" href="/fr/docs/agent/connect/overview" cta="Ouvrir le quickstart" arrow="true">
    Le quickstart Exa Connect couvre `dataSources`, la tarification et le catalogue complet des partners.
  </Card>

  <Card title="Combiner les providers" icon="blend" href="/fr/docs/agent/connect/combining-providers" cta="Lire le guide" arrow="true">
    Attachez jusqu&#39;à cinq partners à un même run et formulez la query de façon à ce que chacun se déclenche.
  </Card>

  <Card title="Découvrir Exa Agent" icon="book-open" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez des runs, suivez la progression en streaming, concevez des schemas de sortie et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une key" arrow="true">
    Créez une key dans le dashboard et exécutez tel quel l&#39;exemple de cette page. Les nouveaux comptes bénéficient de credits gratuits.
  </Card>
</Columns>