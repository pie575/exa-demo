> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="get-api-key-usage">
  # Obtener el uso de una API key
</div>

> Consulta las analíticas de uso y los datos de facturación de una API key específica.

<Card title="Obtén tu API key de Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Crea una key en el panel. Las cuentas nuevas empiezan con créditos gratuitos.
</Card>

<Info>
  La Team Management API se habilita por equipo. Se autentica con una API key de cuenta de servicio, que se crea desde la pestaña **Service keys** de la [página de API keys](https://dashboard.exa.ai/api-keys) una vez que la funcionalidad esté habilitada para tu equipo. Escribe a [support@exa.ai](mailto:support@exa.ai) para solicitar acceso.
</Info>

<div id="overview">
  ## Descripción general
</div>

El endpoint Get API Key Usage te permite obtener analíticas detalladas de facturación y uso de una API key específica durante un periodo determinado. Este endpoint devuelve los datos de costos del sistema de facturación de Exa, lo que ofrece una visión fidedigna de lo que se te cobra por esa API key.

<div id="path-parameters">
  ## Parámetros de ruta
</div>

* **id**: El identificador único de la API key cuyo uso se desea consultar

<div id="query-parameters">
  ## Parámetros de consulta
</div>

* **start&#95;date** (opcional): Fecha de inicio del periodo de uso en formato ISO 8601 (por ejemplo, `2025-01-01T00:00:00Z` o `2025-01-01`). Por defecto, hace 30 días. Debe estar dentro de los últimos 6 meses (180 días).
* **end&#95;date** (opcional): Fecha de fin del periodo de uso en formato ISO 8601. Por defecto, la hora actual.
* **group&#95;by** (opcional): Granularidad temporal para agrupar los resultados (`hour`, `day` o `month`). Actualmente está reservado para mejoras futuras y no modifica la estructura de la respuesta. Por defecto, `day`.

<div id="response">
  ## Respuesta
</div>

Devuelve información detallada de uso y facturación, que incluye:

* **id**: Identificador único de la API key
* **api&#95;key&#95;id**: Identificador único de la API key
* **api&#95;key&#95;name**: Nombre descriptivo de la API key (si se ha definido)
* **team&#95;id**: ID del equipo al que pertenece esta key
* **period**: Objeto con las fechas de inicio y fin del periodo de uso
* **total&#95;cost&#95;usd**: Costo total en USD del periodo especificado
* **cost&#95;breakdown**: Arreglo de desgloses de costo por tipo de precio, cada uno con:
  * **price&#95;id**: Identificador único del precio
  * **price&#95;name**: Nombre del precio (por ejemplo, «Neural Search», «Content Retrieval»)
  * **quantity**: Cantidad total consumida
  * **amount&#95;usd**: Costo en USD de este tipo de precio
* **metadata**: Objeto con el timestamp de generación del informe

<div id="important-notes">
  ## Notas importantes
</div>

* **Límite de consulta retroactiva de 6 meses**: el sistema de facturación tiene un límite de consulta retroactiva de 6 meses (180 días). Las solicitudes con un `start_date` anterior a 180 días devolverán un error 400.
* **Sin uso**: si la API key no registra uso en el periodo solicitado, `total_cost_usd` será 0 y `cost_breakdown` podría estar vacío.
* **Pertenencia al equipo**: la API key de servicio utilizada para la autenticación debe pertenecer al mismo equipo que la API key consultada. No se permite el acceso entre equipos.
* **Formatos de fecha**: las fechas pueden indicarse en formato ISO 8601 con o sin componentes de hora (por ejemplo, `2025-01-01` o `2025-01-01T00:00:00Z`).

<div id="use-cases">
  ## Casos de uso
</div>

Este endpoint resulta útil para:

* Crear paneles de facturación a nivel de API key
* Monitorear el uso y los costos de API keys específicas
* Crear alertas automatizadas según umbrales de uso
* Generar informes de uso para la asignación interna de costos
* Resolver dudas de facturación de API keys específicas

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys/{id}/usage
openapi: 3.1.0
info:
  version: 1.0.0
  title: Team Management API
  description: >-
    API for managing API keys within teams. Provides CRUD operations for
    creating, listing, updating, and deleting API keys with team-based access
    controls. The API is enabled per team. Contact support@exa.ai to request
    access.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys/{id}/usage:
    get:
      tags:
        - Team Management
      summary: Get API key usage
      description: >-
        Retrieves usage analytics and billing data for a specific API key over a
        given time period. Returns cost breakdown by price type from the billing
        system.
      operationId: get-api-key-usage
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key.
        - name: start_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            Start date for the usage period (ISO 8601 format). Defaults to 30
            days ago. Must be within the last 6 months (180 days).
          example: '2025-01-01T00:00:00Z'
        - name: end_date
          in: query
          required: false
          schema:
            type: string
            format: date-time
          description: >-
            End date for the usage period (ISO 8601 format). Defaults to current
            time.
          example: '2025-01-31T23:59:59Z'
        - name: group_by
          in: query
          required: false
          schema:
            type: string
            enum:
              - hour
              - day
              - month
          description: >-
            Time granularity for grouping results. Currently reserved for future
            enhancements and does not change the response shape. Defaults to
            'day'.
          example: day
      responses:
        '200':
          description: Usage data retrieved successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: The unique identifier of the API key.
                  api_key_id:
                    type: string
                    format: uuid
                    description: The API key ID.
                  api_key_name:
                    type:
                      - string
                      - 'null'
                    description: The name of the API key
                  team_id:
                    type: string
                    format: uuid
                    description: The team ID this key belongs to
                  period:
                    type: object
                    properties:
                      start:
                        type: string
                        format: date-time
                        description: Start of the usage period
                      end:
                        type: string
                        format: date-time
                        description: End of the usage period
                  total_cost_usd:
                    type: number
                    description: Total cost in USD for the period
                    example: 45.67
                  cost_breakdown:
                    type: array
                    description: Breakdown of costs by price type
                    items:
                      type: object
                      properties:
                        price_id:
                          type: string
                          description: Unique identifier for the price
                        price_name:
                          type: string
                          description: >-
                            Name of the price (e.g., "Neural Search", "Content
                            Retrieval")
                        quantity:
                          type: number
                          description: Total quantity consumed
                        amount_usd:
                          type: number
                          description: Cost in USD for this price type
                  metadata:
                    type: object
                    properties:
                      generated_at:
                        type: string
                        format: date-time
                        description: When this report was generated
              example:
                id: key_abc123def456
                api_key_id: 550e8400-e29b-41d4-a716-446655440000
                api_key_name: Production API Key
                team_id: 660e8400-e29b-41d4-a716-446655440000
                period:
                  start: '2025-01-01T00:00:00Z'
                  end: '2025-01-31T23:59:59Z'
                total_cost_usd: 45.67
                cost_breakdown:
                  - price_id: price_neural_search
                    price_name: Neural Search
                    quantity: 1000
                    amount_usd: 30
                  - price_id: price_content_retrieval
                    price_name: Content Retrieval
                    quantity: 500
                    amount_usd: 15.67
                metadata:
                  generated_at: '2025-02-01T10:30:00Z'
        '400':
          description: Bad Request - Invalid parameters
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    examples:
                      - Invalid API key ID format.
                      - >-
                        Invalid date format. Use ISO 8601 format (YYYY-MM-DD or
                        YYYY-MM-DDTHH:mm:ss)
                      - start_date must be before end_date
                      - >-
                        Date range too far in the past. start_date must be
                        within the last 6 months.
                      - >-
                        Invalid group_by parameter. Must be one of: hour, day,
                        month
        '401':
          description: Unauthorized - Invalid or missing service key
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Unauthorized
        '404':
          description: Not Found - API key does not exist
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: API key not found
        '500':
          description: Internal Server Error - Failed to fetch usage data
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Failed to fetch usage data. Please try again later.
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Get usage for the last 30 days (default)
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: bash
          label: Get usage for a specific date range
          source: >
            curl -X GET
            'https://admin-api.exa.ai/team-management/api-keys/{id}/usage?start_date=2025-01-01&end_date=2025-01-31'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: Get usage for a specific date range
          source: |
            import requests
            from datetime import datetime, timedelta

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY'
            }

            params = {
                'start_date': '2025-01-01T00:00:00Z',
                'end_date': '2025-01-31T23:59:59Z'
            }

            response = requests.get(
                'https://admin-api.exa.ai/team-management/api-keys/{id}/usage',
                headers=headers,
                params=params
            )

            print(response.json())
        - lang: javascript
          label: Get usage for a specific date range
          source: |
            const params = new URLSearchParams({
              start_date: '2025-01-01T00:00:00Z',
              end_date: '2025-01-31T23:59:59Z'
            });

            const response = await fetch(
              `https://admin-api.exa.ai/team-management/api-keys/{id}/usage?${params}`,
              {
                method: 'GET',
                headers: {
                  'x-api-key': 'YOUR-SERVICE-KEY'
                }
              }
            );

            const result = await response.json();
            console.log(result);
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Service API key for team authentication
```