> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="agent-skills">
  # Agent Skills
</div>

> Claude Code, Codex를 비롯한 coding agent에 Exa skill을 설치하세요.

Exa skill은 coding agent가 Exa API로 검색하고, 콘텐츠를 가져오고, 애플리케이션을 개발하는 방법을 익히도록 도와줍니다. 오픈소스 [exa-labs/agent-skills](https://github.com/exa-labs/agent-skills) 리포지토리에서 확인할 수 있습니다.

각 skill은 공개 [Agent Skills](https://agentskills.io) 표준을 따르는 마크다운 파일로 구성되어 있어, 동일한 파일을 호환되는 모든 agent에 그대로 설치할 수 있습니다.

<div id="install">
  ## 설치
</div>

모든 Exa skill을 한 번에 설치합니다:

```bash theme={null}
npx skills add exa-labs/agent-skills
```

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Note>
  agent 환경에서 키를 `EXA_API_KEY`로 설정하세요.
</Note>

또는 아래 skill 페이지를 열어 해당 setup prompt를 복사한 뒤 agent에 붙여넣으세요. 이 prompt는 해당 skill을 설치하고, API 키를 출력하지 않고 검증합니다.

<div id="skills">
  ## Skills
</div>

각 skill 페이지에는 한 줄 설명, 복사해서 사용할 수 있는 setup prompt, 그리고 원본 `SKILL.md` 소스 링크가 포함되어 있습니다.

<Columns cols={3}>
  <Card title="Exa로 개발하기" icon="rocket" href="/ko/docs/get-started/agent-skills/build-with-exa" cta="skill 열기" arrow="true">
    Exa의 전체 API 플랫폼으로 애플리케이션과 agent를 개발하세요.
  </Card>

  <Card title="Exa Search" icon="search" href="/ko/docs/get-started/agent-skills/exa-search" cta="skill 열기" arrow="true">
    cURL 또는 raw HTTP로 Exa Search를 직접 call하세요.
  </Card>

  <Card title="Exa Contents" icon="file-text" href="/ko/docs/get-started/agent-skills/exa-contents" cta="skill 열기" arrow="true">
    cURL 또는 raw HTTP로 Exa Contents를 직접 call하세요.
  </Card>
</Columns>

<div id="related">
  ## 관련 자료
</div>

<Columns cols={2}>
  <Card title="Skill 리포지토리" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="소스 보기" arrow="true">
    원본 `SKILL.md` 파일을 비롯한 모든 skill의 소스입니다.
  </Card>

  <Card title="Exa MCP" icon="plug" href="/ko/docs/get-started/exa-mcp" cta="가이드 열기" arrow="true">
    Claude, Cursor, VS Code 등 다양한 client를 MCP를 통해 Exa에 연결하세요.
  </Card>
</Columns>