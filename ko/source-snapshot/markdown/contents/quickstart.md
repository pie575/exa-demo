> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 본격적으로 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="contents-api">
  # Contents API
</div>

> 모든 URL에서 텍스트, highlights, 요약을 추출합니다.

Exa Contents는 URL에서 깔끔한 페이지 콘텐츠를 반환하며, JavaScript로 렌더링되는 페이지, PDF, 복잡한 레이아웃도 자동으로 처리합니다.

모든 contents 기능은 [Exa Search](/ko/docs/search/quickstart)가 반환한 URL에 대해서도 사용할 수 있으며, search당 결과 10개까지는 추가 비용이 없습니다(이후 1000페이지당 $1). web search 도구 활용 사례에서는 Contents 대신 이렇게 Search를 사용하는 방식을 권장합니다.

<Tip>
  AI 컨텍스트로 사용할 search 결과라면 `/search`에서 `contents: { highlights: true }`를 요청하세요 —
  Exa가 각 결과의 excerpt 길이를 관련성에 맞춰 조정합니다. [Highlights](/ko/docs/search/highlights)를 참고하세요.
</Tip>

<div id="make-your-first-request">
  ## 첫 요청 보내기
</div>

하나 이상의 URL 또는 문서 ID를 전달하고, 작업과 관련된 부분에 대한 highlights를 요청하세요. HTTP 요청에서는 `ids`에 전달합니다:

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.get_contents(
      ["https://exa.ai/blog/dynamic-highlights"],
      highlights={"query": "token efficiency and quality results"},
  )

  print(result.results[0].highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.getContents(
    ["https://exa.ai/blog/dynamic-highlights"],
    {
      highlights: {
        query: "token efficiency and quality results"
      }
    }
  );

  console.log(result.results[0].highlights);
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://exa.ai/blog/dynamic-highlights"],
      "highlights": {
        "query": "token efficiency and quality results"
      }
    }'
  ```
</CodeGroup>

<Accordion title="응답 예시">
  ```json theme={null}
  {
    "requestId": "e492118ccdedcba5088bfc4357a8a125",
    "results": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "title": "Dynamic Highlights",
        "url": "https://exa.ai/blog/dynamic-highlights",
        "highlights": [
          "With a 12k character budget, relative to existing highlights, Dynamic Highlights achieves a 40% average token efficiency gain with a notable quality increase..."
        ]
      }
    ],
    "statuses": [
      {
        "id": "https://exa.ai/blog/dynamic-highlights",
        "status": "success",
        "source": "cached"
      }
    ],
    "costDollars": {
      "total": 0.001
    }
  }
  ```
</Accordion>

`results`의 각 항목에는 페이지 메타데이터와 요청한 콘텐츠 형태가 포함됩니다. 각 URL의 성공 또는 실패 여부는 `statuses`에서 확인하세요.

<h2 id="dynamic-highlights">
  출력 형태
</h2>

<Tabs>
  <Tab title="Highlights">
    highlights는 페이지에서 그대로 발췌한 관련 구절을 반환합니다. 전체 텍스트보다 컨텍스트를 작게 유지할 수 있으므로
    agent, RAG, 사실 조회 작업이라면 highlights부터 시작하세요.

    highlights를 사용하려면 `highlights: true`로 설정하세요. Contents를 사용할 때는 페이지에서의 콘텐츠 extraction 범위를 좁힐 수 있도록 `query` 파라미터를 함께 지정하는 것을 권장합니다:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/research-paper"],
          highlights={"query": "methodology and results"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/research-paper"],
        {
          highlights: {
            query: "methodology and results"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/research-paper"],
          "highlights": {
            "query": "methodology and results"
          }
        }'
      ```
    </CodeGroup>

    Dynamic Highlights와 여러 페이지에 컨텍스트를 배분하는 방법은 [Highlights](/ko/docs/search/highlights)를
    참고하세요.
  </Tab>

  <Tab title="전체 텍스트">
    전체 텍스트는 정제된 페이지 본문을 마크다운으로 반환합니다. 폭넓은 컨텍스트, 문서 구조, 또는 highlights가 놓칠 수 있는
    세부 정보가 필요한 작업에 사용하세요.

    전체 페이지는 분량이 클 수 있으므로, limit이 필요하다면 `maxCharacters`를 사용하세요:

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/technical-report"],
          text={"max_characters": 10000},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/technical-report"],
        {
          text: {
            maxCharacters: 10000
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/technical-report"],
          "text": {
            "maxCharacters": 10000
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="Summary">
    summary는 페이지마다 언어 모델을 호출합니다. 생성형 개요가 필요하거나 JSON schema 형태로 필드를 추출해야 할 때
    사용하세요.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.get_contents(
          ["https://example.com/company"],
          summary={"query": "Summarize the product, customers, and pricing"},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.getContents(
        ["https://example.com/company"],
        {
          summary: {
            query: "Summarize the product, customers, and pricing"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/contents" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "ids": ["https://example.com/company"],
          "summary": {
            "query": "Summarize the product, customers, and pricing"
          }
        }'
      ```
    </CodeGroup>

    서술형 문장 대신 필드를 추출하려면 `summary.schema`에 JSON schema를 전달하세요. summary는 해당 schema에 맞는
    JSON 문자열로 반환되므로, 필드를 읽으려면 파싱해야 합니다:

    ```json theme={null}
    {
      "ids": ["https://example.com/company"],
      "summary": {
        "schema": {
          "$schema": "https://json-schema.org/draft/2020-12/schema",
          "title": "Company Information",
          "type": "object",
          "properties": {
            "name": { "type": "string", "description": "The company name" },
            "industry": { "type": "string", "description": "Primary industry" },
            "foundedYear": { "type": "number", "description": "Year the company was founded" }
          },
          "required": ["name"]
        }
      }
    }
    ```
  </Tab>
</Tabs>

요청당 하나의 콘텐츠 뷰만 선택하세요. highlights, text, summary를 함께 요청하면 각 뷰가 개별적으로 반환되며 각각 별도로 과금됩니다.

<div id="content-freshness">
  ## 콘텐츠 최신성
</div>

`maxAgeHours`는 추출된 페이지 콘텐츠가 얼마나 최신이어야 하는지를 제어합니다.

| 값     | 동작                                           |
| ----- | -------------------------------------------- |
| 생략    | 캐시된 콘텐츠가 있으면 사용하고, 필요한 경우 페이지를 새로 가져옴        |
| 양의 정수 | 캐시된 콘텐츠가 지정한 시간보다 최신이면 사용하고, 아니면 페이지를 새로 가져옴 |
| `0`   | 항상 최신 콘텐츠를 가져옴                               |
| `-1`  | 캐시된 콘텐츠만 사용                                  |

대부분의 요청에서는 이 필드를 생략하는 것이 좋습니다. 가격, 재고 여부, 자주 갱신되는 페이지처럼 오래된 페이지 콘텐츠를 쓸 수 없는 경우에만 설정하세요. `maxAgeHours`를 낮게 설정할 때는 `livecrawlTimeout`(밀리초)을 함께 지정해 새로 가져오는 데 걸리는 시간을 제한하세요.

<Accordion title="지원 중단된 livecrawl 매개변수에서 마이그레이션하기">
  `livecrawl` 문자열 매개변수(`"always"`, `"preferred"`, `"fallback"`, `"never"`)는
  지원이 중단되었으며 `maxAgeHours`로 대체되었습니다:

  | 기존 `livecrawl` 값 | 대응 값                                           |
  | ---------------- | ---------------------------------------------- |
  | `"always"`       | `maxAgeHours: 0`                               |
  | `"never"`        | `maxAgeHours: -1`                              |
  | `"fallback"`     | `maxAgeHours` 생략                               |
  | `"preferred"`    | 직접 대응되는 값 없음. `maxAgeHours: 1`과 같은 낮은 값을 사용하세요 |
</Accordion>

<div id="crawl-subpages">
  ## 하위 페이지 크롤링
</div>

각 시작 URL의 링크를 따라가려면 `subpages`를 설정하세요. Exa가 특정 사이트 섹션을 우선적으로 처리하도록 하려면 `subpageTarget`을 추가하세요:

<CodeGroup>
  ```python Python theme={null}
  result = exa.get_contents(
      ["https://docs.example.com"],
      subpages=10,
      subpage_target=["api", "reference", "guides"],
      highlights=True,
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.getContents(
    ["https://docs.example.com"],
    {
      subpages: 10,
      subpageTarget: ["api", "reference", "guides"],
      highlights: true
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/contents" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "ids": ["https://docs.example.com"],
      "subpages": 10,
      "subpageTarget": ["api", "reference", "guides"],
      "highlights": true
    }'
  ```
</CodeGroup>

<div id="images-and-favicons">
  ## 이미지 및 파비콘
</div>

각 페이지에서 가져올 이미지 URL 개수를 `extras.imageLinks`에 지정하세요. 결과에는 사이트의 `favicon`과 대표 `image` URL도 가능한 경우 함께 포함됩니다. `/search`에서는 이 옵션이 `contents.extras.imageLinks`에 위치합니다.

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="API 레퍼런스" icon="square-terminal" href="/ko/docs/reference/get-contents" cta="레퍼런스 열기" arrow="true">
    모든 요청 파라미터와 응답 필드를 확인하세요.
  </Card>

  <Card title="Highlights" icon="highlighter" href="/ko/docs/search/highlights" cta="가이드 읽기" arrow="true">
    agent와 RAG 컨텍스트에 활용할 일반 highlights와 Dynamic Highlights를 비교해 보세요.
  </Card>

  <Card title="Search API" icon="search" href="/ko/docs/search/quickstart" cta="가이드 열기" arrow="true">
    콘텐츠를 추출하기 전에 관련 있는 페이지를 찾아보세요.
  </Card>

  <Card title="SDK" icon="code" href="/ko/docs/sdks/quickstart" cta="SDK 보기" arrow="true">
    Python이나 JavaScript에서 Exa를 사용해 보세요.
  </Card>
</Columns>