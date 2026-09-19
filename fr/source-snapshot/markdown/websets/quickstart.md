> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="websets">
  # Websets
</div>

> Créez des jeux de données vérifiés et enrichis à partir du web.

<div id="what-are-websets">
  ## Qu&#39;est-ce qu&#39;un Webset ?
</div>

Un Webset part d&#39;une query en langage naturel et d&#39;un nombre d&#39;items cible. Ajoutez les criteria que chaque résultat doit respecter, ainsi que les fields d&#39;enrichment à renseigner pour chaque item accepté. Les résultats arrivent de façon asynchrone via le dashboard, l&#39;API ou les webhooks.

Vous pouvez aussi créer des websets visuellement depuis le [Dashboard](/fr/docs/websets/dashboard/get-started), sans écrire une seule ligne de
code.

<Info>
  Vous démarrez un nouveau workflow de list-building ou d&#39;enrichment ? Utilisez [Exa Agent](/fr/docs/agent/quickstart).
  Ce guide s&#39;adresse à la maintenance ou à l&#39;extension d&#39;une integration Websets existante.
  L&#39;API Websets nécessite un forfait Websets payant ; les credits de la Search API et les credits Websets sont distincts.
</Info>

<div id="how-it-works">
  ## Fonctionnement
</div>

1. **Définissez une search :** fournissez une query en langage naturel, un nombre de résultats, ainsi que des criteria de verification et des enrichments facultatifs.
2. **Recherche et vérification :** Websets identifie des candidats et confronte chacun d&#39;eux à vos criteria. Seuls les résultats correspondants deviennent des items.
3. **Exécution des enrichments :** pour chaque item vérifié, Websets recherche les données supplémentaires demandées, par exemple le nom d&#39;un PDG, un montant de financement ou des coordonnées.
4. **Réception des résultats :** interrogez le status, utilisez des webhooks pour suivre les mises à jour ou consultez le dashboard à mesure que les items arrivent.

<div id="key-capabilities">
  ## Capacités clés
</div>

| Fonctionnalité                | Rôle                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Vérification des criteria** | Chaque résultat est vérifié selon les règles que vous définissez, pour n&#39;obtenir que des correspondances pertinentes |
| **Enrichments**               | Extraire des données précises (texte, nombres, dates, booléens) pour chaque résultat                                     |
| **Monitors**                  | Planifier des recherches récurrentes pour tenir votre webset à jour automatiquement                                      |
| **Webhooks**                  | Recevoir des rappels HTTP en temps réel à mesure que des items sont ajoutés ou enrichis                                  |
| **Imports**                   | Importer vos propres URL et y exécuter des enrichments                                                                   |

<div id="human-quickstart">
  ## Quickstart pour les humains
</div>

<Card title="Obtenez votre clé API Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  Créez une clé dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
</Card>

Installez le SDK :

<CodeGroup>
  ```bash Python theme={null}
  pip install exa-py
  ```

  ```bash JavaScript theme={null}
  npm install exa-js
  ```
</CodeGroup>

Effectuez ensuite votre première requête :

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa
  from exa_py.websets.types import CreateWebsetParameters, CreateEnrichmentParameters
  import os

  exa = Exa(api_key=os.getenv("EXA_API_KEY"))

  webset = exa.websets.create(
      params=CreateWebsetParameters(
          search={
              "query": "Top AI research labs focusing on large language models",
              "count": 5
          },
          enrichments=[
              CreateEnrichmentParameters(
                  description="LinkedIn profile of VP of Engineering or related role",
                  format="text",
              ),
          ],
      )
  )

  print(f"Webset created with ID: {webset.id}")
  print(f"View your Webset at: {webset.dashboard_url}")

  # Attendre que le Webset ait terminé son traitement
  webset = exa.websets.wait_until_idle(webset.id)

  # Récupérer les Items du Webset
  items = exa.websets.items.list(webset_id=webset.id)
  for item in items.data:
      print(f"Item: {item.model_dump_json(indent=2)}")
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa(process.env.EXA_API_KEY);

  const webset = await exa.websets.create({
    search: {
      query: "Top AI research labs focusing on large language models",
      count: 10
    },
    enrichments: [
      { description: "Estimate the company's founding year", format: "number" }
    ],
  });

  console.log(`Webset created with ID: ${webset.id}`);
  console.log(`View your Webset at: ${webset.dashboardUrl}`);

  const idleWebset = await exa.websets.waitUntilIdle(webset.id, {
    timeout: 60000,
    pollInterval: 2000,
    onPoll: (status) => console.log(`Current status: ${status}...`)
  });

  const items = await exa.websets.items.list(webset.id, { limit: 10 });
  for (const item of items.data) {
    console.log(`Item: ${JSON.stringify(item, null, 2)}`);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/" \
    -H "accept: application/json" \
    -H "content-type: application/json" \
    -H "Authorization: Bearer ${EXA_API_KEY}" \
    -d '{
      "search": {
        "query": "Top AI research labs focusing on large language models",
        "count": 5
      },
      "enrichments": [
        {"description": "Find the company'\''s founding year", "format": "number"}
      ]
    }'
  ```
</CodeGroup>

<Note>
  Consultez [Zero Data Retention](/fr/docs/admin/security/zero-data-retention) pour connaître la disponibilité par produit.
</Note>

<div id="next">
  ## Pour aller plus loin
</div>

* [**Guide du dashboard**](./dashboard/get-started) - Guide pas à pas pour utiliser Websets dans le dashboard
* [**Fonctionnement**](./api/how-it-works) - Plongée au cœur de l&#39;architecture événementielle
* [**Référence de l&#39;API Websets**](./api/websets/create-a-webset) - Référence complète de l&#39;API pour tous les endpoints