> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Highlights {#highlights}

> Renvoyez des extraits pertinents pour la requête à partir des résultats Exa Search, tout en maîtrisant la taille du contexte et la latence.

Les highlights renvoient, pour chaque résultat, des passages extraits de la page qui sont pertinents pour votre requête. Utilisez-les lorsque votre application a besoin de preuves tirées de la page sans supporter le coût en jetons du texte intégral.

Chaque résultat renvoie les passages sélectionnés dans `results[].highlights`.

## Pourquoi des highlights plutôt que le texte intégral {#why-highlights-instead-of-full-text}

Les highlights proviennent du modèle d&#39;extraction développé en interne par Exa. À chaque requête, le modèle analyse chaque result au regard de votre requête et ne renvoie que les passages qui y répondent. Vous ne conservez qu&#39;une fraction des jetons du texte intégral d&#39;une page, pour une qualité de réponse en aval équivalente, voire supérieure.

| Évaluation                           | Résultat                                                                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Exactitude (SimpleQA)                | 500 caractères de highlights égalent l&#39;exactitude des 8 000 premiers caractères du texte d&#39;une page, avec 16 fois moins de jetons                                          |
| Qualité avec des budgets plus élevés | 4 000 caractères de highlights obtiennent un meilleur score que 32 000 caractères de texte intégral                                                                                |
| Documents techniques longs           | Avec un budget de 500 caractères, les highlights atteignent 60 % d&#39;exactitude sur les API references, docs de SDK, spécifications et papers ; le texte intégral plafonne à 6 % |
| Utilisation de jetons en search      | Les highlights divisent par 5 en moyenne le nombre de jetons de search                                                                                                             |

Ces économies pèsent surtout dans les loops d&#39;agent, où chaque série de résultats de search entre en concurrence avec les traces de raisonnement pour le context.

<Tip>
  Lisez [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  pour la méthodologie et l&#39;ensemble des résultats.
</Tip>

## Ajouter des highlights à Search {#add-highlights-to-search}

Utilisez `highlights: true` dans `contents` : c&#39;est la valeur par défaut recommandée. Exa détermine la quantité de texte à renvoyer pour chaque résultat en fonction de sa relevance par rapport à votre requête, il n&#39;y a donc aucun budget de caractères à ajuster. Ne définissez `maxCharacters` que si votre application exige une limite fixe par page.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "How are inference providers reducing transformer latency?",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "How are inference providers reducing transformer latency?",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "How are inference providers reducing transformer latency?",
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

## Dynamic Highlights {#dynamic-highlights}

Dynamic Highlights ajuste la quantité de texte sélectionnée dans chaque résultat en fonction de ce qui est le plus utile pour votre requête. La fonctionnalité peut extraire davantage des sources solides et moins des sources répétitives ou hors sujet, ce qui réduit le nombre total de jetons retournés.

Utilisez-la lorsque plusieurs résultats alimentent le même agent ou la même fenêtre de context. Conservez `highlights: true` lorsque chaque page doit avoir son propre extrait ou une limite prévisible par page.

Dans les évaluations d&#39;Exa, Dynamic Highlights a réduit les jetons de 95 % en moyenne par rapport au contenu complet des pages. Avec un budget de 12 000 caractères, la fonctionnalité a surpassé les highlights classiques, avec un gain moyen d&#39;efficacité en jetons de 40 % et une hausse de qualité de 3,8 %. Au sein d&#39;Exa Agent, elle a réduit de 30 % l&#39;utilisation totale de jetons de l&#39;agent, avec un gain de qualité moyen de 2,1 % sur des benchmarks tels que BrowseComp et WideSearch.

<Tip>
  Consultez [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights) pour les résultats d&#39;évaluation et
  la conception à l&#39;origine de la sélection des highlights entre résultats.
</Tip>

Activez la fonctionnalité avec `dynamic: true` :

<CodeGroup>
  ```python Python theme={null}
  from exa_py.api import DYNAMIC_HIGHLIGHTS_BETA

  result = exa.search(
      "How did US household solar installation costs change over the past five years?",
      contents={
          "highlights": {
              "dynamic": True,
          }
      },
      betas=[DYNAMIC_HIGHLIGHTS_BETA],
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa, { DYNAMIC_HIGHLIGHTS_BETA } from "exa-js";

  const result = await exa.search(
    "How did US household solar installation costs change over the past five years?",
    {
      contents: {
        highlights: {
          dynamic: true
        }
      },
      betas: [DYNAMIC_HIGHLIGHTS_BETA]
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: dynamic-highlights-2026-08-28" \
    -d '{
      "query": "How did US household solar installation costs change over the past five years?",
      "contents": {
        "highlights": {
          "dynamic": true
        }
      }
    }'
  ```
</CodeGroup>

<Info>
  Dynamic Highlights est une préversion de recherche et nécessite le header de requête
  `Exa-Beta: dynamic-highlights-2026-08-28`. Les SDK l&#39;envoient lorsque vous passez
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) ou `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript).

  La réponse utilise la même
  structure `results[].highlights` que les highlights classiques.
</Info>

## Étapes suivantes {#next-steps}

<Columns cols={2}>
  <Card title="Guide de la Search API" icon="search" href="/fr/docs/search/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez une requête Search et choisissez le format d&#39;output adapté.
  </Card>

  <Card title="Bonnes pratiques de search" icon="sparkles" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Optimisez la qualité du retrieval, la latence, la fraîcheur et la taille du contexte.
  </Card>
</Columns>