> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="baselayer">
  # Baselayer
</div>

> Verifica empresas de EE. UU. y obtén datos de KYB: directivos, registros y puntuaciones de riesgo.

[Baselayer](https://baselayer.com) es una plataforma de Know Your Business (KYB) que
verifica entidades de EE. UU. con datos oficiales de registro y riesgo. Identifica
una empresa por nombre y dirección y devuelve su perfil completo: directivos,
registros estatales, estructura de la entidad y estado de verificación.

Adjunta `baselayer` a una ejecución de [Exa Agent](/es/docs/agent/quickstart) mediante
[Exa Connect](/es/docs/agent/connect/overview) y el agente consultará
Baselayer junto con la búsqueda web de Exa.

<div id="use-it-for">
  ## Úsalo para
</div>

* Onboarding KYB y verificación de proveedores/clientes.
* Diligencia debida sobre directivos, registros y estructura societaria.
* Cribado de empresas para detectar riesgos y coincidencias en listas de vigilancia.

<div id="provider-id">
  ## ID del proveedor
</div>

Usa este valor en `dataSources`:

```text theme={null}
baselayer
```

<div id="pricing">
  ## Precios
</div>

Baselayer factura por pedido, y la tarifa depende de la operación y sus
parámetros:

| Operación                                                                     | Precio                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------- |
| Búsqueda de empresas                                                          | `$1.00 / search`                            |
| Consulta de empresa / directivos / registros / búsqueda inversa de directivos | Gratis (lecturas de una search previa)      |
| Búsqueda de gravámenes                                                        | `$2.00 / state searched`                    |
| Búsqueda de litigios                                                          | `$1.00 / category (litigation, bankruptcy)` |
| Cribado de listas de vigilancia                                               | `$0.10 – $0.25 / list requested`            |
| Clasificación sectorial                                                       | `$0.35 / call`                              |
| Análisis de sitio web                                                         | `$0.35 / call`                              |
| Presencia web                                                                 | `$0.15 – $0.35 / selected analysis`         |
| Búsqueda internacional de empresas                                            | `$4.00 / search`                            |

La elección de parámetros modifica el precio: una búsqueda de gravámenes en dos estados cuesta
$4.00, un cribado de las seis listas de vigilancia admitidas cuesta $1.35 y una llamada de
presencia web equivale a la suma de los análisis que selecciones (o del conjunto
predeterminado de Baselayer —predicción NAICS y análisis de sitio web— si no seleccionas ninguno).

<div id="example">
  ## Ejemplo
</div>

Verifica una empresa y obtén los datos de sus directivos y de su registro.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
      data_sources=[{"provider": "baselayer"}],
      output_schema={
          "type": "object",
          "required": ["business"],
          "properties": {
              "business": {
                  "type": "object",
                  "required": ["name", "verified", "incorporationState", "officers"],
                  "properties": {
                      "name": {"type": "string"},
                      "verified": {"type": "boolean"},
                      "incorporationState": {"type": "string"},
                      "officers": {
                          "type": "array",
                          "items": {
                              "type": "object",
                              "required": ["name", "title"],
                              "properties": {
                                  "name": {"type": "string"},
                                  "title": {"type": "string"},
                              },
                          },
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
    query: "Verify the business 'Stripe, Inc.' in San Francisco, CA and return its officers and registration status.",
    dataSources: [{ provider: "baselayer" }],
    outputSchema: {
      type: "object",
      required: ["business"],
      properties: {
        business: {
          type: "object",
          required: ["name", "verified", "incorporationState", "officers"],
          properties: {
            name: { type: "string" },
            verified: { type: "boolean" },
            incorporationState: { type: "string" },
            officers: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "title"],
                properties: {
                  name: { type: "string" },
                  title: { type: "string" },
                },
              },
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
      "query": "Verify the business Stripe, Inc. in San Francisco, CA and return its officers and registration status.",
      "dataSources": [{ "provider": "baselayer" }],
      "outputSchema": {
        "type": "object",
        "required": ["business"],
        "properties": {
          "business": {
            "type": "object",
            "required": ["name", "verified", "incorporationState", "officers"],
            "properties": {
              "name": { "type": "string" },
              "verified": { "type": "boolean" },
              "incorporationState": { "type": "string" },
              "officers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["name", "title"],
                  "properties": {
                    "name": { "type": "string" },
                    "title": { "type": "string" }
                  }
                }
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

* [Fiber.ai](/es/docs/agent/connect/fiber): enriquece una empresa verificada con datos firmográficos, número de empleados y contactos.
* [Financial Datasets](/es/docs/agent/connect/financialdatasets): añade cobertura de noticias reciente sobre entidades públicas.
* [Similarweb](/es/docs/agent/connect/similarweb): compara el tráfico web y los competidores de una empresa verificada.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Adjúntalo a una ejecución" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir la guía rápida" arrow="true">
    La guía rápida de Exa Connect cubre `dataSources`, los precios y el catálogo completo de socios.
  </Card>

  <Card title="Combinar proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer la guía" arrow="true">
    Adjunta hasta cinco socios a una misma ejecución y formula la query de modo que todos se activen.
  </Card>

  <Card title="Aprende a usar Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir la guía" arrow="true">
    Crea ejecuciones, sigue el progreso en streaming, diseña esquemas de salida y controla el esfuerzo y el costo.
  </Card>

  <Card title="Obtén una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el panel y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas incluyen credits gratuitos.
  </Card>
</Columns>