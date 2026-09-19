> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 이용 가능한 모든 페이지를 확인하세요.

<div id="pay-with-mpp-tempo">
  # MPP(Tempo)로 결제하기
</div>

> Tempo의 USDC.e로 요청당 비용을 지불하면 API key 없이도 Exa의 Search 및 Contents API를 호출할 수 있습니다.

<div id="what-is-mpp">
  ## MPP란?
</div>

MPP(Machine Payments Protocol)는 `402 Payment Required` 상태 코드를 기반으로 하는 개방형 HTTP 네이티브 결제 표준입니다. 클라이언트는 계정, API key, 구독 없이도 [Tempo](https://tempo.xyz)의 스테이블코인을 비롯한 여러 결제 수단으로 요청 단위로 API 사용료를 지불할 수 있습니다. 이 페이지의 예제는 Tempo를 사용하며, Exa는 현재 Tempo mainnet의 USDC.e로 MPP 결제를 정산합니다.

Exa는 **`/search`**와 **`/contents`** 두 endpoint에서 MPP를 지원합니다. API key나 payment credential 없이 요청을 보내면 Exa는 `402` 응답과 함께 가격 및 결제 방법을 알려주는 `WWW-Authenticate: Payment` challenge를 반환합니다. 클라이언트가 결제에 서명한 뒤 `Authorization: Payment` credential을 포함해 요청을 재시도하면, 결제가 온체인에서 정산되는 즉시 결과를 받게 됩니다.

따라서 사전에 provisioned된 credential 없이 자율적으로 web search 비용을 지불해야 하는 **AI agents**에 특히 적합합니다.

<Info>
  MPP와 API key 접근 방식은 서로 독립적입니다. 요청에 `x-api-key` header가 포함되어 있으면 일반적인 API key billing 흐름이 적용되고 MPP는 완전히 우회됩니다.
</Info>

<div id="supported-endpoints">
  ## 지원되는 endpoint
</div>

| Endpoint    | 메서드  | 설명                                                                                                |
| ----------- | ---- | ------------------------------------------------------------------------------------------------- |
| `/search`   | POST | 모든 search type(`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`)을 지원하는 web search |
| `/contents` | POST | URL 또는 문서 ID 기반 콘텐츠 조회                                                                            |

다른 Exa endpoint는 *아직* MPP payment를 지원하지 않습니다.

<div id="get-started">
  ## 시작하기
</div>

USDC.e가 충전된 Tempo 호환 wallet이 필요합니다. 예제를 실행하기 전에 wallet의 private key를 내보내세요:

```bash theme={null}
export WALLET_PRIVATE_KEY="0x..."
```

<div id="install-the-client">
  ### 클라이언트 설치
</div>

<CodeGroup>
  ```bash TypeScript theme={null}
  npm install mppx viem
  ```

  ```bash Python theme={null}
  pip install "pympp[tempo]"
  ```
</CodeGroup>

<div id="make-a-paid-search-request">
  ### 유료 search request 보내기
</div>

MPP 클라이언트로 search request에 대한 payment에 서명하고 제출합니다:

<CodeGroup>
  ```typescript TypeScript theme={null}
  import { Mppx, tempo } from "mppx/client";
  import { privateKeyToAccount } from "viem/accounts";

  const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const mppx = Mppx.create({
    methods: [tempo.charge({ account })],
  });

  const response = await mppx.fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);
  console.log("Payment receipt:", response.headers.get("Payment-Receipt"));
  ```

  ```python Python theme={null}
  import asyncio
  import os

  from mpp.client import Client
  from mpp.methods.tempo import ChargeIntent, TempoAccount, tempo


  async def main() -> None:
      account = TempoAccount.from_key(os.environ["WALLET_PRIVATE_KEY"])
      method = tempo(
          account=account,
          chain_id=4217,
          intents={"charge": ChargeIntent()},
      )

      async with Client(methods=[method]) as client:
          response = await client.post(
              "https://api.exa.ai/search",
              json={"query": "best machine learning frameworks", "numResults": 5},
          )

      data = response.json()
      for result in data["results"]:
          print(result["url"], result["title"])
      print("Payment receipt:", response.headers.get("Payment-Receipt"))


  asyncio.run(main())
  ```
</CodeGroup>

실행이 성공하면 search 결과와 함께 온체인 트랜잭션 해시가 담긴 `Payment-Receipt` header가 출력됩니다.

<div id="pay-from-the-command-line">
  ## 명령줄에서 결제하기
</div>

private key를 직접 관리하고 싶지 않다면 대신 Tempo Wallet CLI를 사용하세요. `tempo wallet login`은 Tempo wallet을 생성하거나 연결하고, 로컬 액세스 key를 승인하며, 신규 가입자의 경우 무료 MPP Credits를 함께 제공할 수 있습니다.

<div id="install-and-authenticate">
  ### 설치 및 인증
</div>

```bash theme={null}
curl -fsSL https://tempo.xyz/install | bash
tempo add wallet
tempo add request
tempo wallet login
```

로컬 브라우저가 없는 원격 호스트에서는 `tempo wallet login --no-browser`를 실행한 뒤, 출력된 URL을 사용 중인 기기에서 열어 CLI에 권한을 부여하세요.

<div id="check-balances-and-credits">
  ### 잔액 및 credits 확인
</div>

```bash theme={null}
tempo wallet whoami
tempo wallet whoami --credits
```

<div id="make-a-paid-request">
  ### 유료 요청 보내기
</div>

```bash theme={null}
tempo request --max-spend 1.00 https://api.exa.ai/search \
  --json '{"query": "Series A fintech companies", "numResults": 5}'
```

`tempo request`는 `402 Payment Required` challenge를 가로채 결제를 처리한 뒤 자동으로 요청을 재시도합니다.

전체 CLI 레퍼런스는 [Tempo Wallet CLI 문서](https://tempo.xyz/developers/docs/cli/wallet)와 [`tempo request` 문서](https://tempo.xyz/developers/docs/cli/request)를 참고하세요.

<div id="gas-fees">
  ## 가스 수수료
</div>

Exa가 Tempo 네트워크 수수료를 대신 부담하며, USDC.e로 지불합니다. 사용자의 wallet에는 API 요금에 해당하는 USDC.e만 있으면 되고, pathUSD나 다른 가스 토큰 잔액은 필요하지 않습니다. 수수료 지불 주체(fee payer)를 별도로 설정할 필요도 없습니다. Exa의 payment challenge와 MPP SDK가 sponsorship을 자동으로 처리합니다.

<div id="pricing">
  ## 가격
</div>

MPP는 API key billing과 동일한 번들 가격 체계를 사용합니다. Exa는 요청을 처리하기 전에 요청 파라미터를 기준으로 가격을 계산합니다.

<div id="search">
  ### Search
</div>

| search type               | 최대 10개 결과 기준 가격 |
| ------------------------- | --------------- |
| `instant`, `auto`, `fast` | 요청당 $0.007      |
| `deep-lite`, `deep`       | 요청당 $0.012      |
| `deep-reasoning`          | 요청당 $0.015      |

`contents.summary`를 추가하면 **결과당 $0.001**이 추가됩니다.

<Warning>
  MPP search request는 결과 10개로 제한됩니다. `numResults`가 10보다 크면 Exa는 10으로 처리하고 결과 10개 기준으로 요금을 부과합니다. 더 많은 결과가 필요하면 [API key billing](/ko/docs/search/quickstart)을 사용하세요.
</Warning>

<div id="contents">
  ### Contents
</div>

요청한 콘텐츠 유형마다 URL당 $0.001의 비용이 발생합니다:

| 콘텐츠 유형       | URL당 가격 |
| ------------ | ------- |
| `text`       | $0.001  |
| `highlights` | $0.001  |
| `summary`    | $0.001  |

`text`, `highlights`, `summary` 중 아무것도 요청하지 않으면 Exa가 기본적으로 `text`를 활성화합니다.

<div id="pricing-examples">
  ### 가격 예시
</div>

| 요청                                         | 가격     |
| ------------------------------------------ | ------ |
| `type: "auto"`로 호출한 `/search`              | $0.007 |
| 결과 3개와 `contents.summary`를 포함한 `/search`   | $0.010 |
| `type: "deep"`으로 호출한 `/search`             | $0.012 |
| URL 2개에 `text: true`로 호출한 `/contents`      | $0.002 |
| URL 1개에 `text`와 `summary`로 호출한 `/contents` | $0.002 |

<div id="how-the-payment-flow-works">
  ## payment flow 작동 방식
</div>

SDK가 이 흐름을 자동으로 처리하지만, HTTP 수준에서 직접 확인할 수도 있습니다:

1. API key나 payment credential 없이 요청을 보냅니다. 그러면 Exa는 가격, 토큰, 수신자, 네트워크, sponsorship 정보가 담긴 `WWW-Authenticate: Payment` challenge와 함께 `402`를 반환합니다.
2. challenge에 서명한 후 `Authorization: Payment <credential>`을 담아 다시 요청합니다.
3. Exa는 payment를 settlement하면서 요청을 처리합니다. settlement가 확인되면 `Payment-Receipt` header와 함께 결과를 반환합니다. settlement에 실패하면 결과 없이 새로운 challenge가 담긴 `402`를 반환합니다.

<div id="inspect-a-payment-challenge">
  ### payment challenge 확인하기
</div>

wallet 없이도 가격과 payment 세부 정보를 확인할 수 있습니다:

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "numResults": 3}'
```

`402` 응답에서 `WWW-Authenticate: Payment` header를 확인하세요. unpaid discovery requests에는 rate limit이 적용되므로, 폴링 목적이 아니라 디버깅 목적으로만 사용하세요.

<div id="payment-reference">
  ## 결제 레퍼런스
</div>

Exa는 Tempo mainnet에서 USDC.e로 MPP 결제를 받습니다.

| 네트워크          | 식별자           | 토큰     | 자산                                           |
| ------------- | ------------- | ------ | -------------------------------------------- |
| Tempo mainnet | `eip155:4217` | USDC.e | `0x20c000000000000000000000b9537d11c60e8b50` |

USDC.e는 소수점 6자리를 사용합니다. challenge는 가격을 원자 단위로 표현하므로 `7000`은 $0.007, `1000000`은 $1.00입니다.

<Note>
  Exa는 동일한 endpoint에서 MPP와 [x402](/ko/docs/integrations/payments/x402/quickstart)를 함께 지원합니다. 인증되지 않은 `402` 응답에는 MPP의 `WWW-Authenticate: Payment` challenge와 x402의 `PAYMENT-REQUIRED` header가 모두 포함될 수 있습니다. 클라이언트가 지원하는 결제 프로토콜에 맞는 header를 사용하세요.
</Note>

<div id="headers">
  ### Header
</div>

| Header                                | 방향       | 설명                                  |
| ------------------------------------- | -------- | ----------------------------------- |
| `Authorization: Payment <credential>` | 요청       | MPP payment credential              |
| `WWW-Authenticate: Payment`           | `402` 응답 | 해당 요청의 가격 및 payment 안내              |
| `Payment-Receipt`                     | 성공 응답    | 온체인 트랜잭션 해시를 포함한 settlement receipt |

<div id="errors">
  ### 오류
</div>

| 상태    | 설명                                                          |
| ----- | ----------------------------------------------------------- |
| `402` | payment credential이 없거나 유효하지 않습니다. 응답에 새로운 challenge가 포함됩니다 |
| `402` | 결제 금액이 요청 가격과 일치하지 않거나 settlement에 실패했습니다                   |
| `429` | 해당 IP에서 unpaid discovery requests를 너무 많이 전송했습니다             |
| `429` | 해당 wallet이 유료 요청 rate limit을 초과했습니다                         |

<div id="rate-limits">
  ### Rate limits
</div>

MPP rate limits는 x402와 공유되며, API key limits와는 별개입니다:

| Limit                         | 임계값    | 기간  |
| ----------------------------- | ------ | --- |
| IP당 unpaid discovery requests | 5회 요청  | 60초 |
| wallet당 유료 요청                 | 10회 요청 | 1초  |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="MPP와 API key를 함께 사용할 수 있나요?">
    요청에 `x-api-key` header가 포함되어 있으면 API key 방식이 우선 적용되고 MPP는 건너뜁니다. 두 방식은 중첩되지 않으며, 요청당 둘 중 하나만 사용됩니다.
  </Accordion>

  <Accordion title="요청이 처리된 후 settlement에 실패하면 어떻게 되나요?">
    응답이 차단됩니다. 클라이언트가 재시도할 수 있도록 새로운 `WWW-Authenticate: Payment` challenge와 함께 `402`가 반환됩니다. settlement이 성공하기 전까지는 결과가 반환되지 않습니다.
  </Accordion>

  <Accordion title="어떤 wallet이 지원되나요?">
    클라이언트 SDK로 서명할 수 있는 Tempo 호환 EVM wallet이면 모두 지원됩니다 — `mppx`(TypeScript)의 `viem` 계정 또는 `pympp`(Python)의 `eth-account` key가 이에 해당합니다. AI agent의 경우, 요청 비용을 충당할 수 있도록 Tempo에 USDC.e 잔액이 있는 wallet을 사용하세요.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

* [MPP 프로토콜 문서](https://mpp.dev/protocol): 프로토콜 세부 사항 및 인증 형식
* [mppx 문서](https://mpp.dev/sdk/typescript): MPP TypeScript SDK reference
* [pympp 문서](https://mpp.dev/sdk/python): MPP Python SDK reference
* [Tempo](https://tempo.xyz): Tempo 네트워크 문서
* [x402로 결제하기](/ko/docs/integrations/payments/x402/quickstart): 동일한 endpoint를 x402로 결제하기
* [Exa Search API 가이드](/ko/docs/search/quickstart): search 매개변수 전체 레퍼런스
* [Exa Contents API 가이드](/ko/docs/contents/quickstart): contents 매개변수 전체 레퍼런스