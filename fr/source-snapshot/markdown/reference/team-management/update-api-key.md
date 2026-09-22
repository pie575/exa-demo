> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="update-api-key">
  # Mettre à jour une API key
</div>

> Mettez à jour le nom et la limite de débit d&#39;une API key existante.

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<Info>
  La Team Management API s&#39;active équipe par équipe. Elle s&#39;authentifie à l&#39;aide d&#39;une API key de compte de service, que vous créez depuis l&#39;onglet **Service keys** de la [page API keys](https://dashboard.exa.ai/api-keys) une fois la fonctionnalité activée pour votre équipe. Contactez [support@exa.ai](mailto:support@exa.ai) pour en demander l&#39;accès.
</Info>

<div id="overview">
  ## Vue d&#39;ensemble
</div>

L&#39;endpoint Update API Key vous permet de modifier une API key existante

<div id="path-parameters">
  ## Paramètres de chemin
</div>

* **id** : l&#39;identifiant unique de l&#39;API key à mettre à jour.

<div id="optional-parameters">
  ## Paramètres optionnels
</div>

* **name** : nouveau nom descriptif de l&#39;API key
* **rateLimit** : nouvelle limite de débit, en requêtes par minute

<div id="openapi">
  ## OpenAPI
</div>

```yaml team-management-spec.yaml PUT /api-keys/{id}
openapi: 3.1.0
info:
  version: 1.0.0
  title: API de gestion d'équipe
  description: >-
    API permettant de gérer les clés API au sein des équipes. Fournit des
    opérations CRUD pour créer, lister, mettre à jour et supprimer des clés API
    avec des contrôles d'accès basés sur les équipes. L'API est activée par
    équipe. Contactez support@exa.ai pour demander l'accès.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys/{id}:
    put:
      tags:
        - Gestion d'équipe
      summary: Mettre à jour une clé API
      description: >-
        Met à jour le nom et/ou la limite de débit d'une clé API existante.
        Seules les clés API appartenant à l'équipe authentifiée peuvent être
        mises à jour.
      operationId: update-api-key
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: L'identifiant unique de la clé API à mettre à jour.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  description: Nouveau nom facultatif pour la clé API
                  example: Updated Production Key
                rateLimit:
                  type: integer
                  description: >-
                    Nouvelle limite de débit facultative pour la clé API
                    (requêtes par seconde)
                  example: 2000
                budgetCents:
                  type:
                    - integer
                    - 'null'
                  minimum: 0
                  description: >-
                    Nouveau budget de dépenses facultatif pour la clé API, en
                    cents. Définissez-le sur null pour supprimer le budget.
                  example: 5000
              additionalProperties: false
      responses:
        '200':
          description: Clé API mise à jour avec succès
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
                        description: Limite de débit en requêtes par seconde
                      budgetCents:
                        type:
                          - integer
                          - 'null'
                        description: Budget de dépenses pour la clé API, en cents
                      isOverBudget:
                        type: boolean
                        description: Indique si la clé API dépasse actuellement son budget
                      teamId:
                        type: string
                        format: uuid
                      userId:
                        type: string
                        format: uuid
                      createdAt:
                        type: string
                        format: date-time
                      updatedAt:
                        type: string
                        format: date-time
        '400':
          description: Requête incorrecte - Paramètres invalides
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
          description: Non autorisé - Clé de service invalide ou manquante
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: Unauthorized
        '403':
          description: Interdit - La clé API appartient à une autre équipe
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: You do not have permission to access this API key
        '404':
          description: Introuvable - La clé API n'existe pas
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
          label: Mettre à jour le nom et la limite de débit de la clé API
          source: >
            curl -X PUT 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "Updated Production Key",
                "rateLimit": 2000
              }'
        - lang: python
          label: Mettre à jour le nom et la limite de débit de la clé API
          source: |
            import requests

            headers = {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
            }

            data = {
                'name': 'Updated Production Key',
                'rateLimit': 2000
            }

            response = requests.put(
                'https://admin-api.exa.ai/team-management/api-keys/{id}',
                headers=headers,
                json=data
            )

            print(response.json())
        - lang: javascript
          label: Mettre à jour le nom et la limite de débit de la clé API
          source: >
            const response = await
            fetch('https://admin-api.exa.ai/team-management/api-keys/{id}', {
              method: 'PUT',
              headers: {
                'x-api-key': 'YOUR-SERVICE-KEY',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: 'Updated Production Key',
                rateLimit: 2000
              })
            });


            const result = await response.json();

            console.log(result);
        - lang: bash
          label: Mettre à jour uniquement le nom
          source: >
            curl -X PUT 'https://admin-api.exa.ai/team-management/api-keys/{id}'
            \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "New Name Only"
              }'
components:
  securitySchemes:
    apikey:
      type: apiKey
      in: header
      name: x-api-key
      description: Clé API de service pour l'authentification de l'équipe
```