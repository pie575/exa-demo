> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

# OpenAI Tool Calling {#openai-tool-calling}

> OpenAI tool calling으로 애플리케이션에 Exa web search와 page contents를 추가하세요.

<Info>
  OpenAI는 모든 신규 프로젝트에 Responses API 사용을 권장합니다. 아래 [Responses API](#responses-api) 섹션을 참고하세요.
</Info>

OpenAI의 [tool calling](https://platform.openai.com/docs/guides/function-calling?lang=python)을 사용하면 모델이 코드에 직접 정의한 함수를 호출할 수 있습니다. Exa SDK는 OpenAI용으로 미리 만들어진 web search 및 페이지 읽기 도구를 제공하므로, tool schema를 직접 작성하거나 도구 call을 파싱하거나 Exa result를 일일이 형식에 맞출 필요가 없습니다.

## 시작하기 {#get-started}

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

  <Step title="API 키 설정">
    `EXA_API_KEY`와 `OPENAI_API_KEY` environment variable을 설정하세요. [OpenAI dashboard](https://platform.openai.com/api-keys)와 [Exa dashboard](https://dashboard.exa.ai/api-keys)에서 API 키를 생성할 수 있습니다.

    <Card title="Exa API 키 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits이 제공됩니다.
    </Card>
  </Step>

  <Step title="도구 loop에 Exa 도구 추가하기">
    요청의 `tools` 목록에 도구를 전달한 다음, assistant 메시지를 `handle_tool_calls`에 넘기세요. 메시지에 포함된 모든 Exa 도구 호출을 실행하고, 대화에 바로 추가할 수 있는 `role: "tool"` 메시지를 반환합니다.

    `web_search`는 모델이 아직 보지 못한 페이지를 웹에서 search하고, `get_contents`는 이전 search에서 얻었든 사용자가 제공했든 이미 URL을 알고 있는 페이지를 읽습니다. 둘 중 하나만 등록해도 되고 둘 다 등록해도 됩니다.

    <CodeGroup>
      ```python Python theme={null}
      from exa_py import Exa
      from openai import OpenAI

      exa = Exa()  # 환경에서 EXA_API_KEY를 읽어옵니다
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

      const exa = new Exa(); // 환경에서 EXA_API_KEY를 읽어옵니다
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

    위 예제는 간결하게 한 라운드만 보여준 것입니다. 실제 agent는 모든 요청에 `tools`를 포함하고, 모델이 도구 call 없이 응답할 때까지 handler 단계를 반복합니다. 이렇게 해야 search result가 이어지는 follow-up 페이지 읽기로 연결됩니다.

    factory를 인자 없이 호출하면 Exa가 권장하는 기본값이 적용됩니다. search의 경우 `type="auto"`와 `contents={"highlights": True}`입니다. highlights는 질의와 관련된 발췌문을 반환할 뿐, 페이지 텍스트를 10,000자로 제한하지는 않습니다. contents factory는 페이지 텍스트를 반환하며, SDK의 10,000자 limit은 `text`에만, 그리고 `max_characters`를 생략한 경우에만 적용됩니다.
  </Step>
</Steps>

## Responses API {#responses-api}

OpenAI Responses API에서는 동일한 `handle_tool_calls` 헬퍼와 함께 `responses` factory를 사용하세요. handler는 follow-up 요청에 사용할 `function_call_output` 항목을 반환합니다.

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
  Chat Completions와 Responses API는 서로 다른 도구 형식을 사용하며 상대방의 형식을 허용하지 않으므로, 호출하려는 엔드포인트에 맞는 factory를 사용하세요.
</Note>

## 도구 설정하기 {#configuring-the-tools}

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

모델은 검색 `query`와 읽어들일 `urls`만 선택합니다. 나머지 값은 도구를 생성할 때 고정되므로, 모델이 크롤링하거나 추출하는 대상을 바꿀 수 없습니다.

반면 `name`(기본값은 `"web_search"`와 `"get_contents"`)과 `description`은 모델에게 노출되는 도구 정의 자체를 덮어씁니다. 서로 다르게 설정된 Exa 도구를 나란히 함께 사용하거나, 해당 이름을 선점하는 다른 도구와의 충돌을 피하려면 사용자 지정 `name`을 지정하세요.

## 직접 만든 도구 함께 사용하기 {#mixing-in-your-own-tools}

handler는 메시지에 포함된 모든 도구 호출에 응답합니다. handler가 해석할 수 없는 도구를 지정한 call은 그냥 누락되지 않고 `Error: unknown tool "<name>"` output을 받으므로, follow-up 요청에서 필수 도구 response가 빠지는 일이 없습니다. Exa의 도구와 함께 직접 만든 도구를 실행한다면, 다음 요청을 보내기 전에 해당 오류 output을 직접 만든 result로 교체하세요.

## 루프를 직접 작성하기 {#writing-the-loop-by-hand}

tool schema와 실행을 직접 제어하고 싶다면, 도구를 정의하고 call을 수동으로 처리하면 됩니다. `exa.tools.web_search()`와 `exa.tools.get_contents()`는 직접 작성한 루프에서 사용할 수 있도록 제공업체에 종속되지 않는 동일한 도구 사양(`run` 메서드 포함)을 제공하며, 전부 처음부터 직접 작성할 수도 있습니다:

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

Python과 TypeScript의 search 및 contents 옵션은 [SDK Quickstart](/ko/docs/sdks/quickstart)를 참고하세요.