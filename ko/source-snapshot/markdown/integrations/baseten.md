> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="baseten">
  # Baseten
</div>

> Baseten Hosted Tools를 통해 Exa web search로 Baseten Model APIs의 오픈소스 모델에 grounded 근거를 더하세요.

Exa는 [Baseten Hosted Tools](https://www.baseten.co/blog/introducing-baseten-hosted-tools/)에서 제공되는 web search 제공자입니다. Baseten Model APIs는 오픈소스 모델을 서빙하며, Hosted Tools를 사용하면 도구 루프를 직접 구성하지 않아도 이러한 모델이 웹을 검색할 수 있습니다. 표준 요청에 Exa 도구 셀렉터를 추가하기만 하면, Baseten이 서버 측 루프에서 모델과 Exa search를 함께 실행해 하나의 응답으로 grounded answer를 반환합니다. Exa API key는 필요하지 않습니다. Baseten은 Exa의 cost를 마크업 없이 그대로 Baseten 청구서에 반영합니다.

<div id="use-the-exa-web-search-tools">
  ## Exa web search 도구 사용하기
</div>

`x-baseten-server-tools: true` header를 설정하고 `tools` 배열에 Exa selector를 하나 이상 추가하세요. `type`만 지정하면 됩니다. 도구 schema는 Baseten이 자동으로 확장하고, 언제 search할지, 무엇을 search할지, 어떤 페이지를 읽을지는 모델이 결정합니다. server-side tools는 Baseten의 [Chat Completions](https://docs.baseten.co/reference/inference-api/chat-completions), [Messages](https://docs.baseten.co/reference/inference-api/messages), Responses endpoint에서 버퍼 방식과 스트리밍 방식 모두 동작합니다.

<CodeGroup>
  ```python Python theme={null}
  from openai import OpenAI

  client = OpenAI(
      api_key="<BASETEN_API_KEY>",
      base_url="https://inference.baseten.co/v1",
      default_headers={"x-baseten-server-tools": "true"},
  )

  response = client.chat.completions.create(
      model="zai-org/GLM-5.3-Fast",
      messages=[
          {"role": "user", "content": "What were the major AI announcements this week?"}
      ],
      tools=[
          {"type": "baseten__exa__web_search_exa"},
          {"type": "baseten__exa__web_fetch_exa"},
      ],
      extra_body={"baseten": {"tool_settings": {"max_react_iterations": 5}}},
  )

  print(response.choices[0].message.content)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const client = new OpenAI({
    apiKey: "<BASETEN_API_KEY>",
    baseURL: "https://inference.baseten.co/v1",
    defaultHeaders: { "x-baseten-server-tools": "true" },
  });

  const response = await client.chat.completions.create({
    model: "zai-org/GLM-5.3-Fast",
    messages: [
      { role: "user", content: "What were the major AI announcements this week?" },
    ],
    tools: [
      { type: "baseten__exa__web_search_exa" },
      { type: "baseten__exa__web_fetch_exa" },
    ],
    baseten: { tool_settings: { max_react_iterations: 5 } },
  });

  console.log(response.choices[0].message.content);
  ```

  ```bash cURL theme={null}
  curl https://inference.baseten.co/v1/chat/completions \
    -H "Authorization: Bearer <BASETEN_API_KEY>" \
    -H "Content-Type: application/json" \
    -H "x-baseten-server-tools: true" \
    -d '{
      "model": "zai-org/GLM-5.3-Fast",
      "messages": [
        { "role": "user", "content": "What were the major AI announcements this week?" }
      ],
      "tools": [
        { "type": "baseten__exa__web_search_exa" },
        { "type": "baseten__exa__web_fetch_exa" }
      ],
      "baseten": { "tool_settings": { "max_react_iterations": 5 } }
    }'
  ```
</CodeGroup>

사용할 수 있는 Exa 도구는 세 가지입니다. 모델이 출처를 찾은 뒤 직접 고른 페이지를 읽게 하려면 search와 fetch를 함께 제공하세요.

| Selector                                | 모델이 얻는 것                                                          |
| --------------------------------------- | ----------------------------------------------------------------- |
| `baseten__exa__web_search_exa`          | [Exa search](/ko/docs/search/quickstart): 질의에 대한 관련 결과와 page content |
| `baseten__exa__web_search_advanced_exa` | 도메인 필터, 하위 페이지 크롤링, 결과별 선택적 summary를 지원하는 search                  |
| `baseten__exa__web_fetch_exa`           | 모델이 이미 확보한 URL의 [전체 page contents](/ko/docs/contents/quickstart)     |

Selector에는 추가 필드가 필요 없으며, 도구 인자는 모델이 Exa의 schema에 따라 채웁니다. 언제 search할지, 1차 출처를 fetch할지, 어떻게 인용할지 등 search 정책을 조정하려면 system prompt를 사용하세요. 루프 범위를 제한하려면 `baseten.tool_settings`를 사용합니다.

| 설정                             | 용도                                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `max_react_iterations`         | 요청당 모델 반복 횟수를 제한합니다(기본값 12, 범위 2~20). 마지막 반복은 답변용으로 예약되므로 `N`을 지정하면 도구 call은 `N - 1`회까지 수행됩니다. |
| `max_tool_calls_per_iteration` | 한 번의 반복에서 수행할 server-side tool call 수를 제한합니다(기본값 10, 범위 1~10)                                  |

<div id="how-results-come-back">
  ## 결과가 반환되는 방식
</div>

최종 답변은 endpoint의 일반 필드를 통해 전달됩니다. 완료된 Exa 호출은 프로토콜별로 기록됩니다. Messages에서는 `tool_use` 및 `tool_result` 블록에, Responses에서는 `mcp_call` 항목에, Chat Completions에서는 `baseten.iterations[].continuation_messages`에 기록됩니다. streaming 요청의 경우 루프가 도는 동안 각 search 호출과 그 결과가 server-sent events로 전달되므로, 최종 답변이 나오기 전에 진행 상황을 보여줄 수 있습니다. `baseten.request.server_tool_calls[]` 배열에는 해당 요청에서 이루어진 모든 Exa 호출의 결과가 담깁니다.

<div id="pricing">
  ## 가격
</div>

Exa 호출은 모델의 토큰 비용과 별개로, 마크업 없이 Exa 요율 그대로 Baseten 계정에 청구됩니다. 대략 검색 1건당 $0.007, 가져온 URL 1건당 $0.001입니다. Exa는 각 호출의 요금을 런타임에 보고하므로 개별 호출은 이 수치와 다를 수 있습니다. 청구된 도구 call은 Baseten 워크스페이스 설정의 Billing → Usage에서 제공자별로 묶여 표시됩니다. 최신 요율은 [Baseten 가격표](https://docs.baseten.co/inference/model-apis/web-search#pricing)를 참고하세요.

Hosted Tools는 Baseten에서 얼리 액세스 단계이며, 조직당 분당 25건의 요청 제한이 적용됩니다. [Baseten 플레이그라운드](https://app.baseten.co/model-apis/zai-org/GLM-5.3-Fast/playground)에서 Exa search을 사용해 보거나, 프로덕션 워크로드를 위해 제한 상향이 필요하면 Baseten에 문의하세요.

<div id="resources">
  ## 리소스
</div>

<Columns cols={2}>
  <Card title="Baseten web search 문서" icon="wrench" href="https://docs.baseten.co/inference/model-apis/web-search" cta="문서 열기" arrow="true">
    server-side tool를 사용하는 실행 가능한 Messages, Responses, Chat Completions 예제입니다.
  </Card>

  <Card title="server-side tool 레퍼런스" icon="book-open" href="https://docs.baseten.co/reference/inference-api/server-side-tool-execution" cta="레퍼런스 열기" arrow="true">
    도구 카탈로그, 루프 설정, `tool_choice` 형식, 응답 구조를 다룹니다.
  </Card>
</Columns>