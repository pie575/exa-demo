> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="gumloop">
  # Gumloop
</div>

> Utilisez Exa search et le contenu dans les flows Gumloop.

[Gumloop](https://www.gumloop.com/) intègre Exa en tant qu&#39;integration MCP native. Ajoutez-la à un agent ou à un Agent Node pour effectuer des recherches sur le web, extraire des pages, trouver des sources connexes et produire des réponses adossées à des citations au sein d&#39;un workflow.

<div id="add-exa-to-a-gumloop-agent">
  ## Ajouter Exa à un agent Gumloop
</div>

<Steps>
  <Step title="Ouvrir l'agent">
    Ouvrez la configuration de votre agent, puis sélectionnez **Add tools** → **Connect an app with MCP**.
  </Step>

  <Step title="Connecter Exa">
    Recherchez **Exa**, sélectionnez l&#39;integration, puis suivez le flux d&#39;authentification jusqu&#39;au bout.
  </Step>

  <Step title="Choisir les tools">
    Ouvrez l&#39;integration Exa connectée et activez uniquement les tools dont l&#39;agent a besoin. La sélection des outils en devient plus claire et l&#39;agent n&#39;appelle pas d&#39;actions sans rapport.
  </Step>

  <Step title="Tester la connexion">
    Demandez à l&#39;agent :

    ```text theme={null}
    Find five recent articles about AI regulation and summarize the key changes with source links.
    ```

    Examinez le run pour vérifier que l&#39;agent a bien appelé Exa et renvoyé des sources citées.
  </Step>
</Steps>

<div id="available-tools">
  ## tools disponibles
</div>

| Outil                    | À utiliser pour                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------- |
| **Search**               | Trouver des pages pertinentes via une recherche neuronale ou par mots-clés.            |
| **Get Contents**         | Extraire le texte intégral, les résumés et les métadonnées à partir d&#39;URL connues. |
| **Find Similar**         | Découvrir des pages liées à une URL source.                                            |
| **Answer**               | Générer une réponse fondée sur des preuves, avec citations.                            |
| **Create Research Task** | Lancer une recherche de plus longue durée.                                             |
| **Get Research Task**    | Récupérer le statut et le résultat d&#39;une tâche de recherche.                       |

Pour un agent conversationnel, activez d&#39;abord Search, Get Contents et Answer. N&#39;ajoutez les autres tools que si le workflow l&#39;exige.

<div id="use-exa-in-a-workflow">
  ## Utiliser Exa dans un workflow
</div>

<div id="agent-node">
  ### Agent Node
</div>

Ajoutez un **Agent Node** à un flow Gumloop déterministe et attachez-y Exa comme l&#39;un de ses tools. Le node peut décider de lancer une search, de récupérer des pages complètes ou d&#39;enchaîner plusieurs appels Exa avant de transmettre son output à l&#39;étape suivante du workflow.

Ce fonctionnement convient bien pour :

* enrichir des lignes de CRM ou de feuille de calcul avec des preuves web actuelles
* surveiller l&#39;actualité et envoyer un résumé sourcé sur Slack ou par e-mail
* rechercher des informations sur des entreprises avant d&#39;acheminer des records vers un workflow commercial
* comparer des produits et écrire le résultat dans un document

<div id="reusable-custom-mcp-node">
  ### MCP node personnalisé réutilisable
</div>

Pour une action unique et répétable, créez un node dédié :

1. Ouvrez la bibliothèque de nodes et recherchez Exa.
2. Sélectionnez **Create a node with AI**.
3. Décrivez une seule action, par exemple `Search for funding announcements from the past seven days`.
4. Testez le node généré, vérifiez ses entrées et ses outputs, puis enregistrez-le.

Utilisez un Agent Node lorsque la tâche nécessite une planification dynamique ou plusieurs tools. Utilisez un MCP node personnalisé lorsque la même opération Exa doit s&#39;exécuter de manière prévisible sur chaque item.

<div id="prompt-patterns">
  ## Modèles de prompts
</div>

<AccordionGroup>
  <Accordion title="Rechercher et résumer">
    ```text theme={null}
    Recherche les annonces officielles concernant [sujet] publiées cette semaine.
    Renvoie la date, l'éditeur, le résumé et l'URL source de chaque résultat.
    ```
  </Accordion>

  <Accordion title="Enrichir une entreprise">
    ```text theme={null}
    À partir de ce nom d'entreprise et de ce domaine, trouve la description de son produit,
    sa dernière annonce de levée de fonds et deux sources d'actualité récentes.
    ```
  </Accordion>

  <Accordion title="Lire une page connue">
    ```text theme={null}
    Récupère l'intégralité du contenu de cette URL et extrais les paliers tarifaires au format JSON.
    ```
  </Accordion>
</AccordionGroup>

<div id="troubleshooting">
  ## Dépannage
</div>

<AccordionGroup>
  <Accordion title="Exa n'est pas disponible pour l'agent">
    Rouvrez les outils MCP de l&#39;agent, vérifiez qu&#39;Exa est bien connecté et activez l&#39;outil requis. Une integration connectée peut malgré tout comporter des outils individuels désactivés.
  </Accordion>

  <Accordion title="L'agent choisit la mauvaise action">
    Indiquez explicitement dans la requête s&#39;il doit effectuer une search, lire des URL connues, trouver des pages similaires ou répondre à partir de sources. Désactivez les outils Exa dont l&#39;agent n&#39;a pas besoin pour ce workflow.
  </Accordion>

  <Accordion title="Un workflow nécessite un appel unique et prévisible">
    Remplacez l&#39;étape d&#39;agent polyvalente par un MCP node Exa personnalisé dont les entrées et la tâche sont fixes.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## Ressources
</div>

<Columns cols={3}>
  <Card title="Integration Gumloop Exa" icon="book-open" href="https://docs.gumloop.com/nodes/mcp/exa" cta="Lire le guide" arrow="true">
    Passez en revue les tools actuels de Gumloop et le workflow Agent Node.
  </Card>

  <Card title="Exa MCP server" icon="plug" href="/fr/docs/get-started/exa-mcp" cta="Lire le guide" arrow="true">
    Comprenez les tools Exa exposés via MCP.
  </Card>

  <Card title="Exa Search" icon="search" href="/fr/docs/search/quickstart" cta="Lire le guide" arrow="true">
    Apprenez à affiner vos requêtes de search et le contenu renvoyé.
  </Card>
</Columns>