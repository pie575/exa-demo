> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="combining-providers">
  # Combiner des providers
</div>

> Utilisez plusieurs data partners ensemble au sein d&#39;un même run Exa Agent.

Attacher un partner à `dataSources` le met à disposition d&#39;Exa Agent en tant que tool — cela **n&#39;oblige pas** l&#39;agent à l&#39;appeler. Le déclenchement d&#39;un partner dépend de votre `query` et de votre `outputSchema` : précisez le type de résultat attendu de chaque partner, et Exa Agent ira chercher le tool correspondant au lieu de deviner à partir d&#39;une page web. Vous pouvez attacher jusqu&#39;à cinq partners par run ; Exa Agent détermine lesquels appeler à chaque étape, Exa web search restant disponible en parallèle. Il vous en faut plus de cinq pour un même run ? [Contactez-nous](mailto:sales@exa.ai) pour relever la limit.

<div id="two-partners-in-one-run">
  ## Deux partners dans un même run
</div>

Indiquez plusieurs partners ensemble et l&#39;Exa Agent s&#39;appuie sur chacun là où il excelle. Deux n&#39;est qu&#39;un exemple ici : vous pouvez attacher jusqu&#39;à cinq partners à `dataSources`, et le principe reste le même — demandez explicitement les données de chacun. Ce run de briefing investisseur combine [Financial Datasets](/fr/docs/agent/connect/financialdatasets) pour les actualités liées à un ticker et [Particle](/fr/docs/agent/connect/particle) pour les commentaires de podcasts. La query réclame les données propres à chaque partner et le schema répartit l&#39;output entre `financialNews` et `podcastChatter` : l&#39;Exa Agent appelle donc **les deux** partners au cours du même run.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and "
          "earnings news, and (2) what podcast hosts and guests have recently been saying "
          "about NVIDIA, with speaker-attributed quotes and their stance."
      ),
      data_sources=[
          {"provider": "financial_datasets"},
          {"provider": "particle"},
      ],
      output_schema={
          "type": "object",
          "required": ["ticker", "financialNews", "podcastChatter"],
          "properties": {
              "ticker": {"type": "string"},
              "financialNews": {
                  "type": "array",
                  "maxItems": 6,
                  "items": {
                      "type": "object",
                      "required": ["title", "source", "date", "theme"],
                      "properties": {
                          "title": {"type": "string"},
                          "source": {"type": "string"},
                          "date": {"type": "string"},
                          "theme": {"type": "string", "description": "earnings, guidance, analyst rating, product, or market"},
                      },
                  },
              },
              "podcastChatter": {
                  "type": "array",
                  "maxItems": 6,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "bullish, bearish, or neutral"},
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
      "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and " +
      "earnings news, and (2) what podcast hosts and guests have recently been saying " +
      "about NVIDIA, with speaker-attributed quotes and their stance.",
    dataSources: [
      { provider: "financial_datasets" },
      { provider: "particle" },
    ],
    outputSchema: {
      type: "object",
      required: ["ticker", "financialNews", "podcastChatter"],
      properties: {
        ticker: { type: "string" },
        financialNews: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            required: ["title", "source", "date", "theme"],
            properties: {
              title: { type: "string" },
              source: { type: "string" },
              date: { type: "string" },
              theme: { type: "string", description: "earnings, guidance, analyst rating, product, or market" },
            },
          },
        },
        podcastChatter: {
          type: "array",
          maxItems: 6,
          items: {
            type: "object",
            required: ["podcast", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "bullish, bearish, or neutral" },
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
      "query": "Give me an investor briefing on NVIDIA (NVDA): (1) the latest financial and earnings news, and (2) what podcast hosts and guests have recently been saying about NVIDIA, with speaker-attributed quotes and their stance.",
      "dataSources": [
        { "provider": "financial_datasets" },
        { "provider": "particle" }
      ],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "financialNews", "podcastChatter"],
        "properties": {
          "ticker": { "type": "string" },
          "financialNews": {
            "type": "array",
            "maxItems": 6,
            "items": {
              "type": "object",
              "required": ["title", "source", "date", "theme"],
              "properties": {
                "title": { "type": "string" },
                "source": { "type": "string" },
                "date": { "type": "string" },
                "theme": { "type": "string", "description": "earnings, guidance, analyst rating, product, or market" }
              }
            }
          },
          "podcastChatter": {
            "type": "array",
            "maxItems": 6,
            "items": {
              "type": "object",
              "required": ["podcast", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "bullish, bearish, or neutral" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<Tip>
  Explicitez les données attendues de chaque partner dans votre *query* — précisez le type de résultat souhaité pour chacun (ici : actualités financières par ticker et quotes de podcasts attribuées à un intervenant). Si la request est générique (« dernières actualités »), l&#39;Exa Agent a tendance à se rabattre sur la web search plutôt que sur un partner. Reprendre ces demandes distinctes dans les fields de votre `outputSchema` renforce ce comportement.
</Tip>