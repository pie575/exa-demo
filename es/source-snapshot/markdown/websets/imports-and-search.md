> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="how-to-use-imports">
  # Cómo usar los imports
</div>

> Una guía paso a paso para importar URLs a Websets: enriquecer tu lista, puntuarla frente a los criteria, descubrir nuevas coincidencias y combinar las tres cosas.

Cuando ya tienes una lista de URLs (empresas, personas, productos, etc.), puedes **importarlas** a un Webset. Según cómo configures el Webset, los items importados pueden enriquecerse, evaluarse frente a los criteria o combinarse con resultados de descubrimiento web.

Esta guía recorre cada configuration con llamadas exactas a la API que puedes copiar y pegar. Solo tienes que reemplazar `$EXA_API_KEY` por tu API key.

<div id="our-example-5-it-consulting-suppliers">
  ## Nuestro ejemplo: 5 proveedores de consultoría de TI
</div>

A lo largo de esta guía, usaremos la misma lista de 5 empresas como nuestro import:

| Empresa      | URL                              | Notas                                                                           |
| ------------ | -------------------------------- | ------------------------------------------------------------------------------- |
| Accenture    | `https://www.accenture.com`      | Consultoría de TI global, sede en EE. UU.                                       |
| Infosys      | `https://www.infosys.com`        | Servicios de TI, gran presencia en EE. UU.                                      |
| Wipro        | `https://www.wipro.com`          | Servicios de TI, oficinas en EE. UU.                                            |
| EPAM Systems | `https://www.epam.com`           | Ingeniería de software, cotiza en EE. UU.                                       |
| Persol Group | `https://www.persol-group.co.jp` | Empresa de dotación de personal, centrada en Japón, presencia mínima en EE. UU. |

Las elegimos porque 4 de las 5 cumplen claramente los criteria típicos de una consultora de TI (oficina en EE. UU., servicios de TI). **Persol Group** es la excepción: es una empresa japonesa de dotación de personal con presencia mínima en EE. UU., por lo que no debería cumplir los criteria centrados en EE. UU.

Nuestros criteria para los ejemplos siguientes:

1. «La empresa tiene una oficina en Estados Unidos»
2. «La empresa presta servicios de consultoría de TI o de ampliación de personal»

***

<div id="config-1-import-only-enrich-without-filtering">
  ## Configuración 1: Solo import: enriquecer sin filtrar
</div>

