> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Registros legales y públicos {#legal-public-records}

> Encuentra sentencias judiciales, patentes, sanctions, contratos públicos y otros registros públicos con Exa Search.

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

Usa Exa Search para acceder a fuentes jurídicas primarias y registros públicos oficiales, junto con los análisis y comentarios escritos sobre ellos.

## Incluido {#included}

* Sentencias judiciales de EE. UU., con texto completo y metadatos de tribunal, expediente y cita
* Patentes concedidas en EE. UU., con resumen, reivindicaciones, descripción, inventores y cesionarios
* Leyes, reglamentos y guidance de agencias
* Listas de sanctions y watchlists
* Contratos públicos y registros de contratación
* Datos censales y otros registros estadísticos públicos

## Úsalo para {#use-it-for}

* Investigación de jurisprudencia y RAG jurídico
* Seguimiento regulatorio y de políticas públicas
* Búsquedas de estado de la técnica y de libertad de operación
* Cribado de cumplimiento normativo y debida diligencia
* Estudios de mercado del sector público

## Consultas de ejemplo {#example-queries}

### Encontrar jurisprudencia {#find-case-law}

Describe la cuestión jurídica y la jurisdicción en lenguaje natural en lugar de usar una cita.

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

### Buscar patentes {#search-patents}

Describe qué hace la invención, tal como lo haría una reivindicación.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

### Cribar contra sanctions {#screen-against-sanctions}

Indica el nombre de la lista y la clase de entidad que estás cribando.

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

### Investigar el gasto público {#research-government-spending}

Indica la agencia compradora o la categoría de servicio y el periodo de tiempo.

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

### Extraer estadísticas públicas {#pull-public-statistics}

Indica el conjunto de datos y la zona geográfica.

<PlaygroundQuery query="census tract population change in the Austin metro area" />

## Realizar una solicitud {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "California appellate decisions on non-compete enforceability",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "California appellate decisions on non-compete enforceability",
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
      "query": "California appellate decisions on non-compete enforceability",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Obtén datos estructurados con Exa Agent {#get-structured-data-with-exa-agent}

Para datos estructurados que requieren investigación en múltiples fuentes, usa un [run de tarea de Exa Agent](/es/docs/agent/quickstart). Describe las jurisdicciones, los tipos de registro, los criteria y los campos de output que necesitas, y Agent devolverá resultados validados contra el esquema y con citas.

<Card title="Inicia una tarea de Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir la guía de Agent" arrow="true">
  Analiza una entidad en distintos tipos de registro o sigue el rastro de un cambio normativo a través de fuentes primarias y su cobertura.
</Card>