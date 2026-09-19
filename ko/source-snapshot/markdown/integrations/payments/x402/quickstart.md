> <div id="documentation-index">
  > ## 문서 색인
> </div>
>
> 전체 문서 색인은 https://exa.ai/docs/llms.txt 에서 가져올 수 있습니다.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="pay-with-x402">
  # x402로 결제하기
</div>

> API key 없이 Exa의 Search 및 Contents API를 사용하세요. x402 프로토콜을 통해 Base 또는 Solana의 USDC로 요청 단위로 결제합니다.

<div id="what-is-x402">
  ## x402란?
</div>

[x402](https://x402.org)는 HTTP `402 Payment Required` 상태 코드를 기반으로 하는 개방형 결제 표준입니다. 클라이언트는 계정, API key, 구독 없이도 Base 또는 Solana의 USDC 스테이블코인으로 요청 단위로 API 이용료를 지불할 수 있습니다.

Exa는 **`/search`**와 **`/contents`** 두 endpoint에서 x402를 지원합니다. API key나 결제 header 없이 요청을 보내면 Exa는 `402` 응답과 함께 가격 정보 및 지원되는 결제 네트워크가 담긴 `PAYMENT-REQUIRED` header를 반환합니다. 클라이언트는 USDC 결제에 서명한 뒤 `PAYMENT-SIGNATURE` header를 포함해 요청을 재시도하고, 온체인에서 settlement가 확인되면 결과를 받습니다.

미리 provisioned된 credential 없이 자율적으로 web search 비용을 지불해야 하는 **AI agents**에 특히 적합한 방식입니다.

<Info>
  x402와 API key 접근 방식은 서로 독립적입니다. 요청에 `x-api-key` 또는 `Authorization: Bearer` header가 포함되어 있으면 일반적인 API key billing 흐름이 적용되고 x402는 전혀 사용되지 않습니다.
</Info>

<div id="supported-endpoints">
  ## 지원되는 endpoint
</div>

| Endpoint    | 메서드  | 설명                                                                                                |
| ----------- | ---- | ------------------------------------------------------------------------------------------------- |
| `/search`   | POST | 모든 search type(`instant`, `auto`, `fast`, `deep`, `deep-lite`, `deep-reasoning`)을 지원하는 web search |
| `/contents` | POST | URL 또는 문서 ID 기반 콘텐츠 retrieval                                                                     |

그 외 모든 endpoint는 x402로 사용할 수 **없습니다**.

<div id="how-it-works">
  ## 작동 방식
</div>

<Frame>
  <img src="https://mintcdn.com/exa-52/Una64IRjof2yadw_/images/integrations/payments/x402/payment-flow.png?fit=max&auto=format&n=Una64IRjof2yadw_&q=85&s=5a560d80bb84828e03dfacd61351e9fb" alt="x402 payment flow 시퀀스 다이어그램: 클라이언트가 서버에 요청을 보내면 PAYMENT-REQUIRED header와 함께 402가 반환되고, 클라이언트는 payment payload를 생성해 PAYMENT-SIGNATURE와 함께 재시도합니다. 서버는 facilitator를 통해 이를 검증하고 작업을 수행한 뒤 온체인에서 정산하며, 결과와 PAYMENT-RESPONSE를 담아 200을 반환합니다" width="4224" height="2720" data-path="images/integrations/payments/x402/payment-flow.png" />
</Frame>

<div id="step-1-discovery">
  ### 1단계: 디스커버리
</div>

지원되는 endpoint에 API key나 payment header 없이 요청을 보냅니다:

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "best machine learning frameworks", "numResults": 5}'
```

base64로 인코딩된 `PAYMENT-REQUIRED` header가 포함된 `402` 응답을 받게 됩니다. 디코딩하면 다음과 같습니다:

```json theme={null}
{
  "x402Version": 2,
  "resource": {
    "url": "https://api.exa.ai/search",
    "description": "Exa /search endpoint"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:8453",
      "amount": "7000",
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "payTo": "0x...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2" }
    },
    {
      "scheme": "exact",
      "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
      "amount": "7000",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "payTo": "...",
      "maxTimeoutSeconds": 60,
      "extra": { "name": "USD Coin", "version": "2", "feePayer": "..." }
    }
  ]
}
```

`amount`는 USDC 원자 단위(소수점 6자리) 기준이므로 `"7000"`은 $0.007입니다.
클라이언트는 자신이 지원하는 `accepts` 항목 중 어느 것으로든 결제할 수 있습니다. Solana 항목에는 `extra.feePayer`와 같이 facilitator가 제공하는 필드가 포함됩니다. payment를 구성할 때는 `PAYMENT-REQUIRED` header에 명시된 항목을 그대로 사용하세요.

<div id="step-2-pay-and-retry">
  ### 2단계: 결제 후 재시도
</div>

wallet으로 payment에 서명한 뒤, base64로 인코딩된 payment payload를 담은 `PAYMENT-SIGNATURE` header와 함께 요청을 다시 전송하세요. x402 클라이언트 SDK는 이 과정을 자동으로 처리합니다.

<div id="step-3-settlement">
  ### 3단계: Settlement
</div>

Exa는 facilitator를 통해 결제 signature를 검증한 뒤, 요청 처리와 **동시에** 온체인 settlement를 시작합니다. 응답은 settlement가 확인될 때까지 보류됩니다. 성공하면 다음을 받게 됩니다:

* 결과가 담긴 HTTP `200`
* settlement receipt(base64로 인코딩)가 담긴 `PAYMENT-RESPONSE` header(온체인 트랜잭션 해시 포함)

settlement가 실패하면 `402`와 함께 `PAYMENT-RESPONSE`(오류 상세 정보)와 `PAYMENT-REQUIRED`(재시도용)를 모두 받게 됩니다.

<div id="pricing">
  ## 가격
</div>

x402는 API key 빌링과 동일한 번들 가격 체계를 사용합니다. 가격은 실제로 반환된 결과가 아니라 요청 매개변수를 기준으로 사전에 계산됩니다.

<div id="search-search">
  ### Search (`/search`)
</div>

| Search type               | 기본 가격 (결과 10개까지) | 10개 초과분 결과당     |
| ------------------------- | ---------------- | --------------- |
| `instant`, `auto`, `fast` | $0.007 / 요청      | 해당 없음 (10개로 제한) |
| `deep-lite`               | $0.012 / 요청      | 해당 없음 (10개로 제한) |
| `deep`                    | $0.012 / 요청      | 해당 없음 (10개로 제한) |
| `deep-reasoning`          | $0.015 / 요청      | 해당 없음 (10개로 제한) |

`contents.summary`를 추가하면 **결과당 $0.001**이 추가로 부과됩니다.

<Warning>
  x402 요청은 **최대 10개 결과**로 제한됩니다. 10개를 초과해 요청하면 `numResults`가 별도 알림 없이 10으로 조정되며, 가격도 결과 10개 기준으로 책정됩니다.
</Warning>

<div id="contents-contents">
  ### Contents (`/contents`)
</div>

각 콘텐츠 유형은 페이지/URL 단위로 과금됩니다:

| 콘텐츠 유형       | 페이지당 가격 |
| ------------ | ------- |
| `text`       | $0.001  |
| `highlights` | $0.001  |
| `summary`    | $0.001  |

콘텐츠 유형을 하나도 요청하지 않으면(`text`, `highlights`, `summary` 중 아무것도 지정하지 않으면) 기본적으로 `text`가 활성화됩니다.

<div id="examples">
  ### 예시
</div>

| 요청                                         | 가격     | USDC 최소 단위 |
| ------------------------------------------ | ------ | ---------- |
| `/search`, 결과 10개, `type: "auto"`          | $0.007 | 7000       |
| `/search`, 결과 5개, `type: "fast"`           | $0.007 | 7000       |
| `/search`, 결과 3개 + summary, `type: "auto"` | $0.010 | 10000      |
| `/search`, 결과 10개, `type: "deep-lite"`     | $0.012 | 12000      |
| `/search`, 결과 10개, `type: "deep"`          | $0.012 | 12000      |
| `/contents`, URL 2개, `text: true`          | $0.002 | 2000       |
| `/contents`, URL 1개, `text` + `summary`    | $0.002 | 2000       |

<div id="quickstart">
  ## 빠른 시작
</div>

<div id="install-dependencies">
  ### 의존성 설치
</div>

<CodeGroup>
  ```bash JavaScript theme={null}
  npm install @x402/fetch @x402/core @x402/evm viem
  # Solana를 지원하려면 다음도 함께 설치하세요:
  npm install @x402/svm @solana/kit @scure/base
  ```

  ```bash Python theme={null}
  pip install "x402[requests,evm]"
  # Solana를 지원하려면 다음도 함께 설치하세요:
  pip install "x402[svm]" "solana<0.40"
  ```
</CodeGroup>

<Note>
  cURL은 별도로 설치할 것이 없지만, 402 challenge와 payment 서명을 직접 처리해야 합니다. 프로덕션 환경에서는 SDK 방식을 권장합니다.
</Note>

<Tip>
  private key를 직접 관리하고 싶지 않으신가요? [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management)는 AI agents를 위한 TEE 격리 키 관리 기능을 제공합니다. agent가 private key를 직접 보는 일은 없습니다. 이 wallet은 viem과 호환되므로 `@x402/fetch`에서 바로 사용할 수 있습니다.
</Tip>

<div id="make-a-paid-search-request">
  ### 유료 search request 보내기
</div>

<CodeGroup>
  ```typescript JavaScript theme={null}
  import { wrapFetchWithPayment } from "@x402/fetch";
  import { x402Client, x402HTTPClient } from "@x402/core/client";
  import { ExactEvmScheme } from "@x402/evm/exact/client";
  // Solana를 지원하려면 다음도 import하세요:
  // import { ExactSvmScheme } from "@x402/svm/exact/client";
  import { privateKeyToAccount } from "viem/accounts";

  const signer = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);
  const client = new x402Client();
  client.register("eip155:*", new ExactEvmScheme(signer));
  // 클라이언트가 `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` 같은 Solana accept
  // 항목을 사용하도록 하려면 Solana 서명자도 등록하세요:
  // client.register("solana:*", new ExactSvmScheme(svmSigner));
  const fetchWithPayment = wrapFetchWithPayment(fetch, client);

  const response = await fetchWithPayment("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "best machine learning frameworks",
      numResults: 5,
    }),
  });

  const data = await response.json();
  console.log(data.results);

  // settlement receipt 확인
  const httpClient = new x402HTTPClient(client);
  const receipt = httpClient.getPaymentSettleResponse(
    (name) => response.headers.get(name)
  );
  console.log("Transaction:", receipt?.transaction);
  ```

  ```python Python theme={null}
  import os
  import requests
  from eth_account import Account
  from x402 import x402ClientSync
  from x402.http.clients import wrapRequestsWithPayment
  from x402.mechanisms.evm.exact import register_exact_evm_client
  from x402.mechanisms.evm.signers import EthAccountSigner

  account = Account.from_key(os.environ["WALLET_PRIVATE_KEY"])
  client = x402ClientSync()
  register_exact_evm_client(
      client,
      EthAccountSigner(account),
      networks="eip155:*",
  )
  session = wrapRequestsWithPayment(requests.Session(), client)

  response = session.post("https://api.exa.ai/search", json={
      "query": "best machine learning frameworks",
      "numResults": 5,
  })

  data = response.json()
  for result in data["results"]:
      print(result["url"], result["title"])
  print("Payment response:", response.headers.get("PAYMENT-RESPONSE"))
  ```

  ```bash cURL theme={null}
  # 1단계: 디스커버리, 가격 정보 가져오기
  curl -s -o /dev/null -w "%{http_code}" -D - \
    -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # base64로 인코딩된 가격 정보가 담긴 PAYMENT-REQUIRED header와 함께 402를 반환합니다

  # 2단계: wallet으로 payment에 서명합니다 (이 작업에는 SDK를 사용하세요)
  # 3단계: 결제 signature를 포함해 재시도합니다
  curl -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -H "PAYMENT-SIGNATURE: <base64-encoded-payment>" \
    -d '{"query": "best machine learning frameworks", "numResults": 5}'
  # 결과와 PAYMENT-RESPONSE header(settlement receipt)와 함께 200을 반환합니다
  ```
</CodeGroup>

<Info>
  cURL을 사용할 경우 payment에 직접 서명해야 합니다. 프로덕션에서는 402 &gt; 서명 &gt; 재시도 흐름 전체를 자동으로 처리해 주는 JavaScript 또는 Python SDK를 사용하세요.
</Info>

<div id="discovery-mode-no-wallet-needed">
  ### 디스커버리 모드 (wallet 불필요)
</div>

인증 없는 요청을 보내 wallet 없이도 가격을 확인할 수 있습니다:

<CodeGroup>
  ```typescript JavaScript theme={null}
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "test query", numResults: 3 }),
  });

  // res.status === 402
  const paymentRequired = JSON.parse(
    atob(res.headers.get("PAYMENT-REQUIRED")!)
  );
  console.log(
    paymentRequired.accepts.map(({ network, amount }) => ({
      network,
      amount,
    }))
  );
  ```

  ```python Python theme={null}
  import base64, json, requests

  res = requests.post("https://api.exa.ai/search", json={
      "query": "test query",
      "numResults": 3,
  })

  # res.status_code == 402
  pricing = json.loads(base64.b64decode(res.headers["PAYMENT-REQUIRED"]))
  print([(accept["network"], accept["amount"]) for accept in pricing["accepts"]])
  ```

  ```bash cURL theme={null}
  curl -s -D - -X POST "https://api.exa.ai/search" \
    -H "Content-Type: application/json" \
    -d '{"query": "test query", "numResults": 3}'
  # 402 응답에서 PAYMENT-REQUIRED header를 확인하세요
  # 디코딩: echo "<header-value>" | base64 -d
  ```
</CodeGroup>

<div id="payment-networks">
  ## 결제 네트워크
</div>

Exa는 현재 지원하는 모든 네트워크를 `accepts` 배열에 공개합니다. 사용 중인 wallet과 등록된 x402 클라이언트 스킴에 맞는 항목을 선택하세요.

| 네트워크               | 식별자                                       | 토큰   | 자산                                             |
| ------------------ | ----------------------------------------- | ---- | ---------------------------------------------- |
| Base (Ethereum L2) | `eip155:8453`                             | USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`   |
| Solana mainnet     | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |

