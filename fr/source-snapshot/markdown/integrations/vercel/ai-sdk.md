> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="ai-sdk-by-vercel">
  # AI SDK by Vercel
</div>

> Ajoutez Exa web search à vos applications AI SDK grâce au package @exalabs/ai-sdk.

Utilisez le package `@exalabs/ai-sdk` pour ajouter Exa web search aux applications développées avec l&#39;AI SDK by Vercel. Il vous suffit de fournir une API key Exa : l&#39;outil `webSearch()` se charge des requêtes de recherche pour votre modèle.

<div id="install">
  ## Installation
</div>

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

<div id="quick-start">
  ## Démarrage rapide
</div>

```typescript quickstart.ts theme={null}
import { generateText, stepCountIs } from 'ai';
import { webSearch } from '@exalabs/ai-sdk';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Tell me the latest developments in AI',
  system: 'Only use web search once per turn. Answer based on the information you have.',
  tools: {
    webSearch: webSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une key depuis le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

<Info>
  Définissez votre key dans `EXA_API_KEY` avant d&#39;exécuter l&#39;exemple. Le package lit automatiquement cette variable d&#39;environnement.
</Info>

<div id="defaults">
  ## Valeurs par défaut
</div>

`webSearch()` utilise les valeurs par défaut suivantes :

* `type` : `auto`
* `numResults` : `10`
* `contents.text` : `3000` caractères par résultat
* `maxAgeHours` : la valeur de repli du cache par défaut ; définissez cette option si vous avez besoin d&#39;une fraîcheur plus stricte

<div id="configure-search">
  ## Configurer la recherche
</div>

Utilisez les options ci-dessous pour affiner la recherche et l&#39;extraction de contenu :

```typescript configuration.ts theme={null}
const { text } = await generateText({
  model: openai('gpt-5-nano'),
  prompt: 'Find the top AI companies in Europe founded after 2018',
  tools: {
    webSearch: webSearch({
      type: 'auto',
      numResults: 6,
      category: 'company',
      contents: {
        text: { maxCharacters: 1000 },
        maxAgeHours: 1,
        summary: true,
      },
    }),
  },
  stopWhen: stepCountIs(5),
});

console.log(text);
```

<div id="search-options">
  ### Options de recherche
</div>

| Option                                    | Description                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `type`                                    | Mode de recherche : `auto`, `fast`, `instant`, `deep-lite`, `deep` ou `deep-reasoning`.                   |
| `category`                                | Catégorie de contenu : `company`, `publication`, `news`, `personal site`, `people` ou `financial report`. |
| `numResults`                              | Nombre de résultats à renvoyer.                                                                           |
| `includeDomains` / `excludeDomains`       | Inclure ou exclure certains domaines.                                                                     |
| `startPublishedDate` / `endPublishedDate` | Filtrer les résultats par date de publication au format ISO 8601.                                         |
| `includeText` / `excludeText`             | Exiger ou exclure un texte dans les résultats.                                                            |
| `userLocation`                            | Code pays à deux lettres pour une recherche adaptée à la localisation.                                    |

<div id="content-options">
  ### Content options
</div>

| Option                                                 | Description                                                                                                           |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `contents.text`                                        | Renvoie le texte extrait. Prend en charge `maxCharacters` et `includeHtmlTags`.                                       |
| `contents.summary`                                     | Renvoie un résumé généré par IA. Prend en charge un `query`.                                                          |
| `contents.maxAgeHours`                                 | N&#39;utilise le contenu mis en cache que s&#39;il respecte l&#39;ancienneté spécifiée ; sinon, recourt au livecrawl. |
| `contents.livecrawlTimeout`                            | Définit le délai d&#39;expiration du livecrawl.                                                                       |
| `contents.subpages` / `contents.subpageTarget`         | Explore les sous-pages et cible éventuellement une sous-page.                                                         |
| `contents.extras.links` / `contents.extras.imageLinks` | Renvoie les liens ou les liens d&#39;images issus des résultats.                                                      |

<div id="typescript-support">
  ## Prise en charge de TypeScript
</div>

Le package inclut des types TypeScript :

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

<div id="related-pages">
  ## Pages associées
</div>

<Columns cols={2}>
  <Card title="Utiliser Vercel AI Gateway" icon="cloud" href="/fr/docs/integrations/vercel/ai-gateway" cta="Ouvrir le guide" arrow="true">
    Utilisez Exa web search sans API key Exa grâce à l&#39;AI Gateway de Vercel.
  </Card>

  <Card title="Découvrir le package AI SDK" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="Voir le code source" arrow="true">
    Consultez le code source et les détails du package sur GitHub.
  </Card>
</Columns>

Vous pouvez également retrouver le package sur [npm](https://www.npmjs.com/package/@exalabs/ai-sdk) et consulter le [guide de web search du SDK AI de Vercel](https://ai-sdk.dev/cookbook/node/web-search-agent#exa).