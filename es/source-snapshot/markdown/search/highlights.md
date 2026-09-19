> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="highlights">
  # Highlights
</div>

> Devuelve extractos relevantes para la query a partir de los resultados de Exa Search, controlando el tamaño del contexto y la latencia.

Los highlights devuelven pasajes extraídos de cada resultado que resultan relevantes para tu query. Úsalos cuando tu aplicación necesite evidencia de la página sin asumir el costo en tokens del texto completo.

Cada resultado devuelve los pasajes seleccionados en `results[].highlights`.

<div id="why-highlights-instead-of-full-text">
  ## Por qué highlights en lugar del texto completo
</div>

Los highlights provienen del modelo de extracción propio de Exa. En cada solicitud, el modelo analiza cada resultado a la luz de tu query y devuelve únicamente los pasajes que la responden. Te quedas con una fracción de los tokens del texto completo de la página, con una calidad de respuesta igual o mejor.

| Evaluación                       | Resultado                                                                                                                                                                                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Precisión (SimpleQA)             | 500 caracteres de highlights igualan la precisión de los primeros 8.000 caracteres del texto de la página, con 16 veces menos tokens                                                             |
| Calidad con presupuestos mayores | 4.000 caracteres de highlights superan a 32.000 caracteres de texto completo                                                                                                                     |
| Documentos técnicos extensos     | Con un presupuesto de 500 caracteres, los highlights alcanzan un 60% de precisión en referencias de API, documentación de SDK, especificaciones y artículos; el texto completo se queda en un 6% |
| Uso de tokens en búsquedas       | Los highlights reducen los tokens de búsqueda 5 veces en promedio                                                                                                                                |

El ahorro se nota sobre todo en bucles de agentes, donde cada ronda de resultados de búsqueda compite por el contexto con las trazas de razonamiento.

<Tip>
  Lee [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  para conocer la metodología y los resultados completos.
</Tip>

<div id="add-highlights-to-search">
  ## Añadir highlights a Search
</div>

Usa `highlights: true` dentro de `contents` como valor predeterminado recomendado. Exa decide cuánto texto devolver de cada resultado en función de su relevancia respecto a tu query, así que no hay ningún presupuesto de caracteres que ajustar. Define `maxCharacters` solo si tu aplicación necesita un límite fijo por página.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "How are inference providers reducing transformer latency?",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "How are inference providers reducing transformer latency?",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "How are inference providers reducing transformer latency?",
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

<div id="dynamic-highlights">
  ## Dynamic Highlights
</div>

Dynamic Highlights ajusta la cantidad de texto que selecciona de cada resultado según lo que resulte más útil para tu query. Puede extraer más de las fuentes sólidas y menos de las repetitivas o irrelevantes, lo que reduce el total de tokens devueltos.

Úsalo cuando varios resultados alimenten el mismo agente o la misma ventana de contexto. Mantén el `highlights: true` habitual cuando cada página necesite su propio extracto o un límite predecible por página.

En las evaluaciones de Exa, Dynamic Highlights redujo los tokens un 95 % en promedio frente al contenido completo de la página. Con un presupuesto de 12.000 caracteres superó a los highlights habituales, con una mejora media del 40 % en eficiencia de tokens y un aumento del 3,8 % en calidad. Dentro de Exa Agent, redujo el uso total de tokens del agente un 30 %, con una ganancia media de calidad del 2,1 % en pruebas comparativas como BrowseComp y WideSearch.

<Tip>
  Lee [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights) para conocer los resultados de la evaluación y
  el diseño detrás de la selección de highlights entre varios resultados.
</Tip>

Actívalo con `dynamic: true`:

<CodeGroup>
  ```python Python theme={null}
  from exa_py.api import DYNAMIC_HIGHLIGHTS_BETA

  result = exa.search(
      "How did US household solar installation costs change over the past five years?",
      contents={
          "highlights": {
              "dynamic": True,
          }
      },
      betas=[DYNAMIC_HIGHLIGHTS_BETA],
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa, { DYNAMIC_HIGHLIGHTS_BETA } from "exa-js";

  const result = await exa.search(
    "How did US household solar installation costs change over the past five years?",
    {
      contents: {
        highlights: {
          dynamic: true
        }
      },
      betas: [DYNAMIC_HIGHLIGHTS_BETA]
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: dynamic-highlights-2026-08-28" \
    -d '{
      "query": "How did US household solar installation costs change over the past five years?",
      "contents": {
        "highlights": {
          "dynamic": true
        }
      }
    }'
  ```
</CodeGroup>

<Info>
  Dynamic Highlights es una vista previa de investigación y requiere el encabezado de solicitud
  `Exa-Beta: dynamic-highlights-2026-08-28`. Los SDK lo envían cuando pasas
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) o `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript).

  La respuesta usa la misma
  estructura `results[].highlights` que los highlights habituales.
</Info>

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Guía de la Search API" icon="search" href="/es/docs/search/quickstart" cta="Abrir guía" arrow="true">
    Crea una solicitud de Search y elige el formato de salida adecuado.
  </Card>

  <Card title="Mejores prácticas de Search" icon="sparkles" href="/es/docs/search/best-practices" cta="Leer guía" arrow="true">
    Ajusta la calidad de la recuperación, la latencia, la actualidad y el tamaño del contexto.
  </Card>
</Columns>