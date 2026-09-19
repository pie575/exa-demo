> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="vercel-ai-gateway">
  # Vercel AI Gateway
</div>

> Usa la búsqueda web de Exa a través de Vercel AI Gateway con el AI SDK.

Usa la búsqueda web de Exa a través de [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) con `gateway.tools.exaSearch()` del paquete `ai`. No necesitas una API key de Exa; Vercel factura estas solicitudes mediante AI Gateway. Consulta la [documentación de búsqueda web](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel para ver la referencia completa.

<div id="install">
  ## Instalación
</div>

Instala AI SDK 5 o una versión posterior:

```bash install.sh theme={null}
npm install ai
```

<div id="authentication">
  ## Autenticación
</div>

<Info>
  AI Gateway requiere una API key o un token OIDC. Crea una `AI_GATEWAY_API_KEY` en el panel de Vercel, en **AI Gateway &gt; API Keys**, y luego añádela a tu entorno.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

Cuando despliegas tu aplicación en Vercel, puedes usar en su lugar el `VERCEL_OIDC_TOKEN`, que está disponible automáticamente. Consulta la [documentación de autenticación y BYOK](https://vercel.com/docs/ai-gateway/authentication-and-byok) de Vercel.

<div id="quick-start">
  ## Inicio rápido
</div>

Puedes usar Exa Search con cualquier modelo compatible:

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

Usa `streamText` para procesar el texto generado y los eventos de la herramienta de search a medida que llegan:

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

En un route handler de Next.js, devuelve el stream al cliente con `return result.toUIMessageStreamResponse()`.

<div id="configuration">
  ## Configuración
</div>

Pasa opciones a `gateway.tools.exaSearch()` para ajustar tu búsqueda:

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

Las opciones disponibles incluyen:

| Opción                                                 | Descripción                                                                 |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| `type`                                                 | Modo de búsqueda: `auto` (predeterminado), `fast` o `instant`.              |
| `numResults`                                           | Número de resultados a devolver, de 1 a 100. El valor predeterminado es 10. |
| `category`                                             | Categoría de contenido.                                                     |
| `includeDomains` / `excludeDomains`                    | Incluir o excluir dominios específicos.                                     |
| `startPublishedDate` / `endPublishedDate`              | Filtrar resultados por fecha de publicación.                                |
| `userLocation`                                         | Código de país ISO de dos letras para búsquedas según la ubicación.         |
| `contents.text`                                        | Devolver el texto extraído de la página.                                    |
| `contents.highlights`                                  | Devolver los highlights relevantes de la página.                            |
| `contents.maxAgeHours`                                 | Establecer la antigüedad máxima del contenido en caché.                     |
| `contents.livecrawlTimeout`                            | Establecer el tiempo de espera del livecrawl.                               |
| `contents.subpages` / `contents.subpageTarget`         | Rastrear subpáginas y, opcionalmente, apuntar a una subpágina.              |
| `contents.extras.links` / `contents.extras.imageLinks` | Devolver enlaces o enlaces de imágenes de los resultados.                   |

Consulta la [referencia de búsqueda web de Exa](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel para ver la lista completa de parámetros y su comportamiento.

<div id="vercel-eve-agents">
  ## Agentes eve de Vercel
</div>

Los agentes creados con [eve](https://eve.dev) incluyen la herramienta `web_search` integrada, y los modelos de AI Gateway la ejecutan en Exa de forma predeterminada, sin necesidad de configuración ni de una Exa API key. Para fijar el proveedor de forma explícita, expórtalo desde `agent/tools/web_search.ts`:

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

Los modelos invocados a través de un proveedor directo en lugar de AI Gateway conservan su búsqueda web nativa. Consulta la [documentación del harness](https://eve.dev/docs/concepts/default-harness#built-in-tools) de eve para ver el conjunto completo de herramientas.

<div id="pricing">
  ## Precios
</div>

<Tip>
  La búsqueda web de Exa es **gratuita hasta el 31 de agosto** en AI Gateway y eve, así que hoy mismo puedes empezar a desarrollar con ella sin costo alguno.
</Tip>

Después de esa fecha, Vercel cobra las solicitudes realizadas a través de AI Gateway según las tarifas indicadas en la [documentación de búsqueda web](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel.

<Note>
  Por ahora, esta integración admite los modos de búsqueda estándar de Exa y los controles de extracción de contenido. Los modos de síntesis profunda y los resúmenes generados todavía no están disponibles.
</Note>

<Columns cols={2}>
  <Card title="Usa el Exa AI SDK" icon="code" href="/es/docs/integrations/vercel/ai-sdk" cta="Abrir guía" arrow="true">
    Llama a Exa directamente con una Exa API key mediante `@exalabs/ai-sdk`.
  </Card>

  <Card title="Consulta la referencia de búsqueda web de Vercel" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="Abrir referencia" arrow="true">
    Revisa la referencia completa de configuración y precios de AI Gateway.
  </Card>
</Columns>