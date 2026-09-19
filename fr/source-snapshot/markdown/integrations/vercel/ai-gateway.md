> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="vercel-ai-gateway">
  # Vercel AI Gateway
</div>

> Utilisez Exa web search via Vercel AI Gateway avec l&#39;AI SDK.

Utilisez Exa web search via [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) avec `gateway.tools.exaSearch()` du package `ai`. Aucune API key Exa n&#39;est nécessaire : Vercel facture ces requêtes via AI Gateway. Consultez la [documentation de Vercel sur la recherche web](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) pour la référence complète.

<div id="install">
  ## Installation
</div>

Installez AI SDK 5 ou une version ultérieure :

```bash install.sh theme={null}
npm install ai
```

<div id="authentication">
  ## Authentification
</div>

<Info>
  AI Gateway nécessite une API key ou un jeton OIDC. Créez une `AI_GATEWAY_API_KEY` dans le dashboard Vercel, sous **AI Gateway &gt; API Keys**, puis ajoutez-la à votre environnement.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

Lorsque vous déployez votre application sur Vercel, vous pouvez à la place utiliser le jeton `VERCEL_OIDC_TOKEN`, disponible automatiquement. Consultez la [documentation de Vercel sur l&#39;authentification et le BYOK](https://vercel.com/docs/ai-gateway/authentication-and-byok).

<div id="quick-start">
  ## Démarrage rapide
</div>

Vous pouvez utiliser Exa search avec n&#39;importe quel modèle pris en charge :

```typescript quickstart.ts theme={null}
import { gateway, generateText, stepCountIs } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
  stopWhen: stepCountIs(3),
});

console.log(text);
```

<div id="streaming">
  ## Streaming
</div>

Utilisez `streamText` pour traiter le texte généré et les événements de l&#39;outil de recherche au fur et à mesure qu&#39;ils arrivent :

```typescript stream.ts theme={null}
import { gateway, streamText } from 'ai';

const result = streamText({
  model: 'openai/gpt-5.6-sol',
  prompt: 'What are the latest developments in AI this week?',
  tools: {
    exa_search: gateway.tools.exaSearch(),
  },
});

for await (const part of result.fullStream) {
  if (part.type === 'text-delta') {
    process.stdout.write(part.text);
  } else if (part.type === 'tool-call') {
    console.log('Tool call:', part.toolName);
  } else if (part.type === 'tool-result') {
    console.log('Search results received');
  }
}
```

Dans un route handler Next.js, renvoyez le flux au client avec `return result.toUIMessageStreamResponse()`.

<div id="configuration">
  ## Configuration
</div>

Passez des options à `gateway.tools.exaSearch()` pour affiner votre recherche :

```typescript configuration.ts theme={null}
tools: {
  exa_search: gateway.tools.exaSearch({
    type: 'fast',
    numResults: 5,
    category: 'news',
    includeDomains: ['reuters.com', 'bbc.com', 'nytimes.com'],
    contents: {
      highlights: true,
      maxAgeHours: 24,
    },
  }),
},
```

Les options disponibles sont les suivantes :

| Option                                                 | Description                                                                    |
| ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `type`                                                 | Search mode : `auto` (valeur par défaut), `fast` ou `instant`.                 |
| `numResults`                                           | Nombre de résultats à renvoyer, de 1 à 100. La valeur par défaut est 10.       |
| `category`                                             | Catégorie de contenu.                                                          |
| `includeDomains` / `excludeDomains`                    | Inclure ou exclure des domaines spécifiques.                                   |
| `startPublishedDate` / `endPublishedDate`              | Filtrer les résultats par date de publication.                                 |
| `userLocation`                                         | Code pays ISO à deux lettres pour une search tenant compte de la localisation. |
| `contents.text`                                        | Renvoyer le texte extrait de la page.                                          |
| `contents.highlights`                                  | Renvoyer les highlights pertinents de la page.                                 |
| `contents.maxAgeHours`                                 | Définir l&#39;ancienneté maximale du contenu mis en cache.                     |
| `contents.livecrawlTimeout`                            | Définir le délai d&#39;expiration du livecrawl.                                |
| `contents.subpages` / `contents.subpageTarget`         | Explorer les sous-pages et, éventuellement, cibler une sous-page.              |
| `contents.extras.links` / `contents.extras.imageLinks` | Renvoyer les liens ou les liens d&#39;images issus des résultats.              |

Consultez la [reference Exa web search](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel pour la liste complète des parameters et leur comportement.

<div id="vercel-eve-agents">
  ## Agents eve de Vercel
</div>

Les agents créés avec [eve](https://eve.dev) disposent de l&#39;outil intégré `web_search`, et les modèles d&#39;AI Gateway l&#39;exécutent par défaut sur Exa, sans configuration ni API key Exa. Pour définir explicitement le provider, exportez-le depuis `agent/tools/web_search.ts` :

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

Les modèles appelés via un provider direct plutôt que via AI Gateway conservent leur web search natif. Consultez la [documentation du harness](https://eve.dev/docs/concepts/default-harness#built-in-tools) d&#39;eve pour découvrir l&#39;ensemble des tools disponibles.

<div id="pricing">
  ## Tarification
</div>

<Tip>
  Exa web search est **gratuit jusqu&#39;au 31 août** sur AI Gateway et eve : vous pouvez donc l&#39;utiliser dès aujourd&#39;hui sans aucun frais.
</Tip>

Ensuite, Vercel facture les requêtes passant par AI Gateway aux tarifs indiqués dans la [documentation web search](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel.

<Note>
  Cette intégration prend actuellement en charge les search modes standard d&#39;Exa et les contrôles d&#39;extraction de contenu. Les modes de synthesis deep et les summaries générés ne sont pas encore disponibles.
</Note>

<Columns cols={2}>
  <Card title="Utiliser le SDK Exa AI" icon="code" href="/fr/docs/integrations/vercel/ai-sdk" cta="Ouvrir le guide" arrow="true">
    Appelez Exa directement avec une API key Exa via `@exalabs/ai-sdk`.
  </Card>

  <Card title="Consulter la référence web search de Vercel" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="Ouvrir la référence" arrow="true">
    Consultez la référence complète de configuration et de tarification d&#39;AI Gateway.
  </Card>
</Columns>