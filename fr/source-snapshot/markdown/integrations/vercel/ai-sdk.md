> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# AI SDK by Vercel {#ai-sdk-by-vercel}

> Ajoutez Exa web search à vos applications AI SDK grâce au package @exalabs/ai-sdk.

Utilisez le package `@exalabs/ai-sdk` pour ajouter Exa web search aux applications développées avec l&#39;AI SDK by Vercel. Il vous suffit de fournir une API key Exa : l&#39;outil `webSearch()` se charge des requêtes de recherche de votre modèle.

## Installation {#install}

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

## Démarrage rapide {#quick-start}

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
  Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<Info>
  Définissez votre clé dans `EXA_API_KEY` avant d&#39;exécuter l&#39;exemple. Le package lit automatiquement cette variable d&#39;environnement.
</Info>

## Valeurs par défaut {#defaults}

`webSearch()` utilise ces valeurs par défaut :

* `type` : `auto`
* `numResults` : `10`
* `contents.text` : `3000` caractères par résultat
* `maxAgeHours` : la valeur de repli du cache par défaut ; définissez cette option si vous avez besoin d&#39;une fraîcheur plus stricte

## Configurer la recherche {#configure-search}

Utilisez les options ci-dessous pour ajuster la recherche et l&#39;extraction de contenu :

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

### Options de recherche {#search-options}

| Option                                    | Description                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `type`                                    | Mode de recherche : `auto`, `fast`, `instant`, `deep-lite`, `deep` ou `deep-reasoning`.                   |
| `category`                                | Catégorie de contenu : `company`, `publication`, `news`, `personal site`, `people` ou `financial report`. |
| `numResults`                              | Nombre de résultats à renvoyer.                                                                           |
| `includeDomains` / `excludeDomains`       | Inclure ou exclure des domaines précis.                                                                   |
| `startPublishedDate` / `endPublishedDate` | Filtrer les résultats par date de publication au format ISO 8601.                                         |
| `includeText` / `excludeText`             | Exiger ou exclure du texte dans les résultats.                                                            |
| `userLocation`                            | Code pays à deux lettres pour une recherche tenant compte de la localisation.                             |

### Options de contenu {#content-options}

| Option                                                 | Description                                                                                                             |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `contents.text`                                        | Renvoie le texte extrait. Prend en charge `maxCharacters` et `includeHtmlTags`.                                         |
| `contents.summary`                                     | Renvoie un résumé généré par IA. Prend en charge une `query`.                                                           |
| `contents.maxAgeHours`                                 | N&#39;utilise le contenu en cache que s&#39;il ne dépasse pas l&#39;ancienneté spécifiée ; sinon, recourt au livecrawl. |
| `contents.livecrawlTimeout`                            | Définit le délai d&#39;expiration du livecrawl.                                                                         |
| `contents.subpages` / `contents.subpageTarget`         | Explore les sous-pages et cible éventuellement une sous-page.                                                           |
| `contents.extras.links` / `contents.extras.imageLinks` | Renvoie les liens ou les liens d&#39;images des résultats.                                                              |

## Prise en charge de TypeScript {#typescript-support}

Le package inclut des types TypeScript :

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

## Pages associées {#related-pages}

<Columns cols={2}>
  <Card title="Utiliser Vercel AI Gateway" icon="cloud" href="/fr/docs/integrations/vercel/ai-gateway" cta="Ouvrir le guide" arrow="true">
    Utilisez Exa web search sans API key Exa grâce à l&#39;AI Gateway de Vercel.
  </Card>

  <Card title="Découvrir le package AI SDK" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="Voir la source" arrow="true">
    Consultez le code source et les détails du package sur GitHub.
  </Card>
</Columns>

Vous pouvez également retrouver le package sur [npm](https://www.npmjs.com/package/@exalabs/ai-sdk) et consulter le [guide de recherche web de l&#39;AI SDK de Vercel](https://ai-sdk.dev/cookbook/node/web-search-agent#exa).