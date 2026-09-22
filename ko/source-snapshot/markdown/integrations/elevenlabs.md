> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="elevenlabs">
  # ElevenLabs
</div>

> ElevenLabs voice agent에 Exa web search를 추가하세요.

***

ElevenLabs voice agent는 Exa를 **webhook 도구**로 사용해 대화 도중에 웹을 검색할 수 있습니다. agent가 최신 정보가 필요하다고 판단하면 ElevenLabs가 Exa의 `/search` 엔드포인트로 직접 HTTP POST를 보내므로, 사용자 측에 별도의 서버나 미들웨어가 필요하지 않습니다.

Exa를 ElevenLabs에 연결하는 방법은 두 가지입니다.

| 방식                                | 설정                         | 유연성                                       |
| --------------------------------- | -------------------------- | ----------------------------------------- |
| **webhook 도구** (권장)               | API 또는 dashboard에서 구성      | 검색 파라미터, content options, header까지 완전히 제어 |
| **Built-in Exa integration** (알파) | ElevenLabs dashboard에서 원클릭 | 더 간단하지만 구성이 제한적                           |

이 가이드에서는 Exa 호출 방식을 완전히 제어할 수 있는 webhook 도구 방식을 다룹니다. [ElevenLabs dashboard](https://elevenlabs.io/app/conversational-ai)에서 연동을 구성할 수도 있습니다.

<div id="how-it-works">
  ## 작동 방식
</div>

1. 사용자가 voice agent에게 말합니다
2. LLM이 도구 설명을 보고 `web_search`를 call할지 결정합니다
3. ElevenLabs가 설정한 header와 body로 `https://api.exa.ai/search`에 POST 요청을 보냅니다
4. LLM이 결정한 파라미터(search `query`)가 직접 지정한 상수 값(`type`, `numResults`, `contents`)과 병합됩니다
5. Exa result가 LLM으로 전달되고, LLM이 대화체로 응답합니다

서버도, 콜백 URL도, 리스너도 필요 없습니다. ElevenLabs가 Exa를 직접 호출하는 HTTP client 역할을 합니다. 도구 call의 타임아웃은 20초입니다.

<div id="prerequisites">
  ## 사전 준비 사항
</div>

* [Exa API key](https://dashboard.exa.ai/api-keys)
* [ElevenLabs API 키](https://elevenlabs.io/app/settings/api-keys)

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
</Card>

<div id="get-started">
  ## Get started
</div>

<Steps>
  <Step title="webhook 도구 만들기">
    ElevenLabs [Create Tool API](https://elevenlabs.io/docs/api-reference/tools/create)를 사용해 Exa의 search 엔드포인트를 가리키는 webhook 도구를 등록하세요.

    핵심 개념은 이렇습니다. `constant_value`가 있는 속성은 고정값으로 모든 요청에 전송되고, `description`이 있는 속성은 런타임에 LLM이 결정합니다.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/tools" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "tool_config": {
          "type": "webhook",
          "name": "web_search",
          "description": "Search the web using Exa. Use this when the user asks anything that needs current or factual information.",
          "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
              "x-api-key": "YOUR_EXA_API_KEY",
              "Content-Type": "application/json",
              "x-exa-integration": "elevenlabs"
            },
            "request_body_schema": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "Natural language search query. Be specific."
                },
                "type": {
                  "type": "string",
                  "constant_value": "instant"
                },
                "numResults": {
                  "type": "integer",
                  "constant_value": 5
                },
                "contents": {
                  "type": "object",
                  "properties": {
                    "highlights": {
                      "type": "boolean",
                      "constant_value": true
                    }
                  }
                }
              },
              "required": ["query"]
            }
          }
        }
      }'
    ```

    이렇게 하면 다음과 같은 도구가 생성됩니다:

    * `query` — 대화 컨텍스트를 바탕으로 LLM이 채웁니다
    * `type: "instant"` — Exa의 가장 빠른 search mode를 사용합니다(~150ms)
    * `numResults: 5` — search 한 번에 결과 5개를 반환합니다
    * `contents.highlights: true` — 토큰 효율이 좋은 highlights 스니펫을 반환합니다(음성 latency에 가장 유리)

    반환된 `id`는 저장해 두세요. 도구를 agent에 연결할 때 필요합니다.

    <Note>
      이미 agent가 있다면 2단계를 건너뛰고, ElevenLabs dashboard의 **Agent &gt; Tools**에서 또는 [Update Agent API](https://elevenlabs.io/docs/api-reference/agents/update)를 통해 기존 agent에 도구를 추가하면 됩니다. 도구는 agent에 attach되기 전까지는 아무 동작도 하지 않습니다.
    </Note>
  </Step>

  <Step title="도구를 포함한 agent 만들기">
    대화형 agent를 만들고 webhook 도구를 ID로 attach하세요.

    ```bash bash theme={null}
    curl -s -X POST "https://api.elevenlabs.io/v1/convai/agents/create" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Exa Search Assistant",
        "conversation_config": {
          "agent": {
            "prompt": {
              "prompt": "You are a helpful voice assistant with real-time web search powered by Exa. When users ask questions that need current information, use the web_search tool.\n\nGuidelines:\n- Search proactively for time-sensitive or factual questions.\n- Summarize results conversationally — do not read URLs aloud.\n- Cite sources naturally.\n- Keep responses concise — this is voice.",
              "tool_ids": ["YOUR_TOOL_ID"]
            },
            "first_message": "Hey! I can search the web for you in real-time. What would you like to know?"
          }
        }
      }'
    ```

    response에는 `agent_id`가 포함됩니다. ElevenLabs dashboard에서 해당 agent를 열어 테스트해 보세요:

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="위젯 임베드하기">
    HTML 두 줄이면 어떤 웹페이지에든 agent를 추가할 수 있습니다:

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

<div id="full-python-example">
  ## 전체 Python 예제
</div>

이 스크립트는 한 번의 실행으로 webhook 도구와 agent를 모두 생성합니다:

```python python theme={null}
import os
import requests

