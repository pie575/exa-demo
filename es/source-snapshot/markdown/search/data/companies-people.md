> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="companies-people">
  # Empresas y personas
</div>

> Encuentra empresas, perfiles profesionales y las relaciones entre ellos con Exa Search.

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

Usa Exa Search para encontrar organizaciones y las personas vinculadas a ellas. Estas búsquedas funcionan mejor combinadas: describe los rasgos de la empresa que cualifican a una persona, o las personas y los cargos que revelan cómo opera una empresa.

<Columns cols={2}>
  <Card title="Benchmark de recuperación de empresas" icon="building" href="https://exa.ai/blog/company-search-benchmarks">
    Descubre cómo Exa evalúa la recuperación de empresas y la extracción de datos.
  </Card>

  <Card title="Benchmark de recuperación de personas" icon="users" href="https://exa.ai/blog/people-search-benchmark">
    Descubre cómo Exa evalúa las búsquedas dirigidas y el descubrimiento de perfiles.
  </Card>
</Columns>

<div id="use-it-for">
  ## Úsalo para
</div>

* Descubrimiento de empresas, candidatos y expertos
* Investigación de cuentas y mapeo de partes interesadas
* Mapas de mercado, análisis de inversiones y búsqueda de oportunidades de negocio
* Investigación sobre liderazgo, contratación y estructura organizativa

<div id="write-better-queries">
  ## Escribe mejores queries
</div>

Empieza por la entidad que buscas y luego añade los atributos y relaciones que la caracterizan. Indica el tipo de fuente cuando sea relevante: páginas de inicio de empresas, perfiles profesionales, ofertas de empleo o sitios web personales.

<Tabs>
  <Tab title="Empresas" icon="building">
    <div id="discover-companies-by-what-they-do">
      ### Descubre empresas por lo que hacen
    </div>

    Describe el cliente, el producto, la capacidad, la etapa y la geografía que definen el mercado. Así encuentras candidatas según lo que hacen, en lugar de depender de una lista de empresas predefinida.

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    <div id="find-operating-signals">
      ### Encuentra señales operativas
    </div>

    Nombra la señal y los atributos de empresa que importan. Search puede recuperar ofertas de empleo, páginas de precios, documentación de producto e informes, además de páginas de empresas.

    <PlaygroundQuery query="remote staff engineer roles at Series B fintech companies" />

    <div id="research-funding-activity">
      ### Investiga la actividad de financiación
    </div>

    Especifica la ronda, el sector, los participantes y el periodo de tiempo.

    <PlaygroundQuery query="investors who led seed rounds in robotics in the last year" />
  </Tab>

  <Tab title="Personas" icon="users">
    <div id="discover-people-by-role-and-skills">
      ### Descubre personas por rol y habilidades
    </div>

    Combina el rol, la seniority, la ubicación, las habilidades relevantes y el tipo de fuente que quieres.

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    <div id="qualify-people-by-company-traits">
      ### Filtra personas por los atributos de su empresa
    </div>

    Describe la relación de la persona con la empresa y los atributos que caracterizan a esa empresa. Funciona mejor que crear primero una lista de empresas.

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    <div id="find-personal-websites-and-public-work">
      ### Encuentra sitios web personales y trabajo público
    </div>

    Nombra la profesión o el área de investigación y pide explícitamente sitios web personales, charlas, entrevistas o artículos.

    <PlaygroundQuery query="personal blogs of distributed systems researchers" />
  </Tab>
</Tabs>

<div id="search-both-together">
  ## Busca ambos a la vez
</div>

Escribe una sola query que exprese la relación que necesitas. Exa puede devolver páginas de empresas, perfiles profesionales, páginas de empleo y referencias públicas en un mismo conjunto de resultados.

<PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />

<div id="make-a-request">
  ## Realizar una solicitud
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "heads of security at Series B healthcare software companies that sell to hospitals",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "heads of security at Series B healthcare software companies that sell to hospitals",
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
      "query": "heads of security at Series B healthcare software companies that sell to hospitals",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Obtén datos estructurados con Exa Agent
</div>

Para obtener datos estructurados que requieren investigación en múltiples fuentes, usa una [ejecución de tarea de Exa Agent](/es/docs/agent/quickstart). Describe las empresas, las personas, los criterios de calificación y los campos de salida que necesitas, y Agent devolverá resultados validados contra el esquema y con citas.

<Card title="Inicia una tarea de Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir la guía de Agent" arrow="true">
  Crea y califica listas de empresas o personas y enriquece cada registro con campos obtenidos de múltiples fuentes.
</Card>