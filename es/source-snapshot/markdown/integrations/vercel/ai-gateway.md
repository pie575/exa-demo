> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Vercel AI Gateway {#vercel-ai-gateway}

> Usa Exa web search a través de Vercel AI Gateway con el AI SDK.

Usa Exa web search a través de [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) con `gateway.tools.exaSearch()` del paquete `ai`. No necesitas una API key de Exa: Vercel factura estas solicitudes mediante AI Gateway. Consulta la [documentación de búsqueda web](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel para ver la referencia completa.

## Instalación {#install}

Instala AI SDK 5 o posterior:

```bash install.sh theme={null}
npm install ai
```

## Autenticación {#authentication}

<Info>
  AI Gateway requiere una API key o un token OIDC. Crea una `AI_GATEWAY_API_KEY` en el panel de Vercel, en **AI Gateway &gt; API Keys**, y añádela a tu entorno.
</Info>

```bash .env theme={null}
AI_GATEWAY_API_KEY=your-api-key-here
```

Cuando despliegas tu aplicación en Vercel, puedes usar en su lugar el `VERCEL_OIDC_TOKEN`, que está disponible automáticamente. Consulta la [documentación sobre authentication y BYOK](https://vercel.com/docs/ai-gateway/authentication-and-byok) de Vercel.

## Inicio rápido {#quick-start}

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

## Streaming {#streaming}

Usa `streamText` para procesar el texto generado y los eventos de la herramienta de búsqueda a medida que llegan:

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

## Configuración {#configuration}

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

| Opción                                                 | Descripción                                                                       |
| ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `type`                                                 | Modo de búsqueda: `auto` (predeterminado), `fast` o `instant`.                    |
| `numResults`                                           | Número de resultados que se devuelven, de 1 a 100. El valor predeterminado es 10. |
| `category`                                             | Categoría de contenido.                                                           |
| `includeDomains` / `excludeDomains`                    | Incluir o excluir dominios específicos.                                           |
| `startPublishedDate` / `endPublishedDate`              | Filtrar resultados por fecha de publicación.                                      |
| `userLocation`                                         | Código de país ISO de dos letras para búsquedas según la ubicación.               |
| `contents.text`                                        | Devolver el texto extraído de la página.                                          |
| `contents.highlights`                                  | Devolver los highlights relevantes de la página.                                  |
| `contents.maxAgeHours`                                 | Establecer la antigüedad máxima del contenido en caché.                           |
| `contents.livecrawlTimeout`                            | Establecer el tiempo de espera del livecrawl.                                     |
| `contents.subpages` / `contents.subpageTarget`         | Rastrear subpáginas y, si se desea, apuntar a una subpágina concreta.             |
| `contents.extras.links` / `contents.extras.imageLinks` | Devolver enlaces o enlaces de imágenes de los resultados.                         |

Consulta la [referencia de Exa web search](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel para ver la lista completa de parámetros y su comportamiento.

## Agentes eve de Vercel {#vercel-eve-agents}

Los agentes creados con [eve](https://eve.dev) incluyen la herramienta `web_search` integrada, y los modelos de AI Gateway la ejecutan sobre Exa de forma predeterminada, sin necesidad de configuración ni de una API key de Exa. Para fijar el proveedor de manera explícita, expórtalo desde `agent/tools/web_search.ts`:

```typescript agent/tools/web_search.ts theme={null}
import { webSearch } from 'eve/tools';

export default webSearch({ provider: 'exa' });
```

Los modelos que se llaman a través de un proveedor directo en lugar de AI Gateway conservan su búsqueda web nativa. Consulta la [documentación del harness](https://eve.dev/docs/concepts/default-harness#built-in-tools) de eve para ver el conjunto completo de herramientas.

## Precios {#pricing}

<Tip>
  Exa web search es **gratis hasta el 31 de agosto** en AI Gateway y eve, así que puedes empezar a desarrollar con ella hoy mismo sin costo alguno.
</Tip>

Después de esa fecha, Vercel cobra las solicitudes realizadas a través de AI Gateway según las tarifas indicadas en la [documentación de búsqueda web](https://vercel.com/docs/ai-gateway/models-and-providers/web-search) de Vercel.

<Note>
  Por ahora, esta integración admite los modos de búsqueda estándar de Exa y los controles de extracción de contenido. Los modos de síntesis deep y los resúmenes generados aún no están disponibles.
</Note>

<Columns cols={2}>
  <Card title="Usa el AI SDK de Exa" icon="code" href="/es/docs/integrations/vercel/ai-sdk" cta="Abrir guía" arrow="true">
    Llama a Exa directamente con una API key de Exa mediante `@exalabs/ai-sdk`.
  </Card>

  <Card title="Consulta la referencia de búsqueda web de Vercel" icon="book" href="https://vercel.com/docs/ai-gateway/models-and-providers/web-search" cta="Abrir referencia" arrow="true">
    Revisa la referencia completa de configuración y precios de AI Gateway.
  </Card>
</Columns>