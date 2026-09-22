> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="exa-search-skill">
  # Exa Search Skill
</div>

> Exa Search로 관련 웹 페이지를 찾고 종합된 content를 2초 이내에 받아보세요.

이 skill을 사용하면 agent가 모범 사례에 따라 cURL 또는 raw HTTP로 Exa Search를 call하도록 가르칠 수 있습니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits가 제공됩니다.
</Card>

<Note>
  agent 환경에서 키를 `EXA_API_KEY`로 설정하세요.
</Note>

<div id="setup">
  ## 설정
</div>

**옵션 A: 이 skill을 직접 설치하기:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-search"
```

**옵션 B: 다음 prompt를 coding agent에 복사해 붙여넣으세요.**

아래 prompt는 skill을 설치하고, API 키를 출력하지 않고 검증합니다:

```text Copy this setup prompt into your agent theme={null}
이 컴퓨터에 Exa exa-search agent skill을 설정해 줘.

목표:
- 내 coding agent가 cURL 또는 raw HTTP로 Exa Search를 직접 call할 수 있도록 exa-search skill을 설치할 것.
- 이 대화에 키를 노출하거나 출력하거나 붙여넣는 일 없이 Exa API key가 동작하도록 만들 것.

선택한 agent:
- Claude Code, Codex, Cursor 또는 Agent-Skills 호환 agent 중 하나
- 전역 설치 디렉터리: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / 기타)
- 프로젝트 로컬 설치 디렉터리: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / 기타)

Skill 소스:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md

수행할 작업:
1. 키 설정보다 먼저 skill부터 설치할 것. repo 안에서 작업 중이라면 프로젝트 로컬 설치를 우선하고, 그렇지 않으면 위에 나열된 해당 전역 디렉터리를 사용할 것. 선택한 skills 디렉터리를 만들고 skill을 내려받을 것:
   mkdir -p <skills-dir>/exa-search && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" -o <skills-dir>/exa-search/SKILL.md
   그런 다음 <skills-dir>/exa-search/SKILL.md 파일이 있는지 확인할 것.
2. Exa API key가 이미 사용 가능한지 네가 명령을 실행하는 환경에서 직접 확인할 것. 나에게 echo 해 달라고 요청하지 말고, skill을 실행할 때 쓸 동일한 도구/셸을 사용할 것. skill은 EXA_API_KEY를 먼저, 그다음 ~/.config/exa/key 파일에서 키를 찾으니 값을 출력하지 않고 두 곳 모두 확인할 것:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   네 셸은 비대화형일 가능성이 높아 ~/.zshrc나 ~/.bashrc 같은 대화형 프로필을 자동으로 source 하지 않으므로, 내가 거기에 설정한 키가 나에게는 있어 보여도 너에게는 비어 있을 수 있음. 둘 다 나타나지 않으면 키가 네 셸이 건너뛰는 대화형 프로필에 있을 수 있음. 값을 출력하지 말고 `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null`로 어떤 파일인지 찾을 것(이름만 나열됨. 프로필에 일반 `grep`/`cat`/`echo`를 절대 실행하지 말 것. `export EXA_API_KEY=...` 줄이 secret을 우리 대화로 유출할 수 있음). 그런 다음 명령 안에서 해당 파일을 `source` 하고 위의 존재 확인을 다시 실행할 것. 확인되면 이후 키가 필요한 모든 명령 앞에 동일한 `source ...;`를 붙일 것.
3. 어디에서도 키를 찾을 수 없을 때에만, 셸 프로필을 직접 손으로 편집하지 않고 이 대화에 키를 붙여넣지도 않는 방식으로 키를 설정할 것. https://dashboard.exa.ai/api-keys 에서 키를 만들거나 복사하라고 나에게 알려주고, 내가 직접 터미널에서 EXA_API_KEY를 export 하거나 ~/.config/exa/key 에 권한 600으로 저장하게 할 것. 키를 대화에 붙여넣으라고 절대 요청하지 말 것. 그런 다음 내가 완료했다고 확인할 때까지 기다린 뒤 진행할 것.
4. 네 셸에서 키를 스모크 테스트할 것. 환경 변수나 파일에서 키를 가져오고 상태 코드만 출력할 것:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   엔드포인트, header, body는 작성된 그대로 유지할 것(schema를 추측하지 말 것). 401/429가 아니라 200을 반환해야 함. 2단계에서 환경 변수 키를 확인하려고 `source ...;` 접두사가 필요했다면 여기에도 붙일 것.
5. skill이 인식되도록 내 agent를 재시작하거나 다시 스캔하는 방법을 알려줄 것.

전체에 적용되는 엄격한 규칙: 키는 secret임. 존재 여부나 길이 확인(`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) 또는 HTTP 상태 코드로만 확인할 것. 키가 들어 있을 수 있는 파일이나 변수는 절대 출력하거나 `echo`, `cat`, 출력이 있는 `grep`으로 다루지 말고, 정규식으로 키 파일을 "가리려고" 시도하지도 말 것. 키가 노출된 적이 있다면 https://dashboard.exa.ai/api-keys 에서 교체하라고 알려줄 것.
```

<div id="view-source">
  ## 소스 보기
</div>

<Card title="exa-search/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-search/SKILL.md" cta="소스 보기" arrow="true">
  설치하기 전에 exa-search skill 정의를 확인하세요.
</Card>

<div id="related">
  ## 관련 항목
</div>

<Columns cols={2}>
  <Card title="모든 agent skill" icon="layers" href="/ko/docs/get-started/agent-skills/overview" cta="skill 둘러보기" arrow="true">
    모든 Exa skill을 살�펴보고 한 번에 설치하세요.
  </Card>

  <Card title="Skill 리포지토리" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="소스 보기" arrow="true">
    원본 `SKILL.md` 파일을 포함한 모든 skill의 소스입니다.
  </Card>
</Columns>