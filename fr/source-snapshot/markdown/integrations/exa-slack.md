> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="exa-in-slack">
  # Exa dans Slack
</div>

> Installez Exa dans Slack et mentionnez @Exa dans n&#39;importe quel canal ou thread pour obtenir des réponses sourcées de recherche, de constitution de liste et d&#39;enrichment.

Amenez Exa dans le Slack de votre équipe. Mentionnez **@Exa** dans n&#39;importe quel canal ou thread avec une question de recherche, une tâche de constitution de liste ou une requête d&#39;enrichment. Exa parcourt le web, lit les sources et répond directement dans le thread avec des réponses sourcées.

<div id="get-started">
  ## Démarrage
</div>

<div id="installation">
  ### Installation
</div>

1. Rendez-vous dans [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack), puis cliquez sur **Install**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="La page Exa in Slack du Exa Dashboard, avec le bouton Install" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Le flux OAuth de Slack s&#39;ouvre. Sélectionnez l&#39;espace de travail dans lequel installer Exa, puis cliquez sur **Allow**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="L'écran d'approbation OAuth de Slack pour l'application Exa, affichant l'avertissement &#x22;App is not approved by Slack&#x22;, un sélecteur d'espace de travail, les autorisations demandées et le bouton Allow" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  L&#39;avertissement rouge **« App is not approved by Slack »** est normal et peut être ignoré sans risque. Il indique
  simplement qu&#39;Exa ne figure pas sur le Slack Marketplace public, pas qu&#39;il y a un problème.
</Note>

3. Une fois l&#39;installation terminée, invitez @Exa dans un canal (ou envoyez-lui un message privé) et posez vos questions.

<div id="how-to-use-exa-from-slack">
  ## Comment utiliser Exa depuis Slack
</div>

Dans tout canal où Exa a été ajouté, mentionnez @Exa en posant votre question :

```text theme={null}
@Exa find all Series A fintech startups in SF
```

Exa répond à votre question directement dans le thread.

<div id="follow-ups">
  ### Follow-up
</div>

Une fois qu&#39;Exa a répondu dans un thread, il suffit de répondre dans ce thread pour poursuivre la conversation. Inutile de mentionner @Exa à nouveau. Exa garde le fil de la conversation : les follow-up s&#39;appuient donc sur la réponse précédente. N&#39;importe quel participant du thread peut faire un follow-up.

<div id="direct-messages">
  ### Direct messages
</div>

Vous pouvez aussi écrire directement à Exa en message privé. Aucune mention n&#39;est nécessaire. Chaque message que vous envoyez déclenche une nouvelle requête, dont la réponse apparaît dans un thread sous ce message. Répondez dans ce thread pour poursuivre la conversation.

<div id="cancelling-a-run">
  ### Annuler un run
</div>

Pendant qu&#39;un run est en cours, répondez dans le thread et demandez à Exa de l&#39;arrêter. Aucune mention n&#39;est nécessaire.

```text theme={null}
Arrête le run en cours
```

<div id="exa-connect-providers">
  ### Providers Exa Connect
</div>

Exa inclut automatiquement les data providers [Exa Connect](/fr/docs/agent/connect/overview) lorsqu&#39;ils sont pertinents pour votre question. Pour utiliser un provider en particulier, mentionnez-le dans votre message :

```text theme={null}
@Exa trouve-moi toutes les startups d'infrastructure IA ayant levé des fonds ce trimestre, en utilisant Fiber.ai
```

Pour obtenir la liste de tous les data providers disponibles, il suffit de le demander à Exa.

<div id="examples">
  ## Exemples
</div>

<div id="news-and-current-events">
  ### Actualités et événements récents
</div>

Obtenez les dernières informations sur n&#39;importe quel sujet.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Exa répondant à une question sur les dernières actualités concernant un sujet dans un thread Slack, avec des résultats datés présentés dans un tableau" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

<div id="large-list-building">
  ### Constitution de listes volumineuses
</div>

Faites précéder la requête de `!max` pour une constitution de liste exhaustive.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Exa exécutant une requête de constitution de liste !max dans un thread Slack et renvoyant un tableau de résultats" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

<div id="keywords">
  ## Mots-clés
</div>

Utilisez-les dans un thread où Exa est présent. Les commandes peuvent suivre une mention `@Exa` ou être placées en début de message :

