> <div id="documentation-index">
  > ## 문서 인덱스
> </div>
>
> 전체 문서 인덱스는 https://exa.ai/docs/llms.txt 에서 가져오세요.
> 더 살펴보기 전에 이 파일로 사용 가능한 모든 페이지를 확인하세요.

<div id="world-agentkit">
  # World AgentKit
</div>

> World AgentKit를 사용하면 verified human이 보증하는 AI agent가 USDC 없이 무료로 Exa를 이용할 수 있습니다.

<div id="what-is-agentkit">
  ## AgentKit이란?
</div>

[World AgentKit](https://docs.world.org/agents/agent-kit)은 AI agent가 [World ID](https://world.org)를 통해 실재하는 verified human이 뒷받침하고 있음을 증명할 수 있게 해주는 툴킷입니다. [x402](/ko/docs/integrations/payments/x402/quickstart)와 연동하면 **무료 체험** 경로를 사용할 수 있습니다. World의 [AgentBook](https://docs.world.org/agents/agent-kit/integrate)에 등록된 agent는 USDC를 지불하지 않고도 Exa의 `/search` 및 `/contents` 엔드포인트를 이용할 수 있습니다.

이는 표준 x402 결제 흐름과 함께 동작합니다. 각 verified human은 자신이 뒷받침하는 모든 agent를 통틀어 **월 100회의 무료 요청**을 사용할 수 있습니다. 이를 모두 소진하면 agent는 일반 USDC 결제 경로로 전환됩니다. 카운터는 매월 1일(UTC)에 초기화됩니다.

<Info>
  요청에 `x-api-key` 또는 `Authorization: Bearer` header가 포함되어 있으면 AgentKit 무료 체험과 x402 결제는 모두 적용되지 않습니다. 일반 API 키 청구 흐름이 우선합니다.
</Info>

<div id="how-it-works">
  ## 동작 방식
</div>

client가 API 키 없이 `/search` 또는 `/contents`를 호출하면 Exa는 `402 Payment Required`를 반환합니다. 이 response의 `PAYMENT-REQUIRED` header에는 [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md)(Sign-In with Ethereum) challenge를 담은 `agentkit` 확장이 포함됩니다.

agent가 등록된 wallet으로 이 challenge에 서명하면, Exa는 다음을 검증합니다:

1. **Signature 확인** — wallet 주소를 기준으로 SIWE signature를 검증합니다(EIP-191 기반 EOA와 ERC-1271 기반 smart contract wallets 모두 지원)
2. **AgentBook 조회** — World Chain(`eip155:480`)의 AgentBook 컨트랙트로 wallet을 익명 `humanId`로 확인하여, 고유한 verified human이 이 agent에 자신의 신원을 위임했음을 검증합니다
3. **사용량 확인** — 해당 사용자에게 무료 체험 uses가 남아 있으면 접근을 허용하고, 남아 있지 않으면 USDC 결제를 요구합니다

<div id="quickstart">
  ## Quickstart
</div>

<div id="1-register-your-agent-in-agentbook">
  ### 1. AgentBook에 agent 등록하기
</div>

최초 1회만 설정하면 됩니다. 신원 인증이 완료된 [World App](https://world.org/download)이 필요합니다.

```bash theme={null}
npx @worldcoin/agentkit-cli register <your-agent-wallet-address>
```

CLI가 World App verification flow를 시작한 뒤, World Chain에 registration 트랜잭션을 제출합니다. 완료되면 AgentKit을 사용하는 모든 서버가 여러분의 wallet을 조회해 실제 사람이 backed하고 있는지 확인할 수 있습니다.

<div id="2-send-a-request-get-the-challenge">
  ### 2. 요청 보내기 (challenge 받기)
</div>

```bash theme={null}
curl -s -D - -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

`402` response에는 디코딩된 `PAYMENT-REQUIRED` payload 안에 `agentkit` 확장이 포함됩니다:

```json theme={null}
{
  "x402Version": 2,
  "accepts": [ ... ],
  "extensions": {
    "agentkit": {
      "info": {
        "version": "1",
        "statement": "Verify your agent is backed by a real human to access Exa",
        "domain": "api.exa.ai",
        "uri": "https://api.exa.ai/search",
        "nonce": "abc123...",
        "issuedAt": "2026-04-11T01:30:00.000Z",
        "resources": ["https://api.exa.ai/search"]
      },
      "supportedChains": [
        { "chainId": "eip155:480", "type": "eip191" },
        { "chainId": "eip155:480", "type": "eip1271" }
      ],
      "schema": { ... },
      "_options": {
        "statement": "Verify your agent is backed by a real human to access Exa",
        "mode": { "type": "free-trial", "uses": 100 },
        "network": "eip155:480"
      }
    }
  }
}
```

<div id="3-sign-the-challenge-and-resubmit">
  ### 3. challenge 서명 후 재전송
</div>

`info` field(domain, uri, nonce, statement 등)를 사용해 [SIWE 메시지](https://eips.ethereum.org/EIPS/eip-4361)를 구성하고, `supportedChains` 타입 중 하나로 등록된 agent wallet을 사용해 서명한 뒤, `agentkit` header에 담아(base64로 인코딩된 JSON) 전송하세요:

```bash theme={null}
curl -X POST "https://api.exa.ai/search" \
  -H "Content-Type: application/json" \
  -H "agentkit: <base64-encoded-signed-challenge>" \
  -d '{"query": "fusion energy breakthroughs", "numResults": 5}'
```

agent이 검증되었고 무료 체험 사용 횟수가 남아 있으면, Exa는 `200`과 함께 검색 결과를 반환하며 결제가 필요하지 않습니다.

<div id="using-the-agentkit-x402-skill">
  ### AgentKit x402 skill 사용하기
</div>

challenge-response flow를 직접 구현하는 대신, AI agent에 [agentkit-x402 skill](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md)을 추가하세요:

```bash theme={null}
npx skills add worldcoin/agentkit agentkit-x402
```

이 skill은 agent가 AgentKit 확장이 포함된 `402` response를 받았을 때 전체 흐름을 자동으로 처리합니다.

<div id="free-trial-details">
  ## 무료 체험 세부 사항
</div>

* 각 verified human은 자신이 backing하는 모든 agent를 합쳐 **월 100회의 무료 요청**을 제공받습니다
* 사용량 카운터는 매월(UTC 기준) 1일에 초기화됩니다
* 사용량은 human별, 엔드포인트별로 집계됩니다(`/search`와 `/contents`는 따로 집계)
* 같은 human이 backing하는 agent가 두 개라면 카운터를 공유합니다
* 해당 월의 무료 체험 횟수를 모두 소진하면 agent는 표준 [x402 결제 흐름](/ko/docs/integrations/payments/x402/quickstart)으로 전환됩니다
* `/search`의 무료 체험 요청에도 동일한 [결과 10개 제한](/ko/docs/integrations/payments/x402/quickstart#pricing)이 적용됩니다
* 무료 체험 카운터는 현재 API response에 노출되지 않습니다. 사용 횟수를 모두 소진하면 서버는 무료 접근을 허용하지 않고 표준 `402`로 응답합니다

<div id="supported-endpoints">
  ## 지원 엔드포인트
</div>

| 엔드포인트       | x402 결제 | AgentKit 무료 체험 |
| ----------- | :-----: | :------------: |
| `/search`   |    지원   |       지원       |
| `/contents` |    지원   |       지원       |

그 외 Exa 엔드포인트는 x402 결제나 AgentKit 무료 체험을 지원하지 않습니다.

<div id="network-details">
  ## 네트워크 세부 정보
</div>

| 속성              | 값                                                 |
| --------------- | ------------------------------------------------- |
| AgentBook 체인    | World Chain                                       |
| 체인 ID (CAIP-2)  | `eip155:480`                                      |
| Verification    | World Chain의 AgentBook 컨트랙트                       |
| 지원 wallet types | EOA (EIP-191) 및 smart contract wallets (ERC-1271) |

<div id="faq">
  ## FAQ
</div>

<AccordionGroup>
  <Accordion title="x402 결제와 AgentKit을 함께 사용할 수 있나요?">
    네. `PAYMENT-REQUIRED` response에는 결제 가격과 AgentKit challenge가 모두 포함됩니다. client는 둘 중 원하는 경로를 선택할 수 있습니다. 무료 체험 uses를 모두 소진한 경우 agent는 USDC 결제로 전환할 수 있습니다.
  </Accordion>

  <Accordion title="agent가 AgentBook에 등록되어 있지 않으면 어떻게 되나요?">
    AgentKit verification이 별도 오류 없이 실패하고 해당 요청은 일반 `402`로 처리됩니다. 이 경우에도 agent는 일반 x402 flow를 통해 USDC로 결제할 수 있습니다.
  </Accordion>

  <Accordion title="같은 사람이 backed하는 두 agent는 각각 별도의 무료 체험 할당량을 받나요?">
    아닙니다. 사용량은 wallet 단위가 아니라 사람 단위(AgentBook의 익명 `humanId` 기준)로 추적됩니다. 동일한 World ID가 backed하는 두 agent는 같은 카운터를 공유합니다.
  </Accordion>

  <Accordion title="어떤 블록체인 네트워크가 사용되나요?">
    표준 x402 USDC 결제는 **Base**(`eip155:8453`) 또는 **Solana mainnet**(`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`)에서 정산할 수 있습니다. AgentKit verification은 AgentBook 조회를 위해 **World Chain**(`eip155:480`)을 사용합니다. 이 둘은 서로 독립적이며, AgentKit은 on-chain 결제를 요구하지 않습니다.
  </Accordion>

  <Accordion title="어떤 wallet types이 지원되나요?">
    EIP-191 signature를 사용하는 EOA(externally owned accounts)와 ERC-1271을 사용하는 smart contract wallets(예: Coinbase Smart Wallet, Safe)를 모두 지원합니다. 자세한 내용은 [World AgentKit SDK reference](https://docs.world.org/agents/agent-kit/sdk-reference)를 참고하세요.
  </Accordion>
</AccordionGroup>

<div id="resources">
  ## 리소스
</div>

* [x402 결제 가이드](/ko/docs/integrations/payments/x402/quickstart): 표준 USDC 결제 흐름
* [World AgentKit 문서](https://docs.world.org/agents/agent-kit): AgentKit 전체 문서
* [World AgentKit 연동 가이드](https://docs.world.org/agents/agent-kit/integrate): AgentBook 등록
* [World AgentKit SDK reference](https://docs.world.org/agents/agent-kit/sdk-reference): SDK API reference
* [AgentKit x402 skill](https://github.com/worldcoin/agentkit/blob/main/skills/agentkit-x402/SKILL.md): AI agent용 사전 제작 skill
* [x402 프로토콜 문서](https://docs.x402.org): x402 전체 명세