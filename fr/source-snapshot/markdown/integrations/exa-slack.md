> ## Index de la documentation {#documentation-index}
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

# Exa in Slack {#exa-in-slack}

> Installez Exa dans Slack et taguez @Exa dans n&#39;importe quel canal ou thread pour obtenir des réponses sourcées : recherche, constitution de liste et enrichment.

Intégrez Exa au Slack de votre équipe. Taguez **@Exa** dans n&#39;importe quel canal ou thread avec une question de recherche, une tâche de constitution de liste ou une requête d&#39;enrichment. Exa parcourt le web, consulte les sources et répond dans le thread avec des réponses sourcées.

## Démarrer {#get-started}

### Installation {#installation}

1. Rendez-vous dans [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack), puis cliquez sur **Install**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="La page Exa in Slack du Exa Dashboard, avec le bouton Install" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Le flux OAuth de Slack s&#39;ouvre. Sélectionnez l&#39;espace de travail dans lequel ajouter Exa, puis cliquez sur **Allow**.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="L'écran d'approbation OAuth de Slack pour l'Exa app, affichant l'avertissement &#x22;App is not approved by Slack&#x22;, un sélecteur d'espace de travail, les autorisations demandées et le bouton Allow" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  L&#39;avertissement rouge **« App is not approved by Slack »** est normal et peut être ignoré sans risque. Il signifie
  simplement qu&#39;Exa ne figure pas dans le Slack Marketplace public, et non qu&#39;il y a un problème.
</Note>

3. Une fois l&#39;installation terminée, invitez @Exa dans un canal (ou envoyez-lui un message direct) et commencez à poser vos questions.

## Comment utiliser Exa depuis Slack {#how-to-use-exa-from-slack}

Dans n&#39;importe quel canal auquel Exa a été ajouté, mentionnez @Exa en posant votre question :

```text theme={null}
@Exa find all Series A fintech startups in SF
```

Exa répond à votre question dans le thread.

### Follow-up {#follow-ups}

Une fois qu&#39;Exa a répondu dans un thread, il suffit de répondre dans ce thread pour poursuivre la conversation. Pas besoin de mentionner @Exa à nouveau. Exa garde le contexte de la conversation : les follow-up s&#39;appuient donc sur la réponse précédente. Toute personne présente dans le thread peut envoyer un follow-up.

### Messages directs {#direct-messages}

Vous pouvez aussi écrire directement à Exa en message privé. Aucune mention n&#39;est nécessaire dans ce cas. Chaque message que vous envoyez lance une nouvelle requête, dont la réponse s&#39;affiche dans un thread sous ce message. Répondez dans le thread pour poursuivre la conversation.

### Annuler un run {#cancelling-a-run}

Tant qu&#39;un run est en cours, répondez dans le thread et demandez à Exa de l&#39;arrêter. Aucune mention n&#39;est nécessaire.

```text theme={null}
Arrête le run en cours
```

### Providers Exa Connect {#exa-connect-providers}

Exa inclut automatiquement les fournisseurs de données [Exa Connect](/fr/docs/agent/connect/overview) lorsqu&#39;ils sont pertinents pour votre question. Pour utiliser un fournisseur en particulier, mentionnez-le dans votre message :

```text theme={null}
@Exa find me all AI infrastructure startups that raised funding this quarter using Fiber.ai
```

Pour obtenir la liste de tous les fournisseurs de données disponibles, il suffit de le demander à Exa.

## Exemples {#examples}

### Actualités et événements récents {#news-and-current-events}

Obtenez les dernières informations sur n&#39;importe quel sujet.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Exa répondant à une question sur les dernières actualités d'un sujet dans un thread Slack, avec des résultats datés dans un tableau" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

### Constitution de listes volumineuses {#large-list-building}

Faites précéder la requête de `!max` pour une constitution de listes exhaustive.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Exa exécutant une requête de constitution de liste !max dans un thread Slack et renvoyant un tableau de résultats" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

## Mots-clés {#keywords}

À utiliser dans un thread où Exa est présent. Les commandes peuvent suivre une mention `@Exa` ou être placées en début de message :

