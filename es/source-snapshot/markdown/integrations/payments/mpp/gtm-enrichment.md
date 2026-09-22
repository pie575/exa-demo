> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de explorar más a fondo.

<div id="tempo-mpp-gtm-enrichment-cookbook">
  # Recetario de enrichment GTM con Tempo MPP
</div>

> Crea un flujo de trabajo de enrichment GTM que paga por cada solicitud de búsqueda y contenido de Exa con Tempo MPP, sin necesidad de API key.

Usa este recetario para crear un agente o pipeline de enrichment GTM sobre los
endpoints `/search` y `/contents` de Exa, con pago por solicitud a través del Machine
Payments Protocol (MPP). MPP admite varios métodos de pago; los ejemplos
de esta guía usan stablecoins en [Tempo](https://tempo.xyz). Sin suscripción mensual, sin
API key y sin precios por asiento: carga una wallet con USDC.e y paga a medida que
enriqueces leads o empresas.

<Info>
  Actualmente MPP solo es compatible con los endpoints `/search` y `/contents` de Exa.
  La Agent API (`/agent/runs`) y `/answer` requieren una API key de Exa y pasan
  por el flujo estándar de facturación con API key.
</Info>

<div id="what-youll-build">
  ## Qué construirás
</div>

Un pipeline ligero de enrichment que, a partir de una lista de nombres de empresas o
descripciones de objetivos:

1. Usa `/search` de Exa con `type: "deep"` y `outputSchema` para encontrar la
   página oficial de la empresa y extraer los metadatos clave.
2. Usa `contents.highlights` sobre el resultado devuelto para obtener fragmentos de las fuentes
   sobre financiación, sede, empleados y producto.
3. Emite un registro de enrichment en CSV o JSON por cada entrada.

Este patrón sirve para el enrichment de listas de leads, la investigación de cuentas y la
personalización de campañas salientes. Al estar compuesto por llamadas independientes a `/search` + `/contents`,
cada paso puede pagarse con MPP.

<div id="prerequisites">
  ## Requisitos previos
</div>

* Una wallet compatible con Tempo con fondos en **USDC.e** en la red principal de Tempo.
* Una forma segura de cargar la key privada de la wallet en tiempo de ejecución (ver más abajo; nunca subas la key a un repositorio ni la expongas en el código fuente).
* `mppx` (TypeScript) o `pympp` (Python) instalado.

<Info>
  Para una configuración por línea de comandos que no requiere una key privada en texto plano, usa la [CLI de Tempo Wallet](/es/docs/integrations/payments/mpp/quickstart#pay-from-the-command-line). `tempo wallet login` crea o conecta una wallet y puede incluir MPP Credits gratuitos para los nuevos registros.
</Info>

<div id="mpp-setup">
  ## Configuración de MPP
</div>

<div id="install-the-client">
  ### Instala el cliente
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="load-your-private-key-safely">
  ### Carga tu key privada de forma segura
</div>

Nunca escribas una key privada directamente en el código. Los ejemplos siguientes leen `WALLET_PRIVATE_KEY` del entorno de ejecución solo para desarrollo local. En producción, cárgala desde un gestor de secretos como 1Password, AWS Secrets Manager o HashiCorp Vault.

<CodeGroup>
  ```bash TypeScript theme={null}
  # Defínela en tu shell o en el almacén de secretos de CI; nunca subas este valor al repositorio
  export WALLET_PRIVATE_KEY="0x..."
  ```

  ```bash Python theme={null}
  # Defínela en tu shell o en el almacén de secretos de CI; nunca subas este valor al repositorio
  export WALLET_PRIVATE_KEY="0x..."
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### Realiza una solicitud de búsqueda de pago
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  // En producción, cárgalo desde un gestor de secretos: nunca subas el valor en texto plano.
  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      numResults: 5,
      contents: { highlights: true },
    }),
  });

  const data = (await response.json()) as { results: { title: string; url: string }[] };
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      # En producción, cárgalo desde un gestor de secretos: nunca subas el valor en texto plano.
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": "Series A fintech companies with 50-200 employees",
                  "numResults": 5,
                  "contents": {"highlights": True},
              },
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

Una respuesta correcta devuelve los resultados de Exa junto con un encabezado `Payment-Receipt` con
el hash de la transacción on-chain.

<div id="make-a-paid-contents-request">
  ### Realizar una solicitud de pago a contents
</div>

<CodeGroup>
  ```typescript TypeScript theme={null}
  const contentsResponse = await mppx.fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urls: ["https://www.example.com"],
      text: true,
      summary: true,
    }),
  });

  const contentsData = (await contentsResponse.json()) as {
    results: { url: string; text?: string; summary?: string }[];
  };
  console.log(contentsData.results[0]);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/contents",
      json={
          "urls": ["https://www.example.com"],
          "text": True,
          "summary": True,
      },
  )
  print(response.json()["results"][0])
  ```
</CodeGroup>

<div id="gtm-enrichment-recipe">
  ## Receta de enrichment para GTM
</div>

<div id="enrich-a-list-of-companies">
  ### Enriquecer una lista de empresas
</div>

A partir de una lista de nombres de empresas, busca la página de cada una y extrae
detalles estructurados.

<CodeGroup>
  ```typescript TypeScript theme={null}
  interface CompanyEnrichment {
    name: string;
    url: string;
    title: string;
    industry?: string;
    headquarters?: string;
    funding?: string;
    summary?: string;
    highlights: string[];
  }

  async function enrichCompanies(names: string[]): Promise<CompanyEnrichment[]> {
    const enriched: CompanyEnrichment[] = [];

    for (const name of names) {
      const response = await mppx.fetch("https://api.exa.ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${name} official company`,
          type: "deep",
          numResults: 1,
          contents: {
            highlights: { query: "funding, headquarters, employees, product" },
          },
          outputSchema: {
            type: "object",
            properties: {
              company: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  industry: { type: "string" },
                  headquarters: { type: "string" },
                  funding: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["name", "url"],
              },
            },
            required: ["company"],
          },
        }),
      });

      const data = (await response.json()) as {
        output?: { company?: CompanyEnrichment & { summary?: string } };
        results?: { highlights?: string[] }[];
      };
      const company = data.output?.company;
      const highlights = data.results?.[0]?.highlights?.slice(0, 3) ?? [];
      if (!company) continue;

      enriched.push({
        ...company,
        title: company.name,
        highlights,
      });
    }

    return enriched;
  }
  ```

  ```python Python theme={null}
  async def enrich_companies(names):
      enriched = []
      for name in names:
          response = await client.post(
              "https://api.exa.ai/search",
              json={
                  "query": f"{name} official company",
                  "type": "deep",
                  "numResults": 1,
                  "contents": {
                      "highlights": {"query": "funding, headquarters, employees, product"}
                  },
                  "outputSchema": {
                      "type": "object",
                      "properties": {
                          "company": {
                              "type": "object",
                              "properties": {
                                  "name": {"type": "string"},
                                  "url": {"type": "string"},
                                  "industry": {"type": "string"},
                                  "headquarters": {"type": "string"},
                                  "funding": {"type": "string"},
                                  "summary": {"type": "string"},
                              },
                              "required": ["name", "url"],
                          }
                      },
                      "required": ["company"],
                  },
              },
          )
          data = response.json()
          company = data.get("output", {}).get("company")
          highlights = []
          if data.get("results"):
              highlights = data["results"][0].get("highlights", [])[:3]
          if not company:
              continue

          enriched.append({
              "name": company["name"],
              "url": company["url"],
              "title": company["name"],
              "industry": company.get("industry"),
              "headquarters": company.get("headquarters"),
              "funding": company.get("funding"),
              "summary": company.get("summary"),
              "highlights": highlights,
          })
      return enriched
  ```
</CodeGroup>

<div id="enrich-a-person-profile">
  ### Enriquecer un perfil de persona
</div>

Esta receta usa `type: "deep"`, `contents.highlights` y `outputSchema` para
investigar a una persona y devolver un perfil estructurado.

<CodeGroup>
  ```typescript TypeScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Exa Labs founders contact and background",
      type: "deep",
      numResults: 5,
      contents: {
        highlights: { query: "email, title, education, work history, LinkedIn" },
      },
      outputSchema: {
        type: "object",
        properties: {
          people: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                title: { type: "string" },
                company: { type: "string" },
                email: { type: "string" },
                linkedInUrl: { type: "string" },
                summary: { type: "string" },
              },
              required: ["name"],
            },
          },
        },
        required: ["people"],
      },
    }),
  });

  const data = (await response.json()) as {
    output?: { people: { name: string; title?: string; company?: string }[] };
  };
  console.log(data.output?.people);
  ```

  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Exa Labs founders contact and background",
          "type": "deep",
          "numResults": 5,
          "contents": {
              "highlights": {"query": "email, title, education, work history, LinkedIn"}
          },
          "outputSchema": {
              "type": "object",
              "properties": {
                  "people": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "title": {"type": "string"},
                              "company": {"type": "string"},
                              "email": {"type": "string"},
                              "linkedInUrl": {"type": "string"},
                              "summary": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["people"],
          },
      },
  )

  print(response.json().get("output", {}).get("people"))
  ```
