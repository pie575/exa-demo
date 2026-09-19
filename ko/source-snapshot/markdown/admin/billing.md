> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="billing-and-rate-limits">
  # 결제 및 rate limits
</div>

> Exa credits, 인보이스, API rate limits를 관리하세요.

Exa는 무료 등급, 사용한 만큼 지불하는 billing, 맞춤형 Enterprise 플랜을 제공합니다. API 사용량은 team의 credit 잔액에서 차감되며, rate limits는 team이 얼마나 빠르게 요청을 보낼 수 있는지를 제어합니다.

<Columns cols={3}>
  <Card title="Billing dashboard" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="결제 관리" arrow="true">
    credits 추가, 자동 충전 설정, 인보이스 확인을 할 수 있습니다.
  </Card>

  <Card title="API keys" icon="key" href="https://dashboard.exa.ai/api-keys" cta="API keys 관리" arrow="true">
    usage를 확인하고 개별 key에 더 낮은 limit을 설정하세요.
  </Card>

  <Card title="가격" icon="tag" href="/ko/docs/admin/pricing" cta="가격 보기" arrow="true">
    Exa 제품별 현재 rates를 비교해 보세요.
  </Card>
</Columns>

<div id="plans-at-a-glance">
  ## 플랜 한눈에 보기
</div>

