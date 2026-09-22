> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="openrouter">
  # OpenRouter
</div>

> Fundamenta cualquier modelo de OpenRouter con Exa web search mediante la herramienta de servidor openrouter:web&#95;search.

Exa es el motor de búsqueda que impulsa la búsqueda web de [OpenRouter](https://openrouter.ai). OpenRouter te ofrece una sola API para cientos de modelos y Exa les da a esos modelos acceso web en tiempo real: cualquier modelo sin búsqueda nativa se fundamenta a través de Exa de forma predeterminada, y cualquier modelo puede dirigirse a Exa de forma explícita. No hace falta una API key de Exa. OpenRouter ejecuta las búsquedas del lado del servidor y las cobra a tus créditos de OpenRouter.

<div id="use-the-web-search-server-tool">
  ## Usa la herramienta de servidor de búsqueda web
</div>

Agrega `openrouter:web_search` a tu arreglo `tools` y el modelo decidirá cuándo buscar, qué buscar y si conviene volver a buscar dentro de la misma solicitud. Las [herramientas de servidor](https://openrouter.ai/docs/guides/features/server-tools/web-search) están en beta en OpenRouter y sustituyen al plugin `web` deprecado y a las variantes de modelo `:online`; si usas alguno de los dos, consulta la [guía de migración](https://openrouter.ai/docs/guides/features/server-tools/web-search#migrating-from-the-web-search-plugin) de OpenRouter.

<CodeGroup>
  ```javascript JavaScript theme={null}
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer <OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.2",
      messages: [
        { role: "user", content: "What were the major AI announcements this week?" },
      ],
      tools: [{ type: "openrouter:web_search" }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      "https://openrouter.ai/api/v1/chat/completions",
      headers={
          "Authorization": "Bearer <OPENROUTER_API_KEY>",
          "Content-Type": "application/json",
      },
      json={
          "model": "openai/gpt-5.2",
          "messages": [
              {"role": "user", "content": "What were the major AI announcements this week?"}
          ],
          "tools": [{"type": "openrouter:web_search"}],
      },
  )

  print(response.json()["choices"][0]["message"]["content"])
  ```

  ```bash cURL theme={null}
  curl https://openrouter.ai/api/v1/chat/completions \
    -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "openai/gpt-5.2",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [{ "type": "openrouter:web_search" }]
    }'
  ```
</CodeGroup>

Con el valor predeterminado `engine: "auto"`, OpenRouter usa la búsqueda nativa del proveedor en los modelos que la tienen y Exa en todos los demás. Configura `engine: "exa"` para mantener un mismo comportamiento de búsqueda en todos los modelos:

```json theme={null}
{
  "type": "openrouter:web_search",
  "parameters": {
    "engine": "exa",
    "mode": "auto",
    "max_results": 5,
    "max_total_results": 20,
    "allowed_domains": ["arxiv.org"],
    "excluded_domains": ["reddit.com"]
  }
}
```

| Parámetro                             | Úsalo para                                                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`                                | Equilibrar latencia y profundidad: `instant`, `fast`, `auto` (predeterminado), `deep-lite`, `deep` o `deep-reasoning`. Los modos se corresponden con los [tipos de búsqueda](/es/docs/search/quickstart) de Exa. |
| `max_results`                         | Limitar los resultados por llamada de búsqueda (5 de forma predeterminada)                                                                                                                                    |
| `max_uses`                            | Limitar cuántas veces puede buscar el modelo en una misma solicitud                                                                                                                                           |
| `max_total_results`                   | Limitar los resultados acumulados de todas las búsquedas en una misma solicitud                                                                                                                               |
| `max_characters`                      | Fijar un presupuesto de caracteres exacto por resultado para los highlights                                                                                                                                   |
| `search_context_size`                 | Usar en su lugar un presupuesto predefinido: `low`, `medium` o `high`                                                                                                                                         |
| `allowed_domains`, `excluded_domains` | Filtrar los dominios de los resultados. Exa admite ambos filtros en la misma solicitud.                                                                                                                       |

<div id="how-results-come-back">
  ## Cómo se devuelven los resultados
</div>

OpenRouter solicita [highlights de Exa](/es/docs/search/highlights) para cada resultado en lugar del texto completo de la página: extractos de tamaño adaptable, normalmente de 2.000 a 4.000 caracteres por resultado, salvo que definas `max_characters` o `search_context_size`. El modelo lee los extractos y quienes llaman a la API los reciben en anotaciones `url_citation` estandarizadas dentro del mensaje de respuesta. Dentro de un mismo resultado, los marcadores `[...]` separan extractos tomados de distintas partes de la página.

<div id="pricing">
  ## Precios
</div>

Las búsquedas de Exa se cobran con cargo a tus créditos de OpenRouter, además de los costos de tokens del modelo por leer los resultados. Los modos `instant`, `fast` y `auto` cuestan $0.007 por búsqueda, `deep-lite` y `deep` cuestan $0.012, y `deep-reasoning` cuesta $0.015. Cada búsqueda incluye hasta 10 resultados, y cada resultado adicional cuesta $0.001. Consulta la [documentación de búsqueda web de OpenRouter](https://openrouter.ai/docs/guides/features/server-tools/web-search) para ver las tarifas actuales.

El objeto `usage` de la respuesta indica cuántas búsquedas ejecutó el modelo en `server_tool_use.web_search_requests`.

<div id="resources">
  ## Recursos
</div>

<Columns cols={2}>
  <Card title="Documentación de la herramienta de servidor" icon="wrench" href="https://openrouter.ai/docs/guides/features/server-tools/web-search" cta="Abrir documentación" arrow="true">
    Referencia completa de configuración de `openrouter:web_search`.
  </Card>

  <Card title="Caso de cliente" icon="book-open" href="https://exa.ai/customers/openrouter" cta="Leer el caso" arrow="true">
    Cómo OpenRouter ofrece búsqueda web a cientos de modelos con Exa.
  </Card>
</Columns>