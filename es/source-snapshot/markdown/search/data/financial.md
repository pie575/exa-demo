> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="financial-markets">
  # Mercados financieros
</div>

> Encuentra datos de mercado, informes regulatorios, llamadas de resultados y publicaciones económicas con Exa Search.

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
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="Abrir en el playground de la API" aria-label={`Abrir "${query}" en el playground de la API`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Usa Exa Search para obtener precios, informes regulatorios, transcripciones y la cobertura informativa en torno a ellos en una sola query. Una pregunta sobre un ticker puede devolver la cotización, la última llamada de resultados y el análisis de los analistas, todo junto.

<div id="included">
  ## Incluido
</div>

* Cotizaciones e historial reciente de precios de acciones, criptomonedas, divisas, índices, futuros, opciones y materias primas
* Perfiles de valores con estadísticas clave e historial diario OHLCV
* Transcripciones de llamadas de resultados, con comentarios preparados y turno de preguntas y respuestas atribuidos a cada interlocutor
* Informes regulatorios presentados ante la SEC, estados financieros reportados y presentaciones regulatorias internacionales
* Estimaciones de analistas, anuncios de financiación y publicaciones económicas

<div id="use-it-for">
  ## Úsalo para
</div>

* Análisis de renta variable y crédito
* KYC, KYB y screening de medios adversos
* Monitorización de carteras y políticas
* Originación de operaciones e investigación de mercados privados

<div id="example-queries">
  ## Consultas de ejemplo
</div>

<div id="look-up-a-quote">
  ### Consultar una cotización
</div>

Indica el ticker o la empresa y el dato que buscas. También funciona un cashtag como `$NVDA`.

<PlaygroundQuery query="NVIDIA stock price and change today" />

<div id="read-an-earnings-call">
  ### Leer una llamada de resultados
</div>

Indica la empresa y el trimestre para obtener la transcripción en lugar de las noticias sobre ella.

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

<div id="search-filings">
  ### Buscar informes regulatorios
</div>

Describe la información que buscas, no solo el tipo de formulario. La categoría `financial report` restringe los resultados a informes regulatorios e informes.

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

<div id="track-private-market-activity">
  ### Seguir la actividad del mercado privado
</div>

Especifica la ronda, el sector y el periodo de tiempo.

<PlaygroundQuery query="Rondas de Serie B en tecnología climática anunciadas este trimestre" />

<div id="follow-economic-data">
  ### Seguir datos económicos
</div>

Indica la publicación y la cifra que quieres obtener de ella.

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

<div id="make-a-request">
  ## Realizar una solicitud
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "10-K risk factors that mention dependency on third-party AI models",
      type="auto",
      category="financial report",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "10-K risk factors that mention dependency on third-party AI models",
    {
      type: "auto",
      category: "financial report",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "10-K risk factors that mention dependency on third-party AI models",
      "type": "auto",
      "category": "financial report",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Obtén datos estructurados con Exa Agent
</div>

Para datos estructurados que requieren investigación en múltiples fuentes, usa una [ejecución de tarea de Exa Agent](/es/docs/agent/quickstart). Describe los valores, los periodos, los criteria y los campos de salida que necesitas, y Agent devolverá resultados validados contra el esquema y con citas.

<Card title="Inicia una tarea de Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir la guía de Agent" arrow="true">
  Filtra empresas, compara informes regulatorios o elabora un informe estructurado de toda una cartera.
</Card>