| Mot-clé           | Fonction                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `!max <message>`  | Exécute cette requête avec un effort maximal, conçu pour constituer de très grandes listes.                          |
| `mute`            | Empêche Exa de répondre aux messages sans mention dans le thread. Les mentions @Exa explicites restent actives.      |
| `unmute`          | Reprend les follow-ups du thread après un `mute`.                                                                    |
| `sleep`           | Arrête totalement l&#39;activité d&#39;Exa dans le thread. Mentionnez @Exa pour le réveiller.                        |
| `aside <message>` | Publie un commentaire annexe qu&#39;Exa ignore, utile pour échanger avec vos collègues dans un thread suivi par Exa. |
| `help`            | Affiche les instructions d&#39;utilisation.                                                                          |

## Autorisations {#permissions}

L&#39;Exa app pour Slack demande les scopes suivants :

| Autorisation           | Accès Slack                                                                        | Pourquoi Exa en a besoin                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app_mentions:read`    | Voir les messages qui mentionnent directement @Exa                                 | Démarrer une requête lorsque quelqu&#39;un mentionne Exa dans un canal ou un thread                                                                       |
| `assistant:write`      | Agir comme App Agent dans Slack                                                    | Utiliser l&#39;expérience agent de Slack et diffuser les réponses en flux dans les DM et les threads de canal                                             |
| `channels:history`     | Voir les messages des canaux publics auxquels Exa a été ajouté                     | Recevoir les réponses dans les threads des canaux publics pour que les follow-up fonctionnent sans nouvelle mention                                       |
| `channels:read`        | Voir les informations de base sur les canaux publics                               | Trouver les canaux publics contenant déjà Exa au moment de choisir où synchroniser une session web                                                        |
| `chat:write`           | Envoyer des messages en tant qu&#39;Exa app                                        | Publier des messages d&#39;origine de thread, des réponses, des mises à jour de progression, des confirmations et des messages synchronisés depuis le web |
| `chat:write.customize` | Personnaliser le nom et l&#39;avatar d&#39;un message rédigé par l&#39;application | Afficher le nom et la photo de profil du participant web sur les messages synchronisés depuis l&#39;application web                                       |
| `files:read`           | Voir les fichiers partagés dans les conversations auxquelles Exa a été ajouté      | Lire les fichiers joints aux questions                                                                                                                    |
| `files:write`          | Téléverser, modifier et supprimer des fichiers en tant qu&#39;Exa app              | Joindre aux réponses des fichiers de résultats, tels que des tableaux exportés                                                                            |
| `groups:history`       | Voir les messages des canaux privés auxquels Exa a été ajouté                      | Recevoir les réponses dans les threads des canaux privés pour que les follow-up fonctionnent sans nouvelle mention                                        |
| `groups:read`          | Voir les informations de base sur les canaux privés auxquels Exa a été ajouté      | Trouver les canaux privés éligibles et vérifier l&#39;appartenance au moment de choisir une destination de synchronisation de session web                 |
| `im:history`           | Voir les messages échangés en messages directs avec Exa                            | Recevoir les requêtes en DM et les réponses de follow-up                                                                                                  |
| `im:write`             | Démarrer des messages directs                                                      | Ouvrir le DM Exa d&#39;un utilisateur vérifié lorsqu&#39;il le choisit comme destination de synchronisation de session web                                |
| `users:read`           | Voir les personnes et leurs profils Slack de base                                  | Associer les mentions à des noms et utiliser la photo de profil Slack d&#39;un participant web sur les messages synchronisés                              |
| `users:read.email`     | Voir les adresses e-mail des membres de l&#39;espace de travail                    | Faire correspondre les comptes Slack et Exa pour l&#39;attribution à l&#39;équipe et personnaliser les images de profil des messages web                  |

<Note>
  `channels:read`, `groups:read` et `im:write` permettent la découverte des destinations pour la synchronisation du web vers Slack.
  Les installations existantes peuvent continuer à utiliser leurs threads Slack actuels sans ces scopes, mais
  doivent se reconnecter avant d&#39;utiliser la destination correspondante. `chat:write.customize` est facultatif à
  l&#39;exécution : sans cette autorisation, les messages synchronisés depuis le web conservent l&#39;identité standard de l&#39;Exa app et indiquent le
  nom du participant dans le corps du message.
</Note>

Exa ne reçoit que les messages des canaux auxquels il a été explicitement invité et ceux de ses propres DM.

## Tarifs {#pricing}

Les runs lancés depuis Slack sont facturés à votre équipe Exa. Consultez la [tarification](https://exa.ai/pricing) pour plus de détails.

## Confidentialité {#privacy}

Pour savoir comment Exa traite vos données, consultez la [politique de confidentialité d&#39;Exa](https://exa.ai/privacy-policy).