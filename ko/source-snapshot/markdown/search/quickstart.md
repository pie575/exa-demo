> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="exa-search-api">
  # Exa Search API
</div>

> 자연어로 웹을 검색하고, 한 번의 요청으로 깔끔하고 관련성 높은 페이지 콘텐츠를 받아보세요.

Exa Search는 자연어 질의를 받아 순위가 매겨진 웹 결과와 깔끔한 페이지 콘텐츠를 반환합니다.

<div id="make-your-first-request">
  ## 첫 요청 보내기
</div>

자연어로 작성한 `query`와 `contents: { highlights: true }`로 시작해 보세요. 각 결과의 관련성에 맞는 분량의 excerpt가 반환됩니다. 나머지 필드는 Exa가 search하는 방식과 각 결과에 담길 내용을 제어하며, 이 페이지의 나머지 부분에서는 실제로 자주 쓰게 될 필드를 다룹니다.

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  result = exa.search(
      "recent techniques for improving retrieval in RAG systems",
      type="auto",
      contents={"highlights": True},
  )

  for item in result.results:
      print(item.title, item.url)
      print(item.highlights)
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const result = await exa.search(
    "recent techniques for improving retrieval in RAG systems",
    {
      type: "auto",
      contents: { highlights: true }
    }
  );

  for (const item of result.results) {
    console.log(item.title, item.url);
    console.log(item.highlights);
  }
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "recent techniques for improving retrieval in RAG systems",
      "type": "auto",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

search는 기본적으로 최대 10개의 결과를 반환합니다. `numResults`를 설정하면 최대 100개까지 요청할 수 있으며, 관련성 있는 페이지가 그보다 적으면 더 적게 반환될 수 있습니다. search는 페이지네이션을 지원하지 않습니다.

<Accordion title="응답 예시">
  highlights와 아래 목록은 축약된 형태입니다.

  ```json theme={null}
  {
    "requestId": "c3174df2b9cd5afbc64cdf79f3719b19",
    "resolvedSearchType": "",
    "results": [
      {
        "id": "https://arxiv.org/html/2608.21702",
        "title": "From Association to Causation: Improving Retrieval Precision ofRetrieval-Augmented Generation via Causal Relations and an Attention Mechanism",
        "url": "https://arxiv.org/html/2608.21702",
        "highlights": [
          "Retrieval-Augmented Generation (RAG) grounds LLM generation on retrieved documents, but the standard terminal retrieval stage—dense-vector similarity, optionally followed by reranking—often returns documents that merely share keywords with the query without containing the needed information...\n..."
        ],
        "image": "https://arxiv.org/static/base/1.0.1/images/icons/smileybones-small.svg",
        "favicon": "https://arxiv.org/static/browse/0.3.4/images/icons/favicon-32x32.png"
      },
      {
        "id": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "title": "Four retrieval techniques to improve RAG you need to know",
        "url": "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/four-retrieval-techniques-improve-rag",
        "publishedDate": "2025-04-14T00:00:00.000Z",
        "highlights": [
          "It's not surprising, then, that we've seen a range of different approaches emerge that attempt to address RAG's limitations over the last year or so.\n..."
        ],
        "image": "https://www.thoughtworks.com/content/dam/thoughtworks/images/illustration/brand/tw_illustration_5.jpg"
      }
    ],
    "searchTime": 1324.3,
    "costDollars": {
      "total": 0.007,
      "search": {
        "neural": 0.007
      }
    }
  }
  ```
</Accordion>

결과는 관련성 순으로 정렬됩니다. 각 결과에는 제목, URL, 게시일 같은 메타데이터와 `contents`로 요청한 내용이 함께 담깁니다.

<div id="writing-queries">
  ## 질의 작성하기
</div>

`query` 필드는 Search API를 사용할 때 유일한 필수 필드입니다.

질의는 자연어로 작성하세요. 주제를 포함하고, 필요하다면 원하는 출처 유형과 기간도 함께 명시하세요.

질의는 광범위하고 탐색적이어도 됩니다. `"Latest news on EU battery policy"`는 Exa가 관련 페이지를 찾기에 충분한 의도를 전달하지만, `"news"`는 그렇지 않습니다. 출처 유형이 중요하다면 질의에 직접 명시하세요:

```text theme={null}
RAG 시스템의 하이브리드 검색과 시맨틱 검색을 비교한 최신 기술 문서
```

