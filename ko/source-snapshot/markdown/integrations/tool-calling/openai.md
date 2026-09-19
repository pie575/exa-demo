> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="openai-tool-calling">
  # OpenAI Tool Calling
</div>

> OpenAI tool calling으로 Exa web search와 page contents를 애플리케이션에 추가하세요.

<Info>
  OpenAI는 모든 신규 프로젝트에 Responses API 사용을 권장합니다. 아래 [Responses API](#responses-api) 섹션을 참고하세요.
</Info>

OpenAI의 [tool calling](https://platform.openai.com/docs/guides/function-calling?lang=python)을 사용하면 모델이 코드에 정의한 함수를 호출할 수 있습니다. Exa SDK에는 OpenAI용 web search 및 페이지 읽기 도구가 기본 제공되므로, tool schema를 직접 작성하거나 tool call을 파싱하거나 Exa 결과를 직접 포맷팅할 필요가 없습니다.

<div id="get-started">
  ## 시작하기
</div>

<Steps>
  <Step title="SDK 설치">
    <CodeGroup>
      ```bash Python theme={null}
      pip install openai exa_py
      ```

      ```bash JavaScript theme={null}
      npm install openai exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="API key 설정">
    `EXA_API_KEY`와 `OPENAI_API_KEY` 환경 변수를 설정하세요. [OpenAI dashboard](https://platform.openai.com/api-keys)와 [Exa dashboard](https://dashboard.exa.ai/api-keys)에서 API key를 발급받을 수 있습니다.

    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Step>

  <Step title="tool 루프에 Exa 도구 추가하기">
    요청의 `tools` 목록에 도구를 전달한 다음, assistant 메시지를 `handle_tool_calls`에 넘기세요. 메시지에 포함된 모든 Exa tool call을 실행하고, 대화에 그대로 추가할 수 있는 `role: "tool"` 메시지를 반환합니다.

    `web_search`는 모델이 아직 보지 못한 페이지를 웹에서 search하고, `get_contents`는 이전 search에서 얻었든 사용자가 제공했든 이미 URL을 알고 있는 페이지를 읽습니다. 둘 중 하나만 등록해도 되고, 둘 다 등록해도 됩니다.

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # 환경 변수에서 EXA_API_KEY를 읽습니다
      openai_client = OpenAI()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
          tools=[exa.openai.web_search(), exa.openai.get_contents()],
      )

      message = completion.choices[0].message
      messages.append(message)
      messages += exa.openai.handle_tool_calls(message)

      completion = openai_client.chat.completions.create(
          model="gpt-5.6",
          reasoning_effort="none",
          messages=messages,
      )
      print(completion.choices[0].message.content)
      ```

      ```javascript JavaScript theme={null}
      import Exa from "exa-js";
      import { OpenAI } from "openai";

      const exa = new Exa(); // 환경 변수에서 EXA_API_KEY를 읽습니다
      const openai = new OpenAI();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
        tools: [exa.openai.webSearch(), exa.openai.getContents()],
      });

      const message = completion.choices[0].message;
      messages.push(message, ...(await exa.openai.handleToolCalls(message)));

      completion = await openai.chat.completions.create({
        model: "gpt-5.6",
        reasoning_effort: "none",
        messages,
      });
      console.log(completion.choices[0].message.content);
      ```
    </CodeGroup>

    위 예시는 간결함을 위해 한 라운드만 보여줍니다. 실제 agent는 모든 요청에 `tools`를 포함하고, 모델이 tool call 없이 응답할 때까지 handler 단계를 반복합니다. 이렇게 해야 search 결과가 후속 페이지 읽기로 이어집니다.

    factory를 인자 없이 호출하면 Exa의 권장 기본값이 적용됩니다. search의 경우 `type="auto"`와 `contents={"highlights": True}`입니다. highlights는 query와 관련된 excerpt를 반환할 뿐, 페이지 텍스트를 10,000자로 제한하지는 않습니다. contents factory는 페이지 텍스트를 반환하며, SDK의 10,000자 limit은 `text`에만, 그리고 `max_characters`를 생략한 경우에만 적용됩니다.
  </Step>
</Steps>

<div id="responses-api">
  ## Responses API
</div>

OpenAI Responses API에서는 동일한 `handle_tool_calls` 헬퍼와 함께 `responses` factory를 사용하세요. handler는 후속 요청에 사용할 `function_call_output` 항목을 반환합니다.

<CodeGroup>
  ```python Python theme={null}
  response = openai_client.responses.create(
      model="gpt-5.6",
      input=messages,
      tools=[exa.openai.responses.web_search(), exa.openai.responses.get_contents()],
  )

  messages += response.output
  messages += exa.openai.responses.handle_tool_calls(response)
  ```

  ```javascript JavaScript theme={null}
  const response = await openai.responses.create({
    model: "gpt-5.6",
    input: messages,
    tools: [exa.openai.responses.webSearch(), exa.openai.responses.getContents()],
  });

  messages.push(...response.output);
  messages.push(...(await exa.openai.responses.handleToolCalls(response)));
  ```
</CodeGroup>

<Note>
  Chat Completions와 Responses API는 서로 다른 형태의 tool을 사용하며 서로의 형태를 허용하지 않으므로, 호출하려는 endpoint에 맞는 factory를 사용하세요.
</Note>

<div id="configuring-the-tools">
  ## 도구 구성하기
</div>

키워드 인자는 일반적인 Exa 옵션으로, 도구가 실행될 때 그대로 전달됩니다. search 옵션은 `exa.search()`로, contents 옵션은 `exa.get_contents()`로 전달됩니다:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.openai.web_search(category="news", contents={"text": True}),
      exa.openai.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.openai.webSearch({ category: "news", contents: { text: true } }),
    exa.openai.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

모델은 검색 `query`와 읽어들일 `urls`만 선택합니다. 나머지는 모두 도구를 생성할 때 고정되므로, 모델이 크롤링하거나 추출할 대상을 바꿀 수 없습니다.

반면 `name`(기본값은 `"web_search"`와 `"get_contents"`)과 `description`은 모델에게 노출되는 도구 정의 자체를 덮어씁니다. 서로 다르게 구성한 Exa 도구를 함께 사용하거나, 해당 이름을 선점한 다른 도구와의 충돌을 피하려면 `name`을 직접 지정하세요.

<div id="mixing-in-your-own-tools">
  ## 직접 만든 도구 함께 사용하기
</div>

handler는 메시지에 포함된 모든 tool call에 응답합니다. handler가 해석할 수 없는 도구를 지정한 call은 무시되지 않고 `Error: unknown tool "<name>"` 출력을 받으므로, 후속 요청에서 필수 도구 응답이 누락될 일이 없습니다. Exa의 도구와 함께 직접 만든 도구를 실행한다면, 다음 요청을 보내기 전에 해당 오류 출력을 직접 만든 결과로 교체하세요.

<div id="writing-the-loop-by-hand">
  ## 직접 루프 작성하기
</div>

tool schema와 실행을 직접 다루고 싶다면, 도구를 정의하고 call을 수동으로 처리하면 됩니다. `exa.tools.web_search()`와 `exa.tools.get_contents()`는 직접 작성한 루프에서 쓸 수 있도록 동일한 provider 중립적 도구 명세(`run` 메서드 포함)를 제공하며, 처음부터 전부 직접 작성할 수도 있습니다:

```python Python theme={null}
import json

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "exa_search",
            "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query to perform.",
                    },
                },
                "required": ["query"],
            },
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_calls(tool_calls, messages):
    for tool_call in tool_calls:
        if tool_call.function.name == "exa_search":
            args = json.loads(tool_call.function.arguments)
            messages.append(
                {
                    "role": "tool",
                    "content": str(exa_search(**args)),
                    "tool_call_id": tool_call.id,
                }
            )
    return messages
```

Python과 TypeScript에서 사용할 수 있는 search 및 contents 옵션은 [SDK quickstart](/ko/docs/sdks/quickstart)에서 확인하세요.