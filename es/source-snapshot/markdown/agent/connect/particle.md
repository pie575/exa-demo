> ## Índice de documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Particle {#particle}

> Busca en transcripts de pódcast con atribución de hablante y marcas de tiempo.

Podcast Intelligence de [Particle](https://particle.news) indexa más de 100.000 programas,
completamente transcritos, diarizados, con hablantes identificados, etiquetados y enriquecidos con metadatos
a los pocos minutos de su emisión, de modo que las conversaciones habladas se vuelven buscables. Cada resultado es una
ventana de transcript atribuida a un hablante y con marcas de tiempo.

Adjunta `particle` a un run de [Exa Agent](/es/docs/agent/quickstart) mediante
[Exa Connect](/es/docs/agent/connect/overview) y el agente consultará
Particle junto con Exa web search.

## Úsalo para {#use-it-for}

* Encontrar comentarios de expertos y frases citables.
* Monitoreo de medios y marcas.
* Investigación de narrativas y sentimiento.
* Descubrir pódcasts y mantenerte al día con ellos.

## ID del proveedor {#provider-id}

Usa este valor en `dataSources`:

```text theme={null}
particle
```

## Ejemplo {#example}

Descubre qué dicen los presentadores de pódcast sobre la regulación de la IA.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()
  run = exa.agent.runs.create(
      query="What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      data_sources=[{"provider": "particle"}],
      output_schema={
          "type": "object",
          "required": ["mentions"],
          "properties": {
              "mentions": {
                  "type": "array",
                  "maxItems": 10,
                  "items": {
                      "type": "object",
                      "required": ["podcast", "episode", "speaker", "quote", "stance"],
                      "properties": {
                          "podcast": {"type": "string"},
                          "episode": {"type": "string"},
                          "speaker": {"type": "string"},
                          "quote": {"type": "string"},
                          "stance": {"type": "string", "description": "pro-regulation, anti-regulation, or nuanced"},
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
    query: "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
    dataSources: [{ provider: "particle" }],
    outputSchema: {
      type: "object",
      required: ["mentions"],
      properties: {
        mentions: {
          type: "array",
          maxItems: 10,
          items: {
            type: "object",
            required: ["podcast", "episode", "speaker", "quote", "stance"],
            properties: {
              podcast: { type: "string" },
              episode: { type: "string" },
              speaker: { type: "string" },
              quote: { type: "string" },
              stance: { type: "string", description: "pro-regulation, anti-regulation, or nuanced" },
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
      "query": "What are prominent podcast hosts and guests saying about AI regulation in 2025?",
      "dataSources": [{ "provider": "particle" }],
      "outputSchema": {
        "type": "object",
        "required": ["mentions"],
        "properties": {
          "mentions": {
            "type": "array",
            "maxItems": 10,
            "items": {
              "type": "object",
              "required": ["podcast", "episode", "speaker", "quote", "stance"],
              "properties": {
                "podcast": { "type": "string" },
                "episode": { "type": "string" },
                "speaker": { "type": "string" },
                "quote": { "type": "string" },
                "stance": { "type": "string", "description": "pro-regulation, anti-regulation, or nuanced" }
              }
            }
          }
        }
      }
    }'
  ```
</CodeGroup>

## Combina bien con {#pairs-well-with}

* [Financial Datasets](/es/docs/agent/connect/financialdatasets): contrasta lo que se comenta en los pódcast con las noticias publicadas.
* [Fiber.ai](/es/docs/agent/connect/fiber): adjunta contexto de empresas y contactos sobre las personas mencionadas.

## Próximos pasos {#next-steps}

<Columns cols={2}>
  <Card title="Adjúntalo a un run" icon="rocket" href="/es/docs/agent/connect/overview" cta="Abrir quickstart" arrow="true">
    El quickstart de Exa Connect cubre `dataSources`, los precios y el catálogo completo de partners.
  </Card>

  <Card title="Combina proveedores" icon="blend" href="/es/docs/agent/connect/combining-providers" cta="Leer guía" arrow="true">
    Adjunta hasta cinco partners a un mismo run y formula la consulta para que se active cada uno.
  </Card>

  <Card title="Aprende Exa Agent" icon="book-open" href="/es/docs/agent/quickstart" cta="Abrir guía" arrow="true">
    Crea runs, transmite el progreso en streaming, diseña esquemas de output y controla el effort y el costo.
  </Card>

  <Card title="Obtén una API key" icon="key" href="https://dashboard.exa.ai/api-keys" cta="Crear una key" arrow="true">
    Crea una key en el panel y ejecuta el ejemplo de esta página tal cual. Las cuentas nuevas empiezan con créditos gratuitos.
  </Card>
</Columns>