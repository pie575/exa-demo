> <div id="documentation-index">
  > ## 文档索引
> </div>
>
> 获取完整文档索引：https://exa.ai/docs/llms.txt
> 在深入浏览之前，可通过该文件查看所有可用页面。

<div id="managing-your-team">
  # 管理你的团队
</div>

> 关于 Exa 平台的团队结构与账户管理详情

***

<Card title="前往 API 控制台" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  创建团队、邀请成员并管理账单。
</Card>

Exa 通过「团队」来管理账户用量和付费功能的使用权限：

账户创建后，你会自动归入一个「个人」团队。通过下图中 Exa 控制台左上角的下拉菜单，你可以创建新团队，或在已有的团队之间切换。团队数量不限，可按需创建。

<div id="seeing-your-teams">
  ## 查看你的团队
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Exa 控制台“团队设置”中的团队下拉菜单（左上角）" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Exa 控制台“团队设置”中的团队下拉菜单 (左上角)

<div id="topping-up-a-teams-balance">
  ## 为团队账户充值
</div>

选定目标团队后，你可以在 Billing 页面为账户余额充值。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Billing page credit balance top up" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## 邀请他人加入团队
</div>

团队管理员可在团队设置中通过邀请功能添加成员。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="在团队设置中邀请成员" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

成员被邀请后，其在团队管理菜单中的状态会显示为“Pending”。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="团队成员显示为待处理邀请状态" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

他们会收到一封邀请其加入团队的邮件。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="团队邀请邮件" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

邀请被接受后，你会看到两位成员的状态均为“Accepted”。所有团队成员共享所属团队套餐的用量限制与功能。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="团队成员列表显示已接受状态" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## 团队管理 API
</div>

通过[团队管理 API](/zh/docs/reference/team-management/create-api-key) 以编程方式创建和管理 API key。

<Info>
  团队管理 API 按团队单独启用。该 API 使用服务账户 API key 进行认证；为你的团队启用此功能后，即可在 [API keys 页面](https://dashboard.exa.ai/api-keys)的 **Service keys** 标签页中创建此 key。如需申请访问权限，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>