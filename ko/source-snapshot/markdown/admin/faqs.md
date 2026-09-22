> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="faqs">
  # FAQ
</div>

> Exa 제품, 검색 인덱스, freshness, grounding, 보안, 가격에 대해 자주 묻는 질문과 답변입니다.

<AccordionGroup>
  <Accordion title="Exa란 무엇인가요?">
    Exa는 AI 애플리케이션을 위한 web search 및 리서치 인프라를 제공합니다. 독자적인 검색 인덱스에 content extraction과 agentic research API를 결합하여, 애플리케이션이 소스를 찾고 그 contents를 가져와 근거 기반 output을 생성할 수 있도록 합니다.
  </Accordion>

  <Accordion title="어떤 Exa 제품을 사용해야 하나요?">
    * 순위가 매겨진 웹 결과를 찾고 필요에 따라 highlights, 전체 텍스트, summary를 함께 받으려면 [Search API](/ko/docs/search/quickstart)를 사용하세요.
    * 이미 URL을 확보한 상태에서 추출된 contents가 필요하다면 [Contents API](/ko/docs/contents/quickstart)를 사용하세요.
    * 비동기 다단계 리서치, 리스트 구축, structured enrichment에는 [Agent API](/ko/docs/agent/quickstart)를 사용하세요.
    * 주기적으로 searches를 실행하고 새로 발견된 결과를 받아보려면 [Monitors](/ko/docs/monitors/quickstart)를 사용하세요.
  </Accordion>

  <Accordion title="Exa Connect란 무엇인가요?">
    [Exa Connect](/ko/docs/agent/connect/overview)는 하나의 실행 안에서 Exa Agent가 web search와 함께 프리미엄 데이터 제공업체에 접근할 수 있게 해줍니다. `dataSources`로 providers를 추가하면 Exa Agent가 각 소스를 언제 질의할지 스스로 판단한 뒤, 파트너 데이터와 웹 리서치를 하나의 근거 기반 structured output으로 통합합니다.

    셀프서브 providers의 경우 Exa가 provider authentication과 사용량 billing을 처리하므로, 별도의 연동을 구축하거나 provider 계정을 따로 만들 필요가 없습니다.
  </Accordion>

  <Accordion title="Exa Search는 무엇이 다른가요?">
    Exa Search는 광고 중심의 브라우징이 아니라 프로그래밍 방식의 검색을 위해 설계되었습니다. 의미 기반으로 검색하고, 자연어 질의를 받아들이며, 동일한 요청에서 page contents까지 반환할 수 있습니다. Search modes는 저지연 검색부터 structured output을 포함한 다단계 리서치까지 폭넓게 제공됩니다.

    사용 가능한 search types와 response 형식은 [Search quickstart](/ko/docs/search/quickstart)를 참고하세요.
  </Accordion>

  <Accordion title="Exa의 인덱스 규모는 어느 정도인가요?">
    2026년 8월 기준으로 Exa의 인덱스는 1.4조 개의 URL을 추적하며 공개 웹 전반에서 1,000억 개의 페이지를 제공합니다. 인덱스는 페이지가 발견, 갱신, 제거되면서 계속 변화합니다.
  </Accordion>

  <Accordion title="Exa의 결과는 얼마나 최신인가요?">
    Exa는 페이지를 지속적으로 발견하고 갱신하며, 그 주기는 소스와 페이지 변경 빈도에 따라 달라집니다. 인덱싱된 사본보다 더 최신의 콘텐츠가 필요하다면 Contents API의 [`maxAgeHours`](/ko/docs/contents/quickstart#content-freshness) 옵션으로 캐시 수명과 실시간 검색을 제어하세요.
  </Accordion>

  <Accordion title="Exa는 크롤러를 운영하나요?">
    예. Exa는 검색을 위해 공개 웹의 페이지를 발견하고 갱신하는 `ExaSearchBot`을 운영합니다. Robots Exclusion Protocol을 준수하고, 사이트별 요청 빈도를 제한하며, 로그인, 페이월, CAPTCHA를 우회하려 시도하지 않습니다.

    크롤링은 `robots.txt`로 제어합니다. 이미 인덱싱된 페이지를 제거하려면 `noindex` robots 메타 태그나 `X-Robots-Tag: noindex` response header를 사용하세요. Exa는 다음 재수집 시점에 해당 페이지를 제거합니다. 사용자 에이전트, 암호학적 verification 방법, 크롤러 제어 방법은 [Exa Search Crawler](https://crawler.exa.ai/)를 참고하세요.
  </Accordion>

  <Accordion title="Exa는 LLM response의 근거 확보에 어떤 도움을 주나요?">
    Exa는 소스 URL과 검색에 사용된 웹 콘텐츠를 함께 반환하므로, 애플리케이션이 citations를 붙여 답변을 생성하고 이를 뒷받침하는 evidence를 확인할 수 있습니다. 검색 품질과 소스 grounding은 근거 없는 주장을 줄이는 데 도움이 되지만, 검색된 정보를 어떻게 해석하고 제시할지는 여전히 애플리케이션과 해당 언어 모델의 책임입니다.
  </Accordion>

  <Accordion title="Exa가 검색하는 소스를 제한할 수 있나요?">
    예. `includeDomains`로 search 범위를 특정 도메인으로 한정하거나 `excludeDomains`로 원하지 않는 소스를 제외할 수 있습니다. Exa는 기업, 인물, 뉴스, 코드 등 소스별 검색을 위한 데이터 카테고리도 제공합니다. [Search best practices](/ko/docs/search/best-practices)와 [Data](/ko/docs/search/data/overview)를 참고하세요.
  </Accordion>

  <Accordion title="어떤 보안 및 데이터 보관 옵션이 제공되나요?">
    Exa는 프로덕션 및 엔터프라이즈 사용 사례를 위한 보안 및 규정 준수 제어를 제공하며, 여기에는 자격 요건을 충족하는 Enterprise 고객을 위한 [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)과 [HIPAA 준수](/ko/docs/admin/security/hipaa)가 포함됩니다. 자세한 내용은 [Security &amp; Compliance](/ko/docs/admin/security/overview)를 참고하세요.
  </Accordion>

  <Accordion title="Exa 가격은 어떻게 책정되나요?">
    API 사용량은 사용한 엔드포인트와 옵션에 따라 계정 credits에서 차감되는 방식으로 청구됩니다. 신규 계정에는 무료 credits이 제공되며, 조직에 엔터프라이즈 계약이 없는 한 유료 사용량은 종량제로 과금됩니다. [Pricing](/ko/docs/admin/pricing)과 [Billing](/ko/docs/admin/billing)을 참고하세요.
  </Accordion>
</AccordionGroup>