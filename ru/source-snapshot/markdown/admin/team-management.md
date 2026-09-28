> ## Индекс документации {#documentation-index}
>
> Полный индекс документации доступен по адресу: https://exa.ai/docs/llms.txt
> Используйте этот файл, чтобы узнать обо всех доступных страницах, прежде чем изучать документацию дальше.

# Управление командой {#managing-your-team}

> Подробности о структуре команды и управлении аккаунтом на платформе Exa

***

<Card title="Перейти в API Dashboard" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  Создавайте команды, приглашайте участников и управляйте биллингом.
</Card>

Использование аккаунта и доступ к платным возможностям в Exa организованы через «команды»:

Сразу после создания аккаунта вы попадаете в команду «Personal». Через выпадающий список в левом верхнем углу дашборда Exa (см. ниже) можно создать новую команду или переключиться на другие ваши команды. Количество команд не ограничено.

## Просмотр ваших команд {#seeing-your-teams}

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Выпадающий список команд (вверху слева) в дашборде Exa в разделе настроек команды" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Выпадающий список команд (вверху слева) в дашборде Exa в разделе настроек команды

## Пополнение баланса команды {#topping-up-a-teams-balance}

Выбрав нужную команду, вы можете пополнить баланс кредитов на странице биллинга.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Пополнение баланса кредитов на странице биллинга" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

## Приглашение людей в команду {#inviting-people-to-your-team}

Администраторы команды могут добавлять участников с помощью функции Invite в разделе настроек команды.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Приглашение участника в разделе настроек команды" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

После отправки приглашения участник будет отображаться в меню управления командой со статусом «Pending».

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Участник команды со статусом приглашения Pending" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

Он получит письмо с приглашением присоединиться к команде.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="Письмо с приглашением в команду" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

После того как приглашение принято, оба участника получат статус «Accepted». Все участники команды совместно используют лимиты и возможности тарифного плана своей команды.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Список участников команды со статусом Accepted" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

## API управления командами {#team-management-api}

Создавайте API key и управляйте ими программно через [API управления командами](/ru/docs/reference/team-management/create-api-key).

<Info>
  API управления командами включается отдельно для каждой команды. Аутентификация выполняется по API key сервисного аккаунта: его можно создать на вкладке **Service keys** на [странице API keys](https://dashboard.exa.ai/api-keys) после того, как функция будет включена для вашей команды. Чтобы запросить доступ, напишите на [support@exa.ai](mailto:support@exa.ai).
</Info>