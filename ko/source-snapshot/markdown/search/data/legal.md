> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 법률 및 공공 records {#legal-public-records}

> Exa Search로 판례, 특허, 제재 목록, 정부 계약을 비롯한 각종 공공 records를 찾아보세요.

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

Exa Search를 활용해 1차 법률 소스와 정부 records는 물론, 그에 대해 작성된 해설까지 함께 찾아보세요.

## 포함 항목 {#included}

* 미국 판례(전체 텍스트, 법원, 사건번호, 인용 metadata 포함)
* 등록된 미국 특허(초록, 청구항, 상세 설명, 발명자, 양수인 포함)
* 법률, 규정, 정부기관 가이던스
* 제재 목록 및 워치리스트
* 정부 계약 및 조달 records
* 인구조사 데이터 및 기타 공공 통계 records

## 활용 사례 {#use-it-for}

* 판례 리서치 및 법률 RAG
* 규제 및 정책 모니터링
* 선행 기술 조사 및 실시 자유(FTO) 검토
* 컴플라이언스 스크리닝 및 실사
* 공공 부문 시장 조사

## 예시 쿼리 {#example-queries}

### 판례 찾기 {#find-case-law}

인용 형식으로 적기보다는, 법적 쟁점과 관할권을 일상적인 표현으로 설명하세요.

<PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

### 특허 검색 {#search-patents}

청구항을 쓰듯이 해당 발명이 어떤 기능을 하는지 설명하세요.

<PlaygroundQuery query="patents on cooling battery packs with immersion dielectric fluid" />

### 제재 목록 대조 심사 {#screen-against-sanctions}

대조할 목록과 심사 대상 엔터티 유형을 명시하세요.

<PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

### 정부 지출 리서치 {#research-government-spending}

구매 기관이나 서비스 범주, 그리고 조회 기간을 명시하세요.

<PlaygroundQuery query="federal contracts awarded for cloud migration services" />

### 공공 통계 가져오기 {#pull-public-statistics}

데이터셋과 지역을 명시하세요.

<PlaygroundQuery query="census tract population change in the Austin metro area" />

## 요청 보내기 {#make-a-request}

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

## Exa Agent으로 구조화된 데이터 가져오기 {#get-structured-data-with-exa-agent}

여러 소스에 걸친 리서치가 필요한 구조화된 데이터라면 [Exa Agent task run](/ko/docs/agent/quickstart)을 사용하세요. 필요한 관할 구역, 레코드 유형, criteria, output field를 설명하면 Agent가 schema 검증을 거친 결과를 citations와 함께 반환합니다.

<Card title="Agent task 시작하기" icon="bot" href="/ko/docs/agent/quickstart" cta="Agent 가이드 열기" arrow="true">
  여러 레코드 유형에 걸쳐 특정 대상을 검토하거나, 1차 자료와 관련 보도를 통해 규제 변화를 추적해 보세요.
</Card>