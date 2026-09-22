> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="search-best-practices">
  # Bonnes pratiques de search
</div>

> Optimisez la qualité du retrieval, la latence, le context et la synthèse de vos integrations de la Search API en production.

Ce guide part du principe que vous disposez déjà d&#39;une [requête à la Search API](/fr/docs/search/quickstart) fonctionnelle. Il explique comment l&#39;améliorer en suivant les bonnes pratiques recommandées par Exa.

<div id="start-with-the-smallest-useful-request">
  ## Commencez par la requête utile la plus simple
</div>

La meilleure base de départ est une requête en langage naturel avec `highlights: true`. Exa dimensionne les extraits de chaque résultat en fonction de leur relevance : il n&#39;y a donc aucun budget de caractères à ajuster :

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

Vous obtenez ainsi des pages classées et, pour chaque page, un contexte économe en tokens et pertinent par rapport à la requête.

N&#39;ajoutez des paramètres supplémentaires qu&#39;en cas de besoin :

| Paramètre                     | À ajouter quand                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `type`                        | Vous devez respecter un budget de latence ou une exigence de profondeur                |
| `numResults`                  | Moins de pages pour une fenêtre de contexte réduite, ou plus pour un rappel plus large |
| `outputSchema`                | Vous synthétisez les résultats ou les structurez en JSON                               |
| `maxAgeHours`                 | Le contenu de page mis en cache risque d&#39;être trop ancien                          |
| `highlights.maxCharacters`    | Votre application exige une limite d&#39;extrait fixe par page                         |
| Filtres de domaine ou de date | Les résultats hors de cette contrainte seraient inutilisables                          |

<div id="search-vs-deep-search">
  ## Search vs. Deep Search
</div>

La recherche standard récupère et classe les pages correspondant à une requête. Deep Search exécute un processus de recherche capable d&#39;itérer, d&#39;examiner ce qu&#39;il a trouvé, d&#39;affiner la recherche et de synthétiser un résultat fondé sur des preuves.

| Besoin                                                                                                                                                                  | Commencer par                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Des pages classées pour une requête bien formulée                                                                                                                       | `auto` ou `fast`                    |
| Des recherches difficiles, une synthèse à partir de nombreux résultats ou des sorties structurées qu&#39;une seule recherche ne suffit pas à remplir (3 fields ou plus) | `deep`                              |
| Une recherche de longue durée, de la constitution de listes ou de l&#39;enrichment multi-étapes                                                                         | [Exa Agent](/fr/docs/agent/quickstart) |

Les modes deep sont recommandés par défaut avec `outputSchema`. Consultez le [guide Deep Search](/fr/docs/search/deep-search) pour des instructions complètes et des exemples.

<div id="improve-retrieval-quality">
  ## Améliorer la qualité du retrieval
</div>

Lorsque les résultats laissent à désirer, modifiez un seul élément de la requête à la fois.

<Steps>
  <Step title="Clarifier la requête">
    Décrivez les pages que vous recherchez, plutôt qu&#39;une simple liste de mots-clés. Précisez le sujet ainsi que tout type de source,
    période ou autre détail qui change la définition d&#39;un résultat pertinent.

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="Lire la réponse par couches">
    Examinez les titres, les URL, les dates de publication et les highlights avant de modifier la requête.

    ```json theme={null}
    {
      "results": [
        {
          "title": "Long-Context Retrieval Methods on Legal Documents",
          "url": "https://arxiv.org/abs/2608.00000",
          "publishedDate": "2026-08-26T00:00:00.000Z",
          "highlights": [
            "We compare long-context retrieval methods across legal document benchmarks..."
          ]
        }
      ]
    }
    ```

    Le titre et l&#39;URL indiquent le type de source récupéré par Exa, `publishedDate` en indique
    la fraîcheur, et le highlight montre la preuve qui correspond à la requête. Affinez la requête pour
    récupérer d&#39;autres pages, ajoutez des filtres de date pour restreindre la période, ou récupérez le texte intégral lorsque
    vous avez besoin de plus de context à partir d&#39;un résultat utile.
  </Step>

  <Step title="N'ajouter que des contraintes strictes">
    N&#39;utilisez `includeDomains`, `excludeDomains` et les filtres de date de publication que si un résultat
    enfreignant la contrainte est inexploitable. Placez les préférences de retrieval dans la requête et, en phase de
    synthèse, les instructions relatives à la réponse dans `systemPrompt`.
  </Step>

  <Step title="Changer le mode de recherche en dernier">
    Utilisez un mode plus rapide pour répondre à une exigence de latence, ou un mode deep lorsque le processus de retrieval lui-même
    exige itération et raisonnement. Changer de mode ne corrigera pas une requête mal spécifiée.
  </Step>
</Steps>

