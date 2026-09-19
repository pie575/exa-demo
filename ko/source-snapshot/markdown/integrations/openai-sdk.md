> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="openai-sdk-compatibility">
  # OpenAI SDK 호환성
</div>

> Exa의 endpoint를 OpenAI의 드롭인 대체재로 사용하세요. chat completions와 responses API를 모두 지원합니다.

<Card title="코딩 에이전트 Quickstart" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa가 처음이신가요? 1분 안에 시작할 수 있습니다.
</Card>

***

<div id="overview">
  ## 개요
</div>

Exa는 OpenAI SDK와 함께 사용할 수 있는 OpenAI 호환 endpoint를 제공합니다:

| Endpoint            | OpenAI 인터페이스         | 사용 가능한 모델   | 사용 사례                                   |
| ------------------- | -------------------- | ----------- | --------------------------------------- |
| `/chat/completions` | Chat Completions API | `exa`       | 일반적인 채팅 인터페이스                           |
| `/responses`        | Responses API        | `exa-agent` | Agent API (비동기 리서치, Enrichment, 리스트 구축) |

<Info>
  `/chat/completions`는 [`/answer`](/ko/docs/reference/answer)로, `/responses`는 [Agent API](/ko/docs/agent/quickstart)로 라우팅됩니다. 아래 [Responses API로 Agent 사용하기](#agent-via-responses-api)를 참고하세요.
</Info>

<div id="answer">
  ## Answer
</div>

chat completions 인터페이스를 통해 Exa의 `/answer` endpoint를 사용하려면:

1. base URL을 `https://api.exa.ai`로 변경합니다
2. API key를 Exa API key로 변경합니다
3. 모델 이름을 `exa`로 변경합니다.

<Info>
  전체 [`/answer`](/ko/docs/reference/answer) endpoint 레퍼런스를 참고하세요. 라우팅 동작을 커스터마이징하려면 [hello@exa.ai](mailto:hello@exa.ai)로 문의해 주세요.
</Info>

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
    base_url="https://api.exa.ai", # exa를 base url로 사용
    api_key=os.environ["EXA_API_KEY"],
  )

  completion = client.chat.completions.create(
    model="exa",
    messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ],

  # extra_body를 사용해 /answer endpoint에 추가 파라미터 전달
    extra_body={
      "text": True # 소스의 전체 텍스트 포함
    }
  )

  print(completion.choices[0].message.content)  # 응답 내용 출력
  print(completion.choices[0].message.citations)  # citations 출력
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai", // exa를 base url로 사용
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: "exa",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "What are the latest developments in quantum computing?",
        },
      ],
      store: true,
      stream: true,
      extra_body: {
        text: true, // 소스의 전체 텍스트 포함
      },
    });

    for await (const chunk of completion) {
      console.log(chunk.choices[0].delta.content);
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s https://api.exa.ai/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "model": "exa",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant."
        },
        {
          "role": "user",
          "content": "What are the latest developments in quantum computing?"
        }
      ],
      "text": true
    }'
  ```
</CodeGroup>

<div id="agent-via-responses-api">
  ## Responses API를 통한 Agent
</div>

Exa의 [`/responses`](https://api.exa.ai/responses) endpoint는 [Agent API](/ko/docs/agent/quickstart)를 OpenAI Responses 인터페이스로 노출하므로, OpenAI SDK를 수정 없이 그대로 사용할 수 있습니다. `model: "exa-agent"`를 설정하고 실행 모드를 선택하세요:

| 모드         | 요청                             | 동작                                                                          |
| ---------- | ------------------------------ | --------------------------------------------------------------------------- |
| 동기         | 기본값 (`stream`/`background` 없음) | 요청이 블로킹되며 완료된 `response` 객체를 반환합니다.                                         |
| Streaming  | `stream: true`                 | 실행이 진행되는 동안 OpenAI Responses 이벤트(SSE)를 스트리밍하며, `response.completed`로 종료됩니다. |
| Background | `background: true`             | 요청이 `in_progress` 응답과 함께 즉시 반환됩니다. 결과는 `GET /responses/{id}`를 poll하여 확인하세요. |

`reasoning.effort`(`minimal`, `low`, `medium`, `high`, `xhigh`, `auto`, `max`)를 설정해 cost와 깊이를 조절하고, `POST /responses/{id}/cancel`로 실행을 취소할 수 있습니다. `max`를 사용하려면 클라이언트 기본 header로 `Exa-Beta: agent-max-effort-2026-07-27`를 설정하세요. 이 인터페이스의 기반이 되는 실행 모델, output 형태, effort 가격 정책은 [Agent 가이드](/ko/docs/agent/quickstart)에서 다룹니다.

<Warning>
  `reasoning.effort`가 `high`, `xhigh`, `max`인 실행은 동기 요청으로 처리하기에는 너무 오래 걸려 `400`을 반환합니다. 이러한 실행에는 `stream: true` 또는 `background: true`를 사용하세요. `/responses`에는 `budget` 필드가 없으며, max는 실행당 기본 상한을 사용합니다.
</Warning>

완료된 Responses 실행을 이어가려면 `previous_response_id`를 사용하세요.

<div id="synchronous">
  ### 동기 방식
</div>

실행이 완료될 때까지 요청이 블로킹되며, 최종 상태의 `response` 객체를 반환합니다.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning={"effort": "medium"},
  )

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      reasoning: { effort: "medium" },
    });

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "reasoning": { "effort": "medium" }
    }'
  ```
