> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일을 통해 사용 가능한 모든 페이지를 확인하세요.

# Grok Build {#grok-build}

> Grok Build에서 Exa web search를 사용하세요. Grok Build 마켓플레이스에서 Exa 플러그인을 설치하고 Exa 계정으로 로그인하면 됩니다.

Exa는 [Grok Build](https://docs.x.ai/build/overview) 마켓플레이스에서 플러그인으로 제공됩니다. 이를 통해 Grok에서 실시간 web search, 페이지 읽기, 딥 리서치 skill을 사용할 수 있습니다.

## 설치 {#installation}

<Steps>
  <Step title="Grok Build 설치">
    Grok CLI를 설치합니다(자세한 내용은 [Grok Build 문서](https://docs.x.ai/build/overview) 참고):

    ```bash theme={null}
    curl -fsSL https://x.ai/cli/install.sh | bash
    ```

    그런 다음 xAI 계정으로 로그인합니다:

    ```bash theme={null}
    grok login
    ```
  </Step>

  <Step title="마켓플레이스 열기">
    `grok`을 실행해 Grok Build를 시작한 뒤 마켓플레이스를 엽니다:

    ```text theme={null}
    /marketplace
    ```
  </Step>

  <Step title="Exa 플러그인 설치">
    목록에서 **exa**를 찾아 `i`를 눌러 설치합니다.
  </Step>

  <Step title="Exa에 로그인">
    `/mcp`로 MCP 서버 탭을 열고 **exa**를 선택한 뒤 `i`를 눌러 로그인합니다. 브라우저에서 Exa sign-in 페이지가 열립니다. 신규 계정은 가입 시 무료 credits을 받습니다.
  </Step>
</Steps>

exa가 **ready** 상태가 되면, 웹 검색이 필요한 무엇이든 Grok에게 물어보세요.

## 제공되는 기능 {#what-you-get}

* **web&#95;search&#95;exa**: 실시간 web search. 자연어 쿼리와 함께 뉴스, 기업, 인물, 연구 논문, GitHub 등의 카테고리 필터를 지원합니다.
* **web&#95;fetch&#95;exa**: 모든 URL을 읽어 페이지 콘텐츠를 깔끔한 마크다운으로 반환합니다.
* **exa-search skill**: 딥 리서치 skill입니다. Grok에게 특정 주제를 깊이 파고들어 달라고 요청하면 여러 차례 searches를 수행하고 가장 적합한 소스를 읽은 뒤 citations와 함께 답변합니다.

## 예시 prompt {#example-prompts}

* &quot;xAI에 대한 최신 뉴스를 검색해줘&quot;
* &quot;[https://exa.ai](https://exa.ai)를 읽고 요약해줘&quot;
* &quot;오픈 소스 추론 엔진에 대해 심층적으로 조사해줘&quot;