> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Deportes, clima y lugares {#sports-weather-places}

> Encuentra datos deportivos en vivo, pronósticos del clima y lugares cercanos con Exa Search.

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

Usa Exa Search para obtener datos deportivos en vivo, pronósticos del tiempo e información local sin integrar una API distinta para cada caso. Haz una pregunta en lenguaje natural que incluya el equipo, el lugar y el periodo de tiempo que te interesan.

## Escribe mejores consultas {#write-better-queries}

Nombra la ubicación o el equipo con precisión e incluye una fecha siempre que la respuesta cambie con el tiempo. Añade la condición o el atributo que importa para tu tarea en lugar de pedir información genérica.

<Tabs>
  <Tab title="Deportes" icon="trophy">
### Incluido {#included}

    Datos deportivos disponibles:

    * **Marcadores**: partidos de una liga en un día, con equipos, resultados, estado, hora de inicio y sede
    * **Clasificaciones**: tablas de liga actuales, desglosadas por conferencia o división
    * **Calendarios**: resultados pasados y próximos partidos de una liga o equipo

    La cobertura incluye la NBA, la WNBA, la NFL, la MLB, la NHL, la MLS, baloncesto y fútbol americano universitarios, las principales ligas europeas de fútbol y las competiciones de la UEFA, críquet, F1, UFC, tenis y golf.

### Indica la liga, el equipo y el momento {#ask-for-the-league-team-and-time}

    <PlaygroundQuery query="NBA scores last night" />

    <PlaygroundQuery query="Lakers schedule this week" />

### Añade el contexto informativo {#add-the-surrounding-story}

    Pide la cobertura periodística que necesitas junto con los datos en vivo.

    <PlaygroundQuery query="NBA injury reports ahead of tonight's games" />
  </Tab>

  <Tab title="Clima" icon="cloud-sun">
### Incluido {#included-2}

    Los pronósticos incluyen condiciones, temperaturas máximas y mínimas, precipitación, viento, humedad, índice UV y horas de salida y puesta del sol en la hora local del lugar.

    Una consulta sin fecha devuelve el pronóstico de hoy. Pide un día o un rango concretos para obtener una página por día, hasta 16 días hacia adelante o 92 días hacia atrás.

### Indica el lugar y el día {#name-the-place-and-day}

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

### Pregunta por la condición que afecta a tus planes {#ask-about-the-condition-that-affects-your-plan}

    <PlaygroundQuery query="will it rain in Austin this weekend" />

### Combina pronósticos con cobertura informativa {#combine-forecasts-with-reporting}

    <PlaygroundQuery query="hurricane forecast tracks for the Gulf Coast this week" />
  </Tab>

  <Tab title="Lugares" icon="map-pin">
### Incluido {#included-3}

    * Perfiles de negocios locales, con direcciones, horarios, servicios y reseñas
    * Recintos, atracciones y puntos de interés
    * Anuncios inmobiliarios y registros de propiedades
    * Decisiones de zonificación, permisos y registros de planificación urbana

### Describe el lugar como se lo preguntarías a alguien del barrio {#describe-the-place-like-you-would-ask-a-local}

    Combina la categoría, la zona y los atributos que importan.

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />

### Indica el tipo de registro y la zona geográfica {#name-the-record-type-and-geography}

    <PlaygroundQuery query="multifamily zoning variances approved in Denver" />

### Compara lugares según restricciones prácticas {#compare-places-against-practical-constraints}

    <PlaygroundQuery query="walkable neighborhoods in Austin with good public schools and under 30 minutes to downtown" />
  </Tab>
</Tabs>

## Realiza una solicitud {#make-a-request}

Los tres tipos de datos usan el mismo endpoint de Search.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "weather in San Francisco tomorrow",
      type="auto",
      num_results=5,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("weather in San Francisco tomorrow", {
    type: "auto",
    numResults: 5,
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "weather in San Francisco tomorrow",
      "type": "auto",
      "numResults": 5
    }'
  ```
</CodeGroup>

## Obtén datos estructurados con Exa Agent {#get-structured-data-with-exa-agent}

Para datos estructurados que requieren investigación en múltiples fuentes, usa un [run de tarea de Exa Agent](/es/docs/agent/quickstart). Describe los lugares, equipos, fechas, criteria y campos de output que necesitas, y Agent devolverá resultados validados contra el esquema y con citas.

<Card title="Inicia una tarea de Agent" icon="bot" href="/es/docs/agent/quickstart" cta="Abrir la guía de Agent" arrow="true">
  Compara lugares, prepara un resumen para el día del partido o combina detalles locales y condiciones en resultados estructurados.
</Card>