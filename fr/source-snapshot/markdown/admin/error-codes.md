> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="error-codes">
  # Codes d&#39;erreur
</div>

> Référence des codes d&#39;erreur courants utilisés par l&#39;API Exa

Les API Exa signalent les échecs par des codes de statut HTTP standard et un corps d&#39;erreur JSON.

<div id="http-status-codes">
  ## Codes de statut HTTP
</div>

| Code                        | Signification                                                                                                                             | Que faire                                                                                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `400` Bad Request           | Le corps, les paramètres de requête, les headers ou la combinaison d&#39;options sont invalides.                                          | Corrigez la requête à l&#39;aide du message renvoyé.                                                                                                       |
| `401` Unauthorized          | L&#39;API key est manquante ou invalide.                                                                                                  | Vérifiez le header d&#39;authentification et l&#39;API key.                                                                                                |
| `402` Payment Required      | Les crédits sont épuisés ou un budget de dépenses a été dépassé.                                                                          | [Rechargez vos crédits](https://dashboard.exa.ai) ou contactez l&#39;administrateur de votre équipe.                                                       |
| `403` Forbidden             | L&#39;API key n&#39;a pas accès à la fonctionnalité demandée, ou la requête a été bloquée par une règle.                                  | Vérifiez le message renvoyé et les fonctionnalités incluses dans votre plan.                                                                               |
| `404` Not Found             | La route ou la ressource demandée n&#39;existe pas.                                                                                       | Vérifiez l&#39;endpoint et l&#39;ID de la ressource.                                                                                                       |
| `409` Conflict              | La requête entre en conflit avec l&#39;état existant — par exemple, un Webset avec le même `externalId` existe déjà.                      | Récupérez la ressource existante ou utilisez un autre identifiant.                                                                                         |
| `422` Unprocessable Entity  | Une requête de prévisualisation Websets n&#39;a pas pu être décomposée en une entité et des critères valides.                             | Reformulez la requête de prévisualisation.                                                                                                                 |
| `429` Too Many Requests     | Votre API key, votre équipe ou votre réseau a dépassé une limite de débit ou de concurrency.                                              | Réduisez votre cadence de requêtes ; attendez le nombre de secondes indiqué par `Retry-After` s&#39;il est présent, sinon utilisez un backoff exponentiel. |
| `500` Internal Server Error | Une erreur serveur inattendue s&#39;est produite.                                                                                         | Réessayez après un court délai. Contactez le support si le problème persiste.                                                                              |
| `503` Service Unavailable   | Exa est temporairement en surcharge (`SERVICE_OVERLOADED`) ou indisponible. La requête n&#39;a pas été traitée et n&#39;est pas facturée. | Réessayez avec un backoff exponentiel. Cela ne dépend pas de votre cadence de requêtes : la réduire ne sert à rien, seul le fait de réessayer fonctionne.  |
| `504` Gateway Timeout       | La requête a dépassé son délai de traitement.                                                                                             | Réessayez la requête ou réduisez sa portée.                                                                                                                |

<Note>
  Les échecs au niveau d&#39;une URL provenant de `/contents` sont signalés dans le field `statuses` d&#39;une réponse `200` réussie, et non comme des erreurs au niveau de la requête. Voir [Tags de statut de récupération du contenu](#content-fetch-status-tags).
</Note>

<div id="error-response-structure">
  ## Structure des réponses d&#39;erreur
</div>

Les réponses d&#39;erreur renvoient un `requestId`, un message `error` lisible par un humain et un `tag` lisible par une machine :

```json theme={null}
{
  "requestId": "67207943fab9832d162b5317f4cca830",
  "error": "Invalid request body | Validation error: Invalid value for type",
  "tag": "INVALID_REQUEST_BODY"
}
```

<Note>
  Incluez le `requestId` lorsque vous contactez le support pour accélérer le diagnostic.
</Note>

La liste des tags n&#39;est pas figée et les noms de tag sont explicites. Branchez d&#39;abord sur le code de statut HTTP et traitez les tags non reconnus comme une information complémentaire plutôt que comme des erreurs d&#39;analyse.

<div id="common-error-tags">
  ## Tags d&#39;erreur courants
</div>

<div id="account-billing-and-access">
  ### Compte, facturation et accès
</div>

| Tag                       | Code HTTP | Description                                                                                                                |
| ------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `INVALID_API_KEY`         | `401`     | L&#39;API key est absente, vide ou invalide.                                                                               |
| `NO_MORE_CREDITS`         | `402`     | Le compte n&#39;a plus de crédits — rechargez sur [dashboard.exa.ai](https://dashboard.exa.ai).                            |
| `API_KEY_BUDGET_EXCEEDED` | `402`     | L&#39;API key a dépassé son budget de dépenses — contactez l&#39;administrateur de votre équipe.                           |
| `TEAM_BUDGET_EXCEEDED`    | `402`     | L&#39;équipe a dépassé son budget de dépenses pour la période de facturation en cours.                                     |
| `FEATURE_DISABLED`        | `403`     | L&#39;endpoint, le type de recherche ou l&#39;option demandé n&#39;est pas activé pour votre plan.                         |
| `PROHIBITED_CONTENT`      | `403`     | La requête a été rejetée par la modération de sécurité des contenus.                                                       |
| `CONTENT_FILTER_ERROR`    | `403`     | Le contenu a été rejeté par une politique de sécurité lors du traitement.                                                  |
| `RATE_LIMIT_EXCEEDED`     | `429`     | Votre API key, votre équipe ou votre réseau a dépassé sa propre limite de débit — réduisez votre cadence de requêtes.      |
| `SERVICE_OVERLOADED`      | `503`     | Exa est temporairement en surcharge et a abandonné la requête avant de la traiter — réessayez avec un backoff exponentiel. |

<div id="request-validation">
  ### Validation des requêtes
</div>

| Tag                       | Code HTTP | Description                                                                                        |
| ------------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| `INVALID_REQUEST_BODY`    | `400`     | Le corps JSON n&#39;a pas passé la validation du schéma.                                           |
| `INVALID_REQUEST`         | `400`     | Des options sont en conflit, ou une fonctionnalité bêta a été utilisée sans son header `Exa-Beta`. |
| `INVALID_NUM_RESULTS`     | `400`     | `numResults` doit être ≤ 100 lorsque des highlights sont demandés.                                 |
| `NUM_RESULTS_EXCEEDED`    | `400`     | Le nombre de résultats demandé dépasse la limite de votre plan.                                    |
| `INVALID_JSON_SCHEMA`     | `400`     | Le schéma de sortie fourni est invalide.                                                           |
| `SUBPAGES_LIMIT_EXCEEDED` | `400`     | `/contents` autorise au maximum 100 sous-pages par requête.                                        |

<div id="payment-protocols">
  ### Protocoles de paiement
</div>

Les requêtes payées via x402 ou MPP peuvent également renvoyer :

| Tag                        | Code HTTP | Description                                                |
| -------------------------- | --------- | ---------------------------------------------------------- |
| `X402_PAYMENT_REQUIRED`    | `402`     | Un paiement est requis.                                    |
| `X402_INVALID_SIGNATURE`   | `400`     | La payment signature x402 est invalide.                    |
| `X402_VERIFICATION_FAILED` | `402`     | Le paiement x402 n&#39;a pas pu être vérifié.              |
| `MPP_VERIFICATION_FAILED`  | `402`     | Le paiement MPP n&#39;a pas pu être vérifié.               |
| `X402_TOO_MANY_UNPAID`     | `429`     | Trop de requêtes x402 sont en attente de paiement.         |
| `X402_WALLET_RATE_LIMITED` | `429`     | Le wallet x402 a dépassé sa limite de débit.               |
| `X402_INTERNAL_ERROR`      | `500`     | Exa n&#39;a pas pu générer les exigences de paiement x402. |

<div id="content-fetch-status-tags">
  ## Tags de statut de récupération du contenu
</div>

Lorsque `/contents` reçoit plusieurs URL, une URL peut échouer alors que les autres aboutissent. Les échecs au niveau d&#39;une URL sont renvoyés dans le field `statuses` et ne font pas échouer la requête :

```json theme={null}
{
  "results": [],
  "statuses": [
    {
      "id": "https://example.com",
      "status": "error",
      "error": {
        "tag": "CRAWL_NOT_FOUND",
        "httpStatusCode": 404
      }
    }
  ]
}
```

`httpStatusCode` décrit la page cible, et non la réponse de `/contents`.

| Tag                       | Description                                                                       | Comment traiter                                                     |
| ------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `CRAWL_NOT_FOUND`         | La page cible est introuvable.                                                    | Vérifiez que l&#39;URL est correcte et accessible.                  |
| `CRAWL_HTTP_{status}`     | La cible a renvoyé une erreur HTTP, par exemple `CRAWL_HTTP_403`.                 | Traitez le statut de la cible indiqué dans le tag.                  |
| `CRAWL_TIMEOUT`           | Le crawl a expiré lors de la récupération de la page cible.                       | Relancez la requête ou réessayez plus tard.                         |
| `CRAWL_LIVECRAWL_TIMEOUT` | Le retrieval en direct a dépassé le `livecrawlTimeout` demandé.                   | Augmentez `livecrawlTimeout` ou ajustez `maxAgeHours`.              |
| `SOURCE_NOT_AVAILABLE`    | L&#39;accès à la source est interdit ou la source est indisponible.               | Vérifiez si la source exige une authentification ou est restreinte. |
| `UNSUPPORTED_URL`         | Le schéma d&#39;URL n&#39;est pas pris en charge pour la récupération de contenu. | Utilisez une URL HTTP ou HTTPS standard.                            |
| `CRAWL_UNKNOWN_ERROR`     | Le crawl a échoué pour une autre raison.                                          | Relancez la requête ; contactez le support si le problème persiste. |

Ces tags de statut sont spécifiques à `/contents` ; `/search` ne renvoie pas de field `statuses`.

<div id="getting-help">
  ## Obtenir de l&#39;aide
</div>

* Consultez le [statut d&#39;Exa](/fr/docs/admin/status) si les erreurs `500`, `503` ou `504` persistent.
* Consultez les [limites de débit](/fr/docs/admin/billing#rate-limits) pour connaître les limites en vigueur.
* Reportez-vous à l&#39;[API reference](/fr/docs/reference/search) de l&#39;endpoint pour connaître les exigences de la requête.
* Contactez [hello@exa.ai](mailto:hello@exa.ai) en précisant le statut de la réponse, le corps de l&#39;erreur et le `requestId`.