> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="n8n">
  # n8n
</div>

> Utilisez Exa search et contents dans vos workflows n8n.

Le [node Exa pour n8n](https://github.com/exa-labs/n8n-integration) officiel apporte la web search, l&#39;extraction de contenu, les réponses grounded et les runs Exa Agent à vos workflows visuels. Utilisez-le comme une étape de workflow classique ou connectez-le à un AI Agent n8n en tant que tool.

<div id="install-the-exa-node">
  ## Installer le node Exa
</div>

Le nom du package est `n8n-nodes-exa-official`.

<Steps>
  <Step title="Ajouter le community node">
    Recherchez **Exa** dans le sélecteur de nodes de n8n. S&#39;il n&#39;est pas disponible sur votre instance, le propriétaire de l&#39;instance peut installer `n8n-nodes-exa-official` en suivant le [guide d&#39;installation des community nodes](https://docs.n8n.io/integrations/community-nodes/installation/) de n8n.

    Le node requiert n8n 1.60 ou version ultérieure et Node.js 20.15 ou version ultérieure.
  </Step>

  <Step title="Créer une API key Exa">
    <Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une key dans le dashboard. Les nouveaux comptes bénéficient de credits gratuits.
    </Card>
  </Step>

  <Step title="Ajouter les credentials Exa">
    Ajoutez un credential **Exa API** dans n8n et collez-y votre key. Sélectionnez ce credential sur chaque node Exa devant utiliser ce compte.
  </Step>
</Steps>

<div id="run-a-search">
  ## Lancer une search
</div>

1. Ajoutez un déclencheur à un workflow.
2. Ajoutez le node **Exa**.
3. Choisissez **Search**.
4. Saisissez une query et sélectionnez un search type.
5. Choisissez un format de réponse :
   * **Results** pour obtenir des pages classées
   * **Text** pour une réponse synthétisée
   * **Structured** pour du JSON conforme à votre schema
6. Exécutez le node et transmettez son output à l&#39;étape suivante du workflow.

La search peut également renvoyer, pour chaque résultat, du texte, des highlights, des résumés, des liens et des images. Les filtres de domaine, les dates de publication, les catégories, `maxAgeHours` et l&#39;exploration des sous-pages sont disponibles dans les fields optionnels du node.

<div id="available-resources">
  ## Ressources disponibles
</div>

| Ressource    | Opérations                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search**   | Rechercher sur le web avec `auto`, `instant`, `fast`, `deep-lite`, `deep` ou `deep-reasoning`, avec synthèse et structured output en option. |
| **Contents** | Récupérer le texte nettoyé, les highlights, les résumés, les liens et les images pour une liste d&#39;URL.                                   |
| **Answer**   | Générer une réponse grounded avec citations et, en option, un structured output.                                                             |
| **Agent**    | Créer, inspecter, lister, diffuser en streaming, interroger (poll) et annuler des runs Agent multi-étapes.                                   |

<div id="use-exa-with-an-n8n-ai-agent">
  ## Utiliser Exa avec un AI Agent n8n
</div>

Connectez un node Exa à un node **AI Agent** via son entrée tool. Les parameters que le modèle doit fournir peuvent utiliser l&#39;expression `$fromAI()` de n8n :

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search et Answer conviennent parfaitement comme outils de grounding. Utilisez la ressource Agent lorsque la tâche exige une recherche en plusieurs étapes, du list building, de l&#39;enrichment structuré ou des données premium [Exa Connect](/fr/docs/agent/connect/overview).

<div id="wait-for-an-agent-run">
  ## Attendre un Agent run
</div>

Lors de la création d&#39;un Agent run, **Wait for Completion** prend en charge :

* **Stream**, pour maintenir une connexion server-sent events ouverte jusqu&#39;à la fin du run
* **Poll**, pour vérifier l&#39;état du run à intervalle régulier

Pour les workflows longs ou asynchrones, désactivez **Wait for Completion**, conservez l&#39;`id` du run renvoyé et utilisez **Get Run** plus tard. Le run se poursuit sur Exa une fois l&#39;étape n8n terminée.

<div id="troubleshooting">
  ## Dépannage
</div>

<AccordionGroup>
  <Accordion title="Le node Exa n'apparaît pas dans le sélecteur de nodes">
    Demandez au propriétaire de l&#39;instance d&#39;installer le package communautaire vérifié `n8n-nodes-exa-official`. La disponibilité des nodes communautaires peut dépendre du mode d&#39;hébergement de votre instance n8n.
  </Accordion>

  <Accordion title="La credential Exa est rejetée">
    Vérifiez que la credential sélectionnée contient une key active provenant du [dashboard Exa](https://dashboard.exa.ai/api-keys) et que cette key dispose de credits.
  </Accordion>

  <Accordion title="Un workflow Agent arrive à expiration">
    Désactivez **Wait for Completion**, conservez l&#39;`id` du run renvoyé, puis récupérez le résultat à une étape ultérieure avec **Get Run**.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

<Columns cols={3}>
  <Card title="node Exa officiel" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="Voir le repository" arrow="true">
    Consultez les opérations disponibles, la compatibilité et le code source.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/fr/docs/agent/quickstart" cta="Lire le guide" arrow="true">
    Créez des workflows de recherche et d&#39;enrichment en plusieurs étapes.
  </Card>

  <Card title="Bonnes pratiques de search" icon="search" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Rédigez de meilleures requêtes et choisissez le search mode adapté.
  </Card>
</Columns>