두 네트워크 모두 소수점 6자리 USDC(`1000000` = $1.00)를 사용하며, x402 facilitator를 통해 온체인에서 정산됩니다.

<div id="rate-limits">
  ## Rate limits
</div>

x402는 API key limits와 별개로 자체 rate limit을 적용합니다:

| Limit                           | 임계값       | 기간  |
| ------------------------------- | --------- | --- |
| Unpaid discovery requests (IP당) | 5회 요청     | 60초 |
| 유료 요청 (wallet당)                 | 초당 10회 요청 | 1초  |

동일 IP에서 60초 이내에 인증되지 않은 `402` discovery requests를 5회 초과해 보내면 이후 요청은 `429 Too Many Requests`를 반환합니다. 유료 요청이 성공하면 카운터가 감소합니다.

wallet당 QPS는 동일한 wallet 주소에서 발생하는 모든 유료 요청을 합산해 적용됩니다.

<div id="headers-reference">
  ## header 레퍼런스
</div>

<div id="request-headers">
  ### 요청 header
</div>

| Header              | 설명                                     |
| ------------------- | -------------------------------------- |
| `PAYMENT-SIGNATURE` | Base64로 인코딩된 payment payload (x402 v2) |
| `payment-signature` | 별칭(동일하게 허용됨)                           |
| `x-payment`         | 레거시 별칭(v1 호환용)                         |

