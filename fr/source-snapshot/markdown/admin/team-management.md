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

Dès la création de votre compte, vous êtes placé dans une Team « Personal ». Le menu déroulant en haut à gauche du tableau de bord Exa, illustré ci-dessous, vous permet de créer une nouvelle Team ou de passer d&#39;une Team à l&#39;autre. Vous pouvez créer autant de Teams que vous le souhaitez.

<div id="seeing-your-teams">
  ## Consulter vos équipes
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Menu déroulant des équipes (en haut à gauche) dans l'Exa Dashboard, sous Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Menu déroulant des équipes (en haut à gauche) dans l&#39;Exa Dashboard, sous Team settings

<div id="topping-up-a-teams-balance">
  ## Recharger le solde d&#39;une Team
</div>

Une fois la Team souhaitée sélectionnée, vous pouvez recharger votre solde de crédits depuis la page Billing.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Rechargement du solde de crédits sur la page Billing" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## Inviter des personnes dans votre équipe
</div>

Les administrateurs de l&#39;équipe peuvent ajouter des membres via la fonctionnalité Invite dans Team settings.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Inviter un membre dans Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

Une fois un membre invité, son statut passe à « Pending » dans le menu de gestion de l&#39;équipe.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Membre de l'équipe affiché avec le statut d'invitation Pending" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

Il reçoit alors un e-mail l&#39;invitant à rejoindre l&#39;équipe.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="E-mail d'invitation à l'équipe" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

Une fois l&#39;invitation acceptée, les deux membres affichent le statut « Accepted ». Tous les membres d&#39;une Team partagent les limites d&#39;utilisation et les fonctionnalités du plan de leur Team.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Liste des membres de l'équipe affichant le statut Accepted" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## Team Management API
</div>

Créez et gérez vos API keys par programmation avec la [Team Management API](/fr/docs/reference/team-management/create-api-key).

<Info>
  La Team Management API s&#39;active équipe par équipe. Elle s&#39;authentifie avec une API key de compte de service, créée depuis l&#39;onglet **Service keys** de la [page API keys](https://dashboard.exa.ai/api-keys) une fois la fonctionnalité activée pour votre équipe. Contactez [support@exa.ai](mailto:support@exa.ai) pour en demander l&#39;accès.
</Info>