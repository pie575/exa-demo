> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="search-best-practices">
  # Buenas prácticas de búsqueda
</div>

> Optimiza la calidad de recuperación, la latencia, el contexto y la síntesis en integraciones de la Search API en producción.

Esta guía da por hecho que ya tienes una [solicitud a la Search API](/es/docs/search/quickstart) funcionando. Aquí verás cómo mejorar esa solicitud siguiendo las buenas prácticas recomendadas por Exa.

<div id="start-with-the-smallest-useful-request">
  ## Empieza con la solicitud útil más pequeña
</div>

El mejor punto de partida es una query en lenguaje natural con `highlights: true`. Exa dimensiona los extractos de cada resultado según su relevancia, así que no hay ningún presupuesto de caracteres que ajustar:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Así obtienes páginas ordenadas por relevancia y, para cada una, un contexto eficiente en tokens y pertinente a la query.

Añade más parámetros solo cuando los necesites:

| Parámetro                  | Añádelo cuando                                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `type`                     | Necesites ajustarte a un presupuesto de latencia o a un requisito de profundidad             |
| `numResults`               | Quieras menos páginas para una ventana de contexto reducida, o más para ampliar la cobertura |
| `outputSchema`             | Sintetices los resultados o los estructures en JSON                                          |
| `maxAgeHours`              | El contenido de la página en caché pueda estar desactualizado                                |
| `highlights.maxCharacters` | Tu aplicación requiera un límite fijo de extracto por página                                 |
| Filtros de dominio o fecha | Los resultados fuera de la restricción resultarían inservibles                               |

<div id="search-vs-deep-search">
  ## Search vs. Deep Search
</div>

La búsqueda estándar recupera y ordena páginas para una query. Deep Search ejecuta un proceso de investigación que puede
buscar de forma iterativa, analizar lo que encontró, refinar la búsqueda y sintetizar un resultado fundamentado.

| Necesidad                                                                                                                                           | Empieza con                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Páginas ordenadas por relevancia para una query bien formulada                                                                                      | `auto` o `fast`                     |
| Búsquedas difíciles, síntesis a partir de muchos resultados o salidas estructuradas que no se pueden completar con una sola search (3 o más campos) | `deep`                              |
| Investigación de larga duración, construcción de listas o enrichment de varios pasos                                                                | [Exa Agent](/es/docs/agent/quickstart) |

Se recomienda usar los modos deep de forma predeterminada con `outputSchema`. Consulta la [guía de Deep Search](/es/docs/search/deep-search) para ver instrucciones y ejemplos completos.

<div id="improve-retrieval-quality">
  ## Mejora la calidad de la recuperación
</div>

Cuando los resultados necesiten mejoras, cambia una sola parte de la solicitud cada vez.

<Steps>
  <Step title="Aclara la query">
    Describe las páginas que buscas, no un montón de palabras clave. Incluye el tema y cualquier tipo de fuente,
    período de tiempo u otro detalle que cambie lo que se considera un resultado relevante.

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="Lee la respuesta por capas">
    Fíjate en los títulos, las URL, las fechas de publicación y los highlights antes de cambiar la solicitud.

    ```json theme={null}
    {
      "results": [
        {
          "title": "Long-Context Retrieval Methods on Legal Documents",
          "url": "https://arxiv.org/abs/2608.00000",
          "publishedDate": "2026-08-26T00:00:00.000Z",
          "highlights": [
            "We compare long-context retrieval methods across legal document benchmarks..."
          ]
        }
      ]
    }
    ```

    El título y la URL indican el tipo de fuente que recuperó Exa, `publishedDate` indica
    su actualidad y el highlight muestra la evidencia que coincidió con la query. Refina la query para
    recuperar otras páginas, añade filtros de fecha para acotar el período de tiempo u obtén el texto completo cuando
    necesites más contexto de un resultado útil.
  </Step>

  <Step title="Añade solo restricciones estrictas">
    Usa `includeDomains`, `excludeDomains` y los filtros de fecha de publicación únicamente cuando un resultado que
    incumpla la restricción resulte inservible. Expresa las preferencias de recuperación en la query y, al
    sintetizar, coloca las instrucciones de respuesta en `systemPrompt`.
  </Step>

  <Step title="Cambia el modo de search en último lugar">
    Usa un modo más rápido si tienes un requisito de latencia, o un modo profundo cuando el propio proceso de recuperación
    requiera iteración y razonamiento. Cambiar de modo no arregla una query mal especificada.
  </Step>
</Steps>

