> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="hipaa">
  # HIPAA
</div>

> Usa el modo de cumplimiento de HIPAA para las solicitudes aptas de recuperación desde caché.

<Info>
  El cumplimiento de HIPAA está disponible para clientes Enterprise una vez que Exa lo habilita para tu equipo. Escribe a [sales@exa.ai](mailto:sales@exa.ai) para hablar sobre el acceso Enterprise, los requisitos de BAA y la habilitación.
</Info>

El modo HIPAA se controla por solicitud mediante un campo `compliance` de nivel superior:

```json theme={null}
{
  "compliance": "hipaa"
}
```

Cuando este campo está presente en un equipo apto, Exa procesa la solicitud con controles de cumplimiento de HIPAA. Si tu equipo no tiene la función habilitada, la API devuelve `403 FEATURE_DISABLED`.

El modo HIPAA incluye [retención cero de datos](/es/docs/admin/security/zero-data-retention) para esas solicitudes: Exa no almacena PHI.

<div id="supported-endpoints">
  ## Endpoints compatibles
</div>

El campo `compliance` se reconoce en:

* [`/search`](/es/docs/reference/search)
* [`/contents`](/es/docs/reference/get-contents)

Los demás endpoints rechazan el campo.

<div id="requirements">
  ## Requisitos
</div>

El modo HIPAA solo admite recuperación desde caché. Solicitudes compatibles:

* En `/search`, establece `type` en `instant` o `fast`
* Solicita `text` o `highlights` (no `summary`)
* Usa contenido exclusivamente en caché: omite los campos de actualización o establece `maxAgeHours: -1` en `/contents`

Las solicitudes incompatibles devuelven `400 INVALID_REQUEST_BODY`, entre ellas:

* `summary` en `/contents`, o `contents.summary` en `/search`
* Configuraciones de actualización que exigen una descarga en vivo, como `maxAgeHours: 0` o un `maxAgeHours` positivo
* Solicitudes de búsqueda que omiten `type` o que usan un tipo distinto de `instant` o `fast`

<div id="example">
  ## Ejemplo
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "urls": ["https://example.com/article"],
      "compliance": "hipaa",
      "highlights": true,
      "maxAgeHours": -1
    }'
  ```
</CodeGroup>

<div id="access">
  ## Acceso
</div>

Para habilitar el modo HIPAA en tu equipo, escribe a [sales@exa.ai](mailto:sales@exa.ai). Consulta el [Trust Center](https://trust.exa.ai) para ver la documentación de seguridad de Exa.