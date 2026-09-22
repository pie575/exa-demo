> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 확인하세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 파악하세요.

# 기업 및 인물 {#companies-people}

> Exa Search로 기업과 professional profiles, 그리고 이들 간의 관계를 찾아보세요.

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

Exa Search로 조직과 그 조직에 속한 사람들을 찾아보세요. 이 두 search는 함께 사용할 때 가장 효과적입니다. 어떤 사람이 조건에 맞는지 가려내는 기업 특성을 설명하거나, 기업의 운영 방식을 보여주는 인물과 직무를 설명해 보세요.

<Columns cols={2}>
  <Card title="기업 검색 벤치마크" icon="building" href="https://exa.ai/blog/company-search-benchmarks">
    Exa가 기업 검색과 사실 extraction을 어떻게 평가하는지 확인해 보세요.
  </Card>

  <Card title="인물 검색 벤치마크" icon="users" href="https://exa.ai/blog/people-search-benchmark">
    Exa가 타겟 조회와 프로필 발굴을 어떻게 평가하는지 확인해 보세요.
  </Card>
</Columns>

## 활용 사례 {#use-it-for}

* 기업, 후보자, 전문가 발굴
* 고객사 리서치 및 이해관계자 매핑
* 마켓맵, 투자 리서치, 딜 소싱
* 경영진, 채용, 조직 리서치

## 더 나은 질의 작성하기 {#write-better-queries}

원하는 엔티티부터 시작한 다음, 이를 한정하는 특성과 관계를 추가하세요. 회사 홈페이지, professional profiles, 채용 공고, 개인 웹사이트처럼 출처 유형이 중요할 때는 이를 명시해서 요청하세요.

<Tabs>
  <Tab title="회사" icon="building">
### 하는 일로 회사 찾기 {#discover-companies-by-what-they-do}

    시장을 정의하는 고객, 제품, capability, 단계, 지역을 설명하세요. 미리 정해둔 회사 목록에 의존하는 대신, 실제로 무엇을 하는지를 기준으로 후보를 찾아냅니다.

    <PlaygroundQuery query="companies selling AI voice agents to dental practices" category="company" />

### 운영 신호 찾기 {#find-operating-signals}

    중요한 신호와 company traits를 명시하세요. search는 회사 페이지뿐 아니라 채용 공고, 가격 페이지, 제품 문서, 보도 자료까지 가져올 수 있습니다.

    <PlaygroundQuery query="remote staff engineer roles at Series B fintech companies" />

### 투자 활동 리서치 {#research-funding-activity}

    라운드, 산업, 참여자, 기간을 지정하세요.

    <PlaygroundQuery query="investors who led seed rounds in robotics in the last year" />
  </Tab>

  <Tab title="사람" icon="users">
### 역할과 역량으로 사람 찾기 {#discover-people-by-role-and-skills}

    원하는 역할, 직급, 지역, 관련 역량, 출처 유형을 조합하세요.

    <PlaygroundQuery query="professional profiles of senior ML engineers in Seattle with PyTorch experience" />

### company traits로 사람 한정하기 {#qualify-people-by-company-traits}

    해당 인물과 회사의 관계, 그리고 그 회사를 한정하는 특성을 설명하세요. 회사 목록을 먼저 만드는 방식보다 더 효과적입니다.

    <PlaygroundQuery query="professional profiles of founders of YC-backed developer tools companies" />

### 개인 웹사이트와 공개 활동 찾기 {#find-personal-websites-and-public-work}

    직업이나 리서치 분야를 명시하고, 개인 웹사이트, 강연, 인터뷰, 기고문을 명확하게 요청하세요.

    <PlaygroundQuery query="personal blogs of distributed systems researchers" />
  </Tab>
</Tabs>

## 둘을 함께 검색하기 {#search-both-together}

원하는 관계를 그대로 표현한 질의 하나를 작성하세요. Exa는 회사 페이지, professional profiles, 채용 페이지, 공개 reference를 하나의 결과 집합으로 반환할 수 있습니다.

<PlaygroundQuery query="heads of security at Series B healthcare software companies that sell to hospitals" />

## 요청 보내기 {#make-a-request}

<CodeGroup>
  ```python Python theme={null}
  from exa_py import Exa

  exa = Exa()

  results = exa.search(
      "heads of security at Series B healthcare software companies that sell to hospitals",
      type="auto",
      num_results=10,
  )
  ```

  ```javascript JavaScript theme={null}
  import Exa from "exa-js";

  const exa = new Exa();

  const results = await exa.search(
    "heads of security at Series B healthcare software companies that sell to hospitals",
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
      "query": "heads of security at Series B healthcare software companies that sell to hospitals",
      "type": "auto",
      "numResults": 10
    }'
  ```
</CodeGroup>

## Exa Agent으로 구조화된 데이터 가져오기 {#get-structured-data-with-exa-agent}

여러 소스에 걸친 리서치가 필요한 구조화된 데이터라면 [Exa Agent task run](/ko/docs/agent/quickstart)을 사용하세요. 필요한 기업, 인물, 자격 criteria, output field를 설명하면 Agent가 schema 검증을 거친 결과를 citations와 함께 반환합니다.

<Card title="Agent task 시작하기" icon="bot" href="/ko/docs/agent/quickstart" cta="Agent 가이드 열기" arrow="true">
  기업 또는 인물 목록을 구성하고 자격을 평가한 뒤, 여러 소스에서 수집한 field로 각 레코드를 enrich하세요.
</Card>