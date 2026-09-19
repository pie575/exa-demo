> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="agent-best-practices">
  # Bonnes pratiques Agent
</div>

> Optimisez la qualité des requêtes, les sorties structurées, l&#39;effort et le coût pour vos intégrations Exa Agent en production.

Utilisez ce guide après le [quickstart Exa Agent](/fr/docs/agent/quickstart) pour améliorer la qualité des requêtes, structurer les sorties et maîtriser le temps d&#39;exécution et le coût. Pour des requêtes complètes, commencez par les [exemples Agent](/fr/docs/agent/examples).

<div id="core-principles">
  ## Principes fondamentaux
</div>

Traitez `query` comme une spécification de tâche. Précisez ce qu&#39;Agent doit trouver, le périmètre du travail, les preuves attendues et ce qui constitue un résultat complet.

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

Sans `outputSchema`, Agent renvoie du texte rédigé dans `output.text` et les citations dans `output.grounding`. N&#39;ajoutez un autre champ que s&#39;il remplit un rôle précis :

| Champ                   | À utiliser quand                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `outputSchema`          | Le code en aval a besoin de champs structurés                                          |
| `input.data`            | Vous disposez déjà de lignes à enrichir                                                |
| `input.exclusion`       | Certains enregistrements connus ne doivent pas être renvoyés                           |
| `dataSources`           | Un champ doit provenir d&#39;un partenaire [Exa Connect](/fr/docs/agent/connect/overview) |
| `previousRunId`         | La requête prolonge un run terminé                                                     |
| `effort`                | Le coût ou la profondeur de recherche doit être défini explicitement                   |
| `budget.maxCostDollars` | Un run `auto` ou `max` nécessite un plafond de coût strict                             |

Conservez les lignes, les exclusions et la forme de la réponse dans leurs champs dédiés plutôt que de les intégrer à `query`.

<div id="writing-list-building-and-enrichment-queries">
  ## Rédiger des requêtes de list-building et d&#39;Enrichment
</div>

Pour le list-building, définissez l&#39;entité, le nombre cible, les critères de qualification, les exclusions et le niveau d&#39;evidence exigé. Pour l&#39;Enrichment, placez les records existants dans `input.data` et décrivez uniquement les recherches que l&#39;Agent doit ajouter.

Demandez une justification lorsque la qualification repose sur un jugement. Ne donnez des exemples que si un critère admet plusieurs interprétations plausibles.

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

