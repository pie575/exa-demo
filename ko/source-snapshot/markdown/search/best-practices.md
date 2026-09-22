> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일을 사용해 이용 가능한 모든 페이지를 확인하세요.

<div id="search-best-practices">
  # Search 모범 사례
</div>

> 프로덕션 Search API 연동을 위해 검색 품질, latency, 컨텍스트, synthesis를 조정하세요.

이 가이드는 이미 동작하는 [Search API 요청](/ko/docs/search/quickstart)이 있다고 가정하며, Exa가 권장하는 모범 사례에 따라 해당 요청을 개선하는 방법을 다룹니다.

<div id="start-with-the-smallest-useful-request">
  ## 꼭 필요한 최소한의 요청부터 시작하세요
</div>

가장 좋은 출발점은 `highlights: true`를 지정한 자연어 질의입니다. Exa는 각 result의 발췌문 길이를 관련성에 맞춰 조절하므로, 따로 조정할 character budget이 없습니다:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      contents={"highlights": True},
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search(
    "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
    { contents: { highlights: true } }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent technical articles comparing hybrid and semantic retrieval for RAG systems",
      "contents": { "highlights": true }
    }'
  ```
</CodeGroup>

이렇게 하면 순위가 매겨진 페이지와 함께, 질의와 관련된 페이지별 토큰 효율적인 컨텍스트를 얻을 수 있습니다.

추가 parameters는 필요할 때만 더하세요:

| 매개변수                       | 추가하는 경우                                    |
| -------------------------- | ------------------------------------------ |
| `type`                     | latency 예산이나 깊이 요구사항에 맞춰 조정할 때             |
| `numResults`               | 컨텍스트 윈도우를 줄이려고 페이지 수를 낮추거나, 재현율을 넓히려고 늘릴 때 |
| `outputSchema`             | result를 종합하거나 JSON으로 구조화할 때                |
| `maxAgeHours`              | 캐시된 페이지 콘텐츠가 너무 오래되었을 수 있을 때               |
| `highlights.maxCharacters` | 애플리케이션에서 페이지당 고정된 발췌문 limit이 필요할 때         |
| 도메인 또는 날짜 필터               | 해당 제약을 벗어난 result는 쓸 수 없을 때                |

<div id="search-vs-deep-search">
  ## Search vs. Deep Search
</div>

표준 search는 질의에 해당하는 페이지를 찾아 순위를 매깁니다. Deep Search는 반복적으로 search하고, 찾은 내용을 검토하고, search를 다듬고, 근거 기반 결과를 synthesis하는 리서치 과정을 실행합니다.

| 필요한 것                                                                                       | 시작점                                 |
| ------------------------------------------------------------------------------------------- | ----------------------------------- |
| 잘 구성된 질의에 대한 순위가 매겨진 페이지                                                                    | `auto` 또는 `fast`                    |
| 까다로운 search, 여러 result에 걸친 synthesis, 또는 단일 search로는 채울 수 없는 structured output(field 3개 이상) | `deep`                              |
| 장시간 실행되는 리서치, 리스트 구축, 또는 다단계 enrichment                                                     | [Exa Agent](/ko/docs/agent/quickstart) |

`outputSchema`를 사용할 때는 기본적으로 deep 모드를 권장합니다. 전체 안내와 예제는 [Deep Search 가이드](/ko/docs/search/deep-search)를 참고하세요.

<div id="improve-retrieval-quality">
  ## 검색 품질 개선하기
</div>

결과를 개선해야 할 때는 요청의 한 부분씩만 변경하세요.

<Steps>
  <Step title="질의를 명확히 하기">
    키워드를 나열하지 말고 원하는 페이지를 설명하세요. 주제와 함께, 어떤 결과가 관련 있는지를 좌우하는 출처 유형,
    기간, 기타 세부 사항을 포함하세요.

    ```text theme={null}
    Benchmark papers evaluating long-context retrieval methods on legal documents
    ```
  </Step>

  <Step title="response를 층층이 읽기">
    요청을 변경하기 전에 제목, URL, 발행일, highlights를 살펴보세요.

    ```json theme={null}
    {
      "results": [
        {
          "title": "Long-Context Retrieval Methods on Legal Documents",
          "url": "https://arxiv.org/abs/2608.00000",
          "publishedDate": "2026-08-26T00:00:00.000Z",
          "highlights": [
            "We compare long-context retrieval methods across legal document benchmarks..."
          ]
        }
      ]
    }
    ```

    제목과 URL은 Exa가 가져온 소스의 종류를, `publishedDate`는 최신성을,
    highlight는 질의와 일치한 evidence를 보여줍니다. 다른 페이지를 가져오려면 질의를 다듬고,
    기간을 좁히려면 날짜 필터를 추가하며, 유용한 결과에서 더 많은 컨텍스트가 필요하면 전체 텍스트를
    가져오세요.
  </Step>

  <Step title="꼭 필요한 제약만 추가하기">
    제약을 위반하는 결과를 아예 쓸 수 없는 경우에만 `includeDomains`, `excludeDomains`, publication-date 필터를
    사용하세요. 검색에 대한 선호 사항은 질의에 담고, 결과를 종합할 때는 response 지침을 `systemPrompt`에 넣으세요.
  </Step>

  <Step title="search mode는 마지막에 변경하기">
    latency 요구 사항이 있다면 더 빠른 모드를, 검색 과정 자체에 반복과 추론이 필요하다면 deep 모드를
    사용하세요. 모드를 바꾼다고 해서 불충분하게 정의된 질의가 보완되지는 않습니다.
  </Step>
</Steps>

튜닝할 때는 대표적인 질의를 소규모 집합으로 유지하세요. 하나의 예시에 최적화하지 말고, 그 집합 전반에서 결과의 관련성과 후속 작업의 성공 여부를 비교하세요. 회귀를 재현할 수 있도록 `requestId`, `searchTime`, `costDollars`를 기록해 두세요.

<div id="budget-latency-and-context">
  ## latency와 컨텍스트 예산 관리
</div>

각 제어 항목은 서로 다른 자원을 소비합니다:

| 제어 항목                     | 추가되는 비용                         |
| ------------------------- | ------------------------------- |
| 결과 수 늘리기                  | 더 많은 페이지, response 데이터, 후속 컨텍스트 |
| 전체 텍스트                    | 더 넓은 페이지 컨텍스트와 더 큰 payload      |
| `summary`                 | 결과당 언어 모델 call 1회 추가            |
| `outputSchema`            | 검색된 결과 전반에 대한 synthesis         |
| `contents.maxAgeHours: 0` | 캐시된 content 대신 페이지 새로 가져오기      |
| deep search type          | 반복적인 검색, synthesis, 추론          |

캐시된 content를 써도 무방한 실시간 경로라면, latency가 가장 낮은 모드를 highlights 및 캐시 전용 content와 조합하세요:

<CodeGroup>
  ```python Python theme={null}
  result = exa.search(
      "Recent product updates from major AI labs",
      type="instant",
      contents={
          "highlights": True,
          "max_age_hours": -1,
      },
  )
  ```

  ```javascript JavaScript theme={null}
  const result = await exa.search("Recent product updates from major AI labs", {
    type: "instant",
    contents: {
      highlights: true,
      maxAgeHours: -1
    }
  });
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -d '{
      "query": "Recent product updates from major AI labs",
      "type": "instant",
      "contents": {
        "highlights": true,
        "maxAgeHours": -1
      }
    }'
  ```
</CodeGroup>

페이지의 최신성이 정확성을 좌우하는 경우에는 이 방식을 쓰지 마세요. 제품에 측정된 latency 목표가 없다면 `auto`와 기본 최신성 설정으로 시작하세요.

Exa가 하나의 컨텍스트 예산을 전체 결과 집합에 배분하도록 하려면(양질의 소스에는 더 많이, 중복된 소스에는 더 적게) [Dynamic Highlights 리서치 프리뷰](/ko/docs/search/highlights#dynamic-highlights)를 참고하세요.

<div id="tips-for-common-use-cases">
  ## 일반적인 사용 사례별 팁
</div>

| 필요한 경우                | 사용                                                                | 피할 것                             |
| --------------------- | ----------------------------------------------------------------- | -------------------------------- |
| 더 최신 출판물              | 질의에 기간을 명시하거나 publication-date filters 사용                         | `maxAgeHours`                    |
| 자주 바뀌는 페이지의 최신 콘텐츠    | `contents.maxAgeHours`                                            | publication-date filters         |
| 특정 유형의 소스 선호          | 질의 표현 방식, synthesis 시에는 `systemPrompt`                            | 엄격한 도메인 허용 목록                    |
| 승인된 소스에서만 얻는 결과       | `includeDomains`                                                  | 질의에서 `site:` 반복 사용               |
| 소규모 structured output | 표준 Search와 `outputSchema` 조합                                      | output이 JSON이라는 이유만으로 Deep 선택    |
| 여러 항목을 리서치한 output    | `deep`과 `outputSchema` 조합, 또는 [Exa Agent](/ko/docs/agent/quickstart) | 한 번의 검색으로 모든 항목을 모을 수 있다는 기대     |
| 소수 페이지에서 더 많은 컨텍스트    | highlights와 함께 search한 뒤 Contents 호출                              | 모든 result에 대한 전체 텍스트             |
| 더 낮은 latency          | 간결한 content로 `fast` 또는 `instant` 측정                               | freshness나 synthesis 제어를 기본으로 추가 |

<div id="when-to-use-another-endpoint">
  ## 다른 엔드포인트를 사용해야 하는 경우
</div>

작업의 성격이 달라지면 그에 맞는 다른 Exa 엔드포인트를 사용하세요:

| 작업                               | 사용                                    |
| -------------------------------- | ------------------------------------- |
| 장시간 실행되는 리서치, 리스트 구축, enrichment | [Exa Agent](/ko/docs/agent/quickstart)   |
| URL을 이미 알고 있는 경우                 | [Contents](/ko/docs/contents/quickstart) |
| 정해진 일정에 따라 search 실행             | [Monitors](/ko/docs/monitors/quickstart) |

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="Search API reference" icon="square-terminal" href="/ko/docs/reference/search" cta="reference 열기" arrow="true">
    모든 요청 매개변수와 response field를 확인하세요.
  </Card>

  <Card title="Search 퀵스타트" icon="search" href="/ko/docs/search/quickstart" cta="가이드 보기" arrow="true">
    핵심 요청 형태, 필터, output, 최신성을 다룹니다.
  </Card>

  <Card title="Contents API" icon="file-text" href="/ko/docs/contents/quickstart" cta="가이드 열기" arrow="true">
    이미 알고 있는 페이지에서 highlights나 전체 텍스트를 추출하세요.
  </Card>

  <Card title="Exa Agent" icon="bot" href="/ko/docs/agent/quickstart" cta="가이드 열기" arrow="true">
    장시간 실행되는 리서치, 리스트 구축, enrichment를 수행합니다.
  </Card>
</Columns>