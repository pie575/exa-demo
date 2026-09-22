> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 금융 시장 {#financial-markets}

> Exa Search로 시장 데이터, 공시 자료, 실적 발표 콜, 경제 지표 발표 자료를 찾아보세요.

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

Exa Search를 사용하면 가격, 공시 자료, 전문, 그리고 이를 다룬 보도까지 하나의 질의로 찾을 수 있습니다. ticker에 대한 질문 하나로 quote, 최신 실적 발표 콜, 애널리스트 커버리지를 함께 받아볼 수 있습니다.

## 포함 내용 {#included}

* 주식, 암호화폐, 외환, 지수, 선물, 옵션, 원자재의 quote 및 최근 가격 이력
* 주요 통계와 일별 OHLCV 이력이 포함된 종목 프로필
* 발언자별로 구분된 사전 발언과 Q&amp;A를 포함한 실적 발표 콜 전문
* SEC 공시 자료, 보고된 재무 실적, 해외 공시 자료
* 애널리스트 추정치, 투자 유치 발표, 경제 지표 발표 자료

## 활용 사례 {#use-it-for}

* 주식 및 신용 리서치
* KYC, KYB, 부정적 언론 보도 스크리닝
* 포트폴리오 및 정책 모니터링
* 딜 소싱 및 비상장 시장 리서치

## 예시 쿼리 {#example-queries}

### quote 조회하기 {#look-up-a-quote}

ticker 또는 회사명과 원하는 수치를 함께 입력하세요. `$NVDA`와 같은 캐시태그도 사용할 수 있습니다.

<PlaygroundQuery query="NVIDIA stock price and change today" />

### 실적 발표 콜 읽기 {#read-an-earnings-call}

관련 보도가 아닌 전문을 가져오려면 회사명과 분기를 지정하세요.

<PlaygroundQuery query="Tyson Foods Q4 FY2025 earnings call transcript" />

### 공시 자료 검색 {#search-filings}

서식 종류만 적지 말고, 찾고자 하는 공시 내용을 설명하세요. `financial report` 카테고리를 사용하면 결과가 공시 자료와 보고서로 한정됩니다.

<PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" category="financial report" />

### 비상장 시장 동향 추적 {#track-private-market-activity}

투자 라운드, 섹터, 기간을 지정하세요.

<PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

### 경제 지표 추적하기 {#follow-economic-data}

원하는 발표 자료의 이름과 그 안에서 확인하고 싶은 수치를 지정하세요.

<PlaygroundQuery query="most recent US CPI release and month-over-month change" />

## 요청 보내기 {#make-a-request}

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

## Exa Agent로 구조화된 데이터 가져오기 {#get-structured-data-with-exa-agent}

여러 소스를 아우르는 리서치가 필요한 구조화된 데이터라면 [Exa Agent task run](/ko/docs/agent/quickstart)을 사용하세요. 필요한 증권, period, criteria, output field를 설명하면 Agent가 citations와 함께 schema로 검증된 결과를 반환합니다.

<Card title="Agent task 시작하기" icon="bot" href="/ko/docs/agent/quickstart" cta="Agent 가이드 열기" arrow="true">
  기업을 선별하고, 공시 자료를 비교하고, 포트폴리오 전반의 구조화된 브리프를 작성해 보세요.
</Card>