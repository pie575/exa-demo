> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="exa-in-codex-and-chatgpt">
  # Codex와 ChatGPT에서 Exa 사용하기
</div>

> Codex와 ChatGPT에서 바로 Exa로 웹을 검색하고, 원하는 페이지를 읽고, 리서치를 수행하세요.

Exa 플러그인을 한 번만 설치하면 Codex와 ChatGPT가 Exa를 통해 실시간 웹에 접근할 수 있습니다. 대화나 코딩 세션을 벗어나지 않고도 최신 정보를 검색하고, 중요한 출처를 읽고, 더 깊이 있는 리서치를 진행하세요.

<div id="install-exa">
  ## Exa 설치
</div>

<Steps>
  <Step title="플러그인 열기">
    [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app)로 이동하세요. OpenAI 플러그인 디렉터리의 **Exa** 페이지가 열리며, 이 디렉터리는 ChatGPT와 Codex가 함께 사용합니다.
  </Step>

  <Step title="설치하기">
    더하기 버튼을 눌러 설치하세요. 설치 중에, 또는 Codex나 ChatGPT가 처음 사용할 때 안내가 표시되면 Exa에 로그인하세요.

    <Frame caption="Codex에서 Plugins 열기, Exa 추가, 액세스 승인">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Opening Plugins in Codex, viewing the Exa plugin, and authorizing access" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="새 세션 시작하기">
    skill은 설치 이후에 시작한 채팅과 CLI 세션에서만 로드되므로, 새 세션을 열고 웹 검색이 필요한 작업을 요청해 보세요.
  </Step>
</Steps>

이것으로 설정은 끝입니다. 플러그인에 Exa의 MCP 통합과 skill이 모두 들어 있어 별도의 MCP나 skill 설정은 필요하지 않습니다.

<div id="build-with-whats-on-the-web-right-now">
  ## 지금 이 순간 웹에 있는 정보로 개발하세요
</div>

여러분이 사용하는 라이브러리, API, 도구는 매일 바뀝니다. Exa를 설치하면 Codex가 작업하는 동안 최신 문서, issue, changelog, 실제 사용 예제를 search할 수 있습니다.

리포지토리 안에서 바로:

```text theme={null}
우리는 지금 Tailwind v3를 쓰고 있어. Tailwind v4 업그레이드 가이드를 search해서 읽어 보고,
이 프로젝트를 v4로 마이그레이션해 줘.
```

Codex는 Exa로 search하고, 관련 출처를 읽고, 거기서 찾은 내용을 활용해 코드베이스를 수정할 수 있습니다.

답이 저장소 밖에 있을 법한 상황이라면 언제든 마찬가지입니다:

* &quot;이 오류를 고치기 전에 `tokio-tungstenite`의 issue와 changelog를 search해 줘.&quot;
* &quot;Rust에서 Postgres 어드바이저리 락을 사용한 실제 예시를 찾아서, 이 워커 풀에 맞는 패턴을 추천해 줘.&quot;
* &quot;최신 Stripe webhook 문서를 읽고 우리 implementation과 대조해 확인해 줘.&quot;
* &quot;이 의존성의 최신 마이그레이션 가이드를 search한 다음 업그레이드해 줘.&quot;

<div id="search-read-and-research">
  ## 검색, 읽기, 리서치
</div>

Exa 플러그인은 Codex와 ChatGPT가 웹을 활용하는 세 가지 방법을 제공합니다.

<Columns cols={3}>
  <Card title="검색" icon="search">
    자연어로 검색하고, 링크 목록이 아닌 가장 적합한 페이지의 본문 내용을 그대로 받아보세요.
  </Card>

  <Card title="읽기" icon="file-text">
    문서, changelog, issue, 블로그 글 등 지정한 페이지를 읽어옵니다.
  </Card>

  <Card title="리서치" icon="compass">
    검색 한 번으로 끝나지 않는 질문을 단계적으로 풀어가며 citations와 함께 답변합니다.
  </Card>
</Columns>

<div id="research-without-leaving-chatgpt">
  ## ChatGPT를 벗어나지 않고 리서치하기
</div>

Exa는 ChatGPT에서도 사용할 수 있습니다. 최신 정보가 필요한 질문을 던지고, 대화 안에서 Exa로 웹을 search하고 리서치해 보세요.

```text theme={null}
주요 오픈 소스 벡터 데이터베이스의 매니지드 서비스, 라이선스, 가격을
비교해 줘. 최신 1차 자료를 사용하고 출처를 인용해 줘.
```

ChatGPT는 이미 컨텍스트에 있는 정보에만 의존하지 않고, Exa를 통해 작업에 필요한 출처를 직접 찾아 읽을 수 있습니다.

경쟁사 조사, 기술 조사, 시장 지형 파악, 기업 조사 등 답이 웹 곳곳에 흩어져 있는 모든 작업에 활용해 보세요.

<div id="mcp-skills-together">
  ## MCP + skills, together
</div>

내부적으로 이 플러그인은 Exa 에이전트 스택의 두 가지 요소를 결합합니다.

[Exa MCP](/ko/docs/get-started/exa-mcp)는 Codex와 ChatGPT에 Exa를 사용할 수 있는 도구를 제공합니다. 에이전트와 Exa의 search 및 리서치 기능을 잇는 연결 고리인 셈입니다.

[Exa skills](/ko/docs/get-started/agent-skills/overview)는 웹 리서치와 [Exa Agent](/ko/docs/agent/quickstart)를 비롯한 유용한 워크플로우에서 이러한 기능을 활용하는 방법을 에이전트에게 추가 지침으로 알려줍니다.

플러그인을 설치하면 둘 중 어느 것도 따로 구성할 필요가 없습니다.

<div id="prefer-mcp-directly">
  ## MCP를 직접 사용하고 싶으신가요?
</div>

Codex와 ChatGPT에서 Exa를 사용하는 가장 권장되는 방법은 플러그인입니다. Codex를 직접 설정하거나 다른 MCP 클라이언트를 사용하는 경우에는 Exa가 호스팅하는 MCP server에 바로 연결할 수 있습니다:

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

다른 클라이언트, 구성 옵션, 사용 가능한 도구에 대해서는 [Exa MCP](/ko/docs/get-started/exa-mcp)를 참고하세요.

<Card title="ChatGPT 및 Codex용 Exa 설치" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  ChatGPT 마켓플레이스에서 Exa 플러그인을 추가하세요.
</Card>