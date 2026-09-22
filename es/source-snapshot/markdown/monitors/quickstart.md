> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Monitors API {#monitors-api}

> Ejecuta búsquedas recurrentes y recibe los nuevos resultados descubiertos mediante un webhook.

Los monitors ejecutan búsquedas de Exa de forma recurrente según una programación y entregan los resultados a un endpoint de webhook.

Usa Monitors para hacer seguimiento de noticias, anuncios de competidores, rondas de financiación, cambios regulatorios, publicaciones de investigación o cualquier otro tema que cambie con el tiempo.

## Cómo funcionan los Monitors {#how-monitors-work}

En cada run, Exa ejecuta la búsqueda configurada, filtra por fecha, descarta los resultados o hallazgos que el
monitor ya devolvió y envía el nuevo output a tu webhook.

Cada monitor mantiene su propio historial de runs, así que formula la consulta en torno a la señal continua que quieres
seguir, en lugar de añadir tú mismo un rango de fechas móvil.

## Crea tu primer monitor {#create-your-first-monitor}

Crea un monitor con una consulta de búsqueda, un intervalo y el endpoint HTTPS que recibirá
las actualizaciones:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  monitor = exa.monitors.create({
      "name": "Battery recycling expansion",
      "search": {
          "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
          "type": "interval",
          "period": "1d",
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"],
      },
  })

  print(monitor.id)
  print(monitor.webhook_secret)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const monitor = await exa.monitors.create({
    name: "Battery recycling expansion",
    search: {
      query: "new battery recycling facilities announced in North America"
    },
    trigger: {
      type: "interval",
      period: "1d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });

  console.log(monitor.id);
  console.log(monitor.webhookSecret);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "Battery recycling expansion",
      "search": {
        "query": "new battery recycling facilities announced in North America"
      },
      "trigger": {
        "type": "interval",
        "period": "1d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

<Accordion title="Ejemplo de respuesta">
  ```json theme={null}
  {
    "id": "01k4d9w6y3h7p2m8n5q1r0s4tv",
    "name": "Battery recycling expansion",
    "status": "active",
    "search": {
      "query": "new battery recycling facilities announced in North America"
    },
    "trigger": {
      "type": "interval",
      "period": "1d"
    },
    "outputSchema": null,
    "metadata": null,
    "webhook": {
      "url": "https://example.com/webhooks/exa",
      "events": ["monitor.run.completed"]
    },
    "nextRunAt": null,
    "createdAt": "2026-09-05T20:00:00.000Z",
    "updatedAt": "2026-09-05T20:00:00.000Z",
    "webhookSecret": "<one-time-webhook-signing-secret>"
  }
  ```
</Accordion>

Guarda el `webhookSecret` al crear el monitor. Solo se devuelve una vez y es necesario para
verificar las firmas de los webhook.

## Configura el output {#configure-the-output}

Cada run completado devuelve las páginas recién descubiertas en `output.results`.

Exa también sintetiza los hallazgos de cada página en `output.content`:

| Forma del output  | Cómo usarla                    | Valor devuelto                                       |
| ----------------- | ------------------------------ | ---------------------------------------------------- |
| Resumen de texto  | Por defecto                    | Una cadena en `output.content`                       |
| JSON estructurado | Añade un objeto `outputSchema` | JSON que coincide con el esquema en `output.content` |

Los orígenes de los campos sintetizados se devuelven automáticamente en `output.grounding`.

Añade `outputSchema` cuando el código posterior necesite campos
consistentes:

```json theme={null}
{
  "outputSchema": {
    "type": "object",
    "properties": {
      "announcements": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "company": { "type": "string" },
            "location": { "type": "string" },
            "announcement": { "type": "string" }
          },
          "required": ["company", "location", "announcement"]
        }
      }
    },
    "required": ["announcements"]
  }
}
```

Mantén las citas y la confianza fuera del esquema. Se devuelven por separado en
`output.grounding`.

## Añadir contenido de página {#add-page-content}

`search` acepta las mismas opciones que [Exa Search](/es/docs/search/quickstart): usa `contents` para incluir
highlights, texto completo o resúmenes en cada resultado, y `includeDomains` o `excludeDomains` para
limitar las fuentes.

<CodeGroup>
  ```python Python theme={null}
  monitor = exa.monitors.create({
      "name": "LLM Research Tracker",
      "search": {
          "query": "new large language model training techniques and architectures",
          "numResults": 10,
          "contents": {
              "highlights": True
          }
      },
      "trigger": {
          "type": "interval",
          "period": "7d"
      },
      "webhook": {
          "url": "https://example.com/webhooks/exa",
          "events": ["monitor.run.completed"]
      }
  })
  ```

  ```javascript JavaScript theme={null}
  const monitor = await exa.monitors.create({
    name: "LLM Research Tracker",
    search: {
      query: "new large language model training techniques and architectures",
      numResults: 10,
      contents: {
        highlights: true
      }
    },
    trigger: {
      type: "interval",
      period: "7d"
    },
    webhook: {
      url: "https://example.com/webhooks/exa",
      events: ["monitor.run.completed"]
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "name": "LLM Research Tracker",
      "search": {
        "query": "new large language model training techniques and architectures",
        "numResults": 10,
        "contents": {
          "highlights": true
        }
      },
      "trigger": {
        "type": "interval",
        "period": "7d"
      },
      "webhook": {
        "url": "https://example.com/webhooks/exa",
        "events": ["monitor.run.completed"]
      }
    }'
  ```
</CodeGroup>

## Prueba tu monitor {#test-your-monitor}

Lanza un run de inmediato en lugar de esperar a la próxima ejecución programada y luego lista sus runs:

<CodeGroup>
  ```python Python theme={null}
  exa.monitors.trigger(monitor.id)

  runs = exa.monitors.runs.list(monitor.id, limit=1)
  latest = runs.data[0]
  print(latest.id, latest.status)
  ```

  ```javascript JavaScript theme={null}
  await exa.monitors.trigger(monitor.id);

  const runs = await exa.monitors.runs.list(monitor.id, { limit: 1 });
  const latest = runs.data[0];
  console.log(latest.id, latest.status);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/monitors/$MONITOR_ID/trigger" \
    -H "Authorization: Bearer $EXA_API_KEY"

  curl -s "https://api.exa.ai/monitors/$MONITOR_ID/runs?limit=1" \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

Los estados de un run son:

| Estado      | Significado                                                  |
| ----------- | ------------------------------------------------------------ |
| `pending`   | El run está en cola                                          |
| `running`   | El run se está ejecutando                                    |
| `completed` | El run finalizó; obtenlo por ID para leer su output completo |
| `failed`    | El run falló; `failReason` indica el motivo                  |
| `cancelled` | El run se canceló                                            |

`output` es null hasta que el run se completa.

## Programar runs {#schedule-runs}

El intervalo mínimo es de una hora. Usa una única duración como `1h`, `6h`, `1d` o `7d`. La programación se ancla a la hora de creación del monitor — un monitor diario creado a las 2:30 PM se ejecuta cada día alrededor de las 2:30 PM — pero cada run puede retrasarse hasta 30 minutos, así que no dependas de una hora de entrega exacta.

Omite `trigger` para crear un monitor de ejecución solo manual. Pausar un monitor programado también detiene los runs automáticos, pero conserva los disparos manuales.

<Note>
  Los runs de un monitor no se superponen. Si el siguiente run programado comienza mientras el anterior aún está en ejecución, Exa cancela el run anterior.
</Note>

## Recibir actualizaciones por webhook {#receive-webhook-updates}

Suscríbete a `monitor.run.completed` cuando solo necesites los runs finalizados. Si omites `events`, Exa
envía también eventos del ciclo de vida del monitor y eventos de creación de runs.

El payload del run completado incluye el estado y el output del run. Los `metadata` opcionales del monitor se
reenvían en las entregas del webhook, lo que te permite dirigir cada actualización al cliente,
espacio de trabajo, canal o trabajo interno correcto.

<Accordion title="Payload de webhook de run completado">
  El output y las marcas de tiempo aparecen abreviados a continuación.

  ```json theme={null}
  {
    "id": "event_...",
    "object": "event",
    "type": "monitor.run.completed",
    "data": {
      "id": "01k...",
      "monitorId": "01k...",
      "status": "completed",
      "output": {
        "results": [
          {
            "title": "New battery recycling facility announced",
            "url": "https://example.com/announcement"
          }
        ],
        "content": "...",
        "grounding": [
          {
            "field": "content",
            "citations": [
              {
                "title": "New battery recycling facility announced",
                "url": "https://example.com/announcement"
              }
            ],
            "confidence": "high"
          }
        ]
      },
      "failReason": null,
      "metadata": {
        "workspace_id": "workspace_123"
      }
    },
    "createdAt": "2026-09-05T20:00:00.000Z"
  }
  ```
</Accordion>

<Warning>
  Tu webhook debe usar HTTPS y ser el destino final, ya que no se siguen redirecciones.
  Verifica `Exa-Signature` antes de procesar el evento.
</Warning>

Cada entrega incluye un encabezado `Exa-Signature` con el formato `t=<timestamp>,v1=<signature>`.
Construye `<timestamp>.<raw-request-body>`, calcula su resumen HMAC-SHA256 con el
`webhookSecret` de un solo uso y compara el resultado con `v1` mediante una comparación de tiempo constante.

<CodeGroup>
  ```python Python theme={null}
  import hashlib
  import hmac


  def verify_webhook(payload: bytes, signature_header: str, secret: str) -> bool:
      parts = dict(part.split("=", 1) for part in signature_header.split(","))
      signed_payload = parts["t"].encode() + b"." + payload
      expected = hmac.new(secret.encode(), signed_payload, hashlib.sha256).hexdigest()
      return hmac.compare_digest(expected, parts["v1"])
  ```

  ```javascript JavaScript theme={null}
  import crypto from "crypto";

  function verifyWebhook(payload, signatureHeader, secret) {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((part) => part.split("=", 2))
    );
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${parts.t}.`)
      .update(payload)
      .digest("hex");
    const actualBuffer = Buffer.from(parts.v1 ?? "", "hex");
    const expectedBuffer = Buffer.from(expected, "hex");

    return (
      actualBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
  ```
</CodeGroup>

## Próximos pasos {#next-steps}

<Columns cols={2}>
  <Card title="Crear un monitor" icon="bell" href="/es/docs/reference/monitors/create-a-monitor" cta="Abrir referencia" arrow="true">
    Consulta todos los campos de búsqueda, schedule, output, metadatos y webhook.
  </Card>

  <Card title="Runs de monitores" icon="clock" href="/es/docs/reference/monitors/runs/get-a-run" cta="Abrir referencia" arrow="true">
    Inspecciona el estado, el output, el grounding y el motivo del fallo de un run.
  </Card>

  <Card title="Guía de búsqueda" icon="search" href="/es/docs/search/quickstart" cta="Abrir guía" arrow="true">
    Configura consultas, filtros, highlights, texto completo y frescura.
  </Card>

  <Card title="Buenas prácticas de búsqueda" icon="sparkles" href="/es/docs/search/best-practices" cta="Leer guía" arrow="true">
    Mejora la calidad de la recuperación sin perder el foco en el output.
  </Card>
</Columns>