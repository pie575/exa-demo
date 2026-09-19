> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="delete-api-key">
  # Supprimer une API key
</div>

> Supprimez définitivement une API key de votre team.

<Card title="Obtenez votre Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

<Info>
  L&#39;API Team Management s&#39;active team par team. Elle s&#39;authentifie à l&#39;aide d&#39;une API key de compte de service, créée depuis l&#39;onglet **Service keys** de la [page API keys](https://dashboard.exa.ai/api-keys) une fois la fonctionnalité activée pour votre team. Contactez [support@exa.ai](mailto:support@exa.ai) pour en demander l&#39;accès.
</Info>

<div id="overview">
  ## Vue d&#39;ensemble
</div>

L&#39;endpoint Delete API Key supprime définitivement une API key de votre team.

<div id="path-parameters">
  ## Paramètres de chemin
</div>

* **id** : L&#39;identifiant unique de l&#39;API key à supprimer.

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml DELETE /api-keys/{id}
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
  /api-keys/{id}:
    delete:
      tags:
        - Team Management
      summary: Delete API key
      description: >-
        Deletes an API key. Only API keys belonging to the authenticated team
        can be deleted.
      operationId: delete-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The unique identifier of the API key to delete.
      responses:
        '200':
          description: API key deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
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
                      - api_key_id is required
                      - Invalid API key ID format.
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
          description: Forbidden - API key belongs to a different team
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: You do not have permission to access this API key
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
      security:
        - apikey: []
      x-codeSamples:
        - lang: bash
          label: Delete an API key
          source: >
            curl -X DELETE
            'https://admin-api.exa.ai/team-management/api-keys/{id}' \
              -H 'x-api-key: YOUR-SERVICE-KEY'
        - lang: python
          label: Delete an API key
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            response = requests.delete(
                'https://admin-api.exa.ai/team-management/api-keys/{id}',
                headers=headers
            )

            print(response.json())
        - lang: javascript
          label: Delete an API key
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys/{id}', {
              method: 'DELETE',
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