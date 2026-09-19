> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="batch-api">
  # Batch API
</div>

> Exécutez des requêtes de l&#39;API Exa de manière asynchrone, par lots.

<Info>
  L&#39;API Batch est disponible pour les clients Enterprise une fois qu&#39;Exa l&#39;a activée pour votre team. Contactez [sales@exa.ai](mailto:sales@exa.ai) pour discuter de l&#39;accès Enterprise et de son activation.
</Info>

L&#39;API Batch vous permet de soumettre de nombreuses requêtes de l&#39;API Exa en une seule fois et d&#39;en récupérer les résultats ultérieurement sous forme de fichier JSONL. Plutôt que d&#39;envoyer des milliers de requêtes individuelles et de gérer vous-même les rate limits et les nouvelles tentatives, vous envoyez un seul batch, vous interrogez son statut, puis vous téléchargez l&#39;ensemble des résultats dans un fichier unique.

Utilisez-la pour de l&#39;enrichment hors ligne, des reprises de données ou toute autre tâche ne nécessitant pas de réponse immédiate. Les schemas complets des requêtes et des réponses figurent dans la [reference de l&#39;API](/fr/docs/reference/batches/create-a-batch).

<Note>
  L&#39;API Batch est en bêta. Incluez le header `Exa-Beta: batches-2026-06-06` dans chaque requête.
</Note>

<div id="supported-requests">
  ## Requêtes prises en charge
</div>

Chaque élément d&#39;un batch doit être une requête `POST` vers l&#39;une de ces routes :

| Route         | Cas d&#39;usage                                      |
| ------------- | ---------------------------------------------------- |
| `/search`     | Exécuter des requêtes Exa search de façon asynchrone |
| `/agent/runs` | Exécuter des requêtes Exa Agent de façon asynchrone  |

Chaque élément nécessite un `customId` unique au sein du batch. Ce même `customId` est renvoyé dans le fichier de résultats, ce qui vous permet de faire correspondre les lignes de sortie à vos données d&#39;entrée.

<div id="create-a-batch">
  ## Créer un batch
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/batches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06" \
    -H "Content-Type: application/json" \
    -d '{
      "requests": [
        {
          "customId": "row-1",
          "method": "POST",
          "url": "/search",
          "body": {
            "query": "Latest AI infrastructure funding rounds"
          }
        },
        {
          "customId": "row-2",
          "method": "POST",
          "url": "/agent/runs",
          "body": {
            "query": "Summarize recent vector database launches"
          }
        }
      ],
      "metadata": {
        "project": "weekly-digest"
      }
    }'
  ```
</CodeGroup>

La réponse contient l&#39;identifiant du batch ainsi que son statut initial :

<Accordion title="Exemple de réponse">
  ```json theme={null}
  {
    "id": "batch_01j7x9v0m2n4p6q8r0s2t4v6w8",
    "object": "batch",
    "status": "in_progress",
    "requestCounts": {
      "total": 2,
      "completed": 0,
      "failed": 0
    },
    "createdAt": "2026-06-06T12:00:00.000Z",
    "expiresAt": null,
    "endedAt": null,
    "resultsUrl": null,
    "metadata": {
      "project": "weekly-digest"
    }
  }
  ```
</Accordion>

<div id="check-status">
  ## Vérifier le statut
</div>

Interrogez le batch jusqu&#39;à ce qu&#39;il atteigne un statut terminal :

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

Les statuts de batch sont les suivants :

| Statut        | Signification                                                              |
| ------------- | -------------------------------------------------------------------------- |
| `in_progress` | Le batch est en cours d&#39;exécution                                      |
| `completed`   | Toutes les requêtes sont terminées et les résultats sont disponibles       |
| `cancelling`  | L&#39;annulation a été demandée et les traitements en cours s&#39;achèvent |
| `cancelled`   | Le batch a été annulé                                                      |
| `expired`     | Les résultats ne sont plus disponibles                                     |

Une fois le batch terminé, `resultsUrl` contient une URL de téléchargement du fichier de résultats JSONL, et `expiresAt` correspond à la fin de la période de conservation des résultats.

<Warning>
  `resultsUrl` est une URL présignée à durée de vie limitée. Récupérez de nouveau le batch pour obtenir une nouvelle URL chaque fois que vous devez télécharger les résultats.
</Warning>

<div id="list-batches">
  ## Lister les batches
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -s "https://api.exa.ai/batches?limit=100" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

La réponse est paginée par cursor : `data` contient jusqu&#39;à `limit` batches et, lorsque `hasMore` vaut `true`, passez `nextCursor` dans le paramètre de requête `cursor` pour récupérer la page suivante.

Passez `status=completed` pour ne lister que les batches terminés :

```bash theme={null}
curl -s "https://api.exa.ai/batches?status=completed" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Exa-Beta: batches-2026-06-06"
```

`completed` est la seule valeur prise en charge ; toute autre valeur renvoie une erreur. Les entrées terminées sont triées par date d&#39;expiration et utilisent leur propre cursor : veillez donc à envoyer `status=completed` sur chaque page — les cursors filtrés sur `completed` et les cursors non filtrés ne sont pas interchangeables.

```json theme={null}
{
  "object": "list",
  "data": [],
  "hasMore": false,
  "nextCursor": null
}
```

<div id="download-results">
  ## Télécharger les résultats
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl "$RESULTS_URL" -o results.jsonl
  ```
</CodeGroup>

Chaque ligne JSONL contient le `customId` d&#39;origine, accompagné soit d&#39;une `response`, soit d&#39;une `error` :

```json theme={null}
{ "customId": "row-1", "response": { "statusCode": 200, "body": { "results": [] } } }
{ "customId": "row-2", "error": { "code": "API_ERROR", "message": "request failed" } }
```

<div id="cancel-a-batch">
  ## Annuler un batch
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X POST "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8/cancel" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="delete-a-batch">
  ## Supprimer un batch
</div>

<CodeGroup>
  ```bash cURL theme={null}
  curl -X DELETE "https://api.exa.ai/batches/batch_01j7x9v0m2n4p6q8r0s2t4v6w8" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: batches-2026-06-06"
  ```
</CodeGroup>

<div id="access">
  ## Accès
</div>

Pour activer l’API Batch pour une team, contactez [sales@exa.ai](mailto:sales@exa.ai).