ELEVENLABS_API_KEY = os.environ["ELEVENLABS_API_KEY"]
EXA_API_KEY = os.environ["EXA_API_KEY"]
BASE = "https://api.elevenlabs.io/v1/convai"
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json"}

# 1. webhook 도구 생성
tool_resp = requests.post(f"{BASE}/tools", headers=HEADERS, json={
    "tool_config": {
        "type": "webhook",
        "name": "web_search",
        "description": (
            "Search the web using Exa. Use this when the user asks anything "
            "that needs current or factual information."
        ),
        "api_schema": {
            "url": "https://api.exa.ai/search",
            "method": "POST",
            "request_headers": {
                "x-api-key": EXA_API_KEY,
                "Content-Type": "application/json",
                "x-exa-integration": "elevenlabs",
            },
            "request_body_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Natural language search query. Be specific.",
                    },
                    "type": {"type": "string", "constant_value": "instant"},
                    "numResults": {"type": "integer", "constant_value": 5},
                    "contents": {
                        "type": "object",
                        "properties": {
                            "highlights": {
                                "type": "boolean",
                                "constant_value": True,
                            }
                        },
                    },
                },
                "required": ["query"],
            },
        },
    }
})
tool_resp.raise_for_status()
tool_id = tool_resp.json()["id"]
print(f"Tool created: {tool_id}")

