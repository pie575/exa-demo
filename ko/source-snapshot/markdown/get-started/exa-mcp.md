> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="exa-mcp">
  # Exa MCP
</div>

> ChatGPT, Codex, Claude, Grok, Cursor를 비롯한 모든 MCP 클라이언트를 Exa의 web search, 페이지 가져오기, Exa Agent, Exa Connect 도구에 연결하세요.

Exa MCP를 사용하면 ChatGPT, Claude를 비롯한 MCP 호환 도구에 내장된 web search를 web search, 코드 검색, [Exa Agent](/ko/docs/agent/quickstart), [Exa Connect](/ko/docs/agent/connect/overview) 등 Exa의 search 기능으로 강화할 수 있습니다.

Exa는 모든 MCP 클라이언트에서 사용할 수 있는 호스팅 서버를 제공합니다:

```text theme={null}
https://mcp.exa.ai/mcp
```

시작하는 데 API key는 필요하지 않습니다. Exa MCP는 오픈 소스이며 [GitHub](https://github.com/exa-labs/exa-mcp-server)에서 확인할 수 있습니다.

<div id="install">
  ## 설치
</div>

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT & Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa는 OpenAI 플러그인 디렉터리에 등록된 공식 플러그인으로, 호스팅형 MCP 서버와 Exa의 `search` 및 `exa-agent` skill을 함께 제공합니다.

      <Steps>
        <Step title="플러그인 열기">
          [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app)로 이동하세요. OpenAI 플러그인 디렉터리에서 **Exa**가 열리며, 이 디렉터리는 ChatGPT와 Codex에서 동일하게 사용됩니다.
        </Step>

        <Step title="설치하기">
          더하기 버튼을 선택해 설치하세요. 설치 중이나 Codex 또는 ChatGPT에서 처음 사용할 때 로그인 안내가 표시되면 Exa에 로그인하세요.

          <Frame caption="Codex에서 Plugins 열기, Exa 추가, 액세스 승인">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Codex에서 Plugins 열기, Exa 플러그인 확인, 액세스 승인" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="새 세션 시작하기">
          skill은 설치 이후에 시작된 채팅과 CLI 세션에서 로드되므로, 새 세션을 열고 웹 검색이 필요한 작업을 요청해 보세요.
        </Step>
      </Steps>

      이것으로 설정이 끝났습니다. 이 플러그인에는 Exa의 MCP 통합과 skill이 모두 포함되어 있어 별도의 MCP나 skill 설정이 필요하지 않습니다.

      전체 설정 및 workflow 가이드는 [Codex와 ChatGPT에서 Exa 사용하기](/ko/docs/integrations/chatgpt-codex)를 참고하세요.
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
      <div id="claude-code-cli">
        ### Claude Code CLI
      </div>

      <Steps>
        <Step title="플러그인 설치">
          터미널에서 Exa를 설치합니다:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Claude Code에서 `/plugin`을 입력한 뒤 **Exa**를 검색해 설치할 수도 있습니다.
        </Step>

        <Step title="Exa 사용">
          새 Claude Code 세션을 시작한 뒤 웹 정보가 필요한 질문을 해보세요.
        </Step>
      </Steps>

      <div id="desktop-web-cowork">
        ### Desktop, Web &amp; Cowork
      </div>

      Claude Desktop, Web, Cowork는 모두 Exa의 공식 커넥터를 사용합니다.

      <Steps>
        <Step title="커넥터 디렉터리 열기">
          새 채팅에서 더하기 버튼을 선택하고 **Add connector**를 고른 뒤 **Exa**를 검색합니다.
        </Step>

        <Step title="Exa 연결">
          Exa를 열고 **Connect to Claude**를 선택한 다음, 요청이 표시되면 액세스를 승인합니다.

          <Frame caption="Claude에서 커넥터 디렉터리를 열고 Exa를 찾아 연결한 뒤 액세스를 승인하는 과정">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Claude에서 커넥터 디렉터리를 열고 Exa를 찾아 연결한 뒤 액세스를 승인하는 과정" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Exa 사용">
          새 채팅을 시작한 뒤 웹의 최신 정보가 필요한 질문을 해보세요.
        </Step>
      </Steps>

      전체 설정 및 workflow 가이드는 [Claude Code, Web, Desktop에서의 Exa](/ko/docs/integrations/claude-web-desktop)를 참고하세요.

      Claude Team 및 Enterprise 관리자는 identity provider를 통해 구성원 전체에게 커넥터를 프로비저닝할 수도 있습니다. 자세한 내용은 [Enterprise Managed Auth](/ko/docs/admin/mcp-enterprise-managed-auth)를 참고하세요.
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa는 [Grok Build](https://docs.x.ai/build/overview) marketplace에서 사용할 수 있습니다.

      <Steps>
        <Step title="marketplace 열기">
          Grok Build에서 `/marketplace`를 실행하세요.
        </Step>

        <Step title="Exa 설치">
          목록에서 **exa**를 찾아 `i`를 누르세요.
        </Step>

        <Step title="로그인">
          `/mcp`를 실행하고 **exa**를 선택한 뒤 `i`를 눌러 브라우저에서 Exa 계정에 로그인하세요.
        </Step>
      </Steps>

      신규 계정은 가입 시 무료 credits을 받습니다.
    </Tab>

    <Tab title="Cursor" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      [Cursor 마켓플레이스](https://cursor.com/marketplace/exa)에서 Exa MCP를 설치하거나, `~/.cursor/mcp.json`에 직접 추가하세요:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="VS Code" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/vscode.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=9828a7b963d47467df217a38c716fea2" width="24" height="24" data-path="images/mcp-clients/vscode.svg">
      [원클릭 설치](https://vscode.dev/redirect/mcp/install?name=exa\&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fmcp.exa.ai%2Fmcp%22%7D)를 사용하거나, 프로젝트의 `.vscode/mcp.json`에 다음을 추가하세요:

      ```json theme={null}
      {
        "servers": {
          "exa": {
            "type": "http",
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```
    </Tab>

    <Tab title="기타 클라이언트" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      대부분의 클라이언트는 표준 `mcpServers` 형식을 사용합니다:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      설정 파일의 위치와 URL 키의 이름은 클라이언트마다 다릅니다:

      | 클라이언트                                        | 추가 위치                                                                                    | URL 키        |
      | -------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------ |
      | [fx by Vercel](/ko/docs/integrations/vercel/fx) | fx 셸에서 `/mcp add --transport http exa https://mcp.exa.ai/mcp` 실행 (`~/.fx/mcp.json`에 저장됨) | `url`        |
      | OpenCode                                     | `opencode.json` (`mcp` 하위, `"type": "remote"` 지정)                                        | `url`        |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (`mcpServers` 하위)                                            | `url`        |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (`mcpServers` 하위)                                  | `serverUrl`  |
      | Google Antigravity                           | Agent 패널 → Manage MCP Servers → View Raw config (`mcpServers` 하위)                        | `serverUrl`  |
      | Zed                                          | Zed `settings.json` (`context_servers` 하위)                                               | `url`        |
      | Gemini CLI                                   | `~/.gemini/settings.json` (`mcpServers` 하위)                                              | `httpUrl`    |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (최상위 `exa`)                                      | `url`        |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                   | URL을 직접 붙여넣기 |

      사용 중인 클라이언트가 원격 MCP server를 지원하지 않는다면 `mcp-remote` 브리지를 사용하세요:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "https://mcp.exa.ai/mcp"]
          }
        }
      }
      ```

      또는 [Exa API key](https://dashboard.exa.ai/api-keys)로 로컬 [npm 패키지](https://www.npmjs.com/package/exa-mcp-server)를 실행하세요:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "command": "npx",
            "args": ["-y", "exa-mcp-server"],
            "env": {
              "EXA_API_KEY": "your_api_key"
            }
          }
        }
      }
      ```
    </Tab>
  </Tabs>
