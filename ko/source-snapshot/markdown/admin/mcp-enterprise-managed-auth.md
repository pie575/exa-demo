> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="enterprise-managed-auth-for-claude">
  # Claude용 Enterprise Managed Auth
</div>

> Enterprise Managed Auth(EMA)를 설정하여 Okta Cross App Access(XAA)를 비롯한 identity provider를 통해 Claude가 Exa MCP에 연결되도록 합니다.

기본적으로 각 구성원은 OAuth로 Exa에 한 번 로그인하여 Claude에서 [Exa 커넥터](/ko/docs/get-started/exa-mcp)를 연결합니다. **Enterprise Managed Auth(EMA)**를 사용하면 Exa 로그인 화면도, 동의 prompt도, API key를 주고받는 절차도 없이 Okta를 통해 자동으로 연결됩니다.

접근 권한은 디렉터리를 따릅니다. Okta에서 특정 사용자의 프로비저닝을 해제하면 Claude를 통한 해당 사용자의 Exa 접근도 함께 차단됩니다. EMA는 MCP의 [enterprise managed authorization 확장](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization)입니다.

<div id="before-you-start">
  ## 시작하기 전에
</div>

* identity provider가 연결된 Claude Team 또는 Enterprise 조직 및 해당 조직의 관리자 권한.
* SSO와 디렉터리 동기화가 구성된 Exa **조직**(개인 team이 아님) 및 해당 조직의 관리자 권한.
* [Cross App Access (XAA)](https://help.okta.com/en-us/content/topics/apps/apps-cross-app-access.htm)가 활성화된 Okta Identity Engine 기반 Okta를 identity provider로 사용하고, 해당 테넌트의 Super Admin 권한 보유. 현재 지원되는 identity provider는 Okta뿐입니다.

<div id="exa-values-youll-need">
  ## 필요한 Exa 값
</div>

| 필드                      | 값                        |
| ----------------------- | ------------------------ |
| Issuer URL (Exa의 인증 서버) | `https://auth.exa.ai`    |
| 리소스 / MCP 서버 URL        | `https://mcp.exa.ai/mcp` |
| Scope                   | `mcp:tools`              |

<div id="set-up-ema">
  ## EMA 설정
</div>

<Steps>
  <Step title="Exa에서 멤버 프로비저닝하기">
    커넥터를 사용할 모든 멤버는 이미 Exa에 존재해야 하며, Okta가 어서션하는 것과 동일한 이메일 주소로, 조직에서 검증된 도메인을 사용해 Exa 조직 내 team에 속해 있어야 합니다. EMA는 계정을 생성하지 않습니다. 디렉터리 동기화를 사용하거나 [team에 초대](/ko/docs/admin/team-management)하세요.
  </Step>

  <Step title="Exa에 identity provider 등록하기">
    Exa dashboard에서 [Organization](https://dashboard.exa.ai/organization)을 열고 **Enterprise-managed auth (Claude MCP)**를 찾아 **Register identity provider**를 클릭합니다. Okta SSO / 앱 임베드 URL(`https://your-org.okta.com/app/.../sso/saml`)을 붙여넣습니다. Exa는 등록 시 해당 URL을 검증합니다.

    등록 상태는 첫 번째 프로비저닝된 멤버가 Okta를 통해 Claude에 성공적으로 연결할 때까지 **Pending verification**으로 유지되다가, 연결이 완료되면 자동으로 **Active**로 전환됩니다. 따로 클릭할 것은 없습니다. Exa가 대신 설정해 준 issuer는 **Managed by Exa**로 표시되며, 변경하려면 지원팀에 문의하세요. Exa가 URL을 인식하지 못하는 경우 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
  </Step>

  <Step title="Okta에서 Cross App Access 구성하기">
    [Claude EMA용 Okta Cross App Access 가이드](https://support.okta.com/help/s/article/claude-enterprise-managed-auth-with-okta-cross-app-access-xaa-beta-participation-guide)를 따르세요. Exa의 경우:

    1. Okta Admin Console에서 Exa 애플리케이션을 열고 **Resource Server**로 이동해 XAA를 활성화한 뒤, Resource URL과 Issuer URL을 `https://auth.exa.ai`로 설정합니다. Audience/tenant ID는 비워 둡니다.
    2. Exa 앱이 커스텀 SAML 앱이라면 **Name ID Format**이 `EmailAddress`인지 확인하세요. Exa는 어서션된 이메일을 멤버의 Exa 계정과 매칭합니다.
    3. **Directory → AI Agents**에서 Claude AI Agent를 등록하고, Anthropic에서 받은 공개 키를 추가하고, Claude 앱을 위임 호출자로 추가한 뒤, Anthropic이 제공한 Client ID를 사용해 Exa를 **Resource Connection**으로 추가합니다.
  </Step>

  <Step title="Claude에서 관리형 인가 켜기">
    Claude에서 **Organization settings → Connectors**로 이동해 Exa 커넥터를 선택하고, **Configuration** 탭에서 Managed authorization 옆의 **Set up**을 클릭합니다. IdP 연결을 확인하고, 테스트를 실행하고, 커넥터를 상속할 역할을 선택한 뒤 저장합니다. 역할과 scope 옵션은 [Anthropic의 관리자 가이드](https://support.claude.com/en/articles/15537633-authorize-mcp-connectors-for-your-entire-organization)를 참고하세요.
  </Step>
</Steps>

멤버는 다음 로그인 시점부터 커넥터를 사용할 수 있습니다. 관리형 인가와 함께 브라우저 로그인을 계속 활성화해 두어도 됩니다. Claude는 관리형 인가를 먼저 시도하고, 실패하면 일반 OAuth 로그인으로 대체합니다.

<Note>
  Claude를 통한 usage는 멤버의 Exa team에 청구되며, 해당 team에서 실행하는 다른 작업과 동일하게 그 team의 플랜과 rate limits가 적용됩니다.
</Note>

<div id="revoking-access">
  ## 접근 권한 취소
</div>

* **특정 멤버:** Okta에서 해당 멤버를 제거하거나, Exa의 team에서 제거하세요. 둘 중 하나만 해도 Claude를 통한 접근이 종료됩니다.
* **전체:** Organization 페이지에서 issuer를 제거하거나, Claude에서 관리형 인가를 끄세요. 새 연결은 즉시 차단되고, 이미 열려 있는 세션도 곧 종료됩니다. issuer는 언제든 다시 등록할 수 있습니다.

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="일부 멤버에게만 작동하고 나머지는 작동하지 않습니다">
    해당 멤버를 Exa에서 식별하지 못하는 경우입니다. Okta가 전달하는 이메일과 정확히 동일한 이메일로 해당 멤버가 Exa에 존재하는지, 그 이메일 도메인이 조직에서 검증된 도메인인지, 그리고 해당 조직의 team에 속해 있는지 확인하세요. 대개 디렉터리 동기화 그룹 매핑이 원인입니다.
  </Accordion>

  <Accordion title="누구에게도 작동하지 않습니다">
    조직 페이지에서 issuer 상태를 확인하세요. 여전히 **Pending verification**이라면 아직 연결에 성공한 적이 없다는 뜻입니다. 보통 Okta configuration이 완료되지 않았거나, Exa app의 Issuer URL이 `https://auth.exa.ai`와 일치하지 않거나, 시도한 멤버가 Exa에 프로비저닝되지 않은 경우입니다. 이를 해결한 뒤 프로비저닝된 멤버로 다시 연결하세요.
  </Accordion>

  <Accordion title="등록 시 identity provider가 이미 등록되어 있다고 표시됩니다">
    하나의 issuer는 오직 하나의 Exa 조직에만 속합니다. 조직 페이지에 표시되지 않는다면 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
  </Accordion>
</AccordionGroup>

<Note>
  그 밖의 문제는 Exa 조직 이름, 영향을 받은 멤버의 이메일, 시도한 대략적인 시각을 포함해 [support@exa.ai](mailto:support@exa.ai)로 문의하세요.
</Note>