<div id="response-headers">
  ### 응답 header
</div>

| Header             | 적용 시점                         | 설명                                                     |
| ------------------ | ----------------------------- | ------------------------------------------------------ |
| `PAYMENT-REQUIRED` | `402` 응답                      | 가격 정보와 payment 안내가 포함된 Base64 인코딩 `PaymentRequired` 객체 |
| `PAYMENT-RESPONSE` | `200` 또는 `402` (payment 시도 후) | 트랜잭션 해시 또는 오류가 포함된 Base64 인코딩 settlement 결과            |

<div id="error-codes">
  ## 오류 코드
</div>

| 상태    | 태그                         | 설명                                                      |
| ----- | -------------------------- | ------------------------------------------------------- |
| `402` | `X402_PAYMENT_REQUIRED`    | 결제가 제공되지 않았습니다. `PAYMENT-REQUIRED` header에 가격 정보가 포함됩니다 |
| `402` | `X402_VERIFICATION_FAILED` | 결제 signature가 facilitator 검증을 통과하지 못했습니다                |
| `400` | `X402_INVALID_SIGNATURE`   | 형식이 잘못되었거나 파싱할 수 없는 결제 signature                        |
| `429` | `X402_TOO_MANY_UNPAID`     | 해당 IP에서 발생한 미결제 discovery 요청이 너무 많습니다                   |
| `429` | `X402_WALLET_RATE_LIMITED` | wallet이 초당 요청 10회를 초과했습니다                               |
| `500` | `X402_INTERNAL_ERROR`      | 결제 요구 사항 생성 중 발생한 서버 측 오류                               |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="x402와 API key를 함께 사용할 수 있나요?">
    요청에 `x-api-key` header 또는 `Authorization: Bearer` 토큰이 포함되어 있으면 API key 방식이 우선 적용되고 x402는 건너뜁니다. 두 방식은 함께 적용되지 않으며, 요청당 둘 중 하나만 사용됩니다.
  </Accordion>

  <Accordion title="요청이 처리된 후 settlement가 실패하면 어떻게 되나요?">
    응답이 차단됩니다. `PAYMENT-RESPONSE`(오류 내용 포함)와 `PAYMENT-REQUIRED`(클라이언트가 재시도할 수 있도록)가 모두 담긴 `402` 응답을 받게 됩니다. settlement가 성공하기 전까지는 결과가 반환되지 않습니다.
  </Accordion>

  <Accordion title="numResults가 10개로 제한되는 이유는 무엇인가요?">
    x402 요청은 search당 결과가 최대 10개로 제한됩니다. 더 많은 결과가 필요하다면 유료 플랜에서 API key 방식을 사용하세요.
  </Accordion>

  <Accordion title="어떤 wallet이 지원되나요?">
    Base에서 EIP-712 타입 데이터에 서명할 수 있는 모든 EVM 호환 wallet, 또는 `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`에 대해 x402 SVM 클라이언트가 지원하는 Solana wallet을 사용할 수 있습니다. x402 SDK는 `viem`, `ethers`, Coinbase Wallet 서명자, Solana SVM 서명자를 지원합니다. EVM 기반 AI agent의 경우 [Coinbase Agentic Wallets](https://docs.cdp.coinbase.com/agent-kit/core-concepts/wallet-management)가 TEE로 격리된 key 관리를 제공하므로, agent가 원시 private key를 직접 다룰 일이 없습니다.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

* [x402 프로토콜 문서](https://docs.x402.org): 전체 프로토콜 사양
* [x402 GitHub](https://github.com/coinbase/x402): 오픈소스 SDK 및 예제
* [npm의 @x402/fetch](https://www.npmjs.com/package/@x402/fetch): 자동 결제 처리를 위한 fetch 래퍼
* [npm의 @x402/svm](https://www.npmjs.com/package/@x402/svm): Solana/SVM exact 결제 지원
* [Exa Search API 가이드](/ko/docs/search/quickstart): 전체 search 파라미터 레퍼런스
* [Exa Contents API 가이드](/ko/docs/contents/quickstart): 전체 contents 파라미터 레퍼런스