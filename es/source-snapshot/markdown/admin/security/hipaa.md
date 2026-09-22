> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# HIPAA {#hipaa}

> Usa el modo de HIPAA compliance para las solicitudes aptas de recuperación en caché.

<Info>
  HIPAA compliance está disponible para clientes Enterprise una vez que Exa lo habilite para tu equipo. Escribe a [sales@exa.ai](mailto:sales@exa.ai) para hablar sobre el acceso Enterprise, los requisitos de BAA y la habilitación.
</Info>

El modo HIPAA se controla en cada solicitud mediante el campo `compliance` de nivel superior:

```json theme={null}
{
  "compliance": "hipaa"
}
```

Cuando este campo está presente en un equipo habilitado, Exa procesa la solicitud con controles de cumplimiento de HIPAA. Si tu equipo no cuenta con esta habilitación, la API devuelve `403 FEATURE_DISABLED`.

El modo HIPAA incluye [Zero Data Retention](/es/docs/admin/security/zero-data-retention) para esas solicitudes: Exa no almacena PHI.

## Endpoints compatibles {#supported-endpoints}

El campo `compliance` se reconoce en:

* [`/search`](/es/docs/reference/search)
* [`/contents`](/es/docs/reference/get-contents)

Los demás endpoints rechazan el campo.

## Requisitos {#requirements}

El modo HIPAA solo admite recuperación en caché. Solicitudes compatibles:

* En `/search`, establece `type` como `instant` o `fast`
* Solicita `text` o `highlights` (no `summary`)
* Usa contenido únicamente desde la caché: omite los campos de frescura o establece `maxAgeHours: -1` en `/contents`

Las solicitudes incompatibles devuelven `400 INVALID_REQUEST_BODY`, entre ellas:

* `summary` en `/contents`, o `contents.summary` en `/search`
* Ajustes de frescura que requieren una descarga en vivo, como `maxAgeHours: 0` o un valor positivo de `maxAgeHours`
* Solicitudes de búsqueda que omiten `type` o que usan un tipo distinto de `instant` o `fast`

## Ejemplo {#example}

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

## Acceso {#access}

Para habilitar el modo HIPAA en tu equipo, escribe a [sales@exa.ai](mailto:sales@exa.ai). Consulta el [Trust Center](https://trust.exa.ai) para ver la documentación de seguridad de Exa.