> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="polymarket">
  # Polymarket
</div>

> Obtén probabilidades de mercados de predicción, historial de precios, libro de órdenes y posiciones de traders.

[Polymarket](https://polymarket.com) es una plataforma de mercados de predicción donde
los precios de mercado representan la implied probability que la multitud asigna a
resultados del mundo real. [Exa Connect](/es/docs/agent/connect/overview) ofrece
acceso de solo lectura a los datos públicos de mercado de Polymarket.

Adjunta `polymarket` a un run de [Exa Agent](/es/docs/agent/quickstart) y el
agente consultará Polymarket junto con Exa web search.

<div id="use-it-for">
  ## Úsalo para
</div>

* Encontrar mercados de predicción y las probabilidades implícitas actuales del mercado sobre un tema.
* Comparar cómo cambió con el tiempo la implied probability de un resultado.
* Inspeccionar la liquidez del mercado, la profundidad de compra/venta y los principales tenedores de posiciones.
* Revisar las posiciones actuales de un trader y su actividad on-chain reciente.

<div id="provider-id">
  ## ID del proveedor
</div>

Usa este valor en `dataSources`:

```text theme={null}
polymarket
```

<div id="pricing">
  ## Precios
</div>

Las APIs de lectura de Polymarket no requieren autenticación y son gratuitas, por lo que las llamadas a herramientas de Polymarket
no tienen costo: solo pagas el
[precio estándar del Agent run](/es/docs/agent/quickstart#pricing).

<div id="data-available">
  ## Datos disponibles
</div>

| Dato                 | Descripción                                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Mercados y eventos   | Mercados de predicción y eventos actuales, con precios de implied probability, volumen y liquidez.                                  |
| Historial de precios | Cómo evolucionó la implied probability de un resultado a lo largo del tiempo.                                                       |
| Libros de órdenes    | Profundidad y spread de compra/venta en tiempo real para el resultado de un mercado.                                                |
| Tenedores y traders  | Principales tenedores de posiciones de un mercado, además de las posiciones actuales y la actividad on-chain reciente de un trader. |

<div id="example">
  ## Ejemplo
</div>

Obtén las market-implied probabilidad de un recorte de tasas de la Fed y cómo han variado durante el último mes.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query=(
          "What are the current market-implied odds of a Fed rate cut at the "
          "next FOMC meeting, and how have they moved over the past month?"
      ),
      data_sources=[{"provider": "polymarket"}],
      output_schema={
          "type": "object",
          "required": ["market", "currentProbability", "trend"],
          "properties": {
              "market": {"type": "string", "description": "the market question"},
              "currentProbability": {"type": "number", "description": "between 0 and 1"},
              "trend": {"type": "string", "description": "how the implied probability moved over the past month"},
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query:
      "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
    dataSources: [{ provider: "polymarket" }],
    outputSchema: {
      type: "object",
      required: ["market", "currentProbability", "trend"],
      properties: {
        market: { type: "string", description: "the market question" },
        currentProbability: { type: "number", description: "between 0 and 1" },
        trend: { type: "string", description: "how the implied probability moved over the past month" },
      },
    },
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "What are the current market-implied odds of a Fed rate cut at the next FOMC meeting, and how have they moved over the past month?",
      "dataSources": [{ "provider": "polymarket" }],
      "outputSchema": {
        "type": "object",
        "required": ["market", "currentProbability", "trend"],
        "properties": {
          "market": { "type": "string", "description": "the market question" },
          "currentProbability": { "type": "number", "description": "between 0 and 1" },
          "trend": { "type": "string", "description": "how the implied probability moved over the past month" }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## Combina bien con
</div>

* [Exa web search](/es/docs/search/quickstart): añade información periodística y contexto de fondo a las probabilidades del mercado.
* [Particle](/es/docs/agent/connect/particle): obtén la cobertura de prensa que hay detrás de un movimiento en las probabilidades.
* [Financial Datasets](/es/docs/agent/connect/financialdatasets): conecta las probabilidades implícitas del mercado con precios, fundamentales y datos macroeconómicos.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Adjúntalo a un run" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir quickstart" arrow="true">
    El quickstart de Exa Connect cubre `dataSources`, los precios y el catálogo completo de partners.
  </Card>

  <Card title="Combina proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer guía" arrow="true">
    Adjunta hasta cinco partners a un mismo run y formula la consulta para que se active cada uno.
  </Card>

  <Card title="Aprende Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Crea runs, transmite el progreso en streaming, diseña esquemas de output y controla el effort y el costo.
  </Card>

  <Card title="Obtén una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el panel y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas empiezan con créditos gratuitos.
  </Card>
</Columns>