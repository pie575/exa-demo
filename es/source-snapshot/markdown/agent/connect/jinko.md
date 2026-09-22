> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Jinko {#jinko}

> Búsqueda de vuelos y hoteles con precios en tiempo real.

[Jinko](https://gojinko.com) es una plataforma de búsqueda de viajes que ofrece
búsqueda de vuelos y hoteles con precios en tiempo real. Busca ofertas de vuelos en tiempo real para una ruta y
fecha, consulta habitaciones y tarifas de hotel para un destino o alojamientos concretos, y
explora destinos a los que puedes llegar desde tus aeropuertos de salida.

Adjunta `jinko` a un run de [Exa Agent](/es/docs/agent/quickstart) mediante
[Exa Connect](/es/docs/agent/connect/overview), y el agente consultará
Jinko junto con Exa web search.

## Úsalo para {#use-it-for}

* Buscar ofertas de vuelos en tiempo real con tarifas, equipaje y políticas de cambio para una ruta y fecha.
* Encontrar hoteles con tarifas de habitación en tiempo real para un destino, o volver a consultar hoteles concretos.
* Descubrir destinos y fechas flexibles en distintos rangos de fechas, clases de cabina y presupuestos.

## ID del proveedor {#provider-id}

Usa este valor en `dataSources`:

```text theme={null}
jinko
```

## Ejemplo {#example}

Encuentra destinos de playa a los que se pueda llegar desde Nueva York por menos de $400 ida y vuelta en marzo.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Find beach destinations reachable from New York for under $400 round-trip in March.",
      data_sources=[{"provider": "jinko"}],
      output_schema={
          "type": "object",
          "required": ["destinations"],
          "properties": {
              "destinations": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["city", "iataCode", "lowestFare"],
                      "properties": {
                          "city": {"type": "string"},
                          "iataCode": {"type": "string"},
                          "lowestFare": {"type": "number", "description": "round-trip fare in USD"},
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
    query: "Find beach destinations reachable from New York for under $400 round-trip in March.",
    dataSources: [{ provider: "jinko" }],
    outputSchema: {
      type: "object",
      required: ["destinations"],
      properties: {
        destinations: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["city", "iataCode", "lowestFare"],
            properties: {
              city: { type: "string" },
              iataCode: { type: "string" },
              lowestFare: { type: "number", description: "round-trip fare in USD" },
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
      "query": "Find beach destinations reachable from New York for under $400 round-trip in March.",
      "dataSources": [{ "provider": "jinko" }],
      "outputSchema": {
        "type": "object",
        "required": ["destinations"],
        "properties": {
          "destinations": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["city", "iataCode", "lowestFare"],
              "properties": {
                "city": { "type": "string" },
                "iataCode": { "type": "string" },
                "lowestFare": { "type": "number", "description": "round-trip fare in USD" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Combina bien con {#pairs-well-with}

* [Similarweb](/es/docs/agent/connect/similarweb): investiga los sitios de viajes y las plataformas de reservas que hay detrás de un destino.
* [Particle](/es/docs/agent/connect/particle): obtén cobertura reciente y comentarios de viaje sobre un lugar.

## Próximos pasos {#next-steps}

<Columns cols={2}>
  <Card title="Adjúntalo a un run" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir quickstart" arrow="true">
    El quickstart de Exa Connect cubre `dataSources`, los precios y el catálogo completo de partners.
  </Card>

  <Card title="Combina proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer guía" arrow="true">
    Adjunta hasta cinco partners a un mismo run y formula la consulta para que se active cada uno.
  </Card>

  <Card title="Aprende a usar Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Crea runs, transmite el progreso en streaming, diseña esquemas de output y controla el effort y el costo.
  </Card>

  <Card title="Obtén una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el panel y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas empiezan con créditos gratuitos.
  </Card>
</Columns>