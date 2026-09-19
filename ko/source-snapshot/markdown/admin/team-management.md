> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="managing-your-team">
  # team 관리하기
</div>

> Exa 플랫폼의 team 구조와 계정 관리에 대한 안내

***

<Card title="API 대시보드로 이동" icon="layout-dashboard" horizontal href="https://dashboard.exa.ai">
  team을 생성하고 멤버를 초대하며 결제를 관리하세요.
</Card>

Exa는 &#39;team&#39; 단위로 계정 사용량과 유료 기능 이용 권한을 관리합니다:

계정을 생성하면 &#39;Personal&#39; team에 속하게 됩니다. 아래 그림과 같이 Exa 대시보드 좌측 상단의 드롭다운에서 새 team을 만들거나 보유한 다른 team으로 전환할 수 있습니다. team은 원하는 만큼 만들 수 있습니다.

<div id="seeing-your-teams">
  ## 내 team 확인하기
</div>

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_team_switcher.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=094d2830e671762132604cace63b423a" alt="Exa 대시보드 Team settings의 team 드롭다운(좌측 상단)" width="2954" height="1916" data-path="images/admin/team-management/dashboard_team_switcher.png" />

Exa 대시보드 Team settings의 team 드롭다운(좌측 상단)

<div id="topping-up-a-teams-balance">
  ## team 잔액 충전하기
</div>

원하는 team을 선택한 후 Billing 페이지에서 credit 잔액을 충전할 수 있습니다.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_topup.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=36f4bbbd52a71bae490be4df3ba1b500" alt="Billing page credit balance top up" width="2954" height="1916" data-path="images/admin/team-management/dashboard_topup.png" />

<div id="inviting-people-to-your-team">
  ## team에 사람 초대하기
</div>

team 관리자는 Team settings의 Invite 기능으로 멤버를 추가할 수 있습니다.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=147e5a3b3aad77d25be023b47b7aae24" alt="Team settings에서 멤버 초대하기" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite.png" />

team 멤버를 초대하면 team 관리 메뉴에 해당 멤버의 상태가 &#39;Pending&#39;으로 표시됩니다.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_pending.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=589f2e9b1543fc4048e760fee475c28e" alt="Pending 초대 상태로 표시된 team 멤버" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_pending.png" />

초대받은 사람에게는 team 참여를 요청하는 이메일이 발송됩니다.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_email.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=7d65d4f112225013af525d3114882c34" alt="team 초대 이메일" width="1094" height="1082" data-path="images/admin/team-management/dashboard_invite_email.png" />

초대가 수락되면 두 멤버 모두 &#39;Accepted&#39; 상태로 표시됩니다. 모든 team 멤버는 해당 team 플랜의 usage limits와 기능을 공유합니다.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/admin/team-management/dashboard_invite_accepted.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=15396c783df64ffee162ab2de434a045" alt="Accepted 상태가 표시된 team 멤버 목록" width="2954" height="1916" data-path="images/admin/team-management/dashboard_invite_accepted.png" />

<div id="team-management-api">
  ## Team Management API
</div>

[Team Management API](/ko/docs/reference/team-management/create-api-key)를 사용하면 API key를 프로그래밍 방식으로 생성하고 관리할 수 있습니다.

<Info>
  Team Management API는 team 단위로 활성화됩니다. 인증에는 서비스 계정 API key를 사용하며, 이 key는 해당 기능이 team에 활성화된 후 [API keys 페이지](https://dashboard.exa.ai/api-keys)의 **Service keys** 탭에서 생성할 수 있습니다. 사용을 원하시면 [support@exa.ai](mailto:support@exa.ai)로 문의해 주세요.
</Info>