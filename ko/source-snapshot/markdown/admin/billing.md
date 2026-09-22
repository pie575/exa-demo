> ## 문서 인덱스 {#documentation-index}
>
> 전체 문서 인덱스는 다음 주소에서 가져오세요: https://exa.ai/docs/llms.txt
> 더 자세히 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

# Billing 및 속도 제한 {#billing-and-rate-limits}

> Exa credits, invoice, API 속도 제한을 관리하세요.

Exa는 Free 티어, 사용한 만큼 지불하는 billing, 맞춤형 Enterprise plan을 제공합니다. API 사용량은 team의 credit 잔액에서 차감되며, 속도 제한은 team이 요청을 보낼 수 있는 속도를 제어합니다.

<Columns cols={3}>
  <Card title="Billing dashboard" icon="credit-card" href="https://dashboard.exa.ai/billing" cta="Billing 관리" arrow="true">
    credits 추가, 자동 충전 설정, invoice 확인을 할 수 있습니다.
  </Card>

  <Card title="API 키" icon="key" href="https://dashboard.exa.ai/api-keys" cta="API 키 관리" arrow="true">
    사용량을 확인하고 개별 키에 더 낮은 limit을 설정하세요.
  </Card>

  <Card title="Pricing" icon="tag" href="/ko/docs/admin/pricing" cta="가격 보기" arrow="true">
    Exa 제품별 현재 요금을 비교해 보세요.
  </Card>
</Columns>

## 플랜 한눈에 보기 {#plans-at-a-glance}

