> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="websets">
  # Websets
</div>

> Crea conjuntos de datos verificados y enriquecidos a partir de la web.

<div id="what-are-websets">
  ## ¿Qué son los Websets?
</div>

Un Webset parte de una query en lenguaje natural y un número objetivo de items. Añade criteria que todo resultado deba cumplir y campos de enrichment que se completarán para cada item aceptado. Los resultados llegan de forma asíncrona a través del panel, la API o webhooks.

También puedes crear websets de forma visual en el [Panel](/es/docs/websets/dashboard/get-started), sin
necesidad de escribir código.

<Info>
  ¿Vas a iniciar un nuevo flujo de creación de listas o de enrichment? Usa [Exa Agent](/es/docs/agent/quickstart).
  Usa esta guía para mantener o ampliar una integración existente de Websets.
  La API de Websets requiere un plan de pago de Websets; los credits de la Search API y los de Websets son independientes.
</Info>

<div id="how-it-works">
  ## Cómo funciona
</div>

1. **Define una search:** proporciona una query en lenguaje natural, un número de resultados y, opcionalmente, criteria de verificación y enrichments.
2. **Busca y verifica:** Websets encuentra candidatos y evalúa cada uno según tus criteria. Solo los resultados que coinciden se convierten en items.
3. **Ejecuta los enrichments:** para cada item verificado, Websets busca los datos adicionales que solicitaste, como el nombre del CEO, el monto de financiación o la información de contacto.
4. **Recibe los resultados:** consulta el estado mediante sondeo, usa webhooks para recibir actualizaciones o revisa el panel a medida que llegan los items.

<div id="key-capabilities">
  ## Capacidades clave
</div>

| Funcionalidad                | Qué hace                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Verificación de criteria** | Cada resultado se contrasta con las reglas que definas, de modo que solo obtienes coincidencias relevantes |
| **Enrichments**              | Extrae datos concretos (texto, números, fechas, booleanos) de cada resultado                               |
| **Monitors**                 | Programa búsquedas recurrentes para mantener tu webset actualizado automáticamente                         |
| **Webhooks**                 | Recibe callbacks HTTP en tiempo real a medida que se añaden o enriquecen items                             |
| **Imports**                  | Aporta tus propias URLs y ejecuta enrichments sobre ellas                                                  |

<div id="human-quickstart">
  ## Inicio rápido para humanos
</div>

<Card title="Obtén tu Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas incluyen credits gratuitos.
</Card>

Instala el SDK:

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

Después, haz tu primera solicitud:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa
  from exa_py.websets.types import CreateWebsetParameters, CreateEnrichmentParameters
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  webset = exa.websets.create(
      params=CreateWebsetParameters(
          search={
              "query": "Top AI research labs focusing on large language models",
              "count": 5
          },
          enrichments=[
              CreateEnrichmentParameters(
                  description="LinkedIn profile of VP of Engineering or related role",
                  format="text",
              ),
          ],
      )
  )

  print(f"Webset created with ID: {webset.id}")
  print(f"View your Webset at: {webset.dashboard_url}")

  # Espera hasta que el Webset termine de procesarse
  webset = exa.websets.wait_until_idle(webset.id)

  # Obtén los Items del Webset
  items = exa.websets.items.list(webset_id=webset.id)
  for item in items.data:
      print(f"Item: {item.model_dump_json(indent=2)}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  const webset = await exa.websets.create({
    search: {
      query: "Top AI research labs focusing on large language models",
      count: 10
    },
    enrichments: [
      { description: "Estimate the company's founding year", format: "number" }
    ],
  });

  console.log(`Webset created with ID: ${webset.id}`);
  console.log(`View your Webset at: ${webset.dashboardUrl}`);

  const idleWebset = await exa.websets.waitUntilIdle(webset.id, {
    timeout: 60000,
    pollInterval: 2000,
    onPoll: (status) => console.log(`Current status: ${status}...`)
  });

  const items = await exa.websets.items.list(webset.id, { limit: 10 });
  for (const item of items.data) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/" \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer ${EXA_API_KEY}" \
    -d '{
      "search": {
        "query": "Top AI research labs focusing on large language models",
        "count": 5
      },
      "enrichments": [
        {"description": "Find the company'\''s founding year", "format": "number"}
      ]
    }'
  ```
</CodeGroup>

<Note>
  Consulta [Zero Data Retention](/es/docs/admin/security/zero-data-retention) para conocer la disponibilidad del producto.
</Note>

<div id="next">
  ## Siguiente
</div>

* [**Guía del panel**](./dashboard/get-started) - Guía paso a paso para usar Websets en el panel
* [**Cómo funciona**](./api/how-it-works) - Análisis a fondo de la arquitectura basada en eventos
* [**Referencia de la API de Websets**](./api/websets/create-a-webset) - Referencia completa de la API para todos los endpoints