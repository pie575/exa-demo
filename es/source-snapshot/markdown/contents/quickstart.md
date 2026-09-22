> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="contents-api">
  # Contents API
</div>

> Extrae texto, highlights y resúmenes de cualquier URL.

Exa Contents devuelve contenido limpio de páginas a partir de URL, y gestiona automáticamente páginas renderizadas con JavaScript, PDF y diseños complejos.

Todas las funcionalidades de contenido también están disponibles en [Exa Search](/es/docs/search/quickstart) para las URL devueltas, sin coste adicional hasta 10 resultados por búsqueda ($1/1000 páginas a partir de ahí). Recomendamos usar Search de esta forma en lugar de Contents para casos de uso de herramientas de búsqueda web.

<Tip>
  Para resultados de búsqueda que alimentan el contexto de una IA, solicita `contents: { highlights: true }` en `/search`:
  Exa ajusta los extractos de cada resultado a su relevancia. Consulta [Highlights](/es/docs/search/highlights).
</Tip>

<div id="make-your-first-request">
  ## Haz tu primera solicitud
</div>

Pasa una o más URL o IDs de documentos y solicita highlights de las partes relevantes para tu tarea. En las solicitudes HTTP, indícalos en `ids`:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and quality results"},
  )

  print(result.results[0].highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://exa.ai/blog/dynamic-highlights"],
    {
      highlights: {
        query: "token efficiency and quality results"
      }
    }
  );

  console.log(result.results[0].highlights);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://exa.ai/blog/dynamic-highlights"],
      "highlights": {
        "query": "token efficiency and quality results"
      }
    }'
  ```
</CodeGroup>

<Accordion title="Ejemplo de respuesta">
  ```json theme={null}
  {
    "requestId": "e492118ccdedcba5088bfc4357a8a125",
    "results": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "title": "Dynamic Highlights",
        "url": "https://exa.ai/blog/dynamic-highlights",
        "highlights": [
          "With a 12k character budget, relative to existing highlights, Dynamic Highlights achieves a 40% average token efficiency gain with a notable quality increase..."
        ]
      }
    ],
    "statuses": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "status": "success",
        "source": "cached"
      }
    ],
    "costDollars": {
      "total": 0.001
    }
  }
  ```
</Accordion>

Cada elemento de `results` incluye los metadatos de la página y la vista de contenido que solicitaste. Consulta `statuses` para ver si cada URL se procesó correctamente o falló.

<h2 id="dynamic-highlights">
  Formatos de salida
</h2>

<Tabs>
  <Tab title="Highlights">
    Los highlights devuelven pasajes relevantes copiados de la página. Empieza por aquí para agentes, RAG y
    búsquedas de datos concretos, ya que los highlights ocupan menos contexto que el texto completo.

    Establece `highlights: true` para activarlos. Se recomienda añadir un parámetro `query` al usar Contents para enfocar la extracción de contenido de la página:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/research-paper"],
          highlights={"query": "methodology and results"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/research-paper"],
        {
          highlights: {
            query: "methodology and results"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/research-paper"],
          "highlights": {
            "query": "methodology and results"
          }
        }'
      ```
    </CodeGroup>

    Consulta [Highlights](/es/docs/search/highlights) para conocer los Dynamic Highlights y recomendaciones sobre cómo repartir el contexto
    entre varias páginas.
  </Tab>

  <Tab title="Texto completo">
    El texto completo devuelve el cuerpo limpio de la página en markdown. Úsalo cuando la tarea dependa de un contexto amplio,
    de la estructura del documento o de detalles que los highlights podrían omitir.

    Las páginas completas pueden ser extensas, así que usa `maxCharacters` cuando necesites un límite:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/technical-report"],
          text={"max_characters": 10000},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/technical-report"],
        {
          text: {
            maxCharacters: 10000
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/technical-report"],
          "text": {
            "maxCharacters": 10000
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Resumen">
    El resumen hace una llamada a un modelo de lenguaje por cada página. Úsalo cuando necesites una visión general generada o
    campos extraídos según un esquema JSON.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/company"],
          summary={"query": "Summarize the product, customers, and pricing"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/company"],
        {
          summary: {
            query: "Summarize the product, customers, and pricing"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/company"],
          "summary": {
            "query": "Summarize the product, customers, and pricing"
          }
        }'
      ```
    </CodeGroup>

    Para extraer campos en lugar de prosa, pasa un esquema JSON en `summary.schema`. El resumen se
    devuelve como una cadena JSON que cumple el esquema; analízala para leer los campos:

    ```json theme={null}
    {
      "ids": ["https://example.com/company"],
      "summary": {
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "title": "Company Information",
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "The company name" },
            "industry": { "type": "string", "description": "Primary industry" },
            "foundedYear": { "type": "number", "description": "Year the company was founded" }
          },
          "required": ["name"]
        }
      }
    }
    ```
  </Tab>
</Tabs>

Elige una sola vista de contenido por solicitud. Si pides highlights, text y summary a la vez, cada vista se devuelve y se factura por separado.

<div id="content-freshness">
  ## Frescura del contenido
</div>

`maxAgeHours` controla qué tan reciente debe ser el contenido extraído de la página.

| Valor           | Comportamiento                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| Omitir          | Usa el contenido en caché cuando esté disponible y obtiene la página cuando sea necesario                       |
| Entero positivo | Usa el contenido en caché si tiene menos horas de antigüedad que este valor; de lo contrario, obtiene la página |
| `0`             | Siempre obtiene contenido fresco                                                                                |
| `-1`            | Solo usa contenido en caché                                                                                     |

La mayoría de las solicitudes deberían omitir este campo. Configúralo cuando un contenido desactualizado resulte inservible, como en precios, disponibilidad o páginas que se actualizan con frecuencia. Combina un `maxAgeHours` bajo con `livecrawlTimeout` (milisegundos) para limitar cuánto puede tardar una obtención en vivo.

<Accordion title="Migrar desde el parámetro deprecado livecrawl">
  El parámetro de cadena `livecrawl` (`"always"`, `"preferred"`, `"fallback"`, `"never"`) está
  deprecado en favor de `maxAgeHours`:

  | Valor antiguo de `livecrawl` | Equivalente                                                      |
  | ---------------------------- | ---------------------------------------------------------------- |
  | `"always"`                   | `maxAgeHours: 0`                                                 |
  | `"never"`                    | `maxAgeHours: -1`                                                |
  | `"fallback"`                 | Omitir `maxAgeHours`                                             |
  | `"preferred"`                | Sin equivalente directo; usa un valor bajo como `maxAgeHours: 1` |
</Accordion>

<div id="crawl-subpages">
  ## Rastrear subpáginas
</div>

Define `subpages` para seguir los enlaces desde cada URL inicial. Añade `subpageTarget` cuando quieras que Exa priorice secciones concretas del sitio:

<CodeGroup>
  ```python Python theme={null}
  result = exa.get_contents(
      ["https://docs.example.com"],
      subpages=10,
      subpage_target=["api", "reference", "guides"],
      highlights=True,
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.getContents(
    ["https://docs.example.com"],
    {
      subpages: 10,
      subpageTarget: ["api", "reference", "guides"],
      highlights: true
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://docs.example.com"],
      "subpages": 10,
      "subpageTarget": ["api", "reference", "guides"],
      "highlights": true
    }'
  ```
</CodeGroup>

<div id="images-and-favicons">
  ## Imágenes y favicons
</div>

Asigna a `extras.imageLinks` la cantidad de URL de imágenes que quieras obtener de cada página. Los resultados también incluyen
el `favicon` del sitio y una URL de `image` representativa cuando esté disponible. En `/search`, esta opción
se encuentra en `contents.extras.imageLinks`.

<div id="next-steps">
  ## Próximos pasos
</div>

<Columns cols={2}>
  <Card title="Referencia de la API" icon="square-terminal" href="/es/docs/reference/get-contents" cta="Abrir referencia" arrow="true">
    Consulta todos los parámetros de solicitud y campos de respuesta.
  </Card>

  <Card title="Highlights" icon="highlighter" href="/es/docs/search/highlights" cta="Leer la guía" arrow="true">
    Compara los highlights normales con los Dynamic Highlights para el contexto de agentes y RAG.
  </Card>

  <Card title="Search API" icon="search" href="/es/docs/search/quickstart" cta="Abrir la guía" arrow="true">
    Encuentra páginas relevantes antes de extraer su contenido.
  </Card>

  <Card title="SDKs" icon="code" href="/es/docs/sdks/quickstart" cta="Ver SDKs" arrow="true">
    Usa Exa desde Python o JavaScript.
  </Card>
</Columns>