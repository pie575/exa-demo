> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="jinko">
  # Jinko
</div>

> Recherche de vols et d&#39;hôtels avec tarifs en temps réel.

[Jinko](https://gojinko.com) est une plateforme de recherche de voyages qui propose la recherche de vols et
d&#39;hôtels avec des tarifs en temps réel. Consultez les offres de vol en temps réel pour un itinéraire et
une date, comparez les chambres et les tarifs d&#39;hôtels pour une destination ou des établissements précis, et
explorez les destinations accessibles depuis vos aéroports de départ.

Attachez `jinko` à un run d&#39;[Exa Agent](/fr/docs/agent/quickstart) via
[Exa Connect](/fr/docs/agent/connect/overview) : l&#39;agent interroge alors
Jinko en parallèle de la recherche web Exa.

<div id="use-it-for">
  ## À utiliser pour
</div>

* Rechercher des offres de vols en temps réel avec les tarifs, les conditions de bagages et de modification pour un itinéraire et une date donnés.
* Trouver des hôtels avec des tarifs de chambre en temps réel pour une destination, ou réinterroger les tarifs d&#39;hôtels précis.
* Découvrir des destinations et des dates flexibles selon des plages de dates, des classes de cabine et des budgets.

<div id="provider-id">
  ## ID du provider
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
jinko
```

<div id="example">
  ## Exemple
</div>

Trouvez des destinations balnéaires accessibles depuis New York pour moins de $400 l&#39;aller-retour en mars.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find beach destinations reachable from New York for under $400 round-trip in March.",
      data_sources=[{"provider": "jinko"}],
      output_schema={
          "type": "object",
          "required": ["destinations"],
          "properties": {
              "destinations": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["city", "iataCode", "lowestFare"],
                      "properties": {
                          "city": {"type": "string"},
                          "iataCode": {"type": "string"},
                          "lowestFare": {"type": "number", "description": "round-trip fare in USD"},
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
    query: "Find beach destinations reachable from New York for under $400 round-trip in March.",
    dataSources: [{ provider: "jinko" }],
    outputSchema: {
      type: "object",
      required: ["destinations"],
      properties: {
        destinations: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["city", "iataCode", "lowestFare"],
            properties: {
              city: { type: "string" },
              iataCode: { type: "string" },
              lowestFare: { type: "number", description: "round-trip fare in USD" },
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
      "query": "Find beach destinations reachable from New York for under $400 round-trip in March.",
      "dataSources": [{ "provider": "jinko" }],
      "outputSchema": {
        "type": "object",
        "required": ["destinations"],
        "properties": {
          "destinations": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["city", "iataCode", "lowestFare"],
              "properties": {
                "city": { "type": "string" },
                "iataCode": { "type": "string" },
                "lowestFare": { "type": "number", "description": "round-trip fare in USD" }
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

* [Similarweb](/fr/docs/agent/connect/similarweb) : étudiez les sites de voyage et les plateformes de réservation associés à une destination.
* [Particle](/fr/docs/agent/connect/particle) : récupérez les articles récents et les commentaires de voyageurs sur un lieu.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="L'attacher à un run" icon="rocket" href="/fr/docs/agent/connect/overview" cta="Ouvrir le quickstart" arrow="true">
    Le quickstart Exa Connect couvre `dataSources`, la tarification et l&#39;ensemble du catalogue de partners.
  </Card>

  <Card title="Combiner des providers" icon="blend" href="/fr/docs/agent/connect/combining-providers" cta="Lire le guide" arrow="true">
    Attachez jusqu&#39;à cinq partners à un même run et formulez la query de façon à ce que chacun soit sollicité.
  </Card>

  <Card title="Découvrir Exa Agent" icon="book-open" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez des runs, suivez leur progression en streaming, concevez des schemas de sortie et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une key" arrow="true">
    Créez une key dans le dashboard et exécutez l&#39;exemple de cette page tel quel. Les nouveaux comptes bénéficient de credits gratuits.
  </Card>
</Columns>