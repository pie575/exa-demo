> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Buenas prácticas de búsqueda {#search-best-practices}

> Ajusta la calidad de la recuperación, la latencia, el contexto y la síntesis en integraciones de la Search API en producción.

Esta guía parte de que ya tienes una [solicitud a la Search API](/es/docs/search/quickstart) funcionando. Explica cómo mejorarla siguiendo las buenas prácticas recomendadas por Exa.

## Comienza con la solicitud más pequeña que resulte útil {#start-with-the-smallest-useful-request}

El mejor punto de partida es una consulta en lenguaje natural con `highlights: true`. Exa ajusta los extractos de cada resultado según su relevancia, así que no hay ningún presupuesto de caracteres que ajustar:

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

Así obtienes páginas ordenadas por relevancia y, en cada una, contexto eficiente en tokens y pertinente a la consulta.

Añade más parámetros solo cuando los necesites:

| Parámetro                  | Añádelo cuando                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| `type`                     | Debas ajustarte a un límite de latencia o a un requisito de profundidad                         |
| `numResults`               | Quieras menos páginas para una ventana de contexto más pequeña, o más para ampliar la cobertura |
| `outputSchema`             | Sintetices los resultados o los estructures en JSON                                             |
| `maxAgeHours`              | El contenido de la página en caché pueda estar demasiado desactualizado                         |
| `highlights.maxCharacters` | Tu aplicación requiera un límite fijo de extractos por página                                   |
| Filtros de dominio o fecha | Los resultados fuera de la restricción resulten inservibles                                     |

## Search vs. Deep Search {#search-vs-deep-search}

La búsqueda estándar recupera y ordena páginas para una consulta. Deep Search ejecuta un proceso de investigación que puede
buscar de forma iterativa, revisar lo que encontró, refinar la búsqueda y sintetizar un resultado fundamentado.

| Necesidad                                                                                                                                    | Empieza con                         |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Páginas ordenadas por relevancia para una consulta bien formulada                                                                            | `auto` o `fast`                     |
| Búsquedas difíciles, síntesis de muchos resultados o salidas estructuradas que no se pueden completar con una sola búsqueda (3 o más campos) | `deep`                              |
| Investigación de larga duración, creación de listas o enrichment de varios pasos                                                             | [Exa Agent](/es/docs/agent/quickstart) |

Se recomienda usar los modos deep por defecto al trabajar con `outputSchema`. Consulta la [guía de Deep Search](/es/docs/search/deep-search) para ver instrucciones y ejemplos completos.

## Mejora la calidad de la recuperación {#improve-retrieval-quality}

Cuando los resultados necesiten mejorar, cambia una parte de la solicitud a la vez.

<Steps>
  <Step title="Aclara la consulta">
    Describe las páginas que buscas, no una lista suelta de palabras clave. Incluye el tema y cualquier tipo de fuente,
    periodo u otro detalle que cambie lo que se considera un resultado relevante.

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="Lee la respuesta por capas">
    Revisa los títulos, las URL, las fechas de publicación y los highlights antes de cambiar la solicitud.

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

    El título y la URL muestran el tipo de fuente que recuperó Exa, `publishedDate` indica
    su actualidad y el highlight muestra la evidencia que coincidió con la consulta. Refina la consulta para
    recuperar otras páginas, añade filtros de fecha para acotar el periodo u obtén el texto completo cuando
    necesites más contexto de un resultado útil.
  </Step>

  <Step title="Añade solo restricciones estrictas">
    Usa `includeDomains`, `excludeDomains` y los filtros de fecha de publicación solo cuando un resultado que
    incumpla la restricción resulte inservible. Coloca las preferencias de recuperación en la consulta y, al
    sintetizar, las instrucciones de respuesta en `systemPrompt`.
  </Step>

  <Step title="Cambia el modo de búsqueda al final">
    Usa un modo más rápido si tienes un requisito de latencia, o un modo deep cuando el propio proceso de recuperación
    requiera iteración y razonamiento. Cambiar de modo no arregla una consulta mal especificada.
  </Step>
</Steps>

Mantén un conjunto reducido de consultas representativas mientras ajustas. Compara la relevancia de los resultados y el éxito de la tarea posterior en todo el conjunto en lugar de optimizar para un solo ejemplo. Registra `requestId`, `searchTime` y `costDollars` para que las regresiones sean reproducibles.

## Presupuesta la latencia y el contexto {#budget-latency-and-context}

Cada control consume un recurso distinto:

| Control                   | Qué añade                                                    |
| ------------------------- | ------------------------------------------------------------ |
| Más resultados            | Más páginas, datos de respuesta y contexto posterior         |
| Texto completo            | Mayor contexto de la página y un payload más grande          |
| `summary`                 | Una llamada adicional al modelo de lenguaje por resultado    |
| `outputSchema`            | Síntesis sobre los resultados recuperados                    |
| `contents.maxAgeHours: 0` | Una descarga nueva de la página en vez de contenido en caché |
| Tipos de búsqueda deep    | Búsqueda iterativa, síntesis y razonamiento                  |

Para una ruta en tiempo real donde el contenido en caché sea aceptable, combina el modo de menor latencia con highlights y contenido solo desde caché:

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

No uses esta receta cuando la frescura de la página forme parte de la exactitud. Empieza con `auto` y la frescura por defecto salvo que el producto tenga un objetivo de latencia medido.

Para que Exa reparta un único presupuesto de contexto en todo el conjunto de resultados — más en las fuentes sólidas, menos en las redundantes — consulta la [vista previa de investigación de Dynamic Highlights](/es/docs/search/highlights#dynamic-highlights).

## Consejos para casos de uso comunes {#tips-for-common-use-cases}

| Si necesitas                                 | Usa                                                                               | Evita                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Publicaciones más recientes                  | Incluir la ventana temporal en la consulta o usar filtros de fecha de publicación | `maxAgeHours`                                                         |
| Contenido actualizado de páginas que cambian | `contents.maxAgeHours`                                                            | Filtros de fecha de publicación                                       |
| Un tipo de fuente preferido                  | La redacción de la consulta; `systemPrompt` al sintetizar                         | Una lista blanca estricta de dominios                                 |
| Resultados solo de fuentes aprobadas         | `includeDomains`                                                                  | Repetir `site:` en la consulta                                        |
| Un output estructurado pequeño               | `outputSchema` con Search estándar                                                | Elegir Deep solo porque el output es JSON                             |
| Un output investigado con varios elementos   | `deep` con `outputSchema`, o [Exa Agent](/es/docs/agent/quickstart)                  | Esperar que una sola pasada de recuperación reúna todos los elementos |
| Más contexto de unas pocas páginas           | Search con highlights y luego llamar a Contents                                   | Texto completo para cada resultado                                    |
| Menor latencia                               | Medir `fast` o `instant` con contenido compacto                                   | Añadir controles de frescura o síntesis por defecto                   |

## Cuándo usar otro endpoint {#when-to-use-another-endpoint}

Usa un endpoint distinto de Exa cuando la tarea cambie de naturaleza:

| Tarea                                                            | Usa                                   |
| ---------------------------------------------------------------- | ------------------------------------- |
| Investigación de larga duración, creación de listas o enrichment | [Exa Agent](/es/docs/agent/quickstart)   |
| Ya se conocen las URL                                            | [Contents](/es/docs/contents/quickstart) |
| Ejecutar una búsqueda de forma programada                        | [Monitors](/es/docs/monitors/quickstart) |

## Próximos pasos {#next-steps}

<Columns cols={2}>
  <Card title="Referencia de la Search API" icon="square-terminal" href="/es/docs/reference/search" cta="Abrir referencia" arrow="true">
    Todos los parámetros de solicitud y campos de respuesta.
  </Card>

  <Card title="Quickstart de búsqueda" icon="search" href="/es/docs/search/quickstart" cta="Ver guía" arrow="true">
    Estructuras básicas de solicitud, filtros, output y frescura.
  </Card>

  <Card title="Contents API" icon="file-text" href="/es/docs/contents/quickstart" cta="Abrir guía" arrow="true">
    Extrae highlights o el texto completo de páginas que ya conoces.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Investigación de larga duración, creación de listas y enrichment.
  </Card>
</Columns>