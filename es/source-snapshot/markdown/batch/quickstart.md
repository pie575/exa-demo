> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="batch-api">
  # Batch API
</div>

> Ejecuta solicitudes a la API de Exa de forma asíncrona en lotes.

<Info>
  La Batch API está disponible para clientes Enterprise una vez que Exa la habilita para tu equipo. Escribe a [sales@exa.ai](mailto:sales@exa.ai) para hablar sobre el acceso y la habilitación de Enterprise.
</Info>

La Batch API te permite enviar muchas solicitudes a la API de Exa a la vez y recuperar sus resultados más tarde en un archivo JSONL. En lugar de enviar miles de solicitudes individuales y encargarte tú mismo de los límites de tasa y los reintentos, envías un solo lote, consultas su estado y descargas todos los resultados en un único archivo.

Úsala para enrichment sin conexión, cargas retroactivas de datos o cualquier otro trabajo que no requiera una respuesta inmediata. Los esquemas completos de solicitud y respuesta están en la [referencia de la API](/es/docs/reference/batches/create-a-batch).

<Note>
  La Batch API está en beta. Incluye el encabezado `Exa-Beta: batches-2026-06-06` en cada solicitud.
</Note>

<div id="supported-requests">
  ## Solicitudes admitidas
</div>

Cada elemento del lote debe ser una solicitud `POST` a una de estas rutas:

| Ruta          | Caso de uso                                           |
| ------------- | ----------------------------------------------------- |
| `/search`     | Ejecutar solicitudes de Exa Search de forma asíncrona |
| `/agent/runs` | Ejecutar solicitudes de Exa Agent de forma asíncrona  |

Cada elemento necesita un `customId` único dentro del lote. Ese mismo `customId` se devuelve en el archivo de resultados, de modo que puedas asociar cada fila de salida con tus datos de entrada.

<div id="create-a-batch">
  ## Crear un lote
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/batches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "customId": "row-1",
          "method": "POST",
          "url": "/search",
          "body": {
            "query": "Latest AI infrastructure funding rounds"
          }
        },
        {
          "customId": "row-2",
          "method": "POST",
          "url": "/agent/runs",
          "body": {
            "query": "Summarize recent vector database launches"
          }
        }
      ],
      "metadata": {
        "project": "weekly-digest"
      }
    }'
  ```
</CodeGroup>

La respuesta contiene el ID del lote y su estado inicial:

<Accordion title="Ejemplo de respuesta">
  ```json theme={null}
  {
    "id": "batch_01j7x9v0m2n4p6q8r0s2t4v6w8",
    "object": "batch",
    "status": "in_progress",
    "requestCounts": {
      "total": 2,
      "completed": 0,
      "failed": 0
    },
    "createdAt": "2026-06-06T12:00:00.000Z",
    "expiresAt": null,
    "endedAt": null,
    "resultsUrl": null,
    "metadata": {
      "project": "weekly-digest"
    }
  }
  ```
</Accordion>

<div id="check-status">
  ## Consultar el estado
</div>

Consulta el lote periódicamente hasta que alcance un estado terminal:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

Los estados de un lote son:

| Estado        | Significado                                                             |
| ------------- | ----------------------------------------------------------------------- |
| `in_progress` | El lote está en ejecución                                              |
| `completed`   | Todas las solicitudes han finalizado y los resultados están disponibles |
| `cancelling`  | Se solicitó la cancelación y el trabajo en curso está terminando        |
| `cancelled`   | El lote se canceló                                                     |
| `expired`     | Los resultados ya no están disponibles                                  |

Cuando el lote se completa, `resultsUrl` contiene una URL de descarga del archivo JSONL de resultados y `expiresAt` se fija al final del período de retención de los resultados.

<Warning>
  `resultsUrl` es una URL prefirmada de corta duración. Vuelve a consultar el lote para obtener una URL nueva cada vez que necesites descargar los resultados de nuevo.
</Warning>

<div id="list-batches">
  ## Listar lotes
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

La respuesta se pagina mediante cursor: `data` contiene como máximo `limit` lotes y, cuando `hasMore` es `true`, pasa `nextCursor` en el parámetro de consulta `cursor` para obtener la siguiente página.

Pasa `status=completed` para listar únicamente los lotes completados:

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

`completed` es el único valor admitido; cualquier otro valor devuelve un error. Los listados completados se ordenan por fecha de expiración y usan su propio cursor, así que envía `status=completed` en cada página: los cursores de los completados y los sin filtrar no son intercambiables.

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

<div id="download-results">
  ## Descargar resultados
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

Cada línea del JSONL contiene el `customId` original y, o bien una `response`, o bien un `error`:

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

<div id="cancel-a-batch">
  ## Cancelar un lote
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="delete-a-batch">
  ## Eliminar un lote
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="access">
  ## Acceso
</div>

Para habilitar la Batch API en un equipo, escribe a [sales@exa.ai](mailto:sales@exa.ai).