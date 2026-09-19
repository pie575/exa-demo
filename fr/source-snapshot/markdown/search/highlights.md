> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="highlights">
  # Highlights
</div>

> Obtenez des extraits pertinents pour votre query à partir des résultats Exa Search, tout en maîtrisant le context size et la latence.

Les highlights renvoient, pour chaque résultat, des passages extraits de la page en lien avec votre query. Utilisez-les lorsque votre application a besoin d&#39;evidence issue de la page sans assumer le cost en tokens du full text.

Chaque résultat renvoie les passages sélectionnés dans `results[].highlights`.

<div id="why-highlights-instead-of-full-text">
  ## Pourquoi les highlights plutôt que le full text
</div>

Les highlights proviennent du modèle d&#39;extraction maison d&#39;Exa. À chaque request, le modèle lit chaque résultat à la lumière de votre query et ne renvoie que les passages qui y répondent. Vous ne conservez qu&#39;une fraction des tokens du texte intégral de la page, pour une qualité de réponse en aval égale ou supérieure.

| Évaluation                           | Résultat                                                                                                                                                                                             |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Précision (SimpleQA)                 | 500 caractères de highlights égalent la précision des 8 000 premiers caractères du texte de la page, avec 16 fois moins de tokens                                                                    |
| Qualité avec des budgets plus élevés | 4 000 caractères de highlights obtiennent un meilleur score que 32 000 caractères de full text                                                                                                       |
| Documents techniques longs           | Avec un budget de 500 caractères, les highlights atteignent 60 % de précision sur les references d&#39;API, la documentation des SDK, les spécifications et les papers ; le full text plafonne à 6 % |
| Consommation de tokens de search     | Les highlights divisent par 5 en moyenne le nombre de tokens de search                                                                                                                               |

Ces économies pèsent surtout dans les boucles d&#39;agent, où chaque série de résultats de search entre en concurrence avec les traces de raisonnement pour le context.

<Tip>
  Consultez [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)
  pour la méthodologie et les résultats complets.
</Tip>

<div id="add-highlights-to-search">
  ## Ajouter des highlights à Search
</div>

Utilisez `highlights: true` dans `contents` : c&#39;est la valeur par défaut recommandée. Exa détermine la quantité de texte à renvoyer pour chaque résultat selon sa pertinence par rapport à votre query, il n&#39;y a donc aucun character budget à ajuster. Ne définissez `maxCharacters` que si votre application exige une limite fixe par page.

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

<div id="dynamic-highlights">
  ## Dynamic Highlights
</div>

Dynamic Highlights ajuste la quantité de texte extraite de chaque résultat en fonction de ce qui est le plus utile pour votre query. La fonctionnalité peut prélever davantage de contenu sur les sources solides et moins sur les sources répétitives ou hors sujet, ce qui réduit le nombre total de tokens renvoyés.

Utilisez-la lorsque plusieurs résultats alimentent le même agent ou la même fenêtre de context. Conservez les highlights classiques avec `highlights: true` lorsque chaque page doit avoir son propre excerpt ou une limit prévisible par page.

Dans les Evaluations menées par Exa, Dynamic Highlights a réduit les tokens de 95 % en moyenne par rapport au page content complet. Avec un character budget de 12 000 caractères, la fonctionnalité a devancé les highlights classiques, avec un gain moyen d&#39;efficacité en tokens de 40 % et une hausse de qualité de 3,8 %. Au sein d&#39;Exa Agent, elle a réduit de 30 % l&#39;usage total de tokens de l&#39;agent, avec un gain de qualité moyen de 2,1 % sur des benchmarks tels que BrowseComp et WideSearch.

<Tip>
  Consultez [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights) pour les résultats des Evaluations et
  la conception de la sélection de highlights entre résultats.
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
  Dynamic Highlights est une préversion de recherche et nécessite le request header
  `Exa-Beta: dynamic-highlights-2026-08-28`. Les SDK l&#39;envoient lorsque vous passez
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]` (Python) ou `betas: [DYNAMIC_HIGHLIGHTS_BETA]` (JavaScript).

  La response utilise la même structure
  `results[].highlights` que les highlights classiques.
</Info>

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="Guide de la Search API" icon="search" href="/fr/docs/search/quickstart" cta="Ouvrir le guide" arrow="true">
    Construisez une requête Search et choisissez le format d&#39;output adapté.
  </Card>

  <Card title="Bonnes pratiques de search" icon="sparkles" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Optimisez la qualité du retrieval, la latence, la freshness et la context size.
  </Card>
</Columns>