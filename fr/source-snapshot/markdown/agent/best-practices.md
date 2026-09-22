> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="agent-best-practices">
  # Bonnes pratiques Agent
</div>

> Optimisez la qualité des requêtes, la sortie structurée, l&#39;effort et le coût de vos intégrations Exa Agent en production.

Utilisez ce guide après le [Quickstart Agent](/fr/docs/agent/quickstart) pour améliorer la qualité des requêtes, structurer les sorties et maîtriser le temps d&#39;exécution et le coût. Pour des requêtes complètes, commencez par les [exemples Agent](/fr/docs/agent/examples).

<div id="core-principles">
  ## Principes fondamentaux
</div>

Considérez `query` comme une spécification de tâche. Précisez ce que l&#39;Agent doit trouver, le scope du travail, les preuves requises et ce qui constitue un résultat complet.

<CodeGroup>
  ```python Python theme={null}
  run = exa.agent.runs.create(
      query="Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources.",
  )
  ```

  ```javascript JavaScript theme={null}
  const run = await exa.agent.runs.create({
    query:
      "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/agent/runs" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Find up to 10 current engineering leaders at AI infrastructure companies that raised a Series A or B in the last 6 months. Include only people whose current role and company funding can be verified from public sources."
    }'
  ```
</CodeGroup>

Sans `outputSchema`, l&#39;Agent renvoie du texte dans `output.text` et des citations dans `output.grounding`. N&#39;ajoutez un autre field que s&#39;il remplit un rôle précis :

| Field                   | À utiliser quand                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `outputSchema`          | Le code en aval a besoin de fields structurés                                       |
| `input.data`            | Vous disposez déjà de lignes à enrichir                                             |
| `input.exclusion`       | Certains records connus ne doivent pas être renvoyés                                |
| `dataSources`           | Un field doit provenir d&#39;un partner [Exa Connect](/fr/docs/agent/connect/overview) |
| `previousRunId`         | La requête prolonge un run terminé                                                  |
| `effort`                | Le coût ou la profondeur de recherche doit être défini explicitement                |
| `budget.maxCostDollars` | Un run `auto` ou `max` nécessite un plafond de coût strict                          |

Placez les lignes, les exclusions et la forme de la réponse dans leurs fields dédiés plutôt que de les intégrer à `query`.

<div id="writing-list-building-and-enrichment-queries">
  ## Rédiger des requêtes de constitution de liste et d&#39;enrichment
</div>

Pour la constitution de listes, définissez l&#39;entité, le nombre cible, les critères de qualification, les exclusions et le niveau de preuve exigé. Pour l&#39;enrichment, placez les records existants dans `input.data` et décrivez uniquement la recherche qu&#39;Agent doit effectuer en complément.

Demandez une justification lorsque la qualification relève d&#39;un jugement. Ne donnez des exemples que lorsqu&#39;un critère se prête à plusieurs interprétations plausibles.

<CodeGroup>
  ```text Query theme={null}
  Find up to 20 current engineering leaders at US-based AI infrastructure companies
  that announced a Series A or B between March 1 and August 31, 2026.

  Include CTOs, VPs of Engineering, and Heads of Engineering. Exclude founders without
  an operating engineering role and anyone whose current employment cannot be verified.
  For each person, return their name, current title, company, company website, funding
  announcement date, and a short explanation of why they qualify. Verify employment on
  the company website or another current source, and verify funding from the company
  announcement or a reputable business publication.
  ```
</CodeGroup>

