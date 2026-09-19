> <div id="documentation-index">
  > ## Index de la documentation
> </div>
>
> Récupérez l&#39;index complet de la documentation à l&#39;adresse suivante : https://exa.ai/docs/llms.txt
> Utilisez ce fichier pour découvrir toutes les pages disponibles avant d&#39;aller plus loin.

<div id="managing-your-team">
  # Gérer votre Team
</div>

> Détails sur la structure des Teams et la gestion de compte sur la plateforme Exa

***

<Card title="Accéder au Dashboard API" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  Créez des Teams, invitez des membres et gérez la facturation.
</Card>

Exa organise l&#39;utilisation du compte et l&#39;accès aux fonctionnalités payantes au moyen des « Teams » :

À la création de votre compte, vous êtes placé dans une Team « Personal ». Le menu déroulant situé en haut à gauche du dashboard Exa, illustré ci-dessous, vous permet de créer une nouvelle Team ou de passer d&#39;une Team à l&#39;autre. Vous pouvez créer autant de Teams que vous le souhaitez.

<div id="seeing-your-teams">
  ## Consulter vos teams
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Menu déroulant Team (en haut à gauche) du dashboard Exa, sous Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Menu déroulant Team (en haut à gauche) du dashboard Exa, sous Team settings

<div id="topping-up-a-teams-balance">
  ## Recharger le solde d&#39;une Team
</div>

Une fois la Team souhaitée sélectionnée, vous pouvez recharger votre solde de credits depuis la page Billing.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Rechargement du solde de credits sur la page Billing" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## Inviter des personnes dans votre team
</div>

Les administrateurs de la team peuvent ajouter des membres via la fonctionnalité Invite dans les Team settings.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Inviter un membre dans les Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

Une fois un membre invité, son status apparaît comme « Pending » dans le menu de gestion de la team.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Membre de la team affiché avec le statut d'invitation Pending" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

Il reçoit alors un e-mail l&#39;invitant à rejoindre la team.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="E-mail d'invitation à la team" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

Une fois l&#39;invitation acceptée, les deux membres s&#39;affichent avec le statut « Accepted ». Tous les membres d&#39;une Team partagent les limits d&#39;usage et les fonctionnalités du plan de leur Team respective.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Liste des membres de la team affichant le statut Accepted" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## API de gestion d&#39;équipe
</div>

Créez et gérez vos API keys par programmation avec l&#39;[API de gestion d&#39;équipe](/fr/docs/reference/team-management/create-api-key).

<Info>
  L&#39;API de gestion d&#39;équipe s&#39;active équipe par équipe. Elle s&#39;authentifie à l&#39;aide d&#39;une API key de compte de service, que vous créez depuis l&#39;onglet **Service keys** de la [page API keys](https://dashboard.exa.ai/api-keys) une fois la fonctionnalité activée pour votre équipe. Contactez [support@exa.ai](mailto:support@exa.ai) pour en demander l&#39;accès.
</Info>