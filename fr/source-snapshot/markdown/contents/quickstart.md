> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="contents-api">
  # API Contents
</div>

> Extrayez du texte, des highlights et des résumés depuis n&#39;importe quelle URL.

Exa Contents renvoie le contenu épuré des pages à partir d&#39;URL, en gérant automatiquement les pages rendues en JavaScript, les PDF et les mises en page complexes.

Toutes les fonctionnalités de contents sont également disponibles dans [Exa Search](/fr/docs/search/quickstart) pour les URL renvoyées, sans frais supplémentaires jusqu&#39;à 10 résultats par search ($1/1000 pages au-delà). Pour les cas d&#39;usage de tool de web search, nous recommandons de procéder ainsi avec Search plutôt que d&#39;utiliser Contents.

<Tip>
  Pour des résultats de search destinés à alimenter le contexte d&#39;une IA, demandez `contents: { highlights: true }` sur `/search` —
  Exa ajuste la taille des excerpts de chaque résultat en fonction de sa relevance. Voir [Highlights](/fr/docs/search/highlights).
</Tip>

<div id="make-your-first-request">
  ## Envoyez votre première requête
</div>

Transmettez une ou plusieurs URL ou identifiants de documents et demandez des highlights pour les passages pertinents au regard de votre tâche. Dans les requêtes HTTP, indiquez-les dans `ids` :

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and quality results"},
  )

  print(result.results[0].highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://exa.ai/blog/dynamic-highlights"],
    {
      highlights: {
        query: "token efficiency and quality results"
      }
    }
  );

  console.log(result.results[0].highlights);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://exa.ai/blog/dynamic-highlights"],
      "highlights": {
        "query": "token efficiency and quality results"
      }
    }'
  ```
</CodeGroup>

<Accordion title="Exemple de réponse">
  ```json theme={null}
  {
    "requestId": "e492118ccdedcba5088bfc4357a8a125",
    "results": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "title": "Dynamic Highlights",
        "url": "https://exa.ai/blog/dynamic-highlights",
        "highlights": [
          "With a 12k character budget, relative to existing highlights, Dynamic Highlights achieves a 40% average token efficiency gain with a notable quality increase..."
        ]
      }
    ],
    "statuses": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "status": "success",
        "source": "cached"
      }
    ],
    "costDollars": {
      "total": 0.001
    }
  }
  ```
</Accordion>

Chaque item de `results` contient les metadata de la page ainsi que la vue du contenu demandée. Consultez `statuses` pour savoir si chaque URL a été traitée avec succès ou non.

<h2 id="dynamic-highlights">
  Formats de sortie
</h2>

<Tabs>
  <Tab title="Highlights">
    Les highlights renvoient les passages pertinents extraits de la page. Commencez par là pour les agents, le RAG et
    les recherches factuelles, car les highlights occupent moins de context que le full text.

    Définissez `highlights: true` pour les activer. Un parameter `query` supplémentaire est recommandé avec Contents afin de cibler l&#39;extraction du contenu de la page :

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/research-paper"],
          highlights={"query": "methodology and results"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/research-paper"],
        {
          highlights: {
            query: "methodology and results"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/research-paper"],
          "highlights": {
            "query": "methodology and results"
          }
        }'
      ```
    </CodeGroup>

    Consultez [Highlights](/fr/docs/search/highlights) pour les Dynamic Highlights et des conseils sur la répartition du context
    entre plusieurs pages.
  </Tab>

  <Tab title="Full text">
    Le full text renvoie le corps de la page nettoyé, au format markdown. Utilisez-le lorsque la tâche repose sur un context large,
    sur la structure du document ou sur des détails que les highlights risquent d&#39;omettre.

    Les pages complètes peuvent être volumineuses : utilisez `maxCharacters` pour fixer un limit si nécessaire :

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/technical-report"],
          text={"max_characters": 10000},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/technical-report"],
        {
          text: {
            maxCharacters: 10000
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/technical-report"],
          "text": {
            "maxCharacters": 10000
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Summary">
    Le summary déclenche un appel à un modèle de langage pour chaque page. Utilisez-le lorsque vous avez besoin d&#39;un aperçu généré ou de
    fields extraits dans un schema JSON.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/company"],
          summary={"query": "Summarize the product, customers, and pricing"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/company"],
        {
          summary: {
            query: "Summarize the product, customers, and pricing"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/company"],
          "summary": {
            "query": "Summarize the product, customers, and pricing"
          }
        }'
      ```
    </CodeGroup>

    Pour extraire des fields plutôt que du texte rédigé, passez un schema JSON dans `summary.schema`. Le summary est
    renvoyé sous forme de chaîne JSON conforme au schema ; analysez-la pour en lire les fields :

    ```json theme={null}
    {
      "ids": ["https://example.com/company"],
      "summary": {
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "title": "Company Information",
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "The company name" },
            "industry": { "type": "string", "description": "Primary industry" },
            "foundedYear": { "type": "number", "description": "Year the company was founded" }
          },
          "required": ["name"]
        }
      }
    }
    ```
  </Tab>
</Tabs>

Choisissez une seule vue de contenu par requête. Demander à la fois les highlights, le texte et le summary renvoie et facture chaque vue séparément.

<div id="content-freshness">
  ## Fraîcheur du contenu
</div>

`maxAgeHours` définit le degré de fraîcheur exigé du contenu de page extrait.

| Valeur         | Comportement                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Omis           | Utilise le contenu en cache lorsqu&#39;il est disponible et récupère la page si nécessaire           |
| Entier positif | Utilise le contenu en cache s&#39;il date de moins de ce nombre d&#39;heures, sinon récupère la page |
| `0`            | Récupère toujours un contenu à jour                                                                  |
| `-1`           | Utilise uniquement le contenu en cache                                                               |

La plupart des requêtes devraient omettre ce champ. Renseignez-le lorsqu&#39;un contenu de page obsolète serait inutilisable, par exemple pour des prix, des disponibilités ou des pages fréquemment mises à jour. Associez une valeur `maxAgeHours` basse à `livecrawlTimeout` (en millisecondes) pour limiter la durée d&#39;une récupération à chaud.

<Accordion title="Migrer depuis le paramètre livecrawl obsolète">
  Le paramètre de type chaîne `livecrawl` (`"always"`, `"preferred"`, `"fallback"`, `"never"`) est
  obsolète au profit de `maxAgeHours` :

  | Ancienne valeur de `livecrawl` | Équivalent                                                                     |
  | ------------------------------ | ------------------------------------------------------------------------------ |
  | `"always"`                     | `maxAgeHours: 0`                                                               |
  | `"never"`                      | `maxAgeHours: -1`                                                              |
  | `"fallback"`                   | Omettre `maxAgeHours`                                                          |
  | `"preferred"`                  | Aucun équivalent direct ; utilisez une valeur basse telle que `maxAgeHours: 1` |
</Accordion>

<div id="crawl-subpages">
  ## Explorer les sous-pages
</div>

Définissez `subpages` pour suivre les liens à partir de chaque URL de départ. Ajoutez `subpageTarget` lorsque vous souhaitez qu&#39;Exa privilégie certaines sections d&#39;un site :

<CodeGroup>
  ```python Python theme={null}
  result = exa.get_contents(
      ["https://docs.example.com"],
      subpages=10,
      subpage_target=["api", "reference", "guides"],
      highlights=True,
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.getContents(
    ["https://docs.example.com"],
    {
      subpages: 10,
      subpageTarget: ["api", "reference", "guides"],
      highlights: true
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://docs.example.com"],
      "subpages": 10,
      "subpageTarget": ["api", "reference", "guides"],
      "highlights": true
    }'
  ```
</CodeGroup>

<div id="images-and-favicons">
  ## Images et favicons
</div>

Définissez `extras.imageLinks` sur le nombre d&#39;URL d&#39;images souhaité pour chaque page. Les résultats incluent également
le `favicon` du site ainsi qu&#39;une URL `image` représentative, lorsqu&#39;elle est disponible. Sur `/search`, cette option
se situe dans `contents.extras.imageLinks`.

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="Référence de l'API" icon="square-terminal" href="/fr/docs/reference/get-contents" cta="Ouvrir la référence" arrow="true">
    Consultez l&#39;ensemble des paramètres de requête et des champs de réponse.
  </Card>

  <Card title="Highlights" icon="highlighter" href="/fr/docs/search/highlights" cta="Lire le guide" arrow="true">
    Comparez les highlights classiques et les Dynamic Highlights pour le contexte des agents et du RAG.
  </Card>

  <Card title="Search API" icon="search" href="/fr/docs/search/quickstart" cta="Ouvrir le guide" arrow="true">
    Trouvez les pages pertinentes avant d&#39;en extraire le contenu.
  </Card>

  <Card title="SDK" icon="code" href="/fr/docs/sdks/quickstart" cta="Voir les SDK" arrow="true">
    Utilisez Exa depuis Python ou JavaScript.
  </Card>
</Columns>