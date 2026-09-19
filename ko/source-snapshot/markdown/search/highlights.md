> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="highlights">
  # Highlights
</div>

> 컨텍스트 크기와 지연 시간을 제어하면서 Exa Search 결과에서 질의와 관련된 excerpt를 반환합니다.

Highlights는 각 결과에서 질의와 관련된 발췌 구절을 반환합니다. 전체 텍스트를 가져올 때 발생하는 토큰 cost 없이 페이지의 evidence만 필요한 경우에 사용하세요.

각 결과의 선택된 구절은 `results[].highlights`에 담겨 반환됩니다.

<div id="why-highlights-instead-of-full-text">
  ## 전체 텍스트 대신 highlights를 쓰는 이유
</div>

Highlights는 Exa가 자체 개발한 extraction 모델이 생성합니다. 이 모델은 요청이 있을 때마다 각 결과를 질의와 대조해 읽고, 질의에 답하는 구절만 반환합니다. 전체 페이지 텍스트에 비해 극히 일부의 토큰만 쓰면서도 후속 답변 품질은 동등하거나 더 낫습니다.

| 평가 항목           | 결과                                                                                               |
| --------------- | ------------------------------------------------------------------------------------------------ |
| 정확도(SimpleQA)   | 500자 분량의 highlights가 페이지 텍스트 앞부분 8,000자와 동일한 정확도를 보이며, 토큰은 16배 적음                                |
| 더 큰 예산에서의 품질    | 4,000자 분량의 highlights가 32,000자 전체 텍스트보다 높은 점수를 기록                                                |
| 긴 기술 문서         | 500자 character budget에서 highlights는 API 레퍼런스, SDK 문서, 명세, papers에서 60% 정확도를 달성하지만 전체 텍스트는 6%에 그침 |
| search 토큰 usage | Highlights는 search 토큰을 평균 5배 절감                                                                  |

이러한 절감 효과는 agent 루프에서 가장 큰 의미를 갖습니다. 매 라운드의 search 결과가 추론 기록과 컨텍스트를 두고 경쟁하기 때문입니다.

<Tip>
  방법론과 전체 결과는 [Exa Highlights: Quality, Token-Efficient Search](https://exa.ai/blog/highlights-for-agents)에서
  확인하세요.
</Tip>

<div id="add-highlights-to-search">
  ## search에 highlights 추가하기
</div>

권장 기본값으로 `contents` 안에 `highlights: true`를 사용하세요. Exa가 질의와의 관련성에 따라 각 결과에서 반환할 텍스트 양을 알아서 결정하므로 따로 조정할 character budget이 없습니다. 애플리케이션에서 페이지당 고정된 limit이 필요할 때만 `maxCharacters`를 설정하세요.

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
      "contents": {
        "highlights": true
      }
    }'
  ```
</CodeGroup>

<div id="dynamic-highlights">
  ## Dynamic Highlights
</div>

Dynamic Highlights는 질의에 가장 유용한 내용이 무엇인지에 따라 각 결과에서 추출하는 텍스트 양을 조정합니다. 좋은 출처에서는 더 많이, 반복적이거나 관련성이 낮은 출처에서는 더 적게 가져와 반환되는 총 토큰 수를 줄입니다.

여러 결과가 동일한 agent나 컨텍스트 윈도우로 들어가는 경우에 사용하세요. 모든 페이지마다 각각의 excerpt가 필요하거나 페이지당 예측 가능한 limit이 필요하다면 일반 `highlights: true`를 그대로 사용하세요.

Exa의 평가에서 Dynamic Highlights는 전체 page content 대비 토큰을 평균 95% 줄였습니다. 12,000자 character budget에서는 평균 40%의 토큰 효율 향상과 3.8%의 품질 향상으로 일반 highlights를 앞섰습니다. Exa Agent 내부에서는 BrowseComp와 WideSearch를 포함한 벤치마크에서 평균 2.1%의 품질 향상과 함께 전체 agent 토큰 usage를 30% 줄였습니다.

<Tip>
  결과 간 highlight 선택의 평가 결과와 설계가 궁금하다면 [Dynamic Highlights](https://exa.ai/blog/dynamic-highlights)를
  읽어보세요.
</Tip>

`dynamic: true`로 활성화합니다:

<CodeGroup>
  ```python Python theme={null}
  from exa_py.api import DYNAMIC_HIGHLIGHTS_BETA

  result = exa.search(
      "How did US household solar installation costs change over the past five years?",
      contents={
          "highlights": {
              "dynamic": True,
          }
      },
      betas=[DYNAMIC_HIGHLIGHTS_BETA],
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa, { DYNAMIC_HIGHLIGHTS_BETA } from "exa-js";

  const result = await exa.search(
    "How did US household solar installation costs change over the past five years?",
    {
      contents: {
        highlights: {
          dynamic: true
        }
      },
      betas: [DYNAMIC_HIGHLIGHTS_BETA]
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Exa-Beta: dynamic-highlights-2026-08-28" \
    -d '{
      "query": "How did US household solar installation costs change over the past five years?",
      "contents": {
        "highlights": {
          "dynamic": true
        }
      }
    }'
  ```
</CodeGroup>

<Info>
  Dynamic Highlights는 리서치 프리뷰이며
  `Exa-Beta: dynamic-highlights-2026-08-28` 요청 header가 필요합니다. SDK에서는
  `betas=[DYNAMIC_HIGHLIGHTS_BETA]`(Python) 또는 `betas: [DYNAMIC_HIGHLIGHTS_BETA]`(JavaScript)를 전달하면 자동으로 전송됩니다.

  응답은 일반 highlights와 동일한
  `results[].highlights` 형태를 사용합니다.
</Info>

<div id="next-steps">
  ## 다음 단계
</div>

<Columns cols={2}>
  <Card title="Search API 가이드" icon="search" href="/ko/docs/search/quickstart" cta="가이드 열기" arrow="true">
    search 요청을 구성하고 알맞은 출력 형태를 선택하세요.
  </Card>

  <Card title="search 모범 사례" icon="sparkles" href="/ko/docs/search/best-practices" cta="가이드 읽기" arrow="true">
    검색 품질, 지연 시간, 최신성, 컨텍스트 크기를 조정하세요.
  </Card>
</Columns>