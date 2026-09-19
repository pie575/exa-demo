> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="stripe-projects">
  # Stripe Projects
</div>

> 터미널에서 Stripe Projects CLI로 Exa를 연동하세요.

[Stripe Projects](https://projects.dev)를 사용하면 여러분과 coding agent가 대시보드에 접속하거나 키를 복사해 붙여넣을 필요 없이 터미널에서 서드파티 서비스를 프로비저닝할 수 있습니다. 명령어 하나로 Exa 계정이 생성되고 API 키가 프로젝트에 동기화됩니다.

<div id="prerequisites">
  ## 사전 준비 사항
</div>

Stripe CLI와 Projects 플러그인을 설치합니다:

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

다른 플랫폼 및 전체 CLI 설정 방법은 [Stripe Projects](https://projects.dev)를 참조하세요.

<div id="get-started">
  ## 시작하기
</div>

프로젝트 디렉터리에서 프로젝트를 초기화하고 Exa를 추가한 뒤 credential을 가져옵니다:

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

이제 `.env` 파일에 `EXA_API_KEY`가 들어 있습니다. [Exa SDK](/ko/docs/sdks/quickstart)와 [Quickstart](/ko/docs/search/quickstart)는 이 변수를 자동으로 읽으므로, 코드를 수정하지 않아도 그대로 동작합니다.

<Info>
  이 키는 사용자가 소유한 Exa 계정에 프로비저닝됩니다. 사용량, 키, 결제는 언제든지 [Exa Dashboard](https://dashboard.exa.ai)에서 관리할 수 있습니다.
</Info>

<div id="link-an-existing-exa-team">
  ## 기존 Exa team 연결하기
</div>

이미 Exa 계정이 있으신가요? 먼저 계정을 연결하면 기존 team에 API 키가 생성됩니다:

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link`를 실행하면 Exa가 열리며, 인증을 거쳐 team을 Stripe 계정에 연결할 수 있습니다. 연결된 Exa Dashboard는 `stripe projects open exa`로 언제든지 열 수 있습니다.

<div id="provision-from-your-coding-agent">
  ## coding agent에서 프로비저닝하기
</div>

`stripe projects init`을 실행하면 Stripe Projects [Agent Skill](https://projects.dev)이 프로젝트에 추가되어, agent(Claude Code, Cursor, Codex 등)가 이 과정을 대신 처리하도록 할 수 있습니다:

```text theme={null}
Stripe Projects로 Exa를 추가하고 API 키를 연결해 줘.
```

<div id="next-steps">
  ## 다음 단계
</div>

* [Quickstart](/ko/docs/search/quickstart): SDK로 첫 Exa search를 실행해 보세요.
* [Stripe Projects 문서](https://docs.stripe.com/projects): 전체 CLI 레퍼런스, 환경, billing 정보를 확인하세요.
* [Exa Dashboard](https://dashboard.exa.ai): API key, usage, billing을 관리하세요.
* [Provider 카탈로그](https://projects.dev): 모든 Stripe Projects provider를 둘러보세요.