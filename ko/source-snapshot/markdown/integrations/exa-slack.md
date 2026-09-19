> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="exa-in-slack">
  # Slack에서 사용하는 Exa
</div>

> Slack에 Exa를 설치하고 원하는 채널이나 thread에서 @Exa를 태그하면 출처가 포함된 리서치, 리스트 작성, enrichment 답변을 받을 수 있습니다.

team의 Slack에 Exa를 도입해 보세요. 원하는 채널이나 thread에서 **@Exa**를 태그한 뒤 리서치 질문, 리스트 작성 작업, enrichment 요청을 남기면 됩니다. Exa가 웹을 검색하고 출처를 읽은 다음, 출처가 포함된 답변을 thread에 바로 남겨줍니다.

<div id="get-started">
  ## 시작하기
</div>

<div id="installation">
  ### 설치
</div>

1. [Dashboard &gt; Management &gt; Exa in Slack](https://dashboard.exa.ai/integrations/slack)로 이동한 뒤 **Install**을 클릭합니다.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/dashboard-install.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5c4f876b2618cb7c86126aa8d7c6b8a1" alt="Install 버튼이 있는 Exa dashboard의 Exa in Slack 페이지" width="3414" height="900" data-path="images/integrations/exa-slack/dashboard-install.png" />

2. Slack의 OAuth 흐름이 열립니다. Exa를 설치할 워크스페이스를 선택한 뒤 **Allow**를 클릭합니다.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/oauth-approval.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=81e3f3a144d7edfcd599cf26ac76b332" alt="&#x22;App is not approved by Slack&#x22; 안내, 워크스페이스 선택기, 요청된 권한, Allow 버튼이 표시된 Exa app의 Slack OAuth 승인 화면" width="1820" height="1180" data-path="images/integrations/exa-slack/oauth-approval.png" />

<Note>
  빨간색 **&quot;App is not approved by Slack&quot;** 안내는 정상적으로 표시되는 것이므로 무시해도 됩니다. Exa가
  공개 Slack Marketplace에 등록되어 있지 않다는 의미일 뿐, 문제가 있다는 뜻은 아닙니다.
</Note>

3. 설치가 완료되면 채널에 @Exa를 초대하거나 직접 DM을 보내 질문을 시작하세요.

<div id="how-to-use-exa-from-slack">
  ## Slack에서 Exa 사용하기
</div>

Exa가 추가된 채널이라면 어디서든 @Exa를 멘션하고 질문하세요:

```text theme={null}
@Exa find all Series A fintech startups in SF
```

Exa가 thread에서 질문에 답변합니다.

<div id="follow-ups">
  ### 후속 질문
</div>

Exa가 thread에서 답변한 뒤에는 해당 thread에 답글만 달면 대화를 이어갈 수 있습니다. @Exa를 다시 멘션하지 않아도 됩니다. Exa가 대화 내용을 기억하므로 후속 질문은 이전 답변을 바탕으로 이어집니다. thread에 참여한 누구나 후속 질문을 할 수 있습니다.

<div id="direct-messages">
  ### 다이렉트 메시지
</div>

DM으로 Exa에게 직접 메시지를 보낼 수도 있습니다. 이때는 멘션이 전혀 필요하지 않습니다. 보내는 메시지 하나하나가 새로운 요청이 되며, 해당 메시지 아래 thread에 답변이 달립니다. 대화를 이어가려면 그 thread에 답장하세요.

<div id="cancelling-a-run">
  ### 실행 취소하기
</div>

실행이 진행 중일 때 해당 스레드에 답글을 달아 Exa에게 실행을 중단해 달라고 요청하세요. 멘션은 필요하지 않습니다.

```text theme={null}
현재 실행 중지
```

<div id="exa-connect-providers">
  ### Exa Connect 제공자
</div>

Exa는 질문과 관련이 있는 경우 [Exa Connect](/ko/docs/agent/connect/overview) 데이터 제공자를 자동으로 포함합니다. 특정 제공자를 사용하려면 메시지에 해당 제공자를 언급하세요:

```text theme={null}
@Exa find me all AI infrastructure startups that raised funding this quarter using Fiber.ai
```

사용 가능한 데이터 제공자 전체 목록은 Exa에 물어보세요.

<div id="examples">
  ## 예시
</div>

<div id="news-and-current-events">
  ### 뉴스 및 시사
</div>

어떤 주제든 최신 정보를 확인해 보세요.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/thread-answer.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9922bc4e50694de279554241b02c5e3f" alt="Slack thread에서 특정 주제의 최신 뉴스에 관한 질문에 답변하며 날짜가 표시된 결과를 표로 보여주는 Exa" width="2594" height="944" data-path="images/integrations/exa-slack/thread-answer.png" />

<div id="large-list-building">
  ### 대규모 list building
</div>

빠짐없이 list building을 하려면 요청 앞에 `!max`를 붙이세요.

<img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/exa-slack/max-list-building.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=1efbd746ac778aeac2039750e86bccb2" alt="Slack thread에서 !max list-building 요청을 실행하고 결과 표를 반환하는 Exa" width="1998" height="971" data-path="images/integrations/exa-slack/max-list-building.png" />

<div id="keywords">
  ## Keywords
</div>

Exa가 참여 중인 thread에서 사용하세요. 명령어는 `@Exa` 멘션 뒤에 붙이거나 메시지 맨 앞에
바로 입력할 수 있습니다:

| 키워드               | 기능                                                               |
| ----------------- | ---------------------------------------------------------------- |
| `!max <message>`  | 해당 요청을 최대 effort로 실행합니다. 매우 큰 목록을 만들 때 적합합니다.                    |
| `mute`            | thread에서 멘션 없이 달린 답글에 Exa가 응답하지 않도록 합니다. 명시적인 @Exa 멘션은 계속 동작합니다. |
| `unmute`          | `mute` 이후 thread follow-ups를 다시 활성화합니다.                          |
| `sleep`           | Exa가 해당 thread에서 완전히 동작하지 않도록 합니다. 다시 깨우려면 @Exa를 멘션하세요.          |
| `aside <message>` | Exa가 무시하는 참고용 댓글을 남깁니다. Exa가 지켜보는 thread에서 팀원과 대화할 때 유용합니다.      |
| `help`            | 사용 방법을 보여줍니다.                                                    |

<div id="permissions">
  ## 권한
</div>

Slack용 Exa app은 다음 scope를 요청합니다:

| 권한                     | Slack 접근 범위                  | Exa에 필요한 이유                                                  |
| ---------------------- | ---------------------------- | ------------------------------------------------------------ |
| `app_mentions:read`    | @Exa를 직접 멘션한 메시지 보기          | 채널이나 thread에서 누군가 Exa를 멘션하면 요청 시작                            |
| `assistant:write`      | Slack에서 App Agent로 동작        | Slack의 agent 환경을 사용해 direct messages와 채널 thread로 답변 스트리밍     |
| `channels:history`     | Exa가 추가된 공개 채널의 메시지 보기       | 공개 채널의 thread 답글을 수신해 다시 멘션하지 않아도 follow-ups가 동작하도록 함        |
| `channels:read`        | 공개 채널의 기본 정보 보기              | 웹 세션을 동기화할 위치를 선택할 때 이미 Exa가 추가된 공개 채널 찾기                    |
| `chat:write`           | Exa app으로 메시지 보내기            | thread 루트, 답변, 진행 상황 업데이트, 확인 메시지, 웹 동기화 메시지 게시              |
| `chat:write.customize` | app이 작성한 메시지의 이름과 아바타 사용자 지정 | 웹 앱에서 동기화된 메시지에 웹 참가자의 이름과 프로필 이미지 표시                        |
| `files:read`           | Exa가 추가된 대화에서 공유된 파일 보기      | 질문에 첨부된 파일 읽기                                                |
| `files:write`          | Exa app으로 파일 업로드, 편집, 삭제     | 내보낸 표와 같은 결과 파일을 답변에 첨부                                      |
| `groups:history`       | Exa가 추가된 비공개 채널의 메시지 보기      | 비공개 채널의 thread 답글을 수신해 다시 멘션하지 않아도 follow-ups가 동작하도록 함       |
| `groups:read`          | Exa가 추가된 비공개 채널의 기본 정보 보기    | 웹 세션 동기화 대상을 선택할 때 사용 가능한 비공개 채널을 찾고 멤버 여부 확인                |
| `im:history`           | Exa와 주고받은 direct messages 보기 | direct messages 요청과 후속 답글 수신                                 |
| `im:write`             | direct messages 시작           | 인증된 사용자가 웹 세션 동기화 대상으로 선택했을 때 해당 사용자의 Exa direct messages 열기 |
| `users:read`           | 사용자와 기본 Slack 프로필 보기         | 멘션을 이름으로 변환하고 동기화된 메시지에 웹 참가자의 Slack 프로필 이미지 사용              |
| `users:read.email`     | 워크스페이스 멤버의 이메일 주소 보기         | team 귀속과 맞춤형 웹 메시지 프로필 이미지를 위해 Slack 계정과 Exa 계정 매칭           |

<Note>
  `channels:read`, `groups:read`, `im:write`는 웹에서 Slack으로 동기화할 대상을 찾는 기능을 활성화합니다.
  기존 설치 환경은 이러한 scope 없이도 현재 Slack thread를 계속 사용할 수 있지만, 해당 대상을 사용하려면
  다시 연결해야 합니다. `chat:write.customize`는 런타임에서 선택 사항입니다. 이 권한이 없으면 웹 동기화
  메시지는 기본 Exa app 아이덴티티를 그대로 사용하며, 참가자의 이름은 메시지 본문에 표시됩니다.
</Note>

Exa는 명시적으로 초대된 채널과 자체 direct messages에서만 메시지를 수신합니다.

<div id="pricing">
  ## 요금
</div>

Slack에서 시작한 실행은 사용자의 Exa team으로 청구됩니다. 자세한 내용은 [요금제](https://exa.ai/pricing)를 참고하세요.

<div id="privacy">
  ## 개인정보 보호
</div>

Exa가 사용자의 데이터를 처리하는 방식에 대한 자세한 내용은 [Exa 개인정보 처리방침](https://exa.ai/privacy-policy)을 참조하세요.