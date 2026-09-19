> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="error-codes">
  # Códigos de error
</div>

> Referencia de los códigos de error comunes que utiliza la API de Exa

Las API de Exa indican los errores mediante códigos de estado HTTP estándar y un cuerpo de error en JSON.

<div id="http-status-codes">
  ## Códigos de estado HTTP
</div>

| Código                      | Significado                                                                                                                           | Qué hacer                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400` Bad Request           | El cuerpo, los parámetros de consulta, los encabezados o la combinación de opciones no son válidos.                                   | Corrige la solicitud según el mensaje devuelto.                                                                                                       |
| `401` Unauthorized          | Falta la API key o no es válida.                                                                                                      | Verifica el encabezado de autenticación y la API key.                                                                                                 |
| `402` Payment Required      | Se agotaron los credits o se superó un presupuesto de gasto.                                                                          | [Recarga credits](https://dashboard.exa.ai) o comunícate con el administrador de tu equipo.                                                           |
| `403` Forbidden             | La API key no tiene acceso a la funcionalidad solicitada, o una política bloqueó la solicitud.                                        | Revisa el mensaje devuelto y las funcionalidades incluidas en tu plan.                                                                                |
| `404` Not Found             | La ruta o el recurso solicitado no existe.                                                                                            | Verifica el endpoint y el ID del recurso.                                                                                                             |
| `409` Conflict              | La solicitud entra en conflicto con el estado actual: por ejemplo, ya existe un Webset con el mismo `externalId`.                     | Obtén el recurso existente o usa un identificador distinto.                                                                                           |
| `422` Unprocessable Entity  | Una query de vista previa de Websets no pudo descomponerse en una entidad y criteria válidos.                                         | Reformula la query de vista previa.                                                                                                                   |
| `429` Too Many Requests     | Tu API key, equipo o red superó un límite de tasa o de concurrency.                                                                   | Reduce la frecuencia de solicitudes; espera los segundos indicados en `Retry-After` cuando esté presente; de lo contrario, usa retroceso exponencial. |
| `500` Internal Server Error | Ocurrió un error inesperado en el servidor.                                                                                           | Reintenta tras una breve pausa. Contacta con soporte si persiste.                                                                                     |
| `503` Service Unavailable   | Exa está temporalmente por encima de su capacidad (`SERVICE_OVERLOADED`) o no disponible. La solicitud no se procesó y no se factura. | Reintenta con retroceso exponencial. Esto no depende de tu frecuencia de solicitudes, así que reducirla no sirve de nada: reintentar sí.              |
| `504` Gateway Timeout       | La solicitud superó su plazo de procesamiento.                                                                                        | Reintenta la solicitud o reduce su alcance.                                                                                                           |

<Note>
  Los fallos a nivel de URL de `/contents` se informan en el campo `statuses` de una respuesta `200` exitosa, no como errores a nivel de solicitud. Consulta [Etiquetas de estado de obtención de contenido](#content-fetch-status-tags).
</Note>

<div id="error-response-structure">
  ## Estructura de la respuesta de error
</div>

Las respuestas de error devuelven un `requestId`, un mensaje `error` legible para las personas y un `tag` legible por máquinas:

```json theme={null}
{
  "requestId": "67207943fab9832d162b5317f4cca830",
  "error": "Invalid request body | Validation error: Invalid value for type",
  "tag": "INVALID_REQUEST_BODY"
}
```

<Note>
  Incluye el `requestId` al contactar con soporte para agilizar el diagnóstico.
</Note>

El conjunto de etiquetas es abierto y sus nombres se explican por sí solos. Haz la bifurcación primero según el código de estado HTTP y trata las etiquetas no reconocidas como información adicional, no como errores de análisis.

<div id="common-error-tags">
  ## Etiquetas de error comunes
</div>

<div id="account-billing-and-access">
  ### Cuenta, facturación y acceso
</div>

| Etiqueta                  | Código HTTP | Descripción                                                                                                             |
| ------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `INVALID_API_KEY`         | `401`       | Falta la API key, está vacía o no es válida.                                                                            |
| `NO_MORE_CREDITS`         | `402`       | La cuenta se quedó sin credits: recárgalos en [dashboard.exa.ai](https://dashboard.exa.ai).                             |
| `API_KEY_BUDGET_EXCEEDED` | `402`       | La API key superó su presupuesto de gasto: contacta al administrador de tu equipo.                                      |
| `TEAM_BUDGET_EXCEEDED`    | `402`       | El equipo superó su presupuesto de gasto del periodo de facturación actual.                                             |
| `FEATURE_DISABLED`        | `403`       | El endpoint, el tipo de search o la opción solicitados no están habilitados en tu plan.                                 |
| `PROHIBITED_CONTENT`      | `403`       | La solicitud fue rechazada por la moderación de seguridad de contenido.                                                 |
| `CONTENT_FILTER_ERROR`    | `403`       | El contenido fue rechazado por una política de seguridad durante el procesamiento.                                      |
| `RATE_LIMIT_EXCEEDED`     | `429`       | Tu API key, tu equipo o tu red superó su límite de tasa: reduce la frecuencia de tus solicitudes.                       |
| `SERVICE_OVERLOADED`      | `503`       | Exa superó temporalmente su capacidad y descartó la solicitud antes de procesarla: reintenta con retroceso exponencial. |

<div id="request-validation">
  ### Validación de solicitudes
</div>

| Etiqueta                  | Código HTTP | Descripción                                                                                       |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `INVALID_REQUEST_BODY`    | `400`       | El cuerpo JSON no superó la validación del esquema.                                               |
| `INVALID_REQUEST`         | `400`       | Las opciones entran en conflicto entre sí o se usó una función beta sin su encabezado `Exa-Beta`. |
| `INVALID_NUM_RESULTS`     | `400`       | `numResults` debe ser ≤ 100 cuando se solicitan highlights.                                       |
| `NUM_RESULTS_EXCEEDED`    | `400`       | La cantidad de resultados solicitada supera el límite de tu plan.                                 |
| `INVALID_JSON_SCHEMA`     | `400`       | El esquema de salida proporcionado no es válido.                                                  |
| `SUBPAGES_LIMIT_EXCEEDED` | `400`       | `/contents` admite como máximo 100 subpáginas por solicitud.                                      |

<div id="payment-protocols">
  ### Protocolos de pago
</div>

Las solicitudes pagadas mediante x402 o MPP también pueden devolver:

| Etiqueta                   | Código HTTP | Descripción                                     |
| -------------------------- | ----------- | ----------------------------------------------- |
| `X402_PAYMENT_REQUIRED`    | `402`       | Se requiere pago.                               |
| `X402_INVALID_SIGNATURE`   | `400`       | La firma de pago x402 no es válida.             |
| `X402_VERIFICATION_FAILED` | `402`       | No se pudo verificar el pago x402.              |
| `MPP_VERIFICATION_FAILED`  | `402`       | No se pudo verificar el pago MPP.               |
| `X402_TOO_MANY_UNPAID`     | `429`       | Demasiadas solicitudes x402 pendientes de pago. |
| `X402_WALLET_RATE_LIMITED` | `429`       | La wallet x402 superó su límite de tasa.        |
| `X402_INTERNAL_ERROR`      | `500`       | Exa no pudo crear los requisitos de pago x402.  |

<div id="content-fetch-status-tags">
  ## Etiquetas de estado de obtención de contenido
</div>

Cuando `/contents` recibe varias URL, una de ellas puede fallar mientras las demás se procesan correctamente. Los fallos a nivel de URL se devuelven en el campo `statuses` y no hacen que la solicitud falle:

```json theme={null}
{
  "results": [],
  "statuses": [
    {
      "id": "https://example.com",
      "status": "error",
      "error": {
        "tag": "CRAWL_NOT_FOUND",
        "httpStatusCode": 404
      }
    }
  ]
}
```

`httpStatusCode` describe la página de destino, no la respuesta de `/contents`.

| Etiqueta                  | Descripción                                                           | Cómo gestionarlo                                                  |
| ------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `CRAWL_NOT_FOUND`         | No se encontró la página de destino.                                  | Verifica que la URL sea correcta y accesible.                     |
| `CRAWL_HTTP_{status}`     | El destino devolvió un error HTTP, como `CRAWL_HTTP_403`.             | Gestiona el estado del destino incluido en la etiqueta.           |
| `CRAWL_TIMEOUT`           | El rastreo agotó el tiempo de espera al obtener la página de destino. | Reintenta la solicitud o vuelve a intentarlo más tarde.           |
| `CRAWL_LIVECRAWL_TIMEOUT` | La recuperación en vivo superó el `livecrawlTimeout` solicitado.      | Aumenta `livecrawlTimeout` o ajusta `maxAgeHours`.                |
| `SOURCE_NOT_AVAILABLE`    | El acceso a la fuente está prohibido o la fuente no está disponible.  | Comprueba si la fuente requiere autenticación o está restringida. |
| `UNSUPPORTED_URL`         | El esquema de la URL no es compatible con la obtención de contenido.  | Usa una URL HTTP o HTTPS estándar.                                |
| `CRAWL_UNKNOWN_ERROR`     | El rastreo falló por otro motivo.                                     | Reintenta la solicitud; contacta con soporte si persiste.         |

Estas etiquetas de estado son específicas de `/contents`; `/search` no devuelve un campo `statuses`.

<div id="getting-help">
  ## Obtener ayuda
</div>

* Consulta el [estado de Exa](/es/docs/admin/status) cuando los errores `500`, `503` o `504` persistan.
* Consulta los [límites de tasa](/es/docs/admin/billing#rate-limits) para conocer los límites actuales.
* Revisa la [referencia de la API](/es/docs/reference/search) del endpoint para ver los requisitos de la solicitud.
* Escribe a [hello@exa.ai](mailto:hello@exa.ai) indicando el estado de la respuesta, el cuerpo del error y el `requestId`.