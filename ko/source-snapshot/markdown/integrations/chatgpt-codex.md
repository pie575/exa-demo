> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Codex와 ChatGPT에서 Exa 사용하기 {#exa-in-codex-and-chatgpt}

> Codex와 ChatGPT에서 바로 Exa로 웹을 검색하고, 원하는 페이지를 읽고, 리서치하세요.

Exa 플러그인을 한 번만 설치하면 Codex와 ChatGPT가 Exa를 통해 실시간 웹에 접근할 수 있습니다. 대화나 코딩 세션을 벗어나지 않고도 최신 정보를 검색하고, 꼭 필요한 소스를 읽고, 더 깊이 있는 리서치를 진행하세요.

## Exa 설치 {#install-exa}

<Steps>
  <Step title="플러그인 열기">
    [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app)로 이동하세요. OpenAI 플러그인 디렉터리의 **Exa** 페이지가 열리며, 이 디렉터리는 ChatGPT와 Codex가 공용으로 사용합니다.
  </Step>

  <Step title="설치하기">
    플러스 버튼을 눌러 설치하세요. 설치 중에, 또는 Codex나 ChatGPT가 처음 사용할 때 안내가 표시되면 Exa에 로그인하세요.

    <Frame caption="Codex에서 Plugins를 열고, Exa를 추가하고, 접근 권한을 승인하는 과정">
      <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Opening Plugins in Codex, viewing the Exa plugin, and authorizing access" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
    </Frame>
  </Step>

  <Step title="새 세션 시작하기">
    skill은 설치 이후에 시작한 채팅과 CLI 세션에서만 로드되므로, 새 세션을 열고 웹 검색이 필요한 작업을 요청해 보세요.
  </Step>
</Steps>

이것으로 끝입니다. 플러그인에 Exa의 MCP 연동과 skill이 모두 포함되어 있어 별도의 MCP나 skill 설정은 필요하지 않습니다.

## 지금 이 순간 웹에 있는 정보로 개발하세요 {#build-with-whats-on-the-web-right-now}

여러분이 사용하는 라이브러리, API, 도구는 매일 바뀝니다. Exa를 설치하면 Codex가 작업하는 동안 최신 문서, 이슈, 변경 로그, 실제 사용 예제를 검색할 수 있습니다.

repo 안에서 바로 실행하세요:

```text theme={null}
지금 Tailwind v3를 쓰고 있어. Tailwind v4 업그레이드 가이드를 search해서 읽고,
이 프로젝트를 v4로 마이그레이션해 줘.
```

Codex는 Exa로 검색하고, 관련 소스를 읽고, 찾은 내용을 바탕으로 코드베이스를 수정할 수 있습니다.

답이 repo 밖에 있을 법한 경우라면 언제든 같은 방식으로 활용할 수 있습니다:

* &quot;이 오류를 고치기 전에 `tokio-tungstenite`의 이슈와 변경 로그를 검색해 봐.&quot;
* &quot;Rust에서 Postgres advisory lock을 쓴 실제 예제를 찾아서, 이 워커 풀에 맞는 패턴을 추천해 줘.&quot;
* &quot;최신 Stripe 웹훅 문서를 읽고 우리 구현이 거기에 맞는지 확인해 줘.&quot;
* &quot;이 의존성의 최신 마이그레이션 가이드를 검색한 다음, 업그레이드해 줘.&quot;

## 검색, 읽기, 리서치 {#search-read-and-research}

Exa 플러그인은 Codex와 ChatGPT가 웹을 활용할 수 있는 세 가지 방법을 제공합니다.

<Columns cols={3}>
  <Card title="검색" icon="search">
    자연어로 검색해 링크 목록이 아닌, 가장 적합한 페이지의 content를 그대로 받아보세요.
  </Card>

  <Card title="읽기" icon="file-text">
    문서, 변경 로그, 이슈, 블로그 글 등 지정한 페이지를 읽어줍니다.
  </Card>

  <Card title="리서치" icon="compass">
    한 번의 search로는 답할 수 없는 질문을 단계적으로 풀어내고 citations와 함께 답변합니다.
  </Card>
</Columns>

## ChatGPT를 벗어나지 않고 리서치하기 {#research-without-leaving-chatgpt}

Exa는 ChatGPT에서도 동작합니다. 최신 정보가 필요한 질문을 던지고, 대화창에서 바로 Exa로 웹을 search하고 리서치해 보세요.

```text theme={null}
주요 오픈 소스 벡터 데이터베이스의 매니지드 서비스, 라이선스, 가격을
비교해 줘. 최신 1차 자료를 활용하고 출처를 인용해 줘.
```

ChatGPT는 이미 컨텍스트에 있는 정보에만 의존하지 않고, Exa를 사용해 작업에 필요한 소스를 직접 찾아 읽을 수 있습니다.

경쟁사 리서치, 기술 리서치, 시장 지형 파악, 기업 리서치 등 답이 웹 곳곳에 흩어져 있는 모든 작업에 활용하세요.

## MCP + skills, together {#mcp-skills-together}

내부적으로 이 플러그인은 Exa agent 스택의 두 가지 요소를 결합합니다.

[Exa MCP](/ko/docs/get-started/exa-mcp)는 Codex와 ChatGPT에 Exa를 사용할 수 있는 도구를 제공합니다. agent와 Exa의 search 및 리서치 기능을 이어주는 연결 고리입니다.

[Exa skills](/ko/docs/get-started/agent-skills/overview)는 웹 리서치와 [Exa Agent](/ko/docs/agent/quickstart) 등 유용한 워크플로우에서 이러한 기능을 활용하는 방법을 agent에 추가 지침으로 알려줍니다.

플러그인을 설치하면 이 두 가지를 따로 설정할 필요가 없습니다.

## MCP를 직접 사용하고 싶으신가요? {#prefer-mcp-directly}

Codex와 ChatGPT에서 Exa를 사용하는 권장 방법은 플러그인입니다. Codex를 수동으로 설정하거나 다른 MCP 클라이언트를 사용한다면, Exa가 호스팅하는 MCP 서버에 직접 연결할 수 있습니다:

```bash theme={null}
codex mcp add exa --url https://mcp.exa.ai/mcp
```

다른 client, 구성 옵션, 사용 가능한 도구는 [Exa MCP](/ko/docs/get-started/exa-mcp)를 참고하세요.

<Card title="ChatGPT 및 Codex용 Exa 설치" icon="download" horizontal href="https://chatgpt.com/plugins/exa?open_in_app">
  ChatGPT 마켓플레이스에서 Exa 플러그인을 추가하세요.
</Card>