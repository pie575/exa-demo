> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일을 활용해 사용 가능한 모든 페이지를 확인하세요.

# Exa MCP {#exa-mcp}

> ChatGPT, Codex, Claude, Grok, Cursor를 비롯한 모든 MCP 클라이언트를 Exa의 web search, 페이지 가져오기, Exa Agent, Exa Connect 도구에 연결하세요.

Exa MCP를 사용하면 ChatGPT, Claude 및 MCP 호환 도구에 내장된 web search를 web search, 코드 검색, [Exa Agent](/ko/docs/agent/quickstart), [Exa Connect](/ko/docs/agent/connect/overview) 등 Exa의 검색 기능으로 한층 강화할 수 있습니다.

Exa는 모든 MCP 클라이언트에서 작동하는 호스팅 서버를 제공합니다:

```text theme={null}
https://mcp.exa.ai/mcp
```

시작하는 데 API 키는 필요하지 않습니다. Exa MCP는 오픈 소스이며 [GitHub](https://github.com/exa-labs/exa-mcp-server)에서 확인할 수 있습니다.

## 설치 {#install}

<div className="docs-tabs">
  <Tabs>
    <Tab title="ChatGPT & Codex" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/chatgpt.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=877edee72e2a7a4f7b9c7c936c6d4316" width="24" height="24" data-path="images/mcp-clients/chatgpt.svg">
      Exa는 OpenAI 플러그인 디렉터리의 공식 플러그인이며, 호스팅형 MCP 서버와 Exa의 `search` 및 `exa-agent` skill을 포함합니다.

      <Steps>
        <Step title="플러그인 열기">
          [chatgpt.com/plugins/exa](https://chatgpt.com/plugins/exa?open_in_app)로 이동하세요. OpenAI 플러그인 디렉터리에서 **Exa**가 열리며, 이 디렉터리는 ChatGPT와 Codex에서 동일하게 사용됩니다.
        </Step>

        <Step title="설치하기">
          더하기 버튼을 선택해 설치하세요. 설치 중에 또는 Codex나 ChatGPT에서 처음 사용할 때 메시지가 표시되면 Exa에 로그인하세요.

          <Frame caption="Codex에서 Plugins를 열고, Exa를 추가하고, 접근 권한을 승인하는 과정">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/chatgpt-codex/install-codex.gif?s=170c67f79603bc3a0dc470266a3f29f7" alt="Opening Plugins in Codex, viewing the Exa plugin, and authorizing access" style={{width: "100%", height: "auto"}} width="1100" height="825" data-path="images/integrations/chatgpt-codex/install-codex.gif" />
          </Frame>
        </Step>

        <Step title="새 세션 시작하기">
          skill은 설치 이후에 시작된 채팅과 CLI 세션에서 로드되므로, 새 세션을 열고 웹 검색이 필요한 작업을 요청해 보세요.
        </Step>
      </Steps>

      이것으로 끝입니다. 이 플러그인에는 Exa의 MCP 연동과 skill이 모두 포함되어 있으므로, 별도의 MCP나 skill 설정은 필요하지 않습니다.

      전체 설정 및 워크플로우 가이드는 [Codex와 ChatGPT의 Exa](/ko/docs/integrations/chatgpt-codex)를 참고하세요.
    </Tab>

    <Tab title="Claude" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/claude.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=443a9b17d5b63c875f924a4aecc01e56" width="24" height="24" data-path="images/mcp-clients/claude.svg">
### Claude Code CLI {#claude-code-cli}

      <Steps>
        <Step title="플러그인 설치">
          터미널에서 Exa를 설치합니다:

          ```bash theme={null}
          claude plugin install exa@claude-plugins-official
          ```

          Claude Code에서 `/plugin`을 입력한 뒤 **Exa**를 검색해 설치할 수도 있습니다.
        </Step>

        <Step title="Exa 사용하기">
          새 Claude Code 세션을 시작하고 웹 검색이 필요한 내용을 질문해 보세요.
        </Step>
      </Steps>

### Desktop, Web &amp; Cowork {#desktop-web-cowork}

      Claude Desktop, Web, Cowork는 모두 Exa의 공식 커넥터를 사용합니다.

      <Steps>
        <Step title="커넥터 디렉터리 열기">
          새 채팅에서 더하기 버튼을 누르고 **Add connector**를 선택한 뒤 **Exa**를 검색합니다.
        </Step>

        <Step title="Exa 연결하기">
          Exa를 열고 **Connect to Claude**를 선택한 다음, 안내가 표시되면 접근 권한을 승인합니다.

          <Frame caption="Claude에서 커넥터 디렉터리를 열고 Exa를 찾아 연결한 뒤 접근 권한을 승인하는 과정">
            <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/claude-web-desktop/install-claude.gif?s=259e8d897252e7f8435b94dc6ceeae5d" alt="Opening the connector directory in Claude, finding Exa, connecting it, and authorizing access" style={{width: "100%", height: "auto"}} width="800" height="596" data-path="images/integrations/claude-web-desktop/install-claude.gif" />
          </Frame>
        </Step>

        <Step title="Exa 사용하기">
          새 채팅을 시작하고 웹의 최신 정보가 필요한 내용을 질문해 보세요.
        </Step>
      </Steps>

      전체 설정 및 워크플로우 가이드는 [Claude Code, Web, Desktop의 Exa](/ko/docs/integrations/claude-web-desktop)를 참고하세요.

      Claude Team 및 Enterprise 관리자는 대신 identity provider를 통해 모든 구성원에게 커넥터를 프로비저닝할 수 있습니다. [Enterprise Managed Auth](/ko/docs/admin/mcp-enterprise-managed-auth)를 참고하세요.
    </Tab>

    <Tab title="Grok Build" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/grok.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=52ce55e129bd951b5c96471cf21153e7" width="400" height="400" data-path="images/mcp-clients/grok.svg">
      Exa는 [Grok Build](https://docs.x.ai/build/overview) 마켓플레이스에서 사용할 수 있습니다.

      <Steps>
        <Step title="마켓플레이스 열기">
          Grok Build에서 `/marketplace`를 실행하세요.
        </Step>

        <Step title="Exa 설치">
          목록에서 **exa**를 찾아 `i`를 누르세요.
        </Step>

        <Step title="로그인">
          `/mcp`를 실행하고 **exa**를 선택한 뒤 `i`를 눌러 브라우저에서 Exa 계정에 로그인하세요.
        </Step>
      </Steps>

      신규 계정에는 가입 시 무료 credits가 제공됩니다.
    </Tab>

    <Tab title="커서" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/cursor.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=2df7fb1b4be985ad431617e4dfe7a42f" width="24" height="24" data-path="images/mcp-clients/cursor.svg">
      [Cursor 마켓플레이스](https://cursor.com/marketplace/exa)에서 Exa MCP를 설치하거나, `~/.cursor/mcp.json`에 다음을 추가하세요:

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

    <Tab title="기타 client" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/mcp-clients/other-clients.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=187e423022b8fc3ed950a967a10ff700" width="24" height="24" data-path="images/mcp-clients/other-clients.svg">
      대부분의 client는 표준 `mcpServers` 형식을 사용합니다:

      ```json theme={null}
      {
        "mcpServers": {
          "exa": {
            "url": "https://mcp.exa.ai/mcp"
          }
        }
      }
      ```

      config의 위치와 URL 키 이름은 client마다 다릅니다:

      | Client                                       | 추가할 위치                                                                                | URL 키        |
      | -------------------------------------------- | ------------------------------------------------------------------------------------- | ------------ |
      | [fx by Vercel](/ko/docs/integrations/vercel/fx) | fx 셸에서 `/mcp add --transport http exa https://mcp.exa.ai/mcp` (`~/.fx/mcp.json`에 저장됨) | `url`        |
      | OpenCode                                     | `opencode.json` (`mcp` 아래, `"type": "remote"` 지정)                                     | `url`        |
      | Kiro                                         | `~/.kiro/settings/mcp.json` (`mcpServers` 아래)                                         | `url`        |
      | Windsurf                                     | `~/.codeium/windsurf/mcp_config.json` (`mcpServers` 아래)                               | `serverUrl`  |
      | Google Antigravity                           | Agent 패널 → Manage MCP Servers → View Raw config (`mcpServers` 아래)                     | `serverUrl`  |
      | Zed                                          | Zed `settings.json` (`context_servers` 아래)                                            | `url`        |
      | Gemini CLI                                   | `~/.gemini/settings.json` (`mcpServers` 아래)                                           | `httpUrl`    |
      | Warp                                         | Settings → MCP Servers → Add MCP Server (최상위 `exa`)                                   | `url`        |
      | v0 by Vercel                                 | Prompt Tools → Add MCP                                                                | URL을 직접 붙여넣기 |

      사용 중인 client가 원격 MCP 서버를 지원하지 않는다면 `mcp-remote` 브리지를 사용하세요:

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

## 인증 {#authentication}

Exa MCP는 세 가지 authentication 모드를 지원합니다:

| 모드    | 사용 사례                               | 설정                                                                                   |
| ----- | ----------------------------------- | ------------------------------------------------------------------------------------ |
| 키 없음  | sign-in이나 API 키 없이 사용량 제한이 있는 무료 사용 | `https://mcp.exa.ai/mcp`에 연결                                                         |
| OAuth | 대화형 client, 마켓플레이스 설치, 프로덕션 사용      | `https://mcp.exa.ai/mcp?login`에 연결해 브라우저에서 Exa에 sign-in합니다. 사용량은 소속 Exa team에 집계됩니다. |
| API 키 | MCP OAuth를 지원하지 않는 client           | `x-api-key` header에 API 키를 설정한 뒤 `https://mcp.exa.ai/mcp`에 연결                        |

### OAuth로 로그인 {#sign-in-with-oauth}

ChatGPT, Claude 등 마켓플레이스를 통해 설치한 경우 필요할 때 로그인 안내가 표시됩니다. MCP OAuth를 지원하는 client라면 다음 주소로 연결해 동일한 flow를 요청할 수 있습니다:

```text theme={null}
https://mcp.exa.ai/mcp?login
```

client이 Exa의 인가 서버를 발견하고, 브라우저에서 sign-in을 열고, 액세스를 관리합니다.

### API 키 사용 {#use-an-api-key}

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

MCP 서버 구성에 `x-api-key` header를 추가하세요:

```text theme={null}
x-api-key: YOUR_EXA_API_KEY
```

## 사용 가능한 도구 {#available-tools}

| 도구                        | 제공 여부                 | 용도                                                |
| ------------------------- | --------------------- | ------------------------------------------------- |
| `web_search_exa`          | 기본 활성화                | 웹을 search해 바로 활용 가능한 관련 content 반환                |
| `web_fetch_exa`           | 기본 활성화                | 이미 알고 있는 하나 이상의 URL에서 깔끔하게 정제된 content 읽기         |
| `web_search_advanced_exa` | 옵트인 시 사용 가능           | 고급 필터와 제어 옵션으로 web search 구성                      |
| `agent_run`               | OAuth 또는 API 키로 사용 가능 | 다단계 리서치, 리스트 빌딩, enrichment, structured output 실행 |

`tools` URL 매개변수로 client에 노출할 도구를 선택하세요. 예를 들어 모든 도구를 활성화하려면:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa,agent_run
```

<Tip>
  `tools` 목록을 명시하면 기본값을 대체하므로, web search와 fetch를 포함해 활성화하려는 모든 도구를 빠짐없이 나열하세요.
</Tip>

## Exa Agent {#exa-agent}

search 한 번으로 끝나지 않는 리서치, 예를 들어 목록을 구축하거나 각 item을 criteria에 따라 검증하거나 구조화된 결과를 반환해야 하는 작업에는 [Exa Agent](/ko/docs/agent/quickstart)를 사용하세요.

Agent 실행은 사용량 기반이므로 `agent_run`에는 OAuth 또는 API 키가 필요합니다. 아래 URL은 OAuth를 시작하고 기본 도구와 함께 Agent를 추가합니다:

```text theme={null}
https://mcp.exa.ai/mcp?login&tools=web_search_exa,web_fetch_exa,agent_run
```

API 키를 사용하는 경우 `login`을 생략하고 [인증](#authentication)에 설명된 대로 키를 추가하세요.

<Steps>
  <Step title="필요한 내용 설명하기">
    평이한 표현으로 리서치를 요청하세요. 어시스턴트가 해당 요청을 `query`로 담아 `agent_run`에 전달하면, Exa Agent가 무엇을 search할지 판단하고 소스를 읽은 뒤 찾아낸 내용을 요청과 대조해 확인합니다.

    애플리케이션에서 일관된 JSON 형식의 결과가 필요한 경우에만 Agent에 `outputSchema`를 제공하도록 요청하세요. system prompt로 어시스턴트에 직접 전달하거나, 어시스턴트가 생성하게 할 수 있습니다.
  </Step>

  <Step title="결과 받기">
    리서치가 완료되면 도구 호출이 어시스턴트에 전체 리서치 패키지를 전달합니다:

    * 작성된 결과
    * 그 근거가 된 소스
    * `outputSchema`를 제공한 경우 검증된 JSON
    * 사용량 및 비용

    어시스턴트는 이 패키지를 바탕으로 답변을 작성하므로, output으로 무엇을 하길 원하는지 알려주세요. 결과를 요약하거나 비교하거나 file로 저장하는 등 원하는 무엇이든 요청할 수 있습니다.
  </Step>

  <Step title="시간이 더 필요하면 이어가기">
    단일 MCP 호출 시간을 넘기는 리서치도 실패하지 않습니다. 실행이 Exa에서 계속되는 동안 도구는 `id`와 함께 `status: "running"`을 반환합니다. 어시스턴트가 그 `id`를 `runId`로 지정해 `agent_run`을 다시 호출하면 동일한 실행을 이어서 진행합니다.
  </Step>
</Steps>

<Accordion title="선택적 제어 항목" icon="sliders-horizontal">
  | Field             | 용도                                                         |
  | ----------------- | ---------------------------------------------------------- |
  | `systemPrompt`    | 리서치 수행이나 result 판단에 대한 추가 지침을 Agent에 제공                    |
  | `outputSchema`    | 특정 JSON 형식으로 답변을 반환                                        |
  | `input.data`      | 이미 보유한 행이나 엔터티를 enrich                                     |
  | `input.exclusion` | 이미 알고 있는 result를 건너뛰기                                      |
  | `dataSources`     | 최대 5개의 [Exa Connect](/ko/docs/agent/connect/overview) 제공업체 추가 |
  | `previousRunId`   | 완료된 리서치를 기반으로 새 요청 구성                                      |
  | `effort`          | Agent가 수행할 리서치의 양을 선택                                      |
</Accordion>

<Tip>
  현재 진행 중인 작업을 계속 기다리려면 `runId`를 사용하세요. 완료된 작업을 바탕으로 새로운 후속 요청을 하려면 `previousRunId`를 사용하세요.
</Tip>

output schema 패턴, effort 모드, 데이터 소스, 가격은 [Exa Agent 가이드](/ko/docs/agent/quickstart)를 참고하세요.

## Advanced search {#advanced-search}

명시적인 카테고리나 도메인 필터, 날짜 범위, 텍스트 제약 조건, 지역 타기팅, 질의 확장, summary, highlights, freshness 제어, 하위 페이지 크롤링이 필요한 요청이라면 `web_search_advanced_exa`를 사용하세요. 일반적인 검색에는 `web_search_exa`를 그대로 쓰는 것이 좋습니다. 모델에 노출되는 도구 표면이 더 작고 구성도 덜 필요합니다.

Advanced Search는 authentication이 필요하지 않지만, 인증된 연결에서는 본인의 plan과 속도 제한이 적용됩니다. 기본 도구와 함께 활성화하려면 다음과 같이 설정하세요:

```text theme={null}
https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,web_search_advanced_exa
```

MCP 도구는 자주 사용하는 [Search API](/ko/docs/reference/search) 옵션을 `includeDomains`, `startPublishedDate`, `enableHighlights`, `maxAgeHours`처럼 도구에서 쓰기 편한 field로 제공합니다. 정확한 field 이름은 client의 tool schema를 참고하세요.

## 문제 해결 {#troubleshooting}

<AccordionGroup>
  <Accordion title="속도 제한 오류 (429)">
    현재 연결은 Exa의 무료 속도 제한을 사용하고 있습니다. OAuth로 sign-in하거나 본인의 API 키를 추가한 뒤 다시 연결하면, 요청에 team의 plan과 limits가 적용됩니다.

    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Accordion>

  <Accordion title="Agent가 보이지 않거나 authentication을 요구함">
    `agent_run`은 기본적으로 활성화되어 있지 않으며 무료 속도 제한을 사용할 수 없습니다. `tools` URL 매개변수에 추가한 뒤 `?login`으로 연결하거나 API 키를 설정하세요. 전체 URL은 [Exa Agent](#exa-agent)를 참고하세요.
  </Accordion>

  <Accordion title="OAuth sign-in 화면이 열리지 않음">
    client가 MCP OAuth를 지원하는지 확인하고 `https://mcp.exa.ai/mcp?login`으로 연결하세요. URL을 변경한 후에는 client를 재시작하세요. client가 MCP OAuth를 완료할 수 없다면 대신 API 키를 사용하세요.
  </Accordion>

  <Accordion title="도구가 표시되지 않음">
    `tools` 매개변수를 명시하면 기본 도구 목록이 대체됩니다. 필요한 도구가 모두 URL에 포함되어 있는지 확인한 뒤, MCP 클라이언트를 재시작해 도구 목록을 다시 가져오게 하세요.
  </Accordion>

  <Accordion title="Claude desktop이 연결되지 않음">
    내장 커넥터를 사용하세요. **+**(또는 **Add connectors**) → **Connectors** 탭 → **Exa** 검색 → **+** 선택.
  </Accordion>

  <Accordion title="Config 파일을 찾을 수 없음">
    일반적인 config 위치:

    * Cursor: `~/.cursor/mcp.json`
    * fx: `~/.fx/mcp.json`
    * VS Code: `.vscode/mcp.json` (프로젝트 루트)
    * Claude desktop (macOS): `~/Library/Application Support/Claude/claude_desktop_config.json`
    * Claude desktop (Windows): `%APPDATA%\Claude\claude_desktop_config.json`
  </Accordion>
</AccordionGroup>

## 리소스 {#resources}

<Columns cols={2}>
  <Card title="GitHub" icon="git-branch" href="https://github.com/exa-labs/exa-mcp-server" cta="소스 보기" arrow="true">
    Exa MCP 소스 코드입니다.
  </Card>

  <Card title="npm" icon="package" href="https://www.npmjs.com/package/exa-mcp-server" cta="패키지 열기" arrow="true">
    npm 패키지로 Exa MCP를 로컬에서 실행하세요.
  </Card>

  <Card title="Agent skills" icon="wrench" href="/ko/docs/get-started/agent-skills/overview" cta="skill 둘러보기" arrow="true">
    Exa MCP와 함께 사용할 수 있는 이식 가능한 skill입니다.
  </Card>

  <Card title="Codex와 ChatGPT의 Exa" icon="messages-square" href="/ko/docs/integrations/chatgpt-codex" cta="가이드 열기" arrow="true">
    Exa 플러그인의 전체 설정 및 워크플로우 가이드입니다.
  </Card>
</Columns>