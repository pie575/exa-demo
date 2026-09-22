> <div id="documentation-index">
  > ## Índice de la documentación
> </div>
>
> Obtén el índice completo de la documentación en: https://exa.ai/docs/llms.txt
> Usa este archivo para descubrir todas las páginas disponibles antes de seguir explorando.

<div id="managing-your-team">
  # Gestionar tu equipo
</div>

> Detalles sobre la estructura de equipos y la gestión de cuentas en la plataforma Exa

***

<Card title="Ir al Dashboard de la API" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  Crea equipos, invita a miembros y gestiona la facturación.
</Card>

Exa organiza el uso de la cuenta y el acceso a las funcionalidades de pago mediante «equipos»:

Al crear tu cuenta, se te asigna a un equipo «Personal». Con el menú desplegable de la parte superior izquierda del Exa Dashboard que se muestra a continuación puedes crear un equipo nuevo o cambiar entre los demás equipos que tengas. Puedes crear tantos equipos como quieras.

<div id="seeing-your-teams">
  ## Ver tus equipos
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Menú desplegable de equipos (arriba a la izquierda) en el Exa Dashboard, dentro de Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Menú desplegable de equipos (arriba a la izquierda) en el Exa Dashboard, dentro de Team settings

<div id="topping-up-a-teams-balance">
  ## Recargar el saldo de un equipo
</div>

Una vez seleccionado el equipo que quieras, puedes recargar tu saldo de créditos en la página de facturación.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Recarga de saldo de créditos en la página de facturación" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## Invitar personas a tu equipo
</div>

Los administradores del equipo pueden añadir miembros mediante la funcionalidad Invite en Team settings.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Invitar a un miembro en Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

Cuando invitas a un miembro del equipo, su estado aparecerá como «Pending» en el menú de gestión del equipo.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Miembro del equipo con estado de invitación Pending" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

Esa persona recibirá un correo electrónico con la invitación para unirse al equipo.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="Correo de invitación al equipo" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

Una vez aceptada, verás que ambos miembros aparecen como «Accepted». Todos los miembros del equipo comparten los límites de uso y las funcionalidades del plan de su respectivo equipo.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Lista de miembros del equipo mostrando el estado Accepted" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## Team Management API
</div>

Crea y gestiona API keys de forma programática con la [Team Management API](/es/docs/reference/team-management/create-api-key).

<Info>
  La Team Management API se habilita por equipo. Se autentica con una API key de cuenta de servicio, que se crea desde la pestaña **Service keys** de la [página de API keys](https://dashboard.exa.ai/api-keys) una vez que la funcionalidad esté habilitada para tu equipo. Escribe a [support@exa.ai](mailto:support@exa.ai) para solicitar acceso.
</Info>