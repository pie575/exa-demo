> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 깊이 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="legal-public-records">
  # 법률 및 공공 기록
</div>

> Exa Search로 법원 판결문, 특허, 제재 목록, 정부 계약 등 각종 공공 기록을 찾아보세요.

export const PlaygroundQuery = ({query, category, filters}) => {
  const PLAYGROUND = "https://dashboard.exa.ai/playground/search";
  const DEFAULT_FILTERS = {
    type: "auto",
    highlights: true
  };
  const params = [`q=${encodeURIComponent(query)}`];
  if (category) params.push(`c=${encodeURIComponent(category)}`);
  params.push(`filters=${encodeURIComponent(JSON.stringify({
    ...DEFAULT_FILTERS,
    ...filters
  }))}`);
  const href = `${PLAYGROUND}?${params.join("&")}`;
  return <div className="playground-query not-prose">
      <code className="playground-query-text">{query}</code>
      <a className="playground-query-run" href={href} target="_blank" rel="noreferrer" title="API 플레이그라운드에서 열기" aria-label={`API 플레이그라운드에서 "${query}" 열기`}>
        {}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
          <path d="m21 3-9 9" />
          <path d="M15 3h6v6" />
        </svg>
      </a>
    </div>;
};

Exa Search로 1차 법률 자료와 정부 기록은 물론, 이에 대해 작성된 해설까지 함께 찾아보세요.

<div id="included">
  ## 포함 항목
</div>

* 미국 법원 판결문(전문, 법원, 사건번호, 인용 메타데이터 포함)
* 등록된 미국 특허(초록, 청구항, 상세 설명, 발명자, 양수인 포함)
* 법률, 규정 및 정부 기관 지침
* 제재 목록 및 watchlist
* 정부 계약 및 조달 기록
* 인구조사 데이터 및 기타 공공 통계 자료

<div id="use-it-for">
  ## 활용 사례
</div>

* 판례 조사 및 법률 RAG
* 규제 및 정책 모니터링
* 선행기술 조사 및 자유실시(FTO) 검토
* 컴플라이언스 스크리닝 및 실사
* 공공 부문 시장 조사

<div id="example-queries">
  ## 예시 쿼리
</div>

<div id="find-case-law">
  ### 판례 찾기
</div>

인용 형식 대신 평이한 표현으로 법적 쟁점과 관할권을 설명하세요.

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

<div id="search-patents">
  ### 특허 검색
</div>

청구항을 쓰듯이, 그 발명이 어떤 기능을 하는지 서술하세요.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

<div id="screen-against-sanctions">
  ### 제재 목록 대조 심사
</div>

조회할 목록과 대상 기관 유형을 명시하세요.

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

<div id="research-government-spending">
  ### 정부 지출 조사
</div>

구매 기관 또는 서비스 카테고리와 기간을 명시하세요.

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

<div id="pull-public-statistics">
  ### 공공 통계 가져오기
</div>

데이터셋과 지역을 지정하세요.

<PlaygroundQuery query="census tract population change in the Austin metro area" />

<div id="make-a-request">
  ## 요청 보내기
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "California appellate decisions on non-compete enforceability",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "California appellate decisions on non-compete enforceability",
    {
      type: "auto",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "California appellate decisions on non-compete enforceability",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Exa Agent으로 구조화된 데이터 가져오기
</div>

여러 출처에 걸친 리서치가 필요한 구조화된 데이터라면 [Exa Agent 작업 실행](/ko/docs/agent/quickstart)을 사용하세요. 필요한 관할 구역, 기록 유형, criteria, 출력 필드를 설명하면 Agent가 schema로 검증된 결과와 인용을 반환합니다.

<Card title="Agent 작업 시작하기" icon="bot" href="/ko/docs/agent/quickstart" cta="Agent 가이드 열기" arrow="true">
  여러 기록 유형에 걸쳐 특정 주체를 검증하거나, 1차 자료와 보도 내용을 통해 규제 변화를 추적하세요.
</Card>