</CodeGroup>

<Note>
  Aquí se usa `type: "deep"` para obtener un razonamiento más profundo y `outputSchema` para
  definir la forma de la respuesta. La deep search cuesta $0.012 por solicitud, y
  `contents.highlights` añade $0.001 por resultado.
</Note>

<div id="structured-output">
  ### Salida estructurada
</div>

Si quieres campos JSON en lugar de texto sin formato, usa `outputSchema` en la solicitud
de búsqueda. Exa devuelve un objeto `output` con la forma de tu esquema.

<CodeGroup>
  ```python Python theme={null}
  response = await client.post(
      "https://api.exa.ai/search",
      json={
          "query": "Series A fintech companies with 50-200 employees",
          "type": "deep-lite",
          "numResults": 5,
          "outputSchema": {
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "headcount": {"type": "string"},
                              "headquarters": {"type": "string"},
                              "fundingStage": {"type": "string"},
                          },
                          "required": ["name"],
                      },
                  }
              },
              "required": ["companies"],
          },
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "Series A fintech companies with 50-200 employees",
      type: "deep-lite",
      numResults: 5,
      outputSchema: {
        type: "object",
        properties: {
          companies: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                headcount: { type: "string" },
                headquarters: { type: "string" },
                fundingStage: { type: "string" }
              },
              required: ["name"]
            }
          }
        },
        required: ["companies"]
      }
    })
  });
  ```