| Mot-clé           | Fonction                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `!max <message>`  | Exécute cette requête avec un effort maximal, conçu pour constituer de très grandes listes.                          |
| `mute`            | Empêche Exa de répondre aux messages sans mention dans le thread. Les mentions explicites @Exa restent actives.      |
| `unmute`          | Réactive les follow-ups dans le thread après un `mute`.                                                              |
| `sleep`           | Empêche totalement Exa d&#39;intervenir dans le thread. Mentionnez @Exa pour le réveiller.                           |
| `aside <message>` | Publie un commentaire annexe qu&#39;Exa ignore, utile pour échanger avec vos collègues dans un thread suivi par Exa. |
| `help`            | Affiche les instructions d&#39;utilisation.                                                                          |

<div id="permissions">
  ## Autorisations
</div>

L&#39;application Exa pour Slack demande les scopes suivants :

| Autorisation             | Accès Slack                                                                        | Pourquoi Exa en a besoin                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app_mentions:read`    | Voir les messages qui mentionnent directement @Exa                                 | Lancer une requête lorsqu&#39;une personne mentionne Exa dans un canal ou un thread                                                                       |
| `assistant:write`      | Agir en tant qu&#39;App Agent dans Slack                                           | Utiliser l&#39;expérience agent de Slack et diffuser les réponses dans les DM et les threads de canal                                                     |
| `channels:history`     | Voir les messages des canaux publics auxquels Exa a été ajouté                     | Recevoir les réponses de thread des canaux publics pour que les follow-ups fonctionnent sans nouvelle mention                                             |
| `channels:read`        | Voir les informations de base sur les canaux publics                               | Trouver les canaux publics contenant déjà Exa au moment de choisir où synchroniser une session web                                                        |
| `chat:write`           | Envoyer des messages en tant qu&#39;application Exa                                | Publier les messages d&#39;origine de thread, les réponses, les mises à jour de progression, les confirmations et les messages synchronisés depuis le web |
| `chat:write.customize` | Personnaliser le nom et l&#39;avatar d&#39;un message rédigé par l&#39;application | Afficher le nom et la photo de profil du participant web sur les messages synchronisés depuis l&#39;application web                                       |
| `files:read`           | Voir les fichiers partagés dans les conversations auxquelles Exa a été ajouté      | Lire les fichiers joints aux questions                                                                                                                    |
| `files:write`          | Téléverser, modifier et supprimer des fichiers en tant qu&#39;application Exa      | Joindre aux réponses des fichiers de résultats, comme des tables exportées                                                                                |
| `groups:history`       | Voir les messages des canaux privés auxquels Exa a été ajouté                      | Recevoir les réponses de thread des canaux privés pour que les follow-ups fonctionnent sans nouvelle mention                                              |
| `groups:read`          | Voir les informations de base sur les canaux privés auxquels Exa a été ajouté      | Trouver les canaux privés éligibles et vérifier l&#39;appartenance au moment de choisir une destination de synchronisation web                            |
| `im:history`           | Voir les messages dans les direct messages avec Exa                                | Recevoir les requêtes en DM et les réponses de follow-up                                                                                                  |
| `im:write`             | Démarrer des direct messages                                                       | Ouvrir le DM Exa d&#39;un utilisateur vérifié lorsqu&#39;il le choisit comme destination de synchronisation de session web                                |
| `users:read`           | Voir les personnes et leurs profils Slack de base                                  | Associer les mentions à des noms et utiliser la photo de profil Slack d&#39;un participant web sur les messages synchronisés                              |
| `users:read.email`     | Voir les adresses e-mail des membres de l&#39;espace de travail                    | Faire correspondre les comptes Slack et Exa pour l&#39;attribution à la team et personnaliser les photos de profil des messages web                       |

<Note>
  `channels:read`, `groups:read` et `im:write` permettent la découverte de destinations pour la synchronisation du web vers Slack.
  Les installations existantes peuvent continuer à utiliser leurs threads Slack actuels sans ces scopes, mais
  doivent se reconnecter avant d&#39;utiliser la destination correspondante. `chat:write.customize` est facultatif à
  l&#39;exécution : sans ce scope, les messages synchronisés depuis le web conservent l&#39;identité standard de l&#39;application Exa et indiquent
  le nom du participant dans le corps du message.
</Note>

Exa ne reçoit que les messages des canaux auxquels il a été explicitement invité, ainsi que ceux de ses propres DM.

<div id="pricing">
  ## Tarification
</div>

Les runs lancés depuis Slack sont facturés à votre team Exa. Consultez la page [tarification](https://exa.ai/pricing) pour plus de détails.

<div id="privacy">
  ## Confidentialité
</div>

Pour savoir comment Exa traite vos données, consultez la [politique de confidentialité d&#39;Exa](https://exa.ai/privacy-policy).