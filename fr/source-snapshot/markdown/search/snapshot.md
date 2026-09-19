> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> Épinglez Search et Contents à une stored version d&#39;une page à la datetime de votre choix.

Exa Snapshot conserve des stored versions des pages explorées par Exa. Envoyez `snapshotAsOf` pour épingler la requête à une datetime.

Utilisez cette fonctionnalité pour backtester des agents, exécuter des évaluations reproductibles et comparer des versions antérieures de documentations, de pages de tarifs, de politiques et de filings.

<Info>
  Exa Snapshot est disponible en pay as you go à 10 QPS, avec une fenêtre d&#39;index glissante de 5 mois.
  Au-delà de 100 requêtes, [contactez l&#39;équipe commerciale](https://exa.ai/contact/sales) pour continuer.
</Info>

<div id="search-at-a-datetime">
  ## Recherche à une datetime
</div>

Sur `/search`, placez `snapshotAsOf` dans `contents`.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "latest stable Python release notes",
      num_results=3,
      contents={
          "snapshot_as_of": "2026-07-01T00:00:00Z",
          "highlights": True,
      },
  )

  for r in result.results:
      print(r.title, r.url)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search("latest stable Python release notes", {
    numResults: 3,
    contents: {
      snapshotAsOf: "2026-07-01T00:00:00Z",
      highlights: true
    }
  });

  for (const r of result.results) {
    console.log(r.title, r.url);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "latest stable Python release notes",
      "numResults": 3,
      "contents": {
        "snapshotAsOf": "2026-07-01T00:00:00Z",
        "highlights": true
      }
    }'
  ```
</CodeGroup>

Exa identifie les candidate URLs, puis ne conserve que les pages disposant d&#39;une stored version antérieure ou égale à `snapshotAsOf`.

<Accordion title="Exemple de réponse">
  ```json theme={null}
  {
    "requestId": "211fc1f57b87a792de082309ef3bce95",
    "results": [
      {
        "id": "https://docs.python.org/3/whatsnew/changelog.html",
        "url": "https://docs.python.org/3/whatsnew/changelog.html",
        "title": "Changelog — Python 3.14.6 documentation",
        "highlights": [
          "Changelog — Python 3.14.6 documentation\n...\n## Python 3.14.6 final¶\n...\nRelease date: 2026-06-10"
        ],
        "image": "https://docs.python.org/3.14/_images/social_previews/..."
      },
      {
        "id": "https://docs.python.org/3/whatsnew/index.html",
        "url": "https://docs.python.org/3/whatsnew/index.html",
        "title": "What's New in Python — Python 3.14.6 documentation",
        "highlights": ["What's new in Python\n...\n- Python 3.14.6 final\n- Python 3.14.5 final"]
      },
      {
        "id": "https://docs.python.org/3/whatsnew/3.14.html",
        "url": "https://docs.python.org/3/whatsnew/3.14.html",
        "title": "What's new in Python 3.14 — Python 3.14.6 documentation",
        "highlights": ["Python 3.14 is the latest stable release of the Python programming language..."]
      }
    ]
  }
  ```
</Accordion>

<div id="pin-contents-to-a-datetime">
  ## Figer les contents à une datetime
</div>

Ajoutez `snapshotAsOf` au premier niveau d&#39;une requête `/contents`.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://en.wikipedia.org/wiki/2026"],
      snapshot_as_of="2026-06-01T00:00:00Z",
      text=True,
  )

  print(result.results[0].text[:300])
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://en.wikipedia.org/wiki/2026"],
    {
      snapshotAsOf: "2026-06-01T00:00:00Z",
      text: true
    }
  );

  console.log(result.results[0].text.slice(0, 300));
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://en.wikipedia.org/wiki/2026"],
      "snapshotAsOf": "2026-06-01T00:00:00Z",
      "text": true
    }'
  ```
</CodeGroup>

Exa renvoie la stored version la plus récente antérieure ou égale à cette datetime.

<Accordion title="Exemple de réponse">
  ```json theme={null}
  {
    "requestId": "c05151f7df9cd9d8785e0acf0935355d",
    "results": [
      {
        "id": "https://en.wikipedia.org/wiki/2026",
        "url": "https://en.wikipedia.org/wiki/2026",
        "title": "2026",
        "author": null,
        "text": "2026\n\n2026 (MMXXVI) is the current year, and is a common year starting on Thursday of the Gregorian calendar...",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/..."
      }
    ],
    "statuses": [
      {
        "id": "https://en.wikipedia.org/wiki/2026",
        "status": "success",
        "source": "cached"
      }
    ]
  }
  ```
</Accordion>

<Tip>
  Les ID sans version éligible sont omis de `results` et signalés dans `statuses` avec
  `"status": "error"` et `"tag": "CONTENT_NOT_CACHED"`.
</Tip>

<div id="how-snapshots-work">
  ## Fonctionnement des snapshots
</div>

| Champ          | Emplacement | Signification                                                                               |
| -------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `snapshotAsOf` | Requête     | Datetime limite. Exa renvoie la stored version la plus récente à cet instant ou antérieure. |

Pour les deux endpoints :

* Le page content renvoyé provient de cette stored version.
* Le titre, l&#39;auteur, la date de publication, le texte, les highlights et les summaries sont générés uniquement à partir de cette version.
* Les pages sans version éligible dans la fenêtre de 5 mois sont omises.

<Note>
  Sur Search, cette limite s&#39;applique au contenu, pas au classement. Exa continue d&#39;utiliser les signaux de
  retrieval actuels pour découvrir les candidate URLs. Considérez les résultats comme des evidence délimitées par `snapshotAsOf`, et non comme une
  reconstruction exacte du classement qu&#39;une search aurait produit à ce moment-là.
</Note>

<div id="limits-and-compatibility">
  ## Limites et compatibilité
</div>

<AccordionGroup>
  <Accordion title="Accès, rate limit et profondeur d'historique">
    Le Pay as you go inclut 10 QPS et un accès glissant à 5 mois d&#39;index. Un `snapshotAsOf` antérieur
    à cette fenêtre est rejeté. Au-delà de 100 requêtes, [contactez le service commercial](https://exa.ai/contact/sales)
    pour poursuivre.
  </Accordion>

  <Accordion title="Les requêtes historiques utilisent le contenu stocké">
    Ne combinez pas `snapshotAsOf` avec des options susceptibles d&#39;accéder au web en direct ou de s&#39;étendre à d&#39;autres pages.
    Omettez totalement `livecrawl`, `livecrawlTimeout`, `maxAgeHours` et `subpages` ; les requêtes qui définissent
    l&#39;un de ces paramètres en même temps que `snapshotAsOf` sont rejetées avec `INVALID_REQUEST`.
  </Accordion>

  <Accordion title="Search requêtes prises en charge">
    Exa Snapshot sur Search prend en charge `auto`, `fast` et `instant`. Il ne prend en charge
    ni `deep-lite`, ni `deep`, ni `deep-reasoning`.

    Exa Snapshot ne prend pas en charge le parameter `category` sur Search.
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## Utilisations courantes
</div>

Utilisez Exa Snapshot lorsque la tâche dépend de ce qu&#39;Exa avait stocké à un datetime précis :

* Réaliser le backtest d&#39;un agent sans l&#39;exposer aux mises à jour ultérieures des pages.
* Lancer une évaluation sur une limite de contenu reproductible.
* Comparer des versions antérieures de documentations, de tarifs, de politiques ou de filings.