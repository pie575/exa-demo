> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Financial Datasets {#financial-datasets}

> Datos financieros y de mercado estructurados para más de 27.000 tickers de EE. UU.: precios, fundamentales, resultados, documentos presentados ante la SEC, participación accionarial y cribado de acciones.

[Financial Datasets](https://financialdatasets.ai) ofrece datos de empresas y
de mercado listos para su uso por agentes de IA. A través de
[Exa Connect](/es/docs/agent/connect/overview), los agentes pueden obtener
precios en tiempo real e históricos, datos de empresas, estados financieros y
métricas de valoración, resultados, propiedad de directivos e institucional,
documentos presentados ante la SEC y sus secciones, noticias de empresas, además
de cribar el mercado estadounidense con criteria fundamentales.

Adjunta `financial_datasets` a un run de [Exa Agent](/es/docs/agent/quickstart)
y el agente consultará Financial Datasets junto con Exa web search.

## Úsalo para {#use-it-for}

* Crear instantáneas estructuradas de investigación de empresas.
* Analizar el rendimiento financiero, la valoración y las tendencias históricas.
* Leer documentos presentados ante la SEC y extraer secciones como los factores de riesgo y el MD&amp;A.
* Examinar las transacciones de directivos y la participación institucional.
* Cribar el mercado estadounidense según criteria fundamentales.
* Monitorear noticias de empresas y novedades relevantes.

## Datos disponibles {#data-available}

Cada uno de los siguientes conjuntos de datos está disponible en el proveedor
`financial_datasets`; el agente selecciona el que mejor se ajuste a la tarea:

| Conjunto de datos                               | Qué devuelve                                                                                                                           |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Propiedad beneficiaria                          | Propietarios beneficiarios con el 5% o más, según los Schedules 13D/13G, incluidas participaciones activistas y pasivas.               |
| Datos de la empresa                             | Nombre, sector, industria, mercado, ubicación, CIK de la SEC, clasificación SIC.                                                       |
| Noticias de empresas                            | Artículos de noticias recientes sobre un ticker.                                                                                       |
| Resultados                                      | Ingresos y BPA trimestrales con variación interanual y sorpresas por encima o por debajo de lo previsto.                               |
| Métricas financieras                            | Capitalización bursátil, EV, P/E, P/B, P/S, EV/EBITDA, PEG, márgenes, ROE/ROA/ROIC, crecimiento, BPA.                                  |
| Estados financieros                             | Cuenta de resultados, balance y flujo de caja a partir de documentos presentados ante la SEC.                                          |
| Precios históricos de acciones                  | Barras OHLCV en un rango de fechas con granularidad diaria, semanal, mensual o anual.                                                  |
| Participaciones de fondos indexados             | Componentes de ETF y fondos indexados por peso, o los fondos que poseen un valor determinado.                                          |
| Propiedad de directivos                         | Participaciones de directivos según los formularios 3 y 5 de la SEC (acciones en manos de directivos, consejeros y titulares del 10%). |
| Operaciones de directivos                       | Transacciones de directivos del formulario 4 de la SEC (nombre, cargo, tipo, acciones, valor).                                         |
| Participación institucional                     | Titulares institucionales 13F, acciones y valor declarado.                                                                             |
| Tipos de interés                                | Tipos de política monetaria actuales e históricos de bancos centrales (Fed, BCE, BOJ y otros).                                         |
| Apartados de documentos presentados ante la SEC | Texto extraído de apartados concretos de los 10-K/10-Q/8-K (por ejemplo, factores de riesgo, MD&amp;A).                                |
| Documentos presentados ante la SEC              | Metadatos de los documentos y enlaces directos a EDGAR, con filtrado opcional por tipo de formulario.                                  |
| Finanzas segmentadas                            | Ingresos, resultado operativo y otras partidas desglosadas por producto, segmento de negocio y geografía.                              |
| Instantánea del precio de la acción             | Precio actual en tiempo real, variación del día y hora de la cotización.                                                               |
| Buscador de acciones                            | Empresas que cumplen criteria de filtrado fundamentales.                                                                              |

## ID del proveedor {#provider-id}

Usa este valor en `dataSources`:

```text theme={null}
financial_datasets
```

## Ejemplo {#example}

Crea una instantánea estructurada con la investigación sobre la empresa NVIDIA.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "Analyze NVIDIA using its latest price, valuation metrics, most recent "
          "quarterly financial statements and earnings, institutional and insider "
          "activity, and material SEC filing sections. Return a structured "
          "company-research snapshot with reporting dates."
      ),
      data_sources=[{"provider": "financial_datasets"}],
      output_schema={
          "type": "object",
          "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
          "properties": {
              "ticker": {"type": "string"},
              "price": {
                  "type": "object",
                  "required": ["latest", "asOf"],
                  "properties": {
                      "latest": {"type": "number"},
                      "asOf": {"type": "string"},
                  },
              },
              "valuation": {
                  "type": "object",
                  "properties": {
                      "marketCap": {"type": "number"},
                      "peRatio": {"type": "number"},
                      "evToEbitda": {"type": "number"},
                  },
              },
              "financials": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "earnings": {
                  "type": "object",
                  "required": ["reportPeriod", "summary"],
                  "properties": {
                      "reportPeriod": {"type": "string"},
                      "summary": {"type": "string"},
                  },
              },
              "ownership": {
                  "type": "object",
                  "properties": {
                      "institutionalHighlights": {"type": "string"},
                      "insiderActivity": {"type": "string"},
                  },
              },
              "filings": {
                  "type": "array",
                  "maxItems": 5,
                  "items": {
                      "type": "object",
                      "required": ["formType", "filedAt", "keySection"],
                      "properties": {
                          "formType": {"type": "string"},
                          "filedAt": {"type": "string"},
                          "keySection": {"type": "string"},
                      },
                  },
              },
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
    dataSources: [{ provider: "financial_datasets" }],
    outputSchema: {
      type: "object",
      required: ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
      properties: {
        ticker: { type: "string" },
        price: {
          type: "object",
          required: ["latest", "asOf"],
          properties: {
            latest: { type: "number" },
            asOf: { type: "string" },
          },
        },
        valuation: {
          type: "object",
          properties: {
            marketCap: { type: "number" },
            peRatio: { type: "number" },
            evToEbitda: { type: "number" },
          },
        },
        financials: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        earnings: {
          type: "object",
          required: ["reportPeriod", "summary"],
          properties: {
            reportPeriod: { type: "string" },
            summary: { type: "string" },
          },
        },
        ownership: {
          type: "object",
          properties: {
            institutionalHighlights: { type: "string" },
            insiderActivity: { type: "string" },
          },
        },
        filings: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            required: ["formType", "filedAt", "keySection"],
            properties: {
              formType: { type: "string" },
              filedAt: { type: "string" },
              keySection: { type: "string" },
            },
          },
        },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Analyze NVIDIA using its latest price, valuation metrics, most recent quarterly financial statements and earnings, institutional and insider activity, and material SEC filing sections. Return a structured company-research snapshot with reporting dates.",
      "dataSources": [{ "provider": "financial_datasets" }],
      "outputSchema": {
        "type": "object",
        "required": ["ticker", "price", "valuation", "financials", "earnings", "ownership", "filings"],
        "properties": {
          "ticker": { "type": "string" },
          "price": {
            "type": "object",
            "required": ["latest", "asOf"],
            "properties": {
              "latest": { "type": "number" },
              "asOf": { "type": "string" }
            }
          },
          "valuation": {
            "type": "object",
            "properties": {
              "marketCap": { "type": "number" },
              "peRatio": { "type": "number" },
              "evToEbitda": { "type": "number" }
            }
          },
          "financials": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "earnings": {
            "type": "object",
            "required": ["reportPeriod", "summary"],
            "properties": {
              "reportPeriod": { "type": "string" },
              "summary": { "type": "string" }
            }
          },
          "ownership": {
            "type": "object",
            "properties": {
              "institutionalHighlights": { "type": "string" },
              "insiderActivity": { "type": "string" }
            }
          },
          "filings": {
            "type": "array",
            "maxItems": 5,
            "items": {
              "type": "object",
              "required": ["formType", "filedAt", "keySection"],
              "properties": {
                "formType": { "type": "string" },
                "filedAt": { "type": "string" },
                "keySection": { "type": "string" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Combina bien con {#pairs-well-with}

* [Particle](/es/docs/agent/connect/particle): compara la cobertura publicada con los comentarios de pódcast.
* [Baselayer](/es/docs/agent/connect/baselayer): verifica la entidad que hay detrás de un ticker.
* [Fiber.ai](/es/docs/agent/connect/fiber): enriquece una empresa cotizada con pares del mercado privado y contactos de su equipo directivo.

## Próximos pasos {#next-steps}

<Columns cols={2}>
  <Card title="Adjúntalo a un run" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir quickstart" arrow="true">
    El quickstart de Exa Connect cubre `dataSources`, los precios y el catálogo completo de partners.
  </Card>

  <Card title="Combina proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer guía" arrow="true">
    Adjunta hasta cinco partners a un mismo run y formula la consulta de modo que cada uno se active.
  </Card>

  <Card title="Aprende a usar Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Crea runs, transmite el progreso en tiempo real, diseña esquemas de output y controla el effort y el costo.
  </Card>

  <Card title="Consigue una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el panel y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas incluyen créditos gratuitos.
  </Card>
</Columns>