> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="fiberai">
  # Fiber.ai
</div>

> Interrogez la base de données B2B de Fiber.ai pour trouver des entreprises, des personnes et des profils LinkedIn.

[Fiber.ai](https://fiber.ai) est une plateforme de données B2B qui propose des données à jour sur plus de 40 M
d&#39;entreprises, 850 M de personnes et 30 M d&#39;offres d&#39;emploi. Recherchez en temps réel des données sur les entreprises, les personnes et les
emplois, et enrichissez les records incomplets avec des e-mails professionnels, des e-mails personnels et
des numéros de téléphone.

Attachez `fiber` à un run d&#39;[Exa Agent](/fr/docs/agent/quickstart) via
[Exa Connect](/fr/docs/agent/connect/overview) : l&#39;agent interroge alors
Fiber.ai en parallèle d&#39;Exa web search.

<div id="use-it-for">
  ## À utiliser pour
</div>

* Nettoyer un CRM en identifiant une personne à partir d&#39;un e-mail professionnel
  ou personnel, ou en enrichissant un record entreprise/personne incomplet.
* Suivre les signaux LinkedIn en temps réel : changements de poste, promotions,
  nouveaux emplois, évolutions des effectifs et levées de fonds.
* Trouver les publications pertinentes sur LinkedIn, X, Instagram, TikTok, Reddit
  et YouTube, en récupérer les commentaires et les réactions, puis enrichir les
  coordonnées de leurs auteurs.
* Effectuer des recherches parmi plus de 40 M d&#39;entreprises et 850 M de personnes
  et enrichir les prospects avec leur e-mail professionnel, leur e-mail personnel
  et leurs numéros de téléphone.

<div id="provider-id">
  ## Identifiant du fournisseur
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
fiber
```

<div id="pricing">
  ## Tarification
</div>

Fiber.ai facture en crédits au tarif de `$0.02 / credit`, et chaque appel est facturé selon les
crédits que Fiber déclare pour celui-ci :

| Opération                                               | Crédits                                  |
| ------------------------------------------------------- | ---------------------------------------- |
| Search                                                  | 2 + 1 par résultat renvoyé               |
| Recherche d&#39;entreprise                              | ~2 par candidat renvoyé                  |
| Recherche de personne / recherche inversée d&#39;e-mail | 2                                        |
| Révélation de contact                                   | 2 (e-mail professionnel) – 5 (téléphone) |

Les appels qui ne renvoient aucune correspondance (ou dont Fiber rembourse les frais) sont gratuits. Le choix des
paramètres influe sur le prix : le `numResults` d&#39;une recherche d&#39;entreprise détermine le nombre de
candidats qui vous sont facturés, et le nombre de résultats d&#39;une recherche représente l&#39;essentiel de son coût.

<div id="example">
  ## Exemple
</div>

Constituez une liste de prospection B2B regroupant les entreprises fintech en série A situées à New York et comptant de 50 à 200 employés.

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

* [Similarweb](/fr/docs/agent/connect/similarweb) : évaluer la présence web d&#39;un prospect et de ses concurrents.
* [Baselayer](/fr/docs/agent/connect/baselayer) : vérifier les dirigeants et les immatriculations des entreprises américaines présélectionnées.
* [Particle](/fr/docs/agent/connect/particle) : découvrir ce que disent les podcasts à propos d&#39;une entreprise ou d&#39;un dirigeant.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="L'attacher à un run" icon="rocket" href="/fr/docs/agent/connect/overview" cta="Ouvrir le quickstart" arrow="true">
    Le quickstart Exa Connect présente `dataSources`, la tarification et le catalogue complet des partners.
  </Card>

  <Card title="Combiner des providers" icon="blend" href="/fr/docs/agent/connect/combining-providers" cta="Lire le guide" arrow="true">
    Attachez jusqu&#39;à cinq partners à un même run et formulez la requête de façon à ce que chacun se déclenche.
  </Card>

  <Card title="Découvrir Exa Agent" icon="book-open" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez des runs, suivez la progression en stream, concevez des schémas d&#39;output et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une clé" arrow="true">
    Créez une clé dans le tableau de bord et exécutez l&#39;exemple de cette page tel quel. Les nouveaux comptes démarrent avec des crédits gratuits.
  </Card>
</Columns>