</div>

<div id="authentication">
  ## 인증
</div>

Exa MCP는 세 가지 인증 모드를 지원합니다:

| 모드      | 용도                                  | 설정                                                                               |
| ------- | ----------------------------------- | -------------------------------------------------------------------------------- |
| 키 없음    | 로그인이나 API key 없이 무료로 사용(요청 수 제한 있음) | `https://mcp.exa.ai/mcp`에 연결                                                     |
| OAuth   | 대화형 클라이언트, marketplace 설치, 프로덕션 사용  | `https://mcp.exa.ai/mcp?login`에 연결해 브라우저에서 Exa에 로그인합니다. 사용량은 소속 Exa team에 집계됩니다. |
| API key | MCP OAuth를 지원하지 않는 클라이언트            | `x-api-key` header에 API key를 설정한 뒤 `https://mcp.exa.ai/mcp`에 연결                  |

<div id="sign-in-with-oauth">
  ### OAuth로 로그인하기
</div>

ChatGPT, Claude 등 marketplace를 통해 설치한 경우, 필요할 때 로그인하라는 안내가 표시됩니다. MCP OAuth를 지원하는 클라이언트라면 다음 주소로 연결해 동일한 흐름을 사용할 수 있습니다:

```text theme={null}
https://mcp.exa.ai/mcp?login
```