Exa 인덱스에 어떤 콘텐츠가 포함되어 있고 해당 콘텐츠 유형을 어떻게 검색하는지는 [Exa 인덱스에는 무엇이 있나요](/ko/docs/search/data/overview)를 참고하세요.

<h2 id="search-types">
  search type 선택하기
</h2>

`type`은 search mode를 선택하며, 각 모드는 속도, 검색 깊이, synthesis의 균형이 서로 다르게 조정되어 있습니다. `auto`가 기본값이며 대부분의 search에 적합합니다.

| 유형               | 사용 시점                                  |
| ---------------- | -------------------------------------- |
| `auto`           | 품질과 속도의 균형이 가장 잘 잡힌 기본값이 필요할 때         |
| `fast`           | 요청이 지연 시간에 민감할 때                       |
| `instant`        | 자동 완성이나 음성처럼 실시간 경로에서 처리되는 요청일 때       |
| `deep-lite`      | 가벼운 수준의 리서치와 synthesis가 필요한 작업일 때      |
| `deep`           | 다단계 search와 더 강력한 synthesis가 필요한 작업일 때 |
| `deep-reasoning` | 지연 시간보다 완전성과 추론 깊이가 더 중요할 때            |

deep 모드는 단일 retrieval 과정이 아니라 리서치 프로세스를 실행합니다. 이 프로세스의 작동 방식과 추가 제어 옵션 사용법은 [Deep Search](/ko/docs/search/deep-search)를 참고하세요.

<Tip>
  장시간 실행되는 리서치, 리스트 빌딩, 다단계 enrichment에는 `deep-reasoning` 대신 [Exa Agent](/ko/docs/agent/quickstart)를
  사용하세요. Agent는 실행당 더 많은 컴퓨팅을 사용하며 근거에 기반한(grounded) 구조화된 결과를 반환합니다.
</Tip>

<div id="output-shapes">
  ## 출력 형태
</div>

모든 결과에는 제목, URL, 게시일 등의 메타데이터가 포함됩니다. `contents`를 사용하면 페이지의 highlights, 전체 텍스트, summary를 추가할 수 있습니다.

