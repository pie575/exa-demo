> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="affiliatecom">
  # Affiliate.com
</div>

> Busca en catálogos de productos de comercios y redes de afiliados.

[Affiliate.com](https://affiliate.com) reúne los catálogos de productos de
comercios y redes de afiliados en un único índice consultable, con
precios actualizados, marcas y enlaces directos a los comercios.

Adjunta `affiliate` a un run de [Exa Agent](/es/docs/agent/quickstart) mediante
[Exa Connect](/es/docs/agent/connect/overview) y el agente consultará
Affiliate.com junto con Exa web search.

<div id="use-it-for">
  ## Úsalo para
</div>

* Descubrimiento de productos y comparación de precios entre comercios.
* Impulsar asistentes de compras y contenido de guías de compra.
* Mostrar enlaces de afiliados junto a la investigación.

<div id="provider-id">
  ## ID del proveedor
</div>

Usa este valor en `dataSources`:

```text theme={null}
affiliate
```

<div id="example">
  ## Ejemplo
</div>

Encuentra auriculares inalámbricos con cancelación de ruido por menos de $300 y compara precios.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      data_sources=[{"provider": "affiliate"}],
      output_schema={
          "type": "object",
          "required": ["products"],
          "properties": {
              "products": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "brand", "price", "merchant"],
                      "properties": {
                          "name": {"type": "string"},
                          "brand": {"type": "string"},
                          "price": {"type": "string", "description": "price with currency"},
                          "merchant": {"type": "string"},
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
    query: "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
    dataSources: [{ provider: "affiliate" }],
    outputSchema: {
      type: "object",
      required: ["products"],
      properties: {
        products: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "brand", "price", "merchant"],
            properties: {
              name: { type: "string" },
              brand: { type: "string" },
              price: { type: "string", description: "price with currency" },
              merchant: { type: "string" },
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
      "query": "Find wireless noise-cancelling headphones under $300 with pricing from multiple merchants.",
      "dataSources": [{ "provider": "affiliate" }],
      "outputSchema": {
        "type": "object",
        "required": ["products"],
        "properties": {
          "products": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "brand", "price", "merchant"],
              "properties": {
                "name": { "type": "string" },
                "brand": { "type": "string" },
                "price": { "type": "string", "description": "price with currency" },
                "merchant": { "type": "string" }
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

* [Similarweb](/es/docs/agent/connect/similarweb): mide el alcance de un comercio antes de recomendarlo.
* [Fiber.ai](/es/docs/agent/connect/fiber): investiga la empresa detrás de un comercio o una marca.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Adjúntalo a un run" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir quickstart" arrow="true">
    El quickstart de Exa Connect cubre `dataSources`, los precios y el catálogo completo de partners.
  </Card>

  <Card title="Combina proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer la guía" arrow="true">
    Adjunta hasta cinco partners a un mismo run y plantea la consulta de modo que cada uno se active.
  </Card>

  <Card title="Aprende a usar Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir la guía" arrow="true">
    Crea runs, transmite el progreso, diseña esquemas de output y controla el effort y el costo.
  </Card>

  <Card title="Consigue una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el dashboard y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas incluyen créditos gratis.
  </Card>
</Columns>