| 플랜                | Billing                         | Rate limit                                    | Agent concurrency |
| ----------------- | ------------------------------- | --------------------------------------------- | ----------------- |
| **Free**          | 초기 credits $20 제공, 이후 매월 $10 credits 갱신 | 10 QPS                                        | 활성 실행 50개         |
| **Pay as you go** | 구독이나 최소 지출 없는 선불 credits            | 10 QPS, [최대 25 QPS](#25-qps-on-pay-as-you-go) | 활성 실행 50개         |
| **Enterprise**    | 맞춤형 볼륨 가격 및 후불 인보이스 선택 가능       | 맞춤형                                           | 맞춤형               |

<Card title="문의하기" icon="headset" href="https://exa.ai/contact/sales" cta="영업팀에 문의" arrow="true">
  지연 시간, 확장성, ZDR 등에 대응할 수 있는 최적의 구성을 안내해 드립니다.
</Card>

<div id="billing-basics">
  ## 결제 기본 사항
</div>

요청 비용은 [가격](/ko/docs/admin/pricing)에 명시된 요율 또는 Enterprise 계약 조건에 따라 선불 credits에서 차감됩니다. Team 소유자는 [Billing dashboard](https://dashboard.exa.ai/billing)에서 credits을 추가할 수 있으며, 결제는 Stripe를 통해 처리됩니다.

team의 credits이 모두 소진되면 요청은 `402 Payment Required`를 반환합니다. 할당된 예산에 도달한 API key도 마찬가지로 `402`를 반환합니다. 이 경우 credits을 추가하거나 team 관리자에게 해당 key의 예산 조정을 요청하세요. 자세한 내용은 [오류 코드](/ko/docs/admin/error-codes)를 참고하세요.

API key별 과거 사용량을 확인하려면 [Get API key usage](/ko/docs/reference/team-management/get-api-key-usage)를 사용하세요.

<div id="rate-limits">
  ## Rate limits
</div>

rate limits는 초당 쿼리 수(QPS)로 측정되며, team이 보유한 모든 API key를 합산해 team 전체에 적용됩니다. [API Keys](https://dashboard.exa.ai/api-keys) 페이지에서 개별 key에 더 낮은 limit을 지정할 수 있지만, 해당 key의 트래픽도 team limit에 함께 집계됩니다.

| Endpoint                                                 | 기본 limit          |
| -------------------------------------------------------- | ----------------- |
| `/search`, `/answer`, `/chat/completions`                | 10 QPS            |
| `type`이 `deep-lite`, `deep`, `deep-reasoning`인 `/search` | 5 QPS             |
| `/contents`                                              | 100 QPS           |
| `/agent/runs`, `/responses`                              | 5 QPS 및 활성 실행 50개 |
| `/websets/*`                                             | 20 QPS            |

일부 endpoint는 rate limit 용량을 공유합니다. limits는 변경될 수 있으며 요금제에 따라 달라집니다. Websets searches에는 요금제별 concurrency limits도 적용되며, [Get Team Info](/ko/docs/websets/api/teams/get-team-info)에서 확인할 수 있습니다.

limit을 초과하면 요청은 `429 Too Many Requests`를 반환합니다. `Retry-After` header가 있으면 해당 시간만큼 대기하고, 없으면 지수 백오프로 재시도하세요. [오류 코드](/ko/docs/admin/error-codes)를 참고하세요.

<div id="agent-limits">
  ### Agent limits
</div>

Agent limits는 두 가지 별도의 제어로 이루어집니다. 하나는 동시에 진행할 수 있는 실행 수이고, 다른 하나는 새 실행을 시작할 수 있는 속도입니다.

* **Concurrency**: Agent 실행은 동시에 50개까지 진행할 수 있습니다. 이 limit는 QPS와 별개이며, QPS를 상향해도 변경되지 않습니다. limit를 초과해 실행을 시작하면 오류 코드 `CONCURRENCY_LIMIT_REACHED`와 함께 `429`가 반환됩니다. 실행이 끝날 때까지 기다리거나, concurrency limit 상향이 필요하면 문의해 주세요.
* **실행 시작**: `POST /agent/runs`는 계정 QPS를 소모하며, 실행 시작 1회가 요청 2건으로 계산됩니다. 따라서 QPS의 절반에 해당하는 속도로 실행을 시작할 수 있어, 기본값인 10 QPS 계정은 초당 5개, 25 QPS 계정은 초당 12개의 실행을 시작할 수 있습니다.
* **폴링**: 실행 상태, 이벤트, 실행 목록을 조회하는 `GET` 요청은 QPS에 포함되지 않고 디스패치를 차단하지도 않습니다. 따라서 새 실행을 시작하는 속도와 무관하게 진행 중인 Agent를 폴링할 수 있습니다.

<div id="25-qps-on-pay-as-you-go">
  ### Pay as you go에서 25 QPS
</div>

임의의 30일 기간 내에 $1,000 상당의 credits를 충전하면 team의 rate limit이 자동으로 **90일 동안 25 QPS**로 상향됩니다. 이 기준은 사용한 credits가 아니라 구매한 credits를 기준으로 계산되며, 조건을 다시 충족하면 90일이 새로 시작됩니다. 진행 상황은 [Billing dashboard](https://dashboard.exa.ai/billing)에서 확인하세요.

25 QPS보다 더 높은 한도가 필요하신가요? [영업팀에 문의하세요](https://exa.ai/contact/sales).

<div id="auto-recharge">
  ## 자동 충전
</div>

자동 충전은 잔액이 지정한 기준값에 도달하면 credits를 구매합니다. [Billing dashboard](https://dashboard.exa.ai/billing)에서 설정할 수 있습니다.

| 설정          | 설명                                                                           |
| ----------- | ---------------------------------------------------------------------------- |
| **충전 금액**   | 자동 충전이 실행될 때마다 구매하는 credits이며, $5에서 $10,000까지 설정할 수 있습니다.                    |
| **충전 기준값**  | 충전이 실행되는 잔액 수준입니다.                                                           |
| **월 최대 한도** | billing 주기 동안 이루어지는 자동 충전 구매에 적용되는 선택적 상한입니다. 한도를 두지 않으려면 $0으로 설정하거나 비워 두세요. |

예를 들어 충전 금액 $100, 기준값 $10, 월 최대 한도 $500으로 설정하면, 잔액이 $10에 도달할 때마다 $100를 구매하고 해당 주기의 자동 구매는 최대 $500까지 이루어집니다.

출시를 앞두고 있거나 트래픽이 많은 워크로드를 처리할 때는 미리 충분한 credits를 확보하고, 소액 payment 시도가 여러 번 발생하지 않도록 자동 충전 금액을 넉넉히 설정하세요.

<div id="receipts-and-invoices">
  ## 영수증 및 청구서
</div>

Exa는 크레딧 구매와 자동 충전 영수증을 [billing@exa.ai](mailto:billing@exa.ai) 주소로 이메일 발송합니다. 필요하다면 이 주소를 허용 목록에 추가하세요. 전체 청구서 내역은 [Billing dashboard](https://dashboard.exa.ai/billing)에서 확인할 수 있습니다.

후불 청구서 방식은 Enterprise 플랜에서 이용할 수 있습니다.

<div id="get-help">
  ## 도움 받기
</div>

<Columns cols={2}>
  <Card title="limits 상향" icon="gauge" href="https://exa.ai/contact/sales" cta="영업팀 문의" arrow="true">
    25 QPS 이상, 맞춤 concurrency, 대량 요금제, 후불 billing이 필요하면 문의하세요.
  </Card>

  <Card title="billing 지원" icon="mail" href="mailto:billing@exa.ai" cta="billing 문의 메일" arrow="true">
    payment, credits, 인보이스, 계정 billing 관련 문의를 도와드립니다.
  </Card>
</Columns>