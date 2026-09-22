> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Contents API {#contents-api}

> Extrayez du texte, des highlights et des résumés depuis n&#39;importe quelle URL.

Exa Contents renvoie le contenu épuré des pages à partir de leurs URL, en gérant automatiquement les pages rendues en JavaScript, les PDF et les mises en page complexes.

Toutes les fonctionnalités de contenu sont également disponibles dans [Exa Search](/fr/docs/search/quickstart) pour les URL renvoyées, sans frais supplémentaires jusqu&#39;à 10 résultats par recherche ($1/1000 pages au-delà). Nous recommandons d&#39;utiliser Search de cette manière plutôt que Contents pour les cas d&#39;usage d&#39;outils de recherche web.

<Tip>
  Pour des résultats de recherche destinés à alimenter le context d&#39;une IA, demandez `contents: { highlights: true }` sur `/search` —
  Exa ajuste la taille des extraits de chaque résultat à sa relevance. Voir [Highlights](/fr/docs/search/highlights).
</Tip>

## Effectuez votre première request {#make-your-first-request}

Transmettez une ou plusieurs URL ou identifiants de documents et demandez des highlights sur les parties pertinentes pour votre tâche. Dans les requests HTTP, indiquez-les dans `ids` :

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

Chaque élément de `results` contient les métadonnées de la page ainsi que la vue de contenu demandée. Consultez `statuses` pour connaître la réussite ou l&#39;échec de chaque URL.

<h2 id="dynamic-highlights">
  Formats de sortie
</h2>

<Tabs>
  <Tab title="Highlights">
    Les highlights renvoient des passages pertinents extraits tels quels de la page. Commencez par là pour les agents, le RAG et
    les recherches factuelles, car les highlights consomment moins de context que le texte intégral.

    Définissez `highlights: true` pour activer les highlights. Il est recommandé d&#39;ajouter un paramètre `query` lorsque vous utilisez Contents, afin de cibler l&#39;extraction de contenu dans la page :

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

  <Tab title="Texte intégral">
    Le texte intégral renvoie le corps de la page nettoyé, au format markdown. Utilisez-le lorsque la tâche dépend d&#39;un context large,
    de la structure du document ou de détails que les highlights risquent d&#39;omettre.

    Les pages complètes peuvent être volumineuses : utilisez `maxCharacters` si vous avez besoin d&#39;une limite :

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

  <Tab title="Résumé">
    Le résumé déclenche un appel à un modèle de langage pour chaque page. Utilisez-le lorsque vous avez besoin d&#39;une vue d&#39;ensemble générée ou de
    fields extraits selon un schéma JSON.

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

    Pour extraire des fields plutôt que du texte rédigé, transmettez un schéma JSON dans `summary.schema`. Le résumé est
    renvoyé sous forme de chaîne JSON conforme au schéma ; analysez-la pour lire les fields :

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

Choisissez une seule vue de contenu par requête. Si vous demandez à la fois les highlights, le texte et le résumé, chaque vue est renvoyée et facturée séparément.

## Fraîcheur du contenu {#content-freshness}

`maxAgeHours` contrôle le degré de fraîcheur exigé pour le contenu extrait de la page.

| Valeur         | Comportement                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Omis           | Utilise le contenu en cache lorsqu&#39;il est disponible et récupère la page si nécessaire              |
| Entier positif | Utilise le contenu en cache s&#39;il est plus récent que ce nombre d&#39;heures, sinon récupère la page |
| `0`            | Récupère toujours un contenu à jour                                                                     |
| `-1`           | Utilise uniquement le contenu en cache                                                                  |

La plupart des requests devraient omettre ce field. Définissez-le lorsqu&#39;un contenu de page obsolète serait inexploitable, par exemple pour des prix, des disponibilités ou des pages fréquemment mises à jour. Associez une valeur `maxAgeHours` basse à `livecrawlTimeout` (en millisecondes) pour limiter la durée d&#39;une récupération à jour.

<Accordion title="Migrer depuis le paramètre livecrawl déprécié">
  Le paramètre de type chaîne `livecrawl` (`"always"`, `"preferred"`, `"fallback"`, `"never"`) est
  déprécié au profit de `maxAgeHours` :

  | Ancienne valeur `livecrawl` | Équivalent                                                                     |
  | --------------------------- | ------------------------------------------------------------------------------ |
  | `"always"`                  | `maxAgeHours: 0`                                                               |
  | `"never"`                   | `maxAgeHours: -1`                                                              |
  | `"fallback"`                | Omettre `maxAgeHours`                                                          |
  | `"preferred"`               | Aucun équivalent direct ; utilisez une valeur basse telle que `maxAgeHours: 1` |
</Accordion>

## Explorer les sous-pages {#crawl-subpages}

Définissez `subpages` pour suivre les liens depuis chaque URL de départ. Ajoutez `subpageTarget` lorsque vous souhaitez qu&#39;Exa privilégie certaines sections du site :

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

## Images et favicons {#images-and-favicons}

Définissez `extras.imageLinks` sur le nombre d&#39;URL d&#39;images souhaité pour chaque page. Les résultats incluent également
le `favicon` du site et une URL d&#39;`image` représentative lorsqu&#39;elle est disponible. Sur `/search`, cette option
se trouve dans `contents.extras.imageLinks`.

## Étapes suivantes {#next-steps}

<Columns cols={2}>
  <Card title="API reference" icon="square-terminal" href="/fr/docs/reference/get-contents" cta="Ouvrir la reference" arrow="true">
    Consultez chaque paramètre de requête et chaque field de réponse.
  </Card>

  <Card title="Highlights" icon="highlighter" href="/fr/docs/search/highlights" cta="Lire le guide" arrow="true">
    Comparez les highlights classiques et les Dynamic Highlights pour le context des agents et du RAG.
  </Card>

  <Card title="Search API" icon="search" href="/fr/docs/search/quickstart" cta="Ouvrir le guide" arrow="true">
    Trouvez les pages pertinentes avant d&#39;en extraire le contenu.
  </Card>

  <Card title="SDKs" icon="code" href="/fr/docs/sdks/quickstart" cta="Voir les SDKs" arrow="true">
    Utilisez Exa depuis Python ou JavaScript.
  </Card>
</Columns>