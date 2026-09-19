> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="exa-connect">
  # Exa Connect
</div>

> Dale a tu Exa Agent acceso en tiempo real a socios de datos premium, junto con la búsqueda web de Exa, en una sola ejecución.

Exa Connect integra socios de datos premium en el ciclo del Exa Agent. Asocia un
proveedor a una ejecución y el Exa Agent consultará la base de datos de ese socio junto con la búsqueda
web antes de combinar los resultados en una única respuesta estructurada y fundamentada.

¿Es la primera vez que trabajas con ejecuciones de agentes? Empieza por la [guía de Exa Agent](/es/docs/agent/quickstart)
y luego vuelve aquí para asociar socios de datos.

<Tip>
  Exa Agent ya busca en todo el [índice de datos](/es/docs/search/data/overview): las mismas
  fuentes de noticias, código, empresas y personas que la Search API. Exa Connect añade,
  además, bases de datos de socios premium.
</Tip>

<Tip>
  ¿Prefieres MCP? Exa Agent y [Exa Connect](/es/docs/agent/connect/overview) están disponibles en [Exa MCP](/es/docs/get-started/exa-mcp#exa-agent). Activa `tools=agent_run` para ejecutar investigaciones de varios pasos, creación de listas, enrichment y salida estructurada desde Claude, Cursor y otros clientes MCP.
</Tip>

<div id="why-exa-connect">
  ## Por qué Exa Connect
</div>

* **Datos premium sin integraciones aparte.** Accede a datos de socios sin
  firmar contratos ni integrar un SDK. Basta con llamar a una sola API de Exa.
* **Exa se encarga de la fontanería.** Nosotros gestionamos la autenticación con los proveedores, la selección de herramientas,
  los reintentos y la clasificación de resultados.
* **Exa Agent elige la fuente.** Cuando tu `outputSchema` pide
  «visitas mensuales de Similarweb» o «directivos verificados», Exa Agent llama a la
  herramienta del socio correspondiente en lugar de adivinar a partir de una página web.
* **Datos del índice y de socios en una misma ejecución.** Connect se apoya en el índice de Exa.
  Exa Agent aprovecha cada fuente allí donde es más sólida y cita los resultados.

<div id="how-it-works">
  ## Cómo funciona
</div>

1. **Adjunta** uno o más proveedores mediante el array `dataSources` en
   [`POST /agent/runs`](/es/docs/reference/agent-api/create-a-run).
2. Exa Agent **selecciona la herramienta adecuada** para cada paso en función de tu query y de
   `outputSchema`: datos de los socios o búsqueda web de Exa.
3. Los resultados de los socios se **combinan con la investigación web** en tu salida estructurada,
   con las fuentes adjuntas.

<div id="pricing">
  ## Precios
</div>

<Note>
  El precio de Exa Connect se suma al [precio estándar de las ejecuciones de Agent](/es/docs/agent/quickstart#pricing).
  Pagas los costos habituales de cómputo y búsqueda de Agent, más el cargo por llamada al proveedor en cada llamada a una herramienta de Exa Connect.
</Note>

| Proveedor                                            | Precio                                        |
| ---------------------------------------------------- | --------------------------------------------- |
| [Fiber.ai](/es/docs/agent/connect/fiber#pricing)        | `$0.02 / credit`                              |
| [Similarweb](/es/docs/agent/connect/similarweb#pricing) | `$0.30 / credit`                              |
| [Baselayer](/es/docs/agent/connect/baselayer#pricing)   | `$0.10 – $4.00 / order (varies by operation)` |
| [Polymarket](/es/docs/agent/connect/polymarket#pricing) | `Free`                                        |
| Affiliate.com                                        | `$0.015 / call`                               |
| Particle                                             | `$0.015 / call`                               |
| Financial Datasets                                   | `$0.01 / call`                                |
| Jinko                                                | `$0.005 / call`                               |

Fiber.ai factura en créditos en lugar de por llamada, porque su propio cargo varía según
la llamada: una búsqueda cuesta 2 créditos más 1 por cada resultado devuelto, una consulta
de empresa o persona se factura por cada candidato devuelto (de modo que aumentar el
`numResults` de una consulta de empresa para desambiguar un nombre ambiguo sale más caro), y
revelar un contacto cuesta entre 2 y 5 créditos según si solicitas el correo laboral, el correo
personal o el teléfono. Se te cobran los créditos que Fiber informa por cada llamada; las llamadas que
no devuelven coincidencias son gratuitas. Consulta [los precios de Fiber.ai](/es/docs/agent/connect/fiber#pricing).

Similarweb factura en créditos de datos (aproximadamente uno por métrica × fila × mes), de modo que el
precio de una llamada depende de sus valores de `numResults`/`months`: de 1 a 15 créditos por llamada. Se te
cobran los créditos que Similarweb informa por cada llamada; las llamadas que no devuelven
datos son gratuitas. Consulta [los precios de Similarweb](/es/docs/agent/connect/similarweb#pricing).

Baselayer factura por pedido y la tarifa depende de la operación: una búsqueda
empresarial KYB cuesta $1.00; una búsqueda de gravámenes UCC, $2.00 por estado consultado; una
búsqueda de expedientes de litigios o quiebras, $1.00 por categoría; el cribado en listas de vigilancia,
entre $0.10 y $0.25 por lista solicitada; la clasificación sectorial y el análisis de sitios web,
$0.35 cada uno; la presencia web equivale a la suma de los análisis seleccionados
($0.15–$0.35 cada uno), y una búsqueda empresarial internacional cuesta $4.00. Las consultas
posteriores sobre una búsqueda empresarial previa (consulta de empresa, directivos, registros,
búsqueda inversa de directivos) son gratuitas. Consulta [los precios de Baselayer](/es/docs/agent/connect/baselayer#pricing).

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="Profile Anthropic: total funding and estimated monthly web traffic.",
      data_sources=[{"provider": "fiber"}, {"provider": "similarweb"}],
      output_schema={
          "type": "object",
          "required": ["company"],
          "properties": {
              "company": {
                  "type": "object",
                  "required": ["name", "totalFunding", "monthlyVisits"],
                  "properties": {
                      "name": {"type": "string"},
                      "totalFunding": {"type": "string", "description": "from Fiber.ai"},
                      "monthlyVisits": {"type": "number", "description": "from Similarweb"},
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
    query: "Profile Anthropic: total funding and estimated monthly web traffic.",
    dataSources: [{ provider: "fiber" }, { provider: "similarweb" }],
    outputSchema: {
      type: "object",
      required: ["company"],
      properties: {
        company: {
          type: "object",
          required: ["name", "totalFunding", "monthlyVisits"],
          properties: {
            name: { type: "string" },
            totalFunding: { type: "string", description: "from Fiber.ai" },
            monthlyVisits: { type: "number", description: "from Similarweb" },
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
      "query": "Profile Anthropic: total funding and estimated monthly web traffic.",
      "dataSources": [{ "provider": "fiber" }, { "provider": "similarweb" }],
      "outputSchema": {
        "type": "object",
        "required": ["company"],
        "properties": {
          "company": {
            "type": "object",
            "required": ["name", "totalFunding", "monthlyVisits"],
            "properties": {
              "name": { "type": "string" },
              "totalFunding": { "type": "string", "description": "from Fiber.ai" },
              "monthlyVisits": { "type": "number", "description": "from Similarweb" }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

<div id="data-partners">
  ## Socios de datos
</div>

<div className="connect-provider-cards">
  <Columns cols={2}>
    <Card title="Fiber.ai" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/fiber.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=e2292b486593416a57b075123bcfc513" href="/es/docs/agent/connect/fiber" width="400" height="400" data-path="images/agent/connect/fiber.svg">
      **GTM y reclutamiento.** Base de datos B2B de empresas y personas para descubrir
      leads e investigar contactos.
    </Card>

    <Card title="Similarweb" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/similarweb.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7ac916fb46576857bd10c95f12ae78dc" href="/es/docs/agent/connect/similarweb" width="400" height="371" data-path="images/agent/connect/similarweb.svg">
      **Analítica web.** Estimaciones de tráfico, clasificaciones globales y
      descubrimiento de competidores para cualquier dominio.
    </Card>

    <Card title="Baselayer" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/baselayer.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=d73cd54ad8fc01672a8407aabefee887" href="/es/docs/agent/connect/baselayer" width="400" height="247" data-path="images/agent/connect/baselayer.svg">
      **Cumplimiento y KYB.** Verifica empresas de EE. UU.: directivos, registros y
      señales de riesgo.
    </Card>

    <Card title="Polymarket" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/polymarket.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a3541cde8f59cb64491fa6f4f40f12c" href="/es/docs/agent/connect/polymarket" width="168" height="168" data-path="images/agent/connect/polymarket.svg">
      **Mercados de predicción.** Cuotas de mercados de predicción, historial de precios y
      posiciones de los operadores, de Polymarket.
    </Card>

    <Card title="Affiliate.com" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/affiliatecom.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=b193bea9be653125ba5695f3cd2c027a" href="/es/docs/agent/connect/affiliatecom" width="400" height="400" data-path="images/agent/connect/affiliatecom.svg">
      **Comercio.** Búsqueda en catálogos de productos con precios, marcas y enlaces a comercios.
    </Card>

    <Card title="Particle" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/particle.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=72ab9729a143893f286fa369ceeb036f" href="/es/docs/agent/connect/particle" width="400" height="400" data-path="images/agent/connect/particle.svg">
      **Inteligencia de medios.** Busca en transcripciones de pódcast con atribución de hablantes
      y marcas de tiempo.
    </Card>

    <Card title="Conjuntos de datos financieros" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/financialdatasets.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=24052e4641fa4060e1ccf64482b10e00" href="/es/docs/agent/connect/financialdatasets" width="401" height="400" data-path="images/agent/connect/financialdatasets.svg">
      **Finanzas.** Precios, fundamentales, resultados, informes ante la SEC, estructura accionarial y
      screening de acciones para más de 27.000 tickers de EE. UU.
    </Card>

    <Card title="Jinko" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/agent/connect/jinko.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=958d2ec147d452f12c0904f41ffb2311" href="/es/docs/agent/connect/jinko" width="400" height="395" data-path="images/agent/connect/jinko.svg">
      **Viajes.** Búsqueda de vuelos y hoteles con precios en tiempo real.
    </Card>
  </Columns>
</div>

¿Necesitas una fuente que no aparece en la lista anterior? Consulta nuestros [Proveedores adicionales](/es/docs/agent/connect/additional-partners), disponibles bajo petición poniéndote en contacto con nuestro equipo.

<div id="usage">
  ## Uso
</div>

<div id="combining-providers">
  ### Combinar proveedores
</div>

Conecta tantos socios como necesite tu tarea. Exa Agent recurre a cada uno en aquello en lo que destaca
y combina los resultados con la búsqueda web en una única respuesta estructurada:

```json theme={null}
{
  "dataSources": [
    { "provider": "similarweb" },
    { "provider": "fiber" },
    { "provider": "harmonic" }
  ]
}
```

Para ver una guía completa, que incluye cómo estructurar tu query y tu `outputSchema` para que todos los
socios se activen, consulta [Combinar proveedores](/es/docs/agent/connect/combining-providers).