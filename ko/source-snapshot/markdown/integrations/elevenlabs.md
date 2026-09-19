> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="elevenlabs">
  # ElevenLabs
</div>

> ElevenLabs voice agent에 Exa web search를 추가하세요.

***

ElevenLabs voice agent는 Exa를 **webhook tool**로 사용해 대화 도중 웹을 search할 수 있습니다. agent가 최신 정보가 필요하다고 판단하면 ElevenLabs가 Exa의 `/search` endpoint로 직접 HTTP POST를 보냅니다 — 사용자 측에 별도의 서버나 미들웨어는 필요하지 않습니다.

Exa를 ElevenLabs에 연결하는 방법은 두 가지입니다:

| 방식                                | 설정                               | 유연성                                             |
| --------------------------------- | -------------------------------- | ----------------------------------------------- |
| **Webhook tool** (권장)             | API 또는 dashboard에서 configuration | search 파라미터, content options, header를 완전히 제어 가능 |
| **Built-in Exa integration** (알파) | ElevenLabs dashboard에서 원클릭       | 더 간단하지만 configuration이 제한적                      |

이 가이드에서는 Exa 호출 방식을 완전히 제어할 수 있는 webhook tool 방식을 다룹니다. [ElevenLabs dashboard](https://elevenlabs.io/app/conversational-ai)에서 통합을 configuration할 수도 있습니다.

<div id="how-it-works">
  ## 작동 방식
</div>

1. 사용자가 voice agent에게 말합니다
2. LLM이 도구 설명을 바탕으로 `web_search` 호출을 결정합니다
3. ElevenLabs가 설정한 header와 본문을 담아 `https://api.exa.ai/search`로 POST 요청을 보냅니다
4. LLM이 결정한 매개변수(검색 `query`)가 지정해 둔 상수 값(`type`, `numResults`, `contents`)과 병합됩니다
5. Exa 결과가 LLM으로 전달되고, LLM이 대화 형식으로 응답합니다

서버도, 콜백 URL도, 리스너도 필요 없습니다. ElevenLabs가 Exa를 직접 호출하는 HTTP 클라이언트 역할을 합니다. 도구 호출의 제한 시간은 20초입니다.

<div id="prerequisites">
  ## 사전 준비
</div>

* [Exa API 키](https://dashboard.exa.ai/api-keys)
* [ElevenLabs API 키](https://elevenlabs.io/app/settings/api-keys)

<Card title="Exa API 키 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 크레딧이 제공됩니다.
</Card>

<div id="get-started">
  ## 시작하기
</div>

<Steps>
  <Step title="webhook tool 만들기">
    ElevenLabs의 [Create Tool API](https://elevenlabs.io/docs/api-reference/tools/create)를 사용해 Exa의 search endpoint를 가리키는 webhook tool을 등록합니다.

    핵심 개념은 다음과 같습니다. `constant_value`가 지정된 속성은 고정값으로 모든 요청에 함께 전송되고, `description`이 지정된 속성은 실행 시점에 LLM이 값을 결정합니다.

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

    이렇게 하면 다음과 같이 동작하는 도구가 생성됩니다.

    * `query` — 대화 맥락에 따라 LLM이 채웁니다
    * `type: "instant"` — Exa에서 가장 빠른 search mode를 사용합니다(약 150ms)
    * `numResults: 5` — search 한 번에 결과 5개를 반환합니다
    * `contents.highlights: true` — 토큰 효율이 높은 highlights 스니펫을 반환합니다(음성 지연 시간 측면에서 가장 유리)

    반환된 `id`는 도구를 agent에 연결할 때 필요하니 저장해 두세요.

    <Note>
      이미 agent가 있다면 2단계를 건너뛰고, ElevenLabs dashboard의 **Agent &gt; Tools**에서 또는 [Update Agent API](https://elevenlabs.io/docs/api-reference/agents/update)를 통해 기존 agent에 도구를 추가하면 됩니다. 도구는 agent에 attach되기 전까지는 아무 동작도 하지 않습니다.
    </Note>
  </Step>

  <Step title="도구를 연결한 agent 만들기">
    대화형 agent를 만들고 webhook tool을 ID로 attach합니다.

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

    응답에는 `agent_id`가 포함됩니다. ElevenLabs dashboard에서 해당 agent를 열어 테스트해 보세요.

    ```text theme={null}
    https://elevenlabs.io/app/conversational-ai/agents/YOUR_AGENT_ID
    ```
  </Step>

  <Step title="위젯 임베드하기">
    HTML 두 줄만 추가하면 어떤 웹페이지에든 agent를 넣을 수 있습니다.

    ```html html theme={null}
    <elevenlabs-convai agent-id="YOUR_AGENT_ID"></elevenlabs-convai>
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async></script>
    ```
  </Step>
</Steps>

<div id="full-python-example">
  ## 전체 Python 예제
</div>

이 스크립트는 한 번의 실행으로 webhook tool과 agent를 모두 생성합니다:

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

webhook tool의 본문 schema는 [Exa의 Search API](/ko/docs/reference/search)와 직접 매핑됩니다. 자주 사용되는 configuration은 다음과 같습니다:

<div id="search-type">
  ### search type
</div>

`type` 상수로 속도와 품질 간의 균형을 조절합니다:

| 타입        | 지연 시간  | 적합한 용도     |
| --------- | ------ | ---------- |
| `instant` | ~150ms | 음성 대화 (권장) |
| `auto`    | ~1s    | 일반적인 용도    |

voice agent에서는 `instant`로 시작하세요. 각 질의에 대해 Exa가 현재 가장 적합한 search mode를 선택하도록 하려면 `auto`를 사용하세요.

<div id="content-options">
  ### content options
</div>

`contents` 객체로 결과를 반환하는 방식을 선택하세요:

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

* **`highlights`** — 토큰 효율이 높은 발췌문입니다. LLM 컨텍스트를 과도하게 채우지 않으면서 관련 스니펫만 얻고 싶을 때 사용하세요. 최고 품질의 기본값을 쓰려면 `true`를 전달하세요.
* **`text`** — 전체 페이지 마크다운입니다. agent에 완전한 페이지 콘텐츠가 필요할 때 사용하세요. 길이를 제한하려면 `maxCharacters`를 설정하세요.
* **`summary`** — 각 페이지를 LLM이 요약한 결과입니다. 지연 시간은 더 길지만 종합된 콘텐츠를 제공합니다.

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

사용 사례에 맞게 `numResults`를 조정하세요. 음성의 경우 결과 3~5개면 응답 속도를 빠르게 유지할 수 있습니다. 리서치 중심 agent라면 10개 이상으로 설정해 더 폭넓은 범위를 확보할 수 있습니다.

<div id="schema-reference">
  ## 스키마 참조
</div>

ElevenLabs webhook tool은 다음 속성 유형으로 구성된 JSON 스키마를 사용합니다:

* **`constant_value`** — 모든 요청에 전송되는 고정 값입니다. LLM은 이 값을 보거나 수정할 수 없습니다. 문자열, 숫자, 불리언에 사용할 수 있습니다.
* **`description`** — LLM이 이 설명을 바탕으로 런타임에 값을 결정합니다. `query`처럼 동적인 parameters에 사용하세요.
* **중첩 객체** — `contents.highlights`와 같은 중첩 구조를 만들려면 `type: "object"`와 `properties`를 사용하세요.

각 parameters에는 dashboard에서 **Fixed** 또는 **LLM** 모드 토글이 있습니다:

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/elevenlabs/parameters.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=618ca64cac86308c571a8268f48342a5" alt="Fixed와 LLM 모드 토글을 보여주는 ElevenLabs webhook tool parameters 설정" width="1692" height="898" data-path="images/integrations/elevenlabs/parameters.png" />
</Frame>

**Fixed**로 설정된 parameters(API에서는 `constant_value`로 표시)는 모든 요청에 그대로 전송됩니다. **LLM**으로 설정된 parameters(`description`으로 표시)는 모델이 런타임에 값을 선택합니다. 가능한 한 많은 parameters를 Fixed로 두세요. LLM이 값을 결정하는 parameters는 하나마다 도구 호출 단계가 추가되어 응답 지연이 늘어납니다.

전체 ElevenLabs webhook tool 스키마는 [ElevenLabs 서버 도구 문서](https://elevenlabs.io/docs/conversational-ai/customization/tools/server-tools)를 참고하세요.

<div id="built-in-exa-integration-alpha">
  ## Built-in Exa integration (알파)
</div>

ElevenLabs는 agent dashboard의 **Tools &gt; Integrations**에서 사용할 수 있는 Built-in Exa integration도 제공합니다. 설정이 더 간단하지만, webhook tool 방식에 비해 search parameters를 세부적으로 맞춤 설정하기는 더 어렵습니다.

search type, content options, 필터링을 완벽하게 제어하려면 위에서 설명한 webhook tool 방식을 사용하는 것이 좋습니다.