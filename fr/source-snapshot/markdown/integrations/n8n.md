> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# n8n {#n8n}

> Utilisez Exa search et contenu dans vos workflows n8n.

Le [node Exa officiel pour n8n](https://github.com/exa-labs/n8n-integration) ajoute la recherche web, l&#39;extraction de contenu, les réponses fondées sur des preuves et les runs Exa Agent à vos workflows visuels. Utilisez-le comme une étape de workflow classique ou connectez-le à un AI Agent n8n en tant qu&#39;outil.

## Installer le node Exa {#install-the-exa-node}

Le nom du package est `n8n-nodes-exa-official`.

<Steps>
  <Step title="Ajouter le community node">
    Recherchez **Exa** dans le node picker de n8n. S&#39;il n&#39;est pas disponible sur votre instance, le propriétaire de celle-ci peut installer `n8n-nodes-exa-official` en suivant le [guide d&#39;installation des community nodes](https://docs.n8n.io/integrations/community-nodes/installation/) de n8n.

    Le node requiert n8n 1.60 ou une version ultérieure et Node.js 20.15 ou une version ultérieure.
  </Step>

  <Step title="Créer une API key Exa">
    <Card title="Obtenez votre API key Exa" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      Créez une clé dans le tableau de bord. Les nouveaux comptes bénéficient de crédits gratuits.
    </Card>
  </Step>

  <Step title="Ajouter les credentials Exa">
    Ajoutez un credential **Exa API** dans n8n et collez-y votre clé. Sélectionnez ce credential sur chaque node Exa devant utiliser ce compte.
  </Step>
</Steps>

## Lancer une recherche {#run-a-search}

1. Ajoutez un trigger à un workflow.
2. Ajoutez le node **Exa**.
3. Choisissez **Search**.
4. Saisissez une requête et sélectionnez un type de recherche.
5. Choisissez un format de réponse :
   * **Results** pour des pages classées
   * **Text** pour une réponse synthétisée
   * **Structured** pour du JSON conforme à votre schéma
6. Exécutez le node et transmettez son output à l&#39;étape suivante du workflow.

Search peut également renvoyer le texte, les highlights, les résumés, les liens et les images de chaque result. Les filtres de domaine, les dates de publication, les catégories, `maxAgeHours` et le crawl des sous-pages sont disponibles dans les fields optionnels du node.

## Ressources disponibles {#available-resources}

| Ressource    | Opérations                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Search**   | Rechercher sur le web avec `auto`, `instant`, `fast`, `deep-lite`, `deep` ou `deep-reasoning`, avec synthèse et sortie structurée en option. |
| **Contents** | Récupérer le texte nettoyé, les contenu, les résumés, les liens et les images pour une liste d&#39;URL.                                   |
| **Answer**   | Générer une réponse fondée sur des preuves, avec citations et sortie structurée en option.                                                   |
| **Agent**    | Créer, inspecter, lister, diffuser en flux, interroger et annuler des runs Agent en plusieurs étapes.                                        |

## Utiliser Exa avec un AI Agent n8n {#use-exa-with-an-n8n-ai-agent}

Connectez un node Exa à un node **AI Agent** via son entrée outil. Les paramètres que le modèle doit fournir peuvent utiliser l&#39;expression `$fromAI()` de n8n :

```javascript theme={null}
{{ $fromAI("query", "What should Exa search for?", "string") }}
```

Search et Answer conviennent bien comme outils de grounding. Utilisez la ressource Agent lorsque la tâche nécessite une recherche en plusieurs étapes, de la constitution de listes, de l&#39;enrichment structuré ou des données premium [Exa Connect](/fr/docs/agent/connect/overview).

## Attendre un run d&#39;Agent {#wait-for-an-agent-run}

Lors de la création d&#39;un run d&#39;Agent, **Wait for Completion** prend en charge :

* **Stream** pour maintenir une connexion server-sent events ouverte jusqu&#39;à la fin du run
* **Poll** pour vérifier l&#39;état du run à intervalle régulier

Pour les workflows longs ou asynchrones, désactivez **Wait for Completion**, enregistrez l&#39;`id` du run renvoyé, puis utilisez **Get Run** ultérieurement. Le run se poursuit sur Exa après la fin de l&#39;étape n8n.

## Dépannage {#troubleshooting}

<AccordionGroup>
  <Accordion title="Le node Exa n'apparaît pas dans le node picker">
    Demandez au propriétaire de l&#39;instance d&#39;installer le package communautaire vérifié `n8n-nodes-exa-official`. La disponibilité des nodes communautaires peut dépendre du mode d&#39;hébergement de votre instance n8n.
  </Accordion>

  <Accordion title="La credential Exa est refusée">
    Vérifiez que la credential sélectionnée contient une clé active issue du [tableau de bord Exa](https://dashboard.exa.ai/api-keys) et que cette clé dispose de crédits.
  </Accordion>

  <Accordion title="Un workflow Agent dépasse le délai d'attente">
    Désactivez **Wait for Completion**, conservez l&#39;`id` du run renvoyé, puis récupérez le résultat à une étape ultérieure avec **Get Run**.
  </Accordion>
</AccordionGroup>

## Ressources {#resources}

<Columns cols={3}>
  <Card title="Node Exa officiel" icon="github" href="https://github.com/exa-labs/n8n-integration" cta="Voir le repository" arrow="true">
    Consultez les opérations disponibles, la compatibilité et le code source.
  </Card>

  <Card title="Exa Agent" icon="sparkles" href="/fr/docs/agent/quickstart" cta="Lire le guide" arrow="true">
    Créez des workflows de recherche et d&#39;enrichment en plusieurs étapes.
  </Card>

  <Card title="Bonnes pratiques de recherche" icon="search" href="/fr/docs/search/best-practices" cta="Lire le guide" arrow="true">
    Rédigez de meilleures requêtes et choisissez le mode de recherche adapté.
  </Card>
</Columns>