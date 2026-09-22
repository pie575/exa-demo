> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# SDK Quickstart {#sdk-quickstart}

> Exa Python 및 JavaScript SDK 설치 및 사용하기

공식 Exa SDK입니다. 웹을 검색하고, page contents를 가져오고, citations가 포함된 답변을 받아보세요.

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits가 제공됩니다.
</Card>

## 설치 {#install}

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

Python SDK는 Python 3.9 이상이 필요합니다.

## 인증 {#authentication}

API 키를 환경 변수로 설정하세요:

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

## 시작하기 {#getting-started}

client를 초기화하고 첫 search를 실행해 보세요:

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
  두 client 모두 `EXA_API_KEY` environment variable에서 키를 읽어옵니다. 키를 직접 지정하려면
  `Exa(api_key="your-api-key")` 또는 `new Exa("your-api-key")`처럼 인라인으로 전달하세요.
</Note>

## 권장 기본값 {#recommended-defaults}

| 결정 사항       | 권장 기본값                                                      |
| ----------- | ----------------------------------------------------------- |
| 시작 지점       | `search` 사용                                                 |
| Search type | latency나 synthesis 요구사항으로 다른 타입이 필요한 경우가 아니라면 `auto` 유지     |
| 페이지 콘텐츠     | `highlights: true`로 시작                                      |
| Freshness   | 오래된 content를 쓸 수 없는 경우에만 `max_age_hours` / `maxAgeHours` 설정 |
| 알려진 URL     | `get_contents` / `getContents` 사용                           |

<Warning>
  두 요청 타입은 동일한 content options를 서로 다른 위치에서 받습니다.

  | 메서드                            | content option 위치                                                        |
  | ------------------------------ | ------------------------------------------------------------------------ |
  | `search`                       | `contents` 내부에 지정, 예: `exa.search(query, contents={"highlights": True})` |
  | `get_contents` / `getContents` | 요청에 직접 지정, 예: `exa.get_contents(urls, highlights=True)`                  |
</Warning>

## Search {#search}

search는 관련 있는 페이지를 찾아 한 번의 call로 해당 contents까지 함께 반환합니다.

<Tip>
  AI 답변, RAG, 검색 미리보기에는 `highlights: true`를 사용하세요. Exa는 각 result의
  관련성에 맞춰 발췌문 분량을 자동으로 조정합니다. 애플리케이션에서 고정된 limit이 필요한 경우에만
  `max_characters` / `maxCharacters`를 설정하세요.
</Tip>

필터, 날짜 범위, result 개수 지정:

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

### 출력 schema {#output-schema}

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
  `output.content`로 반환합니다. 소스 선호도나 강조할 내용은 `system_prompt` / `systemPrompt`로 지정하세요.
  grounding은 `output.grounding`에 자동으로 반환되므로 schema에 citations나
  confidence를 중복해서 정의하지 마세요.
</Note>

여러 번의 searches에 걸친 리서치가 필요한 output이라면 deep 모드를 권장합니다. 가벼운 리서치에는 `deep-lite`를, 다단계 search와 더 강력한 synthesis가 필요할 때는 `deep`을 사용하세요. 전체 요청 옵션은 [Search 가이드](/ko/docs/search/quickstart)를 참고하세요.

## Contents {#contents}

이미 알고 있는 URL에서 highlights, 전체 텍스트, summary를 추출합니다. 먼저 highlights를 사용해 보고, 여기에 질의를 추가해 필요한 정보에 초점을 맞추세요.

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

더 폭넓은 컨텍스트나 문서 구조가 필요하다면 전체 텍스트를 사용하세요. output 형태, freshness 제어, 하위 페이지 크롤링은 [Contents 가이드](/ko/docs/contents/quickstart)를 참고하세요.

## Answer {#answer}

citations가 포함된 질문 답변을 받아보세요.

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

## 비동기와 타입 {#async-and-types}

Python은 비동기 작업을 위한 `AsyncExa`를 제공하며, JavaScript SDK는 모든 메서드에 대한 TypeScript 타입을 함께 제공합니다.

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

## 리소스 {#resources}

Python: [exa-py 소스](https://github.com/exa-labs/exa-py), [PyPI 패키지](https://pypi.org/project/exa-py/). JavaScript: [exa-js 소스](https://github.com/exa-labs/exa-js), [npm 패키지](https://www.npmjs.com/package/exa-js).

## 다음 단계 {#continue}

<Columns cols={3}>
  <Card title="search 가이드" icon="search" href="/ko/docs/search/quickstart" cta="가이드 열기" arrow="true">
    요청 패턴, 필터, 심층 모드가 궁금하다면 기본 search 가이드로 돌아가세요.
  </Card>

  <Card title="search reference" icon="square-terminal" href="/ko/docs/reference/search" cta="reference 열기" arrow="true">
    `/search`의 전체 요청 및 response schema를 확인하세요.
  </Card>

  <Card title="Contents 가이드" icon="file-text" href="/ko/docs/contents/quickstart" cta="가이드 열기" arrow="true">
    이미 URL을 알고 있어 바로 extraction하려는 경우에는 Contents를 사용하세요.
  </Card>
</Columns>