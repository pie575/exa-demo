> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 본격적으로 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="changelog">
  # Changelog
</div>

> Exa의 제품 업데이트 및 공지사항입니다.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  <div id="dynamic-highlights-research-preview">
    ## Dynamic Highlights (리서치 프리뷰)
  </div>

  Dynamic Highlights는 페이지를 하나씩 따로 처리하지 않고 전체 결과 집합을 아울러 excerpt를 선택합니다. 유용한 출처에는 공유 컨텍스트 예산을 더 많이 할당하고, 이미 반환된 정보를 반복하기만 하는 출처에는 적게 할당합니다.

  * **단일 턴 RAG**: 코딩 및 일반 QA 평가 전반에서 Exa Auto 기준 토큰 효율이 약 49% 향상되고 다운스트림 품질이 2.4% 상승했습니다.
  * **에이전트**: 전체 에이전트 실행 경로에서 토큰 사용량이 약 30% 감소하고, BrowseComp, WideSearch 및 내부 기업·인물 평가 전반에서 품질이 1% 상승했습니다.

  `dynamic: true`를 설정한 요청에는 `Exa-Beta: dynamic-highlights-2026-08-28` header가 필요합니다.

  [Dynamic Highlights 가이드 보기 →](/ko/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  <div id="publication-research">
    ## 논문 리서치
  </div>

  학술 출판물 리서치를 대폭 확장하고 개선했습니다.

  * **3억 5천만 건의 출판물**: 3억 5천만 건 규모의 출판물 인덱스를 검색할 수 있습니다.
  * **더 풍부한 조직 및 인물 결과**: 이제 search는 조직과 소속 인물을 함께 반환하며, 각각 출판물, 주요 공동 연구자, 연구 분야, 연구비 정보를 아우르는 상세한 프로필로 제공됩니다.
  * **에이전트 기반 인물 및 조직 search**: 이제 에이전트가 인물과 조직을 대상으로 검색할 수 있습니다.
  * **공개 retrieval 벤치마크**: 출판물 retrieval을 위한 공개 벤치마크를 공개했습니다.
  * **새로운 `publication` search 카테고리**: `category: "publication"`으로 학술 결과를 조회할 수 있으며, 기존 `research paper` 카테고리를 대체합니다.
  * **지원 중단 카테고리**: `pdf`, `github`, `tweet` search 카테고리는 지원이 중단될 예정입니다.
  * **`startCrawlDate` / `endCrawlDate`**: 지원 중단된 이 매개변수는 호환성을 위해 계속 허용되지만, 모든 team에서 무시됩니다.

  API에서 `publication` [search 카테고리](/ko/docs/search/quickstart)로 조회하거나, [dashboard에서 사용해 보세요 →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  <div id="exa-agent-and-exa-connect-in-mcp">
    ## MCP에서 사용하는 Exa Agent와 Exa Connect
  </div>

  이제 Exa MCP에서 Exa Agent를 사용할 수 있습니다. 단일 search 호출만으로 해결되지 않는 작업이라면 Claude, Cursor를 비롯한 모든 MCP 클라이언트에서 활용하세요.

  `https://mcp.exa.ai/mcp?tools=agent_run`으로 Agent 도구를 활성화한 다음 `agent_run`을 호출하면, 에이전트가 완료될 때까지 실행되고 output을 반환합니다.

  Exa Connect 데이터 소스는 Agent 플로우를 통해 사용할 수 있으므로, 실행에 web search만으로 부족할 때 프리미엄 data partners를 attach할 수 있습니다.

  [Exa MCP 가이드 보기 →](/ko/docs/get-started/exa-mcp) · [Exa Agent 가이드 보기 →](/ko/docs/agent/quickstart) · [발표 트윗 보기 →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  <div id="introducing-exa-connect">
    ## Exa Connect 소개
  </div>

  Exa Connect는 Exa Agent가 전 세계의 공개 및 비공개 데이터에 실시간으로 접근할 수 있게 해줍니다. Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko 및 추가 partners와 함께 출시되었습니다. `POST /agent/runs`의 `dataSources`를 통해 attach할 수 있습니다.

  [Exa Connect 가이드 보기 →](/ko/docs/agent/connect/overview) · [발표 트윗 보기 →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  <div id="introducing-exa-agent">
    ## Exa Agent 소개
  </div>

  API로 사용할 수 있는 새로운 차원의 프런티어 웹 리서치 에이전트를 출시했습니다.

  Exa Agent API는 자연어 질의, `effort` 모드, structured output을 위한 `outputSchema`, 기존 데이터셋을 기반으로 확장하는 `input.data` 등의 매개변수를 지원합니다.

  [Exa Agent API 가이드 보기 →](/ko/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "API 지원 중단 안내" }}>
  <div id="api-deprecation-notice">
    ## API 지원 중단 안내
  </div>

  Exa API에서 일부 레거시 항목을 종료했습니다:

  * **`/research` endpoint**: `type: "deep-reasoning"`을 사용하는 `/search`로 대체되었습니다.
  * **`resolvedSearchType` 및 `highlightScores` (응답 필드)**: 4월 15일부터 `null`을 반환하며, 5월 1일에 제거되었습니다.
  * **`startCrawlDate` / `endCrawlDate` (지원 중단된 요청 매개변수)**: 4월 15일부터 별도 알림 없이 무시됩니다.

  [Deep search로 마이그레이션하기 →](/ko/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Exa Monitors 소개" }}>
  <div id="introducing-exa-monitors">
    ## Exa Monitors 소개
  </div>

  Monitor는 정해진 일정에 따라 Exa search를 실행하고 그 결과를 webhook으로 전달합니다. 이전 실행 결과와 중복을 제거하므로 새로운 콘텐츠만 받아볼 수 있습니다.

  * **주제를 지속적으로 추적**: 경쟁사 뉴스, 투자 라운드, 규제 변화, 연구 papers.
  * **구조화된 결과**: `outputSchema`를 통해 일반 텍스트 또는 타입이 지정된 JSON을 반환합니다.
  * **유연한 스케줄링**: 일정 간격(최소 1시간)으로 실행하거나 수동으로 트리거합니다.

  [Monitors API 가이드 읽기 →](/ko/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Exa Deep 개편" }}>
  <div id="exa-deep-revamp">
    ## Exa Deep 개편
  </div>

  Exa Deep이 더 빠르고 저렴해졌으며, 이제 필드 수준 grounding이 포함된 structured output을 지원합니다.

  * 더 높은 effort가 필요한 작업을 위한 **새로운 `deep-reasoning` 타입**(12~~50초); `deep`은 4~~12초 만에 실행됩니다.
  * 일반 `deep` search **가격 20% 인하**.
  * `outputSchema`를 통한 **structured output** 지원, 응답에 `output.content`와 `output.grounding`(필드 수준 citations 및 신뢰도) 포함.

  전체 가격은 아래 [Exa 가격 정책 업데이트](#exa-pricing-update)를 참고하세요.

  [Search API 레퍼런스 읽기 →](/ko/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Exa 가격 정책 업데이트" }}>
  <div id="exa-pricing-update">
    ## Exa 가격 정책 업데이트
  </div>

  가격 정책을 단순화하고 인하했습니다. 이제 상위 10개 search 결과의 contents가 무료로 제공되며, 새 가격은 별도 조치 없이 자동으로 적용됩니다.

  * **contents 포함 search**: 1천 건당 $7 (결과 10개, text + highlights 포함); 추가 결과는 1천 건당 $1.
  * **Summaries**: search와 contents 모두 1천 건당 $1.
  * **Exa Deep**: 1천 건당 $12; **Deep (Reasoning)** 1천 건당 $15.
  * **Contents endpoint**: 콘텐츠 타입별 1천 페이지당 $1.

  [현재 가격 보기 →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Exa Instant Search 소개" }}>
  <div id="introducing-exa-instant-search">
    ## Exa Instant Search 소개
  </div>

  Exa Instant는 향상된 neural search 품질과 150ms 미만의 지연 시간을 동시에 갖춘 가장 빠른 search type입니다. `type="instant"`로 활성화하세요.

  * **실시간 환경을 위한 설계**: 채팅 앱, 음성 AI, coding 에이전트, 자동 완성, 실시간 추천.
  * Exa가 제공하는 가장 낮은 지연 시간에서 구현한 **최고 수준의 품질**.

  [Search API 가이드 읽기 →](/ko/docs/search/quickstart) · [dashboard에서 사용해 보기 →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights, content freshness, MCP 업데이트" }}>
  <div id="highlights-content-freshness-and-mcp-updates">
    ## Highlights, content freshness, MCP 업데이트
  </div>

  content extraction과 접근 방식에 대한 세 가지 개선 사항입니다:

  * **highlights용 `maxCharacters`**: 이제 highlight 길이를 제어하는 권장 방식입니다. `numSentences`와 `highlightsPerUrl`은 지원이 중단되었습니다.
  * **content freshness용 `maxAgeHours`**: 불리언 `livecrawl`을 대체하는 경과 시간 기반 제어입니다(`0`은 항상 크롤링, `-1`은 캐시 전용, `24`는 24시간이 지난 경우 크롤링).
  * **Exa MCP 무료 티어**: 인증 없이 3 QPS, 하루 150회 호출로 사용해 보세요. 전체 기능을 이용하려면 API key를 추가하세요.

  [Content freshness 문서 →](/ko/docs/contents/quickstart#content-freshness) · [Exa MCP →](/ko/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Exa Company Search 출시" }}>
  <div id="introducing-exa-company-search">
    ## Exa Company Search 출시
  </div>

  이제 기업 search에 파인튜닝된 retrieval 모델과 엔티티 매칭 파이프라인이 적용됩니다. `type="auto"`, `category="company"`를 사용하세요.

  * **여러 속성에서 정확함**: 산업, 지역, 투자 단계, 직원 수.
  * **구조화된 엔티티 데이터**: 타입이 지정된 기업 정보(인력, 본사, 재무, 웹 트래픽)를 반환합니다.
  * **활용 사례**: 영업 prospect 발굴, 시장 조사, 공급망 워크플로우.

  [기업 &amp; 인물 Search 문서 보기 →](/ko/docs/search/data/companies-people) · [벤치마크 블로그 보기 →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Exa People Search 출시" }}>
  <div id="introducing-exa-people-search">
    ## Exa People Search 출시
  </div>

  이제 인물 search가 하이브리드 retrieval 시스템을 통해 10억 개 이상의 공개 프로필을 포괄합니다. `linkedin` 카테고리는 새로운 `people` 카테고리로 대체되었습니다.

  * **더 넓은 커버리지**: LinkedIn뿐 아니라 웹 전체의 프로필.
  * **향상된 정확도**: 직무, 역량, 기업 질의에 맞게 파인튜닝된 임베딩.
  * **활용 사례**: 영업, 채용, 시장 조사.

  [기업 &amp; 인물 Search 문서 보기 →](/ko/docs/search/data/companies-people) · [벤치마크 블로그 보기 →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: highlights 복원" }}>
  <div id="js-sdk-highlights-restored">
    ## JS SDK: highlights 복원
  </div>

  `exa-js` v2.0.11부터 JavaScript SDK에 highlights가 복원되어, 관련성 점수와 함께 핵심 문장을 반환합니다. search 및 contents 호출에서 `highlights: true` 또는 `highlights: { maxCharacters, query }`를 전달하세요.

  [JavaScript SDK 문서 보기 →](/ko/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "새로운 Deep Search Type" }}>
  <div id="new-deep-search-type">
    ## 새로운 Deep Search Type
  </div>

  Exa Deep은 여러 search를 동시에 실행해 더 나은 결과를 찾고, 각 결과마다 고품질 컨텍스트를 반환합니다. `type="deep"`으로 활성화하세요.

  * **질의 확장**: 질의 하나만 보내면 Exa가 변형 질의를 생성하며, `additionalQueries`로 직접 지정할 수도 있습니다.
  * 질의와 모든 변형에 대한 **병렬 search 및 스마트 랭킹**.
  * 각 결과에 대한 **상세 summaries**.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "언어 필터링 추가" }}>
  <div id="added-language-filtering">
    ## 언어 필터링 추가
  </div>

  이제 Exa가 질의 언어를 감지해 해당 언어의 결과만 반환합니다. 별도 설정 없이 모든 사용자에게 기본으로 활성화됩니다.

  [Search API 가이드 보기 →](/ko/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "SDK 변경: highlights 제거 및 contents 기본 반환" }}>
  <div id="sdk-changes-highlights-removed-and-contents-returned-by-default">
    ## SDK 변경: highlights 제거 및 contents 기본 반환
  </div>

  호환성이 깨지는 변경이 포함된 메이저 SDK 버전입니다:

  * **contents 기본 제공**: 이제 search가 page contents를 함께 반환합니다. 더 빠른 search를 원하면 해제할 수 있습니다.
  * **SDK에서 highlights 제거**: 이후 JS SDK에서 복원되었습니다. [JS SDK: highlights 복원](#js-sdk-highlights-restored)을 참고하세요.
  * **`use_autoprompt` 지원 중단**: 모든 API 응답에서 제거되었습니다.

  [Python SDK 문서 보기 →](/ko/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "도메인 경로 필터 지원" }}>
  <div id="domain-path-filter-support">
    ## 도메인 경로 필터 지원
  </div>

  이제 `includeDomains`와 `excludeDomains`로 더 세밀하게 타게팅할 수 있습니다:

  * **경로별 필터링**: 예) `exa.ai/blog` 또는 `linkedin.com/company`.
  * **서브도메인 와일드카드**: 예) `*.substack.com`.

  블로그, 제품 카탈로그, 디렉터리로 search 범위를 좁힐 때 유용합니다.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "위치 기반 필터 지원" }}>
  <div id="geolocation-filter-support">
    ## 위치 기반 필터 지원
  </div>

  새로운 `userLocation` 매개변수는 [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 국가 코드(예: `"us"`, `"fr"`)로 전달하며, 사용자의 지역에 맞춰 결과를 보정합니다. 다지역 애플리케이션, 지역 언어 콘텐츠, 로컬 탐색에 유용합니다.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "새로운 Fast search type" }}>
  <div id="new-fast-search-type">
    ## 새로운 Fast search type
  </div>

  Exa Fast는 p50 지연 시간이 425ms 미만인 경량화된 검색 모델을 사용합니다. `type="fast"`로 활성화하세요.

  * neural search와 **동일한 Exa 인덱스**의 고품질 콘텐츠를 사용합니다.
  * 다른 search type과 **매개변수가 완전히 호환**됩니다.
  * 빠른 웹 grounding, 에이전트 워크플로우, 저지연 제품을 **위해 설계**되었습니다.

  [Search API 가이드 보기 →](/ko/docs/search/quickstart) · [dashboard에서 사용해 보기 →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Auto search의 score 지원 중단" }}>
  <div id="score-deprecation-in-auto-search">
    ## Auto search의 score 지원 중단
  </div>

  새로운 Auto search 아키텍처에서는 더 이상 의미 있는 관련성 점수를 산출할 수 없어, Auto search 결과에서 `score` 필드가 제거됩니다.

  * **Auto search**: 더 이상 `score`를 반환하지 않습니다. 결과는 이미 관련성 순으로 정렬되어 있습니다.
  * **Neural search**: 점수는 그대로 유지됩니다. 점수가 필요하다면 `type="neural"`로 설정하세요.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "마크다운 contents를 기본값으로" }}>
  <div id="markdown-contents-as-default">
    ## 마크다운 contents를 기본값으로
  </div>

  이제 모든 endpoint가 기본적으로 깔끔한 마크다운을 반환합니다. LLM, RAG, 일반적인 텍스트 처리에 더 적합합니다. 별도의 조치는 필요하지 않습니다.

  * **`includeHtmlTags=false` (기본값)**: 콘텐츠를 깔끔한 마크다운으로 가공합니다.
  * **`includeHtmlTags=true`**: 마크다운 처리 없이 원본 HTML을 반환합니다.

  어느 쪽이든 광고나 내비게이션 같은 불필요한 요소는 제거됩니다.

  [Contents 문서 보기 →](/ko/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "새로운 Livecrawl 옵션: Preferred" }}>
  <div id="new-livecrawl-option-preferred">
    ## 새로운 Livecrawl 옵션: Preferred
  </div>

  <Warning>
    과거 기록: `livecrawl` 문자열 매개변수는 현재 지원이 중단되었습니다. 새로 연동할 때는 `maxAgeHours`를 `livecrawlTimeout`과 함께 사용하세요. [Content Freshness](/ko/docs/contents/quickstart#content-freshness)를 참고하세요.
  </Warning>

  지원이 중단된 `livecrawl: "preferred"` 옵션은 새로 크롤링을 시도하되, 크롤링에 실패하면 캐시된 콘텐츠로 대체합니다(오류를 발생시키는 `"always"`와 다릅니다). 일시적으로 접근할 수 없는 사이트 때문에 실패하지 않으면서 최신 콘텐츠를 얻고자 하는 프로덕션 앱에 적합합니다.

  [Content Freshness 문서 보기 →](/ko/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Contents endpoint 상태 변경" }}>
  <div id="contents-endpoint-status-changes">
    ## Contents endpoint 상태 변경
  </div>

  이제 `/contents`는 단일 HTTP 오류 대신 URL별 `statuses` 필드를 반환하므로, 각 URL의 결과를 개별적으로 처리할 수 있습니다. 이 endpoint는 내부 문제가 발생한 경우에만 오류를 반환합니다.

  * **`status`**: URL별로 `"success"` 또는 `"error"`.
  * **`error.tag`**: 예를 들어 `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE` 등이며, `httpStatusCode`가 함께 제공됩니다.

  [Error codes 레퍼런스 보기 →](/ko/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search를 기본값으로" }}>
  <div id="auto-search-as-default">
    ## Auto search를 기본값으로
  </div>

  이제 Auto search가 기본값이며, 각 질의를 가장 적합한 검색 방식으로 자동 라우팅합니다. 별도의 조치는 필요하지 않으며, 기존 동작을 유지하려면 `type="neural"`로 설정하세요.

  [Exa의 search type 알아보기 →](/ko/docs/search/quickstart)
</Update>