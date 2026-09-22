> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="financial-datasets">
  # Financial Datasets
</div>

> Données financières et de marché structurées pour plus de 27 000 tickers américains : prix, fondamentaux, earnings, SEC filings, ownership et screening d&#39;actions.

[Financial Datasets](https://financialdatasets.ai) fournit des données
d&#39;entreprise et de marché directement exploitables par les agents IA. Via
[Exa Connect](/fr/docs/agent/connect/overview), les agents peuvent récupérer
des prix en temps réel et historiques, des informations sur les entreprises, des états financiers et
des métriques de valorisation, des earnings, l&#39;insider ownership et l&#39;institutional ownership, des SEC filings
et des sections de filings, des company news, et effectuer un screening du marché américain selon des critères
fondamentaux.

Attachez `financial_datasets` à un run d&#39;[Exa Agent](/fr/docs/agent/quickstart) :
l&#39;agent interrogera alors Financial Datasets en parallèle d&#39;Exa web search.

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Créer des snapshots structurés de recherche sur les entreprises.
* Analyser la performance financière, la valorisation et les tendances historiques.
* Lire les SEC filings et en extraire des sections telles que les facteurs de risque et le MD&amp;A.
* Examiner les transactions d&#39;insiders et l&#39;institutional ownership.
* Screening du marché américain selon des critères fondamentaux.
* Suivre les Company news des entreprises et les évolutions pertinentes.

<div id="data-available">
  ## Données disponibles
</div>

Chacun des jeux de données suivants est accessible via le fournisseur `financial_datasets` ; l&#39;Agent sélectionne celui qui convient à la tâche :

| Jeu de données          | Ce qu&#39;il renvoie                                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Beneficial ownership    | Détenteurs effectifs à 5 % et plus issus des Schedules 13D/13G, y compris les participations activistes et passives.                          |
| Company facts           | Nom, secteur, industrie, place de cotation, localisation, SEC CIK, classification SIC.                                                        |
| Company news            | Articles de presse récents pour un ticker.                                                                                                    |
| Earnings                | Chiffre d&#39;affaires et BPA trimestriels, avec variation en glissement annuel et surprises (dépassement/manquement).                        |
| Financial metrics       | Capitalisation boursière, VE, P/E, P/B, P/S, VE/EBITDA, PEG, marges, ROE/ROA/ROIC, croissance, BPA.                                           |
| Financial statements    | Compte de résultat, bilan et flux de trésorerie issus des SEC filings.                                                                        |
| Historical stock prices | Barres OHLCV sur une plage de dates, avec une granularité jour/semaine/mois/année.                                                            |
| Index-fund holdings     | Constituants d&#39;ETF ou de fonds indiciels par pondération, ou fonds détenant un titre donné.                                               |
| Insider ownership       | Participations d&#39;insiders issues des formulaires SEC 3 et 5 (actions détenues par les dirigeants, administrateurs et détenteurs de 10 %). |
| Insider trades          | Transactions d&#39;insiders issues du formulaire SEC 4 (nom, rôle, type, nombre d&#39;actions, valeur).                                       |
| Institutional ownership | Détenteurs institutionnels 13F, actions détenues et valeur déclarée.                                                                          |
| Interest rates          | Taux directeurs actuels et historiques des banques centrales (Fed, BCE, BOJ, etc.).                                                           |
| SEC filing items        | Texte extrait de rubriques précises des 10-K/10-Q/8-K (par exemple facteurs de risque, MD&amp;A).                                             |
| SEC filings             | Métadonnées de filings et liens EDGAR directs, filtrables par type de formulaire.                                                             |
| Segmented financials    | Chiffre d&#39;affaires, résultat opérationnel et autres postes ventilés par produit, segment d&#39;activité et zone géographique.             |
| Stock price snapshot    | Cours actuel en temps réel, variation du jour et heure de la quote.                                                                           |
| Stock screener          | Entreprises correspondant à des critères de filtrage fondamentaux.                                                                            |

<div id="provider-id">
  ## Identifiant du fournisseur
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
financial_datasets
```

<div id="example">
  ## Exemple
</div>

Créez un aperçu structuré des recherches sur l&#39;entreprise NVIDIA.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
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
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
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

* [Particle](/fr/docs/agent/connect/particle) : comparez la couverture publiée avec les commentaires de podcasts.
* [Baselayer](/fr/docs/agent/connect/baselayer) : identifiez l&#39;entité qui se cache derrière un ticker.
* [Fiber.ai](/fr/docs/agent/connect/fiber) : enrichissez une société cotée avec des pairs du marché privé et des contacts de dirigeants.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="Attachez-le à un run" icon="rocket" href="/fr/docs/agent/connect/overview" cta="Ouvrir le quickstart" arrow="true">
    Le quickstart Exa Connect couvre `dataSources`, la tarification et le catalogue complet des partners.
  </Card>

  <Card title="Combiner des providers" icon="blend" href="/fr/docs/agent/connect/combining-providers" cta="Lire le guide" arrow="true">
    Attachez jusqu&#39;à cinq partners à un même run et formulez la requête de façon à ce que chacun soit sollicité.
  </Card>

  <Card title="Découvrir Exa Agent" icon="book-open" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez des runs, suivez la progression en stream, concevez des schémas d&#39;output et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une clé" arrow="true">
    Créez une clé dans le tableau de bord et exécutez l&#39;exemple de cette page tel quel. Les nouveaux comptes bénéficient de crédits gratuits.
  </Card>
</Columns>