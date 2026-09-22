> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Batch API {#batch-api}

> Ejecuta solicitudes de la API de Exa de forma asíncrona en batches.

<Info>
  La Batch API está disponible para clientes Enterprise una vez que Exa la habilita para tu equipo. Escribe a [sales@exa.ai](mailto:sales@exa.ai) para hablar sobre el acceso Enterprise y su habilitación.
</Info>

La Batch API te permite enviar muchas solicitudes de la API de Exa a la vez y recuperar sus resultados más tarde en un archivo JSONL. En lugar de enviar miles de solicitudes individuales y gestionar tú mismo los límites de tasa y los reintentos, envías un único batch, sondeas su estado y descargas todos los resultados en un solo archivo.

Úsala para enrichment sin conexión, cargas de datos históricos o cualquier otro trabajo que no requiera una respuesta inmediata. Los esquemas completos de solicitud y respuesta están en la [API reference](/es/docs/reference/batches/create-a-batch).

<Note>
  La Batch API está en beta. Incluye el encabezado `Exa-Beta: batches-2026-06-06` en cada solicitud.
</Note>

## Solicitudes admitidas {#supported-requests}

Cada elemento del batch debe ser una solicitud `POST` a una de estas rutas:

| Ruta          | Caso de uso                                           |
| ------------- | ----------------------------------------------------- |
| `/search`     | Ejecutar solicitudes de Exa Search de forma asíncrona |
| `/agent/runs` | Ejecutar solicitudes de Exa Agent de forma asíncrona  |

Cada elemento necesita un `customId` único dentro del batch. Ese mismo `customId` se devuelve en el archivo de resultados para que puedas relacionar las filas del output con tus datos de entrada.

## Crear un batch {#create-a-batch}

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

La respuesta contiene el ID del batch y su estado inicial:

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

## Consultar el estado {#check-status}

Sondea el batch hasta que alcance un estado terminal:

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

Los estados de un batch son:

| Estado        | Significado                                                          |
| ------------- | -------------------------------------------------------------------- |
| `in_progress` | El batch está en ejecución                                           |
| `completed`   | Todas las solicitudes finalizaron y los resultados están disponibles |
| `cancelling`  | Se solicitó la cancelación y el trabajo en curso está terminando     |
| `cancelled`   | El batch se canceló                                                  |
| `expired`     | Los resultados ya no están disponibles                               |

Cuando el batch se completa, `resultsUrl` contiene una URL de descarga del archivo JSONL de resultados y `expiresAt` se fija al final del periodo de retención de los resultados.

<Warning>
  `resultsUrl` es una URL prefirmada de corta duración. Vuelve a consultar el batch para obtener una URL nueva cada vez que necesites descargar los resultados otra vez.
</Warning>

## Listar batches {#list-batches}

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

La respuesta está paginada por cursor: `data` contiene hasta `limit` batches y, cuando `hasMore` es `true`, pasa `nextCursor` como parámetro de consulta `cursor` para obtener la siguiente página.

Pasa `status=completed` para listar únicamente los batches completados:

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

`completed` es el único valor admitido; cualquier otro valor devuelve un error. Los listados completados se ordenan por fecha de expiración y usan su propio cursor, así que envía `status=completed` en todas las páginas: los cursores de completados y los sin filtrar no son intercambiables.

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

## Descargar resultados {#download-results}

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

Cada línea JSONL contiene el `customId` original y, o bien un `response`, o bien un `error`:

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

## Cancelar un batch {#cancel-a-batch}

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

## Eliminar un batch {#delete-a-batch}

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

## Acceso {#access}

Para habilitar la Batch API en un equipo, escribe a [sales@exa.ai](mailto:sales@exa.ai).