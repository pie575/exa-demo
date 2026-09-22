> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="how-to-use-imports">
  # Comment utiliser les imports
</div>

> Un guide pas à pas pour importer des URL dans Websets : enrichir votre liste, l&#39;évaluer selon des critères, découvrir de nouvelles correspondances et combiner les trois.

Lorsque vous disposez déjà d&#39;une liste d&#39;URL (entreprises, personnes, produits, etc.), vous pouvez les **importer** dans un Webset. Selon la façon dont vous configurez le Webset, vos items importés peuvent être enrichis, évalués selon des critères ou combinés aux résultats du Web Discovery.

Ce guide passe en revue chaque configuration avec les appels API exacts que vous pouvez copier-coller. Il vous suffit de remplacer `$EXA_API_KEY` par votre API key.

<div id="our-example-5-it-consulting-suppliers">
  ## Notre exemple : 5 fournisseurs de conseil informatique
</div>

Tout au long de ce guide, nous utiliserons la même liste de 5 entreprises comme import :

| Entreprise   | URL                              | Remarques                                                                               |
| ------------ | -------------------------------- | --------------------------------------------------------------------------------------- |
| Accenture    | `https://www.accenture.com`      | Conseil informatique mondial, siège social aux États-Unis                               |
| Infosys      | `https://www.infosys.com`        | Services informatiques, forte présence aux États-Unis                                   |
| Wipro        | `https://www.wipro.com`          | Services informatiques, bureaux aux États-Unis                                          |
| EPAM Systems | `https://www.epam.com`           | Ingénierie logicielle, cotée aux États-Unis                                             |
| Persol Group | `https://www.persol-group.co.jp` | Société de placement de personnel, centrée sur le Japon, présence minime aux États-Unis |

Nous les avons choisies parce que 4 sur 5 répondent clairement aux critères typiques du conseil informatique (bureau aux États-Unis, services informatiques). **Persol Group** fait exception : il s&#39;agit d&#39;une société de placement de personnel japonaise dont la présence aux États-Unis est minime, elle ne devrait donc pas satisfaire les critères axés sur les États-Unis.

Nos critères pour les exemples ci-dessous :

1. « L&#39;entreprise a un bureau aux États-Unis »
2. « L&#39;entreprise fournit des services de conseil informatique ou de renfort d&#39;effectifs »

***

<div id="config-1-import-only-enrich-without-filtering">
  ## Config 1 : Import Only -- enrichir sans filtrage
</div>

