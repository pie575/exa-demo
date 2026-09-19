> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="fiberai">
  # Fiber.ai
</div>

> Busca empresas, personas y perfiles de LinkedIn en la base de datos B2B de Fiber.ai.

[Fiber.ai](https://fiber.ai) es una plataforma de datos B2B con información actualizada de más de 40 M de
empresas, más de 850 M de personas y más de 30 M de ofertas de empleo. Consulta datos en tiempo real de empresas, personas y
empleos, y enriquece los registros incompletos con correos laborales, correos personales y
números de teléfono.

Adjunta `fiber` a una ejecución de [Exa Agent](/es/docs/agent/quickstart) mediante
[Exa Connect](/es/docs/agent/connect/overview) y el agente consultará
Fiber.ai junto con la búsqueda web de Exa.

<div id="use-it-for">
  ## Úsalo para
</div>

* Depurar un CRM mediante la búsqueda inversa de un correo laboral o personal
  para identificar a la persona, o enriquecer un registro parcial de
  empresa/persona.
* Hacer seguimiento de señales de LinkedIn en tiempo real: cambios de puesto,
  ascensos, nuevos empleos, variaciones en la plantilla y rondas de
  financiación.
* Encontrar publicaciones relevantes en LinkedIn, X, Instagram, TikTok, Reddit y
  YouTube, extraer sus comentarios y reacciones, y después enriquecer la
  información de contacto de los autores.
* Buscar entre más de 40 M de empresas y más de 850 M de personas, y enriquecer
  los prospectos con correo laboral, correo personal y números de teléfono.

<div id="provider-id">
  ## ID del proveedor
</div>

Usa este valor en `dataSources`:

```text theme={null}
fiber
```

<div id="pricing">
  ## Precios
</div>

Fiber.ai factura en créditos a `$0.02 / credit`, y cada llamada se cobra según
los créditos que Fiber reporte para ella:

| Operación                                        | Créditos                          |
| ------------------------------------------------ | --------------------------------- |
| Search                                           | 2 + 1 por resultado devuelto      |
| Búsqueda de empresa                              | ~2 por candidato devuelto         |
| Búsqueda de persona / búsqueda inversa de correo | 2                                 |
| Revelación de contacto                           | 2 (correo laboral) – 5 (teléfono) |

Las llamadas que no devuelven ninguna coincidencia (o cuyo cargo Fiber reembolsa) son gratuitas. Los
parámetros que elijas afectan el precio: el `numResults` de una búsqueda de empresa determina por cuántos
candidatos pagas, y la cantidad de resultados de una search concentra la mayor parte de su costo.

<div id="example">
  ## Ejemplo
</div>

Crea una lista de prospección B2B de empresas fintech en Serie A ubicadas en Nueva York que tengan entre 50 y 200 empleados.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
      data_sources=[{"provider": "fiber"}],
      output_schema={
          "type": "object",
          "required": ["companies"],
          "properties": {
              "companies": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["name", "domain", "employeeCount", "fundingStage"],
                      "properties": {
                          "name": {"type": "string"},
                          "domain": {"type": "string"},
                          "employeeCount": {"type": "number"},
                          "fundingStage": {"type": "string"},
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
    query: "I'm building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company's LinkedIn profile, domain, employee count, and funding stage.",
    dataSources: [{ provider: "fiber" }],
    outputSchema: {
      type: "object",
      required: ["companies"],
      properties: {
        companies: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["name", "domain", "employeeCount", "fundingStage"],
            properties: {
              name: { type: "string" },
              domain: { type: "string" },
              employeeCount: { type: "number" },
              fundingStage: { type: "string" },
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
      "query": "I'\''m building a B2B sales prospecting list using a B2B company database. Find Series A fintech companies in New York with 50-200 employees, and for each return the company'\''s LinkedIn profile, domain, employee count, and funding stage.",
      "dataSources": [{ "provider": "fiber" }],
      "outputSchema": {
        "type": "object",
        "required": ["companies"],
        "properties": {
          "companies": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["name", "domain", "employeeCount", "fundingStage"],
              "properties": {
                "name": { "type": "string" },
                "domain": { "type": "string" },
                "employeeCount": { "type": "number" },
                "fundingStage": { "type": "string" }
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

* [Similarweb](/es/docs/agent/connect/similarweb): mide la presencia web de un prospecto y la de sus competidores.
* [Baselayer](/es/docs/agent/connect/baselayer): verifica directivos y registros de las empresas estadounidenses preseleccionadas.
* [Particle](/es/docs/agent/connect/particle): descubre qué dicen los pódcast sobre una empresa o un directivo.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Adjúntalo a una ejecución" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir guía rápida" arrow="true">
    La guía rápida de Exa Connect cubre `dataSources`, los precios y el catálogo completo de socios.
  </Card>

  <Card title="Combinar proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer la guía" arrow="true">
    Adjunta hasta cinco socios a una misma ejecución y formula la query de modo que todos se activen.
  </Card>

  <Card title="Aprende Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Crea ejecuciones, transmite el progreso, diseña esquemas de salida y controla el esfuerzo y el costo.
  </Card>

  <Card title="Obtén una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el panel y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas incluyen créditos gratuitos.
  </Card>
</Columns>