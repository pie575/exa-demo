> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="changelog">
  # Registro de cambios
</div>

> Actualizaciones de producto y anuncios de Exa.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  <div id="dynamic-highlights-research-preview">
    ## Dynamic Highlights (versión preliminar de investigación)
  </div>

  Dynamic Highlights selecciona extractos de todo el conjunto de resultados en lugar de tratar cada página por separado. Destina una mayor parte del presupuesto de contexto compartido a las fuentes útiles y menos contexto a las que solo repiten información ya devuelta.

  * **RAG de un solo turno**: alrededor de un 49 % más de eficiencia de tokens y un 2,4 % más de calidad posterior con Exa Auto en evaluaciones de programación y de preguntas y respuestas generales.
  * **Agentes**: alrededor de un 30 % menos de tokens en trayectorias completas de agentes y un 1 % más de calidad en BrowseComp, WideSearch y evaluaciones internas de empresas y personas.

  Las solicitudes que establecen `dynamic: true` requieren el encabezado `Exa-Beta: dynamic-highlights-2026-08-28`.

  [Leer la guía de Dynamic Highlights →](/es/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  <div id="publication-research">
    ## Investigación de publicaciones
  </div>

  Ampliamos y mejoramos notablemente la investigación sobre publicaciones académicas.

  * **350 M de publicaciones**: busca en un índice de 350 millones de publicaciones.
  * **Resultados más completos de organizaciones y personas**: las Searches ahora devuelven tanto organizaciones como las personas afiliadas a ellas, cada una como un perfil detallado y enriquecido que abarca publicaciones, principales colaboradores, áreas de investigación y financiamiento.
  * **Búsqueda agéntica de personas y organizaciones**: los agentes ya pueden buscar entre personas y organizaciones.
  * **Benchmark público de recuperación**: publicamos un benchmark público para la recuperación de publicaciones.
  * **Nueva categoría de Search `publication`**: consulta resultados académicos con `category: "publication"`, que reemplaza a la categoría `research paper`.
  * **Categorías deprecadas**: las categorías de Search `pdf`, `github` y `tweet` quedarán deprecadas.
  * **`startCrawlDate` / `endCrawlDate`**: estos parámetros deprecados ahora se ignoran para todos los equipos, aunque se siguen aceptando por compatibilidad.

  Consúltalo a través de la API con la [categoría de Search](/es/docs/search/quickstart) `publication`, o [pruébalo en el panel →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## Exa Agent y Exa Connect en MCP
  </div>

  Exa Agent ya está disponible dentro de Exa MCP. Úsalo desde Claude, Cursor o cualquier otro cliente MCP cuando la tarea requiera más que una sola llamada de Search.

  Habilita la herramienta Agent con `https://mcp.exa.ai/mcp?tools=agent_run` y luego llama a `agent_run` para ejecutar el agente hasta su finalización y devolver su output.

  Las fuentes de datos de Exa Connect están disponibles a través del flujo de Agent, así que puedes adjuntar data partners premium cuando un run necesite algo más que la Search web.

  [Leer la guía de Exa MCP →](/es/docs/get-started/exa-mcp) · [Leer la guía de Exa Agent →](/es/docs/agent/quickstart) · [Tuit del anuncio →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## Presentamos Exa Connect
  </div>

  Exa Connect le da a Exa Agent acceso en vivo a los datos públicos y privados del mundo. Se lanzó con Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko y Additional Partners. Los adjuntas mediante `dataSources` en `POST /agent/runs`.

  [Leer la guía de Exa Connect →](/es/docs/agent/connect/overview) · [Tuit del anuncio →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## Presentamos Exa Agent
  </div>

  Lanzamos una nueva clase de agentes de investigación web de frontera, accesibles a través de la API.

  La Exa Agent API admite parámetros como una consulta en lenguaje natural, el modo `effort`, `outputSchema` para salidas estructuradas e `input.data` para partir de un conjunto de datos existente.

  [Leer la guía de la Exa Agent API →](/es/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "Aviso de deprecación de la API" }}>
  <div id="api-deprecation-notice">
    ## Aviso de deprecación de la API
  </div>

  Retiramos algunos elementos heredados de la API de Exa:

  * **endpoint `/research`**: reemplazado por `/search` con `type: "deep-reasoning"`.
  * **`resolvedSearchType` y `highlightScores` (campos de respuesta)**: devolvieron `null` desde el 15 de abril y se eliminaron el 1 de mayo.
  * **`startCrawlDate` / `endCrawlDate` (parámetros de solicitud deprecados)**: se ignoran silenciosamente desde el 15 de abril.

  [Migra a Deep Search →](/es/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Presentamos Exa Monitors" }}>
  <div id="introducing-exa-monitors">
    ## Presentamos Exa Monitors
  </div>

  Los monitors ejecutan Searches de Exa según un schedule y entregan los resultados a tu webhook, deduplicados respecto a runs anteriores para que solo recibas contenido nuevo.

  * **Sigue temas a lo largo del tiempo**: noticias de competidores, rondas de financiación, cambios regulatorios, artículos de investigación.
  * **Resultados estructurados**: devuelve texto plano o JSON tipado mediante `outputSchema`.
  * **Programación flexible**: ejecútalos según un interval (mínimo 1 hora) o actívalos manualmente.

  [Lee la guía de la API de Monitors →](/es/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Renovación de Exa Deep" }}>
  <div id="exa-deep-revamp">
    ## Renovación de Exa Deep
  </div>

  Exa Deep es más rápido, más económico y ahora admite salidas estructuradas con grounding a nivel de campo.

  * **Nuevo tipo `deep-reasoning`** para tareas de mayor effort (12-50 s); `deep` se ejecuta en 4-12 s.
  * **Precio un 20% menor** para la Search `deep` normal.
  * **Salidas estructuradas** mediante `outputSchema`, con `output.content` y `output.grounding` (citas y confidence a nivel de campo) en la respuesta.

  Consulta la [Actualización de precios de Exa](#exa-pricing-update) más abajo para ver los precios completos.

  [Lee la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Actualización de precios de Exa" }}>
  <div id="exa-pricing-update">
    ## Actualización de precios de Exa
  </div>

  Simplificamos y redujimos los precios. El contenido de los primeros 10 resultados de Search ahora se incluye gratis, y los nuevos precios se aplican automáticamente sin que tengas que hacer nada.

  * **Search con contenido**: $7 por cada 1k solicitudes (10 resultados, texto + highlights incluidos); $1 por cada 1k resultados adicionales.
  * **Resúmenes**: $1 por cada 1k, tanto en Search como en contenido.
  * **Exa Deep**: $12 por cada 1k solicitudes; **Deep (Reasoning)** $15 por cada 1k.
  * **endpoint contenido**: $1 por cada 1k páginas por tipo de contenido.

  [Ver precios actuales →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Presentamos Exa Instant Search" }}>
  <div id="introducing-exa-instant-search">
    ## Presentamos Exa Instant Search
  </div>

  Exa Instant es nuestro tipo de Search más rápido: combina una mejor calidad de Search neuronal con una latencia inferior a 150 ms. Actívalo con `type="instant"`.

  * **Pensado para tiempo real**: aplicaciones de chat, IA de voz, agentes de programación, autocompletado y sugerencias en vivo.
  * **Calidad de última generación** con la menor latencia que ofrecemos.

  [Lee la guía de la Search API →](/es/docs/search/quickstart) · [Pruébalo en el panel →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights, frescura del contenido y actualizaciones de MCP" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Highlights, frescura del contenido y actualizaciones de MCP
  </div>

  Tres mejoras en la extracción y el acceso al contenido:

  * **`maxCharacters` para highlights**: ahora es la forma recomendada de controlar la longitud de los highlights. `numSentences` y `highlightsPerUrl` quedan deprecados.
  * **`maxAgeHours` para la frescura del contenido**: control basado en la antigüedad que sustituye al booleano `livecrawl` (`0` rastrea siempre, `-1` solo caché, `24` rastrea si tiene más de 24 h).
  * **Nivel gratuito de Exa MCP**: pruébalo sin autenticación a 3 QPS y 150 llamadas al día; añade una API key para acceso completo.

  [Documentación de frescura del contenido →](/es/docs/contents/quickstart#content-freshness) · [Exa MCP →](/es/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Presentamos Exa Company Search" }}>
  <div id="introducing-exa-company-search">
    ## Presentamos Exa Company Search
  </div>

  La Search de empresas ahora usa un modelo de recuperación afinado y un pipeline de coincidencia de entidades. Usa `type="auto"`, `category="company"`.

  * **Precisión en todos los atributos**: sector, geografía, etapa de financiación y número de empleados.
  * **Datos de entidad estructurados**: los resultados devuelven información tipada de la empresa (plantilla, sede, finanzas, tráfico web).
  * **Casos de uso**: prospección de ventas, investigación de mercado y flujos de trabajo de cadena de suministro.

  [Lee la documentación de Companies &amp; People Search →](/es/docs/search/data/companies-people) · [Lee el blog del benchmark →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Presentamos Exa People Search" }}>
  <div id="introducing-exa-people-search">
    ## Presentamos Exa People Search
  </div>

  La Search de personas ahora abarca más de 1000 millones de perfiles públicos mediante un sistema de recuperación híbrido. La categoría `linkedin` se reemplaza por la nueva categoría `people`.

  * **Mayor cobertura**: perfiles de toda la web, no solo de LinkedIn.
  * **Mejor precisión**: embeddings afinados para consultas de cargo, habilidad y empresa.
  * **Casos de uso**: ventas, reclutamiento e investigación de mercado.

  [Lee la documentación de Companies &amp; People Search →](/es/docs/search/data/companies-people) · [Lee el blog del benchmark →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "SDK de JS: highlights restaurados" }}>
  <div id="js-sdk-highlights-restored">
    ## SDK de JS: highlights restaurados
  </div>

  Los highlights vuelven al SDK de JavaScript a partir de `exa-js` v2.0.11 y devuelven las frases clave con sus puntuaciones de relevancia. Pasa `highlights: true` o `highlights: { maxCharacters, query }` en las llamadas de Search y de contenido.

  [Lee la documentación del SDK de JavaScript →](/es/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "Nuevo tipo de Search Deep" }}>
  <div id="new-deep-search-type">
    ## Nuevo tipo de Search Deep
  </div>

  Exa Deep encuentra mejores resultados ejecutando varias Searches a la vez y devolviendo contexto de alta calidad para cada resultado. Actívalo con `type="deep"`.

  * **Expansión de consultas**: envía una consulta y generamos variaciones, o aporta las tuyas con `additionalQueries`.
  * **Search en paralelo y ranking inteligente** sobre tu consulta y todas sus variaciones.
  * **Resúmenes detallados** de cada resultado.

  [Lee la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Se añadió filtrado por idioma" }}>
  <div id="added-language-filtering">
    ## Se añadió filtrado por idioma
  </div>

  Exa ahora detecta el idioma de tu consulta y devuelve resultados solo en ese idioma. Está activado por defecto para todos los usuarios y no requiere configuración.

  [Lee la guía de la Search API →](/es/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "Cambios en los SDK: highlights eliminados y contenido devuelto por defecto" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## Cambios en los SDK: highlights eliminados y contenido devuelto por defecto
  </div>

  Una versión mayor de los SDK con cambios incompatibles:

  * **Contenido por defecto**: la Search ahora incluye el contenido de la página; desactívalo para Searches más rápidas.
  * **Highlights eliminados de los SDK**: después se restauraron en el SDK de JS; consulta [SDK de JS: highlights restaurados](#js-sdk-highlights-restored).
  * **`use_autoprompt` deprecado**: eliminado de todas las respuestas de la API.

  [Lee la documentación del SDK de Python →](/es/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Compatibilidad con filtros por ruta de dominio" }}>
  <div id="domain-path-filter-support">
    ## Compatibilidad con filtros por ruta de dominio
  </div>

  `includeDomains` y `excludeDomains` ahora permiten una segmentación más precisa:

  * **Filtrado por ruta específica**: p. ej. `exa.ai/blog` o `linkedin.com/company`.
  * **Comodines de subdominio**: p. ej. `*.substack.com`.

  Útil para acotar Searches a blogs, catálogos de productos o directorios.

  [Lee la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Compatibilidad con filtros de geolocalización" }}>
  <div id="geolocation-filter-support">
    ## Compatibilidad con filtros de geolocalización
  </div>

  El nuevo parámetro `userLocation` orienta los resultados hacia la región del usuario, indicada con un código de país [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (p. ej. `"us"`, `"fr"`). Útil para aplicaciones multirregionales, contenido en idiomas regionales y descubrimiento local.

  [Lee la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "Nuevo tipo de Search Fast" }}>
  <div id="new-fast-search-type">
    ## Nuevo tipo de Search Fast
  </div>

  Exa Fast usa modelos de Search optimizados con una latencia p50 inferior a 425 ms. Actívalo con `type="fast"`.

  * **El mismo índice de Exa** con contenido de alta calidad que el Search neuronal.
  * **Compatibilidad total de parámetros** con los demás tipos de Search.
  * **Diseñado para** grounding web rápido, flujos de trabajo con agentes y productos de baja latencia.

  [Lee la guía de la Search API →](/es/docs/search/quickstart) · [Pruébalo en el panel →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Deprecación de score en Auto Search" }}>
  <div id="score-deprecation-in-auto-search">
    ## Deprecación de score en Auto Search
  </div>

  La nueva arquitectura de Auto Search ya no puede generar puntuaciones de relevancia significativas, por lo que el campo `score` se eliminará de los resultados de Auto Search.

  * **Auto Search**: ya no devuelve `score`; los resultados ya vienen ordenados por relevancia.
  * **Search neuronal**: las puntuaciones no cambian. Usa `type="neural"` si dependes de ellas.

  [Lee la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Contenido en Markdown por defecto" }}>
  <div id="markdown-contents-as-default">
    ## Contenido en Markdown por defecto
  </div>

  Todos los endpoints ahora devuelven markdown limpio por defecto, lo cual es mejor para LLM, RAG y el procesamiento de texto en general. No necesitas hacer nada.

  * **`includeHtmlTags=false` (por defecto)**: el contenido se procesa como markdown limpio.
  * **`includeHtmlTags=true`**: HTML sin procesar, sin conversión a markdown.

  En ambos casos, se elimina el contenido accesorio, como anuncios y menús de navegación.

  [Lee la documentación de Contents →](/es/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "Nueva opción de livecrawl: preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## Nueva opción de livecrawl: preferred
  </div>

  <Warning>
    Entrada histórica: el parámetro de cadena `livecrawl` está deprecado. Para nuevas integraciones, usa `maxAgeHours` junto con `livecrawlTimeout`. Consulta [Frescura del contenido](/es/docs/contents/quickstart#content-freshness).
  </Warning>

  La opción deprecada `livecrawl: "preferred"` intenta un rastreo nuevo, pero recurre al contenido en caché cuando el rastreo falla (a diferencia de `"always"`, que devuelve un error). Ideal para aplicaciones en producción que necesitan contenido fresco sin fallar ante sitios temporalmente no disponibles.

  [Lee la documentación sobre frescura del contenido →](/es/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Cambios de estado en el endpoint Contents" }}>
  <div id="contents-endpoint-status-changes">
    ## Cambios de estado en el endpoint Contents
  </div>

  `/contents` ahora devuelve un campo `statuses` por URL en lugar de un único error HTTP, de modo que puedes gestionar el resultado de cada URL de forma individual. El endpoint solo devuelve error ante incidencias internas.

  * **`status`**: `"success"` o `"error"` por URL.
  * **`error.tag`**: p. ej. `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, con un `httpStatusCode`.

  [Lee la referencia de códigos de error →](/es/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto Search por defecto" }}>
  <div id="auto-search-as-default">
    ## Auto Search por defecto
  </div>

  Auto Search es ahora la opción por defecto y dirige automáticamente cada consulta al mejor método de Search. No necesitas hacer nada; usa `type="neural"` para mantener el comportamiento anterior.

  [Conoce los tipos de Search de Exa →](/es/docs/search/quickstart)
</Update>