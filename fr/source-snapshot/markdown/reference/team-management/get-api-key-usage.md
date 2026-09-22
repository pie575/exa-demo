> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Obtenir l&#39;utilisation d&#39;une API key {#get-api-key-usage}

> Récupérez les données d&#39;utilisation et de facturation d&#39;une API key spécifique.

<Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le tableau de bord. Les nouveaux comptes démarrent avec des crédits gratuits.
</Card>

<Info>
  La Team Management API s&#39;active équipe par équipe. Elle s&#39;authentifie avec une API key de compte de service, créée depuis l&#39;onglet **Service keys** de la [page API keys](https://dashboard.exa.ai/api-keys) une fois la fonctionnalité activée pour votre équipe. Contactez [support@exa.ai](mailto:support@exa.ai) pour demander l&#39;accès.
</Info>

## Aperçu {#overview}

L&#39;endpoint Get API Key Usage vous permet de récupérer des statistiques détaillées de facturation et d&#39;utilisation pour une API key donnée sur une période déterminée. Cet endpoint renvoie les données de coûts issues du système de facturation d&#39;Exa, offrant ainsi une vue de référence sur ce qui vous est facturé pour cette API key.

## Path Parameters {#path-parameters}

* **id** : L&#39;identifiant unique de l&#39;API key dont vous souhaitez récupérer l&#39;utilisation

## Paramètres de requête {#query-parameters}

* **start&#95;date** (facultatif) : date de début de la période d&#39;utilisation au format ISO 8601 (par exemple, `2025-01-01T00:00:00Z` ou `2025-01-01`). Par défaut, il y a 30 jours. Doit se situer dans les 6 derniers mois (180 jours).
* **end&#95;date** (facultatif) : date de fin de la période d&#39;utilisation au format ISO 8601. Par défaut, l&#39;heure actuelle.
* **group&#95;by** (facultatif) : granularité temporelle pour le regroupement des résultats (`hour`, `day` ou `month`). Actuellement réservé à de futures évolutions, ce paramètre ne modifie pas la structure de la réponse. Valeur par défaut : `day`.

## Réponse {#response}

Renvoie des informations détaillées d&#39;utilisation et de facturation, notamment :

* **id** : identifiant unique de l&#39;API key
* **api&#95;key&#95;id** : identifiant unique de l&#39;API key
* **api&#95;key&#95;name** : nom descriptif de l&#39;API key (si défini)
* **team&#95;id** : identifiant de l&#39;équipe à laquelle appartient cette clé
* **period** : objet contenant les dates de début et de fin de la période d&#39;utilisation
* **total&#95;cost&#95;usd** : coût total en USD pour la période spécifiée
* **cost&#95;breakdown** : tableau des répartitions de coûts par type de tarif, chacune contenant :
  * **price&#95;id** : identifiant unique du tarif
  * **price&#95;name** : nom du tarif (par exemple, « Neural Search », « Content Retrieval »)
  * **quantity** : quantité totale consommée
  * **amount&#95;usd** : coût en USD pour ce type de tarif
* **metadata** : objet contenant l&#39;horodatage de génération du rapport

## Remarques importantes {#important-notes}

* **Historique limité à 6 mois** : le système de facturation ne remonte pas au-delà de 6 mois (180 jours). Les requêtes dont la `start_date` est antérieure à 180 jours renverront une erreur 400.
* **Utilisation nulle** : si l&#39;API key n&#39;a enregistré aucune utilisation sur la période demandée, `total_cost_usd` vaudra 0 et `cost_breakdown` pourra être vide.
* **Appartenance à une Team** : l&#39;API key de service utilisée pour l&#39;authentification doit appartenir à la même équipe que l&#39;API key demandée. L&#39;accès inter-équipes n&#39;est pas autorisé.
* **Formats de date** : les dates peuvent être fournies au format ISO 8601, avec ou sans composante horaire (par exemple, `2025-01-01` ou `2025-01-01T00:00:00Z`).

## Cas d&#39;usage {#use-cases}

Cet endpoint est utile pour :

* Créer des tableaux de bord de facturation au niveau de chaque API key
* Suivre l&#39;utilisation et les coûts d&#39;API keys spécifiques
* Mettre en place des alertes automatisées basées sur des seuils d&#39;utilisation
* Générer des rapports d&#39;utilisation pour la répartition interne des coûts
* Élucider des questions de facturation liées à des API keys spécifiques

## OpenAPI {#openapi}

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