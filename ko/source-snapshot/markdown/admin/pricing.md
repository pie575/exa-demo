> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 먼저 확인하세요.

<div id="pricing">
  # Pricing
</div>

> Exa Search, Contents, Answer, Monitors, Agent API의 사용한 만큼 지불하는 요금

***

Exa는 사용한 만큼 지불하는 방식입니다. 구독이나 최소 사용 금액이 없으며, credits를 충전해 두면 아래 요금에 따라 요청 단위로 과금됩니다.

<Check>
  **무료로 시작하세요.** 신규 계정에는 $20 상당의 무료 credits(약 2,800회 searches)가 제공되며, Free Tier에서는 매월 $10의 credits가 추가로 지급됩니다. API 키를 발급받고 바로 개발을 시작하세요.

  **규모를 키우고 계신가요?** 대규모 사용량, custom indexes, 더 높은 속도 제한, SLA, Zero Data Retention이 필요하다면 볼륨 할인이 적용되는 [Enterprise plan](#enterprise)에 대해 [문의해 주세요](https://exa.ai/contact/sales).
</Check>

<Card title="Exa API key 발급받기" icon="key" horizontal href="https://dashboard.exa.ai/api-keys">
  dashboard에서 키를 생성하세요. 신규 계정에는 무료 credits가 제공됩니다.
</Card>

<div id="products">
  ## 제품
</div>

<Columns cols={3}>
  <Card title="Search" icon="search" href="/ko/docs/search/quickstart">
    **$7** / 1천 요청

    토큰 효율이 높은 page contents를 함께 제공하는 실시간 search.
  </Card>

  <Card title="Deep Search" icon="microscope" href="/ko/docs/search/deep-search">
    **$12–15** / 1천 요청

    structured output과 citations를 제공하는 다단계 리서치.
  </Card>

  <Card title="Contents" icon="file-text" href="/ko/docs/contents/quickstart">
    **$1** / 1천 페이지

    이미 알고 있는 URL의 전체 페이지 텍스트, highlights, summary.
  </Card>

  <Card title="Answer" icon="message-circle" href="/ko/docs/reference/answer">
    **$5** / 1천 요청

    citations가 포함된 질문에 대한 LLM 답변.
  </Card>

  <Card title="Monitors" icon="bell" href="/ko/docs/monitors/quickstart">
    **$15** / 1천 요청

    웹에서 새로운 이벤트를 포착하는 예약 search.
  </Card>

  <Card title="Agent" icon="bot" href="/ko/docs/agent/quickstart">
    **$0.012–$1.00** / 고정 effort 실행, 또는 사용량 기반

    비동기 딥 리서치, 리스트 구축, enrichment.
  </Card>
</Columns>

<div id="search-contents-answer-and-monitors">
  ## Search, Contents, Answer, Monitors
</div>

각 엔드포인트에는 최대 10개의 result를 포함하는 요청당 기본 가격이 있습니다. 10개를 초과하는 result와 Exa가 생성한 페이지 요약은 별도로 과금됩니다.

| 엔드포인트       | 기본 가격<br />(최대 10개 result) | 10개 초과 result당   | AI 페이지 요약    |
| ----------- | -------------------------- | ---------------- | ------------ |
| `/search`   | 1,000요청당 $7                | 1,000 result당 $1 | 1,000페이지당 $1 |
| `/answer`   | 1,000요청당 $5                | —                | —            |
| `/monitors` | 1,000요청당 $15               | 1,000 result당 $1 | 1,000페이지당 $1 |
| `/contents` | content type별 1,000페이지당 $1 | —                | 1,000페이지당 $1 |

<div id="agent">
  ## Agent
</div>

[Agent](/ko/docs/agent/quickstart)에 `effort`를 고정하면 요청당 가격을 예측할 수 있습니다. `auto`는 기본 종량제 모드이며, 베타 `max` 역시 종량제로 동일한 사용량 요율이 적용됩니다:

| Effort    | 가격         |
| --------- | ---------- |
| `minimal` | 요청당 $0.012 |
| `low`     | 요청당 $0.025 |
| `medium`  | 요청당 $0.10  |
| `high`    | 요청당 $0.50  |
| `xhigh`   | 요청당 $1.00  |

종량제 실행은 실행당 상한 내에서 실제 사용량만큼 청구됩니다. `auto`의 기본 상한은 $5, 베타 `max`의 기본 상한은 $20입니다:

| 사용량 구성 요소              | 가격             |
| ---------------------- | -------------- |
| Agent Compute Units    | ACU당 $0.10     |
| Search 도구 call           | search당 $0.005 |
| 이메일 contact enrichment | 이메일당 $0.02     |
| 전화 contact enrichment  | 전화번호당 $0.07    |

<div id="connect-providers">
  ### Connect providers
</div>

[Exa Connect](/ko/docs/agent/connect/overview) 데이터 소스를 사용하는 실행은
각 provider call에 대해서도 추가로 과금됩니다. 예를 들어
[Fiber.ai](/ko/docs/agent/connect/fiber#pricing)는 credit당 $0.02,
[Baselayer](/ko/docs/agent/connect/baselayer#pricing)는 작업 유형에 따라 주문당
$0.15–$4.00입니다. 모든 제공업체 요금은
[Connect 가격](/ko/docs/agent/connect/overview#pricing)을 참고하세요.

<div id="deep-search">
  ## Deep Search
</div>

[`/search`](/ko/docs/search/deep-search)의 `type`으로 설정합니다. 추가 result와 AI 페이지 요약 비용은 standard search와 동일합니다.

| Type             | 기본 가격<br />(result 10개까지) | Latency | 적합한 용도                        |
| ---------------- | ------------------------- | ------- | ----------------------------- |
| `deep-lite`      | 1천 요청당 $12                | 약 4초    | 가벼운 synthesis                 |
| `deep`           | 1천 요청당 $12                | 4~15초   | structured output을 활용한 다단계 추론 |
| `deep-reasoning` | 1천 요청당 $15                | 12~40초  | 난이도 높은 리서치 작업                 |

<div id="enterprise">
  ## Enterprise
</div>

대용량 사용, 맞춤형 데이터셋, 더 엄격한 보안 요구사항이 필요한 경우에 적합한 플랜입니다.

<Columns cols={3}>
  <Card title="강력한 검색" icon="gauge">
    search당 최대 1,000개 result, 25개를 초과하는 result 요청, 맞춤형 속도 제한(QPS), 맞춤형 콘텐츠 검열, custom indexes를 제공합니다.
  </Card>

  <Card title="엔터프라이즈 지원" icon="headphones">
    SLA 및 MSA, 1:1 온보딩 및 지원, [Zero Data Retention](/ko/docs/admin/security/zero-data-retention)을 제공합니다.
  </Card>

  <Card title="맞춤형 가격" icon="tag">
    볼륨 할인과 후불 invoice billing을 지원합니다.
  </Card>
</Columns>

<Card title="문의하기" icon="mail" horizontal href="https://exa.ai/contact/sales">
  엔터프라이즈 사용량과 계약 조건에 대한 quote를 받아보세요
</Card>

<div id="cost-glossary">
  ## 비용 용어집
</div>

<AccordionGroup>
  <Accordion title="Request">
    엔드포인트로 보내는 API 호출 1건입니다. 가격은 요청 1,000건 단위로 표시되므로 $7 / 1k 요율은 호출당 $0.007입니다.
  </Accordion>

  <Accordion title="Result">
    response로 반환되는 검색 result 1건입니다. 기본 가격에는 요청당 처음 10건의 result가 포함되며, 10건을 초과하는 result마다 $1 / 1k result가 추가됩니다. 따라서 `numResults: 20`으로 요청하면 기본 가격에 추가 result 10건의 비용이 더해집니다.
  </Accordion>

  <Accordion title="Page and content type">
    페이지는 Exa가 콘텐츠를 반환하는 URL 1개를 말합니다. content type은 해당 페이지를 보는 하나의 방식, 즉 `text`, `highlights`, `summary` 중 하나입니다. `/contents`는 content type별로 각각 과금하므로 `text`와 `highlights`를 함께 요청한 페이지 1개는 2건으로 계산됩니다.
  </Accordion>

  <Accordion title="AI page summary">
    Exa가 생성한 페이지 summary로, Exa 측에서 추가 LLM 호출을 거쳐 생성됩니다. 이를 반환하는 모든 엔드포인트에서 $1 / 1k pages로 과금됩니다.
  </Accordion>

  <Accordion title="Agent Compute Unit (ACU)">
    Agent 실행이 소비하는 모델 연산 단위이며, `usage.agentComputeUnits`로 보고됩니다. 실행이 길수록, `input.data`가 클수록, 추론 단계가 많을수록 더 많은 ACU를 소비합니다.
  </Accordion>

  <Accordion title="Effort">
    비용 및 latency와 정밀도 사이의 균형을 조절하는 Agent 매개변수입니다. `auto`는 기본 $5 상한까지 소비량(ACU 및 도구 call) 기준으로 과금되고, 베타인 `max`는 동일한 사용량 요율을 적용하되 기본 상한이 $20입니다. 고정 effort는 요청당 정액으로 과금됩니다. [Agent effort 모드](/ko/docs/agent/quickstart#effort)를 참고하세요.
  </Accordion>

  <Accordion title="Contact enrichment">
    사람 또는 회사의 이메일 주소나 전화번호를 찾아 반환하는 Agent 조회입니다. 해당 실행의 다른 비용에 더해, 찾은 연락처 건당 과금됩니다.
  </Accordion>

  <Accordion title="Credits">
    계정에 선불로 충전된 달러 잔액입니다. 사용량만큼 위 요율에 따라 credits에서 차감됩니다.
  </Accordion>
</AccordionGroup>

<Card title="Billing" icon="credit-card" horizontal href="/ko/docs/admin/billing">
  credits 추가, 자동 충전 설정, invoice 확인
</Card>