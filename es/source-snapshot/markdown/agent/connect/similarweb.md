> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="similarweb">
  # Similarweb
</div>

> Obtén estimaciones de tráfico de sitios web, rankings globales y descubrimiento de competidores.

[Similarweb](https://www.similarweb.com) es una de las principales fuentes de
inteligencia de mercado digital. Modela el tráfico y la interacción de millones de sitios web y
aplicaciones, e incluye visitas estimadas, fuentes de tráfico, demografía de la audiencia y el
conjunto competitivo en torno a cualquier dominio.

Adjunta `similarweb` a un run de [Exa Agent](/es/docs/agent/quickstart) mediante
[Exa Connect](/es/docs/agent/connect/overview) y el agente consultará
Similarweb junto con Exa web search.

<div id="use-it-for">
  ## Úsalo para
</div>

* Comparar el tráfico web y el engagement de una empresa con los de empresas similares.
* Mapear los competidores de un dominio y los sitios con audiencia coincidente.
* Dimensionar mercados y cribar empresas según su huella digital.
* Enriquecer la investigación de empresas y categorías con datos reales de comportamiento.

<div id="provider-id">
  ## ID del proveedor
</div>

Usa este valor en `dataSources`:

```text theme={null}
similarweb
```

<div id="pricing">
  ## Precios
</div>

Similarweb factura en créditos de datos a `$0.30 / credit`, y cada llamada se cobra
según los créditos que Similarweb informa para ella. Los créditos aumentan con los datos devueltos:
aproximadamente un crédito por punto de datos (métrica × fila × mes), por lo que el precio de una llamada
lo determinan sus parámetros:

| Herramienta                      | Créditos                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| Tráfico y ranking                | hasta 7 por mes solicitado (1–2 meses)                                                         |
| Sitios similares                 | 3 por sitio devuelto (1–5 sitios)                                                              |
| Fuentes de tráfico               | 10                                                                                             |
| Principales referentes           | 3 por referente devuelto (1–5)                                                                 |
| Principales países               | 3 por país devuelto (1–5)                                                                      |
| Principales páginas              | 2 por página devuelta (1–7)                                                                    |
| Principales palabras clave       | 1–10 (alrededor de 1 por cada 100 puntos de datos de palabras clave; 50 palabras clave son ~7) |
| Resumen de palabras clave        | 1–2                                                                                            |
| Demografía de la audiencia       | 8                                                                                              |
| Solapamiento de audiencia        | 2 por combinación de dominios (2–3 dominios: 6–14)                                             |
| Tecnologías                      | 10                                                                                             |
| Principales sitios por categoría | 1 por sitio devuelto (1–10)                                                                    |

Las llamadas que no devuelven datos (un dominio desconocido o con poco tráfico, una palabra clave sin
volumen de búsqueda) son gratuitas. `numResults` y `months` determinan por cuántos puntos de datos
pagas, así que mantenlos tan bajos como lo permita la tarea.

<div id="example">
  ## Ejemplo
</div>

Encuentra 10 empresas SaaS B2B de rápido crecimiento y su tráfico web estimado.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      data_sources=[{"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "monthlyVisits"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "monthlyVisits": {"type": "number", "description": "from Similarweb"},
                      },
                  },
              }
          },
      },
  )
  run = exa.agent.runs.poll_until_finished(run.id)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();
  const run = await exa.agent.runs.create({
    query: "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
    dataSources: [{ provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "monthlyVisits"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Find 10 fast-growing B2B SaaS companies and their estimated web traffic.",
      "dataSources": [{ "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "monthlyVisits"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "monthlyVisits": { "type": "number", "description": "from Similarweb" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="pairs-well-with">
  ## Combina bien con
</div>

* [Fiber.ai](/es/docs/agent/connect/fiber): convierte los competidores descubiertos en registros de empresas enriquecidos.
* [Affiliate.com](/es/docs/agent/connect/affiliatecom): evalúa el alcance de un comercio antes de recomendar sus productos.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Adjúntalo a un run" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir quickstart" arrow="true">
    El quickstart de Exa Connect cubre `dataSources`, los precios y el catálogo completo de partners.
  </Card>

  <Card title="Combina proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer la guía" arrow="true">
    Adjunta hasta cinco partners a un mismo run y formula la consulta para que todos se activen.
  </Card>

  <Card title="Aprende a usar Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir la guía" arrow="true">
    Crea runs, transmite el progreso en streaming, diseña esquemas de output y controla el effort y el costo.
  </Card>

  <Card title="Obtén una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el panel y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas empiezan con créditos gratuitos.
  </Card>
</Columns>