Conservez un petit ensemble de requêtes représentatives pendant le réglage. Comparez la relevance des résultats et la réussite des tâches en aval sur l&#39;ensemble de ces requêtes plutôt que d&#39;optimiser pour un seul exemple. Enregistrez `requestId`, `searchTime` et `costDollars` afin que les régressions soient reproductibles.

<div id="budget-latency-and-context">
  ## Maîtriser la latence et le context
</div>

Chaque paramètre consomme une ressource différente :

| Paramètre                 | Ce qu&#39;il ajoute                                              |
| ------------------------- | ---------------------------------------------------------------- |
| Plus de résultats         | Plus de pages, de données de réponse et de context en aval       |
| Texte intégral            | Un context de page plus large et un payload plus volumineux      |
| `summary`                 | Un appel supplémentaire au modèle de langage par résultat        |
| `outputSchema`            | Une synthèse sur l&#39;ensemble des résultats récupérés          |
| `contents.maxAgeHours: 0` | Une nouvelle récupération de la page au lieu du contenu en cache |
| Search type deep          | Recherche itérative, synthèse et raisonnement                    |

Pour un parcours en temps réel où le contenu en cache convient, combinez le mode à la plus faible latence avec les highlights et un contenu issu uniquement du cache :

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent product updates from major AI labs",
      type="instant",
      contents={
          "highlights": True,
          "max_age_hours": -1,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("Recent product updates from major AI labs", {
    type: "instant",
    contents: {
      highlights: true,
      maxAgeHours: -1
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent product updates from major AI labs",
      "type": "instant",
      "contents": {
        "highlights": true,
        "maxAgeHours": -1
      }
    }'
  ```
</CodeGroup>

N&#39;appliquez pas cette recette lorsque la fraîcheur des pages conditionne l&#39;exactitude des résultats. Partez de `auto` et de la fraîcheur par défaut, sauf si le produit a un objectif de latence mesuré.

Pour laisser Exa répartir un budget de context unique sur l&#39;ensemble des résultats — davantage pour les sources solides, moins pour les sources redondantes — consultez l&#39;[aperçu de recherche Dynamic Highlights](/fr/docs/search/highlights#dynamic-highlights).

<div id="tips-for-common-use-cases">
  ## Conseils pour les cas d&#39;usage courants
</div>

| Si vous avez besoin de                               | Utilisez                                                                                      | Évitez                                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Publications plus récentes                           | Indiquer la fenêtre temporelle dans la requête ou utiliser des filtres de date de publication | `maxAgeHours`                                                            |
| Contenu à jour issu de pages qui changent            | `contents.maxAgeHours`                                                                        | Les filtres de date de publication                                       |
| Un type de source privilégié                         | La formulation de la requête ; `systemPrompt` lors de la synthèse                             | Une liste blanche stricte de domaines                                    |
| Résultats provenant uniquement de sources approuvées | `includeDomains`                                                                              | Répéter `site:` dans la requête                                          |
| Une sortie structurée légère                         | `outputSchema` avec Search standard                                                           | Choisir Deep uniquement parce que la sortie est en JSON                  |
| Une sortie documentée à plusieurs éléments           | `deep` avec `outputSchema`, ou [Exa Agent](/fr/docs/agent/quickstart)                            | Attendre qu&#39;une seule passe de retrieval rassemble tous les éléments |
| Plus de context à partir de quelques pages           | Search avec highlights, puis appel à Contents                                                 | Le texte intégral pour chaque résultat                                   |
| Une latence plus faible                              | Mesurer `fast` ou `instant` avec du contenu compact                                           | Ajouter par défaut des contrôles de fraîcheur ou de synthèse             |

<div id="when-to-use-another-endpoint">
  ## Quand utiliser un autre endpoint
</div>

Utilisez un autre endpoint Exa lorsque la nature de la tâche change :

| Tâche                                                           | Utiliser                              |
| --------------------------------------------------------------- | ------------------------------------- |
| Recherche de longue durée, constitution de listes ou enrichment | [Exa Agent](/fr/docs/agent/quickstart)   |
| Les URL sont déjà connues                                       | [Contents](/fr/docs/contents/quickstart) |
| Exécuter une search selon un schedule                           | [Monitors](/fr/docs/monitors/quickstart) |

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="Search API reference" icon="square-terminal" href="/fr/docs/reference/search" cta="Ouvrir la référence" arrow="true">
    Tous les paramètres de requête et les fields de réponse.
  </Card>

  <Card title="Quickstart Search" icon="search" href="/fr/docs/search/quickstart" cta="Consulter le guide" arrow="true">
    Structures de requête essentielles, filtres, output et fraîcheur.
  </Card>

  <Card title="Contents API" icon="file-text" href="/fr/docs/contents/quickstart" cta="Ouvrir le guide" arrow="true">
    Extrayez les highlights ou le texte intégral des pages que vous connaissez déjà.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Recherche de longue durée, constitution de listes et enrichment.
  </Card>
</Columns>