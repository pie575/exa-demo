> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir l&#39;ensemble des pages disponibles avant d&#39;aller plus loin.

<div id="financial-datasets">
  # Financial Datasets
</div>

> Données financières et boursières structurées pour plus de 27 000 tickers américains : cours, fondamentaux, résultats, SEC filings, actionnariat et filtrage d&#39;actions.

[Financial Datasets](https://financialdatasets.ai) fournit des données
d&#39;entreprise et de marché directement exploitables par les AI agents. Grâce à
[Exa Connect](/fr/docs/agent/connect/overview), les agents peuvent récupérer
cours en temps réel et historiques, informations sur les entreprises, financial statements et
métriques de valorisation, résultats, actionnariat des insiders et institutional ownership, SEC filings
et sections de filings, actualités d&#39;entreprise, et filtrer le marché américain selon des
criteria fondamentaux.

Attachez `financial_datasets` à un run d&#39;[Exa Agent](/fr/docs/agent/quickstart) :
l&#39;agent interroge alors Financial Datasets en parallèle de l&#39;Exa web search.

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Créer des aperçus structurés de recherche sur les entreprises.
* Analyser la performance financière, la valorisation et les tendances historiques.
* Lire les SEC filings et en extraire des sections telles que les facteurs de risque et le MD&amp;A.
* Examiner les transactions d&#39;insiders et l&#39;institutional ownership.
* Filtrer le marché américain selon des critères fondamentaux.
* Suivre l&#39;actualité des entreprises et les évolutions pertinentes.

<div id="data-available">
  ## Données disponibles
</div>

Chacun des jeux de données suivants est disponible auprès du provider `financial_datasets` ;
l&#39;Agent sélectionne celui qui convient à la tâche :

| Jeu de données                    | Ce qu&#39;il renvoie                                                                                                                      |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Détention effective               | Détenteurs effectifs de 5 % ou plus issus des Schedules 13D/13G, y compris les participations activistes et passives.                     |
| Informations sur l&#39;entreprise | Nom, secteur, industrie, place de cotation, localisation, CIK SEC, classification SIC.                                                    |
| Company news                      | Articles de presse récents pour un ticker.                                                                                                |
| Earnings                          | Chiffre d&#39;affaires et BPA trimestriels, avec variation annuelle et écarts par rapport aux attentes.                                   |
| Indicateurs financiers            | Capitalisation boursière, VE, PER, P/B, P/S, VE/EBITDA, PEG, marges, ROE/ROA/ROIC, croissance, BPA.                                       |
| Financial statements              | Compte de résultat, bilan et flux de trésorerie issus des SEC filings.                                                                    |
| Cours historiques                 | Chandeliers OHLCV sur une plage de dates, avec une granularité journalière, hebdomadaire, mensuelle ou annuelle.                          |
| Composition des fonds indiciels   | Constituants des ETF et fonds indiciels par pondération, ou fonds détenant un titre donné.                                                |
| Détention par les insiders        | Participations des insiders issues des formulaires SEC 3 et 5 (actions détenues par les officers, administrateurs et détenteurs de 10 %). |
| Transactions d&#39;insiders       | Transactions d&#39;insiders issues du formulaire SEC 4 (nom, role, type, nombre d&#39;actions, valeur).                                   |
| Institutional ownership           | Détenteurs institutionnels 13F, nombre d&#39;actions et valeur déclarée.                                                                  |
| Taux d&#39;intérêt                | Taux directeurs actuels et historiques des banques centrales (Fed, BCE, BOJ, etc.).                                                       |
| Sections de SEC filings           | Texte extrait de sections précises des 10-K/10-Q/8-K (par exemple facteurs de risque, MD&amp;A).                                          |
| SEC filings                       | Metadata des dépôts et liens EDGAR directs, avec filtrage facultatif par type de formulaire.                                              |
| Données financières segmentées    | Chiffre d&#39;affaires, résultat opérationnel et autres postes ventilés par produit, segment d&#39;activité et zone géographique.         |
| Aperçu du cours                   | Cours actuel en temps réel, variation du jour et heure du quote.                                                                          |
| Screener d&#39;actions            | Entreprises correspondant à des criteria de filtrage fondamentaux.                                                                        |

<div id="provider-id">
  ## ID du provider
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
financial_datasets
```

<div id="example">
  ## Exemple
</div>

Créez un aperçu structuré de recherche d&#39;entreprise sur NVIDIA.

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
  ## S&#39;associe bien avec
</div>

* [Particle](/fr/docs/agent/connect/particle) : comparez la couverture médiatique publiée avec les commentaires de podcasts.
* [Baselayer](/fr/docs/agent/connect/baselayer) : identifiez l&#39;entité réelle derrière un ticker.
* [Fiber.ai](/fr/docs/agent/connect/fiber) : enrichissez une société cotée avec des pairs du marché privé et des contacts de direction.

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