<Tabs>
  <Tab title="Highlights">
    Highlights는 질의와 가장 관련성이 높은 excerpt를 반환합니다. 각 페이지의 관련 없는 부분으로 컨텍스트 윈도를 채우지 않으면서
    모델과 agent에 필요한 evidence만 제공합니다.

    대부분의 작업에 권장되는 출력 형태입니다.

    우선 `highlights: true`만 지정해 보세요. Exa가 질의를 바탕으로 각 결과에서 적절한 분량의
    콘텐츠를 선택합니다.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "How are inference providers reducing transformer latency?",
          contents={"highlights": True},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "How are inference providers reducing transformer latency?",
        { contents: { highlights: true } }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "How are inference providers reducing transformer latency?",
          "contents": { "highlights": true }
        }'
      ```
    </CodeGroup>

    Dynamic Highlights와 이를 활성화할 시점에 대한 안내는 [Highlights](/ko/docs/search/highlights)를 참고하세요.
  </Tab>

  <Tab title="전체 텍스트">
    전체 텍스트는 정리된 페이지 본문을 반환합니다. 더 넓은 맥락, 문서 구조, 또는 질의 중심 excerpt에서
    누락될 수 있는 세부 정보가 필요한 작업에 사용하세요.

    전체 페이지는 용량이 클 수 있습니다. 결과 개수와 페이지당 반환되는 텍스트 양을 모두 제한하세요.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "Technical postmortems of large-scale inference outages",
          num_results=5,
          contents={"text": {"max_characters": 10000}},
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "Technical postmortems of large-scale inference outages",
        {
          numResults: 5,
          contents: { text: { maxCharacters: 10000 } }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "Technical postmortems of large-scale inference outages",
          "numResults": 5,
          "contents": {
            "text": { "maxCharacters": 10000 }
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

요청당 콘텐츠 뷰는 하나만 선택하세요. highlights와 text를 함께 요청하면 같은 페이지에 대해 두 가지 뷰가 반환되고 두 번 과금됩니다. `summary`라는 세 번째 선택지도 있지만, 결과마다 언어 모델 call이 추가됩니다.

<Warning>
  `/search`와 `/contents`는 동일한 content options를 서로 다른 위치에서 받습니다:

  * **`/search`**는 `highlights`, `text`, `summary`를 `contents` 객체 안에 중첩합니다:
    `"contents": { "highlights": true }`
  * **`/contents`**에는 `contents` 래퍼가 없습니다. 본문 자체가 content options이므로,
    동일한 필드가 `urls`와 나란히 최상위 레벨에 놓입니다: `"urls": [...], "highlights": true`
</Warning>

<div id="output-schema">
  ## Output schema
</div>

Exa가 search 결과를 종합하도록 하려면 `outputSchema`를 추가하세요. 모든 search type에서 동작하며, 응답에 `output` 객체가 추가됩니다.

순위가 매겨진 페이지는 그대로 `results`에 남아 있습니다. 생성된 값은 `output.content`로 반환되며, 필드 단위의 출처와 신뢰도는 `output.grounding`에 담깁니다.

<Tabs>
  <Tab title="자유 형식 텍스트">
    자연어 문장 형태의 결과를 생성하려면 `type: "text"`를 사용하세요. `description`을 추가하면 형식이나 길이를 지정할 수 있습니다.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "What changed in the latest EU battery policy?",
          output_schema={
              "type": "text",
              "description": "Summarize the changes in three concise bullets",
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "What changed in the latest EU battery policy?",
        {
          outputSchema: {
            type: "text",
            description: "Summarize the changes in three concise bullets"
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "What changed in the latest EU battery policy?",
          "outputSchema": {
            "type": "text",
            "description": "Summarize the changes in three concise bullets"
          }
        }'
      ```
    </CodeGroup>
  </Tab>

  <Tab title="구조화된 JSON">
    직접 정의한 속성과 요구 사항을 따르는 JSON을 받으려면 `type: "object"`를 사용하세요.

    <CodeGroup>
      ```python Python theme={null}
      result = exa.search(
          "AI infrastructure companies that announced Series A or B funding in the past six months",
          output_schema={
              "type": "object",
              "properties": {
                  "companies": {
                      "type": "array",
                      "maxItems": 10,
                      "items": {
                          "type": "object",
                          "properties": {
                              "name": {"type": "string"},
                              "round": {"type": "string"},
                              "amount": {"type": "string"},
                              "announcedDate": {
                                  "type": "string",
                                  "description": "The funding announcement date",
                              },
                              "leadInvestors": {
                                  "type": "array",
                                  "items": {"type": "string"},
                              },
                          },
                          "required": ["name", "round", "amount", "announcedDate"],
                      },
                  }
              },
              "required": ["companies"],
          },
      )
      ```

      ```javascript JavaScript theme={null}
      const result = await exa.search(
        "AI infrastructure companies that announced Series A or B funding in the past six months",
        {
          outputSchema: {
            type: "object",
            properties: {
              companies: {
                type: "array",
                maxItems: 10,
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    round: { type: "string" },
                    amount: { type: "string" },
                    announcedDate: {
                      type: "string",
                      description: "The funding announcement date"
                    },
                    leadInvestors: {
                      type: "array",
                      items: { type: "string" }
                    }
                  },
                  required: ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            required: ["companies"]
          }
        }
      );
      ```

      ```bash cURL theme={null}
      curl -s -X POST "https://api.exa.ai/search" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $EXA_API_KEY" \
        -d '{
          "query": "AI infrastructure companies that announced Series A or B funding in the past six months",
          "outputSchema": {
            "type": "object",
            "properties": {
              "companies": {
                "type": "array",
                "maxItems": 10,
                "items": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string" },
                    "round": { "type": "string" },
                    "amount": { "type": "string" },
                    "announcedDate": {
                      "type": "string",
                      "description": "The funding announcement date"
                    },
                    "leadInvestors": {
                      "type": "array",
                      "items": { "type": "string" }
                    }
                  },
                  "required": ["name", "round", "amount", "announcedDate"]
                }
              }
            },
            "required": ["companies"]
          }
        }'
      ```
    </CodeGroup>
  </Tab>
</Tabs>

출처 선호나 강조 사항 같은 지시에는 `systemPrompt`를, 응답 형태에는 `outputSchema`를 사용하세요. Python에서는 `system_prompt`와 `output_schema`를 사용합니다.

