> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 받아볼 수 있습니다.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="anthropic-tool-calling">
  # Anthropic 도구 호출
</div>

> Claude 도구 사용로 Exa web search와 page contents를 애플리케이션에 추가하세요.

<Card title="코딩 에이전트 Quickstart" icon="rocket" horizontal href="https://dashboard.exa.ai/onboarding">
  Exa가 처음이신가요? 1분 안에 시작할 수 있습니다.
</Card>

***

Claude의 [도구 사용](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)를 활용하면 모델이 코드에 직접 정의한 함수를 호출할 수 있습니다. Exa SDK는 Anthropic용 web search 및 페이지 읽기 도구를 기본 제공하므로, 도구 스키마를 직접 작성하거나 `tool_use` 블록을 파싱하거나 Exa 결과를 직접 포맷할 필요가 없습니다.

<div id="get-started">
  ## 시작하기
</div>

<Steps>
  <Step title="SDK 설치하기">
    <CodeGroup>
      ```bash Python theme={null}
      pip install anthropic exa_py
      ```

      ```bash JavaScript theme={null}
      npm install @anthropic-ai/sdk exa-js
      ```
    </CodeGroup>
  </Step>

  <Step title="API key 설정하기">
    `EXA_API_KEY`와 `ANTHROPIC_API_KEY` 환경 변수를 설정하세요. [Anthropic 콘솔](https://console.anthropic.com/settings/keys)과 [Exa dashboard](https://dashboard.exa.ai/api-keys)에서 API key를 생성할 수 있습니다.

    <Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
      dashboard에서 key를 생성하세요. 신규 계정에는 무료 credit이 제공됩니다.
    </Card>
  </Step>

  <Step title="도구 루프에 Exa 도구 추가하기">
    요청의 `tools` 목록에 도구을 전달한 다음, assistant 메시지를 `handle_tool_use`에 넘기세요. 메시지에 있는 모든 `tool_use` 블록을 실행한 뒤, 다음 user 메시지에 바로 실어 보낼 수 있는 `tool_result` 블록을 반환합니다.

    `web_search`는 모델이 아직 접하지 못한 페이지를 웹에서 검색하고, `get_contents`는 이전 search 결과에서 얻었든 사용자가 알려줬든 이미 URL을 알고 있는 페이지를 읽습니다. 둘 중 하나만 등록해도 되고, 둘 다 등록해도 됩니다.

    <CodeGroup>
      ```python Python theme={null}
      import anthropic
      from exa_py import Exa

      exa = Exa()  # 환경 변수에서 EXA_API_KEY를 읽어옵니다
      claude = anthropic.Anthropic()

      messages = [{"role": "user", "content": "What's the latest on AI chips?"}]

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )

      messages.append({"role": "assistant", "content": response.content})
      messages.append(
          {"role": "user", "content": exa.anthropic.handle_tool_use(response)}
      )

      response = claude.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=1024,
          messages=messages,
          tools=[exa.anthropic.web_search(), exa.anthropic.get_contents()],
      )
      print(response.content[0].text)
      ```

      ```javascript JavaScript theme={null}
      import Anthropic from "@anthropic-ai/sdk";
      import Exa from "exa-js";

      const exa = new Exa(); // 환경 변수에서 EXA_API_KEY를 읽어옵니다
      const anthropic = new Anthropic();

      const messages = [
        { role: "user", content: "What's the latest on AI chips?" },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });

      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: await exa.anthropic.handleToolUse(response),
      });

      response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages,
        tools: [exa.anthropic.webSearch(), exa.anthropic.getContents()],
      });
      console.log(response.content[0].text);
      ```
    </CodeGroup>

    위 예시는 간결하게 한 라운드만 보여준 것입니다. 실제 agent라면 모든 요청에 `tools`를 계속 포함하고, 모델이 `tool_use` 블록 없이 응답할 때까지 handler 단계를 반복합니다. 이렇게 해야 search 결과가 후속 페이지 읽기로 이어집니다.

    factory를 인자 없이 호출하면 Exa의 권장 기본값이 적용됩니다. search의 경우 `type="auto"`와 `contents={"highlights": True}`입니다. highlights는 query와 관련된 excerpt를 반환할 뿐, 페이지 텍스트를 10,000자로 제한하지는 않습니다. contents factory는 페이지 텍스트를 반환하며, SDK의 10,000자 limit은 `text`에만, 그리고 `max_characters`를 생략한 경우에만 적용됩니다.
  </Step>
</Steps>

<div id="configuring-the-tools">
  ## 도구 구성하기
</div>

키워드 인자는 일반적인 Exa 옵션으로, 도구가 실행될 때 그대로 전달됩니다 — search 옵션은 `exa.search()`로, contents 옵션은 `exa.get_contents()`로 전달됩니다:

<CodeGroup>
  ```python Python theme={null}
  tools = [
      exa.anthropic.web_search(category="news", contents={"text": True}),
      exa.anthropic.get_contents(summary=True, livecrawl="preferred"),
  ]
  ```

  ```javascript JavaScript theme={null}
  const tools = [
    exa.anthropic.webSearch({ category: "news", contents: { text: true } }),
    exa.anthropic.getContents({ summary: true, livecrawl: "preferred" }),
  ];
  ```
</CodeGroup>

모델이 선택하는 것은 검색 `query`와 읽어들일 `urls`뿐입니다. 나머지는 모두 도구를 생성할 때 고정되므로, 모델이 크롤링하거나 추출할 대상을 바꿀 수 없습니다.

반면 `name`(기본값은 `"web_search"` 및 `"get_contents"`)과 `description`은 모델에게 노출되는 도구 정의를 재정의합니다. Anthropic은 도구 이름이 고유할 것을 요구하므로, 사용자 지정 이름을 지정하면 `web_search`라는 이름을 선점하는 Anthropic 내장 `web_search_20250305` 서버 도구와 Exa 도구를 함께 실행할 수 있습니다:

<CodeGroup>
  ```python Python theme={null}
  response = claude.messages.create(
      model="claude-sonnet-4-6",
      max_tokens=1024,
      messages=messages,
      tools=[
          exa.anthropic.web_search(name="exa_web_search"),
          {"type": "web_search_20250305", "name": "web_search", "max_uses": 5},
      ],
  )
  ```

  ```javascript JavaScript theme={null}
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
    tools: [
      exa.anthropic.webSearch({ name: "exa_web_search" }),
      { type: "web_search_20250305", name: "web_search", max_uses: 5 },
    ],
  });
  ```
</CodeGroup>

<div id="mixing-in-your-own-tools">
  ## 직접 만든 도구 함께 사용하기
</div>

`handle_tool_use`는 메시지에 포함된 모든 `tool_use` 블록에 응답합니다. 처리할 수 없는 도구를 지정한 블록도 그냥 무시되는 것이 아니라 `Error: unknown tool "<name>"` 결과를 받으므로, 후속 요청에서 필수 도구 결과가 누락되는 일이 없습니다. Exa의 도구와 함께 직접 만든 도구를 실행한다면, 다음 요청을 보내기 전에 이러한 오류 결과를 직접 만든 도구의 결과로 교체하세요.

<div id="writing-the-loop-by-hand">
  ## 직접 루프 작성하기
</div>

도구 schema와 실행을 직접 관리하고 싶다면, 도구를 정의하고 `tool_use` 블록을 수동으로 처리하세요. `exa.tools.web_search()`와 `exa.tools.get_contents()`는 직접 작성한 루프에서 쓸 수 있는 provider 중립적인 도구 사양(`run` 메서드 포함)을 동일하게 제공하며, 원한다면 모든 것을 처음부터 직접 작성할 수도 있습니다:

```python Python theme={null}
TOOLS = [
    {
        "name": "exa_search",
        "description": "Perform a search query on the web, and retrieve the most relevant URLs/web data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query to perform.",
                },
            },
            "required": ["query"],
        },
    }
]

def exa_search(query: str):
    return exa.search(query=query, type="auto", contents={"highlights": True})

def process_tool_use(response):
    results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "exa_search":
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(exa_search(**block.input)),
                }
            )
    return results
```

Python과 TypeScript의 search 및 contents 옵션은 [SDK Quickstart](/ko/docs/sdks/quickstart)를 참고하세요.