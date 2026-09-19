> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="sdk-quickstart">
  # SDK Quickstart
</div>

> Exa Python 및 JavaScript SDK 설치 및 사용 방법

공식 Exa SDK입니다. 웹을 search하고, page contents를 가져오고, citations가 포함된 답변을 받아보세요.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits가 제공됩니다.
</Card>

<div id="install">
  ## 설치
</div>

<CodeGroup>
  ```bash pip theme={null}
  pip install exa-py
  ```

  ```bash uv theme={null}
  uv add exa-py
  ```

  ```bash npm theme={null}
  npm install exa-js
  ```

  ```bash pnpm theme={null}
  pnpm add exa-js
  ```
</CodeGroup>

Python SDK를 사용하려면 Python 3.9 이상이 필요합니다.

<div id="authentication">
  ## 인증
</div>

API key를 환경 변수로 설정하세요:

<Tabs>
  <Tab title="macOS/Linux">
    ```bash theme={null}
    export EXA_API_KEY="your-api-key"
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell theme={null}
    setx EXA_API_KEY "your-api-key"
    ```
  </Tab>
</Tabs>

<div id="getting-started">
  ## 시작하기
</div>

클라이언트를 초기화하고 첫 search를 실행해 보세요:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "latest developments in fusion energy",
      type="auto",
      contents={"highlights": True},
  )

  for source in results.results:
      print(source.url, source.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search("latest developments in fusion energy", {
    type: "auto",
    contents: {
      highlights: true,
    },
  });

  for (const source of results.results) {
    console.log(source.url, source.highlights);
  }
  ```
</CodeGroup>

<Note>
  두 클라이언트 모두 `EXA_API_KEY` 환경 변수에서 key를 읽어옵니다. 환경 변수 대신 직접 지정하려면
  `Exa(api_key="your-api-key")` 또는 `new Exa("your-api-key")`처럼 인라인으로 전달하세요.
</Note>

<div id="recommended-defaults">
  ## 권장 기본값
</div>

| 결정 사항        | 권장 기본값                                                  |
| ------------ | ------------------------------------------------------- |
| 시작점          | `search` 사용                                             |
| search type  | 지연 시간이나 synthesis 요구사항상 다른 타입이 필요한 경우가 아니라면 `auto` 유지   |
| page content | `highlights: true`로 시작                                  |
| 알려진 URL      | `get_contents` / `getContents` 사용                       |
| freshness    | 오래된 콘텐츠를 쓸 수 없는 경우에만 `max_age_hours` / `maxAgeHours` 설정 |

<Warning>
  두 요청 타입은 동일한 content options를 서로 다른 위치에서 받습니다:

  | 메서드                            | content option 위치                                                    |
  | ------------------------------ | -------------------------------------------------------------------- |
  | `search`                       | `contents` 내부, 예: `exa.search(query, contents={"highlights": True})` |
  | `get_contents` / `getContents` | 요청에 직접 지정, 예: `exa.get_contents(urls, highlights=True)`              |
</Warning>

<div id="search">
  ## Search
</div>

Search는 관련 페이지를 찾아 한 번의 call로 해당 contents를 반환합니다.

<Tip>
  AI 답변, RAG, 검색 미리보기에는 `highlights: true`를 사용하세요. Exa는 각 결과의
  excerpt 길이를 관련성에 맞춰 조정하므로, 애플리케이션에서 고정된 limit이 필요한 경우에만
  `max_characters` / `maxCharacters`를 설정하세요.
</Tip>

필터, 기간 범위, 결과 개수 지정:

<CodeGroup>
  ```python Python theme={null}
  results = exa.search(
      "climate tech news",
      num_results=20,
      start_published_date="2024-01-01",
      include_domains=["techcrunch.com", "wired.com"],
      contents={"highlights": True}
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("interesting articles about space", {
    numResults: 10,
    includeDomains: ["nasa.gov", "space.com"],
    startPublishedDate: "2024-01-01",
    contents: {
      highlights: true,
    },
  });
  ```
</CodeGroup>

<div id="output-schema">
  ### Output schema
</div>

<CodeGroup>
  ```python Python theme={null}
  structured_results = exa.search(
      "Who is the CEO of OpenAI?",
      type="deep",
      system_prompt="Prefer official sources and avoid duplicate results",
      output_schema={
          "type": "object",
          "properties": {
              "leader": {"type": "string"},
              "title": {"type": "string"},
              "source_count": {"type": "number"}
          },
          "required": ["leader", "title"]
      },
      contents={"highlights": True}
  )

  print(structured_results.output.content if structured_results.output else None)
  ```

  ```javascript JavaScript theme={null}
  const structuredResult = await exa.search("Who is the CEO of OpenAI?", {
    type: "deep",
    systemPrompt: "Prefer official sources and avoid duplicate results",
    outputSchema: {
      type: "object",
      properties: {
        leader: { type: "string" },
        title: { type: "string" },
        sourceCount: { type: "number" },
      },
      required: ["leader", "title"],
    },
    contents: {
      highlights: true,
    },
  });

  console.log(structuredResult.output?.content);
  ```
</CodeGroup>

<Note>
  `output_schema` / `outputSchema`는 모든 search type에서 동작하며, synthesis된 값을
  `output.content`로 반환합니다. 출처 선호나 강조할 내용은 `system_prompt` / `systemPrompt`로 지정하세요.
  grounding은 `output.grounding`에 자동으로 반환되므로 schema에 citations이나
  신뢰도를 중복해서 정의하지 마세요.
</Note>

output을 만들기 위해 여러 searches에 걸친 조사가 필요하다면 deep 모드를 권장합니다. 가벼운 조사에는 `deep-lite`를, 다단계 search와 더 강력한 synthesis가 필요할 때는 `deep`을 사용하세요. 전체 요청 옵션은 [Search 가이드](/ko/docs/search/quickstart)를 참고하세요.

<div id="contents">
  ## Contents
</div>

이미 알고 있는 URL에서 highlights, 전체 텍스트 또는 summaries를 추출합니다. 먼저 highlights로 시작하고, query를 추가해 필요한 정보에 집중시키세요.

<CodeGroup>
  ```python Python theme={null}
  results = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and result quality"},
  )
  ```

  ```javascript JavaScript theme={null}
  const results = await exa.getContents(["https://exa.ai/blog/dynamic-highlights"], {
    highlights: {
      query: "token efficiency and result quality",
    },
  });
  ```
</CodeGroup>

더 넓은 맥락이나 문서 구조가 필요할 때는 전체 텍스트를 사용하세요. output 형태, freshness 제어, 하위 페이지 크롤링은 [Contents 가이드](/ko/docs/contents/quickstart)를 참고하세요.

<div id="answer">
  ## Answer
</div>

질문에 대한 답변을 citations과 함께 받아보세요.

<CodeGroup>
  ```python Python theme={null}
  response = exa.answer("What caused the 2008 financial crisis?")
  print(response.answer)

  for chunk in exa.stream_answer("Explain quantum computing"):
      print(chunk, end="", flush=True)
  ```

  ```javascript JavaScript theme={null}
  const response = await exa.answer("What caused the 2008 financial crisis?");
  console.log(response.answer);

  for await (const chunk of exa.streamAnswer("Explain quantum computing")) {
    if (chunk.content) {
      process.stdout.write(chunk.content);
    }
  }
  ```
</CodeGroup>

<div id="async-and-types">
  ## 비동기 및 타입
</div>

Python에서는 비동기 작업을 위한 `AsyncExa`를 제공하며, JavaScript SDK는 모든 메서드에 대한 TypeScript 타입을 기본 포함합니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import AsyncExa

  exa = AsyncExa()

  results = await exa.search(
      "machine learning startups",
      contents={"highlights": True}
  )
  ```

  ```typescript TypeScript theme={null}
  import Exa from "exa-js";
  import type { SearchResponse, RegularSearchOptions } from "exa-js";
  ```
</CodeGroup>

<div id="resources">
  ## 리소스
</div>

Python: [exa-py 소스 코드](https://github.com/exa-labs/exa-py), [PyPI 패키지](https://pypi.org/project/exa-py/). JavaScript: [exa-js 소스 코드](https://github.com/exa-labs/exa-js), [npm 패키지](https://www.npmjs.com/package/exa-js).

<div id="continue">
  ## 계속하기
</div>

<Columns cols={3}>
  <Card title="search 가이드" icon="search" href="/ko/docs/search/quickstart" cta="가이드 열기" arrow="true">
    요청 패턴, 필터, 심화 모드가 궁금하다면 메인 search 가이드로 돌아가세요.
  </Card>

  <Card title="search 레퍼런스" icon="square-terminal" href="/ko/docs/reference/search" cta="레퍼런스 열기" arrow="true">
    전체 `/search` 요청 및 응답 schema를 확인하세요.
  </Card>

  <Card title="Contents 가이드" icon="file-text" href="/ko/docs/contents/quickstart" cta="가이드 열기" arrow="true">
    이미 URL을 알고 있고 바로 extraction이 필요하다면 Contents를 사용하세요.
  </Card>
</Columns>