> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="cybersecurity">
  # Ciberseguridad
</div>

> Encuentra vulnerabilidades, avisos de seguridad, informes de amenazas y documentación de confianza con Exa Search.

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

Usa Exa Search para obtener registros de vulnerabilidades, avisos de vendors e investigación sobre amenazas desde las fuentes que los equipos de seguridad ya consultan.

<div id="included">
  ## Incluido
</div>

* Registros de vulnerabilidades CVE y GHSA
* Avisos de seguridad de vendors y notas de parches
* Informes de inteligencia de amenazas y análisis de incidentes
* Páginas de confianza, listas de subprocesadores y documentación de cumplimiento
* Blogs de seguridad, charlas de conferencias e investigación

<div id="use-it-for">
  ## Úsalo para
</div>

* Triaje de vulnerabilidades y evaluación de la exposición
* Inteligencia de amenazas y seguimiento de adversarios
* Riesgo de vendors y revisiones de seguridad de terceros
* Monitoreo y alertas de seguridad

<div id="example-queries">
  ## Consultas de ejemplo
</div>

<div id="triage-a-vulnerability-class">
  ### Clasificar una categoría de vulnerabilidades
</div>

Indica el producto, el rango de versiones y la gravedad.

<PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

<div id="find-vendor-advisories">
  ### Encontrar avisos de vendors
</div>

Describe el estado de explotación y la clase de producto en lugar de un solo ID de CVE.

<PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

<div id="review-a-vendors-security-posture">
  ### Revisar la postura de seguridad de un vendor
</div>

Indica el tipo de documento y la categoría del vendor.

<PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />

<div id="research-an-adversary">
  ### Investigar a un adversario
</div>

Indica el grupo o la campaña y la técnica o el sector que te interesa.

<PlaygroundQuery query="reports on ransomware groups targeting healthcare providers this year" />

<div id="make-a-request">
  ## Realizar una solicitud
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "critical CVEs affecting Apache Struts 6.x",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "critical CVEs affecting Apache Struts 6.x",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "critical CVEs affecting Apache Struts 6.x",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Obtener datos estructurados con Exa Agent
</div>

Para datos estructurados que requieren investigación en múltiples fuentes, usa un [run de tarea de Exa Agent](/es/docs/agent/quickstart). Describe los productos, los criteria de amenazas y los campos de output que necesitas, y Agent devolverá resultados validados contra el esquema y con citas.

<Card title="Iniciar una tarea de Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir la guía de Agent" arrow="true">
  Evalúa a un vendor a partir de avisos, reportes de brechas y páginas de confianza, o reúne datos normalizados de vulnerabilidades.
</Card>