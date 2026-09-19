> ## Documentation Index
> Fetch the complete documentation index at: https://exa.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Managing Your Team

> Details on Team structure and account management for the Exa platform

***

<Card title="Go to API Dashboard" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  Create teams, invite members, and manage billing.
</Card>

Exa organizes account usage and paid feature access through 'Teams':

Upon account creation, you're placed in a 'Personal' Team. You can use the dropdown in the top-left of the Exa dashboard shown below to create a new Team or select between other Teams you have. You can make as many Teams as you like.

## Seeing your teams

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Team dropdown (top-left) within the Exa dashboard under Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Team dropdown (top-left) within the Exa dashboard under Team settings

## Topping up a Team's balance

With the desired Team selected, you can top up your credit balance in the Billing page.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Billing page credit balance top up" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

## Inviting people to your team

Team admins can add members via the Invite feature in Team settings.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Inviting a member in Team settings" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

Once a team member is invited, their status will be 'Pending' on the team management menu.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Team member listed with Pending invite status" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

They will receive an email inviting them to join the team.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="Team invitation email" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

Once accepted, you'll see both members are 'Accepted'. All Team members share the usage limits and features of their respective Team's plan.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Team members list showing Accepted status" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

## Team Management API

Create and manage API keys programmatically with the [Team Management API](/docs/reference/team-management/create-api-key).

<Info>
  The Team Management API is enabled per team. It authenticates with a service account API key, which is created from the **Service keys** tab on the [API keys page](https://dashboard.exa.ai/api-keys) once the feature is enabled for your team. Contact [support@exa.ai](mailto:support@exa.ai) to request access.
</Info>
