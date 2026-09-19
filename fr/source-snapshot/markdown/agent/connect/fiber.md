> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="fiberai">
  # Fiber.ai
</div>

> Interrogez la base de données B2B de Fiber.ai pour trouver des entreprises, des personnes et des profils LinkedIn.

[Fiber.ai](https://fiber.ai) est une plateforme de données B2B qui propose des données à jour sur plus de 40 M
d&#39;entreprises, 850 M de personnes et 30 M d&#39;offres d&#39;emploi. Recherchez des données en temps réel sur les entreprises, les personnes et les
emplois, et enrichissez les fiches incomplètes avec des adresses e-mail professionnelles, des adresses e-mail personnelles et
des numéros de téléphone.

Attachez `fiber` à un run d&#39;[Exa Agent](/fr/docs/agent/quickstart) via
[Exa Connect](/fr/docs/agent/connect/overview) : l&#39;agent interroge alors
Fiber.ai en parallèle d&#39;Exa web search.

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Nettoyer un CRM en remontant d&#39;un email professionnel ou personnel jusqu&#39;à une
  personne, ou en enrichissant une fiche entreprise/personne incomplète.
* Suivre les signaux LinkedIn en temps réel : changements de poste, promotions,
  nouveaux emplois, évolutions d&#39;effectifs et levées de fonds.
* Trouver des publications pertinentes sur LinkedIn, X, Instagram, TikTok, Reddit
  et YouTube, en extraire les commentaires et réactions, puis enrichir les
  coordonnées de leurs auteurs.
* Effectuer des recherches parmi plus de 40 M d&#39;entreprises et 850 M de personnes,
  et enrichir les prospects avec leur email professionnel, leur email personnel et
  leurs numéros de téléphone.

<div id="provider-id">
  ## ID du provider
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
fiber
```

<div id="pricing">
  ## Pricing
</div>

Fiber.ai facture en credits au tarif de `$0.02 / credit`, et chaque call est facturé selon les credits que Fiber déclare pour celui-ci :

| Opération                                               | Credits                        |
| ------------------------------------------------------- | ------------------------------ |
| Search                                                  | 2 + 1 par résultat renvoyé     |
| Recherche d&#39;entreprise                              | ~2 par candidat renvoyé        |
| Recherche de personne / recherche inversée d&#39;e-mail | 2                              |
| Révélation de contact                                   | 2 (work email) – 5 (téléphone) |

Les calls qui ne renvoient aucune correspondance (ou dont Fiber rembourse les frais) sont gratuits. Les choix de parameters influent sur le prix : le `numResults` d&#39;une recherche d&#39;entreprise détermine le nombre de candidats que vous payez, et le nombre de résultats d&#39;une search représente l&#39;essentiel de son cost.

<div id="example">
  ## Exemple
</div>

Constituez une liste de prospection B2B de fintechs en série A basées à New York et comptant de 50 à 200 employés.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
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
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
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
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## À combiner avec
</div>

* [Similarweb](/fr/docs/agent/connect/similarweb) : évaluez la présence web d&#39;un prospect et de ses concurrents.
* [Baselayer](/fr/docs/agent/connect/baselayer) : vérifiez les dirigeants et les immatriculations des entreprises américaines présélectionnées.
* [Particle](/fr/docs/agent/connect/particle) : découvrez ce que les podcasts disent d&#39;une entreprise ou d&#39;un dirigeant.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="L'attacher à un run" icon="rocket" href="/fr/docs/agent/connect/overview" cta="Ouvrir le quickstart" arrow="true">
    Le quickstart Exa Connect couvre `dataSources`, la tarification et le catalogue complet des partners.
  </Card>

  <Card title="Combiner des providers" icon="blend" href="/fr/docs/agent/connect/combining-providers" cta="Lire le guide" arrow="true">
    Attachez jusqu&#39;à cinq partners à un même run et formulez la query de façon à ce que chacun soit sollicité.
  </Card>

  <Card title="Découvrir Exa Agent" icon="book-open" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez des runs, suivez la progression en streaming, concevez des schemas de sortie et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une key" arrow="true">
    Créez une key dans le dashboard et exécutez l&#39;exemple de cette page tel quel. Les nouveaux comptes bénéficient de credits gratuits.
  </Card>
</Columns>