<Note>
  **Ejemplo en vivo:** [Ver este webset en el panel](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**Úsala cuando:** tienes una lista de URL y solo quieres enriquecerlas. Sin puntuación ni filtrado: se conservan todos los items.

<div id="api-calls">
  ### Llamadas a la API
</div>

```bash theme={null}
# Paso 1: Crea un import CSV con las URLs de tus proveedores
curl -s -X POST "https://api.exa.ai/websets/v0/imports" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "count": 5,
    "size": 128,
    "entity": { "type": "company" },
    "title": "IT Consulting Suppliers"
  }'
# La respuesta incluye un `uploadUrl` y un `id` de import

# Paso 2: Sube tu CSV a la URL prefirmada del Paso 1
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv contiene: url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# Paso 3: Crea un Webset que use este import (solo enrichments, sin search ni criteria)
# El import se programa automáticamente para su procesamiento al crear el Webset.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "import": [
      { "source": "import", "id": "<IMPORT_ID>" }
    ],
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }'
```

<div id="what-we-see-in-the-live-webset">
  ### Lo que vemos en el Webset en vivo
</div>

Los **5 items** aparecen en el Webset. No se aplica ningún filtrado porque no hay criteria.

| Proveedor    | ¿En el Webset? | Origen   | Evaluaciones | Enrichments | ¿Por qué?                                        |
| ------------ | -------------- | -------- | ------------ | ----------- | ------------------------------------------------ |
| Accenture    | **Sí**         | `import` | 0            | 2           | Importado, no hay criteria con los que evaluarlo |
| Infosys      | **Sí**         | `import` | 0            | 2           | Importado, no hay criteria con los que evaluarlo |
| Wipro        | **Sí**         | `import` | 0            | 2           | Importado, no hay criteria con los que evaluarlo |
| EPAM Systems | **Sí**         | `import` | 0            | 2           | Importado, no hay criteria con los que evaluarlo |
| Persol Group | **Sí**         | `import` | 0            | 2           | Importado, no hay criteria con los que evaluarlo |

Cada item tiene `source: "import"` y `evaluations: []`. Los 5 se conservan y se enriquecen al margen de si cumplirían algún criteria, porque en esta configuración no hay criteria.

<Note>
  La URL de Persol Group (`persol-group.co.jp`) se resolvió como &quot;PERSOL Vietnam Japan Desk&quot; en los datos de la entidad: el sistema igualmente la importa y la enriquece, solo que apuntó a la página de una filial regional.
</Note>

***

<div id="config-2-search-only-web-discovery">
  ## Configuración 2: Solo Search -- descubrimiento web
</div>

<Note>
  **Ejemplo en vivo:** [Ver este webset en el panel](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**Úsala cuando:** no tienes una lista -- quieres descubrir en la web nuevas empresas que cumplan tus criteria.

<div id="api-call">
  ### Llamada a la API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-2">
  ### Qué vemos en el Webset en vivo
</div>

El sistema buscó en la web y encontró **35 empresas** que cumplen ambos criteria. Cada item tiene `source: "search"` con evaluaciones completas que explican por qué coincidió.

| Nuestros 5 proveedores | ¿En el Webset? | ¿Por qué?                                                                  |
| ---------------------- | -------------- | -------------------------------------------------------------------------- |
| Accenture              | **Sí**         | La búsqueda web descubrió Accenture por su cuenta como empresa coincidente |
| Infosys                | **No**         | No la descubrió esta búsqueda web en particular                            |
| Wipro                  | **No**         | No la descubrió esta búsqueda web en particular                            |
| EPAM Systems           | **No**         | No la descubrió esta búsqueda web en particular                            |
| Persol Group           | **No**         | No la descubrió esta búsqueda web en particular                            |
| *(otras 34 empresas)*  | **Sí**         | Encontradas por la búsqueda web, cumplieron ambos criteria                 |

La búsqueda web dio con Accenture entre sus 35 resultados, pero no descubrió a los otros 4 proveedores. Es lo esperable: los websets de solo búsqueda devuelven únicamente lo que encuentra el rastreo web, no una lista predeterminada. Ejemplos de otras empresas descubiertas: Artech, TurnKey Staffing, DataArt, Insight Global, entre otras.

***

<div id="config-3-scoped-search-score-your-list-against-criteria">
  ## Configuración 3: Scoped Search: puntúa tu lista según los criteria
</div>

<Note>
  **Ejemplo en vivo:** [Ver este webset en el panel](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**Úsalo cuando:** tengas una lista de proveedores y quieras **evaluar cada uno según los criteria**. Solo se devuelven los que cumplen. Este es el caso de uso de «puntuar mi lista».

<div id="api-calls-2">
  ### Llamadas a la API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Crea un import de CSV y súbelo como se muestra en la Config 1; luego usa su ID aquí.
  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  // Crea un import de CSV y súbelo como se muestra en la Config 1; luego usa su ID aquí.
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        scope: [
          { source: "import", id: "<IMPORT_ID>" }
        ]
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  # Paso 1: Crea un import de CSV y súbelo (igual que en la Config 1, pasos 1-2)
  # ... (consulta la Config 1 para ver el flujo completo del import)
  # Obtendrás un <IMPORT_ID>

  # Paso 2: Crea un Webset con una search acotada por scope: evalúa cada URL importada según los criteria
  # El import se programa automáticamente para su procesamiento al crear el Webset.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-3">
  ### Lo que vemos en el Webset en vivo
</div>

El webset contiene **4 items**. Cada uno de nuestros 5 proveedores se evaluó según los criteria; solo aparecen los que cumplieron ambos criteria.

| Proveedor    | ¿En el Webset?       | Fuente   | ¿Tiene evaluaciones? | ¿Por qué?                                                                      |
| ------------ | -------------------- | -------- | -------------------- | ------------------------------------------------------------------------------ |
| Accenture    | **Sí**               | `search` | Sí (2)               | Cumple: tiene oficina en EE. UU., ofrece consultoría de TI                     |
| Infosys      | **Sí**               | `search` | Sí (2)               | Cumple: tiene oficina en EE. UU., ofrece servicios de TI                       |
| Wipro        | **Sí**               | `search` | Sí (2)               | Cumple: tiene oficina en EE. UU., ofrece servicios de TI                       |
| EPAM Systems | **Sí**               | `search` | Sí (2)               | Cumple: cotiza en EE. UU., ofrece servicios de ingeniería de software          |
| Persol Group | **No -- descartado** | --       | --                   | No cumple «tiene una oficina en Estados Unidos»: se centra sobre todo en Japón |

Importamos 5 proveedores, pero solo 4 aparecen en los resultados. **Persol Group se evaluó y no cumplió los criteria**, por lo que se filtra. Cada item visible tiene `source: "search"` con las `evaluations` completas, que muestran el razonamiento de cada criterio.

<Warning>
  Los items que no cumplen los criteria **se descartan de los resultados**. Si necesitas conservar todos los items y solo ver cuáles cumplen y cuáles no, usa la Config 1 (solo import, sin filtrado) como un webset aparte, junto a la Config 3.
</Warning>

***

<div id="config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches">
  ## Config 4: Scoped Search + descubrimiento web: puntúa tu lista Y encuentra nuevas coincidencias
</div>

<Note>
  **Ejemplo en vivo:** [Ver este webset en el panel](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**Úsalo cuando:** tienes una lista de proveedores que quieres puntuar según ciertos criteria, pero además quieres descubrir en la web otras empresas que cumplan esos mismos criteria. Es un proceso de dos pasos: primero crea un webset con una search acotada mediante scope y luego añade al mismo webset una search web normal.

<div id="api-calls-3">
  ### Llamadas a la API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Crea un import de CSV y súbelo como se muestra en la Config 1; luego usa su ID aquí.
  headers = {"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"}
  webset_response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers=headers,
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  webset_response.raise_for_status()
  webset_id = webset_response.json()["id"]

  search_response = requests.post(
      f"https://api.exa.ai/websets/v0/websets/{webset_id}/searches",
      headers=headers,
      json={
          "query": "IT consulting and staff augmentation companies",
          "entity": {"type": "company"},
          "criteria": [
              {"description": "The company has an office in the United States"},
              {
                  "description": "The company provides IT consulting or staff augmentation services"
              },
          ],
          "count": 25,
          "behavior": "append",
      },
  )
  search_response.raise_for_status()
  ```

  ```javascript JavaScript theme={null}
  // Crea un import CSV y súbelo como se muestra en la Config 1; luego usa su ID aquí.
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXA_API_KEY}`
  };
  const websetResponse = await fetch(
    "https://api.exa.ai/websets/v0/websets",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        search: {
          query: "IT consulting and staff augmentation companies",
          entity: { type: "company" },
          criteria: [
            { description: "The company has an office in the United States" },
            {
              description: "The company provides IT consulting or staff augmentation services"
            }
          ],
          count: 25,
          scope: [
            { source: "import", id: "<IMPORT_ID>" }
          ]
        },
        enrichments: [
          {
            description: "What services does this company provide?",
            format: "text"
          },
          { description: "Number of employees", format: "number" }
        ]
      })
    }
  );

  if (!websetResponse.ok) {
    throw new Error(`Webset creation failed: ${websetResponse.status}`);
  }
  const webset = await websetResponse.json();

  const searchResponse = await fetch(
    `https://api.exa.ai/websets/v0/websets/${webset.id}/searches`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        behavior: "append"
      })
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Search creation failed: ${searchResponse.status}`);
  }
  ```

  ```bash cURL theme={null}
  # Paso 1: Crea un import de CSV y súbelo (igual que en la Config 1, pasos 1-2)
  # ... (consulta la Config 1 para ver el flujo completo del import)
  # Obtendrás un <IMPORT_ID>

  # Paso 2: Crea un Webset con un search acotado (scope): evalúa cada URL importada según los criteria
  # El import se programa automáticamente para su procesamiento al crear el Webset.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  # La respuesta incluye un `id` de webset: guárdalo como <WEBSET_ID>

  # Paso 3: Espera a que termine el search acotado y luego añade un search web para descubrir nuevas coincidencias
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/<WEBSET_ID>/searches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "behavior": "append"
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-4">
  ### Qué vemos en el Webset en vivo
</div>

El webset contiene **29 items**: 4 de nuestros proveedores importados (evaluados y aprobados) más 25 empresas descubiertas en la web. Ambos conjuntos se evalúan según los criteria.

| Proveedor                              | ¿En el Webset?       | Fuente   | ¿Tiene evaluaciones? | ¿Por qué?                                                                   |
| -------------------------------------- | -------------------- | -------- | -------------------- | --------------------------------------------------------------------------- |
| Accenture                              | **Sí**               | `search` | Sí (2)               | Aprobó la scoped search: tiene oficina en EE. UU., ofrece consultoría de TI |
| Infosys                                | **Sí**               | `search` | Sí (2)               | Aprobó la scoped search: tiene oficina en EE. UU., ofrece servicios de TI   |
| Wipro                                  | **Sí**               | `search` | Sí (2)               | Aprobó la scoped search: tiene oficina en EE. UU., ofrece servicios de TI   |
| EPAM Systems                           | **Sí**               | `search` | Sí (2)               | Aprobó la scoped search: cotiza en EE. UU., ofrece ingeniería de software   |
| Persol Group                           | **No -- descartado** | --       | --                   | No aprobó la scoped search: sin oficina en EE. UU.                          |
| *(25 empresas descubiertas en la web)* | **Sí**               | `search` | Sí (2 cada una)      | Encontradas mediante búsqueda web, aprobaron ambos criteria                 |

La scoped search evalúa tu lista importada según los criteria (y descarta a Persol Group), mientras que la búsqueda web añadida descubre 25 empresas adicionales. El resultado es un único webset que reúne tus imports evaluados y los nuevos hallazgos de la web.

<Note>
  La búsqueda web usa `"behavior": "append"`, por lo que se suma a los resultados existentes en lugar de reemplazarlos. Si la búsqueda web descubre una empresa que ya estaba en los resultados de la scoped search (por ejemplo, Accenture), el duplicado se gestiona automáticamente.
</Note>

***

<div id="quick-reference">
  ## Referencia rápida
</div>

| Configuration                                | Qué hace                                        | ¿Se conservan todos los items?              | ¿Se puntúan los items?                                    |
| -------------------------------------------- | ----------------------------------------------- | ------------------------------------------- | --------------------------------------------------------- |
| **1. Solo import**                           | Enriquece tu lista                              | Sí: se conservan todos                      | No                                                        |
| **2. Solo Search**                           | Descubre nuevas coincidencias en la web         | N/D (sin imports)                           | Sí: solo se devuelven los items que cumplen               |
| **3. Search con scope**                      | Puntúa tu lista según los criteria              | No: los que no cumplen se descartan         | Sí                                                        |
| **4. Search con scope + descubrimiento web** | Puntúa tu lista + descubre nuevas coincidencias | No: los imports que no cumplen se descartan | Sí: se puntúan tanto los imports como los descubrimientos |

<div id="which-config-should-i-use">
  ## ¿Qué configuración debo usar?
</div>

* **«Solo quiero enriquecer mi lista, sin filtros»** -- Configuración 1
* **«No tengo una lista, encuéntrame empresas»** -- Configuración 2
* **«Puntúa mi lista y descarta las que no encajen»** -- Configuración 3
* **«Puntúa mi lista Y encuentra nuevas empresas que encajen»** -- Configuración 4