Consultez [Find all GTM members](/fr/docs/agent/examples#find-all-code) pour un exemple de requête de discovery et [Enrich input rows](/fr/docs/agent/examples#enrich-input-rows-code) pour le modèle d&#39;enrichment de lignes correspondant.

<div id="handle-asynchronous-runs">
  ## Gérer les runs asynchrones
</div>

Les Agent runs peuvent durer de quelques secondes à plusieurs minutes, le temps de rechercher, lire et raisonner. Concevez votre application autour de ce cycle de vie plutôt que de maintenir une requête applicative ouverte.

<Steps>
  <Step title="Créer et conserver">
    Créez le run et enregistrez l&#39;`id` renvoyé avec les métadonnées de votre requête. La réponse de création n&#39;est pas le résultat final.
  </Step>

  <Step title="Attendre un état terminal">
    Utilisez un utilitaire de polling du SDK, interrogez `GET /agent/runs/{id}` ou consommez le flux SSE. Poursuivez tant que le run est `queued` ou `running`.
  </Step>

  <Step title="Stocker le résultat">
    Arrêtez d&#39;attendre aux états `completed`, `failed` ou `cancelled`, puis conservez la réponse terminale et le grounding.
  </Step>
</Steps>

Conserver l&#39;ID du run permet à votre application de reprendre après un redémarrage, de se reconnecter à un flux et d&#39;analyser les échecs. Réduisez la latence en restreignant le scope, en limitant le nombre de résultats, en gardant un schéma ciblé et en choisissant `minimal` ou `low` lorsque la rapidité prime sur l&#39;exhaustivité.

Pour les batchs, testez des tâches représentatives avant d&#39;estimer la concurrency ou de placer Agent sur un chemin d&#39;interface synchrone. La durée d&#39;exécution varie selon le nombre d&#39;items, la complexité du schéma, la disponibilité des sources et l&#39;effort.

Pour les équipes en Zero Data Retention, consommez le flux en direct ou interrogez l&#39;API pendant la fenêtre de rétention. `previousRunId` et les `dataSources` Connect ne sont pas disponibles. Voir [Zero Data Retention](/fr/docs/admin/security/zero-data-retention).

<div id="write-custom-json-schemas-for-structured-output">
  ## Rédiger des schémas JSON personnalisés pour la sortie structurée
</div>

Utilisez `outputSchema` lorsque le code en aval a besoin de fields exploitables par une machine, de valeurs normalisées, de lignes de tableau ou de records d&#39;enrichment. Si une réponse en prose suffit, omettez-le et lisez `output.text` ; la sortie structurée demande un travail de formatage supplémentaire et peut augmenter la latence.

Gardez les instructions de recherche dans `query` et la forme de la réponse dans `outputSchema`. Utilisez des noms de propriétés et des descriptions explicites, choisissez les types utiles les plus restrictifs et bornez les arrays avec `maxItems`.

<CodeGroup>
  ```json Output schema expandable theme={null}
  {
    "type": "object",
    "properties": {
      "people": {
        "type": "array",
        "maxItems": 10,
        "description": "Current engineering leaders who satisfy every criterion in the query.",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "The person's full name."
            },
            "job_title": {
              "type": "string",
              "description": "Their current title at the qualifying company."
            },
            "company": {
              "type": "string",
              "description": "The qualifying company's canonical name."
            },
            "qualification_rationale": {
              "type": "string",
              "description": "A concise explanation of how the person satisfies the query criteria."
            }
          },
          "required": ["name", "job_title", "company", "qualification_rationale"]
        }
      }
    },
    "required": ["people"]
  }
  ```
</CodeGroup>

La conformité au schéma valide la forme, pas les faits. Agent peut renvoyer `null` lorsque les preuves ne permettent pas de renseigner un field, même si le schéma soumis le marque comme requis ou non nullable. `stopReason: schema_satisfied` signifie qu&#39;Agent considère la forme attendue comme complète, ces valeurs nulles étant admises ; cela ne garantit pas une validation stricte vis-à-vis du schéma soumis.

Ne dupliquez pas dans votre schéma les citations ou la confidence intégrées d&#39;Exa. N&#39;ajoutez un field de justification que si chaque item doit expliquer pourquoi il est éligible, et conservez `output.grounding` avec le résultat structuré. Vérifiez les affirmations importantes auprès de leurs sources et testez les modifications de schéma sur des entrées représentatives avant la mise en production.

Parcourez les [exemples d&#39;Agent structurés](/fr/docs/agent/examples) pour comparer les schémas de constitution de listes, de KYB, d&#39;offres d&#39;emploi, d&#39;exclusions et de runs poursuivis.

<div id="agent-vs-search">
  ## Agent ou Search
</div>

| Besoin                                                                  | Commencer par                           |
| ----------------------------------------------------------------------- | --------------------------------------- |
| Des résultats web pour votre LLM                                        | [Search](/fr/docs/search/quickstart)       |
| Une recherche et une synthèse rapides                                   | [Deep Search](/fr/docs/search/deep-search) |
| Constitution de listes asynchrone, recherche multi-étapes ou enrichment | [Agent](/fr/docs/agent/quickstart)         |

Utilisez Agent lorsque la tâche exige plusieurs étapes de retrieval, une vérification entité par entité ou un enrichment sur des records connus. Utilisez Search lorsque vous avez besoin de pages rapidement et que votre application prend en charge le reste du raisonnement.

<div id="tips-for-common-use-cases">
  ## Conseils pour les cas d&#39;usage courants
</div>

| Si vous avez besoin de                                  | Utilisez                                                       | Évitez                                                                      |
| ------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Une liste issue d&#39;une recherche, de taille inconnue | `auto` et un `outputSchema` borné                              | Un effort fixe et faible associé à un array non borné                       |
| L&#39;enrichment de records que vous possédez déjà      | `input.data` ainsi que les fields à ajouter                    | Coller le tableau dans `query`                                              |
| Un follow-up sur le dernier ensemble de résultats       | `previousRunId`                                                | Renvoyer l&#39;intégralité de l&#39;output précédent                        |
| Des records qui ne doivent plus réapparaître            | `input.exclusion` ainsi qu&#39;une déduplication en aval       | Considérer les exclusions comme une garantie d&#39;identité stricte         |
| Des données de fournisseur premium                      | [Exa Connect](/fr/docs/agent/connect/overview) avec `dataSources` | Demander à Agent de déduire du web ouvert des fields propres au fournisseur |
| Un coût prévisible par requête                          | Un `effort` fixe                                               | `auto` ou `max` sans budget                                                 |
| L&#39;exhaustivité plutôt que la latence et le coût     | `xhigh` ou `max`                                               | Augmenter l&#39;effort avant d&#39;avoir affiné la requête                  |

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="Quickstart Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez un run, streamez les events, définissez l&#39;effort et lisez la sortie structurée.
  </Card>

  <Card title="Exemples Agent" icon="layers" href="/fr/docs/agent/examples" cta="Parcourir les exemples" arrow="true">
    Copiez des requêtes complètes de constitution de liste, d&#39;enrichment, de KYB, d&#39;exclusion et de follow-up.
  </Card>

  <Card title="Exa Connect" icon="database" href="/fr/docs/agent/connect/overview" cta="Parcourir les data partners" arrow="true">
    Ajoutez des données premium de fournisseurs sur les entreprises, les personnes, le trafic, la conformité, la finance et bien d&#39;autres domaines.
  </Card>

  <Card title="Bonnes pratiques de search" icon="sparkles" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Qualité du retrieval, latence et synthèse lorsque Search suffit.
  </Card>
</Columns>