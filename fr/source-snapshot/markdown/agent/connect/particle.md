> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="particle">
  # Particle
</div>

> Recherchez des transcripts de podcasts avec attribution des intervenants et timestamps.

Podcast Intelligence de [Particle](https://particle.news) indexe plus de 100 000 émissions,
intégralement transcrites, segmentées par locuteur, avec identification et étiquetage des intervenants, et enrichies de metadata
quelques minutes après leur diffusion, rendant ainsi les conversations orales interrogeables. Chaque résultat se présente comme une
fenêtre de transcript attribuée à un intervenant, avec timestamps.

Attachez `particle` à un run [Exa Agent](/fr/docs/agent/quickstart) via
[Exa Connect](/fr/docs/agent/connect/overview) : l&#39;agent interroge alors
Particle en parallèle de l&#39;Exa web search.

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Trouver des commentaires d&#39;experts et des extraits citables.
* Veille médiatique et de marque.
* Analyse des récits et du sentiment.
* Découvrir des podcasts et suivre leur actualité.

<div id="provider-id">
  ## ID du provider
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
particle
```

<div id="example">
  ## Exemple
</div>

Découvrez ce que les animateurs de podcasts disent de la réglementation de l&#39;IA.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      data_sources=[{"provider": "particle"}],
      output_schema={
          "type": "object",
          "required": ["mentions"],
          "properties": {
              "mentions": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "episode", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "episode": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "pro-regulation, anti-regulation, or nuanced"},
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
    query: "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
    dataSources: [{ provider: "particle" }],
    outputSchema: {
      type: "object",
      required: ["mentions"],
      properties: {
        mentions: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["podcast", "episode", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              episode: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "pro-regulation, anti-regulation, or nuanced" },
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
      "query": "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      "dataSources": [{ "provider": "particle" }],
      "outputSchema": {
        "type": "object",
        "required": ["mentions"],
        "properties": {
          "mentions": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["podcast", "episode", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "episode": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "pro-regulation, anti-regulation, or nuanced" }
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

* [Financial Datasets](/fr/docs/agent/connect/financialdatasets) : recoupez les échanges des podcasts avec les actualités publiées.
* [Fiber.ai](/fr/docs/agent/connect/fiber) : attachez le contexte entreprise et contact aux personnes évoquées.

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
    Créez des runs, suivez leur progression en direct, concevez des schemas de sortie et maîtrisez l&#39;effort et le coût.
  </Card>

  <Card title="Obtenir une clé API" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Créer une clé" arrow="true">
    Créez une clé dans le dashboard et exécutez l&#39;exemple de cette page tel quel. Les nouveaux comptes bénéficient de credits gratuits.
  </Card>
</Columns>