| 플랜                | Billing                                 | 속도 제한                                         | Agent concurrency |
| ----------------- | --------------------------------------- | --------------------------------------------- | ----------------- |
| **Free**          | 최초 제공 credits $20, 이후 매월 $10 credits 갱신 | 10 QPS                                        | 활성 실행 50개         |
| **Pay as you go** | 구독이나 최소 지출 없는 선불 credits                | 10 QPS, [최대 25 QPS](#25-qps-on-pay-as-you-go) | 활성 실행 50개         |
| **Enterprise**    | 맞춤형 volume pricing 및 선택적 후불 인보이스 발행     | 맞춤형                                           | 맞춤형               |

<Card title="문의하기" icon="headset" href="https://exa.ai/contact/sales" cta="Contact sales" arrow="true">
  latency, 확장성, ZDR 등을 고려한 최적의 구성을 안내해 드립니다.
</Card>

## billing 기본 사항 {#billing-basics}

요청은 [Pricing](/ko/docs/admin/pricing)에 명시된 요금 또는 Enterprise 계약 조건에 따라 선불 credits에서 차감됩니다. Team 소유자는 [Billing dashboard](https://dashboard.exa.ai/billing)에서 credits를 충전할 수 있으며, payments는 Stripe를 통해 처리됩니다.

team의 credits가 모두 소진되면 요청은 `402 Payment Required`를 반환합니다. 할당된 예산을 모두 사용한 API 키도 마찬가지로 `402`를 반환합니다. 이 경우 credits를 추가하거나 team 관리자에게 해당 키의 예산 조정을 요청하세요. [오류 코드](/ko/docs/admin/error-codes)를 참고하세요.

API 키별 과거 사용량을 확인하려면 [Get API key usage](/ko/docs/reference/team-management/get-api-key-usage)를 사용하세요.

## 속도 제한 {#rate-limits}

속도 제한은 초당 쿼리 수(QPS)로 측정되며, 모든 API 키를 합산해 team 전체에 적용됩니다. [API Keys](https://dashboard.exa.ai/api-keys) 페이지에서 개별 키에 더 낮은 limit을 설정할 수 있지만, 해당 키의 traffic도 team limit에 포함됩니다.

| 엔드포인트                                                    | 기본 limit                |
| -------------------------------------------------------- | ----------------------- |
| `/search`, `/answer`, `/chat/completions`                | 10 QPS                  |
| `type`이 `deep-lite`, `deep`, `deep-reasoning`인 `/search` | 5 QPS                   |
| `/contents`                                              | 100 QPS                 |
| `/agent/runs`, `/responses`                              | 5 QPS 및 active runs 50개 |
| `/websets/*`                                             | 20 QPS                  |

일부 엔드포인트는 속도 제한 용량을 공유합니다. limits는 변경될 수 있고 plan에 따라 달라질 수 있습니다. Websets searches에는 plan 기반 concurrency limits도 적용되며, [Get Team Info](/ko/docs/websets/api/teams/get-team-info)에서 확인할 수 있습니다.

limit을 초과하면 요청은 `429 Too Many Requests`를 반환합니다. `Retry-After` header가 있으면 그만큼 기다렸다가 재시도하고, 없으면 exponential backoff로 재시도하세요. [오류 코드](/ko/docs/admin/error-codes)를 참고하세요.

### Agent limits {#agent-limits}

Agent limits는 두 가지 별도의 제어로 이루어집니다. 동시에 진행할 수 있는 실행 수와, 새 실행을 시작할 수 있는 속도입니다.

* **Concurrency**: 동시에 최대 50개의 Agent 실행이 진행될 수 있습니다. 이 limit은 QPS와 별개이며, QPS를 상향해도 변경되지 않습니다. limit을 초과해 실행을 시작하면 `CONCURRENCY_LIMIT_REACHED` 오류 코드와 함께 `429`가 반환됩니다. 실행이 끝날 때까지 기다리거나, concurrency limit 상향이 필요하면 문의해 주세요.
* **실행 시작**: `POST /agent/runs`는 계정 QPS를 소모하며, 실행 시작 1회는 요청 2회로 계산됩니다. 따라서 QPS의 절반에 해당하는 속도로 실행을 시작할 수 있어, 기본값인 10 QPS 계정은 초당 5개, 25 QPS 계정은 초당 12개를 시작할 수 있습니다.
* **폴링**: 실행 상태, events, 실행 목록에 대한 `GET` 요청은 QPS에 포함되지 않으며 디스패치를 차단하지도 않습니다. 따라서 새 실행을 시작하는 속도와 무관하게 실행 중인 Agent를 폴링할 수 있습니다.

### pay as you go에서 25 QPS {#25-qps-on-pay-as-you-go}

30일 기간 내에 $1,000 상당의 credits를 추가로 구매하면 team의 속도 제한이 자동으로 **90일간 25 QPS**로 상향됩니다. 이 기준은 사용한 credits가 아니라 구매한 credits를 기준으로 계산되며, 조건을 다시 충족하면 90일이 새로 시작됩니다. 진행 상황은 [Billing dashboard](https://dashboard.exa.ai/billing)에서 확인하세요.

25 QPS보다 더 필요하신가요? [영업팀에 문의하세요](https://exa.ai/contact/sales).

## 자동 충전 {#auto-recharge}

자동 충전은 잔액이 지정한 임계값에 도달하면 credits를 구매합니다. [Billing dashboard](https://dashboard.exa.ai/billing)에서 설정하세요.

| 설정          | 설명                                                                          |
| ----------- | --------------------------------------------------------------------------- |
| **충전 금액**   | 자동 충전이 실행될 때마다 구매되는 credits로, $5에서 $10,000까지 설정할 수 있습니다.                    |
| **충전 임계값**  | 충전이 실행되는 기준 잔액입니다.                                                          |
| **월 최대 한도** | billing 주기 동안 자동 충전으로 구매할 수 있는 한도(선택 사항)입니다. 한도를 두지 않으려면 $0으로 설정하거나 비워 두세요. |

예를 들어 충전 금액 $100, 임계값 $10, 월 최대 한도 $500으로 설정하면 잔액이 $10에 도달할 때마다 $100을 구매하며, 해당 주기 동안 자동 구매는 최대 $500까지 이루어집니다.

출시를 앞두고 있거나 대규모 작업을 처리해야 한다면, 미리 충분한 credits를 추가하고 소액 결제 시도가 반복되지 않도록 자동 충전 금액을 넉넉히 설정하세요.

## 영수증 및 invoice {#receipts-and-invoices}

Exa는 credit 구매 및 자동 충전에 대한 영수증을 [billing@exa.ai](mailto:billing@exa.ai)에서 이메일로 발송합니다. 필요하다면 이 주소를 허용 목록에 추가하세요. 전체 invoice 내역은 [Billing dashboard](https://dashboard.exa.ai/billing)에서 확인할 수 있습니다.

후불 invoice billing은 Enterprise plan에서 이용할 수 있습니다.

## 도움 받기 {#get-help}

<Columns cols={2}>
  <Card title="limits 상향하기" icon="gauge" href="https://exa.ai/contact/sales" cta="영업팀 문의" arrow="true">
    25 QPS 이상, 맞춤 concurrency, 볼륨 가격, 후불 billing이 필요하다면 문의하세요.
  </Card>

  <Card title="billing 지원" icon="mail" href="mailto:billing@exa.ai" cta="billing 문의 메일 보내기" arrow="true">
    결제, credits, invoice, 계정 billing 관련 문의를 도와드립니다.
  </Card>
</Columns>