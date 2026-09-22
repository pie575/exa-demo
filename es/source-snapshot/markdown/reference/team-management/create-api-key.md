> ## Índice de documentación {#documentation-index}
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

# Crear API key {#create-api-key}

> Crea una nueva API key para tu equipo con nombre y configuración de límite de tasa opcionales.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas empiezan con créditos gratuitos.
</Card>

<Info>
  La Team Management API se habilita por equipo. Se autentica con una API key de cuenta de servicio, que se crea desde la pestaña **Service keys** de la [página de API keys](https://dashboard.exa.ai/api-keys) una vez que la funcionalidad esté habilitada para tu equipo. Escribe a [support@exa.ai](mailto:support@exa.ai) para solicitar acceso.
</Info>

El endpoint Create API Key te permite generar nuevas API keys para tu equipo de forma programática usando tu API key de servicio.

## Parámetros opcionales {#optional-parameters}

* **name**: Un nombre descriptivo para la API key que ayude a identificar su propósito
* **rateLimit**: Número máximo de solicitudes por minuto permitidas para esta API key

## OpenAPI {#openapi}

```yaml team-management-spec.yaml POST /api-keys
openapi: 3.1.0
info:
  version: 1.0.0
  title: Team Management API
  description: >-
    API para gestionar API keys dentro de los equipos. Ofrece operaciones CRUD
    para crear, listar, actualizar y eliminar API keys con controles de acceso
    basados en equipos. La API se habilita por equipo. Escribe a support@exa.ai
    para solicitar acceso.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys:
    post:
      tags:
        - Team Management
      summary: Crear API key
      description: >-
        Crea una nueva API key para el equipo autenticado. De forma opcional,
        puedes especificar un nombre, un límite de tasa y un presupuesto para la API key.
      operationId: create-api-key
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Nombre opcional para la API key
                  example: Production API Key
                rateLimit:
                  type: integer
                  description: Límite de tasa opcional para la API key (solicitudes por segundo)
                  example: 1000
                budgetCents:
                  type:
                    - integer
                    - 'null'
                  minimum: 0
                  description: >-
                    Presupuesto de gasto opcional para la API key, en centavos.
                    Establécelo en null para eliminar el presupuesto.
                  example: 5000
              additionalProperties: false
      responses:
        '200':
          description: API key creada correctamente
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
                        description: Identificador único de la API key
                      name:
                        type: string
                        description: Nombre de la API key
                      rateLimit:
                        type:
                          - integer
                          - 'null'
                        description: Límite de tasa en solicitudes por segundo
                      budgetCents:
                        type:
                          - integer
                          - 'null'
                        description: Presupuesto de gasto para la API key, en centavos
                      isOverBudget:
                        type: boolean
                        description: Indica si la API key ha superado su presupuesto
                      teamId:
                        type: string
                        format: uuid
                        description: ID del equipo al que pertenece esta key
                      userId:
                        type: string
                        format: uuid
                        description: ID del usuario que creó esta key
                      createdAt:
                        type: string
                        format: date-time
                        description: Fecha y hora de creación de la key
        '400':
          description: Bad Request - Parámetros inválidos
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    examples:
                      - No user found for team
                      - Rate limit cannot exceed team's limit of 500 QPS
                      - >-
                        Unexpected parameters: invalidParam. Allowed: name,
                        rateLimit, budgetCents.
        '401':
          description: Unauthorized - Service key inválida o ausente
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Unauthorized
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Crear una API key con nombre y límite de tasa
          source: |
            curl -X POST 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "Production API Key",
                "rateLimit": 1000
              }'
        - lang: python
          label: Crear una API key con nombre y límite de tasa
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            data = {
                'name': 'Production API Key',
                'rateLimit': 1000
            }

            response = requests.post(
                'https://admin-api.exa.ai/team-management/api-keys',
                headers=headers,
                json=data
            )

            print(response.json())
        - lang: javascript
          label: Crear una API key con nombre y límite de tasa
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys', {
              method: 'POST',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: 'Production API Key',
                rateLimit: 1000
              })
            });


            const result = await response.json();

            console.log(result);
        - lang: bash
          label: Crear una API key sin parámetros opcionales
          source: |
            curl -X POST 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{}'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key para la autenticación del equipo
```