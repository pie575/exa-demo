> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="polymarket">
  # Polymarket
</div>

> Obtén probabilidades de mercados de predicción, historial de precios, libros de órdenes y posiciones de los traders.

[Polymarket](https://polymarket.com) es una plataforma de mercados de predicción en la que
los precios de mercado representan la probabilidad implícita que el público asigna a
resultados del mundo real. [Exa Connect](/es/docs/agent/connect/overview) ofrece
acceso de solo lectura a los datos públicos de mercado de Polymarket.

Adjunta `polymarket` a una ejecución de [Exa Agent](/es/docs/agent/quickstart) y el agent
consultará Polymarket junto con la web search de Exa.

<div id="use-it-for">
  ## Úsalo para
</div>

* Encontrar mercados de predicción y las probabilidades actuales implícitas del mercado sobre un tema.
* Comparar cómo cambió con el tiempo la probabilidad implícita de un resultado.
* Analizar la liquidez del mercado, la profundidad de bid/ask y los mayores tenedores de posiciones.
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

Las APIs de lectura de Polymarket no requieren autenticación y son gratuitas, por lo que las llamadas a las herramientas de Polymarket
no tienen ningún costo: solo pagas el
[precio estándar de las ejecuciones de Agent](/es/docs/agent/quickstart#pricing).

<div id="data-available">
  ## Datos disponibles
</div>

| Datos                  | Descripción                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Mercados y eventos     | Mercados de predicción y eventos vigentes, con precios de probabilidad implícita, volumen y liquidez.                                 |
| Historial de precios   | Cómo evolucionó en el tiempo la probabilidad implícita de un resultado.                                                               |
| Libros de órdenes      | Profundidad y diferencial (spread) de compra/venta en tiempo real para el resultado de un mercado.                                    |
| Tenedores y traders | Principales tenedores de posiciones de un mercado, además de las posiciones actuales de un trader y su actividad reciente on-chain. |

<div id="example">
  ## Ejemplo
</div>

Obtén las probabilidades implícitas del mercado sobre un recorte de tasas de la Fed y cómo han variado durante el último mes.

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

* [Exa web search](/es/docs/search/quickstart): añade cobertura periodística y contexto de fondo a las probabilidades del mercado.
* [Particle](/es/docs/agent/connect/particle): obtén la cobertura informativa que hay detrás de un movimiento en las probabilidades.
* [Financial Datasets](/es/docs/agent/connect/financialdatasets): conecta las probabilidades implícitas del mercado con precios, fundamentales y datos macroeconómicos.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Adjúntalo a una ejecución" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir guía rápida" arrow="true">
    La guía rápida de Exa Connect cubre `dataSources`, los precios y el catálogo completo de partners.
  </Card>

  <Card title="Combinar proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer guía" arrow="true">
    Adjunta hasta cinco partners a una misma ejecución y formula la query de modo que se active cada uno.
  </Card>

  <Card title="Aprende Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Crea ejecuciones, transmite el progreso en streaming, diseña esquemas de salida y controla el effort y el costo.
  </Card>

  <Card title="Obtén una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el dashboard y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas incluyen credits gratuitos.
  </Card>
</Columns>