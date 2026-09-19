> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="list-api-keys">
  # Lister les API keys
</div>

> Récupérez toutes les API keys appartenant à votre team, avec leurs metadata.

<Card title="Obtenez votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une key dans le dashboard. Les nouveaux comptes démarrent avec des credits gratuits.
</Card>

<Info>
  L&#39;API Team Management s&#39;active team par team. Elle s&#39;authentifie à l&#39;aide d&#39;une API key de compte de service, que vous créez depuis l&#39;onglet **Service keys** de la [page API keys](https://dashboard.exa.ai/api-keys) une fois la fonctionnalité activée pour votre team. Contactez [support@exa.ai](mailto:support@exa.ai) pour en demander l&#39;accès.
</Info>

<div id="overview">
  ## Aperçu
</div>

L&#39;endpoint List API Keys renvoie toutes les API keys associées à votre team. Pour chaque key, la réponse inclut l&#39;ID, le nom, la rate limit et le timestamp de création.

<div id="response-format">
  ## Format de réponse
</div>

La réponse contient un tableau d&#39;objets API key comprenant les informations suivantes :

* **id** : identifiant unique de l&#39;API key
* **name** : nom lisible par un humain (s&#39;il a été fourni lors de la création)
* **rateLimit** : rate limit en requêtes par minute (si définie)
* **createdAt** : horodatage ISO 8601 de la création de la clé

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml GET /api-keys
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
  /api-keys:
    get:
      tags:
        - Team Management
      summary: List API keys
      description: >-
        Returns all API keys belonging to the authenticated team. Includes ID,
        name, and rate limit for each key.
      operationId: list-api-keys
      parameters:
        - name: api_key_id
          in: query
          required: false
          schema:
            type: string
          description: Optional API key ID to retrieve a specific key.
      responses:
        '200':
          description: List of API keys retrieved successfully
          content:
            application/json:
              schema:
                oneOf:
                  - type: object
                    properties:
                      apiKeys:
                        type: array
                        items:
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
                              description: Rate limit in requests per second
                            budgetCents:
                              type:
                                - integer
                                - 'null'
                              description: Spending budget for the API key, in cents
                            isOverBudget:
                              type: boolean
                              description: Whether the API key is currently over its budget
                  - type: object
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
                            description: Rate limit in requests per second
                          budgetCents:
                            type:
                              - integer
                              - 'null'
                            description: Spending budget for the API key, in cents
                          isOverBudget:
                            type: boolean
                            description: Whether the API key is currently over its budget
                          teamId:
                            type: string
                            format: uuid
                          createdAt:
                            type: string
                            format: date-time
        '400':
          description: Bad request - invalid API key ID format
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Invalid API key ID format.
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
        '403':
          description: Forbidden - insufficient permissions to access this API key
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Insufficient permissions to access this API key
        '404':
          description: Not found - API key or team not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    examples:
                      - API key not found
                      - Team not found
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: List all API keys
          source: |
            curl -X GET 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: List all API keys
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY'
            }

            response = requests.get(
                'https://admin-api.exa.ai/team-management/api-keys',
                headers=headers
            )

            print(response.json())
        - lang: javascript
          label: List all API keys
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys', {
              method: 'GET',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY'
              }
            });


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