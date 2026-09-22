> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="build-with-exa-skill">
  # Build with Exa Skill
</div>

> 개발자가 Exa API 플랫폼의 어떤 기능이든 구현할 수 있도록 돕는 agent skill입니다.

이 skill로 agent에게 모범 사례에 따라 Exa API를 활용한 애플리케이션과 agent를 구축하는 방법을 가르치세요.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<Note>
  agent 환경에서 키를 `EXA_API_KEY`로 설정하세요.
</Note>

<div id="setup">
  ## 설정
</div>

**옵션 A: 이 skill을 직접 설치하기:**

```bash theme={null}
npx skills add exa-labs/agent-skills --skill "build-with-exa"
```

**옵션 B: 이 prompt를 coding agent에 복사해 넣으세요.**

다음 prompt는 skill을 설치하고, API 키를 출력하지 않고 검증합니다:

```text Copy this setup prompt into your agent theme={null}
이 머신에 Exa의 build-with-exa agent skill을 설정하세요.

목표:
- build-with-exa skill을 설치해서 내 coding agent가 Exa의 전체 API 플랫폼으로 애플리케이션과 agent를 만들 수 있게 하기.
- 이 채팅에 키를 노출하거나 출력하거나 붙여넣는 일 없이 Exa API key가 동작하도록 만들기.

선택한 agent:
- Claude Code, Codex, Cursor 또는 Agent-Skills 호환 agent
- 전역 설치 디렉터리: ~/.claude/skills (Claude Code), ~/.codex/skills (Codex), ~/.agents/skills (Cursor / 기타)
- 프로젝트 로컬 설치 디렉터리: .claude/skills (Claude Code), .agents/skills (Codex / Cursor / 기타)

Skill 소스:
- SKILL.md URL: https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md

수행할 작업:
1. 키 설정보다 먼저 skill을 설치하세요. repo 안에서 작업 중이라면 프로젝트 로컬 설치를 우선하고, 그렇지 않으면 위에 나열된 해당 전역 디렉터리를 사용하세요. 선택한 skills 디렉터리를 만들고 skill을 내려받으세요:
   mkdir -p <skills-dir>/build-with-exa && curl -fsSL "https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" -o <skills-dir>/build-with-exa/SKILL.md
   그런 다음 <skills-dir>/build-with-exa/SKILL.md 파일이 존재하는지 확인하세요.
2. 명령을 실행하는 당신 자신의 환경에서 Exa API key를 이미 사용할 수 있는지 확인하세요. 나에게 echo를 요청하지 말고, skill을 실행할 때 쓸 동일한 도구/셸을 사용하세요. skill은 EXA_API_KEY에서 먼저 키를 찾고 그다음 ~/.config/exa/key 파일에서 찾으므로, 값을 출력하지 않은 채로 둘 다 확인하세요:
   printf '%s\n' "${EXA_API_KEY:+env-set}"; [ -s ~/.config/exa/key ] && printf 'file-set\n'
   당신의 셸은 비대화형일 가능성이 높고 ~/.zshrc나 ~/.bashrc 같은 대화형 프로파일을 자동으로 source하지 않습니다. 그래서 내가 거기에 설정한 키가 나에게는 있어 보여도 당신에게는 비어 있을 수 있습니다. 둘 다 나타나지 않는다면 키가 당신의 셸이 건너뛰는 대화형 프로파일에 들어 있을 수 있습니다. `grep -l EXA_API_KEY ~/.zshrc ~/.zshenv ~/.bashrc ~/.profile ~/.config/fish/config.fish 2>/dev/null`으로 값을 출력하지 않고 어느 파일인지 찾으세요(이름만 나열됩니다. 프로파일에 일반 `grep`/`cat`/`echo`를 절대 실행하지 마세요. `export EXA_API_KEY=...` 줄이 우리 채팅으로 secret을 유출시킬 수 있습니다). 그런 다음 명령 안에서 그 파일을 `source`하고 위의 존재 여부 테스트를 다시 실행하세요. 확인되면 이후 키가 필요한 모든 명령 앞에 같은 `source ...;`를 붙이세요.
3. 어디에서도 키를 찾을 수 없을 때만, 셸 프로파일을 직접 편집하지 않고 이 채팅에 키를 붙여넣지도 않는 방식으로 키를 설정하세요. https://dashboard.exa.ai/api-keys 에서 키를 생성/복사하라고 나에게 알려주고, 내가 직접 터미널에서 EXA_API_KEY를 export하거나 600 모드로 ~/.config/exa/key에 쓰도록 하세요. 절대 채팅에 키를 붙여넣으라고 요청하지 마세요. 그런 다음 내가 완료를 확인해 줄 때까지 기다린 후 진행하세요.
4. 당신의 셸에서 키를 스모크 테스트하세요. 환경 변수나 파일에서 키를 가져오고, 상태 코드만 출력하세요:
   KEY="${EXA_API_KEY:-$(cat ~/.config/exa/key 2>/dev/null)}"
   curl -s -o /dev/null -w "%{http_code}\n" -X POST https://api.exa.ai/search \
     -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
     -d '{"query":"exa.ai","numResults":1}'
   엔드포인트, header, body는 적힌 그대로 유지하세요(schema를 추측하지 마세요). 401/429가 아니라 200을 반환해야 합니다. 2단계에서 환경 변수 키를 확인하기 위해 `source ...;` 접두사가 필요했다면 여기에도 붙이세요.
5. agent가 skill을 인식하도록 재시작하거나 다시 스캔하는 방법을 알려주세요.

전 과정에 적용되는 원칙: 키는 secret입니다. 존재/길이 확인(`${EXA_API_KEY:+set}`, `[ -s ~/.config/exa/key ]`)이나 HTTP 상태 코드로만 확인하세요. 키가 담길 수 있는 파일이나 변수를 절대 출력하거나 `echo`, `cat`, 출력이 나오는 `grep`으로 다루지 말고, 정규식으로 키 파일을 "가리려고" 시도하지도 마세요. 키가 노출되었다면 https://dashboard.exa.ai/api-keys 에서 교체하라고 알려주세요.
```

<div id="view-source">
  ## 소스 보기
</div>

<Card title="build-with-exa/SKILL.md" icon="file-code" href="https://raw.githubusercontent.com/exa-labs/agent-skills/main/skills/build-with-exa/SKILL.md" cta="소스 보기" arrow="true">
  설치하기 전에 build-with-exa skill 정의를 확인하세요.
</Card>

<div id="related">
  ## 관련 문서
</div>

<Columns cols={2}>
  <Card title="모든 agent skill" icon="layers" href="/ko/docs/get-started/agent-skills/overview" cta="skill 둘러보기" arrow="true">
    Exa의 모든 skill을 살펴보고 한 번에 설치하세요.
  </Card>

  <Card title="Skill 리포지토리" icon="git-branch" href="https://github.com/exa-labs/agent-skills" cta="소스 보기" arrow="true">
    원본 `SKILL.md` 파일을 비롯한 모든 skill의 소스입니다.
  </Card>
</Columns>