<Note>
  **Exemple en direct :** [Voir ce webset sur le tableau de bord](https://websets.exa.ai/websets/webset_01kmnrshyh3bdart13q1ehdtdj)
</Note>

**À utiliser quand :** vous avez une liste d&#39;URL et souhaitez simplement les enrichir. Aucun scoring, aucun filtrage -- chaque item est conservé.

<div id="api-calls">
  ### Appels API
</div>

```bash theme={null}
# Étape 1 : créer un import CSV avec les URL de vos fournisseurs
curl -s -X POST "https://api.exa.ai/websets/v0/imports" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "csv",
    "count": 5,
    "size": 128,
    "entity": { "type": "company" },
    "title": "IT Consulting Suppliers"
  }'
# La réponse contient un `uploadUrl` et un `id` d'import

# Étape 2 : téléverser votre CSV vers l'URL présignée obtenue à l'étape 1
curl -X PUT "<UPLOAD_URL>" \
  -H "Content-Type: text/csv" \
  --data-binary @suppliers.csv
# suppliers.csv contient : url\nhttps://www.accenture.com\nhttps://www.infosys.com\n...

# Étape 3 : créer un Webset qui utilise cet import (enrichments uniquement, sans search ni critères)
# L'import est automatiquement planifié pour traitement à la création du Webset.
curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
  -H "Authorization: Bearer $EXA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "import": [
      { "source": "import", "id": "<IMPORT_ID>" }
    ],
    "enrichments": [
      { "description": "What services does this company provide?", "format": "text" },
      { "description": "Number of employees", "format": "number" }
    ]
  }'
```

<div id="what-we-see-in-the-live-webset">
  ### Ce que l&#39;on observe dans le Webset en direct
</div>

Les **5 items** apparaissent tous dans le Webset. Aucun filtrage n&#39;a lieu puisqu&#39;il n&#39;y a aucun critère.

| fournisseur     | Dans le Webset ? | Source   | Évaluations | Enrichments | Pourquoi ?                       |
| ------------ | ---------------- | -------- | ----------- | ----------- | -------------------------------- |
| Accenture    | **Oui**          | `import` | 0           | 2           | Importé, aucun critère à évaluer |
| Infosys      | **Oui**          | `import` | 0           | 2           | Importé, aucun critère à évaluer |
| Wipro        | **Oui**          | `import` | 0           | 2           | Importé, aucun critère à évaluer |
| EPAM Systems | **Oui**          | `import` | 0           | 2           | Importé, aucun critère à évaluer |
| Persol Group | **Oui**          | `import` | 0           | 2           | Importé, aucun critère à évaluer |

Chaque item possède `source: "import"` et `evaluations: []`. Les 5 sont conservés et enrichis, qu&#39;ils satisfassent ou non d&#39;éventuels critères -- puisqu&#39;il n&#39;y a aucun critère dans cette config.

<Note>
  L&#39;URL de Persol Group (`persol-group.co.jp`) a été résolue en « PERSOL Vietnam Japan Desk » dans les données d&#39;entité -- le système l&#39;importe et l&#39;enrichit malgré tout, elle pointe simplement vers une page de filiale régionale.
</Note>

***

<div id="config-2-search-only-web-discovery">
  ## Config 2 : Search uniquement -- Web Discovery
</div>

<Note>
  **Exemple en direct :** [Voir ce webset sur le tableau de bord](https://websets.exa.ai/websets/webset_01kmnrn5e1jr7gp22x8vk53wbz)
</Note>

**À utiliser quand :** vous n&#39;avez pas de liste -- vous souhaitez découvrir sur le web de nouvelles entreprises correspondant à vos critères.

<div id="api-call">
  ### Appel d&#39;API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-2">
  ### Ce que nous observons dans le Webset en direct
</div>

Le système a parcouru le web et trouvé **35 entreprises** qui satisfont les deux critères. Chaque item porte `source: "search"`, accompagné d&#39;évaluations complètes expliquant la correspondance.

| Nos 5 fournisseurs        | Dans le Webset ? | Pourquoi ?                                                                             |
| ------------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| Accenture                 | **Oui**          | La recherche web a découvert Accenture d&#39;elle-même comme entreprise correspondante |
| Infosys                   | **Non**          | Non découverte par cette recherche web en particulier                                  |
| Wipro                     | **Non**          | Non découverte par cette recherche web en particulier                                  |
| EPAM Systems              | **Non**          | Non découverte par cette recherche web en particulier                                  |
| Persol Group              | **Non**          | Non découverte par cette recherche web en particulier                                  |
| *(34 autres entreprises)* | **Oui**          | Trouvées par la recherche web, satisfont les deux critères                             |

La recherche web a trouvé Accenture parmi ses 35 résultats, mais les 4 autres fournisseurs n&#39;ont pas été découverts. C&#39;est normal : les websets reposant uniquement sur la recherche ne renvoient que ce que l&#39;exploration du web permet de trouver, et non une liste prédéfinie. Autres entreprises découvertes, par exemple : Artech, TurnKey Staffing, DataArt, Insight Global, etc.

***

<div id="config-3-scoped-search-score-your-list-against-criteria">
  ## Config 3 : Scoped Search -- évaluez votre liste selon des critères
</div>

<Note>
  **Exemple en direct :** [Voir ce webset sur le tableau de bord](https://websets.exa.ai/websets/webset_01kmnrsnkmksyb5e5d31e6bw5w)
</Note>

**À utiliser quand :** vous disposez d&#39;une liste de fournisseurs et souhaitez **évaluer chacun d&#39;eux selon des critères**. Seuls ceux qui satisfont aux critères sont renvoyés. C&#39;est le cas d&#39;usage « évaluer ma liste ».

<div id="api-calls-2">
  ### Appels API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Créez un import CSV et téléversez-le comme indiqué dans la Config 1, puis utilisez son ID ici.
  response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers={"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"},
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  response.raise_for_status()
  webset = response.json()
  ```

  ```javascript JavaScript theme={null}
  // Créez un import CSV et téléversez-le comme indiqué dans la Config 1, puis utilisez son ID ici.
  const response = await fetch("https://api.exa.ai/websets/v0/websets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXA_API_KEY}`
    },
    body: JSON.stringify({
      search: {
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        scope: [
          { source: "import", id: "<IMPORT_ID>" }
        ]
      },
      enrichments: [
        {
          description: "What services does this company provide?",
          format: "text"
        },
        { description: "Number of employees", format: "number" }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Webset creation failed: ${response.status}`);
  }
  const webset = await response.json();
  ```

  ```bash cURL theme={null}
  # Étape 1 : créez un import CSV et téléversez-le (comme dans la Config 1, étapes 1-2)
  # ... (voir la Config 1 pour le flux d'import complet)
  # Vous obtiendrez en retour un <IMPORT_ID>

  # Étape 2 : créez un Webset avec une Scoped Search -- évalue chaque URL importée au regard des critères
  # L'import est automatiquement planifié pour traitement lors de la création du Webset.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-3">
  ### Ce que nous observons dans le Webset en direct
</div>

Le webset contient **4 items**. Chacun de nos 5 fournisseurs a été évalué au regard des critères : seuls ceux qui satisfont les deux critères apparaissent.

| Fournisseur  | Dans le Webset ?  | Source   | Évaluations ? | Pourquoi ?                                                                           |
| ------------ | ----------------- | -------- | ------------- | ------------------------------------------------------------------------------------ |
| Accenture    | **Oui**           | `search` | Oui (2)       | Validé : possède un bureau aux États-Unis, fournit du conseil informatique           |
| Infosys      | **Oui**           | `search` | Oui (2)       | Validé : possède un bureau aux États-Unis, fournit des services informatiques        |
| Wipro        | **Oui**           | `search` | Oui (2)       | Validé : possède un bureau aux États-Unis, fournit des services informatiques        |
| EPAM Systems | **Oui**           | `search` | Oui (2)       | Validé : coté aux États-Unis, fournit des services d&#39;ingénierie logicielle       |
| Persol Group | **Non -- écarté** | --       | --            | Échec sur « possède un bureau aux États-Unis » -- principalement centré sur le Japon |

Nous avons importé 5 fournisseurs, mais seuls 4 apparaissent dans les résultats. **Persol Group a été évalué et n&#39;a pas satisfait les critères**, il est donc écarté. Chaque item visible possède `source: "search"` ainsi que des `evaluations` complètes détaillant le raisonnement appliqué à chaque critère.

<Warning>
  Les items qui ne satisfont pas les critères sont **écartés des résultats**. Si vous souhaitez conserver tous les items et simplement voir lesquels passent ou échouent, utilisez la Config 1 (import seul, sans filtrage) dans un webset distinct, en parallèle de la Config 3.
</Warning>

***

<div id="config-4-scoped-search-web-discovery-score-your-list-and-find-new-matches">
  ## Config 4 : Scoped Search + Web Discovery -- évaluez votre liste ET trouvez de nouvelles correspondances
</div>

<Note>
  **Exemple en direct :** [Voir ce webset sur le tableau de bord](https://websets.exa.ai/websets/webset_01kmpbj5wjcsh1yqn2cfhx2v7h)
</Note>

**À utiliser quand :** vous disposez d&#39;une liste de fournisseurs à évaluer selon des critères, mais vous souhaitez aussi découvrir sur le web d&#39;autres entreprises répondant à ces mêmes critères. Le processus se déroule en deux étapes : créez d&#39;abord un webset avec une scoped search, puis ajoutez une recherche web classique à ce même webset.

<div id="api-calls-3">
  ### Appels API
</div>

<CodeGroup>
  ```python Python theme={null}
  import os
  import requests

  # Créez un import CSV et téléversez-le comme indiqué dans la Config 1, puis utilisez son ID ici.
  headers = {"Authorization": f"Bearer {os.environ['EXA_API_KEY']}"}
  webset_response = requests.post(
      "https://api.exa.ai/websets/v0/websets",
      headers=headers,
      json={
          "search": {
              "query": "IT consulting and staff augmentation companies",
              "entity": {"type": "company"},
              "criteria": [
                  {"description": "The company has an office in the United States"},
                  {
                      "description": "The company provides IT consulting or staff augmentation services"
                  },
              ],
              "count": 25,
              "scope": [
                  {"source": "import", "id": "<IMPORT_ID>"},
              ],
          },
          "enrichments": [
              {
                  "description": "What services does this company provide?",
                  "format": "text",
              },
              {"description": "Number of employees", "format": "number"},
          ],
      },
  )
  webset_response.raise_for_status()
  webset_id = webset_response.json()["id"]

  search_response = requests.post(
      f"https://api.exa.ai/websets/v0/websets/{webset_id}/searches",
      headers=headers,
      json={
          "query": "IT consulting and staff augmentation companies",
          "entity": {"type": "company"},
          "criteria": [
              {"description": "The company has an office in the United States"},
              {
                  "description": "The company provides IT consulting or staff augmentation services"
              },
          ],
          "count": 25,
          "behavior": "append",
      },
  )
  search_response.raise_for_status()
  ```

  ```javascript JavaScript theme={null}
  // Créez un import CSV et téléversez-le comme indiqué dans la Config 1, puis utilisez son ID ici.
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.EXA_API_KEY}`
  };
  const websetResponse = await fetch(
    "https://api.exa.ai/websets/v0/websets",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        search: {
          query: "IT consulting and staff augmentation companies",
          entity: { type: "company" },
          criteria: [
            { description: "The company has an office in the United States" },
            {
              description: "The company provides IT consulting or staff augmentation services"
            }
          ],
          count: 25,
          scope: [
            { source: "import", id: "<IMPORT_ID>" }
          ]
        },
        enrichments: [
          {
            description: "What services does this company provide?",
            format: "text"
          },
          { description: "Number of employees", format: "number" }
        ]
      })
    }
  );

  if (!websetResponse.ok) {
    throw new Error(`Webset creation failed: ${websetResponse.status}`);
  }
  const webset = await websetResponse.json();

  const searchResponse = await fetch(
    `https://api.exa.ai/websets/v0/websets/${webset.id}/searches`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: "IT consulting and staff augmentation companies",
        entity: { type: "company" },
        criteria: [
          { description: "The company has an office in the United States" },
          {
            description: "The company provides IT consulting or staff augmentation services"
          }
        ],
        count: 25,
        behavior: "append"
      })
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Search creation failed: ${searchResponse.status}`);
  }
  ```

  ```bash cURL theme={null}
  # Étape 1 : créez un import CSV et téléversez-le (comme au Config 1, étapes 1-2)
  # ... (voir le Config 1 pour le flux d'import complet)
  # Vous obtiendrez un <IMPORT_ID>

  # Étape 2 : créez un Webset avec une Scoped Search -- évalue chaque URL importée au regard des critères
  # L'import est automatiquement planifié pour traitement à la création du Webset.
  curl -s -X POST "https://api.exa.ai/websets/v0/websets" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "search": {
        "query": "IT consulting and staff augmentation companies",
        "entity": { "type": "company" },
        "criteria": [
          { "description": "The company has an office in the United States" },
          { "description": "The company provides IT consulting or staff augmentation services" }
        ],
        "count": 25,
        "scope": [
          { "source": "import", "id": "<IMPORT_ID>" }
        ]
      },
      "enrichments": [
        { "description": "What services does this company provide?", "format": "text" },
        { "description": "Number of employees", "format": "number" }
      ]
    }'
  # La réponse contient l'`id` du webset -- conservez-le comme <WEBSET_ID>

  # Étape 3 : attendez la fin de la Scoped Search, puis ajoutez une recherche web pour découvrir de nouvelles correspondances
  curl -s -X POST "https://api.exa.ai/websets/v0/websets/<WEBSET_ID>/searches" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "IT consulting and staff augmentation companies",
      "entity": { "type": "company" },
      "criteria": [
        { "description": "The company has an office in the United States" },
        { "description": "The company provides IT consulting or staff augmentation services" }
      ],
      "count": 25,
      "behavior": "append"
    }'
  ```
</CodeGroup>

<div id="what-we-see-in-the-live-webset-4">
  ### Ce que nous voyons dans le webset en direct
</div>

Le webset contient **29 items** : 4 issus de nos fournisseurs importés (évalués et retenus) plus 25 entreprises découvertes sur le web. Les deux ensembles sont évalués selon les critères.

| Fournisseur                               | Dans le webset ?  | Source   | Évaluations ?   | Pourquoi ?                                                            |
| ----------------------------------------- | ----------------- | -------- | --------------- | --------------------------------------------------------------------- |
| Accenture                                 | **Oui**           | `search` | Oui (2)         | Scoped Search réussie : bureau aux États-Unis, conseil informatique   |
| Infosys                                   | **Oui**           | `search` | Oui (2)         | Scoped Search réussie : bureau aux États-Unis, services informatiques |
| Wipro                                     | **Oui**           | `search` | Oui (2)         | Scoped Search réussie : bureau aux États-Unis, services informatiques |
| EPAM Systems                              | **Oui**           | `search` | Oui (2)         | Scoped Search réussie : cotée aux États-Unis, ingénierie logicielle   |
| Persol Group                              | **Non -- écarté** | --       | --              | Scoped Search échouée : pas de bureau aux États-Unis                  |
| *(25 entreprises découvertes sur le web)* | **Oui**           | `search` | Oui (2 chacune) | Trouvées par recherche web, les deux critères satisfaits              |

La Scoped Search évalue votre liste importée selon les critères (et écarte Persol Group), tandis que la recherche web ajoutée découvre 25 entreprises supplémentaires. On obtient ainsi un seul webset réunissant vos imports évalués et les nouvelles découvertes web.

<Note>
  La recherche web utilise `"behavior": "append"` : elle s&#39;ajoute donc aux résultats existants au lieu de les remplacer. Si elle découvre une entreprise déjà présente dans les résultats de la Scoped Search (par exemple Accenture), le doublon est automatiquement géré.
</Note>

***

<div id="quick-reference">
  ## Référence rapide
</div>

| Configuration                        | Rôle                                                         | Tous les items conservés ?              | Les items sont-ils évalués ?                          |
| ------------------------------------ | ------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------- |
| **1. Import Only**                   | Enrichir votre liste                                         | Oui -- tous conservés                   | Non                                                   |
| **2. Search uniquement**             | Découvrir de nouvelles correspondances sur le web            | S.O. (aucun import)                     | Oui -- seuls les items retenus sont renvoyés          |
| **3. Scoped Search**                 | Évaluer votre liste au regard des critères                   | Non -- les items rejetés sont écartés   | Oui                                                   |
| **4. Scoped Search + Web Discovery** | Évaluer votre liste + découvrir de nouvelles correspondances | Non -- les imports rejetés sont écartés | Oui -- les imports comme les découvertes sont évalués |

<div id="which-config-should-i-use">
  ## Quelle Config utiliser ?
</div>

* **« Je veux simplement enrichir ma liste, sans filtrage »** -- Config 1
* **« Je n&#39;ai pas de liste, trouvez-moi des entreprises »** -- Config 2
* **« Évaluez ma liste et écartez les éléments qui ne correspondent pas »** -- Config 3
* **« Évaluez ma liste ET trouvez de nouvelles entreprises correspondantes »** -- Config 4