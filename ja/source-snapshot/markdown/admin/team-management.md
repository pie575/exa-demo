> ## ドキュメントインデックス
>
> ドキュメントの完全なインデックスは https://exa.ai/docs/llms.txt から取得できます。
> 詳しく調べる前に、このファイルで利用可能なすべてのページを確認してください。

<div id="managing-your-team">
  # チームの管理
</div>

> Exa プラットフォームにおけるチーム構成とアカウント管理の詳細

***

<Card title="API ダッシュボードへ移動" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  チームの作成、メンバーの招待、課金の管理を行えます。
</Card>

Exa では、アカウントの使用量と有料機能へのアクセスを「チーム」単位で管理します。

アカウントを作成すると、自動的に「Personal」チームに所属します。下図の Exa ダッシュボード左上にあるドロップダウンから、新しいチームを作成したり、所属している他のチームに切り替えたりできます。チームはいくつでも作成できます。

<div id="seeing-your-teams">
  ## チームを確認する
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Exa ダッシュボードのチーム設定にあるチームのドロップダウン（左上）" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Exa ダッシュボードのチーム設定にあるチームのドロップダウン (左上)

<div id="topping-up-a-teams-balance">
  ## チームの残高をチャージする
</div>

対象のチームを選択した状態で、Billingページからクレジット残高をチャージできます。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Billingページでのクレジット残高のチャージ" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## チームへのメンバーの招待
</div>

チーム管理者は、チーム設定 の Invite 機能を使ってメンバーを追加できます。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="チーム設定 でメンバーを招待する画面" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

メンバーを招待すると、チーム管理メニューでそのメンバーのステータスが「Pending」と表示されます。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="招待ステータスが Pending のチームメンバー一覧" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

招待されたメンバーには、チームへの招待メールが届きます。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="チーム招待メール" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

招待が承諾されると、両方のメンバーのステータスが「Accepted」になります。チームメンバーは全員、所属するチームのプランの利用上限と機能を共有します。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Accepted ステータスが表示されたチームメンバー一覧" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## Team Management API
</div>

[Team Management API](/ja/docs/reference/team-management/create-api-key) を使用すると、API キーをプログラムで作成・管理できます。

<Info>
  Team Management API はチーム単位で有効化されます。認証にはサービスアカウントの API キーを使用します。このキーは、チームで機能が有効化された後に [API キーページ](https://dashboard.exa.ai/api-keys)の **Service keys** タブから作成できます。利用を希望される場合は [support@exa.ai](mailto:support@exa.ai) までお問い合わせください。
</Info>