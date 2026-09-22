> ## Índice de la documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Crear un webhook {#create-a-webhook}

> Crea un Webhook que entrega los eventos seleccionados a tu URL a medida que se producen.

La respuesta incluye el `secret` de firma que se usa para verificar las entregas; solo se devuelve en el momento de la creación.

<Warning>
  **No se siguen las redirecciones.** Las entregas de webhooks se envían directamente a la
  URL registrada. Si tu endpoint responde con una redirección 3xx, la entrega
  se considerará fallida. Registra siempre la URL de destino final.
</Warning>

## OpenAPI {#openapi}

```yaml exa-spec.yaml POST /v0/webhooks
openapi: 3.1.0
info:
  title: Exa Public API
  version: 2.0.0
servers:
  - url: https://api.exa.ai
security:
  - apiKey: []
  - bearer: []
tags: []
paths:
  /v0/webhooks:
    servers:
      - url: https://api.exa.ai/websets
    post:
      tags:
        - Webhooks
      summary: Crear un webhook
      description: >-
        Crea un webhook que entrega los eventos seleccionados a tu URL a medida
        que ocurren.


        La respuesta incluye el `secret` de firma que se usa para verificar las
        entregas; solo se devuelve al crearlo.
      operationId: webhooks-create
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateWebhookParameters'
      responses:
        '200':
          description: Webhook
          headers:
            X-Request-Id:
              schema:
                type: string
              description: Identificador único de la solicitud.
              example: req_N6SsgoiaOQOPqsYKKiw5
              required: true
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Webhook'
      security:
        - apiKey: []
        - bearer: []
components:
  schemas:
    CreateWebhookParameters:
      properties:
        events:
          minItems: 1
          maxItems: 19
          items:
            $ref: '#/components/schemas/EventType'
          description: Los eventos que activan el webhook
          type: array
        url:
          format: uri
          description: La URL a la que se envía el webhook
          type: string
        metadata:
          description: Conjunto de pares clave-valor que quieres asociar con este objeto.
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
      required:
        - events
        - url
      type: object
    Webhook:
      properties:
        id:
          description: El identificador único del webhook
          type: string
        object:
          const: webhook
          default: webhook
          type: string
        status:
          enum:
            - active
            - inactive
          title: WebhookStatus
          description: El estado del webhook
          type: string
        events:
          minItems: 1
          items:
            $ref: '#/components/schemas/EventType'
          description: Los eventos que activan el webhook
          type: array
        url:
          format: uri
          description: La URL a la que se envía el webhook
          type: string
        secret:
          type: string
          description: >-
            El secreto para verificar la firma del webhook. Solo se devuelve al
            crear el webhook.
          nullable: true
        metadata:
          default: {}
          description: Los metadatos del webhook
          propertyNames:
            type: string
          additionalProperties:
            type: string
            maxLength: 1000
          type: object
        createdAt:
          format: date-time
          description: La fecha y hora en que se creó el webhook
          type: string
        updatedAt:
          format: date-time
          description: La fecha y hora de la última actualización del webhook
          type: string
      required:
        - id
        - object
        - status
        - events
        - url
        - secret
        - createdAt
        - updatedAt
      type: object
    EventType:
      enum:
        - webset.created
        - webset.deleted
        - webset.paused
        - webset.idle
        - webset.search.created
        - webset.search.canceled
        - webset.search.completed
        - webset.search.updated
        - import.created
        - import.completed
        - webset.item.created
        - webset.item.enriched
        - monitor.created
        - monitor.updated
        - monitor.deleted
        - monitor.run.created
        - monitor.run.completed
        - webset.export.created
        - webset.export.completed
      type: string
  securitySchemes:
    apiKey:
      type: apiKey
      name: x-api-key
      in: header
      description: >-
        Envía tu API key de Exa en el encabezado x-api-key. También puedes
        autenticarte con Authorization: Bearer <key>.
    bearer:
      type: http
      scheme: bearer
      description: >-
        Envía tu API key de Exa en el encabezado x-api-key. También puedes
        autenticarte con Authorization: Bearer <key>.

```