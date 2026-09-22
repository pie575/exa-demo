> ## 文档索引 {#documentation-index}
>
> 在此获取完整的文档索引：https://exa.ai/docs/llms.txt
> 在进一步探索之前，可通过该文件了解所有可用页面。

# 管理你的团队 {#managing-your-team}

> 关于 Exa 平台的团队结构与账户管理

***

<Card title="前往 API 控制台" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  创建团队、邀请成员并管理计费。
</Card>

Exa 通过“团队”来组织账户用量和付费功能的使用权限：

创建账户后，你会被自动归入一个“Personal”团队。通过下图所示 Exa 控制台左上角的下拉菜单，你可以创建新团队，或在已有的团队之间切换。团队数量不限，可按需创建。

## 查看你的团队 {#seeing-your-teams}

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Exa 控制台 中 团队 settings 下的团队下拉菜单（左上角）" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Exa 控制台 中 团队 settings 下的团队下拉菜单 (左上角)

## 为团队充值余额 {#topping-up-a-teams-balance}

选中目标团队后，你可以在 Billing 页面为积分余额充值。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Billing 页面积分余额充值" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

## 邀请他人加入团队 {#inviting-people-to-your-team}

团队管理员可在 团队 settings 中通过 Invite 功能添加成员。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="在 团队 settings 中邀请成员" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

成员被邀请后，其在团队管理菜单中的状态会显示为 Pending。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="列表中显示邀请状态为 Pending 的团队成员" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

他们会收到一封邀请加入团队的邮件。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="团队邀请邮件" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

对方接受邀请后，你会看到两位成员的状态均为 Accepted。所有团队成员共享各自团队 plan 所提供的用量限制和功能。

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="团队成员列表显示 Accepted 状态" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

## Team Management API {#team-management-api}

使用 [Team Management API](/zh/docs/reference/team-management/create-api-key) 以编程方式创建和管理 API 密钥。

<Info>
  Team Management API 需按团队单独启用。它通过服务账号 API 密钥进行身份验证；在为你的团队启用该功能后，即可在 [API 密钥页面](https://dashboard.exa.ai/api-keys)的 **Service keys** 标签页中创建该密钥。如需申请开通，请联系 [support@exa.ai](mailto:support@exa.ai)。
</Info>