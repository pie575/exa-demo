> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="enterprise-managed-auth-for-claude">
  # Claude용 Enterprise Managed Auth
</div>

> Enterprise Managed Auth(EMA)를 설정하면 Okta Cross App Access(XAA)를 비롯한 identity provider를 통해 Claude가 Exa MCP에 연결됩니다.

기본적으로 모든 member는 OAuth로 Exa에 한 번 로그인하는 방식으로 Claude에서 [Exa 커넥터](/ko/docs/get-started/exa-mcp)를 연결합니다. **Enterprise Managed Auth(EMA)**를 사용하면 대신 Okta를 통해 별도 절차 없이 연결됩니다. Exa 로그인 화면도, 동의 prompt도, 여기저기 공유되는 API 키도 필요 없습니다.

접근 권한은 디렉터리를 따릅니다. Okta에서 사용자를 프로비저닝 해제하면 Claude를 통한 해당 사용자의 Exa 접근도 함께 중단됩니다. EMA는 MCP [enterprise managed authorization 확장](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization)입니다.

<div id="before-you-start">
  ## 시작하기 전에
</div>

* identity provider가 연결된 Claude Team 또는 Enterprise organization과 이에 대한 관리자 권한.
* SSO와 directory sync가 설정된 Exa **organization**(개인 team이 아님)과 이에 대한 관리자 권한.
* identity provider로 Okta를 사용하며, Okta Identity Engine에서 [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm)가 활성화되어 있고, 해당 테넌트에 대한 Super Admin 권한. 현재 지원되는 identity provider는 Okta뿐입니다.

<div id="exa-values-youll-need">
  ## 필요한 Exa 값
</div>

| Field                   | 값                        |
| ----------------------- | ------------------------ |
| Issuer URL (Exa의 인가 서버) | `https://auth.exa.ai`    |
| Resource / MCP 서버 URL   | `https://mcp.exa.ai/mcp` |
| Scope                   | `mcp:tools`              |

<div id="set-up-ema">
  ## EMA 설정하기
</div>

<Steps>
  <Step title="Exa에 member 프로비저닝하기">
    커넥터를 사용할 모든 member는 Okta가 전달하는 이메일 주소와 동일한 주소로, 조직에서 verification을 완료한 도메인에서, 이미 Exa에 존재하고 Exa Organization 내 team에 속해 있어야 합니다. EMA는 계정을 생성하지 않습니다. directory sync를 사용하거나 [team에 초대](/ko/docs/admin/team-management)하세요.
  </Step>

  <Step title="Exa에 identity provider 등록하기">
    Exa dashboard에서 [Organization](https://dashboard.exa.ai/organization)을 열고 **Enterprise-managed auth (Claude MCP)**를 찾아 **Register identity provider**를 클릭하세요. Okta SSO / 앱 임베드 URL(`https://your-org.okta.com/app/.../sso/saml`)을 붙여넣으세요. Exa는 등록 시 해당 URL을 검증합니다.

    registration은 첫 프로비저닝된 member가 Okta를 통해 Claude에 성공적으로 연결할 때까지 **Pending verification** 상태로 유지되며, 연결되면 자동으로 **Active**로 전환됩니다. 그 외에 따로 클릭할 것은 없습니다. Exa가 대신 설정해 준 issuer는 **Managed by Exa**로 표시되며, 변경하려면 지원팀에 문의하세요. Exa가 URL을 인식하지 못하는 경우 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
  </Step>

  <Step title="Okta에서 Cross App Access 구성하기">
    [Claude EMA용 Okta Cross App Access 가이드](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide)를 따르세요. Exa의 경우:

    1. Okta Admin Console에서 Exa 애플리케이션을 열고 **Resource Server**로 이동해 XAA를 활성화한 뒤, Resource URL과 Issuer URL을 `https://auth.exa.ai`로 설정하세요. Audience/tenant ID는 비워 두세요.
    2. Exa app이 커스텀 SAML 앱이라면, Exa가 전달된 이메일을 member의 Exa 계정과 대조하므로 **Name ID Format**이 `EmailAddress`인지 확인하세요.
    3. **Directory → AI Agents**에서 Claude AI Agent를 등록하고, Anthropic에서 받은 공개 키를 추가한 뒤, Claude 앱을 위임 호출자로 추가하고, Anthropic이 제공한 Client ID를 사용해 Exa를 **Resource Connection**으로 추가하세요.
  </Step>

  <Step title="Claude에서 관리형 인가 켜기">
    Claude에서 **Organization settings → Connectors**로 이동해 Exa 커넥터를 선택하고, **Configuration** 탭에서 Managed authorization 옆의 **Set up**을 클릭하세요. IdP 연결을 확인하고 테스트를 실행한 다음, 커넥터를 상속할 role을 선택하고 저장하세요. role과 scope 옵션은 [Anthropic의 관리자 가이드](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization)를 참고하세요.
  </Step>
</Steps>

member는 다음 sign-in 시 커넥터를 사용할 수 있게 됩니다. 관리형 인가와 함께 브라우저 sign-in을 활성화된 상태로 두어도 됩니다. Claude는 관리형 인가를 먼저 시도하고, 실패하면 일반 OAuth 로그인으로 대체합니다.

<Note>
  Claude를 통한 사용량은 member의 Exa team에 해당 team의 plan과 속도 제한에 따라 청구되며, 이는 해당 team에서 실행하는 다른 모든 작업과 동일합니다.
</Note>

<div id="revoking-access">
  ## 접근 권한 취소
</div>

* **member 한 명:** Okta에서 해당 member를 제거하거나 Exa의 team에서 제거하세요. 둘 중 하나만 해도 Claude를 통한 접근이 종료됩니다.
* **전체:** Organization 페이지에서 issuer를 제거하거나 Claude에서 관리형 인가를 끄세요. 새로운 연결은 즉시 차단되고, 이미 열려 있는 세션도 잠시 후 종료됩니다. issuer는 언제든지 다시 등록할 수 있습니다.

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="일부 member에게만 작동하고 다른 member에게는 작동하지 않는 경우">
    실패하는 member를 Exa에서 확인할 수 없는 상태입니다. 해당 member가 Okta가 전달하는 이메일과 정확히 동일한 이메일로, 조직에서 검증된 도메인에 속한 상태로 Exa에 존재하는지, 그리고 해당 조직의 team에 소속되어 있는지 확인하세요. 대개 directory sync 그룹 매핑이 원인입니다.
  </Accordion>

  <Accordion title="아무에게도 작동하지 않는 경우">
    Organization 페이지에서 issuer의 상태를 확인하세요. 계속 **Pending verification** 상태라면 아직 성공한 연결이 없다는 뜻입니다. 대부분 Okta configuration이 완료되지 않았거나, Exa app의 Issuer URL이 `https://auth.exa.ai`와 일치하지 않거나, 시도한 member가 Exa에 프로비저닝되지 않은 경우입니다. 이를 해결한 뒤 프로비저닝된 member로 다시 연결하세요.
  </Accordion>

  <Accordion title="identity provider가 이미 등록되어 있다고 표시되는 경우">
    하나의 issuer는 오직 하나의 Organization에만 속합니다. Organization 페이지에 표시되지 않는다면 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
  </Accordion>
</AccordionGroup>

<Note>
  그 외의 문제는 Organization 이름, 영향을 받은 member의 이메일, 시도한 대략적인 시점을 함께 적어 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
</Note>