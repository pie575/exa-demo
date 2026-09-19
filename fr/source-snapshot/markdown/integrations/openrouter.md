> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="openrouter">
  # OpenRouter
</div>

> Ancrez n&#39;importe quel modèle OpenRouter dans la recherche web Exa grâce au outil serveur openrouter:web&#95;search.

Exa est le moteur de recherche qui alimente la recherche web d&#39;[OpenRouter](https://openrouter.ai). OpenRouter vous offre une seule API pour des centaines de modèles, et Exa donne à ces modèles un accès au web en temps réel : tout modèle dépourvu de recherche native s&#39;appuie sur Exa par défaut, et n&#39;importe quel modèle peut être explicitement dirigé vers Exa. Aucune API key Exa n&#39;est nécessaire. OpenRouter exécute les recherches côté serveur et les facture sur vos OpenRouter credits.

<div id="use-the-web-search-server-tool">
  ## Utiliser l&#39;outil serveur de recherche web
</div>

Ajoutez `openrouter:web_search` à votre tableau `tools` : le modèle décide alors quand lancer une recherche, sur quoi la lancer et s&#39;il doit en relancer une au sein de la même request. Les [outils serveur](https://openrouter.ai/docs/guides/features/server-tools/web-search) sont en bêta sur OpenRouter et remplacent le plugin `web` deprecated ainsi que les variantes de modèle `:online` ; consultez le [guide de migration](https://openrouter.ai/docs/guides/features/server-tools/web-search#migrating-from-the-web-search-plugin) d&#39;OpenRouter si vous utilisez l&#39;un ou l&#39;autre.

<CodeGroup>
  ```javascript JavaScript theme={null}
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer <OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-5.2",
      messages: [
        { role: "user", content: "What were the major AI announcements this week?" },
      ],
      tools: [{ type: "openrouter:web_search" }],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      "https://openrouter.ai/api/v1/chat/completions",
      headers={
          "Authorization": "Bearer <OPENROUTER_API_KEY>",
          "Content-Type": "application/json",
      },
      json={
          "model": "openai/gpt-5.2",
          "messages": [
              {"role": "user", "content": "What were the major AI announcements this week?"}
          ],
          "tools": [{"type": "openrouter:web_search"}],
      },
  )

  print(response.json()["choices"][0]["message"]["content"])
  ```

  ```bash cURL theme={null}
  curl https://openrouter.ai/api/v1/chat/completions \
    -H "Authorization: Bearer <OPENROUTER_API_KEY>" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "openai/gpt-5.2",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [{ "type": "openrouter:web_search" }]
    }'
  ```
</CodeGroup>

Avec la valeur par default `engine: "auto"`, OpenRouter utilise la recherche native du provider lorsque le modèle en propose une, et Exa dans tous les autres cas. Définissez `engine: "exa"` pour conserver un comportement de recherche identique sur tous les modèles :

```json theme={null}
{
  "type": "openrouter:web_search",
  "parameters": {
    "engine": "exa",
    "mode": "auto",
    "max_results": 5,
    "max_total_results": 20,
    "allowed_domains": ["arxiv.org"],
    "excluded_domains": ["reddit.com"]
  }
}
```

| Paramètre                             | À utiliser pour                                                                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode`                                | Arbitrer entre latence et profondeur : `instant`, `fast`, `auto` (par défaut), `deep-lite`, `deep` ou `deep-reasoning`. Ces modes correspondent aux [search types](/fr/docs/search/quickstart) d&#39;Exa. |
| `max_results`                         | Limiter le nombre de résultats par appel de search (5 par défaut)                                                                                                                                      |
| `max_uses`                            | Limiter le nombre de searches que le modèle peut effectuer dans une même requête                                                                                                                       |
| `max_total_results`                   | Limiter le nombre cumulé de résultats sur l&#39;ensemble des searches d&#39;une même requête                                                                                                           |
| `max_characters`                      | Définir un character budget exact par résultat pour les highlights                                                                                                                                     |
| `search_context_size`                 | Utiliser plutôt un budget prédéfini : `low`, `medium` ou `high`                                                                                                                                        |
| `allowed_domains`, `excluded_domains` | Filtrer les domaines des résultats. Exa prend en charge les deux filtres dans une même requête.                                                                                                        |

<div id="how-results-come-back">
  ## Comment les résultats sont renvoyés
</div>

OpenRouter demande les [highlights Exa](/fr/docs/search/highlights) pour chaque résultat plutôt que le texte intégral de la page : des excerpts extractifs dont la taille s&#39;adapte, généralement de 2 000 à 4 000 caractères par résultat, sauf si vous définissez `max_characters` ou `search_context_size`. Le modèle lit ces excerpts, et les appelants de l&#39;API les reçoivent sous forme d&#39;annotations `url_citation` standardisées dans le message de response. Au sein d&#39;un même résultat, des marqueurs `[...]` séparent les excerpts provenant de différentes parties de la page.

<div id="pricing">
  ## Pricing
</div>

Les searches Exa sont facturées sur vos OpenRouter credits, en plus des coûts de tokens du modèle pour la lecture des résultats. Les modes `instant`, `fast` et `auto` coûtent 0,007 $ par search, `deep-lite` et `deep` 0,012 $, et `deep-reasoning` 0,015 $. Chaque search inclut jusqu&#39;à 10 résultats, et chaque résultat supplémentaire coûte 0,001 $. Consultez la [documentation recherche web d&#39;OpenRouter](https://openrouter.ai/docs/guides/features/server-tools/web-search) pour connaître les tarifs en vigueur.

L&#39;objet `usage` de la response indique le nombre de searches exécutées par le modèle dans `server_tool_use.web_search_requests`.

<div id="resources">
  ## Ressources
</div>

<Columns cols={2}>
  <Card title="Documentation des outils serveur" icon="wrench" href="https://openrouter.ai/docs/guides/features/server-tools/web-search" cta="Ouvrir la documentation" arrow="true">
    Référence complète de configuration pour `openrouter:web_search`.
  </Card>

  <Card title="Témoignage client" icon="book-open" href="https://exa.ai/customers/openrouter" cta="Lire le témoignage" arrow="true">
    Comment OpenRouter offre la recherche web à des centaines de modèles grâce à Exa.
  </Card>
</Columns>