<Note>
  객체 schema는 작게 유지하세요. 중첩은 최대 2단계, 속성은 최대 10개까지 지원됩니다. schema에 인용이나 신뢰도 필드를 추가하지 마세요. Exa가 `output.grounding`에 자동으로 반환합니다.
</Note>

<div id="filter-results">
  ## 결과 필터링
</div>

필터는 엄격한 제약 조건입니다. 해당 범위를 벗어난 결과가 아예 쓸모없는 경우에만 필터를 추가하고, 그보다 느슨한 출처 선호는 질의 텍스트에 담으세요. 전체 목록은 [API 레퍼런스](/ko/docs/reference/search)에서 확인할 수 있습니다.

<div id="include-domains-or-paths">
  ### 도메인 또는 경로 포함
</div>

`includeDomains`는 신뢰하는 출처로만 결과를 제한합니다. 전체 도메인, `anthropic.com/news`와 같은 경로 접두사, `*.substack.com`과 같은 서브도메인 와일드카드를 사용할 수 있습니다.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "new model releases",
      include_domains=["openai.com", "anthropic.com/news"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("new model releases", {
    includeDomains: ["openai.com", "anthropic.com/news"],
    contents: { highlights: true }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "new model releases",
      "includeDomains": ["openai.com", "anthropic.com/news"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

질의에 `site:` 연산자를 다시 넣지 말고, 경로는 필터에 지정하세요.

<div id="exclude-domains-or-paths">
  ### 도메인 또는 경로 제외
</div>

`excludeDomains`는 특정 도메인이나 경로의 결과를 제외합니다. `includeDomains`와 동일한 경로 접두사와 서브도메인 와일드카드를 지원합니다. 단순한 선호도를 표현할 때가 아니라, 해당 출처가 포함되면 결과를 쓸 수 없게 되는 경우에 사용하세요.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "primary research on retrieval-augmented generation benchmarks",
      exclude_domains=["medium.com", "dev.to"],
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "primary research on retrieval-augmented generation benchmarks",
    {
      excludeDomains: ["medium.com", "dev.to"],
      contents: { highlights: true }
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "primary research on retrieval-augmented generation benchmarks",
      "excludeDomains": ["medium.com", "dev.to"],
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

<div id="content-freshness">
  ## 콘텐츠 최신성
</div>

`contents.maxAgeHours`는 각 결과에서 추출하는 콘텐츠가 얼마나 최신이어야 하는지를 제어합니다. 게시 날짜를 기준으로 결과를 필터링하지는 않습니다.

| 값     | 동작                                            |
| ----- | --------------------------------------------- |
| 생략    | 캐시된 콘텐츠가 있으면 사용하고, 필요한 경우 페이지를 가져옴            |
| 양의 정수 | 캐시된 콘텐츠가 지정한 시간보다 최신이면 사용하고, 그렇지 않으면 페이지를 가져옴 |
| `0`   | 항상 새로 콘텐츠를 가져옴                                |
| `-1`  | 캐시된 콘텐츠만 사용                                   |

대부분의 검색에서는 이 필드를 생략하는 것이 좋습니다. 가격, 재고 여부, 자주 변경되는 페이지처럼 오래된 페이지 콘텐츠로는 쓸모가 없는 경우에 설정하세요.

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "current pricing for serverless GPU providers",
      contents={
          "highlights": True,
          "max_age_hours": 24,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("current pricing for serverless GPU providers", {
    contents: {
      highlights: true,
      maxAgeHours: 24
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "current pricing for serverless GPU providers",
      "contents": {
        "highlights": true,
        "maxAgeHours": 24
      }
    }'
  ```
</CodeGroup>

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="모범 사례" icon="sparkles" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    토큰 예산, 콘텐츠 최신성, structured output, system prompt를 다룹니다.
  </Card>

  <Card title="API 레퍼런스" icon="square-terminal" href="/ko/docs/reference/search" cta="레퍼런스 열기" arrow="true">
    모든 요청 파라미터와 응답 필드, 그리고 라이브 플레이그라운드를 확인하세요.
  </Card>

  <Card title="Contents" icon="file-text" href="/ko/docs/contents/quickstart" cta="가이드 열기" arrow="true">
    이미 URL이 있고 깔끔한 텍스트, highlights, summaries가 필요할 때 사용하세요.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    장시간 실행되는 리서치, list building, enrichment가 필요할 때 사용하세요.
  </Card>
</Columns>