> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="sdk-quickstart">
  # Quickstart SDK
</div>

> Installez et utilisez les SDK Exa pour Python et JavaScript

Les SDK officiels d&#39;Exa. Effectuez des recherches sur le web, récupérez le contenu des pages et obtenez des réponses avec citations.

<Card title="Obtenez votre clé API Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le dashboard. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<div id="install">
  ## Installation
</div>

<CodeGroup>
  ```bash pip theme={null}
  pip install exa-py
  ```

  ```bash uv theme={null}
  uv add exa-py
  ```

  ```bash npm theme={null}
  npm install exa-js
  ```

  ```bash pnpm theme={null}
  pnpm add exa-js
  ```
</CodeGroup>

Le SDK Python requiert Python 3.9 ou une version ultérieure.

<div id="authentication">
  ## Authentification
</div>

Définissez votre clé API comme variable d&#39;environnement :

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

<div id="getting-started">
  ## Démarrage
</div>

Initialisez le client et lancez votre première recherche :

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "latest developments in fusion energy",
      type="auto",
      contents={"highlights": True},
  )

  for source in results.results:
      print(source.url, source.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("latest developments in fusion energy", {
    type: "auto",
    contents: {
      highlights: true,
    },
  });

  for (const source of results.results) {
    console.log(source.url, source.highlights);
  }
  ```
</CodeGroup>

<Note>
  Les deux clients lisent votre clé depuis la variable d&#39;environnement `EXA_API_KEY`. Pour la définir explicitement,
  passez-la plutôt en ligne : `Exa(api_key="your-api-key")` ou `new Exa("your-api-key")`.
</Note>

<div id="recommended-defaults">
  ## Valeurs par défaut recommandées
</div>

| Décision          | Valeur par défaut recommandée                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Point de départ   | Utilisez `search`                                                                                |
| Type de recherche | Conservez `auto`, sauf si la latence ou les besoins de synthèse imposent un autre type           |
| Contenu de page   | Commencez avec `highlights: true`                                                                |
| URL connues       | Utilisez `get_contents` / `getContents`                                                          |
| Fraîcheur         | Définissez `max_age_hours` / `maxAgeHours` uniquement si un contenu obsolète serait inutilisable |

<Warning>
  Les deux types de requêtes acceptent les mêmes options de contenu, mais à des endroits différents :

  | Méthode                        | Emplacement des options de contenu                                                |
  | ------------------------------ | --------------------------------------------------------------------------------- |
  | `search`                       | Dans `contents`, comme dans `exa.search(query, contents={"highlights": True})`    |
  | `get_contents` / `getContents` | Directement dans la requête, comme dans `exa.get_contents(urls, highlights=True)` |
</Warning>

<div id="search">
  ## Search
</div>

Search trouve les pages pertinentes et renvoie leur contenu en un seul appel.

<Tip>
  Utilisez `highlights: true` pour les réponses d&#39;IA, le RAG et les aperçus de recherche. Exa ajuste la taille des
  extraits de chaque résultat en fonction de leur pertinence ; ne définissez `max_characters` / `maxCharacters` que si votre application
  exige une limite fixe.
</Tip>

Filtres, plages de dates et nombre de résultats :

<CodeGroup>
  ```python Python theme={null}
  results = exa.search(
      "climate tech news",
      num_results=20,
      start_published_date="2024-01-01",
      include_domains=["techcrunch.com", "wired.com"],
      contents={"highlights": True}
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("interesting articles about space", {
    numResults: 10,
    includeDomains: ["nasa.gov", "space.com"],
    startPublishedDate: "2024-01-01",
    contents: {
      highlights: true,
    },
  });
  ```
</CodeGroup>

<div id="output-schema">
  ### Schéma de sortie
</div>

<CodeGroup>
  ```python Python theme={null}
  structured_results = exa.search(
      "Who is the CEO of OpenAI?",
      type="deep",
      system_prompt="Prefer official sources and avoid duplicate results",
      output_schema={
          "type": "object",
          "properties": {
              "leader": {"type": "string"},
              "title": {"type": "string"},
              "source_count": {"type": "number"}
          },
          "required": ["leader", "title"]
      },
      contents={"highlights": True}
  )

  print(structured_results.output.content if structured_results.output else None)
  ```

  ```javascript JavaScript theme={null}
  const structuredResult = await exa.search("Who is the CEO of OpenAI?", {
    type: "deep",
    systemPrompt: "Prefer official sources and avoid duplicate results",
    outputSchema: {
      type: "object",
      properties: {
        leader: { type: "string" },
        title: { type: "string" },
        sourceCount: { type: "number" },
      },
      required: ["leader", "title"],
    },
    contents: {
      highlights: true,
    },
  });

  console.log(structuredResult.output?.content);
  ```
</CodeGroup>

<Note>
  `output_schema` / `outputSchema` fonctionne avec tous les types de recherche et renvoie la valeur synthétisée
  dans `output.content`. Utilisez `system_prompt` / `systemPrompt` pour indiquer vos préférences de sources ou les aspects à privilégier.
  Le grounding est renvoyé automatiquement dans `output.grounding` : ne dupliquez donc pas les citations ni les
  scores de confiance dans votre schéma.
</Note>

Les modes deep sont recommandés lorsque l&#39;output nécessite une recherche répartie sur plusieurs searches. Utilisez `deep-lite` pour une recherche légère ou `deep` pour un search en plusieurs étapes avec une synthesis plus poussée. Consultez le [guide Search](/fr/docs/search/quickstart) pour l&#39;ensemble des options de requête.

<div id="contents">
  ## Contents
</div>

Extrayez des highlights, le full text ou des summaries à partir d&#39;URL que vous connaissez déjà. Commencez par les highlights, puis ajoutez une query pour les recentrer sur les informations dont vous avez besoin.

<CodeGroup>
  ```python Python theme={null}
  results = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and result quality"},
  )
  ```

  ```javascript JavaScript theme={null}
  const results = await exa.getContents(["https://exa.ai/blog/dynamic-highlights"], {
    highlights: {
      query: "token efficiency and result quality",
    },
  });
  ```
</CodeGroup>

Utilisez le full text lorsque vous avez besoin d&#39;un context plus large ou de la structure du document. Consultez le [guide Contents](/fr/docs/contents/quickstart) pour connaître les formats d&#39;output, les contrôles de fraîcheur et l&#39;exploration des sous-pages.

<div id="answer">
  ## Answer
</div>

Obtenez des réponses à vos questions, accompagnées de citations.

<CodeGroup>
  ```python Python theme={null}
  response = exa.answer("What caused the 2008 financial crisis?")
  print(response.answer)

  for chunk in exa.stream_answer("Explain quantum computing"):
      print(chunk, end="", flush=True)
  ```

  ```javascript JavaScript theme={null}
  const response = await exa.answer("What caused the 2008 financial crisis?");
  console.log(response.answer);

  for await (const chunk of exa.streamAnswer("Explain quantum computing")) {
    if (chunk.content) {
      process.stdout.write(chunk.content);
    }
  }
  ```
</CodeGroup>

<div id="async-and-types">
  ## Asynchrone et types
</div>

Python expose `AsyncExa` pour les opérations asynchrones, et le SDK JavaScript fournit des types TypeScript pour
chaque méthode.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import AsyncExa

  exa = AsyncExa()

  results = await exa.search(
      "machine learning startups",
      contents={"highlights": True}
  )
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";
  import type { SearchResponse, RegularSearchOptions } from "exa-js";
  ```
</CodeGroup>

<div id="resources">
  ## Ressources
</div>

Python : [code source exa-py](https://github.com/exa-labs/exa-py) et [package PyPI](https://pypi.org/project/exa-py/). JavaScript : [code source exa-js](https://github.com/exa-labs/exa-js) et [package npm](https://www.npmjs.com/package/exa-js).

<div id="continue">
  ## Poursuivre
</div>

<Columns cols={3}>
  <Card title="Guide Search" icon="search" href="/fr/docs/search/quickstart" cta="Ouvrir le guide" arrow="true">
    Revenez au guide principal de Search pour les schémas de requête, les filtres et les modes plus approfondis.
  </Card>

  <Card title="Référence Search" icon="square-terminal" href="/fr/docs/reference/search" cta="Ouvrir la référence" arrow="true">
    Consultez le schéma complet des requêtes et réponses `/search`.
  </Card>

  <Card title="Guide Contents" icon="file-text" href="/fr/docs/contents/quickstart" cta="Ouvrir le guide" arrow="true">
    Utilisez Contents lorsque vous connaissez déjà les URL et souhaitez une extraction directe.
  </Card>
</Columns>