> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="ai-sdk-by-vercel">
  # AI SDK de Vercel
</div>

> Añade Exa web search a tus aplicaciones con AI SDK mediante el paquete @exalabs/ai-sdk.

Usa el paquete `@exalabs/ai-sdk` para añadir Exa web search a las aplicaciones creadas con el AI SDK de Vercel. Solo tienes que proporcionar una API key de Exa y la herramienta `webSearch()` se encarga de las solicitudes de búsqueda de tu modelo.

<div id="install">
  ## Instalación
</div>

```bash install.sh theme={null}
npm install @exalabs/ai-sdk
```

<div id="quick-start">
  ## Inicio rápido
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

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen créditos gratuitos.
</Card>

<Info>
  Define tu key en `EXA_API_KEY` antes de ejecutar el ejemplo. El paquete lee esta variable de entorno automáticamente.
</Info>

<div id="defaults">
  ## Valores predeterminados
</div>

`webSearch()` usa estos valores predeterminados:

* `type`: `auto`
* `numResults`: `10`
* `contents.text`: `3000` caracteres por resultado
* `maxAgeHours`: el valor de reserva de caché predeterminado; establece esta opción cuando necesites una frescura más estricta

<div id="configure-search">
  ## Configurar la búsqueda
</div>

Usa las siguientes opciones para ajustar la búsqueda y la extracción de contenido:

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
  ### Opciones de búsqueda
</div>

| Opción                                    | Descripción                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `type`                                    | Modo de búsqueda: `auto`, `fast`, `instant`, `deep-lite`, `deep` o `deep-reasoning`.                      |
| `category`                                | Categoría de contenido: `company`, `publication`, `news`, `personal site`, `people` o `financial report`. |
| `numResults`                              | Número de resultados que se devolverán.                                                                   |
| `includeDomains` / `excludeDomains`       | Incluir o excluir dominios específicos.                                                                   |
| `startPublishedDate` / `endPublishedDate` | Filtrar resultados por fecha de publicación en formato ISO 8601.                                          |
| `includeText` / `excludeText`             | Exigir o excluir texto en los resultados.                                                                 |
| `userLocation`                            | Código de país de dos letras para búsquedas según la ubicación.                                           |

<div id="content-options">
  ### Opciones de contenido
</div>

| Opción                                                 | Descripción                                                                                               |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `contents.text`                                        | Devuelve el texto extraído. Admite `maxCharacters` e `includeHtmlTags`.                                   |
| `contents.summary`                                     | Devuelve un resumen generado por IA. Admite una `query`.                                                  |
| `contents.maxAgeHours`                                 | Usa el contenido en caché solo si no supera la antigüedad especificada; en caso contrario, usa livecrawl. |
| `contents.livecrawlTimeout`                            | Define el tiempo de espera del livecrawl.                                                                 |
| `contents.subpages` / `contents.subpageTarget`         | Rastrea subpáginas y, opcionalmente, apunta a una subpágina concreta.                                     |
| `contents.extras.links` / `contents.extras.imageLinks` | Devuelve los enlaces o los enlaces de imágenes de los resultados.                                         |

<div id="typescript-support">
  ## Compatibilidad con TypeScript
</div>

El paquete incluye tipos de TypeScript:

```typescript types.ts theme={null}
import { webSearch, ExaSearchConfig, ExaSearchResult } from '@exalabs/ai-sdk';

const config: ExaSearchConfig = {
  numResults: 10,
  type: 'auto',
};

const search = webSearch(config);
```

<div id="related-pages">
  ## Páginas relacionadas
</div>

<Columns cols={2}>
  <Card title="Usar Vercel AI Gateway" icon="cloud" href="/es/docs/integrations/vercel/ai-gateway" cta="Abrir guía" arrow="true">
    Usa Exa web search sin una API key de Exa a través del AI Gateway de Vercel.
  </Card>

  <Card title="Explorar el paquete del AI SDK" icon="git-branch" href="https://github.com/exa-labs/ai-sdk" cta="Ver código fuente" arrow="true">
    Consulta el código fuente y los detalles del paquete en GitHub.
  </Card>
</Columns>

También puedes encontrar el paquete en [npm](https://www.npmjs.com/package/@exalabs/ai-sdk) y leer la [guía de búsqueda web del AI SDK de Vercel](https://ai-sdk.dev/cookbook/node/web-search-agent#exa).