Consultez [Find all GTM members](/fr/docs/agent/examples#find-all-code) pour un exemple de requête de Discovery et [Enrich input rows](/fr/docs/agent/examples#enrich-input-rows-code) pour le modèle d&#39;Enrichment de lignes correspondant.

<div id="handle-asynchronous-runs">
  ## Gérer les runs asynchrones
</div>

Un run d&#39;Agent peut durer de quelques secondes à plusieurs minutes, le temps de rechercher, lire et raisonner. Concevez votre application autour de ce cycle de vie plutôt que de maintenir une requête applicative ouverte.

<Steps>
  <Step title="Créer et conserver">
    Créez le run et enregistrez l&#39;`id` renvoyé avec les metadata de votre requête. La réponse de création n&#39;est pas le résultat final.
  </Step>

  <Step title="Attendre un état terminal">
    Utilisez un utilitaire de polling du SDK, interrogez `GET /agent/runs/{id}` ou consommez le flux SSE. Continuez tant que le run est `queued` ou `running`.
  </Step>

  <Step title="Stocker le résultat">
    Cessez d&#39;attendre dès l&#39;état `completed`, `failed` ou `cancelled`, puis conservez la réponse finale et le grounding.
  </Step>
</Steps>

Conserver l&#39;identifiant du run permet à votre application de repartir après un redémarrage, de se reconnecter à un flux et d&#39;analyser les échecs. Réduisez la latence en restreignant le scope, en limitant le nombre de résultats, en gardant un schema ciblé et en choisissant `minimal` ou `low` lorsque la rapidité prime sur l&#39;exhaustivité.

Pour les batchs, mesurez des tâches représentatives avant d&#39;estimer la concurrency ou de placer Agent sur un parcours d&#39;interface synchrone. La durée d&#39;exécution varie selon le nombre d&#39;items, la complexité du schema, la disponibilité des sources et l&#39;effort.

Pour les teams en Zero Data Retention, consommez le flux en direct ou interrogez l&#39;API dans la fenêtre de rétention. `previousRunId` et les `dataSources` Connect ne sont pas disponibles. Consultez [Zero Data Retention](/fr/docs/admin/security/zero-data-retention).

<div id="write-custom-json-schemas-for-structured-output">
  ## Rédiger des schémas JSON personnalisés pour la sortie structurée
</div>

Utilisez `outputSchema` lorsque votre code en aval a besoin de champs exploitables par une machine, de valeurs normalisées, de lignes de table ou d&#39;enregistrements d&#39;enrichment. Si une réponse en prose suffit, omettez-le et lisez `output.text` : la sortie structurée demande un travail de mise en forme supplémentaire et peut augmenter la latence.

Gardez les instructions de recherche dans `query` et la forme de la réponse dans `outputSchema`. Utilisez des noms de propriétés et des descriptions explicites, choisissez les types utiles les plus restrictifs et bornez les tableaux avec `maxItems`.

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

Le respect du schema valide la forme, pas les faits. Agent peut renvoyer `null` lorsque l&#39;evidence ne permet pas de renseigner un field, même si le schema soumis le marque comme requis ou non nullable. `stopReason: schema_satisfied` signifie qu&#39;Agent considère la forme attendue comme complète, ces valeurs nulles étant admises ; cela ne garantit pas une validation stricte par rapport au schema soumis.

Ne redupliquez pas dans votre schema les citations ou les indices de confiance déjà fournis par Exa. N&#39;ajoutez un champ de justification que si chaque item doit expliquer pourquoi il est retenu, et conservez `output.grounding` avec le résultat structuré. Vérifiez les affirmations importantes auprès de leurs sources et testez les modifications de schema sur des entrées représentatives avant la mise en production.

Parcourez les [exemples d&#39;Agent structurés](/fr/docs/agent/examples) pour comparer les schemas de list building, KYB, offres d&#39;emploi, exclusions et runs poursuivis.

<div id="agent-vs-search">
  ## Agent ou Search
</div>

| Besoin                                                                     | Commencez par                           |
| -------------------------------------------------------------------------- | --------------------------------------- |
| Des résultats web pour votre LLM                                           | [Search](/fr/docs/search/quickstart)       |
| Recherche et synthèse rapides                                              | [Deep Search](/fr/docs/search/deep-search) |
| list-building en asynchrone, recherche multi-étapes ou enrichment | [Agent](/fr/docs/agent/quickstart)         |

Utilisez Agent lorsque la tâche exige plusieurs étapes de récupération, une vérification entité par entité ou l&#39;enrichissement de données déjà connues. Utilisez Search lorsque vous avez besoin rapidement de pages et que votre application assurera le raisonnement restant.

<div id="tips-for-common-use-cases">
  ## Conseils pour les cas d&#39;usage courants
</div>

| Si vous avez besoin de                                  | Utilisez                                                       | Évitez                                                                   |
| ------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Une liste documentée de taille inconnue                 | `auto` et un `outputSchema` borné                              | Un effort faible figé et un tableau non borné                            |
| L&#39;enrichment de records dont vous disposez déjà | `input.data` et les champs à ajouter                           | Coller le tableau dans `query`                                           |
| Une relance sur le dernier ensemble de résultats        | `previousRunId`                                                | Renvoyer l&#39;intégralité de la sortie précédente                       |
| Des records qui ne doivent plus réapparaître            | `input.exclusion` et une déduplication en aval                 | Considérer les exclusions comme une garantie d&#39;identité stricte      |
| Des données de provider premium                         | [Exa Connect](/fr/docs/agent/connect/overview) avec `dataSources` | Demander à Agent de déduire du web ouvert des champs propres au provider |
| Un coût prévisible par requête                          | Un `effort` fixe                                               | `auto` ou `max` sans budget                                              |
| L&#39;exhaustivité plutôt que la latence et le coût     | `xhigh` ou `max`                                               | Augmenter l&#39;effort avant d&#39;affiner la query                      |

<div id="next-steps">
  ## Étapes suivantes
</div>

<Columns cols={2}>
  <Card title="Quickstart Agent" icon="bot" href="/fr/docs/agent/quickstart" cta="Ouvrir le guide" arrow="true">
    Créez un run, diffusez les événements, définissez l&#39;effort et exploitez la sortie structurée.
  </Card>

  <Card title="Exemples Agent" icon="layers" href="/fr/docs/agent/examples" cta="Parcourir les exemples" arrow="true">
    Copiez des requêtes complètes de list-building, d&#39;enrichment, de KYB, d&#39;exclusion et de follow-up.
  </Card>

  <Card title="Exa Connect" icon="database" href="/fr/docs/agent/connect/overview" cta="Parcourir les data partners" arrow="true">
    Ajoutez des données premium sur les entreprises, les personnes, le trafic, la conformité, la finance et bien d&#39;autres providers.
  </Card>

  <Card title="Bonnes pratiques Search" icon="sparkles" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Qualité de la retrieval, latence et synthèse lorsque Search suffit.
  </Card>
</Columns>