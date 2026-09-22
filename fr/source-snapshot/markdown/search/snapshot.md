> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-snapshot">
  # Exa Snapshot
</div>

> Épinglez Search et Contents sur une stored version d&#39;une page à une datetime de votre choix.

Exa Snapshot conserve des stored versions des pages explorées par Exa. Envoyez `snapshotAsOf` pour épingler la requête à une datetime.

Utilisez cette fonctionnalité pour backtester des agents, exécuter des évaluations reproductibles et comparer des versions antérieures de documentations, de pages de tarification, de politiques et de filings.

<Info>
  Exa Snapshot est disponible en paiement à l&#39;usage à 10 QPS, avec une fenêtre d&#39;index glissante de 5 mois.
  Au-delà de 100 requests, [contactez l&#39;équipe commerciale](https://exa.ai/contact/sales) pour continuer.
</Info>

<div id="search-at-a-datetime">
  ## Search à une datetime
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

Exa identifie les candidate URLs, puis ne conserve que les pages ayant une stored version antérieure ou égale à `snapshotAsOf`.

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
  ## Épingler le contenu à un datetime
</div>

Ajoutez `snapshotAsOf` au niveau racine d&#39;une requête `/contents`.

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

Exa renvoie la stored version la plus récente antérieure ou égale à ce datetime.

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
  Les identifiants sans eligible version sont omis de `results` et signalés dans `statuses` avec
  `"status": "error"` et `"tag": "CONTENT_NOT_CACHED"`.
</Tip>

<div id="how-snapshots-work">
  ## Fonctionnement des snapshots
</div>

| Field          | Emplacement | Signification                                                                               |
| -------------- | ----------- | ------------------------------------------------------------------------------------------- |
| `snapshotAsOf` | Requête     | Datetime limite. Exa renvoie la stored version la plus récente à cet instant ou antérieure. |

Pour les deux endpoints :

* Le contenu de la page renvoyé provient de cette stored version.
* Le titre, l&#39;auteur, la publication date, le texte, les highlights et les résumés sont générés uniquement à partir de cette version.
* Les pages dépourvues d&#39;eligible version dans la fenêtre de 5 mois sont omises.

<Note>
  Sur Search, la limite borne le contenu, pas le classement. Exa s&#39;appuie toujours sur les signaux de
  retrieval actuels pour découvrir les candidate URLs. Considérez les résultats comme des preuves bornées par `snapshotAsOf`, et non comme une
  reconstruction exacte du classement qu&#39;une search aurait produit à ce moment-là.
</Note>

<div id="limits-and-compatibility">
  ## Limites et compatibilité
</div>

<AccordionGroup>
  <Accordion title="Accès, limite de débit et profondeur d'historique">
    Le paiement à l&#39;usage inclut 10 QPS et un accès glissant à 5 mois d&#39;index. Une valeur `snapshotAsOf` antérieure
    à cette fenêtre est rejetée. Au-delà de 100 requests, [contactez le service commercial](https://exa.ai/contact/sales)
    pour continuer.
  </Accordion>

  <Accordion title="Les requests historiques utilisent le contenu stocké">
    Ne combinez pas `snapshotAsOf` avec des options susceptibles d&#39;accéder au web en direct ou de s&#39;étendre à d&#39;autres pages.
    Omettez entièrement `livecrawl`, `livecrawlTimeout`, `maxAgeHours` et `subpages` : toute request qui définit
    l&#39;un de ces paramètres en plus de `snapshotAsOf` est rejetée avec `INVALID_REQUEST`.
  </Accordion>

  <Accordion title="Requests Search prises en charge">
    Exa Snapshot sur Search prend en charge `auto`, `fast` et `instant`. Il ne prend en charge
    ni `deep-lite`, ni `deep`, ni `deep-reasoning`.

    Exa Snapshot ne prend pas en charge le paramètre `category` sur Search.
  </Accordion>
</AccordionGroup>

<div id="common-uses">
  ## Cas d&#39;usage courants
</div>

Utilisez Exa Snapshot lorsque la tâche dépend de ce qu&#39;Exa avait stocké à une datetime précise :

* Backtester un agent sans l&#39;exposer aux mises à jour ultérieures des pages.
* Exécuter une évaluation sur une limite de contenu reproductible.
* Comparer des versions antérieures de documentation, de tarification, de politiques ou de filings.