클라이언트가 Exa의 인증 서버를 자동으로 찾아 브라우저 로그인 화면을 열고 액세스를 관리합니다.

<div id="use-an-api-key">
  ### API key 사용하기
</div>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  대시보드에서 키를 생성하세요. 신규 계정에는 무료 크레딧이 제공됩니다.
</Card>

MCP 서버 설정에 `x-api-key` 헤더를 추가하세요:

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

<div id="available-tools">
  ## 사용 가능한 도구
</div>

| 도구                        | 제공 여부                   | 용도                                               |
| ------------------------- | ----------------------- | ------------------------------------------------ |
| `web_search_exa`          | 기본 활성화                  | 웹을 search해 바로 활용할 수 있는 관련 콘텐츠 반환                 |
| `web_fetch_exa`           | 기본 활성화                  | 알고 있는 하나 이상의 URL에서 정제된 콘텐츠 읽기                    |
| `web_search_advanced_exa` | 사용 설정 시 이용 가능           | 고급 필터와 제어 옵션으로 web search 구성                     |
| `agent_run`               | OAuth 또는 API key로 이용 가능 | 다단계 리서치, 목록 구축, enrichment, structured output 실행 |

`tools` URL 매개변수로 클라이언트에 노출할 도구를 선택하세요. 예를 들어 모든 도구를 활성화하려면:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  `tools` 목록을 명시하면 기본값이 대체되므로, web search와 fetch를 비롯해 활성화하려는 모든 도구를 빠짐없이 포함하세요.
</Tip>

<div id="exa-agent">
  ## Exa Agent
</div>

한 번의 search로 끝나지 않는 리서치, 예를 들어 목록을 만들거나 각 item이 criteria에 맞는지 확인하거나 구조화된 결과를 반환해야 하는 작업에는 [Exa Agent](/ko/docs/agent/quickstart)를 사용하세요.

Agent run은 usage 기반이므로 `agent_run`에는 OAuth 또는 API key가 필요합니다. 아래 URL은 OAuth를 시작하고 기본 도구에 더해 Agent를 추가합니다:

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

