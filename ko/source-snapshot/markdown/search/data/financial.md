> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="financial-markets">
  # 금융 시장
</div>

> Exa Search로 시장 데이터, 공시 자료, earnings call, 경제 지표 발표 자료를 찾아보세요.

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

Exa Search를 사용하면 가격, filings, transcript, 그리고 이와 관련된 보도까지 단 한 번의 질의로 확인할 수 있습니다. ticker에 대한 질문 하나만으로 quote, 최신 earnings call, 애널리스트 커버리지를 한 번에 받아볼 수 있습니다.

<div id="included">
  ## 포함 항목
</div>

* 주식, 암호화폐, 외환, 지수, 선물, 옵션, 원자재의 quote 및 최근 가격 추이
* 주요 통계와 일별 OHLCV 이력을 제공하는 종목 프로필
* 발언자별로 구분된 준비 발언과 Q&amp;A가 담긴 earnings call transcript
* SEC filings, 공시 재무 데이터, 해외 filings
* 애널리스트 추정치, 투자 유치 발표, 경제 지표 발표 자료

<div id="use-it-for">
  ## 활용 분야
</div>

* 주식 및 크레딧 리서치
* KYC, KYB, 부정적 언론 보도(adverse media) 스크리닝
* 포트폴리오 및 정책 모니터링
* 딜 소싱 및 비상장 시장 리서치

<div id="example-queries">
  ## 예시 질의
</div>

<div id="look-up-a-quote">
  ### 시세 조회하기
</div>

티커 또는 회사명과 원하는 수치를 함께 입력하세요. `$NVDA`와 같은 캐시태그도 사용할 수 있습니다.

<PlaygroundQuery query="NVIDIA stock price and change today" />

<div id="read-an-earnings-call">
  ### earnings call 읽기
</div>

관련 보도가 아닌 transcript를 가져오려면 회사명과 분기를 지정하세요.

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

<div id="search-filings">
  ### filings 검색
</div>

서식 유형만 적지 말고, 찾으려는 공시 내용을 구체적으로 설명하세요. `financial report` 카테고리를 쓰면 결과가 filings와 보고서로 한정됩니다.

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

<div id="track-private-market-activity">
  ### 비상장 시장 동향 추적
</div>

투자 라운드, 섹터, 기간을 지정하세요.

<PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

<div id="follow-economic-data">
  ### 경제 지표 추적하기
</div>

원하는 발표 자료와 그 안에서 확인하려는 수치를 지정하세요.

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

<div id="make-a-request">
  ## 요청 보내기
</div>

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "10-K risk factors that mention dependency on third-party AI models",
      type="auto",
      category="financial report",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "10-K risk factors that mention dependency on third-party AI models",
    {
      type: "auto",
      category: "financial report",
      numResults: 10,
    }
  );
  ```

  ```bash cURL theme={null}
  curl -s -X POST https://api.exa.ai/search \
    -H "Authorization: Bearer $EXA_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "query": "10-K risk factors that mention dependency on third-party AI models",
      "type": "auto",
      "category": "financial report",
      "numResults": 10
    }'
  ```
</CodeGroup>

<div id="get-structured-data-with-exa-agent">
  ## Exa Agent로 구조화된 데이터 가져오기
</div>

여러 출처에 걸친 리서치가 필요한 구조화된 데이터라면 [Exa Agent 작업 실행](/ko/docs/agent/quickstart)을 사용하세요. 필요한 증권, 기간, criteria, 출력 필드를 설명하면 Agent가 citations와 함께 schema 검증을 거친 결과를 반환합니다.

<Card title="Agent 작업 시작하기" icon="bot" href="/ko/docs/agent/quickstart" cta="Agent 가이드 열기" arrow="true">
  기업을 선별하거나, filings를 비교하거나, 포트폴리오 전반의 구조화된 브리프를 구성해 보세요.
</Card>