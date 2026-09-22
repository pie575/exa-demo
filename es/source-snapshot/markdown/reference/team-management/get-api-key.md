> <div id="documentation-index">
  > ## Índice de documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="get-api-key">
  # Obtener API key
</div>

> Recupera los detalles de una API key específica a partir de su ID.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas empiezan con créditos gratuitos.
</Card>

<Info>
  La Team Management API se habilita por equipo. Se autentica con una API key de cuenta de servicio, que se crea desde la pestaña **Service keys** de la [página de API keys](https://dashboard.exa.ai/api-keys) una vez que la funcionalidad está habilitada para tu equipo. Escribe a [support@exa.ai](mailto:support@exa.ai) para solicitar acceso.
</Info>

<div id="overview">
  ## Descripción general
</div>

El endpoint Get API Key permite obtener información detallada sobre una API key específica a partir de su identificador único.

<div id="path-parameters">
  ## Path Parameters
</div>

* **id**: El identificador único de la API key que se desea obtener

<div id="response">
  ## Respuesta
</div>

Devuelve información detallada sobre la API key, que incluye:

* **id**: Identificador único
* **name**: Nombre descriptivo
* **rateLimit**: Límite de tasa en solicitudes por minuto (si está configurado)
* **teamId**: ID del equipo al que pertenece esta key
* **createdAt**: Fecha de creación de la key

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys/{id}
openapi: 3.1.0
info:
  version: 1.0.0
  title: Team Management API
  description: >-
    API para gestionar API keys dentro de los equipos. Ofrece operaciones CRUD
    para crear, listar, actualizar y eliminar API keys con controles de acceso
    basados en el equipo. La API se habilita por equipo. Escribe a
    support@exa.ai para solicitar acceso.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys/{id}:
    get:
      tags:
        - Team Management
      summary: Obtener API key
      description: Recupera los detalles de una API key específica por su ID.
      operationId: get-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: El identificador único de la API key.
      responses:
        '200':
          description: API key recuperada correctamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  apiKey:
                    type: object
                    properties:
                      id:
                        type: string
                        format: uuid
                      name:
                        type: string
                      rateLimit:
                        type:
                          - integer
                          - 'null'
                        description: Límite de tasa en solicitudes por segundo
                      budgetCents:
                        type:
                          - integer
                          - 'null'
                        description: Presupuesto de gasto de la API key, en centavos
                      isOverBudget:
                        type: boolean
                        description: Indica si la API key ha superado actualmente su presupuesto
                      teamId:
                        type: string
                        format: uuid
                      createdAt:
                        type: string
                        format: date-time
        '400':
          description: Solicitud incorrecta: formato de ID de API key no válido
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid API key ID format.
        '401':
          description: No autorizado: service key no válida o ausente
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Unauthorized
        '404':
          description: No encontrado: la API key no existe
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: API key not found
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Obtener una API key específica
          source: >
            curl -X GET 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key para la autenticación del equipo

```