# 2. agent 생성
agent_resp = requests.post(f"{BASE}/agents/create", headers=HEADERS, json={
    "name": "Exa Search Assistant",
    "conversation_config": {
        "agent": {
            "prompt": {
                "prompt": (
                    "You are a helpful voice assistant with real-time web search "
                    "powered by Exa. When users ask questions that need current "
                    "information, use the web_search tool.\n\n"
                    "Guidelines:\n"
                    "- Search proactively for time-sensitive or factual questions.\n"
                    "- Summarize results conversationally — do not read URLs aloud.\n"
                    "- Cite sources naturally.\n"
                    "- Keep responses concise — this is voice."
                ),
                "tool_ids": [tool_id],
            },
            "first_message": "Hey! I can search the web for you. What would you like to know?",
        }
    },
})
agent_resp.raise_for_status()
agent_id = agent_resp.json()["agent_id"]
print(f"Agent created: {agent_id}")
print(f"Dashboard: https://elevenlabs.io/app/conversational-ai/agents/{agent_id}")
```

실행하기:

```bash bash theme={null}
export ELEVENLABS_API_KEY="your-key"
export EXA_API_KEY="your-key"
python elevenlabs_exa_webhook.py
```

<div id="customizing-search-parameters">
  ## search parameters 커스터마이징
</div>

webhook 도구의 body schema는 [Exa의 Search API](/ko/docs/reference/search)와 직접 매핑됩니다. 자주 사용하는 구성은 다음과 같습니다:

<div id="search-type">
  ### Search type
</div>

`type` 상수로 속도와 품질 간의 균형을 조절하세요:

| Type      | Latency | 적합한 용도    |
| --------- | ------- | --------- |
| `instant` | ~150ms  | 음성 대화(권장) |
| `auto`    | ~1s     | 일반적인 용도   |

voice agent에는 `instant`로 시작하는 것이 좋습니다. 각 질의에 가장 적합한 search mode를 Exa가 알아서 선택하도록 하려면 `auto`를 사용하세요.

<div id="content-options">
  ### Content options
</div>

`contents` 객체를 통해 결과를 반환하는 방식을 선택하세요:

```json json theme={null}
{
  "contents": {
    "type": "object",
    "properties": {
      "highlights": {
        "type": "boolean",
        "constant_value": true
      }
    }
  }
}
```

* **`highlights`** — 토큰 효율적인 발췌문입니다. LLM 컨텍스트를 과도하게 차지하지 않으면서 관련 있는 스니펫만 얻고 싶을 때 사용하세요. 가장 높은 품질의 기본 동작을 원하면 `true`를 전달하세요.
* **`text`** — 전체 페이지 마크다운입니다. agent가 페이지 콘텐츠 전체를 필요로 할 때 사용하세요. 길이를 제한하려면 `maxCharacters`를 설정하세요.
* **`summary`** — 각 페이지에 대해 LLM이 생성한 summary입니다. latency는 더 높지만 종합된 콘텐츠를 제공합니다.

voice agent에는 `highlights: true`를 기본값으로 권장합니다. 관련성과 응답 속도의 균형이 가장 좋습니다.

<div id="filtering-results">
  ### 결과 필터링
</div>

도메인 또는 날짜 필터를 상수로 추가하세요:

```json json theme={null}
{
  "includeDomains": {
    "type": "array",
    "constant_value": ["reuters.com", "apnews.com", "bbc.com"]
  }
}
```

```json json theme={null}
{
  "startPublishedDate": {
    "type": "string",
    "constant_value": "2025-01-01T00:00:00.000Z"
  }
}
```

<div id="number-of-results">
  ### 결과 개수
</div>

사용 사례에 맞춰 `numResults`를 조정하세요. 음성의 경우 결과 3~5개면 응답을 빠르게 유지할 수 있습니다. 리서치 중심 agent라면 10개 이상으로 더 폭넓게 다룰 수 있습니다.

<div id="schema-reference">
  ## Schema reference
</div>

ElevenLabs의 webhook 도구는 다음 속성 유형을 갖는 JSON schema를 사용합니다:

* **`constant_value`** — 모든 요청에 전송되는 고정 값입니다. LLM은 이 값을 보거나 수정할 수 없습니다. 문자열, 숫자, 불리언에 사용할 수 있습니다.
* **`description`** — LLM이 이 설명을 바탕으로 런타임에 값을 결정합니다. `query`처럼 동적인 parameters에 사용하세요.
* **중첩 객체** — `contents.highlights`와 같은 중첩 구조를 만들려면 `properties`와 함께 `type: "object"`를 사용하세요.

각 매개변수에는 dashboard에서 **Fixed** 또는 **LLM** 모드를 전환하는 토글이 있습니다:

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="Fixed와 LLM 모드 토글을 보여주는 ElevenLabs webhook 도구 매개변수 구성" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

**Fixed**로 설정된 parameters(API에서 `constant_value`로 표시됨)는 모든 요청에 그대로 전송됩니다. **LLM**으로 설정된 parameters(`description`으로 표시됨)는 모델이 런타임에 값을 선택합니다. 가능한 한 많은 parameters를 Fixed로 유지하세요. LLM이 결정하는 매개변수마다 도구 호출 단계가 추가되어 response latency가 증가합니다.

전체 ElevenLabs webhook tool schema는 [ElevenLabs server tools 문서](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools)를 참고하세요.

<div id="built-in-exa-integration-alpha">
  ## Built-in Exa integration (alpha)
</div>

ElevenLabs는 agent dashboard의 **Tools &gt; Integrations**에서 사용할 수 있는 내장 Exa 연동도 제공합니다. 설정은 더 간단하지만, webhook 도구 방식에 비해 search parameters를 커스터마이징하기는 더 어렵습니다.

search type, content options, filtering를 완전히 제어하려면 위에서 설명한 webhook 도구 방식을 권장합니다.