Mantén un pequeño conjunto de queries representativas mientras ajustas. Compara la relevancia de los resultados y el éxito de las tareas posteriores en todo el conjunto, en lugar de optimizar para un solo ejemplo. Registra `requestId`, `searchTime` y `costDollars` para que las regresiones sean reproducibles.

<div id="budget-latency-and-context">
  ## Presupuesta la latencia y el contexto
</div>

Cada control consume un recurso distinto:

| Control                   | Qué añade                                                      |
| ------------------------- | -------------------------------------------------------------- |
| Más resultados            | Más páginas, datos de respuesta y contexto posterior           |
| Texto completo            | Mayor contexto de la página y un payload más grande            |
| `summary`                 | Una llamada adicional al modelo de lenguaje por resultado      |
| `outputSchema`            | Síntesis a partir de los resultados recuperados                |
| `contents.maxAgeHours: 0` | Una descarga nueva de la página en lugar de contenido en caché |
| Tipos de search profunda  | Búsqueda iterativa, síntesis y razonamiento                    |

Para una ruta en tiempo real en la que el contenido en caché resulte aceptable, combina el modo de menor latencia con highlights y contenido solo desde caché:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent product updates from major AI labs",
      type="instant",
      contents={
          "highlights": True,
          "max_age_hours": -1,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("Recent product updates from major AI labs", {
    type: "instant",
    contents: {
      highlights: true,
      maxAgeHours: -1
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent product updates from major AI labs",
      "type": "instant",
      "contents": {
        "highlights": true,
        "maxAgeHours": -1
      }
    }'
  ```
</CodeGroup>

No apliques esta receta cuando la actualidad de la página sea parte de la corrección. Empieza con `auto` y la frescura predeterminada, salvo que el producto tenga un objetivo de latencia medido.

Para que Exa reparta un único presupuesto de contexto entre todo el conjunto de resultados —más de las fuentes sólidas y menos de las redundantes—, consulta la [vista previa de investigación de Dynamic Highlights](/es/docs/search/highlights#dynamic-highlights).

<div id="tips-for-common-use-cases">
  ## Consejos para casos de uso comunes
</div>

| Si necesitas                                 | Usa                                                                            | Evita                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Publicaciones más recientes                  | Incluir la ventana temporal en la query o usar filtros de fecha de publicación | `maxAgeHours`                                                         |
| Contenido actualizado de páginas que cambian | `contents.maxAgeHours`                                                         | Filtros de fecha de publicación                                       |
| Un tipo de fuente preferido                  | La redacción de la query; `systemPrompt` al sintetizar                         | Una lista de dominios permitidos estricta                             |
| Resultados solo de fuentes aprobadas         | `includeDomains`                                                               | Repetir `site:` en la query                                           |
| Una salida estructurada pequeña              | `outputSchema` con Search estándar                                             | Elegir Deep solo porque la salida es JSON                             |
| Una salida investigada con varios elementos  | `deep` con `outputSchema`, o [Exa Agent](/es/docs/agent/quickstart)               | Esperar que una sola pasada de recuperación reúna todos los elementos |
| Más contexto de unas pocas páginas           | Search con highlights y luego llamar a Contents                                | Texto completo para cada resultado                                    |
| Menor latencia                               | Medir `fast` o `instant` con contenido compacto                                | Añadir controles de frescura o síntesis por defecto                   |

<div id="when-to-use-another-endpoint">
  ## Cuándo usar otro endpoint
</div>

Usa un endpoint distinto de Exa cuando la tarea cambie de naturaleza:

| Tarea                                                            | Usa                                   |
| ---------------------------------------------------------------- | ------------------------------------- |
| Investigación de larga duración, creación de listas o enrichment | [Exa Agent](/es/docs/agent/quickstart)   |
| Ya conoces las URLs                                              | [Contents](/es/docs/contents/quickstart) |
| Ejecutar una search de forma programada                          | [Monitors](/es/docs/monitors/quickstart) |

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Referencia de la Search API" icon="square-terminal" href="/es/docs/reference/search" cta="Abrir referencia" arrow="true">
    Todos los parámetros de solicitud y campos de respuesta.
  </Card>

  <Card title="Inicio rápido de Search" icon="search" href="/es/docs/search/quickstart" cta="Ver guía" arrow="true">
    Estructuras básicas de solicitud, filtros, salida y frescura.
  </Card>

  <Card title="Contents API" icon="file-text" href="/es/docs/contents/quickstart" cta="Abrir guía" arrow="true">
    Extrae highlights o el texto completo de páginas que ya conoces.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Investigación de larga duración, creación de listas y enrichment.
  </Card>
</Columns>