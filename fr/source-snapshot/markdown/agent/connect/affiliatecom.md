> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="affiliatecom">
  # Affiliate.com
</div>

> Recherchez dans les catalogues de produits des marchands et des réseaux d&#39;affiliation.

[Affiliate.com](https://affiliate.com) regroupe les catalogues de produits des
marchands et des réseaux d&#39;affiliation dans un index unique interrogeable, avec
de la tarification en temps réel, les marques et des liens directs vers les marchands.

Attachez `affiliate` à un run [Exa Agent](/fr/docs/agent/quickstart) via
[Exa Connect](/fr/docs/agent/connect/overview) : l&#39;agent interroge alors
Affiliate.com en parallèle d&#39;Exa web search.

<div id="use-it-for">
  ## Cas d&#39;usage
</div>

* Découverte de produits et comparaison des prix entre marchands.
* Alimenter des assistants d&#39;achat et des contenus de guides d&#39;achat.
* Faire apparaître des liens d&#39;affiliation aux côtés des résultats de recherche.

<div id="provider-id">
  ## ID du fournisseur
</div>

Utilisez cette valeur dans `dataSources` :

```text theme={null}
affiliate
```

<div id="example">
  ## Exemple
</div>

Trouver des casques sans fil à réduction de bruit à moins de $300 et comparer la tarification.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      data_sources=[{"provider": "affiliate"}],
      output_schema={
          "type": "object",
          "required": ["products"],
          "properties": {
              "products": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "brand", "price", "merchant"],
                      "properties": {
                          "name": {"type": "string"},
                          "brand": {"type": "string"},
                          "price": {"type": "string", "description": "price with currency"},
                          "merchant": {"type": "string"},
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
    query: "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
    dataSources: [{ provider: "affiliate" }],
    outputSchema: {
      type: "object",
      required: ["products"],
      properties: {
        products: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "brand", "price", "merchant"],
            properties: {
              name: { type: "string" },
              brand: { type: "string" },
              price: { type: "string", description: "price with currency" },
              merchant: { type: "string" },
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
      "query": "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      "dataSources": [{ "provider": "affiliate" }],
      "outputSchema": {
        "type": "object",
        "required": ["products"],
        "properties": {
          "products": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "brand", "price", "merchant"],
              "properties": {
                "name": { "type": "string" },
                "brand": { "type": "string" },
                "price": { "type": "string", "description": "price with currency" },
                "merchant": { "type": "string" }
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

* [Similarweb](/fr/docs/agent/connect/similarweb) : évaluez l&#39;audience d&#39;un marchand avant de le recommander.
* [Fiber.ai](/fr/docs/agent/connect/fiber) : recherchez des informations sur l&#39;entreprise derrière un marchand ou une marque.

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