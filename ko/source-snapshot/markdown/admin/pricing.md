> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="pricing">
  # 요금
</div>

> Exa Search, Contents, Answer, Monitors, Agent API의 종량제 요금

***

Exa는 종량제로 운영됩니다. 구독료나 최소 사용 금액이 없으며, credits를 충전해 두면 아래 요금에 따라 요청 건별로 과금됩니다.

<Check>
  **무료로 시작하세요.** 신규 계정에는 $20 상당의 무료 credits(약 2,800회 searches)가 제공되며, 무료 등급에서는 매월 $10의 credits가 추가로 지급됩니다. API key를 발급받고 바로 개발을 시작해 보세요.

  **규모를 키우고 계신가요?** 대량 사용, custom indexes, 더 높은 rate limits, SLA, Zero Data Retention이 필요하시다면 볼륨 할인이 적용되는 [Enterprise 플랜](#enterprise)에 대해 [문의해 주세요](https://exa.ai/contact/sales).
</Check>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 key를 생성하세요. 신규 계정에는 무료 credits가 제공됩니다.
</Card>

<div id="products">
  ## 제품
</div>

<Columns cols={3}>
  <Card title="Search" icon="search" href="/ko/docs/search/quickstart">
    **$7** / 1천 건

    토큰 효율이 높은 page contents를 함께 제공하는 실시간 search.
  </Card>

  <Card title="Deep Search" icon="microscope" href="/ko/docs/search/deep-search">
    **$12–15** / 1천 건

    structured output과 citations를 제공하는 다단계 리서치.
  </Card>

  <Card title="Contents" icon="file-text" href="/ko/docs/contents/quickstart">
    **$1** / 1천 페이지

    이미 알고 있는 URL의 전체 페이지 텍스트, highlights, summaries.
  </Card>

  <Card title="Answer" icon="message-circle" href="/ko/docs/reference/answer">
    **$5** / 1천 건

    citations가 포함된 질문에 대한 LLM 답변.
  </Card>

  <Card title="Monitors" icon="bell" href="/ko/docs/monitors/quickstart">
    **$15** / 1천 건

    웹에서 새로운 이벤트를 포착하는 예약 searches.
  </Card>

  <Card title="Agent" icon="bot" href="/ko/docs/agent/quickstart">
    **$0.012–$1.00** / 고정 effort 실행 또는 usage 기반

    비동기 심층 리서치, list building, enrichment.
  </Card>
</Columns>

<div id="search-contents-answer-and-monitors">
  ## Search, Contents, Answer, Monitors
</div>

각 endpoint에는 결과 최대 10개까지 포함하는 요청당 기본 가격이 있습니다. 10개를 초과하는 결과와 Exa가 생성한 페이지 summaries는 별도로 과금됩니다.

| Endpoint    | 기본 가격<br />(결과 10개까지) | 10개 초과 결과당 | AI 페이지 요약 |
| ----------- | --------------------- | ---------- | ----------------- |
| `/search`   | $7 / 1천 요청            | $1 / 1천 결과 | $1 / 1천 페이지       |
| `/answer`   | $5 / 1천 요청            | —          | —                 |
| `/monitors` | $15 / 1천 요청           | $1 / 1천 결과 | $1 / 1천 페이지       |
| `/contents` | $1 / 1천 페이지, 콘텐츠 유형별  | —          | $1 / 1천 페이지       |

<div id="agent">
  ## Agent
</div>

[Agent](/ko/docs/agent/quickstart)에 `effort`를 고정하면 요청당 가격을 예측할 수 있습니다. `auto`는 기본 종량제 모드이며, 베타 단계인 `max` 역시 종량제로 동일한 사용량 요금이 적용됩니다.

| Effort    | 가격          |
| --------- | ----------- |
| `minimal` | $0.012 / 요청 |
| `low`     | $0.025 / 요청 |
| `medium`  | $0.10 / 요청  |
| `high`    | $0.50 / 요청  |
| `xhigh`   | $1.00 / 요청  |

종량제 실행은 실행별 상한 내에서 실제 사용량만큼 청구됩니다. `auto`의 기본 상한은 $5, 베타 단계인 `max`의 기본 상한은 $20입니다.

| 사용량 항목                  | 가격              |
| ----------------------- | --------------- |
| Agent Compute Unit      | $0.10 / ACU     |
| Search 도구 call          | $0.005 / search |
| 이메일 contact enrichment  | $0.02 / 이메일     |
| 전화번호 contact enrichment | $0.07 / 전화번호    |

<div id="connect-providers">
  ### Connect providers
</div>

[Exa Connect](/ko/docs/agent/connect/overview) 데이터 소스를 사용하는 실행은
각 provider call에 대해서도 추가로 과금됩니다. 예를 들어
[Fiber.ai](/ko/docs/agent/connect/fiber#pricing)는 credit당 $0.02,
[Baselayer](/ko/docs/agent/connect/baselayer#pricing)는 작업에 따라 주문당 $0.15~$4.00입니다.
전체 provider 요금은
[Connect 가격](/ko/docs/agent/connect/overview#pricing)을 참고하세요.

<div id="deep-search">
  ## Deep Search
</div>

[`/search`](/ko/docs/search/deep-search)에서 `type`으로 설정합니다. 추가 결과와 AI 페이지 요약 비용은 표준 search와 동일합니다.

| Type             | 기본 가격<br />(결과 10개까지) | 지연 시간  | 적합한 용도                        |
| ---------------- | --------------------- | ------ | ----------------------------- |
| `deep-lite`      | $12 / 요청 1천 건         | 약 4초   | 가벼운 synthesis                 |
| `deep`           | $12 / 요청 1천 건         | 4~15초  | structured output을 활용한 다단계 추론 |
| `deep-reasoning` | $15 / 요청 1천 건         | 12~40초 | 난이도 높은 리서치 작업                 |

<div id="enterprise">
  ## Enterprise
</div>

대규모 사용량, 맞춤형 데이터셋, 더 엄격한 보안 요구사항이 필요한 경우에 적합한 플랜입니다.

<Columns cols={3}>
  <Card title="강력한 search" icon="gauge">
    search당 최대 1,000개 결과, 25개를 초과하는 결과 요청, 맞춤형 rate limits(QPS), 맞춤형 모더레이션, custom indexes를 제공합니다.
  </Card>

  <Card title="엔터프라이즈 지원" icon="headphones">
    SLA 및 MSA, 1:1 온보딩 및 지원, [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)을 제공합니다.
  </Card>

  <Card title="맞춤형 가격" icon="tag">
    대량 사용 할인 및 후불 인보이스 billing을 지원합니다.
  </Card>
</Columns>

<Card title="문의하기" icon="mail" horizontal href="https://exa.ai/contact/sales">
  엔터프라이즈 사용량과 계약 조건에 대한 quote를 받아보세요
</Card>

<div id="cost-glossary">
  ## 비용 용어집
</div>

<AccordionGroup>
  <Accordion title="요청">
    endpoint에 대한 API call 1회입니다. 가격은 요청 1,000건 기준으로 표시되므로 $7 / 1k 요율은 call당 $0.007입니다.
  </Accordion>

  <Accordion title="결과">
    응답으로 반환되는 search 결과 1건입니다. 기본 가격에는 한 요청의 처음 10개 결과가 포함되며, 10개를 초과하는 결과에는 결과 1,000건당 $1가 추가됩니다. 따라서 `numResults: 20`으로 요청하면 기본 가격에 추가 결과 10건의 비용이 더해집니다.
  </Accordion>

  <Accordion title="페이지 및 콘텐츠 유형">
    페이지는 Exa가 contents를 반환하는 URL 하나를 말합니다. 콘텐츠 유형은 해당 페이지를 보는 한 가지 방식, 즉 `text`, `highlights`, `summary`입니다. `/contents`는 콘텐츠 유형별로 각각 과금하므로 `text`와 `highlights`를 함께 요청한 페이지 하나는 2건으로 계산됩니다.
  </Accordion>

  <Accordion title="AI 페이지 summary">
    Exa 측에서 추가 LLM call을 실행해 생성한 페이지 summary입니다. 이를 반환하는 모든 endpoint에서 페이지 1,000건당 $1로 과금됩니다.
  </Accordion>

  <Accordion title="Agent Compute Unit (ACU)">
    Agent 실행이 소비하는 모델 연산 단위로, `usage.agentComputeUnits`로 보고됩니다. 실행 시간이 길수록, `input.data`가 클수록, 추론 단계가 많을수록 더 많은 ACU를 소비합니다.
  </Accordion>

  <Accordion title="Effort">
    철저함과 비용·지연 시간 사이를 조절하는 Agent 매개변수입니다. `auto`는 기본 $5 한도까지 소비량(ACU 및 도구 call)에 따라 과금되며, 베타 단계인 `max`는 동일한 사용 요율로 기본 $20 한도까지 과금됩니다. 고정 effort는 요청당 정액으로 과금됩니다. [Agent effort 모드](/ko/docs/agent/quickstart#effort)를 참고하세요.
  </Accordion>

  <Accordion title="Contact enrichment">
    사람 또는 회사의 이메일 주소나 전화번호를 반환하는 Agent 조회입니다. 실행에 발생하는 다른 비용과 별도로, 찾아낸 연락처 건당 과금됩니다.
  </Accordion>

  <Accordion title="Credits">
    계정에 선불로 충전된 달러 잔액입니다. 사용량에 따라 위 요율로 credits가 차감됩니다.
  </Accordion>
</AccordionGroup>

<Card title="Billing" icon="credit-card" horizontal href="/ko/docs/admin/billing">
  credits 충전, 자동 충전 설정, 인보이스 확인하기
</Card>