</CodeGroup>

<div id="streaming">
  ### Streaming
</div>

SSE로 Responses 스트림 이벤트를 받으려면 `stream: true`로 설정하세요. 각 이벤트에는 단조 증가하는 `sequence_number`가 포함되며, 스트림은 `response.completed`로 종료됩니다. `[DONE]` 센티널은 없습니다. 스트림에 `: keep-alive` 주석 줄이 포함될 수 있는데, SSE 클라이언트는 이를 무시합니다.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  with client.responses.stream(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
  ) as stream:
      for event in stream:
          if event.type == "response.output_text.delta":
              print(event.delta, end="", flush=True)
      final = stream.get_final_response()

  print("\n\n", final.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    const stream = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      stream: true,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
      }
    }
  }

  main();
  ```

  ```bash cURL theme={null}
  curl -N -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -H 'Accept: text/event-stream' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "stream": true
    }'
  ```
</CodeGroup>

<div id="background">
  ### Background
</div>

`background: true`로 설정하면 연결을 유지하지 않은 채 실행을 시작할 수 있습니다. 이후 `GET /responses/{id}`를 poll하여 종료 상태에 도달할 때까지 확인하세요. poll 대신 스트리밍을 사용하려면 [Streaming](#streaming)을 참고하세요.

<CodeGroup>
  ```python Python theme={null}
  import os
  import time
  from openai import OpenAI

  client = OpenAI(
      base_url="https://api.exa.ai",
      api_key=os.environ["EXA_API_KEY"],
  )

  response = client.responses.create(
      model="exa-agent",
      input="Find the top 5 AI startups founded in 2025 with their funding amounts",
      background=True,
  )

  # 완료될 때까지 poll
  while response.status in ("queued", "in_progress"):
      time.sleep(5)
      response = client.responses.retrieve(response.id)

  print(response.output_text)
  ```

  ```javascript JavaScript theme={null}
  import OpenAI from "openai";

  const openai = new OpenAI({
    baseURL: "https://api.exa.ai",
    apiKey: process.env.EXA_API_KEY,
  });

  async function main() {
    let response = await openai.responses.create({
      model: "exa-agent",
      input: "Find the top 5 AI startups founded in 2025 with their funding amounts",
      background: true,
    });

    // 완료될 때까지 poll
    while (response.status === "queued" || response.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 5000));
      response = await openai.responses.retrieve(response.id);
    }

    console.log(response.output_text);
  }

  main();
  ```

  ```bash cURL theme={null}
  # background 실행 생성
  curl -s -X POST 'https://api.exa.ai/responses' \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H 'Content-Type: application/json' \
    -d '{
      "model": "exa-agent",
      "input": "Find the top 5 AI startups founded in 2025 with their funding amounts",
      "background": true
    }'

  # 반환된 응답 ID로 poll
  curl -s 'https://api.exa.ai/responses/resp_agent_run_...' \
    -H "Authorization: Bearer $EXA_API_KEY"
  ```
</CodeGroup>

<div id="chat-wrapper">
  ## Chat wrapper
</div>

Exa는 모든 OpenAI chat completion에 RAG 기능을 자동으로 더해주는 Python 래퍼를 제공합니다. 코드 한 줄이면 어떤 OpenAI chat completion이든 search, 청킹, prompt 구성을 자동으로 처리하는 Exa 기반 RAG 시스템으로 바꿀 수 있습니다.

<CodeGroup>
  ```python Python theme={null}
  import os
  from openai import OpenAI
  from exa_py import Exa

  # 클라이언트 초기화
  openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
  exa = Exa(api_key=os.environ["EXA_API_KEY"])

  # OpenAI 클라이언트 래핑
  exa_openai = exa.wrap(openai)

  # 일반 OpenAI 클라이언트와 동일하게 사용
  completion = exa_openai.chat.completions.create(
      model="gpt-5.6-sol",
      messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

래핑된 클라이언트는 기본 OpenAI 클라이언트와 완전히 동일하게 동작하며, 필요할 때 관련 search 결과로 completion을 자동으로 보강한다는 점만 다릅니다.

이 래퍼는 `exa.search()` 함수의 모든 파라미터를 지원합니다.

```python theme={null}
completion = exa_openai.chat.completions.create(
    model="gpt-5.6-sol",
    messages=messages,
    use_exa="auto",              # "auto", "required" 또는 "none"
    num_results=5,               # 기본값 3
    result_max_len=1024,         # 기본값 2048자
    include_domains=["arxiv.org"],
    category="publication",
    start_published_date="2019-01-01"
)
```