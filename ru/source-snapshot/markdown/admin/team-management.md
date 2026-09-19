> <div id="documentation-index">
  > ## Индекс документации
> </div>
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы получить список всех доступных страниц, прежде чем продолжить изучение.

<div id="managing-your-team">
  # Управление командой
</div>

> Сведения о структуре команд и управлении аккаунтом на платформе Exa

***

<Card title="Перейти в панель управления API" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  Создавайте команды, приглашайте участников и управляйте оплатой.
</Card>

Exa управляет использованием аккаунта и доступом к платным функциям через «Команды» (Teams):

Сразу после создания аккаунта вы оказываетесь в команде «Personal». С помощью выпадающего списка в левом верхнем углу панели управления Exa (показан ниже) можно создать новую команду или переключиться на другую из ваших команд. Количество команд не ограничено.

<div id="seeing-your-teams">
  ## Просмотр ваших команд
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Выпадающий список команд (вверху слева) в панели управления Exa в разделе настроек команды" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Выпадающий список команд (вверху слева) в панели управления Exa в разделе настроек команды

<div id="topping-up-a-teams-balance">
  ## Пополнение баланса команды
</div>

Выбрав нужную команду, вы можете пополнить баланс кредитов на странице Billing.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Пополнение баланса кредитов на странице Billing" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## Приглашение людей в команду
</div>

Администраторы команды могут добавлять участников с помощью функции Invite в настройках команды.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Приглашение участника в настройках команды" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

После отправки приглашения участник будет отображаться в меню управления командой со статусом «Pending».

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Участник команды со статусом приглашения Pending" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

Он получит письмо с приглашением присоединиться к команде.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="Письмо с приглашением в команду" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

После принятия приглашения у обоих участников появится статус «Accepted». Все участники команды используют общие лимиты и возможности тарифного плана своей команды.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Список участников команды со статусом Accepted" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## Team Management API
</div>

Создавайте API key и управляйте ими программно через [Team Management API](/ru/docs/reference/team-management/create-api-key).

<Info>
  Team Management API включается для каждой команды отдельно. Аутентификация выполняется по API key сервисного аккаунта — он создаётся на вкладке **Service keys** на [странице API keys](https://dashboard.exa.ai/api-keys) после того, как эта функция включена для вашей команды. Чтобы запросить доступ, напишите на [support@exa.ai](mailto:support@exa.ai).
</Info>