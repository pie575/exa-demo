> ## 문서 색인 {#documentation-index}
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일을 통해 사용 가능한 모든 페이지를 확인하세요.

# Nevermined {#nevermined}

> Nevermined x402 card delegation을 통한 Exa 자율 agent 결제. 7 USD를 결제하면 Exa API key가 새로 발급되거나 7 USD 상당의 credits이 충전됩니다.

Agent는 [Nevermined](https://nevermined.ai)의 [x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation) 방식으로 신용카드를 사용해 Exa에 비용을 지불합니다. **$7 결제**마다 **$7의 Exa credits**이 담긴 Exa API key가 반환됩니다.

<Info>
  다음 Nevermined plan ID를 사용하세요:<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />이 plan은 Nevermined의 live 환경(live 접두사가 붙은 API 키)에서 동작합니다. 구매 대상은 단일 search 요청이 아니라 API credits입니다.
</Info>

Nevermined를 처음 이용하는 payer라면 `POST /team-management/nevermined/purchase-key`가 새 Exa API key를 발급하고 $7의 credits을 추가합니다. 키를 모두 소진했다면 동일한 delegation으로 새 x402 token을 mint한 뒤 같은 엔드포인트를 다시 call하세요. Exa는 기존과 동일한 API 키에 $7의 credits을 추가해 반환합니다.

## 키 구매하기 {#buy-a-key}

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **비용:** 구매당 $7이며, x402 토큰이 참조하는 delegation에 연결된 카드로 청구됩니다.
* **Response (신규 payer):** `{ status: "ok", apiKey: "…", expiresAt: null }` — $7 상당의 credits가 포함된 새 Exa API key.
* **Response (기존 payer):** `{ status: "ok", apiKey: "…", expiresAt: null }` — 기존과 동일한 Exa API key에 credits $7 추가.
* **Response (replay된 토큰):** 캐시된 결과가 반환되며 추가 청구는 없습니다.
* **signature 누락 또는 유효하지 않음:** `402 Payment Required`가 반환되며, body에 결제 요구 사항이 포함됩니다.

## 작동 방식 {#how-it-works}

결제는 Nevermined가 처리하며, Exa는 서명된 x402 token만 확인합니다.

1. **최초 1회 설정(카드 소유자가 수행):** [nevermined.app](https://nevermined.app)에서 카드를 등록하고, 해당 카드에 **delegation**(지출 권한: 소유자가 limit과 기간을 설정하며, 특정 API 키로 scope를 제한할 수 있음)을 생성한 뒤, agent용 Nevermined API 키를 발급합니다.
2. **agent가 자신의 delegation을 찾습니다.** Nevermined SDK를 사용하면 agent가 자신의 키로 지출할 수 있는 delegation을 탐색하고, 남은 예산이 충분한(최소 $7) delegation을 선택할 수 있습니다. 조건에 맞는 delegation이 없다면 소유자가 dashboard에서 생성하거나, 완전 자율 agent가 카드의 limits 범위 내에서 SDK를 통해 직접 생성할 수 있습니다.
3. **agent가 x402 access token을 mint합니다.** 위의 plan ID에 대해 card-delegation 스킴으로 mint하며, delegation은 ID로 참조합니다. mint하기 전에 delegation이 반드시 존재해야 하며, token이 delegation을 즉석에서 생성하지는 못합니다.
4. **agent가 위 엔드포인트로 token을 POST합니다.** `payment-signature` header에 담아 전송하면 response로 Exa API key를 받습니다.
5. **키는 즉시 사용할 수 있습니다.** 표준 [Exa Search API](/ko/docs/search/quickstart)에 바로 사용 가능합니다.

agent 구현에 바로 활용할 수 있는 전체 안내(SDK 메서드, parameters, delegation 탐색 및 생성, 문제 해결)는 Nevermined의 Exa 연동 가이드를 참고하세요: [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agent의 경우: [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)를 가져오세요).

## $7로 이용할 수 있는 범위 {#what-7-buys}

Credits는 표준 Exa API 가격에 따라 차감됩니다. 현재 요금 기준으로 $7어치 credits는 대략 다음 정도에 해당합니다.

| 엔드포인트 또는 기능                                   |                         가격 |       대략적인 사용량 |
| --------------------------------------------- | -------------------------: | -------------: |
| 최대 10개 결과의 Search (`instant`, `fast`, `auto`) |               1,000 요청당 $7 |       1,000 요청 |
| Deep-Lite Search                              |              1,000 요청당 $10 |         700 요청 |
| Deep Search                                   |              1,000 요청당 $12 |        ~583 요청 |
| Deep-Reasoning Search                         |              1,000 요청당 $15 |        ~466 요청 |
| Contents (`text`, `highlights`, `summary`)    | content type별 1,000페이지당 $1 |       7,000페이지 |
| Search 또는 Contents의 AI 페이지 요약                 |               1,000페이지당 $1 | 7,000개 summary |
| 최초 10개를 초과하는 추가 결과                            |              1,000개 결과당 $1 |   추가 결과 7,000개 |
| Answer                                        |               1,000 요청당 $5 |       1,400 요청 |
| Monitors                                      |              1,000 요청당 $15 |        ~466 요청 |

Search 요청에는 최대 10개 결과의 text와 highlights가 포함됩니다. 10개를 초과하는 추가 결과와 AI summary는 별도로 과금됩니다.<br />
전체 가격 세부 정보는 [Exa 가격](https://exa.ai/pricing)을 참고하세요.

## 키가 소진되면 {#when-the-key-runs-out}

API 키의 credits를 모두 사용하면 Exa는 일반 API 엔드포인트에서 **`HTTP 402`**를 반환합니다:

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

동일한 plan ID와 delegation으로 새 x402 token을 mint한 다음, 같은 `/purchase-key` 엔드포인트로 다시 POST하세요. Exa가 동일한 API 키에 $7 상당의 credits를 추가로 적립해 줍니다.

## 참고 자료 {#references}

* [Nevermined Exa 연동 가이드](https://nevermined.ai/docs/integrations/exa)
* [x402 card-delegation 명세](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Exa 가격](https://exa.ai/pricing)
* [Exa Search API](/ko/docs/search/quickstart)