API key를 사용하는 경우 `login`을 생략하고 [인증](#authentication)에 설명된 대로 key를 추가하세요.

<Steps>
  <Step title="필요한 내용 설명하기">
    평이한 표현으로 리서치를 요청하세요. 어시스턴트가 그 요청을 `query`로 담아 `agent_run`에 전달하면, Exa Agent가 무엇을 search할지 판단하고, 출처를 읽고, 찾아낸 내용이 요청에 부합하는지 확인합니다.

    애플리케이션에서 결과를 일관된 JSON 형식으로 받아야 할 때만 Agent에 `outputSchema`를 제공하도록 요청하세요. system prompt로 직접 전달하거나, 어시스턴트가 생성하도록 할 수도 있습니다.
  </Step>

  <Step title="결과 받기">
    리서치가 완료되면 tool call이 어시스턴트에게 전체 리서치 패키지를 전달합니다:

    * 정리된 조사 결과
    * 그 근거가 된 출처
    * `outputSchema`를 제공한 경우 검증된 JSON
    * usage 및 cost

    어시스턴트는 이 패키지를 바탕으로 답변을 작성하므로, output을 어떻게 활용할지 알려주세요. 조사 결과를 요약하거나, 비교하거나, 파일로 저장하는 등 원하는 작업을 요청할 수 있습니다.
  </Step>

  <Step title="시간이 더 필요하면 이어서 진행하기">
    단일 MCP call을 넘어서는 리서치도 실패하지 않습니다. tool은 `id`와 함께 `status: "running"`을 반환하고, run은 Exa에서 계속 진행됩니다. 어시스턴트가 해당 `id`를 `runId`로 지정해 `agent_run`을 다시 call하면 같은 run을 그대로 이어받습니다.
  </Step>
</Steps>

<Accordion title="선택적 제어 옵션" icon="sliders-horizontal">
  | 필드                | 용도                                                               |
  | ----------------- | ---------------------------------------------------------------- |
  | `systemPrompt`    | Agent에 리서치 또는 결과 판단에 대한 추가 지침 제공                                 |
  | `outputSchema`    | 특정 JSON 형식으로 답변 반환                                               |
  | `input.data`      | 이미 보유한 행이나 엔티티를 enrich                                           |
  | `input.exclusion` | 이미 알고 있는 결과 건너뛰기                                                 |
  | `dataSources`     | 최대 다섯 개의 [Exa Connect](/ko/docs/agent/connect/overview) provider 추가 |
  | `previousRunId`   | 완료된 리서치를 기반으로 새 요청 구성                                            |
  | `effort`          | Agent가 수행할 리서치 정도 선택                                             |
</Accordion>

<Tip>
  진행 중인 작업을 계속 기다리려면 `runId`를 사용하세요. 완료된 작업을 바탕으로 새 후속 요청을 하려면 `previousRunId`를 사용하세요.
</Tip>

output schema 패턴, effort 모드, 데이터 소스, 가격에 대해서는 [Exa Agent 가이드](/ko/docs/agent/quickstart)를 참고하세요.

<div id="advanced-search">
  ## Advanced search
</div>

명시적인 카테고리나 도메인 필터, 날짜 범위, 텍스트 제약 조건, 지역 타기팅, query 확장, summaries, highlights, freshness 제어, 하위 페이지 크롤링이 필요한 요청에는 `web_search_advanced_exa`를 사용하세요. 일반적인 searches에는 `web_search_exa`를 그대로 사용하면 됩니다. 모델에 노출되는 도구 표면이 더 작고 configuration도 덜 필요합니다.

Advanced Search는 인증이 필요하지 않지만, 인증된 연결에서는 사용자 본인의 플랜과 rate limits가 적용됩니다. 기본 도구와 함께 활성화하려면 다음을 사용하세요:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

MCP 도구는 주요 [Search API](/ko/docs/reference/search) 옵션을 `includeDomains`, `startPublishedDate`, `enableHighlights`, `maxAgeHours`처럼 도구에서 쓰기 쉬운 필드 형태로 제공합니다. 정확한 필드 이름은 클라이언트에서 도구 schema를 확인하세요.

<div id="troubleshooting">
  ## 문제 해결
</div>

<AccordionGroup>
  <Accordion title="rate limit 오류 (429)">
    해당 연결이 Exa의 무료 rate limits를 사용하고 있습니다. OAuth로 로그인하거나 직접 API key를 추가한 뒤 다시 연결하면, 요청이 team의 플랜과 limits를 따르게 됩니다.

    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits가 제공됩니다.
    </Card>
  </Accordion>

  <Accordion title="Agent가 보이지 않거나 인증을 요구함">
    `agent_run`은 기본적으로 활성화되어 있지 않으며 무료 rate limits를 사용할 수 없습니다. `tools` URL 파라미터에 추가한 뒤 `?login`으로 연결하거나 API key를 설정하세요. 전체 URL은 [Exa Agent](#exa-agent)를 참고하세요.
  </Accordion>

  <Accordion title="OAuth 로그인 창이 열리지 않음">
    사용 중인 클라이언트가 MCP OAuth를 지원하는지 확인한 뒤 `https://mcp.exa.ai/mcp?login`으로 연결하세요. URL을 변경한 후에는 클라이언트를 재시작하세요. 클라이언트에서 MCP OAuth를 완료할 수 없다면 대신 API key를 사용하세요.
  </Accordion>

  <Accordion title="도구가 표시되지 않음">
    `tools` 파라미터를 명시하면 기본 도구 목록이 대체됩니다. 원하는 도구가 모두 URL에 포함되어 있는지 확인한 뒤, MCP 클라이언트를 재시작해 도구 목록을 다시 가져오도록 하세요.
  </Accordion>

  <Accordion title="Claude desktop이 연결되지 않음">
    내장 커넥터를 사용하세요. **+**(또는 **Add connectors**) 선택 → **Connectors** 탭 → **Exa** 검색 → **+** 선택.
  </Accordion>

  <Accordion title="설정 파일을 찾을 수 없음">
    일반적인 설정 파일 위치:

    * Cursor: `~/.cursor/mcp.json`
    * fx: `~/.fx/mcp.json`
    * VS Code: `.vscode/mcp.json` (프로젝트 루트)
    * Claude desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="소스 보기" arrow="true">
    Exa MCP 소스 코드입니다.
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="패키지 열기" arrow="true">
    npm 패키지로 Exa MCP를 로컬에서 실행하세요.
  </Card>

  <Card title="Agent skills" icon="wrench" href="/ko/docs/get-started/agent-skills/overview" cta="skill 둘러보기" arrow="true">
    Exa MCP와 함께 사용할 수 있는 이식성 높은 skill입니다.
  </Card>

  <Card title="Codex와 ChatGPT에서의 Exa" icon="messages-square" href="/ko/docs/integrations/chatgpt-codex" cta="가이드 열기" arrow="true">
    Exa 플러그인의 전체 설정 및 workflow 가이드입니다.
  </Card>
</Columns>