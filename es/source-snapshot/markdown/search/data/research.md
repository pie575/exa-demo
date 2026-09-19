> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="research-publications">
  # Publicaciones de investigación
</div>

> Encuentra artículos académicos, patentes, subvenciones, ensayos clínicos y aprobaciones regulatorias con Exa Search.

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Abrir en el entorno de pruebas de la API" aria-label={`Abrir "${query}" en el entorno de pruebas de la API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Usa Exa Search para buscar publicaciones de investigación y registros relacionados, incluidos títulos, resúmenes, autores, medios de publicación, citas, páginas de editoriales, preprints y páginas de repositorios.

<Tip>
  Lee [SOTA Search Over Academic Publications](https://exa.ai/blog/publications-search)
  para conocer más sobre la calidad de la búsqueda de publicaciones.
</Tip>

<div id="included">
  ## Incluido
</div>

* Artículos y preprints, incluidos fragmentos del texto completo cuando existe un texto completo procesado
* Patentes, con resúmenes, reivindicaciones, inventores y titulares
* Subvenciones y anuncios de financiación
* Ensayos clínicos, fichas técnicas de medicamentos y datos de interacciones
* Aprobaciones regulatorias y sanitarias

<div id="use-it-for">
  ## Úsalo para
</div>

* Revisión bibliográfica y búsqueda de citas
* Búsqueda de estado de la técnica y análisis del panorama de patentes
* Investigación clínica y farmacéutica
* Identificación de subvenciones y oportunidades de financiación

<div id="example-queries">
  ## Consultas de ejemplo
</div>

<div id="find-papers-on-a-topic">
  ### Encontrar artículos sobre un tema
</div>

Describe el método o el hallazgo en lugar de intentar adivinar palabras clave del título. La categoría `publication` restringe los resultados a artículos.

<PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" category="publication" />

<div id="search-clinical-evidence">
  ### Buscar evidencia clínica
</div>

Especifica la fase, la intervención y la población para que los registros de ensayos clínicos y las páginas de resultados se posicionen por encima de la cobertura general.

<PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

<div id="track-regulatory-approvals">
  ### Hacer seguimiento de aprobaciones regulatorias
</div>

Indica el organismo regulador y el dispositivo o la clase de medicamento que te interesa seguir.

<PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />

<div id="run-a-prior-art-search">
  ### Ejecuta una búsqueda de estado de la técnica
</div>

Describe la invención de forma funcional, tal como lo haría una reivindicación, en lugar de usar un nombre de producto.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="make-a-request">
  ## Haz una solicitud
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "papers on evaluation benchmarks for retrieval-augmented generation",
      type="auto",
      category="publication",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "papers on evaluation benchmarks for retrieval-augmented generation",
    {
      type: "auto",
      category: "publication",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "papers on evaluation benchmarks for retrieval-augmented generation",
      "type": "auto",
      "category": "publication",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Obtén datos estructurados con Exa Agent
</div>

Para datos estructurados que requieren investigar en múltiples fuentes, usa una [ejecución de tarea de Exa Agent](/es/docs/agent/quickstart). Describe las publicaciones, los criterios de inclusión y los campos de salida que necesitas, y Agent devolverá resultados validados contra el esquema y con citas.

<Card title="Inicia una tarea de Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir la guía de Agent" arrow="true">
  Crea un mapa bibliográfico, filtra artículos según criterios de inclusión o reúne en una sola tabla los campos de varias publicaciones.
</Card>