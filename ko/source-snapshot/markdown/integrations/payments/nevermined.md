> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="nevermined">
  # Nevermined
</div>

> Nevermined x402 card-delegation을 통한 Exa용 자율 agent 결제. 7 USD를 구매하면 7 USD 상당의 credits이 담긴 Exa API key가 새로 발급되거나 기존 key에 충전됩니다.

agent는 [Nevermined](https://nevermined.ai)의 [x402 card-delegation](https://nevermined.ai/docs/specs/x402-card-delegation) 방식으로 신용카드를 사용해 Exa에 결제합니다. **$7 구매**할 때마다 **$7 상당의 Exa credits**이 담긴 Exa API key가 반환됩니다.

<Info>
  다음 Nevermined plan ID를 사용하세요:<br />`27800462147494506865542649899724877617306579171265399959488097895839186996870`<br />이 plan은 Nevermined의 라이브 환경(live 접두사가 붙은 API key)에서 동작합니다. 이 구매는 단일 search request가 아니라 API credits을 구매하는 것입니다.
</Info>

Nevermined로 처음 결제하는 경우, `POST /team-management/nevermined/purchase-key`가 새 Exa API key를 발급하고 $7의 credits을 추가합니다. key의 잔액이 소진되면 동일한 delegation으로 새 x402 토큰을 발행한 뒤 같은 endpoint를 다시 call하세요. 그러면 Exa가 동일한 API key에 $7의 credits을 추가해 반환합니다.

<div id="buy-a-key">
  ## key 구매
</div>

```bash theme={null}
POST https://admin-api.exa.ai/team-management/nevermined/purchase-key
payment-signature: <x402-token>
```

* **비용:** 구매당 $7이며, x402 토큰이 참조하는 delegation에 연결된 카드로 청구됩니다.
* **응답(신규 결제자):** `{ status: "ok", apiKey: "…", expiresAt: null }` — $7 상당의 credits이 포함된 새 Exa API key.
* **응답(기존 결제자):** `{ status: "ok", apiKey: "…", expiresAt: null }` — 기존과 동일한 Exa API key에 $7 credits이 추가됩니다.
* **응답(재전송된 토큰):** 캐시된 결과가 반환되며 추가 청구는 없습니다.
* **서명 누락/유효하지 않음:** `402 Payment Required`가 반환되며, 본문에 결제 요구 사항이 포함됩니다.

<div id="how-it-works">
  ## 작동 방식
</div>

결제 부분은 Nevermined가 처리하며, Exa는 서명된 x402 토큰만 확인합니다.

1. **최초 1회 설정(카드 소유자가 수행):** [nevermined.app](https://nevermined.app)에서 카드를 등록하고, 해당 카드에 **delegation**을 생성한 뒤(지출 권한으로, 소유자가 limit과 기간을 설정하고 특정 API key로 scope를 제한할 수 있습니다) agent용 Nevermined API key를 발급합니다.
2. **agent가 자신의 delegation을 찾습니다.** Nevermined SDK를 사용하면 agent가 자신의 key로 지출할 수 있는 delegation을 조회하고, 남은 예산이 충분한(최소 $7) delegation을 선택할 수 있습니다. 해당하는 delegation이 없으면 소유자가 dashboard에서 생성하거나, 완전 자율 agent가 카드의 limits 범위 내에서 SDK를 통해 직접 생성할 수 있습니다.
3. **agent가 위 plan ID에 대한 x402 액세스 토큰을 발행합니다.** card-delegation 방식으로 발행하며, delegation은 ID로 참조합니다. 토큰을 발행하려면 delegation이 미리 존재해야 하며, 토큰이 즉석에서 delegation을 생성할 수는 없습니다.
4. **agent가 위 endpoint로 토큰을 POST합니다.** `payment-signature` header에 담아 전송하면 응답으로 Exa API key를 받습니다.
5. **이 key는 즉시 사용할 수 있습니다.** 표준 [Exa Search API](/ko/docs/search/quickstart)에 바로 사용 가능합니다.

agent 구현에 바로 활용할 수 있는 전체 가이드(SDK 메서드, 매개변수, delegation 조회 및 생성, 문제 해결)는 Nevermined의 Exa 연동 가이드를 참고하세요: [nevermined.ai/docs/integrations/exa](https://nevermined.ai/docs/integrations/exa) (agent의 경우 [nevermined.ai/docs/integrations/exa.md](https://nevermined.ai/docs/integrations/exa.md)를 가져오세요).

<div id="what-7-buys">
  ## $7로 이용할 수 있는 양
</div>

credits은 표준 Exa API 가격에 따라 소모됩니다. 현재 요금 기준으로 $7 상당의 credits으로 대략 다음만큼 이용할 수 있습니다:

| endpoint 또는 기능                               |                    가격 |     대략적인 사용량 |
| -------------------------------------------- | --------------------: | -----------: |
| 결과 10개까지의 search (`instant`, `fast`, `auto`) |        $7 / 요청 1,000건 |    요청 1,000건 |
| Deep-Lite Search                             |       $10 / 요청 1,000건 |      요청 700건 |
| Deep Search                                  |       $12 / 요청 1,000건 |     요청 ~583건 |
| Deep-Reasoning Search                        |       $15 / 요청 1,000건 |     요청 ~466건 |
| Contents (`text`, `highlights`, `summary`)   | 콘텐츠 유형당 $1 / 1,000페이지 |     7,000페이지 |
| Search 또는 Contents의 AI 페이지 요약                |         $1 / 1,000페이지 |    요약 7,000건 |
| 처음 10개를 초과하는 추가 결과                           |        $1 / 결과 1,000건 | 추가 결과 7,000건 |
| Answer                                       |        $5 / 요청 1,000건 |    요청 1,400건 |
| Monitors                                     |       $15 / 요청 1,000건 |     요청 ~466건 |

search 요청에는 최대 10개 결과에 대한 text와 highlights가 포함됩니다. 10개를 초과하는 추가 결과와 AI 요약은 별도로 청구됩니다.<br />
전체 가격 정보는 [Exa 가격](https://exa.ai/pricing)을 참고하세요.

<div id="when-the-key-runs-out">
  ## key가 소진되면
</div>

API key의 credits가 모두 소진되면 Exa는 일반 API endpoint에서 **`HTTP 402`**를 반환합니다:

```json theme={null}
{
  "requestId": "...",
  "error": "You have exceeded your credits limit. Please top up to keep using Exa at dashboard.exa.ai",
  "tag": "NO_MORE_CREDITS"
}
```

동일한 plan ID와 delegation으로 새 x402 토큰을 발행한 뒤, 같은 `/purchase-key` endpoint에 다시 POST하세요. 그러면 Exa가 동일한 API key에 $7 상당의 credits를 추가로 지급합니다.

<div id="references">
  ## 참고 자료
</div>

* [Nevermined Exa 연동 가이드](https://nevermined.ai/docs/integrations/exa)
* [x402 card-delegation 명세](https://nevermined.ai/docs/specs/x402-card-delegation)
* [Exa 가격](https://exa.ai/pricing)
* [Exa Search API](/ko/docs/search/quickstart)