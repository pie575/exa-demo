> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# 데이터 인덱스 {#data-index}

> Exa가 공개 웹과 비공개 데이터 소스 전반에서 인덱싱하는 대상입니다.

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

Exa는 공개 웹과 선별된 비공개 데이터 소스를 검색하며, 커버리지는 지속적으로 갱신됩니다. 포함 범위는 다음과 같습니다:

<AccordionGroup>
  <Accordion title="뉴스" icon="newspaper">
    <Card title="뉴스 가이드" icon="newspaper" href="/ko/docs/search/data/news" cta="가이드 읽기" arrow="true">
      뉴스 search의 활용 사례와 예시, 모범 사례를 살펴보세요.
    </Card>

    뉴스 및 기사:

    <PlaygroundQuery query="coverage of the EU AI Act enforcement timeline published this month" />

    블로그 게시물 및 리스티클:

    <PlaygroundQuery query="engineering blog posts about migrating from Postgres to ClickHouse" />

    팟캐스트 및 동영상 전문:

    <PlaygroundQuery query="podcast episodes where founders discuss pricing strategy mistakes" />

    부정적 보도:

    <PlaygroundQuery query="negative press and regulatory complaints about payday lending companies" />
  </Accordion>

  <Accordion title="코드 및 문서" icon="code">
    <Card title="코드 & 문서 가이드" icon="code" href="/ko/docs/search/data/code" cta="가이드 읽기" arrow="true">
      코드 검색 활용 사례와 예제, 모범 사례를 살펴보세요.
    </Card>

    GitHub 저장소:

    <PlaygroundQuery query="open source Rust libraries for vector similarity search" />

    API 및 개발자 문서:

    <PlaygroundQuery query="Stripe webhook signature verification documentation" />

    정확한 버전 및 릴리스 정보를 담은 패키지 레지스트리:

    <PlaygroundQuery query="breaking changes in the latest stable release of Pydantic v2" />

    Agent skill 디렉터리:

    <PlaygroundQuery query="agent skills for extracting tables from PDFs" />
  </Accordion>

  <Accordion title="회사 및 인물" icon="users">
    <Card title="기업 및 인물 가이드" icon="users" href="/ko/docs/search/data/companies-people" cta="가이드 읽기" arrow="true">
      기업과 인물, 그리고 이들 사이의 관계를 찾는 방법을 알아보세요.
    </Card>

    기업 발굴 및 운영 신호:

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

    직무, skill, 지역별 professional profiles:

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

    소속 기업 기준으로 선별한 인물:

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

    기업과 이해관계자를 하나의 질의로 리서치:

    <PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />
  </Accordion>

  <Accordion title="금융 시장" icon="chart-line">
    <Card title="금융 시장 가이드" icon="chart-line" href="/ko/docs/search/data/financial" cta="가이드 읽기" arrow="true">
      quote, 공시 자료, 실적 발표 콜, 시장 리서치 활용 사례를 살펴보세요.
    </Card>

    시세, 애널리스트 추정치, 재무 보고서:

    <PlaygroundQuery query="analyst price targets for NVIDIA after its most recent earnings" />

    SEC 공시 자료, 실적 발표 콜, 해외 공시 자료:

    <PlaygroundQuery query="10-K risk factors that mention dependency on third-party AI models" />

    공표된 투자 유치 정보 및 기타 공개 보도 데이터:

    <PlaygroundQuery query="Series B rounds in climate tech announced this quarter" />

    공개된 경제 데이터 및 정부 통계:

    <PlaygroundQuery query="most recent US CPI release and month-over-month change" />
  </Accordion>

  <Accordion title="연구 출판물" icon="book-open">
    <Card title="리서치 출판물 가이드" icon="book-open" href="/ko/docs/search/data/research" cta="가이드 읽기" arrow="true">
      논문, 특허, 임상, 규제 분야의 리서치 활용 사례를 살펴보세요.
    </Card>

    연구 논문, 특허, 연구비:

    <PlaygroundQuery query="papers on evaluation benchmarks for retrieval-augmented generation" />

    임상시험 및 약물 상호작용:

    <PlaygroundQuery query="phase 3 trials of GLP-1 agonists in adolescent patients" />

    규제 및 보건 당국 승인:

    <PlaygroundQuery query="FDA approvals for AI-based diagnostic devices" />
  </Accordion>

  <Accordion title="법률 및 공공 records" icon="scale">
    <Card title="법률 및 공공 records 가이드" icon="scale" href="/ko/docs/search/data/legal" cta="가이드 읽기" arrow="true">
      판례, 특허, 제재 목록, 공공 records 활용 사례를 살펴보세요.
    </Card>

    법률 및 법원 records:

    <PlaygroundQuery query="California appellate decisions on non-compete enforceability" />

    제재 목록 및 워치리스트:

    <PlaygroundQuery query="OFAC sanctions listings added for shipping companies" />

    정부 공공 계약:

    <PlaygroundQuery query="federal contracts awarded for cloud migration services" />

    인구 조사 및 기타 공공 records:

    <PlaygroundQuery query="census tract population change in the Austin metro area" />
  </Accordion>

  <Accordion title="스포츠, 날씨 및 장소" icon="map-pin">
    <Card title="스포츠, 날씨 및 장소 가이드" icon="map-pin" href="/ko/docs/search/data/sports-weather-places" cta="가이드 읽기" arrow="true">
      실시간 스포츠 데이터, 일기 예보, 지역 정보를 질의하는 방법을 알아보세요.
    </Card>

    실시간 경기 점수, 순위, 일정:

    <PlaygroundQuery query="NBA scores last night" />

    모든 장소와 날짜의 일기 예보:

    <PlaygroundQuery query="weather in San Francisco tomorrow" />

    지역 업체, 시설, 부동산:

    <PlaygroundQuery query="late-night ramen in the Sunset District with outdoor seating" />
  </Accordion>

  <Accordion title="사이버 보안" icon="shield">
    <Card title="사이버보안 가이드" icon="shield" href="/ko/docs/search/data/security" cta="가이드 읽기" arrow="true">
      취약점, 보안 권고문, 벤더 리스크 관련 활용 사례를 살펴보세요.
    </Card>

    보안 권고문:

    <PlaygroundQuery query="vendor advisories for actively exploited VPN vulnerabilities" />

    CVE 및 GHSA 취약점 데이터베이스:

    <PlaygroundQuery query="critical CVEs affecting Apache Struts 6.x" />

    데이터 하위 처리자 목록 및 트러스트 페이지:

    <PlaygroundQuery query="subprocessor lists for SOC 2 compliant CRM vendors" />
  </Accordion>
</AccordionGroup>

이 가이드에서는 일반적인 데이터 패턴을 다루지만, Exa는 다양한 사이트와 형식, 언어를 아우르는 더 넓은 공개 웹도 검색합니다.