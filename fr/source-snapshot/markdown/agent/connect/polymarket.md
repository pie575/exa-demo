> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="polymarket">
  # Polymarket
</div>

> Obtenez les cotes des marchés prédictifs, l&#39;historique des prix, les carnets d&#39;ordres et les positions des traders.

[Polymarket](https://polymarket.com) est une plateforme de marchés prédictifs où
les prix du marché reflètent la probabilité implicite attribuée par la foule à des
événements réels. [Exa Connect](/fr/docs/agent/connect/overview) offre
un accès en lecture seule aux données publiques des marchés Polymarket.

Attachez `polymarket` à un run [Exa Agent](/fr/docs/agent/quickstart) : l&#39;agent
interroge alors Polymarket en parallèle d&#39;Exa web search.

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Trouver des marchés prédictifs et les market-implied odds actuelles pour un sujet donné.
* Comparer l&#39;évolution de la probabilité implicite d&#39;un résultat au fil du temps.
* Examiner la liquidité d&#39;un marché, la profondeur du carnet d&#39;ordres et les principaux détenteurs de positions.
* Consulter les positions actuelles d&#39;un trader et son activité on-chain récente.

<div id="provider-id">
  ## ID du provider
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
polymarket
```

<div id="pricing">
  ## Pricing
</div>

Les API de lecture de Polymarket sont gratuites et ne nécessitent aucune authentification : les tool calls Polymarket ne coûtent donc rien, vous ne payez que le
[tarif standard d&#39;un Agent run](/fr/docs/agent/quickstart#pricing).

<div id="data-available">
  ## Données disponibles
</div>

| Données               | Description                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Marchés et événements | Marchés prédictifs et événements en cours, avec les prix en probabilité implicite, le volume et la liquidité.                           |
| Historique des prix   | Évolution de la probabilité implicite d&#39;un résultat au fil du temps.                                                                |
| Carnets d&#39;ordres  | Profondeur achat/vente et spread en temps réel pour un résultat de marché.                                                              |
| Détenteurs et traders | Principaux détenteurs de positions sur un marché, ainsi que les positions actuelles et l&#39;activité on-chain récente d&#39;un trader. |

<div id="example">
  ## Exemple
</div>

Obtenez les market-implied odds d&#39;une baisse des taux de la Fed et leur évolution au cours du mois écoulé.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "What are the current market-implied odds of a Fed rate cut at the "
          "next FOMC meeting, and how have they moved over the past month?"
      ),
      data_sources=[{"provider": "polymarket"}],
      output_schema={
          "type": "object",
          "required": ["market", "currentProbability", "trend"],
          "properties": {
              "market": {"type": "string", "description": "the market question"},
              "currentProbability": {"type": "number", "description": "between 0 and 1"},
              "trend": {"type": "string", "description": "how the implied probability moved over the past month"},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
    dataSources: [{ provider: "polymarket" }],
    outputSchema: {
      type: "object",
      required: ["market", "currentProbability", "trend"],
      properties: {
        market: { type: "string", description: "the market question" },
        currentProbability: { type: "number", description: "between 0 and 1" },
        trend: { type: "string", description: "how the implied probability moved over the past month" },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
      "dataSources": [{ "provider": "polymarket" }],
      "outputSchema": {
        "type": "object",
        "required": ["market", "currentProbability", "trend"],
        "properties": {
          "market": { "type": "string", "description": "the market question" },
          "currentProbability": { "type": "number", "description": "between 0 and 1" },
          "trend": { "type": "string", "description": "how the implied probability moved over the past month" }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## S&#39;utilise bien avec
</div>

* [Exa web search](/fr/docs/search/quickstart) : ajoutez des articles de presse et du contexte de fond aux cotes de marché.
* [Particle](/fr/docs/agent/connect/particle) : récupérez la couverture médiatique à l&#39;origine d&#39;une variation des cotes.
* [Financial Datasets](/fr/docs/agent/connect/financialdatasets) : reliez les market-implied odds aux prix, aux fondamentaux et aux données macroéconomiques.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="L'attacher à un run" icon="rocket" href="/fr/docs/agent/connect/overview" cta="Ouvrir le quickstart" arrow="true">
    Le quickstart Exa Connect couvre `dataSources`, la tarification et l&#39;ensemble du catalogue de partners.
  </Card>

  <Card title="Combiner des providers" icon="blend" href="/fr/docs/agent/connect/combining-providers" cta="Lire le guide" arrow="true">
    Attachez jusqu&#39;à cinq partners à un même run et formulez la query de façon à ce que chacun soit déclenché.
  </Card>

  <Card title="Découvrir Exa Agent" icon="book-open" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez des runs, suivez leur progression en streaming, concevez des schemas de sortie et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une key" arrow="true">
    Créez une key dans le dashboard et exécutez l&#39;exemple de cette page tel quel. Les nouveaux comptes bénéficient de credits gratuits.
  </Card>
</Columns>