</CodeGroup>

<Note>
  `outputSchema` funciona mejor con los tipos de búsqueda `deep-lite` o `deep`. Añade una
  llamada a un LLM del lado de Exa, por lo que su precio es el de `deep-lite`/`deep`.
</Note>

<div id="pricing-and-limits">
  ## Precios y límites
</div>

MPP usa los mismos precios por solicitud que la facturación con API key. Las solicitudes de búsqueda mediante MPP
están limitadas a 10 resultados.

| Operación                                       | Precio               |
| ----------------------------------------------- | -------------------- |
| `/search` con `type` `instant`, `auto` o `fast` | $0.007 por solicitud |
| `/search` con `type` `deep-lite` o `deep`       | $0.012 por solicitud |
| `/search` con `type` `deep-reasoning`           | $0.015 por solicitud |
| `contents.text`                                 | $0.001 por URL       |
| `contents.highlights`                           | $0.001 por URL       |
| `contents.summary`                              | $0.001 por resultado |

Consulta [Pagar con MPP (Tempo)](/es/docs/integrations/payments/mpp/quickstart) para ver la referencia completa,
incluidos los límites de tasa, los detalles de red y los encabezados de pago.

<div id="production-tips">
  ## Consejos para producción
</div>

* **Financia la wallet únicamente con USDC.e.** Exa cubre la comisión de la red Tempo,
  así que la wallet no necesita un token de gas aparte.
* **Gestiona las respuestas `402`.** El SDK de MPP reintenta automáticamente, pero un
  cliente personalizado debería reintentar ante un `402` usando el desafío `WWW-Authenticate: Payment`.
* **Cachea los resultados de `/contents`.** El contenido se cobra por URL. Guarda en caché por URL para
  evitar pagar dos veces por la misma página de empresa.
* **Ten en cuenta el límite de 10 resultados.** La búsqueda con MPP limita `numResults` a 10.
* **Nunca subas keys privadas al repositorio.** Carga `WALLET_PRIVATE_KEY` desde un gestor de
  secretos, no desde el control de versiones.

<div id="faq">
  ## Preguntas frecuentes
</div>

<AccordionGroup>
  <Accordion title="¿Puedo usar MPP con la Exa Agent API?">
    No. En el código de Exa, MPP solo está conectado a `/search` y `/contents`.
    `/agent/runs` y `/answer` requieren una API key de Exa y usan la facturación
    estándar por API key.
  </Accordion>

  <Accordion title="¿Puedo combinar MPP y una API key de Exa en la misma solicitud?">
    No. Si una solicitud incluye `x-api-key` o `Authorization: Bearer`, el flujo
    de API key tiene prioridad y se omite MPP.
  </Accordion>

  <Accordion title="¿Qué ocurre si falla la liquidación de MPP?">
    Exa devuelve `402` con un nuevo desafío `WWW-Authenticate: Payment` y sin
    resultados. Tu cliente puede reintentar con un nuevo pago. No se devuelven
    resultados hasta que la liquidación se complete correctamente.
  </Accordion>

  <Accordion title="¿Necesito un wallet de Tempo distinto por entorno?">
    Puedes reutilizar el mismo wallet, pero recomendamos usar wallets separados para
    desarrollo y producción. El QPS por wallet es de 10 solicitudes por segundo, contando
    todas las solicitudes provenientes de ese wallet.
  </Accordion>
</AccordionGroup>

<div id="next-steps">
  ## Próximos pasos
</div>

* [Pagar con MPP (Tempo)](/es/docs/integrations/payments/mpp/quickstart): referencia completa de MPP
* [Guía de la Exa Search API](/es/docs/search/quickstart): referencia de parámetros de búsqueda
* [Guía de la Exa Contents API](/es/docs/contents/quickstart): referencia de parámetros de contenido
* [Documentación de Tempo MPP](https://mpp.dev/protocol): detalles del protocolo y del SDK