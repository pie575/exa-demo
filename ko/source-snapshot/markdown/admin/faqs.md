> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="faqs">
  # 자주 묻는 질문
</div>

> Exa 제품, 검색 인덱스, freshness, grounding, 보안, 가격에 대해 자주 묻는 질문과 답변입니다.

<AccordionGroup>
  <Accordion title="Exa란 무엇인가요?">
    Exa는 AI 애플리케이션을 위한 web search 및 리서치 인프라를 제공합니다. 독자적인 검색 인덱스에 콘텐츠 extraction과 agentic research API를 결합하여, 애플리케이션이 출처를 찾고 그 contents를 가져와 grounded 결과를 생성할 수 있도록 합니다.
  </Accordion>

  <Accordion title="어떤 Exa 제품을 사용해야 하나요?">
    * 순위가 매겨진 웹 결과를 찾고 필요에 따라 highlights, 전체 텍스트 또는 summaries를 받으려면 [Search API](/ko/docs/search/quickstart)를 사용하세요.
    * 이미 URL을 보유하고 있고 추출된 contents가 필요하다면 [Contents API](/ko/docs/contents/quickstart)를 사용하세요.
    * 비동기 다단계 리서치, list building, 구조화된 enrichment에는 [Agent API](/ko/docs/agent/quickstart)를 사용하세요.
    * 반복 search를 실행하고 새로 발견된 결과를 받으려면 [Monitors](/ko/docs/monitors/quickstart)를 사용하세요.
  </Accordion>

  <Accordion title="Exa Connect란 무엇인가요?">
    [Exa Connect](/ko/docs/agent/connect/overview)는 동일한 run 안에서 Exa Agent가 web search와 함께 프리미엄 data provider에 접근할 수 있게 해줍니다. `dataSources`를 통해 provider를 추가하면, Exa Agent가 각 소스를 언제 query할지 스스로 판단한 뒤 partner 데이터와 웹 리서치를 하나의 grounded 구조화된 출력으로 결합합니다.

    셀프서비스 provider의 경우 Exa가 provider 인증과 usage billing을 처리하므로, 별도의 통합을 구축하거나 별도의 provider 계정을 만들 필요가 없습니다.
  </Accordion>

  <Accordion title="Exa Search는 무엇이 다른가요?">
    Exa Search는 광고 기반 브라우징이 아니라 프로그래밍 방식의 retrieval을 위해 설계되었습니다. 의미 기반으로 검색하고, 자연어 query를 받아들이며, 동일한 요청에서 page contents까지 반환할 수 있습니다. search mode는 저지연 retrieval부터 structured output을 제공하는 다단계 리서치까지 다양합니다.

    사용 가능한 search type과 응답 형식은 [Search 퀵스타트](/ko/docs/search/quickstart)를 참고하세요.
  </Accordion>

  <Accordion title="Exa의 인덱스 규모는 어느 정도인가요?">
    2026년 8월 기준으로 Exa의 인덱스는 1.4조 개의 URL을 추적하며 공개 웹 전반에서 1,000억 개의 페이지를 제공합니다. 인덱스는 페이지가 발견되거나 갱신되거나 제거됨에 따라 지속적으로 변화합니다.
  </Accordion>

  <Accordion title="Exa의 결과는 얼마나 최신인가요?">
    Exa는 페이지를 지속적으로 발견하고 갱신하며, 그 주기는 소스와 페이지 변경 빈도에 따라 달라집니다. 인덱싱된 사본보다 더 최신인 콘텐츠가 필요할 때는 Contents API의 [`maxAgeHours`](/ko/docs/contents/quickstart#content-freshness) 옵션으로 캐시 수명과 실시간 retrieval을 제어하세요.
  </Accordion>

  <Accordion title="Exa는 크롤러를 운영하나요?">
    네. Exa는 search 및 retrieval을 위해 공개 웹의 페이지를 발견하고 갱신하는 `ExaSearchBot`을 운영합니다. 이 봇은 로봇 배제 표준을 준수하고, 사이트별 request rate를 제한하며, 로그인·페이월·CAPTCHA를 우회하려 시도하지 않습니다.

    크롤링은 `robots.txt`로 제어합니다. 이미 인덱싱된 페이지를 제거하려면 `noindex` 로봇 메타 태그 또는 `X-Robots-Tag: noindex` 응답 header를 사용하세요. Exa는 다음 재수집 이후 해당 페이지를 제거합니다. 사용자 에이전트, 암호학적 verification 방법, 크롤러 제어 옵션은 [Exa Search Crawler](https://crawler.exa.ai/)를 참고하세요.
  </Accordion>

  <Accordion title="Exa는 LLM 응답의 grounding에 어떻게 도움이 되나요?">
    Exa는 source URL과 retrieval에 사용된 웹 콘텐츠를 반환하므로, 애플리케이션이 citations와 함께 답변을 생성하고 뒷받침하는 evidence를 확인할 수 있습니다. 검색 품질과 소스 grounding은 근거 없는 주장을 줄이는 데 도움이 되지만, 검색된 정보를 어떻게 해석하고 제시할지는 여전히 애플리케이션과 해당 언어 모델의 책임입니다.
  </Accordion>

  <Accordion title="Exa가 검색하는 소스를 제한할 수 있나요?">
    네. `includeDomains`로 Search 대상을 선택한 도메인으로 제한하거나, `excludeDomains`로 원치 않는 소스를 제외할 수 있습니다. Exa는 기업, 인물, 뉴스, 코드 등 소스별 retrieval을 위한 데이터 카테고리도 제공합니다. [Search 모범 사례](/ko/docs/search/best-practices)와 [Data](/ko/docs/search/data/overview)를 참고하세요.
  </Accordion>

  <Accordion title="어떤 보안 및 데이터 보존 옵션이 제공되나요?">
    Exa는 프로덕션 및 엔터프라이즈 사용 사례를 위한 보안·컴플라이언스 제어 기능을 제공하며, 여기에는 자격을 갖춘 Enterprise 고객을 위한 [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)과 [HIPAA 준수](/ko/docs/admin/security/hipaa)가 포함됩니다. 자세한 내용은 [보안 및 컴플라이언스](/ko/docs/admin/security/overview)를 참고하세요.
  </Accordion>

  <Accordion title="Exa 가격 정책은 어떻게 되나요?">
    API usage는 사용한 endpoint와 옵션에 따라 계정 credits에서 청구됩니다. 신규 계정에는 무료 credits이 제공되며, 조직에 엔터프라이즈 계약이 없는 한 유료 usage는 사용한 만큼 지불하는 방식입니다. [Pricing](/ko/docs/admin/pricing)과 [Billing](/ko/docs/admin/billing)을 참고하세요.
  </Accordion>
</AccordionGroup>