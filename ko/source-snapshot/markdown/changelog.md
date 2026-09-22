> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일을 사용해 사용 가능한 모든 페이지를 확인하세요.

# 변경 로그 {#changelog}

> Exa의 제품 업데이트 및 공지 사항입니다.

<Update label="August 28, 2026" rss={{ title: "Dynamic Highlights (research preview)" }}>
  ## Dynamic Highlights (리서치 프리뷰) {#dynamic-highlights-research-preview}

  Dynamic Highlights는 각 페이지를 개별적으로 처리하지 않고 전체 결과 집합을 아울러 발췌문을 선택합니다. 유용한 소스에는 공유 컨텍스트 예산을 더 많이 할당하고, 이미 반환된 정보를 반복하기만 하는 소스에는 적게 할당합니다.

  * **단일 턴 RAG**: 코딩 및 일반 QA 평가 전반에서 Exa Auto 기준 토큰 효율이 약 49% 향상되고 다운스트림 품질이 2.4% 높아졌습니다.
  * **Agents**: agent 실행 경로 전체에서 토큰을 약 30% 절감하고, BrowseComp, WideSearch 및 내부 기업·인물 평가 전반에서 품질이 1% 높아졌습니다.

  `dynamic: true`를 설정하는 요청에는 `Exa-Beta: dynamic-highlights-2026-08-28` header가 필요합니다.

  [Dynamic Highlights 가이드 보기 →](/ko/docs/contents/quickstart)
</Update>

<Update label="July 23, 2026" rss={{ title: "Publication research" }}>
  ## 출판물 리서치 {#publication-research}

  학술 출판물에 대한 리서치를 대폭 확장하고 개선했습니다.

  * **3억 5천만 출판물**: 3억 5천만 건의 출판물 인덱스를 검색할 수 있습니다.
  * **더 풍부한 조직 및 인물 결과**: 이제 search는 조직과 소속 인물을 함께 반환하며, 각각 출판물, 주요 공동 연구자, 연구 분야, 연구비를 아우르는 상세한 프로필로 제공됩니다.
  * **에이전틱 인물 및 조직 search**: 이제 agent가 인물과 조직을 대상으로 search할 수 있습니다.
  * **공개 검색 벤치마크**: 출판물 검색에 대한 공개 벤치마크를 공개했습니다.
  * **새로운 `publication` search 카테고리**: `category: "publication"`으로 학술 결과를 질의하세요. 기존 `research paper` 카테고리를 대체합니다.
  * **지원 중단 카테고리**: `pdf`, `github`, `tweet` search 카테고리는 지원 중단될 예정입니다.
  * **`startCrawlDate` / `endCrawlDate`**: 지원 중단된 parameters는 이제 모든 team에서 무시되며, 호환성을 위해 값 자체는 계속 허용됩니다.

  `publication` [search 카테고리](/ko/docs/search/quickstart)로 API를 통해 질의하거나, [dashboard에서 사용해 보세요 →](https://dashboard.exa.ai/playground/search?type=instant).
</Update>

<Update label="July 1, 2026" rss={{ title: "Exa Agent and Exa Connect in MCP" }}>
  ## MCP의 Exa Agent 및 Exa Connect {#exa-agent-and-exa-connect-in-mcp}

  이제 Exa MCP에서 Exa Agent를 사용할 수 있습니다. 한 번의 search call만으로 해결되지 않는 작업이라면 Claude, Cursor 등 어떤 MCP 클라이언트에서든 활용해 보세요.

  `https://mcp.exa.ai/mcp?tools=agent_run`으로 Agent 도구를 활성화한 다음, `agent_run`을 call하여 agent를 완료 시점까지 실행하고 그 output을 받아보세요.

  Exa Connect 데이터 소스는 Agent 플로우를 통해 사용할 수 있으므로, 실행에 web search만으로 부족할 때 프리미엄 data partners를 attach할 수 있습니다.

  [Exa MCP 가이드 보기 →](/ko/docs/get-started/exa-mcp) · [Exa Agent 가이드 보기 →](/ko/docs/agent/quickstart) · [공지 트윗 →](https://x.com/ExaAILabs/status/2072389192458592672)
</Update>

<Update label="June 24, 2026" rss={{ title: "Introducing Exa Connect" }}>
  ## Exa Connect 소개 {#introducing-exa-connect}

  Exa Connect는 Exa Agent가 전 세계의 공개 및 비공개 데이터에 실시간으로 접근할 수 있게 해줍니다. Similarweb, Fiber.ai, Baselayer, Financial Datasets, Affiliate.com, Particle, Jinko 및 추가 파트너와 함께 출시되었습니다. `POST /agent/runs`의 `dataSources`를 통해 attach할 수 있습니다.

  [Exa Connect 가이드 보기 →](/ko/docs/agent/connect/overview) · [공지 트윗 →](https://x.com/ExaAILabs/status/2069842203577651283)
</Update>

<Update label="June 16, 2026" rss={{ title: "Introducing Exa Agent" }}>
  ## Exa Agent 소개 {#introducing-exa-agent}

  API로 사용할 수 있는 새로운 차원의 프런티어 웹 리서치 agent를 출시했습니다.

  Exa Agent API는 자연어 질의, `effort` 모드, structured outputs를 위한 `outputSchema`, 기존 데이터셋을 기반으로 작업을 확장하는 `input.data` 등의 parameters를 지원합니다.

  [Exa Agent API 가이드 보기 →](/ko/docs/agent/quickstart)
</Update>

<Update label="April 1, 2026" rss={{ title: "API 지원 중단 안내" }}>
  ## API 지원 중단 안내 {#api-deprecation-notice}

  Exa API에서 몇 가지 레거시 항목을 종료했습니다:

  * **`/research` 엔드포인트**: `type: "deep-reasoning"`을 사용하는 `/search`로 대체되었습니다.
  * **`resolvedSearchType` 및 `highlightScores` (response fields)**: 4월 15일부터 `null`을 반환하며, 5월 1일에 제거되었습니다.
  * **`startCrawlDate` / `endCrawlDate` (지원 중단된 요청 parameters)**: 4월 15일부터 별도 알림 없이 무시됩니다.

  [Deep search로 마이그레이션하기 →](/ko/docs/reference/search)
</Update>

<Update label="March 30, 2026" rss={{ title: "Exa Monitors 소개" }}>
  ## Exa Monitors 소개 {#introducing-exa-monitors}

  Monitors는 Exa search를 일정에 따라 실행하고 결과를 웹훅으로 전달하며, 이전 실행과 중복을 제거해 새로운 콘텐츠만 받아볼 수 있습니다.

  * **시간에 따른 주제 추적**: competitor 소식, 투자 라운드, 규제 변화, 리서치 논문.
  * **구조화된 결과**: `outputSchema`를 통해 일반 텍스트 또는 타입이 지정된 JSON을 반환합니다.
  * **유연한 일정 관리**: 실행 주기(최소 1시간)에 따라 실행하거나 수동으로 트리거합니다.

  [Monitors API 가이드 읽기 →](/ko/docs/monitors/quickstart)
</Update>

<Update label="March 4, 2026" rss={{ title: "Exa Deep 개편" }}>
  ## Exa Deep 개편 {#exa-deep-revamp}

  Exa Deep이 더 빠르고 저렴해졌으며, 이제 field 단위 grounding을 포함한 structured output을 지원합니다.

  * 더 높은 effort가 필요한 작업을 위한 **새로운 `deep-reasoning` 타입**(12~~50초); `deep`은 4~~12초에 실행됩니다.
  * 일반 `deep` search의 **가격 20% 인하**.
  * `outputSchema`를 통한 **structured output**, response에 `output.content` 및 `output.grounding`(field 단위 citations 및 confidence) 포함.

  전체 가격은 아래 [Exa 가격 업데이트](#exa-pricing-update)를 참고하세요.

  [Search API reference 읽기 →](/ko/docs/reference/search)
</Update>

<Update label="March 3, 2026" rss={{ title: "Exa 가격 업데이트" }}>
  ## Exa 가격 업데이트 {#exa-pricing-update}

  가격 체계를 단순화하고 인하했습니다. 이제 search 결과 상위 10개의 contents가 무료로 포함되며, 새로운 가격은 별도의 조치 없이 자동으로 적용됩니다.

  * **contents 포함 search**: 1,000 요청당 $7(결과 10개, 텍스트 + highlights 포함), 추가 결과 1,000개당 $1.
  * **Summary**: search와 contents 모두 1,000건당 $1.
  * **Exa Deep**: 1,000 요청당 $12, **Deep (Reasoning)**은 1,000 요청당 $15.
  * **Contents 엔드포인트**: content type별 1,000페이지당 $1.

  [현재 가격 보기 →](https://exa.ai/pricing)
</Update>

<Update label="February 5, 2026" rss={{ title: "Exa Instant Search 소개" }}>
  ## Exa Instant Search 소개 {#introducing-exa-instant-search}

  Exa Instant는 가장 빠른 search type으로, 향상된 neural search 품질과 150ms 미만의 latency를 함께 제공합니다. `type="instant"`로 활성화하세요.

  * **실시간을 위한 설계**: 채팅 앱, 음성 AI, coding agent, 자동 완성, 실시간 추천.
  * Exa가 제공하는 가장 낮은 latency로 구현한 **최고 수준의 품질**.

  [Search API 가이드 읽기 →](/ko/docs/search/quickstart) · [dashboard에서 사용해 보기 →](https://dashboard.exa.ai/playground/search?type=instant)
</Update>

<Update label="February 2, 2026" rss={{ title: "Highlights, 콘텐츠 최신성, MCP 업데이트" }}>
  ## Highlights, 콘텐츠 최신성, MCP 업데이트 {#highlights-content-freshness-and-mcp-updates}

  콘텐츠 extraction 및 접근과 관련된 세 가지 개선 사항:

  * **highlights용 `maxCharacters`**: 이제 highlight 길이를 제어하는 권장 방식입니다. `numSentences`와 `highlightsPerUrl`은 지원 중단되었습니다.
  * **콘텐츠 최신성을 위한 `maxAgeHours`**: 불리언 `livecrawl`을 대체하는 경과 시간 기반 제어입니다(`0`은 항상 크롤링, `-1`은 캐시만 사용, `24`는 24시간보다 오래된 경우 크롤링).
  * **Exa MCP 무료 티어**: 3 QPS, 하루 150 call까지 인증 없이 사용해 보세요. 전체 기능을 이용하려면 API 키를 추가하세요.

  [콘텐츠 최신성 문서 →](/ko/docs/contents/quickstart#content-freshness) · [Exa MCP →](/ko/docs/get-started/exa-mcp)
</Update>

<Update label="January 21, 2026" rss={{ title: "Exa Company Search 출시" }}>
  ## Exa Company Search 출시 {#introducing-exa-company-search}

  이제 기업 search에 파인튜닝된 검색 모델과 엔티티 매칭 파이프라인이 적용됩니다. `type="auto"`, `category="company"`를 사용하세요.

  * **여러 속성에서 정확함**: 산업, 지역, 펀딩 단계, 직원 수.
  * **구조화된 엔티티 데이터**: 결과로 타입이 지정된 기업 정보(인력, 본사, 재무, 웹 traffic)가 반환됩니다.
  * **활용 사례**: 영업 잠재 고객 발굴, 시장 리서치, 공급망 워크플로우.

  [Companies &amp; People Search 문서 보기 →](/ko/docs/search/data/companies-people) · [벤치마크 블로그 보기 →](https://exa.ai/blog/company-search-benchmarks)
</Update>

<Update label="December 19, 2025" rss={{ title: "Exa People Search 출시" }}>
  ## Exa People Search 출시 {#introducing-exa-people-search}

  이제 인물 search가 하이브리드 검색 시스템을 통해 10억 개 이상의 공개 프로필을 아우릅니다. `linkedin` 카테고리는 새로운 `people` 카테고리로 대체되었습니다.

  * **더 넓은 커버리지**: LinkedIn뿐 아니라 웹 전체의 프로필.
  * **더 높은 정확도**: 직무, 역량, 기업 질의에 맞춰 파인튜닝된 임베딩.
  * **활용 사례**: 영업, 채용, 시장 리서치.

  [Companies &amp; People Search 문서 보기 →](/ko/docs/search/data/companies-people) · [벤치마크 블로그 보기 →](https://exa.ai/blog/people-search-benchmark)
</Update>

<Update label="November 26, 2025" rss={{ title: "JS SDK: highlights 복원" }}>
  ## JS SDK: highlights 복원 {#js-sdk-highlights-restored}

  `exa-js` v2.0.11부터 JavaScript SDK에 highlights가 다시 추가되어 관련성 점수와 함께 핵심 문장을 반환합니다. search 및 contents 호출에서 `highlights: true` 또는 `highlights: { maxCharacters, query }`를 전달하세요.

  [JavaScript SDK 문서 보기 →](/ko/docs/sdks/quickstart)
</Update>

<Update label="November 20, 2025" rss={{ title: "새로운 Deep search type" }}>
  ## 새로운 Deep search type {#new-deep-search-type}

  Exa Deep은 여러 search를 동시에 실행하고 각 result마다 고품질 컨텍스트를 반환해 더 나은 결과를 찾아냅니다. `type="deep"`으로 활성화하세요.

  * **질의 확장**: 질의 하나만 보내면 변형을 생성해 주며, `additionalQueries`로 직접 지정할 수도 있습니다.
  * 질의와 모든 변형에 걸친 **병렬 search 및 스마트 랭킹**.
  * 각 result에 대한 **상세 summary**.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="November 5, 2025" rss={{ title: "언어 필터링 추가" }}>
  ## 언어 필터링 추가 {#added-language-filtering}

  이제 Exa가 질의 언어를 감지해 해당 언어의 결과만 반환합니다. 모든 사용자에게 기본 활성화되어 있으며 별도의 설정이 필요하지 않습니다.

  [Search API 가이드 보기 →](/ko/docs/search/quickstart)
</Update>

<Update label="October 28, 2025" rss={{ title: "SDK 변경 사항: highlights 제거 및 contents 기본 반환" }}>
  ## SDK 변경 사항: highlights 제거 및 contents 기본 반환 {#sdk-changes-highlights-removed-and-contents-returned-by-default}

  호환성이 깨지는 변경이 포함된 메이저 SDK 버전입니다:

  * **contents 기본 제공**: 이제 search 결과에 page contents가 포함되며, 더 빠른 search를 원하면 해제할 수 있습니다.
  * **SDK에서 highlights 제거**: 이후 JS SDK에서 복원되었습니다. [JS SDK: highlights 복원](#js-sdk-highlights-restored)을 참고하세요.
  * **`use_autoprompt` 지원 중단**: 모든 API response에서 제거되었습니다.

  [Python SDK 문서 보기 →](/ko/docs/sdks/quickstart)
</Update>

<Update label="August 4, 2025" rss={{ title: "도메인 경로 필터 지원" }}>
  ## 도메인 경로 필터 지원 {#domain-path-filter-support}

  이제 `includeDomains`와 `excludeDomains`로 더 세밀하게 타기팅할 수 있습니다:

  * **경로 기반 필터링**: 예를 들어 `exa.ai/blog` 또는 `linkedin.com/company`.
  * **서브도메인 와일드카드**: 예를 들어 `*.substack.com`.

  블로그, 제품 카탈로그, 디렉터리로 search 범위를 좁힐 때 유용합니다.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="July 30, 2025" rss={{ title: "위치 기반 필터 지원" }}>
  ## 위치 기반 필터 지원 {#geolocation-filter-support}

  새로운 `userLocation` 매개변수는 [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) 국가 코드(예: `"us"`, `"fr"`)로 전달되며, 결과를 사용자의 지역에 맞게 편향시킵니다. 다지역 애플리케이션, 지역 언어 콘텐츠, 로컬 탐색에 유용합니다.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="July 29, 2025" rss={{ title: "New Fast Search Type" }}>
  ## 새로운 Fast search type {#new-fast-search-type}

  Exa Fast는 간소화된 검색 모델을 사용해 p50 latency가 425ms 미만입니다. `type="fast"`로 사용하세요.

  * neural search와 **동일한 Exa 인덱스**의 고품질 콘텐츠를 사용합니다.
  * 다른 search type과 **매개변수가 완전히 호환**됩니다.
  * 빠른 웹 grounding, agent 워크플로우, 저지연 제품을 **위해 설계**되었습니다.

  [Search API 가이드 보기 →](/ko/docs/search/quickstart) · [dashboard에서 사용해 보기 →](https://dashboard.exa.ai/playground/search?q=blog%20post%20about%20AI\&filters=%7B%22text%22%3A%22true%22%2C%22type%22%3A%22fast%22%2C%22livecrawl%22%3A%22never%22%7D)
</Update>

<Update label="July 21, 2025" rss={{ title: "Score Deprecation in Auto Search" }}>
  ## Auto search의 Score 지원 중단 {#score-deprecation-in-auto-search}

  새로운 Auto search 아키텍처에서는 더 이상 의미 있는 관련성 점수를 산출할 수 없어, Auto search 결과에서 `score` field가 제거됩니다.

  * **Auto search**: 더 이상 `score`를 반환하지 않습니다. 결과는 이미 관련성 순으로 정렬되어 있습니다.
  * **Neural search**: 점수는 그대로 유지됩니다. 점수가 필요하다면 `type="neural"`로 설정하세요.

  [Search API reference 보기 →](/ko/docs/reference/search)
</Update>

<Update label="June 23, 2025" rss={{ title: "Markdown Contents as Default" }}>
  ## 기본값이 된 마크다운 contents {#markdown-contents-as-default}

  이제 모든 엔드포인트가 기본적으로 깔끔한 마크다운을 반환합니다. LLM, RAG, 일반 텍스트 처리에 더 적합합니다. 별도의 조치는 필요하지 않습니다.

  * **`includeHtmlTags=false`(기본값)**: 콘텐츠가 깔끔한 마크다운으로 처리됩니다.
  * **`includeHtmlTags=true`**: 마크다운 처리 없이 원본 HTML을 반환합니다.

  어느 경우든 광고나 내비게이션 같은 불필요한 요소는 제거됩니다.

  [Contents 문서 보기 →](/ko/docs/contents/quickstart)
</Update>

<Update label="June 7, 2025" rss={{ title: "New Livecrawl Option: Preferred" }}>
  ## 새로운 Livecrawl 옵션: Preferred {#new-livecrawl-option-preferred}

  <Warning>
    과거 항목입니다. `livecrawl` 문자열 매개변수는 현재 지원 중단되었습니다. 새로 연동하는 경우 `maxAgeHours`와 `livecrawlTimeout`을 사용하세요. [Content Freshness](/ko/docs/contents/quickstart#content-freshness)를 참고하세요.
  </Warning>

  지원 중단된 `livecrawl: "preferred"` 옵션은 새로 크롤링을 시도하되, 크롤링에 실패하면 캐시된 콘텐츠로 대체합니다(오류를 발생시키는 `"always"`와 다릅니다). 일시적으로 접근할 수 없는 사이트 때문에 실패하지 않으면서 최신 콘텐츠를 얻으려는 프로덕션 앱에 적합합니다.

  [Content Freshness 문서 보기 →](/ko/docs/contents/quickstart#content-freshness)
</Update>

<Update label="May 22, 2025" rss={{ title: "Contents Endpoint Status Changes" }}>
  ## Contents 엔드포인트 상태 변경 {#contents-endpoint-status-changes}

  이제 `/contents`는 단일 HTTP 오류 대신 URL별 `statuses` field를 반환하므로, 각 URL의 결과를 개별적으로 처리할 수 있습니다. 이 엔드포인트는 내부 문제가 발생한 경우에만 오류를 반환합니다.

  * **`status`**: URL별로 `"success"` 또는 `"error"`.
  * **`error.tag`**: 예를 들어 `CRAWL_NOT_FOUND`, `CRAWL_TIMEOUT`, `SOURCE_NOT_AVAILABLE` 등이며, `httpStatusCode`가 함께 제공됩니다.

  [오류 코드 reference 보기 →](/ko/docs/admin/error-codes)
</Update>

<Update label="December 11, 2024" rss={{ title: "Auto search as Default" }}>
  ## 기본값이 된 Auto search {#auto-search-as-default}

  이제 Auto search가 기본값이며, 각 질의를 가장 적합한 검색 방식으로 자동 라우팅합니다. 별도의 조치는 필요하지 않으며, 이전 동작을 유지하려면 `type="neural"`로 설정하세요.

  [Exa의 search type 알아보기 →](/ko/docs/search/quickstart)
</Update>