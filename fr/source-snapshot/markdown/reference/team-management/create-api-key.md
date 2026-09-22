> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Créer une API key {#create-api-key}

> Créez une nouvelle API key pour votre équipe, avec un nom et une configuration de limite de débit facultatifs.

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
</Card>

<Info>
  La Team Management API s&#39;active équipe par équipe. Elle s&#39;authentifie avec une API key de compte de service, créée depuis l&#39;onglet **Service keys** de la [page API keys](https://dashboard.exa.ai/api-keys) une fois la fonctionnalité activée pour votre équipe. Contactez [support@exa.ai](mailto:support@exa.ai) pour demander l&#39;accès.
</Info>

L&#39;endpoint Create API Key vous permet de générer par programmation de nouvelles API keys pour votre équipe à l&#39;aide de votre API key de service.

## Paramètres optionnels {#optional-parameters}

* **name** : un nom descriptif pour l&#39;API key, afin d&#39;en identifier l&#39;usage
* **rateLimit** : nombre maximal de requêtes par minute autorisé pour cette API key

## OpenAPI {#openapi}

```yaml team-management-spec.yaml POST /api-keys
openapi: 3.1.0
info:
  version: 1.0.0
  title: Team Management API
  description: >-
    API de gestion des API keys au sein des équipes. Fournit des opérations CRUD
    pour créer, lister, mettre à jour et supprimer des API keys, avec des
    contrôles d'accès par équipe. L'API s'active équipe par équipe. Contactez
    support@exa.ai pour en demander l'accès.
servers:
  - url: https://admin-api.exa.ai/team-management
security:
  - apikey: []
paths:
  /api-keys:
    post:
      tags:
        - Team Management
      summary: Créer une API key
      description: >-
        Crée une nouvelle API key pour l'équipe authentifiée. Vous pouvez
        éventuellement définir un nom, une limite de débit et un budget pour
        l'API key.
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
                  description: Nom facultatif de l'API key
                  example: Production API Key
                rateLimit:
                  type: integer
                  description: Limite de débit facultative de l'API key (requests par seconde)
                  example: 1000
                budgetCents:
                  type:
                    - integer
                    - 'null'
                  minimum: 0
                  description: >-
                    Budget de dépenses facultatif de l'API key, en centimes.
                    Définissez-le à null pour supprimer le budget.
                  example: 5000
              additionalProperties: false
      responses:
        '200':
          description: API key créée avec succès
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
                        description: Identifiant unique de l'API key
                      name:
                        type: string
                        description: Nom de l'API key
                      rateLimit:
                        type:
                          - integer
                          - 'null'
                        description: Limite de débit en requests par seconde
                      budgetCents:
                        type:
                          - integer
                          - 'null'
                        description: Budget de dépenses de l'API key, en centimes
                      isOverBudget:
                        type: boolean
                        description: Indique si l'API key dépasse actuellement son budget
                      teamId:
                        type: string
                        format: uuid
                        description: ID de la Team à laquelle appartient cette clé
                      userId:
                        type: string
                        format: uuid
                        description: ID de l'utilisateur ayant créé cette clé
                      createdAt:
                        type: string
                        format: date-time
                        description: Date de création de la clé
        '400':
          description: Bad Request - Paramètres invalides
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
          description: Unauthorized - Clé de service invalide ou manquante
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
          label: Créer une API key avec un nom et une limite de débit
          source: |
            curl -X POST 'https://admin-api.exa.ai/team-management/api-keys' \
              -H 'x-api-key: YOUR-SERVICE-KEY' \
              -H 'Content-Type: application/json' \
              -d '{
                "name": "Production API Key",
                "rateLimit": 1000
              }'
        - lang: python
          label: Créer une API key avec un nom et une limite de débit
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
          label: Créer une API key avec un nom et une limite de débit
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
          label: Créer une API key sans paramètres facultatifs
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
      description: API key de service pour l'authentification de l'équipe
```