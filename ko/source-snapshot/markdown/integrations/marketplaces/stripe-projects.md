> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Stripe Projects {#stripe-projects}

> 터미널에서 Stripe Projects CLI로 Exa를 통합하세요.

[Stripe Projects](https://projects.dev)를 사용하면 여러분과 coding agent가 dashboard를 거치거나 키를 복사해 붙여넣을 필요 없이 터미널에서 서드파티 서비스를 프로비저닝할 수 있습니다. 명령어 하나로 Exa 계정을 만들고 API 키를 프로젝트에 동기화합니다.

## 사전 준비 사항 {#prerequisites}

Stripe CLI와 Projects 플러그인을 설치합니다:

```bash theme={null}
brew install stripe/stripe-cli/stripe && stripe plugin install projects
```

다른 플랫폼 및 전체 CLI 설정 방법은 [Stripe Projects](https://projects.dev)를 참고하세요.

## 시작하기 {#get-started}

프로젝트 디렉터리에서 프로젝트를 초기화하고 Exa를 추가한 뒤 credential을 가져옵니다:

```bash theme={null}
stripe projects init
stripe projects add exa/api
stripe projects env --pull
```

이제 `.env` 파일에 `EXA_API_KEY`가 들어 있습니다. [Exa SDK](/ko/docs/sdks/quickstart)와 [Quickstart](/ko/docs/search/quickstart)는 이 변수를 자동으로 읽어오므로, 코드를 수정하지 않아도 그대로 동작합니다.

<Info>
  키는 사용자가 소유한 Exa 계정에 프로비저닝됩니다. 사용량, 키, billing은 [Exa Dashboard](https://dashboard.exa.ai)에서 언제든지 관리할 수 있습니다.
</Info>

## 기존 Exa team 연결하기 {#link-an-existing-exa-team}

이미 Exa 계정이 있으신가요? 기존 team에 API 키가 프로비저닝되도록 먼저 계정을 연결하세요:

```bash theme={null}
stripe projects link exa
stripe projects add exa/api
```

`stripe projects link`를 실행하면 Exa가 열려 인증을 진행하고 team을 Stripe 계정에 연결할 수 있습니다. 연결된 Exa Dashboard는 `stripe projects open exa`로 언제든지 열 수 있습니다.

## coding agent에서 프로비저닝하기 {#provision-from-your-coding-agent}

`stripe projects init`을 실행하면 Stripe Projects [Agent Skill](https://projects.dev)이 프로젝트에 추가되며, agent(Claude Code, Cursor, Codex 등)가 대신 flow를 실행하도록 할 수 있습니다:

```text theme={null}
Stripe Projects로 Exa를 추가하고 API 키를 연결해 줘.
```

## 다음 단계 {#next-steps}

* [Quickstart](/ko/docs/search/quickstart): SDK로 첫 Exa search를 실행해 보세요.
* [Stripe Projects 문서](https://docs.stripe.com/projects): 전체 CLI reference, 환경, billing 정보를 확인하세요.
* [Exa Dashboard](https://dashboard.exa.ai): API 키, 사용량, billing을 관리하세요.
* [Provider 카탈로그](https://projects.dev): Stripe Projects의 모든 제공업체를 둘러보세요.