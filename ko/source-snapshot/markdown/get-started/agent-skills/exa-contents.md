> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="exa-contents-skill">
  # Exa Contents Skill
</div>

> URL을 이미 확보한 경우 Exa Contents로 페이지 콘텐츠를 추출하세요.

이 skill을 활용하면 agent가 cURL이나 raw HTTP로 모범 사례에 따라 Exa Contents를 call하도록 학습시킬 수 있습니다.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Note>
  agent 환경에서 키를 `EXA_API_KEY`로 설정하세요.
</Note>

<div id="setup">
  ## 설정
</div>

**옵션 A: 이 skill을 직접 설치:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "exa-contents"
```

**옵션 B: 아래 prompt를 coding agent에 붙여넣으세요.**

다음 prompt는 skill을 설치하고, API 키를 출력하지 않고 검증합니다:

```text Copy this setup prompt into your agent theme={null}
이 머신에 Exa exa-contents agent skill을 설정하세요.

목표:
- 내 coding agent가 cURL 또는 raw HTTP로 Exa Contents를 직접 call할 수 있도록 exa-contents skill을 설치합니다.
- 이 대화에 키를 노출하거나 출력하거나 붙여넣는 일 없이 Exa API key가 동작하도록 설정합니다.

선택한 agent:
- Claude Code, Codex, Cursor 또는 Agent-Skills 호환 agent
- 전역 설치 디렉터리: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / 기타)
- 프로젝트 로컬 설치 디렉터리: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / 기타)

Skill 소스:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md

수행할 작업:
1. 키 설정에 앞서 skill부터 설치하세요. repo 안에서 작업 중이라면 프로젝트 로컬 설치를 우선하고, 그렇지 않으면 위에 나열된 해당 전역 디렉터리를 사용하세요. 선택한 skills 디렉터리를 만들고 skill을 내려받으세요:
   mkdir -p <skills-dir>/exa-contents && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" -o <skills-dir>/exa-contents/SKILL.md
   그런 다음 <skills-dir>/exa-contents/SKILL.md 파일이 존재하는지 확인하세요.
2. 명령을 실행하는 당신의 환경에서 Exa API key를 이미 사용할 수 있는지 확인하세요. 나에게 echo를 요청하지 말고, skill을 실행할 때와 동일한 도구/셸을 사용하세요. skill은 먼저 EXA_API_KEY에서, 그다음 ~/.config/exa/key 파일에서 키를 찾으므로 값을 출력하지 않고 두 곳을 모두 점검하세요:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   당신의 셸은 비대화형일 가능성이 높아 ~/.zshrc나 ~/.bashrc 같은 대화형 프로필을 자동으로 source하지 않습니다. 따라서 내가 거기에 설정한 키가 나에게는 있는 것처럼 보여도 당신에게는 비어 있을 수 있습니다. 둘 다 잡히지 않는다면, 키가 당신의 셸이 건너뛰는 대화형 프로필에 있을 수 있습니다. 값을 출력하지 않고 어느 파일인지 찾으려면 `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null`을 사용하세요(이름만 나열됩니다. 프로필에 일반 `grep`/`cat`/`echo`를 절대 실행하지 마세요. `export EXA_API_KEY=...` 줄이 secret을 우리 대화로 유출할 수 있습니다). 그런 다음 명령 안에서 해당 파일을 `source`하고 위의 존재 여부 테스트를 다시 실행하세요. 이때 확인되면 키가 필요한 이후의 모든 명령 앞에 동일한 `source ...;`를 붙이세요.
3. 어디에서도 키를 찾을 수 없을 때만, 셸 프로필을 직접 편집하지 않고 이 대화에 키를 붙여넣지도 않는 방식으로 키를 설정하세요. https://dashboard.exa.ai/api-keys 에서 키를 생성하거나 복사하라고 나에게 안내하고, 내 터미널에서 직접 EXA_API_KEY를 export하거나 600 모드로 ~/.config/exa/key에 기록하게 하세요. 절대로 대화에 키를 붙여넣으라고 요청하지 마세요. 그런 다음 내가 완료했다고 확인해 줄 때까지 기다린 후 진행하세요.
4. 당신의 셸에서 키를 스모크 테스트하세요. 환경 변수나 파일에서 키를 가져와 상태 코드만 출력하세요:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/contents \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"urls":["https://exa.ai"],"text":true}'
   엔드포인트, header, body는 작성된 그대로 유지하세요(schema를 추측하지 마세요). 401/429가 아니라 200을 반환해야 합니다. 2단계에서 환경 변수 키를 확인하기 위해 `source ...;` 접두사가 필요했다면 여기에도 붙이세요.
5. agent가 skill을 인식하도록 재시작하거나 다시 스캔하는 방법을 알려주세요.

전 과정에 적용되는 절대 규칙: 키는 secret입니다. 존재 여부나 길이 확인(`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`) 또는 HTTP 상태 코드로만 점검하세요. 키가 들어 있을 수 있는 파일이나 변수를 절대 출력하거나 `echo`, `cat`, 출력이 있는 `grep`으로 다루지 말고, 정규식으로 키 파일을 "가리려는" 시도도 하지 마세요. 키가 노출된 경우에는 https://dashboard.exa.ai/api-keys 에서 교체하라고 알려주세요.
```

<div id="view-source">
  ## 소스 보기
</div>

<Card title="exa-contents/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/exa-contents/SKILL.md" cta="소스 보기" arrow="true">
  설치하기 전에 exa-contents skill 정의를 확인하세요.
</Card>

<div id="related">
  ## 관련 항목
</div>

<Columns cols={2}>
  <Card title="모든 agent skill" icon="layers" href="/ko/docs/get-started/agent-skills/overview" cta="skill 둘러보기" arrow="true">
    모든 Exa skill을 둘러보고 한 번에 설치하세요.
  </Card>

  <Card title="Skill 리포지토리" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="소스 보기" arrow="true">
    원본 `SKILL.md` 파일을 포함한 모든 skill의 소스입니다.
  </Card>
</Columns>