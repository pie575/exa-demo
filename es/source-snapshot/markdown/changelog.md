> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="changelog">
  # Changelog
</div>

> Novedades y anuncios de producto de Exa.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (vista previa de investigación)" }}>
  <div id="dynamic-highlights-research-preview">
    ## Dynamic Highlights (vista previa de investigación)
  </div>

  Dynamic Highlights selecciona extractos de todo el conjunto de resultados en lugar de tratar cada página por separado. Destina una mayor parte del presupuesto de contexto compartido a las fuentes útiles y reduce el contexto de aquellas que solo repiten información ya devuelta.

  * **RAG de un solo turno**: alrededor de un 49 % más de eficiencia en tokens y un 2,4 % más de calidad posterior con Exa Auto en evaluaciones de programación y de preguntas y respuestas generales.
  * **Agentes**: alrededor de un 30 % menos de tokens en trayectorias completas de agentes y un 1 % más de calidad en BrowseComp, WideSearch y evaluaciones internas de empresas y personas.

  Las solicitudes que establecen `dynamic: true` requieren el encabezado `Exa-Beta: dynamic-highlights-2026-08-28`.

  [Lee la guía de Dynamic Highlights →](/es/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Investigación de publicaciones" }}>
  <div id="publication-research">
    ## Investigación de publicaciones
  </div>

  Ampliamos y mejoramos notablemente la investigación sobre publicaciones académicas.

  * **350 M de publicaciones**: busca en un índice de 350 millones de publicaciones.
  * **Resultados más completos de organizaciones y personas**: las búsquedas ahora devuelven tanto organizaciones como las personas afiliadas a ellas, cada una como un perfil detallado y enriquecido que abarca publicaciones, principales colaboradores, áreas de investigación y financiamiento.
  * **Búsqueda agéntica de personas y organizaciones**: los agentes ya pueden buscar entre personas y organizaciones.
  * **Benchmark público de recuperación**: publicamos un benchmark público para la recuperación de publicaciones.
  * **Nueva categoría de búsqueda `publication`**: consulta resultados académicos con `category: "publication"`, que sustituye a la categoría `research paper`.
  * **Categorías obsoletas**: las categorías de búsqueda `pdf`, `github` y `tweet` quedarán obsoletas.
  * **`startCrawlDate` / `endCrawlDate`**: estos parámetros obsoletos ahora se ignoran para todos los equipos, aunque se siguen aceptando por compatibilidad.

  Consúltalo a través de la API con la [categoría de búsqueda](/es/docs/search/quickstart) `publication` o [pruébalo en el panel →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent y Exa Connect en MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## Exa Agent y Exa Connect en MCP
  </div>

  Exa Agent ya está disponible dentro de Exa MCP. Úsalo desde Claude, Cursor o cualquier otro cliente MCP cuando la tarea requiera más que una sola llamada de búsqueda.

  Habilita la herramienta Agent con `https://mcp.exa.ai/mcp?tools=agent_run` y luego llama a `agent_run` para ejecutar el agente hasta el final y obtener su salida.

  Las fuentes de datos de Exa Connect están disponibles a través del flujo de Agent, así que puedes adjuntar socios de datos premium cuando una ejecución necesite algo más que la búsqueda web.

  [Lee la guía de Exa MCP →](/es/docs/get-started/exa-mcp) · [Lee la guía de Exa Agent →](/es/docs/agent/quickstart) · [Tuit del anuncio →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Presentamos Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## Presentamos Exa Connect
  </div>

  Exa Connect le da a Exa Agent acceso en vivo a los datos públicos y privados del mundo. Se lanzó con Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko y Additional Partners. Los adjuntas mediante `dataSources` en `POST /agent/runs`.

  [Lee la guía de Exa Connect →](/es/docs/agent/connect/overview) · [Tuit del anuncio →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Presentamos Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## Presentamos Exa Agent
  </div>

  Lanzamos una nueva clase de agentes de investigación web de frontera, accesibles a través de la API.

  La API de Exa Agent admite parámetros como una consulta en lenguaje natural, el modo `effort`, `outputSchema` para salidas estructuradas e `input.data` para partir de un conjunto de datos existente.

  [Lee la guía de la API de Exa Agent →](/es/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "Aviso de obsolescencia de la API" }}>
  <div id="api-deprecation-notice">
    ## Aviso de obsolescencia de la API
  </div>

  Retiramos algunos elementos heredados de la API de Exa:

  * **Endpoint `/research`**: reemplazado por `/search` con `type: "deep-reasoning"`.
  * **`resolvedSearchType` y `highlightScores` (campos de respuesta)**: devuelven `null` desde el 15 de abril y se eliminaron el 1 de mayo.
  * **`startCrawlDate` / `endCrawlDate` (parámetros de solicitud obsoletos)**: se ignoran silenciosamente desde el 15 de abril.

  [Migrar a Deep search →](/es/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Presentamos Exa Monitors" }}>
  <div id="introducing-exa-monitors">
    ## Presentamos Exa Monitors
  </div>

  Los monitors ejecutan búsquedas de Exa de forma programada y envían los resultados a tu webhook, deduplicados respecto a ejecuciones anteriores para que solo recibas contenido nuevo.

  * **Haz seguimiento de temas a lo largo del tiempo**: noticias de la competencia, rondas de financiación, cambios regulatorios, artículos de investigación.
  * **Resultados estructurados**: devuelve texto plano o JSON tipado mediante `outputSchema`.
  * **Programación flexible**: ejecútalos por intervalos (mínimo 1 hora) o actívalos manualmente.

  [Lee la guía de la API de Monitors →](/es/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Renovación de Exa Deep" }}>
  <div id="exa-deep-revamp">
    ## Renovación de Exa Deep
  </div>

  Exa Deep es más rápido, más económico y ahora admite salidas estructuradas con grounding a nivel de campo.

  * **Nuevo tipo `deep-reasoning`** para tareas que exigen más esfuerzo (12-50 s); `deep` se ejecuta en 4-12 s.
  * **Precio un 20 % menor** para la búsqueda `deep` estándar.
  * **Salidas estructuradas** mediante `outputSchema`, con `output.content` y `output.grounding` (citas a nivel de campo y confianza) en la respuesta.

  Consulta la [actualización de precios de Exa](#exa-pricing-update) más abajo para ver los precios completos.

  [Lee la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Actualización de precios de Exa" }}>
  <div id="exa-pricing-update">
    ## Actualización de precios de Exa
  </div>

  Simplificamos y bajamos los precios. Los contents de los primeros 10 resultados de búsqueda ahora se incluyen gratis, y los nuevos precios se aplican automáticamente sin que tengas que hacer nada.

  * **Search con contents**: $7 por cada 1k solicitudes (10 resultados, texto + highlights incluidos); $1 por cada 1k resultados adicionales.
  * **Resúmenes**: $1 por cada 1k, tanto en search como en contents.
  * **Exa Deep**: $12 por cada 1k solicitudes; **Deep (Reasoning)** $15 por cada 1k.
  * **Endpoint de contents**: $1 por cada 1k páginas por tipo de contenido.

  [Ver precios actuales →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Presentamos Exa Instant Search" }}>
  <div id="introducing-exa-instant-search">
    ## Presentamos Exa Instant Search
  </div>

  Exa Instant es nuestro tipo de búsqueda más rápido: combina una mejor calidad de búsqueda neuronal con una latencia inferior a 150 ms. Actívalo con `type="instant"`.

  * **Diseñado para tiempo real**: aplicaciones de chat, IA de voz, agentes de programación, autocompletado y sugerencias en vivo.
  * **Calidad de vanguardia** con la latencia más baja que ofrecemos.

  [Lee la guía de la Search API →](/es/docs/search/quickstart) · [Pruébalo en el panel →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights, frescura del contenido y actualizaciones de MCP" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Highlights, frescura del contenido y actualizaciones de MCP
  </div>

  Tres mejoras en la extracción y el acceso al contenido:

  * **`maxCharacters` para highlights**: ahora es la forma recomendada de controlar la longitud de los highlights. `numSentences` y `highlightsPerUrl` quedan obsoletos.
  * **`maxAgeHours` para la frescura del contenido**: control basado en la antigüedad que reemplaza al booleano `livecrawl` (`0` rastrea siempre, `-1` solo caché, `24` rastrea si tiene más de 24 h).
  * **Nivel gratuito de Exa MCP**: pruébalo sin autenticación a 3 QPS y 150 llamadas/día; agrega una API key para acceso completo.

  [Documentación sobre frescura del contenido →](/es/docs/contents/quickstart#content-freshness) · [Exa MCP →](/es/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Presentamos Exa Company Search" }}>
  <div id="introducing-exa-company-search">
    ## Presentamos Exa Company Search
  </div>

  La búsqueda de empresas ahora utiliza un modelo de recuperación ajustado y una canalización de coincidencia de entidades. Usa `type="auto"`, `category="company"`.

  * **Precisión en todos los atributos**: sector, geografía, etapa de financiación y número de empleados.
  * **Datos estructurados de entidades**: los resultados devuelven información tipada de la empresa (plantilla, sede, datos financieros, tráfico web).
  * **Casos de uso**: prospección comercial, estudios de mercado y flujos de trabajo de cadena de suministro.

  [Consulta la documentación de Companies &amp; People Search →](/es/docs/search/data/companies-people) · [Lee el artículo del blog sobre los benchmarks →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Presentamos Exa People Search" }}>
  <div id="introducing-exa-people-search">
    ## Presentamos Exa People Search
  </div>

  La búsqueda de personas ahora abarca más de 1000 millones de perfiles públicos mediante un sistema de recuperación híbrido. La categoría `linkedin` se sustituye por la nueva categoría `people`.

  * **Mayor cobertura**: perfiles de toda la web, no solo de LinkedIn.
  * **Mejor precisión**: embeddings ajustados para queries de cargo, competencias y empresa.
  * **Casos de uso**: ventas, selección de personal y estudios de mercado.

  [Consulta la documentación de Companies &amp; People Search →](/es/docs/search/data/companies-people) · [Lee el artículo del blog sobre los benchmarks →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "SDK de JS: highlights restaurados" }}>
  <div id="js-sdk-highlights-restored">
    ## SDK de JS: highlights restaurados
  </div>

  Los highlights vuelven al SDK de JavaScript a partir de `exa-js` v2.0.11 y devuelven las frases clave con sus puntuaciones de relevancia. Pasa `highlights: true` o `highlights: { maxCharacters, query }` en las llamadas a search y contents.

  [Consulta la documentación del SDK de JavaScript →](/es/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "Nuevo tipo de búsqueda Deep" }}>
  <div id="new-deep-search-type">
    ## Nuevo tipo de búsqueda Deep
  </div>

  Exa Deep encuentra mejores resultados ejecutando varias búsquedas a la vez y devolviendo contexto de alta calidad para cada resultado. Actívalo con `type="deep"`.

  * **Expansión de queries**: envía una query y generamos variaciones, o aporta las tuyas con `additionalQueries`.
  * **Búsqueda en paralelo y ranking inteligente** entre tu query y todas las variaciones.
  * **Resúmenes detallados** de cada resultado.

  [Consulta la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "Añadido el filtrado por idioma" }}>
  <div id="added-language-filtering">
    ## Añadido el filtrado por idioma
  </div>

  Exa ahora detecta el idioma de tu query y devuelve resultados solo en ese idioma. Está activado por defecto para todos los usuarios, sin configuración adicional.

  [Consulta la guía de la Search API →](/es/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "Cambios en los SDK: highlights eliminados y contents devueltos por defecto" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## Cambios en los SDK: highlights eliminados y contents devueltos por defecto
  </div>

  Una versión mayor del SDK con cambios incompatibles:

  * **Contents por defecto**: search ahora incluye el contenido de la página; desactívalo para búsquedas más rápidas.
  * **Highlights eliminados de los SDK**: posteriormente restaurados en el SDK de JS; consulta [SDK de JS: highlights restaurados](#js-sdk-highlights-restored).
  * **`use_autoprompt` obsoleto**: eliminado de todas las respuestas de la API.

  [Consulta la documentación del SDK de Python →](/es/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "Compatibilidad con filtros de rutas de dominio" }}>
  <div id="domain-path-filter-support">
    ## Compatibilidad con filtros de rutas de dominio
  </div>

  `includeDomains` y `excludeDomains` ahora admiten una segmentación más precisa:

  * **Filtrado por ruta específica**: p. ej., `exa.ai/blog` o `linkedin.com/company`.
  * **Comodines de subdominio**: p. ej., `*.substack.com`.

  Resulta útil para acotar búsquedas a blogs, catálogos de productos o directorios.

  [Consulta la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "Compatibilidad con filtros de geolocalización" }}>
  <div id="geolocation-filter-support">
    ## Compatibilidad con filtros de geolocalización
  </div>

  El nuevo parámetro `userLocation` sesga los resultados hacia la región del usuario y se indica como un código de país [ISO 3166-1 alfa-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (p. ej., `"us"`, `"fr"`). Resulta útil para aplicaciones multirregionales, contenido en idiomas regionales y descubrimiento local.

  [Consulta la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "New Fast Search Type" }}>
  <div id="new-fast-search-type">
    ## Nuevo tipo de search: Fast
  </div>

  Exa Fast usa modelos de search optimizados con una latencia p50 inferior a 425 ms. Actívalo con `type="fast"`.

  * **El mismo índice de Exa** de contenido de alta calidad que el search neuronal.
  * **Compatibilidad total de parámetros** con los demás tipos de search.
  * **Pensado para** grounding web rápido, flujos de trabajo con agentes y productos de baja latencia.

  [Consulta la guía de la Search API →](/es/docs/search/quickstart) · [Pruébalo en el panel →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Score Deprecation in Auto Search" }}>
  <div id="score-deprecation-in-auto-search">
    ## Obsolescencia de score en Auto search
  </div>

  La nueva arquitectura de Auto search ya no puede generar puntuaciones de relevancia significativas, por lo que el campo `score` se eliminará de los resultados de Auto search.

  * **Auto search**: ya no devuelve `score`; los resultados ya vienen ordenados por relevancia.
  * **Search neuronal**: las puntuaciones no cambian. Usa `type="neural"` si dependes de ellas.

  [Consulta la referencia de la Search API →](/es/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Markdown Contents as Default" }}>
  <div id="markdown-contents-as-default">
    ## Contents en markdown por defecto
  </div>

  Todos los endpoints devuelven ahora markdown limpio por defecto, lo cual funciona mejor para LLM, RAG y el procesamiento de texto en general. No necesitas hacer nada.

  * **`includeHtmlTags=false` (por defecto)**: el contenido se procesa como markdown limpio.
  * **`includeHtmlTags=true`**: HTML sin procesar, sin conversión a markdown.

  En ambos casos se elimina el contenido de relleno, como anuncios y menús de navegación.

  [Consulta la documentación de Contents →](/es/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "New Livecrawl Option: Preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## Nueva opción de livecrawl: preferred
  </div>

  <Warning>
    Entrada histórica: el parámetro de cadena `livecrawl` ya está obsoleto. Para nuevas integraciones, usa `maxAgeHours` junto con `livecrawlTimeout`. Consulta [frescura del contenido](/es/docs/contents/quickstart#content-freshness).
  </Warning>

  La opción obsoleta `livecrawl: "preferred"` intenta un rastreo nuevo, pero recurre al contenido en caché cuando el rastreo falla (a diferencia de `"always"`, que devuelve un error). Ideal para aplicaciones en producción que necesitan contenido actualizado sin que fallen por sitios no disponibles temporalmente.

  [Consulta la documentación sobre frescura del contenido →](/es/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Contents Endpoint Status Changes" }}>
  <div id="contents-endpoint-status-changes">
    ## Cambios de estado en el endpoint Contents
  </div>

  `/contents` ahora devuelve un campo `statuses` por URL en lugar de un único error HTTP, de modo que puedes gestionar el resultado de cada URL de forma individual. El endpoint solo devuelve errores ante problemas internos.

  * **`status`**: `"success"` o `"error"` por URL.
  * **`error.tag`**: por ejemplo, `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE`, con un `httpStatusCode`.

  [Consulta la referencia de códigos de error →](/es/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search as Default" }}>
  <div id="auto-search-as-default">
    ## Auto search por defecto
  </div>

  Auto search es ahora la opción por defecto y dirige automáticamente cada query al mejor método de search. No necesitas hacer nada; usa `type="neural"` para mantener el comportamiento anterior.

  [Conoce los tipos de search de Exa →](/es/docs/search/quickstart)
</Update>