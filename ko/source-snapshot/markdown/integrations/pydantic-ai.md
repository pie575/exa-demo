> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="pydantic-ai">
  # Pydantic AI
</div>

> Exa search API 기반의 웹 리서치 도구를 Pydantic AI agent에 제공하세요.

<Card title="Coding Agent Quickstart" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa가 처음이신가요? 1분 안에 시작해 보세요.
</Card>

***

[Pydantic AI](https://pydantic.dev/docs/ai/)는 Pydantic을 만든 팀이 개발한 Python agent 프레임워크입니다. 이 [harness](https://pydantic.dev/docs/ai/harness/exa-search/)는 공식 Exa 연동을 조합 가능한 두 가지 기능으로 제공합니다.

* **`ExaSearch`**: Exa Search API 기반의 웹 리서치 도구로, `web_search`(가장 관련성 높은 발췌문과 함께 상위 결과를 반환하며, 선택적으로 합성된 text summary 포함), `get_page`(특정 URL의 전체 페이지 검색), 그리고 선택적으로 활성화하는 `deep_search`(한 번의 call로 인용이 포함된 합성 답변 제공)가 있습니다.
* **`ExaAgent`**: 장시간 실행되는 리서치를 [Exa Agent API](/ko/docs/agent/quickstart)에 지연 도구 호출로 위임합니다.

capability는 도구, 도구별 output 예산, 간결한 리서치 guidance를 system prompt에 함께 묶어 제공합니다. 따라서 search API를 페이지 페처에 직접 연결하거나, 체계적으로 리서치하도록 agent에게 직접 prompt를 작성할 필요가 없습니다.

<Info> Pydantic의 전체 reference는 [여기](https://pydantic.dev/docs/ai/harness/exa-search/)에서 확인하세요. </Info>

<Card title="Exa로 리서치 에이전트를 구축하는 방법을 다룬 Pydantic의 글 읽기" icon="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/pydantic-ai/logo.svg?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=aee1bf45859bf6a3debf4177d0aefb3f" horizontal href="https://pydantic.dev/articles/harness-exa" width="120" height="120" data-path="images/integrations/pydantic-ai/logo.svg">
  Pydantic AI와 Exa로 만든, 복사해서 바로 쓸 수 있는 리서치 에이전트 세 가지를 단계별로 살펴봅니다.
</Card>

***

<div id="get-started">
  ## Get Started
</div>

<Steps>
  <Step title="사전 요구 사항 및 설치">
    Exa extra와 함께 harness를 설치하고 `EXA_API_KEY` environment variable을 설정하세요.

    ```Bash Bash theme={null}
    uv add "pydantic-ai-harness[exa]"
    ```

    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Step>

  <Step title="agent에 ExaSearch 추가하기">
    `capabilities` 매개변수를 통해 `ExaSearch`를 `Agent`에 전달하세요. authentication은 기본적으로 `EXA_API_KEY`에서 가져옵니다.

    ```Python Python theme={null}
    from pydantic_ai import Agent
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch()])

    result = agent.run_sync('What changed in the latest stable Python release?')
    print(result.output)
    ```

    `ExaSearch`는 agent에 두 가지 도구를 추가합니다:

    | 도구           | 용도                                                                 |
    | ------------ | ------------------------------------------------------------------ |
    | `web_search` | 웹을 검색하여 상위 `num_results`개의 페이지를 제목, URL, 가장 관련성 높은 발췌문과 함께 반환합니다.  |
    | `get_page`   | 특정 URL 하나의 전체 텍스트를 가져옵니다 — 유망한 `web_search` 결과이거나 사용자가 제공한 URL입니다. |

    `web_search`는 전체 페이지 텍스트 대신 짧은 발췌문(Exa highlights)을 반환하므로 여러 소스를 훑어보는 비용이 저렴합니다. 이후 agent는 선택한 페이지를 `get_page`로 읽습니다. 콘텐츠가 없는 URL이나 질문, 속도 제한, 일시적인 실패는 `ModelRetry`로 모델에 전달되어 실행이 복구될 수 있습니다. authentication 실패(401/403)는 구성 오류로 전파됩니다.
  </Step>

  <Step title="deep search 활성화하기(선택 사항)">
    `deep_search`는 Exa의 다단계 [deep search](/ko/docs/search/quickstart)(`type='deep'`)를 실행합니다. Exa가 질문을 여러 쿼리로 확장해 검색한 뒤, 단일 도구 호출로 citations에 근거 기반한 답변을 반환합니다. `web_search`보다 더 많은 시간과 검색 깊이를 투입하므로 기본적으로 비활성화되어 있습니다. 다음과 같이 명시적으로 활성화하세요:

    ```Python Python theme={null}
    from pydantic_ai_harness.exa import ExaSearch

    agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaSearch(include_deep_search=True)])
    ```

    활성화하면 해당 capability의 지침이 모델에게 `deep_search`를 `web_search`의 대체가 아니라 단계적 확장으로 취급하도록 안내합니다.
  </Step>
</Steps>

***

<div id="configuration">
  ## 구성
</div>

`ExaSearch`의 모든 field와 기본값:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(
    num_results=5,             # web_search 호출당 결과 수 (1~100)
    max_text_chars=10_000,     # get_page 텍스트 상한, 문자 수 기준 (1~10,000)
    text_summary=False,        # web_search가 요약된 text summary도 함께 반환
    include_deep_search=False, # deep_search 도구도 함께 노출
    include_domains=[],        # 이 도메인만 검색 (허용 목록)
    exclude_domains=[],        # 이 도메인은 검색하지 않음 (차단 목록)
    guidance=None,             # None = 기본 지침, '' = 없음, str = 사용자 지정
    client=None,               # ExaClient -- None이면 EXA_API_KEY로 exa_py.AsyncExa 생성
)
```

`include_domains`와 `exclude_domains`는 `web_search` 및 `deep_search`에 적용되며, 두 옵션은 함께 사용할 수 없습니다. 범위를 벗어난 limits를 지정하거나 두 도메인 목록을 동시에 설정하면 생성 시점에 오류가 발생합니다.

<div id="text-summary">
  ### Text summary
</div>

`text_summary`를 설정하면 모든 `web_search` call이 결과에 대한 일반 텍스트 summary도 함께 요청합니다. 제약 없는 summary를 원하면 `True`를, 특정 형식을 원하면 그 형식을 설명하는 문자열을 전달하세요:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(text_summary='One concise sentence with the requested facts.')
```

도구의 반환 형태는 그대로입니다. Exa가 summary를 반환하면 맨 앞에 `Summary:` 줄이 추가됩니다.

<div id="structured-citations">
  ### 구조화된 citations
</div>

모든 도구는 `ToolReturn`을 반환합니다. `return_value`에는 모델이 보는 텍스트(`Sources:` 블록 포함)가 담기고, `metadata`에는 `'sources'` 키 아래에 구조화된 `ExaSource` 레코드(`{'url': ..., 'title': ...}`) 형태로 소스가 담깁니다. Metadata는 모델에 전달되지 않으므로 citations를 렌더링할 때 텍스트 파싱이 필요 없습니다:

```Python Python theme={null}
from pydantic_ai.messages import ModelRequest, ToolReturnPart

for message in result.all_messages():
    if isinstance(message, ModelRequest):
        for part in message.parts:
            if isinstance(part, ToolReturnPart) and part.metadata is not None:
                for source in part.metadata.get('sources', []):
                    print(source['url'], source['title'])
```

<div id="custom-client">
  ### 커스텀 client
</div>

기본 client는 `exa_py.AsyncExa`이며, `EXA_API_KEY`에서 설정을 가져옵니다. authentication이나 base URL을 명시적으로 지정하거나 테스트에서 가짜 객체로 대체하려면, `ExaClient` 프로토콜을 만족하는 객체를 전달하세요:

```Python Python theme={null}
from exa_py import AsyncExa
from pydantic_ai_harness.exa import ExaSearch

ExaSearch(client=AsyncExa(api_key='...'))
```

***

<div id="exa-agent-runs">
  ## Exa agent 실행
</div>

[Exa Agent API](/ko/docs/agent/quickstart)는 개방형 리서치 작업을 비동기로 실행합니다. `ExaAgent` capability는 이 수명 주기를 Pydantic AI의 [지연 도구 호출](https://pydantic.dev/docs/ai/deferred-tools/)에 매핑합니다. `exa_agent` 도구가 실행을 생성한 뒤 지연 처리하며, 이때 Exa 실행 ID를 지연된 call의 metadata에 담아 전달합니다.

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent

agent = Agent('anthropic:claude-sonnet-4-6', capabilities=[ExaAgent()])
```

기본값(`execution='inline'`)에서는 capability가 Exa 실행이 완료될 때까지 폴링하면서 Agent 실행 내에서 지연된 call을 직접 처리하므로, 해당 도구는 (조금 느릴 뿐) 일반 도구와 동일하게 동작합니다. `execution='external'`로 설정하면 call이 `DeferredToolRequests` output으로 상위에 전달되어, 호스트 애플리케이션이 별도로 처리하게 됩니다.

`ExaAgent`의 모든 field와 기본값은 다음과 같습니다:

```Python Python theme={null}
from pydantic_ai_harness.exa import ExaAgent

ExaAgent(
    effort=None,          # 'low' | 'medium' | 'high' | 'xhigh' | 'auto' -- None이면 API 기본값
    execution='inline',   # 'inline'은 완료될 때까지 폴링, 'external'은 DeferredToolRequests로 전달
    output_schema=None,   # structured output용 BaseModel 클래스 또는 dict schema
    system_prompt=None,   # Exa agent 실행에 전달됨
    poll_interval=1000,   # inline으로 처리할 때 폴링 간격(ms)
    timeout_ms=3_600_000, # inline으로 처리할 때 실행을 기다리는 시간(ms)
    guidance=None,        # None이면 기본 지침, ''이면 없음, str이면 사용자 지정
    runs=None,            # ExaAgentRuns -- None이면 EXA_API_KEY로 AsyncExa().agent.runs 생성
)
```

***

<div id="agent-spec-yamljson">
  ## Agent spec (YAML/JSON)
</div>

두 기능 모두 Pydantic AI의 [agent spec](https://pydantic.dev/docs/ai/agents/#agent-spec)을 지원하므로, Python 코드 대신 설정 파일에서 선언할 수 있습니다:

```yaml agent.yaml theme={null}
model: anthropic:claude-sonnet-4-6
capabilities:
  - ExaSearch:
      num_results: 3
      include_deep_search: true
  - ExaAgent:
      effort: low
```

```Python Python theme={null}
from pydantic_ai import Agent
from pydantic_ai_harness.exa import ExaAgent, ExaSearch

agent = Agent.from_file('agent.yaml', custom_capability_types=[ExaSearch, ExaAgent])
```

spec 로더가 기능을 인스턴스화하는 방법을 알 수 있도록 `custom_capability_types`를 전달하세요. spec으로 로드된 instance는 항상 `EXA_API_KEY`로 기본 client를 생성합니다.

***

<div id="next">
  ## 다음 단계
</div>

* [**Search API**](/ko/docs/search/quickstart) - highlights, summary, deep search를 지원하는 시맨틱 search
* [**Agent API**](/ko/docs/agent/quickstart) - 형식에 제약이 없는 비동기 리서치 실행
* [**MCP 설정**](/ko/docs/get-started/exa-mcp) - Exa가 호스팅하는 MCP 서버
* [**SDK**](/ko/docs/sdks/quickstart) - Python 및 JavaScript SDK 문서