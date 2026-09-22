> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 사이버 보안 {#cybersecurity}

> Exa Search로 취약점, 보안 권고문, 위협 보고서, 신뢰 문서를 찾아보세요.

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

보안 팀이 이미 활용하고 있는 소스에서 취약점 레코드, 벤더 보안 권고문, 위협 리서치 자료를 찾으려면 Exa Search를 사용하세요.

## 포함 항목 {#included}

* CVE 및 GHSA 취약점 레코드
* 벤더 보안 권고문 및 패치 노트
* 위협 인텔리전스 보고서 및 incident 분석 기록
* 트러스트 페이지, 하위 처리자 목록, 컴플라이언스 문서
* 보안 블로그, 콘퍼런스 발표, 리서치 자료

## 활용 사례 {#use-it-for}

* 취약점 트리아지 및 노출 평가
* 위협 인텔리전스 및 공격자 추적
* 벤더 리스크 및 서드파티 보안 검토
* 보안 모니터링 및 알림

## 예시 쿼리 {#example-queries}

### 취약점 유형 분류하기 {#triage-a-vulnerability-class}

제품, 버전 범위, 심각도를 명시하세요.

<PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

### 벤더 보안 권고문 찾기 {#find-vendor-advisories}

특정 CVE ID 하나를 지정하기보다 악용 상태와 제품 유형을 설명하세요.

<PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

### 벤더의 보안 태세 검토 {#review-a-vendors-security-posture}

문서 유형과 벤더 유형을 명시하세요.

<PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />

### 공격자 리서치하기 {#research-an-adversary}

관심 있는 그룹이나 캠페인, 그리고 기법이나 산업 분야를 지정하세요.

<PlaygroundQuery query="reports on ransomware groups targeting healthcare providers this year" />

## 요청 보내기 {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "critical CVEs affecting Apache Struts 6.x",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "critical CVEs affecting Apache Struts 6.x",
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
      "query": "critical CVEs affecting Apache Struts 6.x",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Exa Agent로 구조화된 데이터 얻기 {#get-structured-data-with-exa-agent}

여러 소스에 걸친 리서치가 필요한 구조화된 데이터라면 [Exa Agent 태스크 실행](/ko/docs/agent/quickstart)을 사용하세요. 필요한 제품, 위협 criteria, output fields를 설명하면 Agent가 schema 검증을 거친 결과를 citations와 함께 반환합니다.

<Card title="Agent 태스크 시작하기" icon="bot" href="/ko/docs/agent/quickstart" cta="Agent 가이드 열기" arrow="true">
  보안 권고문, 침해 사고 보고, 트러스트 페이지 전반에서 벤더를 심사하거나, 정규화된 취약점 데이터를 구축해 보세요.
</Card>