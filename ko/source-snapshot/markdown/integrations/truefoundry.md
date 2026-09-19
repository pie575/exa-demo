> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 다음 주소에서 가져오세요: https://exa.ai/docs/llms.txt
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="truefoundry">
  # TrueFoundry
</div>

> 중앙 집중식 접근 제어, 도구 관리, usage 모니터링을 위해 Exa를 TrueFoundry MCP Gateway에 연결하세요.

[TrueFoundry AI Gateway](https://truefoundry.com/ai-gateway)는 애플리케이션과 LLM 공급자 또는 MCP 서버 사이에 위치하는 엔터프라이즈급 프록시 계층입니다. 중앙 집중식 관측성과 거버넌스를 갖추고 1,000개 이상의 LLM에 대한 통합 접근을 제공합니다.

TrueFoundry는 [MCP Gateway](https://www.truefoundry.com/mcp-gateway)에서 Exa를 공식 원격 서버로 제공합니다. Exa MCP 서버를 연결하면 web search, 콘텐츠 가져오기, agentic research를 하나의 관리형 endpoint로 team에 제공할 수 있습니다.

<Frame caption="TrueFoundry 공식 원격 MCP 서버 카탈로그의 Exa">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/catalog.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=add2e6b185410cfac99d0ed9fdf56a10" alt="The Exa server in TrueFoundry's official remote MCP catalog" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1582" height="1720" data-path="images/integrations/truefoundry/catalog.png" />
</Frame>

<div id="add-exa-to-truefoundry">
  ## TrueFoundry에 Exa 추가하기
</div>

1. TrueFoundry 사이드바에서 **MCP Servers**를 열고 **Add new MCP Server**를 선택합니다.
2. **Connect Official Remote MCP Servers**를 선택합니다.

<Frame caption="공식 원격 MCP 서버 카탈로그 선택">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/add-official-remote.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=10d74f3a1f862de3a971bfe49df11ec2" alt="Connect Official Remote MCP Servers가 선택된 TrueFoundry의 Add MCP Server 선택 화면" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1572" height="1714" data-path="images/integrations/truefoundry/add-official-remote.png" />
</Frame>

3. 카탈로그에서 **Exa**를 찾아 **+ Add**를 선택합니다.
4. 미리 입력된 서버 정보를 확인합니다:

| 필드             | 값                                                                         |
| -------------- | ------------------------------------------------------------------------- |
| Name           | `exa`                                                                     |
| Description    | Search Engine made for AIs by Exa                                         |
| URL            | `https://mcp.exa.ai/mcp`                                                  |
| Authentication | 선택 사항 (MCP 서버는 인증 없이도 동작합니다. 무료 rate limit에 도달한 경우에만 Exa API key가 필요합니다.) |

5. 서버를 관리하거나 사용할 사용자 또는 team을 추가합니다. **Auth Data**는 꺼 둔 상태로 두고 **Update MCP Server**를 선택합니다.

<Frame caption="Exa 서버 및 협업자 설정">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/register-form.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=daa55b5af716a4bfad9dd61a54ab805c" alt="이름, URL, 협업자, 인증 설정이 포함된 Exa MCP 서버 등록 양식" style={{width: "600px", height: "auto", margin: "0 auto"}} width="1568" height="1718" data-path="images/integrations/truefoundry/register-form.png" />
</Frame>

<Check>
  **Tools** 탭을 열어 Exa의 search, 콘텐츠 가져오기, agentic research 도구를 사용할 수 있는지 확인하세요.
</Check>

<div id="configure-the-exa-server">
  ## Exa 서버 구성
</div>

미리 입력된 URL은 Exa의 기본 도구 모음을 노출합니다. 사용 가능한 도구를 제한하거나 직접 발급한 API key를 사용해야 하는 경우에만 변경하세요.

<div id="choose-which-tools-are-available">
  ### 사용할 도구 선택
</div>

`tools` 질의 매개변수에 쉼표로 구분된 도구 이름 목록을 전달하세요:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
```

서버 양식에 URL을 입력하거나 **Apply using YAML**을 사용할 수 있습니다:

```yaml theme={null}
url: >-
  https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_tools
name: exa
type: mcp-server/remote
description: Search Engine made for AIs by Exa
collaborators:
  - role_id: mcp-server-manager
    subject: user:you@your-company.com
```

<Tip>
  사용 가능한 도구 이름은 [Exa MCP 문서](/ko/docs/get-started/exa-mcp)에서 확인할 수 있습니다.
</Tip>

<div id="use-your-exa-api-key-to-bypass-the-free-rate-limit">
  ### Exa API key로 무료 rate limit 우회하기
</div>

무료 rate limit에 도달했다면 서버 URL에 Exa API key를 추가하세요:

```text theme={null}
https://mcp.exa.ai/mcp?exaApiKey=YOUR_API_KEY
```

<Card title="Exa API 키 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  대시보드에서 키를 생성하세요. 신규 계정에는 무료 크레딧이 제공됩니다.
</Card>

<div id="connect-an-mcp-client">
  ## MCP 클라이언트 연결하기
</div>

Exa 서버의 **How To Use** 탭을 열고 사용할 클라이언트를 선택하세요. TrueFoundry가 테넌트별 endpoint와 함께 Cursor, Claude Code, VS Code, Windsurf, Codex 등 여러 MCP 클라이언트에 바로 붙여넣을 수 있는 구성을 생성해 줍니다.

<Frame caption="사용 중인 MCP 클라이언트용 구성 복사하기">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/how-to-use.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=ec79070bbb5919f931ed52f8ae961183" alt="Exa MCP 서버에 대한 TrueFoundry의 클라이언트별 설정 안내" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2682" height="1716" data-path="images/integrations/truefoundry/how-to-use.png" />
</Frame>

<div id="test-a-tool">
  ## 도구 테스트하기
</div>

Exa 도구 옆의 **Try**를 선택해 입력값을 넣은 다음 **Execute Tool**을 선택하세요. 플레이그라운드에 JSON 응답이 표시되므로 agent에 적용하기 전에 도구를 확인할 수 있습니다.

<Frame caption="TrueFoundry 플레이그라운드에서 Exa 도구 실행하기">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tool-playground.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=6cb86026c8ea245de4a9c701f4b51b8e" alt="Testing an Exa tool in the TrueFoundry tool playground" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2118" height="1722" data-path="images/integrations/truefoundry/tool-playground.png" />
</Frame>

<div id="manage-and-monitor-tools">
  ## 도구 관리 및 모니터링
</div>

* 개별 도구를 켜고 꺼서 MCP 클라이언트가 호출할 수 있는 도구를 제어하세요
* **Tool Metrics**에서 트래픽, 지연 시간, 오류를 확인하세요
* OpenTelemetry를 통해 호출 추적 데이터를 관측 스택으로 내보내세요

<Frame caption="MCP 클라이언트에 노출되는 Exa 도구 관리">
  <img src="https://mintcdn.com/exa-52/FvOwo8C2yFgh2GuJ/images/integrations/truefoundry/tools-list.png?fit=max&auto=format&n=FvOwo8C2yFgh2GuJ&q=85&s=d0cef2a24127c7bfc0099876dee8f891" alt="TrueFoundry MCP 서버에서 사용할 수 있는 Exa 도구" style={{width: "800px", height: "auto", margin: "0 auto"}} width="2686" height="1718" data-path="images/integrations/truefoundry/tools-list.png" />
</Frame>

<div id="resources">
  ## 리소스
</div>

<Columns cols={3}>
  <Card title="TrueFoundry 설정 가이드" icon="book-open" href="https://www.truefoundry.com/docs/ai-gateway/mcp/exa-mcp-server" cta="가이드 열기" arrow="true">
    Exa MCP 서버에 대한 TrueFoundry의 가이드를 읽어보세요.
  </Card>

  <Card title="Exa MCP 문서" icon="search" href="/ko/docs/get-started/exa-mcp" cta="가이드 열기" arrow="true">
    Exa의 도구, 구성, 사용 예시를 살펴보세요.
  </Card>

  <Card title="Exa MCP 서버" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="소스 보기" arrow="true">
    GitHub에서 서버 소스와 릴리